# CONTENT-007 — Video theo kịch bản cho bài học MVP

> Status: IN PROGRESS\
> Last updated: 2026-10-02

## Assignment

- Phase / milestone: MVP content track; tích hợp M6–M7
- Workstream: UI/UX Figma + video production, phối hợp Product + Content
- Accountable owner: Trúc (Member 2)
- Executor type: Human team
- Executor name: Trúc; Codex hỗ trợ sản xuất theo yêu cầu PO Dương
- Reviewer: Thọ/Product owner + historical reviewer; Vinh kiểm tra media/accessibility
- Codex task/thread: chat hiện hành, PO Dương giao sản xuất và tích hợp
- Branch: codex/truc-content003-source-review
- Started: 2026-10-02; BLOCKED → READY theo PO → IN PROGRESS/claim
- Depends on: CONTENT-003 (pilot source/media review), CONTENT-004 (kịch bản/storyboard video), DOC-004 (`DONE`)

## Scope

- In scope: biên tập ít nhất một video theo kịch bản/nguồn đã duyệt để đặt trong một lesson của chapter mẫu MVP; chuẩn bị poster, phụ đề tiếng Việt, transcript, fallback và bản xuất phù hợp mobile.
- Out of scope: tự viết lại fact lịch sử, tự duyệt nguồn/license, xây video player hoặc tự publish nội dung; `episode-portrait-final.mp4` của CONTENT-006 vẫn là reference riêng, không mặc định dùng làm video MVP.
- Files claimed: card/board/index, docs/content/production/mt68-v1/, scripts/content/build-mt68-video.py; media/production notes và evidence closeout CONTENT-003. UI/service integration files sẽ được claim cụ thể sau khi có media output thật; PO Dương đã giao integration trong yêu cầu này.
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
| 2026-09-28 | Historical Reviewer | Báo cáo tổng hợp ghi CONTENT-004 APPROVED và đề xuất mở CONTENT-007 | `docs/content/HISTORICAL-REVIEW-REPORT-2026-09-28.md` | Đối chiếu review status trên từng artifact pilot | Review state được đồng bộ cho screenplay/narration theo hash; media/audio rights và combined handoff vẫn pending |
| 2026-09-29 | Dương + Codex | Xử lý finding P1 PR #62: không mở production khi artifact và báo cáo tổng hợp chưa nhất quán; đưa task về `BLOCKED` | Review của Hưng trên PR #62; task board/card/index đã đồng bộ | Content owner/historical reviewer cập nhật review status trên artifact hoặc ghi quyết định rõ ràng; sau đó review lại dependency | Chưa có xác nhận owner/reviewer trên artifact pilot |
| 2026-09-23 | Product owner + Codex | Chốt Member 2 là người biên tập video cho bài học MVP; tạo task riêng với FE-006 player | Quyết định trong task hiện tại; task board/Phase 9 | Member 1 chọn pilot và bàn giao script/source; gán tên Member 2 rồi claim media files | CONTENT-003/004 chưa xong, chưa có tên thật Member 2 |
| 2026-09-23 | Codex | Product owner gán Trúc là Member 2 | TEAM-OWNERSHIP / DOC-015 | Chờ Thọ bàn giao script/source và historical review | CONTENT-003/004 chưa xong |

## Handoff

- Changed files: chưa có media asset.
- Test/build result: chưa sản xuất/tích hợp video.
- Environment/migration impact: chưa xác định; Member 5 review storage/metadata trước tích hợp.
- Known issues/risks: quiz/map/source registry còn historical review pending; quyền audio/từng asset và MP4 cuối chưa có. CONTENT-006 chỉ là `REFERENCE_ONLY` nội bộ, không dùng làm canonical content hoặc bản phát hành.
- Next owner/action: hoàn tất source/media/audio-rights và combined handoff review; xử lý quiz verdict riêng. CONTENT-007 giữ `BLOCKED` cho đến khi dependency và media rights đạt, có task claim rõ. Gate hiện hành M3 OPEN / M4 LOCKED; M3 không tự mở content production.

## PO production handoff / claim — 2026-10-02

- Owner: Trúc; Executor: Codex hỗ trợ; Reviewer: Trúc historical/media + Thọ script, Vinh technical/media/accessibility, Dương PO/consumer.
- PO Dương chốt academic/educational non-commercial MVP, APPROVED ElevenLabs Free trong phạm vi này, nghiệm thu CONTENT-003 và explicit UNBLOCK CONTENT-007. CONTENT-004 authoring handoff (script/narration/VTT có verdict) được nhận làm đầu vào; final asset approval vẫn cần review riêng, không biến catalog optional thành approved.
- Status IN PROGRESS: production gate đã mở, đang chuẩn bị xuất. Media file chưa có; ElevenLabs hiện Sign In. Cần tài khoản đăng nhập hoặc bản xuất audio từ Trúc để tạo đúng voice ID 5g2DMFQF8xR0KmnuNr4U / Hoa / Eleven v4 / Vietnamese. Không yêu cầu API key trong chat.
- Scope: dựng mới bằng chữ/sơ đồ nguyên bản, không nhạc/SFX/ảnh optional; lời đọc không sửa, canonical video được gắn vào bài pilot sau QA. Title chứa elevenlabs.io; credit app/player; captions/transcript/fallback giữ cho accessibility/lỗi tải.
- Next action: xuất 9 cue audio theo gói dựng, kiểm tra phát âm/timing, render MP4/poster, manifest/hash; reviewer final acceptance rồi service→lesson integration. Không dùng mock URL hoặc file không tồn tại để giả video hoạt động.
- Handoff hiện hành: chưa có MP4/audio final; chuẩn bị package, không env/migration impact. Các ghi chú BLOCKED/rights pending cũ là snapshot được PO decision này thay thế; không đánh dấu DONE trước output/QA/integration.

## Checkpoint chuẩn bị xuất và kiểm tra UI — 2026-10-02

- Dương xác nhận chưa có file, yêu cầu chuẩn bị lời đọc/hướng dẫn để tự copy/export; tiếp đó xác nhận đã đăng nhập ở giọng Hoa và yêu cầu kiểm tra.
- UI ElevenLabs đã quan sát: Text to Speech, voice “Hoa - Smooth, Gentle and Poetic”, model “Eleven v4”, language override “Vietnamese”, output MP3 44.1 kHz (128kbps). Đúng cấu hình hiển thị; chưa đối chiếu voice ID từ tài khoản, chưa tạo/đọc audio. Không lưu account/secret.
- Đã tạo [hướng dẫn copy 9 đoạn](../../content/production/mt68-v1/COPY-VAO-ELEVENLABS.md), bản LOI-DOC.txt, 9 cue txt, cue-timing.json và scripts/content/build-mt68-video.py. Nguồn lời đọc đúng PILOT-NARRATION.json, không đổi authoring snapshot.
- Anh tự export theo yêu cầu mới; cần gửi 9 file audio. Script dựng kiểm tra input/timing, không cắt lời, xuất package in_review; yêu cầu ffmpeg/ffprobe, Pillow và font/license. Máy hiện không có ffmpeg trong PATH, chưa chạy render/build script hoặc tests.
- Chưa có MP4 để gắn canonical: bước service/lesson publication giữ pending; chưa sửa mock fixture 1972, chưa tạo URL giả hoặc đánh dấu media published. Không có runtime/env/migration changes.
