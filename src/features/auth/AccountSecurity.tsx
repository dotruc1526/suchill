import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui'
import type { AuthService, AuthSession } from '../../services/next/contracts'
import { AuthField } from './AuthField'
import { useRecoveryConfirmation } from './useRecoveryConfirmation'

export type SecurityAction = 'claimUsername' | 'setRecoveryEmail' | 'updatePassword'
type Props = {
  auth: AuthService; session: AuthSession; busy: boolean
  onSubmit: (action: SecurityAction, value: string) => Promise<boolean>
  onSessionChange: (session: AuthSession) => void
}

export function AccountSecurity({ auth, session, busy, onSubmit, onSessionChange }: Props) {
  const [repeatError, setRepeatError] = useState<string>()
  const confirmation = useRecoveryConfirmation(auth, session.userId, onSessionChange)
  const submit = async (event: FormEvent<HTMLFormElement>, action: SecurityAction, field: string) => {
    event.preventDefault()
    if (busy) return
    const form = event.currentTarget
    const fields = new FormData(form)
    const value = String(fields.get(field) ?? '')
    if (action === 'updatePassword' && value !== fields.get('passwordConfirm')) {
      setRepeatError('Hai mật khẩu chưa khớp. Hãy nhập lại mật khẩu.')
      ;(form.elements.namedItem('passwordConfirm') as HTMLInputElement | null)?.focus()
      return
    }
    setRepeatError(undefined)
    if (await onSubmit(action, action === 'updatePassword' ? value : value.trim())) form.reset()
  }
  return <div className="space-y-4">
    {confirmation.state.status === 'loading' && <p role="status" className="text-sm">Đang xác nhận email khôi phục…</p>}
    {confirmation.state.status === 'confirmed' && <p role="status" className="text-sm">Email khôi phục đã được xác nhận.</p>}
    {confirmation.state.status === 'error' && <div className="space-y-2 text-sm">
      <p role="alert">Chưa xác nhận được email khôi phục. Hãy kiểm tra bạn đang đăng nhập đúng tài khoản và dùng liên kết mới nhất.</p>
      {confirmation.state.retryable && <Button type="button" variant="outline" className="w-full" disabled={busy}
        onClick={confirmation.retry}>THỬ XÁC NHẬN LẠI</Button>}
    </div>}
    <section className="space-y-3" aria-label="Tên đăng nhập">
      <h3 className="font-bold">Tên đăng nhập</h3>
      {session.username ? <p className="break-words text-sm">{session.username} · Không thể đổi tên đăng nhập này.</p>
        : auth.claimUsername ? <form className="space-y-3" aria-label="Thêm tên đăng nhập" aria-busy={busy}
          onSubmit={event => void submit(event, 'claimUsername', 'username')}>
          <p className="text-sm">Thêm tên đăng nhập để dùng thay email. Tài khoản và tiến độ hiện có được giữ nguyên.</p>
          <AuthField name="username" label="Tên đăng nhập mới" autoComplete="username" autoCapitalize="none" spellCheck={false}
            required minLength={3} maxLength={32} pattern="[A-Za-z0-9_]{3,32}" disabled={busy}
            hint="3–32 ký tự: chữ cái không dấu, số hoặc _. Tên sẽ được viết thường và chỉ được chọn một lần." />
          <Button type="submit" variant="outline" className="w-full" disabled={busy}>LƯU TÊN ĐĂNG NHẬP</Button>
        </form> : <p className="text-sm">Dịch vụ hiện chưa hỗ trợ thêm tên đăng nhập.</p>}
    </section>
    <section className="space-y-3" aria-label="Email khôi phục">
      <h3 className="font-bold">Email khôi phục (tùy chọn)</h3>
      <p className="text-sm">Email giúp lấy lại tài khoản khi quên mật khẩu. Bạn vẫn có thể học khi chưa thêm hoặc chưa xác nhận email.</p>
      {session.recoveryEmail && <p className="break-words text-sm">Email đã xác nhận: {session.recoveryEmail}</p>}
      {session.pendingRecoveryEmail && <p className="break-words text-sm" role="status">
        Đang chờ xác nhận: {session.pendingRecoveryEmail}. Hãy mở thư tại địa chỉ này để hoàn tất; email chưa dùng được để khôi phục.
      </p>}
      {session.recoveryEmail ? <p className="text-sm">Dùng email đã xác nhận ở trên khi cần khôi phục mật khẩu.</p>
        : auth.setRecoveryEmail ? <form className="space-y-3" aria-label="Thiết lập email khôi phục" aria-busy={busy}
        onSubmit={event => void submit(event, 'setRecoveryEmail', 'recoveryEmail')}>
        <AuthField name="recoveryEmail" label="Email khôi phục của bạn"
          type="email" autoComplete="email" required maxLength={254} disabled={busy} />
        <Button type="submit" variant="outline" className="w-full" disabled={busy}>GỬI EMAIL XÁC NHẬN</Button>
      </form> : <p className="text-sm">Dịch vụ hiện chưa hỗ trợ email khôi phục.</p>}
    </section>
    {auth.updatePassword && <section className="space-y-3" aria-label="Đổi mật khẩu">
      <h3 className="font-bold">Đổi mật khẩu</h3>
      <form className="space-y-3" aria-label="Đổi mật khẩu" aria-busy={busy}
        onSubmit={event => void submit(event, 'updatePassword', 'password')}>
        <AuthField name="password" label="Mật khẩu mới" type="password" autoComplete="new-password"
          required minLength={8} maxLength={128} disabled={busy} hint="Ít nhất 8 ký tự. Bạn tự chọn và gửi mật khẩu mới tại đây." />
        <AuthField name="passwordConfirm" label="Nhập lại mật khẩu mới" type="password" autoComplete="new-password"
          required minLength={8} maxLength={128} disabled={busy} error={repeatError} onInput={() => setRepeatError(undefined)} />
        <Button type="submit" variant="outline" className="w-full" disabled={busy}>LƯU MẬT KHẨU MỚI</Button>
      </form>
    </section>}
  </div>
}
