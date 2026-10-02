import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createTestDatabase, command, read, asRole, ids, quizAnswers } from './harness.mjs'

const canonical = (db, input, actor = ids.userA) => asRole(db, actor ? 'authenticated' : 'anon', actor, async tx =>
 (await tx.query('select public.learning_m3_complete($1::jsonb) value', [JSON.stringify(input)])).rows[0].value)
const input = (operationId, lessonId = ids.lesson, expectedSubject = ids.userA) => ({ lessonId, operationId, expectedSubject })
const names = async db => (await db.query('select event_name from public.analytics_events order by id')).rows.map(row => row.event_name)
const occurrences = (events, name) => events.filter(event => event === name).length
async function database(t, options) {
 const db = await createTestDatabase(options)
 t.after(() => db.close())
 return db
}
const optIn = db => command(db, 'update_settings', { analyticsEnabled: true, operationId: 'analytics-consent' })
const acknowledge = db => command(db, 'complete_block', { lessonId: ids.lesson, blockId: ids.textBlock, operationId: 'text-ack' })

test('030 upgrades applied029 without changing public identity, existing receipts or private access', async t => {
 const db = await database(t, { throughMigration: '20261002002900_main_completion_contract.sql' })
 await optIn(db); await acknowledge(db)
 const original = await canonical(db, input('before030'))
 const catalog = () => db.query("select oid,proowner,proacl,prosecdef,proconfig from pg_proc where oid='public.learning_m3_complete(jsonb)'::regprocedure")
 const before = (await catalog()).rows[0], originalEvents = await names(db)
 await db.exec(await readFile(new URL('../migrations/20261002003000_main_completion_analytics.sql', import.meta.url), 'utf8'))
 assert.deepEqual((await catalog()).rows[0], before)
 assert.deepEqual(await canonical(db, input('before030')), original)
 assert.equal((await canonical(db, input('new-after030'))).kind, 'already_completed')
 assert.deepEqual(await names(db), originalEvents, 'upgrade/replay must not backfill optional telemetry')
 for (const role of ['anon', 'authenticated']) {
  const allowed = (await db.query("select has_function_privilege($1,'private.m3_complete_before_analytics(jsonb)','execute') allowed", [role])).rows[0].allowed
  assert.equal(allowed, false)
 }
 await assert.rejects(canonical(db, input('anonymous'), null), error => error.code === '42501')
 await assert.rejects(canonical(db, input('cross-user'), ids.userB), error => error.code === '42501')
})

test('canonical first completion emits trusted minimal events once; ineligible and replay emit none', async t => {
 const db = await database(t)
 await optIn(db)
 assert.equal((await canonical(db, input('finish-text'))).kind, 'ineligible')
 assert.deepEqual(await names(db), [])
 await acknowledge(db)
 const result = await canonical(db, input('finish-text'))
 assert.equal(result.kind, 'completed'); assert.equal(result.receipt.rewards[0].xpDelta, 10)
 const events = await names(db)
 for (const name of ['block_completed', 'lesson_completed', 'reward_granted', 'streak_qualified']) assert.equal(occurrences(events, name), 1)
 const properties = (await db.query("select event_name,properties from public.analytics_events where event_name in ('reward_granted','streak_qualified')")).rows
 assert.deepEqual(properties.find(row => row.event_name === 'reward_granted').properties, { reward_type: 'lesson', xp_delta: 10 })
 assert.ok(properties.find(row => row.event_name === 'streak_qualified').properties.local_date)
 assert.deepEqual(await canonical(db, input('finish-text')), result)
 assert.equal((await canonical(db, input('fresh-replay'))).kind, 'already_completed')
 assert.deepEqual(await names(db), events)
 await assert.rejects(command(db, 'track', { name: 'reward_granted', properties: { xp_delta: 999 }, operationId: 'spoof-reward' }), error => error.code === '22023')
 await assert.rejects(command(db, 'track', { name: 'streak_qualified', properties: { current_streak: 999 }, operationId: 'spoof-streak' }), error => error.code === '22023')
})

test('canonical VN confirms its implicit block and episode reward without leaking answer/private text', async t => {
 const db = await database(t)
 await optIn(db)
 const context = { lessonId: ids.vnLesson, blockId: ids.vnBlock, storyVersionId: ids.version }
 await command(db, 'save_episode_checkpoint', { ...context, currentSceneId: ids.start, visitedSceneIds: [], operationId: 'start-vn' })
 await command(db, 'save_episode_checkpoint', { ...context, currentSceneId: ids.check, visitedSceneIds: [ids.start], operationId: 'advance-vn' })
 await command(db, 'record_choice', { ...context, sceneId: ids.check, choiceId: ids.correct, operationId: 'answer-vn' })
 const result = await canonical(db, input('finish-vn', ids.vnLesson))
 assert.equal(result.kind, 'completed'); assert.equal(result.receipt.rewards[0].xpDelta, 20)
 const events = await names(db)
 for (const name of ['block_completed', 'lesson_completed', 'reward_granted', 'streak_qualified']) assert.equal(occurrences(events, name), 1)
 const block = (await db.query("select properties from public.analytics_events where event_name='block_completed'")).rows[0].properties
 assert.deepEqual(block, { lesson_id: ids.vnLesson, block_id: ids.vnBlock, kind: 'visual_novel' })
 const all = JSON.stringify((await db.query('select properties from public.analytics_events')).rows)
 assert.doesNotMatch(all, /isCorrect|explanation|access_token|password|email|dialogue/)
 assert.deepEqual(await canonical(db, input('finish-vn', ids.vnLesson)), result)
 assert.deepEqual(await names(db), events)
})

