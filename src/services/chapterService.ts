import { chapters } from '../data'
import type { Chapter } from '../types'

/**
 * Chapter Service (Data Abstraction Layer)
 * Giúp tách biệt hoàn toàn Giao diện với Nguồn dữ liệu.
 * Sau này khi dùng Database (Supabase/Node.js/Firebase), bạn CHỈ CẦN sửa code ở đây!
 */
export const chapterService = {
  // Lấy danh sách tất cả các chương
  async getChapters(): Promise<Chapter[]> {
    // TODO: Khi nối Database: return (await db.from('chapters').select('*')).data
    return chapters
  },

  // Lấy chi tiết 1 chương theo ID
  async getChapterById(id: number): Promise<Chapter | undefined> {
    return chapters.find(c => c.id === id)
  },
}

