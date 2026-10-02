# Bật Đấu Trí khác Wi-Fi trên nền PR109

Bản thử nghiệm gồm frontend Firebase của PR109 và một backend Socket.IO public. Hai người mở cùng frontend, backend ghép người thật từ mọi mạng trong queue chung.

## Backend

[Tạo backend từ nhánh PvP](https://render.com/deploy?repo=https%3A%2F%2Fgithub.com%2Fdotruc1526%2Fsuchill%2Ftree%2Fcodex%2Fdautri-online-pr109).

Link cần tài khoản Render của bạn và nhánh đã được push. Blueprint root `render.yaml` dùng Docker, Singapore, một instance, Free trial, health `/health`. Auto deploy tắt để push không tự restart trận. SESSION_SECRET được Render sinh riêng, không cần gửi secret qua chat.

Trong form, điền ALLOWED_ORIGINS bằng origin frontend chính xác. Với preview hiện tại của PR109:

```text
https://suchill-preview--m6-android-1954-p8pbahbd.web.app
```

Nếu thêm origin khác, phân cách bằng dấu phẩy; không dùng wildcard/path/dấu slash cuối. Kiểm tra URL preview còn hiệu lực; origin mới phải được thêm đúng.

Sau deploy, lấy origin HTTPS thực của service từ Dashboard, ví dụ `https://<service-thực>.onrender.com`. Không suy đoán hostname từ tên blueprint.

## Frontend Firebase

Trong file `.env.local` riêng của bản frontend PR109, giữ public Supabase config và thêm:

```text
VITE_GAME_SERVER_URL=https://<backend-thực>.onrender.com
```

Script `node scripts/release/build-hosting-preview.mjs` đã được sửa để nhận biến này (bản gốc PR109 chỉ nhận hai biến Supabase nên không nối PvP được). Build kiểm tra HTTPS/origin và không đưa backend secret vào client. Deploy bản build lên preview channel qua quy trình Firebase hiện có; không đổi live site/Auth/database để bật PvP.

## Kiểm thử

1. Chạy `node server/scripts/smoke-online.js BACKEND_ORIGIN FRONTEND_ORIGIN` từ repo sau `npm --prefix server ci`.
2. Điện thoại A Wi-Fi, B 4G/5G: mở cùng frontend → ĐẤU TRÍ → TÌM ĐỐI THỦ ONLINE.
3. Xác nhận cùng câu/điểm/kết quả; thử mất mạng rồi quay lại trong 30s, bỏ cuộc và tìm trận mới.

Gói Free có thể ngủ sau 15 phút không có traffic và khởi động lại khoảng một phút. Client chờ health tối đa 90s, hiển thị tiến trình và hủy chờ khi rời màn hình/đổi tài khoản. Restart vẫn mất trận RAM; đây là bản thử nghiệm, chưa ranked/reward production.

Nguồn: [Blueprint](https://render.com/docs/blueprint-spec), [deploy button](https://render.com/docs/deploy-to-render), [WebSocket](https://render.com/docs/websocket), [giới hạn Free](https://render.com/docs/free).

Chưa deploy trong phiên này: cần người dùng kết nối/đăng nhập tài khoản Render. Chưa có backend public URL, chưa claim Wi-Fi ↔ 4G PASS.
