import { test } from 'node:test';
import assert from 'node:assert/strict';
import { io } from 'socket.io-client';
import { createGameServer } from '../server.js';
import { questions } from '../questionsData.js';
import { createSessionStore } from '../sessionStore.js';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function event(socket, name, predicate = () => true) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { socket.off(name, handler); reject(new Error(`Timeout: ${name}`)); }, 4000);
    function handler(value) { if (predicate(value)) { clearTimeout(timeout); socket.off(name, handler); resolve(value); } }
    socket.on(name, handler);
  });
}
async function fixture(t, game = {}) {
  const server = createGameServer({ game: { countdownMs: 5, questionMs: 1200, transitionMs: 35, questionCount: 2, reconnectMs: 400, ...game } });
  await new Promise(resolve => server.httpServer.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.httpServer.address().port}`;
  const clients = [];
  t.after(async () => { for (const client of clients) client.disconnect(); await server.close(); });
  async function connect(token) {
    const socket = io(url, { auth: { token }, transports: ['websocket'], reconnection: false, autoConnect: false });
    clients.push(socket);
    const ready = event(socket, 'connect'); socket.connect(); await ready;
    return socket;
  }
  async function player(name) {
    const response = await fetch(`${url}/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: name }) });
    const credential = await response.json();
    return { socket: await connect(credential.token), ...credential };
  }
  return { url, player, connect, clients };
}
async function match(a, b) {
  const foundA = event(a, 'match_found'), foundB = event(b, 'match_found');
  a.emit('join_queue', { userId: 'forged', exp: 999999 }); b.emit('join_queue');
  const [ma, mb] = await Promise.all([foundA, foundB]);
  assert.equal(ma.roomId, mb.roomId);
  const qa = event(a, 'question_start'), qb = event(b, 'question_start');
  a.emit('ready', { roomId: ma.roomId }); b.emit('ready', { roomId: mb.roomId });
  const [question, other] = await Promise.all([qa, qb]);
  assert.deepEqual(question, other);
  return { ...question, roomId: ma.roomId };
}

test('standings use verified identity and a completed server result, ignoring client RP', async t => {
  const f = await fixture(t), a = await f.player('Real A'), b = await f.player('Real B');
  const initial = event(a.socket, 'pvp_standings'); a.socket.emit('get_standings', { rp: 999999 });
  assert.deepEqual((await initial).entries, []);
  const question = await match(a.socket, b.socket);
  const result = event(a.socket, 'game_over'), ranking = event(a.socket, 'pvp_standings');
  b.socket.emit('forfeit', { roomId: question.roomId });
  assert.equal((await result).isWin, true);
  const value = await ranking;
  assert.equal(value.profile.userId, a.player.userId);
  assert.equal(value.profile.rp, 50); assert.equal(value.profile.matches, 1);
  assert.equal(value.entries.length, 2);
  assert.equal(value.entries[0].username, 'Real A');
});

test('credentials reject tampering and malformed tokens', () => {
  const sessions = createSessionStore('test-secret');
  const issued = sessions.issue('Bạn');
  assert.equal(sessions.verify(issued.token).userId, issued.player.userId);
  assert.equal(sessions.verify(`${issued.token}x`), null);
  assert.equal(sessions.verify(null), null);
});

test('six concurrent queue clients form three distinct real-player matches', async t => {
  const f = await fixture(t);
  const players = await Promise.all(['A', 'B', 'C', 'D', 'E', 'F'].map(f.player));
  const results = players.map(p => event(p.socket, 'match_found'));
  for (const p of players) { p.socket.emit('join_queue'); p.socket.emit('join_queue'); }
  const matches = await Promise.all(results);
  const rooms = new Map();
  for (let i = 0; i < matches.length; i++) {
    const result = matches[i];
    assert.notEqual(result.opponent.userId, players[i].player.userId);
    assert.ok(players.some(p => p.player.userId === result.opponent.userId));
    rooms.set(result.roomId, (rooms.get(result.roomId) || 0) + 1);
  }
  assert.equal(rooms.size, 3);
  assert.deepEqual([...rooms.values()], [2, 2, 2]);
});

