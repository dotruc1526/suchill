export function createAccountTransport(config, fetcher = fetch) {
  async function call(path, body, privileged = false, token) {
    const key = privileged ? config.secretKey : config.publishableKey;
    const headers = { apikey: key, 'Content-Type': 'application/json' };
    if (path.startsWith('/rest/v1/recovery_email_requests?')) headers.Prefer = 'resolution=merge-duplicates';
    if (token) headers.Authorization = `Bearer ${token}`;
    else if (privileged && key.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
    const response = await fetcher(`${config.url}${path}`, {
      method: body === undefined ? 'GET' : path.startsWith('/auth/v1/admin/users/') || path.startsWith('/auth/v1/user') ? 'PUT' : 'POST',
      headers, body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });
    let data; try { data = await response.json() } catch { data = null }
    return { ok: response.ok, status: response.status, data };
  }
  return { call, async rpc(name, body) { return call(`/rest/v1/rpc/${name}`, body, true) } };
}

export async function readSmallBody(request) {
  if (Number(request.headers.get('content-length') ?? 0) > 4096) throw new RangeError('Body limit');
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = []; let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > 4096) { await reader.cancel(); throw new RangeError('Body limit') }
      chunks.push(value);
    }
  } finally { reader.releaseLock() }
  const merged = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.length }
  return new TextDecoder().decode(merged);
}

export async function identifierHash(value, secret) {
  const bytes = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', bytes.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, bytes.encode(value))), b => b.toString(16).padStart(2, '0')).join('');
}
