import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { playbackCatalog } from './playback-fixtures.ts'

const services = (catalog = playbackCatalog()) => createMockLearningServices(catalog, { userId: 'a' })

test('media resolves video, poster, Vietnamese captions, transcript and accessible fallback without storage paths', async () => {
  const media = services().media
  const result = await media.getResolvedAsset('video')
  assert.equal(result.ok, true)
  if (!result.ok) return
  const asset = result.value
  assert.equal(asset.url, 'mock://media/videos%2Fsample.mp4')
  assert.deepEqual(asset.poster, { id: 'poster', url: 'mock://media/images%2Fposter.webp', altText: 'Ảnh minh họa fixture' })
  assert.deepEqual(asset.captionTracks, [{ id: 'captions', url: 'mock://media/captions%2Fvi.vtt', locale: 'vi-VN', label: 'Tiếng Việt' }])
  assert.deepEqual(asset.transcript, { id: 'transcript', url: 'mock://media/documents%2Ftranscript.html', locale: 'vi-VN', label: 'Bản chép lời' })
  assert.deepEqual(asset.fallback, { kind: 'transcript', url: asset.transcript?.url })
  for (const field of ['storageRef', 'posterMediaId', 'captionTrackRefs', 'transcriptRef']) assert.equal(field in asset, false)
  asset.captionTracks[0].label = 'Changed'
  asset.poster!.altText = 'Changed'
  const again = await media.getResolvedAsset('video')
  assert.equal(again.ok && again.value.captionTracks[0].label, 'Tiếng Việt')
  assert.equal(again.ok && again.value.poster?.altText, 'Ảnh minh họa fixture')
})

test('media fails closed for missing, draft or wrong-kind secondary references', async () => {
  for (const target of ['poster', 'captions', 'transcript']) {
    for (const state of ['missing', 'draft', 'kind', 'empty']) {
      const catalog = playbackCatalog()
      if (target === 'poster') {
        if (state === 'missing') catalog.mediaAssets = catalog.mediaAssets.filter(asset => asset.id !== 'poster')
        else {
          const poster = catalog.mediaAssets[1]
          if (state === 'draft') poster.reviewStatus = 'draft'
          if (state === 'kind') poster.kind = 'audio'
          if (state === 'empty') poster.storageRef = ''
        }
      } else {
        if (state === 'missing') catalog.mediaResources = catalog.mediaResources!.filter(resource => resource.id !== target)
        else {
          const resource = catalog.mediaResources!.find(resource => resource.id === target)!
          if (state === 'draft') resource.reviewStatus = 'draft'
          if (state === 'kind') resource.kind = resource.kind === 'caption' ? 'transcript' : 'caption'
          if (state === 'empty') resource.storageRef = ''
        }
      }
      assert.deepEqual(await services(catalog).media.getResolvedAsset('video'), { ok: false, error: 'not_found' }, `${target}: ${state}`)
    }
  }
  const catalog = playbackCatalog()
  catalog.mediaAssets[0].reviewStatus = 'draft'
  assert.deepEqual(await services(catalog).media.getResolvedAsset('video'), { ok: false, error: 'not_found' })
})

test('fallback only uses published resources actually available in the media package', async () => {
  const catalog = playbackCatalog()
  delete catalog.mediaAssets[0].transcriptRef
  const posterFallback = await services(catalog).media.getResolvedAsset('video')
  assert.deepEqual(posterFallback.ok && posterFallback.value.fallback, {
    kind: 'poster', url: 'mock://media/images%2Fposter.webp', altText: 'Ảnh minh họa fixture',
  })
  delete catalog.mediaAssets[0].posterMediaId
  const noFallback = await services(catalog).media.getResolvedAsset('video')
  assert.equal(noFallback.ok && noFallback.value.fallback, undefined)
  assert.deepEqual(await services().media.getResolvedAsset('unknown'), { ok: false, error: 'not_found' })
})
