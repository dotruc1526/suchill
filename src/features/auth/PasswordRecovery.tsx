import { useEffect, useId, useRef, type FormEvent } from 'react'
import { Button, Card } from '../../components/ui'
import type { AuthService } from '../../services/next/accountContracts'
import { theme } from '../../theme/tokens'
import { AuthField } from './AuthField'
import { clearPasswordRecoveryCallback, hasPasswordRecoveryCallbackSecrets } from './recoveryCallback'
import { usePasswordRecovery } from './usePasswordRecovery'

type Props = { auth: AuthService; onDismiss: () => void }

export function PasswordRecovery({ auth, onDismiss }: Props) {
  const recovery = usePasswordRecovery(auth)
  const passwordId = useId()
  const repeatId = useId()
  const summary = useRef<HTMLDivElement>(null)
  useEffect(() => { if (recovery.focusRequest) summary.current?.focus() }, [recovery.focusRequest])
  const dismiss = () => {
    if (recovery.phase === 'busy') return
    try { auth.dismissPasswordRecovery?.() }
    finally { clearPasswordRecoveryCallback(); onDismiss() }
  }
  const submit = (event: FormEvent) => { event.preventDefault(); void recovery.submit() }
  const active = recovery.phase === 'ready' || recovery.phase === 'busy'
  const errors = Object.entries(recovery.fieldErrors)
  return <section className="p-4 space-y-4" aria-labelledby="recovery-title"
    style={{ color: theme.colors.textPrimary, paddingBottom: `max(${theme.spacing.base}, env(safe-area-inset-bottom))` }}>
    <h1 id="recovery-title" className="font-bold text-xl">Đặt lại mật khẩu</h1>
    <Card className="space-y-4 min-w-0">
      {recovery.phase === 'checking' && <p role="status">Đang kiểm tra liên kết khôi phục…</p>}
      {recovery.phase === 'success' && <div role="status" className="space-y-3">
        <h2 className="text-lg font-bold">Đã đổi mật khẩu thành công</h2>
        <p>Bạn có thể dùng mật khẩu mới cho những lần đăng nhập tiếp theo. Tiến độ học vẫn được giữ nguyên.</p>
      </div>}
      {(recovery.phase === 'invalid' || recovery.phase === 'retry') && <p role="alert">{recovery.error}</p>}
      {recovery.phase === 'retry' && <>
        <Button type="button" className="w-full" onClick={() => void recovery.retry()}>THỬ LẠI</Button>
        {hasPasswordRecoveryCallbackSecrets() && <Button type="button" variant="outline" className="w-full"
          onClick={() => window.location.reload()}>TẢI LẠI LIÊN KẾT</Button>}
      </>}
      {active && <form noValidate onSubmit={submit} className="space-y-4" aria-label="Đặt lại mật khẩu" aria-busy={recovery.phase === 'busy'}>
        <p className="text-sm break-words">Tài khoản đã xác minh: <strong>{recovery.session?.displayName}</strong></p>
        {(errors.length > 0 || recovery.error) && <div ref={summary} role="alert" tabIndex={-1}
          className="space-y-2 rounded-sm border p-3 focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ borderColor: theme.colors.primary, outlineColor: theme.colors.primary }}>
          <h2 className="font-bold">Chưa thể đổi mật khẩu</h2>
          {recovery.error && <p>{recovery.error}</p>}
          {errors.length > 0 && <ul className="list-disc pl-5 space-y-1">{errors.map(([key, message]) =>
            <li key={key}><a className="underline" href={`#${key === 'password' ? passwordId : repeatId}`} onClick={event => {
              const field = document.getElementById(key === 'password' ? passwordId : repeatId)
              if (field) { event.preventDefault(); field.focus() }
            }}>{message}</a></li>)}</ul>}
        </div>}
        <AuthField id={passwordId} name="password" label="Mật khẩu mới" type="password" autoComplete="new-password"
          required minLength={8} maxLength={128} value={recovery.password} disabled={recovery.phase === 'busy'}
          error={recovery.fieldErrors.password} onChange={event => recovery.setPassword(event.target.value)} />
        <p className="text-sm" style={{ color: theme.colors.textSecondary }}>Dùng từ 8 đến 128 ký tự. Bạn có thể dán hoặc dùng trình quản lý mật khẩu.</p>
        <AuthField id={repeatId} name="passwordConfirm" label="Nhập lại mật khẩu mới" type="password" autoComplete="new-password"
          required minLength={8} maxLength={128} value={recovery.passwordConfirm} disabled={recovery.phase === 'busy'}
          error={recovery.fieldErrors.passwordConfirm} onChange={event => recovery.setPasswordConfirm(event.target.value)} />
        <Button type="submit" className="w-full" disabled={recovery.phase === 'busy'}>
          {recovery.phase === 'busy' ? 'ĐANG CẬP NHẬT…' : 'LƯU MẬT KHẨU MỚI'}
        </Button>
      </form>}
      <Button type="button" variant="outline" className="w-full" disabled={recovery.phase === 'busy'} onClick={dismiss}>
        {recovery.phase === 'success' ? 'TIẾP TỤC HỌC' : 'QUAY VỀ SỬ CHILL'}
      </Button>
    </Card>
  </section>
}
