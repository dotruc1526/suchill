import test from 'node:test'
import assert from 'node:assert/strict'
import { failure, success, type LearningServices } from '../../src/services/next/contracts.ts'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import { OfflineQueue } from '../../src/services/offline/queue.ts'
import { createOfflineLearningServices } from '../../src/services/offline/services.ts'
import { accountCatalog, assessmentInput } from './account-fixtures.ts'

function storage() {
  const values = new Map<string, string>()
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value) } }
}
const now = () => '2026-10-02T07:00:00Z'
const expectedSubject = (input: object) => (input as { expectedSubject?: string }).expectedSubject

test('caller-bound initialization keeps its account precondition out of durable queue payloads', async () => {
  const base = createMockLearningServices(accountCatalog(), { userId: 'A' }, now)
  const queue = new OfflineQueue(storage(), () => false)
  const runtime = createOfflineLearningServices(base, queue)
  const input = { lessonId: 'standard', blockId: 'text', operationId: 'bound-operation', expectedSubject: 'A' }
  assert.deepEqual(await runtime.services.completion.completeBlock(input), failure('offline'))
  assert.equal(queue.list('A').length, 1)
  assert.equal('expectedSubject' in queue.list('A')[0].input, false)
  assert.deepEqual(await runtime.services.completion.completeBlock({ ...input, operationId: 'wrong-owner', expectedSubject: 'B' }), failure('unauthorized'))
  assert.equal(queue.list('A').length, 1)
})

test('runtime auth changing before dispatch prevents transport from being invoked', async () => {
  const base = createMockLearningServices(accountCatalog(), { userId: 'A' }, now)
  let checks = 0, writes = 0
  const guarded: LearningServices = { ...base,
    auth: { ...base.auth, async getSession() { return success({ userId: ++checks === 1 ? 'A' : 'B', displayName: 'Fixture' }) } },
    completion: { ...base.completion, async completeLesson() { writes++; return failure('validation') } },
  }
  const runtime = createOfflineLearningServices(guarded, new OfflineQueue(storage(), () => true))
  assert.deepEqual(await runtime.services.completion.completeLesson({ lessonId: 'standard', operationId: 'operation' }), failure('unauthorized'))
  assert.equal(writes, 0)
})

test('account A precondition follows the command through asynchronous token binding and rejects B before any write', async () => {
  const session = { userId: 'A' }, base = createMockLearningServices(accountCatalog(), session, now)
  let writes = 0, observedSubject: string | undefined
  const guarded: LearningServices = { ...base, completion: { ...base.completion, async completeBlock(input) {
    observedSubject = expectedSubject(input)
    // Models the SDK obtaining B's token after the offline wrapper's final A session check.
    await Promise.resolve()
    session.userId = 'B'
    if (observedSubject !== session.userId) return failure('unauthorized')
    writes++
    return base.completion.completeBlock(input)
  } } }
  const runtime = createOfflineLearningServices(guarded, new OfflineQueue(storage(), () => true))
  const input = { lessonId: 'standard', blockId: 'text', operationId: 'operation' }
  assert.deepEqual(await runtime.services.completion.completeBlock(input), failure('unauthorized'))
  assert.equal(observedSubject, 'A')
  assert.equal(writes, 0)
  assert.deepEqual(await base.progress.getLessonProgress('standard'), success(null))
  assert.equal('expectedSubject' in input, false, 'The adapter does not mutate UI domain input.')
})

