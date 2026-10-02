import test from 'node:test'
import assert from 'node:assert/strict'
import { createAccountHandler } from '../../supabase/functions/account-access/handler.mjs'
import { createAccountTransport, identifierHash } from '../../supabase/functions/account-access/transport.mjs'

// Deliberately synthetic keys and accounts; these tests never contact a hosted project.
const config = { url: 'https://fixture.supabase.test', secretKey: 'sb_secret_fixture_only',
  publishableKey: 'sb_publishable_fixture_only', origins: ['http://localhost:8443'] }
const fixtureTokens = { access_token: 'fixture-access', refresh_token: 'fixture-refresh' }
type Call = { path: string; host: string; body: any; headers: Headers; method: string }
function harness(respond: (call: Call) => { status?: number; data?: any } = () => ({}), extra = {}) {
  const calls: Call[] = []
  const fetcher = async (url: string, init: RequestInit) => {
    const call = { path: new URL(url).pathname + new URL(url).search, host: new URL(url).host,
      body: init.body === undefined ? undefined : JSON.parse(String(init.body)),
      headers: new Headers(init.headers), method: init.method ?? 'GET' }
    calls.push(call)
    const result = respond(call)
    const data = result.data === undefined ? call.path.includes('take_login_quota') ? true : {} : result.data
    return new Response(JSON.stringify(data), { status: result.status ?? 200 })
  }
  const handle = createAccountHandler({ ...config, ...extra }, fetcher)
  const request = (body: unknown, headers: Record<string, string> = {}) => new Request('http://localhost:8443/api/account-access', {
    method: 'POST', headers: { origin: config.origins[0], 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
  return { handle, calls, request }
}
const signup = { action: 'signup', username: 'new_user', password: 'fixture-password', displayName: 'Fixture', timezone: 'Asia/Bangkok' }

test('CORS and input failures cannot reach privileged enrollment or password endpoints', async () => {
  const { handle, calls, request } = harness()
  assert.equal((await handle(request(signup, { origin: 'https://untrusted.example' }))).status, 403)
  assert.equal((await handle(new Request('http://localhost:8443/api/account-access'))).status, 405)
  const preflight = await handle(new Request('http://localhost:8443/api/account-access', {
    method: 'OPTIONS', headers: { origin: config.origins[0] },
  }))
  assert.equal(preflight.status, 204)
  assert.equal(preflight.headers.get('Access-Control-Allow-Origin'), config.origins[0])
  for (const input of [null, [], { ...signup, username: '../other' }, { ...signup, action: 'admin-reset' }]) {
    assert.equal((await handle(request(input))).status, 400)
  }
  assert.equal(calls.length, 0)
})

test('oversized streaming bodies stop reading before allocating the entire request', async () => {
  const { handle, calls } = harness()
  let pulled = 0, cancelled = false
  const body = new ReadableStream({
    pull(controller) {
      pulled++
      controller.enqueue(new Uint8Array(1024).fill(32))
      if (pulled === 50) controller.close()
    },
    cancel() { cancelled = true },
  })
  const request = new Request('http://localhost:8443/api/account-access', {
    method: 'POST', headers: { origin: config.origins[0] }, body, duplex: 'half',
  } as RequestInit)
  assert.equal((await handle(request)).status, 413)
  assert.ok(pulled < 50, `read ${pulled} chunks before refusing an oversized request`)
  assert.equal(cancelled, true)
  assert.equal(calls.length, 0)
})

test('password failures are generic for known and missing names and do not return identity mapping', async () => {
  for (const known of [true, false]) {
    const { handle, calls, request } = harness(call => {
      if (call.path.includes('username_identity')) return { data: known ? 'private-recovery@example.test' : null }
      if (call.path.includes('/auth/v1/token')) return { status: 400, data: { code: 'invalid_credentials', email: 'private-recovery@example.test' } }
      return {}
    })
    const response = await handle(request({ action: 'login', username: 'name_test', password: 'wrong-password' }))
    assert.equal(response.status, 401)
    assert.deepEqual(await response.json(), { error: 'unauthorized' })
    const passwordCalls = calls.filter(call => call.path.includes('/auth/v1/token'))
    assert.equal(passwordCalls.length, 1)
    assert.equal(passwordCalls[0].headers.get('apikey'), config.publishableKey)
    assert.equal(passwordCalls[0].headers.get('authorization'), null)
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
  }
})

test('quota refusal prevents credential checks and privileged user creation', async () => {
  const { handle, calls, request } = harness(call => call.path.includes('take_login_quota') ? { data: false } : {})
  assert.equal((await handle(request(signup))).status, 429)
  assert.equal(calls.length, 1)
  const bucket = calls[0].body.p_bucket
  assert.match(bucket, /^signup:[a-f0-9]{64}$/)
  assert.ok(!bucket.includes(signup.username))
  assert.equal(calls[0].headers.get('apikey'), config.secretKey)
})

test('claim binds the alias to the verified bearer actor and ignores forged user IDs/app metadata', async () => {
  const { handle, calls, request } = harness(call => {
    if (call.path === '/auth/v1/user') return { data: { id: 'actor-A', app_metadata: { provider: 'email' } } }
    if (call.path.includes('claim_login_name')) return { data: 'chosen_name' }
    return {}
  })
  const response = await handle(request({ action: 'claim', username: 'chosen_name', userId: 'victim-B',
    app_metadata: { admin: true } }, { authorization: 'Bearer session-A' }))
  assert.equal(response.status, 200)
  const verification = calls.find(call => call.path === '/auth/v1/user')!
  assert.equal(verification.headers.get('authorization'), 'Bearer session-A')
  assert.equal(verification.headers.get('apikey'), config.publishableKey)
  const claim = calls.find(call => call.path.includes('claim_login_name'))!
  assert.deepEqual(claim.body, { p_username: 'chosen_name', p_user_id: 'actor-A' })
  const mutation = calls.find(call => call.path.startsWith('/auth/v1/admin/users/'))!
  assert.equal(mutation.path, '/auth/v1/admin/users/actor-A')
  assert.deepEqual(mutation.body, { app_metadata: { provider: 'email', suchill_username: 'chosen_name' } })
  assert.equal(mutation.method, 'PUT')
  assert.equal(mutation.headers.get('apikey'), config.secretKey)
})

test('invalid/expired bearer cannot claim another account or update Auth metadata', async () => {
  const { handle, calls, request } = harness(call => call.path === '/auth/v1/user' ? { status: 401, data: {} } : {})
  assert.equal((await handle(request({ action: 'claim', username: 'test_alias' }))).status, 401)
  assert.equal((await handle(request({ action: 'claim', username: 'test_alias' }, { authorization: 'Bearer expired' }))).status, 401)
  assert.ok(calls.every(call => !call.path.includes('claim_login_name') && !call.path.includes('/admin/')))
})

test('duplicate signup never overwrites credentials or starts a session', async () => {
  const { handle, calls, request } = harness(call => {
    if (call.path.includes('username_identity')) return { data: null }
    if (call.path === '/auth/v1/admin/users') return { status: 422, data: { code: 'email_exists' } }
    return {}
  })
  const response = await handle(request(signup))
  assert.equal(response.status, 409)
  assert.deepEqual(await response.json(), { error: 'conflict' })
  assert.ok(calls.every(call => !call.path.includes('/auth/v1/token') && !call.path.includes('/admin/users/')))
})

test('username registration only returns SDK session tokens and creates a trusted internal identity', async () => {
  const { handle, calls, request } = harness(call => {
    if (call.path.includes('username_identity')) return { data: null }
    if (call.path.includes('/auth/v1/token')) return { data: { ...fixtureTokens, user: { id: 'fixture' }, secret: config.secretKey } }
    return {}
  })
  const response = await handle(request({ ...signup, username: ' NEW_USER ', displayName: ' Fixture ' }))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), fixtureTokens)
  const create = calls.find(call => call.path === '/auth/v1/admin/users')!
  assert.equal(create.body.email, 'new_user@accounts.suchill.invalid')
  assert.equal(create.body.email_confirm, true)
  assert.deepEqual(create.body.app_metadata, { suchill_username: 'new_user' })
  assert.equal(create.body.user_metadata.displayName, 'Fixture')
})

test('transport failures never echo a credential/secret; hashing is salted across deployments', async () => {
  const handle = createAccountHandler(config, async () => { throw new Error(config.secretKey) })
  const response = await handle(new Request('http://localhost:8443/api/account-access', { method: 'POST', body: JSON.stringify(signup) }))
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { error: 'server_error' })
  assert.notEqual(await identifierHash('new_user', 'one-salt'), await identifierHash('new_user', 'other-salt'))
  const transport = createAccountTransport(config, async (_url: string, init: RequestInit) => {
    assert.equal(new Headers(init.headers).get('apikey'), config.secretKey)
    assert.equal(new Headers(init.headers).get('authorization'), null)
    return new Response('not JSON', { status: 503 })
  })
  assert.deepEqual(await transport.rpc('take_login_quota', {}), { ok: false, status: 503, data: null })
})

