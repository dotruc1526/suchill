import { createMockCompletionServices } from './mockCompletion.ts'
import type { MockCompletionPolicy } from './mockCompletionStore.ts'
import type { Chapter, LearningDocument, Lesson, Locale, MediaAsset, StoryVersion } from '../../types/v2/content.ts'
import { createMockProgressService, createMockProgressStore, type MockProgressStore } from './mockProgress.ts'
import { createMockMediaService, type MockMediaResource } from './mockMedia.ts'
import { failure, success, type LearningServices } from './contracts.ts'
import { createMockQuizService, type MockQuizFixture } from './mockQuiz.ts'
export type { MockQuizFixture } from './mockQuiz.ts'

export type MockCatalog = {
  completionPolicies?: MockCompletionPolicy[]
  documents?: LearningDocument[]
  chapters: Chapter[]
  lessons: Lesson[]
  storyVersions: StoryVersion[]
  mediaAssets: MediaAsset[]
  mediaResources?: MockMediaResource[]
  quizzes?: MockQuizFixture[]
}

/** Isolated contract adapter for tests and future UI wiring; no demo data is canonical. */
export function createMockLearningServices(
  catalog: MockCatalog,
  session: { userId: string; displayName?: string; locale?: Locale; timezone?: string },
  now: () => string = () => new Date().toISOString(),
  progressStore: MockProgressStore = createMockProgressStore(),
): LearningServices {
  const copy = <T>(value: T): T => structuredClone(value)
  const published = <T extends { status?: string; reviewStatus?: string }>(value: T): boolean =>
    (value.status ?? value.reviewStatus) === 'published'

  const completion = createMockCompletionServices(catalog, session, now, progressStore)
  return {
    completion: completion.service,
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
    documents: {
      async getById(documentId) {
        const document = catalog.documents?.find(item => item.id === documentId && published(item))
        return document ? success(copy(document)) : failure('not_found')
      },
    },
    stories: {
      async getVersion(storyVersionId) {
        const story = catalog.storyVersions.find(item => item.id === storyVersionId && published(item))
        return story ? success(copy(story)) : failure('not_found')
      },
    },
    media: createMockMediaService(catalog),
    progress: createMockProgressService(catalog, session, now, progressStore),
    quiz: createMockQuizService(catalog, session, progressStore.completion),
    users: {
      getAccountSummary: completion.getAccountSummary,
      async getCurrentProfile() {
        if (!session.userId) return failure('unauthorized')
        return success({ id: session.userId, displayName: session.displayName ?? '', locale: session.locale ?? 'vi-VN' })
      },
    },
  }
}
