import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createClient } from '@supabase/supabase-js'
import { createMainLearningServices } from '../../src/services/mainServices.ts'
import { createOfflineLearningServices } from '../../src/services/offline/services.ts'
import { scopeLearningServices } from '../../src/services/offline/accountScope.ts'
import { OfflineQueue } from '../../src/services/offline/queue.ts'
import { loadVideoPlayer, saveVideoCheckpoint, VideoCheckpointQueue } from '../../src/features/learning/video/videoPlayerModel.ts'
import { loadVisualNovel, advanceVisualNovel, chooseVisualNovel } from '../../src/features/visual-novel/v2/visualNovelModel.ts'
import { createHostedContext, check, value, safeOptions, boundedFetch } from './context.mjs'
import { ids } from './ids.mjs'

// Requires030 already applied. Only this context's exact disposable A/B users are mutated/cleaned.
let ctx, mainA, secondClient, secondA
const mainFor = (services, userId) => createMainLearningServices(scopeLearningServices(services, userId), userId)
const events = async user => {
 const result = await user.client.from('analytics_events').select('event_name,properties').eq('user_id', user.id).order('id')
 check(result.error, 'Read only own optional analytics')
 return result.data
}
const occurrences = (rows, name) => rows.filter(row => row.event_name === name).length
async function cloneSession(user, options = safeOptions) {
 const session = await user.client.auth.getSession()
 check(session.error, 'Read internal disposable session')
 assert.ok(session.data.session)
 const client = createClient(ctx.config.url, ctx.config.publishableKey, options)
 check((await client.auth.setSession({ access_token: session.data.session.access_token,
  refresh_token: session.data.session.refresh_token })).error, 'Bind independent SDK session to exact disposable account')
 assert.equal((await client.auth.getUser()).data.user?.id, user.id)
 return client
}
before(async () => {
 ctx = await createHostedContext()
 mainA = mainFor(ctx.a.services, ctx.a.id)
 secondClient = await cloneSession(ctx.a)
 secondA = mainFor(ctx.services(secondClient), ctx.a.id)
})
after(async () => {
 try { await secondClient?.auth.signOut({ scope: 'local' }) }
 finally { await ctx?.cleanup() }
})

test('hosted030 canonical completion emits trusted opt-in telemetry once across concurrent clients and replay', async () => {
 value(await ctx.a.services.account.updateSettings({ analyticsEnabled: true, operationId: 'final-consent' }))
 const input = { lessonId: ids.lesson, operationId: 'final-canonical-finish' }
 assert.equal(value(await mainA.completion.completeLesson(input)).kind, 'ineligible')
 assert.deepEqual(await events(ctx.a), [])
 value(await mainA.completion.recordBlockAction({ lessonId: ids.lesson, blockId: ids.textBlock,
  operationId: 'final-explicit-text', action: 'acknowledge' }))
 const results = await Promise.all(Array.from({ length: 8 }, (_, index) =>
  (index % 2 ? mainA : secondA).completion.completeLesson(input)))
 const result = value(results[0]); assert.equal(result.kind, 'completed')
 results.forEach(item => assert.deepEqual(value(item), result))
 const recorded = await events(ctx.a)
 for (const name of ['block_completed', 'lesson_completed', 'reward_granted', 'streak_qualified']) assert.equal(occurrences(recorded, name), 1)
 assert.deepEqual(recorded.find(row => row.event_name === 'reward_granted').properties, { reward_type: 'lesson', xp_delta: 10 })
 assert.doesNotMatch(JSON.stringify(recorded), /password|email|access_token|refresh_token|dialogue|explanation/)
 assert.deepEqual(value(await secondA.completion.completeLesson(input)), result)
 assert.equal(value(await mainA.completion.completeLesson({ ...input, operationId: 'final-fresh-replay' })).kind, 'already_completed')
 assert.deepEqual(await events(ctx.a), recorded)
 assert.equal(value(await mainA.users.getAccountSummary()).totalXp, 10)
 const spoof = await ctx.a.client.rpc('learning_command', { p_kind: 'track', p_input: {
  name: 'reward_granted', properties: { xp_delta: 999 }, operationId: 'final-spoof-telemetry', expectedSubject: ctx.a.id } })
 assert.equal(spoof.error?.code, '22023')
 assert.deepEqual(await events(ctx.b), [])
})

