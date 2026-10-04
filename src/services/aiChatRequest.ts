type ChatOptions = { fetcher?: typeof fetch; timeoutMs?: number }

/** Bound the complete request, including reading the provider response body. */
export async function requestHistoryReply(serverUrl: string, question: string, options: ChatOptions = {}): Promise<string | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000)
  try {
    const response = await (options.fetcher ?? fetch)(`${serverUrl}/api/ai/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }), signal: controller.signal,
      cache: 'no-store', credentials: 'omit',
    })
    if (!response.ok) return null
    const data: unknown = await response.json()
    if (!data || typeof data !== 'object' || !('reply' in data)) return null
    return typeof data.reply === 'string' && data.reply.trim() ? data.reply.trim() : null
  } catch { return null }
  finally { clearTimeout(timeout) }
}
