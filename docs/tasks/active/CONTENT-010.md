# CONTENT-010 — Nội dung Bài 2

> Status: REVIEW
> Last updated: 2026-09-28

## Assignment

- Owner: Thọ (Member 1).
- Executor: Trúc (Member 2), Codex hỗ trợ sửa PR #21 theo quyền Thọ cấp.
- Reviewer: Historical Reviewer; technical QA/handoff evidence theo hồ sơ CONTENT-014.
- Started: 2026-09-27 (lượt sửa); bản nháp trước do Thọ thực hiện.
- Branch revision hiện hành: `codex/mt68-complete-handoff`; PR #21 đã merge.
- Depends on: CONTENT-008 (DONE trên nhánh PR); sửa bản nháp trong content track, không mở M1.
- Files claimed: `docs/content/LESSON-02-INTERACTIVE.md`; card này. Registry/catalog/board do cùng executor Trúc đồng bộ theo [handoff PR21](../active/PR21-HANDOFF.md).
- Next action: Hưng recheck độc lập CONTENT-014; Product owner quyết định handoff. Trúc đã ghi media/handoff review 2026-10-02 (authoring scope).
- Blocker: thiếu evidence quyền 6/8 media item, 2/8 còn `NEEDS_MEDIA_REVIEW`; chưa có audio/file cuối; Hưng recheck + PO decision còn lại. Không production.

## Acceptance

- [x] Nguồn cho năm node; không nhầm khuôn viên/tòa nhà; có screenplay VN, nhánh hội tụ, check/debrief/end theo CONTENT-014.
- [x] Reviewer xác nhận nội dung/learning objective.
- [ ] Media có quyền, caption/alt/fallback và nguồn item cụ thể trước phát hành.
- [ ] Technical QA và handoff được xác nhận.

## Checkpoint

- 2026-09-27: nhận sửa PR #21 từ `4fa6cd0`; chuẩn hóa ACTIVE, hoàn tất bản sửa tài liệu và chuyển REVIEW. Không ghi sign-off thay reviewer.
- Evidence, kết quả kiểm tra và phần thiếu: [PR21-HANDOFF.md](../active/PR21-HANDOFF.md).

- Checkpoint bổ sung 2026-09-27: Trúc được giao toàn bộ revision; [CONTENT-014](../active/CONTENT-014.md) chứa bản authoring và kiểm tra mới. Không ký sign-off thay người review.

- Checkpoint 2026-09-28: Historical Reviewer hoàn tất thẩm định (Báo cáo HISTORICAL-REVIEW-REPORT-2026-09-28.md). 5 node bản đồ, story branching và knowledge check đạt phạm vi sử liệu/ngôn ngữ. Verdict này không thay technical QA/media sign-off; task giữ `REVIEW`.

### Checkpoint đồng bộ artifact — 2026-10-02

- `LESSON-02-INTERACTIVE.md` và `LESSON-02-STORY.json` được xác nhận byte-identical giữa verdict commit `02c1128` và technical snapshot `30d0a4f`; review SHA và current SHA sau cập nhật trạng thái được ghi tại [CONTENT-014](./CONTENT-014.md). Historical/language status được đồng bộ cho đúng hai artifact này.
- `MAP-MT68.json` giữ `NEEDS_HISTORICAL_REVIEW`: report không ràng buộc verdict tới hash/revision cụ thể của map. Technical validation không thay historical review.
- Task còn `REVIEW`; media/source/technical handoff và production chưa được duyệt.

## Technical QA checkpoint — Vinh, 2026-10-01

- Technical structure/reference checks **ACCEPTED** trên snapshot `30d0a4f` trong [CONTENT-014 QA report](../evidence/CONTENT-014-technical-qa.md); giới hạn/checked inputs có SHA-256 trong report.
- Overall handoff vẫn **CHANGES REQUESTED** P2: Trúc cần đồng bộ review record với artifact pending flags và ghi đúng revision được historical reviewer duyệt. Quiz approval không được suy từ approval của các lesson.
- Task giữ REVIEW; technical approval không thay historical/media/PO production acceptance. Combined technical+handoff/media checklist chưa đánh dấu hoàn tất.

## Technical recheck — Vinh, 2026-10-02

- Review-state P2 **RESOLVED** cho phạm vi lesson/story task này: artifact flags đã đồng bộ đúng revision được duyệt (xem [CONTENT-014 recheck](./CONTENT-014.md) và [evidence](../evidence/CONTENT-014-recheck-2026-10-02.md)); map giữ pending đúng vì report không bound verdict cho map.
- Technical QA của Vinh (structure + review-state sync) **ACCEPTED**; không thay media/source/handoff/production acceptance.
- Task giữ REVIEW: chờ Trúc media/handoff sign-off; CONTENT-007 giữ BLOCKED.

## Media/handoff review — Trúc (Member 2), 2026-10-02

Phạm vi: media/handoff reviewer portion cho Bài 2 (interactive lesson + story + map cards). Historical/learning đã APPROVED; review này chỉ bao gồm media/handoff.

- Map CONFIRMED trình bày ordered cards phi địa lý: không tọa độ đã duyệt; `optionalMediaCandidateId` chỉ là con trỏ catalog, không phải asset đã duyệt; validator xác nhận không tọa độ giả và `mediaRef: null`.
- Per-candidate decisions CONFIRMED cho 5 node Bài 2: MED-01/02 BLOCKED (chưa xác minh item/license; không coi ảnh hiện đại là ảnh 1968); MED-03/05 BLOCKED (URL category chỉ để tìm kiếm, chưa chọn asset); MED-04 NEEDS_MEDIA_REVIEW optional-only, KHÔNG duyệt dùng (PD-USGov evidence, jurisdiction review pending; không gọi là ảnh chụp 1968).
- Story scenes CONFIRMED text-first, không asset bắt buộc; nhãn nhánh rõ cho keyboard/focus, feedback bằng chữ (không chỉ màu), tôn trọng reduced motion, không nhạc/SFX/autoplay có âm thanh — ở mức authoring spec; hành vi player thực tế chưa kiểm chứng (thuộc phạm vi runtime của Vinh/Hưng).
- KHÔNG bao gồm: duyệt quyền/license, nghiệm thu asset cuối, production readiness. Các ô acceptance media và technical QA/handoff giữ nguyên chưa tick; CONTENT-007 giữ BLOCKED.
- Handoff statement: gói authoring Bài 2 đủ để planning sản xuất/tích hợp sau này; production chờ quyền, file cuối và quyết định PO.
- Next: Hưng recheck độc lập; PO quyết định handoff. Task giữ REVIEW; gate M3 OPEN / M4 LOCKED.
