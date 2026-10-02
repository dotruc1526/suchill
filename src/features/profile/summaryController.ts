import type { LearningServices, ServiceErrorCode } from '../../services/next/contracts.ts'
import type { AccountSummary } from '../../services/next/completionContracts.ts'
export type SummaryState = { status: 'loading' | 'ready' | 'empty' | 'error'; value?: AccountSummary; error?: ServiceErrorCode }
export function createSummaryController(services: LearningServices, userId: string) {
  let state: SummaryState = { status: 'loading' }
  let generation = 0
  const listeners = new Set<() => void>()
  const publish = (next: SummaryState) => { state = next; listeners.forEach(listener => listener()) }
  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } },
    invalidate() { generation++; publish({ status: 'loading' }) },
    async refresh() {
      const request = ++generation, previous = state.value
      publish({ status: 'loading', value: previous })
      try {
        const result = await services.users.getAccountSummary()
        if (request !== generation) return
        if (!result.ok) publish({ status: 'error', error: result.error, value: result.error === 'unauthorized' ? undefined : previous })
        else if (result.value && result.value.userId !== userId) publish({ status: 'error', error: 'unauthorized' })
        else publish(result.value ? { status: 'ready', value: result.value } : { status: 'empty' })
      } catch { if (request === generation) publish({ status: 'error', error: 'server_error', value: previous }) }
    },
  }
}
export type SummaryController = ReturnType<typeof createSummaryController>
