import { useEffect, useRef, useState } from 'react'
import { failure, type AuthService, type AuthSession, type Result } from '../../services/next/backendContracts'

type Confirmation = { status: 'idle' | 'loading' } | { status: 'confirmed'; session: AuthSession }
  | { status: 'error'; retryable: boolean }
// Share the pending operation across StrictMode effects; never persist the opaque verification token.
const confirmations = new WeakMap<AuthService, Map<string, Promise<Result<AuthSession>>>>()
function recoveryToken() {
  if (typeof window === 'undefined') return undefined
  const url = new URL(window.location.href)
  return url.searchParams.get('account') === 'verify-recovery' ? url.searchParams.get('token') || undefined : undefined
}
function clearRecoveryToken(token: string) {
  const url = new URL(window.location.href)
  if (url.searchParams.get('account') !== 'verify-recovery' || url.searchParams.get('token') !== token) return
  url.searchParams.delete('token'); url.searchParams.delete('account')
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`)
}

export function useRecoveryConfirmation(auth: AuthService, userId: string, onConfirmed: (session: AuthSession) => void) {
  const [token] = useState(recoveryToken)
  const [state, setState] = useState<Confirmation>({ status: 'idle' })
  const [retry, setRetry] = useState(0)
  const callbackRef = useRef(onConfirmed)
  callbackRef.current = onConfirmed
  useEffect(() => {
    if (!token) return
    let active = true
    setState({ status: 'loading' })
    let requests = confirmations.get(auth)
    if (!requests) { requests = new Map(); confirmations.set(auth, requests) }
    const key = `${userId}:${token}`
    let request = requests.get(key)
    if (!request) {
      request = (async () => {
        const current = await auth.getSession()
        if (!current.ok) return failure<AuthSession>(current.error)
        if (current.value?.userId !== userId) return failure<AuthSession>('unauthorized')
        return auth.verifyRecoveryEmail ? await auth.verifyRecoveryEmail(token) : failure<AuthSession>('server_error')
      })().catch(() => failure<AuthSession>('server_error'))
      requests.set(key, request)
    }
    void request.then(result => {
      if (!active) return
      if (result.ok) {
        clearRecoveryToken(token)
        setState({ status: 'confirmed', session: result.value })
        callbackRef.current(result.value)
      } else {
        const retryable = result.error === 'offline' || result.error === 'server_error'
        if (!retryable) clearRecoveryToken(token)
        else requests?.delete(key)
        setState({ status: 'error', retryable })
      }
    })
    return () => { active = false }
  }, [auth, userId, token, retry])
  return { state, retry: () => setRetry(value => value + 1) }
}
