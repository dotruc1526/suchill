import assert from 'node:assert/strict';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDraft, checkRefs, checkStory, readAuthoring, readAuthoringJson, registryIds, uniqueIds } from './authoringValidation.mjs';

const defaultDir = dirname(fileURLToPath(import.meta.url));
const expectedSceneIds = ['sam2-v1-briefing', 'sam2-v1-crew', 'sam2-v1-perspective',
  'sam2-v1-coordination', 'sam2-v1-interference', 'sam2-v1-check', 'sam2-v1-debrief', 'sam2-v1-end'];
export function validate1972Authoring(dir = defaultDir) {
  const evidence = readAuthoring(dir, 'CONTENT-016-EVIDENCE.md');
  const sources = registryIds(evidence, 'SRC-');
  const claims = registryIds(evidence, 'CLM-1972-');
  const refs = item => checkRefs(item, sources, claims);
  const diagram = readAuthoringJson(dir, 'DIAGRAM-SAM2-1972.json');
  assert.equal(diagram.id, 'diagram-sam2-crew-1972');
  checkDraft(diagram, false);
  refs(diagram);
  assert(Array.isArray(diagram.nodes) && diagram.nodes.length >= 5, 'At least five diagram nodes');
  uniqueIds(diagram.nodes.map(node => node.id), 'Diagram node IDs');
  for (const node of diagram.nodes) {
    assert(node.name?.trim() && node.textFallback?.trim(), 'Diagram name/text fallback');
    assert(node.sourceId && node.claimId, 'Diagram references required');
    refs(node);
  }
  const diagramRaw = readAuthoring(dir, 'DIAGRAM-SAM2-1972.json');
  for (const term of ['phát lệnh', 'bám sát và phát lệnh', 'nhận tham số điều khiển', 'tay quay', 'khẩu lệnh']) {
    assert(!diagramRaw.includes(term), `Unapproved diagram procedure: ${term}`);
  }
  const story = readAuthoringJson(dir, 'LESSON-02-1972-STORY.json');
  assert.equal(story.id, 'story-1972-sam2-v1-draft');
  assert.equal(story.diagramDocumentId, diagram.id, 'Diagram identity');
  assert.equal(story.scenes.length, expectedSceneIds.length, 'Exactly eight scenes');
  for (const id of expectedSceneIds) assert(story.scenes.some(scene => scene.id === id), `Missing scene: ${id}`);
  const graph = checkStory(story, refs, diagram.nodes, 'requiredDiagramNodeIds');
  const narration = readAuthoring(dir, 'LESSON-02-1972-NARRATION.md');
  for (const id of expectedSceneIds) assert(narration.includes(id), `Narration missing scene: ${id}`);
  const forbidden = ['tọa độ mục tiêu', 'tham số không gian', 'thao tác tay quay', 'bó chổi chà', '45 máy gây nhiễu', 'bẻ gãy chiến dịch'];
  for (const term of forbidden) {
    assert(!narration.includes(term), `Unapproved narration term: ${term}`);
    assert(!JSON.stringify(story).includes(term), `Unapproved story term: ${term}`);
  }
  return { ...graph, diagramNodes: diagram.nodes.length };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = validate1972Authoring();
  console.log(`PASS: ${result.diagramNodes} unique diagram nodes; ${result.sceneCount} scenes; ${result.paths} terminating paths covering every required scene/artifact; source/claim references; choice taxonomy; draft boundary.`);
  console.log('Not verified: historical accuracy, real media rights, runtime accessibility, human sign-off.');
}
