import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createMainLearningServices } from '../../src/services/mainServices.ts'
import { scopeLearningServices } from '../../src/services/offline/accountScope.ts'
import { loadVisualNovel, advanceVisualNovel, chooseVisualNovel, continueChoiceFeedback } from '../../src/features/visual-novel/v2/visualNovelModel.ts'
import { createHostedContext, check, value, denied } from './context.mjs'
import { ids, quizAnswers } from './ids.mjs'

// Context enforces the authorized project and cleans only this run's exact A/B identities.
let ctx, mainA, mainB
const mainFor = user => createMainLearningServices(scopeLearningServices(ctx.services(user.client), user.id), user.id)
before(async () => {
  ctx = await createHostedContext()
  mainA = mainFor(ctx.a)
  mainB = mainFor(ctx.b)
})
after(async () => { await ctx?.cleanup() })
const xp = receipt => receipt.rewards.reduce((sum, reward) => sum + reward.xpDelta, 0)

test('hosted main content version, explicit text evidence, canonical replay and account summary', async () => {
  const input = { lessonId: ids.lesson, operationId: 'main-text-completion' }
  const lesson = value(await mainA.lessons.getById(ids.lesson))
  assert.equal(lesson.contentVersionId, ids.lesson)
  assert.equal(value(await mainA.users.getCurrentProfile()).id, ctx.a.id)
  const initial = value(await mainA.users.getAccountSummary())
  assert.equal(initial.totalXp, 0)
  assert.equal(initial.requiredLessonCount, 0)
  assert.equal(initial.locale, 'vi-VN')
  assert.deepEqual(initial.achievements, [])
  assert.equal(value(await mainA.completion.getLessonCompletion(ids.lesson)), null)
  const missing = value(await mainA.completion.completeLesson(input))
  assert.equal(missing.kind, 'ineligible')
  assert.deepEqual(missing.reasons, [{ blockId: ids.textBlock, reason: 'required_evidence_missing' }])
  assert.equal(value(await mainA.users.getAccountSummary()).totalXp, 0)
  assert.deepEqual(await mainA.completion.recordBlockAction({ lessonId: ids.lesson, blockId: ids.textBlock,
    operationId: 'main-text-ack', action: 'acknowledge' }), { ok: true, value: null })
  const completed = value(await mainA.completion.completeLesson(input))
  assert.equal(completed.kind, 'completed')
  const receipt = completed.receipt
  assert.equal(receipt.userId, ctx.a.id)
  assert.equal(receipt.lessonId, ids.lesson)
  assert.equal(receipt.contentVersionId, lesson.contentVersionId)
  assert.ok(Number.isFinite(Date.parse(receipt.confirmedAt)))
  assert.equal(receipt.method, 'standard')
  assert.equal(receipt.reason, 'required_blocks_satisfied')
  assert.equal(xp(receipt), 10)
  assert.deepEqual(value(await mainA.completion.completeLesson(input)), completed)
  assert.deepEqual(value(await mainFor(ctx.a).completion.getLessonCompletion(ids.lesson)), receipt)
  const retry = value(await mainA.completion.completeLesson({ ...input, operationId: 'main-text-new-operation' }))
  assert.equal(retry.kind, 'already_completed')
  assert.equal(xp(retry.receipt), 0)
  assert.ok(retry.receipt.rewards.every(reward => reward.status === 'already_granted'))
  assert.deepEqual(value(await mainA.completion.getLessonCompletion(ids.lesson)), receipt)
  const summary = value(await mainA.users.getAccountSummary())
  assert.equal(summary.totalXp, 10)
  assert.equal(summary.requiredLessonCount, 1)
  assert.equal(summary.currentStreak, 1)
  assert.equal(summary.locale, 'vi-VN')
  assert.deepEqual(summary.achievements, [])
  assert.equal(value(await mainB.completion.getLessonCompletion(ids.lesson)), null)
  assert.equal(value(await mainB.users.getAccountSummary()).totalXp, 0)
})

