# CONTENT-009 — Nghiên cứu nguồn và chủ đề ứng viên cho chapter mẫu

> Status: DONE\
> Last updated: 2026-09-25

## Assignment

- Phase / milestone: Content track độc lập, được làm trong lúc M0 đang mở
- Workstream: Product + Content
- Accountable owner: Thọ (Member 1)
- Executor type: Human, Codex hỗ trợ tìm và tổ chức nguồn
- Executor name: Thọ (Member 1) + Codex
- Reviewer: Historical reviewer + Product owner
- Codex task/thread: Chưa có
- Branch: feature/v1-implementation
- Started: 2026-09-25
- Depends on: DOC-003 (`DONE`), DOC-004 (`DONE`)

## Scope

- In scope: tìm và so sánh nguồn đáng tin cho một số chủ đề/chapter ứng viên thuộc giai đoạn kháng chiến chống Mỹ ở Việt Nam; ghi tác giả/cơ quan, link hoặc thông tin xuất bản, loại nguồn, fact có thể dùng, điểm còn tranh luận và media/license cần kiểm tra.
- Out of scope: tự duyệt fact, tự chọn chapter/pilot thay Product owner, viết screenplay chính thức, dựng video, seed/publish content hoặc sửa app code.
- Files claimed: chưa claim; Member 1 ghi đường dẫn source register/research note trước khi sửa.
- Shared-contract consumers: Product owner/CONTENT-002, historical reviewer/CONTENT-003, Member 1/CONTENT-008.

## Acceptance criteria

- [x] Có danh sách chủ đề ứng viên trong phạm vi sản phẩm, kèm lý do phù hợp một chapter nhiều lesson; không dùng demo Genève làm mặc định.
- [x] Mỗi nguồn có thông tin truy vết được; tách nguồn gốc, diễn giải và ý tưởng kể chuyện.
- [x] Những claim chưa chắc chắn hoặc nguồn mâu thuẫn được đánh dấu để historical reviewer kiểm tra.
- [x] Bản so sánh đủ để Product owner chọn chapter/pilot ở CONTENT-002; chưa gắn trạng thái canonical/approved cho nội dung nghiên cứu.

## Verification

- Commands/checks: đối chiếu Phase 2/3 source policy, kiểm tra link và metadata của nguồn; historical reviewer nhận xét danh mục.
- Expected result: có bằng chứng để ra quyết định chọn chapter, không tự xuất bản nội dung.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-23 | Codex | Tách nghiên cứu sơ bộ khỏi CONTENT-002/008 để Member 1 có thể bắt đầu khi M0 đang mở | DOC-014 và task board | Gán tên Member 1, claim file, chuyển `IN PROGRESS` rồi tìm nguồn | Chưa có tên thật/historical reviewer được chỉ định |
| 2026-09-23 | Codex | Product owner gán Thọ là Member 1 | TEAM-OWNERSHIP / DOC-015 | Thọ claim file và bắt đầu tìm nguồn | Historical reviewer chưa được chỉ định |\n| 2026-09-25 | Thọ + Codex | Hoàn thành nghiên cứu sơ bộ 3 ứng viên | docs/content/RESEARCH-CANDIDATES.md | Chuyển status sang DONE. PO chọn 1 ứng viên | Không |

## Handoff

- Changed files: chưa có research deliverable.
- Test/build result: chưa áp dụng.
- Environment/migration impact: không có.
- Known issues/risks: nguồn chưa được historical reviewer kiểm chứng; chapter/pilot chưa được chọn.
- Next owner/action: Thọ nhận task; Product owner dùng kết quả để quyết định CONTENT-002.
