# CONTENT-014 — Hoàn thiện gói authoring Mậu Thân sau PR #21

> Status: REVIEW
> Started: 2026-09-27

- Owner: Trúc (Member 2), theo quyền Thọ giao làm toàn bộ phần sửa còn lại.
- Executor: Trúc; Codex hỗ trợ. Một executor duy nhất.
- Reviewer: Trúc phụ trách historical/learning/media theo quyền được giao; Vinh giữ vai trò technical QA. Historical/language verdict được đồng bộ riêng theo artifact hashes bên dưới; media/production chưa sign-off.
- Branch: `codex/vinh-qa001-content014`, PR #85 head `5959175` (unmerged); đối chiếu gate với `origin/main` `c29e4a7`.
- Depends on: DOC-003/004/006/009 đã DONE; bản nháp PR #21 đã có trên main. Đây là task sửa tài liệu/authoring, không claim sản xuất. `CONTENT-004` giữ `REVIEW` cùng gói technical QA/media/handoff này; `CONTENT-007` hiện BLOCKED cho đến khi artifact pilot và review record nhất quán.
- Files claimed: `docs/content/PILOT-SCREENPLAY.md`, `PILOT-NARRATION.json`, `PILOT-CAPTIONS.vtt`, `LESSON-02-INTERACTIVE.md`, `LESSON-02-STORY.json`, `MAP-MT68.json`, `PRODUCTION-NOTES.md`, `CURRICULUM-MAP.md`, `HISTORICAL-SOURCES.md`, `DETAILED-MEDIA-CATALOG.csv`, `MEDIA-REVIEW-MT68.md`; board, card CONTENT-003/004/010/011/012 và PR21-HANDOFF.
- Started: 2026-10-02 (review-state reconciliation)
- Next action: Hưng/Vinh recheck PR85 review-state reconciliation; media/legal/production acceptance remains pending. No production handoff.
- File claim bổ sung: `docs/content/validate-mt68-authoring.mjs`, kiểm tra graph/ID/nguồn/timing/VTT cho các file trong task, không sửa runtime.
- Out of scope: code/player/DB, chapter 1972, MP4 cuối, purchase/license requests, merge/release, CONTENT-006 và mở milestone.

## Acceptance

- [x] Pilot đủ 5 scene, narration/caption cùng nội dung, cue trong 110s (timing kế hoạch).
- [x] Bài 2 có scene graph, choice/feedback, debrief và end; mọi đường đi bao quát năm mục tiêu trong authoring.
- [x] JSON map không chứa claim bị bác bỏ hoặc tọa độ giả bị hiểu là địa lý.
- [x] Media có quyết định từng ứng viên và phương án không phụ thuộc asset chưa đủ quyền.
- [x] Curriculum/production notes/source/board/card nhất quán cho phạm vi sửa; kết quả kiểm tra và bước còn cần con người rõ.
- [ ] Reviewer xác nhận bản authoring trong PR; các dấu kiểm trên là evidence thực hiện, không phải sign-off phát hành.

## Verification — 2026-09-27

- PASS: `node docs/content/validate-mt68-authoring.mjs`: 5 node, 7 scene, 6 đường đi kết thúc, 5 câu quiz, 9 cue narration/VTT giống nhau và phủ 110s; source/claim ID và link Markdown nội bộ trong tập file kiểm tra hợp lệ.
- PASS: CSV parse đủ 8 ứng viên; 6 chưa đủ bằng chứng, 2 NEEDS_MEDIA_REVIEW; không asset nào được tự duyệt.
- PASS: `git diff --check`.
- Không chạy app build/typecheck: chỉ sửa tài liệu/dữ liệu authoring và validator riêng, không sửa runtime, dependency hoặc contract triển khai. Chưa kiểm chứng renderer/DTO, thời lượng giọng thu, file media hay human sign-off.

## Handoff

- Chưa có build/runtime impact; không environment/migration.
- Quyền thực hiện không thay bằng chứng quyền tác giả, file thu âm hoặc nghiệm thu nghe/xem.
- CONTENT-006 chỉ được duyệt làm tham khảo nội bộ (`REFERENCE_ONLY`), không dùng làm canonical content hoặc tích hợp phát hành.
- Gate hiện hành theo main: M3 OPEN, M4 LOCKED. Gate M3 không mở content production; CONTENT-007 vẫn BLOCKED.

## Technical QA claim — Vinh, 2026-10-01

