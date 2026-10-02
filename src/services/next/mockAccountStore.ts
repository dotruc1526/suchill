import type { AccountSettings, AuthSession, CompletionMethod } from './accountContracts.ts'
import type { ScoredQuizReceipt } from './contracts.ts'
import type { RewardLedgerEntry } from '../../types/v2/progress.ts'
import type { StreakState } from './rewardPolicy.ts'

export type MockSession = { userId: string; displayName?: string; locale?: 'vi-VN'; timezone?: string }
export type MockAccount = {
  displayName: string; settings: AccountSettings; streak: StreakState
  lastQualifiedAt?: string; qualifiedTimezone?: string; timezoneChangedAt?: string
}
export type MockQuizAttempt = { mode: 'practice' | 'scored'; receipt: ScoredQuizReceipt; attemptedAt: string; localDate: string }
/** Test/development authority only. Reuse this store across adapter recreation and accounts. */
export const createMockAccountStore = () => ({
  accounts: new Map<string, MockAccount>(),
  blocks: new Map<string, { method: CompletionMethod; completedAt: string }>(),
  lessons: new Map<string, { completedAt: string }>(),
  attempts: new Map<string, MockQuizAttempt[]>(),
  rewards: new Map<string, RewardLedgerEntry>(),
  streakDays: new Set<string>(),
  operations: new Map<string, { signature: string; result: unknown }>(),
  credentials: new Map<string, { session: AuthSession; password: string }>(),
  timezoneAudit: [] as Array<{ userId: string; previous: string; next: string; occurredAt: string }>,
  analytics: [] as Array<{ userId: string; name: string; properties: Record<string, string | number | boolean>; occurredAt: string }>,
})
export type MockAccountStore = ReturnType<typeof createMockAccountStore>
export const accountKey = (...parts: string[]) => JSON.stringify(parts)
export const clone = <T>(value: T): T => structuredClone(value)
/** Internal transport precondition; ownership always remains the authenticated mock session. */
export function expectedMockSubject(input: object, userId: string): boolean {
  const expected = (input as { expectedSubject?: unknown }).expectedSubject
  return expected === undefined || expected === userId
}
export const validTimezone = (timezone: string): boolean => {
  try { new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(); return Boolean(timezone.trim()) } catch { return false }
}
export function ensureMockAccount(store: MockAccountStore, session: MockSession): MockAccount {
  let account = store.accounts.get(session.userId)
  if (!account) {
    account = {
      displayName: session.displayName ?? 'Người học',
      settings: { soundMuted: false, reducedMotion: false, locale: 'vi-VN', analyticsEnabled: false,
        timezone: session.timezone && validTimezone(session.timezone) ? session.timezone : 'Asia/Ho_Chi_Minh' },
      streak: { current: 0, longest: 0, lastLocalDate: null },
    }
    store.accounts.set(session.userId, account)
  }
  return account
}
export function mockLocalDate(instant: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' })
    .formatToParts(new Date(instant))
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-')
}
export function mockTotalXp(store: MockAccountStore, userId: string): number {
  return [...store.rewards.values()].filter(entry => entry.userId === userId).reduce((total, entry) => total + entry.xpDelta, 0)
}
export function mockCurrentStreak(account: MockAccount, instant: string): number {
  const localDate = mockLocalDate(instant, account.settings.timezone)
  return account.streak.lastLocalDate && Date.parse(localDate) - Date.parse(account.streak.lastLocalDate) <= 86_400_000
    ? account.streak.current : 0
}
