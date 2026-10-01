import type { LearningServices, ResolvedMediaAsset, Result } from '../../../services/next/contracts'
import type { VideoProgress } from '../../../types/v2/progress'

export type VideoPlayerContext = { lessonId: string; blockId: string; mediaAssetId: string }
export type VideoPlayerSession = { asset: ResolvedMediaAsset; progress: VideoProgress | null; resumePositionSeconds: number }

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
