// Run: CHROME_PATH="/path/to/chrome" node tests/qa/modal-keyboard.mjs
// Real Chrome keyboard events against the canonical Modal; no app entry changes.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { once } from 'node:events'
import { createServer } from 'vite'

const profile = await mkdtemp(join(tmpdir(), 'suchill-modal-'))
const vite = await createServer({ server: { host: '127.0.0.1', port: 0 } })
let chrome, socket
const results = []
try {
  await vite.listen()
  const port = vite.httpServer.address().port
  chrome = spawn(process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  const endpoint = await new Promise((resolve, reject) => {
    let log = ''
    const timer = setTimeout(() => reject(new Error('Chrome startup timeout')), 15000)
    chrome.once('error', reject)
    chrome.stderr.on('data', chunk => {
      log += chunk
      const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/)
      if (match) { clearTimeout(timer); resolve(match[1]) }
    })
  })
  socket = new WebSocket(endpoint)
  await once(socket, 'open')
  let id = 0
  const pending = new Map()
  socket.addEventListener('message', event => {
    const data = JSON.parse(event.data)
    if (!data.id) return
    const item = pending.get(data.id)
    if (!item) return
    pending.delete(data.id); clearTimeout(item.timer)
    data.error ? item.reject(new Error(JSON.stringify(data.error))) : item.resolve(data.result)
  })
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const callId = ++id
    const timer = setTimeout(() => { pending.delete(callId); reject(new Error(`Timeout: ${method}`)) }, 10000)
    pending.set(callId, { resolve, reject, timer })
    socket.send(JSON.stringify({ id: callId, method, params, sessionId }))
  })
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
  const cdp = (method, params) => send(method, params, sessionId)
  const evaluate = async expression => {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails))
    return result.result.value
  }
  const waitFor = async expression => {
    const deadline = Date.now() + 10000
    while (!await evaluate(expression)) {
      if (Date.now() >= deadline) {
        throw new Error(`Timed out: ${expression}; state=${await evaluate('JSON.stringify({active:document.activeElement?.outerHTML,body:document.body.innerText})')}; passed=${JSON.stringify(results)}`)
      }
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }
  const key = async (name, shift = false) => {
    const code = { Tab: 9, Enter: 13, Escape: 27 }[name]
    for (const type of ['keyDown', 'keyUp']) {
      await cdp('Input.dispatchKeyEvent', { type, key: name, code: name, windowsVirtualKeyCode: code, modifiers: shift ? 8 : 0, ...(name === 'Enter' && type === 'keyDown' ? { text: '\r', unmodifiedText: '\r' } : {}) })
    }
  }
  const focus = async (selector, label) => {
    await waitFor(`document.activeElement?.matches(${JSON.stringify(selector)})`)
    results.push(`${label}: PASS`)
  }
  const version = await send('Browser.getVersion')
  for (const width of [375, 430]) {
    await cdp('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: false })
    await cdp('Page.navigate', { url: `http://127.0.0.1:${port}/tests/qa/fixtures/modal-keyboard.html` })
    await waitFor('!!document.querySelector("#trigger")')
    await key('Tab'); await focus('#trigger', `${width}px keyboard reaches trigger`)
    await key('Enter'); await focus('[aria-label="Đóng"]', `${width}px initial focus`)
    await key('Tab', true); await focus('#last', `${width}px Shift+Tab wraps first to last`)
    await key('Tab'); await focus('[aria-label="Đóng"]', `${width}px Tab wraps last to first`)
    await key('Tab'); await focus('#answer', `${width}px Tab reaches input`)
    await key('Tab'); await focus('#rerender', `${width}px Tab reaches action`)
    await key('Enter'); await waitFor('document.querySelector("#rerender").textContent.includes("1")')
    await focus('#rerender', `${width}px rerender preserves focus`)
    await key('Tab', true); await focus('#answer', `${width}px reverse traversal`)
    await key('Escape'); await waitFor('!document.querySelector("[role=dialog]")')
    await focus('#trigger', `${width}px Escape closes and restores trigger`)
    await key('Enter'); await focus('[aria-label="Đóng"]', `${width}px reopen initial focus`)
    await key('Enter'); await waitFor('!document.querySelector("[role=dialog]")')
    await focus('#trigger', `${width}px close button restores trigger`)
    await key('Enter'); await focus('[aria-label="Đóng"]', `${width}px reopen for final action`)
    await key('Tab', true); await key('Enter')
    await waitFor('!document.querySelector("[role=dialog]")')
    await focus('#trigger', `${width}px final action restores trigger`)
  }
  console.log(JSON.stringify({ browser: version.product, viewportHeight: 900, results }, null, 2))
} finally {
  socket?.close()
  if (chrome && chrome.exitCode === null) { const exited = once(chrome, 'exit'); chrome.kill(); await exited }
  await vite.close()
  await rm(profile, { recursive: true, force: true })
}
