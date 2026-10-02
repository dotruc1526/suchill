import { userStats, achievements } from '../data'
import type { UserStats, Achievement } from '../types'

/**
 * User Service (Data Abstraction Layer)
 * Quản lý XP, Streak, Thành tựu và Đồng bộ tiến độ lưu vào Database.
 */
export const userService = {
  async getUserStats(): Promise<UserStats> {
    // TODO: Khi nối DB: fetch user progress from DB
    return userStats
  },

  async getAchievements(): Promise<Achievement[]> {
    return achievements
  },

  // Cập nhật XP người dùng vào Database
  async addXP(amount: number): Promise<number> {
    // TODO: DB update: await db.from('users').update({ xp: currentXp + amount })
    return userStats.xp + amount
  },
}

