import test from 'node:test'
import assert from 'node:assert/strict'
import type { User } from '@supabase/supabase-js'
import { createSupabaseAuth } from '../../src/services/supabase/auth.ts'
import { passwordRecoveryRedirect, sessionFor, type AuthClient } from '../../src/services/supabase/usernameAuth.ts'
import { createMockAccountServices } from '../../src/services/next/mockAccount.ts'
import { createMockAccountStore } from '../../src/services/next/mockAccountStore.ts'

const user = (input: Partial<User> = {}) => ({ id: 'fixture-user', user_metadata: { displayName: 'Người học' },
  app_metadata: { suchill_username: 'learner_1' }, email: 'learner_1@accounts.suchill.invalid', ...input }) as User
function clientFixture() {
  const calls: unknown[] = []
  let current = user(), response: unknown = { access_token: 'fixture-access', refresh_token: 'fixture-refresh' }, error: unknown = null
  let listener: (_event: string, session: { user: User } | null) => void = () => {}
  const client = {
    functions: { async invoke(name: string, options: unknown) { calls.push({ name, options }); return { data: response, error } } },
    auth: {
      async setSession(tokens: unknown) { calls.push({ tokens }); return { data: { session: { user: current } }, error: null } },
      async getSession() { return { data: { session: { user: current, access_token: 'fixture-access' } }, error: null } },
      onAuthStateChange(callback: typeof listener) { listener = callback; return { data: { subscription: { unsubscribe() { listener = () => {} } } } } },
      async getUser() { return { data: { user: current }, error: null } },
      async refreshSession() { calls.push('refresh'); return { data: { session: { user: current } }, error: null } },
      async signInWithPassword(input: unknown) { calls.push({ legacyLogin: input }); return { data: { user: current }, error: null } },
      async signUp(input: unknown) { calls.push({ legacySignup: input }); return { data: { user: current, session: null }, error: null } },
      async resetPasswordForEmail(email: string, options?: unknown) { calls.push({ reset: email, ...(options ? { options } : {}) }); return { error: null } },
      async updateUser(input: unknown) { calls.push({ update: input }); return { error: null } },
    },
  } as unknown as AuthClient
  return { client, calls, setUser(value: User) { current = value; listener('SIGNED_IN', { user: current }) },
    setResponse(value: unknown, nextError: unknown = null) { response = value; error = nextError } }
}

test('username signup/login let the SDK own tokens, immediately return a session and do not initiate email setup', async () => {
  const fixture = clientFixture(), auth = createSupabaseAuth(fixture.client)
  const input = { email: '', username: ' LEARNER_1 ', password: 'fixture-pass', displayName: 'Người học', timezone: 'Asia/Ho_Chi_Minh', recoveryEmail: 'inbox@example.test' }
  const result = await auth.signUp(input)
  assert.deepEqual(result, { ok: true, value: { userId: 'fixture-user', displayName: 'Người học', username: 'learner_1' } })
  assert.deepEqual(fixture.calls, [
    { name: 'account-access', options: { body: { action: 'signup', username: 'learner_1', password: 'fixture-pass', displayName: 'Người học', timezone: 'Asia/Ho_Chi_Minh' }, timeout: 25_000 } },
    { tokens: { access_token: 'fixture-access', refresh_token: 'fixture-refresh' } },
  ])
  assert.doesNotMatch(JSON.stringify(result), /token|password|accounts\.suchill/)
  fixture.calls.length = 0
  assert.deepEqual(await auth.signIn({ email: ' Learner_1 ', password: 'fixture-pass' }), result)
  assert.equal((fixture.calls[0] as { options: { body: { action: string } } }).options.body.action, 'login')
})

test('legacy email signup/login retain their SDK behavior and existing user identity', async () => {
  const fixture = clientFixture(), auth = createSupabaseAuth(fixture.client)
  fixture.setUser(user({ id: 'legacy-uuid', app_metadata: {}, email: 'legacy@example.test', email_confirmed_at: '2026-10-02T00:00:00Z' }))
  const result = await auth.signIn({ email: ' LEGACY@example.test ', password: 'fixture-pass' })
  assert.equal(result.ok && result.value.userId, 'legacy-uuid')
  assert.deepEqual(fixture.calls, [{ legacyLogin: { email: 'legacy@example.test', password: 'fixture-pass' } }])
  const input = { email: 'legacy@example.test', password: 'fixture-pass', displayName: 'Legacy', timezone: 'UTC' }
  assert.deepEqual(await auth.signUp(input), { ok: true, value: null }, 'Unconfirmed legacy signup never fabricates a session.')
  assert.equal(fixture.calls.length, 2)
})

