// Package-only Chrome QA; does not certify physical devices, listening alignment or lesson integration.
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { createServer as createHttpServer } from 'node:http'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { homedir, tmpdir } from 'node:os'
import { once } from 'node:events'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createReadStream, statSync } from 'node:fs'

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))

async function terminateChild(child, graceMilliseconds = 3_000) {
  if (child.exitCode !== null || child.signalCode !== null) return

  const exited = once(child, 'exit').then(() => true)
  child.kill()
  if (await Promise.race([exited, delay(graceMilliseconds).then(() => false)])) return

  child.kill('SIGKILL')
  await Promise.race([exited, delay(graceMilliseconds)])
}

function findBrowser() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH

  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  ]
  const cache = join(homedir(), 'Library/Caches/ms-playwright')
  if (existsSync(cache)) {
    for (const directory of readdirSync(cache).filter(name => name.startsWith('chromium_headless_shell-'))) {
      candidates.push(join(cache, directory, 'chrome-headless-shell-mac-arm64/chrome-headless-shell'))
    }
  }
  return candidates.find(existsSync)
}

async function withChromePage(browser, url, run) {
  const profile = await mkdtemp(join(tmpdir(), 'suchill-e2e-'))
  const chrome = spawn(browser, [
    '--headless', '--no-sandbox', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] })
  let socket
  try {
    const endpoint = await new Promise((resolve, reject) => {
      let log = ''
      const timer = setTimeout(() => reject(new Error('Chrome startup timeout')), 20_000)
      chrome.once('error', reject)
      chrome.stderr.on('data', chunk => {
        log += chunk
        const match = log.match(/DevTools listening on (ws:\/\/[^\s]+)/)
        if (match) { clearTimeout(timer); resolve(match[1]) }
      })
    })
    socket = new WebSocket(endpoint)
    await once(socket, 'open')
    let id = 0
    const pending = new Map()
    socket.addEventListener('message', event => {
      const message = JSON.parse(event.data)
      if (!message.id) return
      const request = pending.get(message.id)
      if (!request) return
      pending.delete(message.id)
      clearTimeout(request.timer)
      message.error ? request.reject(new Error(JSON.stringify(message.error))) : request.resolve(message.result)
    })
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
      const requestId = ++id
      const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`Chrome command timed out: ${method}`)) }, 15_000)
      pending.set(requestId, { resolve, reject, timer })
      socket.send(JSON.stringify({ id: requestId, method, params, sessionId }))
    })
    let page
    let targetInfos = []
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const targets = await send('Target.getTargets')
      targetInfos = targets.targetInfos
      page = targetInfos.find(target => target.type === 'page' && target.url === url)
        ?? targetInfos.find(target => target.type === 'page')
      if (page) break
      await delay(50)
    }
    assert.ok(page, `Chrome opened a page target: ${JSON.stringify(targetInfos)}`)
    const { sessionId } = await send('Target.attachToTarget', { targetId: page.targetId, flatten: true })
    const command = (method, params) => send(method, params, sessionId)
    await command('Page.enable')
    // Interaction tests exercise the supported system-font fallback without a CDN dependency.
    await command('Network.enable')
    await command('Network.setBlockedURLs', { urls: ['*://fonts.googleapis.com/*', '*://fonts.gstatic.com/*'] })
    const waitForDocument = async (loaderMatches, label) => {
      let state
      const deadline = Date.now() + 20_000
      while (Date.now() < deadline) {
        const { frameTree } = await command('Page.getFrameTree')
        if (loaderMatches(frameTree.frame.loaderId)) {
          try {
            const evaluated = await command('Runtime.evaluate', {
              expression: `({ url: location.href, ready: document.readyState !== 'loading' && Boolean(document.querySelector('#root')?.children.length) })`,
              returnByValue: true,
            })
            state = evaluated.result?.value
            if (state?.url === url && state.ready) return
          } catch (error) {
            // An old execution context can disappear while a new document commits.
            if (!/context.*destroyed|Cannot find context/i.test(error.message)) throw error
          }
        }
        await delay(50)
      }
      assert.fail(`${label}: expected a mounted document at ${url}; last state ${JSON.stringify(state)}`)
    }
    // Chrome always starts blank: no caller can reload/cancel its initial URL load.
    const navigation = await command('Page.navigate', { url })
    assert.ok(!navigation.errorText, `Chrome navigation failed: ${navigation.errorText}`)
    await waitForDocument(loaderId => loaderId === navigation.loaderId, 'Initial navigation timeout')
    await run(async (method, params) => {
      if (method !== 'Page.reload') return command(method, params)
      const { frameTree } = await command('Page.getFrameTree')
      const previousLoader = frameTree.frame.loaderId
      const result = await command(method, params)
      // A reload response is not a readiness signal; don't inspect the old DOM.
      await waitForDocument(loaderId => loaderId !== previousLoader, 'Reload navigation timeout')
      return result
    })
  } finally {
    socket?.close()
    await terminateChild(chrome)
    // Chrome subprocesses can briefly flush profile files after the parent exits.
    // Retry transient ENOTEMPTY/EBUSY errors, but still fail if cleanup never succeeds.
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
  }
}


