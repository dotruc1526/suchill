/**
 * Canonical Phase 5 types use stable string IDs and live under `types/v2`.
 * Prefixed aliases keep them available from the shared root without silently
 * changing the numeric-ID demo contracts below; M2-05 owns that migration.
 */
export type {
  Chapter as DomainChapter,
  EntityId as DomainEntityId,
  HistoricalClaim as DomainHistoricalClaim,
  HistoricalSource as DomainHistoricalSource,
  ISODateTime as DomainISODateTime,
  Lesson as DomainLesson,
  LessonBlock as DomainLessonBlock,
  Locale as DomainLocale,
  MediaAsset as DomainMediaAsset,
  MultipleChoiceQuestion as DomainMultipleChoiceQuestion,
  PublishStatus as DomainPublishStatus,
  QuestionSet as DomainQuestionSet,
  SceneChoice as DomainSceneChoice,
  StoryVersion as DomainStoryVersion,
  VisualNovelScene as DomainVisualNovelScene,
  VisualNovelStory as DomainVisualNovelStory,
} from './v2/content.ts'
export type {
  EpisodeProgress as DomainEpisodeProgress,
  LearningAttempt as DomainLearningAttempt,
  LessonProgress as DomainLessonProgress,
  ProgressStatus as DomainProgressStatus,
  VideoProgress as DomainVideoProgress,
} from './v2/progress.ts'

/** @deprecated Technical-demo view types. Use the Phase 5 domain aliases above for new work. */
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

