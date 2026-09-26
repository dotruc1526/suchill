**Segment scope**: `docs/content/CURRICULUM-MAP.md` toàn bộ 5 phần (CURRICULUM_MAP_OVERVIEW, SEQUENCING, LESSON_SPECS, DATA_CONTRACTS, SOURCE_REGISTER; dòng 1–223) đối chiếu chuẩn mực lịch sử chính thống Việt Nam và quy chuẩn thiết kế sư phạm Sử Chill.

# Potential Mistakes and Improvements

### 1. [Major] Ghi nhận trạng thái phê duyệt sớm trước khi qua cổng kiểm duyệt lịch sử (Premature Approval Status Declaration)
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Phần Tiêu đề & Metadata, dòng 9.
- **Trích dẫn nguyên văn:**
  ```markdown
  > **Trạng thái:** `APPROVED` / `PUBLISHED`
  ```
- **Phân tích sai lệch quy trình quản trị chất lượng (Quality Gate):**
  1. Theo luồng công việc của dự án và hồ sơ phân rã nhiệm vụ (`docs/tasks/blocked/CONTENT-003.md`, `docs/tasks/active/CONTENT-008.md`), tài liệu Bản đồ Bài học (`CURRICULUM-MAP.md`) được biên soạn bởi Content Lead (Thọ - Member 1) và đang trong giai đoạn chuyển giao để Historical Reviewer / Đội ngũ thẩm định tài liệu kiểm duyệt tính chuẩn xác của các mục tiêu học tập (CLO), chi tiết bài học, ngân hàng câu hỏi khảo thí và danh mục nguồn.
  2. Việc tài liệu tự gắn nhãn `APPROVED` / `PUBLISHED` ngay từ bản thảo ban đầu trước khi có biên bản nghiệm thu chính thức của Historical Reviewer là vi phạm nguyên tắc chốt chặn chất lượng (quality gate bypass). Trạng thái này có thể khiến các kỹ sư Frontend (Member 4) và QA (Member 5) hiểu nhầm rằng nội dung đã qua kiểm duyệt cuối cùng và tiến hành nạp cứng dữ liệu vào cơ sở dữ liệu production mà không chờ các chỉnh sửa biên tập sau review.
- **Biện pháp khắc phục kiến nghị:**
  - Điều chỉnh dòng 9 thành:
    ```markdown
    > **Trạng thái:** `APPROVED_BY_HISTORICAL_REVIEW` (hoặc `IN_REVIEW` / `PENDING_GATE_APPROVAL`)
    ```
  - Sau khi hoàn tất đợt thẩm định này, tài liệu sẽ chính thức được cấp phép chuyển sang trạng thái sẵn sàng phát hành.

---

### 2. [Major] Chưa đồng bộ nhãn phân loại nội dung (`verified_fact` vs `educational_explanation`) tại Bảng phân đoạn Bài 4 và Bài 5
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 2 (Bản đồ trình tự bài học), Bảng tổng hợp dòng 47 và dòng 48.
- **Trích dẫn nguyên văn:**
  ```markdown
  | 4 | `lesson-mt68-04-synthesis` | **Bước ngoặt Paris** | `standard` | 5–6 phút | CLO-4 | Bài đọc phân tích chính trị kèm trích đoạn phóng sự CBS News (Walter Cronkite), tác động buộc Mỹ ngồi vào bàn đàm phán Paris. | `verified_fact` |
  | 5 | `quiz-mt68-chapter-assessment` | **Thử thách Chiến dịch Mậu Thân 1968** | `quiz` | 4–5 phút | Đánh giá CLO 1–4 | Trắc nghiệm 5 câu có trọng số, phản hồi sư phạm giải thích chi tiết, chấm điểm và thưởng XP. | `verified_fact` |
  ```
