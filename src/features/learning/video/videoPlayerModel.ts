import type { LearningServices, ResolvedMediaAsset, Result, ServiceErrorCode } from '../../../services/next/contracts'
import type { VideoProgress } from '../../../types/v2/progress'

export type VideoPlayerContext = { lessonId: string; blockId: string; mediaAssetId: string }
export type VideoPlayerSession = { asset: ResolvedMediaAsset; progress: VideoProgress | null; resumePositionSeconds: number }

export const videoContextKey = (context: VideoPlayerContext) =>
  `${context.lessonId}:${context.blockId}:${context.mediaAssetId}`

export const isActiveVideoContext = (activeContextKey: string, callbackContextKey: string) =>
  activeContextKey === callbackContextKey

export async function loadVideoPlayer(
  services: LearningServices,
  context: VideoPlayerContext,
): Promise<Result<VideoPlayerSession>> {
  const assetResult = await services.media.getResolvedAsset(context.mediaAssetId)
  if (!assetResult.ok) return assetResult
  if (assetResult.value.kind !== 'video') return { ok: false, error: 'validation' }
  const progressResult = await services.progress.getVideoProgress(context.lessonId, context.blockId)
  if (!progressResult.ok) return progressResult
  const duration = assetResult.value.durationSeconds
  const savedPosition = progressResult.value?.positionSeconds ?? 0
  const resumePositionSeconds = duration && savedPosition <= duration ? savedPosition : 0
  return { ok: true, value: { asset: assetResult.value, progress: progressResult.value, resumePositionSeconds } }
}

export function observedRange(start: number | null, end: number, duration?: number) {
  if (start === null || !Number.isFinite(start) || !Number.isFinite(end) || end <= start) return []
  const boundedStart = Math.max(0, start)
  const boundedEnd = duration ? Math.min(duration, end) : end
  return boundedEnd > boundedStart ? [{ start: boundedStart, end: boundedEnd }] : []
}

export async function saveVideoCheckpoint(
  services: LearningServices,
  context: VideoPlayerContext,
  positionSeconds: number,
  watchedRanges: Array<{ start: number; end: number }>,
  operationId: string,
): Promise<Result<VideoProgress>> {
  return services.progress.saveVideoPosition({
    lessonId: context.lessonId, blockId: context.blockId, positionSeconds, watchedRanges, operationId,
  })
}

export type VideoCheckpointPayload = {
  positionSeconds: number
  watchedRanges: Array<{ start: number; end: number }>
  operationId: string
}

export class VideoCheckpointQueue {
  private items: VideoCheckpointPayload[] = []
  private flushing = false
  private failed = false
  private initializationOperation?: string
  private initializationConfirmed = false
  private readonly write: (payload: VideoCheckpointPayload) => Promise<Result<VideoProgress>>
  private readonly onSaved: (progress: VideoProgress) => void
  private readonly onError: (error: ServiceErrorCode) => void

  constructor(
    write: (payload: VideoCheckpointPayload) => Promise<Result<VideoProgress>>,
    onSaved: (progress: VideoProgress) => void,
    onError: (error: ServiceErrorCode) => void,
  ) {
    this.write = write
    this.onSaved = onSaved
    this.onError = onError
  }

  get playbackInitialized() { return this.initializationConfirmed }

  /** Called by an actual play event, before collecting any elapsed playback. */
  initializePlayback(positionSeconds: number, operationId: string) {
    if (this.initializationOperation !== undefined) return
    this.initializationOperation = operationId
    this.enqueue({ positionSeconds, watchedRanges: [], operationId })
  }

  enqueue(payload: VideoCheckpointPayload) {
    this.items.push({ ...payload, watchedRanges: payload.watchedRanges.map(range => ({ ...range })) })
    if (!this.failed) void this.flush()
  }

  retry() {
    this.failed = false
    void this.flush()
  }

  pending() {
    return this.items.map(item => ({ ...item, watchedRanges: item.watchedRanges.map(range => ({ ...range })) }))
  }

  private async flush(): Promise<void> {
    if (this.flushing || this.failed || this.items.length === 0) return
    this.flushing = true
    let result: Result<VideoProgress>
    try { result = await this.write(this.items[0]) }
    catch { result = { ok: false, error: 'server_error' } }
    this.flushing = false
    if (!result.ok) {
      this.failed = true
      this.onError(result.error)
      return
    }
    const saved = this.items.shift()
    if (saved?.operationId === this.initializationOperation) this.initializationConfirmed = true
    this.onSaved(result.value)
    await this.flush()
  }
}

export class VideoCheckpointQueueRegistry {
  private readonly queues = new WeakMap<object, Map<string, VideoCheckpointQueue>>()

  getOrCreate(services: object, contextKey: string, create: () => VideoCheckpointQueue) {
    let serviceQueues = this.queues.get(services)
    if (!serviceQueues) {
      serviceQueues = new Map()
      this.queues.set(services, serviceQueues)
    }
    const existing = serviceQueues.get(contextKey)
    if (existing) return existing
    const queue = create()
    serviceQueues.set(contextKey, queue)
    return queue
  }
}
