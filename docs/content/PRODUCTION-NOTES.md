# Sổ tay Sản xuất (Production Hand-off Notes)
**Người lập:** Thọ (Member 1 - Content Lead)
**Bàn giao cho:** Trúc (Member 2 - Video) & Dũng (Member 4 - Frontend)

## 1. Dành cho Dựng Video (Member 2)
### Định hướng Cảm xúc (Tone & Pacing)
- **Scene 01 - 02 (Trước giờ G):** Nhạc nền trầm, bí ẩn. Giọng đọc Voiceover phải thể hiện sự tĩnh lặng trước cơn bão. Nhấn mạnh bài thơ của Bác Hồ (cần làm mờ âm thanh nền để giọng Bác vang lên rõ ràng).
- **Scene 03 - 04 (Bùng nổ):** Cắt cảnh nhanh, dồn dập (Fast cut). Chuyển âm thanh bộc phá cực mạnh tại mốc `02h45`. Chú ý dùng đúng hình ảnh Tòa Đại sứ Mỹ từ `DETAILED-MEDIA-CATALOG.csv`.
- **Scene 05 (Kết luận):** Giọng đọc chậm lại, mang tính vĩ mô. Hiển thị cảnh Walter Cronkite và biểu tình phản chiến để nhấn mạnh tác động tâm lý.

## 2. Dành cho Lập trình UI (Member 4)
- **Bản đồ Tương tác (Bài 2):** Tôi đã trích xuất toàn bộ text từ Markdown sang cấu trúc JSON thuần túy tại tệp `docs/content/MAP-MT68.json`. Bạn chỉ cần fetch file này và map vào component UI. Độ dài chuỗi text đã được tôi cắt gọt (dưới 150 ký tự mỗi Node) để đảm bảo không bị tràn giao diện trên màn hình điện thoại (Mobile-first).
- **Ngân hàng câu hỏi (Quiz):** Dữ liệu Quiz nằm tại `docs/content/QUIZ-MT68.json`. Đã bao gồm đủ `id`, `options`, và `explanation`. Đảm bảo UI hiện pop-up giải thích (explanation) mỗi khi user trả lời sai.
