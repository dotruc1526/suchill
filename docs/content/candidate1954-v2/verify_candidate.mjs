import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'

const here = new URL('./', import.meta.url)
const original = new URL('../preview1954-v1/', here)
const json = async url => JSON.parse(await readFile(url, 'utf8'))
const hash = async url => createHash('sha256').update(await readFile(url)).digest('hex')
const oldManifest = await json(new URL('manifest.json', original))
const manifest = await json(new URL('manifest.json', here))
const oldNarration = await json(new URL('locked-narration.json', original))
const narration = await json(new URL('locked-narration.json', here))
for (const [name, expected] of Object.entries(oldManifest.files)) {
  assert.equal(await hash(new URL(name, original)), expected, `Original ${name} unchanged`)
}
assert.equal(manifest.sourceVideoSha256, oldManifest.files['pilot-mobile.mp4'])
assert.equal(manifest.replacementStartSeconds, 83.45)
assert.deepEqual(narration.cues.slice(0, 25), oldNarration.cues.slice(0, 25))
assert.deepEqual(narration.cues.slice(25).map(cue => cue.text), [
  'Nhưng tại sao một thung lũng ở Tây Bắc',
  'lại trở thành điểm quyết chiến chiến lược của hai bên?',
  'Đó là chuyện của tập sau. Đi thôi!',
])
for (const [name, expected] of Object.entries(manifest.files)) {
  assert.equal(await hash(new URL(name, here)), expected, `Candidate ${name} locked`)
}
for (const input of manifest.newAudioInputs) {
  assert.equal(await hash(new URL(input.file, here)), input.sha256)
  assert.ok(input.durationSeconds > 0)
  assert.equal(input.text, narration.cues[input.cue - 1].text)
}
for (const name of ['locked-narration.json', 'captions.vi.vtt', 'transcript.vi.txt']) {
  assert.equal((await readFile(new URL(name, here), 'utf8')).includes('tâm điểm của cả cuộc chiến'), false)
}
assert.equal(manifest.reviewStatus, 'in_review')
assert.equal(manifest.publicationPerformed, false)
console.log('PASS original 4 hashes unchanged; initial 25 cues exact; corrected 3 spoken inputs/hash/words; candidate 4 hashes locked; no obsolete ending wording; candidate not published')
