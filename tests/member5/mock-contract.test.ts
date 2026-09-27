import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import type { Chapter, Lesson } from '../../src/types/v2/content.ts'

const chapter: Chapter = {
  id: 'chapter-1', slug: 'sample', title: 'Sample', summary: '', historicalPeriodLabel: '',
  learningObjectiveIds: ['objective-1'], lessonRefs: [{ id: 'lesson-1', order: 0 }],
  estimatedMinutes: 5, status: 'published',
}
const lesson: Lesson = {
  id: 'lesson-1', chapterId: 'chapter-1', slug: 'sample', title: 'Sample', summary: '',
  format: 'standard', estimatedMinutes: 5, learningObjectiveIds: ['objective-1'],
  prerequisites: [], status: 'published',
  blocks: [{ id: 'block-1', order: 0, required: true, kind: 'text', documentId: 'doc-1' }],
}
const catalog = { chapters: [chapter, { ...chapter, id: 'draft', status: 'draft' as const }],
  lessons: [lesson], storyVersions: [], mediaAssets: [] }

test('read services expose published content only and return copies', async () => {
  const services = createMockLearningServices(catalog, { userId: 'user-a' })
  const list = await services.chapters.listPublished()
  assert.equal(list.ok, true)
  if (!list.ok) return
  assert.equal(list.value.length, 1)
  list.value[0].title = 'Changed'
  const again = await services.chapters.getById(chapter.id)
  assert.equal(again.ok, true)
  if (again.ok) assert.equal(again.value.title, 'Sample')
  assert.deepEqual(await services.chapters.getById('draft'), { ok: false, error: 'not_found' })
})

test('checkpoint is per session, idempotent and cannot mark authoritative completion', async () => {
  const a = createMockLearningServices(catalog, { userId: 'user-a' }, () => '2026-09-24T00:00:00Z')
  const b = createMockLearningServices(catalog, { userId: 'user-b' })
  const input = { lessonId: 'lesson-1', currentBlockId: 'block-1', completedBlockIds: ['block-1'], operationId: 'op-1' }
  const first = await a.progress.saveCheckpoint(input)
  assert.equal(first.ok, true)
  if (!first.ok) return
  assert.equal(first.value.status, 'in_progress')
  assert.deepEqual(await a.progress.saveCheckpoint(input), first)
  assert.deepEqual(await a.progress.saveCheckpoint({ ...input, currentBlockId: undefined }),
    { ok: false, error: 'conflict' })
  assert.deepEqual(await b.progress.getLessonProgress('lesson-1'), { ok: true, value: null })
  assert.deepEqual(await a.progress.saveCheckpoint({ ...input, operationId: 'op-2', currentBlockId: 'missing' }),
    { ok: false, error: 'validation' })
})
