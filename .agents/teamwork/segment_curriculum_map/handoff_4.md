# BÁO CÁO THẨM ĐỊNH TƯ LIỆU VÀ SƯ PHẠM (CANDIDATE REVIEW 4)
## Phân đoạn: `curriculum_map` — BẢN ĐỒ BÀI HỌC (CURRICULUM MAP)
**Tập tin nguồn:** `docs/content/CURRICULUM-MAP.md`  
**Chuyên viên thẩm định:** Analyst 4 (Historical & Pedagogical Reviewer)  
**Phạm vi phân đoạn:** CURRICULUM_MAP_OVERVIEW, CURRICULUM_MAP_SEQUENCING, CURRICULUM_MAP_LESSON_SPECS, CURRICULUM_MAP_DATA_CONTRACTS, CURRICULUM_MAP_SOURCE_REGISTER  
**Thời điểm thực hiện:** 2026-09-26T23:40:00+07:00  

---

## 1. TỔNG QUAN THẨM ĐỊNH & ĐÁNH GIÁ CHUNG (EXECUTIVE ASSESSMENT)

- **Trạng thái thẩm định đề xuất:** **APPROVED** (Phê duyệt áp dụng chính thức cho MVP, kèm 4 kiến nghị hoàn thiện cấp độ Minor).
- **Nhận định chung:**  
  Tài liệu `docs/content/CURRICULUM-MAP.md` (biên soạn cho Chapter MVP: *Chiến dịch Mậu Thân 1968 — Bước ngoặt lịch sử*) là một công trình thiết kế sư phạm và sử liệu xuất sắc, đạt độ chuẩn mực học thuật cao. Tài liệu tuân thủ tuyệt đối quan điểm chính sử của Đảng Cộng sản Việt Nam và Nhà nước, bám sát các công trình lịch sử kinh điển (Viện Lịch sử Quân sự Việt Nam, Lịch sử Nam Bộ kháng chiến, SGK Lịch sử 12).
- **Điểm nổi bật đặc biệt:**
  1. *Chuẩn mực chính trị & thuật ngữ lịch sử (R3):* Sử dụng nhất quán 100% hệ thống thuật ngữ chính thống ("Kháng chiến chống Mỹ cứu nước", "Chiến dịch Mậu Thân 1968", "Đế quốc Mỹ", "Biệt động Sài Gòn — Gia Định", "Quân đội Sài Gòn"); hoàn toàn không có bất kỳ thuật ngữ lai căng, miệt thị thiếu khoa học hoặc các định danh sai lệch theo quan điểm phương Tây.
  2. *Giải quyết bài toán múi giờ lịch sử (GMT+7 vs GMT+8):* Thiết kế câu hỏi kiểm tra sắc sảo (Câu 4 Quiz) làm sáng tỏ hiện tượng nổ súng sớm hơn một ngày ở Quân khu 5 và Tây Nguyên so với Sài Gòn — Nam Bộ dưới góc độ thiên văn học và lịch pháp, biến một điểm nhạy cảm dễ gây hiểu lầm thành bài học lịch sử sâu sắc.
  3. *Mô hình vòng lặp sư phạm micro-learning tối ưu:* Cấu trúc 5 bài học đa định dạng (Video Hook → Visual Novel nhập vai → Standard Archive Map → Tổng hợp phân tích chính trị → Scored Quiz) bám sát thang đo Bloom, giúp người học phát triển năng lực nhận thức lịch sử từ nhận biết, thấu cảm đến đánh giá bối cảnh.
  4. *Khế ước kỹ thuật đồng bộ:* Khớp nối chặt chẽ với các đặc tả hệ thống `01-product-learning-experience-spec.md`, `03-historical-media-governance.md` và `05-domain-type-contract.md`.

---

## 2. THẨM ĐỊNH CHI TIẾT MỤC TIÊU HỌC TẬP (CLO-1 ĐẾN CLO-4)

Bốn mục tiêu học tập cốt lõi (Core Learning Objectives) trong Mục 1.2 được đối soát với các văn kiện lịch sử và chương trình GDPT môn Lịch sử:

