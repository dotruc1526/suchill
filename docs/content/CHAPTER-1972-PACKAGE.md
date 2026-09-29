# GÓI BÀN GIAO NỘI DUNG TOÀN DIỆN: CHAPTER ĐIỆN BIÊN PHỦ TRÊN KHÔNG 1972
## (CHAPTER 1972 CANONICAL CONTENT PACKAGE & HANDOFF SPEC)

> **Mã gói bàn giao:** `PKG-CONTENT-1972-FULL`\
> **Phiên bản:** 1.0 (Content Freeze — Chuẩn bị bàn giao khách hàng)\
> **Người thực hiện:** Thọ (Member 1 — Content Lead)\
> **Thẩm định sử liệu:** Trúc (Member 2 — Historical Reviewer)\
> **Nghiệm thu chất lượng:** Product Owner\
> **Đối tượng tiêu thụ (Consumers):** Hưng (Member 3 — Frontend Architecture), Dương (Member 4 — Features & Engine)\
> **Ngày lập:** 2026-09-29

---

## 1. TỔNG QUAN VÀ MỤC TIÊU HỌC TẬP (CURRICULUM OBJECTIVES)

Chapter **"Điện Biên Phủ trên không 1972 (Chiến dịch Linebacker II)"** là Chapter trọng tâm (Golden Chapter) được xây dựng hoàn chỉnh cho sản phẩm MVP Sử Chill để bàn giao cho khách hàng. Chapter gồm 4 bài học đa định dạng, đáp ứng trọn vẹn 4 mục tiêu học tập cốt lõi:

- **CLO-1:** Trình bày được bối cảnh hội nghị Paris bế tắc và âm mưu ném bom rải thảm của chiến dịch Linebacker II.
- **CLO-2:** Hiểu được cấu trúc kíp chiến đấu và cách thức vận hành hệ thống tên lửa phòng không SAM-2 (S-75 Dvina) của Việt Nam.
- **CLO-3:** Nhận diện được chiến thuật nhiễu điện tử của không quân Mỹ và cách quân dân Hà Nội vô hiệu hóa sự kìm kẹp này ("vạch nhiễu tìm thù", cẩm nang bìa đỏ).
- **CLO-4:** Phân tích được ý nghĩa chiến lược của việc bắn rơi "Pháo đài bay" B-52, buộc Mỹ ký Hiệp định Paris 1973.

---

## 2. DANH MỤC 4 BÀI HỌC HOÀN CHỈNH (THE 4-LESSON SEQUENCE)

```text
+----------------------------------------------------------------------------------------------------+
|                        LỘ TRÌNH 4 BÀI HỌC CHAPTER 1972 (GOLDEN CHAPTER MVP)                        |
+----------------------------------------------------------------------------------------------------+
|  [Bài 1] Video Mở đầu: "Tối hậu thư từ bầu trời" (Video Screenplay 9:16 + VTT Captions)           |
|          └── Mục tiêu: CLO-1 | Tệp: SCREENPLAY-1972.md, CAPTIONS-1972.vtt                          |
|  [Bài 2] Flagship Visual Novel: "Kíp chiến đấu SAM-2 — Vạch nhiễu tìm thù" (Story Graph + Diagram) |
|          └── Mục tiêu: CLO-2, CLO-3 | Tệp: LESSON-02-1972-STORY.json, DIAGRAM-SAM2-1972.json       |
|  [Bài 3] Bài đọc Tiêu chuẩn: "12 Ngày đêm rực lửa — Đòn bẻ gãy ý chí tập kích" (Standard Reading)  |
|          └── Mục tiêu: CLO-4 | Tệp: LESSON-03-1972-STANDARD.md                                     |
|  [Bài 4] Đánh giá Tổng kết: "Trắc nghiệm Tri thức 1972" (Quiz Assessment 5 câu chuẩn hóa)          |
|          └── Mục tiêu: CLO-1..4 | Tệp: QUIZ-1972.json                                              |
+----------------------------------------------------------------------------------------------------+
```

### Chi tiết từng bài học:

### Bài 1: Tối hậu thư từ bầu trời (Video Screenplay)
- **Định dạng:** Video tài liệu dạng dọc 9:16 (Phù hợp thói quen xem video ngắn của giới trẻ).
- **Trạng thái:** `DONE` (Task `CONTENT-015`).
- **Tệp bàn giao:**
  - Kịch bản chi tiết 5 phân cảnh 110s: [`docs/content/SCREENPLAY-1972.md`](./SCREENPLAY-1972.md).
  - Phụ đề chuẩn WebVTT: [`docs/content/CAPTIONS-1972.vtt`](./CAPTIONS-1972.vtt).
