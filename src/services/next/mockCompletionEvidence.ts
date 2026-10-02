import type { Lesson, LessonBlock } from '../../types/v2/content.ts'
import type { MockCatalog } from './mock.ts'
import type { MockProgressStore } from './mockProgress.ts'
import { progressKey } from './mockProgress.ts'
import { videoThresholdReached } from './rewardPolicy.ts'

export const evidenceKey = (userId: string, lessonId: string, version: string, blockId: string) =>
  progressKey(userId, lessonId, version, blockId)
export const completionPolicy = (catalog: MockCatalog, lessonId: string) => {
  const matches = catalog.completionPolicies?.filter(item => item.lessonId === lessonId) ?? []
  const policy = matches[0]
  return matches.length === 1 && typeof policy?.contentVersionId === 'string' && policy.contentVersionId.trim() &&
    typeof policy.eligibilityVersion === 'string' && policy.eligibilityVersion.trim() && typeof policy.requiredLesson === 'boolean' ? policy : null
}
export function completionEvidence(catalog: MockCatalog, store: MockProgressStore, userId: string, lesson: Lesson) {
  const policy = completionPolicy(catalog, lesson.id)!
  const evidence = store.completion
  const keyFor = (block: LessonBlock) => evidenceKey(userId, lesson.id, policy.contentVersionId, block.id)
  const quizValid = (setId: string, mode: 'practice' | 'scored') => {
    const fixture = catalog.quizzes?.find(item => item.set.id === setId && item.set.mode === mode && item.status === 'published')
    const receipt = evidence.quizzes.get(progressKey(userId, setId, policy.contentVersionId))
    return !!fixture && !!receipt && receipt.total > 0 && receipt.total === fixture.set.questionIds.length &&
      fixture.questions.every(item => item.status === 'published') &&
      receipt.feedback.length === receipt.total && (mode === 'practice' || receipt.passed)
  }
  const valid = (block: LessonBlock): boolean => {
    const key = keyFor(block)
    if (block.kind === 'text' || block.kind === 'recap') {
      return catalog.documents?.some(item => item.id === block.documentId && item.status === 'published') === true &&
        evidence.actions.get(key) === 'acknowledge'
    }
    if (block.kind === 'quiz') return quizValid(block.questionSetId, block.assessmentMode)
    if (block.kind === 'visual_novel') {
      const story = catalog.storyVersions.find(item => item.id === block.storyVersionId && item.status === 'published')
      const progress = evidence.episodes.get(key)
      if (!story || !progress || progress.userId !== userId || progress.storyVersionId !== story.id) return false
      // Resolve the actual selected path. A checkpoint jumping to end is insufficient.
      const choices = evidence.choices.get(key)
      const visited = new Set<string>()
      let id: string | undefined = story.startSceneId
      while (id && !visited.has(id)) {
        visited.add(id)
        const scene = story.scenes.find(item => item.id === id)
        if (!scene) return false
        if (scene.kind === 'end') return progress.currentSceneId === scene.id
        if (scene.kind === 'choice') {
          const choice = scene.choices.find(item => item.id === choices?.get(scene.id))
          if (!choice || (choice.kind === 'knowledge_check' && scene.policy === 'retry_until_correct' && !choice.isCorrect)) return false
          id = choice.nextSceneId
        } else id = scene.nextSceneId
      }
      return false
    }
    if (block.completionPolicy === 'optional') return true
    if (block.knowledgeCheckSetId) {
      const quiz = catalog.quizzes?.find(item => item.set.id === block.knowledgeCheckSetId)
      if (!quiz || !quizValid(quiz.set.id, quiz.set.mode)) return false
    }
    const asset = catalog.mediaAssets.find(item => item.id === block.mediaAssetId && item.reviewStatus === 'published' && item.kind === 'video')
    const progress = evidence.videos.get(key)
    if (asset?.durationSeconds && progress?.userId === userId && progress.lessonId === lesson.id && progress.blockId === block.id) {
      if (block.completionPolicy === 'watch_threshold' && videoThresholdReached(progress.watchedRanges, asset.durationSeconds)) return true
      if (block.completionPolicy === 'reach_end' && progress.watchedRanges.some(range => range.start < asset.durationSeconds! * 0.95 && range.end >= asset.durationSeconds! * 0.98)) return true
    }
    const fallback = policy.videoFallbacks?.find(item => item.blockId === block.id)
    const action = evidence.actions.get(key)
    if (!asset || !fallback || !['accessible_fallback', 'media_fallback'].includes(action ?? '')) return false
    const transcript = catalog.mediaResources?.find(item => item.id === asset.transcriptRef && item.reviewStatus === 'published' && item.kind === 'transcript')
    const check = lesson.blocks.find(item => item.id === fallback.checkBlockId && item.required && (item.kind === 'quiz' || item.kind === 'recap'))
    return !!transcript && !!check && valid(check)
  }
  return { valid, keyFor, quizValid }
}
