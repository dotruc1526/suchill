import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { verifiedPackage } from '../../scripts/release/build-hosting-preview.mjs'
import { canOpenEpisode, canPreviewLesson, previewChapter, viewForHash } from '../../src/services/reference1954/catalog.ts'
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

test('version-specific source notes render correct wording and preserve sources in SSR', async () => {
  const { default: React } = await import('react')
  const { renderToStaticMarkup } = await import('react-dom/server')
  const { PreviewSourceNotes } = await server.ssrLoadModule('/src/features/learning/preview1954/PreviewSourceNotes.tsx')
  const original = renderToStaticMarkup(React.createElement(PreviewSourceNotes))
  const corrected = renderToStaticMarkup(React.createElement(PreviewSourceNotes, { corrected: true }))
  assert.match(original, /tâm điểm của cả cuộc chiến.*diễn đạt quá rộng/s)
  assert.doesNotMatch(original, /Bản v2 đã sửa/)
  assert.match(corrected, /Bản v2 đã sửa.*điểm quyết chiến chiến lược của hai bên.*chờ nghiệm thu.*lượt nghe cuối/s)
  assert.doesNotMatch(corrected, /tâm điểm của cả cuộc chiến|diễn đạt quá rộng/)
  for (const html of [original, corrected]) {
    assert.equal((html.match(/<a /g) ?? []).length, 3)
    assert.match(html, /minh họa, không phải tư liệu hoặc lời chứng lịch sử/)
  }
})

test('video version switch shows the matching correction note and transcript without inventing acceptance', async () => {
  await withChromePage(findBrowser(), url + '#episode-1954-01', async cdp => {
    try {
      const note = () => cdp.evaluate('document.querySelector("[data-testid=preview1954-context-note]").innerText')
      const press = text => cdp.evaluate(`Array.from(document.querySelectorAll('button')).find(button=>button.textContent.trim()===${JSON.stringify(text)}).click()`)
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-context-note]"))')
      assert.match(await note(), /diễn đạt quá rộng/)
      await press('XEM BẢN VIDEO ĐÃ SỬA LỜI DẪN')
      await cdp.waitFor('document.querySelector("[data-testid=preview1954-context-note]").innerText.includes("Bản v2 đã sửa")')
      assert.match(await note(), /điểm quyết chiến chiến lược của hai bên.*chờ nghiệm thu.*lượt nghe cuối/s)
      assert.doesNotMatch(await note(), /tâm điểm của cả cuộc chiến|diễn đạt quá rộng/)
      assert.equal(await cdp.evaluate('document.querySelectorAll("[data-testid=preview1954-source-notes] a").length'), 3)
      await cdp.evaluate('Array.from(document.querySelectorAll("summary")).find(item=>item.textContent.trim()==="Đọc bản chép lời").click()')
      await cdp.waitFor('document.body.innerText.includes("Nhưng tại sao một thung lũng ở Tây Bắc")')
      assert.doesNotMatch(await cdp.evaluate('Array.from(document.querySelectorAll("details")).find(item=>item.querySelector("summary")?.textContent.trim()==="Đọc bản chép lời").innerText'), /tâm điểm của cả cuộc chiến/)
      await press('ĐỐI CHIẾU VIDEO GỐC')
      await cdp.waitFor('document.querySelector("[data-testid=preview1954-context-note]").innerText.includes("diễn đạt quá rộng")')
      assert.doesNotMatch(await note(), /Bản v2 đã sửa/)
      assert.equal(await cdp.evaluate('performance.getEntriesByType("resource").some(item=>/supabase|account-access/.test(item.name))'), false)
    } finally { await cdp.browser('Browser.close').catch(() => {}) }
  })
})

test('locked episodes and unknown direct routes cannot open the preview video', () => {
  assert.equal(previewChapter.episodes.length, 7)
  assert.equal(previewChapter.episodes.filter(e => canOpenEpisode(e.id)).length, 1)
  for (const episode of previewChapter.episodes.slice(1)) assert.equal(canOpenEpisode(episode.id), false)
  assert.equal(canOpenEpisode('preview.1954.episode99'), false)
  for (const hash of ['#episode-1954-08', '#episode-1954-01/../02']) assert.equal(viewForHash(hash), 'home')
  assert.equal(viewForHash('#episode-1954-01'), 'video')
  assert.equal(viewForHash('#episode-1954-06-preview'), 'lessonSix')
  assert.equal(viewForHash('#visual-novel-demo'), 'lessonSix')
  assert.equal(canPreviewLesson('preview.1954.episode06'), true)
  assert.equal(canPreviewLesson('preview.1954.episode02'), true)
  assert.equal(canPreviewLesson('preview.1954.episode08'), false)
  for (const number of ['02', '03', '04', '05', '07']) assert.equal(viewForHash(`#episode-1954-${number}`), `draft${number}`)
})

