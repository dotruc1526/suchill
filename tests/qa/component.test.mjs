import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const vite = await createServer({
  configFile: false,
  resolve: { alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) } },
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
})

after(async () => vite.close())

test('document opts into display around device safe areas', async () => {
  const html = await readFile(new URL('../../index.html', import.meta.url), 'utf8')
  assert.match(html, /name="viewport"[^>]*viewport-fit=cover/)
})

test('canonical BottomNav renders all tabs and selected state', async () => {
  const { BottomNav } = await vite.ssrLoadModule('/src/components/layout/BottomNav.tsx')
  const html = renderToStaticMarkup(
    React.createElement(BottomNav, { tab: 'home', onTab: () => {} }),
  )

  for (const label of ['HỌC', 'LUYỆN TẬP', 'AI', 'HỒ SƠ']) {
    assert.ok(html.includes(label), `missing tab: ${label}`)
  }
  assert.equal((html.match(/<button/g) ?? []).length, 4)
  assert.ok(html.includes('max(16px, env(safe-area-inset-bottom))'))
  assert.ok(html.includes('min-height:44px'))
  assert.ok(html.includes('aria-current="page"'))
  assert.equal((html.match(/<svg/g) ?? []).length, 4)
  assert.doesNotMatch(html, /🏠|🧠|🤖|👤/)
})

test('canonical TopBar renders streak, xp and safe-area header', async () => {
  const { TopBar } = await vite.ssrLoadModule('/src/components/layout/TopBar.tsx')
  const html = renderToStaticMarkup(
    React.createElement(TopBar, { xp: 120, streak: 5, achievements: 3 }),
  )
  assert.ok(html.includes('role="banner"'))
  assert.ok(html.includes('max(16px, env(safe-area-inset-top))'))
  assert.ok(html.includes('120'))
  assert.ok(html.includes('5'))
  assert.ok(!html.includes('letter-spacing:0.03em') && !html.includes('letterSpacing'))
  assert.equal((html.match(/<svg/g) ?? []).length, 3)
  assert.doesNotMatch(html, /🔥|⭐|🏆/)
})

test('home decorative greeting and streak icons are hidden from screen readers', async () => {
  const { HomeScreen } = await vite.ssrLoadModule('/src/features/home/HomeScreen.tsx')
  const { theme } = await vite.ssrLoadModule('/src/theme/tokens.ts')
  const html = renderToStaticMarkup(React.createElement(HomeScreen, { onChapter: () => {}, onLesson: () => {} }))

  assert.match(html, /<svg[^>]*aria-hidden="true"/)
  assert.equal((html.match(/aria-hidden="true"/g) ?? []).length, 2)
  assert.doesNotMatch(html, /aria-label="(?:Lời chào|Chuỗi ngày học)"/)
  assert.ok(html.includes('data-testid="home-streak-card"'))
  for (const color of [theme.colors.accentRed, theme.colors.primary, theme.colors.primaryText, theme.colors.activeBg, theme.colors.textMuted]) {
    assert.ok(html.includes(color), `rendered streak UI should use token color ${color}`)
  }
})

test('runtime typography loads only Inter and keeps legacy class aliases', async () => {
  const css = await readFile(new URL('../../src/index.css', import.meta.url), 'utf8')

  assert.match(css, /family=Inter/)
  assert.doesNotMatch(css, /Playfair\+Display|Caveat/)
  assert.match(css, /--font-serif:\s*var\(--font-sans\)/)
  assert.match(css, /--font-hand:\s*var\(--font-sans\)/)
  assert.match(css, /margin:\s*0/)
  assert.match(css, /line-height:\s*1\.5/)
})

test('UI primitives render with design tokens', async () => {
  const { Button } = await vite.ssrLoadModule('/src/components/ui/Button.tsx')
  const { Badge } = await vite.ssrLoadModule('/src/components/ui/Badge.tsx')
  const { ChoiceOption } = await vite.ssrLoadModule('/src/components/ui/ChoiceOption.tsx')
  const { Progress } = await vite.ssrLoadModule('/src/components/ui/Progress.tsx')
  const { IconButton } = await vite.ssrLoadModule('/src/components/ui/IconButton.tsx')
  const { Modal } = await vite.ssrLoadModule('/src/components/ui/Modal.tsx')

  const buttonHtml = renderToStaticMarkup(
    React.createElement(Button, { variant: 'primary' }, 'Bắt đầu'),
  )
  assert.ok(buttonHtml.includes('Bắt đầu'))

  const badgeHtml = renderToStaticMarkup(
    React.createElement(Badge, { variant: 'error' }, 'Sai rồi'),
  )
  assert.ok(badgeHtml.includes('Sai rồi'))

  const narrativeChoiceHtml = renderToStaticMarkup(
    React.createElement(ChoiceOption, { type: 'narrative', label: 'Suy ngẫm', isSelected: true }),
  )
  assert.ok(!narrativeChoiceHtml.includes('✓'))
  assert.ok(!narrativeChoiceHtml.includes('Đúng') && !narrativeChoiceHtml.includes('Sai'))
  assert.ok(!narrativeChoiceHtml.includes('#E8F5E2'))
  assert.ok(narrativeChoiceHtml.includes('Suy ngẫm'))

  const correctChoiceHtml = renderToStaticMarkup(
    React.createElement(ChoiceOption, {
      type: 'knowledge', label: 'Đáp án', isSelected: true, revealed: true, correct: true,
    }),
  )
  assert.ok(correctChoiceHtml.includes('✓') && correctChoiceHtml.includes('Đúng'))

  const incorrectChoiceHtml = renderToStaticMarkup(
    React.createElement(ChoiceOption, {
      type: 'knowledge', label: 'Lựa chọn sai', isSelected: true, revealed: true, correct: false,
    }),
  )
  assert.ok(incorrectChoiceHtml.includes('✗') && incorrectChoiceHtml.includes('Sai'))

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
  assert.ok(modalHtml.includes('tabindex="-1"'))
})

