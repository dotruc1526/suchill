# CONTENT-017 — Soạn kịch bản chi tiết Scene-by-Scene và Story Data Bài 2 Visual Novel Chapter 1972 ("Kíp chiến đấu SAM-2 — Vạch nhiễu tìm thù")

> Status: DONE\
> Last updated: 2026-10-02

## Assignment

- Phase / milestone: Content Track (Phase 2 Expansion)
- Workstream: Product + Content / Visual Novel authoring
- Accountable owner: Thọ (Member 1 — Content Lead / Biên kịch)
- Executor type: Human (Thọ) + Codex hỗ trợ
- Executor name: Thọ (Member 1)
- Reviewer: Trúc (Member 2 — Historical Reviewer), Product Owner (PO nghiệm thu)
- Branch: `content/tho-lesson-02-1972-vn-v2`
- Started: 2026-09-28
- Depends on: CONTENT-016 (`DONE`), CONTENT-015 (`DONE`), CONTENT-013 (`DONE`)

## Scope

- In scope:
  - Triển khai kịch bản chi tiết Scene-by-Scene cho 8 Scene của Bài 2 Flagship Visual Novel ("Kíp chiến đấu SAM-2 — Vạch nhiễu tìm thù") theo đúng Authoring Brief đã duyệt tại `docs/content/LESSON-02-VISUAL-NOVEL-1972.md`.
  - Soạn thảo tài liệu kịch bản: `docs/content/LESSON-02-1972-NARRATION.md`.
  - Xây dựng dữ liệu cấu trúc Visual Novel draft: `docs/content/LESSON-02-1972-STORY.json`.
  - Xây dựng dữ liệu sơ đồ tương tác khái quát về thành phần khí tài và bối cảnh SAM-2: `docs/content/DIAGRAM-SAM2-1972.json`.
  - Tách bạch rõ ranh giới lịch sử: Người học là người quan sát/phân tích hồ sơ huấn luyện (không đóng vai chỉ huy thật, không hư cấu lời thoại người thật).
  - Phân loại rõ branching choice (không có `isCorrect`, không đổi kết quả lịch sử) và knowledge check (có đúng/sai, có phản hồi sư phạm).
  - Từng câu dẫn dữ kiện lịch sử gắn với Claim ID (`CLM-1972-VN-001..005`) từ `CONTENT-016-EVIDENCE.md`.
  - Đảm bảo Text-first fallback và accessibility (keyboard, screen-reader text labels).
  - Viết bộ kiểm thử kiểm tra tính toàn vẹn của dữ liệu: `docs/content/validate-1972-authoring.mjs`.
- Out of scope: Dựng video MP4, lập trình renderer/UI runtime, seed DB hay mở Milestone M2.
- Files claimed:
  - `docs/tasks/done/CONTENT-017.md`
  - `docs/content/LESSON-02-1972-NARRATION.md`
  - `docs/content/LESSON-02-1972-STORY.json`
  - `docs/content/DIAGRAM-SAM2-1972.json`
  - `docs/content/LESSON-02-VISUAL-NOVEL-1972.md`
  - `docs/content/validate-1972-authoring.mjs`
  - `docs/project/TASK-BOARD.md`
  - `docs/content/HISTORICAL-REVIEW-REPORT-2026-09-28.md` (supplemental PR review record)

## Acceptance criteria

- [x] Đủ 8 Scene tương ứng với brief: `sam2-v1-briefing`, `sam2-v1-crew`, `sam2-v1-perspective`, `sam2-v1-coordination`, `sam2-v1-interference`, `sam2-v1-check`, `sam2-v1-debrief`, `sam2-v1-end`.
- [x] Diagram artifact có ít nhất 5 nút về khí tài/bối cảnh và kíp chiến đấu khái quát, với text fallback đầy đủ; không tái dựng quân số, chức danh, vị trí hoặc quy trình thật.
- [x] Narrative choice không có `isCorrect`, không tính điểm/XP, chỉ đổi thứ tự tiếp cận tài liệu.
- [x] Knowledge check choice có đúng/sai, giải thích sư phạm rõ ràng, điều hướng về debrief.
- [x] Dữ liệu JSON StoryVersion có stable IDs, luồng đồ thị chuyển cảnh khép kín không có dead-end, cú pháp hợp lệ.
- [x] 100% dữ kiện bám sát Claim ID từ `CONTENT-016-EVIDENCE.md` và nguồn chính thống (Báo QĐND, Lịch sử QCPK-KQ, Cẩm nang bìa đỏ).
- [x] Script kiểm thử tự động `validate-1972-authoring.mjs` chạy PASS.
- [x] Trúc (Historical Reviewer) thẩm định sử liệu và ngôn ngữ: Trúc đã APPROVE trên PR #54 (review lúc 07:53 ngày 2026-09-30 trên head `f641530`).
- [x] Product Owner nghiệm thu phê duyệt: PO (`@Compuerte`) APPROVED trên PR #54 ngày 2026-09-30; PR merged `0075079`, Quality 2/2 SUCCESS.