const root=fileURLToPath(new URL('../../docs/content/production/mt68-v2/render/',import.meta.url));
const html=`<!doctype html><html lang="vi"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#111;color:white}video{display:block;width:100%;height:auto}button{min-height:44px}summary{min-height:44px}</style><div id="root"><video id="v" controls playsinline preload="metadata" poster="/poster.png"><source src="/pilot-collage-mobile.mp4" type="video/mp4"><track default kind="captions" srclang="vi" label="Tiếng Việt" src="/captions.vi.vtt"></video><button id="play" onclick="v.play()">Phát video</button><details><summary>Đọc transcript</summary><pre id="transcript"></pre></details></div><script>fetch('/transcript.vi.txt').then(r=>r.text()).then(t=>transcript.textContent=t)</script></html>`;
const server=createHttpServer((req,res)=>{
 if(req.url==='/'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'}).end(html);return;}
 const path=join(root,req.url.split('?')[0]);
 if(!existsSync(path)||!statSync(path).isFile()){res.writeHead(404).end();return;}
 const size=statSync(path).size;const type=path.endsWith('.mp4')?'video/mp4':path.endsWith('.vtt')?'text/vtt':path.endsWith('.png')?'image/png':'text/plain; charset=utf-8';
 const range=req.headers.range?.match(/bytes=(\d+)-(\d*)/);
 if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),size-1):size-1;res.writeHead(206,{'Content-Type':type,'Content-Length':end-start+1,'Content-Range':`bytes ${start}-${end}/${size}`,'Accept-Ranges':'bytes'});createReadStream(path,{start,end}).pipe(res);}
 else{res.writeHead(200,{'Content-Type':type,'Content-Length':size,'Accept-Ranges':'bytes'});createReadStream(path).pipe(res);}
});
server.listen(0,'127.0.0.1');await once(server,'listening');
const results=[];
try{
await withChromePage(findBrowser(),`http://127.0.0.1:${server.address().port}/`,async command=>{
 const evaluate=async expression=>{const r=await command('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});assert.ok(!r.exceptionDetails,JSON.stringify(r.exceptionDetails));return r.result.value;};
 for(const width of [375,430]){
 await command('Emulation.setDeviceMetricsOverride',{width,height:width===375?812:932,deviceScaleFactor:1,mobile:true});
 await command('Emulation.setTouchEmulationEnabled',{enabled:true});
 await evaluate(`new Promise((resolve,reject)=>{v.textTracks[0].mode='showing';if(v.readyState>=2 && v.textTracks[0].cues?.length===33) return resolve(true); const t=setInterval(()=>{if(v.error){clearInterval(t);reject(v.error.message)}if(v.readyState>=2&&v.textTracks[0].cues?.length===33){clearInterval(t);resolve(true)}},50);setTimeout(()=>{clearInterval(t);reject('media/track timeout')},20000)})`);
 const initial=await evaluate(`({paused:v.paused,autoplay:v.autoplay,inline:v.playsInline,w:v.videoWidth,h:v.videoHeight,duration:v.duration,cues:v.textTracks[0].cues.length,overflow:document.documentElement.scrollWidth>innerWidth,transcript:transcript.textContent.length,canPlay:v.canPlayType('video/mp4; codecs="avc1.640028, mp4a.40.2"')})`);
 assert.equal(initial.autoplay,false);assert.equal(initial.inline,true);assert.equal(initial.w,720);assert.equal(initial.h,1280);assert.equal(initial.cues,33);assert.equal(initial.overflow,false);assert.ok(initial.transcript>700);assert.ok(initial.canPlay);
 const cueResults=await evaluate(`(async()=>{v.pause();const results=[];for(const c of v.textTracks[0].cues){v.currentTime=(c.startTime+c.endTime)/2;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));results.push({text:c.text,active:[...v.textTracks[0].activeCues].some(a=>a.text===c.text),t:v.currentTime})}return results})()`);
 assert.ok(cueResults.every(x=>x.active),'active caption at every cue midpoint');
 await evaluate(`(async()=>{v.currentTime=36;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));v.textTracks[0].mode='hidden';return true})()`);
 const shot=await command('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});await writeFile(join(tmpdir(),`pr112-${width}.png`),Buffer.from(shot.data,'base64'));
 const pos=await evaluate(`(()=>{play.scrollIntoView();const r=play.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
 await command('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:pos.x,y:pos.y}]});await command('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await delay(900);const playing=await evaluate('({paused:v.paused,time:v.currentTime,error:v.error?.message??null,frames:v.getVideoPlaybackQuality().totalVideoFrames})');assert.equal(playing.paused,false);assert.ok(playing.time>36.2);assert.equal(playing.error,null);
 await evaluate(`(async()=>{v.pause();v.currentTime=v.duration-.3;await new Promise(r=>v.addEventListener('seeked',r,{once:true}));await v.play();return true})()`);await delay(1300);assert.equal(await evaluate('v.ended'),true);
 await evaluate('v.pause();v.currentTime=0;v.textTracks[0].mode="showing"');
 results.push({width,initial,captions:cueResults.length,playing,ended:true});
 }
});
await writeFile(join(tmpdir(),'pr112-browser-results.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{server.closeAllConnections();server.close();}
