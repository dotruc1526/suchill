import { createHash } from 'node:crypto'
import { validatePosterPng } from './poster-png.mjs'
import { createReadStream } from 'node:fs'
import { lstat, readFile, realpath } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { promisify } from 'node:util'
import { execFile } from 'node:child_process'

const execute = promisify(execFile)
export const packageFiles = ['pilot-mobile.mp4', 'poster.png', 'captions.vi.vtt', 'transcript.vi.txt']
export const hashBytes = bytes => createHash('sha256').update(bytes).digest('hex')
export async function fileHash(path) {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(path)) hash.update(chunk)
  return hash.digest('hex')
}
export const normalizedText = text => text.normalize('NFC').replace(/\s+/gu, ' ').trim()
export async function packagePath(directory, name) {
  if (!packageFiles.includes(name) && name !== 'manifest.json') throw new Error('UNSAFE_PACKAGE_PATH')
  const base = await realpath(directory), candidate = resolve(base, name)
  const info = await lstat(candidate)
  if (!info.isFile() || info.isSymbolicLink()) throw new Error('UNSAFE_PACKAGE_PATH')
  const actual = await realpath(candidate)
  if (!actual.startsWith(base + sep)) throw new Error('UNSAFE_PACKAGE_PATH')
  return actual
}
export async function readSmall(path) {
  const info = await lstat(path)
  if (!info.isFile() || info.isSymbolicLink() || info.size > 4_000_000) throw new Error('INVALID_TEXT_FILE')
  return readFile(path, 'utf8')
}
export function parseCaptions(text) {
  const content = text.replace(/^\uFEFF/u, '').replace(/\r\n/g, '\n')
  if (!/^WEBVTT(?:[^\n]*)\n/u.test(content)) throw new Error('INVALID_VTT_HEADER')
  const stamp = value => {
    const match = value.match(/^(?:(\d{2,}):)?(\d{2}):(\d{2})\.(\d{3})$/u)
    if (!match || +match[2] >= 60 || +match[3] >= 60) throw new Error('INVALID_VTT_TIMESTAMP')
    return +(match[1] ?? 0) * 3600 + +match[2] * 60 + +match[3] + +match[4] / 1000
  }
  const cues = [], ids = new Set()
  for (const block of content.split(/\n\s*\n/u).slice(1)) {
    if (!block.trim() || /^(NOTE|STYLE|REGION)(?:\s|$)/u.test(block)) continue
    const lines = block.split('\n'), index = lines[0].includes('-->') ? 0 : 1
    const times = lines[index]?.match(/^(\S+)\s+-->\s+(\S+)(?:\s+.*)?$/u)
    if (!times) throw new Error('INVALID_VTT_CUE')
    if (index) {
      if (!lines[0].trim() || ids.has(lines[0])) throw new Error('DUPLICATE_VTT_ID')
      ids.add(lines[0])
    }
    const start = stamp(times[1]), end = stamp(times[2])
    const body = lines.slice(index + 1).join(' ').trim()
    if (!(end > start) || !body || /<[^>]*>/u.test(body)) throw new Error('INVALID_VTT_CUE')
    if (cues.length && start < cues.at(-1).end - 0.001) throw new Error('OVERLAPPING_VTT_CUES')
    cues.push({ start, end, text: body })
  }
  if (!cues.length) throw new Error('EMPTY_VTT')
  return cues
}
export async function probeVideo(path) {
  const { stdout } = await execute(process.env.FFPROBE_PATH || 'ffprobe',
    ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', path],
    { timeout: 20_000, maxBuffer: 2_000_000, windowsHide: true })
  return JSON.parse(stdout)
}
export function validateProbe(probe, manifest, captions) {
  const video = probe.streams?.filter(item => item.codec_type === 'video') ?? []
  const audio = probe.streams?.filter(item => item.codec_type === 'audio') ?? []
  if (video.length !== 1 || audio.length !== 1) throw new Error('INVALID_STREAM_COUNT')
  const v = video[0], a = audio[0], duration = Number(probe.format?.duration)
  const ratio = String(v.avg_frame_rate).split('/').map(Number), fps = ratio[0] / ratio[1]
  if (v.codec_name !== 'h264' || a.codec_name !== 'aac' || v.pix_fmt !== 'yuv420p' ||
      v.width !== 1080 || v.height !== 1920 || !Number.isFinite(fps) || fps < 23 || fps > 61 ||
      !Number.isFinite(duration) || duration <= 0 || duration > 1800) throw new Error('INVALID_VIDEO_RENDITION')
  if (!manifest.video || manifest.video.width !== v.width || manifest.video.height !== v.height ||
      (!Number.isFinite(Number(manifest.video.durationSeconds)) || Number(manifest.video.durationSeconds) <= 0) ||
      Math.abs(Number(manifest.video.durationSeconds) - duration) > 0.15 ||
      !Number.isFinite(Number(manifest.video.fps)) || Math.abs(Number(manifest.video.fps) - fps) > 0.1)
    throw new Error('VIDEO_METADATA_MISMATCH')
  if (captions.at(-1).end > duration + 0.15) throw new Error('CAPTIONS_EXCEED_VIDEO')
  return { width: v.width, height: v.height, fps, durationSeconds: duration, videoCodec: v.codec_name, audioCodec: a.codec_name }
}
export async function validateMediaPackage(directory, narrationPath, probe = probeVideo) {
  const errors = [], checks = [], warnings = []
  const checked = async (name, run) => {
    try { const value = await run(); checks.push(name); return value }
    catch (error) { errors.push({ check: name, code: /^[A-Z_]+$/u.test(error?.message ?? '') ? error.message : 'CHECK_FAILED' }) }
  }
  const manifest = await checked('manifest', async () => JSON.parse(await readSmall(await packagePath(directory, 'manifest.json'))))
  if (!manifest) return { kind: 'technical_preview', passed: false, checks, errors, warnings }
  await checked('manifest_contract', async () => {
    if (!manifest.id || typeof manifest.title !== 'string' || !manifest.title.trim() ||
        !['in_review', 'approved'].includes(manifest.reviewStatus) || manifest.scope !== 'academic_non_commercial' ||
        !Array.isArray(manifest.sourceIds) || !manifest.sourceIds.length ||
        manifest.sourceIds.some(id => typeof id !== 'string' || !/^SRC-[A-Z0-9-]+$/u.test(id)) ||
        new Set(manifest.sourceIds).size !== manifest.sourceIds.length ||
        !manifest.files || Object.keys(manifest.files).some(name => !packageFiles.includes(name)))
      throw new Error('INVALID_MANIFEST_CONTRACT')
    if (manifest.provider === 'ElevenLabs' && !manifest.title.includes('elevenlabs.io')) throw new Error('MISSING_PROVIDER_CREDIT')
  })
  for (const name of packageFiles) await checked('hash:' + name, async () => {
    if (!/^[a-f0-9]{64}$/iu.test(manifest.files?.[name] ?? '')) throw new Error('MISSING_FILE_HASH')
    if ((await fileHash(await packagePath(directory, name))).toLowerCase() !== manifest.files[name].toLowerCase())
      throw new Error('FILE_HASH_MISMATCH')
  })
  const narration = await checked('locked_narration', async () => {
    const bytes = await readFile(narrationPath)
    if (hashBytes(bytes) !== manifest.narrationSha256?.toLowerCase()) throw new Error('NARRATION_HASH_MISMATCH')
    const data = JSON.parse(bytes.toString('utf8'))
    if (!Array.isArray(data.cues) || !data.cues.length || data.cues.some(cue => typeof cue.text !== 'string' || !cue.text.trim()))
      throw new Error('INVALID_NARRATION')
    return normalizedText(data.cues.map(cue => cue.text).join(' '))
  })
  const captions = await checked('captions', async () => parseCaptions(await readSmall(await packagePath(directory, 'captions.vi.vtt'))))
  if (captions && narration) await checked('caption_words', async () => {
    if (normalizedText(captions.map(cue => cue.text).join(' ')) !== narration) throw new Error('CAPTION_WORDS_MISMATCH')
  })
  if (narration) await checked('transcript_words', async () => {
    const lines = (await readSmall(await packagePath(directory, 'transcript.vi.txt'))).replace(/^\uFEFF/u, '').split(/\r?\n/u)
    if (normalizedText(lines[0]) === normalizedText(manifest.title)) lines.shift()
    if (normalizedText(lines.join(' ')) !== narration) throw new Error('TRANSCRIPT_WORDS_MISMATCH')
  })
  await checked('poster_png', async () => validatePosterPng(await readFile(await packagePath(directory, 'poster.png'))))
  let measured
  if (captions) measured = await checked('actual_video', async () =>
    validateProbe(await probe(await packagePath(directory, 'pilot-mobile.mp4')), manifest, captions))
  warnings.push('Technical checks do not verify attention, historical/media approval, original source-audio provenance, voice rights or physical devices.')
  if (manifest.timing?.captionsVerified !== true) warnings.push('Human listening and caption synchronization remain unverified.')
  if (manifest.publicationScope === 'internal_reference_only') warnings.push('This package is reference-only; technical PASS does not authorize canonical publication.')
  if (manifest.audioIdentityVerified !== true) warnings.push('Voice/provider generation identity remains unverified.')
  if (Array.isArray(manifest.pending)) warnings.push(...manifest.pending.map(() => 'A manifest production acceptance remains pending.').slice(0, 1))
  return { kind: 'technical_preview', passed: errors.length === 0, checks, errors, warnings,
    measured, manifestSha256: await fileHash(await packagePath(directory, 'manifest.json')),
    publication: 'not_performed' }
}
