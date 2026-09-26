**Segment scope**: `docs/content/CURRICULUM-MAP.md` (toàn bộ 5 phần: CURRICULUM_MAP_OVERVIEW, SEQUENCING, LESSON_SPECS, DATA_CONTRACTS, SOURCE_REGISTER; dòng 1–223).

# Potential Mistakes and Improvements

### 1. [Major] Thiếu chỉ dẫn sư phạm củng cố nhận thức nền tảng (Pre-instruction Grounding) cho câu hỏi lệch múi giờ Lịch âm (Quiz Câu 4)
- **Vị trí quan sát:** 
  - `docs/content/CURRICULUM-MAP.md`, Mục 3.1 (Bài học 1: Pilot Video, dòng 58–63) và Mục 3.2 (Bài học 2: Interactive Story, dòng 74–82) so với Mục 3.5 (Ngân hàng câu hỏi, Câu 4, dòng 138–143).
- **Phân tích vấn đề và tính liên kết sư phạm (Constructive Alignment):**
  - Câu hỏi 4 trong bài đánh giá cuối Chapter khảo sát một dữ kiện lịch sử chuyên sâu đặc biệt giá trị: nguyên nhân chiến trường Quân khu 5 và Tây Nguyên nổ súng sớm hơn một ngày (đêm 29 rạng sáng 30/1/1968) so với nội đô Sài Gòn và Nam Bộ (đêm 30 rạng sáng 31/1/1968) do sự khác biệt trong cách tính lịch âm năm Đinh Mùi giữa miền Bắc (múi giờ GMT+7, tháng 11 thiếu 29 ngày) và chính quyền Sài Gòn (múi giờ GMT+8, tháng 11 đủ 30 ngày).
  - Tuy nhiên, trong phần đặc tả chi tiết của Bài học 1 và Bài học 2, nội dung bài học chưa có chỉ dẫn rõ ràng yêu cầu truyền tải dữ kiện lịch pháp này thành kiến thức trực diện cho người học. Cụ thể: Mục 3.1 chỉ mô tả chung về không khí căng thẳng khi phát bài thơ chúc Tết của Bác Hồ và `RecapBlock` (dòng 63) chỉ nêu "3 điểm then chốt cần ghi nhớ" mà chưa định danh kiến thức múi giờ; Mục 3.2 tập trung hoàn toàn vào 5 mũi tiến công tại Sài Gòn.
  - Các phương án nhiễu của Câu 4 (*"lộ bí mật quân sự"*, *"lệnh điều động sai qua đường vô tuyến"*, *"thời tiết sương mù"*) là những giả định chiến thuật rất quen thuộc. Nếu người học không được cung cấp dữ kiện nền tảng này trong bài học trước đó, câu hỏi sẽ trở thành một "bẫy kiến thức" nằm ngoài phạm vi được giảng dạy, có nguy cơ kéo tỷ lệ vượt qua bài đánh giá lần đầu (`first-attempt accuracy`) xuống dưới ngưỡng 60% theo yêu cầu của Phase 1 Spec (§4.17).
- **Biện pháp khắc phục kiến nghị:**
  - Bổ sung một chỉ dẫn sư phạm rõ ràng vào `RecapBlock` của Bài 1 (dòng 63) hoặc phần dẫn nhập của Bài 2 (dòng 74):
    > *"Chỉ dẫn sư phạm bắt buộc: Trong phần tóm tắt kiến thức của Bài học 1 (RecapBlock), cần đưa vào thẻ ghi nhớ giải thích ngắn gọn hiện tượng chênh lệch lịch âm Đinh Mùi (miền Bắc đón Giao thừa trước miền Nam 1 ngày do áp dụng múi giờ GMT+7 so với GMT+8 của chính quyền Sài Gòn), tạo nền tảng nhận thức vững chắc để người học lý giải thời điểm nổ súng khác nhau giữa các chiến trường và tự tin hoàn thành Câu hỏi đánh giá số 4."*

---

