import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'

const vite = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false }, appType: 'custom' })
after(() => vite.close())
const { buildCandidateImport } = await vite.ssrLoadModule('/src/services/reference1954/candidateImport.ts')
const { candidateLessons, lessonOneCandidate, lessonSixCandidate } = await vite.ssrLoadModule('/src/services/reference1954/candidateLessons.ts')
const { validateChapter, validateLesson } = await vite.ssrLoadModule('/src/services/next/validation.ts')
const { validateStoryVersion } = await vite.ssrLoadModule('/src/services/next/storyValidation.ts')
const { sources } = JSON.parse(await readFile('docs/content/chapter1954/SOURCE-REGISTER.json', 'utf8'))
const known = new Set(sources.map(source => source.id))
const studies = [lessonOneCandidate, ...Object.values(candidateLessons), lessonSixCandidate]

test('all seven candidates form a valid ordered domain graph without publication or reward authority', () => {
  const plan = buildCandidateImport(studies, known)
  const lookup = { chapterIds: new Set([plan.chapter.id]), lessonIds: new Set(plan.lessons.map(item => item.id)),
    documentIds: new Set(plan.documents.map(item => item.id)), questionSetIds: new Set(plan.questionSets.map(item => item.id)),
    storyVersionIds: new Set([plan.story.id]), mediaAssetIds: new Set(['candidate.1954.video.corrected.v2']), sourceIds: known }
  assert.deepEqual(validateChapter(plan.chapter, lookup), [])
  for (const lesson of plan.lessons) assert.deepEqual(validateLesson(lesson, lookup), [], lesson.id)
  assert.deepEqual(validateStoryVersion(plan.story, lookup), [])
  assert.equal(plan.lessons.length, 7)
  assert.ok(plan.lessons.every(lesson => plan.objectives.some(objective => lesson.learningObjectiveIds.includes(objective.id))))
  assert.ok([...plan.lessons, ...plan.documents, ...plan.questions, plan.story, plan.chapter].every(item => item.status === 'in_review'))
  assert.equal(plan.publicationAllowed, false)
  assert.equal(plan.privateAnswerKeys.length, plan.questions.length)
  assert.ok(plan.questions.every(question => !('correctOptionId' in question)))
  assert.equal(plan.lessons[0].blocks[1].kind, 'video')
  assert.equal(plan.lessons[5].blocks[1].kind, 'visual_novel')
})

test('import preparation rejects partial chapters, broken answer keys and unknown sources', () => {
  assert.throws(() => buildCandidateImport(studies.slice(1), known), /Missing lesson/)
  const broken = structuredClone(studies); broken[0].checks[0].answerId = 'not-an-option'
  assert.throws(() => buildCandidateImport(broken, known), /Invalid answer/)
  assert.throws(() => buildCandidateImport(studies, new Set()), /Unknown source/)
  const missingBinding = structuredClone(studies); missingBinding[0].checks[0].sourceIds = []
  assert.throws(() => buildCandidateImport(missingBinding, known), /Missing source binding/)
  const reordered = structuredClone(studies); reordered[0].sections[0].paragraphs.reverse()
  const before = buildCandidateImport(studies, known).documents[0].sections.map(item => item.id).sort()
  const after = buildCandidateImport(reordered, known).documents[0].sections.map(item => item.id).sort()
  assert.deepEqual(after, before, 'paragraph reordering preserves authored identity')
})