const recoveryOwner = { id: 'actor-A', email: 'new_user@accounts.suchill.invalid',
  app_metadata: { suchill_username: 'new_user', provider: 'email' } }
const recoveryInput = { action: 'recovery-email', email: 'optional@example.test' }
const mailConfig = { mailKey: 'fixture-mail-key', mailFrom: 'Sử Chill <fixture@example.test>' }
const bearer = { authorization: 'Bearer session-A' }
const recoveryContext = (call: Call) => call.path === '/auth/v1/user' ? { data: recoveryOwner }
  : call.path.includes('username_identity') ? { data: recoveryOwner.email } : {}

test('recovery setup without delivery configuration has no request, mail, or Auth mutation side effect', async () => {
  const { handle, calls, request } = harness(recoveryContext)
  const response = await handle(request(recoveryInput, bearer))
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { error: 'server_error', reason: 'email_delivery_not_configured' })
  assert.ok(calls.every(call => call.path === '/auth/v1/user' || call.path.includes('take_login_quota') || call.path.includes('username_identity')))
})

test('recovery setup/verification requires a verified bearer and cannot trust body actor IDs', async () => {
  const { handle, calls, request } = harness(call => call.path === '/auth/v1/user' ? { status: 401, data: {} } : {}, mailConfig)
  for (const action of ['recovery-email', 'verify-recovery-email']) {
    const body = { action, email: recoveryInput.email, token: 'a'.repeat(64), userId: 'victim-B' }
    assert.equal((await handle(request(body))).status, 401)
    assert.equal((await handle(request(body, { authorization: 'Bearer expired' }))).status, 401)
  }
  assert.ok(calls.every(call => call.path === '/auth/v1/user'))
})