test('hosted main JWT ownership rejects actor spoofing, operation reuse and direct private receipts', async () => {
  const unauthorized = { ok: false, error: 'unauthorized' }
  assert.deepEqual(await ctx.b.services.mainContract.getCompletion(ids.lesson, ctx.a.id), unauthorized)
  assert.deepEqual(await ctx.b.services.mainContract.getSummary(ctx.a.id), unauthorized)
  assert.deepEqual(await ctx.b.services.mainContract.completeLesson({ lessonId: ids.lesson,
    operationId: 'main-spoof-owner', expectedSubject: ctx.a.id }), unauthorized)
  const wrongScope = createMainLearningServices(scopeLearningServices(ctx.b.services, ctx.b.id), ctx.a.id)
  assert.deepEqual(await wrongScope.users.getAccountSummary(), unauthorized)
  for (const extra of [{ userId: ctx.b.id }, { xp: 999 }]) {
    assert.deepEqual(await ctx.a.services.mainContract.completeLesson({ lessonId: ids.lesson,
      operationId: 'main-spoof-authority', expectedSubject: ctx.a.id, ...extra }), { ok: false, error: 'validation' })
  }
  assert.deepEqual(await mainA.completion.completeLesson({ lessonId: ids.vnLesson,
    operationId: 'main-text-completion' }), { ok: false, error: 'conflict' })
  for (const client of [ctx.anon, ctx.a.client, ctx.b.client]) {
    denied(await client.schema('private').from('m3_completion_receipts').select('lesson_id').eq('user_id', ctx.a.id),
      'Private canonical receipt access')
    denied(await client.schema('private').rpc('m3_receipt', { p_user: ctx.a.id, p_lesson: ids.lesson }),
      'Private receipt helper transport')
  }
  assert.equal(value(await mainB.completion.getLessonCompletion(ids.lesson)), null)
  assert.equal(value(await mainB.users.getAccountSummary()).totalXp, 0)
})

test('hosted main simultaneous independent requests preserve one receipt and one lesson reward', async () => {
  const second = mainFor(ctx.b)
  value(await mainB.completion.recordBlockAction({ lessonId: ids.lesson, blockId: ids.textBlock,
    operationId: 'main-race-ack', action: 'acknowledge' }))
  const input = { lessonId: ids.lesson, operationId: 'main-race-completion' }
  const results = await Promise.all(Array.from({ length: 8 }, (_, index) =>
    (index % 2 ? second : mainB).completion.completeLesson(input)))
  const completed = value(results[0])
  assert.equal(completed.kind, 'completed')
  assert.equal(completed.receipt.userId, ctx.b.id)
  assert.equal(xp(completed.receipt), 10)
  for (const result of results) assert.deepEqual(value(result), completed)
  const retries = await Promise.all([mainB, second].map((main, index) =>
    main.completion.completeLesson({ ...input, operationId: `main-race-fresh-${index}` })))
  for (const result of retries) {
    const retry = value(result)
    assert.equal(retry.kind, 'already_completed')
    assert.equal(xp(retry.receipt), 0)
  }
  assert.deepEqual(value(await mainFor(ctx.b).completion.completeLesson(input)), completed)
  assert.deepEqual(value(await mainB.completion.getLessonCompletion(ids.lesson)), completed.receipt)
  const ledger = await ctx.b.client.from('reward_ledger').select('reward_type,xp_delta').eq('activity_id', ids.lesson)
  check(ledger.error, 'Read disposable B lesson reward ledger')
  assert.deepEqual(ledger.data, [{ reward_type: 'lesson', xp_delta: 10 }])
  assert.equal(value(await mainB.users.getAccountSummary()).totalXp, 10)
  assert.equal(value(await mainB.users.getAccountSummary()).requiredLessonCount, 1)
})

