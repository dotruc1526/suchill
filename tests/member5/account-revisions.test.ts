import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/backendMock.ts'
import { accountCatalog } from './account-fixtures.ts'
const now = () => '2026-10-02T07:00:00Z'

test('lesson revision rejects new stale operation IDs while checkpoint hints remain distinct from trusted block receipts', async () => {
  const catalog = accountCatalog()
  const lesson = catalog.lessons[0]
  lesson.blocks.push({ id: 'later', kind: 'recap', order: 1, required: true, documentId: 'recap' })
  const services = createMockLearningServices(catalog, { userId: 'a' }, now)
  const checkpoint = { lessonId: 'standard', currentBlockId: 'later', completedBlockIds: ['text', 'later'], operationId: 'latest', expectedRevision: 0 }
  const latest = await services.progress.saveCheckpoint(checkpoint)
  assert.equal(latest.ok && latest.value.revision, 1)
  assert.deepEqual(latest.ok && latest.value.confirmedCompletedBlockIds, [])
  assert.deepEqual(await services.progress.saveCheckpoint({ ...checkpoint, operationId: 'stale-new-id', currentBlockId: 'text' }), { ok: false, error: 'conflict' })
  const legacy = await services.progress.saveCheckpoint({ ...checkpoint, operationId: 'legacy', currentBlockId: 'text', expectedRevision: undefined })
  assert.equal(legacy.ok && legacy.value.currentBlockId, 'later')
  assert.equal(legacy.ok && legacy.value.revision, 2)
  await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'complete-text' })
  const trusted = await services.progress.getLessonProgress('standard')
  assert.deepEqual(trusted.ok && trusted.value?.confirmedCompletedBlockIds, ['text'])
  assert.equal(trusted.ok && trusted.value?.currentBlockId, 'later')
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'standard', operationId: 'premature' }), { ok: false, error: 'validation' })
  await services.completion.completeBlock({ lessonId: 'standard', blockId: 'later', operationId: 'complete-later' })
  await services.completion.completeLesson({ lessonId: 'standard', operationId: 'finish' })
  const completed = await services.progress.getLessonProgress('standard')
  await services.progress.saveCheckpoint({ lessonId: 'standard', currentBlockId: 'text', completedBlockIds: [], operationId: 'post-complete' })
  assert.deepEqual(await services.progress.getLessonProgress('standard'), completed)
})

test('story and video revisions reject stale writes; confirmed playback completion cannot rewind', async () => {
  const services = createMockLearningServices(accountCatalog(), { userId: 'a' }, now)
  const context = { lessonId: 'mixed', blockId: 'vn', storyVersionId: 'story.v1' }
  const first = await services.progress.saveEpisodeCheckpoint({ ...context, operationId: 'advance', currentSceneId: 'check', visitedSceneIds: ['start'], expectedRevision: 0 })
  assert.equal(first.ok && first.value.revision, 1)
  assert.deepEqual(await services.progress.recordChoice({ ...context, operationId: 'stale-choice', sceneId: 'check', choiceId: 'right', expectedRevision: 0 }), { ok: false, error: 'conflict' })
  const chosen = await services.progress.recordChoice({ ...context, operationId: 'choice', sceneId: 'check', choiceId: 'right', expectedRevision: 1 })
  assert.equal(chosen.ok && chosen.value.revision, 2)
  await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'vn', operationId: 'episode' })
  const completed = await services.progress.getEpisodeProgress('story.v1')
  assert.equal(completed.ok && completed.value?.revision, 3)
  assert.deepEqual(await services.progress.saveEpisodeCheckpoint({ ...context, operationId: 'rewind', currentSceneId: 'start', visitedSceneIds: [] }), { ok: false, error: 'conflict' })
  assert.deepEqual(await services.progress.getEpisodeProgress('story.v1'), completed)
  const video = { lessonId: 'mixed', blockId: 'video', positionSeconds: 90, watchedRanges: [{ start: 0, end: 90 }] }
  assert.equal((await services.progress.saveVideoPosition({ ...video, operationId: 'video', expectedRevision: 0 })).ok, true)
  assert.deepEqual(await services.progress.saveVideoPosition({ ...video, operationId: 'stale-video', positionSeconds: 10, expectedRevision: 0 }), { ok: false, error: 'conflict' })
  await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'video', operationId: 'video-complete' })
  const videoCompleted = await services.progress.getVideoProgress('mixed', 'video')
  await services.progress.saveVideoPosition({ ...video, operationId: 'post-video', positionSeconds: 0, watchedRanges: [] })
  assert.deepEqual(await services.progress.getVideoProgress('mixed', 'video'), videoCompleted)
})