## Verification

- Commands/checks: `node docs/content/validate-1972-authoring.mjs`, `git diff --check`, `node scripts/member5/check-client-env.mjs`.
- Expected result: Bản kịch bản và dữ liệu authoring hoàn chỉnh, sẵn sàng bàn giao cho Trúc (Historical Reviewer) thẩm định và Product Owner nghiệm thu.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-28 | Thọ (Member 1) | Khởi tạo task card CONTENT-017 và xác lập phạm vi soạn thảo Bài 2 Visual Novel 1972 | Card CONTENT-017; branch `content/tho-lesson-02-1972-vn` | Viết kịch bản chi tiết, dữ liệu JSON và sơ đồ khí tài | Không |
| 2026-09-28 | Thọ (Member 1) | Hoàn thành kịch bản chi tiết 8 scene, sơ đồ khí tài 7 nodes và dữ liệu StoryVersion JSON draft; validator PASS 100%; chuyển REVIEW | `docs/content/LESSON-02-1972-NARRATION.md`, `LESSON-02-1972-STORY.json`, `DIAGRAM-SAM2-1972.json`, `validate-1972-authoring.mjs` | Bàn giao cho Trúc (Historical Reviewer) thẩm định và Product Owner duyệt | Không |
| 2026-09-29 | Thọ + Trúc + Codex | Tiếp thu phản hồi PO: sửa luồng học đi qua đủ 2 nội dung trước check; Trúc phê duyệt claim matrix; giải quyết conflict TASK-BOARD với main | PR #54; `validate-1972-authoring.mjs` PASS | Trúc bấm Approve review trên GitHub PR #54; PO nghiệm thu lại | Chờ Trúc submit GitHub review |
| 2026-09-29 | Thọ + Codex | Khắc phục 5 điểm review của Trúc/PO: (1) bỏ thao tác tay quay, khẩu lệnh, mốc 40/35/30km ở Scene 2/4 & Sơ đồ SAM-2; (2) chuẩn hóa số liệu tốp 3 B-52 có 45 máy gây nhiễu, bỏ từ ngữ chưa kiểm chứng ("bó chổi chà", độ mịn/gợn); (3) sửa lời giải thích Shrike trung thực, không tuyệt đối hóa; (4) đổi reviewStatus về ready_for_review; (5) làm rõ vai trò validator cấu trúc | `LESSON-02-1972-NARRATION.md`, `LESSON-02-1972-STORY.json`, `DIAGRAM-SAM2-1972.json`; 4 validators PASS 100% | Báo cáo Trúc/PO thẩm định lại trên PR #54 và PR #65 | Không |
| 2026-09-29 | Thọ + Codex | Giản lược toàn diện theo yêu cầu review Trúc trên PR #54: (1) chuẩn hóa chức trách kíp về hiệp đồng tổng quát đúng CLM-1972-VN-002, bỏ mô tả thao tác vi mô; (2) giản lược cách radar dẫn đường và bám sát liên tục; (3) bỏ đề cập tên lửa Shrike và cách ứng phó chiến thuật, thay bằng diễn giải sư phạm khái quát; (4) kéo commit main PR 62 vào PR #54 sạch conflict | `DIAGRAM-SAM2-1972.json`, `LESSON-02-1972-NARRATION.md`, `LESSON-02-1972-STORY.json`; validators PASS 100% | Trúc (Historical Reviewer) thẩm định và submit Approve trên PR #54 | Không |
| 2026-09-30 | Thọ + Codex | Giản lược 2 điểm tồn đọng theo review Trúc: (1) bỏ con số 45 máy gây nhiễu ở Scene 5, đưa về framing khái quát thiết bị gây nhiễu điện tử dày đặc đúng CLM-1972-VN-003; (2) bỏ cụm từ 'bẻ gãy chiến dịch' ở debrief Scene 7, chuyển thành kiên cường bảo vệ bầu trời Hà Nội trước B-52 đúng phạm vi kíp SAM-2 | `LESSON-02-1972-NARRATION.md`, `LESSON-02-1972-STORY.json`; validators PASS 100% | Trúc (Historical Reviewer) thẩm định và submit Approve trên PR #54 | Không |
| 2026-09-30 | Thọ + Codex | Tiếp thu PO review tại head `0412226`: tổng quát hóa sơ đồ/narration theo claim 002; bỏ phát biểu nhân quả chưa có nguồn; loại bảng nguồn ngoài scope; ghi rõ phạm vi approval GitHub và yêu cầu re-review | `validate-1972-authoring.mjs` PASS (5 nodes, 8/8 scenes); client-env scan 240 files/0 unsafe; `git diff --check` PASS. Full quality cần CI trên PR vì worktree không có `node_modules`. | Trúc và PO review bản cập nhật; xác nhận CI xanh trước merge | Chờ CI/re-review |
| 2026-09-30 | Thọ + Codex | Xử lý triệt để finding [P1] theo review Trúc tại head `fdbf5e7`: (1) Sơ đồ SAM-2 đưa về mức thuần túy liệt kê thành phần khí tài và sự hiện diện kíp; bỏ quan hệ điều khiển, phát lệnh, truyền nhận tham số vi mô; (2) Scene 4 Narration/Story bỏ mô tả tọa độ mục tiêu và tham số không gian; (3) Validator bổ sung kiểm tra khóa từ ngữ quy trình tác chiến vi mô; Trúc APPROVED tại head `f641530` | `DIAGRAM-SAM2-1972.json`, `LESSON-02-1972-NARRATION.md`, `LESSON-02-1972-STORY.json`, `validate-1972-authoring.mjs`; validator PASS 100% | Trúc (Historical Reviewer) đã approve lúc 07:53 ngày 2026-09-30 | Không |
| 2026-09-30 | Thọ + Codex | Xử lý triệt để các blocker N1, N2, N3 từ review của Dương (Member 4): (1) Cập nhật card CONTENT-017 (branch v2, date 2026-09-30, tick Trúc approved); (2) Dọn dẹp 100% link gãy trong TASK-BOARD.md đảm bảo chuẩn 0-link-lỗi DOC-013; (3) Đồng bộ wording 'tiếp cận tuyến tính' trong Narration; (4) Chuẩn bị nội dung cập nhật PR description 5 nút | `docs/tasks/active/CONTENT-017.md`, `docs/project/TASK-BOARD.md`, `docs/content/LESSON-02-1972-NARRATION.md`; link check 0 lỗi | PO và Dương submit approval cuối để merge PR #54 | Không |

