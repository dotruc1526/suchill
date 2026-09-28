import { existsSync, lstatSync, readdirSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { join, relative, resolve } from 'node:path'
import { isPrivateTrackedEnvPath } from './private-env-path.mjs'

const root = resolve(import.meta.dirname, '../..')
const targets = ['src', 'scripts', 'docs', 'dist']
const bundlePresent = existsSync(join(root, 'dist'))
const textExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.html', '.css', '.json', '.md', '.yml', '.yaml', '.toml'])
const forbidden = [
  ['privileged env name', /(?:VITE_|NEXT_PUBLIC_)[A-Z0-9_]*(?:SERVICE_ROLE|SECRET|PRIVATE|GEMINI|OPENAI|SIGNING|WEBHOOK)[A-Z0-9_]*/i],
  ['Supabase secret key', /sb_secret_[A-Za-z0-9_-]{8,}/],
]
const inspected = new Set()
let checked = 0
let unsafeMatches = 0

function inspect(file) {
  if (!existsSync(file) || !lstatSync(file).isFile() || inspected.has(file)) return
  inspected.add(file)
  const content = readFileSync(file, 'utf8')
  checked++
  for (const [label, pattern] of forbidden) {
    pattern.lastIndex = 0
    if (pattern.test(content)) {
      // Never print matching text: the file might contain a real credential.
      process.stderr.write(`Unsafe ${label} in ${relative(root, file)}\n`)
      unsafeMatches++
    }
  }
  for (const token of content.matchAll(/eyJ[A-Za-z0-9_-]+\.(eyJ[A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+/g)) {
    try {
      const payload = JSON.parse(Buffer.from(token[1], 'base64url').toString('utf8'))
      if (payload.role === 'service_role') {
        process.stderr.write(`Unsafe service-role token in ${relative(root, file)}\n`)
        unsafeMatches++
      }
    } catch {
      // Non-JWT text is irrelevant to this check.
    }
  }
}

function walk(directory) {
  if (!existsSync(directory)) return
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) walk(file)
    else if (entry.isFile() && [...textExtensions].some(ext => entry.name.endsWith(ext))) inspect(file)
  }
}

for (const target of targets) walk(join(root, target))
for (const name of ['.env.example', 'index.html', 'vite.config.ts', 'package.json']) inspect(join(root, name))

const tracked = spawnSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' })
if (tracked.status !== 0) {
  process.stderr.write('Unable to verify Git-tracked files.\n')
  process.exitCode = 1
} else {
  for (const name of tracked.stdout.split('\0').filter(Boolean)) {
    if (isPrivateTrackedEnvPath(name)) {
      process.stderr.write(`Unsafe tracked private env file: ${name}\n`)
      unsafeMatches++
      continue // Never read private env values.
    }
    if (name === '.env.example' || [...textExtensions].some(ext => name.endsWith(ext))) inspect(join(root, name))
  }
}

const example = join(root, '.env.example')
if (!existsSync(example)) {
  process.stderr.write('Missing .env.example.\n')
  unsafeMatches++
} else {
  for (const line of readFileSync(example, 'utf8').split(/\r?\n/)) {
    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(line)
    if (!match) continue
    const [, name, value] = match
    if (!['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'].includes(name) ||
        !(value === '' || /^<[^>]+>$/.test(value) || /^your[_-]/i.test(value))) {
      process.stderr.write(`Unsafe example variable or value format: ${name}\n`)
      unsafeMatches++
    }
  }
}
if (process.argv.includes('--require-bundle') && !bundlePresent) {
  process.stderr.write('Production bundle is missing; run build before release check.\n')
}
process.stdout.write(`Checked ${checked} source/tracked${bundlePresent ? '/bundle' : ''} files; ${unsafeMatches} unsafe matches.\n`)
if (unsafeMatches || (process.argv.includes('--require-bundle') && !bundlePresent)) process.exitCode = 1
