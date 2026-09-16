import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getVisualNovel } from '../features/visual-novel/stories'
import type { VisualNovelStory } from '../features/visual-novel/types'

/**
 * Visual Novel Service (Supabase Data Abstraction Layer)
 * Quản lý nạp kịch bản Game Visual Novel tương tác từ Supabase Database.
 */
export const visualNovelService = {
  // Lấy kịch bản Visual Novel theo Story ID
  async getStoryById(id: string): Promise<VisualNovelStory | undefined> {
    const fallback = getVisualNovel(id)
    if (!isSupabaseConfigured()) {
      return fallback
    }

    try {
      const { data, error } = await supabase
        .from('visual_novel_stories')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error || !data || !fallback) {
        return fallback
      }

      return {
        ...fallback,
        title: data.title || fallback.title,
        description: data.description || fallback.description,
        era: data.era || fallback.era,
      }
    } catch (err) {
      console.warn('[visualNovelService] Lỗi nạp story từ Supabase:', err)
      return fallback
    }
  },
}
