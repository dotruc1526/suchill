# Lựa chọn 4 – Kiểm thử người dùng & Thu thập phản hồi

## Mục tiêu
- Đánh giá trải nghiệm người học trên nội dung Chapter 1972 và Pilot Mậu Thân 1968.
- Thu thập phản hồi thực tế từ nhóm thử nghiệm nội bộ và cải tiến nội dung, UI và dữ liệu.

## Công việc
1. **Chuẩn bị môi trường test**
   - Tạo tài khoản thử nghiệm trên nền tảng M3 Learning Journey.
   - Đảm bảo các fixture (`chapter1972Fixture.ts`) đã được triển khai và có thể truy cập.
2. **Viết kịch bản kiểm thử**
   - Các tình huống: mở lesson, xem video fallback, thực hiện quiz, đánh giá kết quả.
   - Ghi lại thời gian tải, lỗi console, và hành vi UI.
3. **Thu thập phản hồi**
   - Sử dụng Google Form hoặc Notion để ghi nhận nhận xét, khó khăn, đề xuất.
   - Tập hợp ít nhất 5 người thử nghiệm (đội nội bộ).
4. **Phân tích dữ liệu**
   - Tổng hợp các vấn đề quan trọng (bug, nội dung không rõ ràng, UX).
   - Đề xuất danh sách cải thiện (cập nhật markdown, sửa quiz, cải thiện fallback text).
5. **Báo cáo**
   - Tạo file `docs/reports/user-testing-OPTION-004.md` với kết quả và kế hoạch hành động.

## Kết quả mong đợi
- Báo cáo hoàn chỉnh, các issue được tạo trong repository.
- Các cải tiến được lên kế hoạch và ưu tiên cho sprint tiếp theo.

**Liên quan**: Sử dụng fixture `src/services/next/fixtures/chapter1972Fixture.ts` đã được tạo trong **Lựa chọn 2**.
