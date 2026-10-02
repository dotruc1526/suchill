import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

// Dashboard editor accepts a single source; keep deployment reproducible.
const root = new URL('../../', import.meta.url)
const files = ['transport.mjs', 'password.mjs', 'recovery.mjs', 'handler.mjs', 'index.ts']
const sources = await Promise.all(files.map(file => readFile(new URL(`supabase/functions/account-access/${file}`, root), 'utf8')))
const bundle = sources.map((source, i) => `// ${files[i]}\n${source.replace(/^import .* from ['"].*['"];?\r?\n/gm, '')}`).join('\n')
const directory = new URL('output/username-access/', root)
await mkdir(directory, { recursive: true })
await writeFile(new URL('index.ts', directory), bundle)
console.log(JSON.stringify({ path: 'output/username-access/index.ts', sha256: createHash('sha256').update(bundle).digest('hex'), files }))
