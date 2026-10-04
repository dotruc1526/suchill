import { build } from 'vite'
import { createHash } from 'node:crypto'
import { lstat, mkdir, readFile, realpath, readdir, writeFile } from 'node:fs/promises'
import { resolve, relative, sep } from 'node:path'
import { pathToFileURL } from 'node:url'
import { resolveGameServerUrl } from '../../src/services/gameServerConfig.ts'

export const videoHash = '2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec'
const manifestHash = 'd1bfd0bd021df6bd52a00eb6bac5dbe3c7dbe814a13a0e1edd7d485c23647474'
export const mediaNames = ['pilot-mobile.mp4', 'poster.png', 'captions.vi.vtt', 'transcript.vi.txt']
const digest = bytes => createHash('sha256').update(bytes).digest('hex')

async function ownedFile(base, name) {
  const file = resolve(base, name), info = await lstat(file)
  if (!info.isFile() || info.isSymbolicLink() || info.size <= 0 ||
      !(await realpath(file)).startsWith(base + sep)) throw new Error('Invalid owned file: ' + name)
  return readFile(file)
}

export async function verifiedPackage(packageDir) {
  const info = await lstat(packageDir)
  if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('Invalid package directory')
  const base = await realpath(packageDir), raw = await ownedFile(base, 'manifest.json')
  if (digest(raw) !== manifestHash) throw new Error('1954 manifest changed; review required')
  const manifest = JSON.parse(raw)
  if (manifest.publicationScope !== 'internal_reference_only' || manifest.files['pilot-mobile.mp4'] !== videoHash)
    throw new Error('Only the unchanged internal reference package is allowed')
  const files = new Map()
  for (const name of mediaNames) {
    const bytes = await ownedFile(base, name)
    if (digest(bytes) !== manifest.files[name]) throw new Error('1954 file hash mismatch: ' + name)
    files.set(name, bytes)
  }
  return { files, metadata: { durationSeconds: manifest.video.durationSeconds,
    videoSha256: videoHash, sourceIds: manifest.sourceIds } }
}

export function publicConfiguration(text) {
  const values = {}
  for (const line of text.split(/\r?\n/)) {
    const match = /^(VITE_SUPABASE_URL|VITE_SUPABASE_PUBLISHABLE_KEY|VITE_GAME_SERVER_URL)\s*=\s*(.*?)\s*$/.exec(line)
    if (!match) continue
    values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  const url = new URL(values.VITE_SUPABASE_URL)
  if (url.protocol !== 'https:' || !url.hostname.endsWith('.supabase.co') || url.username || url.password || url.search || url.hash)
    throw new Error('Expected public Supabase HTTPS URL')
  const key = values.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!/^sb_publishable_[A-Za-z0-9_-]+$/.test(key || '')) {
    let payload
    try { payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()) } catch {}
    if (payload?.role !== 'anon') throw new Error('Expected a publishable/anon client key')
  }
  if (values.VITE_GAME_SERVER_URL?.trim()) {
    values.VITE_GAME_SERVER_URL = resolveGameServerUrl(values.VITE_GAME_SERVER_URL, { protocol: 'https:', hostname: 'hosted-preview' })
  }
  return values
}

