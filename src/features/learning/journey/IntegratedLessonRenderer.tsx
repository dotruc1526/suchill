import { useEffect, useMemo, useRef, useState, type Ref } from 'react'
import { Button } from '../../../components/ui'
import type { LearningServices } from '../../../services/next/contracts'
import type { LessonBlock } from '../../../types/v2/content'
import { lazyFeature } from '../../../app/LazyFeature'
import { LessonRenderer, type LessonBlockSlots } from '../lesson'
import { VideoFallbackControl } from '../completion/VideoFallbackControl'
import { videoPlayerContext, visualNovelPlayerContext } from './lessonPlayerContexts'

const QuizFlow = lazyFeature(() => import('../../quiz/v2/QuizFlow').then(module => ({ default: module.QuizFlow })))
const VideoLessonPlayer = lazyFeature(() => import('../video/VideoLessonPlayer').then(module => ({ default: module.VideoLessonPlayer })))
const VisualNovelPlayerV2 = lazyFeature(() => import('../../visual-novel/v2/VisualNovelPlayerV2').then(module => ({ default: module.VisualNovelPlayerV2 })), { onBack: props => props.onClose() })

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

export function IntegratedLessonRenderer({ lessonId, services, headingRef, documentAction }: {
  lessonId: string
  services: LearningServices
  headingRef: Ref<HTMLHeadingElement>
  documentAction?: (blockId: string) => import('react').ReactNode
}) {
  const slots = useMemo<LessonBlockSlots>(() => ({
    visualNovel: ({ block }) => <VisualNovelLessonBlock lessonId={lessonId} block={block} services={services} />,
    video: ({ block }) => <div className="space-y-3">
      <VideoLessonPlayer services={services} context={videoPlayerContext(lessonId, block)} />
      <VideoFallbackControl lessonId={lessonId} blockId={block.id} services={services} />
    </div>,
    quiz: ({ block }) => <QuizFlow services={services} questionSetId={block.questionSetId} />,
  }), [lessonId, services])

  return <LessonRenderer lessonId={lessonId} services={services} slots={slots} headingRef={headingRef} documentAction={documentAction} />
}
