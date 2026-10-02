# Phase 4 — UX Flow & Player State Specification

**Status:** APPROVED — duyệt ngày 2026-09-22\
**Mục tiêu:** chốt hành vi của player trước khi thiết kế type, database và implementation.

## 1. Phạm vi

Player phải hỗ trợ lesson tuyến tính và chapter đa định dạng gồm text lesson, Visual Novel scene, video và quiz. Nội dung đã được biên soạn và publish trước; player không tự viết story lúc runtime.

## 2. Luồng người học

```text
Chapter detail
  → Start/Resume
  → Lesson block hoặc Scene
  → Read/Watch/Choose/Answer
  → Feedback (nếu có)
  → Next block hoặc Retry
  → Episode complete
  → Chapter complete khi mọi block bắt buộc đã xong
```

## 3. Trạng thái player

| State | Ý nghĩa | Hành động chính |
|---|---|---|
| `IDLE` | Chưa bắt đầu | Start |
| `LOADING` | Đang tải nội dung/progress | Chờ hoặc cancel |
| `PLAYING` | Đang đọc scene/xem video | Next, back, pause |
| `CHOICE_PENDING` | Đang chờ lựa chọn | Chọn một option |
| `FEEDBACK` | Đang hiển thị giải thích | Continue hoặc Retry |
| `PAUSED` | Tạm dừng/người dùng rời player | Resume |
| `ERROR` | Không tải được nội dung/progress | Retry, back, offline fallback |
| `COMPLETED` | Block/episode đã hoàn tất | Next hoặc exit |

## 4. Quy tắc tương tác

### Start và resume

- Không có progress: mở block đầu tiên.
- Có progress chưa hoàn tất: mở đúng block và scene đã lưu.
- Có nhiều thiết bị: progress mới nhất hợp lệ từ server là nguồn chính; local pending sync được xử lý sau.

### Scene và choice

- Chỉ cho chọn option khi scene đã tải xong.
- Mỗi scene có `next` mặc định hoặc đích branch rõ ràng.
- Narrative/reflection choice có thể đi tiếp mà không đánh dấu đúng/sai.
- Knowledge-check choice hiển thị feedback theo quy tắc Phase 1–2.
- Không tự động đổi lựa chọn của người học.

### Video block

- Có play/pause, tua theo chính sách của lesson, âm lượng và phụ đề nếu có.
- `video_required=true`: chỉ cho hoàn thành sau điều kiện xem đã định nghĩa.
- `video_required=false`: có thể bỏ qua và xem lại ở phần mở rộng.
- Nếu video lỗi, hiển thị poster, transcript/fallback (nếu được chuẩn bị) và nút thử lại.

### Back và retry

- Back quay về block trước hoặc chapter detail, không tự xóa progress.
- Retry tải lại dữ liệu/media; không tạo attempt mới nếu chưa có hành động học mới.
- Reload trang khôi phục từ progress đã lưu.

## 5. Màn hình cần có

1. Chapter detail (Start/Resume).
2. Lesson block reader.
3. Visual Novel player.
4. Video player block.
5. Choice feedback.
6. Episode/Chapter complete.
7. Loading.
8. Error/retry/offline.
9. Empty/unpublished content.

## 6. Acceptance criteria

- Người học có thể bắt đầu, rời đi và tiếp tục đúng vị trí.
- Scene có branch, narrative choice và knowledge check được phân biệt.
- Video có trạng thái loading, lỗi, retry và fallback đã chuẩn bị.
- Hoàn thành block/episode/chapter được phân biệt.
- Back không làm mất progress.
- Keyboard focus, label, phụ đề/transcript và màu feedback đáp ứng yêu cầu accessibility đã nêu ở Phase 1–3.
- Các trạng thái trên đủ rõ để Phase 5 tạo type contract mà không phải đoán hành vi.
- Interactive elements có state mặc định, pressed, selected, disabled, loading và focus rõ ràng.
- Border radius, shadow, spacing và motion lấy từ design tokens dùng chung.
- UI sound chỉ phát sau tương tác của người dùng, có mute setting và không phải tín hiệu duy nhất để hiểu kết quả.
- Motion tôn trọng `prefers-reduced-motion`; tắt motion không làm hỏng navigation hoặc feedback.

## 7. Quyết định đã duyệt

- Mỗi video cấu hình `required` riêng; điều kiện completion cụ thể được khóa tiếp ở Phase 7.
- Người học được quay lại để xem scene cũ; lựa chọn đã ghi nhận không đổi trừ khi khởi động lại episode.
- Knowledge check phục vụ học tập được retry không giới hạn; từng attempt vẫn được lưu để đánh giá.
- MVP offline chỉ mở nội dung đã cache/fallback; chưa cam kết tải toàn bộ chapter hoặc video để học offline.
