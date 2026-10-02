import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { once } from 'node:events'
import { join } from 'node:path'
import { test } from 'node:test'
import { preview } from 'vite'

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

async function terminateChild(child, graceMilliseconds = 3_000) {
  if (child.exitCode !== null || child.signalCode !== null) return

  const exited = once(child, 'exit').then(() => true)
  child.kill()
  if (await Promise.race([exited, delay(graceMilliseconds).then(() => false)])) return

  child.kill('SIGKILL')
  await Promise.race([exited, delay(graceMilliseconds)])
}

function findBrowser() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH

  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ]
  const cache = join(homedir(), 'Library/Caches/ms-playwright')
  if (existsSync(cache)) {
    for (const directory of readdirSync(cache).filter(name => name.startsWith('chromium_headless_shell-'))) {
      candidates.push(join(cache, directory, 'chrome-headless-shell-mac-arm64/chrome-headless-shell'))
    }
  }
  return candidates.find(existsSync)
}

function dumpDom(browser, url) {
  return new Promise((resolve, reject) => {
    const child = spawn(browser, [
      '--headless', '--no-sandbox', '--disable-gpu',
      '--virtual-time-budget=3000', '--dump-dom', url,
    ])
    let stdout = ''
    let stderr = ''
    const timeout = setTimeout(() => { void terminateChild(child) }, 20_000)
    child.stdout.setEncoding('utf8').on('data', chunk => { stdout += chunk })
    child.stderr.setEncoding('utf8').on('data', chunk => { stderr += chunk })
    child.on('error', reject)
    child.on('close', code => {
      clearTimeout(timeout)
      if (code !== 0) reject(new Error(`Chromium exited ${code}: ${stderr.slice(-500)}`))
      else resolve(stdout)
    })
  })
}

async function withChromePage(browser, url, run) {
  const profile = await mkdtemp(join(tmpdir(), 'suchill-e2e-'))
  const chrome = spawn(browser, [
    '--headless', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, url,
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  let socket
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let log = ''
      const timer = setTimeout(() => reject(new Error('Chrome startup timeout')), 20_000)
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
      const message = JSON.parse(event.data)
      if (!message.id) return
      const request = pending.get(message.id)
      if (!request) return
      pending.delete(message.id)
      clearTimeout(request.timer)
      message.error ? request.reject(new Error(JSON.stringify(message.error))) : request.resolve(message.result)
    })
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const requestId = ++id
      const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`Chrome command timed out: ${method}`)) }, 15_000)
      pending.set(requestId, { resolve, reject, timer })
      socket.send(JSON.stringify({ id: requestId, method, params, sessionId }))
    })
    let page
    let targetInfos = []
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const targets = await send('Target.getTargets')
      targetInfos = targets.targetInfos
      page = targetInfos.find(target => target.type === 'page' && target.url === url)
        ?? targetInfos.find(target => target.type === 'page')
      if (page) break
      await delay(50)
    }
    assert.ok(page, `Chrome opened a page target: ${JSON.stringify(targetInfos)}`)
    const { sessionId } = await send('Target.attachToTarget', { targetId: page.targetId, flatten: true })
    await run((method, params) => send(method, params, sessionId))
  } finally {
    socket?.close()
    await terminateChild(chrome)
    // Chrome subprocesses can briefly flush profile files after the parent exits.
    // Retry transient ENOTEMPTY/EBUSY errors, but still fail if cleanup never succeeds.
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
  }
}

test('review Home start and resume retain lesson and focus', async () => {
  const browser = findBrowser()
  assert.ok(browser, 'Set CHROME_PATH to a local Chromium/Chrome executable for E2E')

  const server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: false } })
  try {
    const address = server.httpServer.address()
    assert.ok(address && typeof address !== 'string')
    const url = `http://127.0.0.1:${address.port}/`
    await withChromePage(browser, url, async cdp => {
      const evaluate = expression => cdp('Runtime.evaluate', { expression, returnByValue: true })
      const waitFor = async (expression, label) => {
        for (let attempt = 0; attempt < 100; attempt += 1) {
          if ((await evaluate(expression)).result.value) return
          await delay(50)
        }
        assert.fail(`Timed out waiting for focus on ${label}`)
      }

      await waitFor("document.querySelector('[data-testid=journey-continue-lesson]')?.textContent.includes('BẮT ĐẦU HỌC')", 'Home start');
      await evaluate("document.querySelector('[data-testid=journey-continue-lesson]').click()");
      await waitFor("document.activeElement?.id === 'lesson-entry-heading'", 'lesson heading')

      await evaluate("document.querySelector('[data-testid=\"journey-lesson-back\"]').click()")
      await waitFor("document.activeElement?.dataset.testid?.startsWith('journey-open-lesson-')", 'lesson trigger')

      await evaluate("document.querySelector('[data-testid=\"journey-chapter-back\"]').click()")
      await waitFor("document.activeElement?.dataset.testid?.startsWith('journey-open-chapter-')", 'chapter trigger')
      await waitFor("document.querySelector('[data-testid=journey-continue-lesson]')?.textContent.includes('TIẾP TỤC HỌC')", 'Home resume');
      await evaluate("document.querySelector('[data-testid=journey-continue-lesson]').click()");
      await waitFor("document.activeElement?.id === 'lesson-entry-heading'", 'resume heading');
      assert.equal((await evaluate("document.activeElement.textContent")).result.value, 'Bối cảnh tháng 12 năm 1972');
    })
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
  }
})

