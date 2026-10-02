import { useEffect, useMemo, type ReactNode } from 'react'
import { createLearningRuntime } from '../services/runtime'
import { createMainLearningServices } from '../services/mainServices'
import { scopeLearningServices } from '../services/offline/accountScope'
import { useLearningAccount } from './useLearningAccount'
import { CompletionSession } from '../features/learning/completion/CompletionSession'
import { AccountAccess } from '../features/auth/AccountAccess'
import { ServicePractice } from '../features/practice/ServicePractice'
import { AccountProfile } from '../features/profile/AccountProfile'
import { ErrorState, LoadingState } from '../components/ui'
import { theme } from '../theme/tokens'
import { accountHomeActivity } from '../features/learning/journey/accountHomeActivity'
import type { HomeActivityService } from '../services/next/m3HomeActivity'
import { HostedSyncStatus } from './HostedSyncStatus'

type HostedContent = (profile: ReactNode, practice: ReactNode, activity: HomeActivityService, syncStatus: ReactNode) => ReactNode

export function HostedApp({ children }: {children: HostedContent}) {
  const runtime = useMemo(() => {
    try { return createLearningRuntime(import.meta.env, window.localStorage) }
    catch { return null }
  }, [])
  if (!runtime) return <ErrorState message="Chưa khởi tạo được phiên học. Hãy kiểm tra kết nối và thử lại." onRetry={() => window.location.reload()} />
  return <HostedRuntime runtime={runtime}>{children}</HostedRuntime>
}

function HostedRuntime({ runtime, children }: {runtime:ReturnType<typeof createLearningRuntime>; children:HostedContent}) {
  const account = useLearningAccount(runtime)
  const backend = useMemo(() => account.session ? scopeLearningServices(runtime.services, account.session.userId) : runtime.services,
    [runtime, account.session?.userId, account.generation])
  const services = useMemo(() => createMainLearningServices(backend, account.session?.userId ?? ''), [backend, account.session?.userId])
  const activity = useMemo(() => accountHomeActivity(backend), [backend])
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(account.reducedMotion)
    return () => { delete document.documentElement.dataset.reducedMotion }
  }, [account.reducedMotion])
  if (account.loading) return <LoadingState message="Đang kiểm tra phiên học…" />
  if (!account.session) return <main className="mx-auto min-h-screen max-w-md p-4" style={{background:theme.colors.appBg}}><AccountAccess services={backend} onAccountChange={() => void account.refresh()} /></main>
  if (account.accountError) return <main className="mx-auto max-w-md p-4"><ErrorState message="Chưa tải được tài khoản. Hãy thử lại." onRetry={() => void account.refresh()} /><AccountAccess services={backend} onAccountChange={() => void account.refresh()} /></main>
  return <CompletionSession services={services} userId={account.session.userId} epoch={`${account.session.userId}:${account.generation}`}>
    {children(<AccountProfile services={backend} onAccountChange={() => void account.refresh()} />, <ServicePractice services={backend} onAccountChange={() => void account.refresh()} />, activity,
      <HostedSyncStatus pending={account.pending} rejected={account.rejected} syncError={account.syncError} onRetry={account.sync} onDiscard={account.discardRejected} />)}
  </CompletionSession>
}
