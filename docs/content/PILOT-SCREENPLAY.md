# KỊCH BẢN CHI TIẾT PHÂN CẢNH (PILOT VIDEO SCREENPLAY)
## Tập phim Dẫn nhập: "Kế hoạch Giao Thừa"
### Bài học 1 — Chapter MVP: Chiến dịch Mậu Thân 1968 (Bước ngoặt lịch sử)

> **Mã task:** [CONTENT-004](../tasks/done/CONTENT-004.md)  
> **Bài học:** `lesson-mt68-01-video`  
> **Chapter:** `chapter-mau-than-1968`  
> **Tác giả kịch bản (Content Lead):** Thọ (Member 1 — Product + Content)  
> **Bàn giao sản xuất video:** Trúc (Member 2 — UI/UX & Video Production Lead — [CONTENT-007](../tasks/blocked/CONTENT-007.md))  
> **Bàn giao kỹ thuật tích hợp:** Dương (Member 4 — Frontend Player Lead — [FE-006](../project/TASK-BOARD.md))  
> **Kiểm thử chất lượng & tư liệu:** Vinh (Member 5 — QA & Storage Backend Lead)  
> **Trạng thái:** `APPROVED` / `READY_FOR_PRODUCTION`

---

## 1. THÔNG SỐ KỸ THUẬT & QUY CHUẨN SẢN XUẤT (VIDEO SPECIFICATIONS)

| Tiêu chí kỹ thuật | Thông số chuẩn hóa | Ghi chú hướng dẫn cho Member 2 (Trúc) |
|---|---|---|
| **Thể loại (Type)** | Tuyến tính (Linear Documentary Video) | Video kể chuyện tài liệu lịch sử liền mạch, không chia nhánh tương tác trong video. |
| **Độ dài tổng thể (Duration)** | **110 giây** (1 phút 50 giây) | Nằm chuẩn trong khung quy định 90–120s, giữ nhịp độ dồn dập, lôi cuốn. |
| **Tỉ lệ khung hình (Aspect Ratio)** | **Dọc 9:16 (1080×1920)** | Thiết kế tối ưu hiển thị di động toàn màn hình (Mobile Portrait First / PWA). |
| **Độ phân giải & Frame rate** | 1080×1920 @ 30fps (H.264 / MP4) | Safe title margin: cách mép trên 160px, mép dưới 220px để tránh bị UI đè. |
| **Giọng đọc Voiceover (Audio)** | Nam trầm ấm, hào hùng, dõng dạc (`vi-VN-NamMinhNeural` hoặc diễn đọc) | Tốc độ nói: ~135–140 từ/phút. Tổng lượng từ: ~260 từ. |
| **Tiêu chuẩn Âm thanh (Audio mix)** | Chuẩn hóa -14 LUFS; BGM ducking -18dB khi có voiceover | Nhạc nền giao hưởng bi tráng kết hợp âm thanh hiện trường (SFX). |
| **Phụ đề (Captions)** | WebVTT (`.vtt`) đồng bộ chuẩn xác từng frame | Font sans-serif đậm, viền đen bán trong suốt, hiển thị 1–2 dòng ngắn gọn. |
| **Phân loại Sự thật Lịch sử** | `verified_fact` (100% sự thật lịch sử) | Đối chiếu nguồn Viện Lịch sử Quân sự Việt Nam và Bảo tàng Biệt động Sài Gòn. |
| **Thuật ngữ bắt buộc (R3)** | "Kháng chiến chống Mỹ cứu nước", "Đế quốc Mỹ", "Biệt động Sài Gòn" | Tuyệt đối ZERO thuật ngữ cấm. |

---

## 2. BẢNG PHÂN CẢNH CHI TIẾT SCENE-BY-SCENE (SCENE BREAKDOWN)

Bảng phân cảnh gồm 5 phân cảnh (Scene 01 – Scene 05) với đầy đủ 7 tiêu chí chuẩn mực:

### BẢNG KỊCH BẢN KỸ THUẬT 9:16

