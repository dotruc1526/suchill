import { failure, success } from './contracts.ts'
import type { AccountService, AnalyticsEvent, AnalyticsService, AuthService, AuthSession } from './accountContracts.ts'
import { accountKey, clone, ensureMockAccount, expectedMockSubject, mockCurrentStreak, mockTotalXp, validTimezone,
  type MockAccountStore, type MockSession } from './mockAccountStore.ts'

const analyticsProperties: Record<AnalyticsEvent['name'], string[]> = {
  lesson_started: ['lesson_id', 'version'], lesson_resumed: ['lesson_id', 'block_id'],
  block_completed: ['lesson_id', 'block_id', 'kind'], episode_started: ['story_version_id'],
  scene_viewed: ['story_version_id', 'scene_id', 'kind'], choice_selected: ['scene_id', 'choice_id', 'choice_kind'],
  knowledge_check_submitted: ['activity_id', 'attempt_index', 'result'], video_started: ['media_id', 'block_id'],
  video_completed: ['media_id', 'method'], media_error: ['media_id', 'error_category'],
  fallback_used: ['block_id', 'fallback_type'], lesson_completed: ['lesson_id', 'completion_method'],
  reward_granted: ['reward_type', 'xp_delta'], streak_qualified: ['local_date', 'current_streak'],
}
const validCredentials = (email: string, password: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8

export function createMockAccountServices(store: MockAccountStore, session: MockSession, now: () => string): {
  account: AccountService; auth: AuthService; analytics: AnalyticsService
} {
  const listeners = new Set<(session: AuthSession | null) => void>()
  const currentSession = (): AuthSession | null => session.userId
    ? { userId: session.userId, displayName: ensureMockAccount(store, session).displayName } : null
  const emit = () => { for (const listener of listeners) { try { listener(currentSession()) } catch { /* Consumer cannot block auth. */ } } }
  return {
    account: {
      async getSummary() {
        if (!session.userId) return failure('unauthorized')
        const account = ensureMockAccount(store, session)
        const completedLessons = [...store.lessons.keys()].filter(key => JSON.parse(key)[0] === session.userId).length
        return success({ userId: session.userId, displayName: account.displayName, totalXp: mockTotalXp(store, session.userId),
          completedLessons, currentStreak: mockCurrentStreak(account, now()), longestStreak: account.streak.longest,
          timezone: account.settings.timezone, achievements: [] })
      },
      async getSettings() {
        if (!session.userId) return failure('unauthorized')
        return success(clone(ensureMockAccount(store, session).settings))
      },
      async updateSettings(input) {
        if (!session.userId) return failure('unauthorized')
        if (!input || typeof input !== 'object') return failure('validation')
        if (!expectedMockSubject(input, session.userId)) return failure('unauthorized')
        const safeInput = { ...input } as typeof input & { expectedSubject?: unknown }
        delete safeInput.expectedSubject
        input = safeInput
        if (Object.keys(input).some(key =>
          !['soundMuted', 'reducedMotion', 'locale', 'timezone', 'analyticsEnabled'].includes(key)) ||
          (input.locale !== undefined && input.locale !== 'vi-VN') ||
          ['soundMuted', 'reducedMotion', 'analyticsEnabled'].some(key => key in input && typeof input[key as keyof typeof input] !== 'boolean') ||
          (input.timezone !== undefined && (typeof input.timezone !== 'string' || !validTimezone(input.timezone)))) return failure('validation')
        const account = ensureMockAccount(store, session)
        if (input.timezone && input.timezone !== account.settings.timezone) {
          if (account.timezoneChangedAt && Date.parse(now()) - Date.parse(account.timezoneChangedAt) < 86_400_000) return failure('conflict')
          store.timezoneAudit.push({ userId: session.userId, previous: account.settings.timezone, next: input.timezone, occurredAt: now() })
          account.timezoneChangedAt = now()
        }
        account.settings = { ...account.settings, ...input }
        return success(clone(account.settings))
      },
    },
    auth: {
      async getSession() { return success(currentSession()) },
      async signIn(input) {
        if (!validCredentials(input.email, input.password)) return failure('validation')
        const credential = store.credentials.get(input.email.trim().toLowerCase())
        if (!credential || credential.password !== input.password) return failure('unauthorized')
        session.userId = credential.session.userId
        session.displayName = credential.session.displayName
        emit()
        return success(clone(credential.session))
      },
      async signUp(input) {
        if (!validCredentials(input.email, input.password) || !input.displayName.trim() || input.displayName.length > 80 || !validTimezone(input.timezone)) return failure('validation')
        const email = input.email.trim().toLowerCase()
        if (store.credentials.has(email)) return failure('conflict')
        const next = { userId: `mock.user.${store.credentials.size + 1}`, displayName: input.displayName.trim() }
        store.credentials.set(email, { session: next, password: input.password })
        session.userId = next.userId
        session.displayName = next.displayName
        session.timezone = input.timezone
        ensureMockAccount(store, session)
        emit()
        return success(clone(next))
      },
      async signOut() { session.userId = ''; session.displayName = undefined; emit(); return success(null) },
      subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener) } },
    },
    analytics: {
      async track(event) {
        try {
          if (!expectedMockSubject(event, session.userId)) return
          if (!session.userId || !ensureMockAccount(store, session).settings.analyticsEnabled) return
          const allowed = analyticsProperties[event.name]
          if (!allowed) return
          const properties = Object.fromEntries(Object.entries(event.properties).filter(([key, value]) =>
            allowed.includes(key) && (typeof value === 'boolean' || typeof value === 'number' && Number.isFinite(value) ||
              typeof value === 'string' && value.length <= 128 && !/[\r\n@]/.test(value))))
          store.analytics.push({ userId: session.userId, name: event.name, properties, occurredAt: now() })
          if (store.analytics.length > 500) store.analytics.shift()
        } catch { /* Telemetry is best effort and never participates in learning transactions. */ }
      },
    },
  }
}

export const mockQuizSatisfied = (store: MockAccountStore, userId: string, setId: string, mode?: 'practice' | 'scored'): boolean =>
  (store.attempts.get(accountKey(userId, setId)) ?? []).some(attempt => (!mode || attempt.mode === mode) &&
    (attempt.mode === 'practice' || attempt.receipt.passed))
