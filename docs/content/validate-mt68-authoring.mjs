import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const read = name => readFileSync(resolve(dir, name), 'utf8').replace(/^\uFEFF/, '');
const json = name => JSON.parse(read(name));
const sources = read('HISTORICAL-SOURCES.md');
const sourceIds = new Set([...sources.matchAll(/^\| (SRC-MT68-\d+) \|/gm)].map(m => m[1]));
const claimIds = new Set([...sources.matchAll(/^\| (CLM-MT68-\d+) \|/gm)].map(m => m[1]));
const unique = (items, label) => assert.equal(new Set(items).size, items.length, label);
function refs(item) {
  for (const id of item.sourceIds ?? []) assert(sourceIds.has(id), 'Missing source: ' + id);
  for (const id of item.claimIds ?? []) assert(claimIds.has(id), 'Missing claim: ' + id);
}
const map = json('MAP-MT68.json');
assert.equal(map.authoringOnly, true);
assert.equal(map.coordinateSystem, null);
assert.equal(map.nodes.length, 5);
unique(map.nodes.map(n => n.id), 'Map IDs');
for (const n of map.nodes) {
  refs(n);
  assert(!n.coordinates, 'Unverified coordinates');
  assert.equal(n.mediaRef, null, 'Unapproved media dependency');
  assert(n.sourceIds.length && n.claimIds.length && n.fallbackText);
}
const story = json('LESSON-02-STORY.json');
assert.equal(story.status, 'draft');
assert.equal(story.authoringOnly, true);
refs(story);
unique(story.scenes.map(s => s.id), 'Scene IDs');
const byId = new Map(story.scenes.map(s => [s.id, s]));
const required = story.scenes.filter(s => s.required).map(s => s.id);
unique(story.scenes.flatMap(s => (s.choices ?? []).map(c => c.id)), 'Choice IDs');
for (const scene of story.scenes) {
  refs(scene);
  for (const c of scene.choices ?? []) {
    assert(c.nextSceneId && byId.has(c.nextSceneId), 'Choice destination');
    if (c.kind === 'knowledge_check') {
      assert.equal(typeof c.isCorrect, 'boolean');
      assert(c.explanation);
    } else {
      assert(!Object.hasOwn(c, 'isCorrect'), 'Narrative correctness');
      assert(c.response);
    }
  }
  if (scene.choices?.some(c => c.kind === 'knowledge_check')) {
    assert.equal(scene.choices.filter(c => c.isCorrect).length, 1);
    assert.equal(scene.interactionPolicy, 'continueAfterFeedback');
  }
}
const reachable = new Set();
let paths = 0;
function walk(id, path = [], seenNodes = []) {
  assert(byId.has(id), 'Missing scene ' + id);
  assert(!path.includes(id), 'Cycle: ' + id);
  reachable.add(id);
  const scene = byId.get(id);
  const seen = [...path, id];
  const nodes = [...seenNodes, ...(scene.requiredMapNodeIds ?? [])];
  for (const node of nodes) assert(map.nodes.some(n => n.id === node), 'Missing map node');
  if (scene.kind === 'end') {
    assert(!scene.nextSceneId && !scene.choices, 'End has outgoing transition');
    for (const req of required) assert(seen.includes(req), 'Required scene bypassed: ' + req);
    for (const node of map.nodes) assert(nodes.includes(node.id), 'Map coverage bypassed');
    paths++;
    return;
  }
  const next = scene.choices?.map(c => c.nextSceneId) ?? [scene.nextSceneId];
  assert(next.length);
  for (const target of next) walk(target, seen, nodes);
}
walk(story.startSceneId);
assert.equal(reachable.size, story.scenes.length, 'Unreachable scene');
const narration = json('PILOT-NARRATION.json');
assert.equal(narration.durationSeconds, 110);
assert.equal(narration.spokenAudioStatus, 'NOT_RECORDED');
unique(narration.cues.map(c => c.id), 'Cue IDs');
const vtt = read('PILOT-CAPTIONS.vtt').trim().split(/\r?\n\r?\n/);
assert.equal(vtt.shift(), 'WEBVTT');
assert.equal(vtt.length, narration.cues.length);
const stamp = n => '00:' + String(Math.floor(n / 60)).padStart(2, '0') + ':' +
  String(n % 60).padStart(2, '0') + '.000';
let end = 0;
narration.cues.forEach((cue, i) => {
  refs(cue);
  assert.equal(cue.startSeconds, end, 'Gap/overlap in cue');
  assert(cue.endSeconds > cue.startSeconds && cue.endSeconds <= 110);
  const lines = vtt[i].split(/\r?\n/);
  assert.equal(lines[0], cue.id);
  assert.equal(lines[1], stamp(cue.startSeconds) + ' --> ' + stamp(cue.endSeconds));
  assert.equal(lines.slice(2).join(' '), cue.text, 'Narration/caption mismatch');
  end = cue.endSeconds;
});
assert.equal(end, 110);
const quiz = json('QUIZ-MT68.json');
unique(quiz.questions.map(q => q.id), 'Question IDs');
assert.equal(quiz.questions.length, 5);
for (const q of quiz.questions) {
  refs(q);
  unique(q.options.map(o => o.id), 'Option IDs');
  assert(q.options.some(o => o.id === q.correctOptionId));
  assert(['CLO-1', 'CLO-2', 'CLO-3', 'CLO-4'].includes(q.objectiveId));
}
for (const file of ['PILOT-SCREENPLAY.md', 'LESSON-02-INTERACTIVE.md',
  'CURRICULUM-MAP.md', 'PRODUCTION-NOTES.md', 'MEDIA-REVIEW-MT68.md',
  'HISTORICAL-SOURCES.md', '../tasks/active/CONTENT-014.md',
  '../tasks/active/PR21-HANDOFF.md']) {
  for (const match of read(file).matchAll(/\]\(([^)]+)\)/g)) {
    const target = match[1].split('#')[0];
    if (!target || /^[a-z]+:/i.test(target)) continue;
    assert(existsSync(resolve(dir, dirname(file), target)), file + ': broken link ' + target);
  }
}
console.log('PASS: 5 map nodes; ' + story.scenes.length + ' scenes; ' + paths +
  ' complete paths; 5 quiz questions; ' + narration.cues.length +
  ' identical narration/VTT cues, 110s; source/claim IDs and local links.');
console.log('Not verified: recorded audio timing, media files, human sign-off, runtime behavior.');
