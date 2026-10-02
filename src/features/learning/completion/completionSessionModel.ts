import type { LearningServices } from '../../../services/next/contracts.ts'
import { createSummaryController } from '../../profile/summaryController.ts'
import { createCompletionController, type CompletionController } from './completionController.ts'

/** Scoped to one account/services/session epoch; never persisted across mock browser restarts. */
let nextScopeId = 0
export function createCompletionSession(services: LearningServices, userId: string) {
  const summary = createSummaryController(services, userId), lessons = new Map<string, CompletionController>()
  return { scopeId: ++nextScopeId, services, userId, summary, lesson(lessonId: string, contentVersionId: string) {
    const key = JSON.stringify([lessonId, contentVersionId])
    let controller = lessons.get(key)
    if (!controller) {
      controller = createCompletionController(services, { userId, lessonId, contentVersionId }, summary)
      lessons.set(key, controller)
    }
    return controller
  } }
}
