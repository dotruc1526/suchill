import type { Lesson, MediaAsset, StoryVersion, VisualNovelScene } from '../../types/v2/content.ts'

export type ValidationIssue = { code: string; path: string; message: string }
export type ContentLookup = {
  documentIds?: ReadonlySet<string>
  storyVersionIds?: ReadonlySet<string>
  mediaAssetIds?: ReadonlySet<string>
  questionSetIds?: ReadonlySet<string>
}

function issue(code: string, path: string, message: string): ValidationIssue {
  return { code, path, message }
}

function requireUnique(values: string[], path: string, code: string): ValidationIssue[] {
  const seen = new Set<string>()
  const errors: ValidationIssue[] = []
  for (const value of values) {
    if (!value.trim() || seen.has(value)) errors.push(issue(code, path, `Missing or duplicate identity: ${value || '<empty>'}`))
    seen.add(value)
  }
  return errors
}

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
    if (!ref || (known && !known.has(ref))) errors.push(issue('missing_reference', path, 'Block reference is missing or unknown'))
    if (block.kind === 'video' && block.required && block.completionPolicy === 'optional') {
      errors.push(issue('completion_policy', path, 'Required video cannot have optional completion policy'))
    }
  }
  if (lesson.status === 'published' && lesson.learningObjectiveIds.length === 0) {
    errors.push(issue('objective', 'learningObjectiveIds', 'Published lesson needs an objective'))
  }
  return errors
}

function sceneLinks(scene: VisualNovelScene): string[] {
  return scene.kind === 'choice'
    ? scene.choices.flatMap(choice => choice.nextSceneId ? [choice.nextSceneId] : [])
    : scene.kind === 'end' ? [] : [scene.nextSceneId]
}

export function validateStoryVersion(version: StoryVersion): ValidationIssue[] {
  const errors = requireUnique(version.scenes.map(scene => scene.id), 'scenes', 'scene_id')
  const byId = new Map(version.scenes.map(scene => [scene.id, scene]))
  if (!byId.has(version.startSceneId)) errors.push(issue('start_scene', 'startSceneId', 'Start scene does not exist'))
  for (const [index, scene] of version.scenes.entries()) {
    const path = `scenes[${index}]`
    for (const nextId of sceneLinks(scene)) {
      if (!byId.has(nextId)) errors.push(issue('broken_transition', path, `Target scene does not exist: ${nextId}`))
    }
    if (scene.kind !== 'choice') continue
    errors.push(...requireUnique(scene.choices.map(choice => choice.id), `${path}.choices`, 'choice_id'))
    if (scene.choices.length === 0) errors.push(issue('empty_choice', path, 'Choice scene needs options'))
    const knowledge = scene.choices.filter(choice => choice.kind === 'knowledge_check')
    if (knowledge.length && !knowledge.some(choice => choice.isCorrect)) {
      errors.push(issue('answer_key', path, 'Knowledge check needs a correct option'))
    }
    for (const [choiceIndex, choice] of scene.choices.entries()) {
      if (choice.kind !== 'knowledge_check' && 'isCorrect' in choice) {
        errors.push(issue('narrative_correctness', `${path}.choices[${choiceIndex}]`, 'Narrative choice cannot carry correctness'))
      }
      if (choice.kind === 'knowledge_check' && !choice.explanation.trim()) {
        errors.push(issue('explanation', `${path}.choices[${choiceIndex}]`, 'Knowledge check needs explanation'))
      }
    }
  }
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
    if (!visited.has(scene.id)) errors.push(issue('unreachable_scene', `scenes.${scene.id}`, 'Scene is unreachable'))
  }
  if (version.status === 'published' && (!version.publishedAt || version.sourceIds.length === 0)) {
    errors.push(issue('publish_metadata', 'status', 'Published story needs publish time and sources'))
  }
  return errors
}

export function validateMediaAsset(asset: MediaAsset): ValidationIssue[] {
  const errors: ValidationIssue[] = []
  if (!asset.storageRef.trim()) errors.push(issue('storage_ref', 'storageRef', 'Media storage reference is required'))
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
