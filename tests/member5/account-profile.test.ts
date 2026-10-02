import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/backendMock.ts'
import { createMockProgressStore } from '../../src/services/next/backendMockProgress.ts'
import { accountCatalog, assessmentInput, finishEpisode } from './account-fixtures.ts'

test('streak uses account timezone, qualifies once/day, expires after a gap and preserves longest', async () => {
  let instant = '2026-10-01T18:00:00Z' // October 2 in the default account timezone.
  const services = createMockLearningServices(accountCatalog(), { userId: 'a' }, () => instant)
  await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'text' })
  await services.completion.completeLesson({ lessonId: 'standard', operationId: 'lesson' })
  await services.completion.completeLesson({ lessonId: 'standard', operationId: 'replay' })
  let summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.currentStreak, 1)
  instant = '2026-10-02T18:00:00Z'
  await finishEpisode(services)
  await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'vn', operationId: 'episode' })
  summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.currentStreak, 2)
  instant = '2026-10-05T18:00:00Z'
  summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.currentStreak, 0)
  await services.quiz.submitScoredAttempt(assessmentInput('pass', 10))
  summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.currentStreak, 1)
  assert.equal(summary.ok && summary.value.longestStreak, 2)
})

test('account settings persist across adapters, isolate accounts and audit/cooldown timezone changes', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: 'a' }
  let instant = '2026-10-02T07:00:00Z'
  const services = createMockLearningServices(catalog, session, () => instant, store)
  const settings = await services.account.updateSettings({ soundMuted: true, analyticsEnabled: true, timezone: 'America/Los_Angeles' })
  assert.equal(settings.ok, true)
  assert.deepEqual(await services.account.updateSettings({ timezone: 'Invalid/Timezone' }), { ok: false, error: 'validation' })
  assert.deepEqual(await services.account.updateSettings({ timezone: 'UTC' }), { ok: false, error: 'conflict' })
  assert.deepEqual(await services.account.updateSettings({ totalXp: 999 } as never), { ok: false, error: 'validation' })
  const reloaded = createMockLearningServices(catalog, session, () => instant, store)
  assert.deepEqual(await reloaded.account.getSettings(), settings)
  session.userId = 'b'
  const other = await reloaded.account.getSettings()
  assert.equal(other.ok && other.value.soundMuted, false)
  session.userId = 'a'
  instant = '2026-10-03T07:00:00Z'
  assert.equal((await reloaded.account.updateSettings({ timezone: 'UTC' })).ok, true)
  assert.equal(store.accountStore.timezoneAudit.length, 2)
  assert.equal(store.accountStore.streakDays.size, 0)
})

test('timezone change cannot mint a second streak day from the same recent activity window', async () => {
  let instant = '2026-10-02T18:00:00Z'
  const services = createMockLearningServices(accountCatalog(), { userId: 'a', timezone: 'America/Los_Angeles' }, () => instant)
  await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'text' })
  await services.completion.completeLesson({ lessonId: 'standard', operationId: 'lesson' })
  await services.account.updateSettings({ timezone: 'Asia/Ho_Chi_Minh' })
  instant = '2026-10-02T19:00:00Z'
  await services.quiz.submitScoredAttempt(assessmentInput('pass', 10))
  const summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.currentStreak, 1)
})

test('mock auth hides credentials, persists users, supports switching and notifies subscribers', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: '' }
  const services = createMockLearningServices(catalog, session, () => '2026-10-02T07:00:00Z', store)
  assert.deepEqual(await services.auth.getSession(), { ok: true, value: null })
  assert.deepEqual(await services.account.getSummary(), { ok: false, error: 'unauthorized' })
  const events: Array<string | null> = []
  const stop = services.auth.subscribe(current => { events.push(current?.userId ?? null) })
  const input = { email: 'fixture@example.test', password: 'mock-password', displayName: 'Fixture', timezone: 'Asia/Ho_Chi_Minh' }
  const signedUp = await services.auth.signUp(input)
  assert.equal(signedUp.ok && signedUp.value?.displayName, 'Fixture')
  assert.doesNotMatch(JSON.stringify(signedUp), /password|token|email/)
  await services.account.updateSettings({ soundMuted: true })
  await services.auth.signOut()
  assert.deepEqual(await services.auth.signIn({ ...input, password: 'incorrect' }), { ok: false, error: 'unauthorized' })
  const reloaded = createMockLearningServices(catalog, session, () => '2026-10-02T07:00:00Z', store)
  assert.deepEqual(await reloaded.auth.signIn(input), signedUp)
  const settings = await reloaded.account.getSettings()
  assert.equal(settings.ok && settings.value.soundMuted, true)
  stop()
  await services.auth.signOut()
  assert.equal(events.length, 2)
  assert.equal(events[1], null)
})

test('analytics is opt-in, strips private/freeform fields and tolerates invalid events without blocking learning', async () => {
  const store = createMockProgressStore()
  const services = createMockLearningServices(accountCatalog(), { userId: 'a' }, () => '2026-10-02T07:00:00Z', store)
  const event = { name: 'lesson_started' as const, properties: { lesson_id: 'standard', version: 'v1', email: 'fixture@example.test', access_token: 'private', dialogue: 'private' } }
  await services.analytics.track(event)
  assert.equal(store.accountStore.analytics.length, 0)
  await services.account.updateSettings({ analyticsEnabled: true })
  await services.analytics.track(event)
  assert.deepEqual(store.accountStore.analytics[0].properties, { lesson_id: 'standard', version: 'v1' })
  await services.analytics.track({ name: 'unknown', properties: {} } as never)
  await services.analytics.track(null as never)
  await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'text' })
  assert.equal((await services.completion.completeLesson({ lessonId: 'standard', operationId: 'lesson' })).ok, true)
})
