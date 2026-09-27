import type { Chapter, Lesson, MediaAsset, StoryVersion } from '../../types/v2/content.ts'
import type { LessonProgress } from '../../types/v2/progress.ts'

export type ServiceErrorCode = 'not_found' | 'unauthorized' | 'offline' | 'validation' | 'conflict' | 'server_error'
export type Result<T> = { ok: true; value: T } | { ok: false; error: ServiceErrorCode }
export const success = <T>(value: T): Result<T> => ({ ok: true, value })
export const failure = <T = never>(error: ServiceErrorCode): Result<T> => ({ ok: false, error })

export interface ChapterService {
  listPublished(): Promise<Result<Chapter[]>>
  getById(chapterId: string): Promise<Result<Chapter>>
}
export interface LessonService {
  getById(lessonId: string): Promise<Result<Lesson>>
}
export interface VisualNovelService {
  getVersion(storyVersionId: string): Promise<Result<StoryVersion>>
}
export interface MediaService {
  getResolvedAsset(mediaAssetId: string): Promise<Result<MediaAsset & { url: string }>>
}
export type SaveLessonCheckpoint = {
  lessonId: string
  currentBlockId?: string
  completedBlockIds: string[]
  operationId: string
}
export interface ProgressService {
  getLessonProgress(lessonId: string): Promise<Result<LessonProgress | null>>
  saveCheckpoint(input: SaveLessonCheckpoint): Promise<Result<LessonProgress>>
}
export type LearningServices = {
  chapters: ChapterService
  lessons: LessonService
  stories: VisualNovelService
  media: MediaService
  progress: ProgressService
}
