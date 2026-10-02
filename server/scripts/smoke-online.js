import assert from 'node:assert/strict';
import { io } from 'socket.io-client';

export async function smokeOnline(serverUrl, frontendOrigin) {
  const server = new URL(serverUrl), origin = new URL(frontendOrigin);
  for (const url of [server, origin]) {
    assert.ok(url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname)), 'Public endpoints require HTTPS');
    assert.equal(url.pathname, '/', 'Provide origins without subpaths');
    assert.ok(!url.username && !url.password && !url.search && !url.hash, 'Origins must not contain credentials/query/fragment');
  }
  const clients = [];
  const headers = { Origin: origin.origin };
  const health = await fetch(`${server.origin}/health`, { headers, signal: AbortSignal.timeout(10000) });
  assert.equal(health.status, 200);
  assert.equal(health.headers.get('access-control-allow-origin'), origin.origin);
  assert.equal((await health.json()).status, 'ok');
  function event(socket, name) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { socket.off(name, handle); reject(new Error(`Timeout: ${name}`)); }, 12000);
      const handle = data => { clearTimeout(timer); resolve(data); };
      socket.once(name, handle);
    });
  }
  try {
    for (const name of ['Deployment probe A', 'Deployment probe B']) {
      const response = await fetch(`${server.origin}/session`, {
        method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name }), signal: AbortSignal.timeout(10000),
      });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('cache-control'), 'no-store');
      const credential = await response.json();
      const socket = io(server.origin, { auth: { token: credential.token }, extraHeaders: headers,
        autoConnect: false, reconnection: false, forceNew: true });
      clients.push(socket);
      const connected = event(socket, 'connect'); socket.connect(); await connected;
    }
    const matches = clients.map(socket => event(socket, 'match_found'));
    clients.forEach(socket => socket.emit('join_queue'));
    const [a, b] = await Promise.all(matches);
    assert.equal(a.roomId, b.roomId);
    assert.notEqual(a.player.userId, b.player.userId);
    const questions = clients.map(socket => event(socket, 'question_start'));
    clients.forEach(socket => socket.emit('ready', { roomId: a.roomId }));
    const [qa, qb] = await Promise.all(questions);
    assert.deepEqual(qa, qb);
    assert.equal(qa.question.correctIndex, undefined);
    const results = clients.map(socket => event(socket, 'game_over'));
    clients[0].emit('forfeit', { roomId: a.roomId });
    const [ra, rb] = await Promise.all(results);
    assert.equal(ra.isWin, false); assert.equal(rb.isWin, true);
    assert.equal(ra.rewardsPersisted, false);
    return { health: 'passed', origin: 'passed', twoClients: 'passed', sameQuestion: 'passed', forfeit: 'passed', rewardsPersisted: false };
  } finally { clients.forEach(socket => socket.disconnect()); }
}

if (process.argv[1]?.endsWith('smoke-online.js')) {
  try {
    const [server, origin] = process.argv.slice(2);
    assert.ok(server && origin, 'Usage: node server/scripts/smoke-online.js SERVER_ORIGIN FRONTEND_ORIGIN');
    console.log(JSON.stringify(await smokeOnline(server, origin)));
  } catch (error) { console.error(`Deployment check failed: ${error.message}`); process.exitCode = 1; }
}
