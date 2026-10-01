import { useEffect, useRef, useState } from 'react'
import { Button, ErrorState, LoadingState } from '../../../components/ui'
import type { LearningServices, Result, ServiceErrorCode } from '../../../services/next/contracts'
import { VisualNovelSceneView, type VisualNovelMediaSlot } from './VisualNovelSceneView'
import {
  advanceVisualNovel, chooseVisualNovel, continueChoiceFeedback, getCurrentScene, loadVisualNovel,
  restartVisualNovel, resumeVisualNovel, reviewVisualNovelScene, type VisualNovelContext, type VisualNovelSession,
} from './visualNovelModel'

type PlayerState = { status: 'loading' } | { status: 'error'; error: ServiceErrorCode } | { status: 'ready'; session: VisualNovelSession }
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
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    let active = true
    setState({ status: 'loading' })
    void loadVisualNovel(services, context).then(result => {
      if (active) setState(result.ok ? { status: 'ready', session: result.value } : { status: 'error', error: result.error })
    })
    return () => { active = false }
  }, [context.blockId, context.lessonId, context.storyVersionId, retryKey, services])
  useEffect(() => { if (state.status === 'ready') headingRef.current?.focus() }, [state])

  if (state.status === 'loading') return <LoadingState message="Đang tải Visual Novel..." />
  if (state.status === 'error') return <VisualNovelErrorState error={state.error} onClose={onClose} onRetry={() => setRetryKey(value => value + 1)} />
  const { session } = state
  const scene = getCurrentScene(session)
  if (!scene) return <VisualNovelErrorState error="invalid_scene" onClose={onClose} onRetry={() => setRetryKey(value => value + 1)} />
  const update = async (action: () => Promise<Result<VisualNovelSession>>) => {
    setBusy(true)
    const result = await action()
    setBusy(false)
    setState(result.ok ? { status: 'ready', session: result.value } : { status: 'error', error: result.error })
  }
  const visited = session.story.scenes.filter(item => session.visitedSceneIds.includes(item.id))

  return <section aria-labelledby="vn-player-heading" className="space-y-4" data-testid="visual-novel-v2">
    <header className="flex flex-wrap items-center gap-2">
      <h1 ref={headingRef} tabIndex={-1} id="vn-player-heading" className="mr-auto font-bold">Visual Novel</h1>
      <Button variant="secondary" onClick={() => setState({ status: 'ready', session: restartVisualNovel(session) })}>XEM LẠI TỪ ĐẦU</Button>
      {session.replay && <Button onClick={() => setState({ status: 'ready', session: resumeVisualNovel(session) })}>TIẾP TỤC TIẾN ĐỘ</Button>}
      <Button variant="outline" onClick={onClose}>ĐÓNG</Button>
    </header>
    {session.replay && <p role="status">Đang xem lại. Tiến độ đã lưu sẽ không bị thay đổi.</p>}
    {visited.length > 0 && <nav aria-label="Các scene đã xem" className="flex flex-wrap gap-2">{visited.map(item =>
      <Button key={item.id} variant="outline" onClick={() => {
        const result = reviewVisualNovelScene(session, item.id)
        if (result.ok) setState({ status: 'ready', session: result.value })
      }}>{item.title ?? `Scene ${item.id}`}</Button>)}</nav>}
    <VisualNovelSceneView
      scene={scene} feedback={session.feedback} busy={busy} mediaSlot={mediaSlot}
      onChoice={choiceId => void update(() => chooseVisualNovel(services, context, session, choiceId, operationId()))}
      onContinue={() => {
        if (session.feedback) {
          const result = continueChoiceFeedback(session)
          setState(result.ok ? { status: 'ready', session: result.value } : { status: 'error', error: result.error })
        } else void update(() => advanceVisualNovel(services, context, session, operationId()))
      }}
      onComplete={onComplete}
    />
  </section>
}
