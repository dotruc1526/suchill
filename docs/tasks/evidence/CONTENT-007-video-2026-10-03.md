# CONTENT-007 — Video Mậu Thân 1968 / 2026-10-03

## Input và nghiệm thu audio

- Main baseline b9a0f0d; PR111 MERGED. Branch codex/truc-content007-video.
- Trúc/user xác nhận “audio đạt, dựng video tiếp cho a đi” sau khi nghe 9 file Desktop/mp3. Quyết định áp dụng đúng 9 hash audio trong manifest.
- UI đã quan sát Hoa - Smooth, Gentle and Poetic / Eleven v4 / Vietnamese / MP3 44.1 kHz,128 kbps. Voice ID do user cung cấp; chưa đối chiếu voice ID trong account, manifest ghi rõ audioIdentityVerified=false.
- Narration SHA-256: b9e7d17f8503796621e6624785628585477dc9e34633e4224e6b484eefc137ed; không thay authoring snapshot.
- Registry SHA-256: 369205fcbd713a74acaa0149e6c21d2c3734260d4265e7b8f87edd5868e3bba5; source verdict tại CONTENT-003. p03a/p03b dùng nguồn 07 trong đúng phạm vi danh sách, nguồn 02 vẫn candidate.

## Bản dựng

- 5 scene / 9 cue, đúng lịch 0–110 giây; H.264 24 fps/yuv420p, AAC mono 48kHz. Giữ tốc độ lời đọc, padding thời gian còn lại để đọc đồ họa.
- Đồ họa chữ/sơ đồ nguyên bản, không ảnh tư liệu/nhạc/SFX. 9 layout đã xem; sửa glyph ≠ bị thiếu bằng hình học rồi render lại.
- Chữ lời đọc hiện trực tiếp trên hình; VTT dùng nguyên văn 9 cue, bắt đầu đúng lịch scene và kết thúc theo thời lượng MP3 đã đo. Chưa xác nhận đồng bộ từng từ/device playback.
- Title MP4 chứa elevenlabs.io; credit ElevenLabs trên mọi card; scope đồ án phi thương mại theo PO acceptance đã ghi.
- Font: Google Noto, SIL OFL 1.1, license trong bundled LibreOffice Resources/LICENSE:1996–2004; hash font ở manifest.

## File/hash và kiểm tra media

| File | SHA-256 |
|---|---|
| pilot-mobile.mp4 | `ede2c81cadc9a96f2853247078cb089df0ff05659b72bd61efbb1d3ba96749e2` |
| pilot-master.mp4 | `97ca967b7ee9f85ff1d726ad0070acbfb5021026e476846042be2b1ce40a4025` |
| poster.png | `2d2357b1f905ead4a641bd21ca4240d6365472716aee94029a19844a0ab7e322` |
| captions.vi.vtt | `d80f4a2ba0494390ead807d5cdf5c6a907fd7319f2191cd3d135121981dc1912` |
| transcript.vi.txt | `3f2c32d047026a19235f10a9aab60cc4db79d9e7591dae9c65bdbcda6f49ac84` |

- Decode toàn bộ hai MP4 bằng ffmpeg: PASS; metadata/duration: media-checks.json.
- Master: 1080×1920, 2335443 bytes; mobile:720×1280, 1849398 bytes. Video stream 110.000s; container110.021/110.042s do AAC padding/frame rounding.
- Copy 9 deliverables sang Desktop/mp3/video-mau-than-1968; hash đối chiếu khớp. Audio gốc Desktop/mp3 giữ nguyên.
- Không chạy test/build app: scope production scripts/media, chưa đổi runtime; chưa tuyên bố integration QA. FFmpeg9.0.2 cài qua Homebrew để render.

## Handoff và phần pending

- Package: [render](../../content/production/mt68-v1/render/manifest.json), [lesson metadata](../../content/production/mt68-v1/render/lesson-handoff.json).
- Target lesson lesson-mt68-01-video; poster/alt/VTT/transcript/fallback/title/credit đã có. storageUrl=null, publicationStatus=not_published.
- Trúc/Thọ nghiệm thu video bản cuối; Vinh caption/device/media QA; Dương nhận publication/integration qua media service sau acceptance. Không thay fixture 1972 hoặc đưa file in_review thành published.
- CONTENT-007 REVIEW, chưa DONE. Chưa có env/migration/runtime changes. Quiz/source book/media optional giữ trạng thái riêng.
