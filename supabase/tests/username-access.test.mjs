import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDatabase, asRole, uuid } from './harness.mjs'

const migration = '20261002002800_deferred_username_enrollment.sql'
const insertUser = (db, id, email, app = {}, metadata = {}) => db.query(
  'insert into auth.users(id,email,raw_app_meta_data,raw_user_meta_data) values($1,$2,$3,$4)',
  [id, email, app, metadata],
)
const denied = work => assert.rejects(work, error => error.code === '42501')
const service = (db, sql, params = []) => asRole(db, 'service_role', null, tx => tx.query(sql, params))

test('username identities preserve Auth identity while keeping mapping and quotas server-only', async t => {
  const db = await createTestDatabase({ seed: false, throughMigration: migration })
  t.after(() => db.close())
  const alice = uuid(9201), bob = uuid(9202), existing = uuid(9203)
  await insertUser(db, alice, 'alice_test@accounts.suchill.invalid', { suchill_username: 'alice_test' })
  await insertUser(db, bob, 'bob_test@accounts.suchill.invalid', { suchill_username: 'bob_test' })
  await insertUser(db, existing, 'existing@example.test')

  await t.test('GoTrue insert then trusted metadata update enrolls only the final committed row', async () => {
    const actor = uuid(9250)
    await db.transaction(async tx => {
      await tx.query('insert into auth.users(id,email) values($1,$2)', [actor, 'gotrue_order@accounts.suchill.invalid'])
      await tx.query('update auth.users set raw_app_meta_data=$1 where id=$2', [{ suchill_username: 'gotrue_order' }, actor])
      assert.equal((await tx.query('select username from public.login_names where user_id=$1', [actor])).rows.length, 0)
    })
    assert.equal((await service(db, 'select username from public.login_names where user_id=$1', [actor])).rows[0].username,
      'gotrue_order')
  })

  await t.test('anon and A/B cannot enumerate identities, mutate mappings or consume trusted quota', async () => {
    for (const [role, actor] of [['anon', null], ['authenticated', alice], ['authenticated', bob]]) {
      for (const table of ['login_names', 'login_limits', 'recovery_email_requests']) {
        await denied(asRole(db, role, actor, tx => tx.query(`select * from public.${table}`)))
        await denied(asRole(db, role, actor, tx => tx.query(`delete from public.${table}`)))
      }
      await denied(asRole(db, role, actor, tx => tx.query('select public.username_identity($1)', ['alice_test'])))
      await denied(asRole(db, role, actor, tx => tx.query('select public.claim_login_name($1,$2)', ['stolen', bob])))
      await denied(asRole(db, role, actor, tx => tx.query('select public.take_login_quota($1,10,300)', ['login:fixture'])))
      await denied(asRole(db, role, actor, tx => tx.query('select public.consume_recovery_email($1,$2)', [alice, 'a'.repeat(64)])))
      await denied(asRole(db, role, actor, tx => tx.query('select public.finish_recovery_email($1,$2,true)', [alice, 'a'.repeat(64)])))
    }
    const rls = (await db.query(`select relname,relrowsecurity from pg_class where relname in ('login_names','login_limits')`)).rows
    assert.equal(rls.length, 2)
    assert.ok(rls.every(row => row.relrowsecurity))
  })

  await t.test('enrollment rejects public user metadata spoofing and rolls back account/profile creation', async () => {
    const attempts = [
      [uuid(9210), 'spoof@accounts.suchill.invalid', {}, { suchill_username: 'spoof' }],
      [uuid(9211), 'other@accounts.suchill.invalid', { suchill_username: 'spoof' }, {}],
      [uuid(9212), 'regular@example.test', { suchill_username: 'spoof' }, {}],
      [uuid(9213), 'x@accounts.suchill.invalid', { suchill_username: 'x' }, {}],
    ]
    for (const values of attempts) {
      await denied(insertUser(db, ...values))
      assert.equal((await db.query('select id from auth.users where id=$1', [values[0]])).rows.length, 0)
      assert.equal((await db.query('select id from public.profiles where id=$1', [values[0]])).rows.length, 0)
    }
    assert.deepEqual((await service(db, 'select username,user_id from public.login_names order by username')).rows,
      [{ username: 'alice_test', user_id: alice }, { username: 'bob_test', user_id: bob },
        { username: 'gotrue_order', user_id: uuid(9250) }])
  })

  await t.test('claiming an existing email account is idempotent and preserves its UUID/progress rows', async () => {
    const before = (await db.query('select * from public.profiles where id=$1', [existing])).rows
    const claim = () => service(db, 'select public.claim_login_name($1,$2) value', ['existing_user', existing])
    assert.equal((await claim()).rows[0].value, 'existing_user')
    assert.equal((await claim()).rows[0].value, 'existing_user')
    assert.deepEqual((await db.query('select * from public.profiles where id=$1', [existing])).rows, before)
    assert.equal((await service(db, 'select public.username_identity($1) value', ['existing_user'])).rows[0].value,
      'existing@example.test')
    await assert.rejects(service(db, 'select public.claim_login_name($1,$2)', ['different_name', existing]),
      error => error.code === 'PT409')
    await assert.rejects(service(db, 'select public.claim_login_name($1,$2)', ['existing_user', bob]),
      error => error.code === 'PT409')
  })

  await t.test('enrollment collision is atomic and cannot steal an existing email account alias', async () => {
    const duplicate = uuid(9214)
    await assert.rejects(insertUser(db, duplicate, 'existing_user@accounts.suchill.invalid',
      { suchill_username: 'existing_user' }), error => error.code === '23505')
    assert.equal((await db.query('select id from auth.users where id=$1', [duplicate])).rows.length, 0)
    assert.equal((await service(db, 'select user_id from public.login_names where username=$1', ['existing_user'])).rows[0].user_id,
      existing)
  })

  await t.test('identity lookup follows verified Auth email changes without changing username/UUID', async () => {
    // Auth verification itself is outside SQL harness; simulate only its persisted result.
    await db.query('update auth.users set email=$1 where id=$2', ['recovery@example.test', alice])
    assert.equal((await service(db, 'select public.username_identity($1) value', ['alice_test'])).rows[0].value,
      'recovery@example.test')
    assert.equal((await service(db, 'select user_id from public.login_names where username=$1', ['alice_test'])).rows[0].user_id,
      alice)
    assert.equal((await service(db, 'select public.username_identity($1) value', ['missing_user'])).rows[0].value, null)
  })

  await t.test('quota blocks only after the exact bound, expires and rejects malformed buckets', async () => {
    const consume = () => service(db, 'select public.take_login_quota($1,2,300) value', ['login:fixture-hash'])
    assert.equal((await consume()).rows[0].value, true)
    assert.equal((await consume()).rows[0].value, true)
    assert.equal((await consume()).rows[0].value, false)
    await service(db, "update public.login_limits set window_started=now()-interval '301 seconds' where bucket=$1", ['login:fixture-hash'])
    assert.equal((await consume()).rows[0].value, true)
    for (const [bucket, maximum, seconds] of [['email@example.test', 2, 300], ['valid', 0, 300], ['valid', 501, 300], ['valid', 2, 3601]]) {
      await assert.rejects(service(db, 'select public.take_login_quota($1,$2,$3)', [bucket, maximum, seconds]),
        error => error.code === '22023')
    }
    await service(db, "insert into public.login_limits values('expired',now()-interval '3 hours',1)")
    await consume()
    assert.equal((await service(db, "select bucket from public.login_limits where bucket='expired'")).rows.length, 0)
  })

  await t.test('recovery tokens are owner-bound, expire, cannot replay, and stale tokens lose to replacement', async () => {
    const insert = (actor, hash, expires = "now()+interval '20 minutes'") => service(db,
      `insert into public.recovery_email_requests(user_id,email,token_hash,expires_at) values($1,$2,$3,${expires})
        on conflict(user_id) do update set token_hash=excluded.token_hash,expires_at=excluded.expires_at`,
      [actor, 'optional@example.test', hash])
    const consume = async (actor, hash) => (await service(db,
      'select public.consume_recovery_email($1,$2) value', [actor, hash])).rows[0].value
    const first = 'a'.repeat(64), second = 'b'.repeat(64), expired = 'c'.repeat(64)
    await insert(bob, first)
    assert.equal(await consume(alice, first), null)
    assert.equal(await consume(bob, second), null)
    assert.equal((await service(db, 'select user_id from public.recovery_email_requests')).rows.length, 1)
    await insert(bob, second)
    assert.equal(await consume(bob, first), null)
    assert.equal(await consume(bob, second), 'optional@example.test')
    assert.equal(await consume(bob, second), null)
    assert.equal((await service(db, 'select processing from public.recovery_email_requests where user_id=$1', [bob])).rows[0].processing, true)
    // Another setup cannot replace the proof while its Auth update is outstanding.
    await assert.rejects(insert(bob, first), error => error.code === 'PT409')
    await assert.rejects(service(db, 'update public.recovery_email_requests set email=$1 where user_id=$2',
      ['other@example.test', bob]), error => error.code === 'PT409')
    await service(db, 'select public.finish_recovery_email($1,$2,true)', [alice, second])
    await service(db, 'select public.finish_recovery_email($1,$2,true)', [bob, first])
    assert.equal((await service(db, 'select processing from public.recovery_email_requests where user_id=$1', [bob])).rows[0].processing, true)
    // A definite Auth rejection releases the same request; an accepted update burns it.
    await service(db, 'select public.finish_recovery_email($1,$2,false)', [bob, second])
    assert.equal(await consume(bob, second), 'optional@example.test')
    await service(db, 'select public.finish_recovery_email($1,$2,true)', [bob, second])
    assert.equal(await consume(bob, second), null)
    await insert(bob, expired, "now()-interval '1 second'")
    assert.equal(await consume(bob, expired), null)
    assert.equal((await service(db, 'select token_hash from public.recovery_email_requests where user_id=$1', [bob])).rows[0].token_hash,
      expired)
  })
})