test('canonical scored completion records block/lesson events without duplicating already-granted quiz telemetry', async t => {
 const db = await database(t)
 await optIn(db)
 await command(db, 'submit_scored', { questionSetId: ids.quiz, answers: quizAnswers(), operationId: 'grade-quiz' })
 const before = await names(db)
 assert.equal(occurrences(before, 'reward_granted'), 2)
 assert.equal(occurrences(before, 'streak_qualified'), 1)
 const result = await canonical(db, input('finish-quiz', ids.quizLesson))
 assert.equal(result.kind, 'completed')
 const events = await names(db)
 assert.equal(occurrences(events, 'block_completed'), 1); assert.equal(occurrences(events, 'lesson_completed'), 1)
 assert.equal(occurrences(events, 'reward_granted'), 2); assert.equal(occurrences(events, 'streak_qualified'), 1)
 assert.equal((await read(db, 'account')).totalXp, 25)
 assert.deepEqual(await canonical(db, input('finish-quiz', ids.quizLesson)), result)
 assert.deepEqual(await names(db), events)
})

test('canonical analytics remains opt-in and enabling consent does not backfill completion events', async t => {
 const db = await database(t)
 await acknowledge(db)
 const result = await canonical(db, input('opt-out-finish'))
 assert.equal(result.kind, 'completed'); assert.deepEqual(await names(db), [])
 await optIn(db)
 assert.deepEqual(await canonical(db, input('opt-out-finish')), result)
 assert.equal((await canonical(db, input('after-opt-in-replay'))).kind, 'already_completed')
 assert.deepEqual(await names(db), [])
})

test('canonical analytics INSERT failure cannot reverse reward/progress or poison immutable replay', async t => {
 const db = await database(t)
 await optIn(db); await acknowledge(db)
 const before = await names(db)
 await db.exec("create function private.fail_canonical_analytics() returns trigger language plpgsql as $$ begin raise exception 'Synthetic optional telemetry failure'; end $$; create trigger fail_canonical_analytics before insert on public.analytics_events for each row execute function private.fail_canonical_analytics()")
 const result = await canonical(db, input('telemetry-failure'))
 assert.equal(result.kind, 'completed'); assert.equal(result.receipt.rewards[0].xpDelta, 10)
 assert.equal((await read(db, 'lesson_progress', ids.lesson)).status, 'completed')
 assert.equal((await read(db, 'account')).totalXp, 10); assert.deepEqual(await names(db), before)
 await db.exec('drop trigger fail_canonical_analytics on public.analytics_events')
 assert.deepEqual(await canonical(db, input('telemetry-failure')), result)
 assert.equal((await canonical(db, input('telemetry-failure-replay'))).kind, 'already_completed')
 assert.deepEqual(await names(db), before, 'best-effort failure must not later backfill/duplicate events')
})

test('native canonical completion contenders serialize trusted telemetry once under the owner lock', {
 skip: process.env.SUCHILL_NATIVE_PG_URL ? false : 'Requires dedicated loopback PostgreSQL17 cluster',
}, async t => {
 const db = await database(t)
 assert.ok(db.native)
 await optIn(db); await acknowledge(db)
 const blocker = await db.connect(), jobs = 8
 let pending
 try {
  await blocker.query('begin'); await blocker.query('select id from public.profiles where id=$1 for update', [ids.userA])
  pending = Array.from({ length: jobs }, () => canonical(db, input('native-analytics-race')))
  let blocked = []
  const deadline = Date.now() + 5000
  while (Date.now() < deadline) {
   blocked = (await db.query("select pid from pg_stat_activity where datname=current_database() and application_name='suchill-native-review' and wait_event_type='Lock' and query like '%learning_m3_complete%' ")).rows
   if (blocked.length >= jobs) break
   await new Promise(resolve => setTimeout(resolve, 25))
  }
  assert.equal(new Set(blocked.map(row => row.pid)).size, jobs)
 } finally { await blocker.query('commit'); blocker.release() }
 const results = await Promise.all(pending)
 results.forEach(result => assert.deepEqual(result, results[0]))
 const events = await names(db)
 for (const name of ['block_completed', 'lesson_completed', 'reward_granted', 'streak_qualified']) assert.equal(occurrences(events, name), 1)
 const again = await Promise.all(Array.from({ length: jobs }, (_, index) => canonical(db, input(`native-new-${index}`))))
 assert.ok(again.every(result => result.kind === 'already_completed'))
 assert.deepEqual(await names(db), events); assert.equal((await read(db, 'account')).totalXp, 10)
})
