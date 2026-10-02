import { randomBytes, randomUUID } from 'node:crypto'
import { readFile, writeFile, unlink, access } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseAuth } from '../../src/services/supabase/auth.ts'
import { loadHostedConfig, projectRoot } from '../hosted-tests/config.mjs'

// One email to the exact inbox explicitly authorized by the project/account owner.
const allowedEmail = 'dotruc1526@gmail.com'
const target = new URL('../../.env.hosted-signup.local', import.meta.url)
const mode = process.argv[2]
if (!['provision', 'status', 'cleanup'].includes(mode)) throw new Error('Use provision, status or cleanup')
try { execFileSync('git', ['check-ignore', '-q', '--', fileURLToPath(target)], { cwd: projectRoot, stdio: 'ignore' }) }
catch { throw new Error('Signup credential file must be Git-ignored and untracked') }
const config = await loadHostedConfig()
const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: { fetch: (input, init = {}) => fetch(input, { ...init,
    signal: init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(30_000)]) : AbortSignal.timeout(30_000) }) } }
const admin = createClient(config.url, config.secretKey, options)
const client = createClient(config.url, config.publishableKey, options)

async function findTargetUser() {
  for (let page = 1; page <= 100; page++) {
    const response = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (response.error) throw new Error('Signup user preflight failed; no signup email was requested')
    const user = response.data.users.find(value => value.email?.toLowerCase() === allowedEmail)
    if (user) return user
    if (response.data.users.length < 1000) return null
  }
  throw new Error('User preflight incomplete; refusing signup')
}

async function loadFixture() {
  let fixture
  try { fixture = JSON.parse(await readFile(target, 'utf8')) } catch { throw new Error('Signup fixture manifest is unavailable or invalid') }
  if (fixture.projectRef !== config.projectRef || fixture.email !== allowedEmail ||
      typeof fixture.displayName !== 'string' || !fixture.displayName.startsWith('Hosted Signup ')) {
    throw new Error('Refusing operation on a non-fixture signup manifest')
  }
  return fixture
}

async function provision() {
  let exists = false
  try { await access(target); exists = true } catch {}
  if (exists) throw new Error('Signup credential manifest already exists; no duplicate email will be sent')
  if (await findTargetUser()) throw new Error('Owned email already has an Auth user; no update, reset or signup was performed')
  const fixture = { projectRef: config.projectRef, email: allowedEmail,
    password: `S!c9-${randomBytes(24).toString('base64url')}`, id: null,
    displayName: `Hosted Signup ${randomUUID()}`, createdAt: new Date().toISOString(), signupRequested: true }
  // Persist before the one permitted request, so timeout/unknown result cannot lose the password.
  await writeFile(target, JSON.stringify(fixture), { flag: 'wx', mode: 0o600 })
  const auth = createSupabaseAuth(client)
  const result = await auth.signUp({ email: fixture.email, password: fixture.password,
    displayName: fixture.displayName, timezone: 'Asia/Ho_Chi_Minh' })
  if (!result.ok || result.value !== null) throw new Error('Fresh signup did not return pending confirmation; manifest retained; do not retry email')
  const user = await findTargetUser()
  if (!user || user.user_metadata?.displayName !== fixture.displayName || user.email_confirmed_at) {
    throw new Error('Fresh signup server state was unexpected; manifest retained; no retry')
  }
  fixture.id = user.id
  fixture.pendingConfirmation = true
  await writeFile(target, JSON.stringify(fixture), { mode: 0o600 })
  console.log('Fresh public application signup PASS: null session; actual Auth user unconfirmed; one owned-inbox email requested; credentials in ignored .env.hosted-signup.local')
}

async function statusOrCleanup() {
  const fixture = await loadFixture()
  const user = await findTargetUser()
  if (!user || (fixture.id && user.id !== fixture.id) || user.user_metadata?.displayName !== fixture.displayName) {
    throw new Error('Actual server user does not match this exact signup fixture; refusing changes')
  }
  if (mode === 'status') {
    console.log(user.email_confirmed_at ? 'Owned signup email is confirmed on actual Auth server' : 'Owned signup email remains pending confirmation')
    return
  }
  const response = await admin.auth.admin.deleteUser(user.id)
  if (response.error) throw new Error('Exact signup fixture cleanup failed; manifest retained')
  await unlink(target)
  console.log('Owned signup test fixture cleanup complete: exact Auth user deleted and local credential file removed')
}

try { await (mode === 'provision' ? provision() : statusOrCleanup()) }
finally { await client.auth.dispose(); await admin.auth.dispose() }
