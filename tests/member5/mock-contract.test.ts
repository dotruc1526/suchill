import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import type { Chapter, Lesson, MultipleChoiceQuestion, QuestionSet } from '../../src/types/v2/content.ts'
import type { ScoredQuizSubmission } from '../../src/services/next/contracts.ts'

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
const questionSet: QuestionSet = { id: 'set-1', title: 'Sample quiz', questionIds: ['q-1'], learningObjectiveIds: [], mode: 'scored' }
const question: MultipleChoiceQuestion = {
  id: 'q-1', prompt: 'Question?', optionIds: ['option-a', 'option-b'], explanation: 'Review the source.',
  sourceIds: [], difficulty: 'intro', status: 'published',
}
const catalog = { chapters: [chapter, { ...chapter, id: 'draft', status: 'draft' as const }],
  lessons: [lesson], storyVersions: [], mediaAssets: [], quizzes: [{
    status: 'published' as const,
    set: questionSet,
    questions: [question],
    grade: () => ({ attemptId: 'attempt-1', score: 1, total: 1, passed: true }),
  }] }

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

test('checkpoint and operation IDs stay isolated when one adapter changes account', async () => {
  const session = { userId: 'user-a' }
  const services = createMockLearningServices(catalog, session, () => '2026-09-24T00:00:00Z')
  const input = { lessonId: 'lesson-1', currentBlockId: 'block-1', completedBlockIds: ['block-1'], operationId: 'shared-op' }
  const savedA = await services.progress.saveCheckpoint(input)
  assert.equal(savedA.ok, true)
  session.userId = 'user-b'
  assert.deepEqual(await services.progress.getLessonProgress('lesson-1'), { ok: true, value: null })
  const savedB = await services.progress.saveCheckpoint(input)
  assert.equal(savedB.ok, true)
  if (savedB.ok) assert.equal(savedB.value.userId, 'user-b')
  session.userId = 'user-a'
  assert.deepEqual(await services.progress.getLessonProgress('lesson-1'), savedA.ok ? { ok: true, value: savedA.value } : null)
})

test('quiz reads omit answer keys and scored submissions are trusted and idempotent', async () => {
  const session = { userId: 'user-a', displayName: 'Vinh', locale: 'vi-VN' as const }
  const services = createMockLearningServices(catalog, session)
  const delivered = await services.quiz.getQuestionSet('set-1')
  assert.equal(delivered.ok, true)
  if (!delivered.ok) return
  assert.deepEqual(delivered.value.questions[0].optionIds, ['option-a', 'option-b'])
  assert.equal('correctOptionId' in delivered.value.questions[0], false)

  const input = { operationId: 'quiz-op-1', questionSetId: 'set-1', answers: [{ questionId: 'q-1', selectedOptionIds: ['option-a'] }] }
  const first = await services.quiz.submitScoredAttempt(input)
  assert.deepEqual(first, { ok: true, value: { attemptId: 'attempt-1', score: 1, total: 1, passed: true } })
  assert.deepEqual(await services.quiz.submitScoredAttempt(input), first)
  assert.deepEqual(await services.quiz.submitScoredAttempt({ ...input, answers: [{ ...input.answers[0], selectedOptionIds: ['option-b'] }] }),
    { ok: false, error: 'conflict' })
  assert.deepEqual(await services.users.getCurrentProfile(), { ok: true, value: { id: 'user-a', displayName: 'Vinh', locale: 'vi-VN' } })

  session.userId = 'user-b'
  const secondUser = await services.quiz.submitScoredAttempt(input)
  assert.equal(secondUser.ok, true)
  assert.deepEqual(await services.users.getCurrentProfile(), { ok: true, value: { id: 'user-b', displayName: 'Vinh', locale: 'vi-VN' } })
})

test('quiz adapter rejects unknown options and strips client correctness fields before grading', async () => {
  let graded: ScoredQuizSubmission | undefined
  const guardedCatalog = {
    ...catalog,
    quizzes: catalog.quizzes?.map(fixture => ({
      ...fixture,
      grade(input: ScoredQuizSubmission) {
        graded = input
        return Object.assign({ attemptId: 'attempt-guarded', score: 0, total: 1, passed: false }, { xpAwarded: 999 })
      },
    })),
  }
  const services = createMockLearningServices(guardedCatalog, { userId: 'user-a' })
  const invalid = await services.quiz.submitScoredAttempt({
    operationId: 'quiz-op-2', questionSetId: 'set-1',
    answers: [{ questionId: 'q-1', selectedOptionIds: ['unknown-option'] }],
  })
  assert.deepEqual(invalid, { ok: false, error: 'validation' })

  const untrusted = {
    operationId: 'quiz-op-3', questionSetId: 'set-1', isCorrect: true,
    answers: [{ questionId: 'q-1', selectedOptionIds: ['option-a'], isCorrect: true }],
  } as unknown as ScoredQuizSubmission
  const submitted = await services.quiz.submitScoredAttempt(untrusted)
  assert.equal(submitted.ok, true)
  if (submitted.ok) assert.equal('xpAwarded' in submitted.value, false)
  assert.equal(graded && 'isCorrect' in (graded as unknown as Record<string, unknown>), false)
  assert.equal(graded && 'isCorrect' in (graded.answers[0] as unknown as Record<string, unknown>), false)
})
