import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react'
import { Button, ErrorState, LoadingState } from '../../../components/ui'
import type { LearningServices, ServiceErrorCode } from '../../../services/next/contracts'
import { VideoPlayerView } from './VideoPlayerView'
import {
  loadVideoPlayer, observedRange, saveVideoCheckpoint, videoContextKey, VideoCheckpointQueue,
  VideoCheckpointQueueRegistry, type VideoPlayerContext, type VideoPlayerSession,
} from './videoPlayerModel'

type LoadState = { status: 'loading' } | { status: 'error'; error: ServiceErrorCode } | { status: 'ready'; session: VideoPlayerSession }
const operationId = () => globalThis.crypto.randomUUID()

export function VideoProgressSaveError({ error, onRetry }: { error: ServiceErrorCode; onRetry: () => void }) {
  return <div role="alert" className="space-y-2">
    <p>Chưa lưu được tiến độ video ({error}). Dữ liệu chưa lưu vẫn được giữ lại.</p>
    <Button variant="outline" onClick={onRetry}>THỬ LƯU LẠI</Button>
  </div>
}

export function VideoLessonPlayer({ services, context }: { services: LearningServices; context: VideoPlayerContext }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [mediaFailed, setMediaFailed] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const [loadRetryKey, setLoadRetryKey] = useState(0)
  const [saveError, setSaveError] = useState<ServiceErrorCode>()
  const videoRef = useRef<HTMLVideoElement>(null)
  const segmentStartRef = useRef<number | null>(null)
  const lastObservedRef = useRef(0)
  const contextKey = videoContextKey(context)
  const registryRef = useRef(new VideoCheckpointQueueRegistry())
  const activeQueueRef = useRef<VideoCheckpointQueue | null>(null)
  const queueErrorsRef = useRef(new WeakMap<VideoCheckpointQueue, ServiceErrorCode>())

  const checkpointQueue = useMemo(() => {
    return registryRef.current.getOrCreate(services, contextKey, () => {
      let queue: VideoCheckpointQueue
      queue = new VideoCheckpointQueue(
        payload => saveVideoCheckpoint(services, context, payload.positionSeconds, payload.watchedRanges, payload.operationId),
        progress => {
          queueErrorsRef.current.delete(queue)
          if (activeQueueRef.current !== queue) return
          setSaveError(undefined)
          setState(current => current.status === 'ready' && current.session.asset.id === context.mediaAssetId
            ? { status: 'ready', session: { ...current.session, progress, resumePositionSeconds: progress.positionSeconds } }
            : current)
        },
        error => {
          queueErrorsRef.current.set(queue, error)
          if (activeQueueRef.current !== queue) return
          setSaveError(error)
          videoRef.current?.pause()
        },
      )
      return queue
    })
  }, [context, contextKey, services])
  activeQueueRef.current = checkpointQueue

  useEffect(() => {
    let active = true
    setState({ status: 'loading' })
    setMediaFailed(false)
    setRetryKey(0)
    setSaveError(queueErrorsRef.current.get(checkpointQueue))
    segmentStartRef.current = null
    lastObservedRef.current = 0
    void loadVideoPlayer(services, context).then(result => {
      if (active) setState(result.ok ? { status: 'ready', session: result.value } : { status: 'error', error: result.error })
    })
    return () => { active = false }
  }, [checkpointQueue, context.blockId, context.lessonId, context.mediaAssetId, contextKey, loadRetryKey, services])

  if (state.status === 'loading') return <LoadingState message="Đang tải video bài học..." />
  if (state.status === 'error') return <ErrorState message={`Không thể tải video (${state.error}).`} onRetry={() => setLoadRetryKey(value => value + 1)} />
  const { session } = state
  const persist = (positionSeconds: number) => {
    const ranges = observedRange(segmentStartRef.current, lastObservedRef.current, session.asset.durationSeconds)
    segmentStartRef.current = null
    checkpointQueue.enqueue({ positionSeconds, watchedRanges: ranges, operationId: operationId() })
  }
  const currentTime = (event: SyntheticEvent<HTMLVideoElement>) => event.currentTarget.currentTime

  return <div className="space-y-3">
    {saveError && <VideoProgressSaveError error={saveError} onRetry={() => checkpointQueue.retry()} />}
    <VideoPlayerView
    asset={session.asset} videoRef={videoRef} mediaFailed={mediaFailed} retryKey={retryKey}
    onLoadedMetadata={event => {
      event.currentTarget.currentTime = session.resumePositionSeconds
      lastObservedRef.current = session.resumePositionSeconds
    }}
    onPlay={event => { segmentStartRef.current = currentTime(event); lastObservedRef.current = currentTime(event) }}
    onPause={event => persist(currentTime(event))}
    onTimeUpdate={event => { lastObservedRef.current = currentTime(event) }}
    onSeeking={() => persist(lastObservedRef.current)}
    onSeeked={event => {
      lastObservedRef.current = currentTime(event)
      if (event.currentTarget.paused) persist(currentTime(event))
      else segmentStartRef.current = currentTime(event)
    }}
    onEnded={event => { lastObservedRef.current = currentTime(event); persist(currentTime(event)) }}
    onError={() => setMediaFailed(true)}
    onRetry={() => { setMediaFailed(false); setRetryKey(value => value + 1) }}
    />
  </div>
}
