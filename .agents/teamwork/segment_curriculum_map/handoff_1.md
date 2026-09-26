**Segment scope**: `docs/content/CURRICULUM-MAP.md` toàn bộ 5 phần (CURRICULUM_MAP_OVERVIEW, SEQUENCING, LESSON_SPECS, DATA_CONTRACTS, SOURCE_REGISTER; dòng 1–223) đối chiếu với Sử học chính thống Việt Nam và Khế ước Dữ liệu Phase 3, Phase 5.

# Potential Mistakes and Improvements

### 1. [Major] Ghi nhận trạng thái phê duyệt sớm trước khi qua cổng thẩm định lịch sử (Premature Approval & Publication Status)
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Phần Mở đầu (dòng 9) và Mục 4.2 (dòng 488).
- **Trích dẫn nguyên văn:**
  - Dòng 9: `> **Trạng thái:** APPROVED / PUBLISHED`
  - Dòng 488 (trong đoạn mã TypeScript `chapterMauThan1968`): `status: "published",`
- **Đối chiếu quy trình & Khế ước:**
  1. Theo Bảng theo dõi nhiệm vụ dự án (`docs/tasks/blocked/CONTENT-003.md`), nhiệm vụ kiểm duyệt lịch sử và truyền thông cho chapter pilot (CONTENT-003) đang ở trạng thái `BLOCKED / Chưa gán Reviewer`, và nhiệm vụ sản xuất video (`CONTENT-007`) cũng đang bị `BLOCKED` chờ phê duyệt thẩm định lịch sử.
  2. Theo quy chuẩn quản trị chất lượng Phase 3 (`docs/specs/phases/03-historical-media-governance.md`, Mục 4.1 & 8) và Khế ước kiểu dữ liệu Phase 5 (`docs/specs/phases/05-domain-type-contract.md`, Mục 4.1): Vòng đời xuất bản của một thực thể nội dung (`PublishStatus`) phải trải qua các bước tuần tự: `"draft"` → `"in_review"` → `"approved"` → `"published"`.
  3. Việc bản đồ bài học tự gắn trạng thái `APPROVED / PUBLISHED` ngay từ khâu soạn thảo khung của Member 1 khi chưa có biên bản thẩm định chính thức của Hội đồng Lịch sử (Historical Reviewer) là vi phạm nguyên tắc kiểm soát cổng chất lượng (quality gate bypass), dễ gây hiểu nhầm cho đội ngũ kỹ thuật (Member 4, Member 5) rằng nội dung đã sẵn sàng đóng gói đưa lên môi trường Production.
- **Biện pháp khắc phục kiến nghị:**
  - Điều chỉnh dòng 9 thành: `> **Trạng thái:** PENDING_HISTORICAL_REVIEW (Chờ thẩm định CONTENT-003)` hoặc `APPROVED_FOR_REVIEW`.
  - Trong đoạn mã mẫu khởi tạo Chapter Model ở dòng 488, ghi rõ: `status: "in_review", // Sẽ chuyển sang "published" sau khi hoàn tất kiểm thử QA-005 và nghiệm thu CONTENT-003`.

---

### 2. [Major] Phân loại nhãn nội dung chưa chuẩn hóa và thiếu đồng bộ với Khế ước Quản trị Dữ liệu Phase 3 & Phase 5 (Content Classification Inconsistencies)
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 2 (Bảng Bản đồ trình tự bài học, cột "Phân loại Nội dung", dòng 42–48) và Mục 3.1, 3.4, 3.5.
- **Trích dẫn nguyên văn:**
  - Dòng 44 (Lesson 1): `verified_fact`
  - Dòng 45 (Lesson 2): `verified_fact` + `educational_explanation`
  - Dòng 47 (Lesson 4): `verified_fact`
  - Dòng 48 (Lesson 5): `verified_fact`
