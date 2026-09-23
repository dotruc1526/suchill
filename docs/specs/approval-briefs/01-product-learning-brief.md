# Duyệt nhanh Phase 1 — Visual Novel sẽ dạy như thế nào?

> Trạng thái: ĐÃ DUYỆT\
> Thời gian đọc: khoảng 8 phút

**Làm rõ phạm vi ngày 2026-09-23:** Sử Chill dạy giai đoạn kháng chiến chống Mỹ ở Việt Nam với nhiều chapter/lesson. MVP đầu tiên dùng một chapter mẫu có nhiều loại lesson. Ví dụ chapter 1954 bên dưới chỉ minh họa cách xếp định dạng bài học, không phải nội dung phát hành đã chọn.

## Phase 1 là gì?

Phase 1 không quyết định database hoặc code. Nó quyết định trải nghiệm học mà Visual Novel phải tạo ra.

Câu hỏi chính:

> Sau 6–10 phút chơi một episode, người học phải hiểu được gì và app xác nhận điều đó như thế nào?

## Visual Novel trong Sử Chill là gì?

Visual Novel là một lesson được kể qua các scene đã được biên kịch trước. Storytelling giúp người học hiểu bối cảnh và con người; knowledge check xác nhận kiến thức.

Nó không phải game thay đổi lịch sử và không phải story do AI tự tạo khi đang chơi.

## Một chapter có bắt buộc toàn Visual Novel không?

Không. Sử Chill nên dùng nhiều loại lesson trong cùng một chapter:

```text
CHƯƠNG 1954
├── Bối cảnh: Video 4–6 phút
├── Hiệp định Genève: Visual Novel theo scene
├── Diễn biến Điện Biên Phủ: Lesson thường + timeline
└── Thử thách chương: Quiz
```

- Dùng **Visual Novel** khi cần bối cảnh, nhân vật, góc nhìn và lựa chọn.
- Dùng **Video** khi chuyển động, bản đồ động hoặc tư liệu nghe nhìn giúp hiểu tốt hơn.
- Dùng **lesson thường** khi nội dung cần đọc nhanh, tra cứu hoặc so sánh.
- Dùng **quiz** để kiểm tra kiến thức sau một hoặc nhiều lesson.

Video có thể xuất hiện bên trong một scene như tư liệu hỗ trợ. Nhưng nếu video là phần học chính, nó nên là một video lesson riêng để có phụ đề, transcript, resume và fallback đầy đủ.

Video cũng phải được biên kịch/sản xuất trước và duyệt nội dung; app không tự sinh video khi người học mở bài.

## Giữ chuỗi cho tài khoản hoạt động thế nào?

Streak thuộc về tài khoản người học, không thuộc riêng điện thoại đang dùng.

Ví dụ:

```text
Thứ Hai: hoàn thành một Visual Novel → streak +1
Thứ Hai: làm thêm hai quiz → streak không tăng thêm lần nữa
Thứ Ba: đăng nhập trên máy khác và hoàn thành video lesson → streak +1
Chỉ mở app hoặc bật video rồi thoát → không được tính
```

App dự kiến hiển thị:

- Chuỗi hiện tại, ví dụ `🔥 7 ngày`.
- Chuỗi dài nhất.
- Hôm nay đã hoàn thành hoạt động học hợp lệ hay chưa.

Backend sẽ là nơi quyết định activity nào hợp lệ và bảo đảm một ngày không bị tính hai lần. Quy tắc chính xác về múi giờ, loại activity và streak freeze sẽ được duyệt ở Phase 7.

## Ví dụ minh họa tạm thời: không phải target story

Phần Genève/vĩ tuyến 17 dưới đây chỉ giúp hình dung learning loop. Story hiện tại là demo kỹ thuật rút gọn, chưa đủ bối cảnh lịch sử và không phải mốc nội dung để nhóm mở rộng về sau. Pilot chính thức sẽ được chọn/biên soạn lại sau content và historical review.

### Scene 1 — Mở đầu

```text
Hiệp định Genève 1954
Thời lượng: khoảng 8 phút

Sau episode, bạn cần hiểu:
- Vì sao hội nghị diễn ra.
- Vĩ tuyến 17 có tính chất gì.
- Vì sao không nên gọi đó là biên giới vĩnh viễn.
```

### Scene 2 — Bối cảnh

Người học xem ảnh, thời gian và nhân vật lịch sử. Nếu dùng nhân vật “Minh”, UI ghi rõ:

```text
MINH HỌA HƯ CẤU — Nhân vật Minh được tạo để dẫn chuyện.
```

### Scene 3 — Narrative choice

```text
Bạn muốn tìm hiểu trước điều gì?

A. Việc ngừng chiến sự
B. Đề xuất tập kết quân sự
C. Tác động tới người dân
```

