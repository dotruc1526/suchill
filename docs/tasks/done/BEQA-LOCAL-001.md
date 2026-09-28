# BEQA-LOCAL-001 — Chuẩn bị độc lập Backend + QA của Vinh

> Status: DONE (Vinh chấp nhận bản chuẩn bị ngày 2026-09-26; chưa nghiệm thu tích hợp)
> Started: 2026-09-24

## Assignment

- Owner: Vinh (Member 5)
- Executor: Codex, theo yêu cầu trực tiếp của Vinh ngày 2026-09-24
- Reviewer bản local: Vinh (đã chấp nhận ngày 2026-09-26); reviewer khi ráp: Vinh + integration owner; Product owner vẫn giữ gate release/milestone
- Branch: `codex/member5-backend-qa-plan`
- Depends on: Phase 5–9 approved; dependency implementation của các task gốc chưa đạt nên kết quả này chỉ là chuẩn bị local
- Related tasks: M0-05..07, M2-01..06, M4-01..08, M5-01..07, M6-06..07, M7-05..08, BE-001..006, QA-001..005, CONTENT-005

## Scope và file claim

- Làm trước phần có thể kiểm chứng độc lập: env/secret boundary, domain v2 tách legacy, content/story validators, service contracts, mock adapters, unit tests và security/QA checklist.
- File claims: `.env.example`, `.gitignore` (chỉ exception env example), `src/services/next/`, `src/types/v2/`, `tests/member5/`, `scripts/member5/`, `docs/tasks/active/BEQA-LOCAL-001*.md`, `active.md` và ghi chú board. Không claim `package.json`, lockfile, `App.tsx`, `src/types/index.ts`, `src/features/`, migration ordering hoặc UI.
- Nếu tạo SQL nháp, không apply database; chỉ được ghi rõ là chưa chạy RLS/integration tests.
- Không lấy demo Genève làm nội dung phát hành; không publish seed, không tự rotate key. Bản chuẩn bị đã được push lên nhánh bàn giao theo yêu cầu sau đó của Vinh, chưa vào `main`.

## Acceptance cho phần local

- [x] Ranh giới client/server env có ví dụ và kiểm tra không in giá trị secret (scan tĩnh local, chưa có production bundle).
- [x] Domain v2 và validator phát hiện ID/link/order/choice sai; test không cần mạng.
- [x] Service interface và mock adapter tách khỏi UI/legacy; contract test chạy cục bộ.
- [x] Có [security/QA matrix](../active/BEQA-LOCAL-001-MATRIX.md) cho các phần cần kiểm khi người khác bàn giao.
- [x] Ghi rõ phần nào chưa thể hoàn tất trước khi có frontend/content/Supabase và review.

## Verification và progress

- Commands: `npm exec -- tsc --noEmit`; `npm run build`; `node scripts/member5/check-local.mjs` (scanner + unit/contract tests); `git diff --check`.
- Dependency được cài bằng `npm ci --offline` sau khi nhận nhánh Hưng; không sửa `package.json`/lockfile.

| Date | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|
| 2026-09-24 | Claim khu vực độc lập; xác nhận Hưng giữ frontend/package hotspot | `git status`, repo inventory, Phase 5–9 | Triển khai M0-06 phần local rồi domain/validator | Package chưa cài; M0-02 và các gate chính thức chưa đạt |
| 2026-09-24 | Env example, public config guard, scanner, domain v2, validators, mock service contracts, pure reward policy, 11 tests và ma trận QA/security | `node scripts/member5/check-local.mjs`: 11/11 pass, 0 unsafe matches trên 69 source files; `git diff --check` pass | Vinh review bản local; sau khi Hưng/Dương/Thọ/Trúc bàn giao, tích hợp theo ma trận | Chưa có dependency package/TypeScript baseline, Supabase CLI/project, UI/content canonical; không thể nghiệm thu E2E/RLS/release |
| 2026-09-26 | Nhận nhánh Hưng M0-03/M0-04 vào local, cài dependency từ cache và chạy kiểm tra tích hợp local | `npm ci --offline` pass; build pass; 11/11 test pass; scanner 0 unsafe matches trên 73 source/bundle files; `git diff --check` pass | Sửa type narrowing tại `src/services/next/validation.ts:36`, chạy lại typecheck/build/test rồi chuyển REVIEW | `npm exec -- tsc --noEmit` fail TS2339 tại validator local; M0 task chính thức vẫn blocked và chưa có RLS/E2E |
| 2026-09-26 | Sửa type narrowing cho bốn loại reference của lesson block; thêm test cho text/recap/story/video/quiz và lookup sai | `npm exec -- tsc --noEmit` pass; `npm run build` pass; 12/12 test pass; scan 73 source/bundle files, 0 unsafe matches; `git diff --check` pass | Vinh review bản local; chưa mở M0-05/06/07 | Chưa có RLS/E2E; build còn cảnh báo Vite config tương lai |
| 2026-09-26 | Vinh review và chấp nhận BEQA-LOCAL-001 | Xác nhận trực tiếp của Vinh trong chat: “Anh đã review và chấp nhận BEQA-LOCAL-001” | Dừng tại bàn giao; đối chiếu dependency M0 trước khi mở task chính thức | Chấp nhận này chỉ áp dụng bản local, không duyệt M0-00 hay gate M0 |

## Handoff

- Files changed: `.gitignore`, `.env.example`, `active.md`, task board/card/matrix, `src/types/v2/`, `src/services/next/`, `scripts/member5/`, `tests/member5/`.
- Test/build: `npm exec -- tsc --noEmit` pass; `npm run build` pass; 12/12 local tests pass; scanner 0 unsafe matches trên 73 source/bundle files; `git diff --check` pass. Chưa chạy RLS/E2E.
- Env/migration impact: chỉ thêm example rỗng và public config guard; không đọc secret, không có migration hay DB change.
- Known issues: build còn cảnh báo Vite config tương thích với config loader tương lai; không đánh dấu các task chính thức `DONE` hay release pass khi thiếu reviewer, Supabase và content/feature đầu vào. Scanner tĩnh không thay thế việc rotate credential cũ.
- Next action: Bản chuẩn bị đã được Vinh chấp nhận; phần M0-05/06/07 được nghiệm thu riêng và chờ review PR tích hợp. Sau khi có Supabase/auth, triển khai + kiểm thử migrations/RLS/trusted operations theo task chính thức; sau khi có nội dung/feature, chạy QA/release matrix.
