import { createReferencePreviewServices, type PreviewMetadata } from './localPreview'
import { createReferenceVideoLoader } from './videoSource'

let services: ReturnType<typeof createReferencePreviewServices> | undefined
/** Reuse the reference player identity/storage; initialize only after opening episode1. */
export function getReferenceLearningServices() {
  if (services) return services
  const metadata: PreviewMetadata = JSON.parse(import.meta.env.VITE_REFERENCE_1954_METADATA || 'null')
  if (!metadata || !Array.isArray(metadata.sourceIds)) throw new Error('Missing verified preview package')
  const loader = createReferenceVideoLoader(metadata.videoSha256)
  services = createReferencePreviewServices(metadata, window.localStorage, loader.getUrl)
  window.addEventListener('pagehide', event => { if (!event.persisted) loader.dispose() })
  return services
}
