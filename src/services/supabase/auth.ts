import type { SupabaseClient, User } from '@supabase/supabase-js'
import { failure, success } from '../next/contracts.ts'
import type { AuthService, AuthSession } from '../next/accountContracts.ts'

const sessionFor = (user: User | null | undefined): AuthSession | null => user
  ? { userId: user.id, displayName: typeof user.user_metadata?.displayName === 'string' ? user.user_metadata.displayName : '' }
  : null

/** Tokens and credential persistence are handled exclusively by the Supabase SDK. */
export function createSupabaseAuth(client: Pick<SupabaseClient, 'auth'>): AuthService {
  return {
    async getSession() {
      try {
        const { data, error } = await client.auth.getSession()
        return error ? failure('unauthorized') : success(sessionFor(data.session?.user))
      } catch { return failure('server_error') }
    },
    async signIn(input) {
      try {
        const { data, error } = await client.auth.signInWithPassword(input)
        const session = sessionFor(data.user)
        return error || !session ? failure('unauthorized') : success(session)
      } catch { return failure('server_error') }
    },
    async signUp({ email, password, displayName, timezone }) {
      try {
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
  }
}
