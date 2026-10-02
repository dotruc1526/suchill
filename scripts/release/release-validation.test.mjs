import assert from 'node:assert/strict'
import { deflateSync } from 'node:zlib'
import { pngCrc, validatePosterPng } from './poster-png.mjs'
import { test } from 'node:test'
import { mkdtemp, mkdir, rm, writeFile, readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve, sep } from 'node:path'
import { packageFiles, packagePath, hashBytes, parseCaptions, validateMediaPackage, validateProbe } from './media-package.mjs'
import { evaluateEvidence, requiredChecks } from './check-release-readiness.mjs'

const probe = { streams: [{ codec_type: 'video', codec_name: 'h264', pix_fmt: 'yuv420p', width: 1080, height: 1920, avg_frame_rate: '30/1' },
  { codec_type: 'audio', codec_name: 'aac' }], format: { duration: '2.00' } }
const video = { width: 1080, height: 1920, fps: 30, durationSeconds: 2 }
function validPoster() {
  const chunk = (type, data) => {
    const result = Buffer.alloc(data.length + 12)
    result.writeUInt32BE(data.length); result.write(type, 4, 4, 'ascii'); data.copy(result, 8)
    result.writeUInt32BE(pngCrc(result.subarray(4, result.length - 4)), result.length - 4)
    return result
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(1080); header.writeUInt32BE(1920, 4); header[8] = 8; header[9] = 2
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.alloc((1080 * 3 + 1) * 1920))), chunk('IEND', Buffer.alloc(0))])
}
async function fixture(run) {
  const root = await mkdtemp(join(tmpdir(), 'suchill-release-validation-'))
  const directory = join(root, 'package')
  await mkdir(directory)
  try {
    const narration = Buffer.from(JSON.stringify({ cues: [{ text: 'Đọc nguồn đã duyệt.' }] }))
    const png = validPoster()
    const bodies = { 'pilot-mobile.mp4': Buffer.from('unit fixture: probe is injected; not a decoded MP4'),
      'poster.png': png, 'captions.vi.vtt': Buffer.from('WEBVTT\n\nc1\n00:00:00.000 --> 00:00:02.000\nĐọc nguồn đã duyệt.\n'),
      'transcript.vi.txt': Buffer.from('Pilot — elevenlabs.io\n\nĐọc nguồn đã duyệt.\n') }
    for (const name of packageFiles) await writeFile(join(directory, name), bodies[name])
    const manifest = { id: 'media.trial.v1', title: 'Pilot — elevenlabs.io', reviewStatus: 'in_review',
      scope: 'academic_non_commercial', provider: 'ElevenLabs', sourceIds: ['SRC-MT68-07'], video,
      narrationSha256: hashBytes(narration), files: Object.fromEntries(Object.entries(bodies).map(([name, bytes]) => [name, hashBytes(bytes)])) }
    await writeFile(join(root, 'narration.json'), narration)
    const save = () => writeFile(join(directory, 'manifest.json'), JSON.stringify(manifest))
    await save()
    await run({ root, directory, manifest, save, narrationPath: join(root, 'narration.json') })
  } finally {
    const target = resolve(root)
    assert.ok(target.startsWith(resolve(tmpdir()) + sep) && target.includes('suchill-release-validation-'))
    await rm(target, { recursive: true, force: true })
  }
}

test('preview validation stays distinct from canonical release approval', async () => fixture(async f => {
  const result = await validateMediaPackage(f.directory, f.narrationPath, async () => probe)
  assert.equal(result.passed, true)
  assert.equal(result.publication, 'not_performed')
  assert.ok(result.warnings.length >= 3)
  assert.equal(result.kind, 'technical_preview')
}))

test('tampered or missing output fails exact package integrity without printing file contents', async () => fixture(async f => {
  await writeFile(join(f.directory, 'pilot-mobile.mp4'), 'changed bytes')
  let result = await validateMediaPackage(f.directory, f.narrationPath, async () => probe)
  assert.ok(result.errors.some(e => e.code === 'FILE_HASH_MISMATCH'))
  await rm(join(f.directory, 'pilot-mobile.mp4'))
  result = await validateMediaPackage(f.directory, f.narrationPath, async () => probe)
  assert.equal(result.passed, false)
  assert.ok(result.errors.some(e => e.check === 'hash:pilot-mobile.mp4'))
  assert.equal(JSON.stringify(result).includes('changed bytes'), false)
}))

test('valid rewritten caption hashes cannot conceal changed narration words', async () => fixture(async f => {
  const captions = Buffer.from('WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nLời chưa được duyệt.\n')
  await writeFile(join(f.directory, 'captions.vi.vtt'), captions)
  f.manifest.files['captions.vi.vtt'] = hashBytes(captions); await f.save()
  const result = await validateMediaPackage(f.directory, f.narrationPath, async () => probe)
  assert.ok(result.errors.some(e => e.code === 'CAPTION_WORDS_MISMATCH'))
}))

