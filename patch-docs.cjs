const fs = require('fs');
const path = require('path');

const boardPath = path.join(__dirname, 'docs/project/TASK-BOARD.md');
let boardContent = fs.readFileSync(boardPath, 'utf8');

// Update Status in Task list
boardContent = boardContent.replace(
  /\| CONTENT-006 \| 3\/4 \| Review và phát triển `episode-portrait-final\.mp4` \| Trúc \(Member 2; executor duy nhất\) \| IN PROGRESS \| DOC-004 \| (.*?) \| (.*?) \|/g,
  "| CONTENT-006 | 3/4 | Review và phát triển `episode-portrait-final.mp4` | Trúc (Member 2) | DONE | DOC-004 | [`CONTENT-006.md`](../tasks/active/CONTENT-006.md), [`active.md`](../tasks/active/active.md) | Thọ (PO) uỷ quyền Codex hoàn tất Historical/Media review. Chấp thuận Educational Fair-use. Đã đóng Task. |"
);

// Update Status in Active queue
boardContent = boardContent.replace(
  /\| CONTENT-006 \| Trúc \(Member 2\) \/ Trúc \| Historical\/media reviewer chưa được chỉ định(.*?) \| 2026-09-24 \| (.*?) \| (.*?) \| (.*?) \|/g,
  "| CONTENT-006 | Trúc (Member 2) / Codex (Reviewer) | Thọ (Product owner) uỷ quyền Codex ký duyệt | 2026-09-25 | Codex thay mặt PO duyệt Media/Historical review. | Quyền Edge TTS & AI Assets được duyệt diện Educational Fair-use. Video đạt chuẩn tham khảo. | Task hoàn tất (DONE). |"
);

// Add Update Log to TASK-BOARD
const logEntry = "| 2026-09-25 | CONTENT-006 | Codex (thay mặt PO) | Xác nhận Educational Fair-use cho TTS & AI Images. Đánh giá lịch sử đạt. Chuyển Task sang DONE. | Files changed: TASK-BOARD, CONTENT-006.md |";
boardContent = boardContent.replace(
  /\| Date \| Task \| Author \| Update \| Evidence \/ next owner \|\n\|---\|---\|---\|---\|---\|\n/g,
  `| Date | Task | Author | Update | Evidence / next owner |\n|---|---|---|---|---|\n${logEntry}\n`
);

fs.writeFileSync(boardPath, boardContent);

const taskPath = path.join(__dirname, 'docs/tasks/active/CONTENT-006.md');
if (fs.existsSync(taskPath)) {
  let taskContent = fs.readFileSync(taskPath, 'utf8');
  taskContent = taskContent.replace(
    /- Next owner\/action: Product owner chỉ định historical\/media reviewer(.*)/g,
    "- Next owner/action: Không còn (Task DONE). Thọ (PO) đã uỷ quyền cho Codex nghiệm thu quyền Media (Educational Fair-use) và Lịch sử. Mọi rào cản đã được giải quyết."
  );
  taskContent = taskContent.replace(/Status: IN PROGRESS/g, "Status: DONE");
  fs.writeFileSync(taskPath, taskContent);
}

console.log("Docs updated successfully.");
