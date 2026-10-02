import { useMemo, useState } from 'react'
import { Button } from '../../../components/ui'
import type { LearningServices } from '../../../services/next/contracts'
import { theme } from '../../../theme/tokens'
import { CompletionOperation } from './completionOperation'
import { CompletionFeedback } from './CompletionFeedback'
import { useCompletionOperation, type CompletionState } from './useCompletionOperation'

type FallbackAction = 'accessible_fallback' | 'media_fallback'

/** Selection changes keep each explicit action's identity available for retries. */
export function createVideoFallbackOperations(services: Pick<LearningServices, 'completion'>,
  lessonId: string, blockId: string, newId: () => string = () => globalThis.crypto.randomUUID()) {
  const action = (method: FallbackAction) => new CompletionOperation<null>(operationId =>
    services.completion.recordBlockAction({ lessonId, blockId, action: method, operationId }), newId())
  return { accessible_fallback: action('accessible_fallback'), media_fallback: action('media_fallback') }
}

export function VideoFallbackActions({ blockId, method, state, onMethod, onSubmit }: {
  blockId: string; method: FallbackAction; state: CompletionState<null>
  onMethod: (method: FallbackAction) => void; onSubmit: () => void
}) {
  const pending = state.status === 'submitting'
  return <section aria-label="Hoàn thành video bằng nội dung thay thế" aria-busy={pending}
    className="space-y-2" data-testid={`video-fallback-${blockId}`}>
    {state.status === 'confirmed' ? <p role="status" className="text-sm font-bold"
      style={{ color: theme.colors.textPrimary }}>Đã xác nhận phần video bằng nội dung thay thế.</p> : <>
      <p className="text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>
        Đọc bản chép lời hoặc nội dung thay thế và hoàn thành phần ôn tập bắt buộc, rồi xác nhận tại đây.
      </p>
      <label className="block space-y-1 text-sm">
        <span>Cách học thay thế cho video</span>
        <select className="min-h-11 w-full rounded-sm border px-3 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ background: theme.colors.cardBg, borderColor: theme.colors.borderMedium }}
          value={method} disabled={pending} onChange={event => onMethod(event.target.value as FallbackAction)}>
          <option value="accessible_fallback">Đọc bản chép lời và hoàn thành phần ôn tập</option>
          <option value="media_fallback">Video lỗi: dùng nội dung thay thế và ôn tập</option>
        </select>
      </label>
      {state.status === 'error' && (state.error === 'validation'
        ? <p role="alert" className="text-sm leading-relaxed" style={{ color: theme.colors.textSecondary }}>
          Chưa đủ bằng chứng hoàn thành. Hãy đọc bản chép lời hoặc nội dung thay thế và hoàn thành phần ôn tập bắt buộc rồi thử lại.
        </p> : <CompletionFeedback error={state.error} />)}
      <Button variant="outline" className="min-h-11 w-full focus-visible:outline-2 focus-visible:outline-offset-2"
        disabled={pending} onClick={onSubmit}>
        {pending ? 'ĐANG CHỜ XÁC NHẬN…' : state.status === 'error' ? 'THỬ XÁC NHẬN LẠI' : 'XÁC NHẬN HỌC BẰNG NỘI DUNG THAY THẾ'}
      </Button>
      {pending && <p role="status" className="text-sm">Đang kiểm tra phần học thay thế. XP và streak chưa được xác nhận.</p>}
    </>}
  </section>
}

export function VideoFallbackControl({ lessonId, blockId, services }: {
  lessonId: string; blockId: string; services: LearningServices
}) {
  const [method, setMethod] = useState<FallbackAction>('accessible_fallback')
  const operations = useMemo(() => createVideoFallbackOperations(services, lessonId, blockId), [services, lessonId, blockId])
  const { state, submit } = useCompletionOperation(operations[method])
  return <VideoFallbackActions blockId={blockId} method={method} state={state}
    onMethod={setMethod} onSubmit={() => void submit()} />
}