test('all seven chapter entries open their real preview content and direct draft routes retain Back', async () => {
  await withChromePage(findBrowser(), url, async cdp => {
    try {
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-chapter]"))')
      await click(cdp, 'preview1954-chapter')
      for (const number of ['02', '03', '04', '05', '07']) {
        await cdp.waitFor('document.querySelectorAll("ol button").length===7')
        assert.equal(await cdp.evaluate('document.querySelectorAll("ol button:disabled").length'), 0)
        await click(cdp, `preview.1954.episode${number}`)
        await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-draft-lesson]"))')
        assert.match(await cdp.evaluate('document.querySelector("h1").textContent'), new RegExp(`Tập ${Number(number)}`))
        assert.equal(await cdp.evaluate('document.querySelectorAll("[data-testid=preview1954-draft-lesson] li").length'), 3)
        assert.match(await cdp.evaluate('document.body.innerText'), /Không tính XP/)
        assert.equal(await cdp.evaluate('Boolean(document.querySelector("video"))'), false)
        await click(cdp, 'preview1954-back')
      }
      await cdp.evaluate('history.replaceState(null,"",location.pathname+"#episode-1954-07")')
      await cdp('Page.reload')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-draft-lesson]"))')
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('location.hash==="#chapter-1954"')
      assert.equal(await cdp.evaluate('performance.getEntriesByType("resource").some(item=>/supabase|account-access/.test(item.name))'), false)
    } finally { await cdp.browser('Browser.close').catch(() => {}) }
  })
})

test('lesson6 contains VN, retries knowledge errors, completes debrief without reward and returns to chapter', async () => {
  await withChromePage(findBrowser(), url, async cdp => {
    try {
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-chapter]"))')
      assert.equal(await cdp.evaluate('document.body.innerText.includes("CHƠI THỬ VISUAL NOVEL")'), false)
      await click(cdp, 'preview1954-chapter')
      await click(cdp, 'preview.1954.episode06')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-lesson-six]"))')
      const pressText = text => cdp.evaluate(`Array.from(document.querySelectorAll('button')).find(button=>button.textContent.trim()===${JSON.stringify(text)}).click()`)
      await cdp.evaluate('localStorage.setItem("unrelated-owned-account-fixture", "keep")')
      await pressText('BẮT ĐẦU VISUAL NOVEL')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-novel-stage]"))')
      await cdp.waitFor('Array.from(document.images).some(img=>img.alt.startsWith("Tranh minh họa") && img.complete && img.naturalWidth>0)')
      const choose = index => cdp.evaluate(`document.querySelectorAll('[aria-label="Lựa chọn lời đáp"] button')[${index}].click()`)
      await choose(0)
      assert.match(await cdp.evaluate('document.querySelector("[role=status]").innerText'), /Lời đáp của bạn/)
      assert.equal(await cdp.evaluate('document.querySelector("[role=status]").style.backgroundColor'), 'rgb(245, 230, 208)')
      await pressText('TIẾP TỤC ›')
      await choose(0)
      assert.match(await cdp.evaluate('document.querySelector("[role=status]").innerText'), /Cùng xem lại/)
      await pressText('THỬ CHỌN LẠI')
      await choose(1)
      await pressText('TIẾP TỤC ›')
      await choose(0)
      await pressText('TIẾP TỤC ›')
      await choose(1)
      await pressText('TIẾP TỤC ›')
      for (const [width,height] of [[375,812],[844,390]]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width,height,deviceScaleFactor:1,mobile:true })
        await cdp.evaluate('document.documentElement.style.fontSize="200%"')
        assert.equal(await cdp.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
      }
      await pressText('ĐẾN PHẦN NHÌN LẠI BÀI HỌC ›')
      await cdp.waitFor('document.body.innerText.includes("Nhìn lại câu chuyện")')
      assert.equal(await cdp.evaluate('document.activeElement.textContent'), 'Nhìn lại câu chuyện')
      assert.equal(await cdp.evaluate(`localStorage.getItem(${JSON.stringify(key)})`), null)
      assert.equal(await cdp.evaluate('localStorage.getItem("unrelated-owned-account-fixture")'), 'keep')
      assert.equal(await cdp.evaluate('performance.getEntriesByType("resource").some(item=>/supabase|account-access/.test(item.name))'), false)
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('location.hash==="#chapter-1954"')
    } finally { await cdp.browser('Browser.close').catch(() => {}) }
  })
})

