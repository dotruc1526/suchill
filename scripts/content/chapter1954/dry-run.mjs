import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { createTestDatabase } from '../../../supabase/tests/harness.mjs'
import { insertOrder, loadImportInputs, prepareImport } from './prepare-import.mjs'

class CompletedRollback extends Error {
  constructor(result) { super('Intentional isolated import rollback'); this.result = result }
}

/** Validate normalized rows with all applied migrations; the transaction always rolls back. */
export async function dryRunImport(db, plan, inspect = async () => {}) {
  if (plan.publicationAllowed !== false || Object.keys(plan.rows).some(table => !insertOrder.includes(table))) throw new Error('Unsafe import preparation')
  if (plan.rows['public.lessons']?.length !== 7 || plan.rows['public.learning_documents']?.length !== 14 ||
    plan.rows['public.questions']?.length !== 20) throw new Error('Incomplete normalized candidate')
  try {
    await db.transaction(async tx => {
      for (const table of insertOrder) for (const row of plan.rows[table] ?? []) {
        if (row.status && row.status !== 'in_review' || row.review_status && row.review_status !== 'in_review') throw new Error('Dry-run refuses accepted/published content')
        const columns = Object.keys(row)
        if (columns.some(column => !/^[a-z_]+$/.test(column))) throw new Error('Invalid column identifier')
        await tx.query(`insert into ${table} (${columns.join(',')}) values (${columns.map((_, index) => `$${index + 1}`).join(',')})`, columns.map(column => row[column]))
      }
      await tx.exec('set constraints all immediate')
      await inspect(tx)
      throw new CompletedRollback({ rollback: true, publicationAllowed: false,
        counts: Object.fromEntries(insertOrder.map(table => [table, plan.rows[table]?.length ?? 0])), pendingBindings: plan.pendingBindings,
        mediaSourceBindings: plan.mediaSourceBindings })
    })
  } catch (error) { if (error instanceof CompletedRollback) return error.result; throw error }
  throw new Error('Dry-run must never commit')
}

export async function runIsolatedDryRun() {
  // Force in-memory PGlite even if a native/remote PostgreSQL URL exists in the environment.
  const db = await createTestDatabase({ seed: false, dataDir: 'memory://' })
  try { return await dryRunImport(db, prepareImport(await loadImportInputs())) }
  finally { await db.close() }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const result = await runIsolatedDryRun()
  console.log(JSON.stringify({ rollback: result.rollback, publicationAllowed: result.publicationAllowed,
    counts: result.counts, pendingBindings: result.pendingBindings, mediaSourceBindings: result.mediaSourceBindings }, null, 2))
}
