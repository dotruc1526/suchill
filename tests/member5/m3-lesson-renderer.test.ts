import test from 'node:test'
import assert from 'node:assert/strict'
import { loadLessonContent } from '../../src/features/learning/lesson/lessonRendererModel.ts'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import type { LearningDocument, Lesson } from '../../src/types/v2/content.ts'

const documents: LearningDocument[] = [
  { id: 'document-text', title: 'Mở đầu', locale: 'vi-VN', sourceIds: [], status: 'published', sections: [
    { id: 'section-text', kind: 'paragraph', text: 'Nội dung mở đầu.' },
  ] },
  { id: 'document-recap', title: 'Tóm tắt', locale: 'vi-VN', sourceIds: [], status: 'published', sections: [
    { id: 'section-recap', kind: 'key_points', items: ['Ý chính'] },
  ] },
]
const lesson: Lesson = {
  id: 'lesson-mixed', chapterId: 'chapter-1', slug: 'mixed', title: 'Bài hỗn hợp', summary: 'Fixture kỹ thuật',
  format: 'mixed', estimatedMinutes: 10, learningObjectiveIds: [], prerequisites: [], status: 'published',
  blocks: [
    { id: 'block-quiz', kind: 'quiz', order: 4, required: true, questionSetId: 'quiz-1', assessmentMode: 'practice' },
    { id: 'block-text', kind: 'text', order: 0, required: true, documentId: 'document-text' },
    { id: 'block-video', kind: 'video', order: 2, required: true, mediaAssetId: 'video-1', completionPolicy: 'reach_end' },
    { id: 'block-recap', kind: 'recap', order: 3, required: true, documentId: 'document-recap' },
    { id: 'block-vn', kind: 'visual_novel', order: 1, required: true, storyVersionId: 'story-1-v1' },
  ],
}

const createServices = (lessonFixture = lesson, documentFixture = documents) => createMockLearningServices(
  { chapters: [], lessons: [lessonFixture], documents: documentFixture, storyVersions: [], mediaAssets: [] },
  { userId: 'user-renderer' },
)

test('M3-02 resolves documents and returns every typed block in authored order', async () => {
  const result = await loadLessonContent(createServices(), lesson.id)
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.deepEqual(result.value.blocks.map(block => block.id), [
    'block-text', 'block-vn', 'block-video', 'block-recap', 'block-quiz',
  ])
  const text = result.value.blocks[0]
  const recap = result.value.blocks[3]
  assert.equal(text.kind === 'text' && text.document.id, 'document-text')
  assert.equal(recap.kind === 'recap' && recap.document.id, 'document-recap')
})

test('M3-02 fails closed when a referenced document is unavailable', async () => {
  const result = await loadLessonContent(createServices(lesson, documents.slice(1)), lesson.id)
  assert.deepEqual(result, { ok: false, error: 'not_found' })
})

test('M3-02 exposes an empty published lesson without inventing blocks', async () => {
  const emptyLesson = { ...lesson, id: 'lesson-empty', format: 'standard' as const, blocks: [] }
  const result = await loadLessonContent(createServices(emptyLesson), emptyLesson.id)
  assert.equal(result.ok && result.value.blocks.length, 0)
})
