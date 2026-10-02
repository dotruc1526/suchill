import test from 'node:test'
import assert from 'node:assert/strict'
import { VideoCheckpointQueue, VideoCheckpointQueueRegistry, type VideoCheckpointPayload } from '../../src/features/learning/video/videoPlayerModel.ts'
import type { Result } from '../../src/services/next/contracts.ts'
import type { VideoProgress } from '../../src/types/v2/progress.ts'
import { createTestDatabase, command, read, ids } from '../../supabase/tests/harness.mjs'

const flush = () => new Promise(resolve => setImmediate(resolve))
const progress = (payload: VideoCheckpointPayload): VideoProgress => ({
  userId: 'fixture-A', lessonId: 'fixture-lesson', blockId: 'fixture-video',
  positionSeconds: payload.positionSeconds, watchedRanges: payload.watchedRanges,
  completed: false, updatedAt: '2026-10-02T00:00:00Z',
})

test('playback initialization is lazy, coalesces repeated plays and confirms before observed checkpoints', async () => {
  const writes: VideoCheckpointPayload[] = []
  let acknowledge!: (value: Result<VideoProgress>) => void
  const initial = new Promise<Result<VideoProgress>>(resolve => { acknowledge = resolve })
  const queue = new VideoCheckpointQueue(async payload => {
    writes.push(structuredClone(payload))
    return writes.length === 1 ? initial : { ok: true, value: progress(payload) }
  }, () => {}, () => {})
  assert.deepEqual(writes, [], 'Loading a player cannot start its server elapsed budget.')
  queue.initializePlayback(40, 'play-init')
  queue.initializePlayback(90, 'second-play-must-not-replace')
  queue.enqueue({ positionSeconds: 42, watchedRanges: [{ start: 40, end: 42 }], operationId: 'pause' })
  assert.equal(queue.playbackInitialized, false)
  assert.deepEqual(writes, [{ positionSeconds: 40, watchedRanges: [], operationId: 'play-init' }])
  acknowledge({ ok: true, value: progress(writes[0]) })
  await flush()
  assert.equal(queue.playbackInitialized, true)
  assert.deepEqual(writes.map(item => item.operationId), ['play-init', 'pause'])
  assert.deepEqual(queue.pending(), [])
})

test('failed initialization and later observed payloads retain their original identity, data and order on retry', async () => {
  let fail = true
  const attempts: VideoCheckpointPayload[] = []
  const errors: string[] = []
  const queue = new VideoCheckpointQueue(async payload => {
    attempts.push(structuredClone(payload))
    if (fail) return { ok: false, error: 'offline' }
    return { ok: true, value: progress(payload) }
  }, () => {}, error => errors.push(error))
  queue.initializePlayback(0, 'original-init')
  const observed = { positionSeconds: 2, watchedRanges: [{ start: 0, end: 2 }], operationId: 'original-pause' }
  queue.enqueue(observed)
  observed.positionSeconds = 100
  observed.watchedRanges[0].end = 100
  await flush()
  queue.initializePlayback(100, 'replacement-must-not-run')
  assert.deepEqual(errors, ['offline'])
  assert.equal(queue.playbackInitialized, false)
  assert.deepEqual(queue.pending(), [
    { positionSeconds: 0, watchedRanges: [], operationId: 'original-init' },
    { positionSeconds: 2, watchedRanges: [{ start: 0, end: 2 }], operationId: 'original-pause' },
  ])
  fail = false
  queue.retry()
  await flush()
  assert.deepEqual(attempts.map(item => item.operationId), ['original-init', 'original-init', 'original-pause'])
  assert.equal(queue.playbackInitialized, true)
  assert.deepEqual(attempts[2].watchedRanges, [{ start: 0, end: 2 }])
})

test('a thrown initialization transport retains its payload and releases the writer for retry', async () => {
  let attempts = 0
  const errors: string[] = []
  const queue = new VideoCheckpointQueue(async payload => {
    if (++attempts === 1) throw new Error('Synthetic transport interruption')
    return { ok: true, value: progress(payload) }
  }, () => {}, error => errors.push(error))
  queue.initializePlayback(10, 'transport-init')
  await flush()
  assert.deepEqual(errors, ['server_error'])
  assert.equal(queue.pending()[0].operationId, 'transport-init')
  queue.retry()
  await flush()
  assert.equal(attempts, 2)
  assert.equal(queue.playbackInitialized, true)
})

test('initialization state is isolated by service account and video context', async () => {
  const registry = new VideoCheckpointQueueRegistry()
  const accountA = {}, accountB = {}
  const create = () => new VideoCheckpointQueue(async payload => ({ ok: true, value: progress(payload) }), () => {}, () => {})
  const old = registry.getOrCreate(accountA, 'lesson:video-a', create)
  const otherVideo = registry.getOrCreate(accountA, 'lesson:video-b', create)
  const otherAccount = registry.getOrCreate(accountB, 'lesson:video-a', create)
  old.initializePlayback(0, 'account-A-video-A')
  await flush()
  assert.equal(old.playbackInitialized, true)
  assert.equal(otherVideo.playbackInitialized, false)
  assert.equal(otherAccount.playbackInitialized, false)
  assert.equal(registry.getOrCreate(accountA, 'lesson:video-a', create), old)
})

test('actual SQL accepts initialized canonical video checkpoints while rejecting a first nonempty range', async t => {
  const db = await createTestDatabase({ throughMigration: '20261002002900_main_completion_contract.sql' })
  t.after(() => db.close())
  const context = { lessonId: ids.videoLesson, blockId: ids.videoBlock }
  await assert.rejects(command(db, 'save_video_position', {
    ...context, positionSeconds: 2, watchedRanges: [{ start: 0, end: 2 }], operationId: 'uninitialized-range',
  }), (error: { code?: string }) => error.code === '22023')
  const saved: VideoProgress[] = [], errors: string[] = []
  const queue = new VideoCheckpointQueue(async payload => {
    try { return { ok: true, value: await command(db, 'save_video_position', { ...context, ...payload }) } }
    catch { return { ok: false, error: 'validation' } }
  }, result => saved.push(result), error => errors.push(error))
  queue.initializePlayback(0, 'canonical-play-init')
  queue.enqueue({ positionSeconds: 2, watchedRanges: [{ start: 0, end: 2 }], operationId: 'canonical-pause' })
  for (let retry = 0; saved.length < 2 && errors.length === 0 && retry < 100; retry++) await new Promise(resolve => setTimeout(resolve, 10))
  assert.deepEqual(errors, [])
  assert.equal(saved.length, 2)
  assert.deepEqual(saved[0].watchedRanges, [])
  assert.deepEqual(saved[1].watchedRanges, [{ start: 0, end: 2 }])
  assert.equal(saved[1].completed, false)
  assert.deepEqual((await read(db, 'video_progress', ids.videoLesson, ids.videoBlock)).watchedRanges, [{ start: 0, end: 2 }])
  assert.equal((await read(db, 'account')).totalXp, 0)
  assert.equal(await read(db, 'video_progress', ids.videoLesson, ids.videoBlock, ids.userB), null)
})
