import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices, type MockCatalog } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import { playbackCatalog } from './playback-fixtures.ts'
import type { CompletionOutcome } from '../../src/services/next/completionContracts.ts'
import type { Result } from '../../src/services/next/contracts.ts'

const stamp = '2026-10-02T16:59:00Z'
const catalog = (): MockCatalog => {
  const value = playbackCatalog()
  value.lessons[0].blocks = [{ kind: 'text', id: 'text', documentId: 'doc', order: 0, required: true }]
  value.documents = [{ id: 'doc', title: 'Fixture', locale: 'vi-VN', status: 'published', sourceIds: [], sections: [{ id: 'p', kind: 'paragraph', text: 'Fixture' }] }]
  value.completionPolicies = [{ lessonId: 'lesson', contentVersionId: 'v1', eligibilityVersion: 'reward1', requiredLesson: true }]
  return value
}
const setup = (value = catalog(), store = createMockProgressStore(), userId = 'a', clock = () => stamp) =>
  createMockLearningServices(value, { userId, timezone: 'Asia/Ho_Chi_Minh', displayName: 'Vinh' }, clock, store)
const unwrap = <T>(value: Result<T>): T => { assert.equal(value.ok, true); if (!value.ok) throw Error(value.error); return value.value }
const complete = async (services: ReturnType<typeof setup>, operationId = 'complete') =>
  unwrap(await services.completion.completeLesson({ lessonId: 'lesson', operationId }))
const ack = async (services: ReturnType<typeof setup>, blockId = 'text', operationId = 'ack') =>
  unwrap(await services.completion.recordBlockAction({ lessonId: 'lesson', blockId, operationId, action: 'acknowledge' }))
const receipt = (outcome: CompletionOutcome) => { assert.notEqual(outcome.kind, 'ineligible'); if (outcome.kind === 'ineligible') throw Error('ineligible'); return outcome.receipt }

test('checkpoints alone cannot grant completion; explicit action confirms receipt and summary', async () => {
  const services = setup()
  assert.equal(unwrap(await services.completion.getLessonCompletion('lesson')), null)
  await services.progress.saveCheckpoint({ lessonId: 'lesson', currentBlockId: 'text', completedBlockIds: ['text'], operationId: 'checkpoint' })
  assert.equal((await complete(services)).kind, 'ineligible')
  await ack(services)
  const result = receipt(await complete(services))
  assert.equal(result.contentVersionId, 'v1'); assert.equal(result.confirmedAt, stamp)
  assert.equal(result.rewards[0].xpDelta, 10)
  const summary = unwrap(await services.users.getAccountSummary())!
  assert.equal(summary.totalXp, 10); assert.equal(summary.currentStreak, 1); assert.equal(summary.requiredLessonCount, 1)
  assert.equal(unwrap(await services.progress.getLessonProgress('lesson'))?.status, 'completed')
})

test('race, same operation, fresh operation and adapter recreation grant once', async () => {
  const store = createMockProgressStore(); const value = catalog(); const services = setup(value, store)
  await ack(services)
  const results = await Promise.all([complete(services), complete(services), complete(services, 'fresh')])
  assert.deepEqual(results[0], results[1]); assert.equal(results[2].kind, 'already_completed')
  assert.equal(receipt(results[2]).rewards[0].xpDelta, 0)
  const reload = setup(value, store)
  assert.equal((await complete(reload, 'reload')).kind, 'already_completed')
  assert.equal(unwrap(await reload.users.getAccountSummary())?.totalXp, 10)
  const saved = unwrap(await reload.completion.getLessonCompletion('lesson'))!
  saved.rewards[0].xpDelta = 500
  assert.equal(unwrap(await reload.users.getAccountSummary())?.totalXp, 10)
})

