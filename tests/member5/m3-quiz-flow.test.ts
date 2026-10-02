import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices, type MockCatalog, type MockQuizFixture } from '../../src/services/next/mock.ts'
import {
  isQuizComplete, loadQuizFlow, QuizSubmissionGate, resetQuizFlow, submitQuizFlow, toggleQuizOption,
} from '../../src/features/quiz/v2/quizFlowModel.ts'

function quizFixture(mode: 'practice' | 'scored'): MockQuizFixture {
  return {
    status: 'published',
    set: { id: `quiz-${mode}`, title: mode === 'practice' ? 'Luyện tập' : 'Kiểm tra', mode, questionIds: ['q2', 'q1'], learningObjectiveIds: [] },
    questions: ['q1', 'q2'].map(id => ({
      id, prompt: `Câu ${id}`, optionIds: ['a', 'b'], explanation: 'Private answer', sourceIds: [], difficulty: 'intro', status: 'published',
      options: [{ id: 'a', label: 'Phương án A' }, { id: 'b', label: 'Phương án B' }],
    })),
    grade: input => ({
      attemptId: `${mode}-attempt`, score: 1, total: 2, passed: mode === 'scored' ? false : undefined,
      feedback: input.answers.map((answer, index) => ({
        questionId: answer.questionId, outcome: index === 0 ? 'correct' : 'incorrect', explanation: `Giải thích ${answer.questionId}`,
      })),
    }),
  }
}
const catalog = (fixtures = [quizFixture('practice'), quizFixture('scored')]): MockCatalog => ({
  chapters: [], lessons: [], storyVersions: [], mediaAssets: [], quizzes: fixtures,
})
const services = (fixtures?: MockQuizFixture[]) => createMockLearningServices(catalog(fixtures), { userId: 'duong' })

test('M3-05 loads safe delivery and submits complete practice answers in authored question order', async () => {
  const learning = services()
  const loaded = await loadQuizFlow(learning, 'quiz-practice')
  assert.equal(loaded.ok, true)
  assert.doesNotMatch(JSON.stringify(loaded), /Private answer|isCorrect|answerKey/)
  if (!loaded.ok) return
  let answers = toggleQuizOption(loaded.value.answers, 'q1', 'a')
  assert.equal(isQuizComplete(loaded.value.delivery, answers), false)
  answers = toggleQuizOption(answers, 'q2', 'b')
  assert.equal(isQuizComplete(loaded.value.delivery, answers), true)

  const submitted = await submitQuizFlow(learning, { ...loaded.value, answers }, 'stable-operation')
  assert.equal(submitted.ok && submitted.value.mode, 'practice')
  assert.deepEqual(submitted.ok && submitted.value.feedback.map(item => item.questionId), ['q2', 'q1'])
  const retried = await submitQuizFlow(learning, { ...loaded.value, answers }, 'stable-operation')
  assert.deepEqual(retried, submitted)
})

test('M3-05 uses trusted scored receipt and never derives score/pass in the client model', async () => {
  const learning = services()
  const loaded = await loadQuizFlow(learning, 'quiz-scored')
  if (!loaded.ok) return
  const answers = { q1: ['a'], q2: ['b'] }
  const result = await submitQuizFlow(learning, { ...loaded.value, answers }, 'scored-operation')
  assert.deepEqual(result.ok && result.value.mode === 'scored' && {
    score: result.value.score, total: result.value.total, passed: result.value.passed,
  }, { score: 1, total: 2, passed: false })
})

test('M3-05 blocks incomplete submission, toggles selections immutably and resets only local attempt state', async () => {
  const learning = services()
  const loaded = await loadQuizFlow(learning, 'quiz-practice')
  if (!loaded.ok) return
  const once = toggleQuizOption({}, 'q1', 'a')
  const removed = toggleQuizOption(once, 'q1', 'a')
  assert.deepEqual(once, { q1: ['a'] })
  assert.deepEqual(removed, { q1: [] })
  assert.deepEqual(await submitQuizFlow(learning, { ...loaded.value, answers: once }, 'incomplete'), { ok: false, error: 'validation' })
  assert.deepEqual(resetQuizFlow({ ...loaded.value, answers: once }).answers, {})
})

test('M3-05 surfaces delivery and grading failures without fabricating feedback', async () => {
  assert.deepEqual(await loadQuizFlow(services(), 'missing'), { ok: false, error: 'not_found' })
  const fixture = quizFixture('practice')
  fixture.grade = () => { throw new Error('grader unavailable') }
  const learning = services([fixture])
  const loaded = await loadQuizFlow(learning, 'quiz-practice')
  if (!loaded.ok) return
  const result = await submitQuizFlow(learning, { ...loaded.value, answers: { q1: ['a'], q2: ['b'] } }, 'retryable-operation')
  assert.deepEqual(result, { ok: false, error: 'server_error' })
})

test('M3-05 rejects a late submission after the active question set changes', () => {
  const gate = new QuizSubmissionGate('quiz-practice')
  const oldSubmission = gate.begin('quiz-practice')
  gate.activate('quiz-scored')

  assert.equal(gate.isCurrent(oldSubmission), false)
  const currentSubmission = gate.begin('quiz-scored')
  assert.equal(gate.isCurrent(currentSubmission), true)
  gate.invalidate()
  assert.equal(gate.isCurrent(currentSubmission), false)
})

test('M3-05 unexpected transport throws yield retryable domain errors without stuck loading/submission', async () => {
  const base = services()
  const failing = { ...base, quiz: { ...base.quiz,
    async getQuestionSet() { throw new Error('delivery transport') },
    async submitPracticeAttempt() { throw new Error('submit transport') },
    async submitScoredAttempt() { throw new Error('submit transport') },
  } }
  assert.deepEqual(await loadQuizFlow(failing, 'quiz-practice'), { ok: false, error: 'server_error' })
  for (const id of ['quiz-practice', 'quiz-scored']) {
    const loaded = await loadQuizFlow(base, id)
    assert.ok(loaded.ok)
    assert.deepEqual(await submitQuizFlow(failing, { ...loaded.value, answers: { q1: ['a'], q2: ['b'] } }, 'stable'), { ok: false, error: 'server_error' })
  }
})
