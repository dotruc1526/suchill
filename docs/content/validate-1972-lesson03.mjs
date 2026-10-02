import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

const ROOT_DIR = process.cwd();
const LESSON_PATH = path.join(ROOT_DIR, 'docs', 'content', 'LESSON-03-1972-STANDARD.md');
const TASK_PATH = path.join(ROOT_DIR, 'docs', 'tasks', 'active', 'CONTENT-018.md');

console.log('--- Validating Chapter 1972 Lesson 3 Standard Reading Assets ---');

// 1. Verify files exist
assert.ok(fs.existsSync(LESSON_PATH), `Missing lesson file: ${LESSON_PATH}`);
assert.ok(fs.existsSync(TASK_PATH), `Missing task card file: ${TASK_PATH}`);

const content = fs.readFileSync(LESSON_PATH, 'utf-8');

// 2. Verify metadata
assert.match(content, /lesson-1972-03-standard/, 'Lesson ID lesson-1972-03-standard must be present');
assert.match(content, /CLO-4/, 'Objective CLO-4 must be present');
assert.match(content, /CONTENT-018/, 'Task reference CONTENT-018 must be present');

// 3. Verify key historical dates and events
const requiredEvents = [
  '20/12/1972',
  '26/12/1972',
  'Khâm Thiên',
  '30/12/1972',
  '27/01/1973',
  'Hiệp định Paris'
];
for (const ev of requiredEvents) {
  assert.ok(content.includes(ev), `Lesson content must include key event/date: "${ev}"`);
}

// 4. Verify Claims mapping
const requiredClaims = [
  'CLM-1972-RD-001',
  'CLM-1972-RD-002',
  'CLM-1972-RD-003',
  'CLM-1972-RD-004',
  'CLM-1972-RD-005'
];
for (const clm of requiredClaims) {
  assert.ok(content.includes(clm), `Lesson content must reference claim: "${clm}"`);
}

// 5. Verify Sources mapping
const requiredSources = [
  'SRC-LB2-01',
  'SRC-LB2-02',
  'SRC-LB2-03',
  'SRC-LB2-04',
  'SRC-LB2-05',
  'SRC-1972-WEB-09'
];
for (const src of requiredSources) {
  assert.ok(content.includes(src), `Lesson content must reference source: "${src}"`);
}

// 6. Verify Academic Comparison and Text-first Fallback
assert.ok(content.includes('Đối chiếu số liệu'), 'Must contain academic comparison section');
assert.ok(content.includes('Text-first fallback'), 'Must declare text-first fallback mechanism');
assert.ok(content.includes('NO_ASSET_SELECTED'), 'Must adhere to media selection boundary');

// 7. Verify Reflection questions
assert.ok(content.includes('Câu hỏi suy ngẫm'), 'Must contain reflection questions');
assert.ok(content.includes('Câu hỏi 1') && content.includes('Câu hỏi 2'), 'Must have at least 2 reflection questions');

console.log('[PASS] Lesson 3 Standard Reading structure and pedagogical metadata valid.');
console.log('[PASS] Required event dates, claim IDs and source IDs are present; historical facts require human source review.');
console.log('[PASS] Text-first fallback and reflection questions intact.');
console.log('--- ALL CHAPTER 1972 LESSON 3 VALIDATIONS PASSED ---');
