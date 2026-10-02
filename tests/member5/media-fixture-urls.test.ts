import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/backendMock.ts'
import { playbackCatalog } from './playback-fixtures.ts'

test('interactive technical media resolves only explicitly declared local public fixture resources', async () => {
  const catalog = playbackCatalog()
  catalog.mediaResourceUrls = {
    'videos/sample.mp4': '/technical-fixtures/unavailable-video.mp4',
    'images/poster.webp': '/technical-fixtures/abstract-poster.svg',
    'captions/vi.vtt': '/technical-fixtures/captions.vi.vtt',
    'documents/transcript.html': '/technical-fixtures/transcript.html',
  }
  const services = createMockLearningServices(catalog, { userId: 'a' })
  const result = await services.media.getResolvedAsset('video')
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.value.url, '/technical-fixtures/unavailable-video.mp4')
  assert.equal(result.value.poster?.url, '/technical-fixtures/abstract-poster.svg')
  assert.equal(result.value.captionTracks[0].url, '/technical-fixtures/captions.vi.vtt')
  assert.deepEqual(result.value.fallback, { kind: 'transcript', url: '/technical-fixtures/transcript.html' })
  assert.equal('mediaResourceUrls' in result.value, false)
})

test('declared fixture media URLs reject external schemes, unrelated routes, traversal and ambiguous encodings', async () => {
  for (const url of ['https://example.test/media.mp4', '//example.test/video.mp4', 'javascript:alert(1)',
    '/account/private.json', '/technical-fixtures/../private.json', '/technical-fixtures/%2e%2e/private.json',
    '/technical-fixtures/a\\private.json', '/technical-fixtures/video.mp4?secret=value', '/technical-fixtures/video.mp4#fragment']) {
    const catalog = playbackCatalog()
    catalog.mediaResourceUrls = { 'videos/sample.mp4': url }
    const services = createMockLearningServices(catalog, { userId: 'a' })
    assert.deepEqual(await services.media.getResolvedAsset('video'), { ok: false, error: 'not_found' }, url)
  }
  for (const ref of ['images/poster.webp', 'captions/vi.vtt', 'documents/transcript.html']) {
    const catalog = playbackCatalog()
    catalog.mediaResourceUrls = { [ref]: '/technical-fixtures/../../private.json' }
    assert.deepEqual(await createMockLearningServices(catalog, { userId: 'a' }).media.getResolvedAsset('video'), { ok: false, error: 'not_found' })
  }
})
