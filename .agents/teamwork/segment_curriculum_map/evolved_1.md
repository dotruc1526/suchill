**Segment scope**: `docs/content/CURRICULUM-MAP.md` toàn bộ 5 phần (Tổng quan Chapter, Bản đồ trình tự bài học, Chi tiết từng bài học, Khế ước dữ liệu & chuyển giao kỹ thuật, Danh mục nguồn lịch sử đối chiếu; dòng 1–223) đối chiếu với Sử học chính thống Việt Nam và Khế ước Dữ liệu Phase 1, Phase 3, Phase 5.

# Potential Mistakes and Improvements

### 1. [Major] Trạng thái vòng đời thực thể ghi nhận sớm khi chưa qua cổng thẩm định lịch sử (Premature Publication Status & Quality Gate Bypass)
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Phần thông tin đầu trang (dòng 9) và Section 4.2 (dòng 176).
- **Trích dẫn nguyên văn:**
  - Dòng 9: `> **Trạng thái:** APPROVED / PUBLISHED`
  - Dòng 176 (trong đoạn mã TypeScript `chapterMauThan1968`): `status: "published",`
- **Phân tích vấn đề:**
  1. Theo Bảng theo dõi nhiệm vụ dự án (`docs/tasks/blocked/CONTENT-003.md`), nhiệm vụ kiểm duyệt lịch sử và truyền thông cho chapter pilot (CONTENT-003) hiện vẫn đang ở trạng thái `BLOCKED / Chưa gán Reviewer`, và nhiệm vụ sản xuất video (`CONTENT-007.md`) cũng đang bị `BLOCKED` chờ phê duyệt này.
  2. Theo Quy chuẩn quản trị lịch sử Phase 3 (`docs/specs/phases/03-historical-media-governance.md`, Mục 4.3) và Khế ước kiểu dữ liệu Phase 5 (`docs/specs/phases/05-domain-type-contract.md`, Mục 4.1 & 4.2): Vòng đời xuất bản của một thực thể nội dung (`PublishStatus`) phải trải qua các bước tuần tự: `"draft"` → `"in_review"` → `"approved"` → `"published"`.
  3. Việc bản đồ bài học tự gắn trạng thái `APPROVED / PUBLISHED` ngay từ khâu thiết kế khung nội dung của Member 1 khi chưa có biên bản thẩm định chính thức của Hội đồng Lịch sử (Historical Reviewer) là vi phạm nguyên tắc kiểm soát cổng chất lượng (quality gate bypass), dễ gây hiểu nhầm cho đội ngũ kỹ thuật (Member 4, Member 5) rằng nội dung đã sẵn sàng đóng gói đưa lên môi trường Production.
- **Biện pháp khắc phục kiến nghị:**
  - Điều chỉnh dòng 9 thành: `> **Trạng thái:** IN_REVIEW / PENDING_HISTORICAL_REVIEW (Chờ thẩm định CONTENT-003)` hoặc `APPROVED_FOR_REVIEW`.
  - Trong đoạn mã mẫu khởi tạo Chapter Model ở dòng 176, ghi rõ: `status: "in_review", // Sẽ chuyển sang "published" sau khi hoàn tất kiểm thử QA-005 và nghiệm thu CONTENT-003`.

---

### 2. [Major] Phân loại nhãn nội dung chưa bao quát đầy đủ các khối diễn giải sư phạm (Content Classification Inconsistencies)
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 2 (Bảng Bản đồ trình tự bài học, dòng 44, 47, 48) đối chiếu Mục 3.1, 3.4, 3.5 và Khế ước Phase 3 (`03-historical-media-governance.md`, Mục 4.1).
- **Trích dẫn nguyên văn:**
  - Dòng 44 (Lesson 1): `verified_fact`
  - Dòng 47 (Lesson 4): `verified_fact`
  - Dòng 48 (Lesson 5): `verified_fact`
