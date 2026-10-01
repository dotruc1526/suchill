import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import type { Lesson, StoryVersion } from '../../src/types/v2/content.ts'
import {
  advanceVisualNovel, chooseVisualNovel, continueChoiceFeedback, loadVisualNovel,
  restartVisualNovel, resumeVisualNovel, reviewVisualNovelScene,
} from '../../src/features/visual-novel/v2/visualNovelModel.ts'

const story: StoryVersion = {
  id: 'story-v1', storyId: 'story', versionNumber: 1, status: 'published', startSceneId: 'start',
  learningObjectiveIds: [], sourceIds: [], createdAt: '2026-10-01T00:00:00Z', publishedAt: '2026-10-01T00:00:00Z',
  scenes: [
    { id: 'start', kind: 'narration', title: 'Mở đầu', text: 'Bối cảnh', nextSceneId: 'dialogue', sourceIds: [], claimIds: [] },
    { id: 'dialogue', kind: 'dialogue', speaker: 'Nhân vật', line: 'Lời thoại', nextSceneId: 'media', sourceIds: [], claimIds: [] },
    { id: 'media', kind: 'media', mediaAssetId: 'image-1', caption: 'Tư liệu', nextSceneId: 'retry', sourceIds: [], claimIds: [] },
    { id: 'retry', kind: 'choice', prompt: 'Chọn đáp án', policy: 'retry_until_correct', sourceIds: [], claimIds: [], choices: [
      { id: 'wrong-retry', kind: 'knowledge_check', label: 'Sai', isCorrect: false, explanation: 'Thử lại', nextSceneId: 'debrief' },
      { id: 'right', kind: 'knowledge_check', label: 'Đúng', isCorrect: true, explanation: 'Chính xác', nextSceneId: 'debrief' },
    ] },
    { id: 'debrief', kind: 'debrief', summary: 'Tổng kết', nextSceneId: 'continue-choice', sourceIds: [], claimIds: [] },
    { id: 'continue-choice', kind: 'choice', prompt: 'Kiểm tra tiếp', policy: 'continue_after_feedback', sourceIds: [], claimIds: [], choices: [
      { id: 'wrong-continue', kind: 'knowledge_check', label: 'Chưa đúng', isCorrect: false, explanation: 'Đọc giải thích', nextSceneId: 'branch' },
    ] },
    { id: 'branch', kind: 'choice', prompt: 'Chọn góc nhìn', policy: 'continue_after_feedback', sourceIds: [], claimIds: [], choices: [
      { id: 'branch-a', kind: 'reflection', label: 'Góc nhìn A', response: 'Đã ghi nhận', nextSceneId: 'end-a' },
      { id: 'branch-b', kind: 'narrative', label: 'Góc nhìn B', nextSceneId: 'end-b' },
    ] },
    { id: 'end-a', kind: 'end', summary: 'Kết thúc A', sourceIds: [], claimIds: [] },
    { id: 'end-b', kind: 'end', summary: 'Kết thúc B', sourceIds: [], claimIds: [] },
  ],
}
const lesson: Lesson = {
  id: 'lesson-vn', chapterId: 'chapter', slug: 'vn', title: 'VN', summary: 'Fixture', format: 'visual_novel',
  estimatedMinutes: 8, learningObjectiveIds: [], prerequisites: [], status: 'published',
  blocks: [{ id: 'block-vn', kind: 'visual_novel', order: 0, required: true, storyVersionId: story.id }],
}
const context = { lessonId: lesson.id, blockId: 'block-vn', storyVersionId: story.id }
const createServices = (store = createMockProgressStore()) => createMockLearningServices(
  { chapters: [], lessons: [lesson], storyVersions: [story], mediaAssets: [] }, { userId: 'duong' },
  () => '2026-10-01T00:00:00Z', store,
)

