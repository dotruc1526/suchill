import { readFile, readdir, stat } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../', import.meta.url))
const failures = []
async function files(dir) {
  const found = []
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, item.name)
    if (item.isDirectory()) found.push(...await files(path))
    else if (extname(path) === '.md') found.push(path)
  }
  return found
}
const markdown = await files(resolve(root, 'docs'))
const board = await readFile(resolve(root, 'docs/project/TASK-BOARD.md'), 'utf8')
let links = 0, cards = 0
for (const path of markdown) {
  const text = await readFile(path, 'utf8')
  for (const [, raw] of text.matchAll(/\]\(([^)]+)\)/g)) {
    const target = raw.replace(/^<|>$/g, '').split('#')[0]
    if (!target || /^[a-z][a-z\d+.-]*:/i.test(target) || !/^\.{1,2}\//.test(target)) continue
    links += 1
    try { await stat(resolve(dirname(path), decodeURIComponent(target))) }
    catch { failures.push(`${path}: missing ${target}`) }
  }
  const match = text.match(/^> Status:\s*(READY|IN PROGRESS|REVIEW|DONE|BLOCKED)\b/m)
  const id = text.match(/^# ([A-Z][A-Z\d-]*-\d+|M3-M5-DELIVERY)\s*[—–-]/)?.[1]
  if (!match || !id) continue
  cards += 1
  const folder = dirname(path).split(/[\\/]/).at(-1)
  const expected = match[1] === 'DONE' ? 'done' : match[1] === 'BLOCKED' ? 'blocked' : 'active'
  if (folder !== expected) failures.push(`${id}: ${match[1]} card is in ${folder}`)
  const rows = board.split(/\r?\n/).filter(line => line.startsWith(`| ${id} |`) &&
    line.split('|').some(cell => /^(READY|IN PROGRESS|REVIEW|DONE|BLOCKED)\b/.test(cell.trim().replaceAll('`', ''))))
  if (!rows.length && match[1] !== 'DONE') failures.push(`${id}: no board row`)
  else if (rows.some(row => !row.split('|').some(cell => cell.trim().replaceAll('`', '').startsWith(match[1])))) failures.push(`${id}: board/card status mismatch`)
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1 }
else console.log(`PASS: ${cards} task cards and ${links} local Markdown links across ${markdown.length} documents.`)