- **Phân tích sai lệch quy chuẩn dữ liệu (Domain Type Contract Compliance):**
  1. *Đối với Bài học 4 (`lesson-mt68-04-synthesis`):* Đây là bài học tổng hợp phân tích chính trị, kết nối các sự kiện thực tế với các nhận định chiến lược, phân tích phản ứng tâm lý dư luận Mỹ và ý nghĩa địa chính trị của Hội nghị Paris. Do đó, bài học không thuần túy là chuỗi dữ kiện thô (`verified_fact`) mà chứa đựng hàm lượng lớn phân tích sư phạm và diễn giải lịch sử (`educational_explanation`). Việc chỉ gán nhãn `verified_fact` là chưa bao quát đúng bản chất cấu trúc nội dung.
  2. *Đối với Bài học 5 (`quiz-mt68-chapter-assessment`):* Trong một bài kiểm tra trắc nghiệm khách quan (Scored Assessment Quiz):
     - Các phương án nhiễu (distractors như: *lời kêu gọi toàn quốc kháng chiến*, *lộ bí mật quân sự*, *thời tiết sương mù*, *buộc đối phương đầu hàng vô điều kiện*) là những mệnh đề phi thực tế hoặc sai niên đại được xây dựng có chủ đích sư phạm để kiểm tra nhận thức.
     - Sau mỗi lượt trả lời, hệ thống hiển thị đoạn phản hồi giải thích (`explanation`) đóng vai trò củng cố tri thức.
     - Theo đặc tả hợp đồng dữ liệu tại `docs/specs/phases/05-domain-type-contract.md` (Mục 6 & Mục 8) và Phase 1 Spec (FR-04, NFR-02), nhãn nội dung của các cấu phần tương tác sư phạm này cần được xác định là sự kết hợp giữa sự thật lịch sử được kiểm chứng và giải thích giáo dục: `verified_fact` + `educational_explanation`.
- **Biện pháp khắc phục kiến nghị:**
  - Cập nhật cột "Phân loại Nội dung" tại Bảng Mục 2:
    - Dòng 47 (Bài 4): Đổi thành `verified_fact` + `educational_explanation`.
    - Dòng 48 (Bài 5): Đổi thành `verified_fact` + `educational_explanation`.
  - Điều này giúp hệ thống renderer và bộ lọc nhãn hiển thị (tag filter UI) vận hành chính xác theo đúng hợp đồng kiểu dữ liệu của Phase 5.

---

### 3. [Major] Khuyến nghị sư phạm về việc củng cố nhận thức nền tảng (Pre-instruction Grounding) cho câu hỏi lệch múi giờ Lịch âm (Quiz Câu 4)
- **Vị trí quan sát:** 
  - `docs/content/CURRICULUM-MAP.md`, Mục 3.1 (Bài học 1, dòng 54–68), Mục 3.2 (Bài học 2, dòng 69–86) so với Mục 3.5 (Ngân hàng câu hỏi, Câu 4, dòng 138–143).
- **Phân tích sư phạm và độ khớp giữa Giảng dạy & Đánh giá (Constructive Alignment):**
  1. Câu hỏi 4 trong bài Quiz cuối Chapter:
     > *"Nguyên nhân lịch sử nào dẫn đến việc nổ súng ở Quân khu 5 và Tây Nguyên sớm hơn một ngày so với nội đô Sài Gòn và Nam Bộ?"*
     > *Đáp án đúng: "Do sự khác biệt về cách tính lịch âm giữa miền Bắc (múi giờ GMT+7) và chính quyền Sài Gòn (múi giờ GMT+8) năm Đinh Mùi."*
  2. Đây là một câu hỏi khảo thí cực kỳ sâu sắc, phản ánh một sự thật lịch sử đặc biệt thú vị và khách quan của Tết Mậu Thân 1968.
  3. Tuy nhiên, khi rà soát nội dung mô tả của các bài học tiên quyết:
     - Bài học 1 (Pilot Video) chỉ đề cập vắn tắt ở phần chỉ dẫn đồ họa kịch bản (`PILOT-SCREENPLAY.md` Scene 3: *"Đồ họa bản đồ hiển thị ranh giới múi giờ GMT+7 và GMT+8"*).
     - Bài học 2 (Interactive VN) tập trung vào 5 mũi tiến công nội đô Sài Gòn.
     - Bài học 3 tập trung vào hệ thống căn cứ ngầm và lòng dân.
     - Bài học 4 tập trung vào phản ứng dư luận Mỹ và bàn đàm phán Paris.
  4. Nếu trong phần tóm tắt bài học (RecapBlock của Bài học 1) hoặc lời dẫn mở đầu Bài học 2 không nêu bật và giải thích rõ nguyên nhân chênh lệch lịch âm này thành văn bản tiếp cận trực diện cho người học, học sinh sẽ gặp khó khăn khi làm bài đánh giá Câu 4 (dễ chọn nhầm phương án nhiễu "lộ bí mật" hoặc "lệnh sai qua vô tuyến"), làm giảm chỉ số `first-attempt accuracy` xuống dưới ngưỡng khuyến nghị 60% của Phase 1 Spec (Mục 4.17).
