import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createHostedContext, value } from './context.mjs'
import { ids } from './ids.mjs'

let ctx
before(async () => { ctx = await createHostedContext() })
after(async () => { await ctx?.cleanup() })

test('hosted video telemetry uses real elapsed server time, unique ranges and trusted watch threshold', async () => {
  const services = ctx.a.services
  const context = { lessonId: ids.videoLesson, blockId: ids.videoBlock }
  const report = (operationId, positionSeconds, watchedRanges, expectedRevision) => services.progress.saveVideoPosition({
    ...context, operationId, positionSeconds, watchedRanges, ...(expectedRevision === undefined ? {} : { expectedRevision }) })
  assert.deepEqual(await report('forged-without-initialization', 100, [{ start: 0, end: 100 }]),
    { ok: false, error: 'validation' })
  const initial = value(await report('initialize', 0, [], 0))
  assert.equal(initial.revision, 1)
  assert.deepEqual(initial.watchedRanges, [])
  assert.deepEqual(await report('instant-full-report', 100, [{ start: 0, end: 100 }]),
    { ok: false, error: 'validation' })
  const seek = value(await report('seek-near-end', 100, [{ start: 99, end: 100 }]))
  assert.equal(seek.completed, false)
  assert.deepEqual(await services.completion.completeBlock({ ...context, operationId: 'seek-cannot-complete' }),
    { ok: false, error: 'validation' })
  const overlapping = value(await report('overlapping-small-ranges', 4, [{ start: 0, end: 2 }, { start: 1, end: 4 }]))
  assert.deepEqual(overlapping.watchedRanges, [{ start: 0, end: 4 }, { start: 99, end: 100 }])
  assert.deepEqual(value(await report('overlapping-small-ranges', 4, [{ start: 0, end: 2 }, { start: 1, end: 4 }])), overlapping)
  assert.deepEqual(await report('stale-video', 4, [], 0), { ok: false, error: 'conflict' })
  // Real wall-clock interval satisfies the server's approved 2x playback budget.
  // Never change telemetry_started_at or the hosted database clock for this proof.
  await new Promise(resolve => setTimeout(resolve, 45_000))
  const watched = value(await report('real-budget-watch', 90, [{ start: 0, end: 90 }], overlapping.revision))
  assert.deepEqual(watched.watchedRanges, [{ start: 0, end: 90 }, { start: 99, end: 100 }])
  value(await services.completion.completeBlock({ ...context, operationId: 'video-confirmed' }))
  assert.equal(value(await services.progress.getVideoProgress(ids.videoLesson, ids.videoBlock)).completed, true)
  const finish = { lessonId: ids.videoLesson, operationId: 'video-lesson' }
  assert.equal(value(await services.completion.completeLesson(finish)).xpGranted, 10)
  assert.equal(value(await services.completion.completeLesson({ ...finish, operationId: 'video-replay' })).xpGranted, 0)
  assert.equal(value(await services.account.getSummary()).totalXp, 10)
  assert.equal(value(await ctx.b.services.progress.getVideoProgress(ids.videoLesson, ids.videoBlock)), null)
})

test('hosted accessible fallback requires authored recap and published transcript metadata', async () => {
  const services = ctx.b.services
  const input = { lessonId: ids.mixedLesson, blockId: ids.mixedVideoBlock, operationId: 'fallback-premature', method: 'accessible_fallback' }
  assert.deepEqual(await services.completion.completeBlock(input), { ok: false, error: 'validation' })
  value(await services.completion.completeBlock({ lessonId: ids.mixedLesson, blockId: ids.recapBlock, operationId: 'required-recap' }))
  const receipt = value(await services.completion.completeBlock({ ...input, operationId: 'approved-fallback' }))
  assert.equal(receipt.method, 'accessible_fallback')
  assert.equal(value(await services.completion.completeLesson({ lessonId: ids.mixedLesson, operationId: 'fallback-lesson' })).xpGranted, 10)
  assert.equal(value(await services.account.getSummary()).currentStreak, 1)
})
