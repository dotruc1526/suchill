import { createServer } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { readFile, realpath, lstat } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve, sep } from 'node:path'

const previewRoot = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(previewRoot, '../../..')
const files = { 'pilot-mobile.mp4': 'video/mp4', 'poster.png': 'image/png',
  'captions.vi.vtt': 'text/vtt; charset=utf-8', 'transcript.vi.txt': 'text/plain; charset=utf-8' }
const prefix = '/reference-media/'
const virtualId = 'virtual:reference1954-package'
const html = '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><title>Sử Chill · Xem thử Trước cơn bão</title></head><body><div id="root"></div><script type="module" src="/entry.tsx"></script></body></html>'

export function byteRange(header, size) {
  if (header === undefined) return { start: 0, end: size - 1, partial: false }
  const match = /^bytes=(\d*)-(\d*)$/.exec(header)
  if (!match || !match[1] && !match[2]) return null
  let start, end
  if (!match[1]) {
    const suffix = Number(match[2])
    if (!Number.isSafeInteger(suffix) || suffix <= 0) return null
    start = Math.max(0, size - suffix); end = size - 1
  } else {
    start = Number(match[1]); end = match[2] ? Number(match[2]) : size - 1
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || start > end) return null
    end = Math.min(end, size - 1)
  }
  return { start, end, partial: true }
}

async function preparePackage(packageDir) {
  const base = await realpath(resolve(packageDir))
  if (!(await lstat(resolve(packageDir))).isDirectory() || (await lstat(resolve(packageDir))).isSymbolicLink())
    throw new Error('Preview package must be a real directory')
  const manifest = JSON.parse(await readFile(resolve(base, 'manifest.json'), 'utf8'))
  if (!Number.isFinite(manifest.video?.durationSeconds) || manifest.video.durationSeconds <= 0)
    throw new Error('Preview manifest needs actual video duration')
  const prepared = new Map()
  for (const [name, mime] of Object.entries(files)) {
    const file = resolve(base, name)
    const info = await lstat(file)
    if (!info.isFile() || info.isSymbolicLink() || info.size <= 0 ||
        !(await realpath(file)).startsWith(base + sep)) throw new Error('Invalid preview package file: ' + name)
    const hash = createHash('sha256').update(await readFile(file)).digest('hex')
    if (manifest.files?.[name]?.toLowerCase() !== hash) throw new Error('Preview file does not match manifest: ' + name)
    prepared.set(name, { file, size: info.size, mime })
  }
  return { prepared, metadata: { durationSeconds: manifest.video.durationSeconds,
    videoSha256: manifest.files['pilot-mobile.mp4'].toLowerCase(),
    sourceIds: Array.isArray(manifest.sourceIds) ? manifest.sourceIds.filter(id => typeof id === 'string') : [] } }
}

export async function startReferencePreview({ packageDir, port = 8444 }) {
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Invalid preview port')
  const { prepared, metadata } = await preparePackage(packageDir)
  const mediaPlugin = {
    name: 'owned-reference1954-preview',
    resolveId(id) { if (id === virtualId) return '\0' + virtualId },
    load(id) { if (id === '\0' + virtualId) return 'export default ' + JSON.stringify(metadata) },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const host = req.headers.host?.split(':')[0]
        if (!['127.0.0.1', 'localhost'].includes(host)) { res.statusCode = 403; res.end(); return }
        const origin = req.headers.origin
        if (origin && ![`http://127.0.0.1:${server.httpServer.address()?.port}`, `http://localhost:${server.httpServer.address()?.port}`].includes(origin)) {
          res.statusCode = 403; res.end(); return
        }
        const rawPath = req.url?.split('?')[0] || '/'
        if (rawPath === '/' || rawPath === '/index.html') {
          if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.end(); return }
          try {
            const page = await server.transformIndexHtml('/', html)
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.setHeader('Cache-Control', 'no-store')
            res.end(req.method === 'HEAD' ? undefined : page)
          } catch (error) { next(error) }
          return
        }
        if (!rawPath.startsWith(prefix)) return next()
        const name = rawPath.slice(prefix.length)
        const item = prepared.get(name)
        if (!item) { res.statusCode = 404; res.end(); return }
        if (req.method !== 'GET' && req.method !== 'HEAD') { res.statusCode = 405; res.end(); return }
        const range = byteRange(req.headers.range, item.size)
        res.setHeader('Accept-Ranges', 'bytes')
        res.setHeader('Cache-Control', 'no-store')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        if (!range) { res.statusCode = 416; res.setHeader('Content-Range', `bytes */${item.size}`); res.end(); return }
        res.statusCode = range.partial ? 206 : 200
        res.setHeader('Content-Type', item.mime)
        res.setHeader('Content-Length', range.end - range.start + 1)
        if (range.partial) res.setHeader('Content-Range', `bytes ${range.start}-${range.end}/${item.size}`)
        if (req.method === 'HEAD') { res.end(); return }
        const stream = createReadStream(item.file, { start: range.start, end: range.end })
        stream.on('error', () => { if (!res.headersSent) res.statusCode = 500; res.destroy() })
        res.on('close', () => stream.destroy())
        stream.pipe(res)
      })
    },
  }
  const server = await createServer({ configFile: false, envDir: false, publicDir: false, root: previewRoot,
    plugins: [mediaPlugin, react(), tailwindcss()], resolve: { dedupe: ['react', 'react-dom'] },
    server: { host: '127.0.0.1', port, strictPort: true, hmr: false, cors: false,
      allowedHosts: ['localhost', '127.0.0.1'], fs: { strict: true,
        allow: [previewRoot, resolve(repoRoot, 'src'), resolve(repoRoot, 'node_modules')],
        deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**'] } } })
  try { await server.listen(); return server }
  catch (error) { await server.close(); throw error }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const options = { packageDir: resolve(repoRoot, 'docs/content/preview1954-v1'), port: 8444 }
  for (let index = 2; index < process.argv.length; index += 2) {
    const name = process.argv[index], value = process.argv[index + 1]
    if (!value || !['--package', '--port'].includes(name)) throw new Error('Usage: node serve.mjs [--package directory] [--port 8444]')
    if (name === '--package') options.packageDir = resolve(value)
    else options.port = Number(value)
  }
  const server = await startReferencePreview(options)
  console.log('Internal reference preview: http://127.0.0.1:' + server.httpServer.address().port)
  const stop = async () => { await server.close(); process.exit(0) }
  process.on('SIGINT', stop); process.on('SIGTERM', stop)
}
