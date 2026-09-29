import type {
  Chapter,
  Lesson,
  MediaAsset,
  MultipleChoiceQuestion,
  QuestionSet,
  StoryVersion,
  VisualNovelScene,
} from '../../types/v2/content.ts'

export type ValidationIssue = {
  code: string
  path: string
  message: string
}

export type ContentLookup = {
  documentIds?: ReadonlySet<string>
  storyVersionIds?: ReadonlySet<string>
  mediaAssetIds?: ReadonlySet<string>
  questionSetIds?: ReadonlySet<string>
  questionIds?: ReadonlySet<string>
  lessonIds?: ReadonlySet<string>
  learningObjectiveIds?: ReadonlySet<string>
  sourceIds?: ReadonlySet<string>
  claimIds?: ReadonlySet<string>
}

function issue(code: string, path: string, message: string): ValidationIssue {
  return { code, path, message }
}

function requireUnique(values: string[], path: string, code: string): ValidationIssue[] {
  const seen = new Set<string>()
  const errors: ValidationIssue[] = []
  for (const value of values) {
    if (!value.trim() || seen.has(value)) {
      errors.push(issue(code, path, `Missing or duplicate identity: ${value || '<empty>'}`))
    }
    seen.add(value)
  }
  return errors
}

/**
 * Validates a Chapter domain entity against Phase 5 invariants.
 */
export function validateChapter(chapter: Chapter, lookup: ContentLookup = {}): ValidationIssue[] {
  const errors: ValidationIssue[] = []

  if (!chapter.id?.trim()) {
    errors.push(issue('chapter_id', 'id', 'Chapter ID is required'))
  }
  if (!chapter.title?.trim()) {
    errors.push(issue('chapter_title', 'title', 'Chapter title is required'))
  }
  if (!chapter.slug?.trim()) {
    errors.push(issue('chapter_slug', 'slug', 'Chapter slug is required'))
  }

  // Validate lessonRefs
  const lessonIds = chapter.lessonRefs.map(ref => ref.id)
  errors.push(...requireUnique(lessonIds, 'lessonRefs', 'lesson_ref_id'))

  const orders = chapter.lessonRefs.map(ref => ref.order)
  errors.push(...requireUnique(orders.map(String), 'lessonRefs.order', 'lesson_ref_order'))
  if (orders.some(order => !Number.isInteger(order) || order < 0)) {
    errors.push(issue('lesson_ref_order', 'lessonRefs.order', 'Lesson reference order must be a nonnegative integer'))
  }

  if (lookup.lessonIds) {
    for (const [index, ref] of chapter.lessonRefs.entries()) {
      if (!lookup.lessonIds.has(ref.id)) {
        errors.push(issue('missing_lesson_reference', `lessonRefs[${index}]`, `Referenced lesson does not exist: ${ref.id}`))
      }
    }
  }

  if (chapter.coverMediaId && lookup.mediaAssetIds && !lookup.mediaAssetIds.has(chapter.coverMediaId)) {
    errors.push(issue('missing_cover_media', 'coverMediaId', `Referenced cover media does not exist: ${chapter.coverMediaId}`))
  }

  if (chapter.status === 'published') {
    if (chapter.lessonRefs.length === 0) {
      errors.push(issue('empty_chapter', 'lessonRefs', 'Published chapter must contain at least one lesson'))
    }
    if (chapter.learningObjectiveIds.length === 0) {
      errors.push(issue('missing_objective', 'learningObjectiveIds', 'Published chapter needs at least one learning objective'))
    }
  }

  return errors
}

/**
 * Validates a Lesson domain entity against Phase 5 invariants.
 */
export function validateLesson(lesson: Lesson, lookup: ContentLookup = {}): ValidationIssue[] {
  const errors = requireUnique(lesson.blocks.map(block => block.id), 'blocks', 'block_id')
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
    if (!ref || (known && !known.has(ref))) {
      errors.push(issue('missing_reference', path, 'Block reference is missing or unknown'))
    }
    if (block.kind === 'video' && block.required && block.completionPolicy === 'optional') {
      errors.push(issue('completion_policy', path, 'Required video cannot have optional completion policy'))
    }
  }

  if (lesson.status === 'published') {
    if (lesson.learningObjectiveIds.length === 0) {
      errors.push(issue('objective', 'learningObjectiveIds', 'Published lesson needs an objective'))
    }
    if (lesson.blocks.length === 0) {
      errors.push(issue('empty_lesson', 'blocks', 'Published lesson needs at least one block'))
    }
  }

  return errors
}

function sceneLinks(scene: VisualNovelScene): string[] {
  return scene.kind === 'choice'
    ? scene.choices.flatMap(choice => choice.nextSceneId ? [choice.nextSceneId] : [])
    : scene.kind === 'end' ? [] : [scene.nextSceneId]
}

/**
 * Validates a Visual Novel StoryVersion entity against Phase 5 graph and invariant rules.
 */
