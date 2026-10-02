import assert from 'node:assert/strict'
import { preview } from 'vite'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { findBrowser, withChromePage } from '../../tests/qa/chromeHarness.mjs'
import { previewStorageKey } from '../content/reference-preview/services.ts'
import { videoHash } from './build-hosting-preview.mjs'

const root = resolve(import.meta.dirname, '../..')
let server
const origin = process.argv[2] || await (async () => {
  server = await preview({configFile:false,envDir:false,root,build:{outDir:'output/hosting-preview/dist'},
    preview:{host:'127.0.0.1',port:8445,strictPort:true},
    plugins:[{name:'exact-hosting-reference-route',configurePreviewServer(server) {
      server.middlewares.use((req,_res,next) => {
        if (/^\/reference(?:\/|\?|$)/.test(req.url || '')) req.url='/scripts/content/reference-preview/index.html'
        next()
      })
    }}]})
  return 'http://127.0.0.1:8445'
})()
try {
  await withChromePage(findBrowser(),origin+'/',async cdp => {
    try {
    await cdp.waitFor('Boolean(navigator.serviceWorker.controller)', 'PWA worker controls the app')
    const manifest=await cdp('Page.getAppManifest')
    assert.equal(manifest.errors.length,0)
    assert.equal(JSON.parse(manifest.data).lang,'vi')
    assert.deepEqual((await cdp('Page.getInstallabilityErrors')).installabilityErrors,[])
    await cdp('Page.navigate',{url:origin+'/reference'})
    await cdp.waitFor('document.querySelector("video")?.readyState>=1','Reference video loads through active worker')
    assert.ok((await cdp.evaluate('document.body.innerText')).includes('Xem thử nội bộ'))
    assert.equal(await cdp.evaluate('document.querySelector("video").autoplay'),false)
    assert.equal(await cdp.evaluate('document.querySelector("video").videoWidth'),1080)
    await cdp.waitFor('document.querySelector("video").textTracks[0]?.cues?.length===28')
    const key=previewStorageKey(videoHash)
    await cdp.evaluate('localStorage.setItem("owned-unrelated-proof","keep")')
    await cdp.raw('Runtime.evaluate',{expression:'document.querySelector("video").muted=true;document.querySelector("video").play()',awaitPromise:true,userGesture:true})
    await cdp.waitFor('document.querySelector("video").currentTime>.6')
    await cdp.evaluate('document.querySelector("video").pause();document.querySelector("video").currentTime=17')
    await cdp.waitFor('JSON.parse(localStorage.getItem('+JSON.stringify(key)+')||"null")?.positionSeconds===17')
    await cdp('Page.reload')
    await cdp.waitFor('document.querySelector("video")?.readyState>=1 && Math.abs(document.querySelector("video").currentTime-17)<.2')
    assert.equal(await cdp.evaluate('localStorage.getItem("owned-unrelated-proof")'),'keep')
    assert.equal(await cdp.evaluate('JSON.parse(localStorage.getItem('+JSON.stringify(key)+')).completed'),false)
    for(const {width,height} of [{width:375,height:812},{width:430,height:900},{width:812,height:375}]) {
      await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true})
      assert.equal(await cdp.evaluate('document.documentElement.scrollWidth<=innerWidth'),true)
    }
    await cdp.evaluate('document.querySelector("video").src="/reference-media/missing.mp4";document.querySelector("video").load()')
    await cdp.waitFor('document.body.innerText.includes("Video chưa thể phát")')
    assert.equal(await cdp.evaluate('Boolean(document.querySelector("a[href=\\"/reference-media/transcript.vi.txt\\"]"))'),true)
    const keys=await cdp.evaluate('(async()=>{const result=[];for(const name of await caches.keys())for(const request of await (await caches.open(name)).keys())result.push(request.url);return result})()')
    assert.equal(keys.some(url=>/reference-media|\/reference(?:\/|$)|supabase|\/auth/.test(url)),false)
    console.log('Chrome PASS: active worker → reference route, installability, video/captions, resume, 3 mobile viewports, fallback, private/reference cache exclusion')
    } catch(error) { console.error(error); throw error }
    finally { await cdp.browser('Browser.close').catch(()=>{}) }
  })
  if (!process.argv[2]) {
    const report=JSON.parse(await readFile(resolve(root,'output/hosting-preview/dist/hosting-build.json'),'utf8'))
    console.log('Verified PWA build: '+report.pwaVersion)
  }
} finally { if(server) { server.httpServer.closeAllConnections(); await new Promise(done=>server.httpServer.close(done)) } }
