import { useCallback, useEffect, useRef, useState } from 'react'
import type { AuthService, AuthSession } from '../../services/next/accountContracts'
import { consumePasswordRecoveryCallbackSecrets } from './recoveryCallback'

type Phase = 'checking' | 'ready' | 'busy' | 'invalid' | 'retry' | 'success'
type RecoveryState = { phase: Phase; session?: AuthSession; error?: string }
type FieldErrors = { password?: string; passwordConfirm?: string }
const invalidMessage = 'Liên kết khôi phục không hợp lệ hoặc đã hết hạn. Hãy yêu cầu email khôi phục mới.'
const retryMessage = 'Chưa thể kết nối để kiểm tra liên kết. Hãy kiểm tra mạng rồi thử lại.'

export function usePasswordRecovery(auth: AuthService) {
  const [state, setState] = useState<RecoveryState>({ phase: 'checking' })
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [focusRequest, setFocusRequest] = useState(0)
  const alive = useRef(false)
  const epoch = useRef(0)
  const busy = useRef(false)
  const phase = useRef<Phase>('checking')
  const verified = useRef<AuthSession | undefined>(undefined)
  const observedSubject = useRef<string | null | undefined>(undefined)
  const change = useCallback((next: RecoveryState) => {
    if (!alive.current) return
    phase.current = next.phase
    verified.current = next.session
    setState(next)
  }, [])
  const clearFields = useCallback(() => {
    setPassword(''); setPasswordConfirm(''); setFieldErrors({})
  }, [])
  const check = useCallback(async () => {
    if (!alive.current || busy.current) return
    const ticket = ++epoch.current
    clearFields()
    change({ phase: 'checking' })
    try {
      const result = auth.getPasswordRecoverySession
        ? await auth.getPasswordRecoverySession() : { ok: false as const, error: 'unauthorized' as const }
      if (!alive.current || ticket !== epoch.current) return
      if (result.ok || (result.error !== 'offline' && result.error !== 'server_error')) consumePasswordRecoveryCallbackSecrets()
      if (result.ok) {
        observedSubject.current = result.value.userId
        change({ phase: 'ready', session: result.value })
      } else if (result.error === 'offline' || result.error === 'server_error') {
        change({ phase: 'retry', error: retryMessage })
      } else change({ phase: 'invalid', error: invalidMessage })
    } catch {
      if (!alive.current || ticket !== epoch.current) return
      change({ phase: 'retry', error: retryMessage })
    }
  }, [auth, change, clearFields])

  useEffect(() => {
    alive.current = true
    phase.current = 'checking'
    observedSubject.current = undefined
    let stopSession: (() => void) | undefined
    let stopRecovery: (() => void) | undefined
    try {
      stopSession = auth.subscribe(session => {
        if (!alive.current) return
        const subject = session?.userId ?? null
        const previous = observedSubject.current
        observedSubject.current = subject
        if (previous === undefined || previous === subject) return
        ++epoch.current
        busy.current = false
        clearFields()
        change({ phase: 'invalid', error: 'Tài khoản đã thay đổi. Hãy kiểm tra lại liên kết khôi phục.' })
        // Never restore a previous form merely because an account switches back (A→B→A).
        void check()
      })
      stopRecovery = auth.subscribePasswordRecovery?.(() => {
        if (!busy.current && phase.current !== 'success') void check()
      })
      void check()
    } catch { change({ phase: 'retry', error: retryMessage }) }
    return () => {
      alive.current = false
      ++epoch.current
      busy.current = false
      verified.current = undefined
      stopSession?.(); stopRecovery?.()
    }
  }, [auth, change, check, clearFields])

  const submit = async () => {
    const session = verified.current
    if (!alive.current || busy.current || phase.current !== 'ready' || !session) return
    const errors: FieldErrors = {}
    if (password.length < 8 || password.length > 128) errors.password = 'Mật khẩu cần từ 8 đến 128 ký tự.'
    if (passwordConfirm !== password) errors.passwordConfirm = 'Hai mật khẩu chưa khớp. Hãy nhập lại mật khẩu.'
    setFieldErrors(errors)
    if (Object.keys(errors).length) { setFocusRequest(value => value + 1); return }
    busy.current = true
    const ticket = ++epoch.current
    change({ phase: 'busy', session })
    try {
      const result = auth.resetRecoveredPassword
        ? await auth.resetRecoveredPassword(password, { expectedSubject: session.userId })
        : { ok: false as const, error: 'unauthorized' as const }
      if (!alive.current || ticket !== epoch.current) return
      busy.current = false
      if (result.ok) { clearFields(); change({ phase: 'success' }) }
      else if (result.error === 'offline' || result.error === 'server_error' || result.error === 'conflict') {
        change({ phase: 'ready', session, error: 'Chưa thể cập nhật mật khẩu. Hãy kiểm tra mạng rồi thử lại.' })
        setFocusRequest(value => value + 1)
      } else {
        clearFields()
        change({ phase: 'invalid', error: invalidMessage })
      }
    } catch {
      if (!alive.current || ticket !== epoch.current) return
      busy.current = false
      change({ phase: 'ready', session, error: 'Chưa thể cập nhật mật khẩu. Hãy kiểm tra mạng rồi thử lại.' })
      setFocusRequest(value => value + 1)
    }
  }
  return {
    ...state, password, passwordConfirm, fieldErrors, focusRequest, submit, retry: check,
    setPassword: (value: string) => { setPassword(value); setFieldErrors({}); change({ ...state, error: undefined }) },
    setPasswordConfirm: (value: string) => { setPasswordConfirm(value); setFieldErrors({}); change({ ...state, error: undefined }) },
  }
}
