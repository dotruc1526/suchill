import { useMemo, useState } from 'react'
import { TopBar } from './components/layout/TopBar'
import { BottomNav } from './components/layout/BottomNav'
import { Button, ErrorState, LoadingState } from './components/ui'
import { LearningJourney } from './features/learning/journey/LearningJourney'
import { ServicePractice } from './features/practice/ServicePractice'
import { AIScreen } from './features/ai-assistant/AIScreen'
import { AccountProfile } from './features/profile/AccountProfile'
import { AccountAccess } from './features/auth/AccountAccess'
import { useLearningAccount } from './app/useLearningAccount'
import { createLearningRuntime } from './services/runtime'
import { scopeLearningServices } from './services/offline/accountScope'
import { theme } from './theme/tokens'
import type { Tab } from './types'

function RuntimeApp({ runtime }: { runtime: ReturnType<typeof createLearningRuntime> }) {
  const [tab, setTab] = useState<Tab>('home')
  const account = useLearningAccount(runtime)
  const services = useMemo(() => account.session
    ? scopeLearningServices(runtime.services, account.session.userId) : runtime.services,
  [runtime.services, account.session?.userId])
  const refresh = () => { void account.refresh() }
  return <div className="flex min-h-screen items-center justify-center" style={{ background: theme.colors.pageBg }}>
    <div className="relative flex w-full flex-col overflow-hidden" data-reduced-motion={account.reducedMotion || undefined}
      style={{ maxWidth: 420, height: '100dvh', maxHeight: 900, background: theme.colors.appBg, color: theme.colors.textPrimary }}>
      {account.reducedMotion && <style>{'[data-reduced-motion] *, [data-reduced-motion] *::before, [data-reduced-motion] *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }'}</style>}
      <TopBar xp={account.summary?.totalXp ?? 0} streak={account.summary?.currentStreak ?? 0} achievements={account.summary?.achievements.length ?? 0} />
      {runtime.mode === 'mock' && <p className="px-4 py-1 text-xs" role="note">Bản thử nghiệm • Dữ liệu kỹ thuật, chưa đồng bộ tài khoản thật.</p>}
      {account.pending > 0 && <div role="status" className="space-y-1 px-4 py-2 text-sm">
        <p>{account.pending} thao tác đang chờ đồng bộ. XP sẽ được xác nhận sau khi đồng bộ thành công.</p>
        <Button variant="outline" onClick={() => void account.sync()}>THỬ ĐỒNG BỘ</Button>
        {account.rejected > 0 && <>
          <p>{account.rejected} thao tác bị từ chối hoặc đã lỗi thời. Bỏ các thao tác này để tiếp tục đồng bộ; tiến độ đã xác nhận được giữ.</p>
          <Button variant="outline" onClick={() => void account.discardRejected()}>BỎ THAO TÁC BỊ TỪ CHỐI</Button>
        </>}
      </div>}
      {account.syncError && <p role="alert" className="px-4 text-sm">Chưa đọc được hàng đợi trên thiết bị. Hãy kiểm tra quyền lưu trữ rồi thử lại.</p>}
      {account.accountError && <div role="alert" className="px-4 py-2 text-sm">
        <p>Chưa tải được dữ liệu tài khoản. Hãy thử lại để cập nhật tiến độ và cài đặt.</p>
        <Button variant="outline" onClick={refresh}>THỬ TẢI TÀI KHOẢN</Button>
      </div>}
      <div className="flex-1 overflow-y-auto" key={`${account.session?.userId ?? 'anonymous'}:${account.generation}`}>
        {account.loading ? <LoadingState message="Đang tải tài khoản..." />
          : !account.session ? <section className="p-4"><AccountAccess services={services} onAccountChange={refresh} /></section>
          : <>
            {tab === 'home' && <LearningJourney services={services} onAccountChange={refresh} />}
            {tab === 'practice' && <ServicePractice services={services} onAccountChange={refresh} />}
            {tab === 'ai' && <AIScreen />}
            {tab === 'profile' && <AccountProfile services={services} onAccountChange={refresh} />}
          </>}
      </div>
      <BottomNav tab={tab} onTab={setTab} />
    </div>
  </div>
}

export default function App() {
  const [state] = useState(() => {
    try { return { runtime: createLearningRuntime(import.meta.env, window.localStorage) } }
    catch { return { error: true as const } }
  })
  if (!state.runtime) return <ErrorState title="Chưa thể kết nối dịch vụ" message="Cấu hình dịch vụ hoặc quyền lưu trữ chưa hợp lệ. Hãy kiểm tra môi trường rồi tải lại ứng dụng." onRetry={() => window.location.reload()} />
  return <RuntimeApp runtime={state.runtime} />
}
