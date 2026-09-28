import { useState } from 'react'
import type { Tab, View } from '../types'

export function useAppNavigation() {
  const [tab, setTab] = useState<Tab>('home')
  const [view, setView] = useState<View>({ type: 'home' })

  const selectTab = (nextTab: Tab) => setTab(nextTab)
  const goHome = () => setView({ type: 'home' })
  const goChapter = (chapterId: number) => setView({ type: 'chapter', chapterId })
  const goLesson = (chapterId: number, lessonIdx: number) =>
    setView({ type: 'lesson', chapterId, lessonIdx })
  const goQuiz = (chapterId: number) => setView({ type: 'quiz', chapterId })
  const showLessonDone = (chapterId: number, lessonIdx: number) =>
    setView({ type: 'lesson-done', chapterId, lessonIdx })
  const showQuizResult = (chapterId: number, score: number, total: number) =>
    setView({ type: 'quiz-result', chapterId, score, total })

  return {
    tab,
    view,
    isOverlay: view.type !== 'home',
    selectTab,
    goHome,
    goChapter,
    goLesson,
    goQuiz,
    showLessonDone,
    showQuizResult,
  }
}