## Handoff

- Changed files: `docs/tasks/done/CONTENT-017.md`, `docs/content/LESSON-02-1972-NARRATION.md`, `docs/content/LESSON-02-1972-STORY.json`, `docs/content/DIAGRAM-SAM2-1972.json`, `docs/content/validate-1972-authoring.mjs`, `docs/project/TASK-BOARD.md`, `docs/content/HISTORICAL-REVIEW-REPORT-2026-09-28.md`.
- Test/build result: `validate-1972-authoring.mjs` PASS; `npm run quality` local PASS; markdown link validation PASS 0 broken links.
- Environment/migration impact: docs/content-only, không ảnh hưởng runtime; không cài thêm dependencies.
- Next owner/action: không còn; task `DONE`, không quyết định gate milestone.

## Closeout — 2026-10-02

- PR #54 (`content/tho-lesson-02-1972-vn-v2`) merged `0075079` ngày 2026-09-30: Trúc APPROVED historical/media, PO APPROVED nghiệm thu, Quality checks 2/2 SUCCESS.
- Re-verified trên main `2abd202`: `validate-1972-authoring.mjs` PASS (5 nodes, 8/8 scenes, narration đủ 8 scene, không từ ngữ quy trình vi mô).
- Card chuyển `active/` → `done/`; board và index đồng bộ. M3 vẫn OPEN; production/integration cần task/gate riêng.
