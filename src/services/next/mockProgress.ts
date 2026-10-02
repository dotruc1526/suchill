import type { EpisodeProgress, LessonProgress, VideoProgress } from '../../types/v2/progress.ts'
import { failure, success, type ProgressService, type Result } from './contracts.ts'
import type { MockCatalog } from './mock.ts'
import { createPlaybackProgress } from './mockPlaybackProgress.ts'
import { createMockAccountStore, expectedMockSubject } from './mockAccountStore.ts'

type ProgressRecord = LessonProgress | EpisodeProgress | VideoProgress
/** Inject the same store into recreated adapters to simulate reload; never production persistence. */
export const createMockProgressStore = () => {
  const accountStore = createMockAccountStore()
  return {
  lessons: new Map<string, LessonProgress>(),
  episodes: new Map<string, EpisodeProgress>(),
  videos: new Map<string, VideoProgress>(),
  operations: accountStore.operations,
  accountStore,
  }
}
export type MockProgressStore = ReturnType<typeof createMockProgressStore>
export const progressKey = (...parts: string[]) => JSON.stringify(parts)
export const copy = <T>(value: T): T => structuredClone(value)
export type CheckpointRunner = <T extends ProgressRecord>(
  userId: string, operationId: string, signature: string, write: () => Result<T>,
) => Result<T>

export function createMockProgressService(
  catalog: MockCatalog, session: { userId: string }, now: () => string, store: MockProgressStore,
): ProgressService {
  const run: CheckpointRunner = <T extends ProgressRecord>(userId: string, operationId: string, signature: string, write: () => Result<T>): Result<T> => {
    if (!userId) return failure('unauthorized')
    if (!operationId.trim()) return failure('validation')
    const key = progressKey(userId, operationId)
    const previous = store.operations.get(key)
    // The signature contains the operation kind, so a key cannot cross write contracts.
    if (previous) return previous.signature === signature
      ? success(copy(previous.result) as T)
      : failure('conflict')
    const result = write()
    if (result.ok) store.operations.set(key, { signature, result: copy(result.value) })
    return copy(result)
  }
  const touchLesson = (userId: string, lessonId: string, blockId: string, completed: string[] = []) => {
    const key = progressKey(userId, lessonId)
    const prior = store.lessons.get(key)
    if (prior?.status === 'completed') return copy(prior)
    const blocks = catalog.lessons.find(lesson => lesson.id === lessonId)?.blocks ?? []
    const priorOrder = blocks.find(block => block.id === prior?.currentBlockId)?.order ?? -Infinity
    const nextOrder = blocks.find(block => block.id === blockId)?.order ?? -Infinity
    const next: LessonProgress = {
      userId, lessonId, status: 'in_progress',
      currentBlockId: priorOrder > nextOrder ? prior!.currentBlockId : blockId,
      completedBlockIds: [...new Set([...(prior?.completedBlockIds ?? []), ...completed])],
      confirmedCompletedBlockIds: blocks.filter(block => store.accountStore.blocks.has(progressKey(userId, lessonId, block.id))).map(block => block.id),
      startedAt: prior?.startedAt ?? now(), completedAt: prior?.completedAt, updatedAt: now(),
      revision: (prior?.revision ?? 0) + 1,
    }
    store.lessons.set(key, next)
    return copy(next)
  }
  const playback = createPlaybackProgress(catalog, session, now, store, run, touchLesson)
  return {
    ...playback,
    async getLessonProgress(lessonId) {
      if (!session.userId) return failure('unauthorized')
      const prior = store.lessons.get(progressKey(session.userId, lessonId))
      if (!prior) return success(null)
      const blocks = catalog.lessons.find(lesson => lesson.id === lessonId)?.blocks ?? []
      return success(copy({ ...prior, confirmedCompletedBlockIds: blocks.filter(block =>
        store.accountStore.blocks.has(progressKey(session.userId, lessonId, block.id))).map(block => block.id) }))
    },
    async saveCheckpoint(input) {
      const userId = session.userId
      if (!expectedMockSubject(input, userId)) return failure('unauthorized')
      const completed = [...new Set(input.completedBlockIds)].sort()
      return run(userId, input.operationId, JSON.stringify(['lesson', input.lessonId, input.currentBlockId ?? null, completed, input.expectedRevision ?? null]), () => {
        const lesson = catalog.lessons.find(item => item.id === input.lessonId && item.status === 'published')
        if (!lesson) return failure('not_found')
        const ids = new Set(lesson.blocks.map(block => block.id))
        if ((input.currentBlockId !== undefined && !ids.has(input.currentBlockId)) || completed.some(id => !ids.has(id))) return failure('validation')
        if (input.expectedRevision !== undefined && (!Number.isInteger(input.expectedRevision) || input.expectedRevision < 0)) return failure('validation')
        if (input.expectedRevision !== undefined && input.expectedRevision !== (store.lessons.get(progressKey(userId, input.lessonId))?.revision ?? 0)) return failure('conflict')
        const blockId = input.currentBlockId ?? store.lessons.get(progressKey(userId, input.lessonId))?.currentBlockId ??
          [...lesson.blocks].sort((a, b) => a.order - b.order)[0]?.id
        if (!blockId) return failure('validation')
        return success(touchLesson(userId, input.lessonId, blockId, completed))
      })
    },
    async getResumePoint(lessonId) {
      const userId = session.userId
      if (!userId) return failure('unauthorized')
      const lesson = catalog.lessons.find(item => item.id === lessonId && item.status === 'published')
      if (!lesson) return failure('not_found')
      const savedBlock = store.lessons.get(progressKey(userId, lessonId))?.currentBlockId
      const block = savedBlock ? lesson.blocks.find(item => item.id === savedBlock) : [...lesson.blocks].sort((a, b) => a.order - b.order)[0]
      if (!block) return failure('not_found')
      if (block.kind === 'visual_novel') {
        const story = catalog.storyVersions.find(item => item.id === block.storyVersionId && item.status === 'published')
        if (!story) return failure('not_found')
        const progress = store.episodes.get(progressKey(userId, story.id)) ?? null
        const sceneId = progress?.currentSceneId ?? story.startSceneId
        if (!story.scenes.some(scene => scene.id === sceneId)) return failure('validation')
        return success(copy({ kind: 'visual_novel', lessonId, blockId: block.id, storyVersionId: story.id, progress, sceneId }))
      }
      if (block.kind === 'video') {
        const asset = catalog.mediaAssets.find(item => item.id === block.mediaAssetId && item.kind === 'video' && item.reviewStatus === 'published')
        if (!asset) return failure('not_found')
        const progress = store.videos.get(progressKey(userId, lessonId, block.id)) ?? null
        return success(copy({ kind: 'video', lessonId, blockId: block.id, progress, positionSeconds: progress?.positionSeconds ?? 0 }))
      }
      return success({ kind: 'block', lessonId, blockId: block.id })
    },
  }
}