test('invalid, unauthorized, unknown and reused payloads return typed failures', async () => {
  assert.deepEqual(await setup(catalog(), undefined, '').users.getAccountSummary(), { ok: false, error: 'unauthorized' })
  assert.deepEqual(await setup(catalog(), undefined, '').completion.completeLesson({ lessonId: 'lesson', operationId: 'x' }), { ok: false, error: 'unauthorized' })
  const services = setup(); await ack(services)
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'lesson', operationId: ' ' }), { ok: false, error: 'validation' })
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'foreign', operationId: 'x' }), { ok: false, error: 'not_found' })
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'lesson', operationId: 'x', xp: 100 } as never), { ok: false, error: 'validation' })
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'lesson', operationId: 'ack' }), { ok: false, error: 'conflict' })
  const value = catalog(); delete value.completionPolicies
  assert.deepEqual(await setup(value).completion.completeLesson({ lessonId: 'lesson', operationId: 'x' }), { ok: false, error: 'validation' })
})

test('shared store isolates accounts and resets with a fresh store', async () => {
  const store = createMockProgressStore(); const services = setup(catalog(), store)
  await ack(services); await complete(services)
  const other = setup(catalog(), store, 'b')
  assert.equal(unwrap(await other.users.getAccountSummary())?.totalXp, 0)
  assert.equal(unwrap(await other.completion.getLessonCompletion('lesson')), null)
  assert.equal((await complete(other)).kind, 'ineligible')
  assert.equal(unwrap(await setup().users.getAccountSummary())?.totalXp, 0)
})

test('minor version correction requires new evidence but cannot farm XP or streak', async () => {
  const value = catalog(); const store = createMockProgressStore(); const first = setup(value, store)
  await ack(first); await complete(first)
  value.completionPolicies![0].contentVersionId = 'v2'
  const second = setup(value, store, 'a', () => '2026-10-03T17:01:00Z')
  assert.equal((await complete(second, 'v2')).kind, 'ineligible')
  await ack(second, 'text', 'v2ack')
  assert.equal(receipt(await complete(second, 'v2')).rewards[0].status, 'already_granted')
  assert.equal(unwrap(await second.users.getAccountSummary())?.totalXp, 10)
  assert.equal(unwrap(await second.users.getAccountSummary())?.currentStreak, 0)
})

test('timezone boundary, same day, consecutive day, gap and invalid clocks', async () => {
  const value = catalog(); const store = createMockProgressStore()
  let clock = stamp
  const services = setup(value, store, 'a', () => clock)
  for (const [i, time] of [stamp, '2026-10-02T17:01:00Z', '2026-10-02T18:00:00Z', '2026-10-05T17:00:00Z'].entries()) {
    clock = time
    value.completionPolicies![0].contentVersionId = `version${i}`
    value.completionPolicies![0].eligibilityVersion = `reward${i}`
    await ack(services, 'text', `ack${i}`); await complete(services, `complete${i}`)
    const summary = unwrap(await services.users.getAccountSummary())!
    assert.equal(summary.currentStreak, [1, 2, 2, 1][i]); assert.equal(summary.longestStreak, [1, 2, 2, 2][i])
  }
  const bad = setup(catalog(), undefined, 'a', () => 'invalid'); await ack(bad)
  assert.deepEqual(await bad.completion.completeLesson({ lessonId: 'lesson', operationId: 'x' }), { ok: false, error: 'validation' })
  assert.deepEqual(await bad.users.getAccountSummary(), { ok: false, error: 'validation' })
  assert.equal(unwrap(await services.users.getAccountSummary())?.totalXp, 40)
})

const videoCatalog = () => {
  const value = catalog()
  value.lessons[0].blocks = [{ kind: 'video', id: 'video-block', mediaAssetId: 'video', completionPolicy: 'watch_threshold', order: 0, required: true }]
  return value
}
const watch = (services: ReturnType<typeof setup>, ranges: Array<{ start: number; end: number }>, operationId = 'watch') =>
  services.progress.saveVideoPosition({ lessonId: 'lesson', blockId: 'video-block', positionSeconds: 100, watchedRanges: ranges, operationId })