- **Phân tích sai lệch phân loại theo chuẩn Phase 3:**
  1. *Đối với Lesson 1 (`lesson-mt68-01-video`):* Bảng phân cảnh `PILOT-SCREENPLAY.md` (Scene 05, dòng 45) đã gắn nhãn chính xác là `verified_fact` + `educational_explanation` do có chứa phần lời dẫn đúc kết ý nghĩa lịch sử và lời kêu gọi chuyển tiếp sư phạm. Ngoài ra, cấu trúc block của Lesson 1 (dòng 61–63) gồm 3 khối: `IntroBlock`, `VideoBlock`, và `RecapBlock`. Các khối mở đầu và tổng kết ghi nhớ (`RecapBlock`) mang tính chất sư phạm dẫn dắt (`educational_explanation`). Việc gắn nhãn duy nhất `verified_fact` cho toàn bộ bài học là chưa bao quát.
  2. *Đối với Lesson 2 (`lesson-mt68-02-interactive`):* Bài học thiết kế theo định dạng Visual Novel nhập vai "quan sát viên chiến thuật", đưa ra các lựa chọn tình huống (Perspective Choices) vượt trạm kiểm soát hoặc xử lý hỏa lực. Theo Phase 3 (Mục 4.1) và Phase 5 (Mục 5.3 & 6), các tình huống giả lập tái hiện góc nhìn chiến thuật phải được phân định rõ ràng giữa sự kiện lịch sử thật (`verified_fact`) và phản hồi suy ngẫm/diễn giải tình huống (`educational_explanation` hoặc `composite_perspective`). Cần bổ sung quy định đóng gói rõ ranh giới block để tránh nhầm lẫn giữa lựa chọn nhập vai và sự thật tư liệu.
  3. *Đối với Lesson 4 (`lesson-mt68-04-synthesis`):* Bài học là bài tổng hợp phân tích chính trị và ý nghĩa chiến lược của cuộc Tổng tiến công đối với bàn đàm phán Paris và phong trào phản chiến Mỹ. Mặc dù các cứ liệu lịch sử (tuyên bố của Walter Cronkite ngày 27/2/1968, bài phát biểu của Johnson ngày 31/3/1968) là `verified_fact`, nhưng toàn bộ lời bình luận, đúc kết bài học chiến lược và xâu chuỗi nguyên nhân - kết quả thuộc về `educational_explanation`. Gắn nhãn duy nhất `verified_fact` là không chuẩn xác theo định nghĩa của Phase 3.
  4. *Đối với Lesson 5 (`quiz-mt68-chapter-assessment`):* Đánh giá Scored Quiz bao gồm các phương án nhiễu giả định có tính hợp lý (plausible distractors) và các đoạn phản hồi giải thích sư phạm (`explanation`) phân tích bản chất lịch sử. Do đó, nhãn nội dung của bài kiểm tra bắt buộc phải là `verified_fact` (kiểm tra sự thật lịch sử) kết hợp `educational_explanation` (cho phần phản hồi giải thích).
- **Biện pháp khắc phục kiến nghị:**
  - Chuẩn hóa cột "Phân loại Nội dung" trong Bảng 2:
    - Lesson 1: `verified_fact` + `educational_explanation`
    - Lesson 2: `verified_fact` + `educational_explanation` (kèm lưu ý phân định rõ ranh giới choice block)
    - Lesson 3: `verified_fact` (100% hồ sơ di tích và hiện vật lưu trữ)
    - Lesson 4: `verified_fact` + `educational_explanation` (bình luận & phân tích chiến lược)
    - Lesson 5: `verified_fact` + `educational_explanation` (câu hỏi dựa trên sự thật, phản hồi mang tính sư phạm)

---

