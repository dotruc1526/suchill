# Phase 7 — Progress, XP và streak được tính như thế nào?

**Status:** ĐÃ DUYỆT — 2026-09-22

## Phase này quyết định điều gì?

Phase 7 chốt luật ghi nhận việc học:

- Khi nào một block, lesson, episode hoặc chapter được tính là hoàn thành?
- Hoàn thành hoạt động nào thì nhận XP?
- Khi nào streak tăng hoặc bị đặt lại?
- Làm sao tránh bấm lại/reload để nhận XP nhiều lần?
- App ghi lại sự kiện nào để biết người học đang gặp khó khăn ở đâu?

## Các từ cần biết

| Từ | Hiểu đơn giản |
|---|---|
| Progress | Người học đã đi đến đâu |
| Completion | Hoạt động đã đạt điều kiện hoàn thành |
| XP | Điểm động lực, không phải điểm lịch sử chính thức |
| Streak | Số ngày học liên tiếp của tài khoản |
| Idempotency | Gửi cùng một yêu cầu nhiều lần vẫn chỉ nhận kết quả/reward một lần |
| Analytics | Dữ liệu tổng hợp để hiểu app được sử dụng ra sao |

## Đề xuất hoàn thành nội dung

### Lesson thường

Hoàn thành khi mọi block bắt buộc đã được hoàn thành.

### Visual Novel

Hoàn thành khi người học đến scene kết thúc/debrief và làm các knowledge check bắt buộc. Xem lại hoặc retry không cộng thêm XP.

### Video bắt buộc

Hoàn thành khi:

- Đã xem tối thiểu 90% thời lượng thực, tính theo các đoạn đã xem; hoặc
- Dùng transcript/fallback vì lý do accessibility hoặc media lỗi và hoàn thành recap/knowledge check bắt buộc.

Video tùy chọn không chặn completion.

### Quiz

- Practice quiz: hoàn thành khi trả lời hết câu bắt buộc; không cần đạt ngưỡng để tiếp tục học.
- Chapter/final quiz: đề xuất ngưỡng đạt mặc định 70%; có thể làm lại.
- XP hoàn thành chỉ trao một lần; lần sau dùng để cải thiện mastery/accuracy.

## XP đề xuất cho MVP

| Hoạt động lần đầu hoàn thành | XP |
|---|---:|
| Lesson thường hoặc video lesson | 10 |
| Visual Novel episode | 20 |
| Chapter/final quiz | 20 |
| Bonus quiz đạt từ 80% | +5 |
| Daily review hợp lệ | 5, tối đa một lần/ngày |

- Không trừ XP vì trả lời sai.
- Retry hoặc reload không tạo XP mới.
- AI Battle chưa được cộng XP thật cho đến khi feature qua review bảo mật và luật chơi.

## Streak đề xuất

Streak thuộc tài khoản, không thuộc thiết bị.

```text
Hoàn thành hoạt động học hợp lệ trong ngày
→ đánh dấu hôm nay đã học
→ tăng streak tối đa một lần trong ngày
```

Hoạt động hợp lệ:

- Hoàn thành lesson.
- Hoàn thành Visual Novel episode.
- Hoàn thành quiz bắt buộc.
- Hoàn thành daily review hợp lệ.

Chỉ mở app, xem vài giây video hoặc bắt đầu nhưng chưa hoàn thành thì không tăng streak.

Nếu hôm qua có hoạt động hợp lệ, streak tăng thêm 1. Nếu bỏ lỡ cả một ngày, lần học tiếp theo bắt đầu lại từ 1. MVP chưa có streak freeze — vật phẩm giữ chuỗi — để tránh phức tạp và gian lận; có thể bổ sung sau.

Ngày được tính theo timezone của tài khoản. Đổi timezone không được dùng để nhận hai ngày thưởng trong cùng một khoảng thời gian thực.

## Chống cộng trùng

Mỗi reward có một mã duy nhất, ví dụ:

```text
tài khoản Lan + lesson A + version 1 + first-completion
```

Nếu điện thoại gửi lại yêu cầu vì mạng chậm, backend nhìn thấy mã đã xử lý và trả kết quả cũ thay vì cộng XP lần nữa.

## Analytics sẽ ghi gì?

Ví dụ:

- Lesson bắt đầu/tiếp tục/hoàn thành.
- Block nào thường bị dừng.
- Video lỗi hoặc dùng transcript fallback.
- Knowledge check được retry bao nhiêu lần.
- Episode được hoàn thành hay bỏ dở.

Không ghi secret, toàn bộ lời thoại riêng tư, email hoặc dữ liệu không cần thiết. Analytics lỗi không được làm mất progress hoặc chặn việc học.

## Chưa làm trong Phase 7

- Chưa tạo bảng reward/streak/analytics thật.
- Chưa cộng XP vào tài khoản thật.
- Chưa cài analytics SDK.
- Chưa cho AI Battle phát reward.
- Chưa thiết kế leaderboard hoặc streak freeze.

## Bạn đang duyệt điều gì?

- Điều kiện completion theo từng loại lesson.
- Bảng XP MVP ở trên.
- Streak tăng tối đa một lần/ngày sau hoạt động hợp lệ.
- Không trừ XP khi sai và không cộng lại khi retry.
- Reward do backend xử lý với mã chống trùng.
- Analytics tối thiểu, tôn trọng quyền riêng tư và không chặn trải nghiệm học.
- MVP chưa có streak freeze và AI Battle chưa cộng XP chính thức.

Nếu đồng ý, trả lời:

> **Duyệt Phase 7 theo đề xuất.**
