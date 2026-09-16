import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { chapters as fallbackChapters } from '../data'
import type { Chapter } from '../types'

/**
 * Chapter Service (Supabase Data Abstraction Layer)
 * Truy vấn dữ liệu chương, bài học, hội thoại Chill và trắc nghiệm từ Supabase Database.
 * Tự động chuyển sang fallback an toàn nếu mất mạng hoặc chưa nạp API key.
 */
export const chapterService = {
  // Lấy danh sách tất cả các chương lịch sử kèm bài học và trắc nghiệm
  async getChapters(): Promise<Chapter[]> {
    if (!isSupabaseConfigured()) {
      return fallbackChapters
    }

    try {
      const { data: dbChapters, error } = await supabase
        .from('chapters')
        .select(`
          *,
          lessons (
            *,
            lesson_stories (*)
          ),
          chapter_quizzes (*)
        `)
        .order('order_index', { ascending: true })

      if (error || !dbChapters || dbChapters.length === 0) {
        console.warn('[chapterService] Không thể tải từ Supabase, chuyển sang dữ liệu dự phòng:', error?.message)
        return fallbackChapters
      }

      return dbChapters.map((c: any) => ({
        id: c.id,
        year: c.year,
        title: c.title,
        subtitle: c.subtitle,
        description: c.description,
        progress: c.progress,
        status: c.status,
        unsplashId: c.unsplash_id,
        lessons: (c.lessons || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((l: any) => ({
            id: l.id,
            title: l.title,
            duration: l.duration,
            status: l.status,
            visualNovelId: l.visual_novel_id || undefined,
            story: (l.lesson_stories || [])
              .sort((a: any, b: any) => a.order_index - b.order_index)
              .map((s: any) => ({
                emotion: s.emotion,
                text: s.text,
                highlight: s.highlight || undefined,
                fact: s.fact_label && s.fact_value
                  ? { label: s.fact_label, value: s.fact_value }
                  : undefined,
              })),
            keyPoints: l.key_points || [],
          })),
        quiz: (c.chapter_quizzes || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((q: any) => ({
            question: q.question,
            options: q.options,
            correct: q.correct_index,
            explanation: q.explanation,
          })),
      }))
    } catch (err) {
      console.error('[chapterService] Lỗi kết nối Supabase:', err)
      return fallbackChapters
    }
  },

  // Lấy chi tiết 1 chương theo ID
  async getChapterById(id: number): Promise<Chapter | undefined> {
    const all = await this.getChapters()
    return all.find(c => c.id === id)
  },
}