test('hosted main VN trusted feedback and required episode evidence gate one-time completion', async () => {
  const context = { lessonId: ids.vnLesson, blockId: ids.vnBlock, storyVersionId: ids.version }
  const input = { lessonId: ids.vnLesson, operationId: 'main-vn-completion' }
  assert.equal(value(await mainA.completion.completeLesson(input)).kind, 'ineligible')
  const loaded = value(await loadVisualNovel(mainA, context))
  assert.equal(loaded.currentSceneId, ids.start)
  for (const choice of loaded.story.scenes.find(scene => scene.id === ids.check).choices) {
    assert.equal('isCorrect' in choice, false)
    assert.equal('explanation' in choice, false)
  }
  const advanced = value(await advanceVisualNovel(mainA, context, loaded, 'main-vn-advance'))
  const wrong = value(await chooseVisualNovel(mainA, context, advanced, ids.wrong, 'main-vn-wrong'))
  assert.equal(wrong.feedback.outcome, 'incorrect')
  assert.equal(wrong.pendingSceneId, ids.check)
  assert.equal(value(await mainA.completion.completeLesson(input)).kind, 'ineligible')
  const retry = value(continueChoiceFeedback(wrong))
  const correct = value(await chooseVisualNovel(mainA, context, retry, ids.correct, 'main-vn-correct'))
  assert.equal(correct.feedback.outcome, 'correct')
  assert.equal(correct.pendingSceneId, ids.end)
  const completed = value(await mainA.completion.completeLesson(input))
  assert.equal(completed.kind, 'completed')
  assert.equal(completed.receipt.contentVersionId, ids.vnLesson)
  assert.ok(completed.receipt.rewards.some(reward => reward.rewardType === 'episode' && reward.xpDelta === 20))
  assert.deepEqual(value(await mainA.completion.completeLesson(input)), completed)
  const replay = value(await mainA.completion.completeLesson({ ...input, operationId: 'main-vn-replay' }))
  assert.equal(replay.kind, 'already_completed')
  assert.equal(xp(replay.receipt), 0)
  assert.equal(value(await mainA.users.getAccountSummary()).totalXp, 30)
  assert.equal(value(await mainB.completion.getLessonCompletion(ids.vnLesson)), null)
})

test('hosted main scored quiz keeps authoritative reward scopes and retries grant no additional XP', async () => {
  const input = { lessonId: ids.quizLesson, operationId: 'main-quiz-completion' }
  assert.equal(value(await mainA.completion.completeLesson(input)).kind, 'ineligible')
  const delivered = value(await mainA.quiz.getQuestionSet(ids.quiz))
  assert.ok(delivered.questions.every(question => !('explanation' in question) &&
    question.options.every(option => !('isCorrect' in option))))
  const wrong = value(await mainA.quiz.submitScoredAttempt({ questionSetId: ids.quiz,
    operationId: 'main-quiz-wrong', answers: quizAnswers(false) }))
  assert.equal(wrong.passed, false)
  assert.equal(value(await mainA.completion.completeLesson(input)).kind, 'ineligible')
  const grade = { questionSetId: ids.quiz, operationId: 'main-quiz-pass', answers: quizAnswers() }
  const graded = value(await mainA.quiz.submitScoredAttempt(grade))
  assert.equal(graded.passed, true)
  assert.deepEqual(value(await mainA.quiz.submitScoredAttempt(grade)), graded)
  const completed = value(await mainA.completion.completeLesson(input))
  assert.equal(completed.kind, 'completed')
  assert.equal(completed.receipt.contentVersionId, ids.quizLesson)
  assert.ok(completed.receipt.rewards.some(reward => reward.rewardType === 'quiz'))
  assert.ok(completed.receipt.rewards.some(reward => reward.rewardType === 'quiz_bonus'))
  assert.equal(xp(completed.receipt), 0, 'Quiz submission already granted the authoritative rewards')
  assert.deepEqual(value(await mainA.completion.completeLesson(input)), completed)
  const retry = value(await mainA.completion.completeLesson({ ...input, operationId: 'main-quiz-replay' }))
  assert.equal(retry.kind, 'already_completed')
  assert.equal(xp(retry.receipt), 0)
  value(await mainA.quiz.submitScoredAttempt({ ...grade, operationId: 'main-quiz-new-attempt' }))
  const summary = value(await mainA.users.getAccountSummary())
  assert.equal(summary.totalXp, 55)
  assert.equal(summary.requiredLessonCount, 3)
  assert.equal(value(await mainB.users.getAccountSummary()).totalXp, 10)
  assert.equal(value(await mainB.completion.getLessonCompletion(ids.quizLesson)), null)
})