export function validateStoryVersion(version: StoryVersion, lookup: ContentLookup = {}): ValidationIssue[] {
  const errors = requireUnique(version.scenes.map(scene => scene.id), 'scenes', 'scene_id')
  const byId = new Map(version.scenes.map(scene => [scene.id, scene]))

  if (!byId.has(version.startSceneId)) {
    errors.push(issue('start_scene', 'startSceneId', 'Start scene does not exist'))
  }

  for (const [index, scene] of version.scenes.entries()) {
    const path = `scenes[${index}]`
    for (const nextId of sceneLinks(scene)) {
      if (!byId.has(nextId)) {
        errors.push(issue('broken_transition', path, `Target scene does not exist: ${nextId}`))
      }
    }

    if (scene.kind === 'media' && lookup.mediaAssetIds && !lookup.mediaAssetIds.has(scene.mediaAssetId)) {
      errors.push(issue('missing_media_asset', `${path}.mediaAssetId`, `Referenced media asset does not exist: ${scene.mediaAssetId}`))
    }

    if (scene.kind !== 'choice') continue

    errors.push(...requireUnique(scene.choices.map(choice => choice.id), `${path}.choices`, 'choice_id'))
    if (scene.choices.length === 0) {
      errors.push(issue('empty_choice', path, 'Choice scene needs options'))
    }

    const knowledge = scene.choices.filter(choice => choice.kind === 'knowledge_check')
    if (knowledge.length && !knowledge.some(choice => choice.isCorrect)) {
      errors.push(issue('answer_key', path, 'Knowledge check needs a correct option'))
    }

    for (const [choiceIndex, choice] of scene.choices.entries()) {
      const choicePath = `${path}.choices[${choiceIndex}]`
      if (!choice.nextSceneId && (scene.policy === 'continue_after_feedback' || choice.kind !== 'knowledge_check' || choice.isCorrect)) {
        errors.push(issue('missing_transition', choicePath, 'Selected choice needs a next scene'))
      }
      if (choice.kind !== 'knowledge_check' && 'isCorrect' in choice) {
        errors.push(issue('narrative_correctness', choicePath, 'Narrative choice cannot carry correctness'))
      }
      if (choice.kind === 'knowledge_check' && !choice.explanation.trim()) {
        errors.push(issue('explanation', choicePath, 'Knowledge check needs explanation'))
      }
    }
  }

  // Reachability analysis from startSceneId
  const visited = new Set<string>()
  const queue = [version.startSceneId]
  while (queue.length) {
    const id = queue.shift()!
    if (visited.has(id) || !byId.has(id)) continue
    visited.add(id)
    queue.push(...sceneLinks(byId.get(id)!))
  }

  if (![...visited].some(id => byId.get(id)?.kind === 'end')) {
    errors.push(issue('no_reachable_end', 'scenes', 'No end scene is reachable from start'))
  }

  for (const scene of version.scenes) {
    if (!visited.has(scene.id)) {
      errors.push(issue('unreachable_scene', `scenes.${scene.id}`, 'Scene is unreachable'))
    }
  }

  if (version.status === 'published') {
    if (!version.publishedAt || version.sourceIds.length === 0) {
      errors.push(issue('publish_metadata', 'status', 'Published story needs publish time and sources'))
    }
    if (version.learningObjectiveIds.length === 0) {
      errors.push(issue('publish_objective', 'learningObjectiveIds', 'Published story needs at least one learning objective'))
    }
  }

  return errors
}

/**
 * Validates a MediaAsset entity against Phase 3/5 governance rules.
 */
export function validateMediaAsset(asset: MediaAsset): ValidationIssue[] {
  const errors: ValidationIssue[] = []

  if (!asset.storageRef?.trim()) {
    errors.push(issue('storage_ref', 'storageRef', 'Media storage reference is required'))
  }

  if (asset.reviewStatus === 'published' || asset.reviewStatus === 'approved') {
    if (!asset.sourceIds?.length || !asset.license?.trim() || !asset.attribution?.trim()) {
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

/**
 * Validates a MultipleChoiceQuestion entity against Phase 5/8 rules.
 */
export function validateQuestion(question: MultipleChoiceQuestion): ValidationIssue[] {
  const errors: ValidationIssue[] = []

  if (!question.id?.trim()) {
    errors.push(issue('question_id', 'id', 'Question ID is required'))
  }
  if (!question.prompt?.trim()) {
    errors.push(issue('question_prompt', 'prompt', 'Question prompt cannot be empty'))
  }
  if (!question.explanation?.trim()) {
    errors.push(issue('question_explanation', 'explanation', 'Question explanation is required'))
  }
  if (question.optionIds.length < 2) {
    errors.push(issue('question_options', 'optionIds', 'Question must have at least two options'))
  }

  errors.push(...requireUnique(question.optionIds, 'optionIds', 'option_id'))

  if (question.status === 'published' && question.sourceIds.length === 0) {
    errors.push(issue('question_sources', 'sourceIds', 'Published question must have traceable source IDs'))
  }

  return errors
}

/**
 * Validates a QuestionSet entity against Phase 5/8 rules.
 */
export function validateQuestionSet(questionSet: QuestionSet, lookup: ContentLookup = {}): ValidationIssue[] {
  const errors: ValidationIssue[] = []

  if (!questionSet.id?.trim()) {
    errors.push(issue('question_set_id', 'id', 'QuestionSet ID is required'))
  }
  if (!questionSet.title?.trim()) {
    errors.push(issue('question_set_title', 'title', 'QuestionSet title is required'))
  }
  if (questionSet.questionIds.length === 0) {
    errors.push(issue('empty_question_set', 'questionIds', 'QuestionSet must contain at least one question'))
  }
  if (questionSet.learningObjectiveIds.length === 0) {
    errors.push(issue('question_set_objective', 'learningObjectiveIds', 'QuestionSet needs at least one learning objective'))
  }

  errors.push(...requireUnique(questionSet.questionIds, 'questionIds', 'question_id'))

  if (lookup.questionIds) {
    for (const [index, qId] of questionSet.questionIds.entries()) {
      if (!lookup.questionIds.has(qId)) {
        errors.push(issue('missing_question_reference', `questionIds[${index}]`, `Referenced question does not exist: ${qId}`))
      }
    }
  }

  return errors
}
