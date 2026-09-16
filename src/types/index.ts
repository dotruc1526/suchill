export type MascotEmotion =
  | 'happy'
  | 'excited'
  | 'thinking'
  | 'sad'
  | 'correct'
  | 'wrong'
  | 'determined'
  | 'surprised'
  | 'loving'
  | 'idea'
  | 'sleepy'
  | 'sorry'
  | 'laughing'
  | 'shy'
  | 'crying'
  | 'angry'
  | 'worried'

export type StoryStep = {
  emotion: MascotEmotion
  text: string
  highlight?: string
  fact?: { label: string; value: string }
}

export type QuizQuestion = {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export type Lesson = {
  id: number
  title: string
  duration: number
  status: 'completed' | 'current' | 'locked'
  story: StoryStep[]
  keyPoints: string[]
  visualNovelId?: string
}

export type Chapter = {
  id: number
  year: string
  title: string
  subtitle: string
  description: string
  progress: number
  status: 'completed' | 'current' | 'locked'
  lessons: Lesson[]
  quiz: QuizQuestion[]
  unsplashId?: string
}

export type UserStats = {
  name: string
  streak: number
  xp: number
  achievements: number
  totalLessons: number
  totalQuestions: number
  accuracy: number
}

export type Achievement = {
  id: number
  icon: string
  title: string
  desc: string
  earned: boolean
}

export type AIMessage = {
  role: 'user' | 'ai'
  text: string
}

export type Tab = 'home' | 'practice' | 'ai' | 'profile'

export type View =
  | { type: 'home' }
  | { type: 'chapter'; chapterId: number }
  | { type: 'lesson'; chapterId: number; lessonIdx: number }
  | { type: 'lesson-done'; chapterId: number; lessonIdx: number }
  | { type: 'quiz'; chapterId: number }
  | { type: 'quiz-result'; score: number; total: number; chapterId: number }

