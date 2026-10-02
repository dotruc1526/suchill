import type { Chapter, HistoricalClaim, Lesson, MediaAsset } from '../../types/v2/content.ts'
import { checkReferences, issue, requireLookup, requireStatus, requireUnique, type ContentLookup, type ValidationIssue } from './validationUtils.ts'

export { validateStoryVersion } from './storyValidation.ts'
export type { ContentLookup, ValidationIssue } from './validationUtils.ts'

export function validateChapter(chapter: Chapter, lookup: ContentLookup = {}): ValidationIssue[] {
  const errors = requireUnique([chapter.id], 'id', 'entity_id')
  errors.push(...requireStatus(chapter.status, 'status'))
  errors.push(...requireUnique(chapter.lessonRefs.map(ref => ref.id), 'lessonRefs', 'lesson_reference'))
  errors.push(...requireUnique(chapter.lessonRefs.map(ref => String(ref.order)), 'lessonRefs.order', 'lesson_order'))
  if (!Number.isInteger(chapter.estimatedMinutes) || chapter.estimatedMinutes < 0) {
    errors.push(issue('duration', 'estimatedMinutes', 'Estimated minutes must be a nonnegative integer'))
  }
  for (const [index, ref] of chapter.lessonRefs.entries()) {
    if (!Number.isInteger(ref.order) || ref.order < 0) errors.push(issue('lesson_order', `lessonRefs[${index}].order`, 'Order must be a nonnegative integer'))
  }
  errors.push(...checkReferences(chapter.lessonRefs.map(ref => ref.id), lookup.lessonIds, 'lessonRefs', 'missing_lesson'))
  if (chapter.status === 'published') {
    if (!chapter.learningObjectiveIds.length) errors.push(issue('objective', 'learningObjectiveIds', 'Published chapter needs an objective'))
    errors.push(...requireUnique(chapter.learningObjectiveIds, 'learningObjectiveIds', 'objective'))
    if (chapter.lessonRefs.length) {
      errors.push(...requireLookup(lookup, 'lessonIds', 'lessonRefs'))
      errors.push(...requireLookup(lookup, 'approvedLessonIds', 'lessonRefs'))
    }
    errors.push(...checkReferences(chapter.lessonRefs.map(ref => ref.id), lookup.approvedLessonIds, 'lessonRefs', 'unapproved_lesson'))
  }
  return errors
}

export function validateLesson(lesson: Lesson, lookup: ContentLookup = {}): ValidationIssue[] {
  const errors = requireUnique([lesson.id], 'id', 'entity_id')
  if (!lesson.chapterId.trim()) errors.push(issue('missing_chapter', 'chapterId', 'Chapter ID is required'))
  errors.push(...requireStatus(lesson.status, 'status'))
  errors.push(...checkReferences([lesson.chapterId], lookup.chapterIds, 'chapterId', 'missing_chapter'))
  if (!Number.isInteger(lesson.estimatedMinutes) || lesson.estimatedMinutes < 0) {
    errors.push(issue('duration', 'estimatedMinutes', 'Estimated minutes must be a nonnegative integer'))
  }
  errors.push(...requireUnique(lesson.blocks.map(block => block.id), 'blocks', 'block_id'))
  const orders = lesson.blocks.map(block => block.order)
  errors.push(...requireUnique(orders.map(String), 'blocks.order', 'block_order'))
  if (orders.some(order => !Number.isInteger(order) || order < 0)) {
    errors.push(issue('block_order', 'blocks.order', 'Block order must be a nonnegative integer'))
  }
  for (const [index, block] of lesson.blocks.entries()) {
    const path = `blocks[${index}]`
    let ref: string
    let known: ReadonlySet<string> | undefined
    switch (block.kind) {
      case 'text':
      case 'recap':
        ref = block.documentId
        known = lookup.documentIds
        break
      case 'visual_novel':
        ref = block.storyVersionId
        known = lookup.storyVersionIds
        break
      case 'video':
        ref = block.mediaAssetId
        known = lookup.mediaAssetIds
        break
      case 'quiz':
        ref = block.questionSetId
        known = lookup.questionSetIds
        break
    }
    if (!ref || (known && !known.has(ref))) errors.push(issue('missing_reference', path, 'Block reference is missing or unknown'))
    if (lesson.status === 'published') {
      const approved = block.kind === 'text' || block.kind === 'recap' ? lookup.approvedDocumentIds
        : block.kind === 'visual_novel' ? lookup.approvedStoryVersionIds
          : block.kind === 'video' ? lookup.approvedMediaAssetIds : lookup.approvedQuestionSetIds
      const knownKey = block.kind === 'text' || block.kind === 'recap' ? 'documentIds'
        : block.kind === 'visual_novel' ? 'storyVersionIds'
          : block.kind === 'video' ? 'mediaAssetIds' : 'questionSetIds'
      const approvedKey = block.kind === 'text' || block.kind === 'recap' ? 'approvedDocumentIds'
        : block.kind === 'visual_novel' ? 'approvedStoryVersionIds'
          : block.kind === 'video' ? 'approvedMediaAssetIds' : 'approvedQuestionSetIds'
      errors.push(...requireLookup(lookup, knownKey, path))
      errors.push(...requireLookup(lookup, approvedKey, path))
      if (approved && !approved.has(ref)) errors.push(issue('unapproved_reference', path, 'Published lesson references content that is not approved/published'))
    }
    if (block.kind === 'video' && block.required && block.completionPolicy === 'optional') {
      errors.push(issue('completion_policy', path, 'Required video cannot have optional completion policy'))
    }
  }
  if (lesson.status === 'published') {
    if (!lesson.learningObjectiveIds.length) errors.push(issue('objective', 'learningObjectiveIds', 'Published lesson needs an objective'))
    errors.push(...requireUnique(lesson.learningObjectiveIds, 'learningObjectiveIds', 'objective'))
  }
  if (lesson.status === 'published') errors.push(...requireLookup(lookup, 'chapterIds', 'chapterId'))
  return errors
}

