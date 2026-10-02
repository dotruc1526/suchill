import type { LearningServices, Result } from '../next/contracts.ts'
import { failure } from '../next/contracts.ts'
import { OfflineQueue, type PendingKind, type PendingOperation } from './queue.ts'

export function createOfflineLearningServices(base: LearningServices, queue: OfflineQueue) {
  async function currentUser() {
    const session = await base.auth.getSession()
    return session.ok ? session.value?.userId ?? '' : ''
  }
  function send(operation: PendingOperation): Promise<Result<unknown>> {
    // Inputs are originally typed at enqueue and validated again by the trusted backend.
    const input = { ...operation.input, expectedSubject: operation.userId } as never
    switch (operation.kind) {
      case 'save_lesson_checkpoint': return base.progress.saveCheckpoint(input)
      case 'save_episode_checkpoint': return base.progress.saveEpisodeCheckpoint(input)
      case 'record_choice': return base.progress.recordChoice(input)
      case 'save_video_position': return base.progress.saveVideoPosition(input)
      case 'submit_practice': return base.quiz.submitPracticeAttempt(input)
      case 'submit_scored': return base.quiz.submitScoredAttempt(input)
      case 'complete_block': return base.completion.completeBlock(input)
      case 'complete_lesson': return base.completion.completeLesson(input)
      case 'complete_daily_review': return base.completion.completeDailyReview(input)
    }
  }
  const wrap = <I extends { operationId: string }, O>(kind: PendingKind, action: (input: I) => Promise<Result<O>>) => async (input: I) => {
    const snapshot = structuredClone(input)
    const userId = await currentUser()
    if (!userId) return failure<O>('unauthorized')
    const { expectedSubject, ...queuedInput } = snapshot as I & { expectedSubject?: string }
    if (expectedSubject !== undefined && expectedSubject !== userId) return failure<O>('unauthorized')
    // Subject is a transport precondition, not durable user-authored payload.
    return queue.dispatch<O>({ userId, kind, input: { ...queuedInput } }, async () => {
      if (await currentUser() !== userId) return failure('unauthorized')
      // This precondition follows the original account through asynchronous token lookup.
      // The backend still derives all ownership from auth.uid().
      const result = await action({ ...snapshot, expectedSubject: userId })
      return await currentUser() === userId ? result : failure('unauthorized')
    })
  }
  const services: LearningServices = {
    ...base,
    account: { ...base.account, async updateSettings(input) {
      const snapshot = structuredClone(input) as typeof input & { expectedSubject?: string }
      const userId = await currentUser()
      if (!userId) return failure('unauthorized')
      if (snapshot.expectedSubject !== undefined && snapshot.expectedSubject !== userId) return failure('unauthorized')
      const bound = { ...snapshot, expectedSubject: userId }
      const result = await base.account.updateSettings(bound)
      return await currentUser() === userId ? result : failure('unauthorized')
    } },
    analytics: { async track(event) {
      try {
        const snapshot = structuredClone(event) as typeof event & { expectedSubject?: string }
        const userId = await currentUser()
        if (!userId) return
        if (snapshot.expectedSubject !== undefined && snapshot.expectedSubject !== userId) return
        const bound = { ...snapshot, expectedSubject: userId }
        await base.analytics.track(bound)
      } catch { /* Optional telemetry must never interrupt learning. */ }
    } },
    progress: {
      ...base.progress,
      saveCheckpoint: wrap('save_lesson_checkpoint', base.progress.saveCheckpoint),
      saveEpisodeCheckpoint: wrap('save_episode_checkpoint', base.progress.saveEpisodeCheckpoint),
      recordChoice: wrap('record_choice', base.progress.recordChoice),
      saveVideoPosition: wrap('save_video_position', base.progress.saveVideoPosition),
    },
    quiz: { ...base.quiz, submitPracticeAttempt: wrap('submit_practice', base.quiz.submitPracticeAttempt), submitScoredAttempt: wrap('submit_scored', base.quiz.submitScoredAttempt) },
    completion: {
      completeBlock: wrap('complete_block', base.completion.completeBlock),
      completeLesson: wrap('complete_lesson', base.completion.completeLesson),
      completeDailyReview: wrap('complete_daily_review', base.completion.completeDailyReview),
    },
  }
  return { services, queue, currentUser, sync: async () => { const user = await currentUser(); await queue.sync(user, send, currentUser) } }
}
