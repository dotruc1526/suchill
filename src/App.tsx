import { useEffect, useSyncExternalStore } from 'react'
import { CompletionSession, useCompletionSession } from './features/learning/completion/CompletionSession'
import { m3JourneyServices, m3Session } from './services/next/m3JourneyFixture'
import { theme } from './theme/tokens'
import { TopBar } from './components/layout/TopBar'
import { BottomNav } from './components/layout/BottomNav'
import { LearningJourney } from './features/learning/journey/LearningJourney'
import { PracticeScreen } from './features/practice/PracticeScreen'
import { AIScreen } from './features/ai-assistant/AIScreen'
import { ProfileScreen } from './features/profile/ProfileScreen'
import { AppViewRouter } from './app/AppViewRouter'
import { useAppNavigation } from './app/useAppNavigation'

function AppContent() {
  const navigation = useAppNavigation()
  const { summary } = useCompletionSession()
  const account = useSyncExternalStore(summary.subscribe, summary.getSnapshot, summary.getSnapshot)
  useEffect(() => { void summary.refresh() }, [summary])

  const handleLessonDone = (cid: number, lidx: number) => {
    navigation.showLessonDone(cid, lidx)
  }

  const handleQuizDone = (score: number, total: number, cid: number) => {
    navigation.showQuizResult(cid, score, total)
  }

  return (
    <div
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

          {!navigation.isOverlay && (
            <div className="flex-1 overflow-y-auto">
              <div hidden={navigation.tab !== 'home'}><LearningJourney active={navigation.tab === 'home'} /></div>
              {navigation.tab === 'practice' && <PracticeScreen />}
              {navigation.tab === 'ai' && <AIScreen />}
              {navigation.tab === 'profile' && <ProfileScreen />}
            </div>
          )}

          {!navigation.isOverlay && <BottomNav tab={navigation.tab} onTab={navigation.selectTab} />}
        </div>

        {/* ── Overlay screen router ── */}
        {navigation.isOverlay && (
          <AppViewRouter
            view={navigation.view}
            goHome={navigation.goHome}
            goChapter={navigation.goChapter}
            goLesson={navigation.goLesson}
            goQuiz={navigation.goQuiz}
            handleLessonDone={handleLessonDone}
            handleQuizDone={handleQuizDone}
          />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return <CompletionSession services={m3JourneyServices} userId={m3Session.userId} epoch="m3.mock.session.v1"><AppContent /></CompletionSession>
}