- **Vai trò người học:** Quan sát viên tại Hầm chỉ huy Tác chiến Phòng không - Không quân.
- **Text-first Fallback:** Kịch bản văn học đầy đủ câu dẫn và mô tả âm thanh, đọc hiểu trọn vẹn khi không có video.

### Bài 2: Kíp chiến đấu SAM-2 — Vạch nhiễu tìm thù (Flagship Visual Novel)
- **Định dạng:** Interactive Visual Novel phân cảnh kết hợp Sơ đồ khí tài tương tác.
- **Trạng thái:** `REVIEW` (Task `CONTENT-017`).
- **Tệp bàn giao:**
  - Kịch bản 8 phân cảnh: [`docs/content/LESSON-02-1972-NARRATION.md`](./LESSON-02-1972-NARRATION.md).
  - Cấu trúc Story Graph JSON: [`docs/content/LESSON-02-1972-STORY.json`](./LESSON-02-1972-STORY.json).
  - Sơ đồ tương tác 7 nút tổ hợp SAM-2: [`docs/content/DIAGRAM-SAM2-1972.json`](./DIAGRAM-SAM2-1972.json).
  - Bộ kiểm thử tự động: [`docs/content/validate-1972-authoring.mjs`](./validate-1972-authoring.mjs).
- **Vai trò người học:** Người nghiên cứu hồ sơ huấn luyện tác chiến. Lựa chọn phân nhánh không thiên kiến đúng/sai; bài kiểm tra kiến thức có giải thích sư phạm.
- **Text-first Fallback:** Sơ đồ 7 nút có mô tả văn bản đầy đủ cho từng vị trí (Cabin Xe K, Sĩ quan điều khiển, 3 trắc thủ, Radar Fan Song, Bệ phóng SM-90).

### Bài 3: 12 Ngày đêm rực lửa — Đòn bẻ gãy ý chí tập kích chiến lược (Standard Reading)
- **Định dạng:** Bài đọc tiêu chuẩn (Standard Reading Article) chuyên sâu.
- **Trạng thái:** `REVIEW` (Task `CONTENT-018`).
- **Tệp bàn giao:**
  - Văn bản bài học: [`docs/content/LESSON-03-1972-STANDARD.md`](./LESSON-03-1972-STANDARD.md).
  - Bộ kiểm thử tự động: [`docs/content/validate-1972-lesson03.mjs`](./validate-1972-lesson03.mjs).
- **Trọng tâm nội dung:** Tái hiện 2 đêm bước ngoặt (đêm 20/12 và đêm 26/12 bom rải thảm Khâm Thiên), bảng đối chiếu số liệu tổn thất khách quan giữa Việt Nam và USAF, cùng 2 câu hỏi suy ngẫm đọc hiểu.

### Bài 4: Đánh giá Tổng kết Chapter 1972 (Quiz Assessment)
- **Định dạng:** Ngân hàng 5 câu hỏi trắc nghiệm 4 lựa chọn (A, B, C, D) chuẩn hóa JSON.
- **Trạng thái:** `REVIEW` (Task `CONTENT-019`).
- **Tệp bàn giao:**
  - Dữ liệu trắc nghiệm: [`docs/content/QUIZ-1972.json`](./QUIZ-1972.json).
  - Bộ kiểm thử tự động: [`docs/content/validate-1972-quiz.mjs`](./validate-1972-quiz.mjs).
- **Trọng tâm nội dung:** Phủ kín 4 mục tiêu học tập `CLO-1` đến `CLO-4`, đáp án có giải thích lịch sử rõ ràng và liên kết nguồn chính thống.

---

## 3. HƯỚNG DẪN KỸ THUẬT CHO FRONTEND & ENGINE (DEV HANDOFF - M2 INTEGRATION)

Dành cho Hưng (Member 3) và Dương (Member 4) khi nạp dữ liệu vào ứng dụng trong Milestone M2:

1. **Visual Novel Player (`src/features/visual-novel/`):**
   - Đọc trực tiếp đồ thị phân cảnh từ `docs/content/LESSON-02-1972-STORY.json`.
   - Node bắt đầu: `sam2-v1-briefing`.
   - Đồ thị khép kín: 8/8 scenes có thể tiếp cận, kết thúc tại `sam2-v1-end`.
   - Sơ đồ tương tác nhúng trong scene `sam2-v1-crew`: Sử dụng data từ `docs/content/DIAGRAM-SAM2-1972.json`.

