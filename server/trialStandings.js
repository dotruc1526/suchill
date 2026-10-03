// Guest trial standings only. Never grants account XP, currency or production rank.
export function createTrialStandings() {
  const profiles = new Map(), settled = new Map();
  const ttl = 24 * 60 * 60 * 1000;
  function prune() {
    const now = Date.now();
    for (const [id, value] of profiles) if (value.expiresAt < now) profiles.delete(id);
    for (const [id, expiry] of settled) if (expiry < now) settled.delete(id);
    while (profiles.size > 10000) profiles.delete(profiles.keys().next().value);
    while (settled.size > 10000) settled.delete(settled.keys().next().value);
  }
  function ensure(player) {
    prune();
    if (!profiles.has(player.userId)) profiles.set(player.userId, {
      userId: player.userId, username: player.username, rp: 0, matches: 0, wins: 0, streak: 0,
      expiresAt: Date.now() + ttl,
    });
    return profiles.get(player.userId);
  }
  function record(roomId, players, winner) {
    prune();
    if (settled.has(roomId)) return;
    settled.set(roomId, Date.now() + ttl);
    for (const player of players) {
      const profile = ensure(player);
      const won = winner === player.userId, draw = winner === "draw";
      profile.matches++;
      profile.wins += Number(won);
      profile.streak = won ? profile.streak + 1 : 0;
      const bonus = profile.streak >= 5 ? 20 : profile.streak >= 3 ? 10 : 0;
      profile.rp = Math.max(0, profile.rp + (won ? 50 + bonus : draw ? 0 : -5));
    }
  }
  function snapshot(player) {
    const profile = ensure(player);
    const ordered = [...profiles.values()].filter(value => value.matches > 0)
      .sort((a, b) => b.rp - a.rp || b.wins - a.wins || a.userId.localeCompare(b.userId))
      .map(({ expiresAt: _expiry, ...value }, index) => ({ ...value, position: index + 1 }));
    const { expiresAt: _expiry, ...own } = profile;
    return { profile: { ...own, position: ordered.find(value => value.userId === player.userId)?.position ?? null },
      entries: ordered.slice(0, 20), totalPlayers: ordered.length, mode: "trial" };
  }
  return { record, snapshot };
}
