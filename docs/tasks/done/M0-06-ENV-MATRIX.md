# M0-06 — Ma trận env và kế hoạch xử lý credential

> 2026-09-27 · Chỉ ghi tên biến và cách kiểm tra; không lưu giá trị key/token.

| Tên / loại | Nơi được phép dùng | Quy tắc |
|---|---|---|
| `VITE_SUPABASE_URL` | Browser build | Public project URL; URL HTTPS, riêng localhost được HTTP để phát triển. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Browser build | Chỉ key `sb_publishable_…` hoặc legacy JWT có role `anon`; không phải nguồn quyền truy cập, vẫn cần RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` / `sb_secret_…` | Trusted backend/Edge Function sau này | Tuyệt đối không có prefix `VITE_`/`NEXT_PUBLIC_`, không nằm trong `.env.example` hoặc browser bundle. Chưa sử dụng trong M0. |
| Signing/API/webhook/AI secrets | Trusted backend sau này | Cùng quy tắc server-only; không đưa vào client, fixture, docs, log hay chat. |

`.env.example` hiện chỉ có hai tên public ở trên và placeholder; `.env.local` không được đọc, sửa hay commit trong M0-06. `src/services/next/clientConfig.ts` là boundary đọc đúng hai biến browser-safe; nó chưa tạo Supabase client thật (thuộc BE-001/M4). Scanner `scripts/member5/check-client-env.mjs` kiểm tra source, docs/scripts, file Git theo dõi và bundle; phát hiện file env riêng bị track theo **tên file** và không đọc nội dung file đó. Kết quả scan tĩnh không thay thế RLS hoặc kiểm tra quyền ở Supabase.

## Rotation trước M4 / production integration

1. Product owner và người quản trị Supabase xác định credential đặc quyền nào từng bị chia sẻ, chỉ bằng tên/loại và nơi sử dụng; không chép giá trị vào task card.
2. Trước khi bật BE-001/M4 trên môi trường dùng chung, người có quyền tạo/rotate credential mới trong Supabase dashboard. Không làm bước này trong M0-06 vì có thể làm gián đoạn backend đang dùng key cũ.
3. Cập nhật credential mới qua secret manager hoặc cấu hình trusted backend/Edge Function, không qua Git, `VITE_` hay chat; deploy và kiểm tra backend bằng thao tác không tiết lộ secret.
4. Thu hồi key cũ, xác nhận đường backend còn hoạt động với key mới và key cũ không còn quyền. Kiểm tra Git tracking, source và production bundle bằng scanner; kiểm thử RLS user A không đọc/ghi user B trong QA-003 khi schema/auth đã có.
5. Product owner ghi xác nhận ngày, môi trường và kết quả vào card security tương ứng (không ghi giá trị key). Nếu Supabase chưa có project/credential, ghi `not yet provisioned`; thực hiện rotation trước lần tích hợp production đầu tiên nếu sau này có key từng chia sẻ.

M0-06 chỉ bàn giao **kế hoạch** và guard/scan; không tuyên bố đã rotate, có RLS hay production Supabase an toàn. Product owner đã xác nhận kế hoạch qua lời Vinh chuyển ngày 2026-09-27; rotation thật vẫn phải thực hiện trước M4.
