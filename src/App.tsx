import { useState } from 'react'
import { TopBar } from './components/layout/TopBar'
import { BottomNav } from './components/layout/BottomNav'
import { HomeScreen } from './features/home/HomeScreen'
import { PracticeScreen } from './features/practice/PracticeScreen'
import { AIScreen } from './features/ai-assistant/AIScreen'
import { ProfileScreen } from './features/profile/ProfileScreen'
import { AppViewRouter } from './app/AppViewRouter'
import { useAppNavigation } from './app/useAppNavigation'
import { userStats } from './data'

export default function App() {
  const navigation = useAppNavigation()
  const [xp, setXP] = useState(userStats.xp)

  const handleLessonDone = (cid: number, lidx: number) => {
    setXP(x => x + 10)
    navigation.showLessonDone(cid, lidx)
  }

  const handleQuizDone = (score: number, total: number, cid: number) => {
    setXP(x => x + score * 10)
    navigation.showQuizResult(cid, score, total)
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: '#C8A882' }}
    >
      <div
        className="relative flex flex-col overflow-hidden"
        style={{
          width: '100%',
          maxWidth: 420,
          height: '100dvh',
          maxHeight: 900,
          background: '#F5E6D0',
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
            <TopBar xp={xp} streak={userStats.streak} achievements={userStats.achievements} />
          )}

          {!navigation.isOverlay && (
            <div className="flex-1 overflow-y-auto">
              {navigation.tab === 'home' && (
                <HomeScreen
                  onChapter={navigation.goChapter}
                  onLesson={navigation.goLesson}
                />
              )}
              {navigation.tab === 'practice' && <PracticeScreen />}
              {navigation.tab === 'ai' && <AIScreen />}
              {navigation.tab === 'profile' && <ProfileScreen xp={xp} />}
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
