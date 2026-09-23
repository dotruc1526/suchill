# Sử Chill — Kế hoạch đưa sản phẩm lên ứng dụng

> Status: PWA APPROVED — ưu tiên PWA; Capacitor chỉ được xem xét sau khi PWA ổn định\
> Last updated: 2026-09-22

## Hướng đã duyệt

Giữ React + Vite làm codebase chung và phát hành theo thứ tự:

```text
Web responsive
→ PWA cài từ trình duyệt — ĐÃ DUYỆT
→ Đánh giá độ ổn định và phản hồi người dùng
→ Capacitor đóng gói Android/iOS — CHƯA DUYỆT
```

- **PWA (Progressive Web App):** website có thể được thêm vào màn hình chính và mở gần giống app.
- **Capacitor:** lớp vỏ native bao quanh web app hiện có để tạo project Android/iOS mà không viết lại toàn bộ giao diện.
- **Firebase Hosting:** nơi phát hành bản web/PWA. Supabase vẫn là backend và database.

## Vì sao phù hợp với Sử Chill

- Tận dụng code React/Vite hiện tại.
- Web, Android và iOS dùng chung phần lớn UI và business logic.
- Có thể phát hành web beta sớm cho nhóm kiểm thử.
- Sau này vẫn truy cập được notification, network state, haptic và các API thiết bị qua plugin native.
- Không buộc chuyển dữ liệu từ Supabase sang Firebase.

## Lộ trình phát hành

### Bước A — Web beta

- Hoàn thiện responsive mobile, authentication, progress và media loading.
- Build Vite và deploy lên Firebase Hosting.
- Dùng preview channel cho nhóm thử trước production.
- Cấu hình domain, HTTPS, environment development/production và privacy page.

### Bước B — PWA

- Thêm app manifest, icon, splash assets và service worker.
- Cho phép cài từ trình duyệt.
- Chỉ cache app shell và nội dung được phép; không hứa offline toàn bộ video.
- Kiểm thử update version để tránh người dùng giữ bundle cũ.
- Kiểm thử âm thanh tương tác trên Android/iPhone; chỉ phát sau thao tác của người dùng và ghi nhớ trạng thái mute.
- Kiểm thử animation, bo góc, safe area và hiệu năng trên điện thoại cấu hình thấp.

### Bước C — Android app (chưa duyệt)

- Thêm Capacitor vào codebase sau khi web flow ổn định.
- Tạo Android project, app ID, icon, splash và signing key.
- Xử lý back button, safe area, auth redirect, network state và video player.
- Phát hành internal testing trước; bản Google Play production dùng Android App Bundle (`.aab`).

### Bước D — iOS app (chưa duyệt)

- Tạo iOS project bằng Capacitor.
- Kiểm thử trên macOS/Xcode và thiết bị thật.
- Chuẩn bị bundle ID, privacy information, account deletion flow, screenshots và App Review.
- Thực hiện sau Android nếu nguồn lực nhóm còn hạn chế.

## Kiến trúc triển khai

```text
React/Vite UI
├── Web/PWA → Firebase Hosting
├── Android → Capacitor → Google Play
└── iOS     → Capacitor → App Store

Supabase
├── Auth
├── Postgres/RLS
├── Storage
└── Edge Functions/server-only operations
```

Firebase Hosting không thay thế Supabase. Không đưa Supabase service-role key hoặc Gemini API key vào bundle web/mobile.

## Release gate

Chỉ phát hành store khi:

- Luồng đăng nhập, đăng xuất và xóa tài khoản hoạt động.
- Progress, XP và streak đồng bộ đúng tài khoản.
- Không có secret nằm trong frontend bundle.
- Video có bản nén, poster, phụ đề/transcript và fallback.
- Có privacy policy, terms/contact và danh mục dữ liệu thu thập.
- Kiểm thử Android/iOS thật, mạng chậm, mất mạng và nâng cấp phiên bản.

## Quyết định hiện tại

- Ưu tiên đã duyệt: Web beta → PWA → kiểm thử độ ổn định.
- Hosting web đề xuất: Firebase Hosting.
- Backend tiếp tục dùng Supabase.
- Capacitor là hướng đề xuất cho giai đoạn sau, chưa được duyệt triển khai.
- Chỉ trình Capacitor để duyệt khi PWA đã đạt release gate và có phản hồi người dùng.
- Chưa cài package hoặc tạo project Android/iOS trong giai đoạn specs hiện tại.
