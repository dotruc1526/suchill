import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const contentDir = __dirname;

console.log('--- Validating Chapter 1972 Lesson 3 Standard Content ---');

// Ensure LESSON-03-STANDARD.md exists
const lessonPath = path.join(contentDir, 'LESSON-03-STANDARD.md');
assert(fs.existsSync(lessonPath), 'LESSON-03-STANDARD.md must exist');

const lessonContent = fs.readFileSync(lessonPath, 'utf8');

// Simple placeholder checks – ensure file is non‑empty and contains a heading
assert(lessonContent.trim().length > 0, 'LESSON-03-STANDARD.md should not be empty');
assert(/#\s/.test(lessonContent), 'LESSON-03-STANDARD.md should contain at least one markdown heading');

// Forbidden technical terms (same as authoring validator but optional)
const forbiddenTerms = [
  'phát lệnh',
  'bám sát và phát lệnh',
  'tham số không gian',
  'tay quay',
  'khẩu lệnh',
];
for (const term of forbiddenTerms) {
  assert(!lessonContent.includes(term), `LESSON-03-STANDARD.md must not include unapproved term: "${term}"`);
}

console.log('[PASS] LESSON-03-STANDARD.md validation passed');
console.log('--- ALL CHAPTER 1972 LESSON 3 VALIDATIONS PASSED ---');
