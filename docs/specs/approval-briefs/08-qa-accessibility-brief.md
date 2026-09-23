# Phase 8 — Trước khi phát hành phải kiểm tra những gì?

**Status:** ĐÃ DUYỆT — 2026-09-22

## Phase này quyết định điều gì?

Phase 8 tạo “cổng kiểm tra” trước khi Sử Chill được đưa cho người dùng thật. App chỉ được phát hành khi không còn lỗi nghiêm trọng về:

- Luồng học và lưu progress.
- Nội dung lịch sử và nguồn.
- Tài khoản, XP và streak.
- Supabase/RLS và secret key.
- Giao diện trên điện thoại.
- Video, phụ đề và transcript.
- Accessibility — khả năng sử dụng cho người có nhu cầu tiếp cận khác nhau.
- PWA, mạng chậm và mất mạng.

## Không phải mọi lỗi đều giống nhau

| Mức | Ví dụ | Có được phát hành? |
|---|---|---|
| Blocker | Lộ secret, mất progress, sai lịch sử nghiêm trọng, user xem được dữ liệu người khác | Không |
| Critical | Không đăng nhập được, lesson không hoàn thành được, video bắt buộc không có fallback | Không |
| Major | Một hiệu ứng lỗi, một thiết bị phổ biến hiển thị sai nhưng có đường vòng | Chỉ khi product owner chấp nhận rõ |
| Minor | Sai khoảng cách nhỏ, câu chữ chưa đẹp nhưng không sai nghĩa | Có thể ghi backlog |

## Những nhóm kiểm tra chính

### 1. Luồng học

- Bắt đầu, thoát và resume đúng vị trí.
- Visual Novel không có scene/choice trỏ tới nơi không tồn tại.
- Video, quiz và lesson hoàn thành đúng điều kiện Phase 7.
- Retry/reload/nhiều thiết bị không cộng XP hai lần.
- Back không xóa progress.

### 2. Nội dung lịch sử

- Fact quan trọng có nguồn.
- Hư cấu/composite/uncertain được gắn nhãn.
- Nhân vật, trang phục, địa danh, bản đồ và thời điểm không sai bối cảnh.
- Không dùng demo Genève/vĩ tuyến 17 như nội dung canonical nếu chưa viết và review lại.
- Ảnh/video có nguồn, quyền sử dụng và attribution.

### 3. Accessibility

- Dùng được bằng bàn phím và có focus rõ.
- Không chỉ dùng màu hoặc âm thanh để báo đúng/sai.
- Có thể tắt âm thanh và giảm chuyển động.
- Chữ đủ tương phản, phóng to không vỡ giao diện.
- Nút/vùng chạm đủ lớn trên điện thoại.
- Video có captions và transcript; thông tin quan trọng bằng hình ảnh có mô tả phù hợp.

Mục tiêu baseline là WCAG 2.2 AA — bộ tiêu chuẩn tiếp cận web ở mức phù hợp cho sản phẩm công cộng.

### 4. PWA và điện thoại

- Cài được lên màn hình chính.
- Mở bằng biểu tượng đúng icon/tên/theme.
- Có trang offline/fallback, không hiện màn hình trắng.
- Khi có phiên bản mới, app cập nhật an toàn và không làm mất progress.
- Kiểm tra Android Chrome, iPhone Safari/PWA và desktop phổ biến.
- Hiệu ứng, âm thanh, bo góc và video chạy ổn trên máy cấu hình thấp.

### 5. Supabase và bảo mật

- Tài khoản A không đọc/ghi được progress của tài khoản B.
- Người chưa đăng nhập không xem draft, đáp án tính điểm hoặc dữ liệu user.
- Frontend bundle không chứa secret/service-role/Gemini key.
- Người dùng không tự cộng XP, streak hoặc publish content.
- Khóa đặc quyền đã từng chia sẻ được rotate trước integration/release.

## Khi nào được đánh dấu DONE?

Mỗi task phải có bằng chứng phù hợp:

- Test tự động pass.
- Ảnh/video ghi lại test giao diện khi cần.
- Checklist content/historical có reviewer.
- RLS test chứng minh hai tài khoản bị cô lập.
- Danh sách thiết bị/trình duyệt đã kiểm tra.
- Lỗi còn lại có severity, owner và quyết định rõ.

Không được đánh dấu DONE chỉ vì “máy của em chạy được”.

## Điều kiện mở release

- Không còn Blocker/Critical.
- Historical/media review đạt.
- RLS/security test đạt.
- Core learning flow và PWA test đạt.
- Accessibility baseline đạt hoặc exception được ghi rõ, có owner và thời hạn sửa.
- Product owner, QA và technical owner cùng xác nhận release candidate.

## Chưa làm trong Phase 8

- Chưa viết test code.
- Chưa chạy audit accessibility thật.
- Chưa kiểm thử trên thiết bị thật.
- Chưa review pilot episode vì pilot canonical chưa được chọn/hoàn thiện.
- Chưa phát hành PWA.

## Bạn đang duyệt điều gì?

- Dùng severity và release gate ở trên.
- WCAG 2.2 AA làm baseline accessibility.
- Historical/media/security là điều kiện bắt buộc, không phải việc trang trí sau cùng.
- Mỗi task cần evidence trước khi `DONE`.
- Không release khi còn Blocker/Critical.
- Phase 9 sẽ chuyển toàn bộ spec thành sprint/task implementation cụ thể.

Nếu đồng ý, trả lời:

> **Duyệt Phase 8 theo đề xuất.**
