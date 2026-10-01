import { useEffect, useRef, useState } from 'react'
import { Button, ErrorState, LoadingState } from '../../../components/ui'
import type { LearningServices, Result, ServiceErrorCode } from '../../../services/next/contracts'
import { VisualNovelSceneView, type VisualNovelMediaSlot } from './VisualNovelSceneView'
import {
  advanceVisualNovel, chooseVisualNovel, continueChoiceFeedback, getCurrentScene, loadVisualNovel,
  isVisualNovelRenderCurrent, restartVisualNovel, resumeVisualNovel, reviewVisualNovelScene,
  visualNovelContextKey, VisualNovelActionGate,
  type VisualNovelContext, type VisualNovelSession,
} from './visualNovelModel'

type PlayerState = { status: 'loading' } | { status: 'error'; error: ServiceErrorCode } | {
  status: 'ready'
  session: VisualNovelSession
  contextKey: string
  services: LearningServices
}
const operationId = () => globalThis.crypto.randomUUID()

export function VisualNovelErrorState({ error, onRetry, onClose }: {
  error: ServiceErrorCode | 'invalid_scene'; onRetry: () => void; onClose: () => void
}) {
  return <section aria-label="Visual Novel gặp lỗi" className="space-y-3">
    <Button variant="outline" onClick={onClose}>ĐÓNG</Button>
    <ErrorState message={`Không thể tải Visual Novel (${error}).`} onRetry={onRetry} />
  </section>
}

export function VisualNovelPlayerV2({
  context, services, mediaSlot, onClose, onComplete,
}: {
  context: VisualNovelContext
  services: LearningServices
  mediaSlot?: VisualNovelMediaSlot
  onClose: () => void
  onComplete: () => void
}) {
  const [state, setState] = useState<PlayerState>({ status: 'loading' })
  const [busy, setBusy] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const contextKey = visualNovelContextKey(context)
  const actionGateRef = useRef(new VisualNovelActionGate(contextKey))
  actionGateRef.current.activate(contextKey)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const playerFocusedRef = useRef(false)
  const previousSceneIdRef = useRef<string | undefined>(undefined)
  useEffect(() => {
    let active = true
    actionGateRef.current.invalidate()
    playerFocusedRef.current = false
    previousSceneIdRef.current = undefined
    setBusy(false)
    setState({ status: 'loading' })
    void loadVisualNovel(services, context).then(result => {
      if (active) setState(result.ok
        ? { status: 'ready', session: result.value, contextKey, services }
        : { status: 'error', error: result.error })
    })
    return () => { active = false }
  }, [context.blockId, context.lessonId, context.storyVersionId, contextKey, retryKey, services])
  const readyState = state.status === 'ready'
    && isVisualNovelRenderCurrent(state.contextKey, state.services, contextKey, services)
    ? state
    : undefined
  const activeScene = readyState ? getCurrentScene(readyState.session) : undefined
  const activeSceneId = activeScene?.id
  const feedbackKey = state.status === 'ready' && state.session.feedback
    ? `${activeSceneId}:${state.session.feedback.choiceId}:${state.session.feedback.outcome}`
    : undefined
  useEffect(() => {
    if (state.status !== 'ready' || playerFocusedRef.current) return
    playerFocusedRef.current = true
    headingRef.current?.focus()
  }, [state.status])
  useEffect(() => {
    if (!activeSceneId) return
    if (previousSceneIdRef.current && previousSceneIdRef.current !== activeSceneId) sceneRef.current?.focus()
    previousSceneIdRef.current = activeSceneId
  }, [activeSceneId])
  useEffect(() => { if (feedbackKey) feedbackRef.current?.focus() }, [feedbackKey])

  if (state.status === 'loading') return <LoadingState message="Đang tải Visual Novel..." />
  if (state.status === 'error') return <VisualNovelErrorState error={state.error} onClose={onClose} onRetry={() => setRetryKey(value => value + 1)} />
  if (!readyState) return <LoadingState message="Đang tải Visual Novel..." />
  const { session } = readyState
  const scene = activeScene
  if (!scene) return <VisualNovelErrorState error="invalid_scene" onClose={onClose} onRetry={() => setRetryKey(value => value + 1)} />
  const update = async (action: () => Promise<Result<VisualNovelSession>>) => {
    const token = actionGateRef.current.begin(contextKey)
    setBusy(true)
    const result = await action()
    if (!actionGateRef.current.isCurrent(token)) return
    setBusy(false)
    setState(result.ok
      ? { status: 'ready', session: result.value, contextKey, services }
      : { status: 'error', error: result.error })
  }
  const visited = session.story.scenes.filter(item => session.visitedSceneIds.includes(item.id))

  return <section aria-labelledby="vn-player-heading" className="space-y-4" data-testid="visual-novel-v2">
    <header className="flex flex-wrap items-center gap-2">
      <h1 ref={headingRef} tabIndex={-1} id="vn-player-heading" className="mr-auto font-bold">Visual Novel</h1>
      <Button variant="secondary" onClick={() => setState({ status: 'ready', session: restartVisualNovel(session), contextKey, services })}>XEM LẠI TỪ ĐẦU</Button>
      {session.replay && <Button onClick={() => setState({ status: 'ready', session: resumeVisualNovel(session), contextKey, services })}>TIẾP TỤC TIẾN ĐỘ</Button>}
      <Button variant="outline" onClick={onClose}>ĐÓNG</Button>
    </header>
    {session.replay && <p role="status">Đang xem lại. Tiến độ đã lưu sẽ không bị thay đổi.</p>}
    {visited.length > 0 && <nav aria-label="Các scene đã xem" className="flex flex-wrap gap-2">{visited.map(item =>
      <Button key={item.id} variant="outline" onClick={() => {
        const result = reviewVisualNovelScene(session, item.id)
        if (result.ok) setState({ status: 'ready', session: result.value, contextKey, services })
      }}>{item.title ?? `Scene ${item.id}`}</Button>)}</nav>}
    <VisualNovelSceneView
      scene={scene} feedback={session.feedback} busy={busy} mediaSlot={mediaSlot}
      sceneRef={sceneRef} feedbackRef={feedbackRef}
      onChoice={choiceId => void update(() => chooseVisualNovel(services, context, session, choiceId, operationId()))}
      onContinue={() => {
        if (session.feedback) {
          const result = continueChoiceFeedback(session)
          setState(result.ok
            ? { status: 'ready', session: result.value, contextKey, services }
            : { status: 'error', error: result.error })
        } else void update(() => advanceVisualNovel(services, context, session, operationId()))
      }}
      onComplete={onComplete}
    />
  </section>
}
