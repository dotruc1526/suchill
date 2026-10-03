import test from 'node:test'
import assert from 'node:assert/strict'
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js'
import { createSupabaseAuth } from '../../src/services/supabase/auth.ts'
import type { AuthClient } from '../../src/services/supabase/usernameAuth.ts'

const user = (id = 'recovery-a') => ({ id, app_metadata: { suchill_username: 'learner_a' },
  user_metadata: { displayName: 'Người học' }, email: 'owned@example.test', email_confirmed_at: '2026-10-02' }) as User
const session = (id = 'recovery-a', token = 'fixture-bearer-a') => ({ user: user(id), access_token: token,
  refresh_token: 'fixture-refresh', expires_in: 3600, token_type: 'bearer' }) as Session
const turn = () => new Promise<void>(resolve => setTimeout(resolve, 0))
function fixture() {
  let current: Session | null = session(), initializeError: unknown = null, userError: unknown = null
  let userHook: (() => Promise<void>) | undefined, mutationHook: (() => Promise<void>) | undefined
  let response: unknown = { updated: true }, functionError: unknown = null, initialHook: (() => void) | undefined
  const listeners = new Set<(event: AuthChangeEvent, value: Session | null) => unknown>()
  const calls: { verification: string[]; mutations: Array<{ body: Record<string, unknown>; headers: { Authorization: string } }> } = {
    verification: [], mutations: [],
  }
  let inEvent = false
  const emit = (event: AuthChangeEvent, value: Session | null = current) => {
    current = value; inEvent = true
    try { for (const listener of listeners) assert.equal(listener(event, value), undefined, 'SDK observer must not await inside its event lock.') }
    finally { inEvent = false }
  }
  const client = {
    auth: {
      async initialize() { initialHook?.(); return { error: initializeError } },
      async getSession() { return { data: { session: current }, error: null } },
      async getUser(token: string) {
        calls.verification.push(token)
        const verified = current?.user ?? null
        await userHook?.()
        return { data: { user: verified }, error: userError }
      },
      onAuthStateChange(callback: typeof listeners extends Set<infer L> ? L : never) {
        listeners.add(callback)
        return { data: { subscription: { unsubscribe() { listeners.delete(callback) } } } }
      },
    },
    functions: { async invoke(_name: string, options: typeof calls.mutations[number]) {
      calls.mutations.push(options)
      await mutationHook?.()
      return { data: response, error: functionError }
    } },
  } as unknown as AuthClient
  return { client, calls, emit, listeners, inEvent: () => inEvent,
    initError(value: unknown) { initializeError = value }, initial(fn: () => void) { initialHook = fn },
    verifyError(value: unknown) { userError = value }, verifyHook(fn?: () => Promise<void>) { userHook = fn },
    mutateHook(fn?: () => Promise<void>) { mutationHook = fn }, reply(value: unknown, error: unknown = null) { response = value; functionError = error } }
}
const forbidden = { ok: false, error: 'unauthorized' }

test('pre-mount recovery event is retained and exposed only after a matching server getUser', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY')
  const result = await auth.getPasswordRecoverySession!()
  assert.deepEqual(result, { ok: true, value: { userId: 'recovery-a', displayName: 'Người học', username: 'learner_a', recoveryEmail: 'owned@example.test' } })
  assert.deepEqual(f.calls.verification, ['fixture-bearer-a'])
  assert.doesNotMatch(JSON.stringify(result), /bearer|token|password|refresh/)
})

test('initialize resolution before queued recovery notification does not falsely reject a valid callback', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  let queued = false
  f.initial(() => { if (!queued) { queued = true; setTimeout(() => f.emit('PASSWORD_RECOVERY'), 0) } })
  assert.equal((await auth.getPasswordRecoverySession!()).ok, true)
})

test('late recovery wakes consumers outside SDK lock and one tracker is reused per client', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client), second = createSupabaseAuth(f.client)
  assert.equal(f.listeners.size, 1)
  assert.deepEqual(await auth.getPasswordRecoverySession!(), forbidden)
  let wakes = 0
  const stop = second.subscribePasswordRecovery!(() => { assert.equal(f.inEvent(), false); wakes += 1 })
  f.emit('PASSWORD_RECOVERY'); await turn()
  assert.equal(wakes, 1)
  assert.equal((await second.getPasswordRecoverySession!()).ok, true)
  stop(); f.emit('SIGNED_OUT', null); await turn()
  assert.equal(wakes, 1)
})

