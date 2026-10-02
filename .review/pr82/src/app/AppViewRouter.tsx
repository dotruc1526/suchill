import { ChapterScreen } from '../features/learning/ChapterScreen'
import { LessonScreen } from '../features/learning/LessonScreen'
import { LessonCompleteScreen } from '../features/learning/LessonCompleteScreen'
import { QuizScreen } from '../features/quiz/QuizScreen'
import { QuizResultScreen } from '../features/quiz/QuizResultScreen'
import VisualNovelPlayer from '../features/visual-novel/VisualNovelPlayer'
import { getVisualNovel } from '../features/visual-novel/stories'
import { chapters } from '../data'
import type { View } from '../types'

type AppViewRouterProps = {
  view: View
  goHome: () => void
  goChapter: (id: number) => void
  goLesson: (cid: number, idx: number) => void
  goQuiz: (cid: number) => void
  handleLessonDone: (cid: number, lidx: number) => void
  handleQuizDone: (score: number, total: number, cid: number) => void
}

export function AppViewRouter({
  view,
  goHome,
  goChapter,
  goLesson,
  goQuiz,
  handleLessonDone,
  handleQuizDone,
}: AppViewRouterProps) {
  if (view.type === 'chapter') {
    const ch = chapters.find(c => c.id === view.chapterId)!
    return (
      <ChapterScreen
        chapter={ch}
        onBack={goHome}
        onLesson={idx => goLesson(ch.id, idx)}
        onQuiz={() => goQuiz(ch.id)}
      />
    )
  }

  if (view.type === 'lesson') {
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
  }

  if (view.type === 'lesson-done') {
    const ch = chapters.find(c => c.id === view.chapterId)!
    const lesson = ch.lessons[view.lessonIdx]
    return (
      <LessonCompleteScreen
        lesson={lesson}
        onQuiz={() => goQuiz(view.chapterId)}
        onHome={() => goChapter(view.chapterId)}
      />
    )
  }

  if (view.type === 'quiz') {
    const ch = chapters.find(c => c.id === view.chapterId)!
    return (
      <QuizScreen
        chapter={ch}
        onBack={() => goChapter(view.chapterId)}
        onDone={(score, total) => handleQuizDone(score, total, view.chapterId)}
      />
    )
  }

  if (view.type === 'quiz-result') {
    return (
      <QuizResultScreen
        score={view.score}
        total={view.total}
        onHome={goHome}
        onRetry={() => goQuiz(view.chapterId)}
      />
    )
  }

  return null
}
