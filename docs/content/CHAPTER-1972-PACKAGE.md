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

## 5. KẾT LUẬN & BÀN GIAO MILESTONE

Gói nội dung Chapter 1972 đã hoàn thiện **100% về mặt học thuật, kịch bản văn học, cấu trúc dữ liệu JSON và kiểm thử tự động**. Toàn bộ tài liệu tuân thủ nghiêm ngặt Phase 3 Content Truth Policy và sẵn sàng cho công tác tích hợp mã nguồn trong Milestone M2 phục vụ bàn giao khách hàng.
