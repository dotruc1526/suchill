import { useEffect, useRef, useState } from 'react'
import { ErrorState, LoadingState } from '../../../components/ui'
import type { LearningServices, ServiceErrorCode } from '../../../services/next/contracts'
import { QuizFlowView } from './QuizFlowView'
import {
  loadQuizFlow, QuizSubmissionGate, resetQuizFlow, submitQuizFlow, toggleQuizOption,
  type QuizFlowSession, type QuizReceipt,
} from './quizFlowModel'

type LoadState = { status: 'loading' }
  | { status: 'error'; error: ServiceErrorCode; questionSetId: string }
  | { status: 'ready'; session: QuizFlowSession }
const newOperationId = () => globalThis.crypto.randomUUID()

export function QuizFlow({ services, questionSetId }: { services: LearningServices; questionSetId: string }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [receipt, setReceipt] = useState<QuizReceipt>()
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string>()
  const [answersLocked, setAnswersLocked] = useState(false)
  const [loadRetryKey, setLoadRetryKey] = useState(0)
  const operationIdRef = useRef(newOperationId())
  const submissionGateRef = useRef(new QuizSubmissionGate(questionSetId))
  submissionGateRef.current.activate(questionSetId)
  useEffect(() => {
    let active = true
    submissionGateRef.current.invalidate()
    setState({ status: 'loading' })
    setReceipt(undefined)
    setSubmitting(false)
    setSubmissionError(undefined)
    setAnswersLocked(false)
    operationIdRef.current = newOperationId()
    void loadQuizFlow(services, questionSetId).then(result => {
      if (active) setState(result.ok
        ? { status: 'ready', session: result.value }
        : { status: 'error', error: result.error, questionSetId })
    })
    return () => { active = false }
  }, [loadRetryKey, questionSetId, services])

  if (state.status === 'loading') return <LoadingState message="Đang tải bài kiểm tra..." />
  if (state.status === 'error') return state.questionSetId === questionSetId
    ? <ErrorState message={`Không thể tải bài kiểm tra (${state.error}).`} onRetry={() => setLoadRetryKey(value => value + 1)} />
    : <LoadingState message="Đang tải bài kiểm tra..." />
  if (state.session.delivery.set.id !== questionSetId) return <LoadingState message="Đang tải bài kiểm tra..." />
  const replaceSession = (session: QuizFlowSession) => setState({ status: 'ready', session })
  const submit = async () => {
    setSubmitting(true)
    setAnswersLocked(true)
    setSubmissionError(undefined)
    const submissionToken = submissionGateRef.current.begin(state.session.delivery.set.id)
    const result = await submitQuizFlow(services, state.session, operationIdRef.current)
    if (!submissionGateRef.current.isCurrent(submissionToken)) return
    setSubmitting(false)
    if (result.ok) setReceipt(result.value)
    else setSubmissionError(`Chưa thể nộp bài (${result.error}).`)
  }
  const startNewAttempt = () => {
    submissionGateRef.current.invalidate()
    replaceSession(resetQuizFlow(state.session))
    operationIdRef.current = newOperationId()
    setReceipt(undefined)
    setSubmissionError(undefined)
    setAnswersLocked(false)
  }
  const editAfterError = () => {
    submissionGateRef.current.invalidate()
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
