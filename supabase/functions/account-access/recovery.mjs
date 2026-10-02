import { identifierHash } from './transport.mjs';

export async function recoveryAction(input, request, config, backend, fetcher) {
  const fail = (status, error, reason) => ({ status, body: { error, ...(reason ? { reason } : {}) } });
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!token || token.length > 8192) return fail(401, 'unauthorized');
  const user = await backend.call('/auth/v1/user', undefined, false, token);
  if (!user.ok || !user.data?.id) return fail(401, 'unauthorized');
  const owner = user.data;
  const username = owner.app_metadata?.suchill_username;
  if (typeof username !== 'string' || !/^[a-z0-9_]{3,32}$/.test(username) ||
      owner.email !== `${username}@accounts.suchill.invalid`) return fail(409, 'conflict');
  const mapped = await backend.rpc('username_identity', { p_username: username });
  if (!mapped.ok) return fail(503, 'server_error');
  if (mapped.data !== owner.email) return fail(401, 'unauthorized');
  const quota = await backend.rpc('take_login_quota', { p_bucket: `recovery:${owner.id}`, p_max: 5, p_seconds: 3600 });
  if (!quota.ok || quota.data !== true) return fail(429, 'server_error');
  if (input.action === 'verify-recovery-email') {
    if (typeof input.token !== 'string' || !/^[a-f0-9]{64}$/.test(input.token)) return fail(400, 'validation');
    const hash = await identifierHash(input.token, config.secretKey);
    const consumed = await backend.rpc('consume_recovery_email', { p_user_id: owner.id, p_token_hash: hash });
    if (!consumed.ok) return fail(503, 'server_error');
    if (typeof consumed.data !== 'string') return fail(400, 'validation');
    // Both the existing account session and a one-use mailbox token are required.
    let updated;
    try {
      updated = await backend.call(`/auth/v1/admin/users/${owner.id}`, {
        email: consumed.data, email_confirm: true,
        app_metadata: { ...owner.app_metadata, pending_recovery_email: null },
      }, true);
    } catch {
      // A network timeout can have committed the Auth update. Keep reservation
      // until an operator reconciles Auth; never permit a competing proof.
      return fail(503, 'server_error');
    }
    if (!updated.ok && updated.status >= 500) return fail(503, 'server_error');
    const finished = await backend.rpc('finish_recovery_email', {
      p_user_id: owner.id, p_token_hash: hash, p_success: updated.ok,
    });
    if (!finished.ok) return fail(503, 'server_error');
    return updated.ok ? { status: 200, body: { recoveryEmail: consumed.data } }
      : fail(updated.status < 500 ? 409 : 503, updated.status < 500 ? 'conflict' : 'server_error');
  }
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || email.endsWith('@accounts.suchill.invalid')) return fail(400, 'validation');
  if (!config.mailKey || !config.mailFrom) return fail(503, 'server_error', 'email_delivery_not_configured');
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const verification = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  const hash = await identifierHash(verification, config.secretKey);
  const saved = await backend.call('/rest/v1/recovery_email_requests?on_conflict=user_id', {
    user_id: owner.id, email, token_hash: hash, expires_at: new Date(Date.now() + 20 * 60_000).toISOString(),
  }, true);
  // Do not overwrite a pending request via a non-atomic REST delete/create.
  if (!saved.ok) return fail(saved.status === 409 ? 409 : 503, saved.status === 409 ? 'conflict' : 'server_error');
  const link = new URL('/?account=verify-recovery', request.headers.get('origin') ?? config.origins[0]);
  link.searchParams.set('token', verification);
  const mailed = await fetcher('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${config.mailKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: config.mailFrom, to: [email], subject: 'Xác nhận email khôi phục Sử Chill',
      text: `Đăng nhập tài khoản Sử Chill của bạn rồi mở liên kết này trong 20 phút để xác nhận email khôi phục: ${link.toString()}` }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!mailed.ok) return fail(503, 'server_error');
  const metadata = await backend.call(`/auth/v1/admin/users/${owner.id}`, {
    app_metadata: { ...owner.app_metadata, pending_recovery_email: email },
  }, true);
  return metadata.ok ? { status: 200, body: { pendingRecoveryEmail: email } } : fail(503, 'server_error');
}
