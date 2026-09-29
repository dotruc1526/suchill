import test from 'node:test'
import assert from 'node:assert/strict'
import { validateChapter, validateHistoricalClaim, validateLesson, validateMediaAsset, validateStoryVersion } from '../../src/services/next/validation.ts'
import type { Chapter, HistoricalClaim, Lesson, MediaAsset, StoryVersion } from '../../src/types/v2/content.ts'

const lesson: Lesson = {
  id: 'lesson-1', chapterId: 'chapter-1', slug: 'sample', title: 'Sample', summary: '',
  format: 'standard', estimatedMinutes: 5, learningObjectiveIds: ['objective-1'],
  prerequisites: [], status: 'published',
  blocks: [{ id: 'block-1', order: 0, required: true, kind: 'text', documentId: 'document-1' }],
}

const story: StoryVersion = {
  id: 'version-1', storyId: 'story-1', versionNumber: 1, status: 'draft',
  startSceneId: 'scene-1', learningObjectiveIds: ['objective-1'], sourceIds: [],
  createdAt: '2026-09-24T00:00:00Z',
  scenes: [
    { id: 'scene-1', kind: 'choice', prompt: '?', policy: 'continue_after_feedback', sourceIds: [], claimIds: [],
      choices: [{ id: 'choice-1', kind: 'narrative', label: 'Continue', nextSceneId: 'scene-2' }] },
    { id: 'scene-2', kind: 'end', summary: 'Done', sourceIds: [], claimIds: [] },
  ],
}
const chapter: Chapter = {
  id: 'chapter-1', slug: 'sample', title: 'Sample', summary: '', historicalPeriodLabel: '',
  learningObjectiveIds: ['objective-1'], lessonRefs: [{ id: 'lesson-1', order: 0 }],
  estimatedMinutes: 5, status: 'published',
}

test('chapter and lesson validators check stable references, status and ordered identities', () => {
  assert.deepEqual(validateChapter(chapter, { lessonIds: new Set(['lesson-1']), approvedLessonIds: new Set(['lesson-1']) }), [])
  const chapterIssues = validateChapter(chapter, { lessonIds: new Set(), approvedLessonIds: new Set() })
  assert.ok(chapterIssues.some(error => error.code === 'missing_lesson'))
  assert.ok(chapterIssues.some(error => error.code === 'unapproved_lesson'))

  const invalid = { ...lesson, status: 'live', chapterId: '' } as unknown as Lesson
  const lessonCodes = validateLesson(invalid).map(error => error.code)
  assert.ok(lessonCodes.includes('invalid_status'))
  assert.ok(lessonCodes.includes('missing_chapter'))
})

test('lesson validator accepts referenced block and rejects duplicate order', () => {
  assert.deepEqual(validateLesson(lesson, {
    chapterIds: new Set(['chapter-1']), documentIds: new Set(['document-1']), approvedDocumentIds: new Set(['document-1']),
  }), [])
  const invalid = { ...lesson, blocks: [...lesson.blocks, { ...lesson.blocks[0], id: 'block-2' }] }
  assert.ok(validateLesson(invalid).some(error => error.code === 'block_order'))
})

test('lesson validator resolves each block kind to its own reference lookup', () => {
  const mixed: Lesson = {
    ...lesson,
    blocks: [
      ...lesson.blocks,
      { id: 'block-2', order: 1, required: true, kind: 'recap', documentId: 'document-2' },
      { id: 'block-3', order: 2, required: true, kind: 'visual_novel', storyVersionId: 'story-1' },
      { id: 'block-4', order: 3, required: false, kind: 'video', mediaAssetId: 'media-1', completionPolicy: 'optional' },
      { id: 'block-5', order: 4, required: true, kind: 'quiz', questionSetId: 'questions-1', assessmentMode: 'practice' },
    ],
  }
  const lookup = {
    documentIds: new Set(['document-1', 'document-2']),
    approvedDocumentIds: new Set(['document-1', 'document-2']),
    storyVersionIds: new Set(['story-1']),
    approvedStoryVersionIds: new Set(['story-1']),
    mediaAssetIds: new Set(['media-1']),
    approvedMediaAssetIds: new Set(['media-1']),
    questionSetIds: new Set(['questions-1']),
    approvedQuestionSetIds: new Set(['questions-1']),
    chapterIds: new Set(['chapter-1']),
  }
  assert.deepEqual(validateLesson(mixed, lookup), [])
  assert.ok(validateLesson(mixed, { ...lookup, questionSetIds: new Set() })
    .some(error => error.code === 'missing_reference' && error.path === 'blocks[4]'))
})