test('M3-03 traverses all scene types and honors both knowledge policies and narrative branching', async () => {
  const services = createServices()
  let loaded = await loadVisualNovel(services, context)
  assert.equal(loaded.ok && loaded.value.currentSceneId, 'start')
  if (!loaded.ok) return
  let session = loaded.value
  for (const [operation, expected] of [['advance-1', 'dialogue'], ['advance-2', 'media'], ['advance-3', 'retry']] as const) {
    const result = await advanceVisualNovel(services, context, session, operation)
    assert.equal(result.ok && result.value.currentSceneId, expected)
    if (!result.ok) return
    session = result.value
  }

  const wrongRetry = await chooseVisualNovel(services, context, session, 'wrong-retry', 'wrong-retry-op')
  assert.equal(wrongRetry.ok && wrongRetry.value.feedback?.outcome, 'incorrect')
  assert.deepEqual(wrongRetry.ok && wrongRetry.value.lockedChoiceIds, [])
  if (!wrongRetry.ok) return
  const retry = continueChoiceFeedback(wrongRetry.value)
  assert.equal(retry.ok && retry.value.currentSceneId, 'retry')
  if (!retry.ok) return

  const right = await chooseVisualNovel(services, context, retry.value, 'right', 'right-op')
  if (!right.ok) return
  assert.equal(right.value.confirmedSceneId, 'debrief')
  const resumedDuringFeedback = resumeVisualNovel(restartVisualNovel(right.value))
  assert.equal(resumedDuringFeedback.currentSceneId, 'debrief')
  const debrief = continueChoiceFeedback(right.value)
  assert.equal(debrief.ok && debrief.value.currentSceneId, 'debrief')
  if (!debrief.ok) return
  const continued = await advanceVisualNovel(services, context, debrief.value, 'to-continue-choice')
  if (!continued.ok) return
  const wrongContinue = await chooseVisualNovel(services, context, continued.value, 'wrong-continue', 'wrong-continue-op')
  if (!wrongContinue.ok) return
  const branch = continueChoiceFeedback(wrongContinue.value)
  assert.equal(branch.ok && branch.value.currentSceneId, 'branch')
  if (!branch.ok) return
  const neutral = await chooseVisualNovel(services, context, branch.value, 'branch-a', 'branch-a-op')
  assert.equal(neutral.ok && neutral.value.feedback?.outcome, 'neutral')
  if (!neutral.ok) return
  const ended = continueChoiceFeedback(neutral.value)
  assert.equal(ended.ok && ended.value.currentSceneId, 'end-a')
})

test('M3-03 resumes exact confirmed scene and replay never rolls progress back', async () => {
  const store = createMockProgressStore()
  const services = createServices(store)
  const saved = await services.progress.saveEpisodeCheckpoint({
    ...context, operationId: 'seed', currentSceneId: 'debrief', visitedSceneIds: ['start', 'dialogue', 'media', 'retry'],
  })
  assert.equal(saved.ok, true)
  const loaded = await loadVisualNovel(createServices(store), context)
  assert.equal(loaded.ok && loaded.value.currentSceneId, 'debrief')
  if (!loaded.ok) return

  let replay = restartVisualNovel(loaded.value)
  assert.deepEqual([replay.currentSceneId, replay.confirmedSceneId, replay.replay], ['start', 'debrief', true])
  const advanced = await advanceVisualNovel(services, context, replay, 'replay-does-not-write')
  assert.equal(advanced.ok && advanced.value.currentSceneId, 'dialogue')
  const stored = await services.progress.getEpisodeProgress(story.id)
  assert.equal(stored.ok && stored.value?.currentSceneId, 'debrief')
  if (!advanced.ok) return
  replay = resumeVisualNovel(advanced.value)
  assert.deepEqual([replay.currentSceneId, replay.replay], ['debrief', false])

  assert.equal(reviewVisualNovelScene(replay, 'start').ok, true)
  assert.deepEqual(reviewVisualNovelScene(replay, 'end-b'), { ok: false, error: 'validation' })
})

test('M3-03 fails visibly for unavailable stories and invalid transitions', async () => {
  const services = createServices()
  assert.deepEqual(await loadVisualNovel(services, { ...context, storyVersionId: 'missing' }), { ok: false, error: 'not_found' })
  const loaded = await loadVisualNovel(services, context)
  if (!loaded.ok) return
  assert.deepEqual(await chooseVisualNovel(services, context, loaded.value, 'missing', 'invalid'), { ok: false, error: 'validation' })
  const endSession = { ...loaded.value, currentSceneId: 'end-a' }
  assert.deepEqual(await advanceVisualNovel(services, context, endSession, 'past-end'), { ok: false, error: 'validation' })
})
