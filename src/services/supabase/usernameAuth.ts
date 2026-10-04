import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { AuthSession } from '../next/accountContracts.ts'
import { failure, success, type Result, type ServiceErrorCode } from '../next/backendContracts.ts'

export type AuthClient = Pick<SupabaseClient, 'auth'> & Partial<Pick<SupabaseClient, 'functions'>>
export const normalizeUsername = (value: string) => value.trim().toLowerCase()
export const validUsername = (value: string) => /^[a-z0-9_]{3,32}$/.test(value)
export const validPassword = (value: string) => value.length >= 8 && value.length <= 128
export const realEmail = (value: unknown): value is string => typeof value === 'string' &&
  value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !value.toLowerCase().endsWith('@accounts.suchill.invalid')
export const online = () => typeof navigator === 'undefined' || navigator.onLine !== false

export function sessionFor(user: User | null | undefined): AuthSession | null {
  if (!user) return null
  const username = user.app_metadata?.suchill_username
  const pendingEmail = realEmail(user.app_metadata?.pending_recovery_email)
    ? user.app_metadata.pending_recovery_email : user.new_email
  return {
    userId: user.id, displayName: typeof user.user_metadata?.displayName === 'string' ? user.user_metadata.displayName : '',
    ...(typeof username === 'string' && validUsername(username) ? { username } : {}),
    ...(realEmail(user.email) && user.email_confirmed_at ? { recoveryEmail: user.email } : {}),
    ...(realEmail(pendingEmail) ? { pendingRecoveryEmail: pendingEmail } : {}),
  }
}

const safeError = (value: unknown): ServiceErrorCode =>
  ['unauthorized', 'validation', 'conflict', 'offline', 'server_error'].includes(String(value))
    ? value as ServiceErrorCode : 'server_error'

/** Auth identities are resolved only by the trusted function; no mapping is delivered to the browser. */
export async function accountAccess(client: AuthClient, body: Record<string, unknown>, token?: string): Promise<Result<Record<string, unknown>>> {
  if (!online()) return failure('offline')
  const isLan = typeof window !== 'undefined' && window.location.protocol === 'http:' && /^(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)$/.test(window.location.hostname)
  const isTunnel = typeof window !== 'undefined' && window.location.hostname.endsWith('.trycloudflare.com')
  const hasGameServer = typeof window !== 'undefined' && Boolean(import.meta.env.VITE_GAME_SERVER_URL) && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'

  if (isLan || isTunnel || hasGameServer) {
    try {
      const serverUrl = (isTunnel || hasGameServer)
        ? (import.meta.env.VITE_GAME_SERVER_URL || `${window.location.origin}`)
        : `${window.location.protocol}//${window.location.hostname}:3001`
      const res = await fetch(`${serverUrl}/api/account-access`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(25_000),
        cache: 'no-store',
        credentials: 'omit',
      })
      const data = await res.json()
      if (!data || typeof data !== 'object' || Array.isArray(data)) return failure('server_error')
      if (!res.ok || (data && typeof data === 'object' && 'error' in data)) {
        return failure(data && typeof data === 'object' && 'error' in data ? safeError(data.error) : 'server_error')
      }
      return success(data as Record<string, unknown>)
    } catch {
      // fallback to invoke
    }
  }
  if (!client.functions) return failure('server_error')
  try {
    const { data, error } = await client.functions.invoke('account-access', { body, timeout: 25_000,
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}) })
    if (error) {
      let payload: unknown
      if ('context' in error && error.context instanceof Response) {
        try { payload = await error.context.json() } catch { /* Never expose response text. */ }
      }
      return failure(payload && typeof payload === 'object' && 'error' in payload ? safeError(payload.error) : 'server_error')
    }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return failure('server_error')
    if ('error' in data) return failure(safeError(data.error))
    return success(data as Record<string, unknown>)
  } catch { return failure(online() ? 'server_error' : 'offline') }
}

/** Pin the mutation to its initiating SDK subject and reject even an A→B→A account switch. */
export async function withAuthSubject<T>(client: AuthClient, operation: (token: string) => Promise<Result<T>>, expectedSubject?: string): Promise<Result<T>> {
  if (!online()) return failure('offline')
  const initial = await client.auth.getSession()
  const subject = initial.data.session?.user.id, token = initial.data.session?.access_token
  if (initial.error || !subject || !token || (expectedSubject !== undefined && subject !== expectedSubject)) return failure('unauthorized')
  let changed = false
  const { data } = client.auth.onAuthStateChange((_event, session) => {
    if (session?.user.id !== subject) changed = true
  })
  try {
    const result = await operation(token)
    const final = await client.auth.getSession()
    return changed || final.error || final.data.session?.user.id !== subject ? failure('unauthorized') : result
  } finally { data.subscription.unsubscribe() }
}

/** Use the current app origin; Auth still enforces its configured redirect allowlist. */
export function passwordRecoveryRedirect(): string | undefined {
  if (typeof window === 'undefined') return undefined
  try {
    const url = new URL(window.location.href)
    if (!['http:', 'https:'].includes(url.protocol)) return undefined
    return new URL('/?account=recovery', url.origin).toString()
  } catch { return undefined }
}

/** SDK validation, storage and refresh remain the sole owner of returned session tokens. */
export async function acceptAccessSession(client: AuthClient, payload: Record<string, unknown>): Promise<Result<AuthSession>> {
  const { access_token, refresh_token } = payload
  if (typeof access_token !== 'string' || typeof refresh_token !== 'string' || !access_token || !refresh_token ||
    access_token.length > 16_384 || refresh_token.length > 16_384) return failure('server_error')
  const { data, error } = await client.auth.setSession({ access_token, refresh_token })
  const session = sessionFor(data.session?.user)
  return error || !session ? failure('unauthorized') : success(session)
}