test('video threshold counts unique ranges, not seek/end or overlapped samples', async () => {
  const services = setup(videoCatalog())
  unwrap(await watch(services, [{ start: 0, end: 50 }, { start: 0, end: 50 }]))
  assert.equal((await complete(services)).kind, 'ineligible')
  unwrap(await watch(services, [{ start: 50, end: 90 }], 'watch2'))
  assert.equal((await complete(services)).kind, 'completed')
})

test('reach_end needs a stored played near-end range; optional video does not block', async () => {
  const value = videoCatalog(); const block = value.lessons[0].blocks[0]
  if (block.kind !== 'video') throw Error('fixture')
  block.completionPolicy = 'reach_end'
  const services = setup(value)
  unwrap(await watch(services, [])); assert.equal((await complete(services)).kind, 'ineligible')
  unwrap(await watch(services, [{ start: 94, end: 99 }], 'near-end'))
  assert.equal((await complete(services)).kind, 'completed')
  block.completionPolicy = 'optional'
  assert.deepEqual(await setup(value).completion.completeLesson({ lessonId: 'lesson', operationId: 'optional-only' }), { ok: false, error: 'validation' })
  value.lessons[0].blocks.push({ kind: 'text', id: 'text', documentId: 'doc', order: 1, required: true })
  const optional = setup(value); await ack(optional)
  assert.equal((await complete(optional)).kind, 'completed')
})

test('fallback requires published transcript, authored linkage and explicit recap evidence', async () => {
  const value = videoCatalog()
  value.lessons[0].blocks.push({ kind: 'recap', id: 'recap', documentId: 'doc', required: true, order: 1 })
  value.completionPolicies![0].videoFallbacks = [{ blockId: 'video-block', checkBlockId: 'recap' }]
  const services = setup(value)
  unwrap(await services.completion.recordBlockAction({ lessonId: 'lesson', blockId: 'video-block', operationId: 'fallback', action: 'accessible_fallback' }))
  assert.equal((await complete(services)).kind, 'ineligible')
  await ack(services, 'recap')
  value.mediaResources![1].reviewStatus = 'draft'
  assert.equal((await complete(services)).kind, 'ineligible')
  value.mediaResources![1].reviewStatus = 'published'
  assert.equal(receipt(await complete(services)).method, 'accessible_fallback')
})

test('new content version cannot reuse old video ranges', async () => {
  const value = videoCatalog(); const store = createMockProgressStore(); const services = setup(value, store)
  unwrap(await watch(services, [{ start: 0, end: 90 }]))
  value.completionPolicies![0].contentVersionId = 'v2'
  unwrap(await watch(services, [{ start: 90, end: 100 }], 'new-range'))
  assert.equal((await complete(services, 'v2complete')).kind, 'ineligible')
})

test('VN jump-to-end checkpoint cannot replace stored choice attempts on the selected path', async () => {
  const value = catalog(); value.lessons[0].format = 'visual_novel'
  value.lessons[0].blocks = [{ kind: 'visual_novel', id: 'vn-block', storyVersionId: 'version-1', order: 0, required: true }]
  const scene = value.storyVersions[0].scenes[1]
  if (scene.kind !== 'choice') throw Error('fixture')
  scene.policy = 'retry_until_correct'; scene.choices = [
    { id: 'wrong', kind: 'knowledge_check', label: 'Sai', isCorrect: false, explanation: 'Sai', nextSceneId: 'end' },
    { id: 'right', kind: 'knowledge_check', label: 'Đúng', isCorrect: true, explanation: 'Đúng', nextSceneId: 'end' },
  ]
  const services = setup(value)
  const context = { lessonId: 'lesson', blockId: 'vn-block', storyVersionId: 'version-1' }
  unwrap(await services.progress.saveEpisodeCheckpoint({ ...context, currentSceneId: 'end', visitedSceneIds: ['start', 'choice', 'end'], operationId: 'jump' }))
  assert.equal((await complete(services)).kind, 'ineligible')
  unwrap(await services.progress.saveEpisodeCheckpoint({ ...context, currentSceneId: 'choice', visitedSceneIds: ['start', 'choice'], operationId: 'choice-scene' }))
  unwrap(await services.progress.recordChoice({ ...context, sceneId: 'choice', choiceId: 'wrong', operationId: 'wrong' }))
  assert.equal((await complete(services)).kind, 'ineligible')
  unwrap(await services.progress.recordChoice({ ...context, sceneId: 'choice', choiceId: 'right', operationId: 'right' }))
  assert.equal(receipt(await complete(services)).rewards[0].xpDelta, 20)
})

