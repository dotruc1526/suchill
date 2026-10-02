# CONTENT-011 — Nội dung Bài 3 và Bài 4

> Status: REVIEW
> Last updated: 2026-09-28

## Assignment

- Owner: Thọ (Member 1).
- Executor: Trúc (Member 2), Codex hỗ trợ sửa PR #21 theo quyền Thọ cấp.
- Reviewer: Historical Reviewer; technical QA/handoff evidence theo hồ sơ CONTENT-014.
- Started: 2026-09-27 (lượt sửa); bản nháp trước do Thọ thực hiện.
- Branch revision hiện hành: `codex/mt68-complete-handoff`; PR #21 đã merge.
- Depends on: CONTENT-008 (DONE trên nhánh PR); sửa bản nháp trong content track, không mở M1.
- Files claimed: `docs/content/LESSON-03-STANDARD.md`, `docs/content/LESSON-04-SYNTHESIS.md`; card này. Registry/catalog/board do cùng executor Trúc đồng bộ theo [handoff PR21](../active/PR21-HANDOFF.md).
- Next action: Vinh xác nhận technical QA/handoff và Trúc hoàn tất media sign-off trong CONTENT-014.
- Blocker: CONTENT-014 còn `REVIEW`; 6/8 media item chưa đủ evidence và 2/8 còn `NEEDS_MEDIA_REVIEW`.

## Acceptance

- [x] Sửa diễn biến bộc phá; phân biệt diễn giải và fact; niên biểu ngoại giao có nguồn.
- [x] Reviewer xác nhận nội dung/learning objective.
- [ ] Media có quyền, caption/alt/fallback và nguồn item cụ thể trước phát hành.
- [ ] Technical QA và handoff được xác nhận.

## Checkpoint

- 2026-09-27: nhận sửa PR #21 từ `4fa6cd0`; chuẩn hóa ACTIVE, hoàn tất bản sửa tài liệu và chuyển REVIEW. Không ghi sign-off thay reviewer.
- Evidence, kết quả kiểm tra và phần thiếu: [PR21-HANDOFF.md](../active/PR21-HANDOFF.md).

- Checkpoint bổ sung 2026-09-27: Trúc được giao toàn bộ revision; [CONTENT-014](../active/CONTENT-014.md) chứa bản authoring và kiểm tra mới. Không ký sign-off thay người review.

- Checkpoint 2026-09-28: Historical Reviewer hoàn tất thẩm định (Báo cáo HISTORICAL-REVIEW-REPORT-2026-09-28.md). Nội dung Bài 3 (Hầm vũ khí 287/70, Đội 5) và Bài 4 (Bước ngoặt Paris, niên biểu ngoại giao) đạt phạm vi sử liệu/ngôn ngữ. Verdict này không thay technical QA/media sign-off; task giữ `REVIEW`.

## Technical QA checkpoint — Vinh, 2026-10-01

- Technical structure/reference checks **ACCEPTED** trên snapshot `30d0a4f` trong [CONTENT-014 QA report](../evidence/CONTENT-014-technical-qa.md); giới hạn/checked inputs có SHA-256 trong report.
- Overall handoff vẫn **CHANGES REQUESTED** P2: Trúc cần đồng bộ review record với artifact pending flags và ghi đúng revision được historical reviewer duyệt. Quiz approval không được suy từ approval của các lesson.
- Task giữ REVIEW; technical approval không thay historical/media/PO production acceptance. Combined technical+handoff/media checklist chưa đánh dấu hoàn tất.

## Technical recheck — Vinh, 2026-10-02

- Review-state P2 **RESOLVED** cho phạm vi task này: lesson artifacts thuộc diện historical verdict đã đồng bộ đúng revision (xem [CONTENT-014 recheck](./CONTENT-014.md) và [evidence](../evidence/CONTENT-014-recheck-2026-10-02.md)).
- Technical QA của Vinh (structure + review-state sync) **ACCEPTED**; không thay media/handoff/production acceptance.
- Task giữ REVIEW: chờ Trúc media/handoff sign-off; CONTENT-007 giữ BLOCKED.
