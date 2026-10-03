import assert from 'node:assert/strict'
import test from 'node:test'
import { preview, createServer } from 'vite'
import React from 'react'
import { fileURLToPath } from 'node:url'
import { renderToStaticMarkup } from 'react-dom/server'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { findBrowser, withChromePage } from './chromeHarness.mjs'
import { theme } from '../../src/theme/tokens.ts'
const luminance = hex => {
  const rgb = hex.slice(1).match(/../g).map(value=>parseInt(value,16)/255).map(value=>value<=0.04045?value/12.92:((value+0.055)/1.055)**2.4)
  return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722
}
const contrast=(a,b)=>{const [light,dark]=[luminance(a),luminance(b)].sort((x,y)=>y-x);return(light+0.05)/(dark+0.05)}
test('actual mock production app: keyboard bypass, mobile/landscape/large text and offline status', async () => {
  assert.ok(process.env.SUCHILL_QA_BUILD_DIR,'Use npm run test:e2e for the isolated production build')
  for(const background of [theme.colors.navBg,theme.colors.appBg,theme.colors.cardBg]) assert.ok(contrast(theme.colors.textMuted,background)>=4.5)
  assert.ok(contrast(theme.colors.primary,theme.colors.primaryText)>=4.5)
  const server=await preview({configFile:false,envDir:false,build:{outDir:process.env.SUCHILL_QA_BUILD_DIR},preview:{host:'127.0.0.1',port:0,strictPort:false}})
  const origin='http://127.0.0.1:'+server.httpServer.address().port
  try {
    await withChromePage(findBrowser(),origin+'/',async cdp=>{
      await cdp.waitFor('Boolean(document.querySelector("[data-testid^=journey-open-chapter-]"))')
      assert.equal(await cdp.evaluate('document.documentElement.lang'),'vi')
      assert.ok((await cdp.evaluate('document.title')).includes('Sử Chill'))
      assert.equal(await cdp.evaluate('document.querySelectorAll("#main-content").length'),1)
      await cdp.evaluate('document.activeElement?.blur();document.body.tabIndex=-1;document.body.focus()')
      await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9})
      await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9})
      assert.equal(await cdp.evaluate('document.activeElement.classList.contains("skip-link")'),true)
      assert.equal(await cdp.evaluate('document.activeElement.getBoundingClientRect().top>=0'),true)
      await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
      await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13})
      assert.equal(await cdp.evaluate('document.activeElement.id'),'main-content')
      assert.equal(await cdp.evaluate('location.hash'),'')
      await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]})
      await cdp('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1})
      await cdp.waitFor('document.body.innerText.includes("Bạn đang ngoại tuyến")')
      const screenshotDirectory=process.env.M6_SCREENSHOT_DIR && resolve(process.env.M6_SCREENSHOT_DIR)
      if(screenshotDirectory)await mkdir(screenshotDirectory,{recursive:true})
      for(const {width,height,largeText} of [{width:375,height:812},{width:430,height:900},{width:812,height:375},{width:375,height:812,largeText:true}]) {
        await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true})
        await cdp.evaluate('document.documentElement.style.fontSize='+JSON.stringify(largeText?'200%':'100%'))
        assert.equal(await cdp.evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'No horizontal overflow '+width+' largeText='+Boolean(largeText))
        const buttons=await cdp.evaluate('Array.from(document.querySelectorAll("nav button")).map(button=>({height:button.getBoundingClientRect().height,bottom:button.getBoundingClientRect().bottom,name:button.textContent}))')
        assert.equal(buttons.length,4)
        assert.ok(buttons.every(button=>button.height>=44&&button.bottom<=height),'Visible generous navigation targets')
        const tree=await cdp('Accessibility.getFullAXTree')
        assert.ok(tree.nodes.some(node=>!node.ignored&&node.role?.value==='main'))
        assert.ok(tree.nodes.some(node=>!node.ignored&&node.role?.value==='navigation'&&node.name?.value==='Thanh điều hướng chính'))
        assert.ok(tree.nodes.some(node=>!node.ignored&&node.name?.value?.includes('Bạn đang ngoại tuyến')))
        if(screenshotDirectory) {
          const screenshot=await cdp('Page.captureScreenshot',{format:'png'})
          await writeFile(resolve(screenshotDirectory,'pwa-'+width+'x'+height+(largeText?'-large-text':'')+'.png'),Buffer.from(screenshot.data,'base64'))
        }
      }
      await cdp('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1})
      await cdp.waitFor('!document.body.innerText.includes("Bạn đang ngoại tuyến")')
      await cdp.evaluate('document.documentElement.style.fontSize="100%"')
      const tab = label => cdp.evaluate('Array.from(document.querySelectorAll("nav button")).find(button=>button.textContent===' + JSON.stringify(label) + ').click()')
      await tab('HỒ SƠ')
      await cdp.waitFor('Boolean(document.querySelector("#profile-heading"))')
      assert.equal(await cdp.evaluate('document.querySelector("[role=region]").tabIndex'), 0)
      await cdp.evaluate('document.querySelector("[role=region]").focus()')
      assert.equal(await cdp.evaluate('document.activeElement.getAttribute("role")'), 'region')
      assert.equal(await cdp.evaluate('document.querySelectorAll("main").length'),1)
      await tab('AI')
      await cdp.waitFor('Boolean(document.querySelector("[role=log]"))')
      const aiTree=await cdp('Accessibility.getFullAXTree')
      for(const name of ['Câu hỏi lịch sử','Gửi câu hỏi']) assert.ok(aiTree.nodes.some(node=>!node.ignored&&node.name?.value===name))
      await cdp.evaluate('const input=document.querySelector("input"); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(input,"1954"); input.dispatchEvent(new Event("input",{bubbles:true}))')
      await cdp.evaluate('Array.from(document.querySelectorAll("button")).find(button=>button.getAttribute("aria-label")==="Gửi câu hỏi").click()')
      await cdp.waitFor('document.querySelector("[role=status]")?.textContent.includes("Đang tra cứu") || Array.from(document.querySelectorAll("[role=status]")).some(el=>el.textContent.includes("Đang tra cứu"))')
      assert.equal(await cdp.evaluate('getComputedStyle(document.querySelector("[role=log] [role=status] > div:last-child")).color'),'rgb(133, 80, 34)')
      await tab('HỌC')
      await cdp.evaluate('document.querySelector("[data-testid^=journey-open-chapter-]").click()')
      await cdp.waitFor('document.querySelectorAll("[data-testid^=journey-open-lesson-]").length===2')
      await cdp.evaluate('document.querySelectorAll("[data-testid^=journey-open-lesson-]")[1].click()')
      await cdp.waitFor('Boolean(document.querySelector("[data-testid=lesson-content]"))')
      assert.equal(await cdp.evaluate('document.querySelectorAll("main").length'),1)
      assert.equal(await cdp.evaluate('document.querySelector("[data-testid=lesson-content]").tagName'),'SECTION')

    })
  } finally { await new Promise((resolveServer,reject)=>server.httpServer.close(error=>error?reject(error):resolveServer())) }
})