### 3. [Major] Thiếu định danh kỹ thuật (Technical Schema IDs) và siêu dữ liệu khảo thí trong Ngân hàng Câu hỏi Lesson 5
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.5 (Ngân hàng Câu hỏi Khảo thí, dòng 119–150) đối chiếu Mục 4.3 (dòng 198) và Khế ước Phase 5 (`05-domain-type-contract.md`, Mục 8).
- **Phân tích lỗ hổng bàn giao kỹ thuật:**
  1. Khế ước kỹ thuật cho Member 5 (Vinh - QA/Backend) tại dòng 198 quy định: *"Kiểm tra 100% câu hỏi Quiz có `correctOptionId` hợp lệ và có đoạn `explanation` giải thích."* Đồng thời Phase 5 quy định kiểu dữ liệu `MultipleChoiceQuestion` yêu cầu: `id`, `prompt`, `optionIds`, `explanation`, `sourceIds`, `difficulty`, `status`.
  2. Tuy nhiên, trong phần đặc tả Ngân hàng Câu hỏi ở Mục 3.5, 5 câu hỏi chỉ được đánh số thứ tự thông thường (1, 2, 3, 4, 5) và các lựa chọn gắn nhãn chữ cái (A, B, C, D) mà chưa được gán mã định danh thực thể chuẩn (`id: "q-mt68-01"`, `optionIds: ["opt-01-a", "opt-01-b", ...]`, `correctOptionId: "opt-01-b"`), chưa gán mức độ nhận thức (`difficulty: "intro" | "standard" | "advanced"`), và chưa liên kết trực tiếp với mã nguồn trích dẫn (`sourceIds`).
  3. Việc thiếu các trường ID chuẩn này trong tài liệu bàn giao sẽ khiến Member 4 (Frontend) và Member 5 (Backend) phải tự đặt mã thủ công không đồng bộ khi nạp dữ liệu (seed data), gây rủi ro gãy vỡ khóa ngoại hoặc sai lệch đáp án khi chấm điểm tự động.
- **Biện pháp khắc phục kiến nghị:**
  - Bổ sung cấu trúc dữ liệu JSON/TypeScript mẫu chuẩn hóa cho 5 câu hỏi trong Section 4.2 hoặc trực tiếp trong Mục 3.5:
    ```json
    {
      "id": "q-mt68-01",
      "learningObjectiveId": "CLO-1",
      "difficulty": "intro",
      "prompt": "Mật lệnh thiêng liêng nào được phát đi...",
      "options": [
        { "id": "opt-01-a", "label": "Lời kêu gọi toàn quốc kháng chiến." },
        { "id": "opt-01-b", "label": "Bài thơ chúc Tết Xuân Mậu Thân của Chủ tịch Hồ Chí Minh." },
        { "id": "opt-01-c", "label": "Bản Tuyên ngôn Độc lập." },
        { "id": "opt-01-d", "label": "Hiệu lệnh từ Mặt trận Giải phóng miền Trung." }
      ],
      "correctOptionId": "opt-01-b",
      "explanation": "Đúng thời khắc Giao thừa Tết Mậu Thân 1968, Đài Tiếng nói Việt Nam phát bài thơ chúc Tết của Bác Hồ...",
      "sourceIds": ["src-vov-tet1968", "src-lichsu-qndn-t2"]
    }
    ```

---

### 4. [Major] Thẩm định tính chuẩn xác lịch sử và giá trị sư phạm xuất sắc của Chương trình học (Verified Historical Strengths & Pedagogical Rigor)
Qua đối chiếu toàn diện với các nguồn sử liệu chính quy của Viện Lịch sử Quân sự Việt Nam, Hội đồng biên soạn Lịch sử Nam Bộ kháng chiến và SGK Lịch sử hiện hành, Chương trình học thể hiện mức độ chính xác lịch sử và tính sư phạm rất cao:

1. **Chuẩn hóa Mục tiêu Học tập (CLO-1 đến CLO-4):**
   - **CLO-1 (Tính Bất ngờ & Kế hoạch Giao Thừa):** Phản ánh trọn vẹn nét đặc sắc nghệ thuật quân sự Việt Nam trong cuộc tập kích đồng loạt, bất ngờ về thời gian (đêm Giao thừa) và địa bàn trọng điểm (đô thị sào huyệt).
   - **CLO-2 (Hành động Quả cảm của Biệt động Sài Gòn):** Khắc họa trung thực tinh thần chiến đấu anh dũng phi thường của các chiến sĩ Biệt động tại 5 mục tiêu đầu não.
   - **CLO-3 (Thế trận Lòng dân & Mạng lưới Ngầm):** Nêu bật bài học lịch sử cốt lõi: sức mạnh của chiến tranh nhân dân, sự đùm bọc kiên trung của đồng bào Sài Gòn là bệ đỡ quyết định cho mạng lưới hầm vũ khí và sở chỉ huy bí mật.
   - **CLO-4 (Bước ngoặt Lịch sử & Tác động Địa chính trị):** Phân tích khách quan, chính xác ý nghĩa chiến lược của chiến dịch: làm phá sản chiến lược "Chiến tranh cục bộ", làm lung lay ý chí xâm lược của chính giới Mỹ, mở ra cục diện vừa đánh vừa đàm đưa đến Hiệp định Paris.
