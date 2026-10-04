import { useEffect, useState } from 'react'
import { Button } from '../../../components/ui'
import { theme } from '../../../theme/tokens'
import { loadPreviewTranscript } from '../../../services/reference1954/transcript'

export function PreviewTranscript() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [failed, setFailed] = useState(false)
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (!open || text) return
    const controller = new AbortController()
    setFailed(false)
    void loadPreviewTranscript(controller.signal).then(value => {
      if (!controller.signal.aborted) setText(value)
    }).catch(() => { if (!controller.signal.aborted) setFailed(true) })
    return () => controller.abort()
  }, [open, text, retry])
  return <details data-testid="preview1954-transcript" open={open} onToggle={event => setOpen(event.currentTarget.open)}
    className="rounded-xl border p-3" style={{ borderColor: theme.colors.primary, background: theme.colors.appBg }}>
    <summary className="min-h-11 cursor-pointer py-2 font-bold" style={{ color: theme.colors.primary }}>Đọc bản chép lời</summary>
    <p className="mb-3 text-sm" style={{ color: theme.colors.textSecondary }}>Nội dung lời kể trong video · Đọc ngay tại đây khi không tiện xem hoặc nghe.</p>
    {open && (failed ? <div role="alert" className="space-y-2"><p>Chưa tải được bản chép lời. Bạn thử lại nhé.</p><Button variant="outline" onClick={() => setRetry(value => value + 1)}>THỬ LẠI</Button></div>
      : text ? <div className="whitespace-pre-wrap text-sm leading-relaxed">{text}</div>
      : <p role="status">Đang tải bản chép lời…</p>)}
  </details>
}
