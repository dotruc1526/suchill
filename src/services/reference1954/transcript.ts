export async function loadPreviewTranscript(signal: AbortSignal): Promise<string> {
  const response = await fetch('/reference-media/transcript.vi.txt', {
    signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]), credentials: 'omit', cache: 'no-store',
  })
  if (!response.ok || !response.headers.get('content-type')?.startsWith('text/plain')) throw new Error('Transcript unavailable')
  const text = await response.text()
  if (!text.trim()) throw new Error('Empty transcript')
  return text
}
