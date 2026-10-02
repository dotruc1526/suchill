# Pilot: Kế hoạch Giao Thừa — bản sửa authoring v2

> CONTENT-014 sửa theo review CONTENT-003/004; [task](../tasks/active/CONTENT-014.md).
> Lesson: `lesson-mt68-01-video`. Historical/language review: APPROVED_BY_HISTORICAL_REVIEWER (CONTENT-004; exact reviewed revision recorded in CONTENT-014). Authoring remains draft; not production-approved.
> Tên tập là nhan đề biên tập, không khẳng định mọi nơi nổ súng đúng giao thừa.
> Chưa thu âm, chưa xuất MP4; CONTENT-007 vẫn BLOCKED.

## Mục tiêu và nguồn chữ duy nhất

CLO-1: nhận diện bối cảnh tiến công đô thị; CLO-3: phân biệt vai trò hậu cần với kết quả tác chiến.
Lời đọc đầy đủ nằm trong [PILOT-NARRATION.json](./PILOT-NARRATION.json), theo thứ tự cue; đây cũng là transcript văn bản của bản nháp.
[PILOT-CAPTIONS.vtt](./PILOT-CAPTIONS.vtt) dùng đúng lời này. Khi thay câu phải cập nhật cả hai, không dùng transcript/VTT của bản cũ.

## Storyboard 110 giây

| Scene / thời gian | Objective / cue | Visual và thông tin tương đương bằng chữ | Source / classification | Âm thanh |
|---|---|---|---|---|
| SCENE-01 / 0–20s | CLO-1; p01a/p01b | Tiêu đề + thẻ bối cảnh cuối tháng 1; không dựng bản đồ địa lý chưa xác minh | SRC-MT68-01; fact candidate + educational_explanation | Lời đọc bản nháp, không nhạc/SFX |
| SCENE-02 / 20–45s | CLO-3; p02a/p02b | Sơ đồ chữ “cơ sở → nhận vũ khí → xuất kích”, nhãn DIỄN GIẢI GIÁO DỤC; không tái dựng vật liệu nắp hầm | SRC-MT68-05; fact candidate + educational_explanation | Lời đọc |
| SCENE-03 / 45–70s | CLO-1; p03a/p03b | Năm thẻ tên mục tiêu, xuất hiện tuần tự; không vị trí/tỉ lệ địa lý | SRC-MT68-02; fact candidate | Lời đọc; không dùng bản ghi thơ |
| SCENE-04 / 70–100s | Nhận diện ngộ nhận; p04a/p04b | Hai thẻ “khuôn viên ≠ toàn bộ tòa nhà” và “bộc phá không nổ”; không ảnh chiến đấu giả | SRC-MT68-03/04; fact candidate | Lời đọc; không tiếng nổ |
| SCENE-05 / 100–110s | Chuyển tới CLO-2; p05 | Nhắc cách đọc nguồn, nút Bài 2; chữ CTA đọc trong p05, không thêm cue sau 110s | educational_explanation; không thêm fact | Lời đọc |

Nhân vật: narrator ngoài bối cảnh, không đóng vai nhân chứng; không bịa thoại nhân vật lịch sử.
Fact candidate là ghi chú authoring đang chờ review, không phải giá trị enum gửi runtime.

## Sản xuất và accessibility

- Dọc 9:16; mục tiêu 1080×1920, H.264/AAC nếu có audio. Không ghi rằng rendition đã tồn tại.
- Visual mặc định là chữ/sơ đồ do nhóm tạo; không dùng ảnh stock, ảnh di tích hiện đại như ảnh trận đánh, clip CBS, bản ghi thơ hoặc audio Edge TTS chưa rõ quyền.
- Narration dự kiến thu mới bởi người có quyền cho phép sử dụng giọng, hoặc dịch vụ TTS với bằng chứng điều khoản áp dụng cho tài khoản/gói sử dụng. Chưa chọn/chi tiền dịch vụ.
- Nhạc/SFX: không dùng trong bản này; không phát sinh dependency giấy phép nhạc.
- Timing cue là lịch dự kiến, chưa phải đo âm thanh. Trúc đọc thử từng cue, nếu vượt thì sửa câu/thời gian và tạo lại VTT, không ép tốc độ để đạt 110s.
- VTT bản nháp có câu đầy đủ; ở khâu dựng cần wrap theo font/viewport và đo tốc độ đọc, không suy ra accessibility đạt chỉ từ timestamp.
- Fallback: hiển thị từng `text` trong narration JSON theo thứ tự, kèm source link; toàn bộ thông tin quan trọng của visual đã được lời đọc mô tả.
- Poster cần xuất mới: nền đơn sắc/token thương hiệu, tiêu đề và “Mậu Thân 1968 — đọc nguồn”; không ảnh tư liệu. Alt dự kiến: “Kế hoạch Giao Thừa, bài dẫn nhập về tư liệu Mậu Thân 1968.”
- Chưa xuất poster/audio/video; metadata/hash/dung lượng/mobile QA chỉ điền khi có file thật.

## Acceptance hiện hành

- [x] Đủ năm scene, cue cuối 110s, lời đọc và VTT đồng nhất.
- [x] Loại khỏi bản nháp các claim về hiệu lệnh thơ, nguyên nhân lịch pháp, giờ Đại sứ quán chính xác chưa đối chiếu và vật liệu nắp hầm.
- [x] Có source cho lời dẫn fact và phương án visual/fallback.
- [ ] Trúc xác nhận historical/learning review bản v2.
- [ ] Có audio hợp lệ và đo timing, poster/MP4 cuối, manifest/hash, phụ đề đồng bộ bản xuất.
- [ ] Media/mobile/accessibility QA đạt trước khi mở sản xuất/tích hợp chính thức.

Chi tiết quyền và giới hạn: [MEDIA-REVIEW-MT68.md](./MEDIA-REVIEW-MT68.md).