test('callback URL hints and an ordinary signed-in account cannot authorize recovery', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client), old = Object.getOwnPropertyDescriptor(globalThis, 'window')
  try {
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { href: 'https://app.example.test/?account=recovery&code=fixture#type=recovery&access_token=fixture' } } })
    f.emit('SIGNED_IN', session('existing-b'))
    assert.deepEqual(await auth.getPasswordRecoverySession!(), forbidden)
    assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
    assert.deepEqual(f.calls, { verification: [], mutations: [] })
  } finally { if (old) Object.defineProperty(globalThis, 'window', old); else Reflect.deleteProperty(globalThis, 'window') }
})

test('new signin session even to the same subject, signout and a different subject invalidate the grant', async () => {
  for (const [event, value] of [['SIGNED_IN', session('recovery-a', 'fixture-new-login')], ['SIGNED_OUT', null], ['USER_UPDATED', session('existing-b')]] as const) {
    const f = fixture(), auth = createSupabaseAuth(f.client)
    f.emit('PASSWORD_RECOVERY'); f.emit(event, value)
    assert.deepEqual(await auth.getPasswordRecoverySession!(), forbidden)
    assert.equal(f.calls.verification.length, 0)
  }
})

test('same-subject refresh preserves recovery while mutation retains the initiating verified bearer', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY')
  f.verifyHook(async () => { f.emit('TOKEN_REFRESHED', session('recovery-a', 'fixture-refreshed')) })
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password', { expectedSubject: 'recovery-a' }), { ok: true, value: null })
  assert.equal(f.calls.mutations[0].headers.Authorization, 'Bearer fixture-bearer-a')
  assert.deepEqual(f.calls.mutations[0].body, { action: 'update-password', password: 'new-fixture-password' })
  assert.deepEqual(await auth.getPasswordRecoverySession!(), forbidden)
})

test('A to B to A during server verification refuses mutation despite the final matching subject', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY')
  f.verifyHook(async () => { f.emit('SIGNED_IN', session('existing-b')); f.emit('SIGNED_IN', session()) })
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
  assert.equal(f.calls.mutations.length, 0)
})

test('account switch during an in-flight mutation cannot report success or retarget its bearer', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY')
  f.mutateHook(async () => { f.emit('SIGNED_IN', session('existing-b')); f.emit('SIGNED_IN', session()) })
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
  assert.equal(f.calls.mutations.length, 1)
  assert.equal(f.calls.mutations[0].headers.Authorization, 'Bearer fixture-bearer-a')
})

test('expired or mismatched server identity consumes recovery and never mutates', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY'); f.verifyError({ status: 401 })
  assert.deepEqual(await auth.getPasswordRecoverySession!(), forbidden)
  f.verifyError(null)
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
  assert.equal(f.calls.mutations.length, 0)
})

test('offline and transient server verification preserve a real grant for a later retry', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client), old = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    f.emit('PASSWORD_RECOVERY')
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: false } })
    assert.deepEqual(await auth.getPasswordRecoverySession!(), { ok: false, error: 'offline' })
    assert.equal(f.calls.verification.length, 0)
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: true } })
    f.verifyError({ status: 503 })
    assert.deepEqual(await auth.getPasswordRecoverySession!(), { ok: false, error: 'server_error' })
    f.verifyError(null)
    assert.equal((await auth.getPasswordRecoverySession!()).ok, true)
  } finally { if (old) Object.defineProperty(globalThis, 'navigator', old); else Reflect.deleteProperty(globalThis, 'navigator') }
})

test('memoized initialize failure never fabricates proof from an existing account and requires SDK reload', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client), old = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  const initial = Promise.resolve({ error: { status: 503 } })
  f.client.auth.initialize = (() => initial) as never
  try {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: false } })
    assert.deepEqual(await auth.getPasswordRecoverySession!(), { ok: false, error: 'offline' })
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: true } })
    assert.deepEqual(await auth.getPasswordRecoverySession!(), { ok: false, error: 'server_error' })
    assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
    assert.deepEqual(f.calls, { verification: [], mutations: [] })
    const reloaded = fixture(), reloadedAuth = createSupabaseAuth(reloaded.client)
    reloaded.emit('PASSWORD_RECOVERY')
    assert.equal((await reloadedAuth.getPasswordRecoverySession!()).ok, true)
  } finally { if (old) Object.defineProperty(globalThis, 'navigator', old); else Reflect.deleteProperty(globalThis, 'navigator') }
})

test('transient trusted mutation failure can retry; success consumes proof and blocks a second update', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY'); f.reply({ error: 'server_error' })
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), { ok: false, error: 'server_error' })
  f.reply({ updated: true })
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), { ok: true, value: null })
  assert.deepEqual(await auth.resetRecoveredPassword!('another-fixture-password'), forbidden)
  assert.equal(f.calls.mutations.length, 2)
})

