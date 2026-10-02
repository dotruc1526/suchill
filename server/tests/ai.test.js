import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGameServer } from '../server.js';

test('AI endpoint validates input and responds with reply', async t => {
  const origin = 'http://localhost:8443';
  const server = createGameServer({ origins: [origin] });
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
