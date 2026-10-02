import type { LearningServices } from '../../../services/next/contracts.ts'
import type { HomeActivityService } from '../../../services/next/m3HomeActivity.ts'

export function accountHomeActivity(services: LearningServices): HomeActivityService {
  return { async getSummary() {
    const result = await services.account.getSummary()
    if (!result.ok) return result
    // No weekly/minute data in the account contract; zero goal means no goal widget.
    return { ok: true, value: { streakDays: result.value.currentStreak, week: [], studiedMinutes: 0, goalMinutes: 0 } }
  } }
}
