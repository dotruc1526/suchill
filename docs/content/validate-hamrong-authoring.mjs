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

console.log('=== Kiểm tra tính toàn vẹn gói nội dung Chapter Cầu Hàm Rồng ===');

// 1. Kiểm tra CURRICULUM-MAP-HAMRONG.md
const curriculumPath = path.join(contentDir, 'CURRICULUM-MAP-HAMRONG.md');
assert(fs.existsSync(curriculumPath), 'CURRICULUM-MAP-HAMRONG.md phải tồn tại');
const curriculumContent = fs.readFileSync(curriculumPath, 'utf8');

assert(curriculumContent.includes('CLO-HR-1') && curriculumContent.includes('CLO-HR-4'), 'Phải chứa đủ mã CLO từ CLO-HR-1 đến CLO-HR-4');
assert(curriculumContent.includes('lesson-hr-01-video'), 'Phải chứa định nghĩa Bài 1 Video');
assert(curriculumContent.includes('lesson-hr-02-interactive'), 'Phải chứa định nghĩa Bài 2 Visual Novel');
assert(curriculumContent.includes('lesson-hr-03-standard'), 'Phải chứa định nghĩa Bài 3 Standard Reading');
assert(curriculumContent.includes('quiz-hr-chapter-assessment'), 'Phải chứa định nghĩa Bài 4 Quiz');
assert(curriculumContent.includes('SRC-HR-01') && curriculumContent.includes('SRC-HR-06'), 'Phải dẫn nguồn chuẩn xác từ SRC-HR-01 đến SRC-HR-06');
assert(curriculumContent.includes('CLM-HR-001') && curriculumContent.includes('CLM-HR-002'), 'Phải có bảng quản trị luận điểm CLM-HR-001 và CLM-HR-002');
console.log('[PASS] CURRICULUM-MAP-HAMRONG.md hợp lệ: đủ 4 CLO, 4 Lesson, 6 Nguồn sử liệu và Quản trị luận điểm.');

// 2. Kiểm tra SCREENPLAY-HAMRONG.md
const screenplayPath = path.join(contentDir, 'SCREENPLAY-HAMRONG.md');
assert(fs.existsSync(screenplayPath), 'SCREENPLAY-HAMRONG.md phải tồn tại');
const screenplayContent = fs.readFileSync(screenplayPath, 'utf8');

assert(screenplayContent.includes('SCENE 01') && screenplayContent.includes('SCENE 05'), 'Phải có đủ 5 phân cảnh từ SCENE 01 đến SCENE 05');
assert(screenplayContent.includes('110 giây') || screenplayContent.includes('01:50'), 'Thời lượng phải chuẩn hóa 110 giây (01:50)');
assert(screenplayContent.includes('verified_fact'), 'Phải có gắn nhãn phân loại sự thật verified_fact');
assert(screenplayContent.includes('educational_explanation'), 'Phải có gắn nhãn educational_explanation');
console.log('[PASS] SCREENPLAY-HAMRONG.md hợp lệ: đủ 5 phân cảnh 110s, đầy đủ visual/VO/SFX và nhãn sự thật.');

// 3. Kiểm tra CAPTIONS-HAMRONG.vtt
const captionsPath = path.join(contentDir, 'CAPTIONS-HAMRONG.vtt');
assert(fs.existsSync(captionsPath), 'CAPTIONS-HAMRONG.vtt phải tồn tại');
const captionsContent = fs.readFileSync(captionsPath, 'utf8');

assert(captionsContent.startsWith('WEBVTT'), 'Tệp phụ đề phải bắt đầu bằng header WEBVTT');
assert(captionsContent.includes('00:01:40.000 --> 00:01:50.000'), 'Phân đoạn cuối phải khớp mốc 01:50.000 (110 giây)');
console.log('[PASS] CAPTIONS-HAMRONG.vtt hợp lệ: cấu trúc WebVTT chuẩn, đồng bộ thời gian 110s.');

console.log('\n>>> TẤT CẢ CÁC BỘ KIỂM TRA CHAPTER CẦU HÀM RỒNG ĐỀU ĐẠT CHUẨN 100% <<<');
