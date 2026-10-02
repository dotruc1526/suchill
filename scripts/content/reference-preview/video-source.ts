const expectedBytes = 19289629
type Platform = {
  fetchFile: typeof fetch
  hash: (bytes: Uint8Array<ArrayBuffer>) => Promise<string>
  createUrl: (blob: Blob) => string
  revokeUrl: (url: string) => void
}
const browserPlatform: Platform = {
  fetchFile: (...args) => fetch(...args),
  hash: async bytes => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
    .map(value => value.toString(16).padStart(2, '0')).join(''),
  createUrl: blob => URL.createObjectURL(blob),
  revokeUrl: url => URL.revokeObjectURL(url),
}

/** The Hosting preview ignores Range requests. A verified in-memory copy enables native seek/resume. */
export function createReferenceVideoLoader(expectedHash: string, platform = browserPlatform) {
  if (!/^[a-f0-9]{64}$/.test(expectedHash)) throw new Error('Invalid reference video identity')
  let pending: Promise<string> | undefined, objectUrl: string | undefined, disposed = false
  let controller: AbortController | undefined
  async function load() {
    const activeController = controller = new AbortController()
    const timeout = setTimeout(() => activeController.abort(), 90000)
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
    try {
      const response = await platform.fetchFile('/reference-media/pilot-mobile.mp4', {
        credentials: 'omit', cache: 'no-store', signal: activeController.signal,
      })
      if (!response.ok || !response.headers.get('content-type')?.startsWith('video/mp4') || !response.body)
        throw new Error('Reference video unavailable')
      reader = response.body.getReader()
      const bytes = new Uint8Array(expectedBytes)
      let length = 0
      while (true) {
        const next = await reader.read()
        if (next.done) break
        if (length + next.value.length > expectedBytes) throw new Error('Reference video is too large')
        bytes.set(next.value, length); length += next.value.length
      }
      if (length !== expectedBytes || await platform.hash(bytes) !== expectedHash || disposed)
        throw new Error('Reference video integrity failed')
      objectUrl = platform.createUrl(new Blob([bytes], { type: 'video/mp4' }))
      return objectUrl
    } finally { clearTimeout(timeout); await reader?.cancel().catch(() => {}); reader?.releaseLock() }
  }
  return {
    getUrl() {
      if (disposed) return Promise.reject(new Error('Reference loader closed'))
      if (objectUrl) return Promise.resolve(objectUrl)
      return pending ??= load().catch(error => { pending = undefined; throw error })
    },
    dispose() {
      disposed = true; controller?.abort()
      if (objectUrl) { platform.revokeUrl(objectUrl); objectUrl = undefined }
    },
  }
}
