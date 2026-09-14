# SỬ CHILL — FRAMEWORK & HƯỚNG DẪN QUY CHUẨN PHÁT TRIỂN

Tài liệu này định nghĩa quy chuẩn kiến trúc (Framework Guidelines) cho dự án **Sử Chill** (Cả Giao diện UI & Tầng Dữ liệu Database / API). Tất cả thành viên phát triển hoặc công cụ AI khi thêm tính năng mới, chỉnh sửa code hoặc kết nối Database **BẮT BUỘC** phải tuân thủ các quy tắc dưới đây.

---

## 1. CẤU TRÚC THƯ MỤC TỔNG THỂ (Full Framework Architecture)

Tất cả mã nguồn mới phải được xếp vào đúng vị trí theo mô hình **Layered & Feature-Based**:

```text
src/
├── theme/               # 🎨 Nơi lưu Design Tokens (Bảng màu, Font chữ)
│   └── tokens.ts
├── components/          # 🧩 UI Dùng chung toàn ứng dụng
│   ├── ui/              # Atom UI (Button, Card, ChoiceOption)
│   └── layout/          # Layout (TopBar, BottomNav)
├── features/            # 🚀 Mô-đun theo từng TÍNH NĂNG (Feature-Based)
│   ├── home/            # Màn hình chính & Bản đồ hành trình
│   ├── learning/        # Màn hình chương & bài học
│   ├── quiz/            # Màn hình thử thách trắc nghiệm
│   ├── practice/        # Ôn tập thông minh
│   ├── ai-assistant/    # Trợ lý AI Sử Chill
│   ├── profile/         # Hồ sơ cá nhân & Thành tựu
│   └── visual-novel/    # Game Visual Novel tương tác (Kịch bản, Player)
├── services/            # 🔌 TẦNG KẾT NỐI DỮ LIỆU & DATABASE (Service Layer)
│   ├── chapterService.ts      # Quản lý Chương & Bài học
│   ├── visualNovelService.ts  # Quản lý Game Visual Novel từ DB/Cloud
│   └── userService.ts          # Quản lý Tiến độ, XP, Streak người dùng
├── types/               # 🏷️ TypeScript types toàn cục
│   └── index.ts
└── data/                # 📚 Dữ liệu tĩnh tạm thời (Mock Data)
    └── index.ts
```

---

## 2. QUY CHUẨN TẦNG DỮ LIỆU & DATABASE (Data & DB Readiness)

Ứng dụng áp dụng mô hình **Repository Pattern (Tách biệt Giao diện và Database)**:

1. **Giao diện (UI Components)** **KHÔNG ĐƯỢC** kết nối trực tiếp với Database hay gọi `fetch/axios` rải rác.
2. UI chỉ được gọi thông qua các hàm Service trong `src/services/` (ví dụ: `chapterService.getChapters()`, `visualNovelService.getStoryById()`).
3. Khi dự án bắt đầu kết nối Database (Supabase, Firebase, Node.js REST API, PostgreSQL...):
   - Bạn **CHỈ CẦN** nâng cấp code bên trong các file Service trong `src/services/`.
   - Toàn bộ giao diện UI và game sẽ tự động nhận dữ liệu từ Database mà **KHÔNG CẦN SỬA CODE GIAO DIỆN**.

### Gợi ý Schema Database cho Game Visual Novel & App:
* `chapters` (id, year, title, subtitle, description, unsplash_id, progress)
* `lessons` (id, chapter_id, title, duration, visual_novel_id, status)
* `visual_novel_stories` (id, title, description)
* `visual_novel_scenes` (id, story_id, scene_order, title, backdrop, image_url, emotion, text)
* `visual_novel_choices` (id, scene_id, label, response, is_correct, note)
* `user_profiles` (user_id, xp, streak, accuracy, total_lessons, achievements)

---

## 3. QUY CHUẨN BẢNG MÀU GIAO DIỆN (Color Palette Standards)

Dự án mang phong cách **Vintage Vietnamese History Scrapbook (Sổ tay lịch sử cổ điển)**. Tất cả giao diện mới phải dùng đúng mã màu trong [`src/theme/tokens.ts`](file:///c:/Users/Compuerte/Desktop/suchill/src/theme/tokens.ts):

| Vị trí | Mã màu Hex | Ý nghĩa |
| :--- | :--- | :--- |
| **Nền ứng dụng** | `#F5E6D0` | Giấy cuộn cổ Parchment |
| **Thẻ nội dung** | `#FBF4E8` | Giấy kem Cream Paper |
| **Header / Nút chính** | `#8B1A1A` | Đỏ con dấu Stamp Burgundy |
| **Chữ tiêu đề / Mực** | `#3D1A00` | Mực nâu đậm Deep Ink |
| **Chữ mô tả phụ** | `#7A4020` | Nâu vừa |
| **Đáp án ĐÚNG** | `#E8F5E2` (Nền) / `#3A5A2A` (Viền & Chữ) | Bôi xanh lá cây mộc |
| **Đáp án SAI** | `#FDE8E4` (Nền) / `#C4341A` (Viền & Chữ) | Bôi đỏ tươi |

---

## 4. QUY CHUẨN HÌNH ẢNH & TƯ LIỆU LỊCH SỬ

* Hình ảnh sử dụng cho các sự kiện lịch sử **phải là ảnh tư liệu thật** (Wikimedia Commons / ảnh lịch sử chính thống) hoặc tranh minh họa vector phong cách sepia giấy cổ.
* **Tuyệt đối không** sử dụng ảnh stock hiện đại, ảnh bịa đặt hoặc không đúng mốc lịch sử.

---

## 5. QUY CHUẨN LỰA CHỌN ĐÁP ÁN (Choice Feedback Contract)

Mọi chức năng trắc nghiệm / lựa chọn tương tác (Visual Novel, Quiz, Thử thách) khi người dùng chọn đáp án **PHẢI** dùng lại component [`ChoiceOption`](file:///c:/Users/Compuerte/Desktop/suchill/src/components/ui/ChoiceOption.tsx) hoặc tuân theo quy tắc:
1. Bôi xanh khi câu trả lời đúng / hợp lệ.
2. Bôi đỏ khi câu trả lời sai.
3. Làm mờ nhẹ các phương án chưa chọn.

---

## 6. BẢNG KIỂM TRA TRƯỚC KHI COMMIT (Developer Checklist)

- [ ] File mới đã đặt đúng vị trí thư mục trong `src/features/`, `src/services/` hoặc `src/components/ui/` chưa?
- [ ] Dữ liệu có thông qua Service Layer `src/services/` chưa?
- [ ] Giao diện đã sử dụng đúng màu giấy cuộn (`#F5E6D0`), đỏ con dấu (`#8B1A1A`) và mực nâu (`#3D1A00`) chưa?
- [ ] Nút lựa chọn đã bôi xanh khi đúng và bôi đỏ khi sai chưa?
- [ ] Ảnh minh họa có đúng mốc lịch sử chưa?
