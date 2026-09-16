# Đấu Trí - Máy chủ Socket

Máy chủ Backend cho tính năng Đấu Trí (PvP 1v1 Quiz Battle) thời gian thực, xây dựng bằng Node.js, Express và Socket.io.

## Yêu cầu hệ thống
- Node.js 18+

## Cài đặt
1. Di chuyển vào thư mục server:
   ```bash
   cd server
   ```
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

## Khởi chạy máy chủ
- Chạy môi trường phát triển (tự động tải lại):
  ```bash
  npm run dev
  ```
- Chạy môi trường sản phẩm:
  ```bash
  npm start
  ```
Máy chủ sẽ chạy trên cổng `3001` theo mặc định.

## Cách kiểm thử
1. Mở 2 tab trình duyệt cho ứng dụng client.
2. Cả 2 tab cùng truy cập vào mục "Đấu Trí".
3. Nhấp "TÌM TRẬN" trên cả 2 tab.
4. Hệ thống sẽ ghép cặp 2 người chơi dựa trên số EXP (nếu lệch không quá 500) hoặc ghép ngẫu nhiên/ghép bot.

## Tài liệu Socket Events

| Event Name | Phát bởi | Mô tả |
|------------|----------|-------|
| `join_queue` | Client | Đăng ký tìm trận. Gửi `{ userId, username, exp, level }` |
| `cancel_queue` | Client | Hủy tìm trận khi đang trong hàng chờ |
| `ready` | Client | Thông báo đã sẵn sàng vào game sau khi tìm thấy đối thủ |
| `submit_answer`| Client | Gửi câu trả lời: `{ roomId, answerIndex }` |
| `searching` | Server | Xác nhận đã vào hàng đợi tìm trận |
| `match_found` | Server | Báo tìm thấy đối thủ, gửi thông tin phòng và 2 người chơi |
| `question_start`| Server | Bắt đầu câu hỏi mới (kèm thời gian 15s) |
| `answer_result` | Server | Kết quả câu trả lời của cá nhân (đúng/sai, điểm nhận được, combo) |
| `opponent_answered`| Server | Thông báo đối thủ đã trả lời xong |
| `question_end` | Server | Hết thời gian hoặc cả 2 đã trả lời. Trả về đáp án đúng và điểm số |
| `game_over` | Server | Kết thúc trận đấu, trả về người thắng, điểm EXP và số xu thưởng |
| `opponent_disconnected`| Server | Báo hiệu đối thủ đã ngắt kết nối. Sẽ tự động thắng sau 30s |

## Tổng quan Kiến trúc
- **server.js**: Entry point, khởi tạo HTTP server và gắn Socket.io.
- **socketHandler.js**: Logic chính xử lý luồng sự kiện Socket (tìm trận, vào trận, tính điểm, xử lý bot...).
- **questionsData.js**: Dữ liệu câu hỏi tĩnh. Chứa các câu hỏi lịch sử Việt Nam với định dạng chuẩn và hàm trộn ngẫu nhiên.
- Dữ liệu in-memory: Hàng chờ (`matchQueue`), Các phiên chơi (`gameSessions`), và Liên kết Socket-Phòng (`playerSessions`) đều lưu trong bộ nhớ.
