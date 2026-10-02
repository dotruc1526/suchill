# PVP-ONLINE-001 — Đấu Trí online 1vs1 từ prototype có sẵn

> Status: IN PROGRESS

Started: 2026-10-03 (Asia/Saigon).
Owner: Product Owner / người dùng. Executor: Codex root.
Reviewer: Product Owner + frontend/backend/QA reviewer (chưa nghiệm thu).
Integration branch: codex/dautri-online-pr109 (PR115). Public trial branch: codex/dautri-public-trial, dựa trên PvP `d48769a`; tách khỏi các commit AI/luyện tập đồng thời trên integration branch. PR109 base `3e14b77` (2026-10-03).

## Quyết định scope và dependency

Người dùng xác nhận PO bỏ Đấu Trí cũ khỏi task và yêu cầu tính năng mới dựa trên prototype local: PvP hai người thật, khác Wi-Fi/mạng vẫn đấu được qua backend public, ghép đối thủ ngẫu nhiên. Quyết định này thay scope đấu AI và dependency handoff external BATTLE-001/002 cũ. Không phụ thuộc việc hoàn thành M6/M7 release để phát triển bản thử nghiệm.

Input: prototype local engine Socket.IO và feature UI có sẵn; review PR109 trước đó, nền canonical PR109 mới nhất. Các milestone/content/release gates của app vẫn độc lập.

## Files claimed

- `server/` engine, HTTP/session boundary, Docker/env/docs/tests.
- `src/features/dau-tri/`, `src/services/gameSocketService.ts`, `src/types/dauTri.ts`.
- Integration hotspots trong nhánh riêng: App, BottomNav, types index, package/lock, env example.
- New PvP docs/task/evidence. Không thay learning/auth/database contracts hoặc migration.
- Follow-up: root render.yaml, cold-start service/tests và scripts/release/build-hosting-preview.mjs/tests để URL backend đi vào bản Firebase thật.
- Follow-up theo người dùng: khôi phục bố cục prototype legacy, sửa nút khi offline, thử toàn bộ luồng phòng/queue/luật/bảng xếp hạng; triển khai Internet khi có tài khoản hosting.
- Online trial: frontend PvP riêng cùng origin/backend, Dockerfile.pvp-trial/vite.pvp.config.ts/index-pvp.html, service phiên khách và tests. Không đổi Firebase/main/Supabase.

## Acceptance

- [x] Đấu Trí có đường vào app canonical, lazy-load, tokens và UI primitives.
- [x] Hai client thật cùng trận; ghép queue không bot, chấm/khóa câu theo server.
- [x] Cancel/forfeit/reconnect/replay và account-switch không gắn nhầm state.
- [x] Update PWA chỉ cho Home an toàn; rời queue/trận có xác nhận.
- [x] HTTPS/WSS/CORS/env, Docker, single-instance deployment có cấu hình/runbook; chưa chạy container thực.
- [x] Typecheck/build/backend/frontend checks có [evidence](../evidence/PVP-ONLINE-001.md).
- [ ] Thiết bị A Wi-Fi và B 4G đấu qua backend public: chờ hosting/deploy/test thật.

## Handoff boundary

PvP thử nghiệm dùng phiên khách trên server; account chỉ cung cấp tên/scope hiển thị, không xác thực quyền bằng ID client. XP/xu/rank tài khoản chưa bật. Trạng thái RAM mất khi server restart; multi-instance chưa hỗ trợ. Ngân hàng câu server hiện có cần review lịch sử riêng trước release.

Next action: review bản tích hợp và chọn hosting để deploy backend, cấu hình frontend public URL, nghiệm thu Wi-Fi ↔ 4G. Người dùng đã chọn “Chưa có hosting — chuẩn bị bản deploy trước”. Không tự claim DONE/Internet PASS.

Follow-up: đã có tài khoản Render/xác minh email; cần đăng nhập lại sau browser interruption. Người dùng yêu cầu xác nhận trước mọi merge/gộp main hoặc thay đổi dự án chính. Scope hoàn thiện UI/standings/controls vẫn trên nhánh riêng PR115; chưa tự merge/deploy Firebase hoặc chỉnh DB/Auth. Acceptance code đạt; Internet acceptance chờ backend public.

2026-10-03: user đã đăng nhập Render trong Codex, cho phép hoàn tất bản thử online. Blueprint tạo service trial; đang chuyển sang gói frontend/backend cùng origin trên nhánh riêng. Built standalone QA 2/2 PASS, canonical PvP 4/4 PASS, backend 19/19 PASS (riêng lượt test combined lỗi screenshot đã sửa Page.bringToFront và built browser rerun PASS). Không merge, không thay Firebase/main/DB/Auth.
