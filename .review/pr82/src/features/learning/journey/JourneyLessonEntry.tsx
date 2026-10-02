import type { LearningServices } from '../../../services/next/contracts'
import type { JourneyLesson } from './journeyModel'
import type { Ref } from 'react'
import { IntegratedLessonRenderer } from './IntegratedLessonRenderer'

export function JourneyLessonEntry({ lesson, services, headingRef, onBack }: {
  lesson: JourneyLesson
  services: LearningServices
  headingRef: Ref<HTMLHeadingElement>
  onBack: () => void
}) {
  return (
    <section className="space-y-4 px-4 py-4" aria-label="Nội dung bài học">
      <button data-testid="journey-lesson-back" className="min-h-11 font-sans text-sm font-bold focus-visible:outline-2" onClick={onBack}>‹ VỀ CHƯƠNG</button>
      <p className="font-sans text-xs font-bold uppercase">{lesson.format} · {lesson.estimatedMinutes} phút</p>
      <IntegratedLessonRenderer lessonId={lesson.id} services={services} headingRef={headingRef} />
    </section>
  )
}
