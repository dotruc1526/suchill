import test from 'node:test'
import assert from 'node:assert/strict'
import { CompletionOperation } from '../../src/features/learning/completion/completionOperation.ts'
import { accountHomeActivity } from '../../src/features/learning/journey/accountHomeActivity.ts'
import { loadJourney } from '../../src/features/learning/journey/backendJourneyModel.ts'
import { createMockLearningServices } from '../../src/services/next/backendMock.ts'
import type { CompletionReceipt, LearningServices, Result } from '../../src/services/next/backendContracts.ts'

const receipt: CompletionReceipt = { status: 'confirmed', lessonId: 'lesson', xpGranted: 37, totalXp: 112, currentStreak: 4, alreadyCompleted: false }

test('completion retry retains its operation ID and waits for service confirmation', async () => {
  const ids: string[] = []
  const operation = new CompletionOperation(async id => {
    ids.push(id)
    return ids.length === 1 ? { ok: false as const, error: 'offline' as const } : { ok: true as const, value: receipt }
  }, 'original-action')
  assert.deepEqual(await operation.run(), { ok: false, error: 'offline' })
  assert.deepEqual(await operation.run(), { ok: true, value: receipt })
  assert.deepEqual(ids, ['original-action', 'original-action'])
  assert.deepEqual(await operation.run(), { ok: true, value: receipt })
  assert.equal(ids.length, 2, 'confirmed action is reused instead of granting again')
})

test('overlapping completion clicks share one pending request', async () => {
  let resolve!: (result: Result<CompletionReceipt>) => void
  let calls = 0
  const operation = new CompletionOperation(() => { calls += 1; return new Promise(done => { resolve = done }) }, 'race-action')
  const first = operation.run()
  const second = operation.run()
  assert.equal(first, second)
  await Promise.resolve()
  assert.equal(calls, 1)
  resolve({ ok: true, value: receipt })
  assert.deepEqual(await first, { ok: true, value: receipt })
})

test('transport exceptions remain retryable without changing the action identity', async () => {
  let calls = 0
  const operation = new CompletionOperation(async id => {
    assert.equal(id, 'network-action')
    if (++calls === 1) throw new Error('connection reset')
    return { ok: false as const, error: 'validation' as const }
  }, 'network-action')
  assert.deepEqual(await operation.run(), { ok: false, error: 'server_error' })
  assert.deepEqual(await operation.run(), { ok: false, error: 'validation' })
})

test('Home reads account streak without fabricating a weekly activity or minute goal', async () => {
  const services = { account: { getSummary: async () => ({ ok: true as const, value: {
    userId: 'account', displayName: 'Bạn học', totalXp: 112, completedLessons: 3,
    currentStreak: 4, longestStreak: 5, timezone: 'Asia/Ho_Chi_Minh', achievements: [],
  } }) } } as LearningServices
  assert.deepEqual(await accountHomeActivity(services).getSummary(), {
    ok: true, value: { streakDays: 4, week: [], studiedMinutes: 0, goalMinutes: 0 },
  })
  services.account.getSummary = async () => ({ ok: false, error: 'unauthorized' })
  assert.deepEqual(await accountHomeActivity(services).getSummary(), { ok: false, error: 'unauthorized' })
})

test('anonymous learners can inspect published catalog without seeing account progress', async () => {
  const services = createMockLearningServices({
    chapters: [{ id: 'chapter', slug: 'chapter', title: 'Chương', summary: '', historicalPeriodLabel: '1972', learningObjectiveIds: [], lessonRefs: [{ id: 'lesson', order: 0 }], estimatedMinutes: 2, status: 'published' }],
    lessons: [{ id: 'lesson', chapterId: 'chapter', slug: 'lesson', title: 'Bài', summary: '', format: 'standard', estimatedMinutes: 2, learningObjectiveIds: [], prerequisites: [], blocks: [], status: 'published' }],
    storyVersions: [], mediaAssets: [],
  }, {})
  const result = await loadJourney(services, accountHomeActivity(services))
  assert.equal(result.ok && result.value.chapters[0].lessons[0].progressStatus, 'not_started')
  assert.equal(result.ok && result.value.activity, undefined)
})
