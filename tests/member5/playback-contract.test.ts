import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import { playbackCatalog } from './playback-fixtures.ts'

const now = () => '2026-09-29T00:00:00Z'
const episode = { lessonId: 'lesson', blockId: 'vn-block', storyVersionId: 'version-1', operationId: 'vn-1', currentSceneId: 'choice', visitedSceneIds: ['start'] }
const video = { lessonId: 'lesson', blockId: 'video-block', operationId: 'video-1', positionSeconds: 40, watchedRanges: [{ start: 0, end: 40 }] }

test('VN resumes ordered first block, then exact scene/version and locked choices across recreated adapters', async () => {
  const catalog = playbackCatalog(), store = createMockProgressStore(), session = { userId: 'a' }
  const { progress } = createMockLearningServices(catalog, session, now, store)
  assert.deepEqual(await progress.getResumePoint('lesson'), { ok: true, value: {
    kind: 'visual_novel', lessonId: 'lesson', blockId: 'vn-block', storyVersionId: 'version-1', progress: null, sceneId: 'start',
  } })
  const first = await progress.saveEpisodeCheckpoint(episode)
  assert.equal(first.ok, true)
  assert.deepEqual(await progress.saveEpisodeCheckpoint(episode), first)
  assert.deepEqual(await progress.saveEpisodeCheckpoint({ ...episode, currentSceneId: 'end' }), { ok: false, error: 'conflict' })
  const reloaded = createMockLearningServices(catalog, session, now, store).progress
  const resume = await reloaded.getResumePoint('lesson')
  assert.equal(resume.ok && resume.value.kind === 'visual_novel' && resume.value.sceneId, 'choice')
  const choice = { ...episode, operationId: 'choice-1', sceneId: 'choice', choiceId: 'choice-a' }
  const chosen = await reloaded.recordChoice(choice)
  assert.equal(chosen.ok, true)
  if (!chosen.ok) return
  assert.equal(chosen.value.currentSceneId, 'end')
  assert.deepEqual(chosen.value.lockedChoiceIds, ['choice-a'])
  assert.equal(chosen.value.status, 'in_progress')
  assert.deepEqual(await reloaded.recordChoice(choice), chosen)
  assert.deepEqual(await reloaded.recordChoice({ ...choice, operationId: 'choice-2', choiceId: 'choice-b' }), { ok: false, error: 'conflict' })
  chosen.value.lockedChoiceIds.length = 0
  const stored = await reloaded.getEpisodeProgress('version-1')
  assert.deepEqual(stored.ok && stored.value?.lockedChoiceIds, ['choice-a'])
  await reloaded.saveEpisodeCheckpoint(episode) // old retry must not roll back the current scene
  assert.equal((await reloaded.getResumePoint('lesson')).ok, true)
  const latest = await reloaded.getEpisodeProgress('version-1')
  assert.equal(latest.ok && latest.value?.currentSceneId, 'end')
})

test('video resumes position, merges unique watched ranges and never accepts client completion authority', async () => {
  const catalog = playbackCatalog(), store = createMockProgressStore(), session = { userId: 'a' }
  const progress = createMockLearningServices(catalog, session, now, store).progress
  const first = await progress.saveVideoPosition({ ...video, completed: true, userId: 'victim' } as typeof video)
  assert.equal(first.ok && first.value.userId, 'a')
  assert.equal(first.ok && first.value.completed, false)
  assert.deepEqual(await progress.saveVideoPosition(video), first)
  const next = await progress.saveVideoPosition({ ...video, operationId: 'video-2', positionSeconds: 100,
    watchedRanges: [{ start: 30, end: 60 }, { start: 50, end: 70 }, { start: 80, end: 90 }] })
  assert.deepEqual(next.ok && next.value.watchedRanges, [{ start: 0, end: 70 }, { start: 80, end: 90 }])
  assert.equal(next.ok && next.value.completed, false)
  const reloaded = createMockLearningServices(catalog, session, now, store).progress
  const resume = await reloaded.getResumePoint('lesson')
  assert.equal(resume.ok && resume.value.kind === 'video' && resume.value.positionSeconds, 100)
  assert.deepEqual(await reloaded.saveVideoPosition({ ...video, positionSeconds: 41 }), { ok: false, error: 'conflict' })
  await reloaded.saveVideoPosition(video)
  const current = await reloaded.getVideoProgress('lesson', 'video-block')
  assert.equal(current.ok && current.value?.positionSeconds, 100)
})

