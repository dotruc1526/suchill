import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'

const vite = await createServer({ configFile: false, resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } }, server: { middlewareMode: true, hmr: false }, appType: 'custom' })
after(() => vite.close())

test('lesson completion waits for required blocks without claiming XP', async () => {
  const { LessonCompletionControl } = await vite.ssrLoadModule('/src/features/learning/completion/LessonCompletionControl.tsx')
  const services = { completion: { completeLesson: () => { throw new Error('render must not send completion') } } }
  const html = renderToStaticMarkup(React.createElement(LessonCompletionControl, {
    lessonId: 'lesson', lessonTitle: 'Bài học', services, remainingRequired: 2,
  }))
  assert.ok(html.includes('Còn 2 phần bắt buộc chưa được xác nhận.'))
  assert.match(html, /<button[^>]*disabled=""/)
  assert.doesNotMatch(html, /BÀI HỌC HOÀN THÀNH|\+10 XP|Tổng XP/)
})

test('receipt renders only service-provided XP and streak, with a focusable status', async () => {
  const { LessonCompletionReceipt } = await vite.ssrLoadModule('/src/features/learning/completion/LessonCompletionControl.tsx')
  const receipt = { status: 'confirmed', lessonId: 'lesson', xpGranted: 37, totalXp: 112, currentStreak: 4, alreadyCompleted: false }
  const html = renderToStaticMarkup(React.createElement(LessonCompletionReceipt, { receipt, lessonTitle: 'Bài học' }))
  assert.ok(html.includes('Đã xác nhận +37 XP.'))
  assert.ok(html.includes('Tổng XP: 112 · Streak: 4 ngày'))
  assert.ok(html.includes('tabindex="-1"') && html.includes('role="status"'))
  const replay = renderToStaticMarkup(React.createElement(LessonCompletionReceipt, { receipt: { ...receipt, alreadyCompleted: true }, lessonTitle: 'Bài học' }))
  assert.ok(replay.includes('Không cộng lại thưởng.'))
  assert.doesNotMatch(replay, /\+37 XP/)
})

test('pending and policy failures have text feedback without reward confirmation', async () => {
  const { CompletionFeedback } = await vite.ssrLoadModule('/src/features/learning/completion/CompletionFeedback.tsx')
  const offline = renderToStaticMarkup(React.createElement(CompletionFeedback, { error: 'offline' }))
  assert.ok(offline.includes('role="alert"') && offline.includes('XP và streak chỉ được ghi nhận sau xác nhận của dịch vụ'))
  const validation = renderToStaticMarkup(React.createElement(CompletionFeedback, { error: 'validation' }))
  assert.ok(validation.includes('Chưa đủ điều kiện hoàn thành'))
  const unauthorized = renderToStaticMarkup(React.createElement(CompletionFeedback, { error: 'unauthorized' }))
  assert.ok(unauthorized.includes('Đăng nhập ở Hồ sơ'))
})

test('previously confirmed block renders read-only confirmation without sending a request', async () => {
  const { BlockCompletionControl } = await vite.ssrLoadModule('/src/features/learning/completion/BlockCompletionControl.tsx')
  const html = renderToStaticMarkup(React.createElement(BlockCompletionControl, {
    lessonId: 'lesson', block: { id: 'text', kind: 'text', required: true, order: 0, documentId: 'doc' },
    services: { completion: { completeBlock: () => { throw new Error('render cannot complete a block') } } }, completed: true, onConfirmed: () => {},
  }))
  assert.ok(html.includes('Phần học đã được xác nhận'))
  assert.doesNotMatch(html, /<button/)
})
