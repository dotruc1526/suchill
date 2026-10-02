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

test('M3 journey home exposes labeled stable-ID navigation', async () => {
  const { JourneyHome } = await vite.ssrLoadModule('/src/features/learning/journey/JourneyHome.tsx')
  const { theme } = await vite.ssrLoadModule('/src/theme/tokens.ts')
  const chapter = {
    id: 'chapter-stable', slug: 'chapter', title: 'Chương mẫu', summary: 'Fixture', historicalPeriodLabel: '1972',
    learningObjectiveIds: [], lessonRefs: [], estimatedMinutes: 5, status: 'published', lessons: [], completedCount: 0,
  }
  const html = renderToStaticMarkup(React.createElement(JourneyHome, {
    chapters: [chapter], greeting: 'XIN CHÀO, Nguyễn Thị Dương Anh Minh', headingRef: null, chapterButtonRef: () => {}, onChapter: () => {},
  }))

  assert.ok(html.includes('XIN CHÀO, Nguyễn Thị Dương Anh Minh'))
  assert.ok(html.includes('data-testid="journey-greeting"'))
  assert.match(html, /<h1[^>]*id="journey-heading"[^>]*>.*data-testid="journey-greeting"/)
  const fallback = renderToStaticMarkup(React.createElement(JourneyHome, {
    chapters: [chapter], headingRef: null, chapterButtonRef: () => {}, onChapter: () => {},
  }))
  assert.match(fallback, /data-testid="journey-greeting"[^>]*>XIN CHÀO<\/span>/)
  assert.ok(html.includes('break-words'))
  assert.ok(html.includes('aria-labelledby="journey-heading"'))
  assert.ok(html.includes('aria-label="Mở chương Chương mẫu"'))
  assert.ok(html.includes('data-testid="journey-open-chapter-chapter-stable"'))
  assert.ok(html.includes('data-testid="journey-chapter-card"'))
  assert.ok(html.includes('min-h-11'))
  for (const color of [theme.colors.primary, theme.colors.primaryText, theme.colors.textPrimary, theme.colors.textMuted]) {
    assert.ok(html.includes(color), `rendered journey UI should use token color ${color}`)
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

test('M3-03 scene view keeps narrative choices neutral and knowledge feedback explicit', async () => {
  const { VisualNovelSceneView } = await vite.ssrLoadModule('/src/features/visual-novel/v2/VisualNovelSceneView.tsx')
  const noop = () => {}
  const base = { sourceIds: [], claimIds: [] }
  const choice = {
    ...base, id: 'choice', kind: 'choice', prompt: 'Bạn nghĩ gì?', policy: 'retry_until_correct', choices: [
      { id: 'reflection', kind: 'reflection', label: 'Suy ngẫm', nextSceneId: 'end' },
      { id: 'knowledge', kind: 'knowledge_check', label: 'Kiến thức', isCorrect: false, explanation: 'Đọc lại', nextSceneId: 'end' },
    ],
  }
  const choiceHtml = renderToStaticMarkup(React.createElement(VisualNovelSceneView, {
    scene: choice, busy: false, onChoice: noop, onContinue: noop, onComplete: noop,
  }))
  assert.ok(choiceHtml.includes('Lựa chọn suy ngẫm, không có đúng sai'))
  assert.ok(choiceHtml.includes('Câu hỏi kiến thức'))
  assert.ok(choiceHtml.includes('aria-label="Nội dung Visual Novel hiện tại"'))
  assert.ok(choiceHtml.includes('tabindex="-1"'))
  assert.doesNotMatch(choiceHtml, /✓ Chính xác|✗ Chưa chính xác/)

  const feedbackHtml = renderToStaticMarkup(React.createElement(VisualNovelSceneView, {
    scene: choice, busy: false, feedback: { choiceId: 'knowledge', outcome: 'incorrect', message: 'Đọc lại' },
    onChoice: noop, onContinue: noop, onComplete: noop,
  }))
  assert.ok(feedbackHtml.includes('role="status"'))
  assert.match(feedbackHtml, /tabindex="-1"[^>]*role="status"/)
  assert.ok(feedbackHtml.includes('✗ Chưa chính xác') && feedbackHtml.includes('Đọc lại'))

  for (const scene of [
    { ...base, id: 'narration', kind: 'narration', text: 'Kể chuyện', nextSceneId: 'end' },
    { ...base, id: 'dialogue', kind: 'dialogue', speaker: 'Nhân vật', line: 'Lời thoại', nextSceneId: 'end' },
    { ...base, id: 'media', kind: 'media', mediaAssetId: 'asset', caption: 'Chú thích', nextSceneId: 'end' },
    { ...base, id: 'debrief', kind: 'debrief', summary: 'Tổng kết', nextSceneId: 'end' },
    { ...base, id: 'end', kind: 'end', summary: 'Hoàn tất' },
  ]) {
    const html = renderToStaticMarkup(React.createElement(VisualNovelSceneView, {
      scene, busy: false, onChoice: noop, onContinue: noop, onComplete: noop,
    }))
    assert.ok(html.includes(`data-scene-id="${scene.id}"`), `${scene.kind} scene should render by stable ID`)
  }
})

test('M3-03 error state preserves close and checkpoint retry actions', async () => {
  const { VisualNovelErrorState } = await vite.ssrLoadModule('/src/features/visual-novel/v2/VisualNovelPlayerV2.tsx')
  const html = renderToStaticMarkup(React.createElement(VisualNovelErrorState, {
    error: 'offline', onRetry: () => {}, onClose: () => {},
  }))
  assert.ok(html.includes('aria-label="Visual Novel gặp lỗi"'))
  assert.ok(html.includes('ĐÓNG'))
  assert.ok(html.includes('Thử lại'))
  assert.ok(html.includes('Không thể tải Visual Novel (offline).'))
})

test('M3-03 moves focus by scene and feedback without returning to the player heading', async () => {
  const source = await readFile(new URL('../../src/features/visual-novel/v2/VisualNovelPlayerV2.tsx', import.meta.url), 'utf8')
  assert.match(source, /playerFocusedRef\.current/)
  assert.match(source, /\[state\.status\]/)
  assert.match(source, /sceneRef\.current\?\.focus\(\)/)
  assert.match(source, /\[activeSceneId\]/)
  assert.match(source, /feedbackRef\.current\?\.focus\(\)/)
  assert.match(source, /\[feedbackKey\]/)
  assert.doesNotMatch(source, /headingRef\.current\?\.focus\(\).*\}, \[state\]\)/s)
})

test('M3-03 resets focus tracking when the story context changes', async () => {
  const source = await readFile(new URL('../../src/features/visual-novel/v2/VisualNovelPlayerV2.tsx', import.meta.url), 'utf8')
  assert.match(source, /visualNovelContextKey\(context\)/)
  assert.match(source, /playerFocusedRef\.current = false/)
  assert.match(source, /previousSceneIdRef\.current = undefined/)
  assert.match(source, /playerFocusedRef\.current = false[\s\S]*?setState\(\{ status: 'loading' \}\)/)
  assert.match(source, /contextKey, retryKey, services\]/)
})

