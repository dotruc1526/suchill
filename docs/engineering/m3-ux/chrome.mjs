import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, sep, basename } from 'node:path'
import { once } from 'node:events'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
export async function withChrome(url, run) {
  const browser = [process.env.CHROME_PATH, 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find(existsSync)
  if (!browser) throw new Error('Set CHROME_PATH to an installed Chromium browser')
  const profile = await mkdtemp(join(tmpdir(), 'suchill-m3-ux-'))
  const child = spawn(browser, ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, url], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] })
  let socket
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let log = ''
      const timer = setTimeout(() => reject(new Error('Chrome startup timeout')), 15000)
      child.once('error', error => { clearTimeout(timer); reject(error) })
      child.stderr.on('data', chunk => {
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
      const message = JSON.parse(event.data), request = pending.get(message.id)
      if (!request) return
      pending.delete(message.id); clearTimeout(request.timer)
      message.error ? request.reject(new Error(JSON.stringify(message.error))) : request.resolve(message.result)
    })
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const requestId = ++id
      const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timeout: ${method}`)) }, 10000)
      pending.set(requestId, { resolve, reject, timer })
      socket.send(JSON.stringify({ id: requestId, method, params, sessionId }))
    })
    let target
    for (let i = 0; i < 100; i++) {
      target = (await send('Target.getTargets')).targetInfos.find(t => t.type === 'page')
      if (target) break
      await delay(50)
    }
    if (!target) throw new Error('No page target')
    const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true })
    await run((method, params) => send(method, params, sessionId))
  } finally {
    socket?.close()
    if (child.exitCode === null) {
      if (process.platform === 'win32') {
        const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' })
        await Promise.race([once(killer, 'exit'), delay(3000)])
      } else child.kill('SIGKILL')
      await Promise.race([once(child, 'exit'), delay(3000)])
    }
    const target = resolve(profile), temporaryRoot = resolve(tmpdir()) + sep
    if (!target.startsWith(temporaryRoot) || !basename(target).startsWith('suchill-m3-ux-')) throw new Error('Unsafe temporary cleanup path')
    await rm(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
  }
}