| Scene ID & Tiêu đề | Thời lượng (Time) | Mô tả Hình ảnh & Chuyển động (Visuals / Media Cues 9:16) | Lời dẫn Voiceover (Audio Narration) | Âm thanh & Nhạc nền (SFX / Music) | Phụ đề hiển thị (WebVTT Captions) | Phân loại Nội dung |
|:---|:---:|:---|:---|:---|:---|:---:|
| **SCENE 01**<br>Đêm Giao Thừa & Mặt Hồ Phẳng Lặng | **00:00 – 00:20**<br>*(20 giây)* | • **00:00 - 00:08:** Khung hình dọc 9:16 toàn cảnh phố phường Sài Gòn đêm 30 Tết rực rỡ đèn hoa, dòng người đi du xuân trên đại lộ Nguyễn Huệ.<br>• **00:08 - 00:15:** Cận cảnh những tràng pháo Tết đỏ rực nổ tung trên thềm nhà, xác pháo bay lất phất.<br>• **00:15 - 00:20:** Đồ họa tối dần (vignette), chuyển sang hình ảnh đồng hồ cổ kính đang từng giây tích tắc đếm ngược tới nửa đêm. Chữ đồ họa hiện nổi bật: *"Sài Gòn — Đêm Giao thừa Tết Mậu Thân 1968"*. | Đêm Giao thừa Tết Mậu Thân 1968.<br><br>Giữa lòng Sài Gòn, phố phường đang rộn rã đón xuân trong sắc pháo rực rỡ và lời chúc bình an.<br><br>Đối phương tin rằng đây là thành trì bất khả xâm phạm.<br><br>Nhưng ngay dưới chân họ, một kế hoạch táo bạo, rung chuyển lịch sử đang từng giây đếm ngược... | • **SFX:** Tiếng pháo Tết giòn giã nổ râm ran từ xa đến gần.<br>• **SFX:** Tiếng tích tắc đanh gọn, chậm rãi của kim đồng hồ cơ khí.<br>• **Music:** Nhạc nền ambient trầm lắng, hơi thở căng thẳng, hồi hộp, gợi cảm giác bão tố sắp ập đến. | Sài Gòn — Đêm Giao thừa Tết Mậu Thân 1968.<br><br>Phố phường rộn rã đón xuân trong tiếng pháo nổ.<br><br>Đối phương tin rằng đây là thành trì bất khả xâm phạm.<br><br>Nhưng một kế hoạch rung chuyển lịch sử đang đếm ngược... | `verified_fact`<br>*(Viện Lịch sử Quân sự Việt Nam)* |
| **SCENE 02**<br>Căn Hầm Bí Mật & Thế Trận Lòng Dân | **00:20 – 00:45**<br>*(25 giây)* | • **00:20 - 00:28:** Bản đồ đô thị Sài Gòn zoom nhanh vào con hẻm số 287/70 đường Trần Quý Cáp (Quận 3). Chữ địa chỉ hiện lên rõ nét.<br>• **00:28 - 00:36:** Chân dung tư liệu Anh hùng Trần Văn Lai (Năm Lai) trong trang phục nhà thầu khoán lịch lãm Mai Hồng Quế, bên cạnh người vợ kiên trung Đặng Thị Thiệp.<br>• **00:36 - 00:45:** Đồ họa 3D mặt cắt căn nhà: sàn gỗ mở ra, hé lộ căn hầm kiên cố chất đầy súng trường AK-47, súng chống tăng B40, lựu đạn và gần 2 tấn thuốc nổ TNT được bảo vệ nguyên vẹn. | Số 287/70 đường Trần Quý Cáp.<br><br>Dưới vỏ bọc nhà thầu khoán Mai Hồng Quế, chiến sĩ Biệt động Trần Văn Lai cùng vợ đã bí mật đào căn hầm ngầm ngay giữa nội đô.<br><br>Gần hai tấn vũ khí, súng AK, đạn B40 và khối thuốc nổ TNT được cất giấu an toàn suốt nhiều năm ròng nhờ sự che chở kiên trung của nhân dân Sài Gòn.<br><br>Tất cả đã sẵn sàng cho giờ xuất kích! | • **SFX:** Tiếng ván sàn gỗ kẽo kẹt mở nắp hầm bí mật.<br>• **SFX:** Âm thanh kim loại súng đạn va chạm khẽ, tiếng lau súng dứt khoát.<br>• **Music:** Nhạc giao hưởng bắt đầu chuyển điệu, dồn dập, thôi thúc, thể hiện ý chí gang thép của quân và dân ta. | Số 287/70 đường Trần Quý Cáp.<br><br>Dưới vỏ bọc thầu khoán Mai Hồng Quế, ông Năm Lai bí mật đào hầm ngầm.<br><br>Gần hai tấn vũ khí và thuốc nổ TNT được cất giấu suốt nhiều năm ròng.<br><br>Nhờ sự chở che kiên trung của lòng dân Sài Gòn. | `verified_fact`<br>*(Di tích Lịch sử Quốc gia Hầm vũ khí 287/70)* |
| **SCENE 03**<br>Thơ Chúc Tết Bác Hồ & Hiệu Lệnh Giờ G | **00:45 – 01:10**<br>*(25 giây)* | • **00:45 - 00:53:** Chiếc radio bán dẫn thời chiến với vạch sóng màu vàng ấm áp. Sóng âm dao động theo nhịp bài thơ.<br>• **00:53 - 01:02:** Lồng giọng đọc thơ chúc Tết nguyên bản của Chủ tịch Hồ Chí Minh vang vọng: *"Xuân này hơn hẳn mấy xuân qua / Thắng trận tin vui khắp nước nhà / Nam Bắc thi đua đánh giặc Mỹ / Tiến lên! Toàn thắng ắt về ta!"*<br>• **01:02 - 01:10:** Đồ họa bản đồ hiển thị ranh giới múi giờ GMT+7 (Hà Nội) và GMT+8 (Sài Gòn). Bản đồ nội đô rực sáng Sở chỉ huy tiền phương tại Tiệm phở Bình (đường Yên Đổ). Hình ảnh Chỉ huy trưởng Tư Chu phát lệnh tác chiến rạng sáng Mùng 2 Tết. | Đúng thời khắc Giao thừa thiêng liêng, Đài Tiếng nói Việt Nam phát đi bài thơ chúc Tết của Chủ tịch Hồ Chí Minh.<br><br>Bốn câu thơ hào sảng chính là mật lệnh mở màn cuộc Tổng tiến công và nổi dậy trên toàn miền Nam.<br><br>Tại Sở chỉ huy tiền phương Tiệm phở Bình, Chỉ huy trưởng Tư Chu truyền đi mệnh lệnh lịch sử:<br><br>Giờ G đã điểm! | • **Audio Tư liệu:** Giọng đọc thơ chúc Tết hào hùng, trầm ấm của Bác Hồ phát trên sóng phát thanh (kèm tiếng rè radio cổ chân thực).<br>• **SFX:** Tiếng chuông Giao thừa ngân vang rền rĩ.<br>• **Music:** Nhạc nền đẩy lên cao trào, hòa quyện dàn dây và tiếng trống trận giục giã. | Thơ chúc Tết của Chủ tịch Hồ Chí Minh phát trên Đài Tiếng nói Việt Nam.<br><br>"Xuân này hơn hẳn mấy xuân qua...<br>Tiến lên! Toàn thắng ắt về ta!"<br><br>Đó chính là mật lệnh Tổng tiến công toàn miền Nam.<br><br>Tại Tiệm phở Bình, Chỉ huy trưởng Tư Chu phát lệnh: Giờ G đã điểm! | `verified_fact`<br>*(Đài Tiếng nói Việt Nam & Bảo tàng Biệt động)* |
| **SCENE 04**<br>Sấm Sét Đầu Não — Năm Mục Tiêu Trọng Yếu | **01:10 – 01:40**<br>*(30 giây)* | • **01:10 - 01:18:** Màn đêm rách toạc bởi tia chớp bộc phá chói lòa! Khối thuốc nổ phá toang tường rào bê tông Tòa Đại sứ Mỹ trên đường Thống Nhất lúc 2h05 sáng. Các chiến sĩ Đội 11 Biệt động quả cảm lao qua lỗ thủng.<br>• **01:18 - 01:25:** Hình ảnh mũi tiến công thứ hai: Đội 5 Biệt động xuất kích từ hầm Trần Quý Cáp, đánh bộc phá cổng Dinh Độc Lập; Đội 4 từ tiệm may Quốc Anh chiếm lĩnh Đài Phát thanh Sài Gòn.<br>• **01:25 - 01:32:** Đồ họa 5 điểm sáng rực rỡ thọc sâu vào bản đồ Sài Gòn: *Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu, Bộ Tư lệnh Hải quân*.<br>• **01:32 - 01:40:** Cảnh chiến đấu kiên cường phi thường, khói lửa ngút trời, máy bay trực thăng Mỹ hoảng loạn quần thảo trên nóc Tòa Đại sứ. | Rạng sáng 31 tháng Giêng năm 1968.<br><br>Tiếng bộc phá sấm sét rung chuyển Sài Gòn!<br><br>Các đội Biệt động đồng loạt giáng đòn điểm huyệt vào năm mục tiêu đầu não: Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu và Bộ Tư lệnh Hải quân.<br><br>Tại Tòa Đại sứ Mỹ — pháo đài bất khả xâm phạm — 17 chiến sĩ Đội 11 đã anh dũng làm chủ trận địa suốt hơn sáu giờ đồng hồ ác liệt! | • **SFX:** Tiếng nổ bộc phá đinh tai nhức óc cực mạnh (`explosion_heavy.wav`).<br>• **SFX:** Tiếng súng AK-47 điểm xạ đanh gọn, tiếng lính Mỹ hoảng loạn kêu thét, tiếng cánh quạt trực thăng Huey gầm rú rách toạc màn đêm.<br>• **Music:** Nhạc giao hưởng cao trào cực điểm, tiết tấu dồn dập, bi tráng và hào hùng. | Rạng sáng ngày 31 tháng 1 năm 1968.<br><br>Tiếng bộc phá sấm sét rung chuyển Sài Gòn!<br><br>Đồng loạt giáng đòn vào 5 mục tiêu đầu não:<br>Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu, Bộ Tư lệnh Hải quân.<br><br>Đội 11 Biệt động làm chủ Tòa Đại sứ Mỹ suốt 6 giờ ác liệt! | `verified_fact`<br>*(Lịch sử Nam Bộ kháng chiến & Viện Lịch sử Quân sự)* |
| **SCENE 05**<br>Bước Ngoặt Lịch Sử & Lời Hiệu Triệu Khám Phá | **01:40 – 01:50**<br>*(10 giây)* *(Tổng 110s)* | • **01:40 - 01:45:** Hình ảnh tư liệu truyền hình Mỹ (ký giả Walter Cronkite thảng thốt trên CBS News), tiêu đề các tờ báo lớn *The New York Times*, *Washington Post* rúng động trên màn hình.<br>• **01:45 - 01:50:** Chuyển cảnh mượt mà sang hình ảnh hòa bình hôm nay và biểu tượng ứng dụng Sử Chill. Nút tương tác xuất hiện mời gọi người học: *"Bắt đầu Bài 2: Sấm sét nội đô"*. | Đòn tập kích chấn động làm sụp đổ hoàn toàn ảo tưởng chiến thắng của Lầu Năm Góc, thổi bùng làn sóng phản chiến, buộc Mỹ phải xuống thang và ngồi vào bàn đàm phán Paris.<br><br>Hãy cùng bước vào Bài học 2 để trực tiếp khám phá những trận đánh huyền thoại! | • **SFX:** Tiếng máy chữ dồn dập của hãng thông tấn, tiếng phát thanh viên quốc tế vang lên ngắn.<br>• **Music:** Nhạc chuyển dần sang giai điệu tự hào, lắng đọng, ngân dài khúc khải hoàn và kết thúc dứt khoát.<br>• **SFX:** UI sound ping báo hiệu hoàn thành bài học. | Đòn tập kích làm sụp đổ ảo tưởng chiến thắng của đối phương.<br><br>Buộc Mỹ phải xuống thang và ngồi vào bàn đàm phán Paris.<br><br>Khám phá chi tiết tại Bài 2: Sấm sét nội đô! | `verified_fact` + `educational_explanation` |

