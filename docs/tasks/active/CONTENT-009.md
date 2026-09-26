# CONTENT-009 — Nghiên cứu nguồn và chủ đề ứng viên cho chapter mẫu

> Status: REVIEW\
> Last updated: 2026-09-26

## Assignment

- Phase / milestone: Content track độc lập, được làm trong lúc M0 đang mở
- Workstream: Product + Content
- Accountable owner: Thọ (Member 1)
- Executor type: Human, Codex hỗ trợ tìm và tổ chức nguồn
- Executor name: Thọ (Member 1) + AI
- Reviewer: Historical reviewer + Product owner (Review Round 1, 2, 3 hoàn thành bởi Teamwork Preview Reviewer)
- Codex task/thread: 50faccc3-f66f-4576-ab27-1e6a159b7d21
- Branch: content-009-research
- Started: 2026-09-26
- Depends on: DOC-003 (`DONE`), DOC-004 (`DONE`)

## Scope

- In scope: tìm và so sánh nguồn đáng tin cho một số chủ đề/chapter ứng viên thuộc giai đoạn kháng chiến chống Mỹ ở Việt Nam; ghi tác giả/cơ quan, link hoặc thông tin xuất bản, loại nguồn, fact có thể dùng, điểm còn tranh luận và media/license cần kiểm tra.
- Out of scope: tự duyệt fact, tự chọn chapter/pilot thay Product owner, viết screenplay chính thức, dựng video, seed/publish content hoặc sửa app code.
- Files claimed: docs/features/research-content-009.md
- Shared-contract consumers: Product owner/CONTENT-002, historical reviewer/CONTENT-003, Member 1/CONTENT-008.

## Acceptance criteria

- [x] Có danh sách chủ đề ứng viên trong phạm vi sản phẩm, kèm lý do phù hợp một chapter nhiều lesson; không dùng demo Genève làm mặc định.
- [x] Mỗi nguồn có thông tin truy vết được; tách nguồn gốc, diễn giải và ý tưởng kể chuyện theo chuẩn Phase 3.
- [x] Những claim chưa chắc chắn hoặc nguồn mâu thuẫn được định danh mã hóa (Claim ID) kèm đề xuất wording constraints để historical reviewer kiểm tra.
- [x] Bản so sánh đa chiều (gồm cả chi phí asset MVP và rủi ro phạm vi) đủ để Product owner chọn chapter/pilot ở CONTENT-002; chưa gắn trạng thái canonical/approved cho nội dung nghiên cứu.

## Verification

