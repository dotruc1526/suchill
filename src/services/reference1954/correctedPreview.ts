import manifest from '../../../docs/content/candidate1954-v2/manifest.json'
import videoUrl from '../../../docs/content/candidate1954-v2/pilot-mobile.mp4?url'
import posterUrl from '../../../docs/content/candidate1954-v2/poster.png?url'
import captionUrl from '../../../docs/content/candidate1954-v2/captions.vi.vtt?url'
import transcriptUrl from '../../../docs/content/candidate1954-v2/transcript.vi.txt?url'
import transcriptText from '../../../docs/content/candidate1954-v2/transcript.vi.txt?raw'
import { createReferencePreviewServices } from './localPreview'
import { createReferenceVideoLoader } from './videoSource'

export { transcriptText as correctedTranscript }
let services: ReturnType<typeof createReferencePreviewServices> | undefined
export function getCorrectedLearningServices() {
  if (services) return services
  const metadata = { durationSeconds: manifest.video.durationSeconds,
    videoSha256: manifest.files['pilot-mobile.mp4'], sourceIds: manifest.sourceIds }
  const loader = createReferenceVideoLoader(metadata.videoSha256, undefined, { url: videoUrl, byteLength: 15724204 })
  const base = createReferencePreviewServices(metadata, window.localStorage, loader.getUrl)
  services = { ...base, media: { async getResolvedAsset(id) {
    const result = await base.media.getResolvedAsset(id)
    if (!result.ok) return result
    return { ok: true as const, value: { ...result.value, title: 'Trước cơn bão · bản sửa v2',
      attribution: 'Bản sửa lời dẫn để nghiệm thu; media sử dụng theo quyết định PO.',
      poster: { id: 'candidate1954.v2.poster', url: posterUrl, altText: 'Khung hình video Trước cơn bão.' },
      captionTracks: [{ id: 'candidate1954.v2.captions', url: captionUrl, locale: 'vi-VN' as const, label: 'Phụ đề tiếng Việt' }],
      transcript: { id: 'candidate1954.v2.transcript', url: transcriptUrl, locale: 'vi-VN' as const, label: 'Bản chép lời' },
      fallback: { kind: 'transcript' as const, url: transcriptUrl } } }
  } } }
  window.addEventListener('pagehide', event => { if (!event.persisted) loader.dispose() })
  return services
}
