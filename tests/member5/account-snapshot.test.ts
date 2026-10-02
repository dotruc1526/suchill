import test from 'node:test'
import assert from 'node:assert/strict'
import { readAccountSnapshot } from '../../src/app/accountSnapshot.ts'
import type { AccountService, AuthService, AuthSession } from '../../src/services/next/accountContracts.ts'

function fixture() {
  let userId = 'A', removed = 0
  const listeners = new Set<(session: AuthSession | null) => void>()
  const change = (id: string) => { userId = id; for (const listener of listeners) listener({ userId: id, displayName: id }) }
  const auth = {
    getSession: async () => ({ ok: true, value: { userId, displayName: userId } }),
    subscribe: (listener: (session: AuthSession | null) => void) => {
      listeners.add(listener); return () => { removed += 1; listeners.delete(listener) }
    },
  } as AuthService
  const account: AccountService = {
    getSummary: async () => ({ ok: true, value: { userId: 'A', displayName: 'A', totalXp: 20, completedLessons: 1, currentStreak: 1, longestStreak: 1, timezone: 'UTC', achievements: [] } }),
    getSettings: async () => ({ ok: true, value: { soundMuted: true, reducedMotion: true, locale: 'vi-VN', timezone: 'UTC', analyticsEnabled: false } }),
    updateSettings: async () => ({ ok: false, error: 'unauthorized' }),
  }
  return { auth, account, change, removed: () => removed }
}

test('account snapshot rejects mismatched owner instead of showing another account reward', async () => {
  const source = fixture(), original = source.account.getSummary
  source.account.getSummary = async () => {
    const result = await original()
    return result.ok ? { ok: true, value: { ...result.value, userId: 'B' } } : result
  }
  assert.equal((await readAccountSnapshot(source)).status, 'error')
  assert.equal(source.removed(), 1)
})

test('account snapshot rejects ABA preference reads and always removes its observer', async () => {
  const source = fixture(), original = source.account.getSettings
  source.account.getSettings = async () => { source.change('B'); const settings = await original(); source.change('A'); return settings }
  assert.deepEqual(await readAccountSnapshot(source), { status: 'changed' })
  assert.equal(source.removed(), 1)
})

test('account snapshot fails safely on transport throws and permits a later successful retry', async () => {
  const source = fixture(), original = source.auth.getSession
  source.auth.getSession = async () => { throw new Error('private transport diagnostic') }
  assert.deepEqual(await readAccountSnapshot(source), { status: 'error', session: null })
  source.auth.getSession = original
  assert.equal((await readAccountSnapshot(source)).status, 'ready')
  assert.equal(source.removed(), 2)
})

test('signed-out snapshot contains no prior account settings or summary', async () => {
  const source = fixture()
  source.auth.getSession = async () => ({ ok: true, value: null })
  assert.deepEqual(await readAccountSnapshot(source), { status: 'ready', session: null, settings: null, summary: null })
})
