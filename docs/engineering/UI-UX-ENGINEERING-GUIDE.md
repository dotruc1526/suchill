# Sử Chill — UI/UX & Reusable Engineering Guide

> Status: REQUIRED GUIDELINE\
> Last updated: 2026-09-22\
> Áp dụng cho Figma, React/PWA và mobile wrapper trong tương lai.

## 1. Hướng cảm xúc giao diện

Sử Chill mang cảm giác lịch sử gần gũi, giàu hình ảnh và dễ học; không biến thành giao diện game hiện đại màu neon. Nền giấy cổ, màu mực nâu và đỏ dấu triện là nhận diện chính.

Ưu tiên:

- Typography dễ đọc trước khi thêm trang trí.
- Card và khung nội dung có chiều sâu nhẹ, bo góc nhất quán.
- Ảnh lịch sử có caption, source và trạng thái tải/fallback.
- Khoảng trắng đủ rộng để nội dung lịch sử không bị ngộp.
- Mỗi màn hình chỉ có một hành động chính nổi bật.

## 2. Design tokens — biến thiết kế dùng chung

Không viết tùy ý màu, khoảng cách, bo góc, shadow, duration hoặc z-index trong từng component. Các giá trị phải đi qua `src/theme/tokens.ts`.

Nhóm token cần có:

- `colors`: màu nền, chữ, primary, feedback và overlay.
- `spacing`: khoảng cách chuẩn.
- `radius`: bo góc nhỏ/vừa/lớn/pill.
- `shadow`: độ nổi của card/modal/floating control.
- `typography`: font, cỡ chữ, line height và weight.
- `motion`: thời lượng và easing cho press/enter/exit/scene transition.
- `sound`: tên cue và mức âm lượng mặc định; file thật được quản lý qua sound service.

Figma và React phải dùng cùng tên/ý nghĩa token khi có thể.

## 3. Component tái sử dụng

### UI primitives

Đặt tại `src/components/ui/`:

- `Button`
- `IconButton`
- `Card`
- `ChoiceOption`
- `ProgressBar`
- `Badge`
- `Modal`/`Dialog`
- `LoadingState`
- `ErrorState`
- `EmptyState`
- `MediaFrame`

Mỗi primitive phải hỗ trợ các state cần thiết thay vì tạo một component mới cho từng màn hình.

### Feature components

Component gắn với nghiệp vụ đặt trong feature tương ứng:

- Visual Novel: dialogue box, character layer, scene choice, source panel.
- Learning: lesson card, video block, transcript panel.
- Quiz: question card, explanation panel, result summary.
- AI Battle: opponent status, locked answer, round result.

Không đưa business logic cụ thể vào UI primitive.

## 4. Function và logic tái sử dụng

Tái sử dụng không có nghĩa là gom mọi thứ vào một function lớn. Dùng đúng lớp:

```text
Component → hiển thị và nhận tương tác
Hook/controller → quản lý state của màn hình
Domain function → tính completion, score, transition, reward
Service → đọc/ghi Supabase hoặc gọi backend
Utility → xử lý nhỏ, thuần và không phụ thuộc UI
```

Quy tắc:

- React component không gọi Supabase/HTTP trực tiếp.
- Logic tính điểm, completion, branching và streak không viết lặp lại trong nhiều component.
- Function domain ưu tiên pure function — cùng input luôn cho cùng output, dễ test.
- Contract dùng type trong `src/types/index.ts` hoặc module type đã được Phase 5 chốt.
- Hook chỉ dùng cho React state/effect; không biến mọi helper thành hook.
- Không tạo abstraction chỉ được dùng một lần nếu chưa có nhu cầu rõ ràng.
- Không copy-paste để sửa nhanh nếu logic đó ảnh hưởng nhiều feature.

## 5. Motion, sound và feedback

- Press feedback xuất hiện ngay khi chạm.
- Scene transition ngắn và không chặn đọc lâu.
- Correct/incorrect có màu, icon, text và âm thanh tùy chọn; không chỉ dựa vào một tín hiệu.
- Sound đi qua một `soundService`/manager dùng chung, có preload hợp lý, mute và volume setting.
- Không để mỗi component tự tạo audio instance riêng.
- Tôn trọng `prefers-reduced-motion` và thiết lập tắt âm thanh.
- Không autoplay âm thanh/video trước tương tác đầu tiên.

## 6. Tối ưu hiệu năng

- Lazy-load — chỉ tải screen/feature khi cần.
- Ảnh dùng kích thước phù hợp; ưu tiên định dạng nén hiện đại và có placeholder.
- Video có bản mobile, poster và transcript; không preload toàn bộ video khi chưa mở.
- Visual Novel chỉ preload asset của scene hiện tại và một bước kế tiếp khi hợp lý.
- Tránh rerender toàn player khi chỉ một phần nhỏ thay đổi.
- Chỉ dùng memoization sau khi xác định điểm tốn hiệu năng; không tối ưu mù quáng.
- Âm thanh ngắn được tái sử dụng/cache, không tải lại sau mỗi lần bấm.
- Kiểm thử trên điện thoại cấu hình thấp và mạng chậm, không chỉ trên máy phát triển.

## 7. Figma handoff — bàn giao thiết kế

Mỗi màn hình Figma cần có:

- Mobile frame mục tiêu.
- Component và variant thay vì các layer copy rời rạc.
- State: default, pressed, selected, disabled, loading, success/error và focus khi phù hợp.
- Token/style dùng cho màu, typography, radius và spacing.
- Ghi chú hành vi khi bấm, back, loading, lỗi và nội dung dài.
- Prototype cho luồng chính.

Không coi ảnh chụp một màn hình đẹp là đủ để frontend triển khai.

## 8. Definition of Done cho UI

Một UI task chỉ `DONE` khi:

- Khớp intent của Figma và theme Sử Chill.
- Reuse token/primitive hiện có hoặc giải thích vì sao cần component mới.
- Có loading/error/empty/disabled state phù hợp.
- Dùng được trên màn hình nhỏ và nội dung tiếng Việt dài.
- Có keyboard/focus/label và reduced-motion behavior phù hợp.
- Không có database/API call trực tiếp trong component.
- Không tạo logic nghiệp vụ trùng lặp.
- Đã kiểm tra hiệu năng cơ bản trên mobile.
