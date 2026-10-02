/** Pure Phase 7 policy helpers for a future trusted backend operation. Never call these from UI to grant XP. */
export type RewardType = 'lesson' | 'episode' | 'quiz' | 'quiz_bonus' | 'daily_review'
const xpByType: Record<RewardType, number> = {
  lesson: 10, episode: 20, quiz: 20, quiz_bonus: 5, daily_review: 5,
}

export function rewardXp(type: RewardType): number {
  return xpByType[type]
}

export function rewardKey(userId: string, type: RewardType, activityId: string, eligibilityVersion: string): string {
  if (![userId, type, activityId, eligibilityVersion].every(Boolean)) throw new Error('Reward identity is required')
  return JSON.stringify([userId, type, activityId, eligibilityVersion])
}

export function quizPassed(score: number, total: number, threshold = 0.7): boolean {
  return total > 0 && score >= 0 && score <= total && score / total >= threshold
}

export function quizBonusEligible(score: number, total: number): boolean {
  return quizPassed(score, total, 0.8)
}

export type WatchedRange = { start: number; end: number }
export function mergedWatchedRanges(ranges: WatchedRange[], durationSeconds: number): WatchedRange[] {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return []
  const sorted = ranges
    .filter(range => Number.isFinite(range.start) && Number.isFinite(range.end))
    .map(range => ({ start: Math.max(0, Math.min(durationSeconds, range.start)),
      end: Math.max(0, Math.min(durationSeconds, range.end)) }))
    .filter(range => range.end > range.start)
    .sort((a, b) => a.start - b.start)
  const merged: WatchedRange[] = []
  let current: WatchedRange | undefined
  for (const range of sorted) {
    if (!current) current = { ...range }
    else if (range.start <= current.end) current.end = Math.max(current.end, range.end)
    else {
      merged.push(current)
      current = { ...range }
    }
  }
  if (current) merged.push(current)
  return merged
}

export function uniqueWatchedSeconds(ranges: WatchedRange[], durationSeconds: number): number {
  return mergedWatchedRanges(ranges, durationSeconds).reduce((total, range) => total + range.end - range.start, 0)
}

export function videoThresholdReached(ranges: WatchedRange[], durationSeconds: number, threshold = 0.9): boolean {
  return durationSeconds > 0 && uniqueWatchedSeconds(ranges, durationSeconds) / durationSeconds >= threshold
}

export type StreakState = { current: number; longest: number; lastLocalDate: string | null }
export function nextStreakDay(state: StreakState, localDate: string): StreakState {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(localDate) || Number.isNaN(Date.parse(`${localDate}T00:00:00Z`))) {
    throw new Error('Invalid local date')
  }
  if (state.lastLocalDate === localDate) return state
  const last = state.lastLocalDate ? Date.parse(`${state.lastLocalDate}T00:00:00Z`) : NaN
  const today = Date.parse(`${localDate}T00:00:00Z`)
  if (Number.isFinite(last) && today < last) throw new Error('Streak day cannot move backwards')
  const current = today - last === 86_400_000 ? state.current + 1 : 1
  return { current, longest: Math.max(state.longest, current), lastLocalDate: localDate }
}