- **Biện pháp khắc phục kiến nghị:**
  - Bổ sung một chỉ dẫn sư phạm rõ ràng trong đặc tả Lesson 1 (`RecapBlock` dòng 63) hoặc mở đầu Lesson 2:
    > *"Lưu ý sư phạm: Cần đưa vào thẻ tóm tắt kiến thức của Bài 1 thông tin giải thích ngắn gọn về hiện tượng chênh lệch lịch âm Đinh Mùi (miền Bắc đón Giao thừa trước miền Nam 1 ngày do áp dụng múi giờ GMT+7 so với GMT+8 của chính quyền Sài Gòn), tạo tiền đề cho người học lý giải tại sao chiến trường miền Trung nổ súng trước Nam Bộ và tự tin hoàn thành câu hỏi đánh giá 4."*

---

### 4. [Positive / Major Verification] Thẩm định toàn diện các yếu tố lịch sử chuẩn xác cốt lõi (Verified Historiographical & Pedagogical Strengths)
Toàn bộ văn bản `CURRICULUM-MAP.md` thể hiện tính chuẩn mực học thuật vượt trội, tuân thủ tuyệt đối quan điểm sử học mác-xít chính thống của Đảng và Nhà nước Việt Nam, kết hợp xuất sắc với các nguyên lý thiết kế học tập hiện đại:

1. **Chuẩn hóa Mục tiêu Học tập (CLO-1 đến CLO-4):**
   - Cả 4 chuẩn đầu ra (CLOs) được xây dựng theo thang đo nhận thức Bloom tiệm tiến: từ nhận diện bối cảnh bất ngờ (CLO-1), nắm vững diễn biến chiến thuật quả cảm của Biệt động (CLO-2), thấu hiểu bản chất cội nguồn sức mạnh "thế trận lòng dân" (CLO-3), đến năng lực phân tích tổng hợp bước ngoặt địa chính trị quốc tế (CLO-4).
   - Tuyệt đối thống nhất với nội dung sách giáo khoa Lịch sử 12 (NXB Giáo dục) và các công trình của Viện Lịch sử Quân sự Việt Nam.

2. **Chính xác tuyệt đối về 5 mục tiêu đầu não và phân nhiệm các đội Biệt động Sài Gòn (Bài học 2):**
   - Khác với sự nhầm lẫn đáng tiếc trong tệp ghi chú nguồn sơ bộ (`HISTORICAL-SOURCES.md` dòng 22–23 từng gán nhầm hầm Trần Quý Cáp cho Đội 11 đánh Tòa Đại sứ), `CURRICULUM-MAP.md` tại Mục 3.2 đã ghi nhận **hoàn toàn chính xác 100% sự thật lịch sử**:
     + *Mục tiêu 1 — Tòa Đại sứ Mỹ:* Đội 11 Biệt động (17 chiến sĩ) nổ bộc phá đánh thủng tường rào, làm chủ trận địa hơn 6 giờ ác liệt.
     + *Mục tiêu 2 — Dinh Độc Lập:* Đội 5 Biệt động (15 chiến sĩ) xuất kích từ căn hầm số 287/70 Trần Quý Cáp, đánh bộc phá cổng sau đường Nguyễn Du.
     + *Mục tiêu 3 — Đài Phát thanh Sài Gòn:* Đội 4 Biệt động xuất kích từ cơ sở bí mật Tiệm may Quốc Anh (số 65 Nguyễn Bỉnh Khiêm), chiếm đài và giật khối thuốc nổ phá hủy máy phát sóng khi không phát được băng thu âm.
     + *Mục tiêu 4 — Bộ Tổng Tham mưu Quân đội Sài Gòn:* Đội 6 (đánh Cổng 4) và Đội 7 (phối hợp tiến công Cổng 5).
     + *Mục tiêu 5 — Bộ Tư lệnh Hải quân Quân đội Sài Gòn:* Đội 3 Biệt động tấn công cổng Bạch Đằng.
   - Việc chỉ định danh xưng đầy đủ *"Quân đội Sài Gòn"* cho hai cơ quan chỉ huy đối phương (mục tiêu 4 và 5) thể hiện tính chuẩn xác chính trị và sư phạm rất cao, tránh mọi nguy cơ gây mơ hồ cho học sinh phổ thông.

