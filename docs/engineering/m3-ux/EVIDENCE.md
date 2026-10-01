# M3-UX-01 — Verification and review evidence

> Date: 2026-10-01; Executor: Codex hỗ trợ Trúc\
> Scope: design prototype; reviewer acceptance còn pending.

## Commands / kết quả

| Check | Result | Evidence |
|---|---|---|
| `node docs/engineering/m3-ux/generate-tokens.mjs` | PASS | CSS snapshot lấy trực tiếp `theme` từ canonical tokens |
| `node --check` prototype.js, screens.js, icons.js, verify.mjs | PASS | JavaScript parse không lỗi ở lượt polish |
| `node docs/engineering/m3-ux/verify.mjs` | PASS | [checks.json](./evidence/checks.json): 20 nhóm kết quả sau bổ sung SỬu |
| `npm run typecheck` | PASS baseline | TypeScript không lỗi ở handoff trước polish; lượt polish không thay production source |
| `npm run build` | PASS baseline | Vite v8.3.1 ở handoff trước polish; cảnh báo config native tương lai của baseline, không chặn build |
| Markdown local links / diff whitespace | PASS | Kiểm tra các file mới/đổi thuộc M3-UX-01 |

Chrome headless chạy với viewport mobile 375×932 và 430×932, deviceScaleFactor 1. Các ảnh mobile lấy toàn bộ app frame; panel reviewer nằm ngoài frame. Browser kiểm tra 6 màn × 2 chiều rộng, 44px touch targets, 4 shared states mỗi màn (48 tổ hợp), keyboard selection/focus, locked narrative review, dialog trap/Escape/restore/restart, video resume/reload/play-pause/caption toggle/fallback, đủ câu quiz/retry/feedback, mute persistence và reduced motion. Typography tiếng Việt dài kiểm tra cả 375/430px. Desktop 1280px kiểm tra chiều rộng frame 375/430px, reset về bài chưa bắt đầu và không tràn ngang. Captions `aria-pressed` và seek/timecode `aria-valuetext` đồng bộ đã kiểm tra. SỬu copy nguyên byte từ asset nguồn; hình decode thành công trước screenshots ở cả 6 màn, hero có alt. Toàn bộ 20 nhóm PASS được ghi bằng script, không phải QA sign-off.

Lượt chạy Chrome trong sandbox timeout CDP; chạy cùng script với quyền execution phù hợp đã thành công. QA lượt đầu đã sửa focus Tab của dialog và icon phản hồi sai; không sửa Modal production. Lượt polish thay bố cục/icon/controls của 6 màn, giảm chiều cao trang trí VN, gom controls video và thêm panel desktop. Đã xem trực quan ảnh mới chapter/lesson/VN/video/quiz 375px, quiz feedback/completion confirmed/video error 430px và desktop 1280px: không thấy chữ/CTA bị cắt hoặc overflow.

Đo 9 cặp text/background từ CSS tokens: tất cả ≥4.5:1; thấp nhất là incorrect text/background 4.63:1, text secondary/app 6.63:1, primary text/button 7.57:1. Đây là audit các cặp chữ đại diện trong prototype; không thay color audit toàn app của reviewer.

Lượt nhận diện SỬu: đã xem lại Chapter/Lesson 375px và desktop 1280px sau khi thêm hình. Mascot hero và brand mark không che chữ hoặc CTA. [Provenance asset](./assets/README.md); không có media mới do AI generate, không request nguồn ngoài.

Preview local được khởi động lại trong nền; `/` và `/assets/suu.png` tại `127.0.0.1:4178` trả HTTP 200, asset trả đúng 1,597,140 bytes. Server vẫn cần khởi động lại sau khi máy/process đóng; đây không phải hosted deployment.

## Screenshots

| Screen | 375px | 430px |
|---|---|---|
| Chapter | [ảnh](./evidence/chapter-375.png) | [ảnh](./evidence/chapter-430.png) |
| Lesson | [ảnh](./evidence/lesson-375.png) | [ảnh](./evidence/lesson-430.png) |
| VN trước chọn | [ảnh](./evidence/vn-375.png) | [ảnh](./evidence/vn-430.png) |
| Video | [ảnh](./evidence/video-375.png) | [ảnh](./evidence/video-430.png) |
| Practice quiz | [ảnh](./evidence/quiz-375.png) | [ảnh](./evidence/quiz-430.png) |
| Completion pending | [ảnh](./evidence/complete-375.png) | [ảnh](./evidence/complete-430.png) |
| Tiêu đề tiếng Việt dài | [ảnh](./evidence/long-vietnamese-375.png) | [ảnh](./evidence/long-vietnamese-430.png) |

State evidence: [narrative selected/locked](./evidence/vn-selected-430.png), [video error/poster/transcript](./evidence/video-error-430.png), [quiz đúng/sai + explanation](./evidence/quiz-feedback-430.png), [completion confirmed fixture](./evidence/completion-confirmed-430.png).

Desktop review: [panel và app frame tại 1280px](./evidence/desktop-review-1280.png).

## Giới hạn và checklist reviewer

- [x] Không có media/nguồn bên ngoài hoặc request backend trong prototype; phần chữ là fixture minh họa.
- [x] Tokens được generate, selected narrative trung tính và không mang correctness.
- [x] Main/headers/details/button semantics; keyboard và feedback text/icon; không có target dưới 44px trên các màn ready đã kiểm tra.
- [x] CSS top/bottom dùng safe-area env; nội dung không nằm dưới sticky footer. Kiểm tra trên device thật còn pending.
- [x] Reduced motion tắt transform/animation; mute key lưu và khôi phục khi reload.
- [ ] Hưng review spacing/typography/primitives feasibility và G3/G4 trong handoff.
- [ ] Vinh kiểm tra screen-reader announcement, contrast toàn implementation và version/operation semantics.
- [ ] Thiết bị thật/weak-device smoke, safe-area phần cứng, native video controls và captions sync: làm khi feature runtime/media được duyệt tồn tại.
- [ ] Dương nhận handoff, Product Owner nghiệm thu design.

Prototype không kiểm tra authoritative progress/reward, RLS/auth, PWA/offline cache, mạng video hoặc licensed media. Những phần này thuộc task/gate riêng; CONTENT-007 không được unblock ở đây. Không có env, migration hoặc package/lockfile changes.
