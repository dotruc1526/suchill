import type { Locale } from '../../types/v2/content.ts'
import type { Result } from './contracts.ts'

export type CompletionMethod = 'standard' | 'accessible_fallback' | 'media_fallback'
export type CompletionReward = {
  rewardType: 'lesson' | 'episode' | 'quiz' | 'quiz_bonus'
  activityId: string; eligibilityVersion: string; eligibilityKey: string
  status: 'granted' | 'already_granted'; xpDelta: number
}
export type CompletionReceipt = {
  userId: string; lessonId: string; contentVersionId: string; confirmedAt: string
  method: CompletionMethod; reason: 'required_blocks_satisfied'; rewards: CompletionReward[]
}
export type CompletionOutcome =
  | { kind: 'completed' | 'already_completed'; receipt: CompletionReceipt }
  | { kind: 'ineligible'; reasons: Array<{ blockId: string; reason: string }> }
export type AccountSummary = {
  userId: string; displayName: string; locale: Locale; timezone: string
  totalXp: number; currentStreak: number; longestStreak: number; requiredLessonCount: number
  achievements: Array<{ id: string; title: string; confirmedAt: string }>
}
export interface CompletionService {
  completeLesson(input: { lessonId: string; operationId: string }): Promise<Result<CompletionOutcome>>
  getLessonCompletion(lessonId: string): Promise<Result<CompletionReceipt | null>>
  /** Explicit acknowledgement only, never a caller-supplied completion/reward verdict. */
  recordBlockAction(input: {
    lessonId: string; blockId: string; operationId: string
    action: 'acknowledge' | 'accessible_fallback' | 'media_fallback'
  }): Promise<Result<null>>
}
