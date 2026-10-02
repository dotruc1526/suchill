import test from 'node:test'
import assert from 'node:assert/strict'
import { createLearningRpc, databaseError } from '../../src/services/supabase/rpc.ts'
import { publishedStoragePath, createSupabaseMedia } from '../../src/services/supabase/media.ts'
import { createAccountReader } from '../../src/services/supabase/accountReads.ts'
import type { SupabaseClient } from '@supabase/supabase-js'

test('RPC boundary routes exact IDs and original operation identity, without supplying a user ID', async () => {
  const calls: unknown[] = []
  const rpc = createLearningRpc(async (name, args) => { calls.push({ name, args }); return { data: { id: 'result' }, error: null } })
  await rpc.read('video_progress', 'lesson-uuid', 'block-uuid')
  await rpc.command('complete_lesson', { lessonId: 'lesson-uuid', operationId: 'retry-same' })
  assert.deepEqual(calls, [
    { name: 'learning_read', args: { p_kind: 'video_progress', p_id: 'lesson-uuid', p_secondary_id: 'block-uuid' } },
    { name: 'learning_command', args: { p_kind: 'complete_lesson', p_input: { lessonId: 'lesson-uuid', operationId: 'retry-same' } } },
  ])
})

test('database, network and malformed responses become domain errors and never expose raw messages', async () => {
  assert.equal(databaseError('42501'), 'unauthorized')
  assert.equal(databaseError('40001'), 'conflict')
  assert.equal(databaseError('PT409'), 'conflict')
  assert.equal(databaseError('22P02'), 'validation')
  assert.equal(databaseError('P0002'), 'not_found')
  const fail = createLearningRpc(async () => ({ data: null, error: { code: '42501', message: 'sensitive text' } }))
  assert.deepEqual(await fail.read('account'), { ok: false, error: 'unauthorized' })
  const offline = createLearningRpc(async () => { throw new Error('must not call') }, () => false)
  assert.deepEqual(await offline.read('chapters'), { ok: false, error: 'offline' })
  const network = createLearningRpc(async () => { throw new Error('transport') })
  assert.deepEqual(await network.read('account'), { ok: false, error: 'server_error' })
})

test('published media resolves reviewed poster/captions/transcript and rejects draft/traversal paths', async () => {
  const rpc = createLearningRpc(async () => ({ data: {
    id: 'media', kind: 'video', title: 'Fixture', storageRef: 'published-media/video/file.mp4', reviewStatus: 'published', sourceIds: [],
    captionTracks: [{ id: 'caption', storageRef: 'published-media/video/vi.vtt', locale: 'vi-VN', label: 'Tiếng Việt' }],
    transcript: { id: 'transcript', storageRef: 'published-media/video/text.html', locale: 'vi-VN', label: 'Bản chép lời' },
    poster: { id: 'poster', storageRef: 'published-media/video/poster.png', altText: 'Poster' },
  }, error: null }))
  const result = await createSupabaseMedia(rpc, async ref => { const { bucket, path } = publishedStoragePath(ref); return `https://example.supabase.co/signed/${bucket}/${path}` }).getResolvedAsset('media')
  assert.equal(result.ok && result.value.fallback?.kind, 'transcript')
  assert.equal(result.ok && result.value.captionTracks[0].locale, 'vi-VN')
  assert.equal(result.ok && result.value.poster?.altText, 'Poster')
  assert.throws(() => publishedStoragePath('draft-media/secret.mp4'))
  assert.throws(() => publishedStoragePath('published-media/../secret.mp4'))
})

test('account reads reject an A to B to A transition even for settings DTOs without an owner field', async () => {
  let userId = 'A', removed = 0, listener: (event: string, session: unknown) => void = () => {}
  const client = { auth: {
    getSession: async () => ({ data: { session: { user: { id: userId } } }, error: null }),
    onAuthStateChange: (callback: typeof listener) => { listener = callback; return { data: { subscription: { unsubscribe() { removed++ } } } } },
  } } as unknown as Pick<SupabaseClient, 'auth'>
  const change = (id: string) => { userId = id; listener('SIGNED_IN', { user: { id } }) }
  const rpc = createLearningRpc(async () => {
    change('B')
    const data = { soundMuted: true, timezone: 'UTC' }
    change('A')
    return { data, error: null }
  })
  assert.deepEqual(await createAccountReader(client, rpc)('settings'), { ok: false, error: 'unauthorized' })
  assert.equal(removed, 1, 'A rejected read does not retain its SDK observer.')
})

test('account read checks returned progress ownership and does not reject same-user token refresh', async () => {
  let removed = 0, listener: (event: string, session: unknown) => void = () => {}
  const client = { auth: {
    getSession: async () => ({ data: { session: { user: { id: 'A' } } }, error: null }),
    onAuthStateChange: (callback: typeof listener) => { listener = callback; return { data: { subscription: { unsubscribe() { removed++ } } } } },
  } } as unknown as Pick<SupabaseClient, 'auth'>
  let owner = 'B'
  const rpc = createLearningRpc(async () => {
    listener('TOKEN_REFRESHED', { user: { id: 'A' } })
    return { data: { userId: owner, lessonId: 'lesson' }, error: null }
  })
  const read = createAccountReader(client, rpc)
  assert.deepEqual(await read('lesson_progress', 'lesson'), { ok: false, error: 'unauthorized' })
  owner = 'A'
  assert.deepEqual(await read('lesson_progress', 'lesson'), { ok: true, value: { userId: 'A', lessonId: 'lesson' } })
  assert.equal(removed, 2)
})
