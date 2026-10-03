import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { validateMediaPackage } from './media-package.mjs'

export async function main(args = process.argv.slice(2)) {
  if (args.length !== 2) {
    process.stderr.write('Usage: node scripts/release/validate-media-package.mjs PACKAGE_DIRECTORY LOCKED_NARRATION_JSON\n')
    return 2
  }
  const narration = args[1]
  try {
    const report = await validateMediaPackage(resolve(args[0]), resolve(narration))
    process.stdout.write(JSON.stringify(report, null, 2) + '\n')
    return report.passed ? 0 : 1
  } catch {
    process.stdout.write(JSON.stringify({ kind: 'technical_preview', passed: false, errors: [{ code: 'PACKAGE_UNAVAILABLE' }], publication: 'not_performed' }) + '\n')
    return 1
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = await main()
