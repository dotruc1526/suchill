import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

/**
 * Kiểm tra xem ứng dụng đã được cấu hình Supabase hợp lệ hay chưa.
 * Trả về false nếu chưa điền key hoặc đang dùng key mẫu placeholder.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false
  if (
    supabaseUrl.includes('your-project-ref') ||
    supabaseAnonKey.includes('your-anon-key-here') ||
    supabaseUrl.trim() === ''
  ) {
    return false
  }
  return true
}

let supabaseInstance: SupabaseClient<Database> | null = null

export function getSupabase(): SupabaseClient<Database> {
  if (!supabaseInstance) {
    // Nếu chưa cấu hình, khởi tạo dummy URL để thư viện không crash khi parse
    const validUrl = isSupabaseConfigured() ? supabaseUrl : 'https://dummy-suchill-project.supabase.co'
    const validKey = isSupabaseConfigured() ? supabaseAnonKey : 'dummy-anon-key'
    
    supabaseInstance = createClient<Database>(validUrl, validKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  }
  return supabaseInstance
}

export const supabase = getSupabase()
