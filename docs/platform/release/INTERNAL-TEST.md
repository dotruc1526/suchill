# Kết quả người dùng thử nội bộ

Người dùng 2026-10-03 trên Android, preview m6-android-1954 / build bfc05ef6fabc8087b4c0:

- Ban đầu tài khoản đã tạo nhưng đăng nhập bằng tên báo lỗi. Root sửa CORS đúng origin preview, giữ bốn origin local; domain lạ vẫn bị chặn. Người dùng thử lại và xác nhận “Đăng nhập được”.
- Người dùng xác nhận “Đã thử hết, đều chạy được” cho cài app/mở từ icon, video/phụ đề/resume, xoay màn hình/chữ lớn và mở khi tắt mạng.
- Người dùng yêu cầu không ghi hồ sơ bằng chứng và không cung cấp thêm cấu hình máy; không hỏi lại. TalkBack/iOS, hai-build update, hiệu năng máy yếu và thử UI1954 mới trên điện thoại chưa được quan sát.

Đây là phản hồi thật của người dùng cho các bước trên, không thay nghiệm thu nội dung/quyền/media, học hiểu/quiz, manual accessibility hoặc toàn bộ release matrix. Browser regression của UI1954 mới được review riêng. Không lưu dữ liệu tài khoản, mật khẩu hoặc token trong hồ sơ này.

M6 và M7 cùng OPEN theo quyết định PO mới; chưa đạt gate release. Trước public release, các bước còn lại theo Phase8 phải được reviewer và PO chấp nhận; không tự điền kết quả thay người dùng.

Latest approved scheduling decision: M7 now OPEN alongside M6 by Dương/PR113; earlier LOCKED wording is superseded. Individual historical/media/manual/privacy/release dependencies are unchanged. [Decision](../../tasks/active/M7-GATE-OPEN-001.md).