- Commands/checks: đối chiếu Phase 2/3 source policy, kiểm tra link và metadata của nguồn; rà soát tính nhất quán niên biểu lịch sử, đối chiếu tài liệu Bộ Tổng tham mưu / Quân chủng PK-KQ / USAF SAC loss reports.
- Expected result: có bằng chứng để ra quyết định chọn chapter, không tự xuất bản nội dung.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-23 | Codex | Tách nghiên cứu sơ bộ khỏi CONTENT-002/008 để Member 1 có thể bắt đầu khi M0 đang mở | DOC-014 và task board | Gán tên Member 1, claim file, chuyển `IN PROGRESS` rồi tìm nguồn | Chưa có tên thật/historical reviewer được chỉ định |
| 2026-09-23 | Codex | Product owner gán Thọ là Member 1 | TEAM-OWNERSHIP / DOC-015 | Thọ claim file và bắt đầu tìm nguồn | Historical reviewer chưa được chỉ định |
| 2026-09-26 | Thọ + AI | Hoàn thành nghiên cứu 4 chủ đề ứng viên, thu thập nguồn chính thống QĐNDVN/PK-KQ/quốc tế, phân tách fact/interpretation/narrative, lập bảng so sánh và highlight mâu thuẫn | `docs/features/research-content-009.md` | Chuyển sang Review Round 1 | Historical reviewer chưa chính thức chỉ định |
| 2026-09-26 | Teamwork Reviewer | Hoàn thành Review Round 1: Sửa nghịch đảo niên biểu Chủ đề 3 (1967 trước 1968); đính chính trích dẫn Bác Hồ & cẩm nang bìa đỏ Chủ đề 1; bổ sung phi công Trần Cao Băng Chủ đề 4; chuẩn hóa Source ID & ISBN theo Phase 3 Spec; mã hóa Claim ID & wording constraints; bổ sung tiêu chí khả thi kỹ thuật/chi phí asset MVP vào bảng so sánh R4; chuyển task sang `REVIEW` | `docs/features/research-content-009.md` | Chuyển sang Review Round 2 | Chờ Product Owner họp chọn Chapter mẫu tại CONTENT-002 |
| 2026-09-26 | Teamwork Reviewer 2 | Hoàn thành Review Round 2 (Adversarial Review): Khắc phục thiếu sót vũ khí Mk-81 Phi đội Quyết Thắng và cơ chế An-2 Pa Thí (Chủ đề 4); sửa lỗi gán `truth_class: verified_fact` và bổ sung hiện vật bảo tàng SRC-HR-06 (Chủ đề 2); bổ sung sự kiện Truông Bồn, lỗi chính tả và claim CLM-V17-002 súng trường (Chủ đề 3); chuẩn hóa 100% Phase 3 Claim schema (`review_status`, `reviewer`, `text_or_reference`); đồng bộ đầy đủ Task Board & Task Card | `docs/features/research-content-009.md`, `docs/tasks/active/CONTENT-009.md`, `docs/project/TASK-BOARD.md` | Chuyển sang Review Round 3 (Final Gate Review) | Chờ Product Owner họp chọn Chapter mẫu tại CONTENT-002 |
| 2026-09-26 | Teamwork Reviewer 3 | Hoàn thành Review Round 3 (Final Adversarial Review): Khắc phục nhầm lẫn ngày truyền thống không quân (03/4 là ngày đánh thắng trận đầu, 03/3 là ngày truyền thống không quân), căn cứ Đa Phúc, phi công Lê Minh Huân; đính chính chỉ huy Truông Bồn (Trần Thị Doãn & Cao Ngọc Dung); sửa lỗi nhầm tên phi công Pa Thí (Đinh Công Vượng thay vì Đinh Tôn); bổ sung toàn diện verified facts cho 100% bài học ở cả 4 chủ đề; chuẩn hóa 100% Phase 3 Schema hai chiều (supports_claims, text_or_reference, historical_scope, reviewer) | `docs/features/research-content-009.md`, `docs/tasks/active/CONTENT-009.md`, `docs/project/TASK-BOARD.md` | Bàn giao cho Product Owner (CONTENT-002) và Historical Reviewer (CONTENT-003) | Chờ Product Owner họp chọn Chapter mẫu tại CONTENT-002 |

## Handoff

- Changed files: `docs/features/research-content-009.md`, `docs/tasks/active/CONTENT-009.md`, `docs/project/TASK-BOARD.md`.
- Test/build result: Kiểm tra cú pháp Markdown, liên kết tài liệu nội bộ, tính chuẩn xác niên biểu lịch sử, phân định fact/fiction/explanation và quy chuẩn Source & Claim Policy Phase 3 (21 nguồn tài liệu có liên kết supports_claims hai chiều, 8 Claim metadata entries chuẩn hóa 100% schema với review_status: NEEDS_HISTORICAL_REVIEW và wording constraints; 100% bài học được bảo chứng bởi verified facts) thành công. Đạt termination floor (3 vòng review hoàn tất).
- Environment/migration impact: Không có (tài liệu tài nguyên nội dung).
- Known issues/risks:
  - Toàn bộ 8 claims mâu thuẫn giữa nguồn Việt Nam và quốc tế (số lượng B-52, MiG bắn hạ B-52, trận Hàm Rồng, trận Pa Thí, bom tàu chiến Hòn La, đạn pháo Ngô Thị Tuyển, súng trường bắn phản lực) đã được mã hóa chuẩn hóa schema Phase 3 với `review_status: NEEDS_HISTORICAL_REVIEW`, cần Historical Reviewer chính thức thẩm định và phê duyệt tại CONTENT-003.
  - Chủ đề 4 có rủi ro chi phí đồ họa cao (4 bối cảnh, 3 loại buồng lái khác nhau), Content Team và Reviewer kiến nghị không chọn làm MVP pilot mà dành cho bản mở rộng; ưu tiên tuyệt đối chọn Chủ đề 1 làm Chapter MVP.
- Next owner/action: Thọ chuyển giao tài liệu nghiên cứu cho Product Owner ra quyết định chọn Chapter mẫu tại CONTENT-002 và chuyển giao cho Historical Reviewer thẩm định tại CONTENT-003.
