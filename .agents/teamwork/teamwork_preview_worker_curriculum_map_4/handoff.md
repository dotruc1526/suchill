# BÁO CÁO BÀN GIAO THẨM ĐỊNH (HANDOFF REPORT)
**Mã nhân sự:** Analyst 4 (Historical & Pedagogical Specialist)  
**Phân đoạn thẩm định:** `curriculum_map`  
**Tập tin đối tượng:** `docs/content/CURRICULUM-MAP.md`  
**Tập tin báo cáo ứng viên đã xuất:** `.agents/teamwork/segment_curriculum_map/handoff_4.md`  
**Ngày thực hiện:** 2026-09-26  

---

## 1. OBSERVATION (Quan sát thực tế)

Qua việc trực tiếp khảo sát toàn văn 223 dòng của tập tin `docs/content/CURRICULUM-MAP.md` cùng các tài liệu đối sánh liên quan (`ANALYSIS_PARTITION.md`, `PILOT-SCREENPLAY.md`, `MVP-BRIEF.md`, `SGK-LESSON-MAUTHAN.md`, `docs/specs/phases/01-product-learning-experience-spec.md`, `docs/specs/phases/03-historical-media-governance.md`, `docs/specs/phases/05-domain-type-contract.md`), tôi ghi nhận các dữ kiện cụ thể sau:

1. **Về Khung mục tiêu học tập (Mục 1.2, dòng 21–27):**  
   Văn bản xác lập 4 chuẩn đầu ra (CLO-1 đến CLO-4) bao gồm: CLO-1 (Tính bất ngờ chiến lược và Kế hoạch Giao Thừa), CLO-2 (Hành động quả cảm của 5 mũi Biệt động Sài Gòn), CLO-3 (Thế trận lòng dân và căn hầm bí mật 287/70 Trần Quý Cáp), CLO-4 (Bước ngoặt lịch sử làm lung lay ý chí đế quốc Mỹ, dẫn tới Hội nghị đàm phán Paris).
2. **Về Trình tự bài học & Phân loại nội dung (Mục 2, dòng 42–49):**  
   Bảng trình tự gồm 5 bài học được xếp theo chu trình micro-learning hoàn chỉnh: Lesson 1 (`video`, `verified_fact`), Lesson 2 (`visual_novel`, `verified_fact` + `educational_explanation`), Lesson 3 (`standard`, `verified_fact`), Lesson 4 (`standard`, `verified_fact`), Lesson 5 (`quiz`, `verified_fact`). Tổng thời lượng dự kiến 25 phút.
3. **Về Chi tiết thông số bài học 1–4 (Mục 3.1–3.4, dòng 54–109):**  
   - Lesson 1 khớp nối chặt chẽ với kịch bản `PILOT-SCREENPLAY.md` (video 110 giây, tỉ lệ 9:16 dọc, âm thanh chuẩn hóa -14 LUFS, phụ đề WebVTT).
   - Lesson 2 mô tả chính xác 5 mũi tiến công của Biệt động Sài Gòn vào 5 mục tiêu đầu não: Tòa Đại sứ Mỹ (Đội 11), Dinh Độc Lập (Đội 5), Đài Phát thanh (Đội 4), Bộ Tổng Tham mưu (Đội 6-7), Bộ Tư lệnh Hải quân (Đội 3). Cơ chế tương tác lựa chọn nhận thức (Perspective Choices) không trừng phạt đúng/sai mà đưa ra phản hồi suy ngẫm (Reflection Feedback).
   - Lesson 3 tích hợp Interactive Archive Map với các di tích lịch sử có thật tại TP.HCM: Hầm 287/70 Trần Quý Cáp, Tiệm phở Bình (7 Yên Đổ), Cơm tấm Đỗ Phủ (113A Đặng Dung), Tiệm may Quốc Anh (65 Nguyễn Bỉnh Khiêm).
   - Lesson 4 tổng hợp sâu sắc về tác động truyền thông Mỹ (phát biểu của Walter Cronkite trên CBS News ngày 27/2/1968, tuyên bố ngày 31/3/1968 của Tổng thống Lyndon B. Johnson ngừng ném bom miền Bắc và rút lui không tái tranh cử, mở đường cho đàm phán Paris).