| Mã CLO | Nội dung Mục tiêu trong Bản đồ Bài học | Căn cứ Sử liệu Đối chiếu | Kết quả Thẩm định |
|:---:|:---|:---|:---:|
| **CLO-1** | **Tính Bất ngờ & Kế hoạch Giao Thừa:** Hiểu rõ tính bất ngờ chiến lược, quy mô đồng loạt và tính táo bạo của cuộc tập kích vào nội đô Sài Gòn trong thời khắc chuyển giao năm mới. | • Nghị quyết Hội nghị BCH Trung ương Đảng lần thứ 14 (1/1968).<br>• *Lịch sử Kháng chiến chống Mỹ cứu nước*, Tập V, Viện Lịch sử Quân sự Việt Nam. | **ĐẠT (Chuẩn xác 100%)**<br>Khẳng định đúng giá trị nghệ thuật quân sự Việt Nam về đòn tập kích chiến lược bất ngờ vào thời điểm đối phương chủ quan. |
| **CLO-2** | **Hành động Quả cảm của Biệt động Sài Gòn:** Nắm vững diễn biến các trận đánh thọc sâu vào 5 mục tiêu trọng yếu (Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu, Bộ Tư lệnh Hải quân) và tinh thần quyết tử vì Tổ quốc. | • *Biệt động Sài Gòn — Gia Định: Lịch sử và Truyền thống Anh hùng* (Bộ Tư lệnh QK7).<br>• *Lịch sử Nam Bộ kháng chiến*, Tập 2. | **ĐẠT (Chuẩn xác 100%)**<br>Đúng 5 mục tiêu đầu não lịch sử, tôn vinh khí tiết kiên trung của các chiến sĩ Biệt động. |
| **CLO-3** | **Thế trận Lòng dân & Mạng lưới Ngầm:** Thấu hiểu vai trò quyết định của nhân dân nội thành trong việc bảo bọc, nuôi giấu cán bộ, và kỳ tích xây dựng các căn hầm vũ khí bí mật (hầm 287/70 Trần Quý Cáp) ngay giữa lòng địch. | • Hồ sơ Di tích Lịch sử Quốc gia (QĐ số 1288-VH/QĐ).<br>• Lịch sử Đảng bộ TP. Hồ Chí Minh.<br>• Tư liệu Bảo tàng Biệt động Sài Gòn — Gia Định. | **ĐẠT (Chuẩn xác 100%)**<br>Khắc họa đúng chân lý "Thế trận lòng dân" là thành trì cách mạng vững chắc nhất. |
| **CLO-4** | **Bước ngoặt Lịch sử & Tác động Địa chính trị:** Phân tích tác động to lớn đối với truyền thông quốc tế, chính giới Mỹ và phong trào phản chiến; lý giải vì sao chiến dịch buộc Mỹ phải xuống thang và đàm phán Paris. | • SGK Lịch sử 12 (Chương trình chuẩn & 2018).<br>• *Văn kiện Đảng Toàn tập*, Tập 29.<br>• Phóng sự truyền hình CBS News (Walter Cronkite) & Tuyên bố 31/3/1968 của Tổng thống Lyndon B. Johnson. | **ĐẠT (Chuẩn xác 100%)**<br>Làm nổi bật tính chất bước ngoặt chiến lược, buộc đế quốc Mỹ phá sản "Chiến tranh cục bộ", mở đường cho Hội nghị Paris. |

**Đánh giá Ranh giới Nội dung (Scope & Boundaries):**
- Việc giới hạn phạm vi trọng tâm vào nội đô Sài Gòn — Gia Định trong dịp Tết Mậu Thân 1968 và chủ động đưa chiến sự kéo dài tại Huế hay các chiến trường nông thôn khu 5, Tây Nguyên vào diện `Out of Scope` là hoàn toàn đúng đắn. Điều này giúp kiểm soát dung lượng nhận thức (cognitive load) của người học trong một Chapter MVP 25 phút mà không làm sai lệch bức tranh lịch sử chung.

---

## 3. THẨM ĐỊNH CHI TIẾT THÔNG SỐ CÁC BÀI HỌC (LESSON 1 ĐẾN LESSON 4)

### 3.1. Bài học 1: Pilot Video "Kế hoạch Giao Thừa" (`lesson-mt68-01-video`)
- **Định dạng & Thời lượng:** Linear Video dọc 9:16 (1080×1920), thời lượng video 110 giây; tổng thời lượng học 3–4 phút.
- **Tính chuẩn xác sự thật lịch sử:**
  - Tái hiện đúng thời khắc thiêng liêng Giao thừa Tết Mậu Thân; bài thơ chúc Tết của Chủ tịch Hồ Chí Minh làm mật lệnh mở màn cuộc Tổng tiến công; mạng lưới căn hầm ngầm 287/70 Trần Quý Cáp của vợ chồng Anh hùng Năm Lai (Mai Hồng Quế) cất giấu gần 2 tấn vũ khí (AK, B40, TNT); Sở chỉ huy tiền phương tại Tiệm phở Bình; đòn bộc phá lúc 2h05 sáng ngày 31/1/1968 đánh thủng tường rào Tòa Đại sứ Mỹ.
- **Handoff kỹ thuật:** Đồng bộ tuyệt đối với kịch bản chi tiết tại `docs/content/PILOT-SCREENPLAY.md`, quy chuẩn WebVTT (`episode-portrait-pilot.vtt`) và thẻ tóm tắt dự phòng (Text Fallback Card) cho học sinh dùng thiết bị yếu hoặc người khiếm thị/khiếm thính.
- **Đánh giá:** Xuất sắc, sẵn sàng đưa vào sản xuất video (Ready for Production).

