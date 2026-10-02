import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import { once } from 'node:events'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'

const delay = milliseconds => new Promise(resolveDelay => setTimeout(resolveDelay, milliseconds))
export function findBrowser() {
  return [process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  ].find(path => path && existsSync(path))
}
async function terminateChild(child) {
  if (child.exitCode !== null || child.signalCode !== null) return
  const exited = once(child, 'exit').then(() => true)
  child.kill()
  if (!await Promise.race([exited, delay(3000).then(() => false)])) {
    child.kill('SIGKILL')
    await Promise.race([exited, delay(3000)])
  }
}

/** A fresh, owned temporary Chrome profile; never attaches to a user's browser. */
export async function withChromePage(browser, url, run, { mountedSelector = '#root' } = {}) {
  assert.ok(browser, 'Set CHROME_PATH to a local Chromium/Chrome executable for browser QA')
  const temporaryRoot = resolve(tmpdir())
  const profile = await mkdtemp(join(temporaryRoot, 'suchill-isolated-qa-'))
  assert.ok(resolve(profile).startsWith(temporaryRoot + sep), 'Owned Chrome profile must remain in the temporary directory')
  const chrome = spawn(browser, [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  let socket
  const pending = new Map()
  try {
    const endpoint = await new Promise((resolveEndpoint, reject) => {
      let output = ''
      const timer = setTimeout(() => reject(new Error('Chrome startup timeout')), 20000)
      chrome.once('error', error => { clearTimeout(timer); reject(error) })
      chrome.stderr.on('data', chunk => {
        output += chunk
        const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/)
        if (match) { clearTimeout(timer); resolveEndpoint(match[1]) }
      })
    })
    socket = new WebSocket(endpoint)
    await once(socket, 'open')
    let id = 0
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data)
      const request = pending.get(message.id)
      if (!request) return
      pending.delete(message.id); clearTimeout(request.timer)
      message.error ? request.reject(new Error(JSON.stringify(message.error))) : request.resolve(message.result)
    })
    const send = (method, params = {}, sessionId) => new Promise((resolveRequest, reject) => {
      const requestId = ++id
      const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`Chrome timeout: ${method}`)) }, 15000)
      pending.set(requestId, { resolve: resolveRequest, reject, timer })
      socket.send(JSON.stringify({ id: requestId, method, params, sessionId }))
    })
    const attach = async (targetId, initialUrl) => {
      const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true })
      const raw = (method, params) => send(method, params, sessionId)
      await raw('Page.enable')
      await raw('Network.enable')
      await raw('Network.setBlockedURLs', { urls: ['*://fonts.googleapis.com/*', '*://fonts.gstatic.com/*'] })
      const evaluate = async expression => {
        const result = await raw('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
        assert.ok(!result.exceptionDetails, 'Browser fixture evaluation failed')
        return result.result?.value
      }
      const waitFor = async (expression, label = 'Browser fixture readiness') => {
        const deadline = Date.now() + 20000
        while (Date.now() < deadline) {
          try { if (await evaluate(expression)) return }
          catch (error) { if (!/context.*destroyed|Cannot find context/i.test(error.message)) throw error }
          await delay(50)
        }
        assert.fail(`${label} timed out`)
      }
      const mounted = async (matchesLoader, requestedUrl) => {
        const requested = new URL(requestedUrl)
        const deadline = Date.now() + 20000
        while (Date.now() < deadline) {
          const { frameTree } = await raw('Page.getFrameTree')
          if (matchesLoader(frameTree.frame.loaderId)) {
            try {
              const ready = await evaluate(`document.readyState !== 'loading' && location.origin === ${JSON.stringify(requested.origin)} && location.pathname === ${JSON.stringify(requested.pathname)} && Boolean(document.querySelector(${JSON.stringify(mountedSelector)})?.children.length)`)
              if (ready) return
            } catch (error) { if (!/context.*destroyed|Cannot find context/i.test(error.message)) throw error }
          }
          await delay(50)
        }
        assert.fail('Chrome did not mount the requested document')
      }
      const command = async (method, params = {}) => {
        if (method === 'Page.navigate') {
          const { frameTree: previous } = await raw('Page.getFrameTree')
          const navigation = await raw(method, params)
          assert.ok(!navigation.errorText, 'Chrome fixture navigation failed')
          // Vite can reload once after dependency optimization; reject the old document, accept the final requested path.
          await mounted(loader => loader !== previous.frame.loaderId, params.url)
          return navigation
        }
        if (method === 'Page.reload') {
          const { frameTree } = await raw('Page.getFrameTree')
          const previousLoader = frameTree.frame.loaderId
          const result = await raw(method, params)
          await mounted(loader => loader !== previousLoader, frameTree.frame.url)
          return result
        }
        return raw(method, params)
      }
      command.evaluate = evaluate
      command.waitFor = waitFor
      command.raw = raw
      command.browser = send
      command.targetId = targetId
      command.close = () => send('Target.closeTarget', { targetId })
      command.attachTarget = target => attach(target)
      command.newPage = async nextUrl => {
        const { targetId: nextTarget } = await send('Target.createTarget', { url: 'about:blank' })
        return attach(nextTarget, nextUrl)
      }
      if (initialUrl) await command('Page.navigate', { url: initialUrl })
      return command
    }
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' })
    const command = await attach(targetId, url)
    return await run(command)
  } finally {
    socket?.close()
    for (const request of pending.values()) clearTimeout(request.timer)
    await terminateChild(chrome)
    assert.ok(resolve(profile).startsWith(temporaryRoot + sep), 'Only the owned temporary Chrome profile may be removed')
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
  }
}
