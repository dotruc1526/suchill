import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { fileHash } from './media-package.mjs'

export const requiredChecks = [
  'm6_software_review', 'physical_android', 'physical_ios', 'manual_accessibility',
  'historical_learning_review', 'media_rights_review', 'canonical_import',
  'quality_security', 'privacy_contact_retention', 'firebase_preview',
  'internal_user_testing', 'rollback', 'product_owner_release',
]
const validDate = value => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false
  const parsed = new Date(value + 'T00:00:00Z')
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === value
}
export function evaluateEvidence(evidence, actualManifestHash, manifest) {
  const missing = [], accepted = []
  if (manifest?.reviewStatus !== 'approved' || manifest?.publicationScope !== 'canonical') missing.push('canonical approved media manifest')
  const commit = evidence?.build?.commit
  if (typeof commit !== 'string' || !/^[a-f0-9]{40}$/iu.test(commit)) missing.push('build.commit')
  if (typeof evidence?.build?.version !== 'string' || !evidence.build.version.trim()) missing.push('build.version')
  if (typeof actualManifestHash !== 'string' || !/^[a-f0-9]{64}$/iu.test(actualManifestHash)) missing.push('actual media manifest hash')
  if (evidence?.mediaManifestSha256 !== actualManifestHash) missing.push('mediaManifestSha256 binding')
  for (const name of requiredChecks) {
    const check = evidence?.checks?.[name]
    if (check?.status !== 'passed' || typeof check.reviewer !== 'string' || !check.reviewer.trim() ||
        typeof check.evidence !== 'string' || !check.evidence.trim() ||
        !validDate(check.date) ||
        check.commit !== commit || check.mediaManifestSha256 !== actualManifestHash) missing.push(name)
    else accepted.push(name)
  }
  return { kind: 'supplied_release_evidence', complete: missing.length === 0, missing, accepted,
    limitations: ['Checks validate supplied declarations and revision bindings; they do not authenticate reviewer identities, test devices or deploy a release.'],
    publication: 'not_performed' }
}
export async function main(args = process.argv.slice(2)) {
  if (args.length !== 2) {
    process.stderr.write('Usage: node scripts/release/check-release-readiness.mjs EVIDENCE_JSON MEDIA_MANIFEST_JSON\n')
    return 2
  }
  try {
    const evidence = JSON.parse(await readFile(args[0], 'utf8'))
    const manifest = JSON.parse(await readFile(args[1], 'utf8'))
    const report = evaluateEvidence(evidence, await fileHash(args[1]), manifest)
    process.stdout.write(JSON.stringify(report, null, 2) + '\n')
    return report.complete ? 0 : 1
  } catch {
    process.stdout.write(JSON.stringify({ kind: 'supplied_release_evidence', complete: false, missing: ['Readable evidence and media manifest required'], publication: 'not_performed' }) + '\n')
    return 1
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main()