export async function auditOutput(outDir) {
  const files = []
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = resolve(directory, entry.name)
      if (entry.isSymbolicLink()) throw new Error('Symlink in hosted output')
      if (entry.isDirectory()) { await walk(file); continue }
      const name = relative(outDir, file).split(sep).join('/')
      if (!/^(?:index\.html|offline\.html|sw\.js|pwa-build\.json|hosting-build\.json|robots\.txt|manifest\.webmanifest|scripts\/content\/reference-preview\/index\.html|assets\/[A-Za-z0-9_.-]+\.(?:js|css|png|svg|webp|avif|woff2)|assets\/(?:pilot-mobile-[A-Za-z0-9_-]+\.mp4|captions\.vi-[A-Za-z0-9_-]+\.vtt|transcript\.vi-[A-Za-z0-9_-]+\.txt)|icons\/[A-Za-z0-9_.-]+\.(?:png|svg)|technical-fixtures\/fallback-(?:captions\.vtt|poster\.svg|transcript\.txt)|reference-media\/(?:pilot-mobile\.mp4|poster\.png|captions\.vi\.vtt|transcript\.vi\.txt))$/.test(name))
        throw new Error('Unexpected hosted output: ' + name)
      if (!/\.(?:mp4|png|woff2)$/.test(name)) {
        const text = await readFile(file, 'utf8')
        if (/sb_secret_[A-Za-z0-9_-]{8,}/.test(text)) throw new Error('Secret in hosted output')
        for (const token of text.matchAll(/eyJ[A-Za-z0-9_-]+\.(eyJ[A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+/g)) {
          if (JSON.parse(Buffer.from(token[1], 'base64url').toString()).role === 'service_role')
            throw new Error('Privileged token in hosted output')
        }
      }
      files.push({ name, sha256: digest(await readFile(file)) })
    }
  }
  await walk(outDir)
  return files.sort((a, b) => a.name.localeCompare(b.name))
}

export async function buildHostingPreview() {
  const root = await realpath(resolve(import.meta.dirname, '../..'))
  const outDir = resolve(root, 'output/hosting-preview/dist')
  // Check each existing ancestor before Vite empties this fixed output directory.
  for (const name of ['output', 'output/hosting-preview', 'output/hosting-preview/dist']) {
    const path = resolve(root, name)
    const info = await lstat(path).catch(error => { if (error.code !== 'ENOENT') throw error })
    if (info && (!info.isDirectory() || info.isSymbolicLink() || !(await realpath(path)).startsWith(root + sep)))
      throw new Error('Unsafe Hosting output directory')
  }
  const { files, metadata } = await verifiedPackage(resolve(root, 'docs/content/preview1954-v1'))
  const config = publicConfiguration(await readFile(resolve(root, '.env.local'), 'utf8'))
  const virtualId = 'virtual:reference1954-package'
  await build({ root, mode: 'production', base: '/', envDir: false, envPrefix: [],
    define: { ...Object.fromEntries(Object.entries(config).map(([key, value]) => ['import.meta.env.' + key, JSON.stringify(value)])),
      'import.meta.env.VITE_INTERNAL_1954_PREVIEW': JSON.stringify('true'),
      'import.meta.env.VITE_REFERENCE_1954_METADATA': JSON.stringify(JSON.stringify(metadata)) },
    plugins: [{ name: 'verified-reference1954-hosting',
      resolveId(id) { if (id === virtualId) return '\0' + virtualId },
      load(id) { if (id === '\0' + virtualId) return 'export default ' + JSON.stringify(metadata) } }],
    build: { outDir, emptyOutDir: true, sourcemap: false,
      rolldownOptions: { input: { app: resolve(root, 'index.html'),
        reference: resolve(root, 'scripts/content/reference-preview/index.html') } } } })
  const mediaDir = resolve(outDir, 'reference-media')
  await mkdir(mediaDir, { recursive: true })
  for (const [name, bytes] of files) await writeFile(resolve(mediaDir, name), bytes)
  await writeFile(resolve(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n')
  const inventory = await auditOutput(outDir)
  const pwa = JSON.parse(await readFile(resolve(outDir, 'pwa-build.json'), 'utf8'))
  if (pwa.allowed.some(path => /reference-media|\/reference(?:\/|$)/.test(path)))
    throw new Error('Reference content entered PWA cache allowlist')
  await writeFile(resolve(outDir, 'hosting-build.json'), JSON.stringify({ scope: 'temporary_internal_preview',
    pwaVersion: pwa.version, videoSha256: videoHash, manifestSha256: manifestHash, files: inventory }, null, 2))
  console.log('Hosting preview verified: ' + inventory.length + ' files; unchanged 1954 video; no privileged client configuration')
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) await buildHostingPreview()
