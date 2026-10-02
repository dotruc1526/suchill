import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveGameServerUrl } from '../../src/services/gameServerConfig.ts';

test('a deployed HTTPS frontend must use a configured HTTPS game origin', () => {
  const location = { protocol: 'https:', hostname: 'app.example.com' };
  assert.equal(resolveGameServerUrl(' https://game.example.com/ ', location), 'https://game.example.com');
  assert.throws(() => resolveGameServerUrl('', location), /Chưa cấu hình/);
  assert.throws(() => resolveGameServerUrl('http://game.example.com', location), /HTTPS/);
});
test('game config rejects credentials, paths, callbacks and non-HTTP transports', () => {
  const location = { protocol: 'https:', hostname: 'app.example.com' };
  for (const value of ['https://user:pass@game.example.com', 'https://game.example.com/socket.io', 'https://game.example.com?token=owned', 'https://game.example.com#callback', 'wss://game.example.com']) {
    assert.throws(() => resolveGameServerUrl(value, location));
  }
});
test('only loopback development uses the local game server fallback', () => {
  assert.equal(resolveGameServerUrl('', { protocol: 'http:', hostname: 'localhost' }), 'http://localhost:3001');
  assert.throws(() => resolveGameServerUrl('', { protocol: 'http:', hostname: '192.168.1.20' }), /Chưa cấu hình/);
});