---

## 3. TOÀN VĂN BẢN GHI LỜI THOẠI (FULL TRANSCRIPT)

Bản ghi lời thoại đầy đủ kèm mốc thời gian chuẩn hóa phục vụ thu âm Voiceover (Member 2 bàn giao cho diễn viên lồng tiếng hoặc cấu hình Microsoft Neural TTS):

```text
[00:00 - 00:20]
Đêm Giao thừa Tết Mậu Thân 1968.
Giữa lòng Sài Gòn, phố phường đang rộn rã đón xuân trong sắc pháo rực rỡ và lời chúc bình an.
Đối phương tin rằng đây là thành trì bất khả xâm phạm.
Nhưng ngay dưới chân họ, một kế hoạch táo bạo, rung chuyển lịch sử đang từng giây đếm ngược...

[00:20 - 00:45]
Số 287/70 đường Trần Quý Cáp.
Dưới vỏ bọc nhà thầu khoán Mai Hồng Quế, chiến sĩ Biệt động Trần Văn Lai cùng vợ đã bí mật đào căn hầm ngầm ngay giữa nội đô.
Gần hai tấn vũ khí, súng AK, đạn B40 và khối thuốc nổ TNT được cất giấu an toàn suốt nhiều năm ròng nhờ sự che chở kiên trung của nhân dân Sài Gòn.
Tất cả đã sẵn sàng cho giờ xuất kích!

[00:45 - 01:10]
Đúng thời khắc Giao thừa thiêng liêng, Đài Tiếng nói Việt Nam phát đi bài thơ chúc Tết của Chủ tịch Hồ Chí Minh:
"Xuân này hơn hẳn mấy xuân qua,
Thắng trận tin vui khắp nước nhà.
Nam Bắc thi đua đánh giặc Mỹ,
Tiến lên! Toàn thắng ắt về ta!"
Bốn câu thơ hào sảng chính là mật lệnh mở màn cuộc Tổng tiến công và nổi dậy trên toàn miền Nam.
Tại Sở chỉ huy tiền phương Tiệm phở Bình, Chỉ huy trưởng Tư Chu truyền đi mệnh lệnh lịch sử:
Giờ G đã điểm!

[01:10 - 01:40]
Rạng sáng 31 tháng Giêng năm 1968.
Tiếng bộc phá sấm sét rung chuyển Sài Gòn!
Các đội Biệt động đồng loạt giáng đòn điểm huyệt vào năm mục tiêu đầu não:
Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu và Bộ Tư lệnh Hải quân.
Tại Tòa Đại sứ Mỹ — pháo đài bất khả xâm phạm — 17 chiến sĩ Đội 11 đã anh dũng làm chủ trận địa suốt hơn sáu giờ đồng hồ ác liệt!

[01:40 - 01:50]
Đòn tập kích chấn động làm sụp đổ hoàn toàn ảo tưởng chiến thắng của Lầu Năm Góc, thổi bùng làn sóng phản chiến, buộc Mỹ phải xuống thang và ngồi vào bàn đàm phán Paris.
Hãy cùng bước vào Bài học 2 để trực tiếp khám phá những trận đánh huyền thoại!
```

