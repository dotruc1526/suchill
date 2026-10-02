# Đấu Trí online 1vs1

Scope được người dùng xác nhận theo PO ngày 2026-10-03: thay task AI Battle cũ bằng PvP dựa trên prototype đang có. [Task](../../tasks/active/PVP-ONLINE-001.md).

## Luồng

React feature → useSocketGame → gameSocketService → backend Express/Socket.IO riêng.
Hai thiết bị truy cập cùng origin backend public HTTPS; mạng Wi-Fi/4G của mỗi người không cần giống nhau. Không dùng kết nối peer-to-peer hoặc LAN discovery.

`POST /session` cấp bearer token PvP khách (24h); mỗi token chỉ có một socket active. Tài khoản app chỉ cho tên hiển thị và scope phiên để tránh trộn tài khoản, không cấp quyền bằng ID từ client. Thay phiên tài khoản remount CompletionSession và feature; game scope không dùng lại credential của phiên trước.

Queue chung ghép người chờ lâu nhất với đối thủ ngẫu nhiên mỗi 250ms; không dùng EXP client hoặc bot. Một người thì tiếp tục chờ. Phòng bạn bè dùng mã sáu ký tự, hết hạn sau 5 phút.

10 câu × 15 giây; server giữ đáp án, deadline, khóa đáp án một lần và tính điểm: đúng = 100 + 10 × số giây còn lại + 20 × combo trước câu. Sai/hết giờ = 0, reset combo. Tổng điểm bằng nhau là hòa. Đáp án đúng/giải thích chỉ công bố khi cả hai đã trả lời hoặc hết giờ.

Disconnect chờ 30 giây; reconnect token cũ khôi phục snapshot. Quá hạn đối thủ thắng. Server replay kết quả 60 giây; result không ghi authoritative XP/xu/rank. Restart server mất trạng thái trận; chỉ triển khai một instance.

## Service events

- Client: join_queue, cancel_queue, create_room, join_room, leave_room, ready, submit_answer, forfeit.
- Server: idle, searching, room_created, match_found, game_snapshot, game_over, error.
- submit_answer: roomId, questionId, answerIndex; server xác minh room membership/current phase/deadline/duplicate.
- UI chỉ trình bày snapshot; màu feedback dùng tokens; rời queue/trận cần xác nhận, PWA update chỉ ở Home an toàn.

## Triển khai và nghiệm thu

[Backend deployment](../../../server/ONLINE-DEPLOYMENT.md). `VITE_GAME_SERVER_URL` là public HTTPS origin; `ALLOWED_ORIGINS` là origin frontend chính xác. Firebase static hosting không chạy process Socket.IO.

User chưa có hosting: có thể hoàn thành code/tests/Docker/runbook trước. Nghiệm thu Wi-Fi ↔ 4G, lịch sử/ngân hàng câu hỏi, tải lớn, tài khoản/reward và production release là các bước riêng chưa được claim PASS.
