import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { createHostedContext, check, value, denied, png, boundedFetch } from './context.mjs'
import { ids, mediaPrefix } from './ids.mjs'

let ctx
before(async () => {
  ctx = await createHostedContext()
  const assets = [
    ['published-media', 'fixture-poster.webp', png, 'image/png'],
    ['published-media', 'fixture-video.mp4', Buffer.from('Technical Storage transport fixture; not playable video.'), 'video/mp4'],
    ['published-media', 'fixture.vtt', Buffer.from('WEBVTT\n\n00:00.000 --> 00:01.000\nNội dung kiểm thử kỹ thuật.\n'), 'text/vtt'],
    ['published-media', 'fixture.txt', Buffer.from('Bản chép lời fixture kỹ thuật, không phải nội dung canonical.'), 'text/plain'],
    ['published-media', 'unapproved.webp', png, 'image/png'],
    ['draft-media', 'private.webp', png, 'image/png'],
  ]
  for (const [bucket, filename, body, contentType] of assets) {
    check((await ctx.admin.storage.from(bucket).upload(mediaPrefix + filename, body, { contentType, upsert: true })).error,
      'Upload dedicated technical fixture via real Storage API')
  }
  for (const owner of [ctx.a, ctx.b]) {
    const path = `${owner.id}/hosted-transport-avatar.png`
    ctx.avatarPaths.add(path)
    check((await owner.client.storage.from('user-avatars').upload(path, png, { contentType: 'image/png', cacheControl: '0' })).error,
      'Upload own valid avatar over Storage API')
  }
})
after(async () => { await ctx?.cleanup() })

test('actual Storage private buckets and anonymous signed delivery serve only exact reviewed assets', async () => {
  for (const bucket of ['published-media', 'draft-media', 'user-avatars']) {
    const result = await ctx.admin.storage.getBucket(bucket)
    check(result.error, 'Read trusted bucket configuration')
    assert.equal(result.data.public, false, 'Every project learning bucket remains private')
    assert.ok(result.data.file_size_limit > 0)
  }
  const media = value(await ctx.services(ctx.anon).media.getResolvedAsset(ids.video))
  assert.equal('storageRef' in media, false)
  assert.equal(media.captionTracks[0].locale, 'vi-VN')
  assert.equal(media.fallback.kind, 'transcript')
  const urls = [media.url, media.poster.url, media.captionTracks[0].url, media.transcript.url]
  for (const signedUrl of urls) {
    const parsed = new URL(signedUrl)
    assert.ok(parsed.origin === ctx.config.url && parsed.pathname.includes('/object/sign/published-media/'),
      'Media adapter must produce real private-bucket signed URLs')
    const response = await boundedFetch(signedUrl)
    assert.equal(response.status, 200, 'Issued signed URL must download through real HTTP')
    assert.ok((await response.arrayBuffer()).byteLength > 0)
  }
  const caption = await boundedFetch(media.captionTracks[0].url)
  assert.ok((await caption.text()).startsWith('WEBVTT'))
  const publicUrl = ctx.anon.storage.from('published-media').getPublicUrl(`${mediaPrefix}fixture-video.mp4`).data.publicUrl
  assert.notEqual((await boundedFetch(publicUrl)).status, 200, 'Unsigned public URL cannot bypass the private bucket')
  const tampered = new URL(media.url)
  tampered.searchParams.set('token', 'invalid-technical-token')
  assert.notEqual((await boundedFetch(tampered)).status, 200, 'Tampered signing token must fail')
  for (const client of [ctx.anon, ctx.a.client, ctx.b.client]) {
    const listing = await client.storage.from('published-media').list('hosted-technical/v1')
    check(listing.error, 'Reviewed media listing')
    assert.deepEqual(listing.data.map(row => row.name).sort(), ['fixture-poster.webp', 'fixture-video.mp4', 'fixture.txt', 'fixture.vtt'].sort())
    denied(await client.storage.from('published-media').createSignedUrl(`${mediaPrefix}unapproved.webp`, 60), 'Unreferenced published path signing')
    denied(await client.storage.from('draft-media').createSignedUrl(`${mediaPrefix}private.webp`, 60), 'Draft media signing')
    denied(await client.storage.from('draft-media').download(`${mediaPrefix}private.webp`), 'Draft media download')
  }
})

test('real Storage avatar reads, signing, writes, deletes and MIME limits stay account scoped', async () => {
  const ownPath = `${ctx.a.id}/hosted-transport-avatar.png`
  const bucketA = ctx.a.client.storage.from('user-avatars')
  const bucketB = ctx.b.client.storage.from('user-avatars')
  check((await bucketA.download(ownPath)).error, 'A downloads its own avatar')
  const signed = await bucketA.createSignedUrl(ownPath, 60)
  check(signed.error, 'A signs its own avatar')
  assert.equal((await boundedFetch(signed.data.signedUrl)).status, 200)
  denied(await bucketB.download(ownPath), 'B reading A avatar')
  denied(await bucketB.createSignedUrl(ownPath, 60), 'B signing A avatar')
  denied(await ctx.anon.storage.from('user-avatars').download(ownPath), 'Anon reading avatar')
  denied(await bucketB.update(ownPath, png, { contentType: 'image/png' }), 'B overwriting A avatar')
  const spoofPath = `${ctx.a.id}/hosted-transport-spoof.png`
  ctx.avatarPaths.add(spoofPath)
  denied(await bucketB.upload(spoofPath, png, { contentType: 'image/png' }), 'B inserting inside A avatar folder')
  const removedByB = await bucketB.remove([ownPath])
  assert.ok(removedByB.error || removedByB.data.length === 0, 'Other-user removal must delete no object')
  check((await bucketA.download(ownPath)).error, 'A avatar survives B removal attempt')
  const wrongMime = `${ctx.a.id}/hosted-transport-invalid.txt`
  ctx.avatarPaths.add(wrongMime)
  denied(await bucketA.upload(wrongMime, Buffer.from('invalid avatar'), { contentType: 'text/plain' }), 'Avatar MIME restriction')
  for (const bucket of ['published-media', 'draft-media']) {
    const path = `${mediaPrefix}forged-${ctx.marker}.png`
    ctx.attemptedStorage.push({ bucket, path })
    denied(await ctx.b.client.storage.from(bucket).upload(path, png, { contentType: 'image/png' }), 'Client editorial upload')
  }
  check((await bucketA.update(ownPath, png, { contentType: 'image/png', cacheControl: '0' })).error, 'A updates own avatar')
  const removedByA = await bucketA.remove([ownPath])
  check(removedByA.error, 'A removes own avatar')
  assert.equal(removedByA.data.length, 1)
  const remaining = await bucketA.list(ctx.a.id)
  check(remaining.error, 'List own avatar folder after removal')
  assert.ok(!remaining.data.some(row => row.name === 'hosted-transport-avatar.png'))
  denied(await bucketA.createSignedUrl(ownPath, 60), 'Removed avatar no longer receives new signatures')
  denied(await bucketA.download(ownPath, { cacheNonce: `deleted-${ctx.marker}` }, { cache: 'no-store' }),
    'Removed own avatar no longer downloads through an uncached request')
})