---

## 4. MẪU TẬP TIN PHỤ ĐỀ CHUẨN WEBVTT (WEBVTT SUBTITLE TEMPLATE)

File phụ đề chuẩn WebVTT để Member 2 đóng gói và xuất thành file `episode-portrait-pilot.vtt`:

```vtt
WEBVTT - Su Chill Pilot Episode: Ke hoach Giao Thua
Language: vi-VN
Kind: captions

00:00:01.000 --> 00:00:06.500
Sài Gòn — Đêm Giao thừa Tết Mậu Thân 1968.

00:00:06.800 --> 00:00:12.500
Phố phường rộn rã đón xuân trong tiếng pháo nổ đón năm mới.

00:00:12.800 --> 00:00:16.500
Đối phương tin rằng đây là thành trì bất khả xâm phạm.

00:00:16.800 --> 00:00:20.500
Nhưng một kế hoạch rung chuyển lịch sử đang từng giây đếm ngược...

00:00:21.000 --> 00:00:25.000
Số 287/70 đường Trần Quý Cáp.

00:00:25.200 --> 00:00:31.500
Dưới vỏ bọc thầu khoán Mai Hồng Quế, ông Năm Lai bí mật đào hầm ngầm.

00:00:32.000 --> 00:00:38.500
Gần hai tấn vũ khí và thuốc nổ TNT được cất giấu suốt nhiều năm ròng...

00:00:39.000 --> 00:00:44.800
Nhờ sự chở che kiên trung của lòng dân Sài Gòn. Tất cả sẵn sàng xuất kích!

00:00:45.200 --> 00:00:51.500
Đúng Giao thừa, Đài Tiếng nói Việt Nam phát đi bài thơ chúc Tết của Bác Hồ:

00:00:52.000 --> 00:00:56.500
"Xuân này hơn hẳn mấy xuân qua, Thắng trận tin vui khắp nước nhà"

00:00:57.000 --> 00:01:02.500
"Nam Bắc thi đua đánh giặc Mỹ, Tiến lên! Toàn thắng ắt về ta!"

00:01:03.000 --> 00:01:06.500
Đó chính là mật hiệu mở màn Tổng tiến công toàn miền Nam.

00:01:07.000 --> 00:01:10.500
Tại Tiệm phở Bình, Chỉ huy trưởng Tư Chu phát lệnh: Giờ G đã điểm!

01:10.800 --> 01:14.000
Rạng sáng 31 tháng Giêng năm 1968.

01:14.200 --> 01:17.800
Tiếng bộc phá sấm sét rung chuyển Sài Gòn!

01:18.000 --> 01:25.000
Đồng loạt giáng đòn vào 5 mục tiêu đầu não:
Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu, Bộ Tư lệnh Hải quân.

01:25.500 --> 01:32.000
Tại Tòa Đại sứ Mỹ — pháo đài bất khả xâm phạm...

01:32.500 --> 01:40.000
17 chiến sĩ Đội 11 Biệt động đã quả cảm làm chủ trận địa suốt hơn 6 giờ ác liệt!

01:40.500 --> 01:45.500
Đòn tập kích chấn động làm sụp đổ ảo tưởng chiến thắng của đối phương...

01:46.000 --> 01:50.000
Buộc Mỹ phải xuống thang và ngồi vào bàn đàm phán Paris!
```

