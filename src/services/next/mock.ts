import type { Chapter, Lesson, Locale, MediaAsset, MultipleChoiceQuestion, PublishStatus, QuestionSet, StoryVersion } from '../../types/v2/content.ts'
import type { LessonProgress } from '../../types/v2/progress.ts'
import { failure, success, type LearningServices, type ScoredQuizReceipt, type ScoredQuizSubmission } from './contracts.ts'

export type MockQuizFixture = {
  status: PublishStatus
  set: QuestionSet
  questions: MultipleChoiceQuestion[]
  /** Trusted fixture hook; answer keys never appear in the delivered question payload. */
  grade: (input: ScoredQuizSubmission) => ScoredQuizReceipt
}

export type MockCatalog = {
  chapters: Chapter[]
  lessons: Lesson[]
  storyVersions: StoryVersion[]
  mediaAssets: MediaAsset[]
  quizzes?: MockQuizFixture[]
}

/** Isolated contract adapter for tests and future UI wiring; no demo data is canonical. */
export function createMockLearningServices(
  catalog: MockCatalog,
  session: { userId: string; displayName?: string; locale?: Locale },
  now: () => string = () => new Date().toISOString(),
): LearningServices {
  const progress = new Map<string, LessonProgress>()
  const processed = new Map<string, { signature: string; result: LessonProgress }>()
  const processedQuizzes = new Map<string, { signature: string; result: ScoredQuizReceipt }>()
  const progressKey = (userId: string, lessonId: string) => JSON.stringify([userId, lessonId])
  const operationKey = (userId: string, operationId: string) => JSON.stringify([userId, operationId])
  const copy = <T>(value: T): T => structuredClone(value)
  const published = <T extends { status?: string; reviewStatus?: string }>(value: T): boolean =>
    (value.status ?? value.reviewStatus) === 'published'
  const attemptKey = (userId: string, operationId: string) => JSON.stringify([userId, operationId])
  const resolveQuiz = (questionSetId: string) => {
    const quiz = catalog.quizzes?.find(item => item.set.id === questionSetId)
    if (!quiz || quiz.status !== 'published' || !quiz.questions.every(published)) return null
    const questions = new Map(quiz.questions.map(question => [question.id, question]))
    if (questions.size !== quiz.questions.length || new Set(quiz.set.questionIds).size !== quiz.set.questionIds.length) return null
    const ordered = quiz.set.questionIds.map(id => questions.get(id))
    return ordered.some(question => !question) ? null : { fixture: quiz, questions: ordered as MultipleChoiceQuestion[] }
  }

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
        const userId = session.userId
        if (!userId) return failure('unauthorized')
        return success(copy(progress.get(progressKey(userId, lessonId)) ?? null))
      },
      async saveCheckpoint(input) {
        const userId = session.userId
        if (!userId) return failure('unauthorized')
        if (!input.operationId || !input.lessonId) return failure('validation')
        const signature = JSON.stringify([input.lessonId, input.currentBlockId ?? null,
          [...new Set(input.completedBlockIds)].sort()])
        const previousOperation = processed.get(operationKey(userId, input.operationId))
        if (previousOperation) {
          return previousOperation.signature === signature ? success(copy(previousOperation.result)) : failure('conflict')
        }
        const lesson = catalog.lessons.find(item => item.id === input.lessonId && published(item))
        if (!lesson) return failure('not_found')
        const blockIds = new Set(lesson.blocks.map(block => block.id))
        if ((input.currentBlockId && !blockIds.has(input.currentBlockId)) ||
          input.completedBlockIds.some(id => !blockIds.has(id))) return failure('validation')
        const prior = progress.get(progressKey(userId, input.lessonId))
        const completedBlockIds = [...new Set([...(prior?.completedBlockIds ?? []), ...input.completedBlockIds])]
        const next: LessonProgress = {
          userId,
          lessonId: input.lessonId,
          status: prior?.status === 'completed' ? 'completed' : 'in_progress',
          currentBlockId: input.currentBlockId ?? prior?.currentBlockId,
          completedBlockIds,
          startedAt: prior?.startedAt ?? now(),
          updatedAt: now(),
        }
        progress.set(progressKey(userId, input.lessonId), next)
        processed.set(operationKey(userId, input.operationId), { signature, result: copy(next) })
        return success(copy(next))
      },
    },
    quiz: {
      async getQuestionSet(questionSetId) {
        const quiz = resolveQuiz(questionSetId)
        if (!quiz) return failure('not_found')
        return success(copy({ set: quiz.fixture.set, questions: quiz.questions }))
      },
      async submitScoredAttempt(input) {
        const userId = session.userId
        if (!userId) return failure('unauthorized')
        if (!input.operationId || !input.questionSetId || input.answers.length === 0) return failure('validation')
        const quiz = resolveQuiz(input.questionSetId)
        if (!quiz || quiz.fixture.set.mode !== 'scored') return failure('not_found')
        const questions = new Map(quiz.questions.map(question => [question.id, question]))
        if (input.answers.length !== quiz.questions.length || new Set(input.answers.map(answer => answer.questionId)).size !== input.answers.length ||
          input.answers.some(answer => !questions.has(answer.questionId) || answer.selectedOptionIds.length === 0 ||
            new Set(answer.selectedOptionIds).size !== answer.selectedOptionIds.length ||
            answer.selectedOptionIds.some(optionId => !questions.get(answer.questionId)?.optionIds.includes(optionId)))) {
          return failure('validation')
        }
        const safeInput: ScoredQuizSubmission = {
          operationId: input.operationId,
          questionSetId: input.questionSetId,
          answers: input.answers.map(answer => ({ questionId: answer.questionId, selectedOptionIds: [...answer.selectedOptionIds] })),
        }
        const key = attemptKey(userId, input.operationId)
        safeInput.answers.sort((left, right) => left.questionId.localeCompare(right.questionId))
        safeInput.answers.forEach(answer => answer.selectedOptionIds.sort())
        const signature = JSON.stringify([safeInput.questionSetId, safeInput.answers.map(answer => [answer.questionId, answer.selectedOptionIds])])
        const previous = processedQuizzes.get(key)
        if (previous) return previous.signature === signature ? success(copy(previous.result)) : failure('conflict')
        let graded: ScoredQuizReceipt
        try {
          graded = quiz.fixture.grade(copy(safeInput))
        } catch {
          return failure('server_error')
        }
        if (!graded.attemptId || !Number.isInteger(graded.score) || graded.score < 0 ||
          !Number.isInteger(graded.total) || graded.total !== quiz.questions.length || graded.score > graded.total) {
          return failure('server_error')
        }
        const result: ScoredQuizReceipt = {
          attemptId: graded.attemptId,
          score: graded.score,
          total: graded.total,
          passed: graded.passed === true,
        }
        processedQuizzes.set(key, { signature, result })
        return success(copy(result))
      },
    },
    users: {
      async getCurrentProfile() {
        if (!session.userId) return failure('unauthorized')
        return success({ id: session.userId, displayName: session.displayName ?? '', locale: session.locale ?? 'vi-VN' })
      },
    },
  }
}
