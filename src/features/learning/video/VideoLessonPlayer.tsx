import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import { ErrorState, LoadingState } from '../../../components/ui'
import type { LearningServices, ServiceErrorCode } from '../../../services/next/contracts'
import { VideoPlayerView } from './VideoPlayerView'
import {
  loadVideoPlayer, observedRange, saveVideoCheckpoint, type VideoPlayerContext, type VideoPlayerSession,
} from './videoPlayerModel'

type LoadState = { status: 'loading' } | { status: 'error'; error: ServiceErrorCode } | { status: 'ready'; session: VideoPlayerSession }
const operationId = () => globalThis.crypto.randomUUID()

export function VideoLessonPlayer({ services, context }: { services: LearningServices; context: VideoPlayerContext }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [mediaFailed, setMediaFailed] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const segmentStartRef = useRef<number | null>(null)
  const lastObservedRef = useRef(0)

  useEffect(() => {
    let active = true
    void loadVideoPlayer(services, context).then(result => {
      if (active) setState(result.ok ? { status: 'ready', session: result.value } : { status: 'error', error: result.error })
    })
    return () => { active = false }
  }, [context.blockId, context.lessonId, context.mediaAssetId, services])

  if (state.status === 'loading') return <LoadingState message="Đang tải video bài học..." />
  if (state.status === 'error') return <ErrorState message={`Không thể tải video (${state.error}).`} />
  const { session } = state
  const persist = (positionSeconds: number) => {
    const ranges = observedRange(segmentStartRef.current, lastObservedRef.current, session.asset.durationSeconds)
    segmentStartRef.current = null
    void saveVideoCheckpoint(services, context, positionSeconds, ranges, operationId()).then(result => {
      if (result.ok) setState(current => current.status === 'ready'
        ? { status: 'ready', session: { ...current.session, progress: result.value, resumePositionSeconds: result.value.positionSeconds } }
        : current)
    })
  }
  const currentTime = (event: SyntheticEvent<HTMLVideoElement>) => event.currentTarget.currentTime

  return <VideoPlayerView
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
      segmentStartRef.current = event.currentTarget.paused ? null : currentTime(event)
    }}
    onEnded={event => { lastObservedRef.current = currentTime(event); persist(currentTime(event)) }}
    onError={() => setMediaFailed(true)}
    onRetry={() => { setMediaFailed(false); setRetryKey(value => value + 1) }}
  />
}