- **Phân tích sai lệch phân loại theo chuẩn Phase 3:**
  1. *Đối với Lesson 1 (`lesson-mt68-01-video`):* Kịch bản phân cảnh chi tiết tại `PILOT-SCREENPLAY.md` (Scene 05, dòng 45) đã gắn nhãn chính xác là `verified_fact` + `educational_explanation` do chứa phần lời dẫn đúc kết ý nghĩa lịch sử và lời mời gọi chuyển tiếp sư phạm. Đồng thời, cấu trúc block của Lesson 1 (dòng 60–63) gồm 3 khối: `IntroBlock`, `VideoBlock`, và `RecapBlock`. Các khối mở đầu và tổng kết ghi nhớ (`RecapBlock`) mang tính chất sư phạm dẫn dắt (`educational_explanation`). Việc gắn nhãn duy nhất `verified_fact` cho toàn bộ bài học trong Bảng 2 là chưa bao quát.
  2. *Đối với Lesson 4 (`lesson-mt68-04-synthesis`):* Bài học là bài tổng hợp phân tích chính trị và ý nghĩa chiến lược của cuộc Tổng tiến công đối với bàn đàm phán Paris và phong trào phản chiến Mỹ. Mặc dù các cứ liệu lịch sử (tuyên bố của Walter Cronkite ngày 27/2/1968, bài phát biểu của Johnson ngày 31/3/1968) là `verified_fact`, nhưng toàn bộ lời bình luận, đúc kết bài học chiến lược và xâu chuỗi nguyên nhân - kết quả thuộc về `educational_explanation`. Gắn nhãn duy nhất `verified_fact` là không chuẩn xác theo định nghĩa của Phase 3.
  3. *Đối với Lesson 5 (`quiz-mt68-chapter-assessment`):* Đánh giá Scored Quiz bao gồm các phương án nhiễu giả định có tính hợp lý (plausible distractors) và các đoạn phản hồi giải thích sư phạm (`explanation`) phân tích bản chất lịch sử. Do đó, nhãn nội dung của bài kiểm tra nên là `verified_fact` (kiểm tra sự thật lịch sử) kết hợp `educational_explanation` (cho phần phản hồi giải thích).
- **Biện pháp khắc phục kiến nghị:**
  - Chuẩn hóa cột "Phân loại Nội dung" trong Bảng 2:
    - Lesson 1: `verified_fact` + `educational_explanation`
    - Lesson 2: `verified_fact` + `educational_explanation` (giữ nguyên hiện trạng, kèm phân định rõ ranh giới choice block)
    - Lesson 3: `verified_fact` (100% hồ sơ di tích và hiện vật lưu trữ)
    - Lesson 4: `verified_fact` + `educational_explanation` (sự kiện lịch sử kèm bình luận & phân tích chiến lược)
    - Lesson 5: `verified_fact` + `educational_explanation` (câu hỏi dựa trên sự thật, phản hồi mang tính sư phạm)

---

### 3. [Major] Thiếu định danh kỹ thuật (Technical Schema IDs) và siêu dữ liệu khảo thí trong Ngân hàng Câu hỏi Lesson 5
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.5 (Ngân hàng Câu hỏi Khảo thí, dòng 119–150) đối chiếu Mục 4.3 (dòng 198) và Khế ước Phase 5 (`05-domain-type-contract.md`, Mục 8).
- **Phân tích lỗ hổng bàn giao kỹ thuật:**
  1. Khế ước kỹ thuật cho Member 5 (Vinh — QA/Backend) tại dòng 198 quy định: *"Kiểm tra 100% câu hỏi Quiz có `correctOptionId` hợp lệ và có đoạn `explanation` giải thích."* Đồng thời Phase 5 quy định kiểu dữ liệu `MultipleChoiceQuestion` yêu cầu: `id`, `prompt`, `optionIds`, `explanation`, `sourceIds`, `difficulty`, `status`.
  2. Tuy nhiên, trong phần đặc tả Ngân hàng Câu hỏi ở Mục 3.5, 5 câu hỏi chỉ được đánh số thứ tự thông thường (1, 2, 3, 4, 5) và các lựa chọn gắn nhãn chữ cái (A, B, C, D) mà chưa được gán mã định danh thực thể chuẩn (`id: "q-mt68-01"`, `optionIds: ["opt-01-a", "opt-01-b", ...]`, `correctOptionId: "opt-01-b"`), chưa gán mức độ nhận thức (`difficulty: "intro" | "standard" | "advanced"`), và chưa liên kết trực tiếp với mã nguồn trích dẫn (`sourceIds`).
  3. Việc thiếu các trường ID chuẩn này trong tài liệu bàn giao sẽ khiến Member 4 (Frontend) và Member 5 (Backend) phải tự đặt mã thủ công không đồng bộ khi nạp dữ liệu (seed data), gây rủi ro gãy vỡ khóa ngoại hoặc sai lệch đáp án khi chấm điểm tự động.
