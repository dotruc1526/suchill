import { useState } from 'react'
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

import VisualNovelPlayer from './features/visual-novel/VisualNovelPlayer'
import { getVisualNovel } from './features/visual-novel/stories'

import { chapters, userStats } from './data'
import type { Tab, View } from './types'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [view, setView] = useState<View>({ type: 'home' })
  const [xp, setXP] = useState(userStats.xp)

  const goHome = () => setView({ type: 'home' })
  const goChapter = (id: number) => setView({ type: 'chapter', chapterId: id })
  const goLesson = (cid: number, idx: number) => setView({ type: 'lesson', chapterId: cid, lessonIdx: idx })
  const goQuiz = (cid: number) => setView({ type: 'quiz', chapterId: cid })

  const handleLessonDone = (cid: number, lidx: number) => {
    setXP(x => x + 10)
    setView({ type: 'lesson-done', chapterId: cid, lessonIdx: lidx })
  }

  const handleQuizDone = (score: number, total: number, cid: number) => {
    setXP(x => x + score * 10)
    setView({ type: 'quiz-result', score, total, chapterId: cid })
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
            <TopBar xp={xp} streak={userStats.streak} achievements={userStats.achievements} />
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
              {tab === 'ai' && <AIScreen />}
              {tab === 'profile' && <ProfileScreen xp={xp} />}
            </div>
          )}

          {!isOverlay && <BottomNav tab={tab} onTab={setTab} />}
        </div>

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