test('hosted player queue initializes playback and independent account sessions resume the same video cursor', async () => {
 const context = { lessonId: ids.videoLesson, blockId: ids.videoBlock, mediaAssetId: ids.video }
 assert.equal(value(await loadVideoPlayer(mainA, context)).progress, null)
 const saved = [], errors = []
 const queue = new VideoCheckpointQueue(payload => saveVideoCheckpoint(mainA, context,
  payload.positionSeconds, payload.watchedRanges, payload.operationId), progress => saved.push(progress), error => errors.push(error))
 const waitForSaved = async count => {
  const deadline = Date.now() + 30_000
  while (saved.length < count && !errors.length && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 25))
  assert.deepEqual(errors, []); assert.equal(saved.length, count)
 }
 queue.initializePlayback(0, 'final-video-play-initialize')
 await waitForSaved(1)
 assert.equal(queue.playbackInitialized, true); assert.deepEqual(saved[0].watchedRanges, [])
 // Short synthetic report validates the approved server elapsed-time budget, not video decoding/attention.
 await new Promise(resolve => setTimeout(resolve, 2000))
 queue.enqueue({ positionSeconds: 4, watchedRanges: [{ start: 0, end: 4 }], operationId: 'final-video-pause' })
 await waitForSaved(2)
 const restored = value(await loadVideoPlayer(secondA, context))
 assert.equal(restored.resumePositionSeconds, 4); assert.deepEqual(restored.progress.watchedRanges, [{ start: 0, end: 4 }])
 assert.equal(value(await secondA.progress.getResumePoint(ids.videoLesson)).positionSeconds, 4)
 assert.deepEqual(await secondA.progress.saveVideoPosition({ lessonId: ids.videoLesson, blockId: ids.videoBlock,
  positionSeconds: 0, watchedRanges: [], operationId: 'final-stale-video', expectedRevision: 0 }), { ok: false, error: 'conflict' })
 assert.equal(value(await loadVideoPlayer(mainA, context)).resumePositionSeconds, 4)
 assert.equal(value(await mainFor(ctx.b.services, ctx.b.id).progress.getVideoProgress(ids.videoLesson, ids.videoBlock)), null)
 assert.equal(value(await mainA.users.getAccountSummary()).totalXp, 10, 'Checkpoint is not a reward')
})