test('lesson and quiz regions retain labels inside one application main landmark', async()=>{
  const server=await createServer({configFile:false,envDir:false,resolve:{alias:{'@':fileURLToPath(new URL('../../src',import.meta.url))}},optimizeDeps:{noDiscovery:true,entries:[]},server:{middlewareMode:true,hmr:false},appType:'custom'})
  try {
    const {LessonContentView}=await server.ssrLoadModule('/src/features/learning/lesson/LessonRenderer.tsx')
    const {QuizFlowView}=await server.ssrLoadModule('/src/features/quiz/v2/QuizFlowView.tsx')
    const lesson={lesson:{id:'qa-lesson',title:'Bài học kiểm thử',summary:'Fixture kỹ thuật'},blocks:[{id:'qa-text',kind:'text',documentId:'qa-doc',order:0,document:{id:'qa-doc',title:'Nội dung',sections:[{id:'qa-section',kind:'paragraph',text:'Nội dung kiểm thử'}]}}]}
    const session={delivery:{set:{id:'qa-quiz',title:'Bài kiểm tra',mode:'practice',questionIds:['qa-q'],learningObjectiveIds:[]},questions:[{id:'qa-q',prompt:'Câu hỏi kiểm thử',options:[{id:'a',label:'Lựa chọn'}]}]},answers:{}}
    const noop=()=>{}
    const html=renderToStaticMarkup(React.createElement('main',{id:'qa-main'},
      React.createElement(LessonContentView,{content:lesson}),
      ...Array.from({length:2},()=>React.createElement(QuizFlowView,{session,receipt:{mode:'practice',feedback:[]},submitting:false,answersLocked:false,onToggle:noop,onSubmit:noop,onEditAfterError:noop,onRetryPractice:noop}))))
    assert.equal((html.match(/<main[ >]/g)||[]).length,1)
    const ids=Array.from(html.matchAll(/\sid="([^"]+)"/g),match=>match[1])
    assert.equal(new Set(ids).size,ids.length,'repeated quiz consumers have unique heading, result and input IDs')
    const namedSections=Array.from(html.matchAll(/aria-labelledby="([^"]+)"/g),match=>match[1])
    assert.equal(namedSections.length,5,'lesson and both quiz/result sections stay named')
    for(const id of namedSections) assert.ok(ids.includes(id),'region label resolves: '+id)
    for(const tag of ['h1','h2']) {
      const quizHeadingIds=Array.from(html.matchAll(new RegExp('<'+tag+' id="([^"]+)"[^>]*>(Bài kiểm tra|Kết quả luyện tập)</'+tag+'>','g')),match=>match[1])
      assert.equal(quizHeadingIds.length,2)
      assert.ok(quizHeadingIds.every(id=>namedSections.includes(id)),'each quiz section names its own '+tag)
    }
    const controls=Array.from(html.matchAll(/<input id="([^"]+)"/g),match=>match[1])
    const labels=Array.from(html.matchAll(/<label[^>]*for="([^"]+)"/g),match=>match[1])
    assert.equal(controls.length,2)
    assert.deepEqual(labels,controls,'each repeated option label targets its own control')
  } finally { await server.close() }
})
