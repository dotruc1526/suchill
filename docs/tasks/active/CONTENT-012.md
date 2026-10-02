# CONTENT-012 — Ngân hàng câu hỏi

> Status: REVIEW
> Last updated: 2026-10-02

## Assignment

- Owner: Thọ (Member 1).
- Executor: Trúc (Member 2), Codex hỗ trợ sửa PR #21 theo quyền Thọ cấp.
- Reviewer: Trúc (historical/learning/media theo quyền Thọ giao); Vinh (technical QA); sign-off bản mới còn chờ.
- Started: 2026-09-27 (lượt sửa); bản nháp trước do Thọ thực hiện.
- Branch revision hiện hành: `codex/mt68-complete-handoff`; PR #21 đã merge.
- Depends on: CONTENT-008 (DONE trên nhánh PR); sửa bản nháp trong content track, không mở M1.
- Files claimed: `docs/content/QUIZ-MT68.json`; card này. Registry/catalog/board do cùng executor Trúc đồng bộ theo [handoff PR21](./PR21-HANDOFF.md).
- Next action: review [Vinh technical QA](./CONTENT-012-QA-01.md) on PR99 head `7d94d94`; integrate Trúc's hash-bound historical/learning verdict and status before accepting the current main handoff.
- Blocker: PR99 verdict/status not yet on main; remaining media/production acceptance. No publication, integration or seed.

## Acceptance

- [ ] Năm câu có objective/source hợp lệ; không dùng đáp án lịch pháp thiếu căn cứ; chưa seed production.
- [ ] Reviewer xác nhận nội dung/learning objective.
- [ ] Media có quyền, caption/alt/fallback và nguồn item cụ thể trước phát hành.
- [ ] Technical QA và handoff được xác nhận.

## Checkpoint

- 2026-09-27: nhận sửa PR #21 từ `4fa6cd0`; chuẩn hóa ACTIVE, hoàn tất bản sửa tài liệu và chuyển REVIEW. Không ghi sign-off thay reviewer.
- Evidence, kết quả kiểm tra và phần thiếu: [PR21-HANDOFF.md](./PR21-HANDOFF.md).

## Checkpoint — 2026-10-02

- `QUIZ-MT68.json` vẫn `draft` / `NEEDS_HISTORICAL_REVIEW` tại SHA-256 `4013b39954779b0b43640372b668c329662ca30386aff52c2c4cd8a664e667eb`.
- Historical report ngày 2026-09-28 không liệt kê CONTENT-012 trong phạm vi verdict; technical QA của Vinh chỉ kiểm tra schema/ID/objectives/answer explanations, không phải historical/learning acceptance.
- Next: Trúc/historical reviewer review và ghi verdict riêng đúng hash; tới lúc đó giữ trạng thái pending và chưa tích hợp quiz.

- Checkpoint bổ sung 2026-09-27: Trúc được giao toàn bộ revision; [CONTENT-014](./CONTENT-014.md) chứa bản authoring và kiểm tra mới. Không ký sign-off thay người review.

## Technical QA checkpoint — Vinh, 2026-10-01

- Technical structure/reference checks **ACCEPTED** trên snapshot `30d0a4f` trong [CONTENT-014 QA report](../evidence/CONTENT-014-technical-qa.md); giới hạn/checked inputs có SHA-256 trong report.
- Overall handoff vẫn **CHANGES REQUESTED** P2: Trúc cần đồng bộ review record với artifact pending flags và ghi đúng revision được historical reviewer duyệt. Quiz approval không được suy từ approval của các lesson.
- Task giữ REVIEW; technical approval không thay historical/media/PO production acceptance. Combined technical+handoff/media checklist chưa đánh dấu hoàn tất.

## Technical QA after separate quiz verdict — Vinh, 2026-10-02

- Trúc recorded historical/learning APPROVED in PR99 (`fbaf3b3`) for reviewed hash `4013b399…667eb`; current status-only hash `44b9eed6…3912`. That PR is still OPEN; earlier pending entries above describe their historical/main snapshot.
- Vinh **ACCEPTED technical authoring scope** on exact PR99 `7d94d94`: hashes/status-only delta, 5 questions/20 options, stable IDs, answer/source/objective references, nonempty wording/explanations PASS; 5 malformed-input probes rejected; pristine validator PASS after restoration.
- [Evidence and limits](../evidence/CONTENT-012-technical-qa-2026-10-02.md). Parent checklist remains unclosed pending integration/reviewer handoff/media; no runtime or production acceptance inferred.