4. **Về Ngân hàng câu hỏi đánh giá Lesson 5 (Mục 3.5, dòng 110–150):**  
   Gồm 5 câu hỏi trắc nghiệm kiểm tra toàn diện 4 CLO. Đặc biệt, Câu 4 giải thích nguyên nhân lịch sử khiến Quân khu 5 và Tây Nguyên nổ súng sớm hơn một ngày so với Nam Bộ là do sự khác biệt giữa múi giờ GMT+7 (Hà Nội, tháng 11 âm thiếu 29 ngày) và GMT+8 (Sài Gòn, tháng 11 âm đủ 30 ngày) trong năm Đinh Mùi. Tại dòng 137, phần giải thích Câu 3 ghi: *"Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là đường Võ Văn Tần / Nguyễn Đình Chiểu, Quận 3)..."*.
5. **Về Khế ước dữ liệu kỹ thuật (Mục 4, dòng 153–200):**  
   Định nghĩa rõ ràng model dữ liệu Chapter và luồng điều hướng (Navigation Flow) khớp với `05-domain-type-contract.md`.
6. **Về Danh mục nguồn lịch sử (Mục 5, dòng 202–220):**  
   Trích dẫn đầy đủ các nguồn chính sử: Viện Lịch sử Quân sự Việt Nam (Tập V, Tập II), Lịch sử Nam Bộ kháng chiến (Tập 2), Bộ Chỉ huy Quân sự TP.HCM, Quyết định số 1288-VH/QĐ của Bộ Văn hóa, Văn kiện Đảng Toàn tập (Tập 29), Bảo tàng Biệt động Sài Gòn — Gia Định.

---

## 2. LOGIC CHAIN (Chuỗi lập luận thẩm định)

1. **Từ Quan sát 1 & 3 → Đánh giá Mục tiêu và Nội dung Lịch sử:**  
   Bốn CLO và nội dung của Lesson 1–4 bám sát tuyệt đối đường lối của Đảng (Nghị quyết Trung ương lần thứ 14, BCHTW Đảng khóa III) và SGK Lịch sử 12. Việc phân định ranh giới (chỉ tập trung nội đô Sài Gòn, không dàn trải sang Huế hay nông thôn) hoàn toàn phù hợp với yêu cầu của một MVP micro-learning ngắn gọn nhưng sâu sắc.
2. **Từ Quan sát 4 → Đánh giá Ngân hàng Câu hỏi Khảo thí:**  
   Các câu hỏi trắc nghiệm được thiết kế có tính phân hóa cao. Các phương án nhiễu đều là những ngộ nhận có thật của học sinh hoặc các mốc lịch sử kinh điển (1945, 1946, 1975). Việc đưa nguyên nhân độ lệch múi giờ GMT+7 vs GMT+8 vào Câu 4 thể hiện tư duy học thuật xuất sắc, giải tỏa một trong những câu hỏi hóc búa nhất của lịch sử Mậu Thân 1968.
3. **Từ Quan sát 4 (Dòng 137) → Phát hiện Minor-01:**  
   Thực tế địa danh học tại TP.HCM: đường Trần Quý Cáp được đổi tên thành đường Võ Văn Tần; đường Phan Đình Phùng được đổi tên thành đường Nguyễn Đình Chiểu. Căn nhà 287/70 Trần Quý Cáp nay mang địa chỉ chính thức số 287/70 đường Võ Văn Tần, Phường 5, Quận 3 (có lối đi thông sang hẻm đường Nguyễn Đình Chiểu). Diễn đạt *"nay là đường Võ Văn Tần / Nguyễn Đình Chiểu"* có thể gây hiểu lầm rằng một con đường được đổi thành hai tên. Cần chỉnh sửa rõ ràng.
4. **Từ Quan sát 2 & 3 → Phát hiện Minor-03:**  
   Lesson 4 có phần tổng kết, phân tích ý nghĩa địa chính trị; Lesson 5 có phần phản hồi sư phạm giải thích vì sao distractor sai. Theo định nghĩa tại `03-historical-media-governance.md` (§4.1), những phần này mang bản chất `educational_explanation`. Do đó việc chỉ gán nhãn duy nhất `verified_fact` là chưa đầy đủ, cần bổ sung nhãn `educational_explanation` để đảm bảo tính nhất quán đa tầng.
