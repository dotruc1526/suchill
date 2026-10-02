import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { readRegisters, validateRegisters } from './validate.mjs';

const original = await readRegisters();
const script = fileURLToPath(new URL('./validate.mjs', import.meta.url));
const mutate = (change) => {
  const [s, c] = structuredClone(original);
  change(s, c);
  return validateRegisters(s, c).errors;
};
test('current registers pass without mutation', () => {
  const snapshot = JSON.stringify(original);
  assert.deepEqual(validateRegisters(...original), {
    errors: [], counts: { sources: 15, claims: 42, episodes: 7 },
  });
  assert.equal(JSON.stringify(original), snapshot);
});
const cases = [
  ['duplicate source ID', (s) => s.sources.push(structuredClone(s.sources[0])), /duplicate id/],
  ['duplicate claim ID', (_, c) => c.claims.push(structuredClone(c.claims[0])), /duplicate id/],
  ['duplicate episode', (_, c) => c.episodes.push(structuredClone(c.episodes[0])), /duplicate number/],
  ['unknown source', (_, c) => c.claims[0].sourceIds.push('SRC-1954-MISSING'), /unknown source/],
  ['unknown claim', (s) => s.sources[0].supportsClaims.push('CLM-1954-01-999'), /unknown claim/],
  ['missing reverse source binding', (s, c) => {
    const source = s.sources.find((row) => row.id === c.claims[0].sourceIds[0]);
    source.supportsClaims = source.supportsClaims.filter((id) => id !== c.claims[0].id);
  }, /reverse binding missing/],
  ['missing reverse claim binding', (s, c) => {
    const claim = c.claims.find((row) => row.id === s.sources[0].supportsClaims[0]);
    claim.sourceIds = claim.sourceIds.filter((id) => id !== s.sources[0].id);
  }, /reverse binding missing/],
  ['duplicate reference', (_, c) => c.claims[0].sourceIds.push(c.claims[0].sourceIds[0]), /duplicate entries/],
  ['missing episode claim', (_, c) => c.episodes[0].claimIds.shift(), /missing from episode/],
  ['wrong episode claim', (_, c) => c.episodes[1].claimIds.push(c.claims[0].id), /wrong episode/],
  ['unknown episode claim', (_, c) => c.episodes[0].claimIds.push('CLM-1954-01-999'), /unknown claim/],
  ['missing episode', (_, c) => c.episodes.pop(), /seven unique episodes/],
  ['ID mismatches episode', (_, c) => c.claims[0].episode = 2, /ID\/episode mismatch/],
  ['malformed source entry', (s) => s.sources[0] = null, /invalid id/],
  ['malformed reference array', (_, c) => c.claims[0].sourceIds = 'not an array', /expected nonempty array/],
  ['empty locators', (s) => s.sources[0].locators = [], /expected nonempty array/],
  ['missing metadata', (s) => s.sources[0].publisher = '', /missing publisher/],
  ['credential URL', (s) => s.sources[0].url = 'https://user:password@example.com', /public HTTPS URL/],
  ['unsupported version', (s) => s.version = 'published-v2', /unsupported version/],
  ['root canonical flag', (s) => s.canonicalUseAllowed = true, /canonical use forbidden/],
  ['claim-root canonical flag', (_, c) => c.canonicalUseAllowed = true, /canonical use forbidden/],
  ['claim canonical flag', (_, c) => c.claims[0].canonicalUseAllowed = true, /must remain unapproved/],
  ['missing claim safety flag', (_, c) => delete c.claims[0].canonicalUseAllowed, /must remain unapproved/],
  ['claim truth promoted', (_, c) => c.claims[0].truthClass = 'verified_fact', /must remain unapproved/],
  ['claim review promoted', (_, c) => c.claims[0].reviewStatus = 'approved', /must remain unapproved/],
  ['source review promoted', (s) => s.sources[0].reviewStatus = 'approved', /await historical reviewer/],
  ['historical reviewer self-added', (s) => s.historicalReviewer = 'AI', /must be null/],
];
for (const [name, change, expected] of cases) {
  test(`rejects ${name}`, () => assert.match(mutate(change).join('\n'), expected));
}
test('handles malformed roots without throwing', () => {
  for (const value of [null, [], 'invalid', {}]) {
    assert.ok(validateRegisters(value, value).errors.length > 0);
  }
});
test('CLI resolves default files independently of current directory', () => {
  const result = spawnSync(process.execPath, [script], { cwd: tmpdir(), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /structural preparation check only/);
});
test('CLI fails for invalid JSON, missing files, or invalid bindings and never writes registers', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'chapter1954-validator-'));
  try {
    const run = () => spawnSync(process.execPath, [script, directory], { encoding: 'utf8' });
    assert.equal(run().status, 1);
    await writeFile(join(directory, 'SOURCE-REGISTER.json'), '{broken');
    await writeFile(join(directory, 'CLAIM-REGISTER.json'), JSON.stringify(original[1]));
    assert.equal(run().status, 1);
    const sourceText = JSON.stringify(original[0]);
    const claims = structuredClone(original[1]);
    claims.claims[0].sourceIds.push('SRC-1954-MISSING');
    const claimText = JSON.stringify(claims);
    await writeFile(join(directory, 'SOURCE-REGISTER.json'), sourceText);
    await writeFile(join(directory, 'CLAIM-REGISTER.json'), claimText);
    const result = run();
    assert.equal(result.status, 1);
    assert.match(result.stderr, /unknown source/);
    assert.equal(await readFile(join(directory, 'SOURCE-REGISTER.json'), 'utf8'), sourceText);
    assert.equal(await readFile(join(directory, 'CLAIM-REGISTER.json'), 'utf8'), claimText);
  } finally {
    if (!resolve(directory).startsWith(join(resolve(tmpdir()), 'chapter1954-validator-'))) {
      throw new Error('Refusing cleanup outside the task temporary directory');
    }
    await rm(directory, { recursive: true, force: true });
  }
});
