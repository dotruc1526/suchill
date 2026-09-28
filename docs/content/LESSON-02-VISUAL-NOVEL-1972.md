# Lesson 2 — Kíp chiến đấu SAM-2: Flagship Visual Novel brief

> Status: AUTHORING BRIEF APPROVED — narration/StoryVersion/media chưa được duyệt\
> Task: `CONTENT-016`\
> Proposed lesson ID: `lesson-1972-02-visual-novel`\
> Proposed story ID: `story-1972-sam2`\
> Proposed first version ID: `story-1972-sam2-v1-draft`

Claim/source locator, historical/fiction boundary và media package bắt buộc nằm tại [CONTENT-016-EVIDENCE.md](./CONTENT-016-EVIDENCE.md). Brief này không được chuyển thành narration hoặc `StoryVersion` trước khi các gate trong evidence package đạt.

## Vai trò trong chapter

Đây là flagship Visual Novel của chapter “Điện Biên Phủ trên không 1972”. Lesson 1 dùng video để mở bối cảnh; Lesson 2 chuyển sang trải nghiệm scene-based nhằm giúp người học hiểu phối hợp trong một kíp chiến đấu và cách đọc thông tin radar/nhiễu. Sơ đồ SAM-2 là artifact tương tác bên trong story, không còn là một lesson sơ đồ đứng riêng.

Mục tiêu dự kiến: CLO-2 và CLO-3. Thời lượng mục tiêu: 6–10 phút sau usability test.

## Ranh giới lịch sử và hư cấu

- Người học là người quan sát/phân tích hồ sơ huấn luyện, không điều khiển kết quả trận đánh thật.
- Không dùng tên, lời thoại hoặc nội tâm của người thật khi chưa có nguồn cho phép tái hiện.
- Narrative/reflection/branching choice chỉ đổi thứ tự hoặc góc đọc; không có `isCorrect` và không thay đổi lịch sử.
- Chỉ knowledge-check choice mới có correctness và explanation.
- Mọi narration chứa fact phải dùng claim ID trong evidence package và có source locator được Trúc review trước khi chuyển thành story JSON.
- Không dùng mechanic bật/tắt radar, chọn tần số/thời điểm phóng hoặc “lựa chọn tối ưu lịch sử” ở draft hiện tại; các thao tác đó cần nguồn kỹ thuật và safety review riêng.

## Scene flow đề xuất

| Scene ID | Loại | Mục đích và chuyển tiếp |
|---|---|---|
| `sam2-v1-briefing` | narration | Nối từ video Lesson 1, nêu objective và ranh giới vai trò; next `sam2-v1-crew` |
| `sam2-v1-crew` | evidence/artifact | Khám phá các vị trí trong kíp chiến đấu qua sơ đồ có text fallback; chỉ tiếp tục sau khi các thành phần bắt buộc đã được trình bày |
| `sam2-v1-perspective` | branching choice | Chọn đọc trước quy trình phối hợp hoặc dấu hiệu nhiễu; hai lựa chọn không có đúng/sai |
| `sam2-v1-coordination` | narration/evidence | Nhánh giải thích quy trình phối hợp ở mức đã được nguồn duyệt; hội tụ vào check |
| `sam2-v1-interference` | narration/evidence | Nhánh đọc artifact radar/nhiễu ở mức đã được nguồn duyệt; hội tụ vào check |
| `sam2-v1-check` | knowledge check | Kiểm tra người học phân biệt vai trò, bằng chứng và giới hạn kết luận; mọi lựa chọn có explanation và next debrief |
| `sam2-v1-debrief` | debrief | Tổng hợp CLO-2/CLO-3, nhắc lựa chọn không thay lịch sử; next end |
| `sam2-v1-end` | end | Dẫn sang Lesson 3; không tự quyết định XP/reward |

## Interaction và accessibility

- Keyboard/focus đầy đủ; không yêu cầu hover hoặc thao tác chính xác trên sơ đồ nhỏ.
- Sơ đồ có ordered-text fallback và nhãn screen-reader; không dựa duy nhất vào màu/âm thanh.
- Narrative selection dùng neutral/primary; knowledge feedback có text/icon đúng–sai.
- Reduced motion; không autoplay âm thanh. Media optional phải có alt/caption/transcript/fallback và license evidence.
- Mobile 375px/430px, tiếng Việt dài và thiết bị yếu là acceptance bắt buộc.

## Deliverable tiếp theo sau khi brief được duyệt

1. Tạo task/file claim riêng cho Full Narration, `StoryVersion` JSON và media khi milestone/dependency cho phép.
2. Thọ viết narration/choice/explanation scene-by-scene; Trúc duyệt từng câu chứa claim lịch sử trước production.
3. Media chỉ được chọn khi có quyền sử dụng và metadata; text-first fallback vẫn là luồng hoàn chỉnh bắt buộc.
4. Vinh/Dương map authoring đã duyệt sang `StoryVersion` contract và chạy validator khi M2/M3 được mở.
5. Chỉ story version đã review/publish mới được runtime hoặc seed sử dụng.
