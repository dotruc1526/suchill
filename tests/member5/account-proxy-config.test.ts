import { test } from 'node:test'
import assert from 'node:assert/strict'
import { accountProxyUrl } from '../../src/services/supabase/accountProxyConfig.ts'

test('account proxy is confined to LAN and validated development tunnels', () => {
  const backend = 'https://backend-demo.trycloudflare.com'
  assert.equal(accountProxyUrl({ protocol: 'http:', hostname: '192.168.1.2' }), 'http://192.168.1.2:3001')
  assert.equal(accountProxyUrl({ protocol: 'https:', hostname: 'frontend-demo.trycloudflare.com' }, backend), backend)
  for (const hostname of ['suchill.web.app', 'example.com', 'frontend.trycloudflare.com.attacker.com']) {
    assert.equal(accountProxyUrl({ protocol: 'https:', hostname }, backend), undefined)
  }
  for (const configured of ['https://example.com', `${backend}/api`, `${backend}?x=1`, 'https://user:pass@backend-demo.trycloudflare.com', 'http://backend-demo.trycloudflare.com']) {
    assert.equal(accountProxyUrl({ protocol: 'https:', hostname: 'frontend-demo.trycloudflare.com' }, configured), undefined)
  }
})
