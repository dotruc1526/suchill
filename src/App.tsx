import { HostedApp } from './app/HostedApp'
import type { HomeActivityService } from './services/next/m3HomeActivity'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { CompletionSession, useCompletionSession } from './features/learning/completion/CompletionSession'
import { m3JourneyServices, m3Session } from './services/next/m3JourneyFixture'
import { theme } from './theme/tokens'
import { TopBar } from './components/layout/TopBar'
import { BottomNav } from './components/layout/BottomNav'
import { LearningJourney } from './features/learning/journey/LearningJourney'
const PracticeScreen = lazyFeature(() => import('./features/practice/PracticeScreen').then(module => ({default:module.PracticeScreen})))
const AIScreen = lazyFeature(() => import('./features/ai-assistant/AIScreen').then(module => ({default:module.AIScreen})))
const DauTriScreen = lazyFeature(() => import('./features/dau-tri/DauTriScreen'))
const ProfileScreen = lazyFeature(() => import('./features/profile/ProfileScreen').then(module => ({default:module.ProfileScreen})))
import { AppViewRouter } from './app/AppViewRouter'
import { useAppNavigation } from './app/useAppNavigation'
import { lazyFeature } from './app/LazyFeature'
import { PwaStatus } from './features/pwa/PwaStatus'
import { pwaController } from './services/pwa/controller'

function AppContent({ profile, practice, activity, syncStatus }: {profile?: ReactNode; practice?: ReactNode; activity?: HomeActivityService; syncStatus?: ReactNode}) {
  const navigation = useAppNavigation()
  const [battleBusy, setBattleBusy] = useState(false)
  const journeySafe = useRef(false)
  const [, setJourneyReady] = useState(false)
  const navigationSafe = useRef(false)
  navigationSafe.current = navigation.tab === 'home' && !navigation.isOverlay
  const reportJourneySafety = useCallback((safe: boolean) => { journeySafe.current = safe; setJourneyReady(safe) }, [])
  const canUpdate = useCallback(() => navigationSafe.current && journeySafe.current && !battleBusy, [battleBusy])
  const selectTab = (tab: Parameters<typeof navigation.selectTab>[0]) => {
    if (tab !== navigation.tab && battleBusy && !window.confirm('Rời Đấu Trí sẽ hủy chờ hoặc ngắt kết nối trận. Bạn muốn rời?')) return
    navigationSafe.current = false
    navigation.selectTab(tab)
  }
  const { summary, userId, scopeId } = useCompletionSession()
  const account = useSyncExternalStore(summary.subscribe, summary.getSnapshot, summary.getSnapshot)
  useEffect(() => { void summary.refresh() }, [summary])

  const handleLessonDone = (cid: number, lidx: number) => {
    navigationSafe.current = false
    navigation.showLessonDone(cid, lidx)
  }

  const handleQuizDone = (score: number, total: number, cid: number) => {
    navigationSafe.current = false
    navigation.showQuizResult(cid, score, total)
  }

  return (
    <main id="main-content" tabIndex={-1}
      className="flex items-center justify-center min-h-screen"
      style={{ background: theme.colors.pageBg }}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 420,
          height: '100dvh',
          maxHeight: 900,
          background: theme.colors.appBg,
        }}
      >
        {/* Paper texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Main content (Tabs) ── */}
        <div className="flex flex-col flex-1 overflow-hidden z-10">
          {!navigation.isOverlay && (
            account.value ? <TopBar xp={account.value.totalXp} streak={account.value.currentStreak} achievements={account.value.achievements.length} /> : <div role="status" className="px-4 py-3">Số liệu tài khoản chưa được xác nhận.</div>
          )}

          {!navigation.isOverlay && <PwaStatus canUpdate={canUpdate} />}
          {!navigation.isOverlay && syncStatus}
          {!navigation.isOverlay && (
            <div className="flex-1 overflow-y-auto" role="region" tabIndex={0}
              aria-label={{ home: 'Nội dung học bài', practice: 'Nội dung luyện tập', dautri: 'Nội dung Đấu Trí online', ai: 'Nội dung trợ lý lịch sử', profile: 'Nội dung hồ sơ' }[navigation.tab]}>
              <div hidden={navigation.tab !== 'home'}><LearningJourney active={navigation.tab === 'home'} activityService={activity} offlineStatusProvided={import.meta.env.PROD && import.meta.env.BASE_URL === '/' && pwaController.getSnapshot().supported} onSafeToUpdateChange={reportJourneySafety} /></div>
              {navigation.tab === 'practice' && (practice ?? <PracticeScreen />)}
              {navigation.tab === 'dautri' && <DauTriScreen userId={`${userId}:${scopeId}`} playerName={account.value?.displayName || 'Người chơi'} onNavigateTab={selectTab} onMatchActiveChange={setBattleBusy} />}
              {navigation.tab === 'ai' && <AIScreen />}
              {navigation.tab === 'profile' && <><ProfileScreen />{profile}</>}
            </div>
          )}

          {!navigation.isOverlay && <BottomNav tab={navigation.tab} onTab={selectTab} />}
        </div>

        {/* ── Overlay screen router ── */}
        {navigation.isOverlay && (
          <AppViewRouter
            view={navigation.view}
            goHome={(...args) => { navigationSafe.current = false; navigation.goHome(...args) }}
            goChapter={(...args) => { navigationSafe.current = false; navigation.goChapter(...args) }}
            goLesson={(...args) => { navigationSafe.current = false; navigation.goLesson(...args) }}
            goQuiz={(...args) => { navigationSafe.current = false; navigation.goQuiz(...args) }}
            handleLessonDone={handleLessonDone}
            handleQuizDone={handleQuizDone}
          />
        )}
      </div>
    </main>
  )
}

export default function App() {
  if (import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
    return <HostedApp>{(profile, practice, activity, syncStatus) => <AppContent profile={profile} practice={practice} activity={activity} syncStatus={syncStatus} />}</HostedApp>
  return <CompletionSession services={m3JourneyServices} userId={m3Session.userId} epoch="m3.mock.session.v1"><AppContent /></CompletionSession>
}
