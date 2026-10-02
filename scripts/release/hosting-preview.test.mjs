import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, rm, writeFile, readFile, cp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, join, sep } from 'node:path'
import { verifiedPackage, publicConfiguration, auditOutput, videoHash } from './build-hosting-preview.mjs'
const packageDir = resolve(import.meta.dirname, '../../docs/content/preview1954-v1')

test('unchanged reference package verifies; altered manifest and video are rejected', async () => {
  const approved = await verifiedPackage(packageDir)
  assert.equal(approved.metadata.videoSha256, videoHash)
  assert.equal(approved.files.size, 4)
  const temporary = await mkdtemp(join(tmpdir(), 'suchill-hosting-qa-'))
  try {
    const copy = join(temporary, 'package')
    await cp(packageDir, copy, { recursive: true })
    await writeFile(join(copy, 'pilot-mobile.mp4'), 'changed')
    await assert.rejects(verifiedPackage(copy), /hash mismatch/)
    await writeFile(join(copy, 'manifest.json'), '{}')
    await assert.rejects(verifiedPackage(copy), /manifest changed/)
  } finally {
    assert.ok(resolve(temporary).startsWith(resolve(tmpdir()) + sep))
    await rm(temporary, { recursive: true, force: true })
  }
})

test('client config only admits two public values and rejects privileged credentials', () => {
  const url = 'VITE_SUPABASE_URL=https://owned-test.supabase.co\n'
  const publicKey = 'VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ownedtest'
  assert.deepEqual(Object.keys(publicConfiguration(url + publicKey + '\nOTHER_PRIVATE_VALUE=omit')), ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'])
  assert.throws(() => publicConfiguration(url + 'VITE_SUPABASE_PUBLISHABLE_KEY=' + 'sb_' + 'secret_ownedtest'), /publishable/)
  const jwt = 'eyJhbGciOiJIUzI1NiJ9.' + Buffer.from(JSON.stringify({role:'service_role'})).toString('base64url') + '.owned'
  assert.throws(() => publicConfiguration(url + 'VITE_SUPABASE_PUBLISHABLE_KEY=' + jwt), /publishable/)
  assert.throws(() => publicConfiguration(url.replace('https:', 'http:') + publicKey), /HTTPS/)
})

test('hosting build carries a validated public PvP endpoint while rejecting insecure or credential-bearing endpoints', () => {
  const base = 'VITE_SUPABASE_URL=https://owned.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ownedtest\n';
  assert.equal(publicConfiguration(base + 'VITE_GAME_SERVER_URL=https://owned-game.onrender.com/').VITE_GAME_SERVER_URL, 'https://owned-game.onrender.com');
  for (const url of ['http://owned-game.example', 'https://user:pass@owned-game.example', 'https://owned-game.example/private']) {
    assert.throws(() => publicConfiguration(base + 'VITE_GAME_SERVER_URL=' + url));
  }
  assert.equal(publicConfiguration(base).VITE_GAME_SERVER_URL, undefined);
});

test('hosted output inventory refuses secrets and any unclaimed output file', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'suchill-hosting-audit-'))
  try {
    await writeFile(join(temporary, 'index.html'), '<h1>Owned preview</h1>')
    assert.equal((await auditOutput(temporary)).length, 1)
    await writeFile(join(temporary, 'index.html'), 'sb_' + 'secret_ownedtest')
    await assert.rejects(auditOutput(temporary), /Secret/)
    await writeFile(join(temporary, 'index.html'), '<h1>Owned preview</h1>')
    await writeFile(join(temporary, 'private.json'), '{}')
    await assert.rejects(auditOutput(temporary), /Unexpected hosted output/)
  } finally {
    assert.ok(resolve(temporary).startsWith(resolve(tmpdir()) + sep))
    await rm(temporary, { recursive: true, force: true })
  }
})

test('Hosting config is fixed to preview site, exact output and safe reference headers', async () => {
  const config = JSON.parse(await readFile(new URL('../../firebase.json', import.meta.url), 'utf8')).hosting
  assert.equal(config.site, 'suchill-preview')
  assert.equal(config.public, 'output/hosting-preview/dist')
  assert.ok(config.headers.find(item => item.source === '/reference-media/**').headers.some(item => item.key === 'Cache-Control' && item.value === 'no-store'))
  assert.ok(config.rewrites.some(item => item.source === '/reference' && item.destination === '/scripts/content/reference-preview/index.html'))
  assert.equal(config.rewrites.at(-1).destination, '/index.html')
})
