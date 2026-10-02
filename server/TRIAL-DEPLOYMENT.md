# Bản thử Đấu Trí online độc lập

Nhánh deploy: `codex/dautri-public-trial`, dựa trên bản PvP `d48769a` đã kiểm chứng. Nhánh tích hợp PR115 đang có các thay đổi AI/luyện tập của task khác; nhánh public trial chỉ đóng gói Đấu Trí.

Frontend guest và backend cùng một dịch vụ Render, một origin HTTPS, một instance Free/Singapore. Không deploy Firebase, không cần Supabase config, không merge main. UI nhập tên khách rồi tìm đối thủ hoặc tạo/vào phòng; hai mạng khác nhau cùng nối tới backend này.

## Deploy

Blueprint root `render.yaml` dùng `Dockerfile.pvp-trial`, context repo root. SESSION_SECRET được Render tự sinh và giữ riêng. `STATIC_DIR=/app/public` được Docker đặt; Render cấp `RENDER_EXTERNAL_URL`, backend chỉ nhận đúng origin đó và các ALLOWED_ORIGINS đã cấu hình nếu có. Không suy đoán URL theo tên service.

Nếu đã tạo service backend từ blueprint cũ, chuyển blueprint/service sang nhánh `codex/dautri-public-trial`, Dockerfile `./Dockerfile.pvp-trial`, context `.`, deploy commit đã review. Chỉ đổi dịch vụ trial, giữ Free và tắt auto deploy; không thay dịch vụ dự án chính.

Sau khi Render báo Live, lấy URL HTTPS từ Dashboard. Mở link đó trực tiếp để vào trường đấu, không cần mở Dashboard trong lúc chơi.

## Kiểm chứng

```powershell
npm --prefix server ci
npm run test:pvp:trial
node server/scripts/smoke-online.js BACKEND_HTTPS_ORIGIN SAME_HTTPS_ORIGIN
```

Browser QA dùng bản build static thật qua Express + Socket.IO, nhập hai tên, ghép cùng câu, bỏ cuộc và kết quả. Smoke public phải PASS trước bàn giao link. Sau đó thử hai điện thoại: A Wi-Fi, B 4G → cùng link → ĐẤU TRÍ → tìm trận hoặc mã phòng. Smoke từ một máy không thay nghiệm thu hai thiết bị khác mạng.

Free có thể ngủ khi không có traffic; lần mở đầu có thể chờ máy chủ khởi động. State trận và hạng thử nghiệm còn RAM, restart sẽ mất; không cấp XP/xu/rank tài khoản. Ngân hàng câu prototype chưa nghiệm thu lịch sử/release production.

Nguồn: [Render deployment environment](https://render.com/docs/environment-variables), [Blueprint](https://render.com/docs/blueprint-spec), [Free limits](https://render.com/docs/free).
