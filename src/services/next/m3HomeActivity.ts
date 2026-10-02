import { success, type Result } from './contracts.ts'

/** Read-only visual demo until an account activity read model is available. */
export type HomeActivitySummary = {
  streakDays: number
  week: Array<{ id: string; label: string; completed: boolean }>
  studiedMinutes: number
  goalMinutes: number
}
export interface HomeActivityService {
  getSummary(): Promise<Result<HomeActivitySummary>>
}
export const m3HomeActivityService: HomeActivityService = {
  async getSummary() {
    return success({
      streakDays: 7,
      week: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label, day) => ({
        id: `demo-week-day-${day}`, label, completed: day < 6,
      })),
      studiedMinutes: 6,
      goalMinutes: 10,
    })
  },
}
