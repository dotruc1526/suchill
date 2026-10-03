import type { Plugin, ResolvedConfig } from 'vite'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { theme } from '../../src/theme/tokens.ts'
import { workerSource } from './worker-source.ts'

export function pwaBuildPlugin(): Plugin {
 let config: ResolvedConfig
 return {
  name:'suchill-static-pwa', apply:'build', enforce:'post',
  configResolved(value) { config=value },
  generateBundle(_options,bundle) {
   // Figma cached previews/subpath builds are not installable root-scope production deployments.
   if (config.mode !== 'production' || config.base !== '/') return
   const assets=Object.keys(bundle).filter(name=>/^assets\/[A-Za-z0-9_.-]+\.(js|css|png|svg|webp|avif|woff2)$/.test(name))
   const fixed=['/index.html','/offline.html','/manifest.webmanifest','/icons/icon.svg','/icons/icon-192.png','/icons/icon-512.png','/icons/maskable-512.png','/icons/apple-touch-icon.png']
   const hash=createHash('sha256')
   hash.update(workerSource.toString()); hash.update(pwaBuildPlugin.toString())
   for(const name of Object.keys(bundle).sort()) {
    const item=bundle[name]
    hash.update(name); hash.update(item.type==='chunk'?item.code:item.source)
   }
   for(const name of fixed.filter(name=>name!=='/index.html'&&name!=='/offline.html')) hash.update(readFileSync(join(config.publicDir,name.slice(1))))
   const version=hash.digest('hex').slice(0,20)
   const bootstrap=new Set<string>()
   const visit=(name:string)=>{
    if(bootstrap.has(name))return
    bootstrap.add(name)
    const item=bundle[name]
    if(item?.type==='chunk') for(const imported of item.imports) visit(imported)
   }
   for(const [name,item] of Object.entries(bundle)) if(item.type==='chunk'&&item.isEntry) visit(name)
   for(const name of assets) if(name.endsWith('.css'))bootstrap.add(name)
   const allowed=[...fixed,...assets.map(name=>'/'+name)]
   const precache=[...fixed,...Array.from(bootstrap).filter(name=>assets.includes(name)).map(name=>'/'+name)]
   const offline='<!doctype html><html lang="vi"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>Sử Chill — Chưa có kết nối</title><style>body{margin:0;background:'+theme.colors.appBg+';color:'+theme.colors.textPrimary+';font:1rem/1.6 system-ui,sans-serif}main{max-width:28rem;margin:auto;padding:1.5rem}button,a{display:inline-block;padding:.75rem 1rem;color:'+theme.colors.primary+'}button{font:inherit;border:1px solid currentColor;background:transparent;border-radius:'+theme.radius.sm+'}button:focus-visible,a:focus-visible{outline:2px solid currentColor;outline-offset:3px}</style></head><body><main><h1>Chưa có kết nối</h1><p>Hãy kết nối mạng rồi tải lại để mở liên kết này. Tiến độ đang chờ đồng bộ vẫn được giữ trên thiết bị.</p><button id="retry" type="button">Tải lại khi có mạng</button><p><a href="/">Về Sử Chill</a></p></main><script>document.getElementById("retry").addEventListener("click",()=>location.reload())</script></body></html>'
   this.emitFile({type:'asset',fileName:'offline.html',source:offline})
   this.emitFile({type:'asset',fileName:'sw.js',source:workerSource({version,allowed,precache})})
   this.emitFile({type:'asset',fileName:'pwa-build.json',source:JSON.stringify({version,allowed,precache})})
  },
 }
}
