# CONTENT-008 — Bản đồ bài học cho chapter mẫu MVP

> Status: DONE\
> Last updated: 2026-09-26

## Assignment

- Phase / milestone: MVP content track; hoàn tất Milestone 1
- Workstream: Product + Content
- Accountable owner: Thọ (Member 1)
- Executor type: Human team / Codex
- Executor name: Thọ (Member 1)
- Reviewer: Product owner + historical reviewer + learning reviewer
- Codex task/thread: Milestone 1 Worker
- Branch: main
- Started: 2026-09-26
- Depends on: CONTENT-002 (chọn chapter mẫu, `DONE`), DOC-003 (`DONE`), DOC-012 (product scope clarification, `DONE`)

## Scope

- In scope: lập curriculum map cho một chapter mẫu thuộc giai đoạn kháng chiến chống Mỹ tại Việt Nam, gồm nhiều lesson đa định dạng; chọn vị trí pilot episode, video, bài thường, knowledge check và quiz theo mục tiêu học; thiết lập khế ước bàn giao cho Member 2, Member 4, Member 5.
- Out of scope: tự chốt danh sách sự kiện hay mốc thời gian thay product owner; dựng video, sửa source/database hoặc dùng demo Genève làm chapter canonical.
- Files claimed: `docs/content/CURRICULUM-MAP.md`.
- Shared-contract consumers: Member 2/CONTENT-007, Member 4/FE-005/FE-006/FE-007, Member 5/content service và QA-005.

## Acceptance criteria

- [x] Chapter mẫu và ranh giới nội dung nằm trong phạm vi kháng chiến chống Mỹ tại Việt Nam, được product owner chốt.
- [x] Có danh sách nhiều lesson theo thứ tự, mỗi lesson có learning objective, format phù hợp và lý do chọn format; pilot episode và video nằm ở vị trí rõ ràng.
- [x] Có bản đồ nguồn/claim cần kiểm chứng cho từng lesson và chỗ cần historical review; không xem ví dụ/demo cũ là nội dung đã duyệt.
- [x] Luồng hoàn thành chapter, knowledge check/quiz và bước học tiếp theo được mô tả để frontend/backend/QA dùng chung.
- [x] Product owner, learning reviewer và historical reviewer xác nhận outline trước khi Member 1 viết screenplay chi tiết hoặc Member 2 dựng video.

## Verification

- Commands/checks: đối chiếu Phase 1–3, Phase 5 và Phase 9; review coverage của learning objectives, lesson order, media/source checklist; kiểm tra zero forbidden terms via ripgrep.
- Expected result: một chapter outline nhiều lesson có thể bàn giao cho CONTENT-003/004/007 và feature teams mà không phải đoán scope.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-23 | Product owner + Codex | Chốt MVP đầu tiên là một chapter mẫu nhiều lesson trong phạm vi kháng chiến chống Mỹ | Product scope clarification trong task hiện tại | Member 1 chọn chapter qua CONTENT-002 rồi claim curriculum file | Chapter/pilot chưa được chọn; tên thật Member 1 chưa gán |
| 2026-09-23 | Codex | Product owner gán Thọ là Member 1 | TEAM-OWNERSHIP / DOC-015 | Chờ Product owner chọn chapter ở CONTENT-002 | Chapter/pilot chưa được chọn |
| 2026-09-25 | Thọ | Hoàn tất chọn Mậu Thân 1968 | docs/content/MVP-BRIEF.md | Chuyển CONTENT-008 sang READY | Không |
| 2026-09-26 | Thọ (Member 1) | Hoàn thành Curriculum Map đa định dạng cho Chapter Mậu Thân 1968 (Lesson 1-4 + Quiz), khế ước dữ liệu và danh mục nguồn kiểm chứng | `docs/content/CURRICULUM-MAP.md` | Bàn giao cho Member 2 dựng video và Member 4 tích hợp UI; chuyển task DONE | Không |

## Handoff

- Changed files: `docs/content/CURRICULUM-MAP.md`, `docs/tasks/done/CONTENT-008.md`.
- Test/build result: Hoàn tất 100% acceptance criteria; ripgrep kiểm tra 0 thuật ngữ cấm; tuân thủ pháp luật Việt Nam.
- Environment/migration impact: Không có thay đổi schema hay build config.
- Known issues/risks: Không có.
- Next owner/action: Member 2 (Trúc) nhận kịch bản video để sản xuất (CONTENT-007); Member 4 (Dương) nhận cấu trúc lesson để dựng player (FE-006).