Không có đáp án đúng/sai. Lựa chọn chỉ thay đổi thứ tự hoặc góc nhìn khám phá.

### Scene 4 — Knowledge check

```text
Vĩ tuyến 17 trong Hiệp định Genève là gì?

A. Biên giới vĩnh viễn
B. Giới tuyến quân sự tạm thời
C. Một tên khác của sông Hồng
```

Nếu chọn sai, app giải thích vì sao và cho thử lại. Đây mới là lựa chọn có đúng/sai.

### Scene 5 — Tổng kết

App nhắc lại ba ý quan trọng, phân biệt fact với phần hư cấu và cho xem nguồn tư liệu.

### Scene 6 — Hoàn thành

Episode được đánh dấu hoàn thành một lần, cộng reward một lần và đưa ra bước tiếp theo: quiz, lesson tiếp theo hoặc review.

## AI tham gia ở đâu?

```text
Biên kịch viết outline và scene
→ Có thể nhờ AI gợi ý/cải thiện
→ Biên kịch chọn và sửa
→ Reviewer kiểm chứng lịch sử
→ Con người duyệt
→ Publish
```

AI không tự tạo scene khi người học đang chơi và không tự publish.

## Khi nào nên dùng Visual Novel?

Nên dùng khi cần kể bối cảnh, nguyên nhân–kết quả, nhiều góc nhìn, trải nghiệm con người hoặc sửa một hiểu lầm phổ biến.

Không cần dùng khi lesson chỉ là vài định nghĩa hoặc danh sách mốc ngắn; lesson thường sẽ nhanh và rõ hơn.

## Knowledge check và quiz có bị trùng không?

Đề xuất:

- Nếu episode đã có 2–4 knowledge checks bao phủ đủ mục tiêu học, không cần thêm mini quiz ngay sau đó.
- Nếu episode chủ yếu kể chuyện và chưa kiểm tra đủ kiến thức, cần mini quiz riêng.
- Chapter quiz vẫn tồn tại để kiểm tra nhiều lesson cùng lúc.

## Khi nào được tính là hoàn thành?

Người học phải:

1. Đi đến phần tổng kết cuối.
2. Hoàn thành các knowledge check bắt buộc.
3. Có progress được lưu thành công hoặc chờ đồng bộ an toàn.

Narrative/reflection choice không bị chấm đúng/sai và không khóa completion.

## Bạn đang duyệt điều gì?

| # | Đề xuất | Khuyến nghị |
|---|---|---|
| 1 | Episode thường dài 6–10 phút, tối đa 12 phút | Duyệt |
| 2 | Mỗi episode chỉ có 1–3 mục tiêu học chính | Duyệt |
| 3 | Scene được biên kịch trước; AI chỉ hỗ trợ draft | Đã chốt |
| 4 | Narrative/reflection choice không chấm đúng/sai | Duyệt |
| 5 | Knowledge check sai được giải thích và thử lại | Duyệt |
| 6 | Embedded checks có thể thay mini quiz nếu đủ coverage | Duyệt |
| 7 | Completion cần tổng kết và các check bắt buộc | Duyệt |
| 8 | Reward completion chỉ được nhận một lần | Duyệt |
| 9 | Đang học dở có thể resume | Duyệt |
| 10 | Một chapter được kết hợp lesson thường, Visual Novel, Video và Quiz | Duyệt |
| 11 | Video lesson bắt buộc có phụ đề, transcript, resume và fallback | Duyệt |
| 12 | Streak thuộc tài khoản và đồng bộ giữa các thiết bị | Duyệt |
| 13 | Mỗi ngày chỉ tăng streak tối đa một lần | Duyệt |
| 14 | Chỉ hoàn thành hoạt động học hợp lệ mới tăng streak; mở app không được tính | Duyệt |

## Bạn chưa duyệt điều gì?

Phase 1 chưa quyết định story có field kỹ thuật nào, database có bảng gì, RLS hoạt động ra sao, UI từng nút đặt ở đâu, mỗi hoạt động cộng bao nhiêu XP hoặc cách code player. Các nội dung này thuộc phase sau.

## Cách phản hồi ngắn nhất

Nếu đồng ý toàn bộ:

```text
Duyệt Phase 1 theo bản duyệt nhanh, làm Phase 2.
```

Nếu muốn sửa:

```text
Phase 1 chưa duyệt.
- Tôi muốn episode tối đa ... phút.
- Tôi muốn mini quiz luôn xuất hiện / không xuất hiện khi ...
- Tôi muốn completion được tính khi ...
```

## Tài liệu đầy đủ

Xem [Phase 1 full spec](../phases/01-product-learning-experience-spec.md) khi cần requirements, metrics và technical impact chi tiết.