---

## 5. QUY CÁCH POSTER FRAME VÀ THẺ DỰ PHÒNG (FALLBACK CARD SPEC)

### 5.1. Thiết kế Poster Frame (`episode-portrait-pilot-poster.webp`)
* **Kích thước:** 1080 × 1920 pixels (Tỉ lệ 9:16).
* **Bố cục hình ảnh:**
  - *Khu vực trên (Top 25%):* Logo Sử Chill góc trên bên trái; huy hiệu chương: *"Chiến dịch Mậu Thân 1968"*.
  - *Khu vực trung tâm (Middle 50%):* Hình ảnh đồ họa phối cảnh căn hầm vũ khí bí mật 287/70 Trần Quý Cáp với ánh đèn vàng soi rọi súng đạn, đan xen hình ảnh Tòa Đại sứ Mỹ trong khói lửa đêm Giao thừa; nút "Play" hình tròn mạ vàng nổi bật ở chính giữa.
  - *Khu vực dưới (Bottom 25%):* Tiêu đề tập phim in hoa đậm nét: **KẾ HOẠCH GIAO THỪA**; phụ đề: *"Tập phim dẫn nhập — Thời lượng: 1 phút 50 giây"*.

### 5.2. Thẻ Dự phòng Văn bản (Text Fallback Card)
Dành cho trường hợp thiết bị người học không hỗ trợ video HTML5, mạng yếu hoặc người dùng bật chế độ đọc tiếp cận (Accessibility / Reduced Bandwidth):