2. **Tính Chuẩn xác của Diễn biến và Đơn vị Tác chiến (Lesson 1 – 4):**
   - Phân công chính xác 5 mục tiêu nội đô gắn liền với từng đội Biệt động: Đội 11 (Tòa Đại sứ Mỹ), Đội 5 (Dinh Độc Lập), Đội 4 (Đài Phát thanh), Đội 6 & 7 (Bộ Tổng Tham mưu), Đội 3 (Bộ Tư lệnh Hải quân).
   - Xác định đúng vị trí và vai trò lịch sử của 4 cơ sở ngầm tiêu biểu: Hầm vũ khí 287/70 Trần Quý Cáp (Anh hùng Trần Văn Lai & Đặng Thị Thiệp); Sở chỉ huy tiền phương Phân khu 6 tại Tiệm phở Bình (Chỉ huy trưởng Tư Chu); Trạm giao liên Cơm tấm Đỗ Phủ (113A Đặng Dung); Trạm xuất phát Tiệm may Quốc Anh (65 Nguyễn Bỉnh Khiêm).
   - Tái hiện đúng chuỗi sự kiện địa chính trị quốc tế: Phóng sự của Walter Cronkite (27/2/1968), Tuyên bố ngừng ném bom miền Bắc từ vĩ tuyến 20 và không tái tranh cử của Tổng thống Lyndon B. Johnson (31/3/1968).
3. **Chất lượng Ngân hàng Câu hỏi Khảo thí (Lesson 5 Quiz):**
   - Cả 5 câu hỏi đều có cấu trúc câu chuẩn mực, phương án nhiễu có tính phân hóa sư phạm sâu sắc (plausible distractors), không có bẫy mẹo vụn vặt.
   - Đặc biệt, **Câu 4** giải thích tường tận nguyên nhân lệch ngày nổ súng giữa Quân khu 5/Tây Nguyên (rạng sáng 30/1) và Nam Bộ/Sài Gòn (rạng sáng 31/1) dựa trên cơ sở khoa học lịch sử về sự khác biệt lịch âm giữa múi giờ GMT+7 (miền Bắc, tháng 11 thiếu) và GMT+8 (chính quyền Sài Gòn, tháng 11 đủ). Đây là chi tiết lịch sử rất đắt giá, thể hiện trình độ nghiên cứu tư liệu nghiêm túc của tác giả.
4. **Tuyệt đối tuân thủ chuẩn mực chính trị & thuật ngữ:**
   - 100% sử dụng thuật ngữ chuẩn: "Kháng chiến chống Mỹ cứu nước", "Đế quốc Mỹ", "Biệt động Sài Gòn", "Tổng tiến công và nổi dậy". Tuyệt đối không có thuật ngữ phương Tây sai lệch bản chất.

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

