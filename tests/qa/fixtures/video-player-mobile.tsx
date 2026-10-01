import React from 'react'
import { createRoot } from 'react-dom/client'
import '../../../src/index.css'
import { VideoLessonPlayer } from '../../../src/features/learning/video/VideoLessonPlayer'
import { VisualNovelPlayerV2 } from '../../../src/features/visual-novel/v2/VisualNovelPlayerV2'
import { createMockLearningServices } from '../../../src/services/next/mock'
import { playbackCatalog } from '../../member5/playback-fixtures'

const baseServices = createMockLearningServices(
  playbackCatalog(), { userId: 'qa-video-fixture' }, () => '2026-10-01T00:00:00Z',
)
let failFirstStoryRead = true
const services = {
  ...baseServices,
  stories: {
    getVersion: async (storyVersionId: string) => {
      if (failFirstStoryRead) {
        failFirstStoryRead = false
        return { ok: false as const, error: 'offline' as const }
      }
      return baseServices.stories.getVersion(storyVersionId)
    },
  },
}

createRoot(document.getElementById('root')!).render(<main className="mx-auto max-w-md space-y-6 p-4">
  <section data-testid="qa-video-valid">
    <VideoLessonPlayer services={services} context={{ lessonId: 'lesson', blockId: 'video-block', mediaAssetId: 'video' }} />
  </section>
  <section data-testid="qa-video-missing">
    <VideoLessonPlayer services={services} context={{ lessonId: 'lesson', blockId: 'video-block', mediaAssetId: 'missing' }} />
  </section>
  <section data-testid="qa-vn-retry">
    <VisualNovelPlayerV2 services={services} context={{ lessonId: 'lesson', blockId: 'vn-block', storyVersionId: 'version-1' }} onClose={() => {}} onComplete={() => {}} />
  </section>
</main>)
