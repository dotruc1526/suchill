import { test } from 'node:test';
import assert from 'node:assert/strict';
import { takeRandomPair } from '../matchmaking.js';

test('the oldest waiter can pair with any other queued player, never itself', () => {
  for (let choice = 0; choice < 3; choice++) {
    const queue = ['oldest', 'B', 'C', 'D'];
    assert.deepEqual(takeRandomPair(queue, size => { assert.equal(size, 3); return choice; }), ['oldest', ['B', 'C', 'D'][choice]]);
    assert.equal(queue.length, 2);
    assert.ok(!queue.includes('oldest'));
  }
  const alone = ['A'];
  assert.equal(takeRandomPair(alone), null);
  assert.deepEqual(alone, ['A']);
});
