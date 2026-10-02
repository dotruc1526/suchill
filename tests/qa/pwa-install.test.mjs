import assert from 'node:assert/strict'
import test from 'node:test'
import { pwaHarness } from './pwaHarness.mjs'
import { findBrowser, withChromePage } from './chromeHarness.mjs'

test('owned desktop Chrome profile installs and launches manifest identity in standalone mode', async t => {
  await pwaHarness(async ({origin}) => {
    await withChromePage(findBrowser(), origin+'/', async cdp => {
      await cdp.waitFor('Boolean(window.__pwaQA && navigator.serviceWorker.controller)')
      const manifestId=origin+'/'
      let installed=false
      try {
        try { await cdp('PWA.install',{manifestId,installUrlOrBundleUrl:manifestId}) }
        catch(error) { if(error.message.includes('PWA.install') && error.message.includes('-32601')) { t.skip('Chrome lacks experimental PWA.install; actual icon launch still requires desktop manual evidence'); return } throw error }
        installed=true
        await cdp('PWA.changeAppUserSettings',{manifestId,displayMode:'standalone'})
        const {targetId}=await cdp('PWA.launch',{manifestId})
        const app=await cdp.attachTarget(targetId)
        await app.waitFor('Boolean(window.__pwaQA)','Installed app launch')
        assert.equal(await app.evaluate('window.__pwaQA.version'),'v1')
        assert.equal(await app.evaluate('matchMedia("(display-mode: standalone)").matches'),true)
        assert.equal(await app.evaluate('location.origin'),origin)
        console.log('Desktop Chrome standalone install and launch verified in isolated profile.')
      } finally { if(installed)await cdp('PWA.uninstall',{manifestId}) }
    }, {mountedSelector:'main'})
  })
})
