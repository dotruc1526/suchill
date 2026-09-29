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

### 📚 Ma trận Bằng chứng & Trích dẫn Nguồn sử liệu (Evidence & Citation Matrix)

### 1. Bảng Trích Dẫn Nguồn trên các Trang Chính Thống

| Trang chính thống | Tiêu đề bài viết tư liệu | Link bài viết (Click để mở) | Dữ kiện lịch sử được bảo chứng | Bài học áp dụng |
|---|---|---|---|---|
| **Báo điện tử Chính phủ** | *Hà Nội - Điện Biên Phủ trên không 1972: Sức mạnh Việt Nam và tầm vóc thời đại* | [baochinhphu.vn](https://baochinhphu.vn/ha-noi-dien-bien-phu-tren-khong-1972-suc-manh-viet-nam-va-tam-voc-thoi-dai-102221209145629429.htm) | Toàn cảnh 12 ngày đêm, bắn rơi 81 máy bay (34 B-52, 16 chiếc rơi tại chỗ), buộc Mỹ ký Hiệp định Paris 1973 | **Bài 1, Bài 3, Bài 4** |
| **Báo Quân đội nhân dân** | *Bài 2: Chuẩn bị chu đáo, kỹ lưỡng trên tất cả mọi mặt* | [qdnd.vn](https://ct.qdnd.vn/ho-so-tu-lieu/bai-2-chuan-bi-chu-dao-ky-luong-tren-tat-ca-moi-mat-521888) | Tên lửa SAM-2 (S-75 Dvina), vai trò radar trước nhiễu điện tử, thuật ngữ *"vạch nhiễu tìm thù"*, phổ biến Cẩm nang bìa đỏ | **Bài 1, Bài 2** |
| **Báo Quân đội nhân dân** | *Hạ con "ngáo ộp" đầu tiên* | [qdnd.vn](https://ct.qdnd.vn/chan-dung-nguoi-linh/ha-con-ngao-op-dau-tien-528517) | Tiểu đoàn 59 (Trung đoàn 261) phóng 2 đạn SAM-2 bắn rơi chiếc B-52 đầu tiên tại cánh đồng Chuôm, Phù Lỗ lúc 20h13 đêm 18/12 | **Bài 2** |
| **Báo Quân đội nhân dân** | *Huyền thoại tên lửa SAM-2* | [qdnd.vn](https://ct.qdnd.vn/phong-su-dieu-tra/huyen-thoai-ten-lua-sam-2-528519) | Cấu trúc kíp chiến đấu SAM-2 trong cabin Xe K, môi trường tác chiến điện tử ECM tháng 12/1972 | **Bài 2, Bài 4** |
| **Báo Nhân Dân** | *"Pháo đài bay" B-52 đầu tiên đã bị hạ gục như thế* | [nhandan.vn](https://nhandan.vn/phao-dai-bay-b52-dau-tien-da-bi-ha-guc-nhu-the-post440097.html) | Tuyến lửa Vĩnh Linh 1966-1967 nghiên cứu cách đánh B-52, quá trình hình thành tài liệu "Cẩm nang bìa đỏ", SA-75 SAM-2 | **Bài 1, Bài 2** |
| **Báo Nhân Dân** | *Thắng lợi của sức mạnh đại đoàn kết dân tộc* | [nhandan.vn](https://nhandan.vn/thang-loi-cua-suc-manh-dai-doan-ket-dan-toc-post385567.html) | Tội ác bom rải thảm B-52 tại phố Khâm Thiên đêm 26/12 (287 người chết, 290 người bị thương) và Bệnh viện Bạch Mai | **Bài 3, Bài 4** |
| **Tạp chí Cộng sản** | *Chiến thắng "Điện Biên Phủ trên không" - Ý chí, bản lĩnh và trí tuệ Việt Nam* | [tapchicongsan.org.vn](https://www.tapchicongsan.org.vn/en_US/web/guest/dang-uy-khoi-doanh-nghiep-trung-uong/-/2018/826621/view_content) | Phân tích đòn bẻ gãy ý chí tập kích Linebacker II, tác động trực tiếp buộc Nixon tuyên bố ngừng ném bom ngày 30/12/1972 | **Bài 3, Bài 4** |

### 2. Sách in & Công trình lịch sử chính quy:
| Mã nguồn | Tài liệu tham chiếu | Cơ quan / Tác giả & Năm XB | Vị trí tham chiếu cụ thể (Locator) | Bài học áp dụng |
|---|---|---|---|---|
| `SRC-LB2-01` | *Lịch sử Quân đội nhân dân Việt Nam (1944 - 1975)* | Viện LSQSVN (NXB QĐND, 2005) | Chương IX: Đánh bại cuộc tập kích đường không, tr. 620–652 | Bài 1, Bài 3, Bài 4 |
| `SRC-LB2-02` | *Lịch sử Quân chủng Phòng không - Không quân (1963 - 2013)* | Viện LSQS — BTL PK-KQ (2013, ISBN 978-604-51-0988-5) | Chương V: Chiến dịch bảo vệ Hà Nội - Hải Phòng, tr. 280–335 | Bài 1, Bài 2, Bài 3, Bài 4 |
| `SRC-LB2-03` | *Điện Biên Phủ trên không — Ý chí và trí tuệ Việt Nam* | Thượng tướng Chu Huy Mân (chủ biên, 2002) | Diễn biến 12 ngày đêm, số liệu thương vong Khâm Thiên tr. 180–195 | Bài 3, Bài 4 |
| `SRC-1972-02` | *Lịch sử Bộ đội Tên lửa Phòng không (1965 - 2015)* | BTL PK-KQ (NXB QĐND, 2015, ISBN 978-604-51-1823-8) | Cấu tạo kíp trắc thủ SAM-2 và các trận đánh tháng 12/1972 | Bài 2, Bài 4 |
| `SRC-1972-03` | *Cách đánh B-52 của bộ đội tên lửa* ("Cẩm nang bìa đỏ") | BTL PK-KQ (10/1972) | Tài liệu hiện vật: quy tắc nhận dạng dải nhiễu bản chất B-52 | Bài 1, Bài 2 |
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

## 🛠️ Khắc phục 5 điểm thẩm định sử liệu theo ý kiến của Trúc (Historical Reviewer)

Toàn bộ 5 điểm phản hồi trên PR #54 đã được rà soát và khắc phục triệt để trên cả hai nhánh `content/tho-lesson-02-1972-vn-v2` và `content/tho-chapter-1972-package`:
1. **Scene 2/4 & Sơ đồ SAM-2 (Quy trình kíp chiến đấu & mốc cự ly):**
   - Loại bỏ các mô tả cơ khí vi mô chưa đủ chứng cứ sách vở cấp trang ("thao tác tay quay", "vô lăng vi chỉnh"), loại bỏ khẩu lệnh dồn dập và đếm ngược cự ly giả lập ("40km... 35km... 30km").
   - Giữ văn phong hiệp đồng tổng quát đúng chuẩn `CLM-1972-VN-002` trong `CONTENT-016-EVIDENCE.md`.
2. **Scene 5 (Số lượng máy gây nhiễu & từ ngữ chưa kiểm chứng):**
   - Đính chính số liệu gây nhiễu: Tốp 3 chiếc B-52 mang 45 máy gây nhiễu (chuẩn hóa theo bài viết trên Báo Quân đội nhân dân `SRC-1972-WEB-01`), không dùng từ ước lệ "hàng trăm máy phát nhiễu".
   - Loại bỏ các từ ngữ văn chương/tiếng lóng chưa kiểm chứng ("bó chổi chà") và mô tả cảm quan màn hiện sóng ("độ mịn, gợn sóng đặc trưng").
3. **Scene 6 Knowledge Check (Tên lửa chống bức xạ Shrike):**
   - Điều chỉnh phương án và lời giải thích: không tuyệt đối hóa "hễ phát sóng liên tục là lập tức bị Shrike tiêu diệt", mà làm rõ việc phát sóng liên tục làm tăng nguy cơ bị Shrike bám bắt và phân tích nghệ thuật tắt/bật sóng linh hoạt của bộ đội tên lửa.
4. **Trạng thái phê duyệt Story JSON:**
   - Điều chỉnh `reviewStatus` trong `LESSON-02-1972-STORY.json` từ `"approved"` về `"ready_for_review"`, tuân thủ nguyên tắc không tự phong phê duyệt trước khi có sign-off chính thức từ Trúc và Product Owner.
5. **Làm rõ phạm vi kiểm thử tự động:**
   - Cập nhật task card `CONTENT-017`: Ghi nhận `validate-1972-authoring.mjs` có vai trò kiểm tra tính toàn vẹn cú pháp, liên kết đồ thị cảnh (graph reachability) và text-fallback; tính chuẩn xác sử liệu do con người (Trúc & PO) thẩm định dựa trên Ma trận Bằng chứng.

---

## 📋 Checklist Review
- [ ] **Trúc (Historical Reviewer)**: Thẩm định sử liệu và ngôn ngữ toàn bộ 4 bài học Chapter 1972 theo Ma trận Bằng chứng trên.
- [ ] **Hưng (Architecture)**: Xác nhận cấu trúc dữ liệu JSON (Story JSON, Diagram JSON, Quiz JSON) khớp với domain types v2.
- [ ] **Product Owner**: Nghiệm thu trọn gói Golden Chapter Package của Thọ.
```
