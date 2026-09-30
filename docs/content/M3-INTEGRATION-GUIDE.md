# TÀI LIỆU HƯỚNG DẪN TÍCH HỢP NỘI DUNG CHO MILESTONE 3 (M3 INTEGRATION GUIDE)
> **Dành cho:** Dương (Member 4 — Frontend Learning) & Hưng (Member 3 — Frontend Foundation)\
> **Người biên soạn:** Thọ (Member 1 — Content Lead)\
> **Mục đích:** Hướng dẫn chi tiết cách nhúng và render trọn bộ 4 bài học Chapter 1972 vào các màn hình M3 (`M3-01` đến `M3-06`) trên Mock Service Adapter\
> **Ngày lập:** 30/09/2026

---

## 1. TỔNG QUAN KIẾN TRÚC M3 & PHÂN VAI NỘI DUNG

Trong **Milestone 3 (Learning Frontend on Mock Services)**, mục tiêu kỹ thuật là xây dựng hoàn chỉnh luồng trải nghiệm người học trên frontend sử dụng Mock Service Adapter mà chưa cần gọi database thật.

Thọ (Member 1 - Content Lead) đã chuẩn bị sẵn **100% nguyên liệu dữ liệu** theo chuẩn Domain Types v2 (`src/types/v2/content.ts`). Dương (Member 4) chỉ cần map các trường dữ liệu vào các component giao diện tương ứng theo bảng dưới đây:

| Mã Task M3 | Tên Màn Hình / Component | Dữ Liệu Nguồn Của Thọ | Định Dạng Tệp | Component Phụ Trách (Dương) |
|---|---|---|---|---|
| **M3-01** | Home / Chapter Journey | [`docs/content/CURRICULUM-MAP-1972.md`](./CURRICULUM-MAP-1972.md) | Markdown metadata | `HomeScreen.tsx`, `ChapterCard.tsx`, `LessonNode.tsx` |
| **M3-02** | Standard Lesson Reader | [`docs/content/LESSON-03-1972-STANDARD.md`](./LESSON-03-1972-STANDARD.md) | Markdown Content Blocks | `StandardLessonScreen.tsx`, `ComparisonTable.tsx` |
| **M3-03** | Visual Novel Player v2 | [`docs/content/LESSON-02-1972-STORY.json`](./LESSON-02-1972-STORY.json)<br>[`docs/content/DIAGRAM-SAM2-1972.json`](./DIAGRAM-SAM2-1972.json) | JSON Graph (8 scenes)<br>JSON Nodes (7 nodes) | `VisualNovelPlayer.tsx`, `InteractiveDiagram.tsx` |
| **M3-04** | Video Lesson Player | [`docs/content/SCREENPLAY-1972.md`](./SCREENPLAY-1972.md)<br>[`docs/content/CAPTIONS-1972.vtt`](./CAPTIONS-1972.vtt) | Text fallback & WebVTT Captions | `VideoPlayer.tsx`, `SubtitleOverlay.tsx`, `TextFallbackCard.tsx` |
| **M3-05** | Quiz Assessment Flow | [`docs/content/QUIZ-1972.json`](./QUIZ-1972.json) | JSON Array (5 câu hỏi) | `QuizScreen.tsx`, `QuestionCard.tsx`, `ExplanationModal.tsx` |
| **M3-06** | Completion & Rewards UI | [`docs/content/CHAPTER-1972-PACKAGE.md`](./CHAPTER-1972-PACKAGE.md) | Policy specs (80% passing) | `LessonCompletionModal.tsx`, `ChapterSummaryScreen.tsx` |

---

## 2. HƯỚNG DẪN KỸ THUẬT CHI TIẾT TỪNG BÀI HỌC

### 2.1. Tích hợp M3-04: Video Player — Bài 1 "Tối hậu thư từ bầu trời"
- **Dữ liệu bài học:**
  - `id`: `lsn-1972-01`
  - `title`: *"Tối hậu thư từ bầu trời"*
  - `format`: `'video'`
- **Luồng xử lý trên giao diện:**
  1. **Video Playback:** Tỷ lệ khung hình dọc 9:16 (an toàn ở kích thước 375px/430px trên mobile).
  2. **Subtitle Overlay:** Đọc trực tiếp các cues từ file phụ đề [`docs/content/CAPTIONS-1972.vtt`](./CAPTIONS-1972.vtt) để hiển thị phụ đề tiếng Việt chính xác theo mốc giây.
  3. **Text-first Fallback:** Nếu video tải chậm, mạng yếu hoặc người học chọn "Chế độ đọc tóm tắt", hiển thị thẻ tóm tắt văn học từ Mục 5 của [`docs/content/SCREENPLAY-1972.md`](./SCREENPLAY-1972.md).
  4. **Nút chuyển bài:** Khi video kết thúc (hoặc đọc xong thẻ fallback), kích hoạt nút Call-to-Action: *"Tiếp tục: Bài 2 — SAM-2: Vạch nhiễu tìm thù"*.

