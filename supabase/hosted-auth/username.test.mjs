import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseAuth } from '../../src/services/supabase/auth.ts'
import { createSupabaseLearningServices } from '../../src/services/supabase/services.ts'
import { loadHostedConfig } from '../hosted-tests/config.mjs'

// Uses only explicitly retained test fixtures; never resets or deletes accounts.
test('hosted username access after deferred GoTrue enrollment', { timeout: 180000 }, async t => {
  const config = await loadHostedConfig()
  const root = new URL('../../', import.meta.url)
  const fresh = JSON.parse(await readFile(new URL('.env.username-browser.local', root), 'utf8'))
  const owned = JSON.parse(await readFile(new URL('.env.hosted-signup.local', root), 'utf8'))
  assert.equal(owned.projectRef, config.projectRef)
  const values = new Map(), storage = { getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
  const client = persist => createClient(config.url, config.publishableKey, { auth: {
    persistSession: !!persist, autoRefreshToken: false, detectSessionInUrl: false,
    ...(persist ? { storage, storageKey: 'suchill-username-hosted-fixture' } : {}),
  } })
  const sdk = client(true), auth = createSupabaseAuth(sdk)
  const services = createSupabaseLearningServices(sdk, { url: config.url, publishableKey: config.publishableKey })
  const ok = result => { assert.equal(result.ok, true, 'Expected successful domain response'); return result.value }
  let actor

  await t.test('username password login uses the immediate confirmed internal identity', async () => {
    const session = ok(await auth.signIn({ email: fresh.username, password: fresh.password }))
    actor = session.userId
    assert.equal(session.username, fresh.username)
    assert.equal(session.displayName, fresh.displayName)
    assert.equal(session.recoveryEmail, undefined)
    assert.equal(session.pendingRecoveryEmail, undefined)
    assert.ok((await sdk.auth.getUser()).data.user.email_confirmed_at)
    const summary = ok(await services.account.getSummary())
    assert.equal(summary.userId, actor)
    assert.equal(summary.totalXp, 0)
    assert.equal(summary.completedLessons, 0)
  })
  await t.test('SDK storage recreation restores the same UUID and permits real account reads', async () => {
    const restored = client(true), restoredAuth = createSupabaseAuth(restored)
    assert.equal(ok(await restoredAuth.getSession()).userId, actor)
    const data = await restored.rpc('learning_read', { p_kind: 'account' })
    assert.equal(data.error, null)
    assert.equal(data.data.userId, actor)
    restored.auth.stopAutoRefresh()
  })
  await t.test('wrong password and duplicate registration do not replace the current account', async () => {
    assert.deepEqual(await auth.signIn({ email: fresh.username, password: 'incorrect-fixture-pass' }),
      { ok: false, error: 'unauthorized' })
    assert.deepEqual(await auth.signUp({ email: '', username: fresh.username, password: 'different-fixture-pass',
      displayName: 'Duplicate', timezone: 'Asia/Bangkok' }), { ok: false, error: 'conflict' })
    assert.equal(ok(await auth.getSession()).userId, actor)
    assert.equal(ok(await auth.signIn({ email: fresh.username, password: fresh.password })).userId, actor)
  })
  await t.test('missing mail configuration does not invalidate the username account or fake verified recovery', async () => {
    assert.deepEqual(await auth.setRecoveryEmail('optional@example.test'), { ok: false, error: 'server_error' })
    const session = ok(await auth.getSession())
    assert.equal(session.userId, actor)
    assert.equal(session.recoveryEmail, undefined)
    assert.equal(session.pendingRecoveryEmail, undefined)
    assert.equal(ok(await services.account.getSummary()).userId, actor)
  })
  await t.test('signout clears persistence and a password login opens the same account again', async () => {
    ok(await auth.signOut())
    assert.equal(ok(await auth.getSession()), null)
    assert.equal(values.has('suchill-username-hosted-fixture'), false)
    assert.equal(ok(await auth.signIn({ email: fresh.username, password: fresh.password })).userId, actor)
    ok(await auth.signOut())
  })
  await t.test('existing owned email login retains UUID, 10XP and progress; duplicate password remains invalid', async () => {
    const legacySdk = client(false), legacy = createSupabaseLearningServices(legacySdk,
      { url: config.url, publishableKey: config.publishableKey })
    assert.deepEqual(await legacy.auth.signIn({ email: owned.email, password: '12345678' }),
      { ok: false, error: 'unauthorized' })
    const session = ok(await legacy.auth.signIn({ email: owned.email, password: owned.password }))
    assert.equal(session.userId, owned.id)
    assert.equal(session.recoveryEmail, owned.email)
    const summary = ok(await legacy.account.getSummary())
    assert.equal(summary.userId, owned.id)
    assert.equal(summary.totalXp, 10)
    assert.equal(summary.completedLessons, 1)
    ok(await legacy.auth.signOut())
  })
  await t.test('actual GoTrue transaction rolls back user-metadata-only internal enrollment', async () => {
    const admin = createClient(config.url, config.secretKey, { auth: { persistSession: false, autoRefreshToken: false } })
    const id = randomUUID(), name = `spoof_${id.replaceAll('-', '').slice(0, 10)}`
    const result = await admin.auth.admin.createUser({ id, email: `${name}@accounts.suchill.invalid`,
      password: randomUUID(), email_confirm: true, user_metadata: { suchill_username: name } })
    assert.ok(result.error, 'Untrusted metadata must not enroll')
    assert.equal(result.data.user, null)
    const lookup = await admin.auth.admin.getUserById(id)
    assert.ok(lookup.error)
    const mapping = await admin.rpc('username_identity', { p_username: name })
    assert.equal(mapping.error, null)
    assert.equal(mapping.data, null)
  })
  sdk.auth.stopAutoRefresh()
})