test('malformed sessions and unsafe function errors never reach the UI or session store', async () => {
  const fixture = clientFixture(), auth = createSupabaseAuth(fixture.client), input = { email: 'learner_1', password: 'fixture-pass' }
  fixture.setResponse({ access_token: 'fixture', refresh_token: null })
  assert.deepEqual(await auth.signIn(input), { ok: false, error: 'server_error' })
  assert.equal(fixture.calls.length, 1, 'No SDK session can be set from a malformed function response.')
  fixture.setResponse(null, { context: new Response(JSON.stringify({ error: 'unauthorized', message: 'private identity' }), { status: 401 }) })
  assert.deepEqual(await auth.signIn(input), { ok: false, error: 'unauthorized' })
  fixture.setResponse({ error: 'private identity' })
  assert.deepEqual(await auth.signIn(input), { ok: false, error: 'server_error' })
  assert.deepEqual(await auth.signIn({ ...input, email: 'invalid-name' }), { ok: false, error: 'validation' })
})

test('session projection trusts server app metadata and confirmed real emails, not user-controlled metadata', () => {
  assert.deepEqual(sessionFor(user({ app_metadata: {}, user_metadata: { displayName: 'Fixture', suchill_username: 'spoofed', recoveryEmail: 'spoofed@example.test' },
    new_email: 'pending@example.test', email_confirmed_at: '2026-10-02' })),
  { userId: 'fixture-user', displayName: 'Fixture', pendingRecoveryEmail: 'pending@example.test' })
  assert.equal(sessionFor(user({ email: 'real@example.test' }))?.recoveryEmail, undefined)
  assert.equal(sessionFor(user({ email: 'real@example.test', email_confirmed_at: '2026-10-02' }))?.recoveryEmail, 'real@example.test')
})

test('username claim refreshes the SDK session and recovery setup is a separate authenticated action', async () => {
  const fixture = clientFixture(), auth = createSupabaseAuth(fixture.client)
  fixture.setResponse({ username: 'learner_1' })
  assert.equal((await auth.claimUsername!(' LEARNER_1 ')).ok, true)
  assert.equal(fixture.calls[1], 'refresh')
  fixture.calls.length = 0
  fixture.setResponse({ pendingRecoveryEmail: 'inbox@example.test' })
  fixture.setUser(user({ app_metadata: { suchill_username: 'learner_1', pending_recovery_email: 'inbox@example.test' } }))
  const result = await auth.setRecoveryEmail!(' INBOX@example.test ')
  assert.equal(result.ok && result.value.pendingRecoveryEmail, 'inbox@example.test')
  assert.deepEqual(fixture.calls, [{ name: 'account-access', options: { body: { action: 'recovery-email', email: 'inbox@example.test' }, timeout: 25_000,
    headers: { Authorization: 'Bearer fixture-access' } } }, 'refresh'])
  assert.equal(result.ok && result.value.recoveryEmail, undefined, 'Pending address never becomes confirmed from a function response.')
})

test('recovery proof refreshes the SDK and only confirmed Auth email becomes recoverable', async () => {
  const fixture = clientFixture(), auth = createSupabaseAuth(fixture.client)
  fixture.setResponse({ ok: true })
  fixture.setUser(user({ email: 'inbox@example.test', email_confirmed_at: '2026-10-02T00:00:00Z' }))
  const proof = 'a'.repeat(64)
  const result = await auth.verifyRecoveryEmail!(proof)
  assert.equal(result.ok && result.value.recoveryEmail, 'inbox@example.test')
  assert.deepEqual(fixture.calls, [{ name: 'account-access', options: { body: { action: 'verify-recovery-email', token: proof }, timeout: 25_000,
    headers: { Authorization: 'Bearer fixture-access' } } }, 'refresh'])
  assert.deepEqual(await auth.verifyRecoveryEmail!('short'), { ok: false, error: 'validation' })
  fixture.setUser(user({ app_metadata: { suchill_username: 'learner_1', pending_recovery_email: 'unconfirmed@example.test' },
    email: 'inbox@example.test', email_confirmed_at: '2026-10-02' }))
  assert.deepEqual(await auth.verifyRecoveryEmail!(proof), { ok: false, error: 'server_error' })
})

