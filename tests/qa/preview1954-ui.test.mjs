import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { verifiedPackage } from '../../scripts/release/build-hosting-preview.mjs'
import { canOpenEpisode, previewChapter, viewForHash } from '../../src/services/reference1954/catalog.ts'
import { previewStorageKey } from '../../src/services/reference1954/localPreview.ts'
import { findBrowser, withChromePage } from './chromeHarness.mjs'

const root = resolve(import.meta.dirname, '../..')
const { files, metadata } = await verifiedPackage(resolve(root, 'docs/content/preview1954-v1'))
const types = { 'pilot-mobile.mp4': 'video/mp4', 'poster.png': 'image/png', 'captions.vi.vtt': 'text/vtt', 'transcript.vi.txt': 'text/plain' }
const server = await createServer({ root, configFile: false, envDir: false, cacheDir: 'node_modules/.vite-1954-qa',
  resolve: { alias: { '@': resolve(root, 'src') } },
  define: { 'import.meta.env.VITE_INTERNAL_1954_PREVIEW': JSON.stringify('true'),
    'import.meta.env.VITE_REFERENCE_1954_METADATA': JSON.stringify(JSON.stringify(metadata)) },
  plugins: [react(), tailwindcss(), { name: 'verified-preview-media-fixture', configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const name = req.url?.replace(/^\/reference-media\//, '')
      if (!req.url?.startsWith('/reference-media/') || !files.has(name)) return next()
      res.setHeader('Content-Type', types[name]); res.setHeader('Cache-Control', 'no-store')
      // Match Firebase's actual HTTP200/full-file behavior.
      res.end(files.get(name))
    })
  } }], optimizeDeps: { entries: ['tests/qa/fixtures/preview1954.html'] },
  server: { host: '127.0.0.1', port: 0, hmr: false } })
await server.listen()
after(() => server.close())
const url = `http://127.0.0.1:${server.httpServer.address().port}/tests/qa/fixtures/preview1954.html`
const key = previewStorageKey(metadata.videoSha256)
const click = (cdp, id) => cdp.evaluate(`document.querySelector('[data-testid="${id}"]').click()`)

test('locked episodes and unknown direct routes cannot open the preview video', () => {
  assert.equal(previewChapter.episodes.length, 7)
  assert.equal(previewChapter.episodes.filter(e => canOpenEpisode(e.id)).length, 1)
  for (const episode of previewChapter.episodes.slice(1)) assert.equal(canOpenEpisode(episode.id), false)
  assert.equal(canOpenEpisode('preview.1954.episode99'), false)
  for (const hash of ['#episode-1954-02', '#episode-1954-07', '#episode-1954-01/../02']) assert.equal(viewForHash(hash), 'home')
  assert.equal(viewForHash('#episode-1954-01'), 'video')
})

