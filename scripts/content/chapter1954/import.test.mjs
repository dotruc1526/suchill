import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createTestDatabase } from '../../../supabase/tests/harness.mjs'
import { candidateUuid } from './identity.mjs'
import { loadImportInputs, prepareImport, insertOrder } from './prepare-import.mjs'
import { dryRunImport } from './dry-run.mjs'

const inputs = await loadImportInputs(), plan = prepareImport(inputs)
const db = await createTestDatabase({ seed: false, dataDir: 'memory://' })
after(() => db.close())
const empty = async () => {
  for (const table of insertOrder) assert.equal((await db.query(`select count(*)::integer total from ${table}`)).rows[0].total, 0, table)
}

test('stable namespaced UUIDs and normalized pending rows preserve authored identities and private answers', () => {
  assert.deepEqual(prepareImport(inputs), plan)
  assert.match(candidateUuid('public.lessons', 'owned.lesson'), /^[a-f0-9]{8}-[a-f0-9]{4}-5[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)
  assert.notEqual(candidateUuid('public.lessons', 'owned.lesson'), candidateUuid('public.questions', 'owned.lesson'))
  assert.equal(plan.rows['public.lessons'].length, 7)
  assert.equal(plan.rows['public.learning_documents'].length, 14)
  assert.equal(plan.rows['public.questions'].length, 20)
  assert.equal(plan.rows['private.question_answer_keys'].length, 20)
  assert.equal(plan.rows['public.learning_objectives'].length, 7)
  assert.equal(plan.rows['public.media_assets'].length, 2)
  assert.ok(plan.rows['public.historical_claims'].every(row => row.kind === 'uncertain' && row.review_status === 'in_review'))
  assert.ok(plan.rows['public.questions'].every(row => !('correct_option_ids' in row) && !('explanation' in row)))
  assert.ok(plan.rows['public.scenes'].every(row => !('isCorrect' in row.payload) && !('choices' in row.payload)))
  assert.equal(plan.rows['public.historical_sources'].length, 18)
  assert.equal(plan.rows['public.media_sources'].length, 3)
  assert.equal(plan.mediaSourceBindings.length, 3)
  assert.equal(plan.mediaSourceBindings[0].equivalentSourceId, 'SRC-1954-VNMH-NAVARRE-2013')
  assert.ok(plan.pendingBindings.some(item => item.kind === 'scene_claim_review'))
  const reordered = structuredClone(inputs)
  reordered.candidate.lessons.reverse()
  assert.deepEqual(prepareImport(reordered).identities, plan.identities)
  const broken = structuredClone(inputs)
  broken.candidate.privateAnswerKeys[0].correctOptionId = 'missing-option'
  assert.throws(() => prepareImport(broken), /Invalid private answer/)
  const invalidAlias = structuredClone(inputs)
  invalidAlias.sources.sources.find(source => source.id === 'SRC-1954-VNMH-NAVARRE-2013').url = 'https://invalid.example/'
  assert.throws(() => prepareImport(invalidAlias), /alias evidence/)
})

test('real migrated PostgreSQL validates all rows, keeps drafts invisible and private keys denied, then rolls back repeatably', async () => {
  const result = await dryRunImport(db, plan, async tx => {
    assert.equal((await tx.query('select count(*)::integer total from public.lessons')).rows[0].total, 7)
    assert.equal((await tx.query('select count(*)::integer total from private.question_answer_keys')).rows[0].total, 20)
    for (const role of ['anon', 'authenticated']) {
      await tx.exec(`set local role ${role}`)
      assert.equal((await tx.query('select count(*)::integer total from public.lessons')).rows[0].total, 0)
      assert.equal((await tx.query('select count(*)::integer total from public.questions')).rows[0].total, 0)
      assert.equal((await tx.query('select count(*)::integer total from public.story_versions')).rows[0].total, 0)
      await tx.exec('savepoint private_key_probe')
      await assert.rejects(tx.query('select * from private.question_answer_keys'), /permission denied/i)
      await tx.exec('rollback to savepoint private_key_probe; release savepoint private_key_probe; set local role postgres')
    }
  })
  assert.equal(result.rollback, true)
  assert.equal(result.publicationAllowed, false)
  await empty()
  assert.deepEqual(await dryRunImport(db, plan), result)
  await empty()
})

test('schema failure or publication tampering rolls back the whole preparation without partial rows', async () => {
  const invalidReference = structuredClone(plan)
  invalidReference.rows['public.lesson_blocks'][0].document_id = candidateUuid('public.learning_documents', 'missing')
  await assert.rejects(dryRunImport(db, invalidReference), /foreign key/i)
  await empty()
  const publishing = structuredClone(plan)
  publishing.rows['public.chapters'][0].status = 'published'
  await assert.rejects(dryRunImport(db, publishing), /refuses accepted\/published/)
  await empty()
  const unsafe = structuredClone(plan)
  unsafe.rows['private.unclaimed_table'] = []
  await assert.rejects(dryRunImport(db, unsafe), /Unsafe import/)
  await empty()
  const incomplete = structuredClone(plan)
  incomplete.rows['public.lessons'] = []
  await assert.rejects(dryRunImport(db, incomplete), /Incomplete normalized/)
  await empty()
})
