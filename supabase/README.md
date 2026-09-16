# Hướng Dẫn Tích Hợp Supabase Database Cho Dự Án "Sử Chill"

Dự án Sử Chill đã được xây dựng hoàn chỉnh **Database Framework & Service Layer** kết nối trực tiếp với **Supabase (PostgreSQL)**, đồng thời trang bị cơ chế **Offline Fallback** an toàn.

---

## 1. Khởi tạo Project trên Supabase (Miễn phí 100%)

1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập (hoặc đăng ký bằng GitHub).
2. Nhấn **"New project"**.
3. Điền thông tin:
   - **Name:** `su-chill` (hoặc tên tùy thích)
   - **Database Password:** Đặt mật khẩu an toàn và lưu lại
   - **Region:** Chọn `Southeast Asia (Singapore)` để có tốc độ truy vấn nhanh nhất tại Việt Nam.
4. Chờ 1-2 phút để Supabase tạo database.

---

## 2. Nạp Lược đồ CSDL (Schema) & Dữ liệu mẫu (Seed Data)

Trong bảng điều khiển Supabase Dashboard:
1. Vào mục **SQL Editor** ở thanh menu bên trái (biểu tượng `>_`).
2. Mở file:
   `supabase/migrations/20260916000000_create_suchill_schema.sql`
   - Copy toàn bộ nội dung dán vào SQL Editor và nhấn **RUN**.
   - *(Lệnh này sẽ tự động tạo đầy đủ 10 bảng, khóa ngoại, chỉ mục hiệu năng và kích hoạt Row Level Security - RLS an toàn)*.
3. Tiếp tục mở file:
   `supabase/migrations/20260916000001_seed_suchill_data.sql`
   - Copy toàn bộ nội dung dán vào SQL Editor và nhấn **RUN**.
   - *(Lệnh này sẽ nạp toàn bộ chương lịch sử 1954 Điện Biên Phủ, Hiệp định Genève, kịch bản Visual Novel, hệ thống thành tựu và 10 câu hỏi Kháng chiến chống Mỹ hào hùng)*.

---

## 3. Lấy API Keys & Cấu hình vào Ứng dụng

1. Trong Supabase Dashboard, vào **Project Settings** (biểu tượng bánh răng ⚙️) -> chọn **API**.
2. Tìm 2 giá trị:
   - **Project URL** (dạng `https://xyzcompany.supabase.co`)
   - **Project API keys** -> copy key **`anon` `public`**
3. Mở file `.env.local` ở thư mục gốc của dự án và điền:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Khởi động lại ứng dụng hoặc chạy `npm run dev`. Toàn bộ dữ liệu sẽ tự động được đọc và ghi trực tiếp từ Supabase Database!

---

## 4. Kiến trúc Database Framework

```
src/
├── lib/
│   └── supabase.ts             # Supabase Client Singleton & Fallback checker
├── types/
│   └── database.ts             # TypeScript types đồng bộ 100% với Postgres Schema
├── services/
│   ├── chapterService.ts       # Truy vấn chapters, lessons, quizzes từ Supabase
│   ├── userService.ts          # Đọc/ghi XP, level, coins, user_profiles trên Supabase
│   ├── visualNovelService.ts   # Kịch bản Visual Novel từ Supabase
│   ├── dauTriService.ts        # Ngân hàng 10 câu hỏi PvP từ Supabase
│   └── index.ts                # Barrel export chuẩn mực
```

---

## 5. Bộ kỹ năng Agent Skills (Supabase)

Dự án đã được trang bị sẵn 2 bộ kỹ năng Agent Skills chính thức từ GitHub của Supabase:
- `.agents/skills/supabase/SKILL.md`: Toàn tập kỹ thuật lập trình Supabase (Client, SSR, Auth, Storage, Realtime, RLS).
- `.agents/skills/supabase-postgres-best-practices/SKILL.md`: Chuẩn thiết kế Postgres hiệu năng cao (Indexing, Foreign Keys, tối ưu truy vấn).
