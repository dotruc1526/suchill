import type { Chapter, Lesson, Locale, MediaAsset, MultipleChoiceQuestion, PublishStatus, QuestionSet, StoryVersion } from '../../types/v2/content.ts'
import { createMockProgressService, createMockProgressStore, type MockProgressStore } from './mockProgress.ts'
import { createMockMediaService, type MockMediaResource } from './mockMedia.ts'
import { failure, success, type LearningServices, type QuizOption, type ScoredQuizReceipt, type ScoredQuizSubmission } from './contracts.ts'

export type MockQuizFixture = {
  status: PublishStatus
  set: QuestionSet
  questions: Array<MultipleChoiceQuestion & { options: QuizOption[] }>
  /** Trusted fixture hook; answer keys never appear in the delivered question payload. */
  grade: (input: ScoredQuizSubmission) => ScoredQuizReceipt
}

export type MockCatalog = {
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
  session: { userId: string; displayName?: string; locale?: Locale },
  now: () => string = () => new Date().toISOString(),
  progressStore: MockProgressStore = createMockProgressStore(),
): LearningServices {
  const processedQuizzes = new Map<string, { signature: string; result: ScoredQuizReceipt }>()
  const copy = <T>(value: T): T => structuredClone(value)
  const published = <T extends { status?: string; reviewStatus?: string }>(value: T): boolean =>
    (value.status ?? value.reviewStatus) === 'published'
  const attemptKey = (userId: string, operationId: string) => JSON.stringify([userId, operationId])
  const resolveQuiz = (questionSetId: string) => {
    const quiz = catalog.quizzes?.find(item => item.set.id === questionSetId)
    if (!quiz || quiz.status !== 'published' || !quiz.questions.every(published)) return null
    if (quiz.questions.some(question => !question.options?.length ||
      new Set(question.optionIds).size !== question.optionIds.length ||
      new Set(question.options.map(option => option.id)).size !== question.options.length ||
      question.options.length !== question.optionIds.length ||
      question.options.some(option => !option.label.trim() || !question.optionIds.includes(option.id)))) return null
    const questions = new Map(quiz.questions.map(question => [question.id, question]))
    if (questions.size !== quiz.questions.length || new Set(quiz.set.questionIds).size !== quiz.set.questionIds.length) return null
    const ordered = quiz.set.questionIds.map(id => questions.get(id))
    return ordered.some(question => !question) ? null : { fixture: quiz, questions: ordered as MockQuizFixture['questions'] }
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
    media: createMockMediaService(catalog),
    progress: createMockProgressService(catalog, session, now, progressStore),
    quiz: {
      async getQuestionSet(questionSetId) {
        const quiz = resolveQuiz(questionSetId)
        if (!quiz) return failure('not_found')
        const set = quiz.fixture.set
        return success(copy({
          set: { id: set.id, title: set.title, questionIds: set.questionIds, learningObjectiveIds: set.learningObjectiveIds, mode: set.mode },
          questions: quiz.questions.map(question => ({
            id: question.id, prompt: question.prompt, optionIds: question.optionIds,
            sourceIds: question.sourceIds, difficulty: question.difficulty,
            options: question.optionIds.map(id => {
              const option = question.options.find(item => item.id === id)!
              return { id: option.id, label: option.label }
            }),
          })),
        }))
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
          feedback: quiz.questions.map(question => ({ questionId: question.id, explanation: question.explanation })),
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