test('hosted canonical offline intent survives real committed response loss and replays without duplicate XP', async () => {
 let dropResponse = true, committed = false
 const lostClient = await cloneSession(ctx.b, { ...safeOptions, global: { fetch: async (url, init) => {
  const response = await boundedFetch(url, init)
  const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null
  if (dropResponse && String(url).endsWith('/rpc/learning_m3_complete') && body?.p_input?.operationId === 'final-offline-finish') {
   assert.equal(response.status, 200)
   const reply = await response.clone().json()
   assert.equal(reply.kind, 'completed'); assert.equal(reply.receipt.userId, ctx.b.id)
   committed = true; dropResponse = false
   throw new TypeError('Synthetic lost response after actual canonical commit')
  }
  return response
 } } })
 try {
  let raw = null, online = false
  const storage = { getItem: () => raw, setItem: (_key, data) => { raw = data } }
  const queue = new OfflineQueue(storage, () => online)
  const runtime = createOfflineLearningServices(ctx.services(lostClient), queue)
  const main = mainFor(runtime.services, ctx.b.id)
  const finish = { lessonId: ids.lesson, operationId: 'final-offline-finish' }
  assert.deepEqual(await main.completion.recordBlockAction({ lessonId: ids.lesson, blockId: ids.textBlock,
   operationId: 'final-offline-read', action: 'acknowledge' }), { ok: false, error: 'offline' })
  assert.deepEqual(await main.completion.completeLesson(finish), { ok: false, error: 'offline' })
  assert.deepEqual(queue.list(ctx.b.id).map(item => item.kind), ['complete_block', 'complete_main_lesson'])
  assert.equal(value(await mainFor(ctx.b.services, ctx.b.id).users.getAccountSummary()).totalXp, 0)
  online = true
  await createOfflineLearningServices(ctx.a.services, queue).sync()
  assert.equal(queue.list(ctx.b.id).length, 2, 'A never sends B intents')
  await runtime.sync()
  assert.equal(committed, true); assert.equal(queue.list(ctx.b.id).length, 1)
  assert.equal(queue.list(ctx.b.id)[0].input.operationId, finish.operationId)
  const reopened = new OfflineQueue(storage, () => true)
  await createOfflineLearningServices(ctx.b.services, reopened).sync()
  assert.deepEqual(reopened.list(ctx.b.id), [])
  const result = value(await mainFor(ctx.b.services, ctx.b.id).completion.completeLesson(finish))
  assert.equal(result.kind, 'completed', 'Original receipt replay is preserved')
  assert.equal(value(await mainFor(ctx.b.services, ctx.b.id).users.getAccountSummary()).totalXp, 10)
  const ledger = await ctx.b.client.from('reward_ledger').select('xp_delta').eq('activity_id', ids.lesson)
  check(ledger.error, 'Read own deduplicated ledger'); assert.deepEqual(ledger.data, [{ xp_delta: 10 }])
  assert.deepEqual(await events(ctx.b), [], 'Opt-out retains learning records without analytics')
  assert.doesNotMatch(raw, /access_token|refresh_token|password|expectedSubject/)
 } finally { await lostClient.auth.signOut({ scope: 'local' }) }
})

test('hosted independent VN sessions resume trusted scene/revision and reject stale choices before one-time reward', async () => {
 const context = { lessonId: ids.vnLesson, blockId: ids.vnBlock, storyVersionId: ids.version }
 const start = value(await loadVisualNovel(mainA, context))
 const first = value(await advanceVisualNovel(mainA, context, start, 'final-vn-advance'))
 const restored = value(await loadVisualNovel(secondA, context))
 assert.equal(restored.currentSceneId, ids.check); assert.equal(restored.revision, first.revision)
 const wrong = value(await chooseVisualNovel(secondA, context, restored, ids.wrong, 'final-vn-wrong'))
 assert.equal(wrong.feedback.outcome, 'incorrect'); assert.equal(wrong.pendingSceneId, ids.check)
 assert.deepEqual(await chooseVisualNovel(mainA, context, first, ids.correct, 'final-vn-stale'), { ok: false, error: 'conflict' })
 const latest = value(await loadVisualNovel(mainA, context))
 const correct = value(await chooseVisualNovel(mainA, context, latest, ids.correct, 'final-vn-correct'))
 assert.equal(correct.feedback.outcome, 'correct'); assert.equal(correct.pendingSceneId, ids.end)
 const finish = { lessonId: ids.vnLesson, operationId: 'final-vn-finish' }
 const completed = value(await secondA.completion.completeLesson(finish))
 assert.equal(completed.kind, 'completed'); assert.ok(completed.receipt.rewards.some(reward => reward.rewardType === 'episode' && reward.xpDelta === 20))
 assert.deepEqual(value(await mainA.completion.completeLesson(finish)), completed)
 const recorded = await events(ctx.a)
 assert.equal(occurrences(recorded, 'lesson_completed'), 2); assert.equal(occurrences(recorded, 'reward_granted'), 2)
 assert.equal(occurrences(recorded, 'streak_qualified'), 1)
 assert.equal(value(await mainA.users.getAccountSummary()).totalXp, 30)
 assert.equal(value(await mainFor(ctx.b.services, ctx.b.id).completion.getLessonCompletion(ids.vnLesson)), null)
})