test('restored queue sends only its original account operations and retains A records when token changes to B', async () => {
  const session = { userId: 'A' }, base = createMockLearningServices(accountCatalog(), session, now), persisted = storage()
  let online = false, switchToken = true, calls = 0
  const guarded: LearningServices = { ...base, completion: { ...base.completion, async completeBlock(input) {
    calls++
    assert.equal(expectedSubject(input), 'A')
    if (switchToken) session.userId = 'B'
    // The mock authority enforces the same subject precondition as the trusted backend.
    return base.completion.completeBlock(input)
  } } }
  let queue = new OfflineQueue(persisted, () => online)
  let runtime = createOfflineLearningServices(guarded, queue)
  const input = { lessonId: 'standard', blockId: 'text', operationId: 'original-operation' }
  assert.deepEqual(await runtime.services.completion.completeBlock(input), failure('offline'))
  session.userId = 'B'
  online = true
  queue = new OfflineQueue(persisted, () => online)
  runtime = createOfflineLearningServices(guarded, queue)
  await runtime.sync()
  assert.equal(calls, 0)
  assert.equal(queue.list('A').length, 1)
  session.userId = 'A'
  await runtime.sync()
  assert.equal(calls, 1)
  assert.equal(queue.list('A')[0].input.operationId, 'original-operation')
  assert.deepEqual(await base.progress.getLessonProgress('standard'), success(null), 'B receives no A block completion.')
  session.userId = 'A'
  switchToken = false
  await runtime.sync()
  assert.equal(queue.list('A').length, 0)
  const progress = await base.progress.getLessonProgress('standard')
  assert.deepEqual(progress.ok && progress.value?.confirmedCompletedBlockIds, ['text'])
})

test('replay feedback remains account-owned and does not mutate progress or reward across switching', async () => {
  const session = { userId: 'A' }, base = createMockLearningServices(accountCatalog(), session, now)
  const context = { lessonId: 'mixed', blockId: 'vn', storyVersionId: 'story.v1' }
  await base.progress.saveEpisodeCheckpoint({ ...context, operationId: 'advance', currentSceneId: 'check', visitedSceneIds: ['start'] })
  await base.progress.recordChoice({ ...context, operationId: 'submit', sceneId: 'check', choiceId: 'right' })
  const before = await base.progress.getEpisodeProgress('story.v1')
  const guarded: LearningServices = { ...base, progress: { ...base.progress, async recordChoice(input) {
    assert.equal(expectedSubject(input), 'A')
    session.userId = 'B'
    return base.progress.recordChoice(input)
  } } }
  const runtime = createOfflineLearningServices(guarded, new OfflineQueue(storage(), () => true))
  assert.deepEqual(await runtime.services.progress.recordChoice({ ...context, operationId: 'replay', sceneId: 'check', choiceId: 'right', replay: true }), failure('unauthorized'))
  assert.deepEqual(await base.progress.getEpisodeProgress('story.v1'), success(null))
  const bSummary = await base.account.getSummary()
  assert.equal(bSummary.ok && bSummary.value.totalXp, 0)
  session.userId = 'A'
  assert.deepEqual(await base.progress.getEpisodeProgress('story.v1'), before)
  const replay = await createOfflineLearningServices(base, new OfflineQueue(storage(), () => true)).services.progress.recordChoice({
    ...context, operationId: 'own-replay', sceneId: 'check', choiceId: 'right', replay: true,
  })
  assert.equal(replay.ok && replay.value.choiceFeedback.outcome, 'correct')
  assert.deepEqual(await base.progress.getEpisodeProgress('story.v1'), before)
})

test('account checkpoint hints never masquerade as trusted completion when the session wrapper is active', async () => {
  const session = { userId: 'A' }, base = createMockLearningServices(accountCatalog(), session, now)
  const runtime = createOfflineLearningServices(base, new OfflineQueue(storage(), () => true))
  await runtime.services.progress.saveCheckpoint({ lessonId: 'standard', currentBlockId: 'text', completedBlockIds: ['text'], operationId: 'hints' })
  const hinted = await runtime.services.progress.getLessonProgress('standard')
  assert.deepEqual(hinted.ok && hinted.value?.completedBlockIds, ['text'])
  assert.deepEqual(hinted.ok && hinted.value?.confirmedCompletedBlockIds, [])
  assert.deepEqual(await runtime.services.completion.completeLesson({ lessonId: 'standard', operationId: 'premature' }), failure('validation'))
  session.userId = 'B'
  assert.deepEqual(await runtime.services.progress.getLessonProgress('standard'), success(null))
  session.userId = 'A'
  await runtime.services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'trusted' })
  const trusted = await runtime.services.progress.getLessonProgress('standard')
  assert.deepEqual(trusted.ok && trusted.value?.confirmedCompletedBlockIds, ['text'])
})

