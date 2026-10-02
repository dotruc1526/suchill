import { build } from 'vite'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'

// Mock browser regressions must not contact a configured developer backend.
const temporaryRoot = resolve(tmpdir())
const buildDirectory = await mkdtemp(join(temporaryRoot, 'suchill-fixture-e2e-'))
if (!resolve(buildDirectory).startsWith(temporaryRoot + sep)) throw new Error('Unsafe fixture build directory')
try {
  await build({
    envDir: false,
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(''),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(''),
    },
    build: { outDir: buildDirectory, emptyOutDir: true },
  })
  const child = spawn(process.execPath, ['--test', 'tests/qa/e2e.test.mjs', 'tests/qa/pwa-polish.test.mjs'], {
    stdio: 'inherit', env: { ...process.env, SUCHILL_QA_BUILD_DIR: buildDirectory },
  })
  process.exitCode = await new Promise((resolveExit, reject) => {
    child.once('error', reject)
    child.once('exit', (code, signal) => resolveExit(signal ? 1 : code ?? 1))
  })
} finally {
  await rm(buildDirectory, { recursive: true, force: true })
}
