# Phase 6 — Supabase lưu dữ liệu và bảo vệ tài khoản như thế nào?

**Status:** ĐÃ DUYỆT — 2026-09-22

## Phase này quyết định điều gì?

Phase 5 đã thống nhất tên và cấu trúc dữ liệu. Phase 6 quyết định dữ liệu đó nằm ở đâu trong Supabase, ai được đọc/ghi và frontend phải gọi qua service nào.

Có thể hình dung Supabase như một tòa nhà:

```text
Thư viện công khai
→ Chapter, lesson và nội dung đã xuất bản

Tủ hồ sơ cá nhân
→ Progress, lựa chọn, XP và streak của từng tài khoản

Phòng quản trị
→ Bản nháp, publish, đáp án tính điểm và thao tác đặc quyền
```

Người dùng được đọc thư viện và tủ hồ sơ của chính mình, nhưng không được mở hồ sơ người khác hoặc tự cộng XP.

## Những từ kỹ thuật trong phase này

| Từ | Hiểu đơn giản |
|---|---|
| Backend | Phần chạy phía sau app, xử lý dữ liệu và luật quan trọng |
| Database | Nơi lưu dữ liệu có cấu trúc, giống nhiều bảng Excel có liên kết |
| Table | Một nhóm dữ liệu cùng loại, ví dụ `lessons` hoặc `user_progress` |
| Supabase Auth | Hệ thống đăng nhập và xác định tài khoản hiện tại là ai |
| Storage | Kho lưu file như ảnh, audio, caption và video |
| Service | Lớp trung gian để màn hình yêu cầu dữ liệu theo cách thống nhất |
| RLS | Luật trong database quyết định tài khoản được phép xem/sửa dòng nào |
| Edge Function/RPC | Đoạn code đáng tin cậy chạy phía backend cho việc chấm điểm, reward hoặc publish |
| Migration | File ghi lại từng thay đổi cấu trúc database để cả nhóm áp dụng giống nhau |
| Publishable key | Mã được phép đặt trong app; vẫn phải được RLS bảo vệ |
| Secret key | Mã đặc quyền chỉ backend được giữ; tuyệt đối không đưa vào app |

Bạn không cần tự viết database hay nhớ các tên này để duyệt. Bạn chỉ đang duyệt cách dữ liệu và quyền được tổ chức.

## Một ví dụ từ lúc mở app đến khi lưu tiến trình

Giả sử Lan đăng nhập, mở một lesson và đọc đến scene `scene-nhan-nhiem-vu`:

```text
1. Lan đăng nhập
   → Supabase Auth xác nhận đây là tài khoản của Lan

2. App xin nội dung lesson
   → lessonService chỉ lấy nội dung đã published

3. Lan đọc đến scene “Nhận nhiệm vụ”
   → progressService yêu cầu lưu checkpoint

4. Database kiểm tra RLS
   → dòng progress có user_id đúng bằng tài khoản Lan: cho phép
   → nếu cố ghi vào user_id của Minh: từ chối

5. Lan mở app trên điện thoại khác
   → progressService đọc checkpoint của Lan
   → app tiếp tục đúng scene bằng ID đã lưu
```

Nếu Lan hoàn thành lesson:

```text
App gửi yêu cầu hoàn thành
→ backend kiểm tra điều kiện
→ chỉ cộng XP/reward một lần
→ cập nhật progress và streak an toàn
```

App không được gửi một con số như “hãy cộng cho tôi 10.000 XP” rồi database tin ngay.

## Ai được làm gì?

| Người/hệ thống | Được phép | Không được phép |
|---|---|---|
| Người chưa đăng nhập | Đọc nội dung public nếu sản phẩm cho phép | Xem progress hoặc bản nháp |
| Người đã đăng nhập | Đọc bài học; xem/lưu progress của mình | Xem progress người khác; tự cộng XP |
| Writer/reviewer | Soạn và review qua workflow được cấp quyền | Đưa draft thành published tùy ý từ app học |
| Backend đáng tin cậy | Chấm điểm, hoàn thành, reward, publish theo luật | Đưa secret xuống trình duyệt |
| Frontend React | Hiển thị và gọi service | Giữ secret hoặc tự quyết định reward |

## Vì sao phải có service ở giữa màn hình và Supabase?

Không nên để mỗi màn hình tự viết cách lưu riêng:

