import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { validateMt68Authoring } from './validate-mt68-authoring.mjs';
import { validate1972Authoring } from './validate-1972-authoring.mjs';

const contentDir = dirname(fileURLToPath(import.meta.url));
function withFixture(callback) {
  const temporaryRoot = mkdtempSync(join(tmpdir(), 'suchill-authoring-review-'));
  try {
    cpSync(resolve(contentDir, '..'), join(temporaryRoot, 'docs'), { recursive: true });
    return callback(join(temporaryRoot, 'docs', 'content'));
  } finally {
    const target = resolve(temporaryRoot);
    assert.equal(dirname(target), resolve(tmpdir()), 'Cleanup must stay inside system temp');
    assert(target.split(/[\\/]/).at(-1).startsWith('suchill-authoring-review-'), 'Cleanup only this generated fixture');
    rmSync(target, { recursive: true, force: true });
  }
}
function editJson(dir, file, mutate) {
  const target = join(dir, file);
  const value = JSON.parse(readFileSync(target, 'utf8').replace(/^\uFEFF/, ''));
  mutate(value);
  writeFileSync(target, JSON.stringify(value, null, 2), 'utf8');
}
function rejected(name, file, mutate, validator, expected) {
  test(name, () => withFixture(dir => {
    editJson(dir, file, mutate);
    assert.throws(() => validator(dir), expected);
  }));
}

test('Current MT68 and 1972 draft packages validate', () => {
  assert.equal(validateMt68Authoring().paths, 6);
  assert.equal(validate1972Authoring().paths, 3);
});
for (const prefix of ['SRC-MT68-', 'CLM-MT68-']) {
  test(`Reject duplicated ${prefix} identities even if Set membership would pass`, () => withFixture(dir => {
    const target = join(dir, 'HISTORICAL-SOURCES.md');
    writeFileSync(target, readFileSync(target, 'utf8') + `\n| ${prefix}01 | Contradictory meaning | verified_fact |\n`);
    assert.throws(() => validateMt68Authoring(dir), /duplicate ID/);
  }));
}
rejected('Reject unresolved MT68 source', 'MAP-MT68.json', map => { map.nodes[0].sourceIds = ['SRC-MT68-99']; }, validateMt68Authoring, /Missing source/);
rejected('Reject accidental map publication', 'MAP-MT68.json', map => { map.status = 'published'; }, validateMt68Authoring, /remain draft/);
rejected('Reject unapproved mandatory map media', 'MAP-MT68.json', map => { map.nodes[0].mediaRef = 'external.jpg'; }, validateMt68Authoring, /Unapproved media/);
rejected('Reject duplicate quiz option identities', 'QUIZ-MT68.json', quiz => { quiz.questions[0].options[1].id = 'A'; }, validateMt68Authoring, /duplicate ID/);
rejected('Reject quiz answer referring to absent option', 'QUIZ-MT68.json', quiz => { quiz.questions[0].correctOptionId = 'missing'; }, validateMt68Authoring, /Quiz correct option/);
rejected('Reject mismatched transcript/caption', 'PILOT-NARRATION.json', narration => { narration.cues[0].text = 'Mismatched'; }, validateMt68Authoring, /Narration\/caption mismatch/);
rejected('Reject 1972 scene cycle that original reachability check missed', 'LESSON-02-1972-STORY.json', story => { story.scenes[6].nextSceneId = story.scenes[0].id; }, validate1972Authoring, /Cycle/);
rejected('Reject 1972 required scene bypass despite all scenes reachable', 'LESSON-02-1972-STORY.json', story => { story.scenes[5].choices[0].nextSceneId = story.scenes[7].id; }, validate1972Authoring, /Required scene bypassed/);
rejected('Reject duplicate 1972 choices', 'LESSON-02-1972-STORY.json', story => { story.scenes[5].choices[1].id = story.scenes[5].choices[0].id; }, validate1972Authoring, /duplicate ID/);
rejected('Reject multiple correct 1972 knowledge answers', 'LESSON-02-1972-STORY.json', story => { story.scenes[5].choices[0].isCorrect = true; }, validate1972Authoring, /Exactly one correct answer/);
rejected('Reject absent diagram coverage', 'LESSON-02-1972-STORY.json', story => { story.scenes[1].requiredDiagramNodeIds.pop(); }, validate1972Authoring, /Artifact coverage bypassed/);
rejected('Reject unknown diagram claim', 'DIAGRAM-SAM2-1972.json', diagram => { diagram.nodes[0].claimId = 'CLM-1972-VN-999'; }, validate1972Authoring, /Missing claim/);
rejected('Reject duplicate diagram nodes', 'DIAGRAM-SAM2-1972.json', diagram => { diagram.nodes[1].id = diagram.nodes[0].id; }, validate1972Authoring, /duplicate ID/);
rejected('Reject missing diagram fallback', 'DIAGRAM-SAM2-1972.json', diagram => { diagram.nodes[0].textFallback = ''; }, validate1972Authoring, /fallback/);
rejected('Reject previously excluded story micro-mechanics', 'LESSON-02-1972-STORY.json', story => { story.scenes[3].text += ' tọa độ mục tiêu'; }, validate1972Authoring, /Unapproved story term/);
rejected('Reject narrative correctness including false', 'LESSON-02-STORY.json', story => { story.scenes[1].choices[0].isCorrect = false; }, validateMt68Authoring, /Narrative correctness/);
