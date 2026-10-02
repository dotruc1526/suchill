import test from 'node:test'
import assert from 'node:assert/strict'
import { scopeLearningServices } from '../../src/services/offline/accountScope.ts'
import { createOfflineLearningServices } from '../../src/services/offline/services.ts'
import { OfflineQueue } from '../../src/services/offline/queue.ts'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { CompletionOperation } from '../../src/features/learning/completion/completionOperation.ts'
import { accountCatalog, assessmentInput } from './account-fixtures.ts'
import { failure, success } from '../../src/services/next/contracts.ts'

const storage = () => {
  const values = new Map<string, string>()
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
}
const now = () => '2026-10-02T07:00:00Z'

test('an action from account A cannot bind to B before the completion microtask starts', async () => {
  const actor = { userId: 'A' }, base = createMockLearningServices(accountCatalog(), actor, now)
  const queue = new OfflineQueue(storage(), () => true)
  const services = scopeLearningServices(createOfflineLearningServices(base, queue).services, 'A')
  const operation = new CompletionOperation(id => services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: id }))
  const pending = operation.run()
  actor.userId = 'B'
  assert.deepEqual(await pending, failure('unauthorized'))
  assert.deepEqual(await base.progress.getLessonProgress('standard'), { ok: true, value: null })
  assert.deepEqual(queue.list('B'), [])
})

test('old rendered settings, assessment, telemetry and read actions cannot affect a newly selected account', async () => {
  const actor = { userId: 'A' }, base = createMockLearningServices(accountCatalog(), actor, now)
  const services = scopeLearningServices(base, 'A')
  actor.userId = 'B'
  assert.deepEqual(await services.account.updateSettings({ soundMuted: true }), failure('unauthorized'))
  assert.deepEqual(await services.quiz.submitScoredAttempt(assessmentInput('old-A', 10)), failure('unauthorized'))
  assert.deepEqual(await services.account.getSettings(), failure('unauthorized'))
  assert.deepEqual(await services.auth.signOut(), failure('unauthorized'))
  await services.analytics.track({ name: 'lesson_started', properties: { lesson_id: 'standard' } })
  const settings = await base.account.getSettings(), summary = await base.account.getSummary()
  assert.equal(settings.ok && settings.value.soundMuted, false)
  assert.equal(summary.ok && summary.value.totalXp, 0)
})

test('the currently rendered account retains normal completion and offline owner binding', async () => {
  const actor = { userId: 'A' }, base = createMockLearningServices(accountCatalog(), actor, now)
  const queue = new OfflineQueue(storage(), () => false)
  const runtime = createOfflineLearningServices(base, queue)
  const services = scopeLearningServices(runtime.services, 'A')
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'A-operation' }), failure('offline'))
  assert.equal(queue.list('A').length, 1)
  assert.equal(queue.list('B').length, 0)
  assert.equal('expectedSubject' in queue.list('A')[0].input, false)
})

test('settings and analytics caller subjects survive switching after the visible-account guard', async () => {
  const actor = { userId: 'A' }, base = createMockLearningServices(accountCatalog(), actor, now)
  let checks = 0, writes = 0, events = 0
  const guarded = { ...base,
    auth: { ...base.auth, async getSession() {
      if (++checks === 2) actor.userId = 'B'
      return success({ userId: actor.userId, displayName: actor.userId })
    } },
    account: { ...base.account, async updateSettings(input: Parameters<typeof base.account.updateSettings>[0]) { writes++; return base.account.updateSettings(input) } },
    analytics: { async track() { events++ } },
  }
  const services = scopeLearningServices(createOfflineLearningServices(guarded, new OfflineQueue(storage(), () => true)).services, 'A')
  assert.deepEqual(await services.account.updateSettings({ soundMuted: true }), failure('unauthorized'))
  assert.equal(writes, 0)
  actor.userId = 'A'; checks = 0
  await services.analytics.track({ name: 'lesson_started', properties: { lesson_id: 'standard' } })
  assert.equal(events, 0)
})

test('scoped reads discard ABA settings and release their observer, while thrown transports stay safe', async () => {
  const base = createMockLearningServices(accountCatalog(), { userId: 'A' }, now)
  let listener: Parameters<typeof base.auth.subscribe>[0] = () => {}, removed = 0
  const guarded = { ...base,
    auth: { ...base.auth, subscribe(callback: typeof listener) { listener = callback; return () => { removed++ } } },
    account: { ...base.account, async getSettings() {
      listener({ userId: 'B', displayName: 'B' }); listener({ userId: 'A', displayName: 'A' })
      return base.account.getSettings()
    } },
  }
  const services = scopeLearningServices(guarded, 'A')
  assert.deepEqual(await services.account.getSettings(), failure('unauthorized'))
  assert.equal(removed, 1)
  guarded.account.getSettings = async () => { throw new Error('private transport') }
  assert.deepEqual(await scopeLearningServices(guarded, 'A').account.getSettings(), failure('server_error'))
  assert.equal(removed, 2)
})

test('scoped security actions carry the rendered account through a switch during the guard await', async () => {
  const base = createMockLearningServices(accountCatalog(), { userId: 'A' }, now)
  let actor = 'A', mutations = 0
  const guarded = { ...base, auth: { ...base.auth,
    async getSession() { const result = success({ userId: actor, displayName: actor }); actor = 'B'; return result },
    async updatePassword(_password: string, context?: { expectedSubject?: string }) {
      if (context?.expectedSubject !== actor) return failure<null>('unauthorized')
      mutations++; return success(null)
    },
  } }
  assert.deepEqual(await scopeLearningServices(guarded, 'A').auth.updatePassword?.('fixture-password'), failure('unauthorized'))
  assert.equal(mutations, 0)
})
