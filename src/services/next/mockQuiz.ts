import type { MockCatalog } from './mock.ts'
import { failure, success, type QuizService, type QuizOption, type QuestionFeedback, type Result, type ScoredQuizReceipt, type ScoredQuizSubmission } from './contracts.ts'
import type { MultipleChoiceQuestion, PublishStatus, QuestionSet } from '../../types/v2/content.ts'
import { createMockAccountStore, expectedMockSubject, type MockAccountStore, type MockSession } from './mockAccountStore.ts'

export type MockQuizGrade = {
  attemptId: string; score: number; total: number; passed?: boolean; feedback: QuestionFeedback[]
}
export type MockQuizFixture = {
  status: PublishStatus
  set: QuestionSet
  questions: Array<MultipleChoiceQuestion & { options: QuizOption[] }>
  /** Trusted grading hook; outcomes are never inferred from aggregate scores or client fields. */
  grade: (input: ScoredQuizSubmission) => MockQuizGrade
}

export function createMockQuizService(
  catalog: MockCatalog, session: MockSession, store: MockAccountStore = createMockAccountStore(),
  onGraded?: (questionSetId: string, mode: 'practice' | 'scored', receipt: ScoredQuizReceipt, actor: MockSession) => void,
): QuizService {
  const processedQuizzes = store.operations
  const copy = <T>(value: T): T => structuredClone(value)
  const published = (value: { status: string }) => value.status === 'published'
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
  async function submit(input: ScoredQuizSubmission, mode: 'practice' | 'scored'): Promise<Result<ScoredQuizReceipt>> {
    const actor = { ...session }
    const userId = actor.userId
    if (!expectedMockSubject(input, userId)) return failure('unauthorized')
    if (!userId) return failure('unauthorized')
    if (!input.operationId?.trim() || !input.questionSetId?.trim() || !Array.isArray(input.answers) || input.answers.length === 0) return failure('validation')
    const quiz = resolveQuiz(input.questionSetId)
    if (!quiz || quiz.fixture.set.mode !== mode) return failure('not_found')
    const questions = new Map(quiz.questions.map(question => [question.id, question]))
    if (input.answers.length !== quiz.questions.length || new Set(input.answers.map(answer => answer?.questionId)).size !== input.answers.length ||
      input.answers.some(answer => !answer || !questions.has(answer.questionId) || !Array.isArray(answer.selectedOptionIds) || answer.selectedOptionIds.length === 0 ||
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
    const signature = JSON.stringify(['quiz', mode, safeInput.questionSetId, safeInput.answers.map(answer => [answer.questionId, answer.selectedOptionIds])])
    const previous = processedQuizzes.get(key)
    if (previous) return previous.signature === signature ? success(copy(previous.result) as ScoredQuizReceipt) : failure('conflict')
    let graded: MockQuizGrade
    try {
      graded = quiz.fixture.grade(copy(safeInput))
    } catch {
      return failure('server_error')
    }
    if (!graded || typeof graded.attemptId !== 'string' || !graded.attemptId.trim() ||
      !Number.isInteger(graded.score) || graded.score < 0 || graded.total !== quiz.questions.length ||
      graded.score > graded.total || (mode === 'scored' && typeof graded.passed !== 'boolean') ||
      !Array.isArray(graded.feedback) || graded.feedback.length !== quiz.questions.length ||
      new Set(graded.feedback.map(item => item?.questionId)).size !== quiz.questions.length ||
      graded.feedback.some(item => !item || !questions.has(item.questionId) ||
        !['correct', 'incorrect'].includes(item.outcome) || typeof item.explanation !== 'string' || !item.explanation.trim()) ||
      graded.feedback.filter(item => item.outcome === 'correct').length !== graded.score) return failure('server_error')
    const feedback = quiz.questions.map(question => {
      const item = graded.feedback.find(entry => entry.questionId === question.id)!
      return { questionId: question.id, outcome: item.outcome, explanation: item.explanation }
    })
    const result: ScoredQuizReceipt = {
      attemptId: graded.attemptId,
      score: graded.score,
      total: graded.total,
      passed: graded.passed === true,
      feedback,
    }
    processedQuizzes.set(key, { signature, result })
    onGraded?.(safeInput.questionSetId, mode, copy(result), actor)
    return session.userId === userId ? success(copy(result)) : failure('unauthorized')
  }
  return {
    async getQuestionSet(questionSetId) {
      const quiz = resolveQuiz(questionSetId)
      if (!quiz) return failure('not_found')
      const set = quiz.fixture.set
      return success(copy({
        ...(catalog.dailyReviewSetIds?.includes(questionSetId) ? { dailyReviewEligible: true } : {}),
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

    submitScoredAttempt: input => submit(input, 'scored'),
    async submitPracticeAttempt(input) {
      const result = await submit(input, 'practice')
      return result.ok ? success({ attemptId: result.value.attemptId, feedback: result.value.feedback }) : result
    },
  }
}
