import { useCallback, useEffect, useState } from 'react'
import { EmptyState, ErrorState, LoadingState, OfflineState } from '../../../components/ui'
import { m3JourneyServices } from '../../../services/next/m3JourneyFixture'
import type { ServiceErrorCode } from '../../../services/next/contracts'
import { JourneyChapter } from './JourneyChapter'
import { JourneyHome } from './JourneyHome'
import { JourneyLessonEntry } from './JourneyLessonEntry'
import { loadJourney, startLesson, type JourneySnapshot } from './journeyModel'

type JourneyView = { type: 'home' } | { type: 'chapter'; chapterId: string } | { type: 'lesson'; chapterId: string; lessonId: string }
type LoadState = { status: 'loading' } | { status: 'ready'; snapshot: JourneySnapshot } | { status: 'error'; error: ServiceErrorCode }

export function LearningJourney() {
  const [view, setView] = useState<JourneyView>({ type: 'home' })
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)

  const refresh = useCallback(async () => {
    setState({ status: 'loading' })
    const result = await loadJourney(m3JourneyServices)
    setState(result.ok ? { status: 'ready', snapshot: result.value } : { status: 'error', error: result.error })
  }, [])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [])

  if (state.status === 'loading') return <LoadingState message="Đang tải hành trình học..." />
  if (state.status === 'error') {
    if (offline || state.error === 'offline') return <><OfflineState /><ErrorState title="Chưa thể tải hành trình" message="Hãy kết nối mạng rồi thử lại. Nội dung chưa được cache trên thiết bị này." onRetry={() => void refresh()} /></>
    return <ErrorState message={`Không thể tải hành trình (${state.error}).`} onRetry={() => void refresh()} />
  }
  if (state.snapshot.chapters.length === 0) return <EmptyState title="Chưa có chương đã xuất bản" message="Hãy quay lại sau khi nội dung được duyệt." />

  const chapter = view.type === 'home' ? undefined : state.snapshot.chapters.find(item => item.id === view.chapterId)
  const lesson = view.type === 'lesson' ? chapter?.lessons.find(item => item.id === view.lessonId) : undefined

  if (view.type === 'lesson' && chapter && lesson) {
    return <JourneyLessonEntry lesson={lesson} onBack={() => setView({ type: 'chapter', chapterId: chapter.id })} />
  }
  if (view.type === 'chapter' && chapter) {
    return <JourneyChapter chapter={chapter} onBack={() => setView({ type: 'home' })} onLesson={async lessonId => {
      const selected = chapter.lessons.find(item => item.id === lessonId)
      if (!selected) return
      const result = await startLesson(m3JourneyServices, selected)
      if (!result.ok) { setState({ status: 'error', error: result.error }); return }
      setView({ type: 'lesson', chapterId: chapter.id, lessonId })
      await refresh()
    }} />
  }
  return <>{offline && <OfflineState />}<JourneyHome chapters={state.snapshot.chapters} onChapter={chapterId => setView({ type: 'chapter', chapterId })} /></>
}
