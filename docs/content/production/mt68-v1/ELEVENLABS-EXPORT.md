# Xuất audio pilot canonical — MVP học tập phi thương mại

PO Dương đã mở CONTENT-007 ngày 2026-10-02. Đây là gói chuẩn bị, chưa phải video/audio đã nghiệm thu.

## Cấu hình đã duyệt

ElevenLabs Free; Hoa - Smooth, Gentle and Poetic; voice ID `5g2DMFQF8xR0KmnuNr4U`; Eleven v4; Vietnamese. Kiểm tra UI đúng profile/model, không dùng Beta trong production. Không gửi hoặc lưu API key vào repo.

## Xuất lời đọc

Đăng nhập ElevenLabs, chọn cấu hình trên. Xuất riêng từng file txt p01a, p01b, p02a, p02b, p03a, p03b, p04a, p04b, p05 thành audio cùng tên mp3/wav/m4a. Không thêm lời/prompt vào narration, không sửa câu đã duyệt. Lưu ngày generation và ảnh evidence profile/model/plan không chứa secret. Nếu cue dài hơn slot, thu lại/đề xuất timing review, không cắt mất lời.

## Dựng

Script `scripts/content/build-mt68-video.py` yêu cầu Pillow, ffmpeg/ffprobe, font có quyền render và evidence license. Ví dụ từ repository root:

```sh
python3 scripts/content/build-mt68-video.py --audio-dir /absolute/path/audio --font /absolute/path/font.ttf --font-license 'link hoặc file evidence quyền font' --generation-date 2026-10-02
```

Mỗi cue có slide chữ nguyên bản 720×1280; không ảnh/nhạc/SFX. Script giữ lời/timing 110s, không cắt lời quá slot; tạo MP4 H.264/AAC, poster, VTT, transcript, manifest/hash ở thư mục render, trạng thái in_review. Title “Kế hoạch Giao Thừa — elevenlabs.io” và credit trên mọi slide đáp ứng domain trong title + credit app/player. Font/voice/model/audio timing phải được reviewer đối chiếu với export thực.

## Gắn vào bài học

Sau final acceptance: upload media package vào published-media theo storage policy; tạo MediaAsset cùng poster/caption/transcript refs và nguồn/attribution. Dùng video block `media.mt68.pilot.v1` trong lesson pilot và phiên bản nội dung mới qua content/media service; không sửa bất biến version đã publish, không gắn vào chapter fixture 1972. UI VideoLessonPlayer hiện có tự dùng resolved URL, poster và captions; fallback giữ cho lỗi tải/accessibility. Trước bước này cần asset thật, manifest accepted và định danh lesson/version canonical từ publication record. Không tạo URL giả để che lỗi thiếu media.