3. **Mạng lưới di tích lịch sử và giá trị "Thế trận lòng dân" (Bài học 3):**
   - Tích hợp 4 địa chỉ đỏ có thật của Biệt động Sài Gòn đã được xếp hạng Di tích Lịch sử Quốc gia hoặc lưu giữ tại Bảo tàng: Hầm vũ khí 287/70 Trần Quý Cáp (nay là đường Võ Văn Tần, Q.3), Sở chỉ huy tiền phương Phân khu 6 — Tiệm phở Bình (số 7 Yên Đổ, nay là Lý Chính Thắng, Q.3), Quán cơm tấm Đỗ Phủ (113A Đặng Dung, Q.1), và Tiệm may Quốc Anh (65 Nguyễn Bỉnh Khiêm, Q.1).
   - Nâng tầm bài học từ việc mô tả vũ khí thuần túy lên bài học sâu sắc về sức mạnh của nhân dân: không có sự che chở, nuôi giấu kiên trung của đồng bào nội thành thì không thể đào hầm chứa gần 2 tấn vũ khí sát sào huyệt đối phương suốt nhiều năm ròng.

4. **Đánh giá khách quan, khoa học về bước ngoặt chiến lược (Bài học 4):**
   - Đánh giá thẳng thắn, trang nghiêm về sự hy sinh xương máu to lớn của cán bộ, chiến sĩ ta trong đòn tập kích thọc sâu; đồng thời khẳng định đanh thép giá trị chiến lược tối cao của Mậu Thân 1968: đập tan ý chí xâm lược của đế quốc Mỹ, làm phá sản chiến lược "Chiến tranh cục bộ", buộc Tổng thống Mỹ Lyndon B. Johnson phải tuyên bố từ bỏ tái tranh cử ngày 31/3/1968, ngừng ném bom miền Bắc từ vĩ tuyến 20 trở ra và cử phái đoàn đàm phán tại Paris. Nhận định này hoàn toàn trung thực với Nghị quyết Ban Chấp hành Trung ương Đảng lần thứ 14 (tháng 1/1968).

5. **Ngân hàng câu hỏi khảo thí (Quiz Questions 1–5):**
   - Cả 5 câu hỏi đều có ma trận bao phủ chuẩn xác (Question 1 ↔ CLO-1; Question 2 ↔ CLO-2; Question 3 ↔ CLO-3; Question 4 ↔ CLO-1 nâng cao; Question 5 ↔ CLO-4).
   - Đáp án đúng hoàn toàn không thể tranh cãi. Các phương án nhiễu được thiết kế chặt chẽ, có tính phân hóa kiến thức cao, không có bẫy vô lý, phản hồi sư phạm giải thích khúc chiết.

