# CONTENT CI/CD PIPELINE (VÒNG PHẢN HỒI TỰ ĐỘNG)

> Quy trình bắt buộc cho mọi Agent khi sản xuất nội dung (Đặc biệt là `elite_content_writer`). Không một kết quả Draft (Bản nháp) nào được phép coi là Final.

## Mục tiêu
Biến một kết quả "tạm ổn" thành một sản phẩm "Sẵn sàng đưa vào Production" (Production-ready) thông qua việc tự động lặp lại, tự bắt lỗi và tinh chỉnh.

## Vòng lặp 4 bước (The Feedback Loop)

### Bước 1: Draft & Data Integration (Viết Nháp)
- Viết nội dung thu hút, sâu sắc dựa trên khung `PEDAGOGY-FRAMEWORK.md`.
- Sử dụng kiến thức phong phú từ `HISTORICAL-SOURCES.md` để đảm bảo chiều sâu.

### Bước 2: Self-Check & Unit Test (Tự kiểm tra)
- **Unit Test Format:** Đảm bảo file CSV không bị lỗi dấu phẩy, file Markdown render đúng định dạng, các biến (Variables) không bị rỗng.
- **Visual Preview:** Hình dung trước UI/UX của đoạn text đó trên màn hình di động (Có quá dài không? Có cần ngắt dòng không?).

### Bước 3: Cross-Evaluation (Kiểm tra chéo & Đánh giá trực tiếp)
- Giao bản Draft cho `history_qa` và `kccm_content_filter` hoặc tự đóng vai người đánh giá khắt khe nhất để soi lỗi.
- Checklist:
  - Có dùng sai từ "Vietnam War" không? (Lỗi tử hình).
  - Có chạm đến lõi Cảm xúc (Onion 2.0) chưa?

### Bước 4: Iterate & Refine (Lặp lại & Tinh chỉnh)
- Dựa vào kết quả ở Bước 3, tiến hành đập đi viết lại (Refine).
- Quá trình này phải lặp lại (Iterate) từ 1 đến 2 lần cho đến khi không còn tìm ra bất kỳ điểm yếu nào. 
- Chỉ khi đạt 9.5/10 điểm đánh giá thì mới được phép lưu file (Commit) và đưa ra Production.
