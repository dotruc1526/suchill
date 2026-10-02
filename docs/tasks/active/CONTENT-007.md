# CONTENT-007 — Video theo kịch bản cho bài học MVP

> Status: REVIEW\
> Last updated: 2026-10-03

## Assignment

- Phase / milestone: MVP content track; tích hợp M6–M7
- Workstream: UI/UX Figma + video production, phối hợp Product + Content
- Accountable owner: Trúc (Member 2)
- Executor type: Human team
- Executor name: Trúc; Codex hỗ trợ sản xuất theo yêu cầu PO Dương
- Reviewer: Thọ/Product owner + historical reviewer; Vinh kiểm tra media/accessibility
- Codex task/thread: chat hiện hành, PO Dương giao sản xuất và tích hợp
- Branch: codex/truc-content007-video
- Started: 2026-10-02; BLOCKED → READY theo PO → IN PROGRESS/claim
- Depends on: CONTENT-003 (pilot source/media review), CONTENT-004 (kịch bản/storyboard video), DOC-004 (`DONE`)

## Scope

- In scope: biên tập ít nhất một video theo kịch bản/nguồn đã duyệt để đặt trong một lesson của chapter mẫu MVP; chuẩn bị poster, phụ đề tiếng Việt, transcript, fallback và bản xuất phù hợp mobile.
- Out of scope: tự viết lại fact lịch sử, tự duyệt nguồn/license, xây video player hoặc tự publish nội dung; `episode-portrait-final.mp4` của CONTENT-006 vẫn là reference riêng, không mặc định dùng làm video MVP.
- Files claimed: card/board/index, docs/content/production/mt68-v1/, scripts/content/build-mt68-video.py; media/production notes và evidence closeout CONTENT-003. UI/service integration files sẽ được claim cụ thể sau khi có media output thật; PO Dương đã giao integration trong yêu cầu này.
- Shared-contract consumers: Member 4/FE-006, media service/Member 5, CONTENT-005, QA-004, QA-005. FE-006 và QA-005 chịu trách nhiệm kiểm tra tích hợp sau handoff.

## Acceptance criteria

- [x] Member 1 bàn giao kịch bản/storyboard, mục tiêu học, vị trí video trong lesson và danh sách nguồn; historical reviewer xác nhận claims/media đủ điều kiện sản xuất.
- [x] Member 2 bàn giao ít nhất một video đúng kịch bản, có bản xuất mobile và poster; không dùng ảnh/âm thanh/tư liệu thiếu quyền hoặc sai bối cảnh.
- [ ] Có phụ đề tiếng Việt đồng bộ, transcript, attribution/license, mô tả thay thế và fallback khi video không tải.
- [x] Member 1 và historical reviewer duyệt bản cuối; thay đổi fact/media sau duyệt phải review lại (Trúc APPROVED 2026-10-03; Thọ SCRIPT APPROVED 2026-10-03).
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

## Claim dựng bản video — 2026-10-03

- Main đã kiểm tra: b9a0f0d; PR111 MERGED. Owner Trúc, Executor Codex, Reviewer Trúc/Thọ (bản cuối), Vinh (media/accessibility), Dương (PO).
- Anh đã nghe và xác nhận “audio đạt, dựng video tiếp”; 9/9 MP3 trên Desktop/mp3 là input được nghiệm thu trong chat này.
- Files claimed bổ sung: scripts/content/mt68_video_art.py; docs/tasks/evidence/CONTENT-007-video-2026-10-03.md; production/mt68-v1/render package. Không đổi narration/story/source snapshot.
- Next action: dựng đồ họa chữ/sơ đồ cho 5 scene, 110 giây, phụ đề/poster/transcript/manifest; kiểm tra layout và metadata. Bản video cuối chuyển REVIEW để người phụ trách duyệt trước publication/integration.

## Bản dựng hoàn tất / handoff REVIEW — 2026-10-03

- Có master 1080×1920 và mobile 720×1280, 110 giây, poster, captions.vi.vtt, transcript, manifest/hash, lesson-handoff.json và media-checks.json. Chữ lời đọc hiện trực tiếp trên video, credit ElevenLabs trên mọi card/title.
- [Evidence bản dựng](../evidence/CONTENT-007-video-2026-10-03.md). Audio 9/9 đã được user nghiệm thu; decode 2/2 MP4 PASS; 9 layout đã xem. Caption sync cuối/device playback và final editorial acceptance còn pending.
- Changed files: scripts/content/build-mt68-video.py, mt68_video_art.py, production/mt68-v1/render final assets/metadata; task card/board/index/evidence. Không đổi authoring snapshots, runtime, env hoặc migration.
- Status REVIEW: Trúc/Thọ review bản video cuối, Vinh media/accessibility QA, Dương nhận. Metadata target lesson-mt68-01-video đã chuẩn bị, chưa publish/storage URL; service/lesson integration tiến hành sau final asset acceptance theo card.
- Những đoạn “chưa có audio/MP4” và “BLOCKED” ở checkpoint cũ là lịch sử; trạng thái hiện hành theo checkpoint này.

## Revision v2 theo feedback Trúc — 2026-10-03

