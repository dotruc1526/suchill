import type { StoryVersion, VisualNovelScene } from '../../types/v2/content.ts'
import { checkReferences, issue, requireLookup, requireStatus, requireUnique, type ContentLookup, type ValidationIssue } from './validationUtils.ts'

function sceneLinks(scene: VisualNovelScene): string[] {
  return scene.kind === 'choice'
    ? scene.choices.flatMap(choice => choice.nextSceneId ? [choice.nextSceneId] : [])
    : scene.kind === 'end' ? [] : [scene.nextSceneId]
}

export function validateStoryVersion(version: StoryVersion, lookup: ContentLookup = {}): ValidationIssue[] {
  const errors = requireUnique([version.id], 'id', 'entity_id')
  if (!version.storyId.trim()) errors.push(issue('entity_id', 'storyId', 'Story ID is required'))
  errors.push(...requireStatus(version.status, 'status'))
  if (!Number.isInteger(version.versionNumber) || version.versionNumber < 1) {
    errors.push(issue('version_number', 'versionNumber', 'Version number must be a positive integer'))
  }
  errors.push(...checkReferences(version.sourceIds, lookup.sourceIds, 'sourceIds', 'missing_source'))
  errors.push(...requireUnique(version.sourceIds, 'sourceIds', 'source_reference'))
  if (version.status === 'published') {
    if (version.sourceIds.length) {
      errors.push(...requireLookup(lookup, 'sourceIds', 'sourceIds'))
      errors.push(...requireLookup(lookup, 'approvedSourceIds', 'sourceIds'))
    }
    errors.push(...checkReferences(version.sourceIds, lookup.approvedSourceIds, 'sourceIds', 'unapproved_source'))
  }
  errors.push(...requireUnique(version.scenes.map(scene => scene.id), 'scenes', 'scene_id'))
  const byId = new Map(version.scenes.map(scene => [scene.id, scene]))
  // Progress stores locked choice IDs across the whole version, not per scene.
  const choiceIds = new Set<string>()
  if (!byId.has(version.startSceneId)) errors.push(issue('start_scene', 'startSceneId', 'Start scene does not exist'))
  for (const [index, scene] of version.scenes.entries()) {
    const path = `scenes[${index}]`
    errors.push(...requireUnique(scene.sourceIds, `${path}.sourceIds`, 'source_reference'))
    errors.push(...requireUnique(scene.claimIds, `${path}.claimIds`, 'claim_reference'))
    errors.push(...checkReferences(scene.sourceIds, lookup.sourceIds, `${path}.sourceIds`, 'missing_source'))
    errors.push(...checkReferences(scene.claimIds, lookup.claimIds, `${path}.claimIds`, 'missing_claim'))
    if (version.status === 'published') {
      if (scene.sourceIds.length) {
        errors.push(...requireLookup(lookup, 'sourceIds', `${path}.sourceIds`))
        errors.push(...requireLookup(lookup, 'approvedSourceIds', `${path}.sourceIds`))
      }
      if (scene.claimIds.length) {
        errors.push(...requireLookup(lookup, 'claimIds', `${path}.claimIds`))
        errors.push(...requireLookup(lookup, 'approvedClaimIds', `${path}.claimIds`))
      }
      errors.push(...checkReferences(scene.sourceIds, lookup.approvedSourceIds, `${path}.sourceIds`, 'unapproved_source'))
      errors.push(...checkReferences(scene.claimIds, lookup.approvedClaimIds, `${path}.claimIds`, 'unapproved_claim'))
    }
    if (scene.kind === 'media' && lookup.mediaAssetIds && !lookup.mediaAssetIds.has(scene.mediaAssetId)) {
      errors.push(issue('missing_media', `${path}.mediaAssetId`, `Unknown media asset: ${scene.mediaAssetId}`))
    }
    if (scene.kind === 'media' && version.status === 'published' && lookup.approvedMediaAssetIds && !lookup.approvedMediaAssetIds.has(scene.mediaAssetId)) {
      errors.push(issue('unapproved_media', `${path}.mediaAssetId`, 'Published story references media that is not approved/published'))
    }
    if (scene.kind === 'media' && version.status === 'published') {
      errors.push(...requireLookup(lookup, 'mediaAssetIds', `${path}.mediaAssetId`))
      errors.push(...requireLookup(lookup, 'approvedMediaAssetIds', `${path}.mediaAssetId`))
    }
    for (const nextId of sceneLinks(scene)) {
      if (!byId.has(nextId)) errors.push(issue('broken_transition', path, `Target scene does not exist: ${nextId}`))
    }
    if (scene.kind !== 'choice') continue
    if (scene.choices.length === 0) errors.push(issue('empty_choice', path, 'Choice scene needs options'))
    const knowledge = scene.choices.filter(choice => choice.kind === 'knowledge_check')
    if (knowledge.length && !knowledge.some(choice => choice.isCorrect)) {
      errors.push(issue('answer_key', path, 'Knowledge check needs a correct option'))
    }
    for (const [choiceIndex, choice] of scene.choices.entries()) {
      if (!choice.id.trim() || choiceIds.has(choice.id)) {
        errors.push(issue('choice_id', `${path}.choices[${choiceIndex}].id`, `Missing or duplicate choice identity in StoryVersion: ${choice.id || '<empty>'}`))
      }
      choiceIds.add(choice.id)
      if (!choice.nextSceneId && (scene.policy === 'continue_after_feedback' || choice.kind !== 'knowledge_check' || choice.isCorrect)) {
        errors.push(issue('missing_transition', `${path}.choices[${choiceIndex}]`, 'Selected choice needs a next scene'))
      }
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
