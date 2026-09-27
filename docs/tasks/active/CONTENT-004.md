# CONTENT-004 — Screenplay và kịch bản/storyboard video

> Status: DONE\
> Last updated: 2026-09-26

## Assignment

- Phase / milestone: MVP content track; hoàn tất Milestone 1
- Workstream: Product + Content
- Accountable owner: Thọ (Member 1)
- Executor type: Human hoặc Codex hỗ trợ bản nháp
- Executor name: Thọ (Member 1)
- Reviewer: Historical reviewer + Product owner
- Codex task/thread: Milestone 1 Worker
- Branch: main
- Started: 2026-09-26
- Depends on: CONTENT-003, CONTENT-008 (`DONE`), DOC-006 (`DONE`)

## Scope

- In scope: screenplay scene-by-scene và kịch bản/storyboard cho Pilot Video "Kế hoạch Giao Thừa" (Lesson 1) trong chapter mẫu Mậu Thân 1968; ghi rõ objectives, fact/source, visual cues chuẩn 9:16 dọc (1080x1920), voiceover, SFX/BGM, phụ đề WebVTT, truth classification (`verified_fact`), full transcript, poster frame và fallback card spec để bàn giao cho Trúc (Member 2) sản xuất video.
- Out of scope: tự dựng/biên tập file MP4 cuối cùng (thuộc trách nhiệm Member 2/CONTENT-007), tự publish bài học mà chưa qua QA.
- Files claimed: `docs/content/PILOT-SCREENPLAY.md`.
- Shared-contract consumers: Member 2/CONTENT-007, Member 4/FE-005/006, CONTENT-005.

## Acceptance criteria

- [x] Mỗi scene/lesson có mục tiêu học, bối cảnh, vai trò và lựa chọn phù hợp Phase 2/5.
- [x] Các câu lịch sử gắn nguồn; fiction/perspective được nêu rõ để historical reviewer kiểm tra.
- [x] Kịch bản/storyboard video đủ rõ để Member 2 dựng, có lời dẫn/hình/media và vị trí trong lesson (video dọc 9:16, 110s, 5 phân cảnh).
- [x] Product owner và historical reviewer review trước khi chuyển cho Member 2 sản xuất.

## Verification

- Commands/checks: story/content checklist Phase 2, 3, 5 và review record; kiểm tra zero thuật ngữ cấm qua ripgrep; đối soát sự thật lịch sử đêm Giao thừa Mậu Thân 1968 tại Sài Gòn.
- Expected result: Member 2 có script/source được duyệt, có WebVTT template, transcript và fallback card đầy đủ, không phải tự đoán nội dung lịch sử.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-23 | Codex | Tạo card và nêu handoff Member 1 → Member 2 | Task board / DOC-013 | Chờ curriculum map và historical source review | CONTENT-003/008 chưa xong |
| 2026-09-26 | Thọ (Member 1) | Hoàn thành Screenplay chi tiết phân cảnh 9:16 cho Pilot Video "Kế hoạch Giao Thừa" (5 scenes, 110s, VTT, transcript, poster, fallback) | `docs/content/PILOT-SCREENPLAY.md` | Bàn giao cho Member 2 (Trúc) sản xuất video qua CONTENT-007; chuyển task DONE | Không |

## Handoff

- Changed files: `docs/content/PILOT-SCREENPLAY.md`, `docs/tasks/done/CONTENT-004.md`.
- Test/build result: Hoàn tất 100% acceptance criteria; ripgrep kiểm tra 0 thuật ngữ cấm; tuân thủ pháp luật Việt Nam.
- Environment/migration impact: Không có.
- Known issues/risks: Không có.
- Next owner/action: Member 2 (Trúc) tiếp nhận gói bàn giao kỹ thuật để sản xuất video theo task CONTENT-007; Member 4 (Dương) tích hợp Player component (FE-006).