test('story validator catches broken links and narrative correctness', () => {
  assert.deepEqual(validateStoryVersion(story), [])
  const invalid = structuredClone(story)
  const scene = invalid.scenes[0]
  if (scene.kind !== 'choice') throw new Error('Invalid fixture')
  Object.assign(scene.choices[0], { nextSceneId: 'missing', isCorrect: true })
  const codes = validateStoryVersion(invalid).map(error => error.code)
  assert.ok(codes.includes('broken_transition'))
  assert.ok(codes.includes('narrative_correctness'))
  assert.ok(codes.includes('no_reachable_end'))
})

test('story validator requires a usable transition for every continuing choice', () => {
  const invalid = structuredClone(story)
  const scene = invalid.scenes[0]
  if (scene.kind !== 'choice') throw new Error('Invalid fixture')
  scene.choices.push({ id: 'choice-2', kind: 'knowledge_check', label: 'Other', isCorrect: false, explanation: 'Try again' })
  assert.ok(validateStoryVersion(invalid).some(error => error.code === 'missing_transition'))

  scene.policy = 'retry_until_correct'
  assert.ok(!validateStoryVersion(invalid).some(error => error.code === 'missing_transition'))
  scene.choices[1] = { id: 'choice-2', kind: 'knowledge_check', label: 'Other', isCorrect: true, explanation: 'Correct' }
  assert.ok(validateStoryVersion(invalid).some(error => error.code === 'missing_transition'))
})

test('story validator checks source, claim and published media references', () => {
  const invalid = structuredClone(story)
  invalid.status = 'published'
  invalid.sourceIds = ['source-missing']
  invalid.publishedAt = '2026-09-29T00:00:00Z'
  const first = invalid.scenes[0]
  first.sourceIds.push('source-missing')
  first.claimIds.push('claim-missing')
  const codes = validateStoryVersion(invalid, {
    sourceIds: new Set(), approvedSourceIds: new Set(), claimIds: new Set(), approvedClaimIds: new Set(),
    mediaAssetIds: new Set(), approvedMediaAssetIds: new Set(),
  }).map(error => error.code)
  assert.ok(codes.includes('missing_source'))
  assert.ok(codes.includes('missing_claim'))
  assert.ok(codes.includes('unapproved_source'))
  assert.ok(codes.includes('unapproved_claim'))
})

test('media validator requires accessibility and provenance before publication', () => {
  const media: MediaAsset = {
    id: 'media-1', kind: 'video', title: 'Video', storageRef: 'published-media/video.mp4',
    sourceIds: [], reviewStatus: 'published',
  }
  const codes = validateMediaAsset(media).map(error => error.code)
  assert.ok(codes.includes('media_provenance'))
  assert.ok(codes.includes('media_accessibility'))
})

test('media validator detects invalid review status and unknown provenance', () => {
  const invalid = {
    id: 'media-2', kind: 'image', title: 'Image', storageRef: 'draft/image.png', sourceIds: ['source-x'], reviewStatus: 'live',
  } as unknown as MediaAsset
  const codes = validateMediaAsset(invalid, { sourceIds: new Set() }).map(error => error.code)
  assert.ok(codes.includes('invalid_status'))
  assert.ok(codes.includes('missing_source'))
})

test('published historical claims require known approved sources', () => {
  const claim: HistoricalClaim = {
    id: 'claim-1', statement: 'A reviewed statement.', kind: 'fact', sourceIds: ['source-1'], reviewStatus: 'published',
  }
  assert.deepEqual(validateHistoricalClaim(claim, {
    sourceIds: new Set(['source-1']), approvedSourceIds: new Set(['source-1']),
  }), [])
  const codes = validateHistoricalClaim(claim, { sourceIds: new Set(['source-1']), approvedSourceIds: new Set() })
    .map(error => error.code)
  assert.ok(codes.includes('unapproved_source'))
})

test('published content fails closed when approval lookups are omitted', () => {
  assert.ok(validateChapter(chapter).some(error => error.code === 'lookup_required'))
  assert.ok(validateLesson(lesson).some(error => error.code === 'lookup_required'))
  assert.ok(validateStoryVersion({ ...story, status: 'published', sourceIds: ['source-1'], publishedAt: '2026-09-29T00:00:00Z' })
    .some(error => error.code === 'lookup_required'))
})