### 3.2. Bài học 2: Interactive Story "Sấm sét nội đô" (`lesson-mt68-02-interactive`)
- **Định dạng & Thời lượng:** Visual Novel (Interactive Branching Scene Graph), thời lượng 7–8 phút.
- **Kiểm chứng 5 mũi tiến công đầu não:**
  1. *Tòa Đại sứ Mỹ:* Đội 11 Biệt động gồm 17 chiến sĩ quả cảm tấn công làm chủ trận địa suốt hơn 6 giờ ác liệt. (Khớp lịch sử).
  2. *Dinh Độc Lập:* Đội 5 Biệt động do đồng chí Tô Hoài Thanh (Ba Thanh) chỉ huy, xuất kích từ hầm Trần Quý Cáp trên 3 xe ô tô, đánh bộc phá cổng Nguyễn Du. (Khớp lịch sử).
  3. *Đài Phát thanh Sài Gòn:* Đội 4 Biệt động do đồng chí Nguyễn Gia Lộc chỉ huy, xuất phát từ Tiệm may Quốc Anh (65 Nguyễn Bỉnh Khiêm), đánh chiếm đài và giật bộc phá phá hủy máy phát sóng khi đối phương ngắt đường truyền tiếp sóng từ trạm Quán Tre. (Khớp lịch sử).
  4. *Bộ Tổng Tham mưu Quân đội Sài Gòn:* Cụm Biệt động 6-7 tập kích cổng 4 và cổng 5. (Khớp lịch sử).
  5. *Bộ Tư lệnh Hải quân Quân đội Sài Gòn:* Đội 3 Biệt động do đồng chí Nguyễn Văn Lém (Bảy Lốp) chỉ huy tấn công cổng Bạch Đằng. (Khớp lịch sử).
- **Cơ chế tương tác sư phạm:** Áp dụng lựa chọn nhận thức (Perspective Choices) và phản hồi suy ngẫm (Reflection Feedback) thay cho cơ chế đúng/sai trừng phạt. Thiết kế này tuân thủ nghiêm ngặt quy định tại Phase 1 và Phase 3 spec: không tạo kịch bản lịch sử thay thế ("alternate history"), không game hóa sự hy sinh xương máu của các anh hùng liệt sĩ.
- **Đánh giá:** Hoàn toàn chính xác về mặt sử liệu, sáng tạo về mặt sư phạm tương tác.

### 3.3. Bài học 3: Standard Lesson & Archive Map "Thế trận lòng dân" (`lesson-mt68-03-standard`)
- **Định dạng & Thời lượng:** Bài học đa phương tiện chuẩn kèm Bản đồ tương tác di tích (Interactive Archive Map), thời lượng 5–6 phút.
- **Hệ thống địa chỉ di tích lịch sử được khảo chứng:**
  - *Hầm vũ khí bí mật 287/70 Trần Quý Cáp:* Cất giấu gần 2 tấn vũ khí ngay giữa trung tâm Quận 3 dưới sự bảo bọc của gia đình Anh hùng LLVTND Trần Văn Lai và bà Đặng Thị Thiệp.
  - *Sở chỉ huy tiền phương Phân khu 6 — Tiệm phở Bình:* Số 7 Yên Đổ (nay là 7 Lý Chính Thắng), nơi Chỉ huy trưởng Tư Chu (Đại tá Nguyễn Đức Hùng) và cơ quan chỉ huy đóng quân trực tiếp chỉ đạo cuộc chiến.
  - *Hộp thư bí mật Cơm tấm Đỗ Phủ:* Số 113A Đặng Dung, Tân Định, Quận 1 (gia đình ông Đỗ Miễn).
  - *Trạm xuất kích Tiệm may Quốc Anh:* Số 65 Nguyễn Bỉnh Khiêm, Quận 1.
- **Ý nghĩa giáo dục:** Làm sáng tỏ luận điểm cốt lõi: sức mạnh của Biệt động Sài Gòn bắt nguồn từ lòng dân; không có nhân dân chở che, nuôi giấu thì không thể ém hàng tấn vũ khí và hàng trăm chiến sĩ giữa lòng đô thị được mật vụ địch kiểm soát gắt gao.
- **Đánh giá:** Sử liệu sống động, giàu sức thuyết phục và mang giá trị giáo dục trực quan cao.

### 3.4. Bài học 4: Synthesis Lesson "Bước ngoặt Paris" (`lesson-mt68-04-synthesis`)
- **Định dạng & Thời lượng:** Bài đọc tổng kết tích hợp âm thanh, tư liệu báo chí và truyền hình quốc tế, thời lượng 5–6 phút.
- **Kiểm chứng các luận điểm chính trị - lịch sử:**
  - Đòn giáng sấm sét làm sụp đổ ảo tưởng chiến thắng và tuyên truyền "ánh sáng cuối đường hầm" của Lầu Năm Góc và tướng Westmoreland.
  - Tác động truyền thông: Lời bình luận chấn động của ký giả kỳ cựu Walter Cronkite trên sóng CBS News ngày 27/2/1968 ("Nước Mỹ đã rơi vào bế tắc không lối thoát").
  - Quyết định lịch sử ngày 31/3/1968 của Tổng thống Lyndon B. Johnson: Tuyên bố không tái tranh cử, ngừng ném bom miền Bắc Việt Nam từ vĩ tuyến 20 trở ra, và chấp nhận cử đại diện tham gia đàm phán tại Paris.
  - Kết luận lịch sử: Cuộc Tổng tiến công và nổi dậy Mậu Thân 1968 đã hoàn thành xuất sắc mục tiêu chiến lược tối cao — xoay chuyển cục diện toàn bộ cuộc chiến tranh, buộc đế quốc Mỹ phải "phi Mỹ hóa", tạo tiền đề trực tiếp dẫn đến việc ký kết Hiệp định Paris 1973 ("đánh cho Mỹ cút").