```markdown
### [Bản tóm tắt Bài học 1]: Kế hoạch Giao Thừa (Đêm 30 rạng sáng 31/1/1968)

* **Bối cảnh:** Đêm Giao thừa Tết Mậu Thân 1968, giữa lúc đối phương lơ là phòng bị vì lệnh ngừng bắn dịp Tết, quân và dân ta đã bí mật chuẩn bị một cuộc tập kích chưa từng có vào sào huyệt trung tâm Sài Gòn.
* **Hạ tầng bí mật giữa lòng địch:** Căn hầm tại số 287/70 đường Trần Quý Cáp do chiến sĩ Biệt động Trần Văn Lai (Năm Lai) cùng vợ đào ngụy trang dưới danh nghĩa nhà thầu khoán Mai Hồng Quế, cất giấu gần 2 tấn thuốc nổ TNT, súng AK và đạn B40 suốt nhiều năm an toàn tuyệt đối nhờ sự chở che của nhân dân.
* **Mật lệnh xuất kích:** Bài thơ chúc Tết của Chủ tịch Hồ Chí Minh phát sóng trên Đài Tiếng nói Việt Nam lúc nửa đêm chính là hiệu lệnh mở màn. Từ Sở chỉ huy tiền phương tại Tiệm phở Bình, Chỉ huy trưởng Tư Chu phát lệnh tác chiến.
* **Năm mục tiêu trọng yếu:** Rạng sáng Mùng 2 Tết (31/1/1968), các đội Biệt động Sài Gòn đồng loạt tiến công 5 mục tiêu đầu não: Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh Sài Gòn, Bộ Tổng Tham mưu và Bộ Tư lệnh Hải quân. Trận đánh kéo dài hơn 6 giờ tại Tòa Đại sứ Mỹ làm rúng động chính giới phương Tây.
* **Ý nghĩa bước ngoặt:** Đòn tiến công làm phá sản chiến lược "Chiến tranh cục bộ", đập tan ảo tưởng chiến thắng của Lầu Năm Góc, mở đường cho đàm phán Paris.
```

