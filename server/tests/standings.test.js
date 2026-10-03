import { test } from "node:test";
import assert from "node:assert/strict";
import { createTrialStandings } from "../trialStandings.js";

test("trial standings count real results once, clamp RP and have no fabricated participants", () => {
  const standings = createTrialStandings();
  const a = { userId: "a", username: "A" }, b = { userId: "b", username: "B" };
  assert.deepEqual(standings.snapshot(a).entries, []);
  standings.record("one", [a, b], "a");
  standings.record("one", [a, b], "a");
  assert.equal(standings.snapshot(a).profile.matches, 1);
  assert.equal(standings.snapshot(a).profile.rp, 50);
  assert.equal(standings.snapshot(b).profile.rp, 0);
  assert.equal(standings.snapshot(a).totalPlayers, 2);
  standings.record("two", [a, b], "a"); standings.record("three", [a, b], "a");
  assert.equal(standings.snapshot(a).profile.rp, 160);
  standings.record("draw", [a, b], "draw");
  assert.equal(standings.snapshot(a).profile.streak, 0);
  assert.equal(standings.snapshot(a).profile.rp, 160);
  assert.equal(standings.snapshot(a).profile.position, 1);
  assert.ok(!("expiresAt" in standings.snapshot(a).profile));
});
