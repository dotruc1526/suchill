import test from 'node:test'
import assert from 'node:assert/strict'
import { createSupabaseAuth } from '../../src/services/supabase/auth.ts'
import { createSupabaseLearningServices } from '../../src/services/supabase/services.ts'
import { createAccountReader } from '../../src/services/supabase/accountReads.ts'
import { createLearningRpc } from '../../src/services/supabase/rpc.ts'
import { scopeLearningServices } from '../../src/services/offline/accountScope.ts'
import { createAuthHarness, memoryStorage, requireSuccess } from './harness.mjs'

test('hosted Auth and application account adapters', { timeout: 180_000 }, async t => {
  const harness = await createAuthHarness()
  t.after(() => harness.cleanup())
  const publicConfig = { url: harness.config.url, publishableKey: harness.config.publishableKey }
  const sdk = harness.client(), services = createSupabaseLearningServices(sdk, publicConfig)
  const a = await harness.provision('A'), b = await harness.provision('B')
  const login = async user => requireSuccess(await services.auth.signIn(user), 'Sign-in')

  await t.test('unconfirmed signup rejects password login; one-use generated confirmation establishes identity', async () => {
    const pending = await harness.provision('Confirmation', false)
    const confirmingSdk = harness.client(), auth = createSupabaseAuth(confirmingSdk)
    const before = await harness.admin.auth.admin.getUserById(pending.id)
    assert.ok(!before.error && !before.data.user.email_confirmed_at, 'Fixture starts unconfirmed')
    const denied = await auth.signIn(pending)
    assert.ok(!denied.ok && denied.error === 'unauthorized', 'Unconfirmed password sign-in must fail')
    assert.equal(requireSuccess(await auth.getSession(), 'Unconfirmed session'), null)
    const verified = await confirmingSdk.auth.verifyOtp({ type: 'signup', token_hash: pending.properties.hashed_token })
    assert.ok(!verified.error && !!verified.data.session, 'Generated confirmation token must establish a real session')
    assert.equal(requireSuccess(await auth.getSession(), 'Confirmed session').userId, pending.id)
    const after = await harness.admin.auth.admin.getUserById(pending.id)
    assert.ok(!after.error && !!after.data.user.email_confirmed_at, 'Auth server records confirmation')
    const replay = await harness.client().auth.verifyOtp({ type: 'signup', token_hash: pending.properties.hashed_token })
    assert.ok(!!replay.error, 'A confirmation token cannot be consumed twice')
    await auth.signOut()
    assert.equal(requireSuccess(await auth.signIn(pending), 'Confirmed password sign-in').userId, pending.id)
  })

  await t.test('public signup validation and duplicate-confirmed null-session responses stay logged out', async () => {
    const signupSdk = harness.client(), auth = createSupabaseAuth(signupSdk)
    const invalid = await auth.signUp({ email: 'invalid-email', password: a.password,
      displayName: 'Invalid test', timezone: 'Asia/Ho_Chi_Minh' })
    assert.ok(!invalid.ok && invalid.error === 'validation', 'Real signup validation maps safely')
    // GoTrue confirmed-duplicate path returns before sendConfirmation; no outbound email.
    const duplicate = await auth.signUp({ ...a, displayName: 'Repeated test', timezone: 'Asia/Ho_Chi_Minh' })
    assert.equal(requireSuccess(duplicate, 'Duplicate confirmed signup'), null)
    assert.equal(requireSuccess(await auth.getSession(), 'Signup session'), null)
    assert.equal(requireSuccess(await auth.signIn(a), 'Original password').userId, a.id)
  })

  await t.test('password sign-in provisions authoritative profile/settings through Auth trigger', async () => {
    assert.deepEqual(await login(a), { userId: a.id, displayName: a.displayName })
    const invalid = await services.auth.signIn({ email: a.email, password: 'Invalid-test-password-9!' })
    assert.ok(!invalid.ok && invalid.error === 'unauthorized', 'Wrong password cannot authenticate')
    const profile = requireSuccess(await services.users.getCurrentProfile(), 'Profile')
    const settings = requireSuccess(await services.account.getSettings(), 'Settings')
    const summary = requireSuccess(await services.account.getSummary(), 'Summary')
    assert.equal(profile.id, a.id)
    assert.equal(profile.displayName, a.displayName)
    assert.equal(settings.timezone, 'Asia/Ho_Chi_Minh')
    assert.equal(summary.userId, a.id)
    assert.equal(summary.totalXp, 0)
  })

  await t.test('SDK-owned persisted session survives client disposal/recreation without credentials in domain DTO', async () => {
    const storage = memoryStorage(), first = harness.client(storage), auth = createSupabaseAuth(first)
    requireSuccess(await auth.signIn(a), 'Persisted sign-in')
    const storageKey = storage.keys()[0]
    assert.ok(storage.keys().includes(storageKey), 'SDK stored its session in the configured storage')
    await harness.dispose(first)
    const restored = harness.restoredClient(storage, storageKey), restoredAuth = createSupabaseAuth(restored)
    assert.deepEqual(requireSuccess(await restoredAuth.getSession(), 'Restored session'), { userId: a.id, displayName: a.displayName })
    const profile = requireSuccess(await createSupabaseLearningServices(restored, publicConfig).users.getCurrentProfile(), 'Restored profile')
    assert.equal(profile.id, a.id, 'Persisted JWT performs an actual authorized RPC')
    requireSuccess(await restoredAuth.signOut(), 'Restored sign-out')
    assert.ok(!storage.keys().includes(storageKey), 'SDK clears persisted credential on sign-out')
  })

  await t.test('real refresh rotates tokens, preserves actor, emits event and keeps authenticated reads working', async () => {
    await login(a)
    const events = [], unsubscribe = services.auth.subscribe(value => events.push(value?.userId ?? null))
    const sdkEvents = [], observer = sdk.auth.onAuthStateChange(event => sdkEvents.push(event))
    const prior = (await sdk.auth.getSession()).data.session
    const refreshed = await sdk.auth.refreshSession()
    assert.ok(!refreshed.error && !!refreshed.data.session, 'Auth server accepts refresh')
    assert.ok(refreshed.data.session.refresh_token !== prior.refresh_token, 'Auth server rotates refresh token')
    assert.equal(requireSuccess(await services.auth.getSession(), 'Refreshed identity').userId, a.id)
    assert.equal(requireSuccess(await services.account.getSummary(), 'Refreshed account').userId, a.id)
    assert.ok(events.includes(a.id), 'SDK auth observation sees the same actor after refresh')
    assert.ok(sdkEvents.includes('TOKEN_REFRESHED'), 'SDK emits a refresh event rather than only initial-session state')
    unsubscribe()
    observer.data.subscription.unsubscribe()
  })

  await t.test('sign-out clears session and account access; revoked refresh token cannot mint a new session', async () => {
    await login(a)
    const captured = (await sdk.auth.getSession()).data.session
    const events = [], unsubscribe = services.auth.subscribe(value => events.push(value?.userId ?? null))
    const sdkEvents = [], observer = sdk.auth.onAuthStateChange(event => sdkEvents.push(event))
    requireSuccess(await services.auth.signOut(), 'Sign-out')
    assert.equal(requireSuccess(await services.auth.getSession(), 'Signed-out session'), null)
    const denied = await services.account.getSummary()
    assert.ok(!denied.ok && denied.error === 'unauthorized', 'Signed-out adapter does not reveal account')
    const retry = await harness.client().auth.refreshSession({ refresh_token: captured.refresh_token })
    assert.ok(!!retry.error && !retry.data.session, 'Revoked refresh token cannot create another session')
    assert.ok(events.includes(null), 'SDK emits signed-out state')
    assert.ok(sdkEvents.includes('SIGNED_OUT'), 'SDK emits an explicit sign-out event')
    unsubscribe()
    observer.data.subscription.unsubscribe()
    // Stateless access JWT remains valid until exp; do not claim instantaneous server revocation.
  })

  await t.test('A-to-B switching rejects stale subject commands and stale rendered account actions', async () => {
    await login(a)
    const oldView = scopeLearningServices(services, a.id)
    requireSuccess(await services.account.updateSettings({ soundMuted: true }), 'A preferences')
    await login(b)
    assert.equal(requireSuccess(await services.users.getCurrentProfile(), 'B profile').id, b.id)
    const rejected = await services.account.updateSettings({ soundMuted: true, expectedSubject: a.id })
    assert.ok(!rejected.ok && rejected.error === 'unauthorized', 'Trusted RPC rejects A intent using B JWT')
    assert.equal(requireSuccess(await services.account.getSettings(), 'B preferences').soundMuted, false)
    const staleRead = await oldView.account.getSummary(), staleSignout = await oldView.auth.signOut()
    assert.ok(!staleRead.ok && staleRead.error === 'unauthorized', 'Old rendered A read does not reveal B')
    assert.ok(!staleSignout.ok && staleSignout.error === 'unauthorized', 'Old rendered A action cannot sign B out')
    assert.equal(requireSuccess(await services.auth.getSession(), 'B remains authenticated').userId, b.id)
    await login(a)
    assert.equal(requireSuccess(await services.account.getSettings(), 'A retained preferences').soundMuted, true)
  })

  await t.test('actual A account RPC response delayed across A-to-B-to-A transition is discarded', async () => {
    await login(a)
    let release, responseReceived
    const held = new Promise(resolve => { release = resolve })
    const received = new Promise(resolve => { responseReceived = resolve })
    const rpc = createLearningRpc(async (name, input) => {
      const response = await sdk.rpc(name, input)
      responseReceived()
      await held // Only transport timing changes; the response came from real PostgREST.
      return response
    })
    const read = createAccountReader(sdk, rpc)('account')
    await received
    try {
      await login(b)
      await login(a)
    } finally { release() }
    const result = await read
    assert.ok(!result.ok && result.error === 'unauthorized', 'A stale response cannot survive an ABA auth transition')
  })
})