test('concurrent reset and a mismatched rendered account cannot send a second mutation', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY')
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password', { expectedSubject: 'existing-b' }), forbidden)
  assert.deepEqual(await auth.resetRecoveredPassword!('short'), { ok: false, error: 'validation' })
  let release!: () => void
  f.verifyHook(() => new Promise<void>(resolve => { release = resolve }))
  const first = auth.resetRecoveredPassword!('new-fixture-password')
  await turn(); await turn()
  assert.deepEqual(await auth.resetRecoveredPassword!('another-fixture-password'), { ok: false, error: 'conflict' })
  release()
  assert.deepEqual(await first, { ok: true, value: null })
  assert.equal(f.calls.mutations.length, 1)
})

test('dismissal while verification is pending consumes the grant and prevents mutation', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY')
  f.verifyHook(async () => { auth.dismissPasswordRecovery!() })
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
  assert.equal(f.calls.mutations.length, 0)
  assert.deepEqual(await auth.getPasswordRecoverySession!(), forbidden)
})

test('SDK redirect and PKCE callback terminal errors are unauthorized even with status 500', async () => {
  for (const name of ['AuthImplicitGrantRedirectError', 'AuthPKCEGrantCodeExchangeError']) {
    const f = fixture(), auth = createSupabaseAuth(f.client)
    f.initError({ name, status: 500, message: 'fixture private callback details' })
    const result = await auth.getPasswordRecoverySession!()
    assert.deepEqual(result, forbidden)
    assert.doesNotMatch(JSON.stringify(result), /private|callback|500/)
    assert.equal(f.calls.verification.length, 0)
  }
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.initError({ name: 'AuthRetryableFetchError', status: 500 })
  assert.deepEqual(await auth.getPasswordRecoverySession!(), { ok: false, error: 'server_error' })
})

test('dismiss before a delayed recovery notification cannot reopen the reset page', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.initial(() => { setTimeout(() => f.emit('PASSWORD_RECOVERY'), 0) })
  auth.dismissPasswordRecovery!()
  assert.deepEqual(await auth.getPasswordRecoverySession!(), forbidden)
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
  assert.equal(f.calls.mutations.length, 0)
})

test('a delayed recovery event cannot rearm after B login or an A to B to A switch', async () => {
  for (const backToA of [false, true]) {
    const f = fixture(), auth = createSupabaseAuth(f.client)
    f.emit('SIGNED_IN', session('existing-b'))
    if (backToA) f.emit('SIGNED_IN', session())
    f.emit('PASSWORD_RECOVERY', session())
    assert.deepEqual(await auth.getPasswordRecoverySession!(), forbidden)
    assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
    assert.deepEqual(f.calls, { verification: [], mutations: [] })
  }
})

test('returning to the tab with an identical SDK session preserves recovery, including after refresh', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY'); f.emit('SIGNED_IN', session())
  assert.equal((await auth.getPasswordRecoverySession!()).ok, true)
  const refreshed = session('recovery-a', 'fixture-refreshed')
  f.emit('TOKEN_REFRESHED', refreshed); f.emit('SIGNED_IN', refreshed)
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), { ok: true, value: null })
  assert.equal(f.calls.mutations[0].headers.Authorization, 'Bearer fixture-refreshed')
  f.emit('PASSWORD_RECOVERY', refreshed)
  assert.deepEqual(await auth.resetRecoveredPassword!('another-fixture-password'), forbidden, 'A duplicate recovery event cannot recreate a consumed successful grant.')
})

test('server getUser returning another subject with no error consumes the proof and rejects reset', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY')
  f.client.auth.getUser = (async () => ({ data: { user: user('existing-b') }, error: null })) as never
  assert.deepEqual(await auth.getPasswordRecoverySession!(), forbidden)
  f.client.auth.getUser = (async () => ({ data: { user: user() }, error: null })) as never
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
  assert.equal(f.calls.mutations.length, 0)
})

test('a transient final getSession error with null session retains grant and stays retryable', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY')
  let reads = 0, failFinal = true
  f.client.auth.getSession = (async () => {
    reads += 1
    return failFinal && reads === 2 ? { data: { session: null }, error: { status: 503 } }
      : { data: { session: session() }, error: null }
  }) as never
  assert.deepEqual(await auth.getPasswordRecoverySession!(), { ok: false, error: 'server_error' })
  failFinal = false
  assert.equal((await auth.getPasswordRecoverySession!()).ok, true)
})

test('a new recovery event arriving during verification invalidates the old mutation ticket', async () => {
  const f = fixture(), auth = createSupabaseAuth(f.client)
  f.emit('PASSWORD_RECOVERY')
  f.verifyHook(async () => { f.emit('PASSWORD_RECOVERY') })
  assert.deepEqual(await auth.resetRecoveredPassword!('new-fixture-password'), forbidden)
  assert.equal(f.calls.mutations.length, 0)
})
