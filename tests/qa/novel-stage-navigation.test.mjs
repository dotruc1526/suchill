import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import { findBrowser, withChromePage } from './chromeHarness.mjs'

const root = resolve(import.meta.dirname, '../..')
const server = await createServer({ root, configFile: false, envDir: false,
  plugins: [react()], optimizeDeps: { entries: ['tests/qa/fixtures/novel-stage-navigation.html'] },
  server: { host: '127.0.0.1', port: 0, hmr: false } })
await server.listen()
after(() => server.close())

test('intermediate scene without choices advances; final scene alone completes without reward writes', async () => {
  const url = `http://127.0.0.1:${server.httpServer.address().port}/tests/qa/fixtures/novel-stage-navigation.html`
  await withChromePage(findBrowser(), url, async cdp => {
    try {
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=preview1954-novel-stage]"))')
      await cdp.evaluate('localStorage.setItem("qa-unrelated-progress", "keep")')
      assert.equal(await cdp.evaluate('document.querySelector("h3").textContent'), 'Cảnh đầu')
      const clickText = text => cdp.evaluate(`Array.from(document.querySelectorAll('button')).find(button=>button.textContent.trim()===${JSON.stringify(text)}).click()`)
      await clickText('TIẾP TỤC ›')
      await cdp.waitFor('document.querySelector("h3").textContent === "Cảnh cuối"')
      assert.equal(await cdp.evaluate('document.querySelector("output").textContent'), '0')
      assert.equal(await cdp.evaluate('document.activeElement.textContent'), 'Cảnh cuối')
      await clickText('ĐẾN PHẦN NHÌN LẠI BÀI HỌC ›')
      await cdp.waitFor('document.querySelector("output").textContent === "1"')
      assert.equal(await cdp.evaluate('localStorage.getItem("qa-unrelated-progress")'), 'keep')
      assert.equal(await cdp.evaluate('performance.getEntriesByType("resource").some(item=>/supabase|account-access|completion|reward/.test(item.name))'), false)
    } finally { await cdp.browser('Browser.close').catch(() => {}) }
  })
})
