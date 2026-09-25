const fs = require('fs');

// 1. Update CONTENT-002
let c002 = fs.readFileSync('docs/tasks/active/CONTENT-002.md', 'utf8');
c002 = c002.replace('> Status: BLOCKED', '> Status: DONE')
           .replace('> Status: READY', '> Status: DONE')
           .replace('Last updated: 2026-09-25', 'Last updated: 2026-09-25')
           .replace('Started: chưa bắt đầu lựa chọn', 'Started: 2026-09-25')
           .replace('Executor name: Thọ khi task được mở', 'Executor name: Thọ (Member 1)');

c002 = c002.replace('- [ ] Product owner chọn', '- [x] Product owner chọn')
           .replace('- [ ] Chọn pilot episode', '- [x] Chọn pilot episode')
           .replace('- [ ] Ghi ranh giới', '- [x] Ghi ranh giới');

c002 = c002.replace('| 2026-09-23 | Codex |', '| 2026-09-25 | Thọ | Hoàn tất chọn Mậu Thân 1968 | docs/content/MVP-BRIEF.md | Chuyển status DONE, mở khóa CONTENT-008 | Không |\n| 2026-09-23 | Codex |');
c002 = c002.replace('chưa có chapter/pilot brief.', 'docs/content/MVP-BRIEF.md');

fs.writeFileSync('docs/tasks/active/CONTENT-002.md', c002);

// 2. Update CONTENT-008
let c008 = fs.readFileSync('docs/tasks/blocked/CONTENT-008.md', 'utf8');
c008 = c008.replace('> Status: BLOCKED', '> Status: READY').replace('Last updated: 2026-09-23', 'Last updated: 2026-09-25');
fs.writeFileSync('docs/tasks/blocked/CONTENT-008.md', c008);

// 3. Update TASK-BOARD.md
let board = fs.readFileSync('docs/project/TASK-BOARD.md', 'utf8');
board = board.replace('| Thọ (Member 1); Product owner quyết định | READY |', '| Thọ (Member 1); Product owner quyết định | DONE |');
board = board.replace('| Thọ (Member 1); Product owner quyết định | BLOCKED |', '| Thọ (Member 1); Product owner quyết định | DONE |');
board = board.replace('docs/tasks/blocked/CONTENT-002.md', 'docs/tasks/done/CONTENT-002.md');
board = board.replace('docs/tasks/active/CONTENT-002.md', 'docs/tasks/done/CONTENT-002.md');

board = board.replace('| Thọ (Member 1) | BLOCKED | CONTENT-002', '| Thọ (Member 1) | READY | CONTENT-002');
board = board.replace('docs/tasks/blocked/CONTENT-008.md', 'docs/tasks/active/CONTENT-008.md');

board = board.replace('## Task update log\n\n', '## Task update log\n\n| 2026-09-25 | CONTENT-002 | Thọ (PO) | Chốt chủ đề Mậu Thân 1968 làm MVP, cập nhật MVP-BRIEF.md | Chuyển DONE, mở khóa CONTENT-008 |\n');

fs.writeFileSync('docs/project/TASK-BOARD.md', board);

console.log("Tasks updated successfully");
