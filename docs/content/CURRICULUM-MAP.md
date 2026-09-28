# Curriculum Mậu Thân 1968 — bản sửa sau PR #21

> Outline CONTENT-008; revision [CONTENT-014](../tasks/active/CONTENT-014.md).
> Status: IN_REVIEW. Chọn chapter không phải approval xuất bản.
> Scope: kháng chiến chống Mỹ tại Việt Nam; chapter mẫu Mậu Thân 1968.
> Chapter ID: `chapter-mau-than-1968`; slug: `mau-than-1968`.

## Mục tiêu học tập

- CLO-1: nhận diện bối cảnh tiến công tại đô thị cuối tháng 1/1968, tránh khẳng định mọi nơi cùng phút/giao thừa.
- CLO-2: nhận diện năm mục tiêu trong nguồn; phân biệt tiến công một nơi với chiếm toàn bộ công trình.
- CLO-3: giải thích vai trò của cơ sở chuẩn bị vũ khí, không lấy kế hoạch thay kết quả.
- CLO-4: phân biệt tác động quân sự/chính trị và các bước ngoại giao, tránh quy về một nguyên nhân duy nhất.

## Trình tự bài học

| ID | Tên / format | Objective | Bản authoring / thời lượng dự kiến |
|---|---|---|---|
| lesson-mt68-01-video | Kế hoạch Giao Thừa / video | CLO-1, CLO-3 | [Pilot](./PILOT-SCREENPLAY.md); video 110s + đọc nguồn, khoảng 3–4 phút |
| lesson-mt68-02-interactive | Sấm sét nội đô / visual_novel | CLO-2 | [Bài 2](./LESSON-02-INTERACTIVE.md), [story](./LESSON-02-STORY.json), [thẻ](./MAP-MT68.json); khoảng 6–8 phút gồm đối chiếu nguồn |
| lesson-mt68-03-standard | Thế trận lòng dân / standard | CLO-3 | [Bài 3](./LESSON-03-STANDARD.md); đọc và đối chiếu khoảng 4–5 phút |
| lesson-mt68-04-synthesis | Bước ngoặt Paris / standard | CLO-4 | [Bài 4](./LESSON-04-SYNTHESIS.md); đọc niên biểu khoảng 4–5 phút |
| quiz-mt68-chapter-assessment | Đánh giá chương / quiz | CLO-1…4 | [Quiz authoring](./QUIZ-MT68.json); khoảng 4–5 phút |

Thời lượng là ước tính editorial, chưa đo với người học. Giữ format Visual Novel Bài 2, không thay bằng fetch JSON bản đồ đơn lẻ. Bản đồ hiện trình bày thẻ, không có tọa độ địa lý đã duyệt.

## Phạm vi và ranh giới

Trọng tâm là Sài Gòn cuối tháng 1/1968 và các mốc ngoại giao được Bài 4 dẫn nguồn. Không mô tả toàn bộ chiến trường hoặc tự nhận toàn bộ chapter đã được kiểm chứng.
Tên pilot là nhan đề biên tập. Người học là người đọc tư liệu; không điều khiển kết quả lịch sử, không có lời thoại gán cho người thật.
Các phân loại/claim có trạng thái trong [registry](./HISTORICAL-SOURCES.md); những giải thích phương pháp đọc nguồn là educational_explanation.

## Coverage và completion

- CLO-1: pilot cảnh 1; quiz q-mt68-01.
- CLO-2: Bài 2 overview đủ năm thẻ, choice/knowledge check/debrief; quiz q-mt68-02.
- CLO-3: pilot cảnh 2, Bài 3; quiz q-mt68-03.
- CLO-4: Bài 4; quiz q-mt68-04/05.
- Câu hỏi scored chỉ nằm trong QUIZ-MT68.json, không chép một bộ khác vào Markdown.
- Completion, threshold, XP và chống cộng trùng theo Phase 4/7; authoring không tự định nghĩa số XP, threshold hoặc phần thưởng mới.
- Narrative/branching không có isCorrect; practice check có feedback và không phạt retry.

## Khế ước bàn giao

- Trúc: hoàn thiện authoring và media evidence theo quyền Thọ giao. CONTENT-007 chờ acceptance source/media và kịch bản; không dựng từ bản cũ.
- Dương: triển khai player khi milestone/dependency cho phép; consumer qua service interface/adapter, không raw fetch/DB từ React.
- Vinh: xác nhận mapping authoring → domain/persistence; không seed JSON chưa duyệt, không đưa answer key scored ra public DTO.
- Không tự tạo bucket/path/database contract trong curriculum. Media storage, quyền đọc draft/published theo Phase 6.
- Chi tiết [Production notes](./PRODUCTION-NOTES.md), [Phase 5](../specs/phases/05-domain-type-contract.md), [Phase 7](../specs/phases/07-progress-reward-analytics-spec.md).

## Nguồn và quyền media

Chỉ dùng registry có URL/locator cho claim hiện hành. Các tên sách chưa có trang/ấn bản vẫn là đầu mối nghiên cứu, không chứng minh nội dung đã verified.
[Media review](./MEDIA-REVIEW-MT68.md) và [catalog](./DETAILED-MEDIA-CATALOG.csv) tách license evidence khỏi approval sử dụng.
Phương án authoring bắt buộc dùng chữ/sơ đồ nguyên bản; ảnh tư liệu là tùy chọn. Bản ghi thơ, clip Cronkite, Edge TTS cũ và nhạc/SFX chưa đủ quyền không là dependency bắt buộc.

## Gate còn lại

Trúc xác nhận historical/learning/media cho bản cụ thể, Vinh kiểm tra technical QA; pilot cần audio/poster/video thật và kiểm tra nghe/xem. Không ghi DONE/APPROVED thay người kiểm tra. CONTENT-006 vẫn REFERENCE_ONLY; M0 đã đóng, M1 đang mở, M2–M7 vẫn locked.
