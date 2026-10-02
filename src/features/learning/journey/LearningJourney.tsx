import { useCallback, useEffect, useRef, useState } from 'react'
import { EmptyState, ErrorState, LoadingState, OfflineState } from '../../../components/ui'
import type { LearningServices, ServiceErrorCode } from '../../../services/next/contracts'
import { m3JourneyServices } from '../../../services/next/m3JourneyFixture'
import type { HomeActivityService } from '../../../services/next/m3HomeActivity'
import { JourneyChapter } from './JourneyChapter'
import { JourneyHome } from './JourneyHome'
import { JourneyLessonEntry } from './JourneyLessonEntry'
import { loadJourney, startLesson, type JourneySnapshot } from './journeyModel'
import { accountHomeActivity } from './accountHomeActivity'

type JourneyView =
  | { type: 'home' }
  | { type: 'chapter'; chapterId: string }
  | { type: 'lesson'; chapterId: string; lessonId: string }
type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; snapshot: JourneySnapshot; services: LearningServices }
  | { status: 'error'; error: ServiceErrorCode }
type FocusTarget =
  | { kind: 'heading' }
  | { kind: 'chapter-button'; id: string }
  | { kind: 'lesson-button'; id: string }

export function LearningJourney({ services = m3JourneyServices, activityService, onAccountChange }: {
  services?: LearningServices
  activityService?: HomeActivityService
  onAccountChange?: () => void
}) {
  const [view, setView] = useState<JourneyView>({ type: 'home' })
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [offline, setOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine)
  const homeHeadingRef = useRef<HTMLHeadingElement>(null)
  const chapterHeadingRef = useRef<HTMLHeadingElement>(null)
  const lessonHeadingRef = useRef<HTMLHeadingElement>(null)
  const chapterButtonsRef = useRef(new Map<string, HTMLButtonElement>())
  const lessonButtonsRef = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocusRef = useRef<FocusTarget | null>(null)
  const loadRevisionRef = useRef(0)

  const refresh = useCallback(async () => {
    setState({ status: 'loading' })
    const revision = ++loadRevisionRef.current
    try {
      const result = await loadJourney(services, activityService ?? accountHomeActivity(services))
      if (loadRevisionRef.current === revision) setState(result.ok ? { status: 'ready', snapshot: result.value, services } : { status: 'error', error: result.error })
    } catch { if (loadRevisionRef.current === revision) setState({ status: 'error', error: 'server_error' }) }
  }, [services, activityService])

  useEffect(() => {
    setView({ type: 'home' })
    void refresh()
    return () => { loadRevisionRef.current += 1 }
  }, [refresh])
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

  if (state.status === 'loading' || state.status === 'ready' && state.services !== services) return <LoadingState message="Đang tải hành trình học..." />
  if (state.status === 'error') {
    if (offline || state.error === 'offline') return <><OfflineState /><ErrorState title="Chưa thể tải hành trình" message="Hãy kết nối mạng rồi thử lại. Nội dung chưa được cache trên thiết bị này." onRetry={() => void refresh()} /></>
    return <ErrorState message={state.error === 'unauthorized' ? 'Đăng nhập ở Hồ sơ để lưu và tiếp tục bài học.' : `Không thể tải hành trình (${state.error}).`} onRetry={() => void refresh()} />
  }
  if (state.snapshot.chapters.length === 0) return <EmptyState title="Chưa có chương đã xuất bản" message="Hãy quay lại sau khi nội dung được duyệt." />

  const chapter = view.type === 'home' ? undefined : state.snapshot.chapters.find(item => item.id === view.chapterId)
  const lesson = view.type === 'lesson' ? chapter?.lessons.find(item => item.id === view.lessonId) : undefined

  const openLesson = async (chapterId: string, lessonId: string) => {
    const selected = state.snapshot.chapters.find(item => item.id === chapterId)?.lessons.find(item => item.id === lessonId)
    if (!selected) return
    const result = await startLesson(services, selected)
    if (!result.ok) { setState({ status: 'error', error: result.error }); return }
    await refresh()
    pendingFocusRef.current = { kind: 'heading' }
    setView({ type: 'lesson', chapterId, lessonId })
  }

  if (view.type === 'lesson' && chapter && lesson) {
    return <JourneyLessonEntry key={lesson.id} lesson={lesson} services={services} onConfirmed={() => onAccountChange?.()} headingRef={element => {
      lessonHeadingRef.current = element
      if (element && pendingFocusRef.current?.kind === 'heading') {
        element.focus()
        pendingFocusRef.current = null
      }
    }} onBack={() => {
      pendingFocusRef.current = { kind: 'lesson-button', id: lesson.id }
      setView({ type: 'chapter', chapterId: chapter.id })
      void refresh()
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
