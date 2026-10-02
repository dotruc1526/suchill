import test from 'node:test'
import assert from 'node:assert/strict'
import { createPracticeDemoServices, practiceDemoSetId } from '../../src/services/next/practiceDemo.ts'
import { loadQuizFlow, submitQuizFlow, resetQuizFlow } from '../../src/features/quiz/v2/quizFlowModel.ts'

test('navigation demo loads safe questions, grades answers, retries and exposes no reward service', async () => {
  const services = createPracticeDemoServices()
  assert.deepEqual(Object.keys(services), ['quiz'])
  const loaded = await loadQuizFlow(services, practiceDemoSetId)
  assert.ok(loaded.ok)
  if (!loaded.ok) return
  assert.equal(loaded.value.delivery.questions.length, 3)
  assert.doesNotMatch(JSON.stringify(loaded), /explanation|isCorrect|answerKey/)
  const incomplete = await submitQuizFlow(services, loaded.value, 'empty')
  assert.deepEqual(incomplete, { ok: false, error: 'validation' })
  const answers = Object.fromEntries(loaded.value.delivery.questions.map((q, i) => [q.id, [q.options[i === 1 ? 1 : 0].id]]))
  const session = { ...loaded.value, answers }
  const result = await submitQuizFlow(services, session, 'attempt-1')
  assert.ok(result.ok)
  if (!result.ok) return
  assert.equal(result.value.mode, 'practice')
  assert.deepEqual(result.value.feedback.map(item => item.outcome), ['correct', 'incorrect', 'correct'])
  assert.ok(result.value.feedback.every(item => item.explanation.length > 0))
  assert.deepEqual(await submitQuizFlow(services, session, 'attempt-1'), result)
  assert.deepEqual(resetQuizFlow(session).answers, {})
  const correctAnswers = Object.fromEntries(loaded.value.delivery.questions.map(q => [q.id, [q.options[0].id]]))
  const retry = await submitQuizFlow(services, { ...session, answers: correctAnswers }, 'attempt-2')
  assert.ok(retry.ok && retry.value.feedback.every(item => item.outcome === 'correct'))
})
