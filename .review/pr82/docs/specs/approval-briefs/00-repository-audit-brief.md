# Duyệt nhanh Phase 0 — Repo hiện có gì?

> Trạng thái: ĐÃ DUYỆT\
> Thời gian đọc: khoảng 5 phút

## Phase 0 là gì?

Hãy hình dung nhóm chuẩn bị sửa một căn nhà. Trước khi thiết kế phòng mới, nhóm phải biết phòng nào đang dùng, đường điện/nước ở đâu, phần nào là đồ cũ và phần nào đang hỏng.

Phase 0 làm việc tương tự với codebase. Nó không thiết kế tính năng mới; nó chỉ xác nhận “project hiện đang ở đâu”.

## Repo Sử Chill hiện tại, nói đơn giản

App hiện đã có:

- Home, chapter, lesson, quiz, profile và XP demo.
- Một Visual Novel mẫu về Genève 1954.
- Visual Novel chạy lần lượt qua các scene.
- Lựa chọn có phản hồi đúng/sai.
- Giao diện scrapbook cơ bản.

Lưu ý: Visual Novel Genève/vĩ tuyến 17 hiện tại chỉ là demo kỹ thuật rút gọn. Nó chưa mô tả đầy đủ bối cảnh ngoài đời và không được dùng làm chuẩn chất lượng nội dung hoặc hướng mở rộng mặc định.

App hiện chưa có:

- Database thực sự.
- Tài khoản và lưu tiến độ thật.
- Resume Visual Novel sau khi thoát.
- Chống nhận XP nhiều lần.
- Story branching rõ ràng.
- Quy trình kiểm chứng lịch sử và nguồn ảnh.

## Vấn đề chính được phát hiện

1. Project có code mới và code cũ tồn tại song song.
2. Tài liệu nói UI phải gọi service, nhưng UI hiện đọc mock data trực tiếp.
3. TypeScript đang có lỗi dù Vite vẫn build được.
4. Visual Novel hiện quá đơn giản để hỗ trợ branching, resume và database.
5. Nhân vật hư cấu chưa được gắn nhãn rõ.
6. Ảnh lịch sử chưa có source/license metadata đầy đủ.

## Phase 0 đã quyết định gì?

- Dùng `src/features/visual-novel` làm engine chính.
- Giữ Episode 1954 cũ như prototype tham khảo, chưa xóa ngay.
- Xem Visual Novel là một loại lesson.
- Chưa kết nối Supabase cho đến khi chốt data contract.
- Mọi nhân vật/tình huống hư cấu phải được gắn nhãn.

## Ví dụ cụ thể

Hiện tại lesson có `visualNovelId: "geneva-1954"`. App nhìn thấy ID này và mở Visual Novel thay cho lesson thường. Phase 0 xác nhận đây là luồng đang chạy thật và sẽ dùng nó làm điểm xuất phát.

## Bạn đã duyệt điều gì?

Bạn đã duyệt rằng bản audit trên mô tả đúng project và nhóm có thể dùng nó làm nền cho các quyết định tiếp theo.

Bạn chưa duyệt database, UI mới, schema mới hoặc code implementation nào.

## Tài liệu đầy đủ

Xem [Phase 0 full spec](../phases/00-repository-context-audit.md) khi cần chi tiết kỹ thuật.
