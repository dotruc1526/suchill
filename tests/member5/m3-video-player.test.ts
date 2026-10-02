import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import {
  isActiveVideoContext, loadVideoPlayer, observedRange, saveVideoCheckpoint, videoContextKey, VideoCheckpointQueue,
  VideoCheckpointQueueRegistry,
} from '../../src/features/learning/video/videoPlayerModel.ts'
import { playbackCatalog } from './playback-fixtures.ts'

const context = { lessonId: 'lesson', blockId: 'video-block', mediaAssetId: 'video' }
const now = () => '2026-10-01T00:00:00Z'

test('M3-04 loads resolved video resources and resumes the exact saved position', async () => {
  const catalog = playbackCatalog()
  const store = createMockProgressStore()
  const services = createMockLearningServices(catalog, { userId: 'duong' }, now, store)
  const saved = await saveVideoCheckpoint(services, context, 42, [{ start: 0, end: 42 }], 'seed-position')
  assert.equal(saved.ok, true)

  const loaded = await loadVideoPlayer(createMockLearningServices(catalog, { userId: 'duong' }, now, store), context)
  assert.equal(loaded.ok, true)
  if (!loaded.ok) return
  assert.equal(loaded.value.resumePositionSeconds, 42)
  assert.equal(loaded.value.asset.url, 'mock://media/videos%2Fsample.mp4')
  assert.equal(loaded.value.asset.poster?.altText, 'Ảnh minh họa fixture')
  assert.equal(loaded.value.asset.captionTracks[0].locale, 'vi-VN')
  assert.equal(loaded.value.asset.transcript?.label, 'Bản chép lời')
  for (const privateField of ['storageRef', 'posterMediaId', 'captionTrackRefs', 'transcriptRef']) {
    assert.equal(privateField in loaded.value.asset, false)
  }
})

test('M3-04 checkpoints bounded observed ranges without client completion authority', async () => {
  assert.deepEqual(observedRange(10, 25, 100), [{ start: 10, end: 25 }])
  assert.deepEqual(observedRange(90, 120, 100), [{ start: 90, end: 100 }])
  assert.deepEqual(observedRange(null, 20, 100), [])
  assert.deepEqual(observedRange(30, 20, 100), [])

  const services = createMockLearningServices(playbackCatalog(), { userId: 'duong' }, now)
  const saved = await saveVideoCheckpoint(services, context, 25, [{ start: 10, end: 25 }], 'pause-1')
  assert.equal(saved.ok && saved.value.positionSeconds, 25)
  assert.equal(saved.ok && saved.value.completed, false)
})

test('M3-04 fails closed for missing/non-video media and treats absent progress as a fresh start', async () => {
  const services = createMockLearningServices(playbackCatalog(), { userId: 'duong' }, now)
  assert.deepEqual(await loadVideoPlayer(services, { ...context, mediaAssetId: 'missing' }), { ok: false, error: 'not_found' })
  assert.deepEqual(await loadVideoPlayer(services, { ...context, mediaAssetId: 'poster' }), { ok: false, error: 'validation' })
  const fresh = await loadVideoPlayer(services, context)
  assert.equal(fresh.ok && fresh.value.progress, null)
  assert.equal(fresh.ok && fresh.value.resumePositionSeconds, 0)
})

test('M3-04 retains failed and later checkpoints, then retries them in order with stable operations', async () => {
  const attempts: string[] = []
  const saved: number[] = []
  let failFirst = true
  const queue = new VideoCheckpointQueue(async payload => {
    attempts.push(payload.operationId)
    if (failFirst) { failFirst = false; return { ok: false, error: 'offline' } }
    return { ok: true, value: {
      userId: 'duong', lessonId: 'lesson', blockId: 'video-block', positionSeconds: payload.positionSeconds,
      watchedRanges: payload.watchedRanges, completed: false, updatedAt: now(),
    } }
  }, progress => saved.push(progress.positionSeconds), () => {})

  queue.enqueue({ positionSeconds: 10, watchedRanges: [{ start: 0, end: 10 }], operationId: 'source' })
  queue.enqueue({ positionSeconds: 70, watchedRanges: [], operationId: 'seek-target' })
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(queue.pending().map(item => item.positionSeconds), [10, 70])
  queue.retry()
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(attempts, ['source', 'source', 'seek-target'])
  assert.deepEqual(saved, [10, 70])
  assert.deepEqual(queue.pending(), [])
})

test('M3-04 isolates late checkpoint callbacks by video context', () => {
  const videoA = videoContextKey(context)
  const videoB = videoContextKey({ ...context, mediaAssetId: 'video-b' })
  assert.equal(isActiveVideoContext(videoA, videoA), true)
  assert.equal(isActiveVideoContext(videoB, videoA), false)
})

