# CONTENT-004 — Screenplay và kịch bản/storyboard video

> Status: REVIEW\
> Last updated: 2026-09-28

## Assignment

- Phase / milestone: MVP content track; độc lập với M2 đang OPEN
- Workstream: Product + Content
- Accountable owner: Thọ (Member 1)
- Executor type: Human hoặc Codex hỗ trợ bản nháp
- Executor name: Thọ (Member 1)
- Reviewer: Trúc (historical/media) + Vinh (technical QA); Product owner quyết định mở production sau review
- Codex task/thread: sửa hồ sơ PR #21
- Branch: `codex/content-status-sync` (hồ sơ đồng bộ); evidence authoring: `codex/mt68-complete-handoff`
- Started: 2026-09-26
- Depends on: CONTENT-003, CONTENT-008 (`DONE`), DOC-006 (`DONE`)

## Scope

- In scope: screenplay scene-by-scene và kịch bản/storyboard cho Pilot Video "Kế hoạch Giao Thừa" (Lesson 1) trong chapter mẫu Mậu Thân 1968; ghi rõ objectives, fact/source, visual cues chuẩn 9:16 dọc (1080x1920), voiceover, SFX/BGM, phụ đề WebVTT, truth classification (`verified_fact`), full transcript, poster frame và fallback card spec để bàn giao cho Trúc (Member 2) sản xuất video.
- Out of scope: tự dựng/biên tập file MP4 cuối cùng (thuộc trách nhiệm Member 2/CONTENT-007), tự publish bài học mà chưa qua QA.
- Files claimed: `docs/content/PILOT-SCREENPLAY.md`, `PILOT-NARRATION.json`, `PILOT-CAPTIONS.vtt`, `HISTORICAL-SOURCES.md`, `DETAILED-MEDIA-CATALOG.csv`, card này và `docs/project/TASK-BOARD.md`.
- Shared-contract consumers: Member 2/CONTENT-007, Member 4/FE-005/006, CONTENT-005.

## Acceptance criteria

- [x] Mỗi scene/lesson có mục tiêu học, bối cảnh, vai trò và lựa chọn phù hợp Phase 2/5; evidence ở `CONTENT-014` validator.
- [x] Claim/source, narration và VTT đã được sửa trong gói authoring; historical review đã đạt ngày 2026-09-28.
- [x] Kịch bản/storyboard có 5 scene, bản 9:16 và timing authoring 110 giây; chưa phải MP4 đã duyệt.
- [ ] Trúc media, Vinh technical QA và Product owner xác nhận handoff trước khi chuyển cho Member 2 sản xuất.

## Verification

- Commands/checks: story/content checklist Phase 2, 3, 5 và review record; kiểm tra zero thuật ngữ cấm qua ripgrep; đối soát sự thật lịch sử đêm Giao thừa Mậu Thân 1968 tại Sài Gòn.
- Expected result: Member 2 có script/source được duyệt, có WebVTT template, transcript và fallback card đầy đủ, không phải tự đoán nội dung lịch sử.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-23 | Codex | Tạo card và nêu handoff Member 1 → Member 2 | Task board / DOC-013 | Chờ curriculum map và historical source review | CONTENT-003/008 chưa xong |
| 2026-09-26 | Thọ (Member 1) | Hoàn thành Screenplay chi tiết phân cảnh 9:16 cho Pilot Video "Kế hoạch Giao Thừa" (5 scenes, 110s, VTT, transcript, poster, fallback) | `docs/content/PILOT-SCREENPLAY.md` | Bàn giao cho Member 2 (Trúc) sản xuất video qua CONTENT-007; chuyển task DONE | Không |

## Checkpoint 2026-09-28 — đồng bộ trạng thái

- Card `DONE` và card `BLOCKED` trước đây cùng tồn tại cho `CONTENT-004`; board còn liên kết nhầm sang card blocked. Theo `AGENTS.md` và `docs/tasks/README.md`, acceptance cuối cần reviewer xác nhận, nên task được hợp nhất thành một card `REVIEW`, không phải `DONE` hay `BLOCKED`.
- Bản sửa authoring do Trúc thực hiện theo quyền Thọ giao đã có evidence ở `CONTENT-014`: 5 scene, narration/VTT khớp 110 giây, claim/source và media catalog được validator kiểm tra. Đây là deliverable để review, không phải sign-off phát hành.
- Next action: Trúc review lịch sử/media của pilot; Vinh chạy technical QA. Chỉ khi hai review và Product owner ghi quyết định rõ thì mới xem dependency của `CONTENT-007` đạt.
- Blocker: chưa có historical/media sign-off, quyền audio/từng asset và bản MP4 cuối; `CONTENT-007` giữ `BLOCKED`.