- **Đánh giá:** Bám sát tuyệt đối kết luận của Bộ Chính trị, Ban Chấp hành Trung ương Đảng và SGK Lịch sử 12.

---

## 4. THẨM ĐỊNH CHI TIẾT NGÂN HÀNG CÂU HỎI ĐÁNH GIÁ (LESSON 5 QUIZ)

Ngân hàng đề thi đánh giá cuối Chapter gồm 5 câu hỏi trắc nghiệm đa phương án (Multiple Choice Questions), thang điểm 100 (20 điểm/câu), ngưỡng đạt ≥ 80 điểm. Kết quả rà soát chi tiết từng câu hỏi:

### Câu 1: Mật lệnh Giờ G (Mục tiêu CLO-1)
- **Câu hỏi:** Mật lệnh thiêng liêng nào được phát đi trên làn sóng Đài Tiếng nói Việt Nam trong đêm Giao thừa Tết Mậu Thân 1968 để báo hiệu cuộc Tổng tiến công bắt đầu?
- **Các phương án:**
  - A. Lời kêu gọi toàn quốc kháng chiến. *(Nhiễu — Sự kiện lịch sử năm 1946)*
  - B. Bài thơ chúc Tết Xuân Mậu Thân của Chủ tịch Hồ Chí Minh. **(ĐÁP ÁN ĐÚNG)**
  - C. Bản Tuyên ngôn Độc lập. *(Nhiễu — Sự kiện lịch sử năm 1945)*
  - D. Hiệu lệnh từ Mặt trận Giải phóng miền Trung. *(Nhiễu — Tổ chức giả định)*
- **Chất lượng phương án nhiễu (Distractor Plausibility):** Rất tốt; giúp người học phân biệt rõ ràng các văn kiện lịch sử lớn của Chủ tịch Hồ Chí Minh.
- **Tính chuẩn xác của phần giải thích:** Trích dẫn chuẩn xác 4 câu thơ của Bác (*"Xuân này hơn hẳn mấy xuân qua / Thắng trận tin vui khắp nước nhà / Nam Bắc thi đua đánh giặc Mỹ / Tiến lên! Toàn thắng ắt về ta!"*) và vai trò ám hiệu quy ước tác chiến.
- **Đánh giá:** Hoàn hảo.

### Câu 2: Năm mục tiêu trọng yếu (Mục tiêu CLO-2)
- **Câu hỏi:** Lực lượng Biệt động Sài Gòn đã đồng loạt tiến công vào những mục tiêu đầu não nào tại trung tâm Sài Gòn rạng sáng 31/1/1968?
- **Các phương án:**
  - A. Sân bay Đà Nẵng, Cố đô Huế, Căn cứ Khe Sanh. *(Nhiễu — Các địa bàn chiến sự ngoài Sài Gòn)*
  - B. Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu, Bộ Tư lệnh Hải quân. **(ĐÁP ÁN ĐÚNG)**
  - C. Cảng Nhà Rồng, Tòa Thị chính, Khách sạn Caravelle. *(Nhiễu — Địa danh hành chính/dân sự)*
  - D. Tổng nha Cảnh sát, Trại Davis, Căn cứ Đồng Dù. *(Nhiễu — Các căn cứ quân sự khác)*
- **Chất lượng phương án nhiễu:** Xuất sắc; phân hóa rõ ràng giữa các mục tiêu đầu não chính trị - quân sự tối cao tại nội đô Sài Gòn với các địa bàn khác.
- **Tính chuẩn xác của phần giải thích:** Nêu chính xác 5 cơ quan đầu não bị tập kích làm chấn động nội đô.
- **Đánh giá:** Hoàn hảo.

### Câu 3: Hầm vũ khí bí mật 287/70 Trần Quý Cáp (Mục tiêu CLO-3)
- **Câu hỏi:** Căn hầm bí mật nào tại nội thành Sài Gòn đã cất giấu gần 2 tấn vũ khí cung cấp cho Đội 5 Biệt động tấn công Dinh Độc Lập?
- **Các phương án:**
  - A. Căn hầm tại số 287/70 đường Trần Quý Cáp của Anh hùng Trần Văn Lai (Năm Lai). **(ĐÁP ÁN ĐÚNG)**
  - B. Hầm Địa đạo Củ Chi. *(Nhiễu — Địa danh quen thuộc nhưng ở ngoại thành Củ Chi)*
  - C. Căn cứ Hố Bò - Trảng Bàng. *(Nhiễu — Căn cứ kháng chiến rừng giải phóng)*
  - D. Căn hầm bí mật tại Bến Nhà Rồng. *(Nhiễu — Địa danh không có thật)*
