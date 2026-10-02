import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createHostedContext, check, value, denied } from './context.mjs'
import { ids } from './ids.mjs'

let ctx
before(async () => { ctx = await createHostedContext() })
after(async () => { await ctx?.cleanup() })

test('actual anonymous PostgREST/domain delivery exposes published technical graph and withholds draft/keys', async () => {
  const services = ctx.services(ctx.anon)
  const chapters = value(await services.chapters.listPublished())
  const chapter = chapters.find(row => row.id === ids.chapter)
  assert.ok(chapter, 'Technical published chapter is discoverable')
  assert.equal(chapter.lessonRefs.length, 5)
  assert.ok(chapter.lessonRefs.every(row => row.id !== ids.draftLesson))
  assert.equal(value(await services.lessons.getById(ids.lesson)).blocks[0].documentId, ids.document)
  assert.equal(value(await services.documents.getById(ids.document)).sections[0].kind, 'paragraph')
  const story = value(await services.stories.getVersion(ids.version))
  assert.equal(story.scenes.length, 3)
  for (const choice of story.scenes.flatMap(scene => scene.choices ?? [])) {
    assert.equal('isCorrect' in choice, false)
    assert.equal('explanation' in choice, false)
  }
  const quiz = value(await services.quiz.getQuestionSet(ids.quiz))
  assert.equal(quiz.questions.length, 3)
  assert.equal(quiz.dailyReviewEligible, false)
  assert.equal(value(await services.quiz.getQuestionSet(ids.practice)).dailyReviewEligible, true)
  for (const question of quiz.questions) {
    assert.equal('explanation' in question, false)
    assert.ok(question.options.every(option => !('isCorrect' in option)))
  }
  for (const [service, id] of [[services.chapters, ids.draftChapter], [services.lessons, ids.draftLesson],
    [services.documents, ids.draftDocument]]) {
    assert.deepEqual(await service.getById(id), { ok: false, error: 'not_found' })
  }
  assert.deepEqual(await services.media.getResolvedAsset(ids.draftMedia), { ok: false, error: 'not_found' })
  assert.deepEqual(await services.lessons.getById('malformed-id'), { ok: false, error: 'validation' })
  for (const client of [ctx.anon, ctx.a.client, ctx.b.client]) {
    for (const [table, id] of [['chapters', ids.draftChapter], ['lessons', ids.draftLesson],
      ['learning_documents', ids.draftDocument], ['media_assets', ids.draftMedia]]) {
      const rows = await client.from(table).select('id').eq('id', id)
      check(rows.error, 'RLS filtered draft query')
      assert.equal(rows.data.length, 0, 'Draft rows must stay invisible over real REST')
    }
    denied(await client.schema('private').from('question_answer_keys').select('question_id'), 'Private question keys')
    denied(await client.schema('private').from('scene_answer_keys').select('choice_id'), 'Private VN keys')
    denied(await client.rpc('grant_reward', {}), 'Private reward helper over public RPC')
    denied(await client.schema('private').rpc('grant_reward', { p_user: ctx.a.id, p_kind: 'lesson', p_activity: ids.lesson,
      p_version: '1', p_xp: 999 }), 'Private-schema reward helper transport')
  }
})

