import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createClient } from '@supabase/supabase-js'
import { createOfflineLearningServices } from '../../src/services/offline/services.ts'
import { OfflineQueue } from '../../src/services/offline/queue.ts'
import { loadVisualNovel, advanceVisualNovel, chooseVisualNovel, continueChoiceFeedback } from '../../src/features/visual-novel/v2/visualNovelModel.ts'
import { createHostedContext, check, value, safeOptions, boundedFetch } from './context.mjs'
import { ids, quizAnswers } from './ids.mjs'

let ctx
before(async () => { ctx = await createHostedContext() })
after(async () => { await ctx?.cleanup() })

test('actual hosted parallel requests and adapter recreation preserve one trusted lesson reward/receipt', async () => {
  const services = ctx.a.services
  assert.deepEqual(await services.completion.completeLesson({ lessonId: ids.lesson, operationId: 'premature' }),
    { ok: false, error: 'validation' })
  assert.deepEqual(await services.progress.saveCheckpoint({ lessonId: ids.lesson, currentBlockId: ids.textBlock,
    completedBlockIds: [ids.textBlock], operationId: 'forged-checkpoint' }), { ok: false, error: 'validation' })
  value(await services.completion.completeBlock({ lessonId: ids.lesson, blockId: ids.textBlock, operationId: 'explicit-text' }))
  const input = { lessonId: ids.lesson, operationId: 'parallel-finish' }
  const replies = await Promise.all(Array.from({ length: 8 }, () => services.completion.completeLesson(input)))
  const receipt = value(replies[0])
  assert.equal(receipt.xpGranted, 10)
  assert.equal(receipt.status, 'confirmed')
  for (const result of replies) assert.deepEqual(value(result), receipt)
  assert.deepEqual(value(await ctx.services(ctx.a.client).completion.completeLesson(input)), receipt)
  assert.equal(value(await services.completion.completeLesson({ ...input, operationId: 'distinct-finish' })).xpGranted, 0)
  assert.deepEqual(await services.completion.completeLesson({ lessonId: ids.videoLesson, operationId: input.operationId }),
    { ok: false, error: 'conflict' })
  const ledger = await ctx.a.client.from('reward_ledger').select('reward_type,xp_delta').eq('activity_id', ids.lesson)
  check(ledger.error, 'Own authoritative ledger read')
  assert.deepEqual(ledger.data, [{ reward_type: 'lesson', xp_delta: 10 }])
  const summary = value(await services.account.getSummary())
  assert.equal(summary.totalXp, 10)
  assert.equal(summary.currentStreak, 1)
  assert.equal(value(await services.progress.getLessonProgress(ids.lesson)).status, 'completed')
  assert.equal(value(await ctx.b.services.progress.getLessonProgress(ids.lesson)), null)
})

test('actual VN model traverses trusted hosted choice feedback and episode reward remains one-time', async () => {
  const services = ctx.a.services
  const context = { lessonId: ids.vnLesson, blockId: ids.vnBlock, storyVersionId: ids.version }
  const start = value(await loadVisualNovel(services, context))
  assert.equal(start.currentSceneId, ids.start)
  const atCheck = value(await advanceVisualNovel(services, context, start, 'vn-advance'))
  const wrong = value(await chooseVisualNovel(services, context, atCheck, ids.wrong, 'vn-wrong'))
  assert.equal(wrong.feedback.outcome, 'incorrect')
  assert.equal(wrong.pendingSceneId, ids.check)
  assert.deepEqual(await services.completion.completeBlock({ lessonId: ids.vnLesson, blockId: ids.vnBlock, operationId: 'vn-premature' }),
    { ok: false, error: 'validation' })
  const retry = value(continueChoiceFeedback(wrong))
  const correct = value(await chooseVisualNovel(services, context, retry, ids.correct, 'vn-correct'))
  assert.equal(correct.feedback.outcome, 'correct')
  assert.equal(correct.pendingSceneId, ids.end)
  const finish = { lessonId: ids.vnLesson, blockId: ids.vnBlock, operationId: 'vn-complete' }
  assert.equal(value(await services.completion.completeBlock(finish)).xpGranted, 20)
  assert.equal(value(await services.completion.completeBlock({ ...finish, operationId: 'vn-replay' })).xpGranted, 0)
  assert.equal(value(await services.completion.completeLesson({ lessonId: ids.vnLesson, operationId: 'vn-lesson' })).xpGranted, 0)
  assert.equal(value(await services.progress.getResumePoint(ids.vnLesson)).sceneId, ids.end)
  assert.equal(value(await services.account.getSummary()).totalXp, 30)
})