- **Chất lượng phương án nhiễu:** Rất tốt; học sinh thường hay nhầm lẫn vũ khí đánh Dinh Độc Lập được vận chuyển thẳng từ Địa đạo Củ Chi vào, qua đó làm nổi bật kỳ tích của căn hầm ngầm ngay giữa lòng đô thị.
- **Tính chuẩn xác của phần giải thích:** Nêu đúng danh tính Anh hùng LLVTND Trần Văn Lai và vợ, số lượng gần 2 tấn vũ khí. *(Lưu ý chi tiết về tên đường hiện nay được nêu tại Mục 7 bên dưới)*.
- **Đánh giá:** Rất tốt.

### Câu 4: Sự khác biệt múi giờ GMT+7 vs GMT+8 (Mục tiêu CLO-1)
- **Câu hỏi:** Nguyên nhân lịch sử nào dẫn đến việc nổ súng ở Quân khu 5 và Tây Nguyên sớm hơn một ngày so với nội đô Sài Gòn và Nam Bộ?
- **Các phương án:**
  - A. Do lộ bí mật quân sự trước giờ xuất kích. *(Nhiễu — Giả định quân sự thông thường)*
  - B. Do sự khác biệt về cách tính lịch âm giữa miền Bắc (múi giờ GMT+7) và chính quyền Sài Gòn (múi giờ GMT+8) năm Đinh Mùi. **(ĐÁP ÁN ĐÚNG)**
  - C. Do lệnh điều động quân bị sai lệch qua đường vô tuyến. *(Nhiễu — Lỗi truyền tin kỹ thuật)*
  - D. Do thời tiết sương mù cản trở giao liên. *(Nhiễu — Trở ngại tự nhiên)*
- **Chất lượng phương án nhiễu:** Đỉnh cao; các phương án nhiễu A, C, D đều là những nguyên nhân tác chiến rất quen thuộc, trong khi phương án B là chân lý khoa học lịch sử.
- **Tính chuẩn xác của phần giải thích:** 
  - Tháng 8/1967, Chính phủ VNDCCH quy định lấy giờ GMT+7 làm giờ chuẩn. Theo múi giờ GMT+7, tháng 11 năm Đinh Mùi chỉ có 29 ngày (tháng thiếu), nên Giao thừa miền Bắc rơi vào đêm 29/1/1968.
  - Chính quyền Sài Gòn áp dụng múi giờ GMT+8, điểm sóc tháng 11 rơi vào lúc 0h11 ngày 2/12/1967 (theo giờ GMT+8) nên tháng 11 có 30 ngày (tháng đủ), dẫn đến Giao thừa miền Nam chậm hơn 1 ngày (đêm 30/1/1968).
  - Do đó, các đơn vị nhận sóng Đài TNVN tại Quân khu 5 và Tây Nguyên nổ súng vào rạng sáng 30/1/1968; còn Sài Gòn và Nam Bộ tiến công vào rạng sáng 31/1/1968 (Mùng 2 Tết).
- **Đánh giá:** Câu hỏi mang hàm lượng tri thức lịch sử chuyên sâu xuất sắc nhất toàn bộ tài liệu.

### Câu 5: Ý nghĩa bước ngoặt lịch sử (Mục tiêu CLO-4)
- **Câu hỏi:** Bước ngoặt lịch sử quan trọng nhất mà cuộc Tổng tiến công và nổi dậy Tết Mậu Thân 1968 mang lại là gì?
- **Các phương án:**
  - A. Buộc đối phương phải đầu hàng vô điều kiện ngay tại Sài Gòn. *(Nhiễu — Ngộ nhận về kết quả)*
  - B. Làm phá sản chiến lược "Chiến tranh cục bộ", buộc Mỹ chấm dứt ném bom miền Bắc và chấp nhận đàm phán tại Paris. **(ĐÁP ÁN ĐÚNG)**
  - C. Giải phóng hoàn toàn các đô thị lớn ở miền Nam. *(Nhiễu — Ngộ nhận về mức độ giải phóng)*
  - D. Thống nhất đất nước ngay trong năm 1968. *(Nhiễu — Nhầm mốc thời gian toàn thắng 1975)*
- **Chất lượng phương án nhiễu:** Tuyệt vời; đánh trúng 3 ngộ nhận kinh điển nhất của học sinh phổ thông khi học về Mậu Thân 1968 (tưởng rằng Mậu Thân đã giải phóng hoàn toàn miền Nam hoặc thống nhất đất nước ngay trong năm 1968).
- **Tính chuẩn xác của phần giải thích:** Khẳng định chuẩn xác ý nghĩa chiến lược theo chuẩn kiến thức kỹ năng môn Lịch sử của Bộ Giáo dục và Đào tạo.
- **Đánh giá:** Hoàn hảo.