test('polling-only clients play when a network blocks WebSocket upgrades', async t => {
  const f = await fixture(t);
  async function polling(name) {
    const response = await fetch(`${f.url}/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: name }) });
    const { token } = await response.json();
    const socket = io(f.url, { auth: { token }, transports: ['polling'], autoConnect: false, reconnection: false });
    f.clients.push(socket);
    const connected = event(socket, 'connect'); socket.connect(); await connected;
    return socket;
  }
  const a = await polling('A'), b = await polling('B');
  assert.ok((await match(a, b)).roomId);
  assert.equal(a.io.engine.transport.name, 'polling');
  assert.equal(b.io.engine.transport.name, 'polling');
});

test('a lone player stays in queue without a bot; cancelling returns idle', async t => {
  const f = await fixture(t); const a = await f.player('A');
  let matches = 0; a.socket.on('match_found', () => matches++);
  const searching = event(a.socket, 'searching'); a.socket.emit('join_queue'); await searching;
  await wait(10500); assert.equal(matches, 0);
  const idle = event(a.socket, 'idle'); a.socket.emit('cancel_queue'); await idle;
});

test('two network clients share questions; answers are hidden, locked once and server-scored', async t => {
  const f = await fixture(t); const a = await f.player('A'), b = await f.player('B');
  const q = await match(a.socket, b.socket);
  assert.equal(q.question.correctIndex, undefined); assert.equal(q.question.explanation, undefined);
  const correct = questions.find(item => item.id === q.questionId).correctIndex;
  let earlyResults = 0; a.socket.on('answer_result', () => earlyResults++);
  const locked = event(a.socket, 'answer_locked');
  a.socket.emit('submit_answer', { ...q, answerIndex: correct }); await locked;
  a.socket.emit('submit_answer', { ...q, answerIndex: correct });
  await wait(50); assert.equal(earlyResults, 0);
  const ended = event(a.socket, 'question_end');
  b.socket.emit('submit_answer', { ...q, answerIndex: (correct + 1) % 4 });
  const result = await ended; assert.ok(result.myScore >= 100 && result.myScore <= 110); assert.equal(result.opponentScore, 0);
  const snapshot = await event(a.socket, 'game_snapshot', s => s.phase === 'question_end' || s.currentQuestion?.questionNum === 2);
  assert.notEqual(snapshot.player.userId, 'forged');
});

test('pending answers disclose neither score nor correctness through snapshots or opponent events', async t => {
  const f = await fixture(t, { questionMs: 3000, transitionMs: 500 });
  const a = await f.player('A'), b = await f.player('B');
  const q = await match(a.socket, b.socket);
  const correct = questions.find(item => item.id === q.questionId).correctIndex;
  const opponentAnswered = event(b.socket, 'opponent_answered');
  const locked = event(a.socket, 'answer_locked');
  a.socket.emit('submit_answer', { ...q, answerIndex: correct });
  await locked;
  assert.equal((await opponentAnswered).score, undefined);
  const [mine, theirs] = await Promise.all([
    event(a.socket, 'game_snapshot', s => s.phase === 'playing' && s.selectedAnswer === correct),
    event(b.socket, 'game_snapshot', s => s.phase === 'playing' && s.opponentAnswered),
  ]);
  assert.equal(mine.myScore, 0); assert.equal(mine.myCombo, 0); assert.equal(mine.myExpEarned, 0);
  assert.equal(theirs.opponentScore, 0); assert.equal(mine.answerResult, null);
  const ended = event(a.socket, 'question_end');
  b.socket.emit('submit_answer', { ...q, answerIndex: (correct + 1) % 4 });
  assert.ok((await ended).myScore >= 100);
  const revealed = await event(a.socket, 'game_snapshot', s => s.phase === 'question_end');
  assert.ok(revealed.myScore >= 100); assert.equal(revealed.myCombo, 1);
});

test('private rooms reject self join and start with a second player', async t => {
  const f = await fixture(t); const a = await f.player('A'), b = await f.player('B');
  const created = event(a.socket, 'room_created'); a.socket.emit('create_room'); const room = await created;
  const error = event(a.socket, 'error'); a.socket.emit('join_room', { code: room.code }); await error;
  const foundA = event(a.socket, 'match_found'), foundB = event(b.socket, 'match_found');
  b.socket.emit('join_room', { code: room.code });
  const [ma, mb] = await Promise.all([foundA, foundB]); assert.equal(ma.roomId, mb.roomId);
});

test('foreign room forfeit and stale/invalid answers cannot alter the match', async t => {
  const f = await fixture(t); const a = await f.player('A'), b = await f.player('B'), outsider = await f.player('C');
  const q = await match(a.socket, b.socket);
  let over = 0; a.socket.on('game_over', () => over++);
  outsider.socket.emit('forfeit', { roomId: q.roomId });
  a.socket.emit('submit_answer', { roomId: q.roomId, questionId: -1, answerIndex: 0 });
  a.socket.emit('submit_answer', { roomId: q.roomId, questionId: q.questionId, answerIndex: 9 });
  const snapshot = await event(a.socket, 'game_snapshot');
  assert.equal(snapshot.selectedAnswer, null); assert.equal(snapshot.myScore, 0); assert.equal(over, 0);
  const result = event(b.socket, 'game_over'); a.socket.emit('forfeit', { roomId: q.roomId });
  assert.equal((await result).isWin, true);
});

test('reconnect restores server identity, answer and score', async t => {
  const f = await fixture(t); const a = await f.player('A'), b = await f.player('B');
  const q = await match(a.socket, b.socket);
  const locked = event(a.socket, 'answer_locked'); a.socket.emit('submit_answer', { ...q, answerIndex: 0 }); await locked;
  a.socket.disconnect(); await wait(40);
  const socket = io(f.url, { auth: { token: a.token }, autoConnect: false, reconnection: false }); f.clients.push(socket);
  const restored = event(socket, 'game_snapshot'); socket.connect();
  const state = await restored; assert.equal(state.roomId, q.roomId); assert.equal(state.selectedAnswer, 0); assert.equal(state.player.userId, a.player.userId);
});

test('disconnect grace expires and awards opponent victory', async t => {
  const f = await fixture(t, { reconnectMs: 80 }); const a = await f.player('A'), b = await f.player('B');
  await match(a.socket, b.socket); const over = event(b.socket, 'game_over'); a.socket.disconnect();
  assert.equal((await over).isWin, true);
});

test('timeouts finish all questions in a draw and return the same authoritative result after reconnect', async t => {
  const f = await fixture(t, { questionMs: 50, transitionMs: 10 }); const a = await f.player('A'), b = await f.player('B');
  const over = event(a.socket, 'game_over'); await match(a.socket, b.socket); const result = await over;
  assert.equal(result.isDraw, true); assert.equal(result.myScore, 0); assert.equal(result.rewardsPersisted, false);
  a.socket.disconnect(); await wait(30);
  const socket = io(f.url, { auth: { token: a.token }, autoConnect: false, reconnection: false }); f.clients.push(socket);
  const replay = event(socket, 'game_over'); socket.connect(); assert.deepEqual(await replay, result);
});

test('unauthorized connections and unapproved browser origins are rejected', async t => {
  const f = await fixture(t);
  const socket = io(f.url, { auth: { token: 'invalid' }, autoConnect: false, reconnection: false }); f.clients.push(socket);
  const rejected = event(socket, 'connect_error'); socket.connect(); await rejected;
  const response = await fetch(`${f.url}/session`, { method: 'POST', headers: { Origin: 'https://unapproved.invalid', 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'A' }) });
  assert.equal(response.status, 403);
});

test('one server identity cannot open two active sockets', async t => {
  const f = await fixture(t); const a = await f.player('A');
  const duplicate = io(f.url, { auth: { token: a.token }, autoConnect: false, reconnection: false }); f.clients.push(duplicate);
  const denied = event(duplicate, 'connect_error'); duplicate.connect();
  assert.match((await denied).message, /already connected/);
});

test('unready matches expire without starting or granting a result', async t => {
  const f = await fixture(t, { readyMs: 60 }); const a = await f.player('A'), b = await f.player('B');
  const found = event(a.socket, 'match_found'); const idle = event(a.socket, 'idle');
  let questionsStarted = 0; a.socket.on('question_start', () => questionsStarted++);
  a.socket.emit('join_queue'); b.socket.emit('join_queue'); await found; await idle;
  assert.equal(questionsStarted, 0);
});

test('ten correct answers accumulate combo/EXP on server, finish as draw, and allow a new match', async t => {
  const f = await fixture(t, { questionCount: 10 }); const a = await f.player('A'), b = await f.player('B');
  let q = await match(a.socket, b.socket);
  const over = event(a.socket, 'game_over');
  for (let index = 0; index < 10; index++) {
    const next = index < 9 ? event(a.socket, 'question_start') : null;
    const end = event(a.socket, 'question_end');
    const correct = questions.find(item => item.id === q.questionId).correctIndex;
    const payload = { roomId: q.roomId, questionId: q.questionId, answerIndex: correct };
    a.socket.emit('submit_answer', payload); b.socket.emit('submit_answer', payload); await end;
    if (next) q = { ...await next, roomId: q.roomId };
  }
  const result = await over; assert.equal(result.isDraw, true);
  assert.equal(result.players.player.expChange, 320); assert.equal(result.players.player.maxCombo, 10);
  assert.equal(result.players.player.correctCount, 10); assert.ok(result.myScore >= 1900);
  const again = await match(a.socket, b.socket); assert.notEqual(again.roomId, result.roomId);
});
