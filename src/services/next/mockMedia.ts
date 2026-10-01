import type { Locale, PublishStatus } from '../../types/v2/content.ts'
import { failure, success, type MediaService, type ResolvedMediaAsset, type ResolvedTextResource } from './contracts.ts'
import type { MockCatalog } from './mock.ts'

export type MockMediaResource = {
  id: string
  kind: 'caption' | 'transcript'
  storageRef: string
  locale: Locale
  label: string
  reviewStatus: PublishStatus
}

/** Non-network URLs stand in for a production adapter's storage/CDN resolution. */
export function createMockMediaService(catalog: MockCatalog): MediaService {
  const url = (ref: string) => `mock://media/${encodeURIComponent(ref)}`
  const textResource = (id: string, kind: MockMediaResource['kind']): ResolvedTextResource | undefined => {
    const resource = catalog.mediaResources?.find(item => item.id === id && item.kind === kind && item.reviewStatus === 'published')
    return resource?.storageRef.trim() && resource.label.trim() && resource.locale === 'vi-VN'
      ? { id: resource.id, url: url(resource.storageRef), locale: resource.locale, label: resource.label } : undefined
  }
  return {
    async getResolvedAsset(mediaAssetId) {
      const asset = catalog.mediaAssets.find(item => item.id === mediaAssetId && item.reviewStatus === 'published')
      if (!asset || !asset.storageRef.trim()) return failure('not_found')
      let poster: ResolvedMediaAsset['poster']
      if (asset.posterMediaId !== undefined) {
        const image = catalog.mediaAssets.find(item => item.id === asset.posterMediaId && item.reviewStatus === 'published' &&
          (item.kind === 'image' || item.kind === 'illustration'))
        if (!image?.storageRef.trim() || !image.altText?.trim()) return failure('not_found')
        poster = { id: image.id, url: url(image.storageRef), altText: image.altText }
      }
      const captionTracks: ResolvedTextResource[] = []
      for (const ref of asset.captionTrackRefs ?? []) {
        const track = textResource(ref, 'caption')
        if (!track) return failure('not_found')
        captionTracks.push(track)
      }
      const transcript = asset.transcriptRef !== undefined ? textResource(asset.transcriptRef, 'transcript') : undefined
      if (asset.transcriptRef !== undefined && !transcript) return failure('not_found')
      // No fabricated fallback: only resolved, published resources can be used.
      const fallback: ResolvedMediaAsset['fallback'] = transcript ? { kind: 'transcript', url: transcript.url }
        : poster ? { kind: 'poster', url: poster.url, altText: poster.altText } : undefined
      return success({
        id: asset.id, kind: asset.kind, title: asset.title, reviewStatus: asset.reviewStatus,
        url: url(asset.storageRef), caption: asset.caption, altText: asset.altText,
        durationSeconds: asset.durationSeconds, aspectRatio: asset.aspectRatio,
        sourceIds: [...asset.sourceIds], attribution: asset.attribution, license: asset.license,
        poster, captionTracks, transcript, fallback,
      })
    },
  }
}
