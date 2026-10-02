import type { Locale } from '../../types/v2/content.ts'
import type { MockCatalog } from './mock.ts'
import { copy, progressKey, type MockProgressStore } from './mockProgress.ts'
import { failure, success, type Result } from './contracts.ts'
import type { AccountSummary, CompletionOutcome, CompletionReceipt, CompletionReward, CompletionService } from './completionContracts.ts'
import { completionEvidence, completionPolicy } from './mockCompletionEvidence.ts'
import { quizBonusEligible, rewardKey, rewardXp, type RewardType } from './rewardPolicy.ts'
import { streakSummary, localDate } from './mockCompletionTime.ts'

export function createMockCompletionServices(
  catalog: MockCatalog, session: { userId: string; displayName?: string; locale?: Locale; timezone?: string },
  now: () => string, progress: MockProgressStore,
) {
  const store = progress.completion
  const timezone = session.timezone ?? 'Asia/Ho_Chi_Minh'
  const publishedLesson = (id: string) => catalog.lessons.find(item => item.id === id && item.status === 'published')
  const validId = (id: string) => typeof id === 'string' && !!id.trim()
  const context = (lessonId: string) => {
    const lesson = publishedLesson(lessonId)
    const policy = completionPolicy(catalog, lessonId)
    return lesson && policy ? { lesson, policy, evidence: completionEvidence(catalog, progress, session.userId, lesson) } : null
  }
  const service: CompletionService = {
    async recordBlockAction(input) {
      if (!validId(session.userId)) return failure('unauthorized')
      if (!validId(input.operationId) || !validId(input.lessonId) || !validId(input.blockId) ||
        Object.keys(input).some(key => !['lessonId', 'blockId', 'operationId', 'action'].includes(key))) return failure('validation')
      const ctx = context(input.lessonId)
      const block = ctx?.lesson.blocks.find(item => item.id === input.blockId)
      if (!ctx || !block) return failure('not_found')
      const allowed = input.action === 'acknowledge' ? ['text', 'recap'].includes(block.kind) :
        ['accessible_fallback', 'media_fallback'].includes(input.action) && block.kind === 'video' &&
        ctx.policy.videoFallbacks?.some(item => item.blockId === block.id)
      if (!allowed) return failure('validation')
      const key = progressKey(session.userId, input.operationId)
      const signature = JSON.stringify(['action', input.lessonId, ctx.policy.contentVersionId, input.blockId, input.action])
      const prior = store.operations.get(key)
      if (prior) return prior.signature === signature ? success(null) : failure('conflict')
      store.actions.set(ctx.evidence.keyFor(block), input.action)
      store.operations.set(key, { signature, receipt: null })
      return success(null)
    },
    async getLessonCompletion(lessonId) {
      if (!validId(session.userId)) return failure('unauthorized')
      const ctx = context(lessonId)
      if (!ctx) return failure(publishedLesson(lessonId) ? 'validation' : 'not_found')
      return success(copy(store.receipts.get(progressKey(session.userId, lessonId, ctx.policy.contentVersionId)) ?? null))
    },
    async completeLesson(input): Promise<Result<CompletionOutcome>> {
      if (!validId(session.userId)) return failure('unauthorized')
      if (!validId(input.lessonId) || !validId(input.operationId) ||
        Object.keys(input).some(key => !['lessonId', 'operationId'].includes(key))) return failure('validation')
      const ctx = context(input.lessonId)
      if (!ctx) return failure(publishedLesson(input.lessonId) ? 'validation' : 'not_found')
      const { lesson, policy, evidence } = ctx
      const signature = JSON.stringify(['complete', lesson.id, policy.contentVersionId])
      const operationKey = progressKey(session.userId, input.operationId)
      const priorOperation = store.operations.get(operationKey)
      if (priorOperation) return priorOperation.signature === signature && priorOperation.receipt
        ? success({ kind: priorOperation.outcome ?? 'completed', receipt: copy(priorOperation.receipt) }) : failure('conflict')
      const receiptKey = progressKey(session.userId, lesson.id, policy.contentVersionId)
      const prior = store.receipts.get(receiptKey)
      if (prior) {
        const receipt = copy(prior)
        receipt.rewards = receipt.rewards.map(item => ({ ...item, status: 'already_granted', xpDelta: 0 }))
        store.operations.set(operationKey, { signature, receipt: copy(receipt), outcome: 'already_completed' })
        return success({ kind: 'already_completed', receipt })
      }
      const reasons = lesson.blocks.filter(block => block.required && !evidence.valid(block))
        .map(block => ({ blockId: block.id, reason: 'required_evidence_missing' }))
      if (!lesson.blocks.length) return failure('validation')
      if (reasons.length) return success({ kind: 'ineligible', reasons })
      // Prepare all fallible values before the synchronous mock transaction writes.
      const confirmedAt = now()
      let day: string
      try { day = localDate(confirmedAt, timezone) } catch { return failure('validation') }
      const requested: Array<{ type: Exclude<RewardType, 'daily_review'>; id: string }> = []
      if (lesson.format !== 'visual_novel' && lesson.format !== 'quiz') requested.push({ type: 'lesson', id: lesson.id })
      for (const block of lesson.blocks.filter(item => item.required)) {
        if (block.kind === 'visual_novel') {
          const story = catalog.storyVersions.find(item => item.id === block.storyVersionId)!
          requested.push({ type: 'episode', id: story.storyId })
        }
        if (block.kind === 'quiz' && block.assessmentMode === 'scored' && policy.rewardedAssessmentIds?.includes(block.questionSetId)) {
          requested.push({ type: 'quiz', id: block.questionSetId })
          const grade = store.quizzes.get(progressKey(session.userId, block.questionSetId, policy.contentVersionId))!
          if (quizBonusEligible(grade.score, grade.total)) requested.push({ type: 'quiz_bonus', id: block.questionSetId })
        }
      }
      const rewards: CompletionReward[] = []
      for (const item of requested) {
        const key = rewardKey(session.userId, item.type, item.id, policy.eligibilityVersion)
        if (rewards.some(reward => reward.eligibilityKey === key)) continue
        const existing = store.rewards.has(key)
        rewards.push({ rewardType: item.type, activityId: item.id, eligibilityVersion: policy.eligibilityVersion,
          eligibilityKey: key, status: existing ? 'already_granted' : 'granted', xpDelta: existing ? 0 : rewardXp(item.type) })
      }
      const methods = lesson.blocks.filter(item => item.required).map(block => store.actions.get(evidence.keyFor(block)))
      const receipt: CompletionReceipt = {
        userId: session.userId, lessonId: lesson.id, contentVersionId: policy.contentVersionId, confirmedAt,
        method: methods.includes('accessible_fallback') ? 'accessible_fallback' : methods.includes('media_fallback') ? 'media_fallback' : 'standard',
        reason: 'required_blocks_satisfied', rewards,
      }
      for (const reward of rewards.filter(item => item.status === 'granted')) {
        store.rewards.set(reward.eligibilityKey, { ...reward, userId: session.userId, confirmedAt })
      }
      // Qualify by activity identity, independent of the containing lesson's count.
      // Minor corrections / reuse in another lesson cannot qualify a new day.
      const qualifying = requested.filter(item => item.type === 'episode' || item.type === 'quiz')
      if (policy.requiredLesson) qualifying.push({ type: 'lesson', id: lesson.id })
      for (const activity of qualifying) {
        const qualificationKey = rewardKey(session.userId, activity.type, activity.id, policy.eligibilityVersion)
        if (store.qualifiedActivities.has(qualificationKey)) continue
        store.qualifiedActivities.add(qualificationKey)
        const days = store.days.get(session.userId) ?? new Set<string>()
        days.add(day); store.days.set(session.userId, days)
      }
      if (policy.requiredLesson) {
        const lessons = store.requiredLessons.get(session.userId) ?? new Set<string>()
        lessons.add(lesson.id); store.requiredLessons.set(session.userId, lessons)
      }
      store.receipts.set(receiptKey, copy(receipt))
      store.operations.set(operationKey, { signature, receipt: copy(receipt), outcome: 'completed' })
      const lessonKey = progressKey(session.userId, lesson.id)
      const saved = progress.lessons.get(lessonKey)
      progress.lessons.set(lessonKey, { ...saved, userId: session.userId, lessonId: lesson.id, status: 'completed',
        completedBlockIds: lesson.blocks.filter(item => item.required).map(item => item.id),
        startedAt: saved?.startedAt ?? confirmedAt, completedAt: confirmedAt, updatedAt: confirmedAt })
      return success({ kind: 'completed', receipt: copy(receipt) })
    },
  }
  async function getAccountSummary(): Promise<Result<AccountSummary | null>> {
    if (!validId(session.userId)) return failure('unauthorized')
    let today: string
    try { today = localDate(now(), timezone) } catch { return failure('validation') }
    const streak = streakSummary(store.days.get(session.userId) ?? new Set(), today)
    return success({ userId: session.userId, displayName: session.displayName ?? '', locale: session.locale ?? 'vi-VN', timezone,
      totalXp: [...store.rewards.values()].filter(item => item.userId === session.userId).reduce((sum, item) => sum + item.xpDelta, 0),
      currentStreak: streak.current, longestStreak: streak.longest,
      requiredLessonCount: store.requiredLessons.get(session.userId)?.size ?? 0, achievements: [] })
  }
  return { service, getAccountSummary }
}
