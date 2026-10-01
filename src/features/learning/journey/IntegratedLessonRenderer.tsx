import { useMemo, useState, type Ref } from 'react'
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
  if (!open) return <Button onClick={() => setOpen(true)}>MỞ VISUAL NOVEL</Button>
  return <VisualNovelPlayerV2
    services={services}
    context={visualNovelPlayerContext(lessonId, block)}
    onClose={() => setOpen(false)}
    onComplete={() => setOpen(false)}
  />
}

export function IntegratedLessonRenderer({ lessonId, services, headingRef }: {
  lessonId: string
  services: LearningServices
  headingRef: Ref<HTMLHeadingElement>
}) {
  const slots = useMemo<LessonBlockSlots>(() => ({
    visualNovel: ({ block }) => <VisualNovelLessonBlock lessonId={lessonId} block={block} services={services} />,
    video: ({ block }) => <VideoLessonPlayer services={services} context={videoPlayerContext(lessonId, block)} />,
    quiz: ({ block }) => <QuizFlow services={services} questionSetId={block.questionSetId} />,
  }), [lessonId, services])

  return <LessonRenderer lessonId={lessonId} services={services} slots={slots} headingRef={headingRef} />
}
