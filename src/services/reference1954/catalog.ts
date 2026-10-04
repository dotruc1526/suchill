// User-supplied titles; availability is a preview policy, independent of account progress.
export const previewChapter = {
  id: 'preview.chapter1954', title: 'Năm 1954', label: 'CHƯƠNG 01',
  episodes: [
    { id: 'preview.1954.episode01', title: 'Trước cơn bão', available: true },
    { id: 'preview.1954.episode02', title: 'Vì sao lại là Điện Biên Phủ?', available: false },
    { id: 'preview.1954.episode03', title: 'Chuẩn bị cho trận quyết chiến', available: false },
    { id: 'preview.1954.episode04', title: '56 ngày đêm', available: false },
    { id: 'preview.1954.episode05', title: 'Ngày 7/5/1954', available: false },
    { id: 'preview.1954.episode06', title: 'Từ Điện Biên Phủ đến Genève', available: false },
    { id: 'preview.1954.episode07', title: 'Việt Nam sau năm 1954', available: false },
  ],
} as const
export type PreviewView = 'home' | 'chapter' | 'video' | 'lessonSix'
export function viewForHash(hash: string): PreviewView {
  if (hash === '#visual-novel-demo' || hash === '#episode-1954-06-preview') return 'lessonSix'
  if (hash === '#chapter-1954') return 'chapter'
  if (hash === '#episode-1954-01' && previewChapter.episodes[0].available) return 'video'
  return 'home'
}
export function canOpenEpisode(id: string) {
  return previewChapter.episodes.some(episode => episode.id === id && episode.available)
}
// User-authorized UI prototype; does not change canonical lesson availability.
export function canPreviewLesson(id: string) { return id === 'preview.1954.episode06' }
