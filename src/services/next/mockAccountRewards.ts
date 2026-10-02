import type { MockCatalog } from './mock.ts'
import type { MockSession, MockAccountStore } from './mockAccountStore.ts'
import { accountKey, ensureMockAccount, mockLocalDate } from './mockAccountStore.ts'
import { nextStreakDay, quizBonusEligible, rewardKey, rewardXp, type RewardType } from './rewardPolicy.ts'
import type { ScoredQuizReceipt } from './contracts.ts'

export function qualifyMockStreak(store: MockAccountStore, session: MockSession, instant: string): void {
  const account = ensureMockAccount(store, session)
  const date = mockLocalDate(instant, account.settings.timezone)
  const key = accountKey(session.userId, date)
  if (store.streakDays.has(key)) return
  // A timezone change cannot mint an extra day from the same recent activity window.
  if (account.qualifiedTimezone && account.qualifiedTimezone !== account.settings.timezone && account.lastQualifiedAt &&
    Date.parse(instant) - Date.parse(account.lastQualifiedAt) < 86_400_000) return
  if (account.streak.lastLocalDate && date < account.streak.lastLocalDate) return
  account.streak = nextStreakDay(account.streak, date)
  account.lastQualifiedAt = instant
  account.qualifiedTimezone = account.settings.timezone
  store.streakDays.add(key)
}
export function grantMockReward(
  catalog: MockCatalog, store: MockAccountStore, session: MockSession, type: RewardType, activityId: string, instant: string,
): number {
  const eligibilityVersion = catalog.rewardEligibilityVersions?.[activityId] ?? 'v1'
  const key = rewardKey(session.userId, type, activityId, eligibilityVersion)
  if (store.rewards.has(key)) return 0
  const xpDelta = rewardXp(type)
  store.rewards.set(key, {
    id: `mock.reward.${store.rewards.size + 1}`, userId: session.userId, rewardType: type, activityId,
    eligibilityVersion, xpDelta, idempotencyKey: key, occurredAt: instant,
  })
  return xpDelta
}
export function recordMockQuizOutcome(
  catalog: MockCatalog, store: MockAccountStore, session: MockSession,
  questionSetId: string, mode: 'practice' | 'scored', receipt: ScoredQuizReceipt, instant: string,
): void {
  const key = accountKey(session.userId, questionSetId)
  const attempts = store.attempts.get(key) ?? []
  const account = ensureMockAccount(store, session)
  store.attempts.set(key, [...attempts, { mode, receipt: structuredClone(receipt), attemptedAt: instant,
    localDate: mockLocalDate(instant, account.settings.timezone) }])
  if (mode !== 'scored' || !receipt.passed || !catalog.lessons.some(lesson => lesson.status === 'published' &&
    lesson.blocks.some(block => block.kind === 'quiz' && block.assessmentMode === 'scored' && block.questionSetId === questionSetId))) return
  const granted = grantMockReward(catalog, store, session, 'quiz', questionSetId, instant)
  if (quizBonusEligible(receipt.score, receipt.total)) grantMockReward(catalog, store, session, 'quiz_bonus', questionSetId, instant)
  if (granted) qualifyMockStreak(store, session, instant)
}
