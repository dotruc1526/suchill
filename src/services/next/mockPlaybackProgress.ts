import type { EpisodeProgress, VideoProgress } from '../../types/v2/progress.ts'
import { failure, success, type ProgressService, type RecordStoryChoice, type StoryCheckpointContext } from './contracts.ts'
import type { MockCatalog } from './mock.ts'
import { copy, progressKey, type CheckpointRunner, type MockProgressStore } from './mockProgress.ts'
import { expectedMockSubject } from './mockAccountStore.ts'

function hasSubmittedChoice(store: MockProgressStore, userId: string, input: RecordStoryChoice): boolean {
  const choice = ['choice', input.lessonId, input.blockId, input.storyVersionId, input.sceneId, input.choiceId, false]
  for (const [key, operation] of store.operations) {
    try {
      const previous = JSON.parse(operation.signature) as unknown
      if (JSON.parse(key)[0] === userId && Array.isArray(previous) && choice.every((value, index) => previous[index] === value)) return true
    } catch { /* A malformed receipt cannot expose a never-submitted answer. */ }
  }
  return false
}

export function createPlaybackProgress(
  catalog: MockCatalog, session: { userId: string }, now: () => string, store: MockProgressStore,
  run: CheckpointRunner, touchLesson: (userId: string, lessonId: string, blockId: string) => unknown,
): Pick<ProgressService, 'getEpisodeProgress' | 'saveEpisodeCheckpoint' | 'recordChoice' | 'getVideoProgress' | 'saveVideoPosition'> {
  const storyFor = (input: StoryCheckpointContext) => {
    const lesson = catalog.lessons.find(item => item.id === input.lessonId && item.status === 'published')
    const block = lesson?.blocks.find(item => item.id === input.blockId)
    if (block?.kind !== 'visual_novel' || block.storyVersionId !== input.storyVersionId) return undefined
    return catalog.storyVersions.find(item => item.id === input.storyVersionId && item.status === 'published')
  }
  const saveEpisode = (userId: string, input: StoryCheckpointContext, sceneId: string, visited: string[], choiceId?: string) => {
    const key = progressKey(userId, input.storyVersionId)
    const prior = store.episodes.get(key)
    if (prior?.status === 'completed') return success(copy(prior))
    const next: EpisodeProgress = {
      userId, storyVersionId: input.storyVersionId, currentSceneId: sceneId,
      visitedSceneIds: [...new Set([...(prior?.visitedSceneIds ?? []), ...visited, sceneId])],
      lockedChoiceIds: [...new Set([...(prior?.lockedChoiceIds ?? []), ...(choiceId ? [choiceId] : [])])],
      status: 'in_progress',
      startedAt: prior?.startedAt ?? now(), completedAt: prior?.completedAt, updatedAt: now(),
      revision: (prior?.revision ?? 0) + 1,
    }
    store.episodes.set(key, next)
    touchLesson(userId, input.lessonId, input.blockId)
    return success(copy(next))
  }
  return {
    async getEpisodeProgress(storyVersionId) {
      if (!session.userId) return failure('unauthorized')
      return success(copy(store.episodes.get(progressKey(session.userId, storyVersionId)) ?? null))
    },
    async saveEpisodeCheckpoint(input) {
      const userId = session.userId
      if (!expectedMockSubject(input, userId)) return failure('unauthorized')
      const visited = [...new Set(input.visitedSceneIds)].sort()
      const signature = JSON.stringify(['episode', input.lessonId, input.blockId, input.storyVersionId, input.currentSceneId, visited, input.expectedRevision ?? null])
      return run(userId, input.operationId, signature, () => {
        const story = storyFor(input)
        if (!story) return failure('not_found')
        const sceneIds = new Set(story.scenes.map(scene => scene.id))
        if (!sceneIds.has(input.currentSceneId) || visited.some(id => !sceneIds.has(id))) return failure('validation')
        const prior = store.episodes.get(progressKey(userId, story.id))
        if (input.expectedRevision !== undefined && (!Number.isInteger(input.expectedRevision) || input.expectedRevision < 0)) return failure('validation')
        if (input.expectedRevision !== undefined && input.expectedRevision !== (prior?.revision ?? 0)) return failure('conflict')
        const current = story.scenes.find(scene => scene.id === (prior?.currentSceneId ?? story.startSceneId))!
        const next = current.kind !== 'choice' && current.kind !== 'end' ? current.nextSceneId : current.id
        // Client visitation arrays are hints, not authority to skip branches or knowledge checks.
        if (input.currentSceneId !== current.id && input.currentSceneId !== next) return failure('conflict')
        const confirmed = new Set([...(prior?.visitedSceneIds ?? []), current.id, input.currentSceneId])
        if (visited.some(id => !confirmed.has(id))) return failure('validation')
        return saveEpisode(userId, input, input.currentSceneId, visited)
      })
    },
    async recordChoice(input) {
      const userId = session.userId
      if (!expectedMockSubject(input, userId)) return failure('unauthorized')
      const signature = JSON.stringify(['choice', input.lessonId, input.blockId, input.storyVersionId, input.sceneId, input.choiceId, input.replay === true, input.expectedRevision ?? null])
      return run(userId, input.operationId, signature, () => {
        const story = storyFor(input)
        if (!story) return failure('not_found')
        const scene = story.scenes.find(item => item.id === input.sceneId)
        if (scene?.kind !== 'choice') return failure('validation')
        const choice = scene.choices.find(item => item.id === input.choiceId)
        if (!choice) return failure('validation')
        const prior = store.episodes.get(progressKey(userId, story.id))
        if (input.expectedRevision !== undefined && (!Number.isInteger(input.expectedRevision) || input.expectedRevision < 0)) return failure('validation')
        if (!input.replay && input.expectedRevision !== undefined && input.expectedRevision !== (prior?.revision ?? 0)) return failure('conflict')
        const choiceFeedback = choice.kind === 'knowledge_check'
          ? { choiceId: choice.id, outcome: choice.isCorrect ? 'correct' as const : 'incorrect' as const, message: choice.explanation }
          : { choiceId: choice.id, outcome: 'neutral' as const, message: choice.response ?? 'Lựa chọn đã được ghi nhận.' }
        if (input.replay) {
          const submitted = choice.kind === 'knowledge_check' ? hasSubmittedChoice(store, userId, input) : prior?.lockedChoiceIds.includes(choice.id)
          if (prior?.status !== 'completed' && !submitted) return failure('validation')
          const progress: EpisodeProgress = prior ?? { userId, storyVersionId: story.id, currentSceneId: story.startSceneId,
            visitedSceneIds: [], lockedChoiceIds: [], status: 'in_progress', startedAt: now(), updatedAt: now(), revision: 0 }
          return success({ ...copy(progress), choiceFeedback })
        }
        if (scene.choices.some(item => item.id !== choice.id && prior?.lockedChoiceIds.includes(item.id))) return failure('conflict')
        if ((prior?.currentSceneId ?? story.startSceneId) !== scene.id) return failure('conflict')
        // A failed retryable knowledge choice is an attempt, not a locked selection.
        const retry = choice.kind === 'knowledge_check' && !choice.isCorrect && scene.policy === 'retry_until_correct'
        const next = retry ? scene.id : choice.nextSceneId ?? scene.id
        if (!story.scenes.some(item => item.id === next)) return failure('validation')
        const result = saveEpisode(userId, input, next, [scene.id], retry ? undefined : choice.id)
        return result.ok ? success({ ...result.value, choiceFeedback }) : result
      })
    },
    async getVideoProgress(lessonId, blockId) {
      if (!session.userId) return failure('unauthorized')
      return success(copy(store.videos.get(progressKey(session.userId, lessonId, blockId)) ?? null))
    },
    async saveVideoPosition(input) {
      const userId = session.userId
      if (!expectedMockSubject(input, userId)) return failure('unauthorized')
      const ranges = input.watchedRanges.map(range => ({ start: range.start, end: range.end })).sort((a, b) => a.start - b.start || a.end - b.end)
      const signature = JSON.stringify(['video', input.lessonId, input.blockId, input.positionSeconds, ranges, input.expectedRevision ?? null])
      return run(userId, input.operationId, signature, () => {
        const lesson = catalog.lessons.find(item => item.id === input.lessonId && item.status === 'published')
        const block = lesson?.blocks.find(item => item.id === input.blockId)
        if (block?.kind !== 'video') return failure('not_found')
        const asset = catalog.mediaAssets.find(item => item.id === block.mediaAssetId && item.kind === 'video' && item.reviewStatus === 'published')
        if (!asset) return failure('not_found')
        const duration = asset.durationSeconds
        if (!Number.isFinite(duration) || !duration || duration <= 0 || !Number.isFinite(input.positionSeconds) || input.positionSeconds < 0 || input.positionSeconds > duration ||
          ranges.some(range => !Number.isFinite(range.start) || !Number.isFinite(range.end) || range.start < 0 || range.start >= range.end || range.end > duration)) return failure('validation')
        const key = progressKey(userId, input.lessonId, input.blockId)
        const prior = store.videos.get(key)
        if (input.expectedRevision !== undefined && (!Number.isInteger(input.expectedRevision) || input.expectedRevision < 0)) return failure('validation')
        if (input.expectedRevision !== undefined && input.expectedRevision !== (prior?.revision ?? 0)) return failure('conflict')
        if (prior?.completed) return success(copy(prior))
        const merged: VideoProgress['watchedRanges'] = []
        for (const range of [...(prior?.watchedRanges ?? []), ...ranges].sort((a, b) => a.start - b.start)) {
          const last = merged.at(-1)
          if (last && range.start <= last.end) last.end = Math.max(last.end, range.end)
          else merged.push({ ...range })
        }
        const next: VideoProgress = {
          userId, lessonId: input.lessonId, blockId: input.blockId, positionSeconds: input.positionSeconds,
          watchedRanges: merged, completed: prior?.completed ?? false, updatedAt: now(),
          revision: (prior?.revision ?? 0) + 1,
        }
        store.videos.set(key, next)
        touchLesson(userId, input.lessonId, input.blockId)
        return success(copy(next))
      })
    },
  }
}
