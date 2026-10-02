import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waitForGameServer } from '../../src/services/gameServerReadiness.ts';

test('a sleeping host is retried until healthy without caching or sending credentials', async () => {
  let calls = 0;
  const statuses: string[] = [];
  await waitForGameServer('https://game.example.com', { signal: new AbortController().signal, pollMs: 0,
    onStatus: message => statuses.push(message), fetcher: async (url, options) => {
      assert.equal(url, 'https://game.example.com/health');
      assert.equal(options?.cache, 'no-store'); assert.equal(options?.credentials, 'omit');
      calls++;
      return calls === 1 ? new Response('starting', { status: 503 }) : Response.json({ status: 'ok' });
    } });
  assert.equal(calls, 2);
  assert.ok(statuses.some(message => message.includes('khởi động')));
});
test('leaving a feature cancels an in-flight warmup instead of creating a guest session', async () => {
  const abort = new AbortController();
  const request = waitForGameServer('https://game.example.com', { signal: abort.signal, fetcher: (_url, options) =>
    new Promise((_resolve, reject) => options?.signal?.addEventListener('abort', () => reject(options.signal?.reason), { once: true })) });
  abort.abort();
  await assert.rejects(request);
});
test('an unreachable host has a bounded error and never becomes ready', async () => {
  await assert.rejects(waitForGameServer('https://game.example.com', { signal: new AbortController().signal,
    timeoutMs: 5, pollMs: 0, fetcher: async () => new Response('unavailable', { status: 503 }) }), /chưa sẵn sàng/);
});
