const callbackKeys = [
  'access_token', 'refresh_token', 'token', 'token_hash', 'token_type', 'expires_in', 'expires_at',
  'code', 'type', 'error', 'error_code', 'error_description', 'provider_token', 'provider_refresh_token',
]

/** A route hint only. The Auth adapter alone decides whether a recovery grant exists. */
export function isPasswordRecoveryCallback(): boolean {
  if (typeof window === 'undefined') return false
  const url = new URL(window.location.href)
  return url.searchParams.get('account') === 'recovery'
    || new URLSearchParams(url.hash.slice(1)).get('type') === 'recovery'
}

function cleanCallback(removeMarker: boolean): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const fragment = new URLSearchParams(url.hash.slice(1))
  const recovery = url.searchParams.get('account') === 'recovery' || fragment.get('type') === 'recovery'
  if (!recovery) return
  if (!removeMarker && !url.searchParams.has('account')) url.searchParams.set('account', 'recovery')
  if (removeMarker && url.searchParams.get('account') === 'recovery') url.searchParams.delete('account')
  let fragmentChanged = false
  for (const key of callbackKeys) {
    url.searchParams.delete(key)
    if (fragment.has(key)) { fragment.delete(key); fragmentChanged = true }
  }
  if (fragmentChanged) url.hash = fragment.toString()
  window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
}

/** Call only after the adapter has consumed or rejected the SDK callback. */
export function consumePasswordRecoveryCallbackSecrets(): void { cleanCallback(false) }
/** Keep unrelated routes/query/fragment parameters intact on dismissal. */
export function clearPasswordRecoveryCallback(): void { cleanCallback(true) }

/** A reload option for a failed initial exchange; never authorizes a reset. */
export function hasPasswordRecoveryCallbackSecrets(): boolean {
  if (typeof window === 'undefined' || !isPasswordRecoveryCallback()) return false
  const url = new URL(window.location.href)
  const fragment = new URLSearchParams(url.hash.slice(1))
  return ['code', 'access_token', 'refresh_token', 'token', 'token_hash'].some(key =>
    url.searchParams.has(key) || fragment.has(key))
}
