import type { Chapter, Lesson } from '../../../types/v2/content.ts'
import type { ProgressStatus } from '../../../types/v2/progress.ts'
import type { LearningServices, ServiceErrorCode } from '../../../services/next/contracts.ts'

export type JourneyLesson = Lesson & { progressStatus: ProgressStatus }
export type JourneyChapter = Chapter & { lessons: JourneyLesson[]; completedCount: number }
export type JourneySnapshot = { chapters: JourneyChapter[] }
export type JourneyLoadResult =
  | { ok: true; value: JourneySnapshot }
  | { ok: false; error: ServiceErrorCode }

export async function loadJourney(services: LearningServices): Promise<JourneyLoadResult> {
  const chapterResult = await services.chapters.listPublished()
  if (!chapterResult.ok) return chapterResult

  const chapters: JourneyChapter[] = []
  for (const chapter of chapterResult.value) {
    const orderedRefs = [...chapter.lessonRefs].sort((a, b) => a.order - b.order)
    const lessons: JourneyLesson[] = []
    for (const reference of orderedRefs) {
      const [lessonResult, progressResult] = await Promise.all([
        services.lessons.getById(reference.id),
        services.progress.getLessonProgress(reference.id),
      ])
      if (!lessonResult.ok) return lessonResult
      if (!progressResult.ok) return progressResult
      lessons.push({ ...lessonResult.value, progressStatus: progressResult.value?.status ?? 'not_started' })
    }
    chapters.push({ ...chapter, lessons, completedCount: lessons.filter(item => item.progressStatus === 'completed').length })
  }
  return { ok: true, value: { chapters } }
}

export async function startLesson(services: LearningServices, lesson: JourneyLesson) {
  const existing = await services.progress.getLessonProgress(lesson.id)
  if (!existing.ok || existing.value) return existing

  const firstBlock = [...lesson.blocks].sort((a, b) => a.order - b.order)[0]
  if (!firstBlock) return { ok: false as const, error: 'not_found' as const }
  return services.progress.saveCheckpoint({
    lessonId: lesson.id,
    currentBlockId: firstBlock.id,
    completedBlockIds: [],
    operationId: `m3-01:start:${lesson.id}`,
  })
}