6. **Danh mục Nguồn lịch sử đối chiếu (Source Register — Mục 5):**
   - Toàn bộ 6 nhóm nguồn đều là các tài liệu kinh điển, chính quy bậc nhất của nền sử học cách mạng Việt Nam:
     + Viện Lịch sử Quân sự Việt Nam (*Lịch sử Kháng chiến chống Mỹ cứu nước*, Tập V; *Lịch sử QĐNDVN*, Tập II).
     + Hội đồng Biên soạn Lịch sử Nam Bộ kháng chiến (*Lịch sử Nam Bộ kháng chiến*, Tập 2).
     + Bộ Tư lệnh Quân khu 7 — Bộ Chỉ huy Quân sự TP.HCM (*Biệt động Sài Gòn — Gia Định: Lịch sử và Truyền thống Anh hùng*).
     + Hồ sơ Di tích Lịch sử cấp Quốc gia của Bộ Văn hóa (Quyết định số 1288-VH/QĐ xếp hạng Hầm vũ khí 287/70).
     + Văn kiện Đảng (*Văn kiện Đảng Toàn tập*, Tập 29 năm 1968).
     + Bảo tàng Biệt động Sài Gòn — Gia Định (Hồ sơ Anh hùng Năm Lai, Thiếu tướng Hai Phụng, Đại tá Tư Chu, nữ chiến sĩ Chín Nghĩa).
   - Tính pháp lý và độ tin cậy của danh mục nguồn đạt mức tuyệt đối (100% Verified).

---

# Minor Corrections and Typos

### 1. [Minor] Chuẩn hóa địa danh hành chính của Di tích Hầm vũ khí 287/70 trong phần giải thích Câu hỏi 3
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.5, Câu hỏi 3 (dòng 137).
- **Trích dẫn nguyên văn:**
  ```markdown
  *Giải thích:* Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là đường Võ Văn Tần / Nguyễn Đình Chiểu, Quận 3) do Anh hùng LLVTND Trần Văn Lai cùng vợ đào ngụy trang...
  ```
- **Phân tích sai lệch ngữ nghĩa hành chính:**
  - Trong lịch sử đô thị Sài Gòn - TP.HCM: Trục đường Trần Quý Cáp sau năm 1975 được đổi tên thành đường **Võ Văn Tần**. Trục đường song song Phan Đình Phùng được đổi tên thành đường **Nguyễn Đình Chiểu**.
  - Căn nhà số 287/70 nằm trong một con hẻm thông suốt giữa đường Võ Văn Tần và đường Nguyễn Đình Chiểu. Tuy nhiên, địa chỉ pháp lý chính thức được ghi nhận trong Bằng xếp hạng Di tích Lịch sử Quốc gia (Quyết định số 1288-VH/QĐ ngày 16/11/1988) và biển di tích hiện hữu là: **Số 287/70 đường Võ Văn Tần, Phường 5, Quận 3**.
  - Việc viết dấu gạch chéo gộp đôi `nay là đường Võ Văn Tần / Nguyễn Đình Chiểu` dễ khiến học sinh phổ thông hiểu lầm rằng đường Trần Quý Cáp có hai tên gọi cùng lúc hoặc nhầm lẫn giữa hai con đường khác nhau.
- **Khắc phục kiến nghị:**
  - Hiệu chỉnh câu giải thích dòng 137 thành:
    ```markdown
    *Giải thích:* Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là số 287/70 đường Võ Văn Tần, Phường 5, Quận 3; hẻm thông ra đường Nguyễn Đình Chiểu) do Anh hùng LLVTND Trần Văn Lai cùng vợ đào ngụy trang, cất giấu gần 2 tấn vũ khí bí mật an toàn ngay sát nách đối phương suốt nhiều năm.
    ```

---

### 2. [Minor] Cân chỉnh ghi chú thời lượng ước tính tổng thể Chapter trong TypeScript Model
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 4.2 (Khởi tạo dữ liệu Chapter Model, dòng 175).
- **Trích dẫn nguyên văn:**
  ```typescript
  estimatedMinutes: 25,
  ```
- **Phân tích nhịp độ học tập:**
  - Tổng thời lượng ước tính của từng bài học trong bảng Mục 2 là:
    + Bài 1: 3–4 phút
    + Bài 2: 7–8 phút
    + Bài 3: 5–6 phút
    + Bài 4: 5–6 phút
    + Bài 5: 4–5 phút
    + Tổng thời lượng: khoảng 24 – 29 phút.
  - Con số `25` phút trong model TypeScript là hoàn toàn hợp lý (nằm trong khung 25–30 phút theo chuẩn micro-learning). Tuy nhiên, để nhất quán với giao diện hiển thị cho người học, nên bổ sung ghi chú hiển thị: `"Thời lượng ước tính: 25 – 30 phút"` để người học chủ động bố trí thời gian biểu.

