# Pilot: Kế hoạch Giao Thừa — bản sửa authoring v2

> CONTENT-014 sửa theo review CONTENT-003/004; [task](../tasks/active/CONTENT-014.md).
> Lesson: `lesson-mt68-01-video`. Status: NEEDS_HISTORICAL_REVIEW.
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

## Phương án Text-first Fallback (Bản đọc thay thế Video)

Dành cho người học khi tài nguyên video MP4 chưa sẵn sàng (`CONTENT-007`) hoặc khi người học chọn chế độ đọc tóm tắt:

1. **Phân cảnh 1 — Bối cảnh chuyển hướng chiến lược (0–20s):**
   Cuối tháng 1 năm 1968, các đợt tiến công nổ ra đồng loạt tại nhiều đô thị trọng điểm ở miền Nam. Đây là bước ngoặt bất ngờ, đưa chiến sự vào tận sào huyệt của đối phương. *(Nguồn: `SRC-MT68-01` / Phân loại: `verified_fact`)*
2. **Phân cảnh 2 — Căn hầm bí mật và sự chuẩn bị công phu (20–45s):**
   Cơ sở hầm chứa bí mật tại số 287/70 đường Trần Quý Cáp (nay là đường Võ Văn Tần) do chiến sĩ biệt động Trần Văn Lai xây dựng đã cất giấu gần 2 tấn vũ khí, là điểm tiếp nhận vũ khí bí mật cho Đội 5 Biệt động trước giờ xuất kích. *(Nguồn: `SRC-MT68-05` / Phân loại: `verified_fact`)*
3. **Phân cảnh 3 — 5 Mục tiêu đầu não chiến lược tại Sài Gòn (45–70s):**
   Tại Sài Gòn, các mũi tiến công của Biệt động đồng loạt giáng đòn vào 5 mục tiêu trọng yếu: Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh Sài Gòn, Bộ Tổng Tham mưu và Bộ Tư lệnh Hải quân. *(Nguồn: `SRC-MT68-02` / Phân loại: `verified_fact`)*
4. **Phân cảnh 4 — Tinh thần chiến đấu và ranh giới cứ liệu (70–100s):**
   Mỗi trận đánh diễn ra ác liệt. Đội 11 Biệt động tiến công vào khuôn viên Tòa Đại sứ Mỹ; không đồng nhất việc tiến công khuôn viên với việc chiếm tòa nhà chính. Đội 5 Biệt động chiến đấu tại Dinh Độc Lập khi bộc phá mở cổng không nổ. *(Nguồn: `SRC-MT68-03` / Phân loại: `fact candidate; NEEDS_HISTORICAL_REVIEW`)*
5. **Phân cảnh 5 — Ý nghĩa bước ngoặt và định hướng bài học tiếp theo (100–110s):**
   Đòn bất ngờ Mậu Thân 1968 đã làm rung chuyển chính giới Mỹ, mở ra cục diện vừa đánh vừa đàm tại Hội nghị Paris. Người học tiếp tục chuyển sang Bài 2 để nghiên cứu sâu từng mục tiêu qua lăng kính tư liệu lịch sử. *(Nguồn: `SRC-MT68-01` / Phân loại: `educational_explanation`)*

## Acceptance hiện hành

- [x] Đủ năm scene, cue cuối 110s, lời đọc và VTT đồng nhất.
- [x] Loại khỏi bản nháp các claim về hiệu lệnh thơ, nguyên nhân lịch pháp, giờ Đại sứ quán chính xác chưa đối chiếu và vật liệu nắp hầm.
- [x] Có source cho lời dẫn fact và phương án visual/fallback text-first hoàn chỉnh.
- [ ] Trúc xác nhận historical/learning review bản v2.
- [ ] Có audio hợp lệ và đo timing, poster/MP4 cuối, manifest/hash, phụ đề đồng bộ bản xuất.
- [ ] Media/mobile/accessibility QA đạt trước khi mở sản xuất/tích hợp chính thức.

Chi tiết quyền và giới hạn: [MEDIA-REVIEW-MT68.md](./MEDIA-REVIEW-MT68.md).
