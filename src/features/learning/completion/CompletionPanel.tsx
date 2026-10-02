import { useEffect, useSyncExternalStore } from 'react'
import { Button, Card } from '../../../components/ui'
import type { CompletionController } from './completionController'
import { useCompletionSession } from './CompletionSession'
import { AccountSummaryView } from '../../profile/AccountSummaryView'
import type { ServiceErrorCode } from '../../../services/next/contracts'

const errors: Record<ServiceErrorCode, string> = {
  offline: 'Chưa xác nhận hoàn thành. Hãy kết nối mạng rồi thử lại.',
  unauthorized: 'Chưa có phiên tài khoản hợp lệ.',
  not_found: 'Không tìm thấy bài học hoặc phiên bản.',
  validation: 'Chưa thể xác nhận bài học vì dữ liệu chưa hợp lệ.',
  conflict: 'Yêu cầu xác nhận chưa khớp. Hãy tải lại xác nhận.',
  server_error: 'Chưa xác nhận được hoàn thành. Hãy thử lại.',
}
export function CompletionPanel({ controller, labels }: { controller: CompletionController; labels: Record<string, string> }) {
  const { summary } = useCompletionSession()
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot)
  const account = useSyncExternalStore(summary.subscribe, summary.getSnapshot, summary.getSnapshot)
  useEffect(() => { void controller.restore(); void summary.refresh() }, [controller, summary])
  const blocked = state.status === 'restoring' || state.status === 'submitting' || Object.values(state.actions).includes('pending')
  const retryRead = state.errorStage === 'restore' || state.error === 'conflict'
  return <Card className="space-y-3" data-testid="completion-panel">
    <h2 className="text-lg font-bold">Xác nhận bài học</h2>
    {state.status === 'restoring' && <p role="status">Đang tải xác nhận bài học…</p>}
    {state.status === 'submitting' && <p role="status">Đang xác nhận hoàn thành…</p>}
    {state.status === 'error' && <p role="alert">{errors[state.error!]}</p>}
    {state.status === 'ineligible' && <div role="status"><p>Chưa đủ điều kiện hoàn thành.</p><ul className="list-disc pl-5">{state.reasons?.map(item => <li key={item.blockId}>{labels[item.blockId] ?? 'Phần học bắt buộc'}: Chưa có xác nhận phần bắt buộc.</li>)}</ul></div>}
    {state.status === 'confirmed' && <div role="status">
      <p>{state.outcome === 'completed' ? 'Đã hoàn thành bài!' : 'Bài đã hoàn thành trước đó.'}</p>
      {state.receipt && account.value && <p>Xác nhận lúc {new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: account.value.timezone }).format(new Date(state.receipt.confirmedAt))}</p>}
    </div>}
    {state.status !== 'confirmed' && <Button disabled={blocked || state.error === 'unauthorized' || state.error === 'not_found'}
      onClick={() => state.status === 'error' && retryRead ? void controller.restore() : void controller.submit()} data-testid="confirm-lesson">
      {state.status === 'error' ? retryRead ? 'TẢI LẠI XÁC NHẬN' : 'THỬ XÁC NHẬN LẠI' : 'XÁC NHẬN HOÀN THÀNH'}
    </Button>}
    {state.status === 'confirmed' && <AccountSummaryView state={account} onRetry={() => void summary.refresh()} />}
  </Card>
}
export function DocumentAcknowledgement({ controller, blockId }: { controller: CompletionController; blockId: string }) {
  const state = useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot)
  const action = state.actions[blockId]
  return <div className="pt-3 space-y-2">
    {action && action !== 'done' && action !== 'pending' && <p role="alert">Chưa lưu được xác nhận phần đọc. Hãy thử lại.</p>}
    <Button variant="outline" disabled={state.status === 'restoring' || state.status === 'submitting' || state.status === 'confirmed' || action === 'pending' || action === 'done'}
      data-testid={`acknowledge-${blockId}`} onClick={() => void controller.acknowledge(blockId)}>
      {action === 'pending' ? 'ĐANG LƯU…' : action === 'done' ? 'ĐÃ XÁC NHẬN PHẦN ĐỌC' : state.status === 'confirmed' ? 'BÀI ĐÃ XÁC NHẬN' : 'TÔI ĐÃ ĐỌC PHẦN NÀY'}
    </Button>
  </div>
}