- **Biện pháp khắc phục kiến nghị:**
  - Bổ sung cấu trúc dữ liệu JSON/TypeScript mẫu chuẩn hóa cho 5 câu hỏi trong Section 4.2 hoặc trực tiếp trong Mục 3.5:
    ```json
    {
      "id": "q-mt68-01",
      "learningObjectiveId": "CLO-1",
      "difficulty": "intro",
      "prompt": "Mật lệnh thiêng liêng nào được phát đi trên làn sóng Đài Tiếng nói Việt Nam trong đêm Giao thừa Tết Mậu Thân 1968 để báo hiệu cuộc Tổng tiến công bắt đầu?",
      "options": [
        { "id": "opt-01-a", "label": "Lời kêu gọi toàn quốc kháng chiến." },
        { "id": "opt-01-b", "label": "Bài thơ chúc Tết Xuân Mậu Thân của Chủ tịch Hồ Chí Minh." },
        { "id": "opt-01-c", "label": "Bản Tuyên ngôn Độc lập." },
        { "id": "opt-01-d", "label": "Hiệu lệnh từ Mặt trận Giải phóng miền Trung." }
      ],
      "correctOptionId": "opt-01-b",
      "explanation": "Đúng thời khắc Giao thừa Tết Mậu Thân 1968, Đài Tiếng nói Việt Nam phát bài thơ chúc Tết của Bác Hồ: 'Xuân này hơn hẳn mấy xuân qua... Tiến lên! Toàn thắng ắt về ta!'. Đây chính là mật mã quy ước phát lệnh tiến công đồng loạt.",
      "sourceIds": ["src-vov-tet1968", "src-lichsu-qndn-t2"]
    }
    ```

---

# Minor Corrections and Typos

### 1. [Minor] Điểm mờ địa danh lịch sử tại phần giải thích Câu 3 (Võ Văn Tần vs Nguyễn Đình Chiểu)
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.5, Câu 3 (dòng 137).
- **Trích dẫn nguyên văn:**
  `*Giải thích:* Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là đường Võ Văn Tần / Nguyễn Đình Chiểu, Quận 3) do Anh hùng LLVTND Trần Văn Lai cùng vợ đào ngụy trang...`
- **Phân tích địa danh lịch sử:**
  Sau năm 1975, đường **Trần Quý Cáp** được đổi tên thành đường **Võ Văn Tần**; còn đường **Phan Đình Phùng** mới được đổi tên thành đường **Nguyễn Đình Chiểu**. Con hẻm số 287 đường Võ Văn Tần có lối thông sang hẻm 212 đường Nguyễn Đình Chiểu, tuy nhiên địa chỉ hành chính chính thức và hồ sơ Di tích Lịch sử cấp Quốc gia (Quyết định số 1288-VH/QĐ) chỉ mang một tên duy nhất: **Số 287/70 đường Võ Văn Tần, Phường 5, Quận 3, TP.HCM** (như tác giả đã ghi rất đúng ở dòng 214). Việc ghi ghép `"đường Võ Văn Tần / Nguyễn Đình Chiểu"` ở dòng 137 dễ khiến người học lầm tưởng đường Trần Quý Cáp được đổi thành cả hai tên đường.
- **Biện pháp khắc phục kiến nghị:**
  Hiệu chỉnh dòng 137 thành:
  `*Giải thích:* Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là số 287/70 đường Võ Văn Tần, Phường 5, Quận 3, có lối thông sang hẻm đường Nguyễn Đình Chiểu) do Anh hùng LLVTND Trần Văn Lai cùng vợ...`

---

