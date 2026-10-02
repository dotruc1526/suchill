import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createCompletionController } from '../../src/features/learning/completion/completionController.ts'
import { createSummaryController } from '../../src/features/profile/summaryController.ts'
import { failure, success, type LearningServices, type Result } from '../../src/services/next/contracts.ts'
import type { AccountSummary, CompletionOutcome, CompletionReceipt } from '../../src/services/next/completionContracts.ts'
const receipt: CompletionReceipt = { userId: 'a', lessonId: 'lesson', contentVersionId: 'v1', confirmedAt: '2026-10-02T03:00:00Z', method: 'standard', reason: 'required_blocks_satisfied', rewards: [] }
const account: AccountSummary = { userId: 'a', displayName: 'Dương', locale: 'vi-VN', timezone: 'Asia/Ho_Chi_Minh', totalXp: 10, currentStreak: 1, longestStreak: 1, requiredLessonCount: 1, achievements: [] }
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(r => { resolve = r }); return { promise, resolve } }
function setup() {
  const calls: Array<{ lessonId: string; operationId: string }> = []
  const actions: string[] = []
  const services = { completion: {
    async getLessonCompletion(): Promise<Result<CompletionReceipt | null>> { return success(null) },
    async completeLesson(input: { lessonId: string; operationId: string }): Promise<Result<CompletionOutcome>> { calls.push(input); return success({ kind: 'completed', receipt }) },
    async recordBlockAction(input: { operationId: string }) { actions.push(input.operationId); return success(null) },
  }, users: { async getAccountSummary(): Promise<Result<AccountSummary | null>> { return success(account) } } } as unknown as LearningServices
  let ids = 0
  const summary = createSummaryController(services, 'a')
  const controller = createCompletionController(services, { userId: 'a', lessonId: 'lesson', contentVersionId: 'v1' }, summary, () => `id-${++ids}`)
  return { services, summary, controller, calls, actions }
}
test('double submit is locked synchronously and summary is service-confirmed', async () => {
  const s = setup(), pending = deferred<Result<CompletionOutcome>>()
  s.services.completion.completeLesson = async input => { s.calls.push(input); return pending.promise }
  await s.controller.restore()
  const first = s.controller.submit(); await s.controller.submit()
  assert.equal(s.calls.length, 1); assert.equal(s.summary.getSnapshot().value, undefined)
  pending.resolve(success({ kind: 'completed', receipt })); await first
  assert.equal(s.controller.getSnapshot().status, 'confirmed'); assert.equal(s.summary.getSnapshot().value?.totalXp, 10)
})
test('offline, thrown and ineligible retries retain operation ID with no optimistic reward', async () => {
  const s = setup(); let attempt = 0
  s.services.completion.completeLesson = async input => { s.calls.push(input); attempt++; if (attempt === 1) return failure('offline'); if (attempt === 2) throw Error('network'); if (attempt === 3) return success({ kind: 'ineligible', reasons: [{ blockId: 'text', reason: 'required_evidence_missing' }] }); return success({ kind: 'completed', receipt }) }
  await s.controller.restore()
  for (let i = 0; i < 3; i++) { await s.controller.submit(); assert.equal(s.summary.getSnapshot().value, undefined) }
  await s.controller.submit(); assert.equal(new Set(s.calls.map(x => x.operationId)).size, 1)
})
test('summary error retains receipt and confirmed values; read retry never resubmits', async () => {
  const s = setup(); await s.summary.refresh()
  s.services.users.getAccountSummary = async () => failure('server_error')
  await s.controller.restore(); await s.controller.submit()
  assert.equal(s.controller.getSnapshot().receipt, receipt); assert.equal(s.summary.getSnapshot().value?.totalXp, 10)
  await s.summary.refresh(); assert.equal(s.calls.length, 1)
})
test('null, zero XP and unauthorized summaries remain distinct', async () => {
  const s = setup(); s.services.users.getAccountSummary = async () => success({ ...account, totalXp: 0 })
  await s.summary.refresh(); assert.equal(s.summary.getSnapshot().status, 'ready')
  s.services.users.getAccountSummary = async () => success(null); await s.summary.refresh(); assert.equal(s.summary.getSnapshot().status, 'empty')
  s.services.users.getAccountSummary = async () => failure('unauthorized'); await s.summary.refresh(); assert.equal(s.summary.getSnapshot().value, undefined)
})
test('restore errors cannot submit; restored receipts do not claim new rewards', async () => {
  const s = setup(); s.services.completion.getLessonCompletion = async () => failure('offline')
  await s.controller.restore(); await s.controller.submit(); assert.equal(s.calls.length, 0)
  s.services.completion.getLessonCompletion = async () => success(receipt)
  await s.controller.restore(); assert.equal(s.controller.getSnapshot().outcome, undefined)
  await s.controller.submit(); assert.equal(s.calls.length, 0)
})
test('stale read responses cannot overwrite a later restoration or summary', async () => {
  const s = setup(), slow = deferred<Result<CompletionReceipt | null>>()
  s.services.completion.getLessonCompletion = async () => slow.promise
  const old = s.controller.restore()
  s.services.completion.getLessonCompletion = async () => success(receipt); await s.controller.restore()
  slow.resolve(success(null)); await old; assert.equal(s.controller.getSnapshot().status, 'confirmed')
  const oldSummary = deferred<Result<AccountSummary | null>>()
  s.services.users.getAccountSummary = async () => oldSummary.promise; const previous = s.summary.refresh()
  s.services.users.getAccountSummary = async () => success({ ...account, totalXp: 20 }); await s.summary.refresh()
  oldSummary.resolve(success(account)); await previous; assert.equal(s.summary.getSnapshot().value?.totalXp, 20)
})
test('foreign account, lesson or version receipt and foreign summary are rejected', async () => {
  for (const delta of [{ userId: 'b' }, { lessonId: 'other' }, { contentVersionId: 'v2' }]) {
    const s = setup(); s.services.completion.getLessonCompletion = async () => success({ ...receipt, ...delta }); await s.controller.restore(); assert.equal(s.controller.getSnapshot().error, 'unauthorized')
  }
  const s = setup(); s.services.users.getAccountSummary = async () => success({ ...account, userId: 'b' }); await s.summary.refresh(); assert.equal(s.summary.getSnapshot().value, undefined)
})
test('block acknowledgement flush blocks submission and retries stable action ID', async () => {
  const s = setup(), pending = deferred<Result<null>>()
  await s.controller.restore(); s.services.completion.recordBlockAction = async input => { s.actions.push(input.operationId); return pending.promise }
  const ack = s.controller.acknowledge('text'); await s.controller.submit(); assert.equal(s.calls.length, 0)
  pending.resolve(failure('offline')); await ack
  s.services.completion.recordBlockAction = async input => { s.actions.push(input.operationId); return success(null) }
  await s.controller.acknowledge('text'); assert.equal(s.actions[0], s.actions[1]); await s.controller.submit(); assert.equal(s.calls.length, 1)
})
test('validation retry preserves intent; conflict and not_found cannot be bypassed', async () => {
  for (const code of ['validation', 'conflict', 'not_found', 'unauthorized'] as const) {
    const s = setup(); s.services.completion.completeLesson = async input => { s.calls.push(input); return failure(code) }
    await s.controller.restore(); await s.controller.submit(); await s.controller.submit()
    assert.equal(s.calls.length, code === 'validation' ? 2 : 1)
    if (s.calls.length === 2) assert.equal(s.calls[0].operationId, s.calls[1].operationId)
  }
})
test('technical catalog reads require explicit acknowledgement and do not duplicate XP', async () => {
  const { m3JourneyServices, m3CompletionVersions } = await import('../../src/services/next/m3JourneyFixture.ts')
  const summary = createSummaryController(m3JourneyServices, 'fixture.user.duong')
  const id = 'fixture.lesson.1972.context'
  const c = createCompletionController(m3JourneyServices, { userId: 'fixture.user.duong', lessonId: id, contentVersionId: m3CompletionVersions[id] }, summary)
  await c.restore(); await c.submit(); assert.equal(c.getSnapshot().status, 'ineligible')
  await c.acknowledge('fixture.block.1972.context.text'); await c.submit(); assert.equal(c.getSnapshot().status, 'confirmed')
  assert.equal(summary.getSnapshot().value?.totalXp, 10)
  await c.restore(); await c.submit(); assert.equal(summary.getSnapshot().value?.totalXp, 10)
})

