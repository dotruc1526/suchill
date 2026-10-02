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
- Next action: Hưng recheck độc lập CONTENT-014; Product owner quyết định handoff. Trúc đã ghi media/handoff review 2026-10-02 (authoring scope).
- Blocker: thiếu evidence quyền 6/8 media item, 2/8 còn `NEEDS_MEDIA_REVIEW`; chưa có audio/file cuối; Hưng recheck + PO decision còn lại. Không production.

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

## Media/handoff review — Trúc (Member 2), 2026-10-02

Phạm vi: media/handoff reviewer portion cho Bài 3/4 (standard lessons). Historical/learning đã APPROVED; review này chỉ bao gồm media/handoff.

- Bài 3 CONFIRMED: MED-06 (ảnh di tích hầm 287/70) BLOCKED — bài báo dùng cho fact không cấp quyền ảnh; nếu sau này được cấp quyền, caption phải ghi thời điểm chụp, không coi là ảnh trận đánh 1968. Fallback văn bản đứng vững.
- Bài 4 CONFIRMED: MED-07 (clip CBS) BLOCKED, không suy luận Fair Use thành giấy phép; MED-08 NEEDS_MEDIA_REVIEW optional-only, KHÔNG duyệt dùng (CC BY 2.0 với điều kiện attribution + giới hạn dùng: không minh họa phản ứng ngay đêm Mậu Thân). Quy tắc Cronkite (không trích nguyên văn gán câu) và loại trừ ảnh hành quyết khi thiếu đánh giá phù hợp đối tượng được giữ.
- KHÔNG bao gồm: duyệt quyền/license, nghiệm thu asset cuối (caption/alt/crop/attribution), production readiness. Các ô acceptance media và technical QA/handoff giữ nguyên chưa tick; CONTENT-007 giữ BLOCKED.
- Handoff statement: gói authoring Bài 3/4 đủ để planning sản xuất; production chờ quyền, file cuối và quyết định PO.
- Next: Hưng recheck độc lập; PO quyết định handoff. Task giữ REVIEW; gate M3 OPEN / M4 LOCKED.
