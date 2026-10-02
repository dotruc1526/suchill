import { useEffect, useRef, useSyncExternalStore } from 'react'
import { useCompletionSession } from '../learning/completion/CompletionSession'
import { AccountSummaryView } from './AccountSummaryView'
import { theme } from '../../theme/tokens'
export function ProfileScreen() {
  const { summary } = useCompletionSession()
  const state = useSyncExternalStore(summary.subscribe, summary.getSnapshot, summary.getSnapshot)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus(); void summary.refresh() }, [summary])
  return <main className="px-4 py-4 space-y-4" style={{ color: theme.colors.textPrimary }}>
    <h1 ref={heading} tabIndex={-1} className="text-2xl font-bold outline-none">CUỐN SỔ HÀNH TRÌNH</h1>
    <AccountSummaryView state={state} onRetry={() => void summary.refresh()} />
  </main>
}
