import { randomInt } from "node:crypto";

// Serve the oldest waiter, choose an opponent randomly from the remaining queue.
// One public server owns the pool regardless of players' networks or regions.
export function takeRandomPair(queue, pick = randomInt) {
  if (queue.length < 2) return null;
  const first = queue.shift();
  const [second] = queue.splice(pick(queue.length), 1);
  return [first, second];
}
