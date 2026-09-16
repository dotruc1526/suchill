import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { userStats as fallbackUserStats, achievements as fallbackAchievements } from '../data'
import type { UserStats, Achievement } from '../types'

/**
 * User Service (Supabase Data Abstraction Layer)
 * Quản lý XP, Streak, Xu, Thành tựu và Hồ sơ người dùng trên Supabase.
 */
export const userService = {
  // Lấy thống kê người dùng
  async getUserStats(userId?: string): Promise<UserStats> {
    if (!isSupabaseConfigured() || !userId) {
      return fallbackUserStats
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error || !data) {
        return fallbackUserStats
      }

      return {
        level: data.level,
        xp: data.xp,
        streak: data.streak,
        title: data.display_name || 'Học giả Lịch sử',
        joinedDate: new Date(data.created_at).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
      }
    } catch (err) {
      console.warn('[userService] Lỗi đọc user stats từ Supabase:', err)
      return fallbackUserStats
    }
  },

  // Lấy danh sách thành tựu từ Database
  async getAchievements(userId?: string): Promise<Achievement[]> {
    if (!isSupabaseConfigured()) {
      return fallbackAchievements
    }

    try {
      const { data: dbAchievements, error } = await supabase
        .from('achievements')
        .select('*')

      if (error || !dbAchievements || dbAchievements.length === 0) {
        return fallbackAchievements
      }

      // Nếu có userId, kiểm tra tiến độ mở khóa cá nhân
      let unlockedMap: Record<string, { unlocked: boolean; progress: number }> = {}
      if (userId) {
        const { data: userAch } = await supabase
          .from('user_achievements')
          .select('achievement_id, unlocked, progress')
          .eq('user_id', userId)

        if (userAch) {
          userAch.forEach(a => {
            unlockedMap[a.achievement_id] = { unlocked: a.unlocked, progress: a.progress }
          })
        }
      }

      return dbAchievements.map(a => ({
        id: a.id,
        title: a.title,
        desc: a.description,
        icon: a.icon,
        unlocked: unlockedMap[a.id]?.unlocked ?? false,
        progress: unlockedMap[a.id]?.progress ?? 0,
        total: a.total,
      }))
    } catch (err) {
      console.warn('[userService] Lỗi đọc achievements từ Supabase:', err)
      return fallbackAchievements
    }
  },

  // Cập nhật XP người dùng vào Supabase
  async addXP(userId: string, amount: number, currentXp: number): Promise<number> {
    const newXp = currentXp + amount
    const newLevel = Math.max(0, Math.floor(newXp / 100))

    if (!isSupabaseConfigured() || !userId) {
      return newXp
    }

    try {
      await supabase
        .from('user_profiles')
        .update({
          xp: newXp,
          level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
    } catch (err) {
      console.error('[userService] Lỗi cập nhật XP lên Supabase:', err)
    }

    return newXp
  },

  // Đồng bộ toàn bộ tiến độ người dùng lên Supabase
  async syncUserProfile(profile: {
    id: string
    username: string
    displayName: string
    xp: number
    level: number
    streak: number
    coins: number
    pvpMatches: number
    pvpWins: number
    pvpStreak: number
  }): Promise<void> {
    if (!isSupabaseConfigured()) return

    try {
      await supabase.from('user_profiles').upsert({
        id: profile.id,
        username: profile.username,
        display_name: profile.displayName,
        xp: profile.xp,
        level: profile.level,
        streak: profile.streak,
        coins: profile.coins,
        pvp_matches: profile.pvpMatches,
        pvp_wins: profile.pvpWins,
        pvp_streak: profile.pvpStreak,
        updated_at: new Date().toISOString(),
      })
    } catch (err) {
      console.warn('[userService] Lỗi sync user profile lên Supabase:', err)
    }
  },
}
