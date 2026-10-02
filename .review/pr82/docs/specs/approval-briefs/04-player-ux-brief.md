# Phase 4 — UX & Player State (Approval Brief)

**Status:** ĐÃ DUYỆT — 2026-09-22

## Phase này quyết định điều gì?

Phase 4 mô tả người học nhìn thấy gì và app phản ứng thế nào trong lúc học một chapter có lesson thường, Visual Novel, video và quiz.

Nó trả lời các câu hỏi thực tế:

- Bấm **Bắt đầu** thì mở từ đâu?
- Đang học dở thì lần sau **Tiếp tục** ở scene/video nào?
- Chọn một đáp án thì hiện phản hồi thế nào?
- Có được quay lại scene trước không?
- Video đang xem dở thì tiếp tục ra sao?
- Mất mạng, tải lỗi hoặc chưa có nội dung thì màn hình hiển thị gì?
- Khi nào lesson/episode được tính là hoàn thành?

## Đề xuất trải nghiệm

### 1. Trang tổng quan lesson

Hiển thị loại nội dung, thời lượng ước tính, tiến độ và nút **Bắt đầu** hoặc **Tiếp tục**.

### 2. Một chapter có thể xen kẽ nhiều loại nội dung

```text
Giới thiệu → Scene Visual Novel → Video lịch sử → Scene lựa chọn
→ Quiz ngắn → Tóm tắt → Hoàn thành
```

Video có thể là nội dung chính của lesson, một tư liệu nằm trong scene, hoặc phần mở rộng tùy quyết định Phase 3.

### 3. Scene Visual Novel

- Hiển thị bối cảnh, nhân vật, lời thoại và lựa chọn.
- Lựa chọn kể chuyện có thể đổi góc nhìn hoặc scene kế tiếp.
- Lựa chọn kiến thức có phản hồi đúng/sai và giải thích.
- Không tự sinh kịch bản lúc người học đang chơi.

### 4. Lưu và tiếp tục

- Lưu lesson/episode/scene hiện tại cho tài khoản.
- Nếu người học mở lại, nút chính là **Tiếp tục**.
- Hoàn thành scene không đồng nghĩa hoàn thành toàn chapter nếu còn nội dung bắt buộc.

### 5. Lỗi và khả năng tiếp cận

- Có trạng thái loading, lỗi tải, thử lại và nội dung trống.
- Video có phụ đề/bản chép lời khi có thể.
- Điều khiển dùng được bằng bàn phím, chữ đủ tương phản, không chỉ dùng màu để truyền đạt đúng/sai.

### 6. Cảm giác giao diện

- Card, ảnh và khối chữ nhật có bo góc nhất quán theo bộ thiết kế chung.
- Nút có phản hồi khi chạm; chuyển scene và nhận kết quả có hiệu ứng ngắn, mượt.
- Có thể dùng âm thanh nhẹ cho chạm, đúng, sai và hoàn thành; người dùng luôn có thể tắt âm thanh.
- Có chế độ giảm chuyển động; nội dung vẫn hiểu được nếu tắt animation hoặc âm thanh.
- Hiệu ứng phải hỗ trợ việc học, không che nội dung hoặc kéo dài thời gian đọc.

## Không nằm trong Phase 4

- Chưa chốt bảng Supabase hay API cụ thể — thuộc Phase 5–6.
- Chưa viết code production.
- Chưa quyết định nội dung lịch sử cụ thể của episode pilot.

## Quyết định đã khóa

- Video được đánh dấu bắt buộc hoặc tùy chọn theo từng lesson.
- Có thể xem lại scene cũ; muốn đổi lựa chọn đã lưu thì phải khởi động lại episode.
- Knowledge check học tập được thử lại không giới hạn.
- MVP chỉ dùng cache/fallback khi offline, chưa tải toàn bộ nội dung và video.

## Cách duyệt

Bạn có thể trả lời:

> **Duyệt Phase 4 theo đề xuất.**

hoặc chỉ rõ phần muốn sửa, ví dụ: “Cho phép quay lại scene trước” hoặc “Video phải xem hết mới được qua bước tiếp theo”.