### 2. [Major] Chưa đồng bộ nhãn phân loại nội dung (`verified_fact` vs `educational_explanation`) tại Bảng phân đoạn Bài 4 và Bài 5
- **Vị trí quan sát:** 
  - `docs/content/CURRICULUM-MAP.md`, Mục 2 (Bản đồ trình tự bài học), Bảng tổng hợp dòng 47 và dòng 48.
- **Phân tích sai lệch quy chuẩn dữ liệu (Domain Type Contract & Historical Governance):**
  - Căn cứ Quy chuẩn Phân loại Sự thật Lịch sử tại `docs/specs/phases/03-historical-media-governance.md` (§4.1) và Hợp đồng Kiểu dữ liệu tại `docs/specs/phases/05-domain-type-contract.md` (§6 & §8):
    1. *Đối với Bài học 4 (`lesson-mt68-04-synthesis` — Bước ngoặt Paris):* Nội dung bài học không dừng lại ở việc liệt kê chuỗi sự kiện lịch sử thuần túy (`verified_fact`), mà cấu phần trọng tâm là các luận điểm phân tích chính trị, đánh giá tác động tâm lý dư luận Mỹ, phân tích phóng sự CBS News của Walter Cronkite và diễn giải ý nghĩa mở đường cho Hội nghị Paris 1973. Những nội dung phân tích tổng hợp này mang bản chất sư phạm và diễn giải lịch sử sâu sắc, thuộc lớp nhãn `educational_explanation`. Việc chỉ gán nhãn đơn nhất `verified_fact` là chưa bao quát đúng tính chất bài học.
    2. *Đối với Bài học 5 (`quiz-mt68-chapter-assessment` — Thử thách Mậu Thân 1968):* Đây là bài kiểm tra trắc nghiệm khách quan có tính điểm. Mặc dù câu hỏi và đáp án đúng là `verified_fact`, nhưng các phương án nhiễu (distractors) là những mệnh đề phi thực tế được xây dựng có chủ đích sư phạm, và đoạn giải thích sau câu hỏi (`explanation`) đóng vai trò củng cố tri thức, định hướng tư duy phản biện cho học sinh. Do đó, bài học này cần được phân loại kết hợp: `verified_fact` + `educational_explanation`.
  - Việc thiếu nhãn `educational_explanation` sẽ ảnh hưởng trực tiếp đến bộ lọc nhãn hiển thị (tag filter UI) và renderer component của Frontend (Member 4).
- **Biện pháp khắc phục kiến nghị:**
  - Cập nhật cột "Phân loại Nội dung" tại Bảng Mục 2:
    - Dòng 47 (Bài 4): Điều chỉnh thành `verified_fact` + `educational_explanation`.
    - Dòng 48 (Bài 5): Điều chỉnh thành `verified_fact` + `educational_explanation`.

---

### 3. [Major] Cân chỉnh trạng thái phê duyệt chất lượng (Quality Gate Status Alignment)
- **Vị trí quan sát:** 
  - `docs/content/CURRICULUM-MAP.md`, Khối Metadata dòng 9 và Khởi tạo Chapter Model dòng 176.
- **Trích dẫn nguyên văn:**
  ```markdown
  > **Trạng thái:** `APPROVED` / `PUBLISHED`
  ```
  ```typescript
  status: "published",
  ```
- **Phân tích quy trình quản trị dự án (Quality Gate Governance):**
  - Tài liệu `CURRICULUM-MAP.md` do Content Lead (Thọ - Member 1) biên soạn và đang trong quy trình bàn giao cho hội đồng thẩm định lịch sử và sư phạm (Historical & Pedagogical Review).
  - Việc tài liệu tự gán nhãn `APPROVED` / `PUBLISHED` ngay trong văn bản trước khi có báo cáo thẩm định và nghiệm thu chính thức tiềm ẩn nguy cơ vi phạm quy trình chốt chặn chất lượng (quality gate bypass). Trạng thái này có thể khiến các kỹ sư Frontend (Member 4) và QA (Member 5) hiểu nhầm rằng toàn bộ dữ liệu đã được chốt cứng và tiến hành import vào production mà không chờ các chỉnh sửa biên tập sau thẩm định.