test('M3-03 gates late action results by story context', async () => {
  const source = await readFile(new URL('../../src/features/visual-novel/v2/VisualNovelPlayerV2.tsx', import.meta.url), 'utf8')
  assert.match(source, /actionGateRef\.current\.activate\(contextKey\)/)
  assert.match(source, /actionGateRef\.current\.invalidate\(\)/)
  assert.match(source, /const token = actionGateRef\.current\.begin\(contextKey\)/)
  assert.match(source, /if \(!actionGateRef\.current\.isCurrent\(token\)\) return/)
})

test('M3-03 hides a ready session synchronously when context or services change', async () => {
  const source = await readFile(new URL('../../src/features/visual-novel/v2/VisualNovelPlayerV2.tsx', import.meta.url), 'utf8')
  assert.match(source, /isVisualNovelRenderCurrent\(state\.contextKey, state\.services, contextKey, services\)/)
  assert.match(source, /if \(!readyState\) return <LoadingState/)
  assert.match(source, /const \{ session \} = readyState/)
  assert.doesNotMatch(source, /const \{ session \} = state/)
})

test('M3-04 video view exposes controls, Vietnamese captions, transcript and prepared fallback', async () => {
  const { VideoPlayerView } = await vite.ssrLoadModule('/src/features/learning/video/VideoPlayerView.tsx')
  const asset = {
    id: 'video', kind: 'video', title: 'Video bài học', reviewStatus: 'published', url: 'mock://video',
    caption: 'Chú thích video', durationSeconds: 100, sourceIds: [], attribution: 'Nguồn thử nghiệm',
    poster: { id: 'poster', url: 'mock://poster', altText: 'Ảnh áp phích lịch sử' },
    captionTracks: [{ id: 'captions', url: 'mock://captions', locale: 'vi-VN', label: 'Tiếng Việt' }],
    transcript: { id: 'transcript', url: 'mock://transcript', locale: 'vi-VN', label: 'Bản chép lời' },
    fallback: { kind: 'transcript', url: 'mock://transcript' },
  }
  const handlers = {
    onLoadedMetadata: () => {}, onPlay: () => {}, onPause: () => {}, onTimeUpdate: () => {},
    onSeeking: () => {}, onSeeked: () => {}, onEnded: () => {}, onError: () => {}, onRetry: () => {},
  }
  const html = renderToStaticMarkup(React.createElement(VideoPlayerView, {
    asset, videoRef: { current: null }, mediaFailed: false, retryKey: 0, ...handlers,
  }))
  assert.ok(html.includes('<video') && html.includes('controls=""'))
  assert.ok(html.includes('preload="metadata"') && html.includes('poster="mock://poster"'))
  assert.ok(html.includes('kind="captions"') && html.includes('srcLang="vi"'))
  assert.ok(html.includes('Tiếng Việt') && html.includes('Bản chép lời và nội dung thay thế'))
  assert.ok(html.includes('mock://transcript') && html.includes('Nguồn media: Nguồn thử nghiệm'))
  assert.doesNotMatch(html, /autoplay/i)

  const fallbackHtml = renderToStaticMarkup(React.createElement(VideoPlayerView, {
    asset, videoRef: { current: null }, mediaFailed: true, retryKey: 1, ...handlers,
  }))
  assert.ok(fallbackHtml.includes('role="alert"'))
  assert.ok(fallbackHtml.includes('Video chưa thể phát'))
  assert.ok(fallbackHtml.includes('Mở bản chép lời') && fallbackHtml.includes('THỬ PHÁT LẠI'))

  const posterFallback = { ...asset, transcript: undefined, fallback: { kind: 'poster', url: 'mock://poster', altText: 'Ảnh thay thế' } }
  const posterHtml = renderToStaticMarkup(React.createElement(VideoPlayerView, {
    asset: posterFallback, videoRef: { current: null }, mediaFailed: true, retryKey: 2, ...handlers,
  }))
  assert.ok(posterHtml.includes('alt="Ảnh thay thế"'))
})

