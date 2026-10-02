import { useEffect, useRef, useState } from 'react'
import type { AuthSession, LearningServices, ServiceErrorCode } from '../../services/next/contracts'
import type { AccessMode } from './AccessCredentialsForm'
import type { SecurityAction } from './AccountSecurity'

type SessionState = { status: 'loading' } | { status: 'error'; error: ServiceErrorCode }
  | { status: 'ready'; session: AuthSession | null; services: LearningServices }

export function accountAccessError(error: ServiceErrorCode, action?: SecurityAction | AccessMode) {
  if (error === 'offline') return 'Chưa có kết nối. Hãy kết nối mạng rồi thử lại.'
  if (action === 'setRecoveryEmail' && error === 'server_error') return 'Chưa gửi được email khôi phục. Dịch vụ gửi email cần được cấu hình; tài khoản vẫn dùng được để học.'
  if (error === 'unauthorized') return 'Chưa đăng nhập được. Kiểm tra tên đăng nhập hoặc email và mật khẩu. Tài khoản đăng ký bằng email trước đây cần được xác nhận email.'
  if (error === 'validation') return 'Kiểm tra các thông tin đã nhập. Tên đăng nhập cần 3–32 chữ cái không dấu, số hoặc _; mật khẩu mới cần ít nhất 8 ký tự.'
  if (error === 'conflict') return 'Thông tin này đã được sử dụng hoặc tài khoản đã thay đổi. Hãy kiểm tra lại tên đăng nhập và email.'
  return 'Chưa thể thực hiện yêu cầu. Hãy thử lại.'
}

export function useAccountAccess(services: LearningServices, onAccountChange?: () => void) {
  const [state, setState] = useState<SessionState>({ status: 'loading' })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string>()
  const [error, setError] = useState<ServiceErrorCode>()
  const [errorAction, setErrorAction] = useState<SecurityAction | AccessMode>()
  const [retry, setRetry] = useState(0)
  const activeRef = useRef<LearningServices | undefined>(services)
  const requestRef = useRef<LearningServices | undefined>(undefined)
  const callbackRef = useRef(onAccountChange)
  activeRef.current = services
  callbackRef.current = onAccountChange
  useEffect(() => {
    let active = true
    let sessionRevision = 0
    activeRef.current = services
    requestRef.current = undefined
    setState({ status: 'loading' }); setBusy(false); setMessage(undefined); setError(undefined); setErrorAction(undefined)
    const unsubscribe = services.auth.subscribe(session => {
      if (!active) return
      sessionRevision += 1
      setState({ status: 'ready', session, services })
      setTimeout(() => { if (active) callbackRef.current?.() }, 0)
    })
    const initialRevision = sessionRevision
    void services.auth.getSession().then(result => {
      if (active && sessionRevision === initialRevision) setState(result.ok ? { status: 'ready', session: result.value, services } : { status: 'error', error: result.error })
    }).catch(() => { if (active && sessionRevision === initialRevision) setState({ status: 'error', error: 'server_error' }) })
    return () => { active = false; if (activeRef.current === services) activeRef.current = undefined; unsubscribe() }
  }, [services, retry])
  const clearNotice = () => { setError(undefined); setMessage(undefined); setErrorAction(undefined) }
  const acceptSession = (session: AuthSession) => {
    if (activeRef.current !== services || state.status !== 'ready' || state.session?.userId !== session.userId) return
    setState({ status: 'ready', session, services })
    callbackRef.current?.()
  }
  const start = () => {
    if (activeRef.current !== services || requestRef.current === services) return false
    requestRef.current = services
    setBusy(true); clearNotice()
    return true
  }
  const finish = () => {
    if (activeRef.current !== services) return false
    requestRef.current = undefined
    setBusy(false)
    return true
  }
  const credentials = async (mode: AccessMode, fields: FormData) => {
    if (!start()) return false
    setErrorAction(mode)
    try {
      if (mode === 'forgotPassword') {
        if (!services.auth.requestPasswordReset) { finish(); setError('server_error'); return false }
        const result = await services.auth.requestPasswordReset(String(fields.get('recoveryEmail') ?? '').trim())
        if (!finish()) return false
        if (!result.ok) { setError(result.error); return false }
        setMessage('Nếu email này thuộc tài khoản đã xác nhận, hướng dẫn khôi phục đã được gửi. Hãy kiểm tra cả thư rác.')
        return true
      }
      const password = String(fields.get('password') ?? '')
      const result = mode === 'signIn'
        ? await services.auth.signIn({ email: String(fields.get('email') ?? '').trim(), password })
        : await services.auth.signUp({ email: '', username: String(fields.get('username') ?? '').trim().toLowerCase(), password,
          displayName: String(fields.get('displayName') ?? '').trim(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })
      if (!finish()) return false
      if (!result.ok) { setError(result.error); return false }
      setState({ status: 'ready', session: result.value, services })
      setMessage(result.value ? 'Đã đăng nhập. Bạn có thể bắt đầu học và thêm email khôi phục trong Hồ sơ.'
        : 'Chưa mở được phiên đăng nhập. Hãy thử đăng nhập bằng tên đăng nhập và mật khẩu vừa tạo.')
      callbackRef.current?.()
      return true
    } catch { if (finish()) setError('server_error'); return false }
  }
  const security = async (action: SecurityAction, value: string) => {
    const actorId = state.status === 'ready' ? state.session?.userId : undefined
    if (!start()) return false
    setErrorAction(action)
    try {
      const owner = await services.auth.getSession()
      if (activeRef.current !== services) return false
      if (!owner.ok || !actorId || owner.value?.userId !== actorId) {
        finish(); setError(owner.ok ? 'unauthorized' : owner.error); return false
      }
      const result = await (action === 'claimUsername' ? services.auth.claimUsername?.(value)
        : action === 'setRecoveryEmail' ? services.auth.setRecoveryEmail?.(value) : services.auth.updatePassword?.(value))
      if (!result) { finish(); setError('server_error'); return false }
      if (activeRef.current !== services) return false
      if (!result.ok) { finish(); setError(result.error); return false }
      const current = await services.auth.getSession()
      if (!finish()) return false
      if (current.ok) setState({ status: 'ready', session: current.value, services })
      const notice = action === 'claimUsername' ? 'Đã lưu tên đăng nhập. Tài khoản và tiến độ hiện có được giữ nguyên.'
        : action === 'setRecoveryEmail' ? 'Đã yêu cầu xác nhận email khôi phục. Hãy kiểm tra hộp thư; bạn vẫn có thể tiếp tục học.'
          : 'Đã đổi mật khẩu. Hãy dùng mật khẩu mới cho lần đăng nhập tiếp theo.'
      setMessage(current.ok ? notice : `${notice} Chưa tải lại được thông tin tài khoản; hãy thử tải lại.`)
      callbackRef.current?.()
      return true
    } catch { if (finish()) setError('server_error'); return false }
  }
  const signOut = async () => {
    if (!start()) return
    try {
      const result = await services.auth.signOut()
      if (!finish()) return
      if (!result.ok) { setError(result.error); return }
      setState({ status: 'ready', session: null, services })
      callbackRef.current?.()
    } catch { if (finish()) setError('server_error') }
  }
  return { state, busy, message, error, errorAction, credentials, security, signOut, clearNotice, acceptSession, retry: () => setRetry(value => value + 1) }
}
