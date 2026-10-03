import assert from 'node:assert/strict'
import test from 'node:test'
import { resolve } from 'node:path'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { get as httpGet } from 'node:http'
import { createReferencePreviewServices, previewContext, previewStorageKey } from './services.ts'
import { byteRange, startReferencePreview } from './serve.mjs'
import { findBrowser, withChromePage } from '../../../tests/qa/chromeHarness.mjs'

const metadata = { durationSeconds: 93.389, videoSha256: '2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec', sourceIds: [] }
const packageDir = resolve(fileURLToPath(new URL('../../../docs/content/preview1954-v1/', import.meta.url)))
const storageFixture = () => {
  const values = new Map([['unrelated-account-fixture', 'keep-exact']])
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
}

test('local preview preserves unrelated storage, validates checkpoints and never grants completion', async () => {
  const storage = storageFixture()
  const services = createReferencePreviewServices(metadata, storage)
  const asset = await services.media.getResolvedAsset(previewContext.mediaAssetId)
  assert.equal(asset.ok && asset.value.reviewStatus, 'draft')
  assert.equal(asset.ok && asset.value.license, 'INTERNAL_REFERENCE_ONLY')
  const checkpoint = { ...previewContext, operationId: 'preview-op-1', positionSeconds: 17,
    watchedRanges: [{ start: 0, end: 2 }, { start: 1, end: 3 }] }
  const saved = await services.progress.saveVideoPosition(checkpoint)
  assert.ok(saved.ok)
  assert.deepEqual(saved.value.watchedRanges, [{ start: 0, end: 3 }])
  assert.equal(saved.value.completed, false)
  assert.deepEqual(await services.progress.saveVideoPosition(checkpoint), saved)
  assert.deepEqual(await services.progress.saveVideoPosition({ ...checkpoint, positionSeconds: 20 }), { ok: false, error: 'conflict' })
  for (const position of [-1, NaN, Infinity, 100]) {
    assert.deepEqual(await services.progress.saveVideoPosition({ ...checkpoint, operationId: 'invalid', positionSeconds: position }), { ok: false, error: 'validation' })
  }
  assert.deepEqual(await services.progress.saveVideoPosition({ ...checkpoint, operationId: 'other', lessonId: 'actual-account-lesson' }), { ok: false, error: 'not_found' })
  assert.deepEqual(await services.completion.completeLesson({ lessonId: previewContext.lessonId, operationId: 'complete' }), { ok: false, error: 'not_found' })
  const resumed = createReferencePreviewServices(metadata, storage)
  assert.deepEqual(await resumed.progress.getVideoProgress(previewContext.lessonId, previewContext.blockId), saved)
  assert.equal(storage.values.get('unrelated-account-fixture'), 'keep-exact')
  assert.deepEqual([...storage.values.keys()], ['unrelated-account-fixture', previewStorageKey(metadata.videoSha256)])
  storage.setItem(previewStorageKey(metadata.videoSha256), '{broken-json')
  assert.deepEqual(await resumed.progress.getVideoProgress(previewContext.lessonId, previewContext.blockId), { ok: true, value: null })
  const denied = createReferencePreviewServices(metadata, { getItem: () => null, setItem() { throw new Error('Quota') } })
  assert.deepEqual(await denied.progress.saveVideoPosition(checkpoint), { ok: false, error: 'server_error' })
})

test('single byte ranges are bounded including suffix and open-ended requests', () => {
  assert.deepEqual(byteRange('bytes=0-1', 10), { start: 0, end: 1, partial: true })
  assert.deepEqual(byteRange('bytes=4-', 10), { start: 4, end: 9, partial: true })
  assert.deepEqual(byteRange('bytes=-3', 10), { start: 7, end: 9, partial: true })
  assert.deepEqual(byteRange('bytes=0-99', 10), { start: 0, end: 9, partial: true })
  for (const value of ['bytes=-0', 'bytes=10-', 'bytes=5-4', 'bytes=0-1,3-4', 'bytes=', 'bytes=99999999999999999-']) assert.equal(byteRange(value, 10), null)
})

