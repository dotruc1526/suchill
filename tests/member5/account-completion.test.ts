import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import { accountCatalog, assessmentInput, finishEpisode } from './account-fixtures.ts'
const now = () => '2026-10-02T07:00:00Z'

test('explicit completion, retry, adapter recreation and concurrent requests grant one lesson reward', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: 'a' }
  let services = createMockLearningServices(catalog, session, now, store)
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'standard', operationId: 'lesson' }), { ok: false, error: 'validation' })
  await services.progress.saveCheckpoint({ lessonId: 'standard', currentBlockId: 'text', completedBlockIds: ['text'], operationId: 'claim' })
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'standard', operationId: 'lesson' }), { ok: false, error: 'validation' })
  assert.equal((await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'block' })).ok, true)
  const input = { lessonId: 'standard', operationId: 'lesson' }
  const first = await services.completion.completeLesson(input)
  assert.equal(first.ok && first.value.xpGranted, 10)
  const snapshot = structuredClone(first)
  if (first.ok) first.value.totalXp = 999
  services = createMockLearningServices(catalog, session, now, store)
  assert.deepEqual(await services.completion.completeLesson(input), snapshot)
  const repeated = await Promise.all(['retry1', 'retry2'].map(operationId => services.completion.completeLesson({ ...input, operationId })))
  assert.equal(repeated.every(result => result.ok && result.value.alreadyCompleted && result.value.xpGranted === 0), true)
  const summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 10)
  assert.equal(summary.ok && summary.value.completedLessons, 1)
  assert.equal(summary.ok && summary.value.currentStreak, 1)
  assert.equal((await services.progress.getLessonProgress('standard')).ok, true)
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'lesson' }), { ok: false, error: 'conflict' })
})

test('VN redacts answer keys, rejects checkpoint jumps, requires attempts, and replay never advances authority', async () => {
  const services = createMockLearningServices(accountCatalog(), { userId: 'a' }, now)
  const delivered = await services.stories.getVersion('story.v1')
  assert.equal(delivered.ok, true)
  assert.doesNotMatch(JSON.stringify(delivered), /isCorrect|explanation|Feedback A/)
  const context = { lessonId: 'mixed', blockId: 'vn', storyVersionId: 'story.v1' }
  assert.deepEqual(await services.progress.saveEpisodeCheckpoint({ ...context, operationId: 'jump', currentSceneId: 'end', visitedSceneIds: ['start', 'check'] }), { ok: false, error: 'conflict' })
  await services.progress.saveEpisodeCheckpoint({ ...context, operationId: 'advance', currentSceneId: 'check', visitedSceneIds: ['start'] })
  const before = await services.progress.getEpisodeProgress('story.v1')
  const replay = await services.progress.recordChoice({ ...context, operationId: 'replay', sceneId: 'check', choiceId: 'right', replay: true })
  assert.deepEqual(replay, { ok: false, error: 'validation' })
  assert.deepEqual(await services.progress.getEpisodeProgress('story.v1'), before)
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'vn', operationId: 'premature' }), { ok: false, error: 'validation' })
  const choice = await services.progress.recordChoice({ ...context, operationId: 'choice', sceneId: 'check', choiceId: 'wrong' })
  assert.equal(choice.ok && choice.value.choiceFeedback.outcome, 'incorrect')
  const submitted = await services.progress.recordChoice({ ...context, operationId: 'submitted-replay', sceneId: 'check', choiceId: 'wrong', replay: true })
  assert.equal(submitted.ok && submitted.value.choiceFeedback.outcome, 'incorrect')
  assert.deepEqual(await services.progress.recordChoice({ ...context, operationId: 'still-unsubmitted', sceneId: 'check', choiceId: 'right', replay: true }), { ok: false, error: 'validation' })
  const complete = await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'vn', operationId: 'block' })
  assert.equal(complete.ok && complete.value.xpGranted, 20)
  const completed = await services.progress.getEpisodeProgress('story.v1')
  const completedReview = await services.progress.recordChoice({ ...context, operationId: 'completed-review', sceneId: 'check', choiceId: 'right', replay: true })
  assert.equal(completedReview.ok && completedReview.value.choiceFeedback.outcome, 'correct')
  assert.deepEqual(await services.progress.getEpisodeProgress('story.v1'), completed)
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'mixed', operationId: 'unfinished' }), { ok: false, error: 'validation' })
})

test('unique watched duration defeats seeking; fallback requires approved transcript plus required recap', async () => {
  const services = createMockLearningServices(accountCatalog(), { userId: 'a' }, now)
  await finishEpisode(services)
  await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'vn', operationId: 'vn-complete' })
  const video = { lessonId: 'mixed', blockId: 'video', operationId: 'video-position', positionSeconds: 100, watchedRanges: [{ start: 95, end: 100 }] }
  await services.progress.saveVideoPosition(video)
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'video', operationId: 'seek' }), { ok: false, error: 'validation' })
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'video', operationId: 'fallback', method: 'accessible_fallback' }), { ok: false, error: 'validation' })
  await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'recap', operationId: 'recap' })
  const fallback = await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'video', operationId: 'fallback', method: 'accessible_fallback' })
  assert.equal(fallback.ok && fallback.value.method, 'accessible_fallback')
  const completed = await services.completion.completeLesson({ lessonId: 'mixed', operationId: 'lesson' })
  assert.equal(completed.ok && completed.value.totalXp, 30)
  const noTranscript = accountCatalog()
  noTranscript.mediaResources![0].reviewStatus = 'draft'
  const failed = createMockLearningServices(noTranscript, { userId: 'a' }, now)
  await failed.completion.completeBlock({ lessonId: 'mixed', blockId: 'recap', operationId: 'recap' })
  assert.deepEqual(await failed.completion.completeBlock({ lessonId: 'mixed', blockId: 'video', operationId: 'bad', method: 'accessible_fallback' }), { ok: false, error: 'validation' })
})

test('trusted quiz pass and improved mastery earn base and bonus once across reload/account switching', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: 'a' }
  let services = createMockLearningServices(catalog, session, now, store)
  assert.equal((await services.quiz.submitScoredAttempt(assessmentInput('failed', 6))).ok, true)
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'assessment', blockId: 'quiz', operationId: 'block' }), { ok: false, error: 'validation' })
  const first = await services.quiz.submitScoredAttempt(assessmentInput('pass', 7))
  assert.equal(first.ok && first.value.passed, true)
  assert.equal((await services.account.getSummary()).ok, true)
  services = createMockLearningServices(catalog, session, now, store)
  assert.deepEqual(await services.quiz.submitScoredAttempt(assessmentInput('pass', 7)), first)
  await services.quiz.submitScoredAttempt(assessmentInput('better', 8))
  await services.quiz.submitScoredAttempt(assessmentInput('perfect', 10))
  await services.completion.completeBlock({ lessonId: 'assessment', blockId: 'quiz', operationId: 'block' })
  await services.completion.completeLesson({ lessonId: 'assessment', operationId: 'lesson' })
  let summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 25)
  assert.equal(summary.ok && summary.value.completedLessons, 1)
  session.userId = 'b'
  summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 0)
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'assessment', blockId: 'quiz', operationId: 'block' }), { ok: false, error: 'validation' })
  await services.quiz.submitScoredAttempt(assessmentInput('pass', 10))
  summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 25)
})
