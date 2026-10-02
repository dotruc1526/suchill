# M7-GATE-OPEN-001 — Quyết định Product Owner mở M7

> Status: REVIEW
> Started: 2026-10-03 (Asia/Saigon)

- Owner / Reviewer: Dương (Product Owner, người duyệt quyết định).
- Executor: Codex.
- Branch: codex/m7-po-open-20261003; base PR #109 / 12456dd.
- Depends on: Chỉ thị trực tiếp của PO sau khi đọc báo cáo M6/M7 trong chat.
- Files claimed: docs/project/TASK-BOARD.md và task card này trên nhánh riêng.
- Acceptance: ghi M7 OPEN, ngày và nguồn quyết định; giữ M6 OPEN; không đổi task DONE hoặc bỏ dependency/release gate.
- Next action: tích hợp PR tài liệu; decision APPROVED, documentation integration review pending.

## Quyết định APPROVED

Ngày 2026-10-03, Dương yêu cầu: “Tôi là Dương, mở M07 đi”. M07 trong ngữ cảnh này là milestone M7, không phải task M7-07.

PO đã nhận báo cáo M6 còn OPEN, M7 LOCKED và các evidence lịch sử/media/thiết bị/release còn thiếu. Chỉ thị mới cho phép mở M7 song song M6, là ngoại lệ lịch trình thay thế yêu cầu đóng M6 trước khi mở M7 trong Phase 9/AGENTS/architecture. Không suy diễn việc mở M7 thành nghiệm thu M6 hay phê duyệt nội dung/phát hành.

Mỗi task M7 vẫn cần card, owner/executor/reviewer, file claim và dependency hợp lệ. M7-05 chờ M7-04; M7-06 chờ M5/M6 và M7-05; M7-07..09 theo chuỗi dependency Phase 9. Các gate lịch sử/media, security, accessibility, privacy và PO release vẫn bắt buộc.

## Evidence và handoff

- [Task board](../../project/TASK-BOARD.md)
- [Phase 9](../../specs/phases/09-implementation-roadmap.md)
- [Phase 8](../../specs/phases/08-qa-accessibility-release-spec.md)
- Scope: chỉ docs; không đổi source/env/migration/account/media/deployment/reward.
- Runtime tests: không áp dụng cho quyết định lịch trình; kiểm tra diff và liên kết nội bộ trước handoff.
