import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = __dirname;

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

console.log('--- Validating Chapter 1972 Lesson 2 Authoring Assets ---');

// 1. Validate DIAGRAM-SAM2-1972.json
const diagramPath = path.join(contentDir, 'DIAGRAM-SAM2-1972.json');
assert(fs.existsSync(diagramPath), 'DIAGRAM-SAM2-1972.json must exist');
const diagramData = JSON.parse(fs.readFileSync(diagramPath, 'utf8'));

assert(diagramData.id === 'diagram-sam2-crew-1972', 'diagramData id must be diagram-sam2-crew-1972');
assert(Array.isArray(diagramData.nodes), 'diagramData nodes must be an array');
assert(diagramData.nodes.length >= 5, `diagramData must have >= 5 nodes, got ${diagramData.nodes.length}`);

for (const node of diagramData.nodes) {
  assert(node.id && node.name, `Node must have id and name: ${JSON.stringify(node)}`);
  assert(node.textFallback && node.textFallback.trim().length > 0, `Node ${node.id} must have textFallback for accessibility`);
  assert(node.claimId, `Node ${node.id} must reference a claimId`);
  assert(node.sourceId, `Node ${node.id} must reference a sourceId`);
}
console.log(`[PASS] Diagram data valid: ${diagramData.nodes.length} nodes with text-first fallback.`);

// 2. Validate LESSON-02-1972-STORY.json
const storyPath = path.join(contentDir, 'LESSON-02-1972-STORY.json');
assert(fs.existsSync(storyPath), 'LESSON-02-1972-STORY.json must exist');
const storyData = JSON.parse(fs.readFileSync(storyPath, 'utf8'));

assert(storyData.id === 'story-1972-sam2-v1-draft', 'storyData id must be story-1972-sam2-v1-draft');
assert(Array.isArray(storyData.scenes), 'storyData scenes must be an array');
assert(storyData.scenes.length === 8, `Expected exactly 8 scenes, got ${storyData.scenes.length}`);

const sceneMap = new Map();
storyData.scenes.forEach(s => sceneMap.set(s.id, s));

const expectedSceneIds = [
  'sam2-v1-briefing',
  'sam2-v1-crew',
  'sam2-v1-perspective',
  'sam2-v1-coordination',
  'sam2-v1-interference',
  'sam2-v1-check',
  'sam2-v1-debrief',
  'sam2-v1-end'
];

for (const sid of expectedSceneIds) {
  assert(sceneMap.has(sid), `Missing required scene: ${sid}`);
}

// Check nextSceneId transitions and choices
for (const scene of storyData.scenes) {
  if (scene.nextSceneId) {
    assert(sceneMap.has(scene.nextSceneId), `Scene ${scene.id} nextSceneId '${scene.nextSceneId}' does not exist`);
  }
  if (scene.choices) {
    assert(Array.isArray(scene.choices), `Scene ${scene.id} choices must be an array`);
    for (const choice of scene.choices) {
      assert(choice.id && choice.label, `Choice in ${scene.id} must have id and label`);
      assert(choice.nextSceneId && sceneMap.has(choice.nextSceneId), `Choice ${choice.id} target '${choice.nextSceneId}' does not exist`);
      if (choice.kind === 'branching') {
        assert(choice.isCorrect === undefined, `Branching choice ${choice.id} must not have isCorrect`);
      } else if (choice.kind === 'knowledge_check') {
        assert(typeof choice.isCorrect === 'boolean', `Knowledge check ${choice.id} must have boolean isCorrect`);
        assert(choice.explanation && choice.explanation.trim().length > 0, `Knowledge check ${choice.id} must have explanation`);
      }
    }
  }
}

// Graph reachability analysis: all scenes reachable from start and can reach end
const reachable = new Set();
function traverse(sceneId) {
  if (reachable.has(sceneId)) return;
  reachable.add(sceneId);
  const s = sceneMap.get(sceneId);
  if (!s) return;
  if (s.nextSceneId) traverse(s.nextSceneId);
  if (s.choices) {
    for (const c of s.choices) {
      traverse(c.nextSceneId);
    }
  }
}
traverse(storyData.startSceneId);

for (const sid of expectedSceneIds) {
  assert(reachable.has(sid), `Scene ${sid} is unreachable from start scene ${storyData.startSceneId}`);
}
console.log(`[PASS] Story graph valid: 8 reachable scenes, valid choices and transitions.`);

// 3. Validate LESSON-02-1972-NARRATION.md
const narrationPath = path.join(contentDir, 'LESSON-02-1972-NARRATION.md');
assert(fs.existsSync(narrationPath), 'LESSON-02-1972-NARRATION.md must exist');
const narrationContent = fs.readFileSync(narrationPath, 'utf8');

for (const sid of expectedSceneIds) {
  assert(narrationContent.includes(sid), `Narration doc must cover scene ${sid}`);
}
console.log(`[PASS] Narration markdown covers all 8 scenes.`);

console.log('--- ALL CHAPTER 1972 LESSON 2 AUTHORING VALIDATIONS PASSED ---');
