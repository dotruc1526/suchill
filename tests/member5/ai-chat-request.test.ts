import { test } from 'node:test'
import assert from 'node:assert/strict'
import { requestHistoryReply } from '../../src/services/aiChatRequest.ts'

test('AI request releases a stalled connection and a stalled response body', async () => {
  for (const bodyStalls of [false, true]) {
    let aborted = false
    const fetcher = (async (_url, init) => {
      const stalled = () => new Promise<never>((_resolve, reject) => {
        init!.signal!.addEventListener('abort', () => {
          aborted = true; reject(new Error('Aborted'))
        }, { once: true })
      })
      if (!bodyStalls) return stalled()
      return { ok: true, json: stalled } as unknown as Response
    }) as typeof fetch
    assert.equal(await requestHistoryReply('https://backend.example', 'Hỏi thử', { fetcher, timeoutMs: 20 }), null)
    assert.equal(aborted, true)
  }
})

test('AI response validates status, JSON and reply before display', async () => {
  for (const response of [Response.json({}, { status: 503 }), Response.json({ reply: ' ' }), Response.json({ reply: 7 }), new Response('invalid')]) {
    assert.equal(await requestHistoryReply('https://backend.example', 'Hỏi thử', { fetcher: async () => response }), null)
  }
  assert.equal(await requestHistoryReply('https://backend.example', 'Hỏi thử', { fetcher: async () => Response.json({ reply: ' Trả lời ' }) }), 'Trả lời')
})
