import test from 'node:test'
import assert from 'node:assert/strict'
import { playbackCatalog } from './playback-fixtures.ts'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import { failure, type Result } from '../../src/services/next/contracts.ts'
import { loadJourney, startLesson, getHomeContinuation } from '../../src/features/learning/journey/journeyModel.ts'
import { loadLessonContent } from '../../src/features/learning/lesson/lessonRendererModel.ts'
import { loadVideoPlayer, saveVideoCheckpoint } from '../../src/features/learning/video/videoPlayerModel.ts'
import { loadQuizFlow, submitQuizFlow } from '../../src/features/quiz/v2/quizFlowModel.ts'
import { loadVisualNovel, advanceVisualNovel, chooseVisualNovel, continueChoiceFeedback } from '../../src/features/visual-novel/v2/visualNovelModel.ts'
import { createCompletionSession } from '../../src/features/learning/completion/completionSessionModel.ts'

const unwrap = <T>(r: Result<T>): T => { if (!r.ok) throw Error(r.error); return r.value }
function catalog() {
  const c = playbackCatalog()
  c.chapters = [{ id: 'chapter', slug: 'qa', title: 'QA fixture', summary: '', historicalPeriodLabel: 'Technical only', learningObjectiveIds: [], lessonRefs: [{ id: 'lesson', order: 0 }], estimatedMinutes: 1, status: 'published' }]
  c.completionPolicies = [{ lessonId: 'lesson', contentVersionId: 'v1', eligibilityVersion: 'reward1', requiredLesson: true }]
  return c
}
const make = (c = catalog(), store = createMockProgressStore(), userId = 'a') => createMockLearningServices(c, { userId, timezone: 'Asia/Ho_Chi_Minh' }, () => '2026-10-02T05:00:00Z', store)
const video = { lessonId: 'lesson', blockId: 'video-block', mediaAssetId: 'video' }
const vn = { lessonId: 'lesson', blockId: 'vn-block', storyVersionId: 'version-1' }
async function playStory(services: ReturnType<typeof make>) {
  let s = unwrap(await loadVisualNovel(services, vn))
  s = unwrap(await advanceVisualNovel(services, vn, s, 'advance'))
  s = unwrap(await chooseVisualNovel(services, vn, s, 'choice-a', 'choice'))
  assert.equal(s.feedback?.outcome, 'neutral')
  return unwrap(continueChoiceFeedback(s))
}

test('learning loop: journey → ordered players → completion → profile → re-entry/account isolation', async () => {
  const c = catalog(), store = createMockProgressStore(), services = make(c, store)
  const journey = unwrap(await loadJourney(services))
  unwrap(await startLesson(services, getHomeContinuation(journey.chapters)!.lesson))
  assert.equal(getHomeContinuation(unwrap(await loadJourney(services)).chapters)?.lesson.progressStatus, 'in_progress')
  assert.deepEqual(unwrap(await loadLessonContent(services, 'lesson')).blocks.map(b => b.id), ['vn-block', 'video-block'])
  const session = createCompletionSession(services, 'a'), controller = session.lesson('lesson', 'v1')
  await controller.restore(); await controller.submit()
  assert.equal(controller.getSnapshot().status, 'ineligible')
  assert.equal((await playStory(services)).currentSceneId, 'end')
  await controller.submit(); assert.equal(controller.getSnapshot().status, 'ineligible')
  unwrap(await saveVideoCheckpoint(services, video, 90, [{ start: 0, end: 90 }], 'watched'))
  assert.equal(unwrap(await loadVideoPlayer(services, video)).resumePositionSeconds, 90)
  await controller.submit(); assert.equal(controller.getSnapshot().status, 'confirmed')
  assert.equal(session.summary.getSnapshot().value?.totalXp, 30)
  assert.equal(session.summary.getSnapshot().value?.currentStreak, 1)
  const done = unwrap(await loadJourney(services))
  assert.equal(done.chapters[0].completedCount, 1); assert.equal(getHomeContinuation(done.chapters), undefined)
  const reload = createCompletionSession(make(c, store), 'a')
  await reload.lesson('lesson', 'v1').restore(); await reload.lesson('lesson', 'v1').submit(); await reload.summary.refresh()
  assert.equal(reload.summary.getSnapshot().value?.totalXp, 30)
  const other = createCompletionSession(make(c, store, 'b'), 'b')
  await other.lesson('lesson', 'v1').restore(); await other.summary.refresh()
  assert.equal(other.lesson('lesson', 'v1').getSnapshot().receipt, undefined)
  assert.equal(other.summary.getSnapshot().value?.totalXp, 0)
})