test('M3-04 creates a new writer when services change for the same video context', async () => {
  const registry = new VideoCheckpointQueueRegistry()
  const serviceA = {}
  const serviceB = {}
  const writes: string[] = []
  const createQueue = (label: string) => new VideoCheckpointQueue(async payload => {
    writes.push(`${label}:${payload.operationId}`)
    return { ok: false, error: 'offline' }
  }, () => {}, () => {})
  const key = videoContextKey(context)
  const queueA = registry.getOrCreate(serviceA, key, () => createQueue('A'))
  const queueB = registry.getOrCreate(serviceB, key, () => createQueue('B'))

  assert.notEqual(queueA, queueB)
  queueB.enqueue({ positionSeconds: 20, watchedRanges: [], operationId: 'new-session' })
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(writes, ['B:new-session'])
})

test('M3-04 captures the loading actor and rejects progress DTOs returned for another account', async () => {
  const session = { userId: 'A' }
  const base = createMockLearningServices(playbackCatalog(), session, now)
  const loaded = await loadVideoPlayer(base, context)
  assert.equal(loaded.ok && loaded.value.userId, 'A')
  const foreign = { ...base, progress: { ...base.progress, async getVideoProgress() {
    return { ok: true as const, value: { userId: 'B', lessonId: context.lessonId, blockId: context.blockId,
      positionSeconds: 50, watchedRanges: [], completed: false, updatedAt: now() } }
  } } }
  assert.deepEqual(await loadVideoPlayer(foreign, context), { ok: false, error: 'unauthorized' })
})

test('M3-04 retained video payloads cannot write the originating actor progress into a later account', async () => {
  const actor = { userId: 'A' }, base = createMockLearningServices(playbackCatalog(), actor, now)
  let first = true
  const errors: string[] = []
  const queue = new VideoCheckpointQueue(async payload => {
    if (first) { first = false; return { ok: false, error: 'offline' } }
    return saveVideoCheckpoint(base, context, payload.positionSeconds, payload.watchedRanges, payload.operationId, payload.expectedRevision, payload.expectedSubject)
  }, () => {}, error => errors.push(error))
  queue.enqueue({ positionSeconds: 10, watchedRanges: [], operationId: 'original-A', expectedSubject: 'A' })
  await new Promise(resolve => setImmediate(resolve))
  actor.userId = 'B'
  queue.retry()
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(errors, ['offline', 'unauthorized'])
  assert.deepEqual(await base.progress.getVideoProgress(context.lessonId, context.blockId), { ok: true, value: null })
  assert.equal(queue.pending()[0].expectedSubject, 'A')
})

test('M3-04 a thrown video transport remains retryable rather than locking the writer forever', async () => {
  let failing = true
  const errors: string[] = []
  const queue = new VideoCheckpointQueue(async payload => {
    if (failing) { failing = false; throw new Error('transport') }
    return { ok: true, value: { userId: 'A', lessonId: 'lesson', blockId: 'video-block', positionSeconds: payload.positionSeconds,
      watchedRanges: [], completed: false, updatedAt: now() } }
  }, () => {}, error => errors.push(error))
  queue.enqueue({ positionSeconds: 10, watchedRanges: [], operationId: 'retryable' })
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(errors, ['server_error'])
  queue.retry()
  await new Promise(resolve => setImmediate(resolve))
  assert.deepEqual(queue.pending(), [])
})

test('explicit rejected-video reload creates a fresh writer while preserving other video contexts', async () => {
  const registry = new VideoCheckpointQueueRegistry(), service = {}, key = videoContextKey(context)
  const rejected = registry.getOrCreate(service, key, () => new VideoCheckpointQueue(async () => ({ ok: false, error: 'conflict' }), () => {}, () => {}))
  const other = registry.getOrCreate(service, 'other', () => new VideoCheckpointQueue(async () => ({ ok: false, error: 'offline' }), () => {}, () => {}))
  rejected.enqueue({ positionSeconds: 50, watchedRanges: [], operationId: 'stale', expectedRevision: 1 })
  await new Promise(resolve => setImmediate(resolve))
  registry.reset(service, key)
  const fresh = registry.getOrCreate(service, key, () => new VideoCheckpointQueue(async () => ({ ok: false, error: 'offline' }), () => {}, () => {}))
  assert.notEqual(fresh, rejected)
  assert.deepEqual(fresh.pending(), [])
  assert.equal(registry.getOrCreate(service, 'other', () => { throw new Error('must retain other video') }), other)
})
