import { createHmac, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

// Guest sessions authorize one player, never an existing local/Supabase account.
export function createSessionStore(secret = randomBytes(32).toString('hex')) {
  const sign = value => createHmac('sha256', secret).update(value).digest('base64url');
  return {
    issue(username) {
      const player = {
        userId: randomUUID(), username: String(username || 'Người chơi').trim().slice(0, 40),
        exp: 0, level: 0, expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };
      const payload = Buffer.from(JSON.stringify(player)).toString('base64url');
      return { token: `${payload}.${sign(payload)}`, player };
    },
    verify(token) {
      if (typeof token !== 'string' || token.length > 2048) return null;
      const [payload, signature, extra] = token.split('.');
      if (!payload || !signature || extra) return null;
      const expected = Buffer.from(sign(payload));
      const received = Buffer.from(signature);
      if (received.length !== expected.length || !timingSafeEqual(expected, received)) return null;
      try {
        const player = JSON.parse(Buffer.from(payload, 'base64url').toString());
        return player.expiresAt > Date.now() ? player : null;
      } catch { return null; }
    },
  };
}
