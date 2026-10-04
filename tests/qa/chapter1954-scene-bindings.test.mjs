import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { after, test } from 'node:test'
import { createServer } from 'vite'
const vite = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, hmr: false }, appType: 'custom' })
after(() => vite.close())
const { buildCandidateImport } = await vite.ssrLoadModule('/src/services/reference1954/candidateImport.ts')
const { lessonSixBindings } = await vite.ssrLoadModule('/src/services/reference1954/lessonSixBindings.ts')
const { candidateLessons, lessonOneCandidate, lessonSixCandidate } = await vite.ssrLoadModule('/src/services/reference1954/candidateLessons.ts')
const { sources } = JSON.parse(await readFile('docs/content/chapter1954/SOURCE-REGISTER.json', 'utf8'))
const { claims } = JSON.parse(await readFile('docs/content/chapter1954/CLAIM-REGISTER.json', 'utf8'))
const known = new Set(sources.map(source => source.id))
const studies = [lessonOneCandidate, ...Object.values(candidateLessons), lessonSixCandidate]

test('fact scenes bind exact existing claims and supporting sources; fiction is not archival testimony', () => {
  const plan = buildCandidateImport(studies, known)
  for (const trace of plan.sceneTraceability) {
    const scene = plan.story.scenes.find(item => item.id === trace.sceneId)
    assert.deepEqual(scene.claimIds, trace.claimIds)
    assert.deepEqual(scene.sourceIds, trace.sourceIds)
    assert.equal(trace.reviewStatus, 'needs_historical_review')
    for (const id of scene.claimIds) {
      const claim = claims.find(item => item.id === id)
      assert.ok(claim, `missing register claim ${id}`)
      assert.equal(claim.episode, 6, 'no convenient cross-episode attribution')
      assert.equal(claim.canonicalUseAllowed, false)
      for (const sourceId of claim.sourceIds) assert.ok(scene.sourceIds.includes(sourceId), `${id} missing supporting source`)
    }
    if (trace.boundary === 'fictional_narrative') {
      assert.deepEqual(scene.claimIds, [])
      assert.deepEqual(scene.sourceIds, [])
      assert.match(scene.prompt, /HƯ CẤU/)
    }
  }
  assert.equal(plan.story.status, 'in_review')
  assert.equal(plan.publicationAllowed, false)
  assert.ok(plan.story.scenes.find(scene => scene.id.endsWith('.map-17')).claimIds.includes('CLM-1954-06-003'))
  assert.ok(plan.story.scenes.find(scene => scene.id.endsWith('.summary')).claimIds.includes('CLM-1954-06-002'))
})

test('import fails closed for missing/unknown scenes, claims, sources and fiction passed as fact', () => {
  const mutate = fn => { const bindings = structuredClone(lessonSixBindings); fn(bindings); return () => buildCandidateImport(studies, known, bindings) }
  assert.throws(mutate(bindings => bindings.pop()), /Missing scene binding/)
  assert.throws(mutate(bindings => bindings[0].sceneId = 'invented'), /Unknown scene binding/)
  assert.throws(mutate(bindings => bindings[1].claimIds = ['CLM-UNKNOWN']), /Unknown scene claim/)
  assert.throws(mutate(bindings => bindings[1].claimIds = []), /Missing factual claims/)
  assert.throws(mutate(bindings => bindings[1].sourceIds = ['SRC-UNKNOWN']), /Unknown scene source/)
  assert.throws(mutate(bindings => bindings[3].sourceIds = ['SRC-1954-GENEVA-DECL']), /Missing claim source/)
  assert.throws(mutate(bindings => bindings[2].claimIds = ['CLM-1954-06-004']), /Fiction presented as sourced fact/)
  assert.throws(mutate(bindings => bindings[4].claimIds = []), /Missing factual claims/)
  assert.throws(mutate(bindings => bindings[4].claimsRequired = false), /Invalid claim requirement/)
  assert.throws(mutate(bindings => bindings[2].boundary = 'approved_fact'), /Unknown truth boundary/)
  assert.throws(mutate(bindings => bindings[1].claimIds = ['CLM-1954-06-004']), /Claim does not match scene/)
  assert.throws(mutate(bindings => bindings[1].sourceIds.push('SRC-1954-GENEVA-CEASE')), /Source does not match scene/)
})
