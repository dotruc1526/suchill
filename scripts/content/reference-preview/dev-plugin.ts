import type { Plugin } from 'vite'
import { resolve } from 'node:path'
import { verifiedPackage } from '../../release/build-hosting-preview.mjs'

const types: Record<string, string> = {
  'pilot-mobile.mp4': 'video/mp4', 'poster.png': 'image/png',
  'captions.vi.vtt': 'text/vtt; charset=utf-8', 'transcript.vi.txt': 'text/plain; charset=utf-8',
}

/** The same immutable package as Hosting, served only during local development. */
export async function local1954Preview(root: string): Promise<Plugin> {
  const { files, metadata } = await verifiedPackage(resolve(root, 'docs/content/preview1954-v1'))
  return {
    name: 'local-verified-1954-preview',
    apply: 'serve',
    config: () => ({ define: {
      'import.meta.env.VITE_INTERNAL_1954_PREVIEW': JSON.stringify('true'),
      'import.meta.env.VITE_REFERENCE_1954_METADATA': JSON.stringify(JSON.stringify(metadata)),
    } }),
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const pathname = req.url?.split('?')[0] ?? ''
        if (!pathname.startsWith('/reference-media/')) return next()
        const name = pathname.slice('/reference-media/'.length)
        const bytes = files.get(name)
        res.setHeader('Cache-Control', 'no-store')
        if (!bytes || !types[name]) { res.statusCode = 404; res.end(); return }
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); res.end(); return
        }
        res.setHeader('Content-Type', types[name])
        res.setHeader('Content-Length', bytes.length)
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.end(req.method === 'HEAD' ? undefined : bytes)
      })
    },
  }
}
