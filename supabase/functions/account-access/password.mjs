/** Only the initiating user's bearer can change a password. No admin reset. */
export async function passwordAction(input, request, backend) {
  const fail = (status, error) => ({ status, body: { error } });
  if (typeof input.password !== 'string' || input.password.length < 8 || input.password.length > 128)
    return fail(400, 'validation');
  const token = request.headers.get('authorization')?.replace(/^Bearer /, '');
  if (!token || token.length > 8192) return fail(401, 'unauthorized');
  const user = await backend.call('/auth/v1/user', undefined, false, token);
  if (!user.ok || !user.data?.id) return fail(401, 'unauthorized');
  const quota = await backend.rpc('take_login_quota', {
    p_bucket: `password:${user.data.id}`, p_max: 5, p_seconds: 3600,
  });
  if (!quota.ok) return fail(503, 'server_error');
  if (quota.data !== true) return fail(429, 'server_error');
  const updated = await backend.call('/auth/v1/user', { password: input.password }, false, token);
  return updated.ok ? { status: 200, body: { updated: true } }
    : fail(updated.status >= 500 ? 503 : 400, updated.status >= 500 ? 'server_error' : 'validation');
}
