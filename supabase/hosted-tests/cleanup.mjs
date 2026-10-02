import assert from 'node:assert/strict'
import { createClient } from '@supabase/supabase-js'
import { loadHostedConfig } from './config.mjs'
import { check, safeOptions } from './context.mjs'

// Explicit integration-owner follow-up only; never run while the hosted suite is active.
// Exact generated namespace excludes browser QA users, Auth-suite users and real people.
const config = await loadHostedConfig()
const admin = createClient(config.url, config.secretKey, safeOptions)
const uuidPattern = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
const markerPattern = new RegExp(`^suchill-hosted-transport-${uuidPattern}$`)
const emailPattern = new RegExp(`^suchill-transport-${uuidPattern}@example\\.invalid$`)
const eligible = user => markerPattern.test(user.user_metadata?.hostedTestMarker ?? '') && emailPattern.test(user.email ?? '')

async function allUsers() {
  const users = []
  for (let page = 1; page <= 10_000; page++) {
    const result = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    check(result.error, 'Enumerate users for exact synthetic cleanup')
    assert.ok(Array.isArray(result.data.users), 'List-users response must have its documented user array')
    users.push(...result.data.users)
    if (result.data.users.length < 1000) return users
  }
  throw new Error('Pagination guard reached; no further deletion is authorized')
}

let deleted = 0
const candidates = (await allUsers()).filter(eligible)
for (const snapshot of candidates) {
  const verified = await admin.auth.admin.getUserById(snapshot.id)
  check(verified.error, 'Revalidate exact synthetic user before cleanup')
  const current = verified.data.user
  assert.ok(current?.id === snapshot.id && eligible(current) && current.email === snapshot.email &&
    current.user_metadata.hostedTestMarker === snapshot.user_metadata.hostedTestMarker,
  'Cleanup requires unchanged exact ID, generated email and run marker')
  const listing = await admin.storage.from('user-avatars').list(current.id, { limit: 1000 })
  check(listing.error, 'Inspect exact synthetic avatar folder')
  const knownNames = new Set(['hosted-transport-avatar.png', 'hosted-transport-spoof.png', 'hosted-transport-invalid.txt'])
  const paths = listing.data.filter(row => knownNames.has(row.name)).map(row => `${current.id}/${row.name}`)
  if (paths.length) check((await admin.storage.from('user-avatars').remove(paths)).error, 'Remove exact known synthetic avatar paths')
  check((await admin.auth.admin.deleteUser(current.id)).error, 'Delete exact confirmed synthetic orphan')
  deleted++
}
const remaining = (await allUsers()).filter(eligible).length
console.log(JSON.stringify({ deleted, remaining }))
assert.equal(remaining, 0, 'Exact transport test-user namespace must be empty after cleanup')
