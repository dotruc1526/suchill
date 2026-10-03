import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createGameServer } from '../server.js';
import { smokeOnline } from '../scripts/smoke-online.js';

test('deployment probe exercises health/CORS/session/queue/questions/result on a real server', async t => {
  const origin = 'http://localhost:8443';
  const server = createGameServer({ origins: [origin], game: { countdownMs: 5 } });
  await new Promise(resolve => server.httpServer.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const result = await smokeOnline(`http://127.0.0.1:${server.httpServer.address().port}`, origin);
  assert.equal(result.twoClients, 'passed');
  assert.equal(result.rewardsPersisted, false);
});
