import type { CompletionReceipt, CompletionReward } from './completionContracts.ts'
import type { EpisodeProgress, VideoProgress } from '../../types/v2/progress.ts'
import type { ScoredQuizReceipt } from './contracts.ts'

/** Author-controlled mock metadata: required until Lesson has a canonical version field. */
export type MockCompletionPolicy = {
  lessonId: string; contentVersionId: string; eligibilityVersion: string
  requiredLesson: boolean
  /** Only authored chapter/final assessments receive quiz XP; ordinary checks do not. */
  rewardedAssessmentIds?: string[]
  videoFallbacks?: Array<{ blockId: string; checkBlockId: string }>
}
export const createMockCompletionStore = () => ({
  quizOperations: new Map<string, { signature: string; result: ScoredQuizReceipt }>(),
  receipts: new Map<string, CompletionReceipt>(),
  operations: new Map<string, { signature: string; receipt: CompletionReceipt | null; outcome?: 'completed' | 'already_completed' }>(),
  rewards: new Map<string, CompletionReward & { userId: string; confirmedAt: string }>(),
  qualifiedActivities: new Set<string>(),
  requiredLessons: new Map<string, Set<string>>(),
  days: new Map<string, Set<string>>(),
  actions: new Map<string, 'acknowledge' | 'accessible_fallback' | 'media_fallback'>(),
  episodes: new Map<string, EpisodeProgress>(),
  choices: new Map<string, Map<string, string>>(),
  videos: new Map<string, VideoProgress>(),
  quizzes: new Map<string, ScoredQuizReceipt>(),
})
export type MockCompletionStore = ReturnType<typeof createMockCompletionStore>
