# M1-06 QA evidence — UI foundation, accessibility và mobile

> Date: 2026-09-28\
> Owner: Vinh (Member 5) + Codex support\
> Scope: M1 UI foundation QA only; không đóng milestone và không mở M2 thay Product owner.

## Kết luận

M1-06 đạt QA ở mức foundation: UI primitives/shared states render được, layout/navigation đạt safe-area/touch-target regression, không phát hiện Blocker/Critical accessibility hoặc token issue trong phạm vi M1-06.

Product owner vẫn cần ghi quyết định đóng M1 trên task board trước khi M2 được mở.

## Phạm vi đã kiểm

| Nhóm | Kết quả |
|---|---|
| UI primitives | `Button`, `Card`, `ChoiceOption`, `Badge`, `Progress`, `IconButton`, `Modal` có token/state/accessibility baseline để feature screen dùng lại. |
| Shared states | `LoadingState`, `ErrorState`, `EmptyState`, `OfflineState` render nội dung tiếng Việt và trạng thái chính. |
| Layout/navigation | `TopBar`/`BottomNav` có landmark/label, `aria-current`, safe-area top/bottom/side và touch target 44px. |
| Knowledge vs narrative state | Knowledge feedback dùng correct/incorrect; narrative selection không bị ép màu đúng/sai trong contract hiện tại. |
| Keyboard/focus | Core buttons có focus-visible từ global/Tailwind baseline; modal có `aria-labelledby`, ESC/click-outside behavior từ FE-003. |
| Mobile 375px/430px | M1-04 evidence ghi Chrome smoke pass: không horizontal overflow, nav bottom aligned, nút 44px, safe-area padding đúng. |
| Reduced motion/sound/mute | M1-05 đã DONE trong PR #33; M1-06 không mở lại foundation đó, chỉ xác nhận không có blocker trong gate evidence. |

## Automated evidence

Chạy trên branch `codex/m1-completion` sau khi review PR #40:

```text
npm run quality -> pass
typecheck -> pass
build -> pass
client secret scan -> 220 files, 0 unsafe
unit -> 16/16 pass
component -> 5/5 pass
E2E -> 1/1 pass
post-build client secret scan -> 220 files, 0 unsafe
```

Ghi chú: lần chạy trong sandbox bị chặn local server (`listen EPERM`) nhưng không phải lỗi source. Chạy lại ngoài sandbox pass đầy đủ.

## Defect log

| Severity | Issue | Owner/scope | Status |
|---|---|---|---|
| Blocker/Critical | Không có | — | Closed |
| Minor | Vite native-config warning về `__dirname` và JSON import attributes | Future tooling cleanup, không thuộc M1-06 | Known non-blocking |

## Gate handoff

- M1-04: DONE, layout/navigation focused verification đạt.
- M1-05: DONE, interaction foundation đã có evidence từ PR #33.
- M1-06: DONE, QA foundation evidence này đủ để Product owner audit.
- Không env/migration impact.
- Không mở M2 trong task này.
