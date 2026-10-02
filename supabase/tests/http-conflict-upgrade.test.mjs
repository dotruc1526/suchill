import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createTestDatabase, command, read, ids } from './harness.mjs'

test('025 to 026 preserves authority and receipts while business conflicts become final HTTP409', async t => {
  const db = await createTestDatabase({ throughMigration: '20261002002500_daily_attempt_receipts.sql' })
  t.after(() => db.close())
  const catalog = () => db.query(`select p.oid,p.proowner,p.proacl,p.prosecdef,p.proconfig,
    p.proname,p.prosrc from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where (n.nspname='public' and p.proname='learning_command') or
      (n.nspname='private' and p.proname in ('touch_lesson','save_episode_checkpoint',
        'record_choice','save_video_position','update_settings','complete_daily_review')) order by p.oid`)
  const initial = (await catalog()).rows
  assert.equal(initial.length, 7)
  assert.ok(initial.every(fn => fn.prosrc.includes("errcode='40001'")))
  const checkpoint = { lessonId: ids.lesson, currentBlockId: ids.textBlock,
    completedBlockIds: [], expectedRevision: 0, operationId: 'http-upgrade-checkpoint' }
  const receipt = await command(db, 'save_lesson_checkpoint', checkpoint)
  const migration = await readFile(new URL('../migrations/20261002002600_http_business_conflicts.sql', import.meta.url), 'utf8')
  await db.exec(migration)
  const revised = (await catalog()).rows
  const authority = ({ prosrc, ...metadata }) => metadata
  assert.deepEqual(revised.map(authority), initial.map(authority))
  assert.ok(revised.every(fn => !fn.prosrc.includes("errcode='40001'") && fn.prosrc.includes("errcode='PT409'")))
  const before = await read(db, 'lesson_progress', ids.lesson)
  await assert.rejects(command(db, 'save_lesson_checkpoint', { ...checkpoint, operationId: 'http-stale' }), e => e.code === 'PT409')
  await assert.rejects(command(db, 'save_lesson_checkpoint', { ...checkpoint, expectedRevision: 1 }), e => e.code === 'PT409')
  assert.deepEqual(await read(db, 'lesson_progress', ids.lesson), before)
  assert.deepEqual(await command(db, 'save_lesson_checkpoint', checkpoint), receipt)
  assert.equal((await read(db, 'account')).totalXp, 0)
  assert.deepEqual((await db.query(`select p.proname from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='private' and has_function_privilege('authenticated',p.oid,'EXECUTE')`)).rows, [])
  // Replay is safe after deployment; identity, ACLs and authority stay unchanged.
  await db.exec(migration)
  assert.deepEqual((await catalog()).rows, revised)
})
