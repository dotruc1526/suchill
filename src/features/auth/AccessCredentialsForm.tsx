import { useState, type FormEvent } from 'react'
import { Button } from '../../components/ui'
import { AuthField } from './AuthField'

export type AccessMode = 'signIn' | 'signUp' | 'forgotPassword'
type Props = { mode: AccessMode; busy: boolean; onSubmit: (fields: FormData) => Promise<boolean> }

export function AccessCredentialsForm({ mode, busy, onSubmit }: Props) {
  const [repeatError, setRepeatError] = useState<string>()
  const label = mode === 'signIn' ? 'Đăng nhập' : mode === 'signUp' ? 'Tạo tài khoản' : 'Khôi phục mật khẩu'
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    const form = event.currentTarget
    const fields = new FormData(form)
    if (mode === 'signUp' && fields.get('password') !== fields.get('passwordConfirm')) {
      setRepeatError('Hai mật khẩu chưa khớp. Hãy nhập lại mật khẩu.')
      ;(form.elements.namedItem('passwordConfirm') as HTMLInputElement | null)?.focus()
      return
    }
    setRepeatError(undefined)
    if (await onSubmit(fields)) form.reset()
  }
  return <form onSubmit={event => void submit(event)} className="space-y-3" aria-label={label} aria-busy={busy}>
    {mode === 'forgotPassword' ? <>
      <p className="text-sm">Nhập email khôi phục đã xác nhận, hoặc email của tài khoản đã đăng ký trước đây.</p>
      <AuthField name="recoveryEmail" label="Email khôi phục" type="email" autoComplete="email"
        required maxLength={254} disabled={busy} />
    </> : <>
      {mode === 'signUp' ? <>
        <p className="text-sm">Không cần email để bắt đầu học. Bạn có thể thêm email khôi phục trong Hồ sơ sau.</p>
        <AuthField name="username" label="Tên đăng nhập" autoComplete="username" autoCapitalize="none" spellCheck={false}
          required minLength={3} maxLength={32} pattern="[A-Za-z0-9_]{3,32}" disabled={busy}
          hint="3–32 ký tự: chữ cái không dấu, số hoặc dấu gạch dưới (_). Tên sẽ được viết thường và không thể đổi sau khi tạo." />
        <AuthField name="displayName" label="Tên hiển thị" autoComplete="nickname" required maxLength={80} disabled={busy} />
      </> : <AuthField name="email" label="Tên đăng nhập hoặc email" autoComplete="username" autoCapitalize="none"
        spellCheck={false} required maxLength={254} disabled={busy} />}
      <AuthField name="password" label="Mật khẩu" type="password" autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'}
        required minLength={mode === 'signIn' ? 1 : 8} maxLength={128} disabled={busy}
        hint={mode === 'signUp' ? 'Ít nhất 8 ký tự. Có thể dán mật khẩu hoặc dùng trình quản lý mật khẩu.' : undefined} />
      {mode === 'signUp' && <AuthField name="passwordConfirm" label="Nhập lại mật khẩu" type="password" autoComplete="new-password"
        required minLength={8} maxLength={128} disabled={busy} error={repeatError} onInput={() => setRepeatError(undefined)} />}
    </>}
    <Button type="submit" className="w-full" disabled={busy}>
      {busy ? 'ĐANG XỬ LÝ…' : mode === 'signIn' ? 'ĐĂNG NHẬP' : mode === 'signUp' ? 'TẠO TÀI KHOẢN' : 'GỬI HƯỚNG DẪN KHÔI PHỤC'}
    </Button>
  </form>
}
