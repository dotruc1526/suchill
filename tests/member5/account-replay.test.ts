import test from 'node:test'
import assert from 'node:assert/strict'
import { createMockLearningServices } from '../../src/services/next/mock.ts'
import { createMockProgressStore } from '../../src/services/next/mockProgress.ts'
import { accountCatalog } from './account-fixtures.ts'

const now = () => '2026-10-02T07:00:00Z'
const context = { lessonId: 'mixed', blockId: 'vn', storyVersionId: 'story.v1' }
const advance = { ...context, operationId: 'advance', currentSceneId: 'check', visitedSceneIds: ['start'] }
const choice = (operationId: string, choiceId: string, replay = false, sceneId = 'check') => ({
  ...context, operationId, sceneId, choiceId, replay,
})
const authoritySnapshot = (store: ReturnType<typeof createMockProgressStore>) => structuredClone({
  episodes: [...store.episodes], lessons: [...store.lessons], attempts: [...store.accountStore.attempts],
  rewards: [...store.accountStore.rewards], streakDays: [...store.accountStore.streakDays],
  submittedChoices: [...store.operations].filter(([, operation]) => {
    const signature = JSON.parse(operation.signature)
    return signature[0] === 'choice' && signature[6] === false
  }),
})

test('unlocked failed knowledge attempts can be replayed after reload without revealing an unsubmitted answer', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: 'A' }
  const check = catalog.storyVersions[0].scenes.find(scene => scene.id === 'check')!
  if (check.kind !== 'choice') throw new Error('Fixture lacks a choice scene')
  check.policy = 'retry_until_correct'
  let services = createMockLearningServices(catalog, session, now, store)
  assert.deepEqual(await services.progress.recordChoice(choice('before-start', 'wrong', true)), { ok: false, error: 'validation' })
  assert.equal(store.episodes.size, 0)
  await services.progress.saveEpisodeCheckpoint(advance)
  const failed = await services.progress.recordChoice(choice('failed', 'wrong'))
  assert.equal(failed.ok && failed.value.choiceFeedback.outcome, 'incorrect')
  assert.deepEqual(failed.ok && failed.value.lockedChoiceIds, [])
  const before = authoritySnapshot(store)
  services = createMockLearningServices(catalog, session, now, store)
  const replay = await services.progress.recordChoice(choice('review-failed', 'wrong', true))
  assert.equal(replay.ok && replay.value.choiceFeedback.outcome, 'incorrect')
  assert.deepEqual(await services.progress.recordChoice(choice('review-failed', 'wrong', true)), replay)
  assert.deepEqual(await services.progress.recordChoice(choice('reveal-right', 'right', true)), { ok: false, error: 'validation' })
  assert.deepEqual(authoritySnapshot(store), before)
  const answer = await services.progress.recordChoice(choice('submit-right', 'right'))
  assert.equal(answer.ok && answer.value.currentSceneId, 'end')
})

test('knowledge replay access belongs to the original account, version, scene and submitted choice', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: 'A' }
  const services = createMockLearningServices(catalog, session, now, store)
  await services.progress.saveEpisodeCheckpoint(advance)
  await services.progress.recordChoice(choice('submit-right', 'right'))
  const before = authoritySnapshot(store)
  session.userId = 'B'
  assert.deepEqual(await services.progress.recordChoice(choice('review-A-choice', 'right', true)), { ok: false, error: 'validation' })
  assert.equal((await services.progress.getEpisodeProgress('story.v1')).ok, true)
  session.userId = 'A'
  assert.equal((await services.progress.recordChoice(choice('review-own-choice', 'right', true))).ok, true)
  assert.deepEqual(await services.progress.recordChoice({ ...choice('wrong-version', 'right', true), storyVersionId: 'other-version' }), { ok: false, error: 'not_found' })
  assert.deepEqual(authoritySnapshot(store), before)
})

test('narrative replay requires the locked choice until completion, then allows other branches without mutation', async () => {
  const catalog = accountCatalog(), store = createMockProgressStore(), session = { userId: 'A' }
  const story = catalog.storyVersions[0], check = story.scenes.find(scene => scene.id === 'check')!
  if (check.kind !== 'choice') throw new Error('Fixture lacks a choice scene')
  check.choices.forEach(item => { item.nextSceneId = 'branch' })
  story.scenes.push({ id: 'branch', kind: 'choice', prompt: 'Góc nhìn', policy: 'continue_after_feedback', sourceIds: [], claimIds: [], choices: [
    { id: 'branch-a', kind: 'narrative', label: 'A', nextSceneId: 'end' },
    { id: 'branch-b', kind: 'reflection', label: 'B', response: 'Ghi nhận', nextSceneId: 'end' },
  ] })
  const services = createMockLearningServices(catalog, session, now, store)
  await services.progress.saveEpisodeCheckpoint(advance)
  await services.progress.recordChoice(choice('submit-right', 'right'))
  assert.deepEqual(await services.progress.recordChoice(choice('early-branch', 'branch-a', true, 'branch')), { ok: false, error: 'validation' })
  await services.progress.recordChoice(choice('select-branch', 'branch-a', false, 'branch'))
  let before = authoritySnapshot(store)
  const replay = await services.progress.recordChoice(choice('review-selected', 'branch-a', true, 'branch'))
  assert.equal(replay.ok && replay.value.choiceFeedback.outcome, 'neutral')
  assert.deepEqual(await services.progress.recordChoice(choice('review-other', 'branch-b', true, 'branch')), { ok: false, error: 'validation' })
  assert.deepEqual(authoritySnapshot(store), before)
  await services.completion.completeBlock({ lessonId: 'mixed', blockId: 'vn', operationId: 'complete-vn' })
  before = authoritySnapshot(store)
  const completedReplay = await services.progress.recordChoice(choice('review-completed-other', 'branch-b', true, 'branch'))
  assert.equal(completedReplay.ok && completedReplay.value.choiceFeedback.message, 'Ghi nhận')
  assert.deepEqual(authoritySnapshot(store), before)
})
