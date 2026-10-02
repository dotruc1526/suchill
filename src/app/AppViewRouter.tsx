import { lazyFeature } from './LazyFeature'
import { getVisualNovel } from '../features/visual-novel/stories'
import { chapters } from '../data'
import type { View } from '../types'

const ChapterScreen = lazyFeature(() => import('../features/learning/ChapterScreen').then(module => ({ default: module.ChapterScreen })), { onBack: props => props.onBack() })
const LessonScreen = lazyFeature(() => import('../features/learning/LessonScreen').then(module => ({ default: module.LessonScreen })), { onBack: props => props.onBack() })
const LessonCompleteScreen = lazyFeature(() => import('../features/learning/LessonCompleteScreen').then(module => ({ default: module.LessonCompleteScreen })), { onBack: props => props.onHome() })
const QuizScreen = lazyFeature(() => import('../features/quiz/QuizScreen').then(module => ({ default: module.QuizScreen })), { onBack: props => props.onBack() })
const QuizResultScreen = lazyFeature(() => import('../features/quiz/QuizResultScreen').then(module => ({ default: module.QuizResultScreen })), { onBack: props => props.onHome() })
const VisualNovelPlayer = lazyFeature(() => import('../features/visual-novel/VisualNovelPlayer'), { onBack: props => props.onBack() })


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
