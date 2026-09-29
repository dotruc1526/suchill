# M1-07 / M1-08 — Vinh QA sign-off, 2026-09-29

- QA owner: Vinh (Member 5), Codex thực thi theo yêu cầu.
- Reviewed runtime: `main`, `dbbf7eff2062a5b281f58766720ec37a16347267` (PR #53 merged).
- Environment: macOS arm64, Node v26.9.0, HeadlessChrome 153.0.8010.12.
- Scope: Modal keyboard/focus lifecycle và full quality suite sau merge; không thay thế visual acceptance, screen-reader/device audit toàn app hoặc release gate.
- Verdict: **APPROVED — QA trong phạm vi đã kiểm tra không phát hiện Blocker/Critical.**

## Browser keyboard verification

App hiện không có runtime consumer của Modal. Fixture ở `tests/qa/fixtures/modal-keyboard.html` import trực tiếp canonical `src/components/ui/Modal.tsx` cùng CSS thật, chạy React StrictMode; không sao chép implementation. Script `tests/qa/modal-keyboard.mjs` gửi keyboard events bằng Chrome DevTools Protocol và đọc `document.activeElement` sau mỗi bước. Đây là kiểm tra tương tác browser tự động, không phải manual screen-reader audit; không dùng DOM `.click()` hoặc `.focus()` để tạo kết quả.

26 checkpoint PASS, tại 375×900 và 430×900 CSS px: mở bằng Tab/Enter, focus ban đầu vào nút Đóng, vòng Shift+Tab đầu→cuối và Tab cuối→đầu, di chuyển thuận/ngược qua input/action, rerender với onClose callback mới không mất focus, Escape đóng và trả focus, đóng bằng Enter trên nút Đóng/Hoàn tất đều trả focus về trigger.

```sh
CHROME_PATH='/Users/dinhquangvinh/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' node tests/qa/modal-keyboard.mjs
```

```json
{
  "browser": "HeadlessChrome/153.0.8010.12",
  "viewportHeight": 900,
  "results": [
    "375px keyboard reaches trigger: PASS",
    "375px initial focus: PASS",
    "375px Shift+Tab wraps first to last: PASS",
    "375px Tab wraps last to first: PASS",
    "375px Tab reaches input: PASS",
    "375px Tab reaches action: PASS",
    "375px rerender preserves focus: PASS",
    "375px reverse traversal: PASS",
    "375px Escape closes and restores trigger: PASS",
    "375px reopen initial focus: PASS",
    "375px close button restores trigger: PASS",
    "375px reopen for final action: PASS",
    "375px final action restores trigger: PASS",
    "430px keyboard reaches trigger: PASS",
    "430px initial focus: PASS",
    "430px Shift+Tab wraps first to last: PASS",
    "430px Tab wraps last to first: PASS",
    "430px Tab reaches input: PASS",
    "430px Tab reaches action: PASS",
    "430px rerender preserves focus: PASS",
    "430px reverse traversal: PASS",
    "430px Escape closes and restores trigger: PASS",
    "430px reopen initial focus: PASS",
    "430px close button restores trigger: PASS",
    "430px reopen for final action: PASS",
    "430px final action restores trigger: PASS"
  ]
}
```

## Full quality trên main

```sh
CHROME_PATH='/Users/dinhquangvinh/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell' npm run quality
```

Exit 0: typecheck PASS, production build PASS, unit 16/16, component 8/8, E2E 1/1; secret scans trước/sau tests đều 230 source/tracked/bundle files, 0 unsafe matches. Runtime source và package/lockfile giữ nguyên commit được review. Browser probe là lệnh bổ sung riêng, chưa tích hợp vào `npm run quality`.

Lượt đầu dùng đường dẫn Chrome mặc định không tồn tại (`ENOENT`); đã chạy lại toàn bộ suite thành công với Chromium có sẵn. Probe ban đầu thiếu carriage-return text của Enter trong CDP nên chưa kích hoạt nút; sửa transport test rồi toàn bộ 26 checkpoint pass, không sửa Modal.

Warnings sẵn có: Vite native config (`__dirname`, JSON import attributes) và optimizer asset alias `@/imports/image-1.png`; không làm suite fail.

## Handoff

- Files changed: M1-07/M1-08 cards, task board, report này, keyboard probe và 2 fixture files; không sửa runtime source.
- Env/backend/migration/dependency impact: none. `CHROME_PATH` chỉ là biến môi trường test; không thay đổi cấu hình app.
- Giới hạn: viewport desktop emulation, chưa xác nhận thiết bị thật, Safari, screen reader hoặc focus-visible bằng mắt; không khẳng định WCAG audit toàn diện. Source assertions cũ không phải browser coverage; evidence browser mới bổ sung trực tiếp cho khoảng trống đó.
- M1-08: xác nhận lại full quality sau merge và giữ QA/accessibility approval đã ghi trên PR #53; không thực hiện visual acceptance thay PO.
- Next: Trúc ký UI/UX M1-07; PO nghiệm thu hình ảnh M1-08 và quyết định gate. Cả hai card vẫn REVIEW, M1 OPEN và M2 LOCKED. Evidence được bàn giao trên nhánh `codex/m1-vinh-qa-signoff` theo yêu cầu Vinh commit/push và mở PR; không tự merge. Vinh QA lại phần M1-08 thay đổi mới sau khi Trúc bàn giao code/ảnh.