test('Chrome integrates Chapter1/1954, six disabled episodes, focus/back and verified original video resume', async () => {
  await withChromePage(findBrowser(), url, async cdp => {
    try {
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-learning]"))')
      assert.match(await cdp.evaluate('document.body.innerText'), /CHƯƠNG 01.*NĂM 1954/s)
      assert.equal(await cdp.evaluate('window.preview1954Safe'), true)
      assert.equal(await cdp.evaluate('performance.getEntriesByType("resource").some(e=>e.name.endsWith("pilot-mobile.mp4"))'), false)
      await cdp.evaluate('localStorage.setItem("unrelated-owned-account-fixture", "keep-exact")')
      await click(cdp, 'preview1954-chapter')
      await cdp.waitFor('document.querySelectorAll("ol button:disabled").length === 6')
      assert.equal(await cdp.evaluate('window.preview1954Safe'), false)
      assert.equal(await cdp.evaluate('document.activeElement.id'), 'preview1954-heading')
      assert.deepEqual(await cdp.evaluate('Array.from(document.querySelectorAll("ol h2"), e=>e.textContent)'), previewChapter.episodes.map(e=>e.title))
      await click(cdp, 'preview.1954.episode02')
      assert.equal(await cdp.evaluate('Boolean(document.querySelector("video"))'), false)
      for (const [width, height] of [[375,812], [430,932], [844,390]]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true })
        assert.equal(await cdp.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
      }
      await cdp('Emulation.setDeviceMetricsOverride', { width:375,height:812,deviceScaleFactor:1,mobile:true })
      await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
      await cdp.evaluate('document.documentElement.style.fontSize="200%"')
      assert.equal(await cdp.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
      await cdp.evaluate('document.documentElement.style.fontSize=""; location.hash="#episode-1954-02"')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-start]"))')
      assert.equal(await cdp.evaluate('Boolean(document.querySelector("video"))'), false)
      await click(cdp, 'preview1954-chapter')
      await click(cdp, 'preview.1954.episode01')
      await cdp.waitFor('document.querySelector("video")?.readyState >= 1')
      assert.equal(await cdp.evaluate('document.querySelector("video").videoWidth'), 1080)
      assert.equal(await cdp.evaluate('document.querySelector("video").autoplay'), false)
      assert.equal(await cdp.evaluate('document.querySelectorAll("[data-testid=preview1954-source-notes] a").length'), 3)
      await cdp.waitFor('document.querySelector("video").textTracks[0]?.cues?.length===28')
      await cdp('Runtime.evaluate', { expression: 'document.querySelector("video").play()', userGesture: true, awaitPromise: true })
      await cdp.waitFor('!document.querySelector("video").paused')
      await cdp.evaluate('document.querySelector("video").pause(); document.querySelector("video").currentTime=17')
      await cdp.waitFor(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}) || "null")?.positionSeconds === 17`)
      await cdp('Page.reload')
      await cdp.waitFor('document.querySelector("video")?.readyState>=1 && Math.abs(document.querySelector("video").currentTime-17)<0.5')
      const saved = await cdp.evaluate(`JSON.parse(localStorage.getItem(${JSON.stringify(key)}))`)
      assert.equal(saved.completed, false)
      assert.equal(saved.lessonId, 'preview.reference1954.lesson')
      assert.equal(await cdp.evaluate('localStorage.getItem("unrelated-owned-account-fixture")'), 'keep-exact')
      assert.equal(await cdp.evaluate('performance.getEntriesByType("resource").some(e=>/supabase|account-access/.test(e.name))'), false)
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('document.querySelectorAll("ol button:disabled").length===6')
      assert.equal(await cdp.evaluate('document.activeElement.dataset.testid'), 'preview.1954.episode01')
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-chapter]"))')
      assert.equal(await cdp.evaluate('document.activeElement.dataset.testid'), 'preview1954-chapter')
      await cdp.waitFor('window.preview1954Safe === true')
    } finally { await cdp.browser('Browser.close').catch(() => {}) }
  })
})

test('Chrome offline video retains transcript/retry and locks instead of granting completion', async () => {
  await withChromePage(findBrowser(), url, async cdp => {
    try {
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-start]"))')
      // First preload just the lazy player, then block its media transport.
      await cdp('Network.enable')
      await cdp('Network.setBlockedURLs', { urls: ['*reference-media/pilot-mobile.mp4*'] })
      await click(cdp, 'preview1954-start')
      await cdp.waitFor('document.body.innerText.includes("Không thể tải video")')
      assert.equal(await cdp.evaluate('Array.from(document.querySelectorAll("a")).some(a=>a.getAttribute("href")==="/reference-media/transcript.vi.txt")'), true)
      assert.equal(await cdp.evaluate(`localStorage.getItem(${JSON.stringify(key)})`), null)
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('document.querySelectorAll("ol button:disabled").length===6')
    } finally { await cdp.browser('Browser.close').catch(() => {}) }
  })
})


test('UI parent Back pops history; subsequent Android/browser Back does not reopen video, including direct links', async () => {
  await withChromePage(findBrowser(), url, async cdp => {
    try {
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-chapter]"))')
      await click(cdp, 'preview1954-chapter')
      await click(cdp, 'preview.1954.episode01')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-source-notes]"))')
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('location.hash==="#chapter-1954" && document.querySelectorAll("ol button:disabled").length===6')
      await cdp.evaluate('history.back()')
      await cdp.waitFor('location.hash==="" && Boolean(document.querySelector("[data-testid=preview1954-chapter]"))')
      assert.equal(await cdp.evaluate('Boolean(document.querySelector("video"))'), false)
      await click(cdp, 'preview1954-start')
      await cdp.waitFor('location.hash==="#episode-1954-01"')
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('location.hash==="#chapter-1954"')
      await cdp.evaluate('history.back()')
      await cdp.waitFor('location.hash===""')
      assert.equal(await cdp.evaluate('Boolean(document.querySelector("video"))'), false)
      await cdp.evaluate('history.replaceState(null, "", location.pathname + "#episode-1954-01")')
      await cdp('Page.reload')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-back]"))')
      const length = await cdp.evaluate('history.length')
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('location.hash==="#chapter-1954"')
      assert.equal(await cdp.evaluate('history.length'), length)
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-chapter]"))')
      assert.equal(await cdp.evaluate('history.length'), length)
    } finally { await cdp.browser('Browser.close').catch(() => {}) }
  })
})