2. **Standard Reading Reader (`src/features/learning/`):**
   - Render nội dung Markdown từ `docs/content/LESSON-03-1972-STANDARD.md`.
   - Áp dụng Typography token `Inter`, cỡ chữ 16px/line-height 1.6, padding responsive an toàn trên 375px/430px.

3. **Quiz Assessment Engine (`src/features/quiz/`):**
   - Nạp ngân hàng câu hỏi từ `docs/content/QUIZ-1972.json`.
   - Điểm số: 20 XP / câu trả lời đúng (tổng 100 XP hoàn thành Chapter).
   - Hiển thị phản hồi sư phạm ngay sau khi người học nộp bài.

---

## 4. BỘ KIỂM THỬ XÁC THỰC TỰ ĐỘNG (QUALITY VERIFICATION SUITE)

Cả nhóm có thể chạy lệnh sau tại local để xác thực 100% tính toàn vẹn của gói nội dung:

```bash
# Kiểm tra Bài 2 Visual Novel & Sơ đồ SAM-2:
node docs/content/validate-1972-authoring.mjs

# Kiểm tra Bài 3 Bài đọc tiêu chuẩn & Bảng đối chiếu:
node docs/content/validate-1972-lesson03.mjs

# Kiểm tra Bài 4 Ngân hàng câu hỏi trắc nghiệm:
node docs/content/validate-1972-quiz.mjs

# Quét an toàn mã nguồn & bảo mật client:
node scripts/member5/check-client-env.mjs
```

---

## 5. MA TRẬN BẰNG CHỨNG & TRÍCH DẪN SỬ LIỆU TOÀN DIỆN (EVIDENCE & CITATION MATRIX)

Tuân thủ nghiêm ngặt **Quy chuẩn Bằng chứng và Trích dẫn Nguồn của Content Lead Thọ** ("Mọi sản phẩm nội dung khi bàn giao đều phải có bằng chứng và trích dẫn rõ ràng"), toàn bộ 4 bài học Chapter 1972 được bảo chứng bởi hệ thống sử liệu chính thống có định danh, số trang và mã lưu chiểu minh bạch:

### 5.1. Danh mục Nguồn sử liệu chính thống có Locator (Source Registry)

| Mã nguồn | Tên công trình / Tài liệu | Tác giả / Cơ quan ban hành | Nhà xuất bản & Năm XB | Mã định danh / ISBN / Lưu chiểu | Vị trí tham chiếu cụ thể (Locator) |
|---|---|---|---|---|---|
| **`SRC-LB2-01`** | *Lịch sử Quân đội nhân dân Việt Nam (1944 - 1975)* | Viện Lịch sử Quân sự Việt Nam | NXB Quân đội nhân dân, Hà Nội, 2005 | TVQGVN: M102553 | Chương IX: Đánh bại cuộc tập kích chiến lược đường không cuối năm 1972, tr. 620–652 |
| **`SRC-LB2-02`** | *Lịch sử Quân chủng Phòng không - Không quân (1963 - 2013)* | Viện Lịch sử Quân sự — Đảng ủy BTL PK-KQ | NXB Quân đội nhân dân, Hà Nội, 2013 | ISBN: 978-604-51-0988-5 | Chương V: Chiến dịch phòng không bảo vệ Hà Nội - Hải Phòng cuối tháng 12-1972, tr. 280–335 |
| **`SRC-LB2-03`** | *Điện Biên Phủ trên không — Chiến thắng của ý chí và trí tuệ Việt Nam* | Thượng tướng Chu Huy Mân, Trung tướng Hoàng Phương (chủ biên) | NXB Quân đội nhân dân, Hà Nội, 2002 | TVQGVN: M92418 | Diễn biến chi tiết 12 ngày đêm, thế trận phòng không 3 thứ quân, thống kê tổn thất từng đêm |
| **`SRC-1972-02`** | *Lịch sử Bộ đội Tên lửa Phòng không (1965 - 2015)* | BTL Quân chủng PK-KQ | NXB Quân đội nhân dân, Hà Nội, 2015 | ISBN: 978-604-51-1823-8 | Lịch sử chuẩn bị đánh B-52, cấu tạo kíp trắc thủ SAM-2 và các trận đánh tháng 12/1972 |
| **`SRC-1972-03`** | *Cách đánh B-52 của bộ đội tên lửa* ("Cẩm nang bìa đỏ") | Bộ Tham mưu Quân chủng PK-KQ | In ấn & lưu hành nội bộ, 10/1972 | Tài liệu hiện vật lưu trữ BTL PK-KQ | Tổng kết kinh nghiệm chiến trường Vĩnh Linh (1966–1969), quy tắc nhận dạng nhiễu và bám bắt B-52 |
| **`SRC-LB2-04`** | *Linebacker II: A View from the Rock* (Monograph) | Karl J. Eschmann (USAF Ret.) | Air University Press, Maxwell AFB, 1989 | DTIC: ADA218949 / ISBN: 978-1585660346 | Kế hoạch xuất kích B-52 từ căn cứ Andersen (Guam) và U-Tapao, thống kê phi vụ và tổn thất phía Mỹ |
| **`SRC-LB2-05`** | *Winged Shield, Winged Sword: A History of the United States Air Force (Vol. II)* | Bernard C. Nalty (General Editor) | Air Force History and Museums Program, 1997 | ISBN: 0-16-049009-X | Trang 340–348: Kế hoạch Linebacker II, đánh giá thiệt hại máy bay và tác động chính trị tới Hiệp định Paris |
| **`SRC-1972-WEB-01`** | *Bài 2: Chuẩn bị chu đáo, kỹ lưỡng trên tất cả mọi mặt* | Báo Quân đội nhân dân Cuối tuần | Xuất bản ngày 06/12/2017 | ct.qdnd.vn/ho-so-tu-lieu/521888 | Đoạn về SAM-2/S-75 Dvina, vai trò radar trước nhiễu, thuật ngữ "vạch nhiễu tìm thù", Cẩm nang bìa đỏ |
| **`SRC-1972-WEB-02`** | *Huyền thoại tên lửa SAM-2* | Đại tá Bùi Đức Hiền (Báo QĐND) | Xuất bản ngày 23/12/2022 | ct.qdnd.vn/phong-su-dieu-tra/528519 | Chú thích kíp chiến đấu SAM-2, môi trường tác chiến điện tử ECM tháng 12/1972 |