test('playback rejects wrong version/block/scene, invalid ranges and unauthenticated writes', async () => {
  const catalog = playbackCatalog(), session = { userId: 'a' }
  const progress = createMockLearningServices(catalog, session, now).progress
  for (const change of [{ storyVersionId: 'version-2' }, { blockId: 'video-block' }, { lessonId: 'missing' }]) {
    assert.deepEqual(await progress.saveEpisodeCheckpoint({ ...episode, ...change }), { ok: false, error: 'not_found' })
  }
  for (const change of [{ currentSceneId: 'missing' }, { visitedSceneIds: ['missing'] }]) {
    assert.deepEqual(await progress.saveEpisodeCheckpoint({ ...episode, ...change }), { ok: false, error: 'validation' })
  }
  for (const positionSeconds of [-1, 101, NaN, Infinity]) {
    assert.deepEqual(await progress.saveVideoPosition({ ...video, positionSeconds }), { ok: false, error: 'validation' })
  }
  for (const range of [{ start: -1, end: 10 }, { start: 10, end: 9 }, { start: 0, end: 101 }, { start: 0, end: NaN }]) {
    assert.deepEqual(await progress.saveVideoPosition({ ...video, watchedRanges: [range] }), { ok: false, error: 'validation' })
  }
  assert.deepEqual(await progress.saveVideoPosition({ ...video, blockId: 'vn-block' }), { ok: false, error: 'not_found' })
  assert.deepEqual(await progress.getEpisodeProgress('version-1'), { ok: true, value: null })
  assert.deepEqual(await progress.getVideoProgress('lesson', 'video-block'), { ok: true, value: null })
  session.userId = ''
  for (const result of [await progress.saveVideoPosition(video), await progress.saveEpisodeCheckpoint(episode),
    await progress.getResumePoint('lesson'), await progress.getEpisodeProgress('version-1'), await progress.getVideoProgress('lesson', 'video-block'),
    await progress.recordChoice({ ...episode, sceneId: 'choice', choiceId: 'choice-a' })]) {
    assert.deepEqual(result, { ok: false, error: 'unauthorized' })
  }
})

test('shared mock store isolates playback and operation IDs across accounts and preserves story versions', async () => {
  const catalog = playbackCatalog(), store = createMockProgressStore(), session = { userId: 'a' }
  const progress = createMockLearningServices(catalog, session, now, store).progress
  const savedA = await progress.saveEpisodeCheckpoint(episode)
  await progress.saveVideoPosition(video)
  session.userId = 'b'
  assert.deepEqual(await progress.getEpisodeProgress('version-1'), { ok: true, value: null })
  assert.deepEqual(await progress.getVideoProgress('lesson', 'video-block'), { ok: true, value: null })
  assert.equal((await progress.saveEpisodeCheckpoint(episode)).ok, true)
  const savedB = await progress.saveVideoPosition({ ...video, positionSeconds: 10, watchedRanges: [] })
  assert.equal(savedB.ok && savedB.value.userId, 'b')
  session.userId = 'a'
  assert.deepEqual(await progress.getEpisodeProgress('version-1'), savedA)
  assert.equal((await progress.getVideoProgress('lesson', 'video-block')).ok, true)
  assert.deepEqual(await progress.saveVideoPosition({ ...video, operationId: episode.operationId }), { ok: false, error: 'conflict' })
  catalog.storyVersions.push({ ...catalog.storyVersions[0], id: 'version-2', versionNumber: 2 })
  assert.deepEqual(await progress.getEpisodeProgress('version-2'), { ok: true, value: null })
  assert.deepEqual(await progress.saveEpisodeCheckpoint({ ...episode, operationId: 'v2', storyVersionId: 'version-2' }), { ok: false, error: 'not_found' })
})

test('retryable wrong knowledge choice does not lock out a later correct choice', async () => {
  const catalog = playbackCatalog()
  catalog.storyVersions[0].startSceneId = 'choice'
  const scene = catalog.storyVersions[0].scenes[1]
  if (scene.kind !== 'choice') throw new Error('fixture')
  scene.policy = 'retry_until_correct'
  scene.choices = [
    { id: 'wrong', kind: 'knowledge_check', label: 'Wrong', isCorrect: false, explanation: 'Try again', nextSceneId: 'end' },
    { id: 'right', kind: 'knowledge_check', label: 'Right', isCorrect: true, explanation: 'Correct', nextSceneId: 'end' },
  ]
  const progress = createMockLearningServices(catalog, { userId: 'a' }, now).progress
  const wrong = await progress.recordChoice({ ...episode, operationId: 'wrong', sceneId: 'choice', choiceId: 'wrong' })
  assert.deepEqual(wrong.ok && [wrong.value.currentSceneId, wrong.value.lockedChoiceIds], ['choice', []])
  const right = await progress.recordChoice({ ...episode, operationId: 'right', sceneId: 'choice', choiceId: 'right' })
  assert.deepEqual(right.ok && [right.value.currentSceneId, right.value.lockedChoiceIds], ['end', ['right']])
})