- User yêu cầu thay bản chữ bằng cinematic historical collage / 2D cut-out / vintage Vietnamese scrapbook, SỬu nhất quán, hình phần lớn màn hình, subtitle nhỏ và motion mỗi 1.5–3s.
- Audio timeline cố định từ 9 MP3 đã nghiệm thu: ghép nối nguyên tốc độ, không padding/chậm tiếng chờ hình. Thời lượng v2 đo từ audio, thay lịch 110s của bản v1 theo yêu cầu mới này; không sửa lời bình/narration authoring.
- Owner Trúc; Executor Codex; Reviewer Trúc/Thọ, Vinh media/accessibility và Dương PO. Branch codex/truc-content007-video; status IN PROGRESS (revision từ REVIEW).
- Files claimed bổ sung: scripts/content/mt68_collage*.py, docs/content/production/mt68-v2/ (assets/prompt/timeline/render/manifest/evidence). Asset SỬu dùng reference có sẵn trong repo; không sửa mascot runtime.
- Next action: tạo minh họa collage phân lớp, dựng chuyển động theo audio, captions ngắn, master/mobile; nghiệm thu bản render mới. Không tự publication/integration trước final acceptance.

## Handoff v2 collage — 2026-10-03

- Candidate hiện hành là v2: 63.059592s theo 9 audio đã duyệt, không kéo chậm/padding; master1080×1920 và mobile720×1280 đều30fps. Bản typography110s v1 giữ làm revision trước.
- Có 3 collage backdrop/3 pose SỬu, foreground object/parallax/camera motion, 33 caption ngắn, poster/transcript/manifest/timeline/lesson-handoff. [Evidence v2](../evidence/CONTENT-007-collage-v2-2026-10-03.md).
- Decode2/2MP4 PASS, hashPCMinput khớp9/9 và không thêm sample; đã xem9encodedframes. Final caption listening/device/illustration/editorial review còn pending.
- Changed files: scripts/content/build-mt68-collage.py, mt68_collage_frames.py/props.py/timeline.py; production/mt68-v2/; card/board/index/evidence. Không runtime/env/migration changes; không app tests/build vì chỉ media production.
- Status REVIEW: Trúc/Thọ/Vinh/Dương review bản cụ thể; gắn service/lesson sau final acceptance, chưa published.

- Layout recheck v2: dời SỬu khỏi nhãn mục tiêu, render lại hai MP4, recheck encoded frame36s; evidence/hash được cập nhật theo output cuối.

## Trúc nghiệm thu bản video cuối — 2026-10-03

- Xác nhận trực tiếp trong chat: **“oke a duyệt video này nha”** sau khi xem bản v2 đã sửa layout. Verdict **APPROVED** trong phạm vi Trúc: bản dựng/hình ảnh/cách kể chuyện và minh họa lịch sử.
- Revision được xem: PR112 head `4c00692b401749e5260b282cc4dd9eef141ff2c4`, media `media.mt68.pilot.collage.v2`, 63.059592s.
- Mobile SHA-256: `ec93193ca873fbe00b9c481697da3be90ccb35dc642020a4809554210db60d8e`; master SHA-256: `3811a1c07e26ea3bc1ac41aa97dd81c2e7d938fd0767c475e5be6f2aaa7a0b7b`. Manifest ghi cả sáu hash artifact đi kèm. Hash của sáu file trong repo và bản Desktop khớp; không render lại hoặc sửa bytes media sau duyệt.
- Historical/illustration và final editorial review thuộc Trúc đã đạt. Còn Thọ xác nhận kịch bản bản cuối; Vinh nghe kiểm tra caption sync/phát trên thiết bị/media accessibility; Dương nhận consumer handoff và publication/integration. Phê duyệt trong chat không thay cho những kiểm tra này.
- CONTENT-007 giữ REVIEW theo acceptance card; package `in_review`, `not_published`, `storageUrl=null`. Academic non-commercial/credit elevenlabs.io giữ đúng quyết định PO.
- Changed files: card/board/index, evidence, art-direction, manifest/lesson-handoff metadata. Không runtime/env/migration changes; không chạy app tests/build vì chỉ ghi nghiệm thu, không sửa implementation. Next action: Thọ/Vinh hoàn tất phần review còn lại để Dương nhận tích hợp lesson-mt68-01-video.

## Thọ (Member 1) xác nhận kịch bản bản video v2 — 2026-10-03

- Thọ (Tác giả kịch bản / Content Lead) đã đối chiếu toàn bộ lời đọc trong video v2 (63s) với kịch bản gốc và `PILOT-NARRATION.json`.
- Kết quả: 9/9 phân đoạn lời đọc khớp nguyên văn kịch bản, giọng đọc rõ ràng, giữ trọn vẹn ngữ nghĩa lịch sử và mục tiêu sư phạm của bài học.
- Verdict: **SCRIPT APPROVED**.
- Bản đối chiếu hash-bound: Master `3811a1c07e26ea3bc1ac41aa97dd81c2e7d938fd0767c475e5be6f2aaa7a0b7b`, Mobile `ec93193ca873fbe00b9c481697da3be90ccb35dc642020a4809554210db60d8e`.
- Next action: Vinh kiểm tra phụ đề/phát trên điện thoại/media accessibility; Dương nhận consumer handoff để gắn vào bài học.
