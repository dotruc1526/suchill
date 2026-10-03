import assert from 'node:assert/strict'
import test from 'node:test'
import { createAccountHandler } from '../../supabase/functions/account-access/handler.mjs'
const previewOrigin = 'https://suchill-preview--m6-android-1954-p8pbahbd.web.app'
const localOrigins = ['http://localhost:8443','http://127.0.0.1:8443','http://localhost:5173','http://127.0.0.1:5173']
const handler = createAccountHandler({url:'https://owned-test.invalid',secretKey:'owned-test-only',publishableKey:'owned-public',origins:[...localOrigins,previewOrigin]},()=>{assert.fail('preflight/denied origin must not contact backend')})
test('exact temporary preview and preserved local origins pass preflight without wildcard',async()=>{
  for(const origin of [previewOrigin,...localOrigins]) {
    const response=await handler(new Request('https://owned-test.invalid/account-access',{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'apikey,authorization,content-type,x-client-info'}}))
    assert.equal(response.status,204)
    assert.equal(response.headers.get('access-control-allow-origin'),origin)
    assert.equal(response.headers.get('cache-control'),'no-store')
    assert.equal(response.headers.get('vary'),'Origin')
  }
})
test('arbitrary origins and lookalike previews remain denied before any Auth/backend request',async()=>{
  for(const origin of ['https://example.invalid',previewOrigin+'.example.invalid','http://'+new URL(previewOrigin).host,'https://suchill-preview--other.web.app']) {
    for(const method of ['OPTIONS','POST']) {
      const response=await handler(new Request('https://owned-test.invalid/account-access',{method,headers:{Origin:origin}}))
      assert.equal(response.status,403);assert.equal(response.headers.get('access-control-allow-origin'),null)
    }
  }
})
