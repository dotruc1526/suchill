import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import type { AuthService, AuthSession } from '../../../src/services/next/accountContracts'
import { failure, success } from '../../../src/services/next/backendContracts'
import { PasswordRecovery } from '../../../src/features/auth/PasswordRecovery'
import '../../../src/index.css'

type Outcome = 'valid' | 'missing' | 'offline' | 'server_error' | 'throw'
let outcome = (new URL(location.href).searchParams.get('fixture') ?? 'valid') as Outcome
let subject = 'owned-fixture-a'
let grant = outcome !== 'missing'
let held = false
let resetResult: 'success' | 'offline' | 'server_error' = 'success'
let settle: (() => void) | undefined
const sessions = new Set<(session: AuthSession | null) => void>()
const recovery = new Set<() => void>()
const calls: string[] = []
const session = () => ({ userId: subject, displayName: 'Tài khoản kiểm thử tên tiếng Việt rất dài '.repeat(3), username: 'owned_fixture' })
const wake = () => recovery.forEach(listener => listener())
const auth: AuthService = {
  async getSession() { return success(session()) },
  async signIn() { return failure('unauthorized') },
  async signUp() { return failure('unauthorized') },
  async signOut() { return success(null) },
  subscribe(listener) { sessions.add(listener); return () => { sessions.delete(listener) } },
  subscribePasswordRecovery(listener) { recovery.add(listener); return () => { recovery.delete(listener) } },
  async getPasswordRecoverySession() {
    const captured = subject
    await new Promise(resolve => setTimeout(resolve, 15))
    if (outcome === 'throw') throw new Error('Synthetic connection failure')
    if (outcome === 'offline' || outcome === 'server_error') return failure(outcome)
    if (!grant || outcome === 'missing' || captured !== subject) return failure('unauthorized')
    return success(session())
  },
  async resetRecoveredPassword(_password, context) {
    calls.push(context?.expectedSubject ?? '')
    const captured = subject
    if (held) await new Promise<void>(resolve => { settle = resolve })
    if (!grant || captured !== subject || context?.expectedSubject !== subject) return failure('unauthorized')
    if (resetResult !== 'success') return failure(resetResult)
    grant = false
    setTimeout(wake, 0)
    return success(null)
  },
  dismissPasswordRecovery() { grant = false },
}
let toggle: (() => void) | undefined
const controls = {
  calls, setOutcome(value: Outcome) { outcome = value },
  setResetResult(value: typeof resetResult) { resetResult = value },
  hold() { held = true },
  resolve() { held = false; settle?.(); settle = undefined },
  changeAccount(value: string) {
    subject = value; grant = false
    sessions.forEach(listener => listener(session())); wake()
  },
  grantRecovery(value: string) { subject = value; grant = true; outcome = 'valid'; wake() },
  listeners() { return sessions.size + recovery.size },
  unmount() { toggle?.() },
}
Object.assign(window, { __recoveryQA: controls })
localStorage.setItem('owned-pending-progress-proof', '[{"operationId":"fixed-owned-operation","payload":"unchanged"}]')
function Fixture() {
  const [mounted, setMounted] = useState(true)
  toggle = () => setMounted(false)
  return <main className="mx-auto max-w-md" id="main-content">
    {mounted ? <PasswordRecovery auth={auth} onDismiss={() => setMounted(false)} /> : <p id="dismissed">Đã quay về ứng dụng</p>}
  </main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><Fixture /></React.StrictMode>)