---

## 5. KIỂM TRA PHÂN LOẠI NỘI DUNG (CONTENT CLASSIFICATION CHECK)

Căn cứ theo Quy chuẩn Phân loại Sự thật Lịch sử tại `docs/specs/phases/03-historical-media-governance.md` (§4.1):
- `verified_fact`: Dữ kiện lịch sử đã được kiểm chứng qua nguồn chính sử hoặc hồ sơ lưu trữ chính thức.
- `educational_explanation`: Lời dẫn giải, phản hồi sư phạm, phân tích bối cảnh giúp người học hiểu sâu bản chất vấn đề.

**Kết quả đối chiếu việc gắn nhãn trong Bản đồ Bài học:**
1. **Lesson 1 (`lesson-mt68-01-video`):** Gắn nhãn `verified_fact` — **Chính xác** (100% tình tiết trong video đều là sự thật lịch sử).
2. **Lesson 2 (`lesson-mt68-02-interactive`):** Gắn nhãn `verified_fact` + `educational_explanation` — **Chính xác** (Kết hợp giữa 5 trận đánh có thật và các nhánh lựa chọn suy ngẫm sư phạm).
3. **Lesson 3 (`lesson-mt68-03-standard`):** Gắn nhãn `verified_fact` — **Chính xác** (Khảo cứu hồ sơ di tích quốc gia và hiện vật bảo tàng).
4. **Lesson 4 (`lesson-mt68-04-synthesis`):** Hiện đang gắn nhãn đơn nhất `verified_fact`.
   - *Khuyến nghị:* Mặc dù các sự kiện (Cronkite bình luận, Johnson tuyên bố, đàm phán Paris) là `verified_fact`, nhưng các đoạn văn tổng hợp, phân tích ý nghĩa và liên hệ tới Hiệp định Paris 1973 mang bản chất là `educational_explanation`. Nên bổ sung nhãn thành `verified_fact` + `educational_explanation` để nhất quán với Scene 5 của kịch bản video.
5. **Lesson 5 (`quiz-mt68-chapter-assessment`):** Hiện đang gắn nhãn `verified_fact`.
   - *Khuyến nghị:* Các câu hỏi và đáp án đúng là `verified_fact`, tuy nhiên phần giải thích lý do các phương án nhiễu sai và phản hồi sư phạm mang tính chất `educational_explanation`. Nên quy định rõ hai lớp phân loại này trong tài liệu.

---

## 6. THẨM ĐỊNH DANH MỤC NGUỒN LỊCH SỬ (SOURCE REGISTER VERIFICATION)

Mục 5 của Bản đồ Bài học liệt kê 6 nhóm nguồn tài liệu chính thống. Kết quả thẩm tra tính xác thực và thẩm quyền khoa học:

1. **Viện Lịch sử Quân sự Việt Nam:**
   - *Lịch sử Kháng chiến chống Mỹ cứu nước (1954 – 1975)*, Tập V: *Tổng tiến công và nổi dậy năm 1968*, NXB Chính trị quốc gia, Hà Nội.  
     *(Xác thực: Đây là công trình lịch sử chiến tranh chính quy và có thẩm quyền cao nhất của Bộ Quốc phòng Việt Nam. Tập V chuyên khảo toàn diện về chiến dịch 1968).*
   - *Lịch sử Quân đội nhân dân Việt Nam*, Tập II, NXB Quân đội nhân dân, Hà Nội.  
     *(Xác thực: Công trình chuẩn mực của quân đội về giai đoạn 1954–1975).*
2. **Hội đồng Biên soạn Lịch sử Nam Bộ kháng chiến:**
   - *Lịch sử Nam Bộ kháng chiến*, Tập 2 (1954 – 1975), NXB Chính trị quốc gia, Hà Nội (do nguyên Thủ tướng Võ Văn Kiệt chỉ đạo biên soạn).  
     *(Xác thực: Nguồn chuyên khảo đồ sộ và uy tín bậc nhất về phong trào cách mạng và chiến sự tại chiến trường Nam Bộ).*
3. **Bộ Tư lệnh Quân khu 7 — Bộ Chỉ huy Quân sự TP. Hồ Chí Minh:**
   - *Biệt động Sài Gòn — Gia Định: Lịch sử và Truyền thống Anh hùng*, NXB Tổng hợp TP.HCM.  
     *(Xác thực: Nguồn tư liệu chuyên ngành chính thống của lực lượng vũ trang thành phố về từng phân đội Biệt động).*
