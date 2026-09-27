import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = resolve(import.meta.dirname, '../..')
const tests = readdirSync(join(root, 'tests/member5'))
  .filter(name => name.endsWith('.test.ts'))
  .map(name => join(root, 'tests/member5', name))

for (const args of [
  ['scripts/member5/check-client-env.mjs'],
  ['--test', ...tests],
]) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}
