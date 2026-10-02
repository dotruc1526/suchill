import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import React from 'react'
import { fileURLToPath } from 'node:url'
import { mkdir, writeFile } from 'node:fs/promises'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { findBrowser, withChromePage } from './chromeHarness.mjs'

const vite = await createServer({ configFile: false, envDir: false, plugins: [{name:'owned-hosted-runtime-fixture',enforce:'pre',load(id) {
    if(id.replaceAll('\\','/').endsWith('/src/services/runtime.ts')) return 'export { createLearningRuntime } from "/tests/qa/fixtures/hosted-runtime.ts"'
  }}, react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  cacheDir: 'node_modules/.vite-password-recovery-qa', optimizeDeps: { entries: ['tests/qa/fixtures/password-recovery.html'] },
  server: { host: '127.0.0.1', port: 0, strictPort: false, hmr: false }, appType: 'spa' })
await vite.listen()
after(async () => vite.close())
const origin = `http://127.0.0.1:${vite.httpServer.address().port}`
const fixture = mode => `${origin}/tests/qa/fixtures/password-recovery.html?fixture=${mode}&account=recovery&keep=yes#section=lesson&access_token=synthetic-fixture&refresh_token=synthetic-refresh&type=recovery`
const pending = '[{"operationId":"fixed-owned-operation","payload":"unchanged"}]'
const browser = findBrowser()
const submit = cdp => cdp.evaluate('document.querySelector("form").requestSubmit()')
const type = async (cdp, name, value) => {
  await cdp.evaluate(`document.querySelector('[name="${name}"]').focus()`)
  await cdp('Input.insertText', { text: value })
}
const clickText = (cdp, label) => cdp.evaluate(`Array.from(document.querySelectorAll('button')).find(button => button.textContent === ${JSON.stringify(label)})?.click()`)
const ready = cdp => cdp.waitFor('Boolean(document.querySelector("[name=password]"))')

test('recovery route is only a hint, callback cleanup preserves unrelated navigation', async () => {
  const { isPasswordRecoveryCallback, consumePasswordRecoveryCallbackSecrets, clearPasswordRecoveryCallback,
    hasPasswordRecoveryCallbackSecrets } = await vite.ssrLoadModule('/src/features/auth/recoveryCallback.ts')
  const previous = globalThis.window
  let href = 'https://owned.invalid/lesson/deep?keep=value&account=recovery&code=synthetic-code#section=notes&access_token=synthetic-token&type=recovery'
  globalThis.window = { location: { get href() { return href } }, history: { state: { keep: 1 }, replaceState(_state, _unused, value) { href = new URL(value, href).href } } }
  try {
    assert.equal(isPasswordRecoveryCallback(), true)
    assert.equal(hasPasswordRecoveryCallbackSecrets(), true)
    consumePasswordRecoveryCallbackSecrets()
    assert.equal(href, 'https://owned.invalid/lesson/deep?keep=value&account=recovery#section=notes')
    assert.equal(hasPasswordRecoveryCallbackSecrets(), false)
    clearPasswordRecoveryCallback()
    assert.equal(href, 'https://owned.invalid/lesson/deep?keep=value#section=notes')
    assert.equal(isPasswordRecoveryCallback(), false)
    href = 'https://owned.invalid/?ordinary=yes#plain-navigation'
    clearPasswordRecoveryCallback()
    assert.equal(href, 'https://owned.invalid/?ordinary=yes#plain-navigation')
  } finally {
    if (previous === undefined) delete globalThis.window
    else globalThis.window = previous
  }
})

test('initial recovery view exposes no reset fields or password authority', async () => {
  const { PasswordRecovery } = await vite.ssrLoadModule('/src/features/auth/PasswordRecovery.tsx')
  const html = renderToStaticMarkup(React.createElement(PasswordRecovery, { auth: {}, onDismiss() {} }))
  assert.match(html, /Đang kiểm tra liên kết khôi phục/)
  assert.doesNotMatch(html, /<input/)
  assert.match(html, /role="status"/)
})

test('Chrome rejects missing/expired recovery even with an existing signed-in account', async () => {
  await withChromePage(browser, fixture('missing'), async cdp => {
    await cdp.waitFor('document.body.innerText.includes("không hợp lệ hoặc đã hết hạn")')
    assert.equal(await cdp.evaluate('document.querySelectorAll("input").length'), 0)
    assert.equal(await cdp.evaluate('window.__recoveryQA.calls.length'), 0)
    assert.equal(await cdp.evaluate('location.hash'), '#section=lesson')
    await clickText(cdp, 'QUAY VỀ SỬ CHILL')
    await cdp.waitFor('Boolean(document.querySelector("#dismissed"))')
    assert.equal(await cdp.evaluate('new URL(location.href).searchParams.has("account")'), false)
    assert.equal(await cdp.evaluate('new URL(location.href).searchParams.get("keep")'), 'yes')
    assert.equal(await cdp.evaluate('localStorage.getItem("owned-pending-progress-proof")'), pending)
  })
})

test('Chrome verified recovery validates repeats, focuses errors and safely retries before success at 375/430px', async () => {
  await withChromePage(browser, fixture('valid'), async cdp => {
    await ready(cdp)
    for (const width of [375, 430]) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
      assert.equal(await cdp.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
      assert.equal(await cdp.evaluate('Array.from(document.querySelectorAll("button,input")).every(element=>element.getBoundingClientRect().height>=44)'), true)
    }
    await cdp('Emulation.setDeviceMetricsOverride', { width: 375, height: 900, deviceScaleFactor: 1, mobile: false })
    await cdp.evaluate('document.documentElement.style.fontSize="200%"')
    assert.equal(await cdp.evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
    await cdp.evaluate('document.documentElement.style.fontSize=""')
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
    const capture = await cdp('Page.captureScreenshot', { format: 'png' })
    await mkdir(new URL('../../output', import.meta.url), { recursive: true })
    await writeFile(new URL('../../output/auth-recovery-ui-375.png', import.meta.url), Buffer.from(capture.data, 'base64'))
    for (const type of ['keyDown', 'keyUp']) await cdp('Input.dispatchKeyEvent', { type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    assert.equal(await cdp.evaluate('document.activeElement?.getAttribute("name")'), 'password')
    assert.equal(await cdp.evaluate('Array.from(document.querySelectorAll("input")).every(input=>input.autocomplete==="new-password" && input.minLength===8 && input.maxLength===128)'), true)
    await type(cdp, 'password', 'OwnedPasswordOne')
    await type(cdp, 'passwordConfirm', 'DifferentPassword')
    await submit(cdp)
    await cdp.waitFor('document.body.innerText.includes("Hai mật khẩu chưa khớp")')
    assert.equal(await cdp.evaluate('document.activeElement?.getAttribute("role")'), 'alert')
    assert.equal(await cdp.evaluate('document.querySelector("[name=passwordConfirm]").getAttribute("aria-invalid")'), 'true')
    assert.equal(await cdp.evaluate('window.__recoveryQA.calls.length'), 0)
    await cdp.evaluate('document.querySelector("[name=passwordConfirm]").focus(); document.querySelector("[name=passwordConfirm]").select()')
    await cdp('Input.insertText', { text: 'OwnedPasswordOne' })
    await clickText(cdp, 'HIỆN')
    assert.equal(await cdp.evaluate('document.querySelector("[name=password]").type'), 'text')
    await cdp.evaluate('window.__recoveryQA.setResetResult("offline")')
    await submit(cdp)
    await cdp.waitFor('document.body.innerText.includes("Chưa thể cập nhật mật khẩu")')
    assert.equal(await cdp.evaluate('document.activeElement?.getAttribute("role")'), 'alert')
    await cdp.evaluate('window.__recoveryQA.setResetResult("success"); window.__recoveryQA.hold()')
    await submit(cdp)
    await cdp.waitFor('document.querySelector("form")?.getAttribute("aria-busy")==="true"')
    await submit(cdp)
    assert.equal(await cdp.evaluate('window.__recoveryQA.calls.length'), 2)
    assert.equal(await cdp.evaluate('Array.from(document.querySelectorAll("input,button")).every(element=>element.disabled)'), true)
    await cdp.evaluate('window.__recoveryQA.resolve()')
    await cdp.waitFor('document.body.innerText.includes("Đã đổi mật khẩu thành công")')
    assert.equal(await cdp.evaluate('document.querySelectorAll("input").length'), 0)
    assert.deepEqual(await cdp.evaluate('window.__recoveryQA.calls'), ['owned-fixture-a', 'owned-fixture-a'])
    assert.equal(await cdp.evaluate('localStorage.getItem("owned-pending-progress-proof")'), pending)
    await clickText(cdp, 'TIẾP TỤC HỌC')
    await cdp.waitFor('Boolean(document.querySelector("#dismissed"))')
  })
})

test('Chrome transient initialization preserves callback for reload while granted verification can retry', async () => {
  await withChromePage(browser, fixture('offline'), async cdp => {
    await cdp.waitFor('document.body.innerText.includes("Chưa thể kết nối")')
    assert.equal(await cdp.evaluate('location.hash.includes("access_token=")'), true)
    assert.equal(await cdp.evaluate('document.querySelectorAll("input").length'), 0)
    assert.equal(await cdp.evaluate('Array.from(document.querySelectorAll("button")).some(button=>button.textContent==="TẢI LẠI LIÊN KẾT")'), true)
    await cdp.evaluate('window.__recoveryQA.setOutcome("valid")')
    await clickText(cdp, 'THỬ LẠI')
    await ready(cdp)
    assert.equal(await cdp.evaluate('location.hash'), '#section=lesson')
    await cdp.evaluate('window.__recoveryQA.setOutcome("server_error"); window.__recoveryQA.grantRecovery("owned-fixture-a"); window.__recoveryQA.setOutcome("server_error")')
    await cdp.waitFor('document.body.innerText.includes("Chưa thể kết nối")')
    assert.equal(await cdp.evaluate('document.querySelectorAll("input").length'), 0)
    assert.equal(await cdp.evaluate('location.hash'), '#section=lesson')
    await cdp.evaluate('window.__recoveryQA.setOutcome("valid")')
    await clickText(cdp, 'THỬ LẠI')
    await ready(cdp)
  })
})

test('Chrome account switches including A→B→A discard fields and stale mutation results', async () => {
  await withChromePage(browser, fixture('valid'), async cdp => {
    await ready(cdp)
    await type(cdp, 'password', 'OwnedPasswordOne')
    await type(cdp, 'passwordConfirm', 'OwnedPasswordOne')
    await cdp.evaluate('window.__recoveryQA.hold()')
    await submit(cdp)
    await cdp.waitFor('window.__recoveryQA.calls.length===1')
    await cdp.evaluate('window.__recoveryQA.changeAccount("owned-fixture-b"); window.__recoveryQA.changeAccount("owned-fixture-a"); window.__recoveryQA.resolve()')
    await cdp.waitFor('document.body.innerText.includes("không hợp lệ hoặc đã hết hạn")')
    assert.equal(await cdp.evaluate('document.querySelectorAll("input").length'), 0)
    assert.equal(await cdp.evaluate('document.body.innerText.includes("Đã đổi mật khẩu thành công")'), false)
    await cdp.evaluate('window.__recoveryQA.grantRecovery("owned-fixture-a")')
    await ready(cdp)
    assert.equal(await cdp.evaluate('Array.from(document.querySelectorAll("input")).every(input=>input.value==="")'), true)
    await type(cdp, 'password', 'OwnedPasswordTwo')
    await type(cdp, 'passwordConfirm', 'OwnedPasswordTwo')
    await cdp.evaluate('window.__recoveryQA.hold()')
    await submit(cdp)
    await cdp.waitFor('window.__recoveryQA.calls.length===2')
    await cdp.evaluate('window.__recoveryQA.unmount()')
    await cdp.waitFor('window.__recoveryQA.listeners()===0')
    await cdp.evaluate('window.__recoveryQA.resolve()')
    assert.equal(await cdp.evaluate('document.querySelectorAll("input").length'), 0)
    assert.equal(await cdp.evaluate('localStorage.getItem("owned-pending-progress-proof")'), pending)
  })
})

test('actual HostedApp StrictMode and remount reuse the callback-consuming runtime before learning or sync',async()=>{
  await withChromePage(browser,origin+'/tests/qa/fixtures/hosted-recovery.html?account=recovery&code=owned-one-time-code',async cdp=>{
    await ready(cdp)
    assert.equal(await cdp.evaluate('window.hostedQA.created()'),1)
    assert.equal(await cdp.evaluate('Boolean(document.querySelector("#learning-runtime-mounted"))'),false)
    assert.equal(await cdp.evaluate('localStorage.getItem("owned-hosted-pending")'),'[{"operationId":"owned-hosted-stable"}]')
    await cdp.evaluate('document.querySelector("#remount").click()')
    await ready(cdp)
    assert.equal(await cdp.evaluate('window.hostedQA.created()'),1)
    assert.equal(await cdp.evaluate('Boolean(document.querySelector("#learning-runtime-mounted"))'),false)
    assert.equal(await cdp.evaluate('document.querySelectorAll("#main-content").length'),1)
    assert.equal(await cdp.evaluate('location.search.includes("code=")'),false)
  })
})
