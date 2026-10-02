import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import { accountCatalog, finishEpisode } from './account-fixtures.ts'
const now = () => '2026-10-02T07:00:00Z'

test('a nonterminal debrief cannot award episode completion before the remaining story checks/end', async () => {
  const catalog = accountCatalog()
  catalog.storyVersions[0].scenes.splice(0, 0, { id: 'debrief', kind: 'debrief', summary: 'Intermediate summary', nextSceneId: 'start', sourceIds: [], claimIds: [] })
  catalog.storyVersions[0].startSceneId = 'debrief'
  const services = createMockLearningServices(catalog, { userId: 'a' }, now)
  await services.progress.saveEpisodeCheckpoint({ lessonId: 'mixed', blockId: 'vn', storyVersionId: 'story.v1', operationId: 'debrief', currentSceneId: 'debrief', visitedSceneIds: [] })
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'vn', operationId: 'premature' }), { ok: false, error: 'validation' })
})

test('published corrections retain stable episode reward eligibility instead of farming a version reward', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: 'a' }
  const first = createMockLearningServices(catalog, session, now, store)
  await finishEpisode(first)
  await first.completion.completeBlock({ lessonId: 'mixed', blockId: 'vn', operationId: 'episode' })
  const corrected = structuredClone(catalog.storyVersions[0])
  corrected.id = 'story.v2'
  corrected.versionNumber = 2
  catalog.storyVersions.push(corrected)
  const lesson = { ...catalog.lessons[1], id: 'correction', blocks: [{ id: 'vn2', kind: 'visual_novel' as const, order: 0, required: true, storyVersionId: corrected.id }] }
  catalog.lessons.push(lesson)
  const second = createMockLearningServices(catalog, session, now, store)
  const context = { lessonId: 'correction', blockId: 'vn2', storyVersionId: corrected.id }
  await second.progress.saveEpisodeCheckpoint({ ...context, operationId: 'advance-v2', currentSceneId: 'check', visitedSceneIds: ['start'] })
  await second.progress.recordChoice({ ...context, operationId: 'choice-v2', sceneId: 'check', choiceId: 'right' })
  const receipt = await second.completion.completeBlock({ lessonId: 'correction', blockId: 'vn2', operationId: 'episode-v2' })
  assert.equal(receipt.ok && receipt.value.xpGranted, 0)
  const summary = await second.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 20)
})

test('completion rejects missing dependencies, missing content and unauthorized writes without rewards', async () => {
  const catalog = accountCatalog()
  catalog.lessons[0].prerequisites = ['assessment']
  const session = { userId: 'a' }
  const services = createMockLearningServices(catalog, session, now)
  await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'text' })
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'standard', operationId: 'lesson' }), { ok: false, error: 'validation' })
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'standard', blockId: 'missing', operationId: 'missing' }), { ok: false, error: 'not_found' })
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: ' ' }), { ok: false, error: 'validation' })
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'assessment', blockId: 'quiz', operationId: 'fallback', method: 'media_fallback' }), { ok: false, error: 'validation' })
  const summary = await services.account.getSummary()
  assert.equal(summary.ok && summary.value.totalXp, 0)
  session.userId = ''
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'standard', blockId: 'text', operationId: 'text' }), { ok: false, error: 'unauthorized' })
  assert.deepEqual(await services.completion.completeLesson({ lessonId: 'standard', operationId: 'lesson' }), { ok: false, error: 'unauthorized' })
})

test('video watch threshold counts union of ranges and optional policy does not block a lesson', async () => {
  const catalog = accountCatalog()
  catalog.lessons[1].blocks = [catalog.lessons[1].blocks[1]]
  const services = createMockLearningServices(catalog, { userId: 'a' }, now)
  await services.progress.saveVideoPosition({ lessonId: 'mixed', blockId: 'video', operationId: 'video1', positionSeconds: 90,
    watchedRanges: [{ start: 0, end: 60 }, { start: 30, end: 80 }] })
  assert.deepEqual(await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'video', operationId: 'complete' }), { ok: false, error: 'validation' })
  await services.progress.saveVideoPosition({ lessonId: 'mixed', blockId: 'video', operationId: 'video2', positionSeconds: 90, watchedRanges: [{ start: 80, end: 90 }] })
  assert.equal((await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'video', operationId: 'complete' })).ok, true)
  const optional = accountCatalog()
  const block = optional.lessons[1].blocks[1]
  if (block.kind !== 'video') throw new Error('fixture')
  block.completionPolicy = 'optional'
  optional.lessons[1].blocks = [block]
  const optionalServices = createMockLearningServices(optional, { userId: 'a' }, now)
  assert.equal((await optionalServices.completion.completeLesson({ lessonId: 'mixed', operationId: 'optional' })).ok, true)
})
