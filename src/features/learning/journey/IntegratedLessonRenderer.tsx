import { useEffect, useMemo, useRef, useState, type Ref } from 'react'
import { Button } from '../../../components/ui'
import type { LearningServices } from '../../../services/next/contracts'
import type { LessonBlock } from '../../../types/v2/content'
import { QuizFlow } from '../../quiz/v2'
import { VisualNovelPlayerV2 } from '../../visual-novel/v2'
import { LessonRenderer, type LessonBlockSlots } from '../lesson'
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

export function IntegratedLessonRenderer({ lessonId, services, headingRef, documentAction }: {
  lessonId: string
  services: LearningServices
  headingRef: Ref<HTMLHeadingElement>
  documentAction?: (blockId: string) => import('react').ReactNode
}) {
  const slots = useMemo<LessonBlockSlots>(() => ({
    visualNovel: ({ block }) => <VisualNovelLessonBlock lessonId={lessonId} block={block} services={services} />,
    video: ({ block }) => <VideoLessonPlayer services={services} context={videoPlayerContext(lessonId, block)} />,
    quiz: ({ block }) => <QuizFlow services={services} questionSetId={block.questionSetId} />,
  }), [lessonId, services])

  return <LessonRenderer lessonId={lessonId} services={services} slots={slots} headingRef={headingRef} documentAction={documentAction} />
}
