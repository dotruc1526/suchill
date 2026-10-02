# Member 5 — ma trận ráp và nghiệm thu (bản local)

> Chủ sở hữu: Vinh. Đây là checklist chuẩn bị, **không phải báo cáo pass** cho milestone sau M0. Nhánh bàn giao M0 đã được push và CI đạt; không deploy/apply migration khi chưa kiểm tra tích hợp.

| Giai đoạn | Phần Vinh chuẩn bị được độc lập | Bằng chứng đang có | Cần người khác bàn giao trước khi nghiệm thu |
|---|---|---|---|
| M0 | Public env boundary, scan source/bundle, unit runner không dependency | `node scripts/member5/check-client-env.mjs`; `npm run quality` | Baseline TypeScript/build đã đạt; Product owner xác nhận kế hoạch rotation, còn rotation thực tế trước M4 |
| M1 | Checklist component states, bàn phím, focus, tiếng Việt dài | Chưa có UI để test | Trúc/Hưng bàn giao tokens/primitives/showcase |
| M2 | Domain v2, story/lesson/media validators, service contract + mock | Unit/contract tests local | Integration owner/Hưng/Dương thống nhất export từ `src/types/index.ts` và wiring UI |
| M3 | Ma trận start/resume/retry/error/offline/a11y | Chưa có feature v2 | Dương bàn giao M3-01..06; chạy interaction/component/E2E |
| M4 | RLS/grant/security design theo Phase 6; không đưa secret vào browser | Chỉ có scan tĩnh, chưa có database | Supabase project/local CLI, rotated key, migrations đã review, Auth/storage; chạy anon/A/B/trusted matrix |
| M5 | Pure reward/video/streak policy helpers; không trao XP ở client | Unit tests local | Trusted transaction/RPC và dữ liệu authoritative; race/replay/multi-device test |
| M6 | Accessibility/PWA/device test cases | Chưa có PWA | Hưng/Dương/Trúc bàn giao PWA, media và UI polish; test thiết bị thật |
| M7 | Seed/import và release verification checklist | Không có seed canonical | Thọ/Trúc/historical reviewer bàn giao chapter, kịch bản, video, nguồn/license và sign-off; sau đó import version, regression/security/content QA |

## Ma trận security phải chạy khi có Supabase

| Vai trò | Published content | Draft/answer key | Own progress | Other-user progress | Reward write |
|---|---|---|---|---|---|
| anon | SELECT | DENY | DENY | DENY | DENY |
| user A | SELECT | DENY | SELECT + checkpoint hợp lệ | DENY read/write | DENY direct write |
| user B | SELECT | DENY | SELECT + checkpoint hợp lệ | DENY read/write | DENY direct write |
| trusted operation | Có kiểm soát | Theo workflow | Validate + transaction | Chỉ phạm vi audit | Idempotent ledger |

Với mỗi bảng/view exposed: kiểm tra **cả GRANT lẫn RLS**; policy một mình không thu hồi quyền đã grant. Mọi `security definer` phải có `search_path` cố định và không đặt bừa trong exposed schema. Xem [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) và [database functions](https://supabase.com/docs/guides/database/functions). Storage upload cần policy riêng; xem [Storage access control](https://supabase.com/docs/guides/storage/security/access-control).

## Rotation checklist trước M4 production integration

1. Product owner/người giữ quyền Supabase xác định credential đặc quyền đã từng chia sẻ; không chép giá trị vào chat/task/repo.
2. Tạo credential thay thế ở trusted environment; thay cấu hình server/CI bằng secret store, không đặt `VITE_`/`NEXT_PUBLIC_`.
3. Vô hiệu hóa credential cũ và xác nhận hoạt động server mới; ghi **thời điểm/owner/kết quả**, không ghi key.
4. Build production và chạy scanner; đối chiếu Git tracked files và bundle; scan tĩnh không thay thế việc rotate.
5. Chỉ sau đó mới chạy M4 integration/RLS tests. Nếu chưa rotate, M4 gate vẫn fail.

## Release blockers không thể tự bỏ qua

- Không có published immutable content version, source/historical/media approval hoặc video caption/transcript/fallback.
- Không có test A/B cross-user, draft/answer-key isolation, reward replay/race, storage policy.
- Typecheck/build/feature E2E/PWA/device/accessibility chưa pass trên bản tích hợp.
- Không có quyền quyết định chapter/pilot, rotation hoặc phát hành của Product owner.
