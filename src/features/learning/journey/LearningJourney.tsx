import { useCallback, useEffect, useRef, useState } from 'react'
import { EmptyState, ErrorState, LoadingState, OfflineState } from '../../../components/ui'
import type { ServiceErrorCode } from '../../../services/next/contracts'
import { m3JourneyServices } from '../../../services/next/m3JourneyFixture'
import { m3HomeActivityService } from '../../../services/next/m3HomeActivity'
import { JourneyChapter } from './JourneyChapter'
import { JourneyHome } from './JourneyHome'
import { JourneyLessonEntry } from './JourneyLessonEntry'
import { loadJourney, startLesson, type JourneySnapshot } from './journeyModel'

type JourneyView =
  | { type: 'home' }
  | { type: 'chapter'; chapterId: string }
  | { type: 'lesson'; chapterId: string; lessonId: string }
type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; snapshot: JourneySnapshot }
  | { status: 'error'; error: ServiceErrorCode }
type FocusTarget =
  | { kind: 'heading' }
  | { kind: 'chapter-button'; id: string }
  | { kind: 'lesson-button'; id: string }

export function LearningJourney() {
  const [view, setView] = useState<JourneyView>({ type: 'home' })
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)
  const homeHeadingRef = useRef<HTMLHeadingElement>(null)
  const chapterHeadingRef = useRef<HTMLHeadingElement>(null)
  const lessonHeadingRef = useRef<HTMLHeadingElement>(null)
  const chapterButtonsRef = useRef(new Map<string, HTMLButtonElement>())
  const lessonButtonsRef = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocusRef = useRef<FocusTarget | null>(null)

  const refresh = useCallback(async () => {
    setState({ status: 'loading' })
    const result = await loadJourney(m3JourneyServices, m3HomeActivityService)
    setState(result.ok ? { status: 'ready', snapshot: result.value } : { status: 'error', error: result.error })
  }, [])

  useEffect(() => { void refresh() }, [refresh])
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update) }
  }, [])
  useEffect(() => {
    const pending = pendingFocusRef.current
    if (!pending || state.status !== 'ready') return
    const target = pending.kind === 'heading'
      ? view.type === 'home' ? homeHeadingRef.current : view.type === 'chapter' ? chapterHeadingRef.current : lessonHeadingRef.current
      : pending.kind === 'chapter-button' ? chapterButtonsRef.current.get(pending.id) : lessonButtonsRef.current.get(pending.id)
    if (!target) return
    target.focus()
    pendingFocusRef.current = null
  }, [view, state.status])

  if (state.status === 'loading') return <LoadingState message="Đang tải hành trình học..." />
  if (state.status === 'error') {
    if (offline || state.error === 'offline') return <><OfflineState /><ErrorState title="Chưa thể tải hành trình" message="Hãy kết nối mạng rồi thử lại. Nội dung chưa được cache trên thiết bị này." onRetry={() => void refresh()} /></>
    return <ErrorState message={`Không thể tải hành trình (${state.error}).`} onRetry={() => void refresh()} />
  }
  if (state.snapshot.chapters.length === 0) return <EmptyState title="Chưa có chương đã xuất bản" message="Hãy quay lại sau khi nội dung được duyệt." />

  const chapter = view.type === 'home' ? undefined : state.snapshot.chapters.find(item => item.id === view.chapterId)
  const lesson = view.type === 'lesson' ? chapter?.lessons.find(item => item.id === view.lessonId) : undefined

  const openLesson = async (chapterId: string, lessonId: string) => {
    const selected = state.snapshot.chapters.find(item => item.id === chapterId)?.lessons.find(item => item.id === lessonId)
    if (!selected) return
    const result = await startLesson(m3JourneyServices, selected)
    if (!result.ok) { setState({ status: 'error', error: result.error }); return }
    await refresh()
    pendingFocusRef.current = { kind: 'heading' }
    setView({ type: 'lesson', chapterId, lessonId })
  }

  if (view.type === 'lesson' && chapter && lesson) {
    return <JourneyLessonEntry lesson={lesson} services={m3JourneyServices} headingRef={element => {
      lessonHeadingRef.current = element
      if (element && pendingFocusRef.current?.kind === 'heading') {
        element.focus()
        pendingFocusRef.current = null
      }
    }} onBack={() => {
      pendingFocusRef.current = { kind: 'lesson-button', id: lesson.id }
      setView({ type: 'chapter', chapterId: chapter.id })
    }} />
  }
  if (view.type === 'chapter' && chapter) {
    return <JourneyChapter
      chapter={chapter}
      headingRef={chapterHeadingRef}
      lessonButtonRef={(id, element) => { element ? lessonButtonsRef.current.set(id, element) : lessonButtonsRef.current.delete(id) }}
      onBack={() => {
        pendingFocusRef.current = { kind: 'chapter-button', id: chapter.id }
        setView({ type: 'home' })
      }}
      onLesson={lessonId => void openLesson(chapter.id, lessonId)}
    />
  }
  return <>{offline && <OfflineState />}<JourneyHome
    chapters={state.snapshot.chapters}
    activity={state.snapshot.activity}
    onLesson={(chapterId, lessonId) => void openLesson(chapterId, lessonId)}
    headingRef={homeHeadingRef}
    chapterButtonRef={(id, element) => { element ? chapterButtonsRef.current.set(id, element) : chapterButtonsRef.current.delete(id) }}
    onChapter={chapterId => {
      pendingFocusRef.current = { kind: 'heading' }
      setView({ type: 'chapter', chapterId })
    }}
  /></>
}
