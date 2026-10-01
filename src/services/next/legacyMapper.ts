import type { Chapter as LegacyChapter } from '../../types/index.ts'
import type { Chapter, Lesson } from '../../types/v2/content.ts'

export type LegacyTextDocument = {
  id: string
  title: string
  paragraphs: string[]
  keyPoints: string[]
  fixtureOnly: true
}
export type LegacyMappingExclusion = {
  kind: 'progress' | 'quiz' | 'visual_novel' | 'cover'
  legacyId: string
  reason: string
}
export type LegacyChapterMapping = {
  chapter: Chapter
  lessons: Lesson[]
  documents: LegacyTextDocument[]
  excluded: LegacyMappingExclusion[]
}

const chapterId = (id: number) => `legacy.chapter.${id}`
const lessonId = (chapter: number, lesson: number) => `legacy.lesson.${chapter}.${lesson}`
const documentId = (chapter: number, lesson: number) => `legacy.document.${chapter}.${lesson}`
const blockId = (chapter: number, lesson: number) => `legacy.block.${chapter}.${lesson}.overview`

/** Maps only the old technical demo into unpublished fixture entities; it is not a content approval path. */
export function mapLegacyChapter(chapter: LegacyChapter): LegacyChapterMapping {
  const exclusions: LegacyMappingExclusion[] = [
    { kind: 'progress', legacyId: chapterId(chapter.id), reason: 'View progress/status belongs to user progress or a derived view model.' },
  ]
  if (chapter.quiz.length) {
    exclusions.push({ kind: 'quiz', legacyId: `legacy.quiz.${chapter.id}`, reason: 'Legacy answer keys and positional options are not exposed through the domain fixture.' })
  }
  if (chapter.unsplashId) {
    exclusions.push({ kind: 'cover', legacyId: `legacy.cover.${chapter.id}`, reason: 'Legacy Unsplash identifiers lack approved MediaAsset provenance.' })
  }

  const documents: LegacyTextDocument[] = []
  const lessons: Lesson[] = chapter.lessons.map(lesson => {
    const id = lessonId(chapter.id, lesson.id)
    const content = lesson.story.map(step => step.text).filter(Boolean)
    const keyPoints = [...lesson.keyPoints]
    const docId = documentId(chapter.id, lesson.id)
    const blocks = content.length || keyPoints.length
      ? [{ id: blockId(chapter.id, lesson.id), order: 0, required: true, kind: 'text' as const, documentId: docId }]
      : []
    if (blocks.length) documents.push({
      id: docId,
      title: lesson.title,
      paragraphs: content,
      keyPoints,
      fixtureOnly: true,
    })
    if (lesson.visualNovelId) {
      exclusions.push({
        kind: 'visual_novel',
        legacyId: lesson.visualNovelId,
        reason: 'Legacy scene graph needs authored version/source review before conversion; it remains isolated.' ,
      })
    }
    return {
      id,
      chapterId: chapterId(chapter.id),
      slug: `legacy-${chapter.id}-${lesson.id}`,
      title: lesson.title,
      summary: keyPoints[0] ?? content[0] ?? '',
      format: 'standard',
      estimatedMinutes: Math.max(0, lesson.duration),
      learningObjectiveIds: [],
      prerequisites: [],
      blocks,
      status: 'draft',
    }
  })

  return {
    chapter: {
      id: chapterId(chapter.id),
      slug: `legacy-${chapter.id}`,
      title: chapter.title,
      subtitle: chapter.subtitle,
      summary: chapter.description,
      historicalPeriodLabel: chapter.year,
      learningObjectiveIds: [],
      lessonRefs: lessons.map((lesson, order) => ({ id: lesson.id, order })),
      estimatedMinutes: lessons.reduce((total, lesson) => total + lesson.estimatedMinutes, 0),
      status: 'draft',
    },
    lessons,
    documents,
    excluded: exclusions,
  }
}