test('stored quiz grading gates scored completion; practice only needs all answers', async () => {
  for (const mode of ['scored', 'practice'] as const) {
    const value = catalog(); value.lessons[0].format = 'quiz'
    value.lessons[0].blocks = [{ kind: 'quiz', id: 'quiz', questionSetId: 'qset', assessmentMode: mode, order: 0, required: true }]
    value.completionPolicies![0].rewardedAssessmentIds = ['qset']
    value.quizzes = [{ status: 'published', set: { id: 'qset', title: 'Quiz', mode, questionIds: ['q'], learningObjectiveIds: ['o'] },
      questions: [{ id: 'q', prompt: 'Q', optionIds: ['a', 'b'], options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], explanation: 'Answer', sourceIds: [], difficulty: 'intro', status: 'published' }],
      grade: input => { const correct = input.answers[0].selectedOptionIds[0] === 'a'; return { attemptId: input.operationId, score: correct ? 1 : 0, total: 1, passed: correct, feedback: [{ questionId: 'q', outcome: correct ? 'correct' : 'incorrect', explanation: 'Answer' }] } },
    }]
    const store = createMockProgressStore(); const services = setup(value, store)
    assert.equal((await complete(services)).kind, 'ineligible')
    const submit = mode === 'scored' ? services.quiz.submitScoredAttempt : services.quiz.submitPracticeAttempt
    unwrap(await submit({ operationId: 'wrong', questionSetId: 'qset', answers: [{ questionId: 'q', selectedOptionIds: ['b'] }] }))
    assert.equal((await complete(services, 'first')).kind, mode === 'scored' ? 'ineligible' : 'completed')
    if (mode === 'scored') {
      unwrap(await submit({ operationId: 'right', questionSetId: 'qset', answers: [{ questionId: 'q', selectedOptionIds: ['a'] }] }))
      const reload = setup(value, store)
      assert.equal(receipt(await complete(reload)).rewards.reduce((sum, item) => sum + item.xpDelta, 0), 25)
      assert.equal(unwrap(await reload.users.getAccountSummary())?.totalXp, 25)
    }
  }
})

test('mixed lesson requires every stored block and cannot read another account evidence', async () => {
  const value = catalog()
  value.lessons[0].blocks.push(
    { kind: 'visual_novel', id: 'vn-block', storyVersionId: 'version-1', order: 1, required: true },
    { kind: 'video', id: 'video-block', mediaAssetId: 'video', completionPolicy: 'watch_threshold', order: 2, required: true },
  )
  const store = createMockProgressStore(); const services = setup(value, store)
  await ack(services)
  unwrap(await watch(services, [{ start: 0, end: 90 }]))
  assert.equal((await complete(services)).kind, 'ineligible')
  const context = { lessonId: 'lesson', blockId: 'vn-block', storyVersionId: 'version-1' }
  unwrap(await services.progress.saveEpisodeCheckpoint({ ...context, currentSceneId: 'choice', visitedSceneIds: ['start', 'choice'], operationId: 'scene' }))
  unwrap(await services.progress.recordChoice({ ...context, sceneId: 'choice', choiceId: 'choice-a', operationId: 'selection' }))
  assert.equal(receipt(await complete(services)).rewards.reduce((sum, reward) => sum + reward.xpDelta, 0), 30)
  assert.equal((await complete(setup(value, store, 'b'))).kind, 'ineligible')
  assert.equal(unwrap(await setup(value, store, 'b').users.getAccountSummary())?.requiredLessonCount, 0)
})

