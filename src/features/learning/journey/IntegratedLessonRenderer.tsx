import { useEffect, useMemo, useRef, useState, type Ref } from 'react'
import { Button, EmptyState, ErrorState, LoadingState } from '../../../components/ui'
import type { CompletionReceipt, LearningServices, ServiceErrorCode } from '../../../services/next/contracts'
import type { LessonBlock } from '../../../types/v2/content'
import type { LessonProgress } from '../../../types/v2/progress'
import { theme } from '../../../theme/tokens'
import { QuizFlow } from '../../quiz/v2'
import { VisualNovelPlayerV2 } from '../../visual-novel/v2'
import { LessonBlockRenderer, type LessonBlockSlots } from '../lesson'
import { loadLessonContent, type LessonContent } from '../lesson/lessonRendererModel'
import { BlockCompletionControl } from '../completion/BlockCompletionControl'
import { LessonCompletionControl } from '../completion/LessonCompletionControl'
import { VideoLessonPlayer } from '../video'
import { videoPlayerContext, visualNovelPlayerContext } from './lessonPlayerContexts'

type VisualNovelBlock = Extract<LessonBlock, { kind: 'visual_novel' }>

function VisualNovelLessonBlock({ lessonId, block, services }: {
  lessonId: string
  block: VisualNovelBlock
  services: LearningServices
}) {
  const [open, setOpen] = useState(false)
  const openerContainerRef = useRef<HTMLDivElement>(null)
  const restoreFocusRef = useRef(false)
  useEffect(() => {
    if (open || !restoreFocusRef.current) return
    restoreFocusRef.current = false
    openerContainerRef.current?.querySelector('button')?.focus()
  }, [open])
  const close = () => {
    restoreFocusRef.current = true
    setOpen(false)
  }
  if (!open) return <div ref={openerContainerRef}>
    <Button data-testid={`open-vn-${block.id}`} onClick={() => setOpen(true)}>MỞ VISUAL NOVEL</Button>
  </div>
  return <VisualNovelPlayerV2
    services={services}
    context={visualNovelPlayerContext(lessonId, block)}
    onClose={close}
    onComplete={close}
  />
}

type LoadState = { status: 'loading' } | { status: 'error'; error: ServiceErrorCode }
  | { status: 'ready'; content: LessonContent; progress: LessonProgress | null; completedBlockIds: string[]; services: LearningServices }

export function IntegratedLessonRenderer({ lessonId, services, headingRef, onConfirmed }: {
  lessonId: string
  services: LearningServices
  headingRef: Ref<HTMLHeadingElement>
  onConfirmed?: (receipt: CompletionReceipt) => void
}) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [retryKey, setRetryKey] = useState(0)
  const resumeBlockRef = useRef<HTMLElement>(null)
  useEffect(() => {
    let active = true
    setState({ status: 'loading' })
    void Promise.all([loadLessonContent(services, lessonId), services.progress.getLessonProgress(lessonId)]).then(([content, progress]) => {
      if (!active) return
      if (!content.ok) setState({ status: 'error', error: content.error })
      else if (!progress.ok) setState({ status: 'error', error: progress.error })
      else setState({ status: 'ready', content: content.value, progress: progress.value, completedBlockIds: progress.value?.confirmedCompletedBlockIds ?? [], services })
    }).catch(() => { if (active) setState({ status: 'error', error: 'server_error' }) })
    return () => { active = false }
  }, [lessonId, retryKey, services])
  const slots = useMemo<LessonBlockSlots>(() => ({
    visualNovel: ({ block }) => <VisualNovelLessonBlock lessonId={lessonId} block={block} services={services} />,
    video: ({ block }) => <VideoLessonPlayer services={services} context={videoPlayerContext(lessonId, block)} />,
    quiz: ({ block }) => <QuizFlow services={services} questionSetId={block.questionSetId} />,
  }), [lessonId, services])

  if (state.status === 'loading') return <LoadingState message="Đang tải nội dung bài học..." />
  if (state.status === 'error') return <ErrorState message={`Không thể tải bài học (${state.error}).`} onRetry={() => setRetryKey(value => value + 1)} />
  if (state.content.lesson.id !== lessonId || state.services !== services) return <LoadingState message="Đang tải nội dung bài học..." />
  const { content, progress, completedBlockIds } = state
  if (!content.blocks.length) return <EmptyState title="Bài học chưa có nội dung" message="Nội dung sẽ xuất hiện sau khi được duyệt." />
  return <main aria-labelledby="lesson-entry-heading" className="space-y-4" data-testid="lesson-content">
    <header>
      <h1 ref={headingRef} tabIndex={-1} id="lesson-entry-heading" className="font-bold text-2xl outline-none" style={{ color: theme.colors.textPrimary }}>{content.lesson.title}</h1>
      <p style={{ color: theme.colors.textSecondary }}>{content.lesson.summary}</p>
      {progress?.currentBlockId && <div className="mt-2 space-y-2">
        <p className="text-xs" role="status">Tiến độ đã lưu. Các phần hoàn thành được đánh dấu bên dưới.</p>
        <Button variant="outline" className="min-h-11" onClick={() => resumeBlockRef.current?.focus()}>ĐI ĐẾN PHẦN ĐANG HỌC</Button>
      </div>}
    </header>
    {content.blocks.map(block => <section key={block.id} ref={block.id === progress?.currentBlockId ? resumeBlockRef : undefined} tabIndex={-1} aria-label={`Phần học ${block.order + 1}`}>
      <LessonBlockRenderer block={block} slots={slots} />
      <BlockCompletionControl lessonId={lessonId} block={block} services={services} completed={completedBlockIds.includes(block.id)} onConfirmed={receipt => {
        setState(current => current.status === 'ready' ? { ...current,
          completedBlockIds: [...new Set([...current.completedBlockIds, block.id])],
        } : current)
        onConfirmed?.(receipt)
      }} />
    </section>)}
    <LessonCompletionControl lessonId={lessonId} lessonTitle={content.lesson.title} services={services}
      remainingRequired={content.blocks.filter(block => block.required && !(block.kind === 'video' && block.completionPolicy === 'optional') && !completedBlockIds.includes(block.id)).length} onConfirmed={onConfirmed} />
  </main>
}
