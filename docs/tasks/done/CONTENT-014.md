# CONTENT-014 — Hoàn thiện gói authoring Mậu Thân sau PR #21

> Status: DONE
> Started: 2026-09-27

- Owner: Trúc (Member 2), theo quyền Thọ giao làm toàn bộ phần sửa còn lại.
- Executor: Trúc; Codex hỗ trợ. Một executor duy nhất.
- Reviewer: Trúc phụ trách historical/learning/media theo quyền được giao; Vinh giữ vai trò technical QA. Chưa ghi nhận sign-off bản mới.
- Branch: `codex/mt68-complete-handoff`, base main `165b9ac`; PR #21 đã merge.
- Depends on: DOC-003/004/006/009 đã DONE; bản nháp PR #21 đã có trên main. Đây là task sửa tài liệu/authoring, không claim sản xuất. `CONTENT-004` giữ `REVIEW` cùng gói technical QA/media/handoff này; `CONTENT-007` hiện BLOCKED cho đến khi artifact pilot và review record nhất quán.
- Files claimed: `docs/content/PILOT-SCREENPLAY.md`, `PILOT-NARRATION.json`, `PILOT-CAPTIONS.vtt`, `LESSON-02-INTERACTIVE.md`, `LESSON-02-STORY.json`, `MAP-MT68.json`, `PRODUCTION-NOTES.md`, `CURRICULUM-MAP.md`, `HISTORICAL-SOURCES.md`, `DETAILED-MEDIA-CATALOG.csv`, `MEDIA-REVIEW-MT68.md`; board, card CONTENT-003/004/010/011/012 và PR21-HANDOFF.
- Next action: Trúc review bản authoring và Vinh kiểm tra kỹ thuật trong PR tiếp nối; chưa xác nhận phát hành hoặc sản xuất.
- File claim bổ sung: `docs/content/validate-mt68-authoring.mjs`, kiểm tra graph/ID/nguồn/timing/VTT cho các file trong task, không sửa runtime.
- Out of scope: code/player/DB, chapter 1972, MP4 cuối, purchase/license requests, merge/release, CONTENT-006 và mở milestone.

## Acceptance

- [x] Pilot đủ 5 scene, narration/caption cùng nội dung, cue trong 110s (timing kế hoạch).
- [x] Bài 2 có scene graph, choice/feedback, debrief và end; mọi đường đi bao quát năm mục tiêu trong authoring.
- [x] JSON map không chứa claim bị bác bỏ hoặc tọa độ giả bị hiểu là địa lý.
- [x] Media có quyết định từng ứng viên và phương án không phụ thuộc asset chưa đủ quyền.
- [x] Curriculum/production notes/source/board/card nhất quán cho phạm vi sửa; kết quả kiểm tra và bước còn cần con người rõ.
- [x] Codex technical reviewer và root xác nhận bản authoring trên nhánh review này ngày 2026-10-02 theo yêu cầu nghiệm thu được người dùng ủy quyền. Không ghi một GitHub/human approval chưa xảy ra; không phải sign-off phát hành.

## Verification — 2026-09-27

- PASS: `node docs/content/validate-mt68-authoring.mjs`: 5 node, 7 scene, 6 đường đi kết thúc, 5 câu quiz, 9 cue narration/VTT giống nhau và phủ 110s; source/claim ID và link Markdown nội bộ trong tập file kiểm tra hợp lệ.
- PASS: CSV parse đủ 8 ứng viên; 6 chưa đủ bằng chứng, 2 NEEDS_MEDIA_REVIEW; không asset nào được tự duyệt.
- PASS: `git diff --check`.
- Không chạy app build/typecheck: chỉ sửa tài liệu/dữ liệu authoring và validator riêng, không sửa runtime, dependency hoặc contract triển khai. Chưa kiểm chứng renderer/DTO, thời lượng giọng thu, file media hay human sign-off.

## Handoff

- Chưa có build/runtime impact; không environment/migration.
- Quyền thực hiện không thay bằng chứng quyền tác giả, file thu âm hoặc nghiệm thu nghe/xem.
- CONTENT-006 giữ IN PROGRESS/REFERENCE_ONLY; Gate snapshot superseded: M0–M2 DONE, M3 OPEN, M4–M5 implementation authorized; content production remains BLOCKED.

## Accepted review and current handoff — 2026-10-02

- Reviewer decision: Codex independent specialists plus root cross-review, under the user's explicit delegation to review, repair and close acceptance-complete tasks. Status DONE applies to this card's technical/authoring scope; it does not claim a new Hưng/Vinh/Trúc approval or milestone closure. This checkpoint supersedes older pending next actions.
- Evidence: [all-task audit](../../engineering/review-all/EVIDENCE.md); final Quality PASS and native-mode 49/49 PASS. Files changed, tests, environment/migration impact and remaining integration/content limits are listed in that report.
- Accepted deliverable is draft remediation: 5 nodes, 7 scenes, 6 terminating paths, 5 quiz questions and 9 matching narration/VTT cues110s. Reviewer confirmation is recorded on this isolated branch under the latest user delegation; production/media cards remain REVIEW/BLOCKED.
- Next action: none for this accepted deliverable. Hosted setup/rotation, real Auth/REST/Storage and canonical media rights remain assigned to their open cards; milestone decisions remain separate.
