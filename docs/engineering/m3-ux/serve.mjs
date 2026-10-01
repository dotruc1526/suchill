import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, sep, extname } from 'node:path'

export async function serve(port = 0) {
  const root = fileURLToPath(new URL('./', import.meta.url))
  const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png' }
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
      const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`)
      if (!path.startsWith(root.endsWith(sep) ? root : root + sep) || !mime[extname(path)]) {
        response.writeHead(404).end(); return
      }
      response.writeHead(200, { 'Content-Type': `${mime[extname(path)]}; charset=utf-8`, 'Cache-Control': 'no-store' })
      response.end(await readFile(path))
    } catch { response.writeHead(404).end() }
  })
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve))
  return { server, url: `http://127.0.0.1:${server.address().port}` }
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { url } = await serve(4178)
  console.log(`M3-UX prototype: ${url}`)
}
