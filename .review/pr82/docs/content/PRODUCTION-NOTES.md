# Gói authoring Mậu Thân — bản sửa sau PR #21

- Executor: Trúc (Member 2), Thọ đã giao toàn bộ revision.
- Consumer frontend: Dương (Member 4); technical QA/backend: Vinh (Member 5).
- Status: REVIEW bản nháp; chưa sản xuất/tích hợp hoặc phát hành.

## Video

Đọc [PILOT-SCREENPLAY.md](./PILOT-SCREENPLAY.md). Nguồn lời đọc duy nhất là [PILOT-NARRATION.json](./PILOT-NARRATION.json); [VTT](./PILOT-CAPTIONS.vtt) khớp chữ, tổng 110s. Năm scene có đủ cue. Bỏ yêu cầu bản ghi thơ, clip Cronkite, tiếng nổ/nhạc và giờ lịch sử chưa đối chiếu.

Visual dự kiến: thẻ chữ/sơ đồ không địa lý; không giả làm tư liệu gốc. Chưa tạo MP4/audio/poster. Trúc cần thu thử giọng hợp lệ, đo timing, xuất manifest/hash và QA nghe/xem trước production acceptance.

## Bài 2 và dữ liệu

- [MAP-MT68.json](./MAP-MT68.json): năm thẻ có source/claim ID; không có x/y giả. ID cũ lưu ở legacyDraftId để người nhận nhận diện migration bản nháp.
- [LESSON-02-STORY.json](./LESSON-02-STORY.json): bảy scene, hai nhánh đọc hội tụ, knowledge check và debrief/end. Required overview buộc đọc đủ năm node.
- [LESSON-02-INTERACTIVE.md](./LESSON-02-INTERACTIVE.md) mô tả điều kiện coverage, fiction/learner agency và source.
- Đây là JSON authoring mở rộng để bàn giao, chưa phải service DTO hoặc migration. Vinh/Dương cần mapper và validator runtime riêng khi milestone cho phép.
- UI đi qua feature hook → service → adapter, không fetch trực tiếp file authoring.
- Quiz answer key chỉ thuộc authoring/trusted backend; không đưa nguyên file scored quiz vào client.
- Không có cam kết dưới 150 ký tự cho mọi chuỗi; UI cần wrap tiếng Việt và kiểm tra mobile.

## Media và next action

[MEDIA-REVIEW-MT68.md](./MEDIA-REVIEW-MT68.md) ghi từng quyết định license/caption và những ứng viên loại khỏi phương án bắt buộc. Trúc nghiệm thu nội dung theo quyền được giao; QA kỹ thuật vẫn cần evidence. CONTENT-006 giữ REFERENCE_ONLY; không dùng clip cũ thay pilot này; M0/M1 đã đóng, M2 kỹ thuật đang OPEN, còn content/media production vẫn bị khóa theo artifact review.
