import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { once } from 'node:events'
import { join } from 'node:path'
import { test } from 'node:test'
import { createServer, preview } from 'vite'

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

test('built app renders its home screen in a real local browser', async () => {
  const browser = findBrowser()
  assert.ok(browser, 'Set CHROME_PATH to a local Chromium/Chrome executable for E2E')

  const server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: false } })
  try {
    const address = server.httpServer.address()
    assert.ok(address && typeof address !== 'string')
    const url = `http://127.0.0.1:${address.port}/`
    const html = await dumpDom(browser, url)
    assert.match(html, /HÀNH TRÌNH LỊCH SỬ/)
    assert.match(html, /LUYỆN TẬP/)
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
  }
})

test('learning journey stays usable and uncut at mobile widths', async () => {
  const browser = findBrowser()
  assert.ok(browser, 'Set CHROME_PATH to a local Chromium/Chrome executable for E2E')

  const server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: false } })
  try {
    const address = server.httpServer.address()
    assert.ok(address && typeof address !== 'string')
    const url = `http://127.0.0.1:${address.port}/`
    await withChromePage(browser, url, async cdp => {
      for (const [width, height] of [[375, 812], [430, 932]]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
        await cdp('Page.reload', { ignoreCache: true })
        let metrics
        for (let attempt = 0; attempt < 100; attempt += 1) {
          const response = await cdp('Runtime.evaluate', {
            expression: `(() => {
              const journey = document.querySelector('[data-testid="learning-journey"]')
              const card = document.querySelector('[data-testid="journey-chapter-card"]')
              const title = document.querySelector('[data-testid="journey-title"]')
              const button = document.querySelector('[data-testid^="journey-open-chapter-"]')
              if (!journey || !card || !title || !button) return null
              const cardRect = card.getBoundingClientRect()
              const buttonRect = button.getBoundingClientRect()
              return {
                viewport: innerWidth,
                documentWidth: document.documentElement.scrollWidth,
                cardLeft: cardRect.left,
                cardRight: cardRect.right,
                buttonHeight: buttonRect.height,
                title: title.textContent,
              }
            })()`,
            returnByValue: true,
          })
          metrics = response.result.value
          if (metrics) break
          await new Promise(resolve => setTimeout(resolve, 50))
        }
        assert.ok(metrics, `${width}px journey elements mounted`)
        assert.equal(metrics.viewport, width)
        assert.equal(metrics.documentWidth, width, `${width}px document has no horizontal overflow`)
        assert.equal(metrics.title, 'HÀNH TRÌNH LỊCH SỬ')
        assert.ok(metrics.cardLeft >= 0 && metrics.cardRight <= width, `${width}px chapter card stays within viewport`)
        assert.ok(metrics.buttonHeight >= 44, `${width}px primary action keeps a 44px touch target`)

        if (process.env.UPDATE_M1_08_EVIDENCE === '1') {
          const screenshot = await cdp('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
          const path = new URL(`../../docs/tasks/active/M1-08-${width}.png`, import.meta.url)
          await writeFile(path, screenshot.data, 'base64')
        }
      }
    })
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
  }
})

test('learning journey moves focus on forward and back navigation', async () => {
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

      await waitFor("Boolean(document.querySelector('[data-testid^=\"journey-open-chapter-\"]'))", 'chapter trigger')
      await evaluate("document.querySelector('[data-testid^=\"journey-open-chapter-\"]').click()")
      await waitFor("document.activeElement?.id === 'chapter-heading'", 'chapter heading')

      await evaluate("document.querySelector('[data-testid^=\"journey-open-lesson-\"]').click()")
      await waitFor("document.activeElement?.id === 'lesson-entry-heading'", 'lesson heading')

      await evaluate("document.querySelector('[data-testid=\"journey-lesson-back\"]').click()")
      await waitFor("document.activeElement?.dataset.testid?.startsWith('journey-open-lesson-')", 'lesson trigger')

      await evaluate("document.querySelector('[data-testid=\"journey-chapter-back\"]').click()")
      await waitFor("document.activeElement?.dataset.testid?.startsWith('journey-open-chapter-')", 'chapter trigger')
    })
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
  }
})

