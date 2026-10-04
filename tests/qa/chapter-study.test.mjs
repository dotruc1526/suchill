import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { verifiedPackage } from '../../scripts/release/build-hosting-preview.mjs'
import { previewHashes } from '../../src/services/reference1954/catalog.ts'
import { findBrowser, withChromePage } from './chromeHarness.mjs'

const root = resolve(import.meta.dirname, '../..')
const { metadata } = await verifiedPackage(resolve(root, 'docs/content/preview1954-v1'))
const server = await createServer({ root, configFile: false, envDir: false,
  resolve: { alias: { '@': resolve(root, 'src') } }, plugins: [react(), tailwindcss()],
  cacheDir: 'node_modules/.vite-chapter-study-qa', optimizeDeps: { entries: ['tests/qa/fixtures/preview1954.html'] },
  define: { 'import.meta.env.VITE_INTERNAL_1954_PREVIEW': JSON.stringify('true'),
    'import.meta.env.VITE_REFERENCE_1954_METADATA': JSON.stringify(JSON.stringify(metadata)) },
  server: { host: '127.0.0.1', port: 0, hmr: false } })
await server.listen()
after(() => server.close())
const { candidateLessons, lessonOneCandidate, lessonSixCandidate } = await server.ssrLoadModule('/src/services/reference1954/candidateLessons.ts')
const url = `http://127.0.0.1:${server.httpServer.address().port}/tests/qa/fixtures/preview1954.html`

