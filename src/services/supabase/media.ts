import type { MediaAsset } from '../../types/v2/content.ts'
import type { MediaService, ResolvedMediaAsset, ResolvedTextResource } from '../next/backendContracts.ts'
import { failure, success } from '../next/backendContracts.ts'
import type { LearningRpc } from './rpc.ts'

type StoredText = { id: string; storageRef: string; locale: 'vi-VN'; label: string }
export type StoredMedia = MediaAsset & {
  poster?: { id: string; storageRef: string; altText: string }
  captionTracks?: StoredText[]
  transcript?: StoredText
}

/** Only paths returned for published, reviewed resources may become browser URLs. */
export function publishedStoragePath(storageRef: string): { bucket: string; path: string } {
  const [bucket, ...segments] = storageRef.split('/')
  if (bucket !== 'published-media' || segments.length === 0 || segments.some(part => !part || part === '.' || part === '..' || part.includes('\\'))) {
    throw new Error('Invalid published media path')
  }
  return { bucket, path: segments.join('/') }
}

export function createSupabaseMedia(rpc: LearningRpc, resolveUrl: (storageRef: string) => Promise<string>): MediaService {
  return {
    async getResolvedAsset(id) {
      const result = await rpc.read<StoredMedia>('media', id)
      if (!result.ok) return result
      try {
        const { storageRef, posterMediaId: _posterId, captionTrackRefs: _captionIds, transcriptRef: _transcriptId, ...asset } = result.value
        const resolveText = async (text: StoredText): Promise<ResolvedTextResource> => ({
          id: text.id, url: await resolveUrl(text.storageRef), locale: text.locale, label: text.label,
        })
        const poster = asset.poster ? { id: asset.poster.id, altText: asset.poster.altText, url: await resolveUrl(asset.poster.storageRef) } : undefined
        const transcript = asset.transcript ? await resolveText(asset.transcript) : undefined
        const resolved: ResolvedMediaAsset = {
          ...asset, url: await resolveUrl(storageRef), poster, transcript,
          captionTracks: await Promise.all((asset.captionTracks ?? []).map(resolveText)),
          fallback: transcript ? { kind: 'transcript', url: transcript.url } : poster ? { kind: 'poster', url: poster.url, altText: poster.altText } : undefined,
        }
        return success(resolved)
      } catch { return failure('validation') }
    },
  }
}
