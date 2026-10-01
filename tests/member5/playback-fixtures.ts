import type { MockCatalog } from '../../src/services/next/mock.ts'

export const playbackCatalog = (): MockCatalog => ({
  chapters: [],
  lessons: [{
    id: 'lesson', chapterId: 'chapter', slug: 'fixture', title: 'Fixture', summary: '', format: 'mixed',
    estimatedMinutes: 1, learningObjectiveIds: ['objective'], prerequisites: [], status: 'published',
    blocks: [
      { id: 'video-block', order: 1, required: true, kind: 'video', mediaAssetId: 'video', completionPolicy: 'watch_threshold' },
      { id: 'vn-block', order: 0, required: true, kind: 'visual_novel', storyVersionId: 'version-1' },
    ],
  }],
  storyVersions: [{
    id: 'version-1', storyId: 'story', versionNumber: 1, status: 'published', startSceneId: 'start',
    learningObjectiveIds: ['objective'], sourceIds: [], createdAt: '2026-09-29T00:00:00Z', publishedAt: '2026-09-29T00:00:00Z',
    scenes: [
      { id: 'start', kind: 'narration', text: 'Fixture only', nextSceneId: 'choice', sourceIds: [], claimIds: [] },
      { id: 'choice', kind: 'choice', prompt: 'Choose', policy: 'continue_after_feedback', sourceIds: [], claimIds: [], choices: [
        { id: 'choice-a', kind: 'narrative', label: 'A', nextSceneId: 'end' },
        { id: 'choice-b', kind: 'reflection', label: 'B', nextSceneId: 'end' },
      ] },
      { id: 'end', kind: 'end', summary: 'End', sourceIds: [], claimIds: [] },
    ],
  }],
  mediaAssets: [
    { id: 'video', kind: 'video', title: 'Video fixture', storageRef: 'videos/sample.mp4',
      posterMediaId: 'poster', captionTrackRefs: ['captions'], transcriptRef: 'transcript',
      durationSeconds: 100, sourceIds: [], reviewStatus: 'published' },
    { id: 'poster', kind: 'image', title: 'Poster fixture', storageRef: 'images/poster.webp',
      altText: 'Ảnh minh họa fixture', sourceIds: [], reviewStatus: 'published' },
  ],
  mediaResources: [
    { id: 'captions', kind: 'caption', storageRef: 'captions/vi.vtt', locale: 'vi-VN', label: 'Tiếng Việt', reviewStatus: 'published' },
    { id: 'transcript', kind: 'transcript', storageRef: 'documents/transcript.html', locale: 'vi-VN', label: 'Bản chép lời', reviewStatus: 'published' },
  ],
})
