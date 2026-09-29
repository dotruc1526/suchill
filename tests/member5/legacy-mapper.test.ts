import test from 'node:test'
import assert from 'node:assert/strict'
import { chapters } from '../../src/data/index.ts'
import { mapLegacyChapter } from '../../src/services/next/legacyMapper.ts'
import { validateChapter, validateLesson } from '../../src/services/next/validation.ts'

test('legacy chapter maps deterministically to unpublished domain fixture content', () => {
  const first = mapLegacyChapter(chapters[0])
  const second = mapLegacyChapter(chapters[0])
  assert.deepEqual(first, second)
  assert.equal(first.chapter.id, 'legacy.chapter.1')
  assert.equal(first.chapter.status, 'draft')
  assert.equal('progress' in first.chapter, false)
  assert.equal('status' in first.lessons[0] && first.lessons[0].status, 'draft')
  assert.equal(first.lessons[0].id, 'legacy.lesson.1.1')
  assert.equal(first.lessons[0].blocks[0].id, 'legacy.block.1.1.overview')
  assert.equal(first.documents[0].fixtureOnly, true)
  assert.ok(first.excluded.some(item => item.kind === 'quiz' && item.legacyId === 'legacy.quiz.1'))
  assert.ok(first.excluded.some(item => item.kind === 'progress'))
  assert.deepEqual(validateChapter(first.chapter, { lessonIds: new Set(first.lessons.map(lesson => lesson.id)) }), [])
  for (const lesson of first.lessons) {
    assert.deepEqual(validateLesson(lesson, {
      chapterIds: new Set([first.chapter.id]), documentIds: new Set(first.documents.map(document => document.id)),
    }), [])
  }
})

test('legacy visual novel graph remains isolated until authored source review', () => {
  const mapped = mapLegacyChapter(chapters[0])
  const vnLesson = mapped.lessons.find(lesson => lesson.id === 'legacy.lesson.1.2')
  assert.ok(vnLesson)
  assert.equal(vnLesson.format, 'standard')
  assert.ok(!vnLesson.blocks.some(block => block.kind === 'visual_novel'))
  assert.ok(mapped.excluded.some(item => item.kind === 'visual_novel' && item.legacyId === 'geneva-1954'))
})
