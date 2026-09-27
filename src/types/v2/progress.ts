import type { EntityId, ISODateTime } from './content.ts'

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'
export type LessonProgress = {
  userId: EntityId
  lessonId: EntityId
  status: ProgressStatus
  currentBlockId?: EntityId
  completedBlockIds: EntityId[]
  startedAt?: ISODateTime
  completedAt?: ISODateTime
  updatedAt: ISODateTime
}
export type EpisodeProgress = {
  userId: EntityId
  storyVersionId: EntityId
  status: ProgressStatus
  currentSceneId: EntityId
  visitedSceneIds: EntityId[]
  lockedChoiceIds: EntityId[]
  startedAt: ISODateTime
  completedAt?: ISODateTime
  updatedAt: ISODateTime
}
export type VideoProgress = {
  userId: EntityId
  lessonId: EntityId
  blockId: EntityId
  positionSeconds: number
  watchedRanges: Array<{ start: number; end: number }>
  completed: boolean
  updatedAt: ISODateTime
}
export type LearningAttempt = {
  id: EntityId
  userId: EntityId
  activityType: 'knowledge_check' | 'quiz' | 'ai_battle'
  activityId: EntityId
  selectedOptionIds: EntityId[]
  isCorrect?: boolean
  attemptedAt: ISODateTime
}
export type RewardLedgerEntry = {
  id: EntityId
  userId: EntityId
  rewardType: 'lesson' | 'episode' | 'quiz' | 'quiz_bonus' | 'daily_review' | 'achievement' | 'adjustment'
  activityId: EntityId
  eligibilityVersion: string
  xpDelta: number
  idempotencyKey: string
  occurredAt: ISODateTime
  reason?: string
}