test('real hosted grading, quiz retries and daily claims cannot farm reward or reuse another identity attempt', async () => {
  const services = ctx.a.services
  const bad = value(await services.quiz.submitScoredAttempt({ questionSetId: ids.quiz, answers: quizAnswers(false), operationId: 'quiz-wrong' }))
  assert.equal(bad.score, 0)
  assert.equal(bad.passed, false)
  const input = { questionSetId: ids.quiz, answers: quizAnswers(), operationId: 'quiz-pass' }
  const good = value(await services.quiz.submitScoredAttempt(input))
  assert.equal(good.score, 3)
  assert.equal(good.passed, true)
  assert.equal(good.feedback.length, 3)
  assert.deepEqual(value(await services.quiz.submitScoredAttempt(input)), good)
  value(await services.quiz.submitScoredAttempt({ ...input, operationId: 'quiz-retry' }))
  assert.equal(value(await services.account.getSummary()).totalXp, 55)
  const attempts = await ctx.a.client.from('learning_attempts').select('id').eq('activity_id', ids.quiz)
  check(attempts.error, 'Read own grading attempts')
  assert.equal(attempts.data.length, 3, 'Duplicate submission creates no extra attempt')
  const practice = value(await services.quiz.submitPracticeAttempt({ questionSetId: ids.practice, answers: quizAnswers(), operationId: 'practice' }))
  const claim = { questionSetId: ids.practice, attemptId: practice.attemptId, operationId: 'daily-review' }
  const daily = value(await services.completion.completeDailyReview(claim))
  assert.equal(daily.xpGranted, 5)
  assert.deepEqual(value(await services.completion.completeDailyReview(claim)), daily)
  assert.equal(value(await services.completion.completeDailyReview({ ...claim, operationId: 'daily-review-again' })).xpGranted, 0)
  assert.deepEqual(await ctx.b.services.completion.completeDailyReview({ ...claim, operationId: 'daily-other-user' }),
    { ok: false, error: 'validation' })
  const second = value(await services.quiz.submitPracticeAttempt({ questionSetId: ids.practice, answers: quizAnswers(), operationId: 'practice-second' }))
  const noReward = value(await services.completion.completeDailyReview({ ...claim, attemptId: second.attemptId, operationId: 'daily-second-attempt' }))
  assert.equal(noReward.xpGranted, 0)
  assert.equal(noReward.localDate, daily.localDate)
  assert.equal(value(await services.account.getSummary()).totalXp, 60)
  const days = await ctx.a.client.from('streak_days').select('local_date')
  check(days.error, 'Read own streak day')
  assert.equal(days.data.length, 1)
})

test('durable offline queue crosses real server commit/response loss and replays without duplicate XP', async () => {
  const session = await ctx.b.client.auth.getSession()
  check(session.error, 'Read internal test session')
  let dropResponse = true
  let committed = false
  const lostClient = createClient(ctx.config.url, ctx.config.publishableKey, { ...safeOptions, global: { fetch: async (url, init) => {
    const response = await boundedFetch(url, init)
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null
    if (dropResponse && String(url).endsWith('/rpc/learning_command') && body?.p_input?.operationId === 'offline-finish') {
      assert.equal(response.status, 200, 'Uncertain response simulation happens only after successful actual commit')
      const receipt = await response.clone().json()
      assert.equal(receipt.status, 'confirmed')
      committed = true
      dropResponse = false
      throw new TypeError('Simulated lost response after actual server commit')
    }
    return response
  } } })
  check((await lostClient.auth.setSession({ access_token: session.data.session.access_token,
    refresh_token: session.data.session.refresh_token })).error, 'Bind second actual SDK to same B session')
  let raw = null
  let online = false
  const storage = { getItem: () => raw, setItem: (_key, data) => { raw = data } }
  const queue = new OfflineQueue(storage, () => online)
  const offline = createOfflineLearningServices(ctx.services(lostClient), queue)
  assert.deepEqual(await offline.services.completion.completeBlock({ lessonId: ids.lesson, blockId: ids.textBlock, operationId: 'offline-read' }),
    { ok: false, error: 'offline' })
  assert.deepEqual(await offline.services.completion.completeLesson({ lessonId: ids.lesson, operationId: 'offline-finish' }),
    { ok: false, error: 'offline' })
  assert.equal(queue.list(ctx.b.id).length, 2)
  assert.equal(value(await ctx.b.services.account.getSummary()).totalXp, 0)
  online = true
  await createOfflineLearningServices(ctx.a.services, queue).sync()
  assert.equal(queue.list(ctx.b.id).length, 2, 'A cannot send B queued operations')
  await offline.sync()
  assert.equal(committed, true)
  assert.equal(value(await ctx.b.services.account.getSummary()).totalXp, 10)
  assert.equal(queue.list(ctx.b.id).length, 1, 'Unconfirmed response remains durably queued')
  assert.equal(queue.list(ctx.b.id)[0].input.operationId, 'offline-finish')
  const reopened = new OfflineQueue(storage, () => true)
  await createOfflineLearningServices(ctx.b.services, reopened).sync()
  assert.equal(reopened.list(ctx.b.id).length, 0)
  assert.equal(value(await ctx.b.services.account.getSummary()).totalXp, 10)
  const ledger = await ctx.b.client.from('reward_ledger').select('id').eq('activity_id', ids.lesson)
  check(ledger.error, 'Check real reward dedupe after uncertain transport')
  assert.equal(ledger.data.length, 1)
  assert.ok(!raw.includes(session.data.session.access_token) && !raw.includes(session.data.session.refresh_token),
    'Offline storage must contain no authentication tokens')
  await lostClient.auth.signOut({ scope: 'local' })
})
