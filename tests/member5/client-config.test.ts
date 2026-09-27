import test from 'node:test'
import assert from 'node:assert/strict'
import { readPublicSupabaseConfig } from '../../src/services/next/clientConfig.ts'

test('accepts browser-safe configuration', () => {
  assert.deepEqual(readPublicSupabaseConfig({
    VITE_SUPABASE_URL: 'https://example.supabase.co/',
    VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_example',
  }), { url: 'https://example.supabase.co', publishableKey: 'sb_publishable_example' })
})

test('rejects privileged key in browser configuration without echoing it', () => {
  const payload = Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url')
  const fake = `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`
  assert.throws(() => readPublicSupabaseConfig({
    VITE_SUPABASE_URL: 'https://example.supabase.co',
    VITE_SUPABASE_PUBLISHABLE_KEY: fake,
  }), /Privileged key/)
})

test('accepts a legacy anon JWT and rejects unknown browser key formats', () => {
  const payload = Buffer.from(JSON.stringify({ role: 'anon' })).toString('base64url')
  const anon = `eyJhbGciOiJIUzI1NiJ9.${payload}.signature`
  const env = { VITE_SUPABASE_URL: 'https://example.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: anon }
  assert.equal(readPublicSupabaseConfig(env).publishableKey, anon)
  assert.throws(() => readPublicSupabaseConfig({ ...env, VITE_SUPABASE_PUBLISHABLE_KEY: 'unknown-key' }), /Only a publishable or anon key/)
  assert.throws(() => readPublicSupabaseConfig({ ...env, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_example' }), /Privileged key/)
})
