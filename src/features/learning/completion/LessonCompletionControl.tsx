import { useEffect, useMemo, useRef, type Ref } from 'react'
import { Button, Card } from '../../../components/ui'
import type { CompletionReceipt, LearningServices } from '../../../services/next/backendContracts'
import { theme } from '../../../theme/tokens'
import { CompletionOperation } from './completionOperation'
import { CompletionFeedback } from './CompletionFeedback'
import { useCompletionOperation } from './useCompletionOperation'

export function LessonCompletionReceipt({ receipt, lessonTitle, receiptRef }: {
  receipt: CompletionReceipt; lessonTitle: string; receiptRef?: Ref<HTMLDivElement>
}) {
  return <div ref={receiptRef} tabIndex={-1} role="status" className="space-y-2 outline-none" data-testid="lesson-completion-receipt">
    <h2 className="text-xl font-bold" style={{ color: theme.colors.textPrimary }}>BÀI HỌC HOÀN THÀNH</h2>
    <p>{lessonTitle}</p>
    <p>{receipt.alreadyCompleted ? 'Bài đã được hoàn thành trước đó. Không cộng lại thưởng.' : `Đã xác nhận +${receipt.xpGranted} XP.`}</p>
    <p className="text-sm">Tổng XP: {receipt.totalXp} · Streak: {receipt.currentStreak} ngày</p>
  </div>
}

export function LessonCompletionControl({ lessonId, lessonTitle, services, remainingRequired, onConfirmed }: {
  lessonId: string; lessonTitle: string; services: LearningServices; remainingRequired: number
  onConfirmed?: (receipt: CompletionReceipt) => void
}) {
  const operation = useMemo(() => new CompletionOperation(id => services.completion.completeLesson({ lessonId, operationId: id })), [lessonId, services])
  const { state, submit } = useCompletionOperation(operation, onConfirmed)
  const receiptRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (state.status === 'confirmed') receiptRef.current?.focus() }, [state.status])
  return <Card data-testid="lesson-completion">
    {state.status === 'confirmed' ? <LessonCompletionReceipt receipt={state.receipt} lessonTitle={lessonTitle} receiptRef={receiptRef} /> : <div className="space-y-3">
      <h2 className="font-bold">Hoàn tất bài học</h2>
      <p className="text-sm">{remainingRequired > 0 ? `Còn ${remainingRequired} phần bắt buộc chưa được xác nhận.` : 'Các phần bắt buộc đã hoàn thành. Xác nhận để ghi nhận bài học.'}</p>
      {state.status === 'error' && <CompletionFeedback error={state.error} />}
      <Button data-testid="complete-lesson-button" className="min-h-11 w-full focus-visible:outline-2 focus-visible:outline-offset-2" disabled={remainingRequired > 0 || state.status === 'submitting'} onClick={() => void submit()}>
        {state.status === 'submitting' ? 'ĐANG CHỜ XÁC NHẬN…' : state.status === 'error' ? 'THỬ HOÀN TẤT LẠI' : 'HOÀN TẤT BÀI HỌC'}
      </Button>
      {state.status === 'submitting' && <p role="status" className="text-sm">Đang chờ xác nhận tiến độ, XP và streak.</p>}
    </div>}
  </Card>
}
