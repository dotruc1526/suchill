import { access } from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { loadHostedConfig } from '../hosted-tests/config.mjs'

const config = await loadHostedConfig()
const admin = createClient(config.url, config.secretKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: { fetch: (input, init = {}) => fetch(input, { ...init,
    signal: init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(30_000)]) : AbortSignal.timeout(30_000) }) },
})
const counts = { syntheticAuthUsersRemaining: 0, syntheticBrowserUsersRemaining: 0, ownedSignupFixturesRemaining: 0 }
let complete = false
try {
  for (let page = 1; page <= 100; page++) {
    const result = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (result.error) throw new Error('Read-only Auth cleanup verification failed')
    for (const user of result.data.users) {
      if (user.email?.startsWith('suchill-auth-')) counts.syntheticAuthUsersRemaining++
      if (user.email?.startsWith('suchill-browser-')) counts.syntheticBrowserUsersRemaining++
      if (user.user_metadata?.displayName?.startsWith('Hosted Signup ')) counts.ownedSignupFixturesRemaining++
    }
    if (result.data.users.length < 1000) { complete = true; break }
  }
  if (!complete) throw new Error('Read-only Auth enumeration incomplete')
  const files = {}
  for (const name of ['browser', 'signup', 'test']) {
    try { await access(new URL(`../../.env.hosted-${name}.local`, import.meta.url)); files[name] = 1 }
    catch { files[name] = 0 }
  }
  console.log(JSON.stringify({ ...counts, ignoredCredentialFilesPresent: files }))
} finally { await admin.auth.dispose() }
