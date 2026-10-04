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
export type DraftView = 'draft02' | 'draft03' | 'draft04' | 'draft05' | 'draft07'
export type PreviewView = 'home' | 'chapter' | 'video' | 'lessonSix' | DraftView
export const previewHashes = { home: '', chapter: '#chapter-1954', video: '#episode-1954-01', lessonSix: '#episode-1954-06-preview',
  draft02: '#episode-1954-02', draft03: '#episode-1954-03', draft04: '#episode-1954-04', draft05: '#episode-1954-05', draft07: '#episode-1954-07' } as const
export function draftEpisode(view: PreviewView) {
  return view.startsWith('draft') ? previewChapter.episodes.find(episode => episode.id.endsWith(view.slice(-2))) : undefined
}
export function viewForHash(hash: string): PreviewView {
  const draft = Object.entries(previewHashes).find(([view, value]) => view.startsWith('draft') && value === hash)
  if (draft) return draft[0] as DraftView
  if (hash === '#visual-novel-demo' || hash === '#episode-1954-06-preview') return 'lessonSix'
  if (hash === '#chapter-1954') return 'chapter'
  if (hash === '#episode-1954-01' && previewChapter.episodes[0].available) return 'video'
  return 'home'
}
export function canOpenEpisode(id: string) {
  return previewChapter.episodes.some(episode => episode.id === id && episode.available)
}
// User-authorized UI prototype; does not change canonical lesson availability.
export function canPreviewLesson(id: string) { return previewChapter.episodes.some(episode => episode.id === id) }
export function previewViewForEpisode(id: string): PreviewView {
  if (id === 'preview.1954.episode01') return 'video'
  if (id === 'preview.1954.episode06') return 'lessonSix'
  const view = `draft${id.slice(-2)}`
  return view in previewHashes ? view as DraftView : 'home'
}
