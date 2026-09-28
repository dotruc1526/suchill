# M1-06 QA evidence — UI foundation, accessibility và mobile

> Date: 2026-09-28\
> Owner: Vinh (Member 5) + Codex support\
> Scope: M1 UI foundation QA only; không đóng milestone và không mở M2 thay Product owner.

## Kết luận

M1-06 đạt QA ở mức foundation sau lượt Product owner blocker review: UI primitives/shared states render được, layout/navigation đạt safe-area/touch-target regression, narrative selection không còn mang màu/icon đúng sai, Modal có focus trap/restore và primitives liên quan dùng token tập trung.

Product owner vẫn cần ghi quyết định đóng M1 trên task board trước khi M2 được mở.

## Phạm vi đã kiểm

| Nhóm | Kết quả |
|---|---|
| UI primitives | `Button`, `Card`, `ChoiceOption`, `Badge`, `Progress`, `IconButton`, `Modal` có token/state/accessibility baseline để feature screen dùng lại; các màu/shadow được route qua `theme` tokens. |
| Shared states | `LoadingState`, `ErrorState`, `EmptyState`, `OfflineState` render nội dung tiếng Việt và trạng thái chính. |
| Layout/navigation | `TopBar`/`BottomNav` có landmark/label, `aria-current`, safe-area top/bottom/side và touch target 44px. |
| Knowledge vs narrative state | Knowledge feedback chỉ dùng correct/incorrect khi `revealed`; narrative/reflection choice chỉ truyền `isSelected` sẽ dùng trạng thái selected trung tính và không hiện ✓/✗. |
| Keyboard/focus | Core buttons có focus-visible từ global/Tailwind baseline; Modal đưa focus vào dialog khi mở, trap Tab/Shift+Tab, Escape/click-outside đóng và trả focus về phần tử đã mở modal. |
| Mobile 375px/430px | M1-04 evidence ghi Chrome smoke pass: không horizontal overflow, nav bottom aligned, nút 44px, safe-area padding đúng. |
| Reduced motion/sound/mute | M1-05 đã DONE trong PR #33; M1-06 không mở lại foundation đó, chỉ xác nhận không có blocker trong gate evidence. |

## Automated evidence

Chạy trên branch `codex/m1-po-blocker-fixes` sau khi sửa blocker Product owner:

```text
npm run quality -> pass
typecheck -> pass
build -> pass
client secret scan -> 224 files, 0 unsafe
unit -> 16/16 pass
component -> 7/7 pass, includes regression for narrative choice, modal focus source and token routing
E2E -> 1/1 pass
post-build client secret scan -> 224 files, 0 unsafe
```

Ghi chú: Vite native-config warning vẫn xuất hiện nhưng không làm fail build/test.

## Defect log

| Severity | Issue | Owner/scope | Status |
|---|---|---|---|
| Blocker | Narrative choice selected bị hiện như đáp án đúng | `ChoiceOption.tsx`; M1-06 QA regression | Fixed |
| Blocker | Modal chưa có focus trap/restore dù evidence cũ đánh dấu đạt | `Modal.tsx`; M1-06 QA regression | Fixed |
| Major | UI primitives còn hard-code màu/shadow thay vì token tập trung | `Button.tsx`, `Badge.tsx`, `ChoiceOption.tsx`, `Progress.tsx`, `tokens.ts` | Fixed for PO-cited primitives |
| Minor | Vite native-config warning về `__dirname` và JSON import attributes | Future tooling cleanup, không thuộc M1-06 | Known non-blocking |

## Gate handoff

- M1-04: DONE, layout/navigation focused verification đạt.
- M1-05: DONE, interaction foundation đã có evidence từ PR #33.
- M1-06: DONE, QA foundation evidence này đủ để Product owner audit.
- Không env/migration impact.
- Không mở M2 trong task này.
