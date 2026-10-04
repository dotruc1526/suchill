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

test('lesson six revision preserves the original and distinguishes historical documents from implementation', async () => {
  const { geneva1954Story } = await vite.ssrLoadModule('/src/features/visual-novel/stories/geneva-1954.ts')
  const original = JSON.stringify(geneva1954Story)
  const { lessonSixStory } = await vite.ssrLoadModule('/src/services/reference1954/lessonSixStory.ts')
  assert.equal(JSON.stringify(geneva1954Story), original)
  assert.equal(geneva1954Story.id, 'geneva-1954')
  assert.equal(lessonSixStory.id, 'preview.geneva1954.source-corrected-v2')
  assert.deepEqual(lessonSixStory.scenes.map(scene => scene.id), geneva1954Story.scenes.map(scene => scene.id))
  assert.ok(lessonSixStory.scenes.every(scene => !scene.image))
  assert.ok(geneva1954Story.scenes.some(scene => scene.image))
  const summary = lessonSixStory.scenes.find(scene => scene.id === 'summary').choices.find(choice => choice.correct).note
  assert.match(summary, /Việt Nam đề ngày 20\/7/)
  assert.match(summary, /Tuyên bố cuối cùng.*21\/7\/1954/)
  const dawn = lessonSixStory.scenes.find(scene => scene.id === 'dawn').text
  assert.match(dawn, /dự kiến tổng tuyển cử tháng 7\/1956/)
  assert.doesNotMatch(dawn, /Hòa bình được lập lại|đã không trở thành hiện thực/)
  assert.ok(!JSON.stringify(lessonSixStory).includes('nhận me'))
})

test('draft learning excerpts separate campaign phases, capture and later regrouping', async () => {
  const { draftLessons } = await vite.ssrLoadModule('/src/services/reference1954/draftLessons.ts')
  const text = key => draftLessons[key].points.join(' ')
  assert.match(text('draft04'), /bắt đầu ngày 1\/5.*ngày 7\/5 diễn ra cuộc tổng công kích/)
  assert.match(text('draft05'), /phân khu Nam còn tiếp diễn trong đêm/)
  assert.match(text('draft05'), /13\/3 đến ngày 7\/5\/1954/)
  assert.doesNotMatch(text('draft05'), /sau 56 ngày/)
  assert.match(text('draft07'), /hai bên chuyển quân về các khu tập kết/)
  assert.doesNotMatch(text('draft07'), /rút dần khỏi Đông Dương/)
})
