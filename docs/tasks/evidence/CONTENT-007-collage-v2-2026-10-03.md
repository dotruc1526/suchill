# CONTENT-007 — Collage v2 / 2026-10-03

## Yêu cầu và revision

- Trúc yêu cầu cinematic historical collage / 2D cut-out / vintage Vietnamese scrapbook, không presentation; dùng audio đã có làm timeline cố định.
- Nhánh codex/truc-content007-video; cập nhật draft PR112. Bản v1 110s giữ riêng, v2 là candidate hiện hành. Không đổi authoring snapshot, source verdict, milestone hoặc runtime.
- 9 input MP3 có hash đúng bộ đã nghiệm thu. Tổng PCM 63.0595918367347s; WAV có2,780,928 samples mono44.1kHz. Nối sample không atempo/apad/normalize/cắt lời.

## Visual/assets

- 3 backdrop collage city/logistics/research (built-in imagegen), 3 pose SỬu cùng reference repo (cheer gốc, thinking/pointing generatedalpha). Asset/prompt trong [ART-DIRECTION](../../content/production/mt68-v2/ART-DIRECTION.md).
- 9 sequences khoảng6.2–8s, camera push-in/pan, background vàforeground parallax riêng, reveal vật thể/keyword, reaction SỬu mỗi~2.4s ở sequences phù hợp; motion liên tục30fps.
- 33 subtitle ngắn, không khung phụ đề/card lớn; toàn bộ wording khớp narration. Timing theo pause + nội suy âm tiết; final listening/caption review pending.
- Label MINH HỌA HƯ CẤU trên video: SỬu không nhân chứng; icon kiến trúc chỉ biểu tượng, không map/reconstruction. Không ảnh tư liệu, nhạc/SFX.
- Source07 chỉ năm mục tiêu; source02 vẫn candidate. Không phát sinh historical facts mới trong voice.

## Output và kiểm tra

| File | SHA-256 |
|---|---|
| pilot-collage-master.mp4 | `3811a1c07e26ea3bc1ac41aa97dd81c2e7d938fd0767c475e5be6f2aaa7a0b7b` |
| pilot-collage-mobile.mp4 | `ec93193ca873fbe00b9c481697da3be90ccb35dc642020a4809554210db60d8e` |
| poster.png | `9fe877659bdab2c89480ff3425d74d389f720fcf39f64bd9dd06503065725052` |
| captions.vi.vtt | `a3bc449792b46deec140b6f1d82448843e1431989dec6d0bb9febe21011da0c5` |
| transcript.vi.txt | `1fbedab7288231d130f1b46c3b2cb750d7b34b656a40c2d0bc7a56658dab2d4a` |
| timeline.json | `9eba31600bffbcb4de0198920d68f2739a133904d8c8732a95dc893ec4ad2822` |

- Native render1080×1920/30fps, mobile720×1280/30fps, H.264/yuv420p + AAC. Decode2/2 toàn bộMP4 PASS, MP4faststart PASS.
- Video63.066667s, audio63.059592s; sai khác7ms do framegrid30fps, không padding âm thanh.
- Kiểm tra9 encodedframes: layout, chữ Việt, alpha SỬu, không card/box phụ đề lớn; không claim device playback qua screenshot.
- Kiểm tra33captionchunks nối lại nguyên văn9cue; kiểm traPCM từng input tạiđúngsampleoffset cóhashkhớp; không thêm hoặc mất sample.
- VoiceID do usercungcấp, UIlabelmodel/language đã quan sát; account IDverification vẫn chưa có, manifest ghi false.
- Không chạy test/build app: chỉscripts/render/assets/docs, khôngruntime/env/migrationchanges.

## Pending / handoff

- [Manifest](../../content/production/mt68-v2/render/manifest.json), [metadata lesson](../../content/production/mt68-v2/render/lesson-handoff.json), [media checks](../../content/production/mt68-v2/render/media-checks.json).
- Trúc APPROVED final video/editorial/illustration trên head `4c00692`; Thọ final script acceptance, Vinh nghe caption/device/media QA và Dương consumer/publication/integration còn pending. CONTENT-007 REVIEW, storageUrl=null, not_published.
- Lưu bản mới Desktop/mp3/video-mau-than-1968-v2, không ghi đè v1 hay9MP3 gốc.

## Final layout correction

- Đã dời SỬu sang góc dưới ở sequence năm mục tiêu để không che tên Dinh Độc Lập; render lại master/mobile và xem encoded frame36s. Hash trong bảng là bản cuối đã sửa.

## Trúc nghiệm thu bản video cuối — 2026-10-03

- Xác nhận trực tiếp trong chat: **“oke a duyệt video này nha”** sau khi xem bản v2 đã sửa layout. Verdict **APPROVED** trong phạm vi Trúc: bản dựng/hình ảnh/cách kể chuyện và minh họa lịch sử.
- Revision được xem: PR112 head `4c00692b401749e5260b282cc4dd9eef141ff2c4`, media `media.mt68.pilot.collage.v2`, 63.059592s.
- Mobile SHA-256: `ec93193ca873fbe00b9c481697da3be90ccb35dc642020a4809554210db60d8e`; master SHA-256: `3811a1c07e26ea3bc1ac41aa97dd81c2e7d938fd0767c475e5be6f2aaa7a0b7b`. Manifest ghi cả sáu hash artifact đi kèm. Hash của sáu file trong repo và bản Desktop khớp; không render lại hoặc sửa bytes media sau duyệt.
- Historical/illustration và final editorial review thuộc Trúc đã đạt. Còn Thọ xác nhận kịch bản bản cuối; Vinh nghe kiểm tra caption sync/phát trên thiết bị/media accessibility; Dương nhận consumer handoff và publication/integration. Phê duyệt trong chat không thay cho những kiểm tra này.
- CONTENT-007 giữ REVIEW theo acceptance card; package `in_review`, `not_published`, `storageUrl=null`. Academic non-commercial/credit elevenlabs.io giữ đúng quyết định PO.
- Changed files: card/board/index, evidence, art-direction, manifest/lesson-handoff metadata. Không runtime/env/migration changes; không chạy app tests/build vì chỉ ghi nghiệm thu, không sửa implementation. Next action: Thọ/Vinh hoàn tất phần review còn lại để Dương nhận tích hợp lesson-mt68-01-video.
