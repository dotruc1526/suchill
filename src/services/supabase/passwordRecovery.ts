import type { Session } from '@supabase/supabase-js'
import type { AuthMutationContext, AuthService } from '../next/accountContracts.ts'
import { failure, success, type Result, type ServiceErrorCode } from '../next/backendContracts.ts'
import { accountAccess, online, sessionFor, validPassword, type AuthClient } from './usernameAuth.ts'

type Grant = { subject: string; epoch: number; busy: boolean; access: string; refresh: string }
type Recovery = Pick<AuthService, 'getPasswordRecoverySession' | 'subscribePasswordRecovery' | 'resetRecoveredPassword' | 'dismissPasswordRecovery'>
const trackers = new WeakMap<AuthClient, Recovery>()
const errorCode = (error: unknown): ServiceErrorCode => {
  if (!online()) return 'offline'
  const name = error && typeof error === 'object' && 'name' in error ? error.name : undefined
  if (name === 'AuthImplicitGrantRedirectError' || name === 'AuthPKCEGrantCodeExchangeError') return 'unauthorized'
  const status = error && typeof error === 'object' && 'status' in error ? Number(error.status) : undefined
  return status === 400 || status === 401 || status === 403 ? 'unauthorized' : 'server_error'
}

/** The SDK recovery event grants this page only; URL parameters and stored sessions cannot grant a reset. */
export function passwordRecoveryFor(client: AuthClient): Recovery {
  const existing = trackers.get(client)
  if (existing) return existing
  let subject: string | null | undefined, epoch = 0, grant: Grant | null = null, closed = false
  const listeners = new Set<() => void>()
  const wake = () => setTimeout(() => {
    for (const listener of listeners) { try { listener() } catch { /* A consumer cannot interrupt Auth. */ } }
  }, 0)
  const consume = (ticket: Grant | null) => {
    if (grant !== ticket) return
    closed = true
    if (!ticket) return
    grant = null; epoch += 1; wake()
  }
  // Installed before React mounts. Never await SDK work while its auth event lock is held.
  client.auth.onAuthStateChange((event, session) => {
    const next = session?.user.id ?? null
    if (event === 'PASSWORD_RECOVERY') {
      // A delayed init notification cannot reopen a dismissed or switched-account page.
      if (closed || (subject !== undefined && subject !== next)) { consume(grant); return }
      epoch += 1; subject = next
      grant = next && session?.access_token ? { subject: next, epoch, busy: false,
        access: session.access_token, refresh: session.refresh_token } : null
      wake()
    } else if (event === 'SIGNED_IN' && grant && next === grant.subject &&
      session?.access_token === grant.access && session.refresh_token === grant.refresh) {
      // The SDK reconfirms this identical stored session when its tab becomes visible again.
    } else if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || (subject !== undefined && subject !== next)) {
      epoch += 1; subject = next; grant = null; closed = true; wake()
    } else {
      subject = next
      if (event === 'TOKEN_REFRESHED' && grant && session) {
        grant.access = session.access_token; grant.refresh = session.refresh_token
      }
    }
  })
  const live = (ticket: Grant) => grant === ticket && epoch === ticket.epoch && subject === ticket.subject
  const owns = (ticket: Grant, session: Session | null) => live(ticket) && session?.user.id === ticket.subject
  const verify = async (expectedSubject?: string): Promise<Result<{ ticket: Grant; session: Session; bearer: string }>> => {
    try {
      // initialize() can resolve before its queued PASSWORD_RECOVERY notification. Yield one turn first.
      if (typeof client.auth.initialize === 'function') {
        const initial = await client.auth.initialize()
        if (initial.error) {
          const code = errorCode(initial.error)
          if (code === 'unauthorized') consume(grant)
          return failure(code)
        }
      } else { await client.auth.getSession() }
      await new Promise<void>(resolve => setTimeout(resolve, 0))
      if (!online()) return failure('offline')
      const ticket = grant
      if (!ticket || (expectedSubject !== undefined && ticket.subject !== expectedSubject)) return failure('unauthorized')
      const initial = await client.auth.getSession(), session = initial.data.session
      if (!live(ticket)) return failure('unauthorized')
      if (initial.error) {
        const code = errorCode(initial.error)
        if (code === 'unauthorized') consume(ticket)
        return failure(code)
      }
      if (!session?.access_token || !owns(ticket, session)) return failure('unauthorized')
      const bearer = session.access_token
      const verified = await client.auth.getUser(bearer)
      if (!owns(ticket, session)) return failure('unauthorized')
      if (verified.error) {
        const code = errorCode(verified.error)
        if (code === 'unauthorized') consume(ticket)
        return failure(code)
      }
      if (verified.data.user?.id !== ticket.subject) { consume(ticket); return failure('unauthorized') }
      const current = await client.auth.getSession()
      if (!live(ticket)) return failure('unauthorized')
      if (current.error) {
        const code = errorCode(current.error)
        if (code === 'unauthorized') consume(ticket)
        return failure(code)
      }
      if (!owns(ticket, current.data.session)) return failure('unauthorized')
      return success({ ticket, session: { ...session, user: verified.data.user }, bearer })
    } catch (error) { return failure(errorCode(error)) }
  }
  const recovery: Recovery = {
    async getPasswordRecoverySession() {
      const verified = await verify()
      if (!verified.ok) return verified
      if (!owns(verified.value.ticket, verified.value.session)) return failure('unauthorized')
      const session = sessionFor(verified.value.session.user)
      return session ? success(session) : failure('unauthorized')
    },
    subscribePasswordRecovery(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    async resetRecoveredPassword(password: string, context?: AuthMutationContext) {
      if (!validPassword(password)) return failure('validation')
      const ticket = grant
      if (!ticket || (context?.expectedSubject !== undefined && ticket.subject !== context.expectedSubject)) return failure('unauthorized')
      if (ticket.busy) return failure('conflict')
      ticket.busy = true
      try {
        const verified = await verify(context?.expectedSubject)
        if (!verified.ok) return verified
        if (verified.value.ticket !== ticket || !owns(ticket, verified.value.session)) return failure('unauthorized')
        const response = await accountAccess(client, { action: 'update-password', password }, verified.value.bearer)
        const current = await client.auth.getSession()
        if (!live(ticket)) return failure('unauthorized')
        if (current.error) {
          const code = errorCode(current.error)
          if (code === 'unauthorized') consume(ticket)
          return failure(code)
        }
        if (!owns(ticket, current.data.session)) return failure('unauthorized')
        if (!response.ok) {
          if (response.error === 'unauthorized') consume(ticket)
          return response
        }
        if (response.value.updated !== true) return failure('server_error')
        consume(ticket)
        return success(null)
      } catch (error) { return failure(errorCode(error)) }
      finally { ticket.busy = false }
    },
    dismissPasswordRecovery() { consume(grant) },
  }
  trackers.set(client, recovery)
  return recovery
}
