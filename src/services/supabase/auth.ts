import { failure, success } from '../next/backendContracts.ts'
import type { AuthService } from '../next/accountContracts.ts'
import { passwordRecoveryFor } from './passwordRecovery.ts'
import { acceptAccessSession, accountAccess, normalizeUsername, online, passwordRecoveryRedirect, realEmail, sessionFor,
  validPassword, validUsername, withAuthSubject, type AuthClient } from './usernameAuth.ts'

/** Tokens and credential persistence are handled exclusively by the Supabase SDK. */
export function createSupabaseAuth(client: AuthClient): AuthService {
  const recovery = passwordRecoveryFor(client)
  return {
    ...recovery,
    async getSession() {
      try {
        const { data, error } = await client.auth.getSession()
        return error ? failure('unauthorized') : success(sessionFor(data.session?.user))
      } catch { return failure('server_error') }
    },
    async signIn(input) {
      if (!online()) return failure('offline')
      try {
        const identifier = input.email.trim().toLowerCase()
        if (!identifier.includes('@')) {
          if (!validUsername(identifier) || !validPassword(input.password)) return failure('validation')
          const response = await accountAccess(client, { action: 'login', username: identifier, password: input.password })
          return response.ok ? await acceptAccessSession(client, response.value) : response
        }
        // Existing email accounts retain the SDK path and the same auth.uid()/progress.
        const { data, error } = await client.auth.signInWithPassword({ email: identifier, password: input.password })
        const session = sessionFor(data.user)
        return error || !session ? failure('unauthorized') : success(session)
      } catch { return failure('server_error') }
    },
    async signUp({ email, password, displayName, timezone, username }) {
      if (!online()) return failure('offline')
      try {
        if (username !== undefined) {
          const normalized = normalizeUsername(username)
          if (!validUsername(normalized) || !validPassword(password) || !displayName.trim() || displayName.length > 80) return failure('validation')
          const response = await accountAccess(client, { action: 'signup', username: normalized, password, displayName, timezone })
          return response.ok ? await acceptAccessSession(client, response.value) : response
        }
        const { data, error } = await client.auth.signUp({ email, password, options: { data: { displayName, timezone } } })
        return error ? failure('validation') : success(data.session ? sessionFor(data.user) : null)
      } catch { return failure('server_error') }
    },
    async signOut() {
      try {
        const { error } = await client.auth.signOut()
        return error ? failure('server_error') : success(null)
      } catch { return failure('server_error') }
    },
    subscribe(listener) {
      const { data } = client.auth.onAuthStateChange((_event, session) => listener(sessionFor(session?.user)))
      return () => data.subscription.unsubscribe()
    },
    async claimUsername(username, context) {
      const normalized = normalizeUsername(username)
      if (!validUsername(normalized)) return failure('validation')
      try {
        return await withAuthSubject(client, async token => {
          const response = await accountAccess(client, { action: 'claim', username: normalized }, token)
          if (!response.ok) return response
          if (response.value.username !== normalized) return failure('server_error')
          const { data, error } = await client.auth.refreshSession()
          const session = sessionFor(data.session?.user)
          return error || !session || session.username !== normalized ? failure('server_error') : success(session)
        }, context?.expectedSubject)
      } catch { return failure('server_error') }
    },
    async setRecoveryEmail(email, context) {
      const normalized = email.trim().toLowerCase()
      if (!realEmail(normalized)) return failure('validation')
      try {
        return await withAuthSubject(client, async token => {
          const response = await accountAccess(client, { action: 'recovery-email', email: normalized }, token)
          if (!response.ok) return response
          if (response.value.pendingRecoveryEmail !== normalized) return failure('server_error')
          const { data, error } = await client.auth.refreshSession()
          const session = sessionFor(data.session?.user)
          return error || !session || session.pendingRecoveryEmail !== normalized ? failure('server_error') : success(session)
        }, context?.expectedSubject)
      } catch { return failure('server_error') }
    },
    async verifyRecoveryEmail(token, context) {
      if (!/^[a-f0-9]{64}$/.test(token)) return failure('validation')
      try {
        return await withAuthSubject(client, async bearer => {
          const response = await accountAccess(client, { action: 'verify-recovery-email', token }, bearer)
          if (!response.ok) return response
          const { data, error } = await client.auth.refreshSession()
          const session = sessionFor(data.session?.user)
          return error || !session || !session.recoveryEmail || session.pendingRecoveryEmail ? failure('server_error') : success(session)
        }, context?.expectedSubject)
      } catch { return failure('server_error') }
    },
    async requestPasswordReset(email) {
      const normalized = email.trim().toLowerCase()
      if (!realEmail(normalized)) return failure('validation')
      if (!online()) return failure('offline')
      try {
        const redirectTo = passwordRecoveryRedirect()
        const { error } = await client.auth.resetPasswordForEmail(normalized, redirectTo ? { redirectTo } : undefined)
        return error ? failure('server_error') : success(null)
      } catch { return failure('server_error') }
    },
    async updatePassword(password, context) {
      if (!validPassword(password)) return failure('validation')
      if (!online()) return failure('offline')
      try {
        return await withAuthSubject(client, async token => {
          const response = await accountAccess(client, { action: 'update-password', password }, token)
          return response.ok ? response.value.updated === true ? success(null) : failure('server_error') : response
        }, context?.expectedSubject)
      } catch { return failure('server_error') }
    },
  }
}