- **Biện pháp khắc phục kiến nghị:**
  - Trong giai đoạn thẩm định, trạng thái tài liệu cần được ghi nhận là `IN_REVIEW` hoặc `PENDING_GATE_APPROVAL`.
  - Sau khi kết thúc đợt thẩm định và tích hợp đầy đủ các khuyến nghị biên tập của báo cáo này, tài liệu được chính thức phê duyệt nâng cấp trạng thái thành:
    ```markdown
    > **Trạng thái:** `APPROVED_BY_HISTORICAL_REVIEW` (Sẵn sàng triển khai sản xuất / Ready for Downstream Production)
    ```

---

# Minor Corrections and Typos

### 1. [Minor] Chuẩn hóa ngữ nghĩa hành chính địa danh Di tích Hầm 287/70 trong phần giải thích Câu hỏi 3
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.5, Câu hỏi 3 (dòng 137).
- **Trích dẫn nguyên văn:**
  ```markdown
  *Giải thích:* Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là đường Võ Văn Tần / Nguyễn Đình Chiểu, Quận 3) do Anh hùng LLVTND Trần Văn Lai cùng vợ đào ngụy trang...
  ```
- **Phân tích địa danh học:**
  - Sau năm 1975, đường Trần Quý Cáp được đổi tên thành đường **Võ Văn Tần**. Đường Phan Đình Phùng chạy song song được đổi tên thành đường **Nguyễn Đình Chiểu**.
  - Địa chỉ pháp lý chính thức được ghi nhận trong Bằng xếp hạng Di tích Lịch sử Quốc gia (Quyết định số 1288-VH/QĐ ngày 16/11/1988 của Bộ Văn hóa) là **Số 287/70 đường Võ Văn Tần, Phường 5, Quận 3**. Căn nhà này nằm trong hẻm thông suốt sang đường Nguyễn Đình Chiểu.
  - Việc viết dấu gạch chéo gộp đôi `"đường Võ Văn Tần / Nguyễn Đình Chiểu"` dễ gây hiểu nhầm rằng đường Trần Quý Cáp có hai tên gọi cùng lúc hoặc làm lẫn lộn hai con đường khác nhau.
- **Biện pháp khắc phục kiến nghị:**
  - Hiệu chỉnh câu giải thích dòng 137 thành:
    ```markdown
    *Giải thích:* Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là số 287/70 đường Võ Văn Tần, Phường 5, Quận 3; có hẻm thông sang đường Nguyễn Đình Chiểu) do Anh hùng LLVTND Trần Văn Lai cùng vợ đào ngụy trang, cất giấu gần 2 tấn vũ khí bí mật an toàn ngay sát nách đối phương suốt nhiều năm.
    ```

---

### 2. [Minor] Bổ sung căn cứ tham chiếu cho Quán cơm tấm Đỗ Phủ và Tiệm may Quốc Anh trong Source Register
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.3 (Bài học 3, dòng 95) so với Mục 5 (Source Register, dòng 213–220).
- **Phân tích tính đầy đủ của nguồn đối soát:**
  - Trong Bài học 3 (dòng 95), tài liệu có đưa vào 2 địa chỉ đỏ quan trọng của Biệt động Sài Gòn: *Cơ sở hộp thư liên lạc Cơm tấm Đỗ Phủ (113A Đặng Dung)* và *Trạm xuất kích Tiệm may Quốc Anh (65 Nguyễn Bỉnh Khiêm)*.
  - Tuy nhiên, tại Mục 5 (Source Register), Tiểu mục 4 mới chỉ liệt kê quyết định xếp hạng di tích quốc gia cho Hầm vũ khí 287/70 và Tiệm phở Bình, chưa có dòng tham chiếu hồ sơ lưu trữ cho 2 cơ sở trên. Theo quy định tại Phase 3 Spec (§4.2 Tier 1 & 2), mọi địa danh di tích lịch sử xuất hiện trong chương trình học cần có nguồn tham chiếu rõ ràng trong Source Register.