test('grading captures the submitting account before a reentrant auth switch and never grants the next user', async () => {
  const session = { userId: 'A', displayName: 'Account A' }, catalog = accountCatalog(), store = createMockProgressStore()
  const fixture = catalog.quizzes![0], originalGrade = fixture.grade
  fixture.grade = input => { session.userId = 'B'; session.displayName = 'Account B'; return originalGrade(input) }
  const services = createMockLearningServices(catalog, session, now, store)
  const input = assessmentInput('grade-switch', 10)
  assert.deepEqual(await services.quiz.submitScoredAttempt(input), failure('unauthorized'))
  let summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 0)
  session.userId = 'A'
  summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 25)
  assert.equal(summary.ok && summary.value.displayName, 'Account A')
  assert.equal((await services.quiz.submitScoredAttempt(input)).ok, true, 'A can replay the original immutable receipt.')
  assert.equal(store.accountStore.rewards.size, 2)
})

test('settings intent keeps the original account subject through a token switch and never changes B preferences', async () => {
  const session = { userId: 'A' }, base = createMockLearningServices(accountCatalog(), session, now)
  let observed: string | undefined
  const guarded: LearningServices = { ...base, account: { ...base.account, async updateSettings(input) {
    observed = expectedSubject(input)
    await Promise.resolve()
    session.userId = 'B'
    return base.account.updateSettings(input)
  } } }
  const runtime = createOfflineLearningServices(guarded, new OfflineQueue(storage(), () => true))
  const input = { analyticsEnabled: true, soundMuted: true, timezone: 'UTC' }
  assert.deepEqual(await runtime.services.account.updateSettings(input), failure('unauthorized'))
  assert.equal(observed, 'A')
  let settings = await base.account.getSettings()
  assert.equal(settings.ok && settings.value.analyticsEnabled, false)
  assert.equal(settings.ok && settings.value.soundMuted, false)
  assert.equal(settings.ok && settings.value.timezone, 'Asia/Ho_Chi_Minh')
  session.userId = 'A'
  settings = await createOfflineLearningServices(base, new OfflineQueue(storage(), () => true)).services.account.updateSettings(input)
  assert.equal(settings.ok && settings.value.soundMuted, true)
  assert.equal(settings.ok && settings.value.analyticsEnabled, true)
  assert.equal(settings.ok && 'expectedSubject' in settings.value, false, 'Transport identity never enters persisted settings.')
  assert.equal('expectedSubject' in input, false)
})

test('late analytics intent from A is dropped when token binding switches to opted-in B', async () => {
  const session = { userId: 'A' }, store = createMockProgressStore(), base = createMockLearningServices(accountCatalog(), session, now, store)
  await base.account.updateSettings({ analyticsEnabled: true })
  session.userId = 'B'
  await base.account.updateSettings({ analyticsEnabled: true })
  session.userId = 'A'
  let observed: string | undefined
  const guarded: LearningServices = { ...base, analytics: { async track(event) {
    observed = expectedSubject(event)
    await Promise.resolve()
    session.userId = 'B'
    await base.analytics.track(event)
  } } }
  const runtime = createOfflineLearningServices(guarded, new OfflineQueue(storage(), () => true))
  await runtime.services.analytics.track({ name: 'lesson_started', properties: { lesson_id: 'standard', version: 'v1' } })
  assert.equal(observed, 'A')
  assert.equal(store.accountStore.analytics.length, 0)
})