test('real A/B JWTs enforce owner reads and reject all direct write authorities', async () => {
  const ownA = value(await ctx.a.services.users.getCurrentProfile())
  const ownB = value(await ctx.b.services.users.getCurrentProfile())
  assert.equal(ownA.id, ctx.a.id)
  assert.equal(ownB.id, ctx.b.id)
  assert.equal(value(await ctx.a.services.account.getSummary()).totalXp, 0)
  assert.equal(value(await ctx.b.services.account.getSummary()).totalXp, 0)
  const cmd = { lessonId: ids.lesson, blockId: ids.textBlock, operationId: 'rest-rls-text' }
  value(await ctx.a.services.completion.completeBlock(cmd))
  const tables = ['user_settings', 'user_lesson_progress', 'user_block_completions', 'user_episode_progress',
    'user_scene_visits', 'user_choice_selections', 'user_video_progress', 'learning_attempts', 'user_quiz_mastery',
    'activity_completions', 'reward_ledger', 'streak_days', 'user_streaks', 'analytics_events']
  for (const table of tables) {
    const rows = await ctx.b.client.from(table).select('*').eq('user_id', ctx.a.id)
    check(rows.error, 'Cross-user read filter')
    assert.equal(rows.data.length, 0, 'B must not observe any A-owned row')
    const anonRows = await ctx.anon.from(table).select('*')
    check(anonRows.error, 'Anonymous read filter')
    assert.equal(anonRows.data.length, 0, 'Anon must not observe user data')
  }
  const otherProfile = await ctx.b.client.from('profiles').select('id').eq('id', ctx.a.id)
  check(otherProfile.error, 'Cross-user profile filter')
  assert.equal(otherProfile.data.length, 0)
  const reverseProfile = await ctx.a.client.from('profiles').select('id').eq('id', ctx.b.id)
  check(reverseProfile.error, 'Reverse cross-user profile filter')
  assert.equal(reverseProfile.data.length, 0)
  for (const table of tables) {
    const reverse = await ctx.a.client.from(table).select('*').eq('user_id', ctx.b.id)
    check(reverse.error, 'Reverse cross-user read filter')
    assert.equal(reverse.data.length, 0, 'A must not observe B-owned rows')
  }
  denied(await ctx.b.client.from('profiles').update({ display_name: 'spoof' }).eq('id', ctx.a.id), 'Other-user profile update')
  denied(await ctx.a.client.from('user_lesson_progress').insert({ user_id: ctx.a.id, lesson_id: ids.videoLesson,
    status: 'completed', current_block_id: ids.videoBlock }), 'Direct completion progress insert')
  denied(await ctx.a.client.from('reward_ledger').insert({ user_id: ctx.a.id, reward_type: 'lesson', activity_id: ids.lesson,
    eligibility_version: '1', xp_delta: 999, idempotency_key: 'hosted-forged' }), 'Direct reward minting')
  denied(await ctx.a.client.from('user_streaks').update({ current_streak: 999, longest_streak: 999 }).eq('user_id', ctx.a.id), 'Direct streak manipulation')
  denied(await ctx.a.client.from('lessons').update({ status: 'published' }).eq('id', ids.draftLesson), 'Client draft publication')
  const spoof = await ctx.a.client.rpc('learning_command', { p_kind: 'complete_block',
    p_input: { ...cmd, operationId: 'identity-spoof', userId: ctx.b.id } })
  assert.equal(spoof.error?.code, '22023', 'Input cannot override JWT ownership')
  assert.deepEqual(await ctx.b.services.completion.completeBlock({ ...cmd, operationId: 'expected-subject-A', expectedSubject: ctx.a.id }),
    { ok: false, error: 'unauthorized' })
  assert.equal(value(await ctx.b.services.progress.getLessonProgress(ids.lesson)), null)
  assert.deepEqual(await ctx.services(ctx.anon).completion.completeBlock({ ...cmd, operationId: 'anonymous-write' }),
    { ok: false, error: 'unauthorized' })
})

test('hosted SDK checkpoint returns camelCase, persists cursor and rejects stale revisions without poisoning retries', async () => {
  const input = { lessonId: ids.videoLesson, currentBlockId: ids.videoBlock, completedBlockIds: [],
    operationId: 'checkpoint-v1', expectedRevision: 0 }
  const first = value(await ctx.a.services.progress.saveCheckpoint(input))
  assert.equal(first.lessonId, ids.videoLesson)
  assert.equal(first.currentBlockId, ids.videoBlock)
  assert.equal(first.revision, 1)
  assert.equal('user_id' in first, false)
  assert.deepEqual(value(await ctx.a.services.progress.saveCheckpoint(input)), first)
  const started = Date.now()
  const rawConflict = await ctx.a.client.rpc('learning_command', { p_kind: 'save_lesson_checkpoint',
    p_input: { ...input, operationId: 'checkpoint-http-conflict' } }).retry(false).abortSignal(AbortSignal.timeout(20_000))
  assert.equal(rawConflict.status, 409, 'Business revision conflict must return HTTP409 instead of looping')
  assert.equal(rawConflict.error?.code, 'PT409')
  assert.ok(Date.now() - started < 20_000, 'Conflict HTTP response must be bounded and immediate')
  assert.deepEqual(await ctx.a.services.progress.saveCheckpoint({ ...input, operationId: 'checkpoint-stale' }),
    { ok: false, error: 'conflict' })
  const second = value(await ctx.a.services.progress.saveCheckpoint({ ...input, operationId: 'checkpoint-fresh', expectedRevision: first.revision }))
  assert.equal(second.revision, 2)
  assert.equal(value(await ctx.a.services.progress.getResumePoint(ids.videoLesson)).blockId, ids.videoBlock)
  assert.equal(value(await ctx.a.services.progress.getLessonProgress(ids.videoLesson)).revision, 2)
  assert.equal(value(await ctx.b.services.progress.getLessonProgress(ids.videoLesson)), null)
})
