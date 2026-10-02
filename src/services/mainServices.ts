import type { LearningServices, Result } from './next/contracts.ts'
import { failure, success } from './next/contracts.ts'
import type { LearningServices as BackendServices } from './next/backendContracts.ts'

/** Keep accepted M3 contracts while binding backend calls to the rendered account. */
export function createMainLearningServices(base: BackendServices, userId: string): LearningServices {
  async function owned<T>(action: () => Promise<Result<T>>): Promise<Result<T>> {
    let changed = false
    const unsubscribe = base.auth.subscribe(session => { if (session?.userId !== userId) changed = true })
    try {
      const before = await base.auth.getSession()
      if (!before.ok || before.value?.userId !== userId || changed) return failure('unauthorized')
      const result = await action()
      const after = await base.auth.getSession()
      return changed || !after.ok || after.value?.userId !== userId ? failure('unauthorized') : result
    } catch { return failure('server_error') }
    finally { unsubscribe() }
  }
  return {
    chapters: base.chapters, lessons: base.lessons, documents: base.documents,
    stories: base.stories, media: base.media, quiz: base.quiz,
    progress: { ...base.progress,
      recordChoice: input => base.progress.recordChoice(input),
      recordChoiceWithFeedback: input => base.progress.recordChoice(input),
    },
    users: { getCurrentProfile: () => owned(base.users.getCurrentProfile),
      getAccountSummary: () => owned(() => base.mainContract ? base.mainContract.getSummary(userId) : Promise.resolve(failure('server_error'))),
    },
    completion: {
      getLessonCompletion: id => owned(() => base.mainContract ? base.mainContract.getCompletion(id, userId) : Promise.resolve(failure('server_error'))),
      completeLesson: input => owned(() => base.mainContract ? base.mainContract.completeLesson({...input, expectedSubject:userId}) : Promise.resolve(failure('server_error'))),
      recordBlockAction: input => owned(async () => {
        const { action, ...command } = input
        const result = await base.completion.completeBlock({...command, method:action === 'acknowledge' ? 'standard' : action})
        return result.ok ? success(null) : result
      }),
    },
  }
}
