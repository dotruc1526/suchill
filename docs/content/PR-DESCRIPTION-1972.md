# Hướng dẫn tạo Pull Request: Trọn gói 4 bài học Chapter 1972 (Golden Chapter Package)

> **Nhánh (Head):** `content/tho-chapter-1972-package`  
> **Nhánh đích (Base):** `main`  
> **Đường dẫn tạo PR:** [https://github.com/dotruc1526/suchill/pull/new/content/tho-chapter-1972-package](https://github.com/dotruc1526/suchill/pull/new/content/tho-chapter-1972-package)  
> **Người thực hiện:** Thọ (Member 1 — Content Lead)  
> **Reviewers đề xuất:** Trúc (`@dotruc1526` — Historical Reviewer), Hưng (`@hung` — Architecture), Product Owner (`@Compuerte`)  

---

## Tiêu đề Pull Request (PR Title)
```text
feat(content): Thọ hoàn thành trọn gói 4 bài học Chapter 1972 và tài liệu Handoff M2/M3 (CONTENT-015..019)
```

---

## Nội dung mô tả Pull Request (PR Description)

```markdown
## 📌 Tóm tắt nội dung PR (Summary)

Pull Request này bàn giao trọn vẹn gói nội dung hoàn chỉnh đầu tiên của Sử Chill: **Chapter Điện Biên Phủ trên không 1972 (Chiến dịch Linebacker II)** — gồm 4 bài học đa định dạng, đáp ứng 100% mục tiêu học tập (`CLO-1` đến `CLO-4`) và bộ kiểm thử tự động đạt chuẩn.

### 📚 Danh mục 4 bài học trong gói bàn giao:
1. **Bài 1: Tối hậu thư từ bầu trời (`CONTENT-015`)**:
   - Định dạng: Video tài liệu 9:16 (dọc), thời lượng 110s.
   - Tài liệu: [`docs/content/SCREENPLAY-1972.md`](docs/content/SCREENPLAY-1972.md) và phụ đề chuẩn WebVTT [`docs/content/CAPTIONS-1972.vtt`](docs/content/CAPTIONS-1972.vtt).
   - Nội dung: Bối cảnh đàm phán Paris bế tắc, âm mưu ném bom rải thảm của Mỹ và sự chuẩn bị của quân dân Hà Nội trước đêm 18/12.
2. **Bài 2: Kíp chiến đấu SAM-2 — Vạch nhiễu tìm thù (`CONTENT-016`, `CONTENT-017`)**:
   - Định dạng: Interactive Flagship Visual Novel kết hợp Sơ đồ khí tài tương tác.
   - Đã tích hợp bản sửa luồng học tuyến tính theo yêu cầu PO (học viên đi qua cả 2 nội dung hiệp đồng và xử lý nhiễu trước khi làm bài kiểm tra kiến thức).
   - Tài liệu: Kịch bản 8 phân cảnh [`docs/content/LESSON-02-1972-NARRATION.md`](docs/content/LESSON-02-1972-NARRATION.md), Story JSON [`docs/content/LESSON-02-1972-STORY.json`](docs/content/LESSON-02-1972-STORY.json), Sơ đồ tương tác 7 node [`docs/content/DIAGRAM-SAM2-1972.json`](docs/content/DIAGRAM-SAM2-1972.json).
3. **Bài 3: 12 Ngày đêm rực lửa — Đòn bẻ gãy ý chí tập kích (`CONTENT-018`)**:
   - Định dạng: Bài đọc tiêu chuẩn (Standard Reading).
   - Tài liệu: [`docs/content/LESSON-03-1972-STANDARD.md`](docs/content/LESSON-03-1972-STANDARD.md).
   - Nội dung: Tái hiện 2 đêm bước ngoặt (20/12 và 26/12 Khâm Thiên), bảng đối chiếu số liệu tổn thất khách quan giữa Việt Nam và Không quân Mỹ (USAF), kèm 2 câu hỏi suy ngẫm đọc hiểu.
4. **Bài 4: Đánh giá Tổng kết Chapter 1972 (`CONTENT-019`)**:
   - Định dạng: Ngân hàng 5 câu hỏi trắc nghiệm chuẩn hóa JSON 4 lựa chọn (A, B, C, D).
   - Tài liệu: [`docs/content/QUIZ-1972.json`](docs/content/QUIZ-1972.json).
   - Nội dung: Phủ kín 4 mục tiêu học tập, đáp án có giải thích lịch sử rõ ràng, liên kết nguồn chính thống.
5. **Tài liệu Handoff Dev M2/M3**:
   - [`docs/content/CHAPTER-1972-PACKAGE.md`](docs/content/CHAPTER-1972-PACKAGE.md): Hướng dẫn chi tiết cho Hưng (FE Foundation) và Dương (FE Learning) nạp dữ liệu vào Visual Novel Player, Standard Reader và Quiz Engine.

---

## 📚 Ma trận Bằng chứng & Trích dẫn Nguồn sử liệu (Evidence & Citation Matrix)

Toàn bộ 4 bài học đều được đối chiếu và trích dẫn trực tiếp từ các tài liệu chính thống có mã số trang và lưu chiểu:

| Mã nguồn | Tài liệu tham chiếu | Cơ quan / Tác giả & Năm XB | Vị trí tham chiếu cụ thể (Locator) | Bài học áp dụng |
|---|---|---|---|---|
| `SRC-LB2-01` | *Lịch sử Quân đội nhân dân Việt Nam (1944 - 1975)* | Viện Lịch sử Quân sự Việt Nam (2005) | Chương IX: Đánh bại cuộc tập kích đường không, tr. 620–652 | Bài 1, Bài 3, Bài 4 |
| `SRC-LB2-02` | *Lịch sử Quân chủng Phòng không - Không quân (1963 - 2013)* | Viện LSQS — BTL PK-KQ (2013, ISBN 978-604-51-0988-5) | Chương V: Chiến dịch bảo vệ Hà Nội - Hải Phòng, tr. 280–335 | Bài 1, Bài 2, Bài 3, Bài 4 |
| `SRC-LB2-03` | *Điện Biên Phủ trên không — Ý chí và trí tuệ Việt Nam* | Thượng tướng Chu Huy Mân (chủ biên, 2002) | Diễn biến 12 ngày đêm, số liệu thương vong Khâm Thiên tr. 180–195 | Bài 3, Bài 4 |
| `SRC-1972-02` | *Lịch sử Bộ đội Tên lửa Phòng không (1965 - 2015)* | BTL Quân chủng PK-KQ (2015, ISBN 978-604-51-1823-8) | Cấu tạo kíp trắc thủ SAM-2 và các trận đánh tháng 12/1972 | Bài 2, Bài 4 |
| `SRC-1972-03` | *Cách đánh B-52 của bộ đội tên lửa* ("Cẩm nang bìa đỏ") | BTL Quân chủng PK-KQ (10/1972) | Tài liệu hiện vật: quy tắc nhận dạng dải nhiễu bản chất B-52 | Bài 1, Bài 2 |
| `SRC-LB2-04` | *Linebacker II: A View from the Rock* | Karl J. Eschmann (Air University Press, 1989) | Thống kê phi vụ B-52 xuất kích từ Guam & U-Tapao, tổn thất phía Mỹ | Bài 1, Bài 3 |
| `SRC-LB2-05` | *Winged Shield, Winged Sword (Vol. II)* | USAF History Program (1997, ISBN 0-16-049009-X) | Trang 340–348: Kế hoạch Linebacker II và tác động tới Hiệp định Paris | Bài 1, Bài 3, Bài 4 |

---

## 🧪 Bằng chứng kiểm thử tự động (Quality Verification)

Toàn bộ 3 script kiểm thử của Chapter 1972 và quét an toàn mã nguồn đều **PASS 100%** tại local:

- `node docs/content/validate-1972-authoring.mjs`: **PASS** (8/8 scenes reachable, 7 nodes SAM-2 hợp lệ, text-first fallback).
- `node docs/content/validate-1972-lesson03.mjs`: **PASS** (cấu trúc bài đọc, đối chiếu sử liệu, reflection questions).
- `node docs/content/validate-1972-quiz.mjs`: **PASS** (5 câu hỏi phủ 4 CLO, options & explanation đầy đủ).
- `node scripts/member5/check-client-env.mjs`: Checked 250 files / **0 unsafe matches**.

---

## 📋 Checklist Review
- [ ] **Trúc (Historical Reviewer)**: Thẩm định sử liệu và ngôn ngữ toàn bộ 4 bài học Chapter 1972 theo Ma trận Bằng chứng trên.
- [ ] **Hưng (Architecture)**: Xác nhận cấu trúc dữ liệu JSON (Story JSON, Diagram JSON, Quiz JSON) khớp với domain types v2.
- [ ] **Product Owner**: Nghiệm thu trọn gói Golden Chapter Package của Thọ.
```
