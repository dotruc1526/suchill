type ProxyLocation = { protocol: string; hostname: string }

const tunnelHost = /^[a-z0-9-]+\.trycloudflare\.com$/
const privateHost = /^(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)$/

/** Only the local development launcher may redirect account traffic to its tunnel. */
export function accountProxyUrl(location: ProxyLocation, configured?: string): string | undefined {
  const lan = location.protocol === 'http:' && privateHost.test(location.hostname)
  const tunnel = location.protocol === 'https:' && tunnelHost.test(location.hostname)
  if (!lan && !tunnel) return undefined
  if (configured) {
    try {
      const url = new URL(configured)
      if (url.protocol === 'https:' && tunnelHost.test(url.hostname) && !url.username && !url.password &&
        !url.port && url.pathname === '/' && !url.search && !url.hash) return url.origin
    } catch { /* Fall back only to the local LAN server. */ }
  }
  return lan ? `http://${location.hostname}:3001` : undefined
}
