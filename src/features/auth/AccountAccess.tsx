import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button, Card, ErrorState, LoadingState } from '../../components/ui'
import type { AuthSession, LearningServices, ServiceErrorCode } from '../../services/next/contracts'
import { theme } from '../../theme/tokens'

type SessionState = { status: 'loading' } | { status: 'error'; error: ServiceErrorCode }
  | { status: 'ready'; session: AuthSession | null; services: LearningServices }
const inputStyle = { background: theme.colors.cardBg, color: theme.colors.textPrimary, borderColor: theme.colors.borderMedium }
const errorMessage = (error: ServiceErrorCode) => error === 'offline' ? 'Chưa có kết nối. Hãy kết nối mạng rồi thử lại.'
  : error === 'unauthorized' ? 'Email hoặc mật khẩu chưa đúng.'
    : error === 'validation' ? 'Kiểm tra email, mật khẩu và tên hiển thị.' : 'Chưa thể thực hiện yêu cầu. Hãy thử lại.'

export function AccountAccess({ services, onAccountChange }: { services: LearningServices; onAccountChange?: () => void }) {
  const [state, setState] = useState<SessionState>({ status: 'loading' })
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string>()
  const [error, setError] = useState<ServiceErrorCode>()
  const [retry, setRetry] = useState(0)
  const activeRef = useRef<LearningServices | undefined>(services)
  const callbackRef = useRef(onAccountChange)
  activeRef.current = services
  callbackRef.current = onAccountChange
  useEffect(() => {
    let active = true
    let sessionRevision = 0
    activeRef.current = services
    setState({ status: 'loading' }); setBusy(false); setMessage(undefined); setError(undefined)
    const unsubscribe = services.auth.subscribe(session => {
      if (!active) return
      sessionRevision += 1
      setState({ status: 'ready', session, services })
      setTimeout(() => { if (active) callbackRef.current?.() }, 0)
    })
    const initialRevision = sessionRevision
    void services.auth.getSession().then(result => {
      if (active && sessionRevision === initialRevision) setState(result.ok ? { status: 'ready', session: result.value, services } : { status: 'error', error: result.error })
    }).catch(() => { if (active) setState({ status: 'error', error: 'server_error' }) })
    return () => { active = false; if (activeRef.current === services) activeRef.current = undefined; unsubscribe() }
  }, [services, retry])
  const request = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy) return
    const form = event.currentTarget
    const fields = new FormData(form)
    const credentials = { email: String(fields.get('email') ?? '').trim(), password: String(fields.get('password') ?? '') }
    setBusy(true); setError(undefined); setMessage(undefined)
    try {
      const result = mode === 'signIn' ? await services.auth.signIn(credentials) : await services.auth.signUp({ ...credentials,
        displayName: String(fields.get('displayName') ?? '').trim(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })
      if (activeRef.current !== services) return
      setBusy(false)
      if (!result.ok) { setError(result.error); return }
      form.reset()
      setState({ status: 'ready', session: result.value, services })
      setMessage(result.value ? 'Đã đăng nhập. Tiến độ sẽ được lưu theo tài khoản.' : 'Tài khoản đã được tạo. Kiểm tra email xác nhận rồi đăng nhập.')
      callbackRef.current?.()
    } catch { if (activeRef.current === services) { setBusy(false); setError('server_error') } }
  }
  const signOut = async () => {
    if (busy) return
    setBusy(true); setError(undefined); setMessage(undefined)
    try {
      const result = await services.auth.signOut()
      if (activeRef.current !== services) return
      setBusy(false)
      if (!result.ok) { setError(result.error); return }
      setState({ status: 'ready', session: null, services })
      callbackRef.current?.()
    } catch { if (activeRef.current === services) { setBusy(false); setError('server_error') } }
  }
  if (state.status === 'loading' || state.status === 'ready' && state.services !== services) return <LoadingState message="Đang kiểm tra tài khoản..." />
  if (state.status === 'error') return <ErrorState message={errorMessage(state.error)} onRetry={() => setRetry(value => value + 1)} />
  return <Card data-testid="account-access">
    <div className="space-y-3">
      <h2 className="text-lg font-bold">Tài khoản học tập</h2>
      {message && <p role="status" className="text-sm">{message}</p>}
      {error && <p role="alert" className="text-sm">{errorMessage(error)}</p>}
      {state.session ? <>
        <p className="text-sm">Đang đăng nhập: {state.session.displayName}</p>
        <Button variant="outline" className="min-h-11 w-full" disabled={busy} onClick={() => void signOut()}>{busy ? 'ĐANG ĐĂNG XUẤT…' : 'ĐĂNG XUẤT'}</Button>
      </> : <>
        <p className="text-sm">Đăng nhập để tiếp tục đúng vị trí và lưu XP, streak trên các thiết bị.</p>
        <form onSubmit={event => void request(event)} className="space-y-3" aria-label={mode === 'signIn' ? 'Đăng nhập' : 'Tạo tài khoản'}>
          {mode === 'signUp' && <label className="block space-y-1 text-sm"><span>Tên hiển thị</span><input name="displayName" autoComplete="nickname" required maxLength={80} disabled={busy} className="min-h-11 w-full rounded-sm border px-3" style={inputStyle} /></label>}
          <label className="block space-y-1 text-sm"><span>Email</span><input name="email" type="email" autoComplete="email" required maxLength={254} disabled={busy} className="min-h-11 w-full rounded-sm border px-3" style={inputStyle} /></label>
          <label className="block space-y-1 text-sm"><span>Mật khẩu</span><input name="password" type="password" autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'} required minLength={mode === 'signIn' ? 1 : 8} maxLength={128} disabled={busy} className="min-h-11 w-full rounded-sm border px-3" style={inputStyle} /></label>
          <Button type="submit" className="min-h-11 w-full" disabled={busy}>{busy ? 'ĐANG XỬ LÝ…' : mode === 'signIn' ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN'}</Button>
        </form>
        <Button variant="outline" className="min-h-11 w-full" disabled={busy} onClick={() => { setMode(mode === 'signIn' ? 'signUp' : 'signIn'); setMessage(undefined); setError(undefined) }}>{mode === 'signIn' ? 'CHƯA CÓ TÀI KHOẢN? ĐĂNG KÝ' : 'ĐÃ CÓ TÀI KHOẢN? ĐĂNG NHẬP'}</Button>
      </>}
    </div>
  </Card>
}