test('fresh replay operation returns the same already_completed outcome on retry', async () => {
  const services = setup(); await ack(services); await complete(services)
  const first = await complete(services, 'fresh')
  assert.equal(first.kind, 'already_completed')
  assert.deepEqual(await complete(services, 'fresh'), first)
})

test('invalid timezone rolls back all completion writes', async () => {
  const store = createMockProgressStore()
  const services = createMockLearningServices(catalog(), { userId: 'a', timezone: 'bad/timezone' }, () => stamp, store)
  await ack(services)
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'lesson', operationId: 'complete' }), { ok: false, error: 'validation' })
  assert.equal(store.completion.receipts.size, 0); assert.equal(store.completion.rewards.size, 0)
  assert.equal(store.completion.days.size, 0)
})

test('reach_end merges adjacent and overlapping playback but never bridges gaps', async () => {
  for (const [ranges, expected] of [
    [[{ start: 0, end: 96 }, { start: 96, end: 100 }], 'completed'],
    [[{ start: 96, end: 100 }, { start: 0, end: 97 }], 'completed'],
    [[{ start: 0, end: 94 }, { start: 96, end: 100 }], 'ineligible'],
    [[{ start: 96, end: 100 }], 'ineligible'],
  ] as const) {
    const value = videoCatalog()
    const block = value.lessons[0].blocks[0]
    if (block.kind !== 'video') throw Error('fixture')
    block.completionPolicy = 'reach_end'
    const services = setup(value)
    unwrap(await watch(services, [...ranges]))
    assert.equal((await complete(services)).kind, expected)
  }
})

test('episode qualifies streak outside required lessons; replay/version/lesson reuse cannot farm days', async () => {
  const value = catalog(); const store = createMockProgressStore()
  value.lessons[0].format = 'visual_novel'
  value.lessons[0].blocks = [{ kind: 'visual_novel', id: 'vn-block', storyVersionId: 'version-1', order: 0, required: true }]
  value.completionPolicies![0].requiredLesson = false
  let clock = stamp
  const services = setup(value, store, 'a', () => clock)
  const play = async (lessonId: string, prefix: string) => {
    const context = { lessonId, blockId: 'vn-block', storyVersionId: 'version-1' }
    unwrap(await services.progress.saveEpisodeCheckpoint({ ...context, currentSceneId: 'choice', visitedSceneIds: ['start', 'choice'], operationId: `${prefix}-scene` }))
    unwrap(await services.progress.recordChoice({ ...context, sceneId: 'choice', choiceId: 'choice-a', operationId: `${prefix}-choice` }))
    return unwrap(await services.completion.completeLesson({ lessonId, operationId: `${prefix}-complete` }))
  }
  assert.equal(receipt(await play('lesson', 'first')).rewards[0].xpDelta, 20)
  const summary = unwrap(await services.users.getAccountSummary())!
  assert.equal(summary.currentStreak, 1); assert.equal(summary.requiredLessonCount, 0)
  clock = '2026-10-03T17:01:00Z'
  assert.equal((await complete(services, 'replay')).kind, 'already_completed')
  value.completionPolicies![0].contentVersionId = 'v2'
  assert.equal(receipt(await play('lesson', 'minor')).rewards[0].xpDelta, 0)
  value.lessons.push({ ...value.lessons[0], id: 'other' })
  value.completionPolicies!.push({ ...value.completionPolicies![0], lessonId: 'other' })
  assert.equal(receipt(await play('other', 'reuse')).rewards[0].xpDelta, 0)
  assert.equal(unwrap(await services.users.getAccountSummary())?.currentStreak, 0)
  assert.equal(unwrap(await services.users.getAccountSummary())?.totalXp, 20)
  assert.equal(unwrap(await services.users.getAccountSummary())?.requiredLessonCount, 0)
  assert.equal(store.completion.days.get('a')?.size, 1)
  assert.equal(unwrap(await setup(value, store, 'b').users.getAccountSummary())?.currentStreak, 0)
})