for (const mode of ['practice', 'scored'] as const) test(`learning loop: ${mode} quiz consumer gates confirmed rewards and retry`, async () => {
  const c = catalog()
  c.lessons[0].format = 'quiz'
  c.lessons[0].blocks = [{ kind: 'quiz', id: 'quiz', questionSetId: 'qset', assessmentMode: mode, order: 0, required: true }]
  c.completionPolicies![0].rewardedAssessmentIds = ['qset']
  c.quizzes = [{ status: 'published', set: { id: 'qset', title: 'Quiz', mode, questionIds: ['q'], learningObjectiveIds: [] },
    questions: [{ id: 'q', prompt: 'Question', optionIds: ['a', 'b'], options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], explanation: 'Trusted feedback', sourceIds: [], difficulty: 'intro', status: 'published' }],
    grade: input => { const passed = input.answers[0].selectedOptionIds[0] === 'a'; return { attemptId: input.operationId, score: Number(passed), total: 1, passed, feedback: [{ questionId: 'q', outcome: passed ? 'correct' : 'incorrect', explanation: 'Trusted feedback' }] } },
  }]
  const services = make(c), session = createCompletionSession(services, 'a'), controller = session.lesson('lesson', 'v1')
  const flow = unwrap(await loadQuizFlow(services, 'qset'))
  await controller.restore(); await controller.submit(); assert.equal(controller.getSnapshot().status, 'ineligible')
  const wrong = { ...flow, answers: { q: ['b'] } }
  unwrap(await submitQuizFlow(services, wrong, 'wrong')); await controller.submit()
  assert.equal(controller.getSnapshot().status, mode === 'practice' ? 'confirmed' : 'ineligible')
  if (mode === 'scored') {
    const right = { ...flow, answers: { q: ['a'] } }
    const first = unwrap(await submitQuizFlow(services, right, 'right'))
    assert.deepEqual(unwrap(await submitQuizFlow(services, right, 'right')), first)
    await controller.submit()
  }
  await session.summary.refresh(); assert.equal(session.summary.getSnapshot().value?.totalXp, mode === 'scored' ? 25 : 0)
  await controller.restore(); await controller.submit(); await session.summary.refresh()
  assert.equal(session.summary.getSnapshot().value?.requiredLessonCount, 1)
})

test('learning loop: lost completion response and summary outage recover without minting twice', async () => {
  const c = catalog(); c.lessons[0].blocks = [{ kind: 'text', id: 'text', documentId: 'doc', order: 0, required: true }]
  c.documents = [{ id: 'doc', title: 'Text', locale: 'vi-VN', status: 'published', sourceIds: [], sections: [{ id: 'p', kind: 'paragraph', text: 'Technical fixture' }] }]
  const services = make(c), session = createCompletionSession(services, 'a'), controller = session.lesson('lesson', 'v1')
  await controller.restore(); await controller.acknowledge('text')
  const write = services.completion.completeLesson, read = services.users.getAccountSummary
  const ids: string[] = []; let lost = true
  services.completion.completeLesson = async input => { ids.push(input.operationId); const result = await write(input); if (lost) { lost = false; return failure('offline') } return result }
  services.users.getAccountSummary = async () => failure('server_error')
  await controller.submit(); assert.equal(controller.getSnapshot().status, 'error'); assert.equal(session.summary.getSnapshot().value, undefined)
  await controller.submit(); assert.equal(controller.getSnapshot().status, 'confirmed'); assert.equal(session.summary.getSnapshot().status, 'error')
  assert.equal(new Set(ids).size, 1)
  services.users.getAccountSummary = read; await session.summary.refresh()
  assert.equal(session.summary.getSnapshot().value?.totalXp, 10); assert.equal(ids.length, 2)
})

for (const policy of ['optional', 'fallback'] as const) test(`learning loop: ${policy} video never bypasses required acknowledgement`, async () => {
  const c = catalog()
  c.lessons[0].blocks = [{ kind: 'video', id: 'video-block', mediaAssetId: 'video', completionPolicy: policy === 'optional' ? 'optional' : 'watch_threshold', order: 0, required: true }, { kind: 'recap', id: 'recap', documentId: 'doc', order: 1, required: true }]
  c.documents = [{ id: 'doc', title: 'Recap', locale: 'vi-VN', status: 'published', sourceIds: [], sections: [{ id: 'p', kind: 'paragraph', text: 'Technical fixture' }] }]
  if (policy === 'fallback') c.completionPolicies![0].videoFallbacks = [{ blockId: 'video-block', checkBlockId: 'recap' }]
  const services = make(c), session = createCompletionSession(services, 'a'), controller = session.lesson('lesson', 'v1')
  assert.equal(unwrap(await loadLessonContent(services, 'lesson')).blocks.length, 2)
  assert.ok(unwrap(await loadVideoPlayer(services, video)).asset.transcript)
  if (policy === 'fallback') unwrap(await services.completion.recordBlockAction({ lessonId: 'lesson', blockId: 'video-block', action: 'accessible_fallback', operationId: 'fallback' }))
  await controller.restore(); await controller.submit(); assert.equal(controller.getSnapshot().status, 'ineligible')
  await controller.acknowledge('recap'); await controller.submit()
  assert.equal(controller.getSnapshot().receipt?.method, policy === 'fallback' ? 'accessible_fallback' : 'standard')
  assert.equal(session.summary.getSnapshot().value?.totalXp, 10)
})
