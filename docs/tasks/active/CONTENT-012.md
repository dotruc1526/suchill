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
- Next action: Trúc/historical reviewer đưa verdict riêng cho quiz revision `4013b39954779b0b43640372b668c329662ca30386aff52c2c4cd8a664e667eb`; Vinh technical QA sau đó.
- Blocker: historical/learning verdict của CONTENT-012 chưa có. Không suy diễn từ CONTENT-010; không phát hành, tích hợp hoặc seed.

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

## Objective pre-review — Codex hỗ trợ Thọ, 2026-10-02

Chuẩn bị cho verdict của Trúc/historical reviewer; đây là rà soát learning-design, **không phải historical/learning verdict** và không tick acceptance nào.

- Quiz bytes không đổi từ `a9fd169` (2026-09-27): SHA-256 LF-normalized `4013b399…667eb` khớp card; working tree sạch; `validate-mt68-authoring.mjs` PASS (5 câu, source/claim IDs và local links hợp lệ).
- Mapping câu hỏi → CLO trong `CURRICULUM-MAP.md`: q-01→CLO-1 (địa bàn đô thị, explanation tránh khẳng định đồng loạt); q-02→CLO-2 (list-membership mục tiêu); q-03→CLO-3 (hầm 287/70 vai trò hậu cần, explanation loại trừ vai trò chỉ huy); q-04/q-05→CLO-4 (phân biệt bước ngoại giao, tránh đơn nhân).
- Source IDs tồn tại trong registry `HISTORICAL-SOURCES.md`: q-01/q-05→SRC-MT68-01, q-02→SRC-MT68-02, q-03→SRC-MT68-05, q-04→SRC-MT68-06 (+SRC-MT68-01 cho q-05).
- Cross-check q-02: đáp án D "Đài Phát thanh Sài Gòn" khớp node 3/5 `MAP-MT68.json` (`mt68-node-radio`, CLM-MT68-01, SRC-MT68-02); câu hỏi chỉ hỏi list-membership, đúng giới hạn "danh sách không chứng minh chiếm giữ" của CLM-MT68-01.
- Mỗi câu có đúng một đáp án, explanation gắn misconception cụ thể; không phát hiện đáp án thiếu căn cứ ở mức objective.
- Next không đổi: Trúc/historical reviewer ghi verdict riêng đúng hash quiz; Vinh technical QA sau đó. Không seed/integrate.