test('optional-only catalog cannot complete or grant XP/streak without required learning evidence', async () => {
  for (const format of ['mixed', 'visual_novel', 'quiz'] as const) {
    const value = catalog(); const store = createMockProgressStore()
    value.lessons[0].format = format
    value.lessons[0].blocks[0].required = false
    const services = setup(value, store)
    assert.deepEqual(await services.completion.completeLesson({ lessonId: 'lesson', operationId: 'complete' }), { ok: false, error: 'validation' })
    await ack(services)
    assert.deepEqual(await services.completion.completeLesson({ lessonId: 'lesson', operationId: 'complete' }), { ok: false, error: 'validation' })
    assert.equal(store.completion.receipts.size, 0); assert.equal(store.completion.rewards.size, 0)
    assert.equal(store.completion.days.size, 0); assert.equal(store.completion.requiredLessons.size, 0)
    assert.equal(unwrap(await services.progress.getLessonProgress('lesson')), null)
    value.lessons[0].blocks[0].required = true
    assert.equal((await complete(services)).kind, 'completed')
  }
})

test('backwards completion day rolls back; retry stays stable and summary excludes future days', async () => {
  const value = catalog(); const store = createMockProgressStore()
  value.lessons.push({ ...value.lessons[0], id: 'second' })
  value.completionPolicies!.push({ ...value.completionPolicies![0], lessonId: 'second' })
  let clock = '2026-10-03T05:00:00Z'
  const services = setup(value, store, 'a', () => clock)
  await ack(services)
  const first = await complete(services)
  unwrap(await services.completion.recordBlockAction({ lessonId: 'second', blockId: 'text', operationId: 'ack-second', action: 'acknowledge' }))
  clock = '2026-10-02T05:00:00Z'
  const before = structuredClone(store)
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'second', operationId: 'second-complete' }), { ok: false, error: 'validation' })
  assert.deepEqual(store, before)
  assert.deepEqual(await complete(services), first)
  const summary = unwrap(await services.users.getAccountSummary())!
  assert.equal(summary.currentStreak, 0); assert.equal(summary.longestStreak, 0)
  const other = setup(value, store, 'b', () => clock); await ack(other)
  assert.equal((await complete(other)).kind, 'completed')
  clock = '2026-10-03T06:00:00Z'
  assert.equal(unwrap(await services.completion.completeLesson({ lessonId: 'second', operationId: 'second-complete' })).kind, 'completed')
  assert.equal(unwrap(await services.users.getAccountSummary())?.currentStreak, 1)
  assert.equal(unwrap(await services.users.getAccountSummary())?.requiredLessonCount, 2)
})


test('M3 mock completion stays pending offline and confirms the same intent only after reconnect', async () => {
  const services = setup(catalog())
  const input = { lessonId: 'lesson', operationId: 'offline-preserved-intent' }
  unwrap(await services.completion.recordBlockAction({ lessonId: 'lesson', blockId: 'text', operationId: 'offline-read', action: 'acknowledge' }))
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: false } })
    assert.deepEqual(await services.completion.completeLesson(input), { ok: false, error: 'offline' })
    assert.equal(unwrap(await services.users.getAccountSummary()).totalXp, 0)
    assert.equal(unwrap(await services.completion.getLessonCompletion('lesson')), null)
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: true } })
    assert.equal(unwrap(await services.completion.completeLesson(input)).kind, 'completed')
    assert.equal(unwrap(await services.users.getAccountSummary()).totalXp, 10)
    assert.equal(unwrap(await services.completion.completeLesson(input)).kind, 'completed')
    assert.equal(unwrap(await services.users.getAccountSummary()).totalXp, 10)
  } finally {
    if (original) Object.defineProperty(globalThis, 'navigator', original)
    else Reflect.deleteProperty(globalThis, 'navigator')
  }
})
