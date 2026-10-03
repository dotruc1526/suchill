# Đấu trí — server online

Node.js 24, Express và Socket.IO. Server quản lý ghép trận, câu hỏi, thời gian, điểm và kết quả. Chỉ ghép hai phiên đang kết nối; không có bot thay thế.

## Chạy và kiểm thử

```powershell
cd server
npm ci
npm test
npm run dev
```

Mặc định cổng 3001, cho phép frontend tại localhost:8443 và 127.0.0.1:8443. Đặt ALLOWED_ORIGINS nếu dùng origin khác. Frontend dùng VITE_GAME_SERVER_URL để nối tới server.

Production phải cấu hình origin HTTPS và SESSION_SECRET ít nhất 32 ký tự. File env.example là mẫu; npm start không tự đọc .env, cần truyền biến qua môi trường hosting.

Hướng dẫn Internet, Docker và hai thiết bị: [ONLINE-DEPLOYMENT.md](ONLINE-DEPLOYMENT.md).

## Luồng kết nối

1. Service frontend gọi POST /session lấy token khách có chữ ký.
2. Socket xác thực bằng token; server quyết định identity. Một identity chỉ có một socket hoạt động.
3. join_queue tìm đối thủ, hoặc create_room / join_room dùng mã phòng riêng.
4. Cả hai ready thì bắt đầu. game_snapshot cung cấp trạng thái chính thức; submit_answer gửi roomId, questionId, answerIndex.
5. Chỉ công bố đáp án khi cả hai khóa hoặc hết giờ. game_over trả kết quả; EXP/xu chưa ghi vào tài khoản app.
6. Mất kết nối có 30 giây reconnect. Kết quả giữ 60 giây để nhận lại.

## Cấu trúc

- server.js: HTTP, CORS, giới hạn phiên và xác thực socket.
- sessionStore.js: ký và xác minh token khách.
- socketHandler.js: hàng chờ, trạng thái trận, điểm, reconnect.
- privateRooms.js: phòng bạn bè và hạn mã.
- gameSnapshot.js: dữ liệu công khai, giấu đáp án trước khi chốt.
- questionsData.js: 10 câu có sẵn, trộn ngẫu nhiên; chưa nhập AI/Studocu.
- matchmaking.js: ghép người chờ lâu nhất với đối thủ ngẫu nhiên trong queue chung.
- tests/: kiểm tra engine mạng thật, ghép ngẫu nhiên, polling fallback và deployment probe.

Backend dùng RAM, chạy một instance. Restart mất trận/phòng; chưa có lịch sử bền vững, xác thực tài khoản chính hay ghi rank/phần thưởng. Xem [feature contract](../docs/features/dau-tri/README.md) trước khi chuyển vào main.
