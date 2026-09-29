import type {
  Chapter,
  Lesson,
  MediaAsset,
  MultipleChoiceQuestion,
  QuestionSet,
  StoryVersion,
} from '../../types/v2/content.ts'
import type { EpisodeProgress, LearningAttempt, LessonProgress } from '../../types/v2/progress.ts'

export * from './validation.ts'

export type ServiceErrorCode =
  | 'not_found'
  | 'unauthorized'
  | 'offline'
  | 'validation'
  | 'conflict'
  | 'server_error'

export type Result<T, E = ServiceErrorCode> =
  | { ok: true; value: T }
  | { ok: false; error: E; message?: string }

export const success = <T>(value: T): Result<T> => ({ ok: true, value })
export const failure = <T = never>(error: ServiceErrorCode, message?: string): Result<T> =>
  message ? { ok: false, error, message } : { ok: false, error }

/**
 * Service providing catalog and detailed access to Chapters.
 */
export interface ChapterService {
  listPublished(): Promise<Result<Chapter[]>>
  getById(chapterId: string): Promise<Result<Chapter>>
}

/**
 * Service providing Lesson detail and ordered blocks.
 */
export interface LessonService {
  getById(lessonId: string): Promise<Result<Lesson>>
}

/**
 * Service providing immutable Visual Novel story versions.
 */
export interface VisualNovelService {
  getVersion(storyVersionId: string): Promise<Result<StoryVersion>>
}

/**
 * Service resolving published media assets to secure/client-safe URLs.
 */
export interface MediaService {
  getResolvedAsset(mediaAssetId: string): Promise<Result<MediaAsset & { url: string }>>
}

/**
 * Service for delivering quiz questions and recording attempts.
 */
export interface QuizService {
  getQuestionSet(setId: string): Promise<Result<QuestionSet>>
  getQuestions(questionIds: string[]): Promise<Result<MultipleChoiceQuestion[]>>
  submitAttempt(attempt: Omit<LearningAttempt, 'id' | 'attemptedAt'>): Promise<Result<LearningAttempt>>
}

export type SaveLessonCheckpoint = {
  lessonId: string
  currentBlockId?: string
  completedBlockIds: string[]
  operationId: string
}

/**
 * Service for user progress, checkpoints, and resume points.
 */
export interface ProgressService {
  getLessonProgress(lessonId: string): Promise<Result<LessonProgress | null>>
  saveCheckpoint(input: SaveLessonCheckpoint): Promise<Result<LessonProgress>>
  getEpisodeProgress?(storyVersionId: string): Promise<Result<EpisodeProgress | null>>
}

export type UserProfileDto = {
  id: string
  displayName: string
  xp: number
  streakDays: number
}

/**
 * Service for user profile and settings read-model.
 */
export interface UserService {
  getCurrentProfile(): Promise<Result<UserProfileDto>>
}

/**
 * Bundled domain services interface for MVP learning experience.
 */
export type LearningServices = {
  chapters: ChapterService
  lessons: LessonService
  stories: VisualNovelService
  media: MediaService
  progress: ProgressService
  quiz?: QuizService
  user?: UserService
}

export type DomainServices = {
  chapters: ChapterService
  lessons: LessonService
  stories: VisualNovelService
  media: MediaService
  progress: ProgressService
  quiz: QuizService
  user: UserService
}
