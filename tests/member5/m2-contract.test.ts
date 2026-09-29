import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { validateLesson, validateStoryVersion } from '../../src/services/next/validation.ts'
import type { LearningServices } from '../../src/services/next/contracts.ts'
import type { Chapter, Lesson, StoryVersion } from '../../src/types/v2/content.ts'

const lesson: Lesson = {
  id: 'lesson-contract', chapterId: 'chapter-contract', slug: 'contract', title: 'Contract', summary: '',
  format: 'standard', estimatedMinutes: 4, learningObjectiveIds: ['objective-1'], prerequisites: [], status: 'published',
  blocks: [{ id: 'block-contract', order: 0, required: true, kind: 'text', documentId: 'doc-contract' }],
}
const chapter: Chapter = {
  id: 'chapter-contract', slug: 'contract', title: 'Contract', summary: '', historicalPeriodLabel: 'fixture',
  learningObjectiveIds: ['objective-1'], lessonRefs: [{ id: lesson.id, order: 0 }], estimatedMinutes: 4, status: 'published',
}
const story: StoryVersion = {
  id: 'story-version-contract', storyId: 'story-contract', versionNumber: 1, status: 'published',
  startSceneId: 'scene-contract-start', publishedAt: '2026-09-29T00:00:00Z',
  learningObjectiveIds: ['objective-1'], sourceIds: ['source-contract'], createdAt: '2026-09-28T00:00:00Z',
  scenes: [
    { id: 'scene-contract-start', kind: 'narration', text: 'Fixture only.', sourceIds: ['source-contract'], claimIds: [], nextSceneId: 'scene-contract-end' },
    { id: 'scene-contract-end', kind: 'end', summary: 'End.', sourceIds: [], claimIds: [] },
  ],
}

test('domain validators and mock reads agree on published references', async () => {
  assert.deepEqual(validateLesson(lesson, {
    chapterIds: new Set([chapter.id]), documentIds: new Set(['doc-contract']), approvedDocumentIds: new Set(['doc-contract']),
  }), [])
  const broken = validateStoryVersion(story, { sourceIds: new Set() })
  assert.ok(broken.some(issue => issue.code === 'missing_source'))
  assert.deepEqual(validateStoryVersion(story, {
    sourceIds: new Set(['source-contract']), approvedSourceIds: new Set(['source-contract']),
  }), [])

  const services: LearningServices = createMockLearningServices({
    chapters: [chapter], lessons: [lesson], storyVersions: [story], mediaAssets: [],
  }, { userId: 'user-contract' })
  assert.deepEqual(await services.chapters.getById(chapter.id), { ok: true, value: chapter })
  assert.deepEqual(await services.lessons.getById(lesson.id), { ok: true, value: lesson })
  assert.deepEqual(await services.stories.getVersion(story.id), { ok: true, value: story })
  assert.deepEqual(await services.chapters.getById('unpublished-or-missing'), { ok: false, error: 'not_found' })
})

test('service boundary takes operation inputs without caller-supplied account identity', async () => {
  const services = createMockLearningServices({ chapters: [], lessons: [], storyVersions: [], mediaAssets: [] }, { userId: 'user-a' })
  assert.deepEqual(await services.progress.getLessonProgress('lesson-a'), { ok: true, value: null })
  assert.deepEqual(await services.users.getCurrentProfile(), { ok: true, value: { id: 'user-a', displayName: '', locale: 'vi-VN' } })
  assert.deepEqual(await services.quiz.getQuestionSet('unknown'), { ok: false, error: 'not_found' })
})
