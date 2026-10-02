import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices, type MockQuizFixture } from '../../src/services/next/backendMock.ts'
import { createMockProgressStore } from '../../src/services/next/backendMockProgress.ts'
import { accountCatalog } from './account-fixtures.ts'

const reviewFixture = (id: string, count = 3): MockQuizFixture => {
  const base = accountCatalog().quizzes![0]
  const questions = base.questions.slice(0, count)
  return { ...base, questions, set: { ...base.set, id, mode: 'practice', questionIds: questions.map(question => question.id) },
    grade(input) { return { attemptId: `attempt.${input.operationId}`, score: count, total: count,
      feedback: input.answers.map(answer => ({ questionId: answer.questionId, outcome: 'correct', explanation: 'Trusted review feedback' })) } },
  }
}
const reviewInput = (setId: string, operationId: string, count = 3) => ({ operationId, questionSetId: setId,
  answers: Array.from({ length: count }, (_, index) => ({ questionId: `q${index}`, selectedOptionIds: ['right'] })),
})

test('authored daily review requires a complete owned practice attempt with minimum three questions', async () => {
  const catalog = accountCatalog()
  catalog.quizzes = [reviewFixture('review'), reviewFixture('short', 2), reviewFixture('unflagged')]
  catalog.dailyReviewSetIds = ['review', 'short']
  const services = createMockLearningServices(catalog, { userId: 'a' }, () => '2026-10-02T07:00:00Z')
  const delivery = await services.quiz.getQuestionSet('review')
  assert.equal(delivery.ok && delivery.value.dailyReviewEligible, true)
  const regular = await services.quiz.getQuestionSet('unflagged')
  assert.equal(regular.ok && regular.value.dailyReviewEligible, undefined)
  await services.quiz.submitPracticeAttempt(reviewInput('short', 'short-attempt', 2))
  assert.deepEqual(await services.completion.completeDailyReview({ questionSetId: 'short', attemptId: 'attempt.short-attempt', operationId: 'short-complete' }), { ok: false, error: 'validation' })
  await services.quiz.submitPracticeAttempt(reviewInput('unflagged', 'unflagged-attempt'))
  assert.deepEqual(await services.completion.completeDailyReview({ questionSetId: 'unflagged', attemptId: 'attempt.unflagged-attempt', operationId: 'unflagged-complete' }), { ok: false, error: 'not_found' })
  assert.deepEqual(await services.completion.completeDailyReview({ questionSetId: 'review', attemptId: 'unknown', operationId: 'unknown' }), { ok: false, error: 'validation' })
  const submitted = await services.quiz.submitPracticeAttempt(reviewInput('review', 'attempt'))
  assert.equal(submitted.ok, true)
  let summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 0)
  const completed = await services.completion.completeDailyReview({ questionSetId: 'review', attemptId: 'attempt.attempt', operationId: 'complete' })
  assert.equal(completed.ok && completed.value.xpGranted, 5)
  assert.equal(completed.ok && completed.value.localDate, '2026-10-02')
  summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.currentStreak, 1)
})

test('daily review deduplicates across sets/reload/races, rejects stale days and isolates accounts', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: 'a' }
  catalog.quizzes = [reviewFixture('review1'), reviewFixture('review2')]
  catalog.dailyReviewSetIds = ['review1', 'review2']
  let instant = '2026-10-02T07:00:00Z'
  let services = createMockLearningServices(catalog, session, () => instant, store)
  await services.quiz.submitPracticeAttempt(reviewInput('review1', 'attempt1'))
  await services.quiz.submitPracticeAttempt(reviewInput('review2', 'attempt2'))
  const input = { questionSetId: 'review1', attemptId: 'attempt.attempt1', operationId: 'review' }
  const first = await services.completion.completeDailyReview(input)
  services = createMockLearningServices(catalog, session, () => instant, store)
  assert.deepEqual(await services.completion.completeDailyReview(input), first)
  const repeated = await Promise.all(['race1', 'race2'].map(operationId => services.completion.completeDailyReview({
    questionSetId: 'review2', attemptId: 'attempt.attempt2', operationId,
  })))
  assert.equal(repeated.every(result => result.ok && result.value.xpGranted === 0 && result.value.alreadyCompleted), true)
  instant = '2026-10-03T07:00:00Z'
  const consumed = await services.completion.completeDailyReview({ ...input, operationId: 'stale' })
  assert.equal(consumed.ok && consumed.value.xpGranted, 0)
  assert.equal(consumed.ok && consumed.value.localDate, '2026-10-02')
  assert.deepEqual(await services.completion.completeDailyReview(input), first)
  await services.quiz.submitPracticeAttempt(reviewInput('review1', 'today'))
  const next = await services.completion.completeDailyReview({ questionSetId: 'review1', attemptId: 'attempt.today', operationId: 'next-day' })
  assert.equal(next.ok && next.value.totalXp, 10)
  assert.equal(next.ok && next.value.currentStreak, 2)
  session.userId = 'b'
  assert.deepEqual(await services.completion.completeDailyReview({ questionSetId: 'review1', attemptId: 'attempt.today', operationId: 'next-day' }), { ok: false, error: 'validation' })
  const summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 0)
})

test('every confirmed daily attempt retains its original day including zero-XP after a timezone change', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: 'a', timezone: 'America/Adak' }
  catalog.quizzes = [reviewFixture('review')]
  catalog.dailyReviewSetIds = ['review']
  let instant = '2026-10-02T08:30:00Z'
  let services = createMockLearningServices(catalog, session, () => instant, store)
  const attempt = (id: string) => services.quiz.submitPracticeAttempt(reviewInput('review', id))
  const claim = (id: string, operationId: string) => services.completion.completeDailyReview({ questionSetId: 'review', attemptId: `attempt.${id}`, operationId })
  await attempt('first')
  assert.equal((await claim('first', 'claim-first')).ok, true)
  await attempt('zero')
  const zero = await claim('zero', 'claim-zero')
  assert.equal(zero.ok && zero.value.xpGranted, 0)
  assert.equal(zero.ok && zero.value.localDate, '2026-10-01')
  await attempt('unconsumed')
  // The old timezone day has ended while both attempts now map to October 2 in the new timezone.
  instant = '2026-10-02T09:30:00Z'
  assert.equal((await services.account.updateSettings({ timezone: 'Pacific/Kiritimati' })).ok, true)
  services = createMockLearningServices(catalog, session, () => instant, store)
  const replay = await claim('zero', 'zero-after-zone')
  assert.equal(replay.ok && replay.value.xpGranted, 0)
  assert.equal(replay.ok && replay.value.localDate, '2026-10-01')
  assert.equal((await services.account.getSummary()).ok, true)
  await attempt('fresh')
  const fresh = await claim('fresh', 'fresh-after-zone')
  assert.equal(fresh.ok && fresh.value.xpGranted, 5)
  assert.equal(fresh.ok && fresh.value.totalXp, 10)
  instant = '2026-10-04T09:30:00Z'
  assert.deepEqual(await claim('unconsumed', 'stale-unconsumed'), { ok: false, error: 'validation' })
})