test('mailbox setup sends only to the selected address and stores a hash with expiry, never returning its token', async () => {
  const { handle, calls, request } = harness(recoveryContext, mailConfig)
  const response = await handle(request({ ...recoveryInput, userId: 'victim-B' }, bearer))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { pendingRecoveryEmail: recoveryInput.email })
  const mail = calls.find(call => call.host === 'api.resend.com')!
  assert.deepEqual(mail.body.to, [recoveryInput.email])
  const link = new URL(mail.body.text.match(/https?:\/\/\S+/)[0])
  assert.equal(link.origin, config.origins[0])
  const rawToken = link.searchParams.get('token')!
  assert.match(rawToken, /^[a-f0-9]{64}$/)
  const save = calls.find(call => call.path.startsWith('/rest/v1/recovery_email_requests'))!
  assert.equal(save.body.user_id, recoveryOwner.id)
  assert.equal(save.body.token_hash, await identifierHash(rawToken, config.secretKey))
  assert.ok(Date.parse(save.body.expires_at) > Date.now())
  assert.ok(Date.parse(save.body.expires_at) <= Date.now() + 20 * 60_000)
  assert.match(save.headers.get('Prefer') ?? '', /resolution=merge-duplicates/)
  assert.ok(calls.filter(call => call.path.startsWith('/auth/v1/admin/users/'))
    .every(call => call.body.email === undefined && call.body.password === undefined))
})

test('mailbox proof binds consumption and confirmed email mutation to the same Auth UUID', async () => {
  const rawToken = 'a'.repeat(64)
  const { handle, calls, request } = harness(call => {
    if (call.path === '/auth/v1/user' || call.path.includes('username_identity')) return recoveryContext(call)
    if (call.path.includes('consume_recovery_email')) return { data: recoveryInput.email }
    return {}
  }, mailConfig)
  const response = await handle(request({ action: 'verify-recovery-email', token: rawToken, userId: 'victim-B',
    email: 'forged@example.test' }, bearer))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { recoveryEmail: recoveryInput.email })
  const consumed = calls.find(call => call.path.includes('consume_recovery_email'))!
  assert.deepEqual(consumed.body, { p_user_id: recoveryOwner.id,
    p_token_hash: await identifierHash(rawToken, config.secretKey) })
  const mutation = calls.find(call => call.path.startsWith('/auth/v1/admin/users/'))!
  assert.equal(mutation.path, `/auth/v1/admin/users/${recoveryOwner.id}`)
  assert.equal(mutation.body.email, recoveryInput.email)
  assert.equal(mutation.body.email_confirm, true)
  assert.equal(mutation.body.password, undefined)
  assert.equal(mutation.body.app_metadata.suchill_username, recoveryOwner.app_metadata.suchill_username)
  assert.ok(calls.every(call => call.method !== 'DELETE' && !call.path.includes('/auth/v1/admin/users?')))
})