```text
Visual Novel tự lưu kiểu A
Video tự lưu kiểu B
Quiz tự lưu kiểu C
→ dễ trùng code, sai quyền và khó sửa
```

Đề xuất thống nhất:

```text
Visual Novel ─┐
Video ────────┼→ progressService → Supabase/backend
Quiz ─────────┘
```

`progressService` giống một quầy tiếp nhận chung. Màn hình chỉ nói “lưu vị trí hiện tại”; service chịu trách nhiệm gọi đúng nơi, kiểm tra dữ liệu và chuẩn hóa lỗi.

## Nếu không thiết kế Phase 6 thì dễ xảy ra gì?

- Tài khoản này có thể đọc hoặc sửa progress tài khoản khác.
- Frontend vô tình chứa secret key.
- Người dùng có thể tự gửi yêu cầu cộng XP hoặc đánh dấu hoàn thành.
- Bản nháp lịch sử chưa review bị hiển thị như nội dung chính thức.
- Visual Novel, video và quiz lưu progress theo ba cách khác nhau.
- Sửa database làm nhiều màn hình hỏng cùng lúc.

## Đề xuất chính

### 1. Tiếp tục dùng Supabase

- Supabase Auth — phần đăng nhập: nhận diện tài khoản.
- Postgres — database dạng bảng: lưu nội dung, progress và attempt.
- Storage — kho file: lưu ảnh, audio, caption và video đã tối ưu.
- Edge Function/RPC — code backend đáng tin cậy: chấm điểm, completion và reward.

### 2. RLS — luật bảo vệ từng dòng dữ liệu

`RLS (Row Level Security)` là luật ngay trong database. Ví dụ:

```text
user_id của dòng progress = ID tài khoản đang đăng nhập
→ được đọc/ghi

user_id khác
→ từ chối
```

Mọi bảng được frontend truy cập phải bật RLS và chỉ cấp đúng quyền cần thiết.

### 3. Frontend không gọi database trực tiếp trong component

```text
Màn hình React
→ progressService.saveCheckpoint(...)
→ Supabase/backend
```

Nhờ vậy Visual Novel, video và quiz dùng chung logic; khi backend thay đổi không phải sửa từng màn hình.

### 4. Nội dung publish và draft tách quyền

- Người dùng chỉ đọc content `published`.
- Writer/reviewer không sửa database production trực tiếp từ app học.
- Publish phải đi qua workflow đáng tin cậy và kiểm tra Phase 3.
- Version đã publish không bị sửa tại chỗ.

### 5. Secret không nằm trong app

Frontend PWA chỉ được chứa Supabase URL và publishable key. Secret/service-role key có thể bỏ qua RLS nên chỉ được giữ trong backend/Edge Function.

Khóa đặc quyền đã từng được chia sẻ phải được rotate — tạo khóa mới và vô hiệu hóa khóa cũ — trước khi kết nối production.

## Nhóm bảng chính

- Content — nội dung học: chapters, lessons, blocks, stories, versions, scenes, choices.
- Historical/media — bằng chứng và tư liệu: sources, claims, media assets và attribution.
- Assessment — câu hỏi: question sets, questions và options.
- User — dữ liệu tài khoản: profiles, lesson/episode/video progress và attempts.
- Reward/analytics sẽ được hoàn thiện ở Phase 7.

Các bảng tách riêng không có nghĩa app phải tải tất cả. Service chỉ lấy phần màn hình đang cần.

## Những gì chưa làm

- Chưa chạy migration hoặc tạo bảng thật.
- Chưa kết nối React với Supabase.
- Chưa cài Supabase SDK.
- Chưa tạo Edge Function.
- Chưa đổi khóa trong Phase này; việc rotate thực hiện trước integration và do project owner kiểm soát.

## Bạn đang duyệt điều gì?

- Tiếp tục dùng Supabase làm backend.
- Nội dung, media và user progress nằm trong các nhóm bảng riêng.
- Bật RLS theo nguyên tắc mặc định từ chối.
- Người dùng chỉ sửa dữ liệu thuộc tài khoản mình.
- Publish, chấm điểm quan trọng và reward chạy ở backend đáng tin cậy.
- React chỉ truy cập dữ liệu qua `src/services/`.
- Frontend chỉ dùng publishable key; secret key phải rotate và giữ server-side.

Nếu đồng ý, trả lời:

> **Duyệt Phase 6 theo đề xuất.**
