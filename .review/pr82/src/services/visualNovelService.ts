import { getVisualNovel } from '../features/visual-novel/stories'
import type { VisualNovelStory } from '../features/visual-novel/types'

/**
 * Visual Novel Service (Data Abstraction Layer)
 * Quản lý nạp kịch bản Game Visual Novel từ file tĩnh hoặc từ Database sau này.
 */
export const visualNovelService = {
  // Lấy kịch bản Visual Novel theo Story ID
  async getStoryById(id: string): Promise<VisualNovelStory | undefined> {
    // TODO: Khi nối Database: return (await db.from('visual_novel_stories').select('*, scenes(*)').eq('id', id)).data
    return getVisualNovel(id)
  },
}

