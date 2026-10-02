import type { LearningServices, ServiceErrorCode } from '../../../services/next/contracts.ts'
import type { CompletionOutcome, CompletionReceipt } from '../../../services/next/completionContracts.ts'
import type { SummaryController } from '../../profile/summaryController.ts'
export type CompletionContext = { userId: string; lessonId: string; contentVersionId: string }
export type CompletionState = {
  status: 'restoring' | 'ready' | 'submitting' | 'ineligible' | 'confirmed' | 'error'
  receipt?: CompletionReceipt; outcome?: 'completed' | 'already_completed'; error?: ServiceErrorCode
  errorStage?: 'restore' | 'submit'
  reasons?: Extract<CompletionOutcome, { kind: 'ineligible' }>['reasons']
  actions: Record<string, 'pending' | 'done' | ServiceErrorCode>
}
export function createCompletionController(services: LearningServices, context: CompletionContext,
  summary: SummaryController, makeId: () => string = () => crypto.randomUUID()) {
  let state: CompletionState = { status: 'restoring', actions: {} }
  let generation = 0, restoring = false
  let operationId: string | undefined
  const actionIds = new Map<string, string>(), listeners = new Set<() => void>()
  const publish = (next: CompletionState) => { state = next; listeners.forEach(listener => listener()) }
  const validReceipt = (receipt: CompletionReceipt) => receipt.userId === context.userId &&
    receipt.lessonId === context.lessonId && receipt.contentVersionId === context.contentVersionId
  const error = (code: ServiceErrorCode, stage: 'restore' | 'submit' = 'submit') => {
    if (code === 'unauthorized') summary.invalidate()
    publish({ ...state, status: 'error', error: code, errorStage: stage, receipt: code === 'unauthorized' ? undefined : state.receipt })
  }
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    async restore() {
      if (state.status === 'submitting' || Object.values(state.actions).includes('pending')) return
      restoring = true
      const request = ++generation
      publish({ status: 'restoring', actions: state.actions })
      try {
        const result = await services.completion.getLessonCompletion(context.lessonId)
        if (request !== generation) return
        if (!result.ok) error(result.error, 'restore')
        else if (result.value && !validReceipt(result.value)) error('unauthorized', 'restore')
        else publish({ status: result.value ? 'confirmed' : 'ready', receipt: result.value ?? undefined, actions: state.actions })
      } catch { if (request === generation) error('server_error', 'restore') }
      finally { if (request === generation) restoring = false }
    },
    async acknowledge(blockId: string) {
      if (restoring || state.status === 'submitting' || state.status === 'confirmed' || state.actions[blockId] === 'pending') return
      const request = generation, id = actionIds.get(blockId) ?? makeId()
      actionIds.set(blockId, id)
      publish({ ...state, actions: { ...state.actions, [blockId]: 'pending' } })
      try {
        const result = await services.completion.recordBlockAction({ lessonId: context.lessonId, blockId, operationId: id, action: 'acknowledge' })
        if (request !== generation) return
        publish({ ...state, actions: { ...state.actions, [blockId]: result.ok ? 'done' : result.error } })
        if (!result.ok && result.error === 'unauthorized') error(result.error)
      } catch { if (request === generation) publish({ ...state, actions: { ...state.actions, [blockId]: 'server_error' } }) }
    },
    async submit() {
      if (restoring || state.status === 'restoring' || state.status === 'confirmed' || state.status === 'submitting' ||
        (state.status === 'error' && (state.errorStage === 'restore' || ['unauthorized', 'not_found', 'conflict'].includes(state.error!))) ||
        Object.values(state.actions).includes('pending')) return
      const request = generation
      operationId ??= makeId()
      publish({ ...state, status: 'submitting', error: undefined })
      try {
        const result = await services.completion.completeLesson({ lessonId: context.lessonId, operationId })
        if (request !== generation) return
        if (!result.ok) error(result.error)
        else if (result.value.kind === 'ineligible') publish({ ...state, status: 'ineligible', reasons: result.value.reasons })
        else if (!validReceipt(result.value.receipt)) error('unauthorized')
        else { publish({ status: 'confirmed', receipt: result.value.receipt, outcome: result.value.kind, actions: state.actions }); await summary.refresh() }
      } catch { if (request === generation) error('server_error') }
    },
  }
}
export type CompletionController = ReturnType<typeof createCompletionController>
