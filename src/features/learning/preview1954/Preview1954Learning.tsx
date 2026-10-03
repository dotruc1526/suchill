import { useEffect, useRef, useState } from 'react'
import { Button, Card, OfflineState } from '../../../components/ui'
import { BookOpenIcon } from '../../../components/icons/NavIcon'
import { lazyFeature } from '../../../app/LazyFeature'
import { theme } from '../../../theme/tokens'
import { canOpenEpisode, previewChapter, viewForHash, type PreviewView } from '../../../services/reference1954/catalog'

const PreviewEpisode = lazyFeature(() => import('./PreviewEpisode'))
const hashes = { home: '', chapter: '#chapter-1954', video: '#episode-1954-01' } as const
export type PreviewLearningProps = { active?: boolean; offlineStatusProvided?: boolean; onSafeToUpdateChange?: (safe: boolean) => void }

export default function Preview1954Learning({ active = true, offlineStatusProvided = false, onSafeToUpdateChange }: PreviewLearningProps) {
  const [view, setView] = useState<PreviewView>(() => viewForHash(window.location.hash))
  const [offline, setOffline] = useState(() => !navigator.onLine)
  const heading = useRef<HTMLHeadingElement>(null)
  const returnFocus = useRef<'chapter' | 'episode' | null>(null)
  const chapterButton = useRef<HTMLDivElement>(null)
  const episodeButton = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const navigate = () => setView(viewForHash(window.location.hash))
    const network = () => setOffline(!navigator.onLine)
    window.addEventListener('popstate', navigate)
    window.addEventListener('hashchange', navigate)
    window.addEventListener('online', network)
    window.addEventListener('offline', network)
    return () => {
      window.removeEventListener('popstate', navigate); window.removeEventListener('hashchange', navigate)
      window.removeEventListener('online', network); window.removeEventListener('offline', network)
    }
  }, [])
  useEffect(() => {
    onSafeToUpdateChange?.(active && view === 'home')
    return () => { onSafeToUpdateChange?.(false) }
  }, [active, view, onSafeToUpdateChange])
  useEffect(() => {
    if (!active) return
    const target = returnFocus.current === 'chapter' ? chapterButton.current
      : returnFocus.current === 'episode' ? episodeButton.current : heading.current
    if (target instanceof HTMLHeadingElement) target.focus()
    else target?.querySelector('button')?.focus()
    returnFocus.current = null
  }, [active, view])
  function navigate(next: PreviewView) {
    history.pushState({ suchillPreview1954: { from: view } }, '', location.pathname + location.search + hashes[next])
    setView(next)
  }
  function goBack() {
    const parent: PreviewView = view === 'video' ? 'chapter' : 'home'
    returnFocus.current = view === 'video' ? 'episode' : 'chapter'
    if (history.state?.suchillPreview1954?.from === parent) {
      history.back()
    } else {
      // Direct links and Home→video have no chapter entry to pop. Replace this
      // view with its parent so Android/browser Back cannot reopen the video.
      history.replaceState(history.state, '', location.pathname + location.search + hashes[parent])
      setView(parent)
    }
  }
  function openEpisode(id: string) { if (canOpenEpisode(id)) navigate('video') }
  if (!active) return null

  return <section data-testid="preview1954-learning" aria-labelledby="preview1954-heading" className="space-y-4 px-4 py-4" style={{ color: theme.colors.textPrimary }}>
    {offline && !offlineStatusProvided && <OfflineState />}
    {view !== 'home' && <Button variant="outline" data-testid="preview1954-back" onClick={goBack}>‹ {view === 'video' ? 'VỀ DANH SÁCH TẬP' : 'VỀ HỌC BÀI'}</Button>}
    <header>
      {view !== 'home' && <p className="text-xs font-bold" style={{ color: theme.colors.textSecondary }}>{previewChapter.label} · NĂM 1954</p>}
      <h1 id="preview1954-heading" ref={heading} tabIndex={-1} className="text-2xl font-bold outline-none">{view === 'home' ? 'Học bài' : view === 'chapter' ? 'Năm 1954' : 'Tập 1 — Trước cơn bão'}</h1>
      <p className="mt-2 text-sm" style={{ color: theme.colors.textSecondary }}>{view === 'home' ? 'Khám phá lịch sử qua từng tập.' : view === 'chapter' ? '7 tập · Tập 1 đang mở để xem thử.' : 'Bản xem thử · Video Tập 1'}</p>
    </header>
    {view === 'home' && <Card className="space-y-4" accentColor={theme.colors.primary} accentPosition="top">
      <div className="flex items-start gap-3">
        <BookOpenIcon size={32} aria-hidden="true" className="shrink-0" style={{ color: theme.colors.primary }} />
        <div className="min-w-0"><p className="text-xs font-bold" style={{ color: theme.colors.textSecondary }}>CHƯƠNG 01</p><h2 className="mt-1 text-xl font-bold">NĂM 1954</h2><p className="mt-2 text-sm" style={{ color: theme.colors.textSecondary }}>7 tập · 1 tập đang mở</p></div>
      </div>
      <p className="text-sm">Tập 1 — Trước cơn bão</p>
      <Button data-testid="preview1954-start" className="w-full" onClick={() => openEpisode(previewChapter.episodes[0].id)}>XEM TẬP 1</Button>
      <div ref={chapterButton}><Button data-testid="preview1954-chapter" className="w-full" variant="outline" onClick={() => navigate('chapter')}>XEM DANH SÁCH 7 TẬP</Button></div>
      <p className="text-sm" style={{ color: theme.colors.textMuted }}>Tập 2–7 tạm khóa, sẽ được mở sau.</p>
    </Card>}
    {view === 'chapter' && <>
      <p id="preview1954-lock-note" className="text-sm" style={{ color: theme.colors.textSecondary }}>Các tập còn lại đang chuẩn bị và chưa thể mở.</p>
      <ol aria-label="Danh sách tập năm 1954" className="space-y-3">
        {previewChapter.episodes.map((episode, index) => <li key={episode.id}>
          <Card className="space-y-3">
            <p className="text-xs font-bold" style={{ color: theme.colors.textSecondary }}>TẬP {index + 1}</p>
            <h2 className="break-words text-base font-bold">{episode.title}</h2>
            <div ref={episode.available ? episodeButton : undefined}><Button data-testid={episode.id} disabled={!episode.available} aria-describedby={!episode.available ? 'preview1954-lock-note' : undefined}
              variant={episode.available ? 'primary' : 'outline'} className={`w-full ${episode.available ? '' : 'cursor-not-allowed'}`}
              onClick={() => openEpisode(episode.id)}>{episode.available ? 'XEM VIDEO' : 'TẠM KHÓA'}</Button></div>
          </Card>
        </li>)}
      </ol>
    </>}
    {view === 'video' && <PreviewEpisode />}
  </section>
}
