# CONTENT-019 — Đóng gói Ngân hàng câu hỏi trắc nghiệm Bài 4 Chapter 1972 (QUIZ-1972.json)

> Status: REVIEW\
> Last updated: 2026-10-01

## Assignment

- Phase / milestone: Content Track (Phase 2 Expansion)
- Workstream: Product + Content / Assessment authoring
- Accountable owner: Thọ (Member 1 — Content Lead)
- Executor type: Human (Thọ) + Codex hỗ trợ
- Executor name: Thọ (Member 1)
- Reviewer: Trúc (Member 2 — Historical Reviewer), Product Owner (PO nghiệm thu)
- Branch: `content/tho-chapter-1972-package` (PR #65)
- Started: 2026-09-29
- Depends on: CONTENT-018 (nghiệm thu tuần tự Bài 3 trước Bài 4 trong gói PR #65; card CONTENT-019 giữ trạng thái REVIEW chờ CONTENT-018 hoàn tất), CONTENT-017 (`DONE`), CONTENT-016 (`DONE`), CONTENT-015 (`DONE`)

## Scope

- In scope:
  - Xây dựng tệp dữ liệu trắc nghiệm chuẩn hóa: `docs/content/QUIZ-1972.json`.
  - Bộ câu hỏi gồm 5 câu trắc nghiệm 4 lựa chọn (A, B, C, D) bao quát 100% các mục tiêu học tập của Chapter (`CLO-1` đến `CLO-4`).
  - Mỗi câu hỏi có:
    - `id` chuẩn hóa (`q-1972-01` .. `q-1972-05`).
    - `objectiveId` gắn với Chapter Learning Objectives.
    - `options` với 4 phương án rõ ràng, không đánh đố câu chữ mơ hồ.
    - `correctOptionId` xác định đáp án chính xác duy nhất.
    - `explanation` giải thích sư phạm cặn kẽ, dẫn giải bằng chứng lịch sử.
    - `sourceIds` liên kết nguồn chính thống (`SRC-LB2-01..05`, `SRC-1972-01..03`).
  - Viết bộ kiểm thử tự động kiểm tra cú pháp và độ phủ: `docs/content/validate-1972-quiz.mjs`.
  - Cập nhật Bảng điều phối `TASK-BOARD.md`.
- Out of scope: Không lập trình quiz engine runtime, không thay đổi database schema.
- Files claimed:
  - `docs/tasks/active/CONTENT-019.md`
  - `docs/content/QUIZ-1972.json`
  - `docs/content/validate-1972-quiz.mjs`
  - `docs/project/TASK-BOARD.md`

## Acceptance criteria

- [x] Tệp `docs/content/QUIZ-1972.json` có cú pháp JSON hợp lệ, đúng schema assessment.
- [x] Có đủ 5 câu hỏi trắc nghiệm, mỗi câu có 4 lựa chọn A, B, C, D.
- [x] Phủ kín 100% 4 mục tiêu học tập (`CLO-1`, `CLO-2`, `CLO-3`, `CLO-4`).
- [x] Đáp án có giải thích sư phạm lịch sử rõ ràng, trung thực.
- [x] 100% câu hỏi có `sourceIds` tham chiếu nguồn chính thống có thể truy vết.
- [x] Script kiểm thử `validate-1972-quiz.mjs` chạy PASS 100%.
- [ ] Trúc (Historical Reviewer) thẩm định tính chuẩn xác của câu hỏi và đáp án.
- [ ] Product Owner nghiệm thu hoàn tất nội dung Chapter 1972.

## Verification

- Commands/checks: `node docs/content/validate-1972-quiz.mjs`, `git diff --check`, `node scripts/member5/check-client-env.mjs`.
- Expected result: Ngân hàng câu hỏi trắc nghiệm chuẩn hóa, sẵn sàng nạp vào Quiz Component trong Milestone M2.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-29 | Thọ (Member 1) | Soạn thảo ngân hàng 5 câu hỏi trắc nghiệm Chapter 1972, phủ 4 CLO, kiểm thử tự động PASS 100%; chuyển REVIEW | `docs/content/QUIZ-1972.json`, `validate-1972-quiz.mjs` | Bàn giao Trúc thẩm định sử liệu và Product Owner nghiệm thu | Không |
| 2026-10-01 | Thọ (Member 1) | Đồng bộ main sạch 0 conflict vào PR #65; xác minh 0-link-lỗi DOC-013; validator PASS 100% | `docs/content/QUIZ-1972.json`, `validate-1972-quiz.mjs` | Chờ Trúc và Product Owner duyệt PR #65 | Không |

## Handoff

- Changed files: `docs/tasks/active/CONTENT-019.md`, `docs/content/QUIZ-1972.json`, `docs/content/validate-1972-quiz.mjs`, `docs/project/TASK-BOARD.md`.
- Test/build result: `validate-1972-quiz.mjs` PASS 100%, `check-client-env.mjs` PASS (0 secrets).
- Next owner/action: Trúc (Historical Reviewer) thẩm định sử liệu; Dương (Member 4) sẵn sàng nạp vào Quiz Player trong M2.
