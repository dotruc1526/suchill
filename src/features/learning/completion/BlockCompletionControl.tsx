import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui'
import type { BlockCompletionReceipt, CompletionMethod, LearningServices } from '../../../services/next/backendContracts'
import type { LessonBlock } from '../../../types/v2/content'
import { theme } from '../../../theme/tokens'
import { CompletionOperation } from './completionOperation'
import { CompletionFeedback } from './CompletionFeedback'
import { useCompletionOperation } from './useCompletionOperation'

export function BlockCompletionControl({ lessonId, block, services, completed, onConfirmed }: {
  lessonId: string; block: LessonBlock; services: LearningServices; completed: boolean
  onConfirmed: (receipt: BlockCompletionReceipt) => void
}) {
  const [method, setMethod] = useState<CompletionMethod>('standard')
  const operation = useMemo(() => new CompletionOperation(id => services.completion.completeBlock({
    lessonId, blockId: block.id, method, operationId: id,
  })), [lessonId, block.id, method, services])
  const { state, submit } = useCompletionOperation(operation, onConfirmed)
  const confirmed = completed || state.status === 'confirmed'
  const standard = block.kind === 'text' || block.kind === 'recap'
  return <div className="mt-3 space-y-2" data-testid={`complete-block-${block.id}`}>
    {confirmed ? <div role="status" className="space-y-1 text-sm" style={{ color: theme.colors.textPrimary }}>
      <p className="font-bold">✓ Phần học đã được xác nhận</p>
      {state.status === 'confirmed' && state.receipt.xpGranted > 0 && <p>Đã xác nhận +{state.receipt.xpGranted} XP · Tổng XP: {state.receipt.totalXp}</p>}
    </div> : <>
      <p className="text-xs" style={{ color: theme.colors.textSecondary }}>{block.required ? 'Phần bắt buộc' : 'Phần mở rộng'} · {standard ? 'Xác nhận sau khi đọc nội dung.' : 'Tiến độ được kiểm tra trước khi xác nhận.'}</p>
      {block.kind === 'video' && <label className="block space-y-1 text-sm">
        <span>Cách hoàn thành video</span>
        <select className="min-h-11 w-full rounded-sm border px-3" style={{ background: theme.colors.cardBg, borderColor: theme.colors.borderMedium }} value={method} disabled={state.status === 'submitting'} onChange={event => setMethod(event.target.value as CompletionMethod)}>
          <option value="standard">Xem video theo yêu cầu</option>
          <option value="accessible_fallback">Đọc bản chép lời và hoàn thành phần ôn tập</option>
          <option value="media_fallback">Video lỗi: dùng nội dung thay thế và ôn tập</option>
        </select>
      </label>}
      {state.status === 'error' && <CompletionFeedback error={state.error} />}
      <Button className="min-h-11 w-full focus-visible:outline-2 focus-visible:outline-offset-2" disabled={state.status === 'submitting'} onClick={() => void submit()}>
        {state.status === 'submitting' ? 'ĐANG CHỜ XÁC NHẬN…' : state.status === 'error' ? 'THỬ XÁC NHẬN LẠI' : standard ? 'TÔI ĐÃ ĐỌC PHẦN NÀY' : 'XÁC NHẬN PHẦN HỌC'}
      </Button>
      {state.status === 'submitting' && <p role="status" className="text-xs">Đang kiểm tra tiến độ. XP và streak chưa được xác nhận.</p>}
    </>}
  </div>
}
