import test from 'node:test'
import assert from 'node:assert/strict'
import { validateHostedConfig, expectedProjectRef } from './config.mjs'

const valid = { SUCHILL_HOSTED_TEST_ALLOW: '1', SUCHILL_HOSTED_PROJECT_REF: expectedProjectRef,
  SUCHILL_HOSTED_URL: `https://${expectedProjectRef}.supabase.co`,
  SUCHILL_HOSTED_PUBLISHABLE_KEY: 'sb_publishable_technical', SUCHILL_HOSTED_SECRET_KEY: 'sb_secret_test' }

test('hosted guard pins the authorized fresh project, opt-in and separate key classes', () => {
  assert.equal(validateHostedConfig(valid).projectRef, expectedProjectRef)
  for (const changes of [{ SUCHILL_HOSTED_TEST_ALLOW: '0' }, { SUCHILL_HOSTED_PROJECT_REF: 'another-project' },
    { SUCHILL_HOSTED_URL: 'https://another-project.supabase.co' },
    { SUCHILL_HOSTED_URL: `${valid.SUCHILL_HOSTED_URL}/?override=1` },
    { SUCHILL_HOSTED_PUBLISHABLE_KEY: 'sb_secret_test' }, { SUCHILL_HOSTED_SECRET_KEY: 'legacy_jwt' }]) {
    assert.throws(() => validateHostedConfig({ ...valid, ...changes }))
  }
})
