import type { Locale } from '../../types/v2/content.ts'
import type { Result } from './contracts.ts'

export type AccountSummary = {
  userId: string; displayName: string; totalXp: number; completedLessons: number
  currentStreak: number; longestStreak: number; timezone: string; achievements: string[]
}
export type AccountSettings = {
  soundMuted: boolean; reducedMotion: boolean; locale: Locale; timezone: string; analyticsEnabled: boolean
}
export interface AccountService {
  getSummary(): Promise<Result<AccountSummary>>
  getSettings(): Promise<Result<AccountSettings>>
  updateSettings(input: Partial<AccountSettings>): Promise<Result<AccountSettings>>
}
export type CompletionMethod = 'standard' | 'accessible_fallback' | 'media_fallback'
export type CompleteBlockInput = { lessonId: string; blockId: string; operationId: string; method?: CompletionMethod }
export type CompleteLessonInput = { lessonId: string; operationId: string }
export type CompleteDailyReviewInput = { questionSetId: string; attemptId: string; operationId: string }
export type DailyReviewReceipt = {
  status: 'confirmed'; xpGranted: number; totalXp: number; currentStreak: number; alreadyCompleted: boolean; localDate: string
}
export type CompletionReceipt = {
  status: 'confirmed'; lessonId: string; xpGranted: number; totalXp: number; currentStreak: number; alreadyCompleted: boolean
}
export type BlockCompletionReceipt = CompletionReceipt & { blockId: string; method: CompletionMethod }
export interface CompletionService {
  completeBlock(input: CompleteBlockInput): Promise<Result<BlockCompletionReceipt>>
  completeLesson(input: CompleteLessonInput): Promise<Result<CompletionReceipt>>
  completeDailyReview(input: CompleteDailyReviewInput): Promise<Result<DailyReviewReceipt>>
}
/** Credentials/tokens are adapter internals and never part of this UI-facing session. */
export type AuthSession = { userId: string; displayName: string }
export type SignInInput = { email: string; password: string }
export type SignUpInput = SignInInput & { displayName: string; timezone: string }
export interface AuthService {
  getSession(): Promise<Result<AuthSession | null>>
  signIn(input: SignInInput): Promise<Result<AuthSession>>
  signUp(input: SignUpInput): Promise<Result<AuthSession | null>>
  signOut(): Promise<Result<null>>
  subscribe(listener: (session: AuthSession | null) => void): () => void
}
export type AnalyticsEventName =
  | 'lesson_started' | 'lesson_resumed' | 'block_completed' | 'episode_started' | 'scene_viewed'
  | 'choice_selected' | 'knowledge_check_submitted' | 'video_started' | 'video_completed'
  | 'media_error' | 'fallback_used' | 'lesson_completed' | 'reward_granted' | 'streak_qualified'
export type AnalyticsEvent = { name: AnalyticsEventName; properties: Record<string, string | number | boolean> }
export interface AnalyticsService {
  /** Optional product telemetry. Implementations must swallow failures and honor account opt-out. */
  track(event: AnalyticsEvent): Promise<void>
}
