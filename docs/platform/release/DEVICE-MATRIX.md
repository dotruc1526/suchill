# Kiểm thử PWA trên thiết bị thật

Ghi một dòng cho mỗi cấu hình thực dùng; để CHƯA KIỂM nếu chưa làm. Chrome desktop emulation/AX tree là evidence bổ sung.

| Thiết bị / OS / browser version | Người thử / ngày | Browser và cài từ icon | Update hai version | Mất mạng / deep link / pending | Video / caption / âm thanh / hiệu năng | Evidence / lỗi |
|---|---|---|---|---|---|---|
| Android Chrome thực | Chưa cung cấp | CHƯA KIỂM | CHƯA KIỂM | CHƯA KIỂM | CHƯA KIỂM | — |
| iPhone Safari + Add to Home Screen | Chưa cung cấp | CHƯA KIỂM | CHƯA KIỂM | CHƯA KIỂM | CHƯA KIỂM | — |
| Desktop Chrome/Edge | Chưa cung cấp | CHƯA KIỂM | CHƯA KIỂM | CHƯA KIỂM | CHƯA KIỂM | — |

1. Mở URL HTTPS preview, cài/add to home screen, đóng browser và mở từ icon.
2. Học, dừng video, reload và kiểm tra resume đúng tài khoản; bật caption, đọc transcript và thử fallback.
3. Tắt mạng: app/deep link có feedback đọc được; pending không được hiện như XP đã xác nhận. Kết nối lại và kiểm tra không cộng lặp.
4. Dùng hai tab và hai build: cập nhật chỉ sau thao tác Home an toàn; tab đang học không tự reload; pending/session không bị xóa.
5. Kiểm tra chữ lớn, xoay màn hình, safe area, bàn phím, focus, reduced motion/mute; video không tự phát có âm thanh.
6. Với screen reader thực, ghi công cụ/version, cách vào heading/main/navigation, đọc lỗi/feedback/choice và điều khiển media. Không ghi WCAG conformance từ AX snapshot.
7. Ghi thời gian tải/giật và cấu hình mạng/thiết bị thực, nhất là điện thoại yếu; không tự đặt một số performance budget chưa đo.

Sửa lỗi có thể tái hiện, chạy lại đúng bước lỗi và gửi reviewer evidence. Không dùng tài khoản/mật khẩu của người khác; không ghi credential/token trong ảnh hay báo cáo.
