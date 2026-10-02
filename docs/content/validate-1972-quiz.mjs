import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT_DIR = process.cwd();
const QUIZ_PATH = path.join(ROOT_DIR, 'docs', 'content', 'QUIZ-1972.json');

console.log('--- Validating Chapter 1972 Quiz Assessment Assets ---');

assert.ok(fs.existsSync(QUIZ_PATH), `Missing quiz file: ${QUIZ_PATH}`);

const raw = fs.readFileSync(QUIZ_PATH, 'utf-8');
const data = JSON.parse(raw);

assert.strictEqual(data.id, 'quiz-1972-chapter-assessment', 'Quiz ID must match quiz-1972-chapter-assessment');
assert.ok(data.title && data.title.includes('1972'), 'Quiz title must mention 1972');
assert.ok(Array.isArray(data.questions), 'Questions must be an array');
assert.strictEqual(data.questions.length, 5, 'Must have exactly 5 questions');

const coveredObjectives = new Set();
const questionIds = new Set();

data.questions.forEach((q, index) => {
  assert.ok(q.id, `Question ${index} missing id`);
  assert.ok(!questionIds.has(q.id), `Duplicate question id: ${q.id}`);
  questionIds.add(q.id);

  assert.ok(q.objectiveId, `Question ${q.id} missing objectiveId`);
  coveredObjectives.add(q.objectiveId);

  assert.ok(q.question && typeof q.question === 'string' && q.question.trim().length > 10, `Question ${q.id} text too short`);
  assert.ok(Array.isArray(q.options) && q.options.length === 4, `Question ${q.id} must have exactly 4 options`);

  const optIds = q.options.map(opt => opt.id);
  assert.deepStrictEqual(optIds, ['A', 'B', 'C', 'D'], `Question ${q.id} options must be A, B, C, D`);

  assert.ok(optIds.includes(q.correctOptionId), `Question ${q.id} correctOptionId (${q.correctOptionId}) not in options`);
  assert.ok(q.explanation && q.explanation.trim().length > 10, `Question ${q.id} explanation missing or too short`);
  assert.ok(Array.isArray(q.sourceIds) && q.sourceIds.length > 0, `Question ${q.id} must reference sourceIds`);
});

// Verify all 4 CLOs are covered
['CLO-1', 'CLO-2', 'CLO-3', 'CLO-4'].forEach(clo => {
  assert.ok(coveredObjectives.has(clo), `Objective ${clo} must be covered in quiz questions`);
});

console.log('[PASS] Quiz JSON syntax valid.');
console.log(`[PASS] 5 questions verified, covering all 4 CLOs (${Array.from(coveredObjectives).join(', ')}).`);
console.log('[PASS] All options, correct keys, explanations, and sources verified.');
console.log('--- ALL CHAPTER 1972 QUIZ VALIDATIONS PASSED ---');