### 2. [Minor] Chuẩn hóa thông tin thư mục học và bổ sung số quyết định xếp hạng Di tích Tiệm phở Bình trong Danh mục nguồn (Section 5)
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 5 (Danh mục nguồn lịch sử đối chiếu, dòng 206–220).
- **Phân tích hoàn thiện thư mục:**
  1. Các đầu sách tại Mục 1, 2, 5 (Lịch sử Kháng chiến chống Mỹ Tập V, Lịch sử Nam Bộ kháng chiến Tập 2, Văn kiện Đảng Toàn tập Tập 29) tuy đã ghi rõ tên sách và nhà xuất bản, nhưng chưa bổ sung năm xuất bản (ví dụ: *Lịch sử Kháng chiến chống Mỹ cứu nước, Tập V* - NXB CTQG, 2002; *Lịch sử Nam Bộ kháng chiến, Tập 2* - NXB CTQG Sự thật, 2010; *Văn kiện Đảng Toàn tập, Tập 29* - NXB CTQG, 2004). Việc bổ sung năm xuất bản sẽ đáp ứng trọn vẹn kiểu dữ liệu `HistoricalSource` (`publishedYear?: number`) tại Phase 5.
  2. Tại Mục 4 (dòng 215), Di tích Hầm 287/70 Trần Quý Cáp được viện dẫn rất đầy đủ số quyết định (*Quyết định số 1288-VH/QĐ ngày 16/11/1988 của Bộ Văn hóa - Thông tin*), trong khi Di tích Tiệm phở Bình chỉ ghi tên di tích mà chưa kèm số quyết định xếp hạng.
- **Biện pháp khắc phục kiến nghị:**
  Bổ sung số quyết định vào dòng 215:
  `Di tích Lịch sử cấp Quốc gia: Sở Chỉ huy tiền phương Phân khu 6 trong Chiến dịch Mậu Thân 1968 — Tiệm phở Bình (Số 7 đường Lý Chính Thắng, Phường Võ Thị Sáu, Quận 3, TP.HCM — Quyết định số 43/2011/QĐ-BVHTTDL ngày 08/12/2011 của Bộ Văn hóa, Thể thao và Du lịch).`

---

### 3. [Minor] Khuyến nghị cơ chế xáo trộn câu hỏi và mở rộng ngân hàng đề thi chống học vẹt (Quiz Randomization & Anti-memorization Note)
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 3.5 (Quy chuẩn đánh giá, dòng 115–118) và Mục 4.2 (Luồng điều hướng, dòng 502).
- **Phân tích sư phạm:**
  Quy chuẩn đánh giá quy định người học làm bài trắc nghiệm 5 câu, ngưỡng hoàn thành là 80 điểm (đúng 4/5 câu) để nhận 150 XP. Quy định hiện tại nêu: *"Phản hồi giải thích chi tiết ngay sau mỗi câu trả lời"*. Nếu hệ thống hiển thị đáp án và giải thích ngay lập tức mà bộ câu hỏi chỉ có đúng 5 câu cố định theo thứ tự 1 đến 5, người học có thể làm lại lần hai bằng cách ghi nhớ vị trí chữ cái (B, B, A, B, B) thay vì thực sự tiếp thu kiến thức.
- **Biện pháp khắc phục kiến nghị:**
  Bổ sung vào mục chỉ dẫn bàn giao cho Member 4 (Frontend) và Member 5 (QA/Backend):
  - Kích hoạt tính năng xáo trộn ngẫu nhiên thứ tự phương án trả lời (Option Shuffling) mỗi lần làm bài.
  - Khuyến nghị bổ sung trong giai đoạn sau (Phase 7) mở rộng ngân hàng câu hỏi lên 10–15 câu để mỗi lần kiểm tra hệ thống lấy ngẫu nhiên 5 câu theo ma trận nhận thức CLO 1–4.

---

### 4. [Minor] Bổ sung phụ chú múi giờ trong Luồng điều hướng và Tóm tắt Chapter Model
- **Vị trí quan sát:** `docs/content/CURRICULUM-MAP.md`, Mục 4.2 (Chapter Model, dòng 485).
- **Trích dẫn:** `summary: "Khám phá kế hoạch bí mật đêm Giao thừa, mạng lưới hầm vũ khí giữa lòng Sài Gòn và bước ngoặt mở đường tới Hội nghị Paris."`
- **Phân tích:** Nhằm đồng bộ với kịch bản video dẫn nhập và phân tích lịch âm tại Câu 4, phần tóm tắt ngắn hoặc chú thích thời gian có thể ghi rõ mốc thời gian: *"đêm Giao thừa rạng sáng Mùng 2 Tết (đêm 30 rạng sáng 31/1/1968)"* để người học tiếp cận ngay từ đầu sự phân biệt thời gian đặc thù này mà không cảm thấy băn khoăn về hai mốc Giao thừa.
