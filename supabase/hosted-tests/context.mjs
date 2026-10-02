import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseLearningServices } from '../../src/services/supabase/services.ts'
import { loadHostedConfig } from './config.mjs'
import { ids } from './ids.mjs'

export const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jBuoAAAAASUVORK5CYII=', 'base64')
export const boundedFetch = (input, init = {}) => fetch(input, { ...init,
  signal: init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(20_000)]) : AbortSignal.timeout(20_000) })
export const safeOptions = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: { fetch: boundedFetch } }

export function check(error, label) {
  if (error) throw new Error(`${label} failed; sensitive SDK error details omitted`)
}
export function value(result, label = 'Domain service') {
  assert.equal(result.ok, true, `${label} must succeed (${result.ok ? 'ok' : result.error})`)
  return result.value
}
export function denied(result, label) { assert.ok(result.error, `${label} must deny the request`) }

export async function createHostedContext() {
  const config = await loadHostedConfig()
  const anon = createClient(config.url, config.publishableKey, safeOptions)
  const admin = createClient(config.url, config.secretKey, safeOptions)
  const marker = `suchill-hosted-transport-${randomUUID()}`
  const owned = []
  const avatarPaths = new Set()
  const attemptedStorage = []
  const ctx = { config, anon, admin, marker, owned, avatarPaths, attemptedStorage }
  ctx.services = client => createSupabaseLearningServices(client, {
    url: config.url, publishableKey: config.publishableKey,
  })
  ctx.cleanup = async () => {
    const failures = []
    for (const { bucket, path } of attemptedStorage) {
      try {
        assert.ok(['published-media', 'draft-media'].includes(bucket) &&
          path === `hosted-technical/v1/forged-${marker}.png`, 'Cleanup only this run\'s exact attempted object')
        check((await admin.storage.from(bucket).remove([path])).error, 'Cleanup exact attempted test object')
      } catch { failures.push('Exact test-object cleanup failed') }
    }
    for (const item of [...owned].reverse()) {
      try {
        const found = await admin.auth.admin.getUserById(item.id)
        check(found.error, 'Verify test cleanup ownership')
        const user = found.data.user
        assert.ok(user?.id === item.id && user.email === item.email &&
          user.email.endsWith('@example.invalid') && user.user_metadata.hostedTestMarker === marker,
        'Cleanup is limited to exact synthetic users created by this run')
        const paths = [...avatarPaths].filter(path => path.startsWith(`${item.id}/hosted-transport-`))
        if (paths.length) check((await admin.storage.from('user-avatars').remove(paths)).error, 'Cleanup own test avatars')
        await item.client.auth.signOut({ scope: 'local' })
        check((await admin.auth.admin.deleteUser(item.id)).error, 'Cleanup exact synthetic test user')
      } catch { failures.push('Exact test-user cleanup failed; review server records using the test marker') }
    }
    if (failures.length) throw new Error(failures.join('; '))
  }
  try {
    const fixture = await anon.rpc('learning_read', { p_kind: 'chapter', p_id: ids.chapter, p_secondary_id: null })
    check(fixture.error, 'Hosted migration/fixture prerequisite')
    assert.equal(fixture.data?.id, ids.chapter, 'Authorized technical fixture must be installed')
    for (const label of ['A', 'B']) {
      const email = `suchill-transport-${randomUUID()}@example.invalid`
      const password = `${randomBytes(32).toString('base64url')}aA1!`
      const created = await admin.auth.admin.createUser({ email, password, email_confirm: true,
        user_metadata: { displayName: `Hosted fixture ${label}`, timezone: 'Asia/Ho_Chi_Minh', hostedTestMarker: marker } })
      check(created.error, 'Create synthetic confirmed test identity')
      assert.ok(created.data.user?.id, 'Admin createUser must return an identity')
      const client = createClient(config.url, config.publishableKey, safeOptions)
      const item = { id: created.data.user.id, email, client }
      owned.push(item)
      const signIn = await client.auth.signInWithPassword({ email, password })
      check(signIn.error, 'Real Auth password sign-in')
      assert.equal(signIn.data.user?.id, item.id, 'Auth JWT must identify its intended test user')
      ctx[label.toLowerCase()] = { ...item, services: ctx.services(client) }
    }
    return ctx
  } catch {
    let cleanupFailed = false
    try { await ctx.cleanup() } catch { cleanupFailed = true }
    throw new Error(`Hosted context setup failed; verify migration, fixtures and trusted test configuration. No secrets logged.${cleanupFailed ? ' Exact owned test-user cleanup also failed.' : ''}`)
  }
}
