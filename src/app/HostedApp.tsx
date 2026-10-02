import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { createLearningRuntime } from '../services/runtime'
import { createMainLearningServices } from '../services/mainServices'
import { scopeLearningServices } from '../services/offline/accountScope'
import { useLearningAccount } from './useLearningAccount'
import { CompletionSession } from '../features/learning/completion/CompletionSession'
import { AccountAccess } from '../features/auth/AccountAccess'
import { PasswordRecovery } from '../features/auth/PasswordRecovery'
import { isPasswordRecoveryCallback, clearPasswordRecoveryCallback } from '../features/auth/recoveryCallback'
import { lazyFeature } from './LazyFeature'
const ServicePractice = lazyFeature(() => import('../features/practice/ServicePractice').then(module => ({default:module.ServicePractice})))
const AccountProfile = lazyFeature(() => import('../features/profile/AccountProfile').then(module => ({default:module.AccountProfile})))
import { ErrorState, LoadingState } from '../components/ui'
import { theme } from '../theme/tokens'
import { accountHomeActivity } from '../features/learning/journey/accountHomeActivity'
import type { HomeActivityService } from '../services/next/m3HomeActivity'
import { HostedSyncStatus } from './HostedSyncStatus'

type HostedContent = (profile: ReactNode, practice: ReactNode, activity: HomeActivityService, syncStatus: ReactNode) => ReactNode

// A callback-consuming SDK must be created once per document, including StrictMode and remounts.
let documentRuntime: ReturnType<typeof createLearningRuntime> | null | undefined
function getDocumentRuntime() {
  if (documentRuntime !== undefined) return documentRuntime
  try { documentRuntime = createLearningRuntime(import.meta.env, window.localStorage) }
  catch { documentRuntime = null }
  return documentRuntime
}

export function HostedApp({ children }: {children: HostedContent}) {
  // Capture routing intent before the SDK consumes its callback URL; it never authorizes reset.
  const [recovering, setRecovering] = useState(isPasswordRecoveryCallback)
  const runtime = useMemo(getDocumentRuntime, [])
  if (!runtime) return <main id="main-content" tabIndex={-1} className="mx-auto min-h-screen max-w-md p-4"><ErrorState message="Chưa khởi tạo được phiên học. Hãy kiểm tra kết nối và thử lại." onRetry={() => window.location.reload()} /></main>
  // The learning runtime hook (including queue sync) only mounts after explicit dismissal.
  if (recovering) return <main id="main-content" tabIndex={-1} className="mx-auto min-h-screen max-w-md p-4" style={{background:theme.colors.appBg}}>
    <PasswordRecovery auth={runtime.services.auth} onDismiss={() => {
      runtime.services.auth.dismissPasswordRecovery?.()
      clearPasswordRecoveryCallback()
      setRecovering(false)
    }} />
  </main>
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
  if (account.loading) return <main id="main-content" tabIndex={-1} className="mx-auto min-h-screen max-w-md p-4"><LoadingState message="Đang kiểm tra phiên học…" /></main>
  if (!account.session) return <main id="main-content" tabIndex={-1} className="mx-auto min-h-screen max-w-md p-4" style={{background:theme.colors.appBg}}><AccountAccess services={backend} onAccountChange={() => void account.refresh()} /></main>
  if (account.accountError) return <main id="main-content" tabIndex={-1} className="mx-auto max-w-md p-4"><ErrorState message="Chưa tải được tài khoản. Hãy thử lại." onRetry={() => void account.refresh()} /><AccountAccess services={backend} onAccountChange={() => void account.refresh()} /></main>
  return <CompletionSession services={services} userId={account.session.userId} epoch={`${account.session.userId}:${account.generation}`}>
    {children(<AccountProfile services={backend} onAccountChange={() => void account.refresh()} />, <ServicePractice services={backend} onAccountChange={() => void account.refresh()} />, activity,
      <HostedSyncStatus pending={account.pending} rejected={account.rejected} syncError={account.syncError} onRetry={account.sync} onDiscard={account.discardRejected} />)}
  </CompletionSession>
}
