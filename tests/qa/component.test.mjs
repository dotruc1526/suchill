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

test('M3-05 quiz view is semantic, blocks incomplete submit and renders trusted feedback', async () => {
  const { QuizFlowView } = await vite.ssrLoadModule('/src/features/quiz/v2/QuizFlowView.tsx')
  const noop = () => {}
  const delivery = {
    set: { id: 'quiz', title: 'Kiểm tra chương', mode: 'scored', questionIds: ['q1', 'q2'], learningObjectiveIds: [] },
    questions: ['q1', 'q2'].map(id => ({
      id, prompt: `Câu ${id}`, optionIds: ['a', 'b'], sourceIds: [], difficulty: 'intro',
      options: [{ id: 'a', label: 'Phương án A' }, { id: 'b', label: 'Phương án B' }],
    })),
  }
  const handlers = { onToggle: noop, onSubmit: noop, onEditAfterError: noop, onRetryPractice: noop }
  const incomplete = renderToStaticMarkup(React.createElement(QuizFlowView, {
    session: { delivery, answers: { q1: ['a'] } }, submitting: false, answersLocked: false, ...handlers,
  }))
  assert.equal((incomplete.match(/<fieldset/g) ?? []).length, 2)
  assert.ok(incomplete.includes('data-question-id="q1"') && incomplete.includes('data-question-id="q2"'))
  assert.match(incomplete, /<button[^>]*disabled=""[^>]*>NỘP BÀI/)
  assert.doesNotMatch(incomplete, /isCorrect|answerKey|Private answer/)

  const receipt = {
    mode: 'scored', attemptId: 'attempt', score: 1, total: 2, passed: false,
    feedback: [
      { questionId: 'q1', outcome: 'correct', explanation: 'Giải thích đúng' },
      { questionId: 'q2', outcome: 'incorrect', explanation: 'Giải thích sai' },
    ],
  }
  const result = renderToStaticMarkup(React.createElement(QuizFlowView, {
    session: { delivery, answers: { q1: ['a'], q2: ['b'] } }, receipt,
    submitting: false, answersLocked: true, ...handlers,
  }))
  assert.ok(result.includes('✓ Chính xác') && result.includes('✗ Chưa chính xác'))
  assert.ok(result.includes('Giải thích đúng') && result.includes('Giải thích sai'))
  assert.ok(result.includes('Kết quả: 1/2') && result.includes('✗ Chưa đạt'))
  assert.ok(result.includes('tabindex="-1"'))

  const failed = renderToStaticMarkup(React.createElement(QuizFlowView, {
    session: { delivery, answers: { q1: ['a'], q2: ['b'] } }, submitting: false,
    answersLocked: true, submissionError: 'Chưa thể nộp bài (offline).', ...handlers,
  }))
  assert.ok(failed.includes('role="alert"') && failed.includes('THỬ GỬI LẠI'))
  assert.ok(failed.includes('Câu trả lời đang được khóa'))
})
