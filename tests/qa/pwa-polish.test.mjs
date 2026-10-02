import assert from 'node:assert/strict'
import test from 'node:test'
import { preview } from 'vite'
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
      // Follow an in-page skip link without mistaking its anchor for an Auth callback or cache proof.
      await cdp.evaluate('history.replaceState(history.state,"",location.pathname)')
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
    })
  } finally { await new Promise((resolveServer,reject)=>server.httpServer.close(error=>error?reject(error):resolveServer())) }
})
