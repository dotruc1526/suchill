import type { Locale, PublishStatus } from '../../types/v2/content.ts'
import { failure, success, type MediaService, type ResolvedMediaAsset, type ResolvedTextResource } from './backendContracts.ts'
import type { MockCatalog } from './backendMock.ts'

export type MockMediaResource = {
  id: string
  kind: 'caption' | 'transcript'
  storageRef: string
  locale: Locale
  label: string
  reviewStatus: PublishStatus
}

/** Explicit local technical assets support interactive QA; other fixtures use non-network URLs. */
export function createMockMediaService(catalog: MockCatalog): MediaService {
  const url = (ref: string): string | undefined => {
    if (!catalog.mediaResourceUrls || !Object.prototype.hasOwnProperty.call(catalog.mediaResourceUrls, ref)) return `mock://media/${encodeURIComponent(ref)}`
    const declared = catalog.mediaResourceUrls[ref]
    return /^\/technical-fixtures\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+$/.test(declared)
      ? declared : undefined
  }
  const textResource = (id: string, kind: MockMediaResource['kind']): ResolvedTextResource | undefined => {
    const resource = catalog.mediaResources?.find(item => item.id === id && item.kind === kind && item.reviewStatus === 'published')
    const resolvedUrl = resource?.storageRef.trim() ? url(resource.storageRef) : undefined
    return resource && resolvedUrl && resource.label.trim() && resource.locale === 'vi-VN'
      ? { id: resource.id, url: resolvedUrl, locale: resource.locale, label: resource.label } : undefined
  }
  return {
    async getResolvedAsset(mediaAssetId) {
      const asset = catalog.mediaAssets.find(item => item.id === mediaAssetId && item.reviewStatus === 'published')
      if (!asset || !asset.storageRef.trim()) return failure('not_found')
      const resolvedUrl = url(asset.storageRef)
      if (!resolvedUrl) return failure('not_found')
      let poster: ResolvedMediaAsset['poster']
      if (asset.posterMediaId !== undefined) {
        const image = catalog.mediaAssets.find(item => item.id === asset.posterMediaId && item.reviewStatus === 'published' &&
          (item.kind === 'image' || item.kind === 'illustration'))
        if (!image?.storageRef.trim() || !image.altText?.trim()) return failure('not_found')
        const imageUrl = url(image.storageRef)
        if (!imageUrl) return failure('not_found')
        poster = { id: image.id, url: imageUrl, altText: image.altText }
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
        url: resolvedUrl, caption: asset.caption, altText: asset.altText,
        durationSeconds: asset.durationSeconds, aspectRatio: asset.aspectRatio,
        sourceIds: [...asset.sourceIds], attribution: asset.attribution, license: asset.license,
        poster, captionTracks, transcript, fallback,
      })
    },
  }
}
