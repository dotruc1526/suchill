import { test } from 'node:test'
import assert from 'node:assert/strict'
import { accountAccess, type AuthClient } from '../../src/services/supabase/usernameAuth.ts'

test('LAN account access bounds stalled requests and rejects malformed success payloads', async () => {
  const savedWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const savedFetch = globalThis.fetch, savedTimeout = AbortSignal.timeout
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { protocol: 'http:', hostname: '192.168.1.2' } } })
  let calls = 0, deadline = 0
  const client = { functions: { invoke: async () => { calls++; return { data: { fallback: true }, error: null } } } } as unknown as AuthClient
  try {
    AbortSignal.timeout = ms => { deadline = ms; return savedTimeout(20) }
    globalThis.fetch = (async (_url, init) => {
      assert.equal(init?.cache, 'no-store'); assert.equal(init?.credentials, 'omit')
      return new Promise((_resolve, reject) => init!.signal!.addEventListener('abort', () => reject(new Error('Timed out')), { once: true }))
    }) as typeof fetch
    // Keep the event loop alive while exercising AbortSignal's unref'ed timer.
    const keepAlive = setTimeout(() => {}, 1000)
    try { assert.deepEqual(await accountAccess(client, { action: 'login' }), { ok: true, value: { fallback: true } }) }
    finally { clearTimeout(keepAlive) }
    assert.equal(deadline, 25_000); assert.equal(calls, 1)
    for (const payload of [null, [], 'invalid', 42]) {
      globalThis.fetch = async () => Response.json(payload)
      const result = await accountAccess(client, { action: 'login' })
      assert.equal(result.ok, false)
    }
    // HTTPS and lookalike public hostnames must continue using the trusted SDK.
    globalThis.fetch = async () => { throw new Error('LAN proxy must not be reached') }
    for (const location of [{ protocol: 'https:', hostname: '192.168.1.2' }, { protocol: 'http:', hostname: '10.attacker.com' }]) {
      Object.defineProperty(globalThis, 'window', { configurable: true, value: { location } })
      assert.equal((await accountAccess(client, { action: 'login' })).ok, true)
    }
    assert.equal(calls, 3)
  } finally {
    globalThis.fetch = savedFetch; AbortSignal.timeout = savedTimeout
    if (savedWindow) Object.defineProperty(globalThis, 'window', savedWindow)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})