### 2. [Minor] Bổ sung số quyết định xếp hạng Di tích Tiệm phở Bình và chuẩn hóa tên cơ quan ban hành Quyết định 1288-VH/QĐ
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 5.4 (dòng 213–215).
- **Phân tích thông tin pháp lý di tích:**
  1. Di tích Sở chỉ huy tiền phương Phân khu 6 — Tiệm phở Bình (Số 7 Lý Chính Thắng, Quận 3) đã được Nhà nước xếp hạng là Di tích Lịch sử cấp Quốc gia cùng đợt vào ngày 16/11/1988 theo **Quyết định số 1288-VH/QĐ** của Bộ Văn hóa (cùng quyết định với Di tích Hầm vũ khí 287/70). Tuy nhiên tại dòng 215, văn bản mới chỉ ghi địa chỉ mà chưa ghi số quyết định bảo hộ pháp lý như dòng 214.
  2. Tại dòng 213 ghi cơ quan quản lý là `Bộ Văn hóa, Thể thao và Du lịch`. Vào thời điểm ban hành Quyết định 1288-VH/QĐ (năm 1988), tên gọi hành chính chính thức của cơ quan ban hành là **Bộ Văn hóa**.
- **Biện pháp khắc phục kiến nghị:**
  - Hiệu chỉnh tiêu đề dòng 213: `Hồ sơ Di tích Lịch sử Quốc gia (Bộ Văn hóa — nay là Bộ Văn hóa, Thể thao và Du lịch):`
  - Bổ sung số quyết định vào dòng 215:
    `- Di tích Lịch sử cấp Quốc gia: Sở Chỉ huy tiền phương Phân khu 6 trong Chiến dịch Mậu Thân 1968 — Tiệm phở Bình (Số 7 đường Lý Chính Thắng, Phường Võ Thị Sáu, Quận 3, TP.HCM — Quyết định số 1288-VH/QĐ ngày 16/11/1988 của Bộ Văn hóa).`

---

### 3. [Minor] Chuẩn hóa năm xuất bản cho các tài liệu thư mục trong Danh mục nguồn (Section 5)
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 5.1, 5.2, 5.5 (dòng 206–218).
- **Phân tích hoàn thiện thư mục:**
  Các đầu sách chính sử tại Mục 1, 2, 5 tuy đã ghi rõ tên sách và nhà xuất bản, nhưng chưa bổ sung năm xuất bản cụ thể (*Lịch sử Kháng chiến chống Mỹ cứu nước, Tập V* - NXB CTQG, 2002; *Lịch sử Nam Bộ kháng chiến, Tập 2* - NXB CTQG Sự thật, 2010; *Văn kiện Đảng Toàn tập, Tập 29* - NXB CTQG, 2004). Việc bổ sung năm xuất bản sẽ đáp ứng trọn vẹn kiểu dữ liệu `HistoricalSource` (`publishedYear?: number`) quy định tại Phase 5 (`05-domain-type-contract.md`).
- **Biện pháp khắc phục kiến nghị:**
  Bổ sung năm xuất bản vào các mục tương ứng trong Section 5.

---

### 4. [Minor] Bổ sung chú thích bối cảnh liên lạc thời chiến trong phần giải thích Câu 4
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.5, Câu 4 (dòng 143).
- **Phân tích bối cảnh lịch sử:**
  Lời giải thích hiện tại tập trung tường tận vào sự sai khác lịch âm do múi giờ (GMT+7 vs GMT+8) giữa miền Bắc và chính quyền Sài Gòn. Đây là nguyên nhân khoa học nền tảng. Tuy nhiên, về mặt diễn biến tác chiến, khi phát hiện sự chênh lệch lịch, Bộ Tổng Tư lệnh tại Hà Nội đã phát điện khẩn chỉ đạo hoãn ngày nổ súng 1 ngày (chuyển sang đêm 30 rạng 31/1) để thống nhất toàn miền Nam. Song bức điện khẩn không đến kịp một số đơn vị ở Quân khu 5 và Tây Nguyên do đường dây liên lạc thời chiến trắc trở.
- **Biện pháp khắc phục kiến nghị:**
  Bổ sung 1 câu chú thích trong phần giải thích: *"Bên cạnh yếu tố chênh lệch lịch âm, bức điện điều chỉnh giờ nổ súng thống nhất của Trung ương cũng không đến kịp Quân khu 5 và Tây Nguyên do điều kiện liên lạc chiến trường trắc trở."*
