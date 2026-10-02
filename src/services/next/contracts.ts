import type { DeliveredStoryVersion, StoryChoiceReceipt } from './storyDelivery.ts'
import type { AccountSummary, CompletionService } from './completionContracts.ts'
export type * from './completionContracts.ts'
import type { Chapter, LearningDocument, Lesson, Locale, MediaAsset, MultipleChoiceQuestion, QuestionSet, StoryVersion } from '../../types/v2/content.ts'
import type { EpisodeProgress, LessonProgress, VideoProgress } from '../../types/v2/progress.ts'

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
export interface DocumentService {
  getById(documentId: string): Promise<Result<LearningDocument>>
}
export interface VisualNovelService {
  getVersion(storyVersionId: string): Promise<Result<DeliveredStoryVersion>>
}
export interface MediaService {
  getResolvedAsset(mediaAssetId: string): Promise<Result<ResolvedMediaAsset>>
}
export type ResolvedTextResource = { id: string; url: string; locale: Locale; label: string }
export type ResolvedMediaAsset = Omit<MediaAsset, 'storageRef' | 'posterMediaId' | 'captionTrackRefs' | 'transcriptRef'> & {
  url: string
  poster?: { id: string; url: string; altText: string }
  captionTracks: ResolvedTextResource[]
  transcript?: ResolvedTextResource
  fallback?: { kind: 'transcript'; url: string } | { kind: 'poster'; url: string; altText: string }
}
export type SaveLessonCheckpoint = {
  lessonId: string
  currentBlockId?: string
  completedBlockIds: string[]
  operationId: string
  expectedRevision?: number
}
export interface ProgressService {
  getLessonProgress(lessonId: string): Promise<Result<LessonProgress | null>>
  saveCheckpoint(input: SaveLessonCheckpoint): Promise<Result<LessonProgress>>
  getEpisodeProgress(storyVersionId: string): Promise<Result<EpisodeProgress | null>>
  saveEpisodeCheckpoint(input: SaveEpisodeCheckpoint): Promise<Result<EpisodeProgress>>
  recordChoiceWithFeedback?(input: RecordStoryChoice & { replay?: boolean; expectedRevision?: number }): Promise<Result<StoryChoiceReceipt>>
  recordChoice(input: RecordStoryChoice): Promise<Result<EpisodeProgress>>
  getVideoProgress(lessonId: string, blockId: string): Promise<Result<VideoProgress | null>>
  saveVideoPosition(input: SaveVideoPosition): Promise<Result<VideoProgress>>
  getResumePoint(lessonId: string): Promise<Result<ResumePoint>>
}
export type StoryCheckpointContext = { lessonId: string; blockId: string; storyVersionId: string; operationId: string; expectedRevision?: number }
export type SaveEpisodeCheckpoint = StoryCheckpointContext & { currentSceneId: string; visitedSceneIds: string[] }
export type RecordStoryChoice = StoryCheckpointContext & { sceneId: string; choiceId: string }
export type SaveVideoPosition = {
  lessonId: string; blockId: string; operationId: string
  positionSeconds: number; watchedRanges: Array<{ start: number; end: number }>
}
export type ResumePoint =
  | { kind: 'block'; lessonId: string; blockId: string }
  | { kind: 'visual_novel'; lessonId: string; blockId: string; storyVersionId: string; progress: EpisodeProgress | null; sceneId: string }
  | { kind: 'video'; lessonId: string; blockId: string; progress: VideoProgress | null; positionSeconds: number }
export type QuizOption = { id: string; label: string }
/** Explanation/answer keys are withheld from question delivery until trusted grading. */
export type DeliveredQuestion = Omit<MultipleChoiceQuestion, 'explanation' | 'status'> & { options: QuizOption[] }
export type QuestionSetDelivery = { set: QuestionSet; questions: DeliveredQuestion[] }
export type ScoredQuizSubmission = {
  operationId: string
  questionSetId: string
  answers: Array<{ questionId: string; selectedOptionIds: string[] }>
}
/** Submit all QuestionSet.questionIds; the current contract has no optional questions. */
export type PracticeQuizSubmission = ScoredQuizSubmission
/** Exactly one entry per question, ordered by QuestionSet.questionIds, on every success. */
export type QuestionFeedback = { questionId: string; outcome: 'correct' | 'incorrect'; explanation: string }
export type PracticeQuizReceipt = {
  attemptId: string
  feedback: QuestionFeedback[]
}
export type ScoredQuizReceipt = {
  attemptId: string
  score: number
  total: number
  passed: boolean
  feedback: QuestionFeedback[]
}
export interface QuizService {
  getQuestionSet(questionSetId: string): Promise<Result<QuestionSetDelivery>>
  submitPracticeAttempt(input: PracticeQuizSubmission): Promise<Result<PracticeQuizReceipt>>
  submitScoredAttempt(input: ScoredQuizSubmission): Promise<Result<ScoredQuizReceipt>>
}
export type CurrentUserProfile = { id: string; displayName: string; locale: Locale }
export interface UserService {
  getCurrentProfile(): Promise<Result<CurrentUserProfile | null>>
  getAccountSummary(): Promise<Result<AccountSummary | null>>
}
export type LearningServices = {
  chapters: ChapterService
  lessons: LessonService
  documents: DocumentService
  stories: VisualNovelService
  media: MediaService
  progress: ProgressService
  quiz: QuizService
  completion: CompletionService
  users: UserService
}
