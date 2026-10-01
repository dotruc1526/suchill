import type { LearningServices, Result } from '../../../services/next/contracts'
import type { LearningDocument, Lesson, LessonBlock } from '../../../types/v2/content'

type DocumentBlock = Extract<LessonBlock, { kind: 'text' | 'recap' }>
type InteractiveBlock = Exclude<LessonBlock, DocumentBlock>

export type ResolvedDocumentBlock = DocumentBlock & { document: LearningDocument }
export type ResolvedLessonBlock = ResolvedDocumentBlock | InteractiveBlock
export type LessonContent = { lesson: Lesson; blocks: ResolvedLessonBlock[] }

export async function loadLessonContent(
  services: LearningServices,
  lessonId: string,
): Promise<Result<LessonContent>> {
  const lessonResult = await services.lessons.getById(lessonId)
  if (!lessonResult.ok) return lessonResult

  const blocks: ResolvedLessonBlock[] = []
  for (const block of [...lessonResult.value.blocks].sort((a, b) => a.order - b.order)) {
    if (block.kind !== 'text' && block.kind !== 'recap') {
      blocks.push(block)
      continue
    }
    const documentResult = await services.documents.getById(block.documentId)
    if (!documentResult.ok) return documentResult
    blocks.push({ ...block, document: documentResult.value })
  }
  return { ok: true, value: { lesson: lessonResult.value, blocks } }
}
