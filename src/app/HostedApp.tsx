import { useMemo, type ReactNode } from 'react'
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

export function HostedApp({ children }: {children: (profile: ReactNode, practice: ReactNode) => ReactNode}) {
  const runtime = useMemo(() => {
    try { return createLearningRuntime(import.meta.env, window.localStorage) }
    catch { return null }
  }, [])
  if (!runtime) return <ErrorState message="Chưa khởi tạo được phiên học. Hãy kiểm tra kết nối và thử lại." onRetry={() => window.location.reload()} />
  return <HostedRuntime runtime={runtime}>{children}</HostedRuntime>
}

function HostedRuntime({ runtime, children }: {runtime:ReturnType<typeof createLearningRuntime>; children:(profile:ReactNode, practice:ReactNode)=>ReactNode}) {
  const account = useLearningAccount(runtime)
  const backend = useMemo(() => account.session ? scopeLearningServices(runtime.services, account.session.userId) : runtime.services,
    [runtime, account.session?.userId, account.generation])
  const services = useMemo(() => createMainLearningServices(backend, account.session?.userId ?? ''), [backend, account.session?.userId])
  if (account.loading) return <LoadingState message="Đang kiểm tra phiên học…" />
  if (!account.session) return <main className="mx-auto min-h-screen max-w-md p-4" style={{background:theme.colors.appBg}}><AccountAccess services={backend} onAccountChange={() => void account.refresh()} /></main>
  if (account.accountError) return <main className="mx-auto max-w-md p-4"><ErrorState message="Chưa tải được tài khoản. Hãy thử lại." onRetry={() => void account.refresh()} /><AccountAccess services={backend} onAccountChange={() => void account.refresh()} /></main>
  return <CompletionSession services={services} userId={account.session.userId} epoch={`${account.session.userId}:${account.generation}`}>
    {children(<AccountProfile services={backend} onAccountChange={() => void account.refresh()} />, <ServicePractice services={backend} onAccountChange={() => void account.refresh()} />)}
  </CompletionSession>
}
