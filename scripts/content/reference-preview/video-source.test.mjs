import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createReferenceVideoLoader } from './video-source.ts'
const original = await readFile(new URL('../../../docs/content/preview1954-v1/pilot-mobile.mp4', import.meta.url))
const hash = createHash('sha256').update(original).digest('hex')
const digest = async bytes => createHash('sha256').update(bytes).digest('hex')
test('full-file transport verifies unchanged bytes, shares one download and revokes its page URL', async () => {
  let downloads = 0, revoked = [], blobBytes
  const loader = createReferenceVideoLoader(hash, {
    async fetchFile(url,options) { downloads++; assert.equal(url,'/reference-media/pilot-mobile.mp4');assert.equal(options.credentials,'omit');assert.equal(options.cache,'no-store');return new Response(original,{headers:{'Content-Type':'video/mp4'}}) },
    hash:digest,createUrl(blob) {blobBytes=blob;return 'blob:owned-test'},revokeUrl:url=>revoked.push(url),
  })
  assert.deepEqual(await Promise.all([loader.getUrl(),loader.getUrl()]),['blob:owned-test','blob:owned-test'])
  assert.equal(downloads,1)
  assert.deepEqual(Buffer.from(await blobBytes.arrayBuffer()),original)
  assert.equal(await loader.getUrl(),'blob:owned-test')
  loader.dispose();assert.deepEqual(revoked,['blob:owned-test'])
  await assert.rejects(loader.getUrl(),/closed/)
})
test('transport refuses truncated, oversized, altered and unavailable media before creating a URL', async () => {
  for(const body of [original.subarray(0,64),Buffer.alloc(original.length+1),Buffer.alloc(original.length)]) {
    const loader=createReferenceVideoLoader(hash,{fetchFile:async()=>new Response(body,{headers:{'Content-Type':'video/mp4'}}),hash:digest,createUrl(){assert.fail('Must not create URL for invalid media')},revokeUrl(){}})
    await assert.rejects(loader.getUrl(),/integrity|too large/);loader.dispose()
  }
  let attempts=0
  const loader=createReferenceVideoLoader(hash,{fetchFile:async()=>{attempts++;return new Response('unavailable',{status:503})},hash:digest,createUrl(){assert.fail('Invalid response')},revokeUrl(){}})
  await assert.rejects(loader.getUrl(),/unavailable/);await assert.rejects(loader.getUrl(),/unavailable/)
  assert.equal(attempts,2);loader.dispose()
})
