# BACKEND TECHNICAL DEBT & SECURITY FIXES (Dành cho Vinh)

> Yêu cầu BẮT BUỘC trước khi Merge PR backend.

1. **Bảo mật Mật khẩu:** 
   - Hiện tại đang lưu plaintext password. 
   - *Yêu cầu:* Tích hợp `bcrypt` để mã hóa mật khẩu trước khi lưu vào database.
2. **Xác thực (Authentication/Authorization):**
   - Thiếu Auth middleware.
   - *Yêu cầu:* Tích hợp JWT (JSON Web Token). Các endpoint gửi/nhận dữ liệu nhạy cảm phải yêu cầu token (Bearer auth).
3. **Lỗ hổng Game Hacking (Client tự gửi score/userId):**
   - API hiện tại cho phép client tự do post `score` và `userId`, dẫn đến rủi ro hack điểm dễ dàng.
   - *Yêu cầu:* 
     - `userId` phải được trích xuất từ JWT Token trên Server (không nhận từ request body).
     - `score` phải được Server tính toán dựa trên các session trả lời câu hỏi (hoặc ít nhất phải có mã hóa/chống replay attack), không tin tưởng client 100%.
4. **Integration Tests:**
   - Đã pass syntax check và build, nhưng CHƯA có integration test cho các API endpoints.
   - *Yêu cầu:* Bổ sung test (VD: dùng `Jest` + `Supertest`) để verify luồng đăng nhập và submit score.
