import type { Lesson, LessonBlock } from '../../types/v2/content.ts'
import type { CompletionMethod } from './accountContracts.ts'
import type { MockCatalog } from './mock.ts'
import type { MockProgressStore } from './mockProgress.ts'
import { accountKey } from './mockAccountStore.ts'
import { mockQuizSatisfied } from './mockAccount.ts'
import { videoThresholdReached } from './rewardPolicy.ts'

export function mockBlockEligible(
  catalog: MockCatalog, store: MockProgressStore, userId: string, lesson: Lesson, block: LessonBlock, method: CompletionMethod,
): boolean {
  if (block.kind !== 'video' && method !== 'standard') return false
  if (block.kind === 'text' || block.kind === 'recap') {
    return catalog.documents?.some(document => document.id === block.documentId && document.status === 'published') === true
  }
  if (block.kind === 'quiz') return mockQuizSatisfied(store.accountStore, userId, block.questionSetId, block.assessmentMode)
  if (block.kind === 'visual_novel') {
    const story = catalog.storyVersions.find(story => story.id === block.storyVersionId && story.status === 'published')
    const progress = store.episodes.get(accountKey(userId, block.storyVersionId))
    if (!story || !progress || !story.scenes.some(scene => scene.id === progress.currentSceneId && scene.kind === 'end')) return false
    const requiredIds = catalog.requiredStoryCheckSceneIds?.[story.id] ?? []
    if (requiredIds.some(id => !story.scenes.some(scene => scene.id === id && scene.kind === 'choice'))) return false
    return story.scenes.filter(scene => scene.kind === 'choice' && (progress.visitedSceneIds.includes(scene.id) || requiredIds.includes(scene.id))).every(scene =>
      scene.kind !== 'choice' || !scene.choices.some(choice => choice.kind === 'knowledge_check') ||
      scene.choices.some(choice => choice.kind === 'knowledge_check' && progress.lockedChoiceIds.includes(choice.id)))
  }
  const asset = catalog.mediaAssets.find(asset => asset.id === block.mediaAssetId && asset.kind === 'video' && asset.reviewStatus === 'published')
  if (!asset) return false
  if (method !== 'standard') {
    const transcript = catalog.mediaResources?.some(resource => resource.id === asset.transcriptRef && resource.kind === 'transcript' && resource.reviewStatus === 'published')
    const poster = catalog.mediaAssets.some(item => item.id === asset.posterMediaId && item.reviewStatus === 'published' && Boolean(item.altText?.trim()))
    if (!transcript && !(method === 'media_fallback' && poster)) return false
    const recapComplete = lesson.blocks.some(item => item.kind === 'recap' && item.required && item.order > block.order &&
      store.accountStore.blocks.has(accountKey(userId, lesson.id, item.id)))
    const checkComplete = block.knowledgeCheckSetId && mockQuizSatisfied(store.accountStore, userId, block.knowledgeCheckSetId)
    return Boolean(recapComplete || checkComplete)
  }
  if (block.knowledgeCheckSetId && !mockQuizSatisfied(store.accountStore, userId, block.knowledgeCheckSetId)) return false
  if (block.completionPolicy === 'optional') return true
  const duration = asset.durationSeconds ?? 0
  const progress = store.videos.get(accountKey(userId, lesson.id, block.id))
  if (!progress || duration <= 0) return false
  if (block.completionPolicy === 'watch_threshold') return videoThresholdReached(progress.watchedRanges, duration)
  const endTolerance = Math.min(2, duration * 0.02)
  return progress.positionSeconds >= duration - endTolerance && progress.watchedRanges.some(range =>
    range.end >= duration - endTolerance && range.end - range.start >= Math.min(2, duration))
}