test('M3-04 exposes load retry, retained-save retry and paused seek destination persistence', async () => {
  const { VideoProgressSaveError } = await vite.ssrLoadModule('/src/features/learning/video/VideoLessonPlayer.tsx')
  const errorHtml = renderToStaticMarkup(React.createElement(VideoProgressSaveError, { error: 'offline', onRetry: () => {} }))
  assert.ok(errorHtml.includes('role="alert"'))
  assert.ok(errorHtml.includes('Dữ liệu chưa lưu vẫn được giữ lại'))
  assert.ok(errorHtml.includes('THỬ LƯU LẠI'))

  const source = await readFile(new URL('../../src/features/learning/video/VideoLessonPlayer.tsx', import.meta.url), 'utf8')
  assert.match(source, /onRetry=\{\(\) => setLoadRetryKey\(value => value \+ 1\)\}/)
  assert.match(source, /if \(event\.currentTarget\.paused\) persist\(currentTime\(event\)\)/)
  assert.match(source, /checkpointQueue\.enqueue/)
})

test('M3-04 resets media failure and guards old checkpoint callbacks when context changes', async () => {
  const source = await readFile(new URL('../../src/features/learning/video/VideoLessonPlayer.tsx', import.meta.url), 'utf8')
  assert.match(source, /setMediaFailed\(false\)/)
  assert.match(source, /setRetryKey\(0\)/)
  assert.match(source, /registryRef\.current\.getOrCreate\(services, contextKey/)
  assert.match(source, /queueErrorsRef\.current\.get\(checkpointQueue\)/)
  assert.match(source, /activeQueueRef\.current !== queue/)
  assert.match(source, /current\.session\.asset\.id === context\.mediaAssetId/)
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

test('M3-02 lesson renderer wires service failures to an explicit same-lesson retry', async () => {
  const source = await readFile(new URL('../../src/features/learning/lesson/LessonRenderer.tsx', import.meta.url), 'utf8')
  assert.match(source, /const \[retryKey, setRetryKey\] = useState\(0\)/)
  assert.match(source, /\[lessonId, retryKey, services\]/)
  assert.match(source, /onRetry=\{\(\) => setRetryKey\(value => value \+ 1\)\}/)
})

test('M3 integration replaces the lesson placeholder with accepted typed player slots', async () => {
  const entrySource = await readFile(new URL('../../src/features/learning/journey/JourneyLessonEntry.tsx', import.meta.url), 'utf8')
  const integrationSource = await readFile(new URL('../../src/features/learning/journey/IntegratedLessonRenderer.tsx', import.meta.url), 'utf8')
  const journeySource = await readFile(new URL('../../src/features/learning/journey/LearningJourney.tsx', import.meta.url), 'utf8')

  assert.match(entrySource, /<IntegratedLessonRenderer lessonId=\{lesson\.id\} services=\{services\}/)
  assert.doesNotMatch(entrySource, /Renderer đang được chuẩn bị|BẮT ĐẦU NỘI DUNG/)
  assert.match(integrationSource, /<VisualNovelPlayerV2/)
  assert.match(integrationSource, /<VideoLessonPlayer/)
  assert.match(integrationSource, /<QuizFlow/)
  assert.match(integrationSource, /useMemo<LessonBlockSlots>/)
  assert.match(integrationSource, /openerContainerRef\.current\?\.querySelector\('button'\)\?\.focus\(\)/)
  assert.match(integrationSource, /onClose=\{close\}/)
  assert.match(integrationSource, /onComplete=\{close\}/)
  assert.match(journeySource, /lessonHeadingRef\.current = element/)
  assert.match(journeySource, /pendingFocusRef\.current = null/)
})

test('account summary distinguishes empty/error from confirmed zero and exposes retry', async () => {
  const { AccountSummaryView } = await vite.ssrLoadModule('/src/features/profile/AccountSummaryView.tsx')
  const render = state => renderToStaticMarkup(React.createElement(AccountSummaryView, { state, onRetry: () => {} }))
  assert.match(render({ status: 'empty' }), /Chưa có dữ liệu tài khoản/)
  assert.match(render({ status: 'error', error: 'offline' }), /role="alert"/)
  assert.doesNotMatch(render({ status: 'error', error: 'offline' }), /data-testid="confirmed-xp"/)
  const zero = render({ status: 'ready', value: { userId: 'a', displayName: 'Nguyễn Thị Dương Anh Minh', totalXp: 0, currentStreak: 0, longestStreak: 0, requiredLessonCount: 0, achievements: [] } })
  assert.match(zero, /data-testid="confirmed-xp"[^>]*>0</)
  assert.match(zero, /Chưa có danh hiệu đã xác nhận/)
})
