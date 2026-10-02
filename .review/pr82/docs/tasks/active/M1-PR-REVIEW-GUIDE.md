# Hướng dẫn Review Pull Request Milestone 1 (M1-01 -> M1-05)

> Branch: `hung/fe-003-tokens-and-primitives`\
> Target: `main`\
> Tasks liên quan: `M1-01`, `M1-02` (`FE-003`), `M1-03`, `M1-04`, `M1-05` (`FE-009`)\
> Reviewers: Trúc (Member 2 — UI/UX) và Vinh (Member 5 — Backend & QA)

---

## 1. Nội dung mẫu để dán vào Pull Request trên GitHub

```markdown
### Summary
Pull Request này triển khai toàn bộ nền tảng thiết kế và hạ tầng giao diện cho **Milestone 1**:
- **M1-01**: Bàn giao Token Contract & Design Handoff (`docs/engineering/TOKEN-HANDOFF.md`).
- **M1-02 & M1-03 (FE-003)**: Bổ sung Design Tokens đầy đủ vào `src/theme/tokens.ts`; xây dựng bộ UI Primitives (`Badge`, `Progress`, `IconButton`, `Modal`) và 4 Shared States (`LoadingState`, `ErrorState`, `EmptyState`, `OfflineState`).
- **M1-04**: Xóa bỏ folder trùng lặp `src/components/navigation/`, hợp nhất vào `src/components/layout/`; tích hợp chuẩn mobile safe-area insets (`env(safe-area-inset-top)` và `env(safe-area-inset-bottom)`) cho `TopBar` và `BottomNav`.
- **M1-05 (FE-009)**: Tích hợp `soundService` (Web Audio API, tap/correct/incorrect, mute toggle, localStorage) và hook `useReducedMotion`.
- **Tests**: Mở rộng `tests/qa/component.test.mjs` kiểm tra TopBar, BottomNav, Primitives và Shared States (4/4 tests pass).

---

### Checklist Review cho Trúc (Member 2 — UI/UX Lead)
- [ ] **Bảng màu & Tinh thần Sử Chill**: Kiểm tra `docs/engineering/TOKEN-HANDOFF.md` và `src/theme/tokens.ts`: Nền giấy mộc `#F5E6D0`, chữ mực nâu `#3D1A00`, đỏ triện `#8B1A1A`.
- [ ] **Quy tắc trắc nghiệm vs cốt truyện**:
  - Trắc nghiệm kiến thức: Đúng (xanh `#E8F5E2`/`#3A5A2A`), Sai (đỏ `#FDE8E4`/`#C4341A`).
  - Lựa chọn cốt truyện (Visual Novel): **Tuyệt đối không tô xanh**, chỉ dùng viền/nền primary ấm khi chọn.
- [ ] **Kiểu dáng UI Primitives**: Kiểm tra giao diện `Badge`, `Progress`, `IconButton`, `Modal` và 4 shared states.
- [ ] **Hiển thị tiếng Việt**: Khoảng cách dòng `line-height` đảm bảo các ký tự có dấu thanh tiếng Việt không bị cắt dính.
- [ ] **Âm thanh UI**: Các cue `tap`, `correct`, `incorrect` trong `soundService.ts`.

---

### Checklist Review cho Vinh (Member 5 — QA & Backend Lead)
- [ ] **Ranh giới kiến trúc (Architecture Boundaries)**:
  - Các UI primitive là pure component, không chứa business logic, không gọi API hay raw database.
  - Thư mục trùng lặp `src/components/navigation/` đã được loại bỏ an toàn.
- [ ] **Trợ năng & Mobile Safe-Area**:
  - `TopBar` có `paddingTop: max(8px, env(safe-area-inset-top))` và `role="banner"`.
  - `BottomNav` có `paddingBottom: max(8px, env(safe-area-inset-bottom))` và `role="navigation"`.
  - `Modal` hỗ trợ bắt phím `Escape` và click ra ngoài backdrop để đóng.
  - `useReducedMotion` hook phản hồi chuẩn `prefers-reduced-motion`.
- [ ] **Chất lượng kiểm thử & Bảo mật**:
  - Typecheck: `npm run typecheck` pass (0 errors).
  - Build: `npm run build` pass (200ms).
  - Component tests: `npm run test:component` pass (4/4 test cases).
  - Unit tests: `node --test "tests/member5/*.test.ts"` pass (16/16 test cases).
  - Secret scan: `node scripts/member5/check-client-env.mjs --require-bundle` pass (216 files, 0 unsafe secrets).

---

### Quy tắc đồng bộ folder khi chuyển sang DONE
Khi Trúc và Vinh hoàn tất review và bấm Approve:
1. Chuyển task card từ `docs/tasks/active/` sang `docs/tasks/done/`:
   - `docs/tasks/active/M1-01.md` -> `docs/tasks/done/M1-01.md`
   - `docs/tasks/active/FE-003.md` -> `docs/tasks/done/FE-003.md`
2. Cập nhật `Status: DONE` và thêm checkpoint trong các task card trên.
3. Đồng bộ link và trạng thái trên `docs/project/TASK-BOARD.md`:
   - Cập nhật link trỏ về `docs/tasks/done/...`.
   - Ghi nhật ký vào `Task update log`.
4. Cập nhật danh mục `docs/tasks/done/README.md`.
5. Merge Pull Request vào `main`.
```

---

## 2. Quy trình thực hiện chi tiết cho Nhóm

### Bước 1: Mở PR
Thành viên mở PR theo link:
👉 `https://github.com/dotruc1526/suchill/pull/new/hung/fe-003-tokens-and-primitives`
Dán toàn bộ nội dung trong mục 1 ở trên vào khung mô tả PR.

### Bước 2: Trúc & Vinh Review
- Trúc kiểm tra checklist UI/UX. Nếu cần sửa màu/radius, chỉ sửa token trong `src/theme/tokens.ts`.
- Vinh chạy `npm run test:component` và kiểm tra CI để duyệt chất lượng.

### Bước 3: Đồng bộ folder tài liệu
Ngay khi có xác nhận Approve:
- Di chuyển file từ `active/` sang `done/`.
- Cập nhật `TASK-BOARD.md` và `docs/tasks/done/README.md` theo đúng quy tắc một nguồn sự thật (Single Source of Truth).
- Merge PR vào `main`.
