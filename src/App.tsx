import { useState, useEffect } from 'react'
import { TopBar } from './components/layout/TopBar'
import { BottomNav } from './components/layout/BottomNav'

import { HomeScreen } from './features/home/HomeScreen'
import { ChapterScreen } from './features/learning/ChapterScreen'
import { LessonScreen } from './features/learning/LessonScreen'
import { LessonCompleteScreen } from './features/learning/LessonCompleteScreen'
import { QuizScreen } from './features/quiz/QuizScreen'
import { QuizResultScreen } from './features/quiz/QuizResultScreen'
import { PracticeScreen } from './features/practice/PracticeScreen'
import { AIScreen } from './features/ai-assistant/AIScreen'
import { ProfileScreen } from './features/profile/ProfileScreen'
import DauTriScreen from './DauTriScreen'
import PricingScreen from './PricingScreen'
import AuthScreen from './auth/AuthScreen'
import NameSetupScreen from './auth/NameSetupScreen'

import VisualNovelPlayer from './features/visual-novel/VisualNovelPlayer'
import { getVisualNovel } from './features/visual-novel/stories'

import { chapters, userStats } from './data'
import type { Tab, View } from './types'
import type { UserAccount } from './auth/types'
import { DEFAULT_NEW_USER_PROGRESS } from './auth/types'
import {
  getCurrentUser,
  setCurrentUser as saveCurrentSession,
  updateUserProgress,
  resetUserProgress,
} from './auth/authStorage'
import { userService } from './services/userService'

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser())
  const [tab, setTab] = useState<Tab>('home')
  const [view, setView] = useState<View>({ type: 'home' })
  const [showPricing, setShowPricing] = useState(false)

  const userProgress = currentUser?.progress || DEFAULT_NEW_USER_PROGRESS
  const xp = userProgress.xp

  // Đồng bộ với Supabase khi user profile thay đổi
  useEffect(() => {
    if (currentUser) {
      userService.syncUserProfile({
        id: currentUser.id,
        username: currentUser.username,
        displayName: currentUser.displayName || currentUser.username,
        xp: userProgress.xp,
        level: userProgress.level,
        streak: userProgress.streak,
        coins: userProgress.coins || 0,
        pvpMatches: userProgress.pvpMatches || 0,
        pvpWins: userProgress.pvpWins || 0,
        pvpStreak: userProgress.pvpStreak || 0,
      })
    }
  }, [currentUser?.id, userProgress.xp, userProgress.level, userProgress.streak])

  const goHome = () => setView({ type: 'home' })
  const goChapter = (id: number) => setView({ type: 'chapter', chapterId: id })
  const goLesson = (cid: number, idx: number) => setView({ type: 'lesson', chapterId: cid, lessonIdx: idx })
  const goQuiz = (cid: number) => setView({ type: 'quiz', chapterId: cid })

  const handleAuthSuccess = (user: UserAccount) => {
    saveCurrentSession(user)
    setCurrentUser(user)
  }

  const handleNameSetupComplete = (updatedUser: UserAccount) => {
    saveCurrentSession(updatedUser)
    setCurrentUser(updatedUser)
  }

  const handleLogout = () => {
    saveCurrentSession(null)
    setCurrentUser(null)
    setTab('home')
    setView({ type: 'home' })
  }

  const handleResetProgress = () => {
    if (!currentUser) return
    const updated = resetUserProgress(currentUser.id)
    if (updated) setCurrentUser(updated)
  }

  const handleLessonDone = (cid: number, lidx: number) => {
    if (currentUser) {
      const lessonKey = `${cid}-${lidx}`
      const isNewLesson = !userProgress.completedLessons?.includes(lessonKey)
      const updated = updateUserProgress(currentUser.id, prev => {
        const newXp = prev.xp + 10
        return {
          ...prev,
          xp: newXp,
          level: Math.max(0, Math.floor(newXp / 100)),
          completedLessons: isNewLesson ? [...(prev.completedLessons || []), lessonKey] : prev.completedLessons,
        }
      })
      if (updated) setCurrentUser(updated)
    }
    setView({ type: 'lesson-done', chapterId: cid, lessonIdx: lidx })
  }

  const handleQuizDone = (score: number, total: number, cid: number) => {
    if (currentUser) {
      const updated = updateUserProgress(currentUser.id, prev => {
        const newXp = prev.xp + score * 10
        return {
          ...prev,
          xp: newXp,
          level: Math.max(0, Math.floor(newXp / 100)),
          correctAnswers: (prev.correctAnswers || 0) + score,
          totalQuestions: (prev.totalQuestions || 0) + total,
        }
      })
      if (updated) setCurrentUser(updated)
    }
    setView({ type: 'quiz-result', score, total, chapterId: cid })
  }

  const handleMatchFinished = (isWin: boolean, expEarned: number, coinsEarned: number) => {
    if (!currentUser) return
    const updated = updateUserProgress(currentUser.id, prev => {
      const newXp = Math.max(0, prev.xp + expEarned)
      return {
        ...prev,
        xp: newXp,
        level: Math.max(0, Math.floor(newXp / 100)),
        coins: (prev.coins || 0) + coinsEarned,
        pvpMatches: (prev.pvpMatches || 0) + 1,
        pvpWins: (prev.pvpWins || 0) + (isWin ? 1 : 0),
        pvpStreak: isWin ? (prev.pvpStreak || 0) + 1 : 0,
      }
    })
    if (updated) setCurrentUser(updated)
  }

  const handleAddXP = (amount: number) => {
    if (!currentUser) return
    const updated = updateUserProgress(currentUser.id, prev => {
      const newXp = prev.xp + amount
      return {
        ...prev,
        xp: newXp,
        level: Math.max(0, Math.floor(newXp / 100)),
      }
    })
    if (updated) setCurrentUser(updated)
  }

  // 1. Chưa đăng nhập -> Vào trang Đăng nhập / Đăng ký / Quên mật khẩu
  if (!currentUser) {
    return <AuthScreen onSuccess={handleAuthSuccess} />
  }

  // 2. Đã đăng nhập nhưng chưa có tên hiển thị -> Vào màn hình Đặt Tên & AI Random Tên
  if (!currentUser.displayName) {
    return <NameSetupScreen user={currentUser} onComplete={handleNameSetupComplete} />
  }

  const isOverlay = view.type !== 'home'

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
          {!isOverlay && (
            <TopBar xp={xp} streak={userProgress.streak} achievements={userStats.achievements} />
          )}

          {!isOverlay && (
            <div className="flex-1 overflow-y-auto">
              {tab === 'home' && (
                <HomeScreen
                  onChapter={goChapter}
                  onLesson={(cid, idx) => goLesson(cid, idx)}
                />
              )}
              {tab === 'practice' && <PracticeScreen />}
              {tab === 'dautri' && (
                <DauTriScreen
                  onNavigateTab={setTab}
                  userId={currentUser.id}
                  xp={userProgress.xp}
                  streak={userProgress.streak}
                  playerName={currentUser.displayName}
                  pvpMatches={userProgress.pvpMatches}
                  pvpWins={userProgress.pvpWins}
                  pvpStreak={userProgress.pvpStreak}
                  onMatchFinished={handleMatchFinished}
                  onAddXP={handleAddXP}
                />
              )}
              {tab === 'ai' && <AIScreen />}
              {tab === 'profile' && (
                <ProfileScreen
                  xp={xp}
                  currentUser={currentUser}
                  onPricing={() => setShowPricing(true)}
                  onLogout={handleLogout}
                  onResetProgress={handleResetProgress}
                />
              )}
            </div>
          )}

          {!isOverlay && <BottomNav tab={tab} onTab={setTab} />}
        </div>

        {/* ── Pricing Modal ── */}
        {showPricing && <PricingScreen onClose={() => setShowPricing(false)} />}

        {/* ── Overlay screens ── */}
        {view.type === 'chapter' && (() => {
          const ch = chapters.find(c => c.id === view.chapterId)!
          return (
            <ChapterScreen
              chapter={ch}
              onBack={goHome}
              onLesson={idx => goLesson(ch.id, idx)}
              onQuiz={() => goQuiz(ch.id)}
            />
          )
        })()}

        {view.type === 'lesson' && (() => {
          const ch = chapters.find(c => c.id === view.chapterId)!
          const lesson = ch.lessons[view.lessonIdx]
          const visualNovel = lesson?.visualNovelId ? getVisualNovel(lesson.visualNovelId) : undefined

          if (visualNovel) {
            return (
              <VisualNovelPlayer
                story={visualNovel}
                onBack={() => goChapter(view.chapterId)}
                onComplete={() => handleLessonDone(view.chapterId, view.lessonIdx)}
              />
            )
          }

          return (
            <LessonScreen
              chapter={ch}
              lessonIdx={view.lessonIdx}
              onBack={() => goChapter(view.chapterId)}
              onComplete={() => handleLessonDone(view.chapterId, view.lessonIdx)}
            />
          )
        })()}

        {view.type === 'lesson-done' && (() => {
          const ch = chapters.find(c => c.id === view.chapterId)!
          const lesson = ch.lessons[view.lessonIdx]
          return (
            <LessonCompleteScreen
              lesson={lesson}
              onQuiz={() => goQuiz(view.chapterId)}
              onHome={() => goChapter(view.chapterId)}
            />
          )
        })()}

        {view.type === 'quiz' && (() => {
          const ch = chapters.find(c => c.id === view.chapterId)!
          return (
            <QuizScreen
              chapter={ch}
              onBack={() => goChapter(view.chapterId)}
              onDone={(score, total) => handleQuizDone(score, total, view.chapterId)}
            />
          )
        })()}

        {view.type === 'quiz-result' && (
          <QuizResultScreen
            score={view.score}
            total={view.total}
            onHome={goHome}
            onRetry={() => goQuiz(view.chapterId)}
          />
        )}
      </div>
    </div>
  )
}
