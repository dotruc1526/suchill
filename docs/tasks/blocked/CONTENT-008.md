# CONTENT-008 — Bản đồ bài học cho chapter mẫu MVP

> Status: BLOCKED\
> Last updated: 2026-09-23

## Assignment

- Phase / milestone: MVP content track; chuẩn bị trước M7
- Workstream: Product + Content
- Accountable owner: Thọ (Member 1)
- Executor type: Human team
- Executor name: Thọ khi task được mở
- Reviewer: Product owner + historical reviewer + learning reviewer
- Codex task/thread: chưa giao
- Branch: chưa tạo
- Started: chưa bắt đầu authoring
- Depends on: CONTENT-002 (chọn chapter mẫu), DOC-003 (`DONE`), DOC-012 (product scope clarification)

## Scope

- In scope: lập curriculum map cho một chapter mẫu thuộc giai đoạn kháng chiến chống Mỹ tại Việt Nam, gồm nhiều lesson đa định dạng; chọn vị trí pilot episode, video, bài thường, knowledge check và quiz theo mục tiêu học.
- Out of scope: tự chốt danh sách sự kiện hay mốc thời gian thay product owner; viết toàn bộ screenplay, dựng video, sửa source/database hoặc dùng demo Genève làm chapter canonical.
- Files claimed: chưa claim curriculum file; Member 1 ghi đường dẫn sau khi chapter được chọn. Không claim production `src/`.
- Shared-contract consumers: Member 2/CONTENT-007, Member 4/FE-005/FE-006/FE-007, Member 5/content service và QA-005.

## Acceptance criteria

- [ ] Chapter mẫu và ranh giới nội dung nằm trong phạm vi kháng chiến chống Mỹ tại Việt Nam, được product owner chốt.
- [ ] Có danh sách nhiều lesson theo thứ tự, mỗi lesson có learning objective, format phù hợp và lý do chọn format; pilot episode và video nằm ở vị trí rõ ràng.
- [ ] Có bản đồ nguồn/claim cần kiểm chứng cho từng lesson và chỗ cần historical review; không xem ví dụ/demo cũ là nội dung đã duyệt.
- [ ] Luồng hoàn thành chapter, knowledge check/quiz và bước học tiếp theo được mô tả để frontend/backend/QA dùng chung.
- [ ] Product owner, learning reviewer và historical reviewer xác nhận outline trước khi Member 1 viết screenplay chi tiết hoặc Member 2 dựng video.

## Verification

- Commands/checks: đối chiếu Phase 1–3, Phase 5 và Phase 9; review coverage của learning objectives, lesson order, media/source checklist.
- Expected result: một chapter outline nhiều lesson có thể bàn giao cho CONTENT-003/004/007 và feature teams mà không phải đoán scope.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-23 | Product owner + Codex | Chốt MVP đầu tiên là một chapter mẫu nhiều lesson trong phạm vi kháng chiến chống Mỹ | Product scope clarification trong task hiện tại | Member 1 chọn chapter qua CONTENT-002 rồi claim curriculum file | Chapter/pilot chưa được chọn; tên thật Member 1 chưa gán |
| 2026-09-23 | Codex | Product owner gán Thọ là Member 1 | TEAM-OWNERSHIP / DOC-015 | Chờ Product owner chọn chapter ở CONTENT-002 | Chapter/pilot chưa được chọn |

## Handoff

- Changed files: chưa có curriculum map.
- Test/build result: chưa có content deliverable.
- Environment/migration impact: không có.
- Known issues/risks: chapter, lesson count, thời gian/sự kiện cụ thể và nguồn chưa chốt.
- Next owner/action: Product owner/Thọ chọn chapter mẫu ở CONTENT-002, sau đó Thọ mở CONTENT-008 và bàn giao outline cho script/video/frontend.
