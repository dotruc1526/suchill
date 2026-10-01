# M3-UX-01 — Verification and review evidence

> Date: 2026-10-01; Executor: Codex hỗ trợ Trúc\
> Scope: design prototype; reviewer acceptance còn pending.

## Commands / kết quả

| Check | Result | Evidence |
|---|---|---|
| `node docs/engineering/m3-ux/generate-tokens.mjs` | PASS | CSS snapshot lấy trực tiếp `theme` từ canonical tokens |
| `node --check` prototype.js, screens.js, verify.mjs | PASS | JavaScript parse không lỗi |
| `node docs/engineering/m3-ux/verify.mjs` | PASS | [checks.json](./evidence/checks.json): 17 nhóm kết quả |
| `npm run typecheck` | PASS | TypeScript không lỗi; production source không đổi |
| `npm run build` | PASS | Vite v8.3.1 build; cảnh báo config native tương lai của baseline, không chặn build |
| Markdown local links / diff whitespace | PASS | Kiểm tra các file mới/đổi thuộc M3-UX-01 |

Chrome headless chạy với viewport mobile 375×932 và 430×932, deviceScaleFactor 1. Các ảnh lấy toàn bộ app frame; thanh reviewer nằm ngoài frame. Browser kiểm tra 6 màn × 2 chiều rộng, 44px touch targets, 4 shared states mỗi màn (48 tổ hợp), keyboard selection/focus, locked narrative review, dialog trap/Escape/restore/restart, video resume/reload/play-pause/caption toggle/fallback, đủ câu quiz/retry/feedback, mute persistence và reduced motion. Typography tiếng Việt dài kiểm tra cả 375/430px. Toàn bộ 17 nhóm PASS được ghi bằng script, không phải QA sign-off.

Lượt chạy Chrome trong sandbox timeout CDP; chạy cùng script với quyền execution phù hợp đã thành công. Phát hiện và sửa focus Tab của dialog prototype; sửa icon sai từ dấu chọn sang ✗ để feedback không gây nhầm. Không sửa Modal production. Ảnh final đã xem trực quan lesson 375, VN selected 430, video error 430, quiz feedback 430 và completion pending 375: không thấy chữ/CTA bị cắt hoặc overflow.

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
