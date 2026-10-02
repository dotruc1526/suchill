import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
const root = new URL('../../', import.meta.url)
const source = await readFile(new URL('supabase/migrations/20261002002800_deferred_username_enrollment.sql', root), 'utf8')
const body = source.replace(/^begin;\r?\n/m, '').replace(/commit;\s*$/, '')
const sql = `-- suchill-test: apply once after migration027. No account data is deleted.\nbegin;\n${body}\n` +
  `insert into supabase_migrations.schema_migrations(version,statements,name) values('20261002002800',array[$migration28$${source}$migration28$],'deferred_username_enrollment');\ncommit;\n` +
  `select version,name from supabase_migrations.schema_migrations where version='20261002002800';\n`
const directory = new URL('output/username-access/', root)
await mkdir(directory, { recursive: true })
await writeFile(new URL('apply-028.sql', directory), sql)
console.log(JSON.stringify({ path: 'output/username-access/apply-028.sql', sha256: createHash('sha256').update(source).digest('hex') }))
