/**
 * Su Chill - Database Type Definitions for Supabase
 * Tự động đồng bộ với Postgres Schema trên Supabase
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chapters: {
        Row: {
          id: number
          year: string
          title: string
          subtitle: string
          description: string
          progress: number
          status: 'locked' | 'current' | 'completed'
          unsplash_id: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: number
          year: string
          title: string
          subtitle: string
          description: string
          progress?: number
          status?: 'locked' | 'current' | 'completed'
          unsplash_id?: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: number
          year?: string
          title?: string
          subtitle?: string
          description?: string
          progress?: number
          status?: 'locked' | 'current' | 'completed'
          unsplash_id?: string
          order_index?: number
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: number
          chapter_id: number
          title: string
          duration: number
          status: 'locked' | 'current' | 'completed'
          visual_novel_id: string | null
          order_index: number
          key_points: string[]
          created_at: string
        }
        Insert: {
          id?: number
          chapter_id: number
          title: string
          duration?: number
          status?: 'locked' | 'current' | 'completed'
          visual_novel_id?: string | null
          order_index?: number
          key_points?: string[]
          created_at?: string
        }
        Update: {
          id?: number
          chapter_id?: number
          title?: string
          duration?: number
          status?: 'locked' | 'current' | 'completed'
          visual_novel_id?: string | null
          order_index?: number
          key_points?: string[]
          created_at?: string
        }
      }
      lesson_stories: {
        Row: {
          id: number
          lesson_id: number
          emotion: 'happy' | 'thinking' | 'excited' | 'determined' | 'surprised'
          text: string
          highlight: string | null
          fact_label: string | null
          fact_value: string | null
          order_index: number
        }
        Insert: {
          id?: number
          lesson_id: number
          emotion: 'happy' | 'thinking' | 'excited' | 'determined' | 'surprised'
          text: string
          highlight?: string | null
          fact_label?: string | null
          fact_value?: string | null
          order_index?: number
        }
        Update: {
          id?: number
          lesson_id?: number
          emotion?: 'happy' | 'thinking' | 'excited' | 'determined' | 'surprised'
          text?: string
          highlight?: string | null
          fact_label?: string | null
          fact_value?: string | null
          order_index?: number
        }
      }
      chapter_quizzes: {
        Row: {
          id: number
          chapter_id: number
          question: string
          options: string[]
          correct_index: number
          explanation: string
          order_index: number
        }
        Insert: {
          id?: number
          chapter_id: number
          question: string
          options: string[]
          correct_index: number
          explanation: string
          order_index?: number
        }
        Update: {
          id?: number
          chapter_id?: number
          question?: string
          options?: string[]
          correct_index?: number
          explanation?: string
          order_index?: number
        }
      }
      visual_novel_stories: {
        Row: {
          id: string
          title: string
          era: string
          historical_year: string
          description: string
          initial_scene_id: string
          initial_standing: Json
          metadata: Json
          created_at: string
        }
        Insert: {
          id: string
          title: string
          era: string
          historical_year: string
          description: string
          initial_scene_id: string
          initial_standing?: Json
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          era?: string
          historical_year?: string
          description?: string
          initial_scene_id?: string
          initial_standing?: Json
          metadata?: Json
          created_at?: string
        }
      }
      pvp_questions: {
        Row: {
          id: number
          era: string
          era_year: string
          question: string
          hint: string | null
          options: { label: string; text: string; subtext: string }[]
          correct_index: number
          explanation: string
          created_at: string
        }
        Insert: {
          id?: number
          era: string
          era_year: string
          question: string
          hint?: string | null
          options: { label: string; text: string; subtext: string }[]
          correct_index: number
          explanation: string
          created_at?: string
        }
        Update: {
          id?: number
          era?: string
          era_year?: string
          question?: string
          hint?: string | null
          options?: { label: string; text: string; subtext: string }[]
          correct_index?: number
          explanation?: string
          created_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          username: string
          display_name: string
          email: string | null
          avatar_url: string | null
          xp: number
          level: number
          streak: number
          coins: number
          pvp_matches: number
          pvp_wins: number
          pvp_streak: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name: string
          email?: string | null
          avatar_url?: string | null
          xp?: number
          level?: number
          streak?: number
          coins?: number
          pvp_matches?: number
          pvp_wins?: number
          pvp_streak?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          email?: string | null
          avatar_url?: string | null
          xp?: number
          level?: number
          streak?: number
          coins?: number
          pvp_matches?: number
          pvp_wins?: number
          pvp_streak?: number
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          category: string
          total: number
          created_at: string
        }
        Insert: {
          id: string
          title: string
          description: string
          icon: string
          category?: string
          total?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          category?: string
          total?: number
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked: boolean
          progress: number
          unlocked_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked?: boolean
          progress?: number
          unlocked_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked?: boolean
          progress?: number
          unlocked_at?: string | null
        }
      }
      user_chapter_progress: {
        Row: {
          id: string
          user_id: string
          chapter_id: number
          completed_lessons: number[]
          quiz_score: number | null
          quiz_total: number | null
          status: 'locked' | 'current' | 'completed'
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chapter_id: number
          completed_lessons?: number[]
          quiz_score?: number | null
          quiz_total?: number | null
          status?: 'locked' | 'current' | 'completed'
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chapter_id?: number
          completed_lessons?: number[]
          quiz_score?: number | null
          quiz_total?: number | null
          status?: 'locked' | 'current' | 'completed'
          updated_at?: string
        }
      }
    }
  }
}
