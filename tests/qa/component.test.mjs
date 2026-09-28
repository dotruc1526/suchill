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
  assert.equal((html.match(/<button/g) ?? []).length, 4)
  assert.ok(html.includes('safe-area-inset-bottom'))
  assert.ok(html.includes('aria-current="page"'))
})

test('canonical TopBar renders streak, xp and safe-area header', async () => {
  const { TopBar } = await vite.ssrLoadModule('/src/components/layout/TopBar.tsx')
  const html = renderToStaticMarkup(
    React.createElement(TopBar, { xp: 120, streak: 5, achievements: 3 }),
  )
  assert.ok(html.includes('role="banner"'))
  assert.ok(html.includes('safe-area-inset-top'))
  assert.ok(html.includes('120'))
  assert.ok(html.includes('5'))
  assert.ok(!html.includes('letter-spacing:0.03em') && !html.includes('letterSpacing'))
})

test('UI primitives render with design tokens', async () => {
  const { Badge } = await vite.ssrLoadModule('/src/components/ui/Badge.tsx')
  const { Progress } = await vite.ssrLoadModule('/src/components/ui/Progress.tsx')
  const { IconButton } = await vite.ssrLoadModule('/src/components/ui/IconButton.tsx')
  const { Modal } = await vite.ssrLoadModule('/src/components/ui/Modal.tsx')

  const badgeHtml = renderToStaticMarkup(
    React.createElement(Badge, { variant: 'error' }, 'Sai rồi'),
  )
  assert.ok(badgeHtml.includes('Sai rồi'))

  const progressHtml = renderToStaticMarkup(
    React.createElement(Progress, { value: 75, max: 100 }),
  )
  assert.ok(progressHtml.includes('aria-valuenow="75"'))

  const iconBtnHtml = renderToStaticMarkup(
    React.createElement(IconButton, { ariaLabel: 'Đóng hộp thoại' }, '✕'),
  )
  assert.ok(iconBtnHtml.includes('aria-label="Đóng hộp thoại"'))
  assert.ok(iconBtnHtml.includes('min-w-[44px]') && iconBtnHtml.includes('min-h-[44px]'))

  const modalHtml = renderToStaticMarkup(
    React.createElement(Modal, { isOpen: true, onClose: () => {}, title: 'Thông báo' }, 'Nội dung modal'),
  )
  assert.ok(modalHtml.includes('aria-labelledby="modal-title"'))
  assert.ok(modalHtml.includes('id="modal-title"'))
})

test('Shared states render properly with Vietnamese content', async () => {
  const { LoadingState } = await vite.ssrLoadModule('/src/components/ui/states/LoadingState.tsx')
  const { ErrorState } = await vite.ssrLoadModule('/src/components/ui/states/ErrorState.tsx')
  const { EmptyState } = await vite.ssrLoadModule('/src/components/ui/states/EmptyState.tsx')
  const { OfflineState } = await vite.ssrLoadModule('/src/components/ui/states/OfflineState.tsx')

  const loadingHtml = renderToStaticMarkup(
    React.createElement(LoadingState, { message: 'Đang tải tài liệu lịch sử...' }),
  )
  assert.ok(loadingHtml.includes('Đang tải tài liệu lịch sử...'))

  const errorHtml = renderToStaticMarkup(
    React.createElement(ErrorState, { message: 'Không thể kết nối máy chủ', onRetry: () => {} }),
  )
  assert.ok(errorHtml.includes('Không thể kết nối máy chủ'))
  assert.ok(errorHtml.includes('Thử lại'))

  const emptyHtml = renderToStaticMarkup(
    React.createElement(EmptyState, { title: 'Chưa có huy hiệu nào' }),
  )
  assert.ok(emptyHtml.includes('Chưa có huy hiệu nào'))

  const offlineHtml = renderToStaticMarkup(
    React.createElement(OfflineState, null),
  )
  assert.ok(offlineHtml.includes('Bạn đang ngoại tuyến'))
})
