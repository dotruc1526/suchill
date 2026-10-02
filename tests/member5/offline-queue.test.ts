import test from 'node:test'
import assert from 'node:assert/strict'
import { OfflineQueue } from '../../src/services/offline/queue.ts'
import { failure, success } from '../../src/services/next/contracts.ts'

function storage() {
  const entries = new Map<string, string>()
  return { getItem: (key: string) => entries.get(key) ?? null, setItem: (key: string, value: string) => { entries.set(key, value) } }
}
const operation = { userId: 'A', kind: 'complete_lesson' as const, input: { lessonId: 'lesson', operationId: 'op-stable' } }

test('offline completion persists without fabricating confirmation and retains original operation across reload', async () => {
  const store = storage()
  const queue = new OfflineQueue(store, () => false)
  const result = await queue.dispatch(operation, async () => { throw new Error('must not send') })
  assert.deepEqual(result, failure('offline'))
  assert.equal(queue.list('A').length, 1)
  assert.equal(queue.list('B').length, 0)
  const restored = new OfflineQueue(store, () => true)
  const seen: string[] = []
  await restored.sync('A', async item => { seen.push(item.input.operationId as string); return success({ status: 'confirmed' }) }, async () => 'A')
  assert.deepEqual(seen, ['op-stable'])
  assert.deepEqual(restored.list('A'), [])
})

test('retry deduplicates operations and rejects changing a payload under the same ID', async () => {
  const queue = new OfflineQueue(storage(), () => false)
  await queue.dispatch(operation, async () => failure('offline'))
  await queue.dispatch(operation, async () => failure('offline'))
  assert.equal(queue.list('A').length, 1)
  assert.deepEqual(await queue.dispatch({ ...operation, input: { ...operation.input, lessonId: 'different' } }, async () => failure('offline')), failure('conflict'))
})

test('sync stops at a failed prerequisite, retains all records and never sends another account operations', async () => {
  const store = storage()
  const queue = new OfflineQueue(store, () => false)
  await queue.dispatch(operation, async () => failure('offline'))
  await queue.dispatch({ ...operation, input: { ...operation.input, operationId: 'next' } }, async () => failure('offline'))
  await queue.dispatch({ ...operation, userId: 'B' }, async () => failure('offline'))
  const restored = new OfflineQueue(store, () => true)
  let calls = 0
  await restored.sync('A', async () => { calls++; return failure('validation') }, async () => 'A')
  assert.equal(calls, 1)
  assert.equal(restored.list('A').length, 2)
  assert.equal(restored.list('A')[0].error, 'validation')
  assert.equal(restored.list('B').length, 1)
  await restored.sync('A', async () => { throw new Error('wrong user') }, async () => 'B')
  await restored.discardRejected('A')
  assert.equal(restored.list('A').length, 1)
  assert.equal(restored.list('B').length, 1)
})

test('unknown command/credential fields and inaccessible persistence fail closed', async () => {
  const queue = new OfflineQueue(storage(), () => false)
  assert.deepEqual(await queue.dispatch({ ...operation, input: { ...operation.input, accessToken: 'not-stored' } }, async () => success(null)), failure('validation'))
  const inaccessible = new OfflineQueue({ getItem: () => null, setItem: () => { throw new Error('quota') } }, () => false)
  assert.deepEqual(await inaccessible.dispatch(operation, async () => success(null)), failure('server_error'))
})

test('ambiguous lost response is queued with same operation ID for authoritative deduplication', async () => {
  const queue = new OfflineQueue(storage(), () => true)
  assert.deepEqual(await queue.dispatch(operation, async () => failure('server_error')), failure('offline'))
  assert.equal(queue.list('A')[0].input.operationId, 'op-stable')
})