test('Visual Novel close and completion restore focus to the opener', async () => {
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
        assert.fail(`Timed out waiting for ${label}`)
      }

      await waitFor("Boolean(document.querySelector('[data-testid^=\"journey-open-chapter-\"]'))", 'chapter trigger')
      await evaluate("document.querySelector('[data-testid^=\"journey-open-chapter-\"]').click()")
      await waitFor("document.querySelectorAll('[data-testid^=\"journey-open-lesson-\"]').length === 2", 'fixture lessons')
      await evaluate("document.querySelectorAll('[data-testid^=\"journey-open-lesson-\"]')[1].click()")
      await waitFor("Boolean(document.querySelector('[data-testid^=\"open-vn-\"]'))", 'Visual Novel opener')
      await evaluate("document.querySelector('[data-testid^=\"open-vn-\"]').click()")
      await waitFor("Boolean(document.querySelector('[data-testid=\"visual-novel-v2\"]'))", 'Visual Novel player')
      await evaluate("[...document.querySelectorAll('button')].find(button => button.textContent === 'ĐÓNG').click()")
      await waitFor("document.activeElement?.dataset.testid?.startsWith('open-vn-')", 'focus restored to opener')
      await evaluate("document.activeElement.click()")
      await waitFor("Boolean(document.querySelector('[data-testid=\"visual-novel-v2\"]'))", 'Visual Novel reopened')
      await evaluate("[...document.querySelectorAll('[data-testid=\"visual-novel-v2\"] button')].find(button => button.textContent === 'TIẾP TỤC').click()")
      await waitFor("Boolean([...document.querySelectorAll('[data-testid=\"visual-novel-v2\"] button')].find(button => button.textContent === 'HOÀN TẤT PHẦN TRÌNH BÀY'))", 'end scene')
      await evaluate("[...document.querySelectorAll('[data-testid=\"visual-novel-v2\"] button')].find(button => button.textContent === 'HOÀN TẤT PHẦN TRÌNH BÀY').click()")
      await waitFor("document.activeElement?.dataset.testid?.startsWith('open-vn-')", 'focus restored after completion')
    })
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
  }
})

test('Visual Novel remains keyboard operable and within 375px/430px mobile viewports', async () => {
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
        assert.fail(`Timed out waiting for ${label}`)
      }
      const pressEnter = async () => {
        await cdp('Input.dispatchKeyEvent', {
          type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r',
          windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13,
        })
        await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 })
      }

      await cdp('Page.bringToFront')
      for (const [width, height] of [[375, 812], [430, 932]]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
        await cdp('Page.reload', { ignoreCache: true })
        await waitFor("Boolean(document.querySelector('[data-testid^=\"journey-open-chapter-\"]'))", `${width}px chapter`)
        await evaluate("document.querySelector('[data-testid^=\"journey-open-chapter-\"]').click()")
        await waitFor("document.querySelectorAll('[data-testid^=\"journey-open-lesson-\"]').length === 2", `${width}px lessons`)
        await evaluate("document.querySelectorAll('[data-testid^=\"journey-open-lesson-\"]')[1].click()")
        await waitFor("Boolean(document.querySelector('[data-testid^=\"open-vn-\"]'))", `${width}px VN opener`)
        await evaluate("document.querySelector('[data-testid^=\"open-vn-\"]').focus()")
        await pressEnter()
        await waitFor("document.activeElement?.id === 'vn-player-heading'", `${width}px VN heading focus`)

        const metrics = (await evaluate(`(() => {
          const player = document.querySelector('[data-testid="visual-novel-v2"]')
          const close = [...player.querySelectorAll('button')].find(button => button.textContent === 'ĐÓNG')
          const rect = close.getBoundingClientRect()
          return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
            buttonHeight: rect.height, buttonWidth: rect.width, buttonLeft: rect.left, buttonRight: rect.right }
        })()`)).result.value
        assert.equal(metrics.viewport, width)
        assert.equal(metrics.documentWidth, width, `${width}px VN does not overflow horizontally`)
        assert.ok(metrics.buttonHeight >= 44 && metrics.buttonWidth >= 44, `${width}px close target is at least 44px: ${JSON.stringify(metrics)}`)
        assert.ok(metrics.buttonLeft >= 0 && metrics.buttonRight <= width, `${width}px close target remains visible`)

        await evaluate("[...document.querySelectorAll('[data-testid=\"visual-novel-v2\"] button')].find(button => button.textContent === 'ĐÓNG').focus()")
        await pressEnter()
        await waitFor("document.activeElement?.dataset.testid?.startsWith('open-vn-')", `${width}px opener focus restored`)
      }
    })
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
  }
})

