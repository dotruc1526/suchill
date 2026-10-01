import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import { loadVideoPlayer, observedRange, saveVideoCheckpoint } from '../../src/features/learning/video/videoPlayerModel.ts'
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
