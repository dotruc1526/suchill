import { failure, success, type LearningServices, type ResolvedMediaAsset, type SaveVideoPosition } from '../next/contracts.ts'
import type { VideoProgress } from '../../types/v2/progress.ts'

export type PreviewMetadata = { durationSeconds: number; videoSha256: string; sourceIds: string[] }
export const previewContext = { lessonId: 'preview.reference1954.lesson', blockId: 'preview.reference1954.video', mediaAssetId: 'preview.reference1954.asset' }
export const previewStorageKey = (hash: string) => `suchill.reference1954.preview.v1.${hash}`
const localUser = 'local-reference-preview'
const unavailable = async () => failure('not_found')

function rangesValid(ranges: unknown, duration: number): ranges is VideoProgress['watchedRanges'] {
  return Array.isArray(ranges) && ranges.length <= 1000 && ranges.every(range =>
    typeof range === 'object' && range !== null && Number.isFinite(range.start) && Number.isFinite(range.end) &&
    range.start >= 0 && range.end > range.start && range.end <= duration)
}
function mergeRanges(ranges: VideoProgress['watchedRanges']) {
  const merged: VideoProgress['watchedRanges'] = []
  for (const range of ranges.map(item => ({ ...item })).sort((a, b) => a.start - b.start)) {
    const last = merged.at(-1)
    if (last && range.start <= last.end) last.end = Math.max(last.end, range.end)
    else merged.push(range)
  }
  return merged
}

/** Own local preview state only; there is no backend, account or reward authority. */
export function createReferencePreviewServices(metadata: PreviewMetadata, storage: Pick<Storage, 'getItem' | 'setItem'>, resolveVideoUrl?: () => Promise<string>): LearningServices {
  if (!Number.isFinite(metadata.durationSeconds) || metadata.durationSeconds <= 0 ||
      !/^[a-f0-9]{64}$/.test(metadata.videoSha256)) throw new Error('Invalid preview media identity')
  const key = previewStorageKey(metadata.videoSha256)
  const duration = metadata.durationSeconds
  const asset: ResolvedMediaAsset = {
    id: previewContext.mediaAssetId, kind: 'video', title: 'Trước cơn bão',
    caption: 'Tập 1 · Bối cảnh Đông Xuân 1953–1954', reviewStatus: 'draft',
    durationSeconds: duration, aspectRatio: '9:16', sourceIds: [...metadata.sourceIds],
    attribution: 'Bản tham khảo nội bộ do Trúc bàn giao; quyền phát hành chưa được nghiệm thu.',
    license: 'INTERNAL_REFERENCE_ONLY', url: '/reference-media/pilot-mobile.mp4',
    poster: { id: 'preview.reference1954.poster', url: '/reference-media/poster.png', altText: 'Khung hình video Trước cơn bão.' },
    captionTracks: [{ id: 'preview.reference1954.captions', url: '/reference-media/captions.vi.vtt', locale: 'vi-VN', label: 'Phụ đề tiếng Việt' }],
    transcript: { id: 'preview.reference1954.transcript', url: '/reference-media/transcript.vi.txt', locale: 'vi-VN', label: 'Bản chép lời' },
    fallback: { kind: 'transcript', url: '/reference-media/transcript.vi.txt' },
  }
  const read = (): VideoProgress | null => {
    const encoded = storage.getItem(key)
    if (encoded === null) return null
    try {
      const data: unknown = JSON.parse(encoded)
      if (!data || typeof data !== 'object') return null
      const row = data as VideoProgress
      if (row.userId !== localUser || row.lessonId !== previewContext.lessonId || row.blockId !== previewContext.blockId ||
          !Number.isFinite(row.positionSeconds) || row.positionSeconds < 0 || row.positionSeconds > duration ||
          !rangesValid(row.watchedRanges, duration) || typeof row.updatedAt !== 'string') return null
      return { userId: localUser, lessonId: previewContext.lessonId, blockId: previewContext.blockId,
        positionSeconds: row.positionSeconds, watchedRanges: mergeRanges(row.watchedRanges), completed: false, updatedAt: row.updatedAt }
    } catch { return null }
  }
  const operations = new Map<string, { signature: string; progress: VideoProgress }>()
  const videoProgress = {
    async getVideoProgress(lessonId: string, blockId: string) {
      if (lessonId !== previewContext.lessonId || blockId !== previewContext.blockId) return failure('not_found')
      try { return success(read()) } catch { return failure('server_error') }
    },
    async saveVideoPosition(input: SaveVideoPosition) {
      if (input.lessonId !== previewContext.lessonId || input.blockId !== previewContext.blockId) return failure('not_found')
      if (!Number.isFinite(input.positionSeconds) || input.positionSeconds < 0 || input.positionSeconds > duration ||
          !rangesValid(input.watchedRanges, duration) || typeof input.operationId !== 'string' || !input.operationId ||
          input.operationId.length > 200) return failure('validation')
      const signature = JSON.stringify([input.positionSeconds, input.watchedRanges])
      const priorOperation = operations.get(input.operationId)
      if (priorOperation) return priorOperation.signature === signature
        ? success(structuredClone(priorOperation.progress)) : failure('conflict')
      try {
        const prior = read()
        const progress: VideoProgress = { userId: localUser, lessonId: input.lessonId, blockId: input.blockId,
          positionSeconds: input.positionSeconds, watchedRanges: mergeRanges([...(prior?.watchedRanges ?? []), ...input.watchedRanges]),
          completed: false, updatedAt: new Date().toISOString() }
        storage.setItem(key, JSON.stringify(progress))
        operations.set(input.operationId, { signature, progress: structuredClone(progress) })
        if (operations.size > 500) operations.delete(operations.keys().next().value!)
        return success(structuredClone(progress))
      } catch { return failure('server_error') }
    },
  }
  return {
    media: { async getResolvedAsset(id) {
      if (id !== asset.id) return failure('not_found')
      try { return success({ ...structuredClone(asset), url: resolveVideoUrl ? await resolveVideoUrl() : asset.url }) }
      catch { return failure('server_error') }
    } },
    progress: { ...videoProgress, getLessonProgress: unavailable, saveCheckpoint: unavailable, getEpisodeProgress: unavailable,
      saveEpisodeCheckpoint: unavailable, recordChoice: unavailable, getResumePoint: unavailable },
    chapters: { listPublished: unavailable, getById: unavailable }, lessons: { getById: unavailable }, documents: { getById: unavailable },
    stories: { getVersion: unavailable }, quiz: { getQuestionSet: unavailable, submitPracticeAttempt: unavailable, submitScoredAttempt: unavailable },
    completion: { completeLesson: unavailable, getLessonCompletion: unavailable, recordBlockAction: unavailable },
    users: { getCurrentProfile: unavailable, getAccountSummary: unavailable },
  }
}
