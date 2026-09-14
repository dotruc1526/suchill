# Sử Chill

Ứng dụng học lịch sử Việt Nam theo lộ trình, kết hợp bài học ngắn, quiz và visual novel tương tác.

## Chạy dự án

```bash
pnpm install
pnpm dev
```

## Cấu trúc visual novel

```text
src/features/visual-novel/
  VisualNovelPlayer.tsx       # Engine hiển thị dùng chung
  types.ts                    # Kiểu dữ liệu cho scene, choice, story
  stories/
    geneva-1954.ts            # Nội dung riêng của một chương
    index.ts                  # Danh sách story có thể mở
```

`VisualNovelPlayer` không chứa nội dung lịch sử. Mỗi story chỉ là dữ liệu: lời kể, backdrop, lựa chọn, phản hồi đúng/sai và ảnh tùy chọn.

## Thêm một chương visual novel

1. Tạo file mới trong `src/features/visual-novel/stories/`, ví dụ `dong-khoi-1960.ts`.
2. Khai báo story với `id` riêng và danh sách `scenes`.
3. Đăng ký story trong `stories/index.ts`.
4. Gắn `visualNovelId` tương ứng vào lesson trong `src/data.ts`.
5. Nếu có tranh nền, đặt tại `src/assets/scenes/<story-id>/` rồi truyền đường dẫn qua thuộc tính `image` của scene.

Thêm cảnh thoại, lựa chọn hoặc ảnh mới không cần sửa `App.tsx` hay `VisualNovelPlayer.tsx`.
