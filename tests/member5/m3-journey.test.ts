import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import type { Chapter, Lesson } from '../../src/types/v2/content.ts'
import { loadJourney, startLesson } from '../../src/features/learning/journey/journeyModel.ts'

const lesson: Lesson = {
  id: 'lesson-stable', chapterId: 'chapter-stable', slug: 'stable', title: 'Bài học', summary: 'Fixture',
  format: 'standard', estimatedMinutes: 5, learningObjectiveIds: [], prerequisites: [], status: 'published',
  blocks: [{ id: 'block-stable', order: 0, required: true, kind: 'text', documentId: 'document-stable' }],
}
const chapter: Chapter = {
  id: 'chapter-stable', slug: 'chapter', title: 'Chương', summary: 'Fixture', historicalPeriodLabel: '1972',
  learningObjectiveIds: [], lessonRefs: [{ id: lesson.id, order: 0 }], estimatedMinutes: 5, status: 'published',
}

test('M3 journey loads stable IDs through services and derives mock progress', async () => {
  const services = createMockLearningServices(
    { chapters: [chapter], lessons: [lesson], storyVersions: [], mediaAssets: [] },
    { userId: 'user-journey' }, () => '2026-10-01T00:00:00.000Z',
  )
  const initial = await loadJourney(services)
  assert.equal(initial.ok && initial.value.chapters[0].lessons[0].progressStatus, 'not_started')

  assert.equal((await startLesson(services, initial.ok ? initial.value.chapters[0].lessons[0] : lesson)).ok, true)
  const resumed = await loadJourney(services)
  assert.equal(resumed.ok && resumed.value.chapters[0].lessons[0].progressStatus, 'in_progress')
  assert.equal(resumed.ok && resumed.value.chapters[0].lessons[0].id, 'lesson-stable')
})

test('M3 journey exposes empty and service failure states without reading fixtures in UI', async () => {
  const emptyServices = createMockLearningServices(
    { chapters: [], lessons: [], storyVersions: [], mediaAssets: [] }, { userId: 'user-empty' },
  )
  const empty = await loadJourney(emptyServices)
  assert.deepEqual(empty, { ok: true, value: { chapters: [] } })

  const offline = await loadJourney({
    ...emptyServices,
    chapters: { ...emptyServices.chapters, listPublished: async () => ({ ok: false, error: 'offline' }) },
  })
  assert.deepEqual(offline, { ok: false, error: 'offline' })
})
