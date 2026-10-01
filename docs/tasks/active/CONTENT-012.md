# CONTENT-012 — Ngân hàng câu hỏi

> Status: REVIEW
> Last updated: 2026-10-01

## Assignment

- Owner: Thọ (Member 1).
- Executor: Trúc (Member 2), Codex hỗ trợ sửa PR #21 theo quyền Thọ cấp; Thọ chuẩn hóa hoàn thiện.
- Reviewer: Trúc (historical/learning/media theo quyền Thọ giao); Vinh (technical QA); sign-off bản mới còn chờ.
- Started: 2026-09-27 (lượt sửa); bản nháp trước do Thọ thực hiện.
- Branch revision hiện hành: `codex/mt68-complete-handoff`; PR #21 đã merge.
- Depends on: CONTENT-008 (DONE trên nhánh PR); sửa bản nháp trong content track, không mở M1.
- Files claimed: `docs/content/QUIZ-MT68.json`; card này. Registry/catalog/board do cùng executor Trúc đồng bộ theo [handoff PR21](./PR21-HANDOFF.md).
- Next action: Trúc xác nhận nội dung/media bản hiện hành; Vinh technical QA; xem CONTENT-014.
- Blocker: chưa có sign-off lịch sử/media; không phát hành, tích hợp hoặc seed.

## Acceptance

- [x] Năm câu có objective/source hợp lệ; không dùng đáp án lịch pháp thiếu căn cứ; đã chuẩn hóa wording trung lập sư phạm.
- [x] Reviewer xác nhận nội dung/learning objective (đã có kết quả VERIFIED từ Historical Review Report 2026-09-28).
- [ ] Media có quyền, caption/alt/fallback và nguồn item cụ thể trước phát hành.
- [ ] Technical QA và handoff được xác nhận.

## Checkpoint

- 2026-09-27: nhận sửa PR #21 từ `4fa6cd0`; chuẩn hóa ACTIVE, hoàn tất bản sửa tài liệu và chuyển REVIEW. Không ghi sign-off thay reviewer.
- Evidence, kết quả kiểm tra và phần thiếu: [PR21-HANDOFF.md](./PR21-HANDOFF.md).

- Checkpoint bổ sung 2026-09-27: Trúc được giao toàn bộ revision; [CONTENT-014](./CONTENT-014.md) chứa bản authoring và kiểm tra mới. Không ký sign-off thay người review.

- 2026-10-01: Thọ (Member 1 — Content Lead) chuẩn hóa toàn diện 5 câu hỏi trong `QUIZ-MT68.json` theo đúng tiêu chuẩn sư phạm và các nguồn đã kiểm chứng (`SRC-MT68-01..06`); chuyển `reviewStatus` sang `ready_for_review`; validator `validate-mt68-authoring.mjs` PASS.
