import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, ErrorState, LoadingState } from '../../components/ui'
import type { DailyReviewReceipt, LearningServices, ServiceErrorCode } from '../../services/next/contracts'
import { CompletionFeedback } from '../learning/completion/CompletionFeedback'
import { CompletionOperation } from '../learning/completion/completionOperation'
import { useCompletionOperation } from '../learning/completion/useCompletionOperation'
import { QuizFlow } from '../quiz/v2'
import type { QuizReceipt } from '../quiz/v2/quizFlowModel'

function DailyReviewControl({ services, questionSetId, attemptId, onAccountChange }: {
  services: LearningServices; questionSetId: string; attemptId: string; onAccountChange?: () => void
}) {
  const operation = useMemo(() => new CompletionOperation<DailyReviewReceipt>(operationId =>
    services.completion.completeDailyReview({ questionSetId, attemptId, operationId })), [services, questionSetId, attemptId])
  const { state, submit } = useCompletionOperation(operation, onAccountChange)
  const receiptRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (state.status === 'confirmed') receiptRef.current?.focus() }, [state.status])
  return <Card data-testid="daily-review-completion">
    {state.status === 'confirmed' ? <div ref={receiptRef} tabIndex={-1} role="status" className="space-y-2 outline-none" data-testid="daily-review-receipt">
      <h2 className="font-bold">ĐÃ XÁC NHẬN ÔN TẬP HẰNG NGÀY</h2>
      <p>{state.receipt.alreadyCompleted ? 'Hoạt động hôm nay đã được ghi nhận. Không cộng lại thưởng.' : `Đã xác nhận +${state.receipt.xpGranted} XP.`}</p>
      <p className="text-sm">Tổng XP: {state.receipt.totalXp} · Streak: {state.receipt.currentStreak} ngày</p>
      <p className="text-sm">Ngày theo tài khoản: {state.receipt.localDate}</p>
    </div> : <div className="space-y-3">
      <h2 className="font-bold">Ghi nhận ôn tập hằng ngày</h2>
      <p className="text-sm">Bài practice đã nộp đủ câu. Xác nhận lần nộp này để dịch vụ kiểm tra hoạt động và ghi nhận theo ngày của tài khoản.</p>
      {state.status === 'error' && <CompletionFeedback error={state.error} />}
      <Button data-testid="complete-daily-review-button" className="min-h-11 w-full focus-visible:outline-2 focus-visible:outline-offset-2" disabled={state.status === 'submitting'} onClick={() => void submit()}>
        {state.status === 'submitting' ? 'ĐANG CHỜ XÁC NHẬN…' : state.status === 'error' ? 'THỬ XÁC NHẬN ÔN TẬP LẠI' : 'XÁC NHẬN ÔN TẬP HẰNG NGÀY'}
      </Button>
      {state.status === 'submitting' && <p role="status" className="text-sm">Đang chờ dịch vụ xác nhận. XP và streak chưa được ghi nhận.</p>}
    </div>}
  </Card>
}

type MetadataState = { services: LearningServices; questionSetId: string } & (
  { status: 'ready'; dailyReviewEligible: boolean } | { status: 'error'; error: ServiceErrorCode }
)

export function PracticeAssessment({ services, questionSetId, onAccountChange }: {
  services: LearningServices; questionSetId: string; onAccountChange?: () => void
}) {
  const [metadata, setMetadata] = useState<MetadataState>()
  const [receipt, setReceipt] = useState<{ services: LearningServices; questionSetId: string; value: QuizReceipt }>()
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    let active = true
    setMetadata(undefined); setReceipt(undefined)
    void services.quiz.getQuestionSet(questionSetId).then(result => {
      if (active) setMetadata(result.ok
        ? { services, questionSetId, status: 'ready', dailyReviewEligible: result.value.dailyReviewEligible === true && result.value.set.mode === 'practice' }
        : { services, questionSetId, status: 'error', error: result.error })
    }).catch(() => { if (active) setMetadata({ services, questionSetId, status: 'error', error: 'server_error' }) })
    return () => { active = false }
  }, [services, questionSetId, retry])
  if (!metadata || metadata.services !== services || metadata.questionSetId !== questionSetId) return <LoadingState message="Đang tải bài ôn tập..." />
  if (metadata.status === 'error') return <ErrorState message={`Chưa tải được bài ôn tập (${metadata.error}).`} onRetry={() => setRetry(value => value + 1)} />
  const submitted = receipt?.services === services && receipt.questionSetId === questionSetId ? receipt.value : undefined
  return <div className="space-y-4">
    {metadata.dailyReviewEligible && <p className="text-sm">Bài này có thể ghi nhận ôn tập hằng ngày sau khi nộp đủ câu và được dịch vụ xác nhận.</p>}
    <QuizFlow services={services} questionSetId={questionSetId} onSubmitted={value => { setReceipt({ services, questionSetId, value }); onAccountChange?.() }} />
    {metadata.dailyReviewEligible && submitted?.mode === 'practice' && <DailyReviewControl
      services={services} questionSetId={questionSetId} attemptId={submitted.attemptId} onAccountChange={onAccountChange}
    />}
  </div>
}
