import test from 'node:test'
import assert from 'node:assert/strict'
import { isPrivateTrackedEnvPath } from '../../scripts/member5/private-env-path.mjs'

test('tracked nested private env paths are rejected without opening them', () => {
  for (const path of ['.env', '.env.local', 'supabase/functions/.env.production', 'nested/.env/config.txt']) {
    assert.equal(isPrivateTrackedEnvPath(path), true, path)
  }
  for (const path of ['.env.example', 'src/env.ts', 'docs/environment.md']) {
    assert.equal(isPrivateTrackedEnvPath(path), false, path)
  }
})
