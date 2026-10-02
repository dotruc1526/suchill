import { failure, type LearningServices, type Result } from '../next/contracts.ts'

/** UI actions retain the account that rendered them, even before async execution begins. */
export function scopeLearningServices(base: LearningServices, userId: string): LearningServices {
  const owned = async () => {
    try {
      const session = await base.auth.getSession()
      return session.ok && session.value?.userId === userId
    } catch { return false }
  }
  const write = <I extends object, O>(action: (input: I) => Promise<Result<O>>) => async (input: I): Promise<Result<O>> => {
    try {
      const snapshot = structuredClone(input) as I & { expectedSubject?: string }
      if (snapshot.expectedSubject !== undefined && snapshot.expectedSubject !== userId) return failure('unauthorized')
      if (!await owned()) return failure('unauthorized')
      const result = await action({ ...snapshot, expectedSubject: userId })
      return await owned() ? result : failure('unauthorized')
    } catch { return failure('server_error') }
  }
  const read = <O>(action: () => Promise<Result<O>>) => async (): Promise<Result<O>> => {
    let changed = false, unsubscribe = () => {}
    try {
      unsubscribe = base.auth.subscribe(session => { if (session?.userId !== userId) changed = true })
      if (!await owned()) return failure('unauthorized')
      const result = await action()
      if (changed || !await owned()) return failure('unauthorized')
      return result
    } catch { return failure('server_error') }
    finally { unsubscribe() }
  }
  const secure = <O>(action: ((input: string, context?: { expectedSubject?: string }) => Promise<Result<O>>) | undefined) =>
    action ? async (input: string): Promise<Result<O>> => {
      if (!await owned()) return failure('unauthorized')
      const result = await action(input, { expectedSubject: userId })
      return await owned() ? result : failure('unauthorized')
    } : undefined
  return {
    ...base,
    auth: { ...base.auth, getSession: read(base.auth.getSession),
      claimUsername: secure(base.auth.claimUsername), setRecoveryEmail: secure(base.auth.setRecoveryEmail),
      verifyRecoveryEmail: secure(base.auth.verifyRecoveryEmail), updatePassword: secure(base.auth.updatePassword),
      signOut: async () => {
      if (!await owned()) return failure('unauthorized')
      return base.auth.signOut()
    } },
    users: { getCurrentProfile: read(base.users.getCurrentProfile) },
    progress: {
      getLessonProgress: id => read(() => base.progress.getLessonProgress(id))(),
      getEpisodeProgress: id => read(() => base.progress.getEpisodeProgress(id))(),
      getVideoProgress: (id, blockId) => read(() => base.progress.getVideoProgress(id, blockId))(),
      getResumePoint: id => read(() => base.progress.getResumePoint(id))(),
      saveCheckpoint: write(base.progress.saveCheckpoint),
      saveEpisodeCheckpoint: write(base.progress.saveEpisodeCheckpoint),
      saveVideoPosition: write(base.progress.saveVideoPosition),
      recordChoice: write(base.progress.recordChoice),
    },
    quiz: { ...base.quiz, submitPracticeAttempt: write(base.quiz.submitPracticeAttempt), submitScoredAttempt: write(base.quiz.submitScoredAttempt) },
    completion: { completeBlock: write(base.completion.completeBlock), completeLesson: write(base.completion.completeLesson), completeDailyReview: write(base.completion.completeDailyReview) },
    account: { getSummary: read(base.account.getSummary), getSettings: read(base.account.getSettings), updateSettings: write(base.account.updateSettings) },
    analytics: { async track(event) {
      try { if (await owned()) await base.analytics.track({ ...event, expectedSubject: userId } as typeof event) }
      catch { /* Optional telemetry never interrupts learning. */ }
    } },
  }
}