export function validateMediaAsset(asset: MediaAsset, lookup: ContentLookup = {}): ValidationIssue[] {
  const errors: ValidationIssue[] = requireUnique([asset.id], 'id', 'entity_id')
  errors.push(...requireStatus(asset.reviewStatus, 'reviewStatus'))
  if (!['image', 'video', 'audio', 'illustration'].includes(asset.kind)) {
    errors.push(issue('media_kind', 'kind', `Unknown media kind: ${asset.kind}`))
  }
  errors.push(...checkReferences(asset.sourceIds, lookup.sourceIds, 'sourceIds', 'missing_source'))
  errors.push(...requireUnique(asset.sourceIds, 'sourceIds', 'source_reference'))
  if (asset.reviewStatus === 'published' || asset.reviewStatus === 'approved') {
    if (asset.sourceIds.length) {
      errors.push(...requireLookup(lookup, 'sourceIds', 'sourceIds'))
      errors.push(...requireLookup(lookup, 'approvedSourceIds', 'sourceIds'))
    }
    errors.push(...checkReferences(asset.sourceIds, lookup.approvedSourceIds, 'sourceIds', 'unapproved_source'))
  }
  if (!asset.storageRef.trim()) errors.push(issue('storage_ref', 'storageRef', 'Media storage reference is required'))
  if (asset.durationSeconds !== undefined && (!Number.isFinite(asset.durationSeconds) || asset.durationSeconds < 0)) {
    errors.push(issue('duration', 'durationSeconds', 'Media duration must be nonnegative'))
  }
  if (asset.reviewStatus === 'published' || asset.reviewStatus === 'approved') {
    if (!asset.sourceIds.length || !asset.license?.trim() || !asset.attribution?.trim()) {
      errors.push(issue('media_provenance', 'sourceIds', 'Approved media needs source, license and attribution'))
    }
    if ((asset.kind === 'image' || asset.kind === 'illustration') && !asset.altText?.trim()) {
      errors.push(issue('media_accessibility', 'altText', 'Published image needs alternative text'))
    }
    if (asset.kind === 'video' && (!asset.posterMediaId || !asset.transcriptRef || !asset.captionTrackRefs?.length)) {
      errors.push(issue('media_accessibility', 'captionTrackRefs', 'Published video needs poster, transcript and captions'))
    }
  }
  return errors
}

export function validateHistoricalClaim(claim: HistoricalClaim, lookup: ContentLookup = {}): ValidationIssue[] {
  const errors = requireUnique([claim.id], 'id', 'entity_id')
  errors.push(...requireStatus(claim.reviewStatus, 'reviewStatus'))
  if (!claim.statement.trim()) errors.push(issue('claim_statement', 'statement', 'Claim statement is required'))
  errors.push(...requireUnique(claim.sourceIds, 'sourceIds', 'source_reference'))
  errors.push(...checkReferences(claim.sourceIds, lookup.sourceIds, 'sourceIds', 'missing_source'))
  if (claim.reviewStatus === 'approved' || claim.reviewStatus === 'published') {
    if (claim.sourceIds.length === 0) errors.push(issue('claim_source', 'sourceIds', 'Approved claim needs at least one source'))
    if (claim.sourceIds.length) {
      errors.push(...requireLookup(lookup, 'sourceIds', 'sourceIds'))
      errors.push(...requireLookup(lookup, 'approvedSourceIds', 'sourceIds'))
    }
    errors.push(...checkReferences(claim.sourceIds, lookup.approvedSourceIds, 'sourceIds', 'unapproved_source'))
  }
  return errors
}