test('owned loopback preview serves exact supplied bytes with HEAD/ranges and rejects other package paths', async () => {
  const server = await startReferencePreview({ packageDir, port: 0 })
  const origin = 'http://127.0.0.1:' + server.httpServer.address().port
  try {
    const header = await fetch(origin + '/reference-media/pilot-mobile.mp4', { method: 'HEAD' })
    assert.equal(header.status, 200)
    assert.equal(header.headers.get('content-length'), '19289629')
    const range = await fetch(origin + '/reference-media/pilot-mobile.mp4', { headers: { Range: 'bytes=0-63' } })
    assert.equal(range.status, 206)
    assert.equal(range.headers.get('content-range'), 'bytes 0-63/19289629')
    const original = await readFile(resolve(packageDir, 'pilot-mobile.mp4'))
    assert.deepEqual(Buffer.from(await range.arrayBuffer()), original.subarray(0, 64))
    for (const route of ['manifest.json', '../manifest.json', '%2e%2e%2fmanifest.json', 'pilot-mobile.mp4%00', 'missing.mp4']) {
      const denied = await fetch(origin + '/reference-media/' + route)
      assert.notEqual(denied.status, 200)
      assert.notEqual(denied.status, 206)
    }
    assert.equal((await fetch(origin + '/reference-media/poster.png', { method: 'POST' })).status, 405)
    assert.equal((await fetch(origin + '/reference-media/pilot-mobile.mp4', { headers: { Range: 'bytes=999999999-' } })).status, 416)
    assert.equal((await fetch(origin + '/reference-media/poster.png', { headers: { Origin: 'https://example.invalid' } })).status, 403)
    const invalidHost = await new Promise((resolveResponse, reject) => {
      httpGet(origin + '/reference-media/poster.png', { headers: { Host: 'example.invalid' } }, response => {
        response.resume(); resolveResponse(response.statusCode)
      }).on('error', reject)
    })
    assert.equal(invalidHost, 403)
  } finally { await server.close() }
})

test('actual existing player loads native video/captions, resumes owned local progress and recovers from media failure', async () => {
  const server = await startReferencePreview({ packageDir, port: 0 })
  const origin = 'http://127.0.0.1:' + server.httpServer.address().port
  const key = previewStorageKey(metadata.videoSha256)
  try {
    await withChromePage(findBrowser(), origin, async cdp => {
      await cdp.waitFor('document.querySelector("video")?.readyState >= 1')
      assert.ok((await cdp.evaluate('document.body.innerText')).includes('Xem thử nội bộ · Trước cơn bão'))
      assert.equal(await cdp.evaluate('document.querySelector("video").autoplay'), false)
      assert.equal(await cdp.evaluate('document.querySelector("video").videoWidth'), 1080)
      assert.equal(await cdp.evaluate('document.querySelector("video").videoHeight'), 1920)
      assert.ok(Math.abs(await cdp.evaluate('document.querySelector("video").duration') - metadata.durationSeconds) < .15)
      await cdp.waitFor('document.querySelector("video").textTracks[0]?.cues?.length > 0')
      assert.equal(await cdp.evaluate('document.querySelector("video").textTracks[0].cues.length'), 28)
      await cdp.evaluate('localStorage.setItem("unrelated-account-fixture","keep-exact")')
      await cdp.raw('Runtime.evaluate', { expression: 'document.querySelector("video").muted = true; document.querySelector("video").play()', awaitPromise: true, userGesture: true })
      await cdp.waitFor('document.querySelector("video").currentTime > .6')
      await cdp.evaluate('document.querySelector("video").pause(); document.querySelector("video").currentTime=17')
      await cdp.waitFor(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}) || 'null')?.positionSeconds === 17`)
      const stored = await cdp.evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`)
      assert.equal(stored.completed, false)
      assert.ok(stored.watchedRanges.some(range => range.end > range.start))
      await cdp('Page.reload')
      await cdp.waitFor('document.querySelector("video")?.readyState >= 1 && Math.abs(document.querySelector("video").currentTime-17)<.2')
      assert.equal(await cdp.evaluate('localStorage.getItem("unrelated-account-fixture")'), 'keep-exact')
      assert.equal(await cdp.evaluate('(async()=> (await navigator.serviceWorker.getRegistrations()).length)()'), 0)
      for (const { width, height } of [{ width: 375, height: 812 }, { width: 430, height: 900 }, { width: 812, height: 375 }]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true })
        assert.equal(await cdp.evaluate('document.documentElement.scrollWidth<=innerWidth'), true)
      }
      await cdp.evaluate('document.querySelector("video").src="/reference-media/missing.mp4";document.querySelector("video").load()')
      await cdp.waitFor('document.body.innerText.includes("Video chưa thể phát")')
      assert.equal(await cdp.evaluate('document.querySelector("a[href=\\"/reference-media/transcript.vi.txt\\"]") !== null'), true)
      await cdp.evaluate('Array.from(document.querySelectorAll("button")).find(button=>button.textContent.includes("THỬ PHÁT LẠI")).click()')
      await cdp.waitFor('document.querySelector("video")?.readyState >= 1 && Math.abs(document.querySelector("video").currentTime-17)<.2')
      if (process.env.REFERENCE_PREVIEW_SCREENSHOT_DIR) {
        await cdp.waitFor('document.querySelector("video")?.readyState >= 2 && !document.querySelector("video").seeking')
        const output = resolve(process.env.REFERENCE_PREVIEW_SCREENSHOT_DIR)
        await mkdir(output, { recursive: true })
        await cdp('Emulation.setDeviceMetricsOverride', { width: 430, height: 900, deviceScaleFactor: 1, mobile: true })
        const shot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
        await writeFile(resolve(output, 'reference1954-player.png'), Buffer.from(shot.data, 'base64'))
      }
    })
  } finally { await server.close() }
})
