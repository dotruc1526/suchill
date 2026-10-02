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

## Ready for actual Android observations — 2026-10-03

App https://suchill-preview--m6-android-1954-p8pbahbd.web.app/ ; video /reference. Software build bfc05ef6fabc8087b4c0 passed actual HTTPS desktop Chrome smoke plus375/430/landscape emulation; this does not change the CHƯA KIỂM rows above. User was asked for Android model/OS/Chrome and install/icon launch, playback/captions,17-second pause/reload/resume, rotation/large text, offline fallback and TalkBack observations. No actual phone result yet. Initial HTTPS resume finding was repaired before this final build; results against an earlier build require retest. Video downloads approximately19MB before playback; weak-device memory/network performance needs real evidence.

Android user finding: created account could not log in with username. Server rejected the HTTPS Origin; corrected exact CORS allowlist and live QA/API checks PASS. User was asked to reload/retry the old account; real-device retest pending. No install/video/TalkBack outcome has been received, so CHƯA KIỂM remains.
