import test from 'node:test'
import assert from 'node:assert/strict'
import { validateChapter, validateLesson, validateStoryVersion } from '../../src/services/next/validation.ts'
import type { Chapter, Lesson, StoryVersion } from '../../src/types/v2/content.ts'

const chapter: Chapter = {
  id: 'chapter', slug: 'qa', title: 'Technical fixture', summary: '', historicalPeriodLabel: '',
  learningObjectiveIds: ['objective'], lessonRefs: [{ id: 'lesson', order: 0 }], estimatedMinutes: 1, status: 'published',
}
const lesson: Lesson = {
  id: 'lesson', chapterId: 'chapter', slug: 'qa', title: 'Technical fixture', summary: '', format: 'standard',
  learningObjectiveIds: ['objective'], prerequisites: [], estimatedMinutes: 1, status: 'published',
  blocks: [{ id: 'text', kind: 'text', documentId: 'document', order: 0, required: true }],
}
const story: StoryVersion = {
  id: 'version', storyId: 'story', versionNumber: 1, status: 'published', startSceneId: 'start',
  learningObjectiveIds: ['objective'], sourceIds: ['source'], createdAt: '2026-10-01T00:00:00Z', publishedAt: '2026-10-01T00:00:00Z',
  scenes: [
    { id: 'start', kind: 'choice', prompt: 'Fixture', policy: 'continue_after_feedback', sourceIds: [], claimIds: [],
      choices: [{ id: 'continue', kind: 'narrative', label: 'Continue', nextSceneId: 'end' }] },
    { id: 'end', kind: 'end', summary: 'End', sourceIds: [], claimIds: [] },
  ],
}
const lookup = {
  chapterIds: new Set(['chapter']), lessonIds: new Set(['lesson']), approvedLessonIds: new Set(['lesson']),
  documentIds: new Set(['document']), approvedDocumentIds: new Set(['document']),
  sourceIds: new Set(['source']), approvedSourceIds: new Set(['source']),
}
const cases = [
  ['chapter', chapter, (value: Chapter) => validateChapter(value, lookup)],
  ['lesson', lesson, (value: Lesson) => validateLesson(value, lookup)],
  ['story', story, (value: StoryVersion) => validateStoryVersion(value, lookup)],
] as const
for (const [name, content, validate] of cases) {
  test(`QA-001 ${name}: published objectives have stable nonempty unique identities`, () => {
    // Each pair stays correlated in this heterogeneous fixture table.
    const check = validate as (value: typeof content) => ReturnType<typeof validate>
    assert.deepEqual(check(content), [])
    for (const ids of [[], [''], ['   '], ['objective', 'objective']]) {
      assert.ok(check({ ...content, learningObjectiveIds: ids }).some(issue => issue.code === 'objective'), `${name}: ${JSON.stringify(ids)}`)
    }
  })
}

test('QA-001 broken references identify the affected chapter, lesson and story path', () => {
  assert.ok(validateChapter(chapter, { ...lookup, lessonIds: new Set() }).some(i => i.code === 'missing_lesson' && i.path === 'lessonRefs[0]'))
  assert.ok(validateLesson(lesson, { ...lookup, documentIds: new Set() }).some(i => i.code === 'missing_reference' && i.path === 'blocks[0]'))
  const broken = structuredClone(story)
  if (broken.scenes[0].kind !== 'choice') throw new Error('Invalid fixture')
  broken.scenes[0].choices[0].nextSceneId = 'missing'
  const issues = validateStoryVersion(broken, lookup)
  assert.ok(issues.some(i => i.code === 'broken_transition' && i.path === 'scenes[0]'))
  assert.ok(issues.some(i => i.code === 'no_reachable_end'))
  assert.ok(issues.some(i => i.code === 'unreachable_scene'))
})

test('QA-001 published fixture needs both known and approved reference lookups', () => {
  assert.ok(validateLesson(lesson, { ...lookup, approvedDocumentIds: undefined }).some(i => i.code === 'lookup_required'))
  assert.ok(validateStoryVersion(story, { ...lookup, approvedSourceIds: new Set() }).some(i => i.code === 'unapproved_source'))
})