- **Biện pháp khắc phục kiến nghị:**
  - Bổ sung vào Tiểu mục 5.4 hoặc Tiểu mục 5.6:
    > *- Hồ sơ Di tích Biệt động Sài Gòn: Hộp thư bí mật và Hầm nổi tại Quán Cơm tấm Đỗ Phủ — Cà phê Đỗ Phủ (Số 113A Đặng Dung, Phường Tân Định, Quận 1) và Trạm xuất kích Tiệm may Quốc Anh (Số 65 Nguyễn Bỉnh Khiêm, Quận 1) theo hồ sơ tư liệu của Bảo tàng Biệt động Sài Gòn — Gia Định.*

---

### 3. [Minor] Chuẩn hóa mã định danh (`questionId`) và thuộc tính khảo thí cho Ngân hàng câu hỏi
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.5 (Ngân hàng Câu hỏi Khảo thí, dòng 120–150).
- **Phân tích khế ước kỹ thuật:**
  - Các câu hỏi hiện đang được đánh số văn bản thủ công (`1. *Câu 1 (Mục tiêu CLO-1):*`,...).
  - Để hỗ trợ Member 4 (Frontend) và Member 5 (QA) nạp dữ liệu chính xác theo Domain Type Contract tại `docs/specs/phases/05-domain-type-contract.md` (§8 `MultipleChoiceQuestion`), mỗi câu hỏi cần có `id` định danh duy nhất và phân định cấp độ nhận thức.
- **Biện pháp khắc phục kiến nghị:**
  - Bổ sung metadata chuẩn hóa cho từng câu hỏi trong Mục 3.5:
    - Câu 1: `[ID: q-mt68-01-clo1] | Độ khó: intro | Nguồn: Văn kiện Đảng / SGK 12`
    - Câu 2: `[ID: q-mt68-02-clo2] | Độ khó: intro | Nguồn: Lịch sử Nam Bộ kháng chiến`
    - Câu 3: `[ID: q-mt68-03-clo3] | Độ khó: standard | Nguồn: Hồ sơ Di tích QĐ 1288-VH/QĐ`
    - Câu 4: `[ID: q-mt68-04-clo1] | Độ khó: advanced | Nguồn: Lịch sử Kháng chiến chống Mỹ Tập V`
    - Câu 5: `[ID: q-mt68-05-clo4] | Độ khó: standard | Nguồn: Nghị quyết Trung ương 14 / SGK 12`

---

### 4. [Minor] Đồng bộ thời lượng ước tính tổng thể Chapter giữa Model kỹ thuật và Giao diện người học
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 4.2 (Chapter Model, dòng 175) so với Mục 2 (Bảng trình tự bài học, dòng 44–48).
- **Phân tích nhịp độ học tập:**
  - Trong Model TypeScript (dòng 175), trường `estimatedMinutes` được khai báo là số nguyên cố định: `25`.
  - Trong khi đó, tổng thời lượng cộng gộp từ các bài học lẻ trong Bảng Mục 2 là: Bài 1 (3–4p) + Bài 2 (7–8p) + Bài 3 (5–6p) + Bài 4 (5–6p) + Bài 5 (4–5p) = 24 – 29 phút.
  - Con số `25` phút là hoàn toàn tối ưu và phù hợp với tiêu chuẩn micro-learning. Tuy nhiên, để đảm bảo tính nhất quán trên UI hiển thị cho học sinh, nên bổ sung một trường ghi chú hoặc thuộc tính hiển thị (display label) linh hoạt.
- **Biện pháp khắc phục kiến nghị:**
  - Bổ sung ghi chú hiển thị giao diện trong đặc tả Chapter Model: `estimatedMinutesDisplay: "25 – 30 phút"`, giúp học sinh chủ động phân bổ thời gian học tập mà không cảm thấy bị thúc ép về mặt thời gian.