test('recovery setup binds its initiating bearer and rejects an A to B to A switch', async () => {
  const fixture = clientFixture(), auth = createSupabaseAuth(fixture.client)
  fixture.client.functions!.invoke = (async (_name: string, options: { headers: { Authorization: string } }) => {
    assert.equal(options.headers.Authorization, 'Bearer fixture-access')
    fixture.setUser(user({ id: 'different-user' }))
    fixture.setUser(user())
    return { data: { pendingRecoveryEmail: 'inbox@example.test' }, error: null }
  }) as never
  assert.deepEqual(await auth.setRecoveryEmail!('inbox@example.test'), { ok: false, error: 'unauthorized' })
})

test('reset/update wrappers reject internal email and invalid passwords before touching SDK', async () => {
  const fixture = clientFixture(), auth = createSupabaseAuth(fixture.client)
  assert.deepEqual(await auth.requestPasswordReset!('learner_1@accounts.suchill.invalid'), { ok: false, error: 'validation' })
  assert.deepEqual(await auth.updatePassword!('short'), { ok: false, error: 'validation' })
  assert.equal(fixture.calls.length, 0)
  assert.deepEqual(await auth.requestPasswordReset!('inbox@example.test'), { ok: true, value: null })
  fixture.setResponse({ updated: true })
  assert.deepEqual(await auth.updatePassword!('new-fixture-pass'), { ok: true, value: null })
  assert.deepEqual(fixture.calls, [{ reset: 'inbox@example.test' }, { name: 'account-access', options: { body: { action: 'update-password', password: 'new-fixture-pass' },
    timeout: 25_000, headers: { Authorization: 'Bearer fixture-access' } } }])
})

test('scoped auth mutations refuse a different initiating actor before sending a credential or mailbox request', async () => {
  const fixture = clientFixture(), auth = createSupabaseAuth(fixture.client), context = { expectedSubject: 'another-user' }
  for (const result of await Promise.all([
    auth.claimUsername!('learner_1', context), auth.setRecoveryEmail!('inbox@example.test', context),
    auth.verifyRecoveryEmail!('a'.repeat(64), context), auth.updatePassword!('new-fixture-pass', context),
  ])) assert.deepEqual(result, { ok: false, error: 'unauthorized' })
  assert.deepEqual(fixture.calls, [])
})

test('password recovery redirect uses only the current HTTP app origin and excludes fragments/foreign paths', () => {
  const oldWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { href: 'http://localhost:8443/some/path?other=x#private' } } })
    assert.equal(passwordRecoveryRedirect(), 'http://localhost:8443/?account=recovery')
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { href: 'file:///fixture.html' } } })
    assert.equal(passwordRecoveryRedirect(), undefined)
  } finally {
    if (oldWindow) Object.defineProperty(globalThis, 'window', oldWindow)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})

test('mock username registration, alias claim and reload preserve UUID, password and account settings', async () => {
  const store = createMockAccountStore(), session = { userId: '' }, now = () => '2026-10-02T00:00:00Z'
  let services = createMockAccountServices(store, session, now)
  const input = { email: '', username: 'First_User', password: 'fixture-pass', displayName: 'Fixture', timezone: 'UTC' }
  const created = await services.auth.signUp(input)
  assert.equal(created.ok && created.value?.username, 'first_user')
  await services.account.updateSettings({ soundMuted: true })
  assert.deepEqual(await services.auth.signUp({ ...input, password: 'different-pass' }), { ok: false, error: 'conflict' })
  await services.auth.signOut()
  services = createMockAccountServices(store, session, now)
  assert.deepEqual(await services.auth.signIn({ email: ' FIRST_USER ', password: 'fixture-pass' }), created)
  assert.equal((await services.account.getSettings()).ok, true)
  assert.deepEqual(await services.auth.claimUsername!('different_user'), { ok: false, error: 'conflict' })
  assert.equal((await services.auth.setRecoveryEmail!('recovery@example.test')).ok, true)
  assert.equal((await services.auth.getSession()).ok, true)
  const emailInput = { email: 'legacy@example.test', password: 'fixture-pass', displayName: 'Legacy', timezone: 'UTC' }
  await services.auth.signOut()
  const legacy = await services.auth.signUp(emailInput)
  const claimed = await services.auth.claimUsername!('legacy_alias')
  assert.equal(claimed.ok && claimed.value.userId, legacy.ok && legacy.value?.userId)
  await services.auth.updatePassword!('updated-fixture-pass')
  await services.auth.signOut()
  const aliasLogin = await services.auth.signIn({ email: 'legacy_alias', password: 'updated-fixture-pass' })
  assert.deepEqual(await services.auth.signIn({ email: emailInput.email, password: 'updated-fixture-pass' }), aliasLogin)
})