test('expired/replaced/replayed proof and email collision cannot change another account or credentials', async () => {
  for (const [email, adminStatus, expected] of [[null, 200, 400], [recoveryInput.email, 422, 409]] as const) {
    const { handle, calls, request } = harness(call => {
      if (call.path === '/auth/v1/user' || call.path.includes('username_identity')) return recoveryContext(call)
      if (call.path.includes('consume_recovery_email')) return { data: email }
      if (call.path.startsWith('/auth/v1/admin/users/')) return { status: adminStatus, data: { code: 'email_exists' } }
      return {}
    }, mailConfig)
    const response = await handle(request({ action: 'verify-recovery-email', token: 'a'.repeat(64) }, bearer))
    assert.equal(response.status, expected)
    const mutations = calls.filter(call => call.path.startsWith('/auth/v1/admin/users/'))
    assert.equal(mutations.length, email === null ? 0 : 1)
    assert.ok(mutations.every(call => call.path.endsWith(recoveryOwner.id) && call.body.password === undefined))
    assert.ok(calls.every(call => call.path !== '/auth/v1/admin/users'))
  }
})

test('custom first-mailbox proof cannot bypass secure email change on an existing real-email account', async () => {
  const { handle, calls, request } = harness(call => call.path === '/auth/v1/user'
    ? { data: { ...recoveryOwner, email: 'existing@example.test' } } : {}, mailConfig)
  for (const action of ['recovery-email', 'verify-recovery-email']) {
    assert.equal((await handle(request({ action, email: recoveryInput.email, token: 'a'.repeat(64) }, bearer))).status, 409)
  }
  assert.ok(calls.every(call => call.path === '/auth/v1/user'))
})

test('password update uses the verified actor bearer on the public Auth API and ignores forged actor IDs', async () => {
  const password = 'new-fixture-password'
  const { handle, calls, request } = harness(call => call.path === '/auth/v1/user'
    ? { data: { id: recoveryOwner.id, access_token: 'must-not-return', ...recoveryOwner } } : {})
  const response = await handle(request({ action: 'update-password', password, userId: 'victim-B',
    app_metadata: { admin: true } }, bearer))
  assert.equal(response.status, 200)
  const mutation = calls.find(call => call.path === '/auth/v1/user' && call.method === 'PUT')!
  assert.ok(mutation)
  assert.deepEqual(mutation.body, { password })
  assert.equal(mutation.headers.get('apikey'), config.publishableKey)
  assert.equal(mutation.headers.get('authorization'), bearer.authorization)
  assert.ok(calls.every(call => !call.path.includes('/admin/')))
  const body = JSON.stringify(await response.json())
  for (const secret of [password, config.secretKey, 'must-not-return', bearer.authorization]) assert.ok(!body.includes(secret))
})

test('password update rejects invalid credentials and invalid/expired bearers before any mutation', async () => {
  const { handle, calls, request } = harness(call => call.path === '/auth/v1/user' ? { status: 401, data: {} } : {})
  for (const password of [null, 'short', 'x'.repeat(129)]) {
    assert.equal((await handle(request({ action: 'update-password', password }, bearer))).status, 400)
  }
  const input = { action: 'update-password', password: 'valid-fixture-password', userId: 'victim-B' }
  assert.equal((await handle(request(input))).status, 401)
  assert.equal((await handle(request(input, bearer))).status, 401)
  assert.ok(calls.every(call => call.path === '/auth/v1/user' && call.method === 'GET'))
})

test('recovery reservation releases only on definitive rejection and survives ambiguous Auth failures', async () => {
  for (const outcome of [422, 500, 'timeout'] as const) {
    const { handle, calls, request } = harness(call => {
      if (call.path === '/auth/v1/user' || call.path.includes('username_identity')) return recoveryContext(call)
      if (call.path.includes('consume_recovery_email')) return { data: recoveryInput.email }
      if (call.path.startsWith('/auth/v1/admin/users/')) {
        if (outcome === 'timeout') throw new Error('Auth might have committed before timeout')
        return { status: outcome, data: {} }
      }
      return {}
    }, mailConfig)
    const response = await handle(request({ action: 'verify-recovery-email', token: 'a'.repeat(64) }, bearer))
    assert.equal(response.status, outcome === 422 ? 409 : 503)
    const finishes = calls.filter(call => call.path.includes('finish_recovery_email'))
    assert.equal(finishes.length, outcome === 422 ? 1 : 0)
    if (outcome === 422) assert.equal(finishes[0].body.p_success, false)
  }
})
