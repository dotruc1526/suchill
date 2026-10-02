import { createAccountTransport, identifierHash, readSmallBody } from './transport.mjs';
import { recoveryAction } from './recovery.mjs';
import { passwordAction } from './password.mjs';

const validName = value => typeof value === 'string' && /^[a-z0-9_]{3,32}$/.test(value);
const normalizeName = value => typeof value === 'string' ? value.trim().toLowerCase() : '';
export function createAccountHandler(config, fetcher = fetch) {
  const backend = createAccountTransport(config, fetcher);
  return async function handle(request) {
    const origin = request.headers.get('origin');
    const allowed = config.origins.includes(origin);
    const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', Vary: 'Origin' };
    if (allowed) Object.assign(headers, { 'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
      'Access-Control-Allow-Methods': 'POST, OPTIONS' });
    const reply = (status, body) => new Response(JSON.stringify(body), { status, headers });
    if (origin && !allowed) return reply(403, { error: 'unauthorized' });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (request.method !== 'POST') return reply(405, { error: 'validation' });
    try {
      let raw; try { raw = await readSmallBody(request) } catch (error) {
        return reply(error instanceof RangeError ? 413 : 400, { error: 'validation' });
      }
      let input; try { input = JSON.parse(raw) } catch { return reply(400, { error: 'validation' }) }
      if (input?.action === 'update-password') {
        const result = await passwordAction(input, request, backend);
        return reply(result.status, result.body);
      }
      if (['recovery-email', 'verify-recovery-email'].includes(input?.action)) {
        const result = await recoveryAction(input, request, config, backend, fetcher);
        return reply(result.status, result.body);
      }
      const username = normalizeName(input?.username);
      if (!validName(username) || !['signup', 'login', 'claim'].includes(input?.action)) return reply(400, { error: 'validation' });
      const hashed = await identifierHash(username, config.secretKey);
      // Global signup cap supplements per-identifier quotas and GoTrue limits.
      const quota = await backend.rpc('take_login_quota', { p_bucket: `${input.action}:${hashed}`, p_max: 10, p_seconds: 300 });
      if (!quota.ok) return reply(503, { error: 'server_error' });
      if (quota.data !== true) return reply(429, { error: 'server_error' });
      if (input.action === 'claim') {
        const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
        if (!token || token.length > 8192) return reply(401, { error: 'unauthorized' });
        const user = await backend.call('/auth/v1/user', undefined, false, token);
        if (!user.ok || !user.data?.id) return reply(401, { error: 'unauthorized' });
        const claim = await backend.rpc('claim_login_name', { p_username: username, p_user_id: user.data.id });
        if (!claim.ok) return reply(claim.status >= 500 ? 503 : 409, { error: claim.status >= 500 ? 'server_error' : 'conflict' });
        const updated = await backend.call(`/auth/v1/admin/users/${user.data.id}`,
          { app_metadata: { ...user.data.app_metadata, suchill_username: username } }, true);
        return updated.ok ? reply(200, { username }) : reply(503, { error: 'server_error' });
      }
      if (typeof input.password !== 'string' || input.password.length < 8 || input.password.length > 128) return reply(400, { error: 'validation' });
      let email;
      if (input.action === 'signup') {
        if (typeof input.displayName !== 'string' || !input.displayName.trim() || input.displayName.length > 80 ||
          typeof input.timezone !== 'string') return reply(400, { error: 'validation' });
        try { new Intl.DateTimeFormat('vi', { timeZone: input.timezone }) } catch { return reply(400, { error: 'validation' }) }
        const globalQuota = await backend.rpc('take_login_quota', { p_bucket: 'signup:global', p_max: 30, p_seconds: 3600 });
        if (!globalQuota.ok || globalQuota.data !== true) return reply(429, { error: 'server_error' });
        email = `${username}@accounts.suchill.invalid`;
        const available = await backend.rpc('username_identity', { p_username: username });
        if (!available.ok) return reply(503, { error: 'server_error' });
        if (available.data !== null) return reply(409, { error: 'conflict' });
        const created = await backend.call('/auth/v1/admin/users', {
          email, password: input.password, email_confirm: true,
          user_metadata: { displayName: input.displayName.trim(), timezone: input.timezone },
          app_metadata: { suchill_username: username },
        }, true);
        if (!created.ok) {
          const duplicate = ['email_exists', 'user_already_exists'].includes(created.data?.code);
          return reply(duplicate ? 409 : 503, { error: duplicate ? 'conflict' : 'server_error' });
        }
      } else {
        const identity = await backend.rpc('username_identity', { p_username: username });
        if (!identity.ok) return reply(503, { error: 'server_error' });
        // Missing names take the same password endpoint path as known names.
        email = typeof identity.data === 'string' ? identity.data : `${username}@accounts.suchill.invalid`;
      }
      const authenticated = await backend.call('/auth/v1/token?grant_type=password', { email, password: input.password });
      if (!authenticated.ok || !authenticated.data?.access_token || !authenticated.data?.refresh_token)
        return reply(authenticated.status >= 500 || authenticated.status === 429 ? 503 : 401,
          { error: authenticated.status >= 500 || authenticated.status === 429 ? 'server_error' : 'unauthorized' });
      // Browser SDK validates/owns this session; no privileged key is returned.
      return reply(200, { access_token: authenticated.data.access_token, refresh_token: authenticated.data.refresh_token });
    } catch { return reply(503, { error: 'server_error' }) }
  };
}