## Checkpoint 2026-09-27 — thay thế kết luận DONE trước đây

- Trúc được Thọ cấp quyền sửa hồ sơ PR #21; executor screenplay vẫn là Thọ.
- Review CONTENT-003 còn NEEDS_REVISION; không đạt dependency để sản xuất.
- Các checkpoint cũ ghi DONE/không blocker không còn là trạng thái hiện hành.
- Files claimed cho lượt sửa hồ sơ: card này, board, cờ trạng thái/checklist của PILOT-SCREENPLAY; không viết lại kịch bản trong lượt sửa Bài 2–4.
- Next action: superseded by checkpoint 2026-09-28.
- Lịch sử cũ từng có hai card; bản hiện hành chỉ dùng card `REVIEW` này.

## Handoff

### Review snapshot 2026-09-28 — đã được verdict APPROVED bên dưới thay thế

- Trúc yêu cầu thực hiện review; Codex khôi phục screenplay/curriculum/registry authoring v2 bị regression. [Báo cáo và handoff](../active/CONTENT-003-004-REVIEW.md) là checkpoint mới nhất, thay các kết luận kiểm tra cũ.
- Validator PASS sau sửa; nguồn danh sách năm mục tiêu chưa đọc lại được. Chưa có human sign-off hay evidence audio hợp lệ; status giữ REVIEW.
- MP4/poster cuối là đầu ra CONTENT-007 cần nghiệm thu sau sản xuất; blocker trước sản xuất là nguồn/script/sign-off và phương án quyền media.
- Build/typecheck không chạy vì thay đổi chỉ tài liệu authoring; không runtime/env/migration impact.

- Changed files: authoring evidence trong `CONTENT-014`; hồ sơ hiện hành: card này và task board.
- Test/build result: `node docs/content/validate-mt68-authoring.mjs` PASS theo `CONTENT-014`; docs-only, không có runtime change từ lượt đồng bộ trạng thái.
- Environment/migration impact: không có.
- Known issues: reviewer chưa sign-off; quyền audio/từng asset và MP4 cuối chưa có evidence. Không coi AI review là approval.
- Next owner/action tại thời điểm snapshot: Trúc review historical/media, Vinh technical QA; kết luận này đã được checkpoint APPROVED mới hơn thay thế.

## Checkpoint 2026-09-28 — Historical Review APPROVED (không phải task-level sign-off)
- Thẩm định viên Lịch sử đã hoàn tất thẩm định toàn diện (FACT-001..012, terminology, fact vs fiction).
- Kịch bản 5 scene 110s, VTT captions, nguồn NXB QĐND và Cẩm nang bìa đỏ đạt chuẩn 100%.
- Báo cáo thẩm định: docs/content/HISTORICAL-REVIEW-REPORT-2026-09-28.md.
- Phạm vi lịch sử/ngôn ngữ đạt; verdict này không xác nhận technical QA, media hoặc task-level handoff. Task giữ `REVIEW` và production giữ `BLOCKED` cho đến khi `CONTENT-014` có Vinh sign-off, media evidence đạt và artifact pilot/review record nhất quán.

## Handoff hiện hành

- Changed files/evidence: screenplay, narration, captions, source registry, historical review report, card và task board.
- Test result: authoring validator PASS theo CONTENT-014; thay đổi docs/content không có runtime, environment hoặc migration impact.
- Known issues: Vinh chưa technical-QA task-level handoff; catalog hiện có 6/8 media item chưa đủ evidence và 2/8 còn `NEEDS_MEDIA_REVIEW` theo `CONTENT-014`.
- Next owner/action: Vinh xác nhận technical QA/handoff và Trúc hoàn tất media sign-off; chỉ sau đó reviewer mới chuyển task `DONE` và Product owner xem xét mở CONTENT-007.
