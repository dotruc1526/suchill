import { randomBytes, randomUUID } from 'node:crypto'
import { readFile, writeFile, unlink, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { createClient } from '@supabase/supabase-js'
import { loadHostedConfig, projectRoot } from '../hosted-tests/config.mjs'

const target = new URL('../../.env.hosted-browser.local', import.meta.url)
const path = fileURLToPath(target)
const mode = process.argv[2]
if (!['provision', 'cleanup'].includes(mode)) throw new Error('Use provision or cleanup for browser fixtures')
try { execFileSync('git', ['check-ignore', '-q', '--', path], { cwd: projectRoot, stdio: 'ignore' }) }
catch { throw new Error('Browser fixture credential file must be Git-ignored and untracked') }
const config = await loadHostedConfig()
const admin = createClient(config.url, config.secretKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: { fetch: (input, init = {}) => fetch(input, { ...init,
    signal: init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(30_000)]) : AbortSignal.timeout(30_000) }) },
})

async function provision() {
  let existing = false
  try { await access(target); existing = true } catch {}
  if (existing) throw new Error('Browser fixture file already exists; finish or clean up that run first')
  const runId = randomUUID(), users = []
  try {
    for (const actor of ['A', 'B']) {
      const email = `suchill-browser-${runId}-${actor.toLowerCase()}@example.com`
      const password = `S!c9-${randomBytes(24).toString('base64url')}`
      const displayName = `Browser Test ${actor}`
      const response = await admin.auth.admin.createUser({ email, password, email_confirm: true,
        user_metadata: { displayName, timezone: 'Asia/Ho_Chi_Minh', hostedBrowserRun: runId } })
      if (response.error || !response.data.user?.id) throw new Error('Synthetic browser user provisioning failed')
      users.push({ id: response.data.user.id, email, password, displayName })
    }
    await writeFile(target, JSON.stringify({ projectRef: config.projectRef, url: config.url,
      publishableKey: config.publishableKey, runId, createdAt: new Date().toISOString(), users }), { flag: 'wx', mode: 0o600 })
    console.log('Browser fixture ready: .env.hosted-browser.local; JSON format; two confirmed synthetic accounts; no email sent')
  } catch (error) {
    let failed = false
    for (const user of users) {
      const result = await admin.auth.admin.deleteUser(user.id)
      failed ||= !!result.error
    }
    if (failed) throw new Error('Partial browser fixture cleanup needs inspection; exact IDs remain only in process memory')
    throw error
  }
}

async function cleanup() {
  const fixture = JSON.parse(await readFile(target, 'utf8'))
  if (fixture.projectRef !== config.projectRef || fixture.url !== config.url ||
    !/^[0-9a-f-]{36}$/.test(fixture.runId) || !Array.isArray(fixture.users) || fixture.users.length !== 2) {
    throw new Error('Refusing cleanup of an invalid browser fixture manifest')
  }
  // Validate the entire exact-ID manifest before any destructive operation.
  for (let index = 0; index < fixture.users.length; index++) {
    const user = fixture.users[index]
    const actor = index === 0 ? 'a' : 'b'
    if (!/^[0-9a-f-]{36}$/.test(user.id) || user.email !== `suchill-browser-${fixture.runId}-${actor}@example.com`) {
      throw new Error('Refusing cleanup of a non-fixture user')
    }
    const response = await admin.auth.admin.getUserById(user.id)
    if (response.error?.status === 404) continue // Supports retry after a partially completed cleanup.
    if (response.error || response.data.user?.email !== user.email ||
        response.data.user?.user_metadata?.hostedBrowserRun !== fixture.runId) {
      throw new Error('Refusing cleanup: server user does not match this test run')
    }
  }
  for (const user of fixture.users) {
    const response = await admin.auth.admin.deleteUser(user.id)
    if (response.error && response.error.status !== 404) throw new Error('Browser fixture cleanup failed; manifest retained for retry')
  }
  await unlink(target)
  console.log('Browser fixture cleanup complete: exact test users deleted and local credential file removed')
}

try { await (mode === 'provision' ? provision() : cleanup()) }
finally { await admin.auth.dispose() }
