import { useEffect, useRef, useState } from 'react'
import { ErrorState, LoadingState } from '../../../components/ui'
import type { LearningServices, ServiceErrorCode } from '../../../services/next/contracts'
import { QuizFlowView } from './QuizFlowView'
import {
  loadQuizFlow, resetQuizFlow, submitQuizFlow, toggleQuizOption, type QuizFlowSession, type QuizReceipt,
} from './quizFlowModel'

type LoadState = { status: 'loading' } | { status: 'error'; error: ServiceErrorCode } | { status: 'ready'; session: QuizFlowSession }
const newOperationId = () => globalThis.crypto.randomUUID()

export function QuizFlow({ services, questionSetId }: { services: LearningServices; questionSetId: string }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [receipt, setReceipt] = useState<QuizReceipt>()
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string>()
  const [answersLocked, setAnswersLocked] = useState(false)
  const operationIdRef = useRef(newOperationId())
  useEffect(() => {
    let active = true
    setState({ status: 'loading' })
    setReceipt(undefined)
    setSubmissionError(undefined)
    setAnswersLocked(false)
    operationIdRef.current = newOperationId()
    void loadQuizFlow(services, questionSetId).then(result => {
      if (active) setState(result.ok ? { status: 'ready', session: result.value } : { status: 'error', error: result.error })
    })
    return () => { active = false }
  }, [questionSetId, services])

  if (state.status === 'loading') return <LoadingState message="Đang tải bài kiểm tra..." />
  if (state.status === 'error') return <ErrorState message={`Không thể tải bài kiểm tra (${state.error}).`} />
  const replaceSession = (session: QuizFlowSession) => setState({ status: 'ready', session })
  const submit = async () => {
    setSubmitting(true)
    setAnswersLocked(true)
    setSubmissionError(undefined)
    const result = await submitQuizFlow(services, state.session, operationIdRef.current)
    setSubmitting(false)
    if (result.ok) setReceipt(result.value)
    else setSubmissionError(`Chưa thể nộp bài (${result.error}).`)
  }
  const startNewAttempt = () => {
    replaceSession(resetQuizFlow(state.session))
    operationIdRef.current = newOperationId()
    setReceipt(undefined)
    setSubmissionError(undefined)
    setAnswersLocked(false)
  }
  const editAfterError = () => {
    operationIdRef.current = newOperationId()
    setSubmissionError(undefined)
    setAnswersLocked(false)
  }

  return <QuizFlowView
    session={state.session} receipt={receipt} submitting={submitting} submissionError={submissionError} answersLocked={answersLocked}
    onToggle={(questionId, optionId) => replaceSession({ ...state.session, answers: toggleQuizOption(state.session.answers, questionId, optionId) })}
    onSubmit={() => void submit()}
    onEditAfterError={editAfterError}
    onRetryPractice={startNewAttempt}
  />
}
