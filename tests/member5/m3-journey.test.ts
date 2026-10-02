import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import type { Chapter, Lesson } from '../../src/types/v2/content.ts'
import { getHomeContinuation, loadJourney, startLesson } from '../../src/features/learning/journey/journeyModel.ts'
import { videoPlayerContext, visualNovelPlayerContext } from '../../src/features/learning/journey/lessonPlayerContexts.ts'

const lesson: Lesson = {
  id: 'lesson-stable', chapterId: 'chapter-stable', slug: 'stable', title: 'Bài học', summary: 'Fixture',
  format: 'standard', estimatedMinutes: 5, learningObjectiveIds: [], prerequisites: [], status: 'published',
  blocks: [
    { id: 'block-stable', order: 0, required: true, kind: 'text', documentId: 'document-stable' },
    { id: 'block-resume', order: 1, required: true, kind: 'text', documentId: 'document-resume' },
  ],
}
const chapter: Chapter = {
  id: 'chapter-stable', slug: 'chapter', title: 'Chương', summary: 'Fixture', historicalPeriodLabel: '1972',
  learningObjectiveIds: [], lessonRefs: [{ id: lesson.id, order: 0 }], estimatedMinutes: 5, status: 'published',
}

test('Home continues an active lesson across chapters before offering a new lesson', () => {
  const fresh = { ...chapter, lessons: [{ ...lesson, progressStatus: 'not_started' as const }], completedCount: 0 }
  const active = { ...chapter, id: 'second-chapter', lessons: [{ ...lesson, id: 'active-lesson', progressStatus: 'in_progress' as const }], completedCount: 0 }
  assert.equal(getHomeContinuation([fresh, active])?.lesson.id, 'active-lesson')
  assert.equal(getHomeContinuation([fresh])?.lesson.id, lesson.id)
  assert.equal(getHomeContinuation([{ ...fresh, lessons: [{ ...lesson, progressStatus: 'completed' }] }]), undefined)
})

test('optional Home activity failure does not block the learning catalog', async () => {
  const services = createMockLearningServices(
    { chapters: [chapter], lessons: [lesson], storyVersions: [], mediaAssets: [] }, { userId: 'home-activity-failure' },
  )
  const result = await loadJourney(services, { getSummary: async () => ({ ok: false, error: 'offline' }) })
  assert.equal(result.ok, true)
  assert.equal(result.ok && result.value.chapters.length, 1)
  assert.equal(result.ok && result.value.activity, undefined)
})

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

test('reopening a lesson preserves its existing checkpoint', async () => {
  const services = createMockLearningServices(
    { chapters: [chapter], lessons: [lesson], storyVersions: [], mediaAssets: [] },
    { userId: 'user-resume' }, () => '2026-10-01T00:00:00.000Z',
  )
  const checkpoint = await services.progress.saveCheckpoint({
    lessonId: lesson.id,
    currentBlockId: 'block-resume',
    completedBlockIds: ['block-stable'],
    operationId: 'advance-to-second-block',
  })
  assert.equal(checkpoint.ok, true)

  assert.equal((await startLesson(services, lesson)).ok, true)
  const progress = await services.progress.getLessonProgress(lesson.id)
  assert.equal(progress.ok && progress.value?.currentBlockId, 'block-resume')
  assert.deepEqual(progress.ok && progress.value?.completedBlockIds, ['block-stable'])
})

test('M3 integration maps stable lesson and block identities into player contexts', () => {
  const lessonId = 'lesson-mixed'
  assert.deepEqual(visualNovelPlayerContext(lessonId, {
    id: 'vn-block', order: 0, required: true, kind: 'visual_novel', storyVersionId: 'story-v1',
  }), { lessonId, blockId: 'vn-block', storyVersionId: 'story-v1' })
  assert.deepEqual(videoPlayerContext(lessonId, {
    id: 'video-block', order: 1, required: true, kind: 'video', mediaAssetId: 'video-1', completionPolicy: 'reach_end',
  }), { lessonId, blockId: 'video-block', mediaAssetId: 'video-1' })
})

test('lesson startup cannot write an old account click into the account selected during progress lookup', async () => {
  const actor = { userId: 'A' }
  const services = createMockLearningServices({ chapters: [chapter], lessons: [lesson], storyVersions: [], mediaAssets: [] }, actor)
  const original = services.progress.getLessonProgress
  services.progress.getLessonProgress = async id => { const result = await original(id); actor.userId = 'B'; return result }
  assert.deepEqual(await startLesson(services, { ...lesson, progressStatus: 'not_started' }), { ok: false, error: 'unauthorized' })
  assert.deepEqual(await original(lesson.id), { ok: true, value: null })
  actor.userId = 'A'
  assert.deepEqual(await original(lesson.id), { ok: true, value: null })
})
