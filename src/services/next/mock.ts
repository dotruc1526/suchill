import type { Chapter, Lesson, MediaAsset, StoryVersion } from '../../types/v2/content.ts'
import type { LessonProgress } from '../../types/v2/progress.ts'
import { failure, success, type LearningServices } from './contracts.ts'

export type MockCatalog = {
  chapters: Chapter[]
  lessons: Lesson[]
  storyVersions: StoryVersion[]
  mediaAssets: MediaAsset[]
}

/** Isolated contract adapter for tests and future UI wiring; no demo data is canonical. */
export function createMockLearningServices(
  catalog: MockCatalog,
  session: { userId: string },
  now: () => string = () => new Date().toISOString(),
): LearningServices {
  const progress = new Map<string, LessonProgress>()
  const processed = new Map<string, { signature: string; result: LessonProgress }>()
  const copy = <T>(value: T): T => structuredClone(value)
  const published = <T extends { status?: string; reviewStatus?: string }>(value: T): boolean =>
    (value.status ?? value.reviewStatus) === 'published'

  return {
    chapters: {
      async listPublished() {
        return success(copy(catalog.chapters.filter(published)))
      },
      async getById(chapterId) {
        const chapter = catalog.chapters.find(item => item.id === chapterId && published(item))
        return chapter ? success(copy(chapter)) : failure('not_found')
      },
    },
    lessons: {
      async getById(lessonId) {
        const lesson = catalog.lessons.find(item => item.id === lessonId && published(item))
        return lesson ? success(copy(lesson)) : failure('not_found')
      },
    },
    stories: {
      async getVersion(storyVersionId) {
        const story = catalog.storyVersions.find(item => item.id === storyVersionId && published(item))
        return story ? success(copy(story)) : failure('not_found')
      },
    },
    media: {
      async getResolvedAsset(mediaAssetId) {
        const asset = catalog.mediaAssets.find(item => item.id === mediaAssetId && published(item))
        // A mock URI is intentionally non-network and cannot be used as production content.
        return asset ? success({ ...copy(asset), url: `mock://media/${encodeURIComponent(asset.id)}` }) : failure('not_found')
      },
    },
    progress: {
      async getLessonProgress(lessonId) {
        if (!session.userId) return failure('unauthorized')
        return success(copy(progress.get(lessonId) ?? null))
      },
      async saveCheckpoint(input) {
        if (!session.userId) return failure('unauthorized')
        if (!input.operationId || !input.lessonId) return failure('validation')
        const signature = JSON.stringify([input.lessonId, input.currentBlockId ?? null,
          [...new Set(input.completedBlockIds)].sort()])
        const previousOperation = processed.get(input.operationId)
        if (previousOperation) {
          return previousOperation.signature === signature ? success(copy(previousOperation.result)) : failure('conflict')
        }
        const lesson = catalog.lessons.find(item => item.id === input.lessonId && published(item))
        if (!lesson) return failure('not_found')
        const blockIds = new Set(lesson.blocks.map(block => block.id))
        if ((input.currentBlockId && !blockIds.has(input.currentBlockId)) ||
          input.completedBlockIds.some(id => !blockIds.has(id))) return failure('validation')
        const prior = progress.get(input.lessonId)
        const completedBlockIds = [...new Set([...(prior?.completedBlockIds ?? []), ...input.completedBlockIds])]
        const next: LessonProgress = {
          userId: session.userId,
          lessonId: input.lessonId,
          status: prior?.status === 'completed' ? 'completed' : 'in_progress',
          currentBlockId: input.currentBlockId ?? prior?.currentBlockId,
          completedBlockIds,
          startedAt: prior?.startedAt ?? now(),
          updatedAt: now(),
        }
        progress.set(input.lessonId, next)
        processed.set(input.operationId, { signature, result: copy(next) })
        return success(copy(next))
      },
    },
  }
}
