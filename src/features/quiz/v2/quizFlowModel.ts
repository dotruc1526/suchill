import type {
  LearningServices, PracticeQuizReceipt, QuestionFeedback, QuestionSetDelivery, Result, ScoredQuizReceipt,
} from '../../../services/next/contracts'

export type QuizAnswers = Record<string, string[]>
export type QuizReceipt =
  | { mode: 'practice'; attemptId: string; feedback: QuestionFeedback[] }
  | ({ mode: 'scored' } & ScoredQuizReceipt)
export type QuizFlowSession = { delivery: QuestionSetDelivery; answers: QuizAnswers }
export type QuizSubmissionToken = { questionSetId: string; generation: number }

export class QuizSubmissionGate {
  private activeQuestionSetId: string
  private generation = 0

  constructor(questionSetId: string) {
    this.activeQuestionSetId = questionSetId
  }

  activate(questionSetId: string) {
    if (questionSetId === this.activeQuestionSetId) return
    this.activeQuestionSetId = questionSetId
    this.generation += 1
  }

  begin(questionSetId: string): QuizSubmissionToken {
    this.generation += 1
    return { questionSetId, generation: this.generation }
  }

  invalidate() {
    this.generation += 1
  }

  isCurrent(token: QuizSubmissionToken) {
    return token.questionSetId === this.activeQuestionSetId && token.generation === this.generation
  }
}

export async function loadQuizFlow(
  services: LearningServices,
  questionSetId: string,
): Promise<Result<QuizFlowSession>> {
  try {
    const result = await services.quiz.getQuestionSet(questionSetId)
    if (!result.ok) return result
    return { ok: true, value: { delivery: result.value, answers: {} } }
  } catch { return { ok: false, error: 'server_error' } }
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
  try {
    if (session.delivery.set.mode === 'practice') {
      const result: Result<PracticeQuizReceipt> = await services.quiz.submitPracticeAttempt(input)
      return result.ok ? { ok: true, value: { mode: 'practice', ...result.value } } : result
    }
    const result = await services.quiz.submitScoredAttempt(input)
    return result.ok ? { ok: true, value: { mode: 'scored', ...result.value } } : result
  } catch { return { ok: false, error: 'server_error' } }
}

export const resetQuizFlow = (session: QuizFlowSession): QuizFlowSession => ({ ...session, answers: {} })
