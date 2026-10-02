import { completionPolicy, evidenceKey } from './mockCompletionEvidence.ts'
import type { EpisodeProgress, VideoProgress } from '../../types/v2/progress.ts'
import { failure, success, type ProgressService, type StoryCheckpointContext } from './contracts.ts'
import type { MockCatalog } from './mock.ts'
import { copy, progressKey, type CheckpointRunner, type MockProgressStore } from './mockProgress.ts'

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
    const next: EpisodeProgress = {
      userId, storyVersionId: input.storyVersionId, currentSceneId: sceneId,
      visitedSceneIds: [...new Set([...(prior?.visitedSceneIds ?? []), ...visited, sceneId])],
      lockedChoiceIds: [...new Set([...(prior?.lockedChoiceIds ?? []), ...(choiceId ? [choiceId] : [])])],
      status: prior?.status === 'completed' ? 'completed' : 'in_progress',
      startedAt: prior?.startedAt ?? now(), completedAt: prior?.completedAt, updatedAt: now(),
    }
    store.episodes.set(key, next)
    const policy = completionPolicy(catalog, input.lessonId)
    if (policy) {
      const evidence = evidenceKey(userId, input.lessonId, policy.contentVersionId, input.blockId)
      store.completion.episodes.set(evidence, copy(next))
      if (choiceId) {
        const choices = store.completion.choices.get(evidence) ?? new Map<string, string>()
        choices.set(visited[0], choiceId)
        store.completion.choices.set(evidence, choices)
      }
    }
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
      const visited = [...new Set(input.visitedSceneIds)].sort()
      const signature = JSON.stringify(['episode', input.lessonId, input.blockId, input.storyVersionId, input.currentSceneId, visited])
      return run(userId, input.operationId, signature, () => {
        const story = storyFor(input)
        if (!story) return failure('not_found')
        const sceneIds = new Set(story.scenes.map(scene => scene.id))
        if (!sceneIds.has(input.currentSceneId) || visited.some(id => !sceneIds.has(id))) return failure('validation')
        return saveEpisode(userId, input, input.currentSceneId, visited)
      })
    },
    async recordChoice(input) {
      const userId = session.userId
      const signature = JSON.stringify(['choice', input.lessonId, input.blockId, input.storyVersionId, input.sceneId, input.choiceId])
      return run(userId, input.operationId, signature, () => {
        const story = storyFor(input)
        if (!story) return failure('not_found')
        const scene = story.scenes.find(item => item.id === input.sceneId)
        if (scene?.kind !== 'choice') return failure('validation')
        const choice = scene.choices.find(item => item.id === input.choiceId)
        if (!choice) return failure('validation')
        const prior = store.episodes.get(progressKey(userId, story.id))
        if (scene.choices.some(item => item.id !== choice.id && prior?.lockedChoiceIds.includes(item.id))) return failure('conflict')
        if ((prior?.currentSceneId ?? story.startSceneId) !== scene.id) return failure('conflict')
        // A failed retryable knowledge choice is an attempt, not a locked selection.
        const retry = choice.kind === 'knowledge_check' && !choice.isCorrect && scene.policy === 'retry_until_correct'
        const next = retry ? scene.id : choice.nextSceneId ?? scene.id
        if (!story.scenes.some(item => item.id === next)) return failure('validation')
        return saveEpisode(userId, input, next, [scene.id], retry ? undefined : choice.id)
      })
    },
    async getVideoProgress(lessonId, blockId) {
      if (!session.userId) return failure('unauthorized')
      return success(copy(store.videos.get(progressKey(session.userId, lessonId, blockId)) ?? null))
    },
    async saveVideoPosition(input) {
      const userId = session.userId
      const ranges = input.watchedRanges.map(range => ({ start: range.start, end: range.end })).sort((a, b) => a.start - b.start || a.end - b.end)
      const signature = JSON.stringify(['video', input.lessonId, input.blockId, input.positionSeconds, ranges])
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
        const merged: VideoProgress['watchedRanges'] = []
        for (const range of [...(prior?.watchedRanges ?? []), ...ranges].sort((a, b) => a.start - b.start)) {
          const last = merged.at(-1)
          if (last && range.start <= last.end) last.end = Math.max(last.end, range.end)
          else merged.push({ ...range })
        }
        const next: VideoProgress = {
          userId, lessonId: input.lessonId, blockId: input.blockId, positionSeconds: input.positionSeconds,
          watchedRanges: merged, completed: prior?.completed ?? false, updatedAt: now(),
        }
        store.videos.set(key, next)
        const policy = completionPolicy(catalog, input.lessonId)
        if (policy) {
          const evidence = evidenceKey(userId, input.lessonId, policy.contentVersionId, input.blockId)
          const priorEvidence = store.completion.videos.get(evidence)
          store.completion.videos.set(evidence, { ...copy(next), watchedRanges: [...(priorEvidence?.watchedRanges ?? []), ...copy(ranges)] })
        }
        touchLesson(userId, input.lessonId, input.blockId)
        return success(copy(next))
      })
    },
  }
}
