import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { preview } from 'vite'

function findBrowser() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH

  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
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
    const timeout = setTimeout(() => child.kill(), 20000)
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

test('built app renders its home screen in a real local browser', async () => {
  const browser = findBrowser()
  assert.ok(browser, 'Set CHROME_PATH to a local Chromium/Chrome executable for E2E')

  const server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: false } })
  try {
    const address = server.httpServer.address()
    assert.ok(address && typeof address !== 'string')
    const url = `http://127.0.0.1:${address.port}/`
    const html = await dumpDom(browser, url)
    assert.match(html, /XIN CHÀO/)
    assert.match(html, /LUYỆN TẬP/)
  } finally {
    await new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
  }
})
