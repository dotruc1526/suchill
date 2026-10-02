import { createMockCompletionStore } from './mockCompletionStore.ts'
import type { EpisodeProgress, LessonProgress, VideoProgress } from '../../types/v2/progress.ts'
import { failure, success, type ProgressService, type Result } from './contracts.ts'
import type { MockCatalog } from './mock.ts'
import { createPlaybackProgress } from './mockPlaybackProgress.ts'

type ProgressRecord = LessonProgress | EpisodeProgress | VideoProgress
/** Inject the same store into recreated adapters to simulate reload; never production persistence. */
export const createMockProgressStore = () => ({
  completion: createMockCompletionStore(),
  lessons: new Map<string, LessonProgress>(),
  episodes: new Map<string, EpisodeProgress>(),
  videos: new Map<string, VideoProgress>(),
  operations: new Map<string, { signature: string; result: ProgressRecord }>(),
})
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
    const next: LessonProgress = {
      userId, lessonId, status: prior?.status === 'completed' ? 'completed' : 'in_progress',
      currentBlockId: blockId, completedBlockIds: [...new Set([...(prior?.completedBlockIds ?? []), ...completed])],
      startedAt: prior?.startedAt ?? now(), completedAt: prior?.completedAt, updatedAt: now(),
    }
    store.lessons.set(key, next)
    return copy(next)
  }
  const playback = createPlaybackProgress(catalog, session, now, store, run, touchLesson)
  return {
    ...playback,
    async getLessonProgress(lessonId) {
      if (!session.userId) return failure('unauthorized')
      return success(copy(store.lessons.get(progressKey(session.userId, lessonId)) ?? null))
    },
    async saveCheckpoint(input) {
      const userId = session.userId
      const completed = [...new Set(input.completedBlockIds)].sort()
      return run(userId, input.operationId, JSON.stringify(['lesson', input.lessonId, input.currentBlockId ?? null, completed]), () => {
        const lesson = catalog.lessons.find(item => item.id === input.lessonId && item.status === 'published')
        if (!lesson) return failure('not_found')
        const ids = new Set(lesson.blocks.map(block => block.id))
        if ((input.currentBlockId !== undefined && !ids.has(input.currentBlockId)) || completed.some(id => !ids.has(id))) return failure('validation')
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
