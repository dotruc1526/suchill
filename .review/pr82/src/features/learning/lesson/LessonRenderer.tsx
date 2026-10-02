import { useEffect, useState, type Ref } from 'react'
import { EmptyState, ErrorState, LoadingState } from '../../../components/ui'
import type { LearningServices, ServiceErrorCode } from '../../../services/next/contracts'
import { theme } from '../../../theme/tokens'
import { LessonBlockRenderer, type LessonBlockSlots } from './LessonBlockRenderer'
import { loadLessonContent, type LessonContent } from './lessonRendererModel'

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; content: LessonContent }
  | { status: 'error'; error: ServiceErrorCode }

export function LessonContentView({ content, slots, headingRef }: {
  content: LessonContent
  slots?: LessonBlockSlots
  headingRef?: Ref<HTMLHeadingElement>
}) {
  if (content.blocks.length === 0) {
    return <EmptyState title="Bài học chưa có nội dung" message="Nội dung sẽ xuất hiện sau khi được duyệt." />
  }
  return (
    <main aria-labelledby="lesson-entry-heading" className="space-y-4" data-testid="lesson-content">
      <header>
        <h1 ref={headingRef} tabIndex={-1} id="lesson-entry-heading" className="font-bold text-2xl outline-none" style={{ color: theme.colors.textPrimary }}>
          {content.lesson.title}
        </h1>
        <p style={{ color: theme.colors.textSecondary }}>{content.lesson.summary}</p>
      </header>
      {content.blocks.map(block => <LessonBlockRenderer key={block.id} block={block} slots={slots} />)}
    </main>
  )
}

export function LessonRenderer({
  lessonId,
  services,
  slots,
  headingRef,
}: { lessonId: string; services: LearningServices; slots?: LessonBlockSlots; headingRef?: Ref<HTMLHeadingElement> }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [retryKey, setRetryKey] = useState(0)
  useEffect(() => {
    let active = true
    setState({ status: 'loading' })
    void loadLessonContent(services, lessonId).then(result => {
      if (!active) return
      setState(result.ok ? { status: 'ready', content: result.value } : { status: 'error', error: result.error })
    })
    return () => { active = false }
  }, [lessonId, retryKey, services])

  if (state.status === 'loading') return <LoadingState message="Đang tải nội dung bài học..." />
  if (state.status === 'error') {
    return <ErrorState message={`Không thể tải bài học (${state.error}).`} onRetry={() => setRetryKey(value => value + 1)} />
  }
  return <LessonContentView content={state.content} slots={slots} headingRef={headingRef} />
}