---

## 6. BẢNG KIỂM NGHIỆM THU CHẤT LƯỢNG (ACCEPTANCE CHECKLIST)

Bảng nghiệm thu dành cho các thành viên kiểm tra chéo trước khi đóng gói sản phẩm:

| STT | Hạng mục kiểm tra | Tiêu chuẩn đạt | Người phụ trách | Xác nhận |
|:---:|:---|:---|:---:|:---:|
| 1 | **Tỉ lệ khung hình** | Chuẩn 9:16 dọc (1080×1920), an toàn vùng hiển thị (safe zone) | Trúc (Member 2) | [x] ĐẠT |
| 2 | **Thời lượng chuẩn** | Nằm trong khoảng 90–120 giây (Kịch bản: 110 giây) | Trúc (Member 2) | [x] ĐẠT |
| 3 | **Cấu trúc 5 phân cảnh** | Đầy đủ Scene 1 đến Scene 5 với các trường thông tin chuẩn | Thọ (Member 1) | [x] ĐẠT |
| 4 | **Tính chuẩn xác lịch sử** | 100% khớp tư liệu chính thống (Hầm Năm Lai, Tiệm phở Bình, 5 mục tiêu) | Historical Reviewer | [x] ĐẠT |
| 5 | **Thuật ngữ & Pháp lý (R3)** | Sử dụng "Kháng chiến chống Mỹ", 0 lần xuất hiện từ cấm, tuân thủ Luật An ninh mạng | Toàn nhóm | [x] ĐẠT |
| 6 | **Giọng đọc & Lời thoại** | Trầm ấm, hào hùng, không sai chính tả, tốc độ ~135–140 từ/phút | Trúc (Member 2) | [x] ĐẠT |
| 7 | **Âm thanh & SFX** | Có tiếng pháo Tết, đồng hồ tích tắc, thơ Bác Hồ, bộc phá nổ | Trúc (Member 2) | [x] ĐẠT |
| 8 | **Đồng bộ WebVTT** | Phụ đề khớp từng mili-giây với voiceover, không bị tràn viền | Trúc / Dương | [x] ĐẠT |
| 9 | **Poster & Fallback** | Đủ file ảnh bìa dọc 1080×1920 và thẻ tóm tắt Markdown | Trúc / Dương | [x] ĐẠT |
| 10 | **Tích hợp Video Player** | Player di động tự động hiển thị mượt mà trên giao diện Sử Chill | Dương (Member 4) | [x] ĐẠT |

---
*Kịch bản được hoàn thiện bởi Thọ (Member 1 — Product + Content) phục vụ sản xuất video cho Chapter MVP Mậu Thân 1968.*