test('session registry preserves pending intent across remount and isolates account/services epochs', async () => {
  const { createCompletionSession } = await import('../../src/features/learning/completion/completionSessionModel.ts')
  const s = setup(); const a = createCompletionSession(s.services, 'a')
  const first = a.lesson('lesson', 'v1'); await first.restore()
  s.services.completion.completeLesson = async input => { s.calls.push(input); return failure('offline') }
  await first.submit()
  const remount = a.lesson('lesson', 'v1'); assert.equal(remount, first)
  await remount.restore(); await remount.submit(); assert.equal(s.calls[0].operationId, s.calls[1].operationId)
  assert.notEqual(a.lesson('lesson', 'v2'), first)
  const pending = deferred<Result<CompletionOutcome>>()
  s.services.completion.completeLesson = async () => pending.promise
  const oldWrite = first.submit()
  const b = createCompletionSession(s.services, 'b'); const newEpoch = createCompletionSession(s.services, 'a')
  assert.notEqual(newEpoch.lesson('lesson', 'v1'), first)
  pending.resolve(success({ kind: 'completed', receipt })); await oldWrite
  assert.equal(b.lesson('lesson', 'v1').getSnapshot().receipt, undefined)
  assert.equal(newEpoch.lesson('lesson', 'v1').getSnapshot().receipt, undefined)
  assert.equal(b.summary.getSnapshot().value, undefined)
})
