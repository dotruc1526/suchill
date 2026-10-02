# Bài 2: Sấm sét nội đô — Visual Novel đọc hồ sơ

> CONTENT-010; revision [CONTENT-014](../tasks/active/CONTENT-014.md).
> Status: NEEDS_HISTORICAL_REVIEW. Lesson ID: `lesson-mt68-02-interactive`.
> Story version: `story-mt68-02-v2-draft`; objective CLO-2.
> Thời lượng dự kiến 6–8 phút gồm đọc năm thẻ và đối chiếu nguồn; chưa usability test.

## Premise và ranh giới

Người học là người đọc tư liệu, không đóng vai chỉ huy. Lựa chọn chỉ đổi thứ tự phân tích, không thay đổi kết quả lịch sử. Không có nhân chứng, lời thoại hay hồi ký hư cấu.
Các lời dẫn giải thích cách đọc nguồn là educational_explanation; dữ kiện ở các thẻ vẫn chờ historical review.

## Nguồn chữ và metadata

[MAP-MT68.json](./MAP-MT68.json) là nguồn duy nhất cho năm thẻ: ID, title, description, claim/source và fallback. Không chép thêm bản khác với lời cũ.
[LESSON-02-STORY.json](./LESSON-02-STORY.json) chứa nguyên văn narration, option, response/explanation và transition.
[Registry](./HISTORICAL-SOURCES.md) xác định locator và giới hạn. Source IDs/claim IDs của mỗi scene nằm trong JSON.
Không có tọa độ đã xác minh: hiển thị ordered cards, không coi x/y của bản cũ là địa lý.

## Scene-by-scene

| Scene ID | Role / yêu cầu | Nội dung, choice và next |
|---|---|---|
| mt68-v2-overview | Entry/evidence; required; CLO-2 | Đọc đầy đủ năm node của map. Nút tiếp chỉ sau khi đã trình bày đủ cả năm, kể cả chế độ văn bản. Next perspective |
| mt68-v2-perspective | Branching; required; CLO-2 | Chọn phân biệt wording hoặc kiểm tra loại bằng chứng; response ghi nhận lựa chọn. Next wording/evidence |
| mt68-v2-wording | Evidence; optional branch; CLO-2 | Phân biệt khuôn viên/công trình; next check |
| mt68-v2-evidence | Evidence; optional branch; CLO-2 | Phân biệt danh sách mục tiêu và kết quả trận đánh; next check |
| mt68-v2-check | Knowledge check; required; CLO-2 | Ba option có explanation; continueAfterFeedback, không phạt sai. Mọi option next debrief |
| mt68-v2-debrief | Synthesis; required; CLO-2 | Nhắc năm mục tiêu, giới hạn wording và nguồn; choice không thay lịch sử. Next end |
| mt68-v2-end | End; required | Tiếp sang Bài 3, không tự cộng XP |

Mỗi nhánh chỉ một scene rồi hội tụ; tất cả đường tới end đi qua overview/check/debrief. RequiredMapNodeIds ở overview phải được adapter/player kiểm tra riêng: graph hợp lệ không tự chứng minh người học đã thấy đủ thẻ.

## Media / accessibility / fallback

Không có asset bắt buộc. Dùng nền màu, typography và text; mọi scene chạy được như danh sách chữ. Optional media candidate chỉ nằm trong catalog, không truyền thành mediaAssetId đã duyệt.
Hai nhánh có nhãn rõ, dùng keyboard/focus; thông báo phản hồi bằng chữ, không chỉ màu. Hiện chưa có player để xác nhận hành vi này.
Tôn trọng reduced motion; không nhạc/SFX/autoplay có âm thanh.

## Bàn giao

Đây là authoring JSON, chưa là DTO chuẩn để seed. Dương/Vinh cần adapter/validation khi implementation được mở; không gọi fetch trực tiếp từ UI, không tự biến draft thành published.
Trúc nghiệm thu historical/learning/media bản này theo quyền Thọ giao. [Media review](./MEDIA-REVIEW-MT68.md) ghi evidence còn thiếu; không tự ký approval bằng kết quả kiểm tra tự động.