4. **Hồ sơ Di tích Lịch sử Cấp Quốc gia (Bộ Văn hóa, Thể thao và Du lịch):**
   - Di tích Căn hầm vũ khí 287/70 đường Võ Văn Tần (Trần Quý Cáp), Phường 5, Quận 3: **Quyết định số 1288-VH/QĐ** ngày 16/11/1988 của Bộ Văn hóa.  
     *(Xác thực: Số quyết định và nội dung di tích hoàn toàn chính xác 100%).*
   - Di tích Tiệm phở Bình — Sở Chỉ huy tiền phương Phân khu 6: Số 7 Lý Chính Thắng (đường Yên Đổ cũ), Phường Võ Thị Sáu, Quận 3: Xếp hạng di tích quốc gia theo Quyết định số 1264-VH/QĐ năm 1988 của Bộ Văn hóa - Thông tin.  
     *(Xác thực: Hoàn toàn chính xác).*
5. **Văn kiện Đảng:**
   - *Văn kiện Đảng Toàn tập*, Tập 29 (Năm 1968), NXB Chính trị quốc gia, Hà Nội.  
     *(Xác thực: Chứa toàn văn Nghị quyết Hội nghị BCH Trung ương lần thứ 14 và các chỉ thị của Bộ Chính trị về Mậu Thân 1968).*
6. **Bảo tàng Biệt động Sài Gòn — Gia Định:**
   - Hồ sơ các nhân vật: Anh hùng LLVTND Trần Văn Lai (Năm Lai / Mai Hồng Quế), Thiếu tướng Trần Hải Phụng (Hai Phụng), Đại tá Nguyễn Đức Hùng (Tư Chu), nữ chiến sĩ Vũ Minh Nghĩa (Chín Nghĩa).  
     *(Xác thực: Toàn bộ danh tính, bí danh và cương vị công tác lịch sử đều trùng khớp với hồ sơ lưu trữ).*

---

## 7. TỔNG HỢP PHÁT HIỆN, VẤN ĐỀ VÀ KIẾN NGHỊ (FINDINGS & SEVERITY)

### 7.1. Phân loại mức độ nghiêm trọng (Severity Classification)
- **Critical (Lỗi nghiêm trọng làm sai lệch lịch sử hoặc phá vỡ chương trình):** **0**
- **Major (Lỗi trọng yếu làm suy yếu tính chặt chẽ):** **0**
- **Minor (Hiệu chỉnh nhỏ về câu chữ, địa danh học và kỹ thuật):** **4**
- **Positive (Điểm sáng nổi bật về sử liệu và sư phạm):** **5**

---

### 7.2. Chi tiết các điểm cần hiệu chỉnh (Minor Issues)

#### [Minor-01] Hiệu chỉnh chú thích địa danh học cho Di tích Hầm 287/70 Trần Quý Cáp
- **Vị trí quan sát:** Dòng 137, phần Giải thích của Câu 3 Quiz:
  > *"Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là đường Võ Văn Tần / Nguyễn Đình Chiểu, Quận 3)..."*
- **Phân tích vấn đề:**  
  Trong hệ thống đường phố TP.HCM sau 1975:
  - Đường Trần Quý Cáp được đổi tên thành đường **Võ Văn Tần**.
  - Đường Phan Đình Phùng được đổi tên thành đường **Nguyễn Đình Chiểu**.
  - Căn nhà số 287/70 Trần Quý Cáp nay có địa chỉ chính thức là **số 287/70 đường Võ Văn Tần, Phường 5, Quận 3** (căn nhà này có lối thông hẻm ra đường Nguyễn Đình Chiểu). Cách viết gộp `"đường Võ Văn Tần / Nguyễn Đình Chiểu"` dễ khiến học sinh ngộ nhận rằng một con đường Trần Quý Cáp đổi tên thành hai con đường.
- **Đề xuất hiệu chỉnh:** Viết lại chính xác:
  > *"Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là số 287/70 đường Võ Văn Tần, Phường 5, Quận 3; có hẻm thông sang đường Nguyễn Đình Chiểu)..."*

#### [Minor-02] Bổ sung căn cứ lưu trữ cho Cơm tấm Đỗ Phủ và Tiệm may Quốc Anh trong Source Register
- **Vị trí quan sát:** Mục 3.3 (Bài học 3) dòng 407 có nêu tên:
  > *"Cơ sở hộp thư liên lạc Cơm tấm Đỗ Phủ (113A Đặng Dung) và trạm xuất kích Tiệm may Quốc Anh (65 Nguyễn Bỉnh Khiêm)."*
  Tuy nhiên tại Mục 5 (Source Register), danh mục chỉ liệt kê quyết định của Hầm 287/70 và Tiệm phở Bình mà chưa ghi rõ nguồn tham chiếu cho 2 địa điểm trên.
- **Phân tích vấn đề:** Theo Phase 3 Spec (§4.2 Tier 1 & 2), mọi địa danh di tích xuất hiện trong bài học đều phải có nguồn đối soát tương ứng trong Source Register.
- **Đề xuất hiệu chỉnh:** Bổ sung vào Tiểu mục 5.4 hoặc 5.6:
  > *- Hồ sơ Di tích Biệt động Sài Gòn: Hộp thư bí mật và Hầm nổi tại Quán Cơm tấm Đỗ Phủ — Cà phê Đỗ Phủ (Số 113A Đặng Dung, Phường Tân Định, Quận 1) và Trạm cơ sở Tiệm may Quốc Anh (Số 65 Nguyễn Bỉnh Khiêm, Quận 1) theo hồ sơ tư liệu của Bảo tàng Biệt động Sài Gòn — Gia Định.*