test('Chrome integrates Chapter1/1954, all draft entries and lesson6 preview, focus/back and verified original video resume', async () => {
  await withChromePage(findBrowser(), url, async cdp => {
    try {
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-learning]"))')
      assert.match(await cdp.evaluate('document.body.innerText'), /CHƯƠNG 01.*NĂM 1954/s)
      assert.equal(await cdp.evaluate('window.preview1954Safe'), true)
      assert.equal(await cdp.evaluate('performance.getEntriesByType("resource").some(e=>e.name.endsWith("pilot-mobile.mp4"))'), false)
      await cdp.evaluate('localStorage.setItem("unrelated-owned-account-fixture", "keep-exact")')
      await click(cdp, 'preview1954-chapter')
      await cdp.waitFor('document.querySelectorAll("ol button").length === 7 && document.querySelectorAll("ol button:disabled").length === 0')
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
      await cdp.evaluate('document.documentElement.style.fontSize=""; location.hash="#episode-1954-08"')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-start]"))')
      assert.equal(await cdp.evaluate('Boolean(document.querySelector("video"))'), false)
      await click(cdp, 'preview1954-chapter')
      await click(cdp, 'preview.1954.episode01')
      await cdp.waitFor('document.querySelector("video")?.readyState >= 1')
      assert.equal(await cdp.evaluate('document.querySelector("video").videoWidth'), 1080)
      assert.equal(await cdp.evaluate('document.querySelector("video").autoplay'), false)
      assert.equal(await cdp.evaluate('document.querySelectorAll("[data-testid=preview1954-source-notes] a").length'), 3)
      // The historical correction must be readable without opening the source drawer.
      assert.equal(await cdp.evaluate('document.querySelector("[data-testid=preview1954-source-notes] details").open'), false)
      assert.match(await cdp.evaluate('document.querySelector("[data-testid=preview1954-context-note]").innerText'), /diễn đạt quá rộng.*điểm quyết chiến chiến lược của hai bên/s)
      assert.equal(await cdp.evaluate('Boolean(document.querySelector("[data-testid=preview1954-context-note]").compareDocumentPosition(document.querySelector("video")) & Node.DOCUMENT_POSITION_FOLLOWING)'), true)
      for (const [width, height] of [[375,812], [430,932], [844,390]]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true })
        await cdp.evaluate('document.documentElement.style.fontSize="200%"')
        assert.equal(await cdp.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
        assert.equal(await cdp.evaluate('document.querySelector("[data-testid=preview1954-context-note]").getBoundingClientRect().height > 0'), true)
      }
      await cdp.evaluate('document.documentElement.style.fontSize=""; document.querySelector("[data-testid=preview1954-source-notes] summary").focus()')
      assert.equal(await cdp.evaluate('document.activeElement.tagName'), 'SUMMARY')
      await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r', windowsVirtualKeyCode: 13 })
      await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 })
      await cdp.waitFor('document.querySelector("[data-testid=preview1954-source-notes] details").open')
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
      await cdp.waitFor('document.querySelectorAll("ol button").length===7 && document.querySelectorAll("ol button:disabled").length===0')
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
      assert.equal(await cdp.evaluate('Boolean(document.querySelector("[data-testid=preview1954-transcript] summary"))'), true)
      assert.equal(await cdp.evaluate('Array.from(document.querySelectorAll("a")).some(a=>a.getAttribute("href")==="/reference-media/transcript.vi.txt")'), false)
      assert.equal(await cdp.evaluate(`localStorage.getItem(${JSON.stringify(key)})`), null)
      await click(cdp, 'preview1954-back')
      await cdp.waitFor('document.querySelectorAll("ol button").length===7 && document.querySelectorAll("ol button:disabled").length===0')
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
      await cdp.waitFor('location.hash==="#chapter-1954" && document.querySelectorAll("ol button").length===7 && document.querySelectorAll("ol button:disabled").length===0')
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
