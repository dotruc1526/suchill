import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer, resolveConfig } from 'vite'
import { resolve } from 'node:path'
import { createHash } from 'node:crypto'
import { local1954Preview } from '../../scripts/content/reference-preview/dev-plugin.ts'

test('local preview config coexists with a tunnel endpoint and serves only verified package media', async t => {
  const server = await createServer({ root: resolve(import.meta.dirname, '../..'), configFile: false,
    plugins: [await local1954Preview(resolve(import.meta.dirname, '../..'))],
    define: { 'import.meta.env.VITE_GAME_SERVER_URL': JSON.stringify('https://example.trycloudflare.com') },
    server: { host: '127.0.0.1', port: 0, hmr: false }, optimizeDeps: { noDiscovery: true } })
  await server.listen(); t.after(() => server.close())
  assert.equal(server.config.define['import.meta.env.VITE_INTERNAL_1954_PREVIEW'], '"true"')
  assert.equal(server.config.define['import.meta.env.VITE_GAME_SERVER_URL'], '"https://example.trycloudflare.com"')
  const metadata = JSON.parse(JSON.parse(server.config.define['import.meta.env.VITE_REFERENCE_1954_METADATA']))
  const address = server.httpServer!.address() as { port: number }
  const base = `http://127.0.0.1:${address.port}`
  const video = await fetch(`${base}/reference-media/pilot-mobile.mp4`)
  assert.equal(video.headers.get('content-type'), 'video/mp4')
  assert.equal(createHash('sha256').update(Buffer.from(await video.arrayBuffer())).digest('hex'), metadata.videoSha256)
  for (const name of ['poster.png', 'captions.vi.vtt', 'transcript.vi.txt']) {
    const response = await fetch(`${base}/reference-media/${name}`, { method: 'HEAD' })
    assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.ok(Number(response.headers.get('content-length')) > 0)
    assert.equal((await response.arrayBuffer()).byteLength, 0)
  }
  assert.equal((await fetch(`${base}/reference-media/manifest.json`)).status, 404)
  assert.equal((await fetch(`${base}/reference-media/pilot-mobile.mp4`, { method: 'POST' })).status, 405)
})

test('ordinary production builds do not implicitly enable the internal preview', async () => {
  const root = resolve(import.meta.dirname, '../..')
  const config = await resolveConfig({ root, configFile: resolve(root, 'vite.config.ts') }, 'build', 'production')
  assert.equal(config.plugins.some(plugin => plugin.name === 'local-verified-1954-preview'), false)
  assert.equal(config.define?.['import.meta.env.VITE_INTERNAL_1954_PREVIEW'], undefined)
})
