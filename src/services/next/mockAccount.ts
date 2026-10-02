import { failure, success } from './backendContracts.ts'
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
const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254 && !value.endsWith('@accounts.suchill.invalid')
const validName = (value: string) => /^[a-z0-9_]{3,32}$/.test(value)
const validPassword = (value: string) => value.length >= 8 && value.length <= 128
const normalized = (value: string) => value.trim().toLowerCase()
const validCredentials = (identifier: string, password: string) =>
  (validEmail(normalized(identifier)) || validName(normalized(identifier))) && validPassword(password)

export function createMockAccountServices(store: MockAccountStore, session: MockSession, now: () => string): {
  account: AccountService; auth: AuthService; analytics: AnalyticsService
} {
  const listeners = new Set<(session: AuthSession | null) => void>()
  const currentCredential = () => [...store.credentials.values()].find(value => value.session.userId === session.userId)
  const currentSession = (): AuthSession | null => session.userId
    ? { ...(currentCredential()?.session ?? {}), userId: session.userId, displayName: ensureMockAccount(store, session).displayName } : null
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
        const identifier = normalized(input.username ?? input.email)
        if (!validCredentials(identifier, input.password) || (input.username !== undefined ? !validName(identifier) : !validEmail(identifier)) ||
          !input.displayName.trim() || input.displayName.length > 80 || !validTimezone(input.timezone)) return failure('validation')
        if (store.credentials.has(identifier)) return failure('conflict')
        const next: AuthSession = { userId: `mock.user.${store.credentials.size + 1}`, displayName: input.displayName.trim(),
          ...(input.username !== undefined ? { username: identifier } : {}) }
        store.credentials.set(identifier, { session: next, password: input.password })
        session.userId = next.userId
        session.displayName = next.displayName
        session.timezone = input.timezone
        ensureMockAccount(store, session)
        emit()
        return success(clone(next))
      },
      async signOut() { session.userId = ''; session.displayName = undefined; emit(); return success(null) },
      subscribe(listener) { listeners.add(listener); return () => { listeners.delete(listener) } },
      async claimUsername(username, context) {
        const name = normalized(username), credential = currentCredential()
        if (!session.userId || !credential || (context?.expectedSubject !== undefined && context.expectedSubject !== session.userId)) return failure('unauthorized')
        if (!validName(name)) return failure('validation')
        if ((credential.session.username && credential.session.username !== name) ||
          (store.credentials.has(name) && store.credentials.get(name) !== credential)) return failure('conflict')
        credential.session.username = name
        store.credentials.set(name, credential)
        emit()
        return success(clone(credential.session))
      },
      async setRecoveryEmail(email, context) {
        const address = normalized(email), credential = currentCredential()
        if (!session.userId || !credential || (context?.expectedSubject !== undefined && context.expectedSubject !== session.userId)) return failure('unauthorized')
        if (!validEmail(address)) return failure('validation')
        // Mock records pending setup; it never pretends that mailbox verification occurred.
        credential.session.pendingRecoveryEmail = address
        emit()
        return success(clone(credential.session))
      },
      async requestPasswordReset(email) {
        return validEmail(normalized(email)) ? success(null) : failure('validation')
      },
      async updatePassword(password, context) {
        const credential = currentCredential()
        if (!session.userId || !credential || (context?.expectedSubject !== undefined && context.expectedSubject !== session.userId)) return failure('unauthorized')
        if (!validPassword(password)) return failure('validation')
        credential.password = password
        return success(null)
      },
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