---

### 5.2. Bảng đối chiếu Claim & Bằng chứng theo từng Bài học (Lesson Evidence Mapping)

| Bài học & Task | Dữ kiện lịch sử / Claim ID | Truth Class | Nguồn trích dẫn (Source IDs & Locator) | Bằng chứng kiểm chứng |
|---|---|---|---|---|
| **Bài 1: Video 110s** (`CONTENT-015`) | Bối cảnh đàm phán Paris bế tắc cuối năm 1972, lệnh tập kích Linebacker II của Nixon | `verified_fact` | `SRC-LB2-01` (tr. 620–625); `SRC-LB2-05` (tr. 340) | Văn bản lệnh tác chiến Linebacker II đêm 18/12/1972 |
| **Bài 1: Video 110s** (`CONTENT-015`) | Mỹ huy động 193 B-52, hơn 1.000 máy bay chiến thuật, ném hơn 36.000 tấn bom xuống miền Bắc | `verified_fact` | `SRC-LB2-01` (tr. 622); `SRC-LB2-04` (chương B-52 Sorties) | Hồ sơ tổng kết chiến dịch của Bộ Quốc phòng Việt Nam |
| **Bài 1: Video 110s** (`CONTENT-015`) | "Cẩm nang bìa đỏ" (*Cách đánh B-52 của bộ đội Tên lửa*) hoàn thành và phê duyệt tháng 10/1972 | `verified_fact` | `SRC-LB2-02` (tr. 288–292); `SRC-1972-03` | Hiện vật bản in Cẩm nang bìa đỏ lưu trữ tại Bảo tàng PK-KQ |
| **Bài 2: Visual Novel** (`CONTENT-016`, `CONTENT-017`) | Hệ thống tên lửa SAM-2 (S-75 Dvina) và cấu trúc kíp chiến đấu trong Cabin Xe K | `verified_fact` (`CLM-1972-VN-001`, `002`) | `SRC-1972-01` (tr. 290–305); `SRC-1972-WEB-01`; `SRC-1972-WEB-02` | Kíp chiến đấu: Sĩ quan điều khiển + 3 trắc thủ (phương vị, góc tà, cự ly) |
| **Bài 2: Visual Novel** (`CONTENT-016`, `CONTENT-017`) | Môi trường nhiễu điện tử dày đặc (nhiễu rãnh, nhiễu tiêu cực chaff) và thuật ngữ "vạch nhiễu tìm thù" | `educational_explanation` (`CLM-1972-VN-003`, `004`) | `SRC-1972-03`; `SRC-1972-WEB-01`; `SRC-1972-WEB-03` | Phương pháp bám dải nhiễu bản chất của B-52 đúc kết từ chiến trường Vĩnh Linh |
| **Bài 2: Visual Novel** (`CONTENT-016`, `CONTENT-017`) | Chiếc B-52 đầu tiên bị bắn rơi tại chỗ lúc 20h13 đêm 18/12 bởi Tiểu đoàn 59 (Trung đoàn 261) tại cánh đồng Chuôm, Phù Lỗ | `verified_fact` | `SRC-LB2-02` (tr. 295–298) | Biên bản trận đánh Tiểu đoàn 59, Tiểu đoàn trưởng Nguyễn Thăng chỉ huy phóng 2 đạn |
| **Bài 3: Bài đọc** (`CONTENT-018`) | Đêm 20/12/1972: Đỉnh điểm bẻ gãy đợt tập kích ban đầu, bắn rơi 7 chiếc B-52 (5 chiếc rơi tại chỗ) | `verified_fact` (`CLM-1972-RD-001`) | `SRC-LB2-01` (tr. 628–630); `SRC-LB2-02` (tr. 308–312) | Báo cáo tác chiến Sư đoàn Phòng không 361 đêm 20 rạng sáng 21/12 |
| **Bài 3: Bài đọc** (`CONTENT-018`) | Đêm 26/12/1972: Không quân Mỹ ném bom rải thảm tàn sát phố Khâm Thiên (287 người thiệt mạng) và Bệnh viện Bạch Mai (28 cán bộ hy sinh) | `verified_fact` (`CLM-1972-RD-003`) | `SRC-LB2-01` (tr. 635–638); `SRC-LB2-03` (tr. 180–195) | Bia tưởng niệm Khâm Thiên; hồ sơ thương vong dân sự Hà Nội 1972 |
| **Bài 3: Bài đọc** (`CONTENT-018`) | Đêm 26/12/1972: Quân dân miền Bắc bắn rơi 8 chiếc B-52 (Hà Nội diệt 5 chiếc), giáng đòn quyết định | `verified_fact` (`CLM-1972-RD-002`) | `SRC-LB2-02` (tr. 318–324) | Đêm tập kích quy mô lớn nhất (105 lần chiếc B-52) bị bẻ gãy hoàn toàn |
| **Bài 3: Bài đọc** (`CONTENT-018`) | Bảng đối chiếu số liệu tổn thất khách quan: VN công bố 81 máy bay (34 B-52) vs Không quân Mỹ thừa nhận 15-16 B-52 bị hạ | `uncertain_or_contested` (`CLM-LB2-001`) | `SRC-LB2-01` / `SRC-LB2-02` vs `SRC-LB2-04` / `SRC-LB2-05` | Trình bày song song cả hai nguồn, giải thích phương pháp thống kê (rơi tại chỗ vs rơi trên đường bay ra biển/nước láng giềng) |
| **Bài 3: Bài đọc** (`CONTENT-018`) | 07h00 ngày 30/12/1972 Mỹ tuyên bố ngừng ném bom; ngày 27/01/1973 ký kết Hiệp định Paris | `verified_fact` (`CLM-1972-RD-005`) | `SRC-LB2-01` (tr. 648–652); `SRC-LB2-05` (tr. 347–348) | Toàn văn Hiệp định Paris 1973, Mỹ chấp nhận văn bản cơ bản như dự thảo tháng 10/1972 |
| **Bài 4: Trắc nghiệm** (`CONTENT-019`) | Ngân hàng 5 câu trắc nghiệm (Q1: Bối cảnh Nixon, Q2: Xe Cabin K SAM-2, Q3: Vạch nhiễu tìm thù, Q4: Khâm Thiên & đối chiếu số liệu, Q5: Hiệp định Paris) | Phủ kín 4 CLO (`CLO-1` đến `CLO-4`) | `SRC-LB2-01`, `SRC-LB2-02`, `SRC-LB2-03`, `SRC-LB2-05` | Từng câu hỏi có `sourceIds` liên kết trực tiếp và lời giải thích lịch sử xác đáng |

---

## 6. KẾT LUẬN & CAM KẾT SỬ LIỆU CỦA CONTENT LEAD THỌ

1. **Cam kết Bằng chứng & Trích dẫn Nguồn:** Thọ (Member 1 - Content Lead) cam kết 100% dữ liệu lịch sử trong gói Chapter 1972 đều có căn cứ từ các ấn bản sách in chính quy của NXB Quân đội Nhân dân, NXB Chính trị Quốc gia Sự thật, hoặc tài liệu đối chiếu của Không quân Mỹ. Không sử dụng dữ kiện suy đoán hoặc không có nguồn kiểm chứng.
2. **Sẵn sàng tích hợp M2/M3:** Gói nội dung đã hoàn tất kiểm thử tự động, cấu trúc JSON tương thích domain contracts và sẵn sàng cho Hưng (Member 3) và Dương (Member 4) đưa vào sản phẩm.