---

### 2.2. Tích hợp M3-03: Visual Novel Player v2 — Bài 2 "SAM-2: Vạch nhiễu tìm thù"
- **Dữ liệu bài học:**
  - `id`: `lsn-1972-02`
  - `title`: *"SAM-2: Vạch nhiễu tìm thù"*
  - `format`: `'visual_novel'`
- **State Machine & Đồ thị phân cảnh:**
  - Tải file JSON: [`docs/content/LESSON-02-1972-STORY.json`](./LESSON-02-1972-STORY.json).
  - Node bắt đầu: `sam2-v1-briefing`.
  - Node kết thúc: `sam2-v1-end`.
  - **Quy tắc phân nhánh (Linear Learning Guarantee):**
    - Người học bắt buộc phải tìm hiểu qua 2 vị trí quan trọng: Sĩ quan điều khiển (`sam2-v1-officer`) và Kíp trắc thủ 3 người (`sam2-v1-crew`) trước khi bước vào cảnh kiểm tra kiến thức (`sam2-v1-check`).
  - **Sơ đồ khí tài tương tác nhúng (Interactive Canvas):**
    - Trong cảnh `sam2-v1-crew`, nhúng sơ đồ 7 nút tương tác từ [`docs/content/DIAGRAM-SAM2-1972.json`](./DIAGRAM-SAM2-1972.json). Khi người học chạm vào từng nút (Trắc thủ góc tà, trắc thủ phương vị, trắc thủ cự ly, đài radar Fan Song...), hiển thị pop-up giải thích chức năng.
  - **Ranh giới đánh giá:** Các lựa chọn hội thoại là lựa chọn mang tính suy ngẫm/nhập vai (`kind: 'narrative'`), không chấm điểm đúng/sai, chuyển tiếp scene mượt mà.

---

### 2.3. Tích hợp M3-02: Standard Reader — Bài 3 "12 Ngày đêm rực lửa"
- **Dữ liệu bài học:**
  - `id`: `lsn-1972-03`
  - `title`: *"12 Ngày đêm rực lửa: Bản lĩnh và Chiến thuật"*
  - `format`: `'standard'`
- **Luồng dựng giao diện:**
  - Hiển thị bài đọc 3 hồi rõ ràng với định dạng typography trang trọng (Inter / Serif tiêu đề).
  - **Bảng đối chiếu sử liệu (Comparison Table):** Nhúng bảng so sánh số liệu giữa công bố của Việt Nam (34 B-52 bị hạ) và Không quân Mỹ (USAF thừa nhận 15-16 B-52) với ghi chú sư phạm giải thích rõ lý do chênh lệch (đếm xác tại chỗ vs rơi trên đường bay).
  - **Reflection Box:** Cuối bài đọc có khung 2 câu hỏi suy ngẫm giúp học sinh tự liên hệ với thắng lợi ngoại giao tại Hiệp định Paris 1973.

---

### 2.4. Tích hợp M3-05: Quiz Flow — Bài 4 "Trắc nghiệm Tri thức 1972"
- **Dữ liệu bài học:**
  - `id`: `lsn-1972-04`
  - `title`: *"Trắc nghiệm Tri thức 1972"*
  - `format`: `'quiz'`
- **Luồng xử lý câu hỏi:**
  - Đọc mảng 5 câu hỏi từ [`docs/content/QUIZ-1972.json`](./QUIZ-1972.json).
  - Mỗi câu hỏi có 4 phương án (`options: string[]`), đáp án đúng (`correctKey: 'A' | 'B' | 'C' | 'D'`), phần giải thích chi tiết (`explanation`) và mã nguồn đối chiếu (`sourceId`).
  - **Quy tắc sư phạm:**
    - Không hiển thị đáp án đúng ngay khi chưa bấm trả lời.
    - Sau khi người học chọn, đổi màu nút (xanh = đúng, đỏ = sai), hiển thị thẻ giải thích lịch sử.
    - Điểm đạt: $\ge 4/5$ câu đúng (80%).
    - Nếu đạt: Mở Modal chúc mừng, trao huy hiệu *"Dũng sĩ vạch nhiễu Thăng Long"* và hoàn thành Chapter 1972.
    - Nếu chưa đạt: Cho phép "Làm lại bài" (Retry).

---

## 3. THÔNG ĐIỆP GỬI DƯƠNG & HƯNG
> *"Toàn bộ nội dung của Chapter 1972 đã được chuẩn hóa, chạy qua 3 script validation đạt PASS 100% và tuân thủ tuyệt đối Phase 3 Content Truth Policy. Khi Product Owner chính thức duyệt mở cổng M3, các bạn có thể yên tâm sử dụng trực tiếp các tệp JSON và Markdown này làm mock data chuẩn mà không cần bận tâm về tính chính xác hay cấu trúc dữ liệu."* — **Thọ (Content Lead)**
