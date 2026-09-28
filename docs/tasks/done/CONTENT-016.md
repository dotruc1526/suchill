# CONTENT-016 — Flagship Visual Novel cho mỗi chapter canonical

> Status: DONE\
> Last updated: 2026-09-28

## Assignment

- Phase / milestone: Product/content track độc lập; không mở M2/M3 implementation.
- Workstream: Product + Content / Visual Novel authoring.
- Accountable owner: Thọ (Member 1 — Product Owner/Content Lead).
- Executor type: Codex theo quyết định trực tiếp của Product Owner.
- Executor name: Codex.
- Reviewer: Thọ (product/learning); Trúc (historical/media); Vinh (schema/QA khi authoring được chuyển thành domain fixture).
- Codex task/thread: current task.
- Branch: `codex/content-visual-novel-per-chapter`.
- Started: 2026-09-28.
- Depends on: DOC-002/003/004 (`DONE`), CONTENT-013/015 (`DONE`), Product Owner decision 2026-09-28.

## Scope

- In scope: ghi product rule mỗi chapter canonical có tối thiểu một flagship Visual Novel lesson; cập nhật draft chapter 1972; tạo authoring brief scene-by-scene cho Lesson 2 SAM-2.
- Out of scope: tự duyệt fact/media, viết lời thoại gán cho nhân vật thật, tạo story JSON publishable, seed database, sửa runtime/player hoặc mở milestone implementation.
- Files claimed: `docs/specs/phases/01-product-learning-experience-spec.md`, `docs/project/APP-PLAN.md`, `docs/content/CURRICULUM-MAP-1972.md`, `docs/content/LESSON-02-VISUAL-NOVEL-1972.md`, `docs/content/CONTENT-016-EVIDENCE.md`, card/index/board liên quan.
- Shared-contract consumers: CONTENT-013/015 và content chapter tương lai; FE-005; domain/story validators; QA-001/002/004/005.

## Acceptance criteria

- [x] Product rule phân biệt “ít nhất một Visual Novel mỗi chapter” với “mọi lesson đều là Visual Novel”.
- [x] Rule vẫn yêu cầu lesson đáp ứng tiêu chí learning value, source và historical safety của Phase 1–3.
- [x] Chapter 1972 có một flagship Visual Novel rõ vị trí, objective và quan hệ với video/quiz.
- [x] Authoring brief có stable IDs, scene flow, choice taxonomy, knowledge check, debrief, accessibility/media fallback và review gates.
- [x] Có claim/source matrix cho SAM-2/S-75 Dvina, kíp chiến đấu, nhiễu, “vạch nhiễu tìm thù” và B-52; claim thiếu locator bị khóa khỏi narration/StoryVersion.
- [x] Có historical/fiction/media boundary và bảng source/license/alt/caption/transcript/fallback; không asset ngoài nào được mặc định approve.
- [x] Thọ xác nhận product/learning direction, kèm ba điều kiện PO về phạm vi brief, cổng sử liệu và cổng bản quyền.
- [x] Trúc xác nhận historical framing, source/fiction/media boundary ở cấp authoring brief; từng câu narration vẫn cần duyệt lại.

## Verification

- Commands/checks: Markdown/link check; `git diff --check`; đối chiếu Phase 1/2/3 và architecture boundary.
- Expected result: content team có rule áp dụng lặp lại và brief đủ rõ để viết story version, nhưng không bị hiểu nhầm là nội dung đã publish.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-28 | Product Owner + Codex | Chốt định hướng mỗi chapter canonical có ít nhất một flagship Visual Novel; chọn Lesson 2 SAM-2 của chapter 1972 | Product Owner instruction; Phase 1 criteria; curriculum 1972 draft | Thọ/Trúc review brief và yêu cầu sửa nếu có | Chưa có story JSON/historical sign-off cho narration chi tiết |
| 2026-09-28 | Codex | Hoàn tất product addendum, curriculum update và scene-flow brief; chuyển REVIEW | `git diff --check` pass; validator Mậu Thân pass: 5 nodes, 7 scenes, 6 paths, 5 quiz, 9 narration/VTT cues; các link mới của CONTENT-016 tồn tại | Thọ review product/learning; Trúc review historical/media | Repo còn một số link task cũ trỏ sai thư mục do card đã di chuyển, không phát sinh từ CONTENT-016 |
| 2026-09-28 | Trúc review + Codex remediation | Trúc chưa approve vì thiếu claim/source locator và media boundary; bổ sung evidence package, khóa claim/asset chưa đủ bằng chứng và loại mechanic kỹ thuật chưa được review | `docs/content/CONTENT-016-EVIDENCE.md`; tái sử dụng source registry có page/chapter locator, không tự nâng review status | Thọ approve product/learning; Trúc re-review claim locator và media boundary | `SRC-1972-02/03` và phần ECM của `SRC-LB2-04` vẫn cần locator hẹp do reviewer đọc trực tiếp trước narration |
| 2026-09-28 | Codex — feedback round 2 | Bổ sung ba nguồn Báo QĐND với ngày, section và paragraph locator cho SAM-2/S-75, kíp chiến đấu, nhiễu, B-52 và “vạch nhiễu tìm thù”; thu hẹp claim phối hợp; làm rõ media chưa chọn không chặn PR brief | `CLM-1972-VN-001..005` chuyển `READY_FOR_TRUC_REVIEW`, không tự đánh dấu `APPROVED`; text-first fallback vẫn bắt buộc | Trúc xác nhận locator/historical-media boundary; sau đó chờ Thọ review product/learning | Không còn `BLOCKED_LOCATOR` trong phạm vi brief; narration/StoryVersion và asset vẫn bị khóa đến khi reviewer xác nhận |
| 2026-09-28 | Thọ + Trúc + Product Owner | Thọ approve product/learning với ba điều kiện ràng buộc; Trúc approve historical/media boundary; đóng task ở cấp authoring brief | Product Owner xác nhận hai review; GitHub PR #45 ready, 2/2 checks pass, không conflict, một approving review có write access | Merge PR #45; tạo task riêng khi bắt đầu Full Narration/StoryVersion/media selection | Claim 001..005, từng câu narration và mọi asset vẫn phải qua gate riêng trước production |

## Handoff

- Changed files: product rule, app plan, curriculum 1972, authoring brief Lesson 2, task card/index/board.
- Test/build result: docs-only; `git diff --check` pass; validator Mậu Thân pass; các link mới tồn tại. Link scan toàn repo vẫn thấy một số link task cũ trỏ sai thư mục do card đã di chuyển, ngoài scope CONTENT-016.
- Environment/migration impact: không có.
- Known issues/risks: approval chỉ áp dụng cho authoring brief. Claim 001..005 chưa duyệt ở cấp câu narration; chưa có asset được cấp phép; chưa có `StoryVersion` JSON.
- Next owner/action: merge PR #45. Khi bắt đầu Full Narration/StoryVersion/media, tạo task và file claim mới; Trúc duyệt từng câu lịch sử, media phải có quyền/metadata, và text-first fallback luôn hoạt động. Dương không tích hợp trước khi M2/M3 mở.
