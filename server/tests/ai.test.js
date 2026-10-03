import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGameServer } from '../server.js';
import { askSuu } from '../aiService.js';

test('AI prompt does not claim to retrieve sources it did not fetch', async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  const previousFetch = globalThis.fetch;
  let request;
  process.env.GEMINI_API_KEY = 'test-key';
  globalThis.fetch = async (_url, options) => {
    request = JSON.parse(options.body);
    return Response.json({ candidates: [{ content: { parts: [{ text: 'Không chắc.' }] } }] });
  };
  try {
    assert.deepEqual(await askSuu('Hỏi thử'), { reply: 'Không chắc.' });
    const instruction = request.systemInstruction.parts[0].text;
    assert.match(instruction, /không tra cứu nguồn/i);
    assert.match(instruction, /đối chiếu tài liệu chính thống/i);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
});

test('AI endpoint validates input and responds with reply', async t => {
  const origin = 'http://localhost:8443';
  const server = createGameServer({ origins: [origin], askSuu: async () => ({ reply: 'Demo reply' }) });
  await new Promise(resolve => server.httpServer.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());

  const baseUrl = `http://127.0.0.1:${server.httpServer.address().port}`;

  // 1. Missing question -> 400
  const badRes = await fetch(`${baseUrl}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({}),
  });
  assert.equal(badRes.status, 400);

  // 2. Disallowed origin -> 403
  const forbiddenRes = await fetch(`${baseUrl}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://malicious.site' },
    body: JSON.stringify({ question: 'Hello' }),
  });
  assert.equal(forbiddenRes.status, 403);

  // 3. Valid question -> 200 with reply string
  const goodRes = await fetch(`${baseUrl}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body: JSON.stringify({ question: 'Xin chào SỬu' }),
  });
  assert.equal(goodRes.status, 200);
  const data = await goodRes.json();
  assert.equal(typeof data.reply, 'string');
  assert.ok(data.reply.length > 0);
});

test('AI calls are rate limited before the provider is contacted', async t => {
  const origin = 'http://localhost:8443';
  let calls = 0;
  const server = createGameServer({ origins: [origin], askSuu: async () => { calls++; return { reply: 'Demo' }; } });
  await new Promise(resolve => server.httpServer.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const url = `http://127.0.0.1:${server.httpServer.address().port}/api/ai/chat`;
  for (let i = 0; i < 11; i++) {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify({ question: 'demo' }) });
    assert.equal(response.status, i < 10 ? 200 : 429);
  }
  assert.equal(calls, 10);
});

test('production does not expose the development account proxy or accept LAN origins', async t => {
  const saved = { NODE_ENV: process.env.NODE_ENV, ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS, SESSION_SECRET: process.env.SESSION_SECRET };
  process.env.NODE_ENV = 'production';
  process.env.ALLOWED_ORIGINS = 'https://app.example.com';
  process.env.SESSION_SECRET = 'test-secret-for-production-at-least-32-characters';
  const server = createGameServer({ askSuu: async () => ({ reply: 'Demo' }) });
  await new Promise(resolve => server.httpServer.listen(0, '127.0.0.1', resolve));
  t.after(async () => { await server.close(); for (const [key, value] of Object.entries(saved)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } });
  const url = `http://127.0.0.1:${server.httpServer.address().port}`;
  const proxy = await fetch(`${url}/api/account-access`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://app.example.com' }, body: '{}' });
  assert.equal(proxy.status, 404);
  const lan = await fetch(`${url}/api/ai/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://192.168.1.20:8443' }, body: JSON.stringify({ question: 'demo' }) });
  assert.equal(lan.status, 403);
});
