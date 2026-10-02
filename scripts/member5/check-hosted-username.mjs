import { readFile } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'

const root = new URL('../../', import.meta.url)
const parse = source => source.trim().startsWith('{') ? JSON.parse(source) : Object.fromEntries(
  source.split(/\r?\n/).filter(line => /^[A-Z_]+=/i.test(line)).map(line => {
    const i = line.indexOf('='); return [line.slice(0, i), line.slice(i + 1).replace(/^(['"])(.*)\1$/, '$2')]
  }),
)
const browser = parse(await readFile(new URL('.env.local', root), 'utf8'))
const server = parse(await readFile(new URL('.env.hosted-test.local', root), 'utf8'))
const url = browser.VITE_SUPABASE_URL ?? server.SUCHILL_HOSTED_URL
const publicKey = browser.VITE_SUPABASE_PUBLISHABLE_KEY ?? browser.VITE_SUPABASE_ANON_KEY ?? server.SUCHILL_HOSTED_PUBLISHABLE_KEY
const secretKey = server.SUCHILL_HOSTED_SECRET_KEY
if (!url || !publicKey || !secretKey) throw new Error(`Environment fields missing; trusted fields: ${Object.keys(server).join(',')}`)
async function probe(path, body, key) {
  const headers = { apikey: key, 'Content-Type': 'application/json' }
  if (key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`
  const response = await fetch(url + path, { method: 'POST', headers, body: JSON.stringify(body), signal: AbortSignal.timeout(25000) })
  const data = await response.json()
  // Only stable diagnostic codes/flags; never raw responses, identities or tokens.
  console.log(JSON.stringify({ path, status: response.status, code: data?.code ?? data?.error,
    ...(typeof data === 'boolean' ? { allowed: data } : {}) }))
}
await probe('/functions/v1/account-access', { action: 'login' }, publicKey)
await probe('/rest/v1/rpc/take_login_quota', { p_bucket: 'diagnostic:username', p_max: 500, p_seconds: 60 }, secretKey)
if (!process.argv.includes('--signup-fixture')) process.exit(0)
if (server.SUCHILL_HOSTED_PROJECT_REF !== 'kyfqlhpweetsridmqkvl' || server.SUCHILL_HOSTED_TEST_ALLOW !== '1')
  throw new Error('Explicit test-project opt-in is required')
const fixture = JSON.parse(await readFile(new URL('.env.username-browser.local', root), 'utf8'))
const sdk = createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false } })
const { data, error } = await sdk.functions.invoke('account-access', { body: {
  action: 'signup', ...fixture, timezone: 'Asia/Bangkok',
} })
let code
if (error?.context instanceof Response) { try { code = (await error.context.json()).error } catch {} }
console.log(JSON.stringify({ signupSession: !!data?.access_token, status: error?.context?.status, code }))
// If enrollment failed, isolate the trusted lookup without exposing its email.
const mapping = await fetch(url + '/rest/v1/rpc/username_identity', {
  method: 'POST', headers: { apikey: secretKey, 'Content-Type': 'application/json' },
  body: JSON.stringify({ p_username: fixture.username }),
})
const mapped = await mapping.json()
console.log(JSON.stringify({ mappingStatus: mapping.status, mappingExists: typeof mapped === 'string' }))