- Reviewer executor: Codex hỗ trợ Vinh; owner authoring vẫn Trúc.
- Branch: `codex/vinh-qa001-content014`; snapshot authoring trên `main` `30d0a4f`.
- Files claimed cho review: card này, CONTENT-004/010/011/012 technical checkpoint, active index, board các row/next action tương ứng và `docs/tasks/evidence/CONTENT-014-technical-qa.md`.
- Next action: chạy validator, kiểm tra mutation trên bản sao độc lập, đối chiếu storyboard/narration/VTT/graph/map/quiz/media/handoff; ghi verdict technical riêng, không ký historical/media/production thay Trúc/PO.
- Gate clarification: dòng M2 OPEN/M3 LOCKED trong handoff cũ đã lỗi thời; board hiện hành M2 DONE, M3 OPEN, M4 LOCKED (M5–M7 cũng LOCKED). Content production vẫn theo dependency riêng.

## Technical reviewer decision — 2026-10-01

- Vinh (Codex hỗ trợ): **ACCEPTED** technical structure/reference/authoring timing tại `30d0a4f`; **CHANGES REQUESTED** P2 cho overall handoff vì review flags chưa đồng bộ. Historical/media/production không thuộc technical approval này.
- Evidence và hashes: [technical QA](../evidence/CONTENT-014-technical-qa.md).
- Validator PASS; 3 mutation probes độc lập FAIL đúng lỗi; CSV 6 BLOCKED/2 NEEDS_MEDIA_REVIEW, quiz labels/explanations và Lesson 3/4 local links PASS.
- Next action: Trúc xác nhận historical verdict theo artifact revision và đồng bộ flags/card; quiz cần quyết định review riêng. Không đánh dấu combined reviewer checklist đạt hay CONTENT-007 được mở.

## Review-state reconciliation — Trúc, 2026-10-02

- Historical report verdict is `APPROVED` only for the historical/language scope of CONTENT-004, CONTENT-010 and CONTENT-011. Comparing Git blobs at verdict commit `02c1128` with Vinh's reviewed snapshot `30d0a4f` shows the pre-sync files below are byte-identical. `Reviewed SHA-256` identifies those bytes; `Current SHA-256` identifies the file after changing only its review-status field/header:

| Artifact | Scope | Reviewed SHA-256 | Current SHA-256 | Synchronized state |
|---|---|---|---|
| `docs/content/PILOT-SCREENPLAY.md` | CONTENT-004 | `80470eff0a489149a3324dc1b0d0846062d2712c0da9cbadd1655f97f80452be` | `24dac5d3d9f49d436c5562c4adf672a54a2890be4958eb40de88eb9c00500604` | `APPROVED_BY_HISTORICAL_REVIEWER` |
| `docs/content/PILOT-NARRATION.json` | CONTENT-004 | `138f0fd12f594931f5f735b02d1f4cbf6cc2be90b7f82fcedab9ca4fe89e7387` | `b9e7d17f8503796621e6624785628585477dc9e34633e4224e6b484eefc137ed` | `APPROVED_BY_HISTORICAL_REVIEWER` |
| `docs/content/PILOT-CAPTIONS.vtt` | CONTENT-004 | `917854f6d74ec0c8454d4c414595ce360067357767dde4c55cf778fe2f672c6d` | same | Covered by screenplay/narration review; captions unchanged |
| `docs/content/LESSON-02-INTERACTIVE.md` | CONTENT-010 | `707c737cad5c8d5d48e543b7b2ad7b97921ad7a8df99be9c8160ee41c93d7dc3` | `51f70a1cdd21c8699ed09c97df965284499b08b2502ea8c2eaabd6c2d2a26cf4` | `APPROVED_BY_HISTORICAL_REVIEWER` |
| `docs/content/LESSON-02-STORY.json` | CONTENT-010 | `952c04810ff1652eebd7b076ecbb9065b2fed76c9f97bf36b2309c5130dffebb` | `9526a7e2e26a56b9c50ff78292046045b41ba67c913983ea5bec8c8f09aea1f1` | `APPROVED_BY_HISTORICAL_REVIEWER` |

- `MAP-MT68.json` remains `NEEDS_HISTORICAL_REVIEW`: the report does not identify that artifact/revision as an accepted review target. `QUIZ-MT68.json` also remains `NEEDS_HISTORICAL_REVIEW`; CONTENT-012 requires its own explicit historical/learning verdict. Technical acceptance and validator coverage do not substitute for either verdict.
- These review-state updates do not change content `status: draft`, `authoringOnly`, media rights/recording/transcript checks, or production eligibility. CONTENT-003/004 remain under review until their separate source/media/handoff acceptance is complete; CONTENT-007 remains BLOCKED. Current gate: M3 OPEN / M4 LOCKED.
- Next action: Hưng/Vinh recheck these hash-bound status updates; Trúc/authorized reviewer must review CONTENT-012 separately. No content production task moves to READY.
