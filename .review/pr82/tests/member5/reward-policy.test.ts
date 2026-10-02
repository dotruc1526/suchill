import test from 'node:test'
import assert from 'node:assert/strict'
import { nextStreakDay, quizBonusEligible, quizPassed, rewardKey, uniqueWatchedSeconds,
  videoThresholdReached } from '../../src/services/next/rewardPolicy.ts'

test('reward identity separates ambiguous activity IDs', () => {
  assert.notEqual(rewardKey('a:b', 'lesson', 'c', '1'), rewardKey('a', 'lesson', 'b:c', '1'))
})

test('quiz pass and bonus have distinct thresholds', () => {
  assert.equal(quizPassed(7, 10), true)
  assert.equal(quizBonusEligible(7, 10), false)
  assert.equal(quizBonusEligible(8, 10), true)
  assert.equal(quizPassed(0, 0), false)
})

test('video duration merges ranges and rejects seek-to-end shortcut', () => {
  const ranges = [{ start: 0, end: 50 }, { start: 40, end: 80 }, { start: 99, end: 100 }]
  assert.equal(uniqueWatchedSeconds(ranges, 100), 81)
  assert.equal(videoThresholdReached(ranges, 100), false)
  assert.equal(videoThresholdReached([{ start: 0, end: 90 }], 100), true)
})

test('streak qualifies once per day, increments consecutive day and resets after a gap', () => {
  const first = nextStreakDay({ current: 0, longest: 0, lastLocalDate: null }, '2026-09-24')
  assert.deepEqual(nextStreakDay(first, '2026-09-24'), first)
  const second = nextStreakDay(first, '2026-09-25')
  assert.equal(second.current, 2)
  assert.deepEqual(nextStreakDay(second, '2026-09-27'),
    { current: 1, longest: 2, lastLocalDate: '2026-09-27' })
})