5. **Từ Quan sát 3 (Dòng 407) và Quan sát 6 → Phát hiện Minor-02:**  
   Bài học 3 giới thiệu 4 địa điểm di tích: Hầm 287/70, Tiệm phở Bình, Cơm tấm Đỗ Phủ và Tiệm may Quốc Anh. Tuy nhiên, Mục 5 chỉ nêu quyết định xếp hạng cho Hầm 287/70 và Tiệm phở Bình mà chưa bổ sung nguồn hồ sơ quản lý của Bảo tàng Biệt động Sài Gòn cho Cơm tấm Đỗ Phủ (113A Đặng Dung) và Tiệm may Quốc Anh (65 Nguyễn Bỉnh Khiêm). Cần bổ sung để bảo đảm nguyên tắc truy xuất 100% nguồn gốc di tích.
6. **Từ Quan sát 5 và Phase 5 Contract → Phát hiện Minor-04:**  
   Các câu hỏi trắc nghiệm tại Mục 3.5 nên được gán định danh kỹ thuật tường minh (`id: q-mt68-01` đến `05`, `difficulty: intro / standard / advanced`) để phục vụ việc chuyển giao trực tiếp cho Member 4 (Frontend) và Member 5 (QA) mà không cần bước ánh xạ trung gian.

---

## 3. CAVEATS (Phạm vi giới hạn & Giả định)

- Đợt thẩm định này tập trung vào tính chuẩn xác lịch sử, tính sư phạm và khế ước kỹ thuật của văn bản thiết kế `CURRICULUM-MAP.md`.
- Quá trình thẩm định không bao gồm việc kiểm thử mã nguồn frontend (React/TypeScript component) hay backend database table, các hạng mục này thuộc thẩm quyền của các kỹ sư chuyên trách trong các phase tiếp theo.
- Toàn bộ việc đối chiếu sử liệu được thực hiện dựa trên các nguồn xuất bản chính thống của Nhà nước và Đảng Cộng sản Việt Nam, coi đây là hệ quy chiếu chuẩn mực tối cao (Canonical Truth).

---

## 4. CONCLUSION (Kết luận thẩm định)

- **Đánh giá tổng thể:** **APPROVED (CHẤP THUẬN)**.
- **Thống kê lỗi:**
  - Critical: **0**
  - Major: **0**
  - Minor: **4** (Minor-01: Chú thích tên đường 287/70; Minor-02: Bổ sung hồ sơ Đỗ Phủ & Quốc Anh trong Source Register; Minor-03: Đồng bộ nhãn `educational_explanation` cho Lesson 4 & 5; Minor-04: Bổ sung metadata type contract cho Quiz).
  - Positive: **5** điểm sáng nổi bật.
- **Khuyến nghị hành động:** Bản đồ bài học đạt chất lượng xuất sắc, hoàn toàn đủ điều kiện làm khung kiến trúc nội dung cho Chapter MVP Mậu Thân 1968. Đề nghị tác giả cập nhật 4 điểm Minor nói trên vào bản hoàn thiện tiếp theo.

---

## 5. VERIFICATION METHOD (Phương pháp kiểm chứng độc lập)

Để độc lập kiểm chứng các kết luận trong báo cáo này:
1. **Kiểm tra văn bản nguồn:** Mở tập tin `docs/content/CURRICULUM-MAP.md` và kiểm tra các dòng trích dẫn: dòng 21–27 (CLO), dòng 42–49 (Sequencing Table), dòng 54–109 (Lesson specs), dòng 110–150 (Quiz), dòng 202–220 (Source Register).
2. **Kiểm tra tính chính xác lịch sử của Quyết định 1288-VH/QĐ:** Tra cứu Cục Di sản văn hóa / Bộ VHTTDL về Di tích lịch sử cấp Quốc gia số 287/70 Võ Văn Tần (Trần Quý Cáp cũ), Phường 5, Quận 3, TP.HCM (Quyết định số 1288-VH/QĐ ngày 16/11/1988).
3. **Kiểm tra tính lịch pháp múi giờ GMT+7 vs GMT+8:** Tra cứu sách *Lịch và Lịch Việt Nam* hoặc tư liệu Viện Lịch sử Quân sự Việt Nam về sự chênh lệch tháng 11 âm lịch năm Đinh Mùi giữa hai miền Nam - Bắc.
4. **Kiểm tra báo cáo ứng viên chi tiết:** Đọc tập tin `.agents/teamwork/segment_curriculum_map/handoff_4.md`.
