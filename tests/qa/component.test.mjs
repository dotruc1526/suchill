import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const vite = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
})

after(async () => vite.close())

test('canonical BottomNav renders all tabs and selected state', async () => {
  const { BottomNav } = await vite.ssrLoadModule('/src/components/layout/BottomNav.tsx')
  const html = renderToStaticMarkup(
    React.createElement(BottomNav, { tab: 'home', onTab: () => {} }),
  )

  for (const label of ['HỌC', 'LUYỆN TẬP', 'AI', 'HỒ SƠ']) {
    assert.ok(html.includes(label), `missing tab: ${label}`)
  }
  assert.match(html, /~~~<\/div>/)
  assert.equal((html.match(/<button/g) ?? []).length, 4)
})
