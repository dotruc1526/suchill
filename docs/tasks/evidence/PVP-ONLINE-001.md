# PVP-ONLINE-001 — Evidence và bàn giao

Ngày: 2026-10-03 Asia/Saigon. Branch: `codex/dautri-online-pr109`.
Base: PR109 `85e4f3cb713186360a2ef03ed766a0297248d4cb`, chưa merge PR109 hoặc nhánh này.
Mã prototype lấy từ workspace người dùng; giữ engine/questions hiện có, không chép App/auth cũ.

## Phần đã làm

- Tab ĐẤU TRÍ canonical, lazy feature (~54.6 kB raw / 17.6 kB gzip); App 114 dòng. Tokens/primitives và guard rời queue/trận.
- Queue chung phục vụ người chờ lâu nhất với một đối thủ ngẫu nhiên mỗi 250ms; ghép người thật qua backend trung tâm, không cần chung mạng. Không bot/EXP giả.
- Engine server-authoritative: câu hỏi/đáp án/điểm/deadline/khóa một lần/reconnect/grace/result replay. Phòng bạn bè có sẵn được giữ.
- Guest credential theo account/session scope, độc lập Socket.IO manager; đổi tài khoản remount, không dùng lại identity cũ. Account không nhận authoritative reward.
- URL config từ chối downgrade HTTPS, callback/path/userinfo; không tự nối localhost từ máy public/LAN.
- Dockerfile Node24, healthcheck, mẫu env, hướng dẫn proxy/CORS/single instance và probe `server/scripts/smoke-online.js`.
- Root CI cài server dependencies, Quality bao gồm PvP backend/UI. Dependency backend pin và bỏ uuid để dùng node:crypto.
- BATTLE-001/002 cũ CANCELLED và archived theo PO; scope mới độc lập theo PVP-ONLINE-001.

## Kiểm chứng

| Check | Kết quả |
|---|---|
| Full npm run quality | PASS: typecheck/build, unit/component/SQL/authoring/Chrome/PWA/PvP, cuối cùng secret scan 0 unsafe. Ba test native PostgreSQL được SKIP theo harness có sẵn; không claim DB live. |
| npm --prefix server ci | PASS với manifest/lockfile đã chốt; kiểm chứng cài sạch, không dựa trên node_modules cũ |
| Backend tests | 16/16 PASS: hai client thật, sáu client/ba trận, no bot, polling-only, reconnect, giả mạo, expired ready, 10 câu/combo, deployment probe |
| Browser PvP | 2/2 PASS: hai trang Chrome app thật cùng câu/kết quả, lazy-load, từ chối rời queue, XP/storage giữ nguyên, 375/430/landscape; A→B→A dùng ba identity riêng và không giữ queue cũ |
| URL config | 3/3 PASS: public HTTPS, từ chối đường dẫn/credential/callback/downgrade, localhost fallback chỉ loopback |
| Final typecheck/build | PASS sau bổ sung URL config; dùng asset Git LFS thật |
| Dependency audit backend | 0 vulnerabilities ở cài sạch và audit production |
| Docs checker | Còn 1 finding có sẵn trong PR109: HOSTING-PREVIEW-001 ghi DONE nhưng ở active/. Card/bytes khớp base; không phải regression PvP; checker không báo link hỏng mới. |
| Docker runtime | Chưa chạy: máy không có docker CLI; cấu hình/probe được chuẩn bị, probe đã exercise trên server Node thật |
| Wi-Fi ↔ 4G / backend public | Chưa chạy: người dùng chưa có hosting |

Full Quality được chạy trước phần tách URL config và test account-switch cuối; sau thay đổi đó đã chạy lại typecheck/build, URL tests, browser PvP và secret scan. Không sửa learning/database source/migrations hoặc dữ liệu tài khoản. SQL checks dùng harness local có sẵn.

## Bước tiếp theo

1. Reviewer kiểm tra bản local; refresh/rebase với PR109/main mới nhất trước khi merge.
2. Chọn hosting Node/container hỗ trợ HTTP polling/WebSocket và HTTPS, một instance. Điền env private trên hosting; health `/health`.
3. Build frontend với VITE_GAME_SERVER_URL public, allow đúng frontend/preview origin.
4. Chạy deployment probe rồi nghiệm thu hai thiết bị A Wi-Fi, B 4G, reconnect/forfeit/play-again.
5. Nếu cần ranked/XP thật: mở task identity bridge, result persistence/idempotent settlement và historical question review riêng.

Đây là software REVIEW candidate có gói deploy; không phải production release hoặc Internet acceptance. Trạng thái trận còn RAM, restart mất trận và chưa hỗ trợ nhiều instance.
