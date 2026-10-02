import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { LearningServices } from '../../../services/next/contracts'
import { createCompletionSession } from './completionSessionModel'
const Context = createContext<ReturnType<typeof createCompletionSession> | null>(null)
export function CompletionSession({ services, userId, epoch, children }: {
  services: LearningServices; userId: string; epoch: string; children: ReactNode
}) {
  const session = useMemo(() => createCompletionSession(services, userId), [services, userId, epoch])
  return <Context.Provider key={session.scopeId} value={session}>{children}</Context.Provider>
}
export function useCompletionSession() {
  const session = useContext(Context)
  if (!session) throw new Error('CompletionSession missing')
  return session
}
