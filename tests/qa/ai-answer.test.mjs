import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'

const vite = await createServer({ configFile: false, resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } }, server: { middlewareMode: true, hmr: false }, appType: 'custom' })
after(() => vite.close())

test('assistant emphasis and paragraphs render without leaking formatting markers', async () => {
  const { AssistantAnswer } = await vite.ssrLoadModule('/src/features/ai-assistant/AssistantAnswer.tsx')
  const html = renderToStaticMarkup(React.createElement(AssistantAnswer, { text: '**Dữ kiện đã biết:** Nội dung.\n\n*Lưu ý:* Đối chiếu tài liệu.' }))
  assert.ok(html.includes('<strong>Dữ kiện đã biết:</strong>'))
  assert.ok(html.includes('<em>Lưu ý:</em>'))
  assert.equal((html.match(/<p /g) ?? []).length, 2)
  assert.ok(!html.includes('**'))
})

test('model HTML and malformed emphasis remain inert text', async () => {
  const { AssistantAnswer } = await vite.ssrLoadModule('/src/features/ai-assistant/AssistantAnswer.tsx')
  const html = renderToStaticMarkup(React.createElement(AssistantAnswer, { text: '<script>alert(1)</script> **chưa đóng' }))
  assert.ok(!html.includes('<script>'))
  assert.ok(html.includes('&lt;script&gt;'))
  assert.ok(html.includes('**chưa đóng'))
})

test('VN demo uses existing scenes with no remote images or reward callback', async () => {
  const { default: PreviewNovel } = await vite.ssrLoadModule('/src/features/learning/preview1954/PreviewNovel.tsx')
  const html = renderToStaticMarkup(React.createElement(PreviewNovel, { onBack: () => {} }))
  assert.ok(html.includes('Kịch bản demo có nhân vật hư cấu'))
  assert.ok(html.includes('Không tính XP'))
  assert.ok(html.includes('GENÈVE'))
  assert.ok(!html.includes('upload.wikimedia.org'))
  assert.ok(html.includes('Ưu tiên chấm dứt chiến sự'))
})