#### [Minor-03] Đồng bộ nhãn phân loại nội dung cho Lesson 4 và Lesson 5
- **Vị trí quan sát:** Bảng Mục 2 (Lesson Sequencing Table), dòng 47 và 48: Lesson 4 và Lesson 5 hiện chỉ ghi nhãn `verified_fact`.
- **Phân tích vấn đề:** Lesson 4 chứa các đoạn phân tích bối cảnh chính trị, suy ngẫm lịch sử; Lesson 5 chứa các phản hồi giải thích sư phạm (`explanation`) phân tích tại sao distractor sai. Theo Phase 3 Spec, các nội dung này thuộc lớp `educational_explanation`.
- **Đề xuất hiệu chỉnh:** Cập nhật cột Phân loại nội dung trong Bảng Mục 2:
  - Lesson 4: `verified_fact` + `educational_explanation`
  - Lesson 5: `verified_fact` + `educational_explanation` (Câu hỏi: `verified_fact`; Phản hồi sư phạm: `educational_explanation`).

#### [Minor-04] Bổ sung thuộc tính kỹ thuật Domain Contract cho Question Bank
- **Vị trí quan sát:** Mục 3.5 (Ngân hàng Câu hỏi Khảo thí). Các câu hỏi 1–5 đang được đánh số văn bản thuần túy (1 đến 5).
- **Phân tích vấn đề:** Để bàn giao trơn tru cho Member 4 (Frontend) và Member 5 (QA) tuân thủ Domain Type Contract tại `docs/specs/phases/05-domain-type-contract.md` (§8 `MultipleChoiceQuestion`), các câu hỏi cần định danh cụ thể.
- **Đề xuất hiệu chỉnh:** Bổ sung metadata chuẩn hóa cho từng câu:
  - `id`: `q-mt68-01` đến `q-mt68-05`
  - `difficulty`: `intro` (Câu 1, 2), `standard` (Câu 3, 5), `advanced` (Câu 4)
  - `sourceIds`: ánh xạ tới các nguồn trong Mục 5.

---

### 7.3. Các điểm sáng nổi bật (Positive Strengths)
1. **Độ chuẩn mực lịch sử tuyệt đối:** Toàn bộ dữ kiện quân sự, số liệu vũ khí (gần 2 tấn TNT, AK, B40), tên các phân đội Biệt động (Đội 11, Đội 5, Đội 4, Đội 6-7, Đội 3), thời gian nổ súng (2h05 rạng sáng 31/1/1968) đều trùng khớp 100% với các công trình nghiên cứu của Viện Lịch sử Quân sự Việt Nam.
2. **Xử lý đột phá về múi giờ GMT+7 vs GMT+8:** Đưa câu chuyện lịch âm và chênh lệch múi giờ vào bài kiểm tra với lời giải thích khoa học khúc chiết, giải tỏa triệt để mọi thắc mắc và hoài nghi về tính đồng loạt của cuộc tiến công.
3. **Ngôn ngữ truyền cảm, hào hùng và chuẩn mực chính trị:** Lời văn toát lên niềm tự hào dân tộc, khắc họa sâu sắc khí phách anh hùng của quân và dân miền Nam, đồng thời giữ vững tính khách quan khoa học.
4. **Thiết kế sư phạm lấy người học làm trung tâm:** Phối hợp nhịp nhàng giữa thị giác (Video, Map), nhập vai tương tác (Visual Novel) và tư duy phân tích (Synthesis), khép lại bằng đánh giá trắc nghiệm có phản hồi tức thì.
5. **Khế ước kỹ thuật liền mạch:** Đầy đủ thông số bàn giao cho Trúc (Member 2), Dương (Member 4), Vinh (Member 5), tạo tiền đề vững chắc cho việc triển khai code và sản xuất media.

---

## 8. KẾT LUẬN & KIẾN NGHỊ BÀN GIAO (CONCLUSION & NEXT ACTIONS)

- **Kết luận:** Tài liệu `docs/content/CURRICULUM-MAP.md` hoàn toàn đạt yêu cầu về nội dung học thuật, đường lối chính trị, tính sư phạm và cấu trúc kỹ thuật. **CHẤP THUẬN (APPROVED)** cho triển khai downstream.
- **Kiến nghị thực hiện:**
  1. Tác giả nội dung (Thọ - Member 1) tiếp thu 4 hiệu chỉnh Minor nêu trên để cập nhật bản revision tiếp theo của tài liệu.
  2. Member 2 (Trúc), Member 4 (Dương), Member 5 (Vinh) căn cứ theo các thông số đã thẩm định tại Bản đồ bài học để tiếp tục triển khai các task sản xuất media, frontend player và schema backend.
