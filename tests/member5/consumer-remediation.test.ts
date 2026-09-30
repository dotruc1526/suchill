import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices, type MockCatalog, type MockQuizFixture } from '../../src/services/next/mock.ts'
import type { MockQuizGrade } from '../../src/services/next/mockQuiz.ts'

const feedback: MockQuizGrade['feedback'] = [
  { questionId: 'q2', outcome: 'incorrect', explanation: 'Giải thích câu 2' },
  { questionId: 'q1', outcome: 'correct', explanation: 'Giải thích câu 1' },
]
function fixture(mode: 'practice' | 'scored' = 'practice'): MockQuizFixture {
  return {
    status: 'published',
    set: { id: mode, title: 'Bài luyện tập', mode, questionIds: ['q2', 'q1'], learningObjectiveIds: [] },
    questions: ['q1', 'q2'].map(id => ({ id, prompt: id, status: 'published', difficulty: 'intro',
      explanation: 'Private explanation', sourceIds: [], optionIds: ['a', 'b'],
      options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
    })),
    grade: () => ({ attemptId: 'attempt', score: 1, total: 2, passed: false, feedback: [...feedback].reverse() }),
  }
}
const input = { operationId: 'op', questionSetId: 'practice', answers: [
  { questionId: 'q1', selectedOptionIds: ['a'] }, { questionId: 'q2', selectedOptionIds: ['b'] },
] }
const catalog = (quizzes: MockQuizFixture[] = [fixture()]): MockCatalog => ({
  chapters: [], lessons: [], storyVersions: [], mediaAssets: [], quizzes,
})

test('text and recap document reads expose only published documents and return independent copies', async () => {
  const doc = { id: 'doc', title: 'Nội dung', paragraphs: ['Đoạn văn'], keyPoints: ['Ý chính'], sourceIds: ['source'], status: 'published' as const }
  const services = createMockLearningServices({ ...catalog(), documents: [doc, { ...doc, id: 'draft', status: 'draft' }] }, { userId: '' })
  const result = await services.documents.getById('doc')
  assert.deepEqual(result, { ok: true, value: doc })
  if (result.ok) result.value.paragraphs[0] = 'Changed'
  assert.deepEqual(await services.documents.getById('doc'), { ok: true, value: doc })
  for (const id of ['draft', 'missing']) assert.deepEqual(await services.documents.getById(id), { ok: false, error: 'not_found' })
})

test('practice and scored success require complete ordered outcomes; practice has no pass gate', async () => {
  const service = createMockLearningServices(catalog([fixture(), fixture('scored')]), { userId: 'a' }).quiz
  assert.deepEqual(await service.submitPracticeAttempt(input), { ok: true, value: { attemptId: 'attempt', feedback } })
  assert.deepEqual(await service.submitScoredAttempt({ ...input, operationId: 'scored-op', questionSetId: 'scored' }), {
    ok: true, value: { attemptId: 'attempt', score: 1, total: 2, passed: false, feedback },
  })
  assert.deepEqual(await service.submitScoredAttempt(input), { ok: false, error: 'not_found' })
  assert.deepEqual(await service.submitPracticeAttempt({ ...input, questionSetId: 'scored' }), { ok: false, error: 'not_found' })
  const delivery = await service.getQuestionSet('practice')
  assert.doesNotMatch(JSON.stringify(delivery), /outcome|explanation|isCorrect|answerKey/)
})

test('practice validates all required answers and rejects malformed selections before grading', async () => {
  const quiz = fixture()
  quiz.grade = () => { throw new Error('Must not grade invalid input') }
  const service = createMockLearningServices(catalog([quiz]), { userId: 'a' }).quiz
  for (const answers of [[], [input.answers[0]], [input.answers[0], input.answers[0]],
    [{ questionId: 'unknown', selectedOptionIds: ['a'] }, input.answers[1]],
    [{ questionId: 'q1', selectedOptionIds: [] }, input.answers[1]],
    [{ questionId: 'q1', selectedOptionIds: ['a', 'a'] }, input.answers[1]],
    [{ questionId: 'q1', selectedOptionIds: ['unknown'] }, input.answers[1]]]) {
    assert.deepEqual(await service.submitPracticeAttempt({ ...input, answers }), { ok: false, error: 'validation' })
  }
  assert.deepEqual(await service.submitPracticeAttempt({ ...input, operationId: ' ' }), { ok: false, error: 'validation' })
})

test('practice retries are idempotent, isolated per user and copied; changed payload conflicts', async () => {
  const quiz = fixture()
  let calls = 0
  const grade = quiz.grade
  quiz.grade = data => { calls++; return grade(data) }
  const session = { userId: 'a' }
  const service = createMockLearningServices(catalog([quiz]), session).quiz
  const first = await service.submitPracticeAttempt(input)
  assert.deepEqual(await service.submitPracticeAttempt({ ...input, answers: [...input.answers].reverse() }), first)
  assert.equal(calls, 1)
  if (first.ok) first.value.feedback[0].explanation = 'Changed'
  const again = await service.submitPracticeAttempt(input)
  assert.equal(again.ok && again.value.feedback[0].explanation, feedback[0].explanation)
  assert.deepEqual(await service.submitPracticeAttempt({ ...input, answers: input.answers.map(a => ({ ...a, selectedOptionIds: ['b'] })) }), { ok: false, error: 'conflict' })
  session.userId = 'b'
  assert.equal((await service.submitPracticeAttempt(input)).ok, true)
  assert.equal(calls, 2)
  session.userId = ''
  assert.deepEqual(await service.submitPracticeAttempt(input), { ok: false, error: 'unauthorized' })
})

test('both submission modes fail closed for missing, duplicate, unknown or inconsistent grader feedback', async () => {
  const invalid = [undefined, [], [feedback[0], feedback[0]], [feedback[0], { ...feedback[1], questionId: 'unknown' }],
    [feedback[0], { ...feedback[1], outcome: 'maybe' }], [feedback[0], { ...feedback[1], explanation: ' ' }],
    feedback.map(f => ({ ...f, outcome: 'correct' }))]
  for (const mode of ['practice', 'scored'] as const) {
    for (const value of invalid) {
      const quiz = fixture(mode)
      quiz.grade = () => ({ attemptId: 'attempt', score: 1, total: 2, passed: false, feedback: value }) as MockQuizGrade
      const service = createMockLearningServices(catalog([quiz]), { userId: 'a' }).quiz
      const submit = mode === 'practice' ? service.submitPracticeAttempt : service.submitScoredAttempt
      assert.deepEqual(await submit({ ...input, questionSetId: mode }), { ok: false, error: 'server_error' })
    }
  }
})

test('practice strips client correctness and grader extras and allows retry after grader failure', async () => {
  const quiz = fixture()
  let fail = true
  const original = quiz.grade
  quiz.grade = data => {
    assert.doesNotMatch(JSON.stringify(data), /isCorrect|userId/)
    if (fail) throw new Error('Transient grading failure')
    return { ...original(data), xp: 999, feedback: feedback.map(f => ({ ...f, answerKey: 'secret' })) }
  }
  const service = createMockLearningServices(catalog([quiz]), { userId: 'a' }).quiz
  const payload = { ...input, userId: 'other', isCorrect: true }
  assert.deepEqual(await service.submitPracticeAttempt(payload), { ok: false, error: 'server_error' })
  fail = false
  const result = await service.submitPracticeAttempt(payload)
  assert.deepEqual(result, { ok: true, value: { attemptId: 'attempt', feedback } })
  assert.doesNotMatch(JSON.stringify(result), /"xp"|"answerKey"|"passed"/)
})