test('Modal source contains focus trap and focus restoration behavior', async () => {
  const source = await readFile(new URL('../../src/components/ui/Modal.tsx', import.meta.url), 'utf8')
  assert.match(source, /previouslyFocusedRef/)
  assert.match(source, /onCloseRef\.current = onClose/)
  assert.match(source, /onCloseRef\.current\(\)/)
  assert.match(source, /document\.activeElement/)
  assert.match(source, /querySelectorAll<HTMLElement>/)
  assert.match(source, /e\.key !== 'Tab'/)
  assert.match(source, /focusIsOutside/)
  assert.match(source, /previouslyFocusedRef\.current\?\.focus\(\)/)
  assert.match(source, /\}, \[isOpen\]\)/)
  assert.doesNotMatch(source, /\[isOpen, onClose\]/)
})

test('M1 primitives route color and shadow decisions through tokens', async () => {
  const files = ['Button.tsx', 'Badge.tsx', 'ChoiceOption.tsx', 'Modal.tsx', 'Progress.tsx']
  for (const file of files) {
    const source = await readFile(new URL(`../../src/components/ui/${file}`, import.meta.url), 'utf8')
    assert.ok(source.includes('theme.'), `${file} should use theme tokens`)
    assert.doesNotMatch(source, /rgba\(61,\s*26,\s*0/)
    assert.doesNotMatch(source, /rgba\(139,\s*26,\s*26/)
    assert.doesNotMatch(source, /#[0-9A-Fa-f]{6}/)
  }
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

test('M3-02 lesson renderer routes ordered typed blocks through explicit slots', async () => {
  const { LessonContentView, LessonRenderer } = await vite.ssrLoadModule('/src/features/learning/lesson/LessonRenderer.tsx')
  const content = {
    lesson: { id: 'lesson-mixed', title: 'Bài hỗn hợp', summary: 'Tóm lược' },
    blocks: [
      { id: 'text-1', order: 0, required: true, kind: 'text', documentId: 'doc-1', document: {
        id: 'doc-1', title: 'Văn bản', locale: 'vi-VN', sourceIds: [], status: 'published',
        sections: [{ id: 'section-1', kind: 'paragraph', text: 'Nội dung lịch sử' }],
      } },
      { id: 'vn-1', order: 1, required: true, kind: 'visual_novel', storyVersionId: 'story-v1' },
      { id: 'video-1', order: 2, required: true, kind: 'video', mediaAssetId: 'media-1', completionPolicy: 'reach_end' },
      { id: 'quiz-1', order: 3, required: true, kind: 'quiz', questionSetId: 'set-1', assessmentMode: 'practice' },
      { id: 'recap-1', order: 4, required: true, kind: 'recap', documentId: 'doc-2', document: {
        id: 'doc-2', title: 'Ôn tập', locale: 'vi-VN', sourceIds: [], status: 'published',
        sections: [{ id: 'section-2', kind: 'key_points', items: ['Ý chính'] }],
      } },
    ],
  }
  const slots = {
    visualNovel: ({ block }) => React.createElement('p', null, `VN:${block.id}`),
    video: ({ block }) => React.createElement('p', null, `VIDEO:${block.id}`),
    quiz: ({ block }) => React.createElement('p', null, `QUIZ:${block.id}`),
  }
  const html = renderToStaticMarkup(React.createElement(LessonContentView, { content, slots }))
  const markers = ['Nội dung lịch sử', 'VN:vn-1', 'VIDEO:video-1', 'QUIZ:quiz-1', 'Ý chính']
  assert.equal((html.match(/data-testid="lesson-block"/g) ?? []).length, 5)
  assert.ok(markers.every(marker => html.includes(marker)))
  assert.deepEqual([...markers].sort((a, b) => html.indexOf(a) - html.indexOf(b)), markers)
  assert.ok(html.includes('data-block-id="text-1"') && html.includes('data-block-kind="recap"'))
  assert.ok(html.includes('aria-label="Tóm tắt: Ôn tập"'))

  const loading = renderToStaticMarkup(React.createElement(LessonRenderer, {
    lessonId: 'lesson-mixed', services: {}, slots,
  }))
  assert.ok(loading.includes('Đang tải nội dung bài học...'))

  const empty = renderToStaticMarkup(React.createElement(LessonContentView, {
    content: { lesson: content.lesson, blocks: [] }, slots,
  }))
  assert.ok(empty.includes('Bài học chưa có nội dung'))
})
