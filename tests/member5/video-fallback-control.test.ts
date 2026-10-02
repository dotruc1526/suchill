import { after, test } from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import type { LearningServices, Result } from '../../src/services/next/contracts.ts'

const vite = await createServer({ configFile: false, envDir: false, resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } }, optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false }, appType: 'custom' })
after(() => vite.close())
const { createVideoFallbackOperations, VideoFallbackActions, VideoFallbackControl } =
  await vite.ssrLoadModule('/src/features/learning/completion/VideoFallbackControl.tsx')
type Action = Parameters<LearningServices['completion']['recordBlockAction']>[0]
const servicesFor = (recordBlockAction: LearningServices['completion']['recordBlockAction']) =>
  ({ completion: { recordBlockAction } } as LearningServices)
const renderState = (state: object) => renderToStaticMarkup(React.createElement(VideoFallbackActions, {
  blockId: 'video', method: 'accessible_fallback', state, onMethod: () => {}, onSubmit: () => {},
}))

test('fallback action retries retain their identity across offline, policy rejection and selection changes', async () => {
  const calls: Action[] = []
  let next = 0
  const operations = createVideoFallbackOperations(servicesFor(async input => {
    calls.push(input)
    if (calls.length === 1) return { ok: false, error: 'offline' }
    if (calls.length === 2) return { ok: false, error: 'validation' }
    return { ok: true, value: null }
  }), 'lesson', 'video', () => `fallback-${++next}`)
  assert.equal(calls.length, 0, 'Choosing a method must not send a request')
  assert.deepEqual(await operations.accessible_fallback.run(), { ok: false, error: 'offline' })
  assert.deepEqual(await operations.media_fallback.run(), { ok: false, error: 'validation' })
  assert.deepEqual(await operations.accessible_fallback.run(), { ok: true, value: null })
  assert.deepEqual(calls, [
    { lessonId: 'lesson', blockId: 'video', action: 'accessible_fallback', operationId: 'fallback-1' },
    { lessonId: 'lesson', blockId: 'video', action: 'media_fallback', operationId: 'fallback-2' },
    { lessonId: 'lesson', blockId: 'video', action: 'accessible_fallback', operationId: 'fallback-1' },
  ])
  assert.deepEqual(await operations.accessible_fallback.run(), { ok: true, value: null })
  assert.equal(calls.length, 3, 'Confirmed action is not submitted again')
  await operations.media_fallback.run()
  assert.equal(calls[3].operationId, 'fallback-2', 'Rejected method also retains its original intent')
})

test('overlapping fallback confirmation clicks share one pending domain request', async () => {
  let finish!: (result: Result<null>) => void
  let calls = 0
  const operations = createVideoFallbackOperations(servicesFor(() => {
    calls += 1
    return new Promise<Result<null>>(resolve => { finish = resolve })
  }), 'lesson', 'video')
  const first = operations.media_fallback.run()
  const second = operations.media_fallback.run()
  assert.equal(first, second)
  await Promise.resolve()
  assert.equal(calls, 1)
  finish({ ok: false, error: 'validation' })
  assert.deepEqual(await first, { ok: false, error: 'validation' })
})

test('thrown transport errors remain unconfirmed and retry the same fallback identity', async () => {
  const calls: Action[] = []
  const operations = createVideoFallbackOperations(servicesFor(async input => {
    calls.push(input)
    if (calls.length === 1) throw new Error('Simulated transport loss')
    return { ok: false, error: 'unauthorized' }
  }), 'lesson', 'video', () => 'stable-fallback')
  assert.deepEqual(await operations.accessible_fallback.run(), { ok: false, error: 'server_error' })
  assert.deepEqual(await operations.accessible_fallback.run(), { ok: false, error: 'unauthorized' })
  assert.equal(calls[0].operationId, calls[1].operationId)
})

test('initial fallback UI names both routes and requires an explicit confirmation without optimistic rewards', () => {
  let calls = 0
  const html = renderToStaticMarkup(React.createElement(VideoFallbackControl, { lessonId: 'lesson', blockId: 'video',
    services: servicesFor(async () => { calls += 1; return { ok: true, value: null } }),
  }))
  assert.equal(calls, 0)
  assert.match(html, /<label[^>]*>/)
  assert.ok(html.includes('Cách học thay thế cho video'))
  assert.ok(html.includes('value="accessible_fallback"') && html.includes('value="media_fallback"'))
  assert.ok(html.includes('XÁC NHẬN HỌC BẰNG NỘI DUNG THAY THẾ'))
  assert.doesNotMatch(html, /Đã xác nhận|\+[0-9]+ XP|Tổng XP/)
})

test('pending fallback disables method changes and confirmation and announces unconfirmed state', () => {
  const html = renderState({ status: 'submitting' })
  assert.match(html, /<select[^>]*disabled=""/)
  assert.match(html, /<button[^>]*disabled=""/)
  assert.ok(html.includes('aria-busy="true"') && html.includes('role="status"'))
  assert.ok(html.includes('XP và streak chưa được xác nhận'))
  assert.doesNotMatch(html, /Đã xác nhận phần video|\+[0-9]+ XP|Tổng XP/)
})

test('offline and rejected evidence show retry feedback; only service confirmation hides the controls', () => {
  for (const error of ['offline', 'validation']) {
    const html = renderState({ status: 'error', error })
    assert.ok(html.includes('role="alert"') && html.includes('THỬ XÁC NHẬN LẠI'))
    assert.doesNotMatch(html, /<button[^>]*disabled=""|Đã xác nhận phần video|\+[0-9]+ XP/)
  }
  const html = renderState({ status: 'confirmed', receipt: null })
  assert.ok(html.includes('role="status"') && html.includes('Đã xác nhận phần video bằng nội dung thay thế'))
  assert.doesNotMatch(html, /<select|<button|\+[0-9]+ XP|Tổng XP/)
})