test('locked authoring and traversal reject package substitution', async () => fixture(async f => {
  await writeFile(f.narrationPath, '{"cues":[{"text":"Changed"}]}')
  f.manifest.files['../outside.txt'] = '0'.repeat(64); await f.save()
  const result = await validateMediaPackage(f.directory, f.narrationPath, async () => probe)
  assert.ok(result.errors.some(e => e.code === 'NARRATION_HASH_MISMATCH'))
  assert.ok(result.errors.some(e => e.code === 'INVALID_MANIFEST_CONTRACT'))
  await assert.rejects(packagePath(f.directory, '../outside.txt'), /UNSAFE_PACKAGE_PATH/)
}))

test('malformed/overlapping/duplicate VTT and unsupported rendition are rejected', () => {
  for (const body of [
    'WEBVTT\n\nx\n00:00:02.000 --> 00:00:01.000\nText',
    'WEBVTT\n\nx\n00:00:00.000 --> 00:00:02.000\nA\n\nx\n00:00:02.000 --> 00:00:03.000\nB',
    'WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nA\n\n00:00:01.000 --> 00:00:03.000\nB',
    'WEBVTT\n\n00:00:00.000 --> 00:00:02.000\n<script>unsafe</script>',
  ]) assert.throws(() => parseCaptions(body))
  const captions = [{ start: 0, end: 2 }]
  assert.throws(() => validateProbe({ ...probe, streams: [probe.streams[0]] }, { video }, captions), /INVALID_STREAM_COUNT/)
  assert.throws(() => validateProbe(probe, { video: { ...video, durationSeconds: null } }, captions), /VIDEO_METADATA_MISMATCH/)
  assert.throws(() => validateProbe(probe, { video }, [{ start: 0, end: 5 }]), /CAPTIONS_EXCEED_VIDEO/)
})

test('complete supplied evidence is revision-bound and never publishes; boolean shortcuts fail', () => {
  const commit = 'a'.repeat(40), hash = 'b'.repeat(64)
  const manifest = { reviewStatus: 'approved', publicationScope: 'canonical' }
  const evidence = { build: { commit, version: 'review-v1' }, mediaManifestSha256: hash,
    checks: Object.fromEntries(requiredChecks.map(name => [name, { status: 'passed', reviewer: 'Named reviewer',
      evidence: 'local report', date: '2026-10-03', commit, mediaManifestSha256: hash }])) }
  assert.equal(evaluateEvidence(evidence, hash, manifest).complete, true)
  assert.equal(evaluateEvidence(evidence, hash, manifest).publication, 'not_performed')
  assert.equal(evaluateEvidence({ ...evidence, checks: { released: true } }, hash, manifest).complete, false)
  assert.equal(evaluateEvidence(evidence, 'c'.repeat(64), manifest).complete, false)
  assert.equal(evaluateEvidence(evidence, hash, { reviewStatus: 'in_review', publicationScope: 'internal_reference_only' }).complete, false)
  evidence.checks.physical_ios.date = '2026-99-99'
  assert.ok(evaluateEvidence(evidence, hash, manifest).missing.includes('physical_ios'))
  evidence.checks.physical_ios.status = 'not_tested'
  assert.ok(evaluateEvidence(evidence, hash, manifest).missing.includes('physical_ios'))
})


test('CRC/full raster decode rejects corrupt posters even when the manifest hash is rewritten', async () => fixture(async f => {
  const bytes = await readFile(join(f.directory, 'poster.png'))
  bytes[50] ^= 1
  await writeFile(join(f.directory, 'poster.png'), bytes)
  f.manifest.files['poster.png'] = hashBytes(bytes); await f.save()
  const result = await validateMediaPackage(f.directory, f.narrationPath, async () => probe)
  assert.ok(result.errors.some(e => e.code === 'POSTER_PNG_CRC_MISMATCH'))
  const fake = Buffer.alloc(33); Buffer.from([137,80,78,71,13,10,26,10]).copy(fake)
  fake.writeUInt32BE(1080,16); fake.writeUInt32BE(1920,20)
  assert.throws(() => validatePosterPng(fake), /INVALID_POSTER_PNG/)
  const brokenDeflate = validPoster()
  const idatEnd = 33 + 12 + brokenDeflate.readUInt32BE(33)
  brokenDeflate[41] = 0
  brokenDeflate.writeUInt32BE(pngCrc(brokenDeflate.subarray(37,idatEnd-4)),idatEnd-4)
  assert.throws(() => validatePosterPng(brokenDeflate), /POSTER_PNG_DECODE_FAILED/)
  const short = validPoster().subarray(0, 45)
  assert.throws(() => validatePosterPng(short))
}))
