import test from 'node:test'
import assert from 'node:assert/strict'
import { validateLesson, validateMediaAsset, validateStoryVersion } from '../../src/services/next/validation.ts'
import type { Lesson, MediaAsset, StoryVersion } from '../../src/types/v2/content.ts'

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

test('lesson validator accepts referenced block and rejects duplicate order', () => {
  assert.deepEqual(validateLesson(lesson, { documentIds: new Set(['document-1']) }), [])
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
    storyVersionIds: new Set(['story-1']),
    mediaAssetIds: new Set(['media-1']),
    questionSetIds: new Set(['questions-1']),
  }
  assert.deepEqual(validateLesson(mixed, lookup), [])
  assert.deepEqual(validateLesson(mixed, { ...lookup, questionSetIds: new Set() }).map(error => error.path), ['blocks[4]'])
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

test('media validator requires accessibility and provenance before publication', () => {
  const media: MediaAsset = {
    id: 'media-1', kind: 'video', title: 'Video', storageRef: 'published-media/video.mp4',
    sourceIds: [], reviewStatus: 'published',
  }
  const codes = validateMediaAsset(media).map(error => error.code)
  assert.ok(codes.includes('media_provenance'))
  assert.ok(codes.includes('media_accessibility'))
})
