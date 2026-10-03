# Chạy Đấu trí giữa thiết bị qua Internet

Backend không chạy bên trong Figma/Vite frontend. Hai thiết bị cần cùng URL backend công khai HTTPS.

## Kiểm thử local

```powershell
npm --prefix server ci
npm --prefix server test
npm --prefix server start
```

Frontend dùng http://localhost:3001 chỉ khi mở từ localhost; địa chỉ phát hành bắt buộc có VITE_GAME_SERVER_URL.

## Triển khai bằng Docker

Build context là server/: `docker build -t suchill-dautri ./server`.
Chạy trên dịch vụ hỗ trợ container Node.js, HTTP long-polling/WebSocket, process lâu dài và HTTPS ingress. Giữ một instance, không scale replicas. Public route phải giữ nguyên /session, /health và /socket.io/.

Biến môi trường backend:

- NODE_ENV=production
- PORT: hosting cấp hoặc 3001
- ALLOWED_ORIGINS: origin chính xác của frontend, phân cách dấu phẩy; không thêm path/dấu / cuối. Ví dụ https://app.example.com
- SESSION_SECRET: secret ngẫu nhiên >=32 ký tự, giữ ở hosting secret manager. Có thể tạo bằng `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` và nhập riêng vào hosting, không commit.
- TRUST_PROXY_HOPS: số reverse proxy đáng tin theo hạ tầng; mặc định 0. Không đặt trust proxy=true với header tùy ý.

Frontend build với VITE_GAME_SERVER_URL=https://game.example.com rồi redeploy frontend. Chỉ URL công khai được đặt VITE_; token không nằm trong bundle.

## Nghiệm thu Internet (chưa chạy trong phiên này)

1. GET https://game.example.com/health trả status ok.
2. Máy A dùng Wi-Fi, máy B dùng 4G; mở cùng frontend. Hai bên thấy đã kết nối máy chủ.
3. A tìm trận: chờ >10 giây vẫn không bot. B tìm trận: cả hai vào cùng trận, cùng câu và cùng thời hạn.
4. Thử phòng bạn bè: A tạo mã, B vào mã; mã không hợp lệ/tự vào phòng phải báo lỗi.
5. Tắt mạng một bên rồi bật lại trước 30 giây: khôi phục phòng/đáp án; quá 30 giây đối thủ thắng.
6. Hoàn thành, hòa, bỏ cuộc, chơi lại; không cộng XP local. Không có backend thì hiện lỗi, không có trận giả.
7. Kiểm tra tab Học/quiz/VN/profile và safe area trên điện thoại.

Không đưa service-role key vào client. Guest phiên hiện tại không phải Supabase Auth; triển khai public PvP thử nghiệm được nhưng chưa coi là ranked/reward production.

## Bản deploy chuẩn bị trên nền PR109

Branch `codex/dautri-online-pr109` thêm tab ĐẤU TRÍ vào app canonical, tải feature khi mở tab. PO bỏ AI Battle cũ; hai người thật ghép ngẫu nhiên trong queue chung. Đấu khác mạng đi qua server public, không cần mở cổng router hoặc chung Wi-Fi.

1. Deploy context `server/` bằng Dockerfile trên hosting có Node/container chạy lâu dài; giữ 1 instance và tránh sleep nếu cần ghép/reconnect ổn định.
2. Cấu hình các biến ở trên trong hosting. Health check `/health`; container có health probe. Proxy chuyển HTTP và WebSocket `/socket.io/`, timeout dài hơn 45 giây; không cache `/session` hoặc Socket.IO.
3. Build frontend với `VITE_GAME_SERVER_URL` public HTTPS. ALLOWED_ORIGINS phải khớp cả origin preview nếu thử trên Firebase preview channel.
4. Từ máy kiểm thử sau `npm --prefix server ci`, chạy:

```powershell
node server/scripts/smoke-online.js https://your-game-backend.example https://your-frontend.example
```

Probe tạo đúng hai phiên khách riêng, kiểm tra health/CORS, socket, ghép cùng room/câu hỏi và bỏ cuộc kết thúc rồi disconnect. Không ghi tài khoản/XP. PASS của probe từ một máy chưa thay thế nghiệm thu hai điện thoại khác mạng ở checklist trên.

Nếu chạy Node không Docker, hosting dùng install `npm ci --omit=dev` và start `npm start` tại server/. Cần Node 24+. Không dán SESSION_SECRET vào frontend hoặc file commit.

Tình trạng hiện tại: người dùng đã có tài khoản Render/xác minh email, đang nối lại phiên deploy; chưa có public URL hoặc evidence Wi-Fi ↔ 4G. Người dùng yêu cầu xác nhận trước thay đổi dự án chính/Firebase hiện có hoặc merge; thử backend riêng không thay main.

Nguồn cấu hình: [Socket.IO reverse proxy](https://socket.io/docs/v4/reverse-proxy/), [client options và polling/WebSocket](https://socket.io/docs/v4/client-options/).

## Cấu hình Render đã chuẩn bị

Root `render.yaml` và [hướng dẫn bật khác mạng](./RENDER-SETUP.md) cung cấp đường deploy cụ thể cho bản trial. Client xử lý cold start tối đa 90s. Firebase preview build nhận VITE_GAME_SERVER_URL qua publicConfiguration; chưa có URL thật thì không tự chế địa chỉ hoặc trận giả.
