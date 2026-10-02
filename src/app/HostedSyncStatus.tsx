import { useState } from 'react'
import { Button } from '../components/ui'
import { theme } from '../theme/tokens'

export function HostedSyncStatus({ pending, rejected, syncError, onRetry, onDiscard }: {
  pending: number; rejected: number; syncError: boolean
  onRetry: () => Promise<void>; onDiscard: () => Promise<void>
}) {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  if (!pending && !syncError && !failed) return null
  const perform = async (action: () => Promise<void>) => {
    if (busy) return
    setBusy(true); setFailed(false)
    try { await action() } catch { setFailed(true) }
    finally { setBusy(false) }
  }
  return <section aria-label="Đồng bộ tiến độ" className="space-y-2 px-4 py-2 text-sm" style={{ color: theme.colors.textPrimary }}>
    <p role="status">{pending} thay đổi đang chờ đồng bộ. XP chỉ được ghi nhận sau khi máy chủ xác nhận.</p>
    {(syncError || failed) && <p role="alert">Chưa đồng bộ được tiến độ. Hãy kết nối mạng và thử lại.</p>}
    {rejected > 0 && <p role="alert">{rejected} thay đổi đã bị từ chối. Bạn có thể bỏ những thay đổi này và tải lại tiến độ đã xác nhận.</p>}
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" disabled={busy} onClick={() => void perform(onRetry)}>{busy ? 'ĐANG ĐỒNG BỘ…' : 'THỬ ĐỒNG BỘ LẠI'}</Button>
      {rejected > 0 && <Button variant="outline" disabled={busy} onClick={() => void perform(onDiscard)}>BỎ THAY ĐỔI BỊ TỪ CHỐI</Button>}
    </div>
  </section>
}
