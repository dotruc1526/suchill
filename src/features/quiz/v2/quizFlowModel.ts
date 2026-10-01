import type {
  LearningServices, PracticeQuizReceipt, QuestionFeedback, QuestionSetDelivery, Result, ScoredQuizReceipt,
} from '../../../services/next/contracts'

export type QuizAnswers = Record<string, string[]>
export type QuizReceipt =
  | { mode: 'practice'; attemptId: string; feedback: QuestionFeedback[] }
  | ({ mode: 'scored' } & ScoredQuizReceipt)
export type QuizFlowSession = { delivery: QuestionSetDelivery; answers: QuizAnswers }

export async function loadQuizFlow(
  services: LearningServices,
  questionSetId: string,
): Promise<Result<QuizFlowSession>> {
  const result = await services.quiz.getQuestionSet(questionSetId)
  if (!result.ok) return result
  return { ok: true, value: { delivery: result.value, answers: {} } }
}

export function toggleQuizOption(answers: QuizAnswers, questionId: string, optionId: string): QuizAnswers {
  const selected = answers[questionId] ?? []
  return {
    ...answers,
    [questionId]: selected.includes(optionId) ? selected.filter(id => id !== optionId) : [...selected, optionId],
  }
}

export const isQuizComplete = (delivery: QuestionSetDelivery, answers: QuizAnswers) =>
  delivery.questions.every(question => (answers[question.id]?.length ?? 0) > 0)

export async function submitQuizFlow(
  services: LearningServices,
  session: QuizFlowSession,
  operationId: string,
): Promise<Result<QuizReceipt>> {
  if (!isQuizComplete(session.delivery, session.answers)) return { ok: false, error: 'validation' }
  const input = {
    operationId,
    questionSetId: session.delivery.set.id,
    answers: session.delivery.questions.map(question => ({
      questionId: question.id,
      selectedOptionIds: [...session.answers[question.id]],
    })),
  }
  if (session.delivery.set.mode === 'practice') {
    const result: Result<PracticeQuizReceipt> = await services.quiz.submitPracticeAttempt(input)
    return result.ok ? { ok: true, value: { mode: 'practice', ...result.value } } : result
  }
  const result = await services.quiz.submitScoredAttempt(input)
  return result.ok ? { ok: true, value: { mode: 'scored', ...result.value } } : result
}

export const resetQuizFlow = (session: QuizFlowSession): QuizFlowSession => ({ ...session, answers: {} })
