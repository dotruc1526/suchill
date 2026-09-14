import { useEffect, useState } from "react"
import { chapters, userStats } from "./data"
import type { Tab, View } from "./config/routes"
import { loadProgress, saveProgress } from "./services/progressService"
import TopBar from "./components/navigation/TopBar"
import BottomNav from "./components/navigation/BottomNav"
import HomeScreen from "./screens/HomeScreen"
import PracticeScreen from "./screens/PracticeScreen"
import AIScreen from "./screens/AIScreen"
import ProfileScreen from "./screens/ProfileScreen"
import ChapterScreen from "./screens/ChapterScreen"
import LessonScreen from "./screens/LessonScreen"
import LessonCompleteScreen from "./screens/LessonCompleteScreen"
import QuizScreen from "./screens/QuizScreen"
import QuizResultScreen from "./screens/QuizResultScreen"

export default function App() {
  const [tab, setTab] = useState<Tab>("home")
  const [view, setView] = useState<View>({ type: "home" })
  const [xp, setXP] = useState(() => loadProgress(userStats.xp).xp)

  useEffect(() => {
    saveProgress({ xp })
  }, [xp])

  const goHome = () => setView({ type: "home" })
  const goChapter = (id: number) => setView({ type: "chapter", chapterId: id })
  const goLesson = (chapterId: number, lessonIdx: number) => setView({ type: "lesson", chapterId, lessonIdx })
  const goQuiz = (chapterId: number) => setView({ type: "quiz", chapterId })
  const completeLesson = (chapterId: number, lessonIdx: number) => {
    setXP(currentXp => currentXp + 10)
    setView({ type: "lesson-done", chapterId, lessonIdx })
  }
  const completeQuiz = (score: number, total: number, chapterId: number) => {
    setXP(currentXp => currentXp + score * 10)
    setView({ type: "quiz-result", score, total, chapterId })
  }

  return (
    <div className="flex items-center justify-center min-h-screen" style={{ background: "#C8A882" }}>
      <div className="relative flex flex-col overflow-hidden" style={{ width: "100%", maxWidth: 420, height: "100dvh", maxHeight: 900, background: "#F5E6D0" }}>
        <div className="pointer-events-none absolute inset-0 z-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")" }} />
        <div className="flex flex-col flex-1 overflow-hidden z-10">
          {view.type === "home" && <TopBar xp={xp} streak={userStats.streak} achievements={userStats.achievements} />}
          {view.type === "home" && <div className="flex-1 overflow-y-auto">{tab === "home" && <HomeScreen onChapter={goChapter} onLesson={goLesson} />}{tab === "practice" && <PracticeScreen />}{tab === "ai" && <AIScreen />}{tab === "profile" && <ProfileScreen xp={xp} />}</div>}
          {view.type === "home" && <BottomNav tab={tab} onTab={setTab} />}
        </div>
        {view.type === "chapter" && <ChapterScreen chapter={chapters.find(chapter => chapter.id === view.chapterId)!} onBack={goHome} onLesson={lessonIdx => goLesson(view.chapterId, lessonIdx)} onQuiz={() => goQuiz(view.chapterId)} />}
        {view.type === "lesson" && <LessonScreen chapter={chapters.find(chapter => chapter.id === view.chapterId)!} lessonIdx={view.lessonIdx} onBack={() => goChapter(view.chapterId)} onComplete={() => completeLesson(view.chapterId, view.lessonIdx)} />}
        {view.type === "lesson-done" && <LessonCompleteScreen lesson={chapters.find(chapter => chapter.id === view.chapterId)!.lessons[view.lessonIdx]} onQuiz={() => goQuiz(view.chapterId)} onHome={() => goChapter(view.chapterId)} />}
        {view.type === "quiz" && <QuizScreen chapter={chapters.find(chapter => chapter.id === view.chapterId)!} onBack={() => goChapter(view.chapterId)} onDone={(score, total) => completeQuiz(score, total, view.chapterId)} />}
        {view.type === "quiz-result" && <QuizResultScreen score={view.score} total={view.total} onHome={goHome} onRetry={() => goQuiz(view.chapterId)} />}
      </div>
    </div>
  )
}
