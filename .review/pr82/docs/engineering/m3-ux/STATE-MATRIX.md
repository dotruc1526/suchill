# M3 learning — Flow/state/action matrix

> Status: REVIEW; 2026-10-01; xem [handoff](../M3-UX-HANDOFF.md).

## Player states (Phase 4)

| State | Trình bày | Action → kết quả | Checkpoint/attempt |
|---|---|---|---|
| IDLE | Chapter, CTA Start | Start → LOADING → first block | Service khởi tạo/checkpoint theo ID |
| LOADING | Busy + thông báo; learning actions chưa hiện | Cancel về chapter; success → PLAYING/CHOICE_PENDING | Không tự tạo attempt |
| PLAYING | Text/scene/video hiện đầy đủ | Next theo authored graph/policy; back/review; pause | Checkpoint đúng block/version/scene; video position |
| CHOICE_PENDING | Intent label, options, CTA disabled khi chưa chọn | Select → selected; confirm → recordChoice/feedback/branch | Narrative khóa sau service success; không isCorrect |
| FEEDBACK | Response hoặc knowledge explanation + text/icon | Continue theo scene policy; sai retryable → cùng scene | Learning attempt mới khi submit học mới; retry mạng giữ operation ID |
| PAUSED | Chapter CTA Resume; vị trí vẫn còn | Resume → getResumePoint → LOADING → đúng vị trí | Không reset; prototype minh họa bằng local bookmark |
| ERROR | Message giải thích + Retry/Back; media poster/transcript nếu có | Retry → LOADING; fallback → recap/check nếu đã duyệt | Không xóa progress/khởi attempt chỉ vì error |
| COMPLETED | Block/episode/lesson summary riêng; reward pending hoặc confirmed | Next block/lesson hoặc về chapter | Reward chỉ receipt từ trusted service; không UI calculation |

## Shared loading/error/offline/empty

Áp dụng cho lesson/VN/video/quiz; toolbar reviewer cho phép chọn từng state. Prototype trả ready tức thì khi retry; runtime phải chờ typed Result và giữ feedback lỗi nếu retry tiếp tục thất bại.

| State | Lesson/text | VN | Video | Quiz |
|---|---|---|---|---|
| Loading | Text chưa có: spinner + Cancel | Chưa cho chọn; giữ checkpoint | Poster/skeleton; chưa autoplay | Chưa cho submit |
| Error | Retry document hoặc về chapter | Retry cùng version; broken graph không mở choices | Poster + transcript/mô tả + Retry; completion theo fallback policy | Giữ lựa chọn; submit lỗi gửi lại cùng operationId |
| Offline | Chỉ tài liệu đã cache | Chỉ version/media đã cache; chưa có thì thông báo | Transcript/fallback đã cache; không hứa download video | Không submit scored khi chưa có trusted route; pending không là passed |
| Empty/not_found | Nội dung chưa sẵn sàng → Back | Không có version → Back | Asset chưa published → fallback hợp lệ hoặc Back | Không có QuestionSet → Back |

Không gộp unauthorized/conflict thành empty: unauthorized yêu cầu session route của owner; conflict đọc lại progress/version và thông báo. `server_error` → Retry; `validation` → không lặp vô hạn, Back và QA report; `offline` → cached-only. Prototype không triển khai auth hoặc request network thật.

## Component interaction states

| State | Cues | Interaction/a11y |
|---|---|---|
| Default | Card/button rõ label, chưa có feedback | Button semantics; Enter/Space native |
| Hover/pressed | Background/shadow qua token, phản hồi ngắn | Không dịch content gây mất focus; sound tùy mute |
| Selected narrative/reflection/branching | Primary border + neutral fill, dấu chọn | aria-pressed; nhãn không đúng/sai; change chỉ trước confirm |
| Selected quiz | Primary border, chưa có correctness | Không reveal key/explanation; CTA đợi tất cả questions |
| Locked | Disabled options + “Đã ghi nhận lựa chọn” | Không chỉnh khi review; restart cần confirm/service |
| Correct/incorrect | Xanh/đỏ + ✓/✗ + “Đúng/Chưa đúng” + explanation | Chỉ sau receipt/policy; announcement; không phạt XP |
| Disabled | Dashed border/copy về điều kiện chưa đạt | disabled native, không nhận click hoặc tạo attempt |
| Loading action | Busy label, giữ kích thước; không gửi trùng | aria-busy; operation ID không đổi trên retry cùng payload |
| Focus | Primary outline, khoảng cách thấy rõ | Tab theo DOM; modal trap, Escape và restore opener |

## Screen-specific actions

| Screen | Primary | Secondary | Điều kiện/exit |
|---|---|---|---|
| Lesson | Continue → next ordered block | Nguồn; pause về chapter | Required checks theo authored lesson; scroll không đủ hoàn thành |
| VN | Confirm/Continue | Review, restart | Policy/graph có nextSceneId hợp lệ; back không unlock |
| Video optional | Continue | Play/pause/seek/volume/captions/transcript | Không yêu cầu watch gate cho optional fixture |
| Video required | Continue khi policy hoặc fallback route đạt | Fallback + required recap/check; Retry | Không lấy position cuối làm watch threshold; completion service gap G2/G5 |
| Practice quiz | Nộp đủ câu → feedback → summary | Làm lại | Một receipt theo QuestionSet; retry học mới là operation mới |
| Scored quiz | Nộp đủ câu → score/passed từ receipt | Retry theo lesson policy | Không tính grade client; prototype chỉ practice |
| Completion pending | Về chapter | Xem lại | Không cộng số XP/streak khi pending |
| Completion confirmed | Next lesson nếu có; về chapter | Recap/source | Hiển thị read model server; fixture toolbar không là service |

## Accessibility acceptance khi triển khai

Native headings/landmarks/buttons/details; source links có tên đọc được. Đảm bảo focus vào heading/state sau navigation, giữ option focus khi selection, announce receipt sau submit. Không sử dụng tabindex dương. Back/exit không xóa bookmark. Dialog focus vào Cancel, Shift-Tab/Tab tuần hoàn, Escape hủy, focus về opener.

44×44px targets, nội dung wrap và line-height 1.6; không clamp facts/source/explanation. Safe-area top/bottom qua env; control không phủ chữ. Media alt/caption/transcript/mô tả hình là authored metadata, không tự sinh fact. Reduced motion tắt animation/transform; âm thanh nhẹ chỉ sau click, mute được lưu, lỗi sound không chặn action.

Automated prototype evidence không thay manual screen-reader, thiết bị thật, captions sync, color audit toàn app hoặc QA runtime M3-07.
