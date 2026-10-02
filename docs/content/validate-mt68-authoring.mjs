import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDraft, checkRefs, checkStory, readAuthoring, readAuthoringJson, registryIds, uniqueIds } from './authoringValidation.mjs';

const defaultDir = dirname(fileURLToPath(import.meta.url));
export function validateMt68Authoring(dir = defaultDir) {
  const read = file => readAuthoring(dir, file);
  const json = file => readAuthoringJson(dir, file);
  const sources = read('HISTORICAL-SOURCES.md');
  const sourceIds = registryIds(sources, 'SRC-MT68-');
  const claimIds = registryIds(sources, 'CLM-MT68-');
  assert.equal(sourceIds.size, 6, 'Six canonical MT68 sources');
  assert.equal(claimIds.size, 7, 'Seven canonical MT68 claims');
  const refs = item => checkRefs(item, sourceIds, claimIds);
  const map = json('MAP-MT68.json');
  checkDraft(map);
  assert.equal(map.coordinateSystem, null);
  assert.equal(map.nodes.length, 5);
  uniqueIds(map.nodes.map(node => node.id), 'Map IDs');
  for (const node of map.nodes) {
    refs(node);
    assert(!node.coordinates && !Object.hasOwn(node, 'x') && !Object.hasOwn(node, 'y'), 'Unverified coordinates');
    assert.equal(node.mediaRef, null, 'Unapproved media dependency');
    assert(node.sourceIds.length && node.claimIds.length && node.fallbackText?.trim());
  }
  const story = json('LESSON-02-STORY.json');
  assert.equal(story.mapDocumentId, map.id, 'Map identity');
  const graph = checkStory(story, refs, map.nodes);
  const narration = json('PILOT-NARRATION.json');
  checkDraft(narration);
  assert.equal(narration.durationSeconds, 110);
  assert.equal(narration.spokenAudioStatus, 'NOT_RECORDED');
  uniqueIds(narration.cues.map(cue => cue.id), 'Cue IDs');
  const vtt = read('PILOT-CAPTIONS.vtt').trim().split(/\r?\n\r?\n/);
  assert.equal(vtt.shift(), 'WEBVTT');
  assert.equal(vtt.length, narration.cues.length);
  const stamp = seconds => '00:' + String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0') + '.000';
  let end = 0;
  narration.cues.forEach((cue, index) => {
    refs(cue);
    assert.equal(cue.startSeconds, end, 'Gap/overlap in cue');
    assert(Number.isInteger(cue.endSeconds) && cue.endSeconds > cue.startSeconds && cue.endSeconds <= 110);
    const lines = vtt[index].split(/\r?\n/);
    assert.equal(lines[0], cue.id);
    assert.equal(lines[1], stamp(cue.startSeconds) + ' --> ' + stamp(cue.endSeconds));
    assert.equal(lines.slice(2).join(' '), cue.text, 'Narration/caption mismatch');
    end = cue.endSeconds;
  });
  assert.equal(end, 110);
  const quiz = json('QUIZ-MT68.json');
  checkDraft(quiz);
  uniqueIds(quiz.questions.map(question => question.id), 'Question IDs');
  assert.equal(quiz.questions.length, 5);
  for (const question of quiz.questions) {
    refs(question);
    assert(question.sourceIds.length, 'Question source required');
    assert(question.question?.trim() && question.explanation?.trim(), 'Question text/explanation');
    assert(question.options.length >= 2 && question.options.length <= 4, 'Quiz option count');
    uniqueIds(question.options.map(option => option.id), 'Option IDs');
    assert(question.options.every(option => option.text?.trim()), 'Option text');
    assert(question.options.some(option => option.id === question.correctOptionId), 'Quiz correct option');
    assert(['CLO-1', 'CLO-2', 'CLO-3', 'CLO-4'].includes(question.objectiveId));
  }
  const card = ['active', 'done', 'blocked'].map(folder => `../tasks/${folder}/CONTENT-014.md`)
    .find(file => existsSync(resolve(dir, file)));
  assert(card, 'CONTENT-014 card missing');
  for (const file of ['PILOT-SCREENPLAY.md', 'LESSON-02-INTERACTIVE.md', 'CURRICULUM-MAP.md',
    'PRODUCTION-NOTES.md', 'MEDIA-REVIEW-MT68.md', 'HISTORICAL-SOURCES.md',
    card, '../tasks/active/PR21-HANDOFF.md']) {
    for (const match of read(file).matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      assert(existsSync(resolve(dir, dirname(file), target)), file + ': broken link ' + target);
    }
  }
  return { ...graph, mapNodes: map.nodes.length, questions: quiz.questions.length, cues: narration.cues.length };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validateMt68Authoring();
  console.log(`PASS: ${result.mapNodes} map nodes; ${result.sceneCount} scenes; ${result.paths} complete paths; ${result.questions} quiz questions; ${result.cues} identical narration/VTT cues, 110s; unique source/claim IDs and local links.`);
  console.log('Not verified: recorded audio timing, media files/rights, human sign-off, runtime behavior.');
}
