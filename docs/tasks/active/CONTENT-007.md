# CONTENT-007 — Video theo kịch bản cho bài học MVP

> Status: READY\
> Last updated: 2026-09-28

## Assignment

- Phase / milestone: MVP content track; tích hợp M6–M7
- Workstream: UI/UX Figma + video production, phối hợp Product + Content
- Accountable owner: Trúc (Member 2)
- Executor type: Human team
- Executor name: Trúc khi task được mở
- Reviewer: Thọ/Product owner + historical reviewer; Vinh kiểm tra media/accessibility
- Codex task/thread: chưa giao
- Branch: chưa tạo
- Started: chưa bắt đầu sản xuất
- Depends on: CONTENT-003 (pilot source/media review), CONTENT-004 (kịch bản/storyboard video), DOC-004 (`DONE`)

## Scope

- In scope: biên tập ít nhất một video theo kịch bản/nguồn đã duyệt để đặt trong một lesson của chapter mẫu MVP; chuẩn bị poster, phụ đề tiếng Việt, transcript, fallback và bản xuất phù hợp mobile.
- Out of scope: tự viết lại fact lịch sử, tự duyệt nguồn/license, xây video player hoặc tự publish nội dung; `episode-portrait-final.mp4` của CONTENT-006 vẫn là reference riêng, không mặc định dùng làm video MVP.
- Files claimed: chưa claim media output path; Member 2 phải ghi đường dẫn asset/metadata sau khi pilot và kịch bản được chốt. Không claim `src/features/learning/` (thuộc FE-006/Member 4).
- Shared-contract consumers: Member 4/FE-006, media service/Member 5, CONTENT-005, QA-004, QA-005. FE-006 và QA-005 chịu trách nhiệm kiểm tra tích hợp sau handoff.

## Acceptance criteria

- [ ] Member 1 bàn giao kịch bản/storyboard, mục tiêu học, vị trí video trong lesson và danh sách nguồn; historical reviewer xác nhận claims/media đủ điều kiện sản xuất.
- [ ] Member 2 bàn giao ít nhất một video đúng kịch bản, có bản xuất mobile và poster; không dùng ảnh/âm thanh/tư liệu thiếu quyền hoặc sai bối cảnh.
- [ ] Có phụ đề tiếng Việt đồng bộ, transcript, attribution/license, mô tả thay thế và fallback khi video không tải.
- [ ] Member 1 và historical reviewer duyệt bản cuối; thay đổi fact/media sau duyệt phải review lại.
- [ ] Member 4 nhận media package và metadata cần cho FE-006; việc gắn vào lesson và kiểm thử resume/fallback thuộc FE-006/QA-005 sau khi CONTENT-007 bàn giao.

## Verification

- Commands/checks: kiểm tra media metadata/size/rendition, playback trên mobile, đối chiếu caption/transcript với kịch bản và Phase 3/8 media checklist.
- Expected result: media package đã duyệt, đầy đủ thành phần và được Member 4 nhận để tích hợp; video chạy trong lesson là gate của FE-006/QA-005.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-28 | Historical Reviewer | CONTENT-004 kịch bản & thẩm định sử liệu đã APPROVED; CONTENT-007 chính thức UNBLOCKED | Báo cáo HISTORICAL-REVIEW-REPORT-2026-09-28.md | Trúc (Member 2) nhận task, chuẩn bị sản xuất video và thu âm | Không còn blocker kịch bản/sử liệu |
| 2026-09-29 | Codex | Đồng bộ dependency theo verdict mới nhất: CONTENT-004 DONE và historical review đã mở khóa production | `docs/content/HISTORICAL-REVIEW-REPORT-2026-09-28.md`; task board/card | Trúc claim branch, Started và media output path rồi chuyển IN PROGRESS | Không còn blocker trước production; media/audio/MP4 cuối vẫn phải review trước publish |
| 2026-09-23 | Product owner + Codex | Chốt Member 2 là người biên tập video cho bài học MVP; tạo task riêng với FE-006 player | Quyết định trong task hiện tại; task board/Phase 9 | Member 1 chọn pilot và bàn giao script/source; gán tên Member 2 rồi claim media files | CONTENT-003/004 chưa xong, chưa có tên thật Member 2 |
| 2026-09-23 | Codex | Product owner gán Trúc là Member 2 | TEAM-OWNERSHIP / DOC-015 | Chờ Thọ bàn giao script/source và historical review | CONTENT-003/004 chưa xong |

## Handoff

- Changed files: chưa có media asset.
- Test/build result: chưa sản xuất/tích hợp video.
- Environment/migration impact: chưa xác định; Member 5 review storage/metadata trước tích hợp.
- Known issues/risks: quyền audio/từng asset và MP4 cuối chưa có; đây là acceptance của production/release, không còn là blocker nhận task. Không dùng CONTENT-006 làm bản mặc định.
- Next owner/action: Trúc claim branch, Started và media output path, chuyển task sang IN PROGRESS rồi sản xuất theo screenplay đã duyệt. Vinh QA media/accessibility; Dương tích hợp bằng FE-006 sau media review và milestone phù hợp.
