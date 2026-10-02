import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { findBrowser, withChromePage } from './chromeHarness.mjs'
const vite = await createServer({ configFile: false, envDir: false, plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  cacheDir: 'node_modules/.vite-lazy-qa', optimizeDeps: { entries: ['tests/qa/fixtures/lazy-feature.html'] },
  server: { host: '127.0.0.1', port: 0, strictPort: false, hmr: false } })
await vite.listen()
after(() => vite.close())
const url = `http://127.0.0.1:${vite.httpServer.address().port}/tests/qa/fixtures/lazy-feature.html`
const click = (cdp, selector) => cdp.evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`)
const condition = offline => ({ offline, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
const pending = '[{"operationId":"owned-stable-id","account":"owned-a","xp":"pending"}]'

test('Chrome defers the feature fetch and preserves child state through ordinary parent renders', async () => {
  await withChromePage(findBrowser(), url, async cdp => {
    assert.equal(await cdp.evaluate('window.lazyQA.attempts()'), 0)
    assert.equal(await cdp.evaluate('performance.getEntriesByType("resource").some(entry=>entry.name.includes("/lazy-screen"))'), false)
    await click(cdp, '#opener')
    await cdp.waitFor('Boolean(document.querySelector("#selected"))')
    await click(cdp, '#selected')
    const attempts = await cdp.evaluate('window.lazyQA.attempts()')
    await click(cdp, '#rerender')
    assert.equal(await cdp.evaluate('window.lazyQA.attempts()'), attempts)
    assert.equal(await cdp.evaluate('document.querySelector("#selected").getAttribute("aria-pressed")'), 'true')
    await click(cdp, '#close-loaded')
    await cdp.waitFor('document.activeElement?.id==="opener"')
    assert.equal(await cdp.evaluate('localStorage.getItem("owned-lazy-pending-proof")'), pending)
  })
})

test('Chrome offline import has readable fallback, safe return focus and explicit retry', async () => {
  await withChromePage(findBrowser(), url, async cdp => {
    await cdp('Network.emulateNetworkConditions', condition(true))
    await click(cdp, '#opener')
    await cdp.waitFor('document.body.innerText.includes("Chưa tải được màn hình")')
    assert.equal(await cdp.evaluate('document.body.innerText.includes("Tiến độ đã lưu vẫn được giữ nguyên")'), true)
    await cdp('Network.emulateNetworkConditions', condition(false))
    await cdp.evaluate('Array.from(document.querySelectorAll("button")).find(button=>button.textContent==="Thử lại").click()')
    await cdp.waitFor('window.lazyQA.attempts()===2 && document.body.innerText.includes("Chưa tải được màn hình")', 'Native module-map failure remains explicit')
    assert.equal(await cdp.evaluate('Array.from(document.querySelectorAll("button")).some(button=>button.textContent==="TẢI LẠI ỨNG DỤNG")'), false)
    await cdp.evaluate('Array.from(document.querySelectorAll("button")).find(button=>button.textContent==="QUAY LẠI").click()')
    await cdp.waitFor('document.activeElement?.id==="opener"')
    await cdp.evaluate('Array.from(document.querySelectorAll("button")).find(button=>button.textContent==="TẢI LẠI ỨNG DỤNG").click()')
    await cdp.waitFor('window.lazyQA?.attempts()===0 && Boolean(document.querySelector("#opener"))', 'Explicit safe document reload')
    assert.equal(await cdp.evaluate('localStorage.getItem("owned-lazy-pending-proof")'), pending)
    await click(cdp, '#opener')
    await cdp.waitFor('Boolean(document.querySelector("#selected"))', 'Fresh document successfully loads recovered feature')
    await click(cdp, '#close-loaded')
    await cdp.waitFor('document.activeElement?.id==="opener"')
    assert.equal(await cdp.evaluate('localStorage.getItem("owned-lazy-pending-proof")'), pending)
  })
})
