import type { CompletionMethod, CompletionReceipt, CompletionService } from './accountContracts.ts'
import type { MockCatalog } from './mock.ts'
import type { MockProgressStore } from './mockProgress.ts'
import { failure, success, type Result } from './contracts.ts'
import { accountKey, clone, ensureMockAccount, expectedMockSubject, mockCurrentStreak, mockLocalDate, mockTotalXp, type MockSession } from './mockAccountStore.ts'
import { grantMockReward, qualifyMockStreak } from './mockAccountRewards.ts'
import { mockBlockEligible } from './mockAccountEligibility.ts'

export function createMockCompletionService(catalog: MockCatalog, store: MockProgressStore, session: MockSession, now: () => string): CompletionService {
  const authority = store.accountStore
  const run = <T>(operationId: string, signature: string, write: () => Result<T>): Result<T> => {
    if (!session.userId) return failure('unauthorized')
    if (!operationId?.trim()) return failure('validation')
    const key = accountKey(session.userId, operationId)
    const prior = store.operations.get(key)
    if (prior) return prior.signature === signature ? success(clone(prior.result) as T) : failure('conflict')
    const result = write()
    if (result.ok) store.operations.set(key, { signature, result: clone(result.value) })
    return clone(result)
  }
  const receipt = (lessonId: string, xpGranted: number, alreadyCompleted: boolean): CompletionReceipt => ({
    status: 'confirmed', lessonId, xpGranted, totalXp: mockTotalXp(authority, session.userId),
    currentStreak: mockCurrentStreak(ensureMockAccount(authority, session), now()), alreadyCompleted,
  })
  return {
    async completeDailyReview(input) {
      if (!expectedMockSubject(input, session.userId)) return failure('unauthorized')
      return run(input.operationId, JSON.stringify(['daily_review', input.questionSetId, input.attemptId]), () => {
        const fixture = catalog.quizzes?.find(quiz => quiz.set.id === input.questionSetId && quiz.status === 'published' && quiz.set.mode === 'practice')
        if (!fixture || !catalog.dailyReviewSetIds?.includes(input.questionSetId)) return failure('not_found')
        const instant = now(), account = ensureMockAccount(authority, session)
        const localDate = mockLocalDate(instant, account.settings.timezone)
        const attempt = authority.attempts.get(accountKey(session.userId, input.questionSetId))?.find(attempt =>
          attempt.receipt.attemptId === input.attemptId && attempt.mode === 'practice' && attempt.localDate === localDate &&
          attempt.receipt.total >= 3 && attempt.receipt.feedback.length === fixture.set.questionIds.length)
        if (!attempt) return failure('validation')
        const xpGranted = grantMockReward(catalog, authority, session, 'daily_review', localDate, instant)
        if (xpGranted) qualifyMockStreak(authority, session, instant)
        return success({ status: 'confirmed' as const, xpGranted, totalXp: mockTotalXp(authority, session.userId),
          currentStreak: mockCurrentStreak(account, instant), alreadyCompleted: xpGranted === 0, localDate })
      })
    },
    async completeBlock(input) {
      if (!expectedMockSubject(input, session.userId)) return failure('unauthorized')
      const method: CompletionMethod = input.method ?? 'standard'
      return run(input.operationId, JSON.stringify(['complete_block', input.lessonId, input.blockId, method]), () => {
        const lesson = catalog.lessons.find(lesson => lesson.id === input.lessonId && lesson.status === 'published')
        const block = lesson?.blocks.find(block => block.id === input.blockId)
        if (!lesson || !block) return failure('not_found')
        if (!['standard', 'accessible_fallback', 'media_fallback'].includes(method)) return failure('validation')
        const key = accountKey(session.userId, lesson.id, block.id)
        const previous = authority.blocks.get(key)
        if (previous) return success({ ...receipt(lesson.id, 0, true), blockId: block.id, method: previous.method })
        if (!mockBlockEligible(catalog, store, session.userId, lesson, block, method)) return failure('validation')
        const instant = now()
        authority.blocks.set(key, { method, completedAt: instant })
        let xpGranted = 0
        if (block.kind === 'visual_novel') {
          const story = catalog.storyVersions.find(story => story.id === block.storyVersionId)!
          const progress = store.episodes.get(accountKey(session.userId, story.id))!
          store.episodes.set(accountKey(session.userId, story.id), { ...progress, status: 'completed', completedAt: instant, updatedAt: instant, revision: (progress.revision ?? 0) + 1 })
          xpGranted = grantMockReward(catalog, authority, session, 'episode', story.storyId, instant)
          if (xpGranted) qualifyMockStreak(authority, session, instant)
        }
        if (block.kind === 'video') {
          const progress = store.videos.get(accountKey(session.userId, lesson.id, block.id))
          store.videos.set(accountKey(session.userId, lesson.id, block.id), { userId: session.userId, lessonId: lesson.id, blockId: block.id,
            positionSeconds: progress?.positionSeconds ?? 0, watchedRanges: progress?.watchedRanges ?? [], completed: true, updatedAt: instant, revision: (progress?.revision ?? 0) + 1 })
        }
        const lessonKey = accountKey(session.userId, lesson.id)
        const progress = store.lessons.get(lessonKey)
        const priorOrder = lesson.blocks.find(item => item.id === progress?.currentBlockId)?.order ?? -Infinity
        store.lessons.set(lessonKey, { userId: session.userId, lessonId: lesson.id,
          status: progress?.status === 'completed' ? 'completed' : 'in_progress',
          currentBlockId: progress?.status === 'completed' || priorOrder > block.order ? progress?.currentBlockId : block.id,
          completedBlockIds: [...new Set([...(progress?.completedBlockIds ?? []), block.id])],
          confirmedCompletedBlockIds: lesson.blocks.filter(item => authority.blocks.has(accountKey(session.userId, lesson.id, item.id))).map(item => item.id),
          startedAt: progress?.startedAt ?? instant, completedAt: progress?.completedAt, updatedAt: instant, revision: (progress?.revision ?? 0) + 1 })
        return success({ ...receipt(lesson.id, xpGranted, false), blockId: block.id, method })
      })
    },
    async completeLesson(input) {
      if (!expectedMockSubject(input, session.userId)) return failure('unauthorized')
      return run(input.operationId, JSON.stringify(['complete_lesson', input.lessonId]), () => {
        const lesson = catalog.lessons.find(lesson => lesson.id === input.lessonId && lesson.status === 'published')
        if (!lesson) return failure('not_found')
        const key = accountKey(session.userId, lesson.id)
        if (authority.lessons.has(key)) return success(receipt(lesson.id, 0, true))
        if (lesson.blocks.filter(block => block.required && !(block.kind === 'video' && block.completionPolicy === 'optional'))
          .some(block => !authority.blocks.has(accountKey(session.userId, lesson.id, block.id)))) return failure('validation')
        if (lesson.prerequisites.some(id => !authority.lessons.has(accountKey(session.userId, id)))) return failure('validation')
        const instant = now()
        authority.lessons.set(key, { completedAt: instant })
        const xpGranted = ['standard', 'video', 'mixed'].includes(lesson.format)
          ? grantMockReward(catalog, authority, session, 'lesson', lesson.id, instant) : 0
        qualifyMockStreak(authority, session, instant)
        const progress = store.lessons.get(key)
        store.lessons.set(key, { userId: session.userId, lessonId: lesson.id, status: 'completed', currentBlockId: progress?.currentBlockId,
          completedBlockIds: lesson.blocks.filter(block => authority.blocks.has(accountKey(session.userId, lesson.id, block.id))).map(block => block.id),
          confirmedCompletedBlockIds: lesson.blocks.filter(block => authority.blocks.has(accountKey(session.userId, lesson.id, block.id))).map(block => block.id),
          startedAt: progress?.startedAt ?? instant, completedAt: instant, updatedAt: instant, revision: (progress?.revision ?? 0) + 1 })
        return success(receipt(lesson.id, xpGranted, false))
      })
    },
  }
}
