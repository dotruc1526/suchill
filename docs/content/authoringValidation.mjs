import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const readAuthoring = (dir, file) => readFileSync(resolve(dir, file), 'utf8').replace(/^\uFEFF/, '');
export const readAuthoringJson = (dir, file) => JSON.parse(readAuthoring(dir, file));
export function uniqueIds(items, label) {
  assert(items.every(id => typeof id === 'string' && id.trim()), `${label}: missing ID`);
  assert.equal(new Set(items).size, items.length, `${label}: duplicate ID`);
}

// Only first-column registry rows declare identity; references in other columns do not.
export function registryIds(text, prefix) {
  const rows = text.split(/\r?\n/).filter(line => line.startsWith('|'));
  const ids = rows.flatMap(line => (line.split('|')[1] ?? '').match(new RegExp(`${prefix}[A-Z0-9-]+`, 'g')) ?? []);
  uniqueIds(ids, `${prefix} registry`);
  assert(ids.length, `${prefix} registry is empty`);
  return new Set(ids);
}

export function checkRefs(item, sources, claims) {
  const sourceIds = item.sourceIds ?? (item.sourceId ? [item.sourceId] : []);
  const claimIds = item.claimIds ?? (item.claimId ? [item.claimId] : []);
  assert(Array.isArray(sourceIds) && Array.isArray(claimIds), 'References must be arrays');
  uniqueIds(sourceIds, 'Source references');
  uniqueIds(claimIds, 'Claim references');
  for (const id of sourceIds) assert(sources.has(id), `Missing source: ${id}`);
  for (const id of claimIds) assert(claims.has(id), `Missing claim: ${id}`);
}

export function checkDraft(item, authoringOnly = true) {
  assert.equal(item.status, 'draft', 'Authoring artifact must remain draft');
  if (authoringOnly) assert.equal(item.authoringOnly, true, 'Authoring artifact must not be runtime content');
}

export function checkStory(story, refs, artifactNodes = [], nodeField = 'requiredMapNodeIds') {
  checkDraft(story);
  refs(story);
  assert(Array.isArray(story.scenes) && story.scenes.length, 'Missing scenes');
  uniqueIds(story.scenes.map(scene => scene.id), 'Scene IDs');
  uniqueIds(story.scenes.flatMap(scene => (scene.choices ?? []).map(choice => choice.id)), 'Choice IDs');
  const byId = new Map(story.scenes.map(scene => [scene.id, scene]));
  const required = story.scenes.filter(scene => scene.required).map(scene => scene.id);
  const nodeIds = new Set(artifactNodes.map(node => node.id));
  const sceneKinds = ['narration', 'evidence', 'choice', 'debrief', 'end'];
  for (const scene of story.scenes) {
    assert(sceneKinds.includes(scene.kind), `Unknown scene kind: ${scene.kind}`);
    refs(scene);
    for (const nodeId of scene[nodeField] ?? []) assert(nodeIds.has(nodeId), `Missing artifact node: ${nodeId}`);
    if (scene.kind === 'choice') {
      assert(Array.isArray(scene.choices) && scene.choices.length >= 2 && scene.choices.length <= 4, 'Choice count');
      assert(!scene.nextSceneId, 'Choice must not have an ambiguous default transition');
    } else assert(!scene.choices, 'Choices only belong to choice scenes');
    for (const choice of scene.choices ?? []) {
      assert(choice.label?.trim(), 'Choice label');
      assert(['narrative', 'reflection', 'branching', 'knowledge_check'].includes(choice.kind), 'Unknown choice kind');
      assert(choice.nextSceneId && byId.has(choice.nextSceneId), 'Choice destination');
      if (choice.kind === 'knowledge_check') {
        assert.equal(typeof choice.isCorrect, 'boolean', 'Knowledge correctness');
        assert(choice.explanation?.trim(), 'Knowledge explanation');
      } else {
        assert(!Object.hasOwn(choice, 'isCorrect'), 'Narrative correctness');
        assert(choice.response?.trim(), 'Narrative response');
      }
    }
    if (scene.choices?.some(choice => choice.kind === 'knowledge_check')) {
      assert(scene.choices.every(choice => choice.kind === 'knowledge_check'), 'Mixed choice taxonomy');
      assert.equal(scene.choices.filter(choice => choice.isCorrect).length, 1, 'Exactly one correct answer');
      assert.equal(scene.interactionPolicy, 'continueAfterFeedback', 'Knowledge feedback policy');
    }
    if (scene.kind === 'end') assert(!scene.nextSceneId, 'End has outgoing transition');
    else if (!scene.choices) assert(scene.nextSceneId && byId.has(scene.nextSceneId), 'Missing next scene');
  }
  const reachable = new Set();
  let paths = 0;
  function walk(id, path = [], seenNodes = []) {
    assert(byId.has(id), `Missing scene: ${id}`);
    assert(!path.includes(id), `Cycle: ${id}`);
    reachable.add(id);
    const scene = byId.get(id);
    const seen = [...path, id];
    const nodes = [...seenNodes, ...(scene[nodeField] ?? [])];
    if (scene.kind === 'end') {
      for (const req of required) assert(seen.includes(req), `Required scene bypassed: ${req}`);
      for (const nodeId of nodeIds) assert(nodes.includes(nodeId), `Artifact coverage bypassed: ${nodeId}`);
      paths++;
      return;
    }
    for (const target of scene.choices?.map(choice => choice.nextSceneId) ?? [scene.nextSceneId]) walk(target, seen, nodes);
  }
  walk(story.startSceneId);
  assert(paths, 'No terminating path');
  assert.equal(reachable.size, story.scenes.length, 'Unreachable scene');
  return { paths, sceneCount: story.scenes.length };
}
