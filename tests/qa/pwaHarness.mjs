import { build } from 'vite'
import { createServer } from 'node:http'
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { join, resolve, sep, extname } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { pwaBuildPlugin } from '../../scripts/pwa/build-plugin.ts'
import { workerSource } from '../../scripts/pwa/worker-source.ts'
const root = fileURLToPath(new URL('../../', import.meta.url))
const mime = { '.html':'text/html;charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.webmanifest':'application/manifest+json', '.png':'image/png', '.svg':'image/svg+xml' }
export async function pwaHarness(run) {
  const temporary = resolve(tmpdir()), directory = await mkdtemp(join(temporary,'suchill-pwa-qa-'))
  if (!resolve(directory).startsWith(temporary+sep)) throw new Error('Invalid owned QA directory')
  const sourceDirectory=await mkdtemp(join(root,'.tmp-pwa-qa-'))
  let server
  try {
    const html=await readFile(join(root,'tests/qa/fixtures/pwa-lifecycle.html'),'utf8')
    await writeFile(join(sourceDirectory,'index.html'),html.replace('./pwa-lifecycle.ts','../tests/qa/fixtures/pwa-lifecycle.ts'))
    const versions = []
    for (const version of ['v1','v2']) {
      const outDir = join(directory,version)
      await build({ root:sourceDirectory, publicDir:join(root,'public'), configFile:false, envDir:false, mode:'production', base:'/', logLevel:'silent',
        define: { __PWA_QA_VERSION__:JSON.stringify(version) },
        plugins: [pwaBuildPlugin()],
        build: { outDir, emptyOutDir:true } })
      versions.push({ outDir, meta:JSON.parse(await readFile(join(outDir,'pwa-build.json'),'utf8')) })
    }
    let current = 0, failInstall = false, offline = false
    const seen = []
    server = createServer(async (req,res) => {
      if (offline) { req.socket.destroy(); return }
      const url = new URL(req.url,'http://localhost')
      seen.push({ path:url.pathname, query:Boolean(url.search), method:req.method, cookie:Boolean(req.headers.cookie), authorization:Boolean(req.headers.authorization) })
      res.setHeader('Cache-Control','no-store')
      try {
        if (url.pathname==='/sw.js' && failInstall) {
          const meta=versions[1].meta
          res.setHeader('Content-Type','text/javascript')
          return res.end(workerSource({ ...meta, version:'ffffffffffffffffffff', precache:[...meta.precache,'/owned-missing-install.js'] }))
        }
        if (/^\/(auth|api|rest|functions|storage)(\/|$)/.test(url.pathname) || url.pathname==='/assets/owned-unlisted.js') {
          res.setHeader('Content-Type','application/json'); return res.end('{"private":"owned-synthetic"}')
        }
        if (url.pathname==='/owned-missing-install.js') { res.statusCode=404; return res.end('Owned missing install proof') }
        const file = url.pathname==='/' || (!extname(url.pathname) && !url.pathname.startsWith('/assets/')) ? '/index.html' : url.pathname
        if (file.includes('..') || file.includes('\\')) throw new Error('Invalid test path')
        const body = await readFile(join(versions[current].outDir,file.slice(1)))
        res.setHeader('Content-Type',mime[extname(file)] || 'application/octet-stream'); res.end(body)
      } catch { res.statusCode=404; res.end('Owned fixture not found') }
    })
    await new Promise(resolveServer=>server.listen(0,'127.0.0.1',resolveServer))
    return await run({ origin:'http://127.0.0.1:'+server.address().port, versions, seen,
      publish(index) { current=index }, setOffline(value) { offline=value }, failInstall() { failInstall=true } })
  } finally {
    if (server) { server.closeAllConnections(); await new Promise(resolveServer=>server.close(resolveServer)) }
    if (!resolve(directory).startsWith(temporary+sep)) throw new Error('Invalid owned QA cleanup')
    if (!resolve(sourceDirectory).startsWith(resolve(root)+sep)) throw new Error('Invalid owned fixture cleanup')
    await rm(sourceDirectory,{recursive:true,force:true,maxRetries:5,retryDelay:200})
    await rm(directory,{recursive:true,force:true,maxRetries:5,retryDelay:200})
  }
}