test('player mock exposes mobile video fallback and Visual Novel error retry by keyboard', async () => {
  const browser = findBrowser()
  assert.ok(browser, 'Set CHROME_PATH to a local Chromium/Chrome executable for E2E')

  const server = await createServer({ server: { host: '127.0.0.1', port: 0, strictPort: false } })
  await server.listen()
  try {
    const address = server.httpServer.address()
    assert.ok(address && typeof address !== 'string')
    const url = `http://127.0.0.1:${address.port}/tests/qa/fixtures/video-player-mobile.html`
    await withChromePage(browser, url, async cdp => {
      const evaluate = expression => cdp('Runtime.evaluate', { expression, returnByValue: true })
      const waitFor = async (expression, label) => {
        for (let attempt = 0; attempt < 100; attempt += 1) {
          if ((await evaluate(expression)).result.value) return
          await delay(50)
        }
        assert.fail(`Timed out waiting for ${label}`)
      }
      await cdp('Page.bringToFront')

      for (const [width, height] of [[375, 812], [430, 932]]) {
        await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
        await cdp('Page.reload', { ignoreCache: true })
        await waitFor("Boolean(document.querySelector('[data-testid=\"qa-video-valid\"] [data-testid=\"video-player\"]'))", `${width}px video`)
        await waitFor("Boolean(document.querySelector('[data-testid=\"qa-video-missing\"] button'))", `${width}px service error`)
        await waitFor("Boolean(document.querySelector('[data-testid=\"qa-video-valid\"] [aria-label=\"Video không phát được\"]'))", `${width}px media fallback`)

        const metrics = (await evaluate(`(() => {
          const valid = document.querySelector('[data-testid="qa-video-valid"]')
          const missing = document.querySelector('[data-testid="qa-video-missing"]')
          const retry = [...valid.querySelectorAll('button')].find(button => button.textContent === 'THỬ PHÁT LẠI')
          const rect = retry.getBoundingClientRect()
          return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
            fallback: valid.textContent.includes('Video chưa thể phát'), transcript: Boolean(valid.querySelector('a')),
            missingError: missing.textContent.includes('Không thể tải video (not_found)'),
            retryHeight: rect.height, retryWidth: rect.width, retryLeft: rect.left, retryRight: rect.right }
        })()`)).result.value
        assert.equal(metrics.viewport, width)
        assert.equal(metrics.documentWidth, width, `${width}px video page has no horizontal overflow`)
        assert.ok(metrics.fallback && metrics.transcript && metrics.missingError, `${width}px fallback, transcript and load error are visible`)
        assert.ok(metrics.retryHeight >= 44 && metrics.retryWidth >= 44, `${width}px retry target is at least 44px`)
        assert.ok(metrics.retryLeft >= 0 && metrics.retryRight <= width, `${width}px retry remains visible`)

        await evaluate("document.querySelector('[data-testid=\"qa-video-missing\"] button').focus()")
        await cdp('Input.dispatchKeyEvent', {
          type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r',
          windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13,
        })
        await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 })
        await waitFor("document.querySelector('[data-testid=\"qa-video-missing\"]')?.textContent.includes('Không thể tải video (not_found)')", `${width}px retry error recovery`)

        await waitFor("document.querySelector('[data-testid=\"qa-vn-retry\"]')?.textContent.includes('Không thể tải Visual Novel (offline)')", `${width}px VN load error`)
        await evaluate("[...document.querySelectorAll('[data-testid=\"qa-vn-retry\"] button')].find(button => button.textContent === 'Thử lại').focus()")
        await cdp('Input.dispatchKeyEvent', {
          type: 'keyDown', key: 'Enter', code: 'Enter', text: '\r', unmodifiedText: '\r',
          windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13,
        })
        await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, nativeVirtualKeyCode: 13 })
        await waitFor("document.activeElement?.id === 'vn-player-heading'", `${width}px VN retry focuses player heading`)
      }
    })
  } finally {
    await server.close()
  }
})
