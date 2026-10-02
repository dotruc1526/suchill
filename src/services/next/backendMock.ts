import type { Chapter, LearningDocument, Lesson, MediaAsset, StoryVersion } from '../../types/v2/content.ts'
import { createMockProgressService, createMockProgressStore, type MockProgressStore } from './backendMockProgress.ts'
import { createMockMediaService, type MockMediaResource } from './backendMockMedia.ts'
import { failure, success, type LearningServices } from './backendContracts.ts'
import { createMockQuizService, type MockQuizFixture } from './backendMockQuiz.ts'
import { createMockAccountServices } from './mockAccount.ts'
import { createMockCompletionService } from './mockAccountCompletion.ts'
import { recordMockQuizOutcome } from './mockAccountRewards.ts'
import type { MockSession } from './mockAccountStore.ts'
import { deliverStory } from './storyDelivery.ts'
export type { MockQuizFixture } from './backendMockQuiz.ts'

export type MockCatalog = {
  documents?: LearningDocument[]
  chapters: Chapter[]
  lessons: Lesson[]
  storyVersions: StoryVersion[]
  mediaAssets: MediaAsset[]
  mediaResources?: MockMediaResource[]
  quizzes?: MockQuizFixture[]
  /** Stable reward scope: corrections keep the same eligibility version. Fixture-only metadata. */
  rewardEligibilityVersions?: Record<string, string>
  /** Authored opt-in; daily review is never inferred from an arbitrary practice set. */
  dailyReviewSetIds?: string[]
  requiredStoryCheckSceneIds?: Record<string, string[]>
  /** Explicit technical resources in public/technical-fixtures; never production content. */
  mediaResourceUrls?: Record<string, string>
}

/** Isolated contract adapter for tests and future UI wiring; no demo data is canonical. */
export function createMockLearningServices(
  catalog: MockCatalog,
  session: MockSession,
  now: () => string = () => new Date().toISOString(),
  progressStore: MockProgressStore = createMockProgressStore(),
): LearningServices {
  const copy = <T>(value: T): T => structuredClone(value)
  const published = <T extends { status?: string; reviewStatus?: string }>(value: T): boolean =>
    (value.status ?? value.reviewStatus) === 'published'

  return {
    ...createMockAccountServices(progressStore.accountStore, session, now),
    completion: createMockCompletionService(catalog, progressStore, session, now),
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
        return story ? success(deliverStory(story)) : failure('not_found')
      },
    },
    media: createMockMediaService(catalog),
    progress: createMockProgressService(catalog, session, now, progressStore),
    quiz: createMockQuizService(catalog, session, progressStore.accountStore,
      (setId, mode, receipt, actor) => recordMockQuizOutcome(catalog, progressStore.accountStore, actor, setId, mode, receipt, now())),
    users: {
      async getCurrentProfile() {
        if (!session.userId) return failure('unauthorized')
        return success({ id: session.userId, displayName: session.displayName ?? '', locale: session.locale ?? 'vi-VN' })
      },
    },
  }
}