test('seven lessons support reading and checks, corrected native video, retry, keyboard, reflow and reload without rewards', async () => {
  await withChromePage(findBrowser(), url, async cdp => {
    try {
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-chapter]"))')
      await cdp.evaluate('localStorage.setItem("qa-owned-unrelated-state", "keep")')
      const clickId = id => cdp.evaluate(`document.querySelector('[data-testid="${id}"]').click()`)
      await clickId('preview1954-chapter')
      for (const [view, lesson] of Object.entries(candidateLessons)) {
        await clickId(`preview.1954.episode${view.slice(-2)}`)
        await cdp.waitFor('document.querySelectorAll("[data-testid=study-check]").length===3')
        assert.equal(await cdp.evaluate('document.querySelectorAll("[data-testid=study-sections] h2").length'), 3)
        assert.equal(await cdp.evaluate('document.querySelectorAll("[data-testid=study-sections] p").length'), lesson.sections.reduce((sum, section) => sum + section.paragraphs.length, 0))
        assert.match(await cdp.evaluate('document.body.innerText'), /Không tính XP/)
        const first = lesson.checks[0]
        const wrongIndex = first.choices.findIndex(choice => choice.id !== first.answerId)
        const checkRoot = id => `document.getElementById(${JSON.stringify(id)}).closest('[data-testid=study-check]')`
        assert.equal(await cdp.evaluate(`${checkRoot(first.id)}.querySelector(':scope > button').disabled`), true)
        await cdp.evaluate(`${checkRoot(first.id)}.querySelectorAll('[role=group] button')[${wrongIndex}].focus()`)
        await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
        await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 })
        assert.equal(await cdp.evaluate(`${checkRoot(first.id)}.querySelectorAll('[role=group] button')[${wrongIndex}].getAttribute('aria-pressed')`), 'true')
        await cdp.evaluate(`${checkRoot(first.id)}.querySelector(':scope > button').click()`)
        await cdp.waitFor(`${checkRoot(first.id)}.querySelector('[role=status]')!==null`)
        assert.match(await cdp.evaluate(`${checkRoot(first.id)}.querySelector('[role=status]').textContent`), /Cùng đọc lại/)
        assert.equal(await cdp.evaluate('document.activeElement.getAttribute("role")'), 'status')
        await cdp.evaluate(`${checkRoot(first.id)}.querySelector('[role=status] button').click()`)
        assert.equal(await cdp.evaluate(`${checkRoot(first.id)}.querySelectorAll('[role=group] button')[0]===document.activeElement`), true)
        for (const check of lesson.checks) {
          const answerIndex = check.choices.findIndex(choice => choice.id === check.answerId)
          await cdp.evaluate(`${checkRoot(check.id)}.querySelectorAll('[role=group] button')[${answerIndex}].click()`)
          await cdp.evaluate(`${checkRoot(check.id)}.querySelector(':scope > button').click()`)
          await cdp.waitFor(`${checkRoot(check.id)}.querySelector('[role=status]')!==null`)
          assert.ok((await cdp.evaluate(`${checkRoot(check.id)}.querySelector('[role=status]').textContent`)).includes(check.explanation))
          assert.match(await cdp.evaluate(`${checkRoot(check.id)}.querySelector('[role=status]').textContent`), /Đúng rồi/)
        }
        for (const [width, height] of [[375,812],[844,390]]) {
          await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true })
          await cdp.evaluate('document.documentElement.style.fontSize="200%"')
          assert.equal(await cdp.evaluate('document.documentElement.scrollWidth<=innerWidth'), true)
        }
        await cdp.evaluate('document.documentElement.style.fontSize=""')
        await cdp.evaluate(`history.replaceState(null,'',location.pathname+${JSON.stringify(previewHashes[view])})`)
        await cdp('Page.reload')
        await cdp.waitFor('document.querySelectorAll("[data-testid=study-check]").length===3')
        assert.equal(await cdp.evaluate('document.querySelectorAll("[data-testid=study-check] [role=status]").length'), 0)
        await clickId('preview1954-back')
        await cdp.waitFor('location.hash==="#chapter-1954"')
      }
      for (const lesson of [lessonOneCandidate, lessonSixCandidate]) {
        await clickId(lesson.id.replace('.candidate', ''))
        await cdp.waitFor(`document.querySelectorAll('[data-testid=study-check]').length===${lesson.checks.length}`)
        for (const check of lesson.checks) {
          const root = `document.getElementById(${JSON.stringify(check.id)}).closest('[data-testid=study-check]')`
          const answer = check.choices.findIndex(choice => choice.id === check.answerId)
          await cdp.evaluate(`${root}.querySelectorAll('[role=group] button')[${answer}].click()`)
          await cdp.evaluate(`${root}.querySelector(':scope > button').click()`)
          await cdp.waitFor(`${root}.querySelector('[role=status]')?.textContent.includes('Đúng rồi')`)
        }
        if (lesson === lessonOneCandidate) {
          await cdp.evaluate(`Array.from(document.querySelectorAll('button')).find(button=>button.textContent.trim()==='XEM BẢN VIDEO ĐÃ SỬA LỜI DẪN').click()`)
          await cdp.waitFor('document.querySelector("video")?.readyState>=1 && document.querySelector("video").duration>94')
          const transcript = `Array.from(document.querySelectorAll('details')).find(detail=>detail.querySelector('summary')?.textContent==='Đọc bản chép lời')`
          assert.match(await cdp.evaluate(`${transcript}.textContent`), /điểm quyết chiến chiến lược của hai bên/)
          assert.doesNotMatch(await cdp.evaluate(`${transcript}.textContent`), /tâm điểm của cả cuộc chiến/)
          assert.equal(await cdp.evaluate('document.querySelectorAll("video track").length'), 1)
        }
        await clickId('preview1954-back')
        await cdp.waitFor('location.hash==="#chapter-1954"')
      }
      assert.equal(await cdp.evaluate('localStorage.getItem("qa-owned-unrelated-state")'), 'keep')
      const backendRequests = await cdp.evaluate('performance.getEntriesByType("resource").filter(item=>["fetch","xmlhttprequest"].includes(item.initiatorType) && /supabase|account-access|reward|completion/.test(item.name)).map(item=>item.name)')
      assert.deepEqual(backendRequests, [], 'Draft study must not call account or completion/reward APIs; imported source modules are not API calls')
    } finally { await cdp.browser('Browser.close').catch(() => {}) }
  })
})
