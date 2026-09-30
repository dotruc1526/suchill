# QUY CHUẨN SƯ PHẠM & TIÊU CHÍ HOÀN THÀNH BÀI HỌC (PEDAGOGICAL MASTERY & PROGRESSION RULES)
> **Dự án:** Sử Chill — Học Lịch Sử Qua Trải Nghiệm Tương Tác\
> **Tác giả:** Thọ (Member 1 — Content Lead)\
> **Mục đích:** Xác lập khung quy chuẩn sư phạm cho hệ thống tiến độ, tính điểm thưởng (XP), chuỗi ngày học (Streak) và cấp chứng chỉ hoàn thành Chapter trong Milestone 5 (M5)\
> **Chuẩn kiến trúc:** Phase 7 Progress, Reward & Analytics Spec\
> **Ngày ban hành:** 30/09/2026

---

## 1. NGUYÊN TẮC PHÂN ĐỊNH RANH GIỚI SƯ PHẠM (PEDAGOGICAL BOUNDARY)

Để đảm bảo việc học lịch sử thực chất, không bị biến thành trò "cày cuốc điểm số" và tôn trọng tâm lý học sinh:

1. **Ranh giới Lựa chọn Tương tác (Narrative / Roleplay vs. Knowledge Check):**
   - Trong các bài học Visual Novel (như Bài 2 SAM-2): Các câu hỏi tình huống, lựa chọn góc nhìn nhân vật (Sĩ quan điều khiển vs. Kíp trắc thủ) là **lựa chọn nhập vai (kind: 'narrative')**.
   - **Quy tắc:** Tuyệt đối KHÔNG gán đúng/sai, không trừ điểm, không phạt khi người học chọn các góc nhìn khác nhau. Mục đích là khơi gợi sự đồng cảm và khám phá.
2. **Đánh giá Kiến thức Độc lập (Assessment via Quiz):**
   - Chỉ có các bài kiểm tra trắc nghiệm chính thức (như Bài 4 Quiz Assessment) mới áp dụng tính điểm và kiểm tra chuẩn đầu ra (`CLO-1` đến `CLO-4`).

---

## 2. TIÊU CHÍ HOÀN THÀNH & TÍNH ĐIỂM (PASSING SCORE & XP REWARD)

### 2.1. Tiêu chí Đạt Chapter (Passing Criteria)
* **Số lượng câu hỏi:** 5 câu hỏi trắc nghiệm khách quan 4 lựa chọn (A, B, C, D).
* **Điểm đạt chuẩn (Passing Threshold):** **$\ge 80\%$** (tức đúng ít nhất **4/5 câu**).
* **Kết quả khi ĐẠT:**
  - Mở khóa trạng thái `COMPLETED` cho Chapter.
  - Cộng **+100 XP** danh dự vào hồ sơ cá nhân.
  - Kích hoạt chuỗi ngày học liên tục (**Streak +1 ngày**).
  - Trao Huy hiệu Danh dự tương ứng với Chapter.

### 2.2. Chính sách Làm lại bài (Quiz Retry Policy & Anti-Farming)
* Người học được phép làm lại bài trắc nghiệm không giới hạn số lần để củng cố tri thức.
* **Quy tắc chống cày điểm (Idempotency Rule):**
  - Chỉ cộng điểm kinh nghiệm (XP) cho lần đầu tiên người học đạt $\ge 80\%$.
  - Các lần làm lại sau đó chỉ cập nhật tỷ lệ chính xác cao nhất (Best Score) vào hồ sơ, **không cộng thêm XP** để ngăn ngừa gian lận hoặc cày điểm ảo.

---

## 3. DANH MỤC HUY HIỆU DANH DỰ (HONORARY BADGES)

Mỗi Chapter hoàn thành sẽ trao một huy hiệu gắn liền với giá trị lịch sử cốt lõi:

| Mã Chapter | Tên Huy Hiệu | Tiêu Chuẩn Đạt | Thông Điệp Sư Phạm |
|---|---|---|---|
| `ch-1972-dien-bien-phu-tren-khong` | **"Dũng Sĩ Vạch Nhiễu Thăng Long"** | Hoàn thành trọn gói 4 bài học và đạt $\ge 4/5$ điểm Quiz | Biểu dương tinh thần làm chủ công nghệ, trí tuệ và bản lĩnh kiên cường của bộ đội phòng không Hà Nội. |
| `ch-mt68-tong-tien-cong-mau-than` | **"Kỳ Tích Biệt Động Sài Gòn"** | Hoàn thành trọn gói 4 bài học Mậu Thân và đạt $\ge 4/5$ điểm Quiz | Ghi nhận sự dũng cảm phi thường, đức hy sinh và thế trận lòng dân trong lòng đô thị. |

---

## 4. QUY TẮC MỞ KHÓA BÀI HỌC (PREREQUISITE PROGRESSION)

Để đảm bảo mạch nhận thức sư phạm (từ Khám phá bối cảnh $\rightarrow$ Nhập vai trải nghiệm $\rightarrow$ Đọc sâu tư liệu $\rightarrow$ Đánh giá tổng hợp):

1. **Bài 1 (Video Hook):** Mở tự do khi học sinh chọn Chapter.
2. **Bài 2 (Visual Novel):** Mở khóa sau khi người học đã xem hết Video Bài 1 (hoặc đọc xong thẻ tóm tắt Text Fallback).
3. **Bài 3 (Standard Reading):** Mở khóa sau khi người học đã tương tác qua các phân cảnh chính của Bài 2.
4. **Bài 4 (Quiz Assessment):** Mở khóa sau khi đã đọc Bài 3. Học sinh có thể làm lại Quiz bất kỳ lúc nào để nâng cao điểm số.

---

## 5. THỰC HIỆN TRONG CODE (MAPPING TO CODE SERVICES)
Tài liệu này là căn cứ để:
- Dương (Member 4) hiển thị đúng trạng thái Modal hoàn thành bài học trong `M3-06` (`LessonCompletionModal.tsx`).
- Vinh (Member 5) lập trình các hàm tính thưởng trong `M5-03` (`rewardService.ts`) và `M5-04` (`streakService.ts`).