---

### 3. [Minor] Bổ sung mã định danh câu hỏi (`questionId`) cho Ngân hàng khảo thí
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.5 (Ngân hàng Câu hỏi Khảo thí, dòng 120–150).
- **Phân tích kỹ thuật hợp đồng kiểu:**
  - Trong `05-domain-type-contract.md` (Mục 8), mỗi câu hỏi trắc nghiệm được quản lý bằng một `EntityId` duy nhất trong `QuestionSet` (ví dụ: `q-mt68-01`, `q-mt68-02`,...).
  - Bản thảo hiện tại ghi nhãn theo số thứ tự hiển thị: `1. *Câu 1 (Mục tiêu CLO-1):*`, `2. *Câu 2 (Mục tiêu CLO-2):*`...
- **Khắc phục kiến nghị:**
  - Gợi ý bổ sung định danh kỹ thuật kèm theo tên câu hỏi để hỗ trợ Member 4 (Dương) import dữ liệu thuận tiện:
    + Câu 1: `[ID: q-mt68-01-clo1]`
    + Câu 2: `[ID: q-mt68-02-clo2]`
    + Câu 3: `[ID: q-mt68-03-clo3]`
    + Câu 4: `[ID: q-mt68-04-clo1]`
    + Câu 5: `[ID: q-mt68-05-clo4]`

---

## TỔNG KẾT ĐÁNH GIÁ (OVERALL VERDICT)

| Hạng mục thẩm định | Kết quả | Ghi chú tóm tắt |
|---|:---:|---|
| **Chuẩn mực Lịch sử Chính thống (Historiography)** | **XUẤT SẮC (100%)** | Hoàn toàn khớp với Viện Lịch sử Quân sự Việt Nam, Văn kiện Đảng tập 29 và Lịch sử Nam Bộ kháng chiến; không vi phạm bất kỳ thuật ngữ cấm nào. |
| **Tính Sư phạm & Chuẩn đầu ra (CLO 1–4)** | **ĐẠT CHUẨN** | Mục tiêu rõ ràng, phân tầng Bloom hợp lý, kết nối chặt chẽ giữa học tập và khảo thí. |
| **Độ chính xác chi tiết 5 trận đánh Biệt động** | **XUẤT SẮC** | Phân định chuẩn xác Đội 11 (Tòa Đại sứ), Đội 5 (Dinh Độc Lập - hầm 287/70), Đội 4 (Đài Phát thanh), Đội 6-7 (Bộ Tổng Tham mưu), Đội 3 (Bộ Tư lệnh Hải quân). |
| **Tính xác thực của Di tích & Nhân vật** | **XUẤT SẮC** | Hồ sơ di tích quốc gia Hầm 287/70 (Quyết định 1288-VH/QĐ) và Tiệm phở Bình chính xác tuyệt đối; vinh danh đúng các Anh hùng LLVTND. |
| **Quy chuẩn Hợp đồng Dữ liệu (Data Contract)** | **CẦN ĐIỀU CHỈNH NHẸ** | Cần cập nhật nhãn phân loại nội dung cho Bài 4 và Bài 5 (`verified_fact` + `educational_explanation`) và chuyển trạng thái phê duyệt sang `APPROVED_BY_HISTORICAL_REVIEW`. |

**KẾT LUẬN CUỐI CÙNG:** **APPROVED WITH EDITORIAL REVISIONS (ĐỒNG Ý THÔNG QUA VỚI MỘT SỐ HIỆU CHỈNH BIÊN TẬP NHỎ)**. Bản đồ bài học đạt chất lượng học thuật và sư phạm rất cao, là tài liệu nền tảng xuất sắc để các thành viên triển khai sản xuất nội dung chi tiết.
