import type { Chapter, Lesson } from '../../../types/v2/content.ts'
import type { ProgressStatus } from '../../../types/v2/progress.ts'
import type { LearningServices, ServiceErrorCode } from '../../../services/next/contracts.ts'
import type { HomeActivityService, HomeActivitySummary } from '../../../services/next/m3HomeActivity.ts'

export type JourneyLesson = Lesson & { progressStatus: ProgressStatus }
export type JourneyChapter = Chapter & { lessons: JourneyLesson[]; completedCount: number }
export type JourneySnapshot = { chapters: JourneyChapter[]; activity?: HomeActivitySummary }
export type JourneyLoadResult =
  | { ok: true; value: JourneySnapshot }
  | { ok: false; error: ServiceErrorCode }

export async function loadJourney(services: LearningServices, activityService?: HomeActivityService): Promise<JourneyLoadResult> {
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
      if (!progressResult.ok && progressResult.error !== 'unauthorized') return progressResult
      lessons.push({ ...lessonResult.value, progressStatus: progressResult.ok ? progressResult.value?.status ?? 'not_started' : 'not_started' })
    }
    chapters.push({ ...chapter, lessons, completedCount: lessons.filter(item => item.progressStatus === 'completed').length })
  }
  const activity = await activityService?.getSummary()
  return { ok: true, value: { chapters, ...(activity?.ok ? { activity: activity.value } : {}) } }
}

export function getHomeContinuation(chapters: JourneyChapter[]) {
  for (const status of ['in_progress', 'not_started'] as const) {
    for (const chapter of chapters) {
      const lesson = chapter.lessons.find(item => item.progressStatus === status)
      if (lesson) return { chapter, lesson }
    }
  }
  return undefined
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
