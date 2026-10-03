# PVP-ONLINE-001 — Evidence và bàn giao

Ngày: 2026-10-03 Asia/Saigon. Branch: `codex/dautri-online-pr109`.
Base mới nhất: PR109 `3e14b772431164ecda54cd3c7c09de6232d02fe8`, chưa merge PR109 hoặc nhánh này. Full Quality đạt trên `51a7eed`; cập nhật `3e14b77` chỉ đổi tài liệu/content registers, không đổi runtime/package. Sau rebase đã chạy lại typecheck và 11 deployment/config/readiness tests: PASS.
Mã prototype lấy từ workspace người dùng; giữ engine/questions hiện có, không chép App/auth cũ.

## Phần đã làm

- Tab ĐẤU TRÍ canonical, lazy feature (~54.6 kB raw / 17.6 kB gzip); App 114 dòng. Tokens/primitives và guard rời queue/trận.
- Queue chung phục vụ người chờ lâu nhất với một đối thủ ngẫu nhiên mỗi 250ms; ghép người thật qua backend trung tâm, không cần chung mạng. Không bot/EXP giả.
- Engine server-authoritative: câu hỏi/đáp án/điểm/deadline/khóa một lần/reconnect/grace/result replay. Phòng bạn bè có sẵn được giữ.
- Guest credential theo account/session scope, độc lập Socket.IO manager; đổi tài khoản remount, không dùng lại identity cũ. Account không nhận authoritative reward.
- URL config từ chối downgrade HTTPS, callback/path/userinfo; không tự nối localhost từ máy public/LAN.
- Dockerfile Node24, healthcheck, mẫu env, hướng dẫn proxy/CORS/single instance và probe `server/scripts/smoke-online.js`.
- Blueprint Render Free/Singapore, secret sinh riêng, auto deploy tắt; [hướng dẫn bật backend](../../../server/RENDER-SETUP.md). Chưa tạo tài nguyên hosting.
- Client chờ health tối đa 90s khi hosting ngủ, báo trạng thái và hủy khi rời màn hình/đổi tài khoản.
- Sửa build Firebase preview nhận VITE_GAME_SERVER_URL có kiểm tra HTTPS; trước đó PR109 bỏ qua biến này.
- Root CI cài server dependencies, Quality bao gồm PvP backend/UI. Dependency backend pin và bỏ uuid để dùng node:crypto.
- BATTLE-001/002 cũ CANCELLED và archived theo PO; scope mới độc lập theo PVP-ONLINE-001.

## Kiểm chứng

| Check | Kết quả |
|---|---|
| Full npm run quality | PASS: typecheck/build, unit/component/SQL/authoring/Chrome/PWA/PvP, cuối cùng secret scan 0 unsafe. Ba test native PostgreSQL được SKIP theo harness có sẵn; không claim DB live. |
| npm --prefix server ci | PASS với manifest/lockfile đã chốt; kiểm chứng cài sạch, không dựa trên node_modules cũ |
| Backend tests | 18/18 PASS: hai client thật, sáu client/ba trận, no bot, polling-only, reconnect, giả mạo, expired ready, 10 câu/combo, deployment probe; standings chỉ tính kết quả server, idempotent, không nhận RP client |
| Browser PvP | 4/4 PASS: hai trang Chrome app thật cùng câu/kết quả, lazy-load, từ chối rời queue, XP/storage giữ nguyên, 375/430/landscape; A→B→A tách identity; luật/modal, bảng hạng/Tìm tôi, phòng bạn bè, mã lỗi, bỏ cuộc/ở lại, chơi lại/hủy queue, chờ/cancel backend |
| URL config | 3/3 PASS: public HTTPS, từ chối đường dẫn/credential/callback/downgrade, localhost fallback chỉ loopback |
| Final typecheck/build | PASS sau bổ sung URL config; dùng asset Git LFS thật |
| Dependency audit backend | 0 vulnerabilities ở cài sạch và audit production |
| Deployment/cold-start tests | 8/8 PASS: endpoint đi vào public config, từ chối URL không an toàn, retry health, abort và timeout |
| Docs checker | Còn 1 finding có sẵn trong PR109: M7-02 có card REVIEW trong content/. Không phải regression PvP; checker không báo link hỏng mới. |
| Docker runtime | Chưa chạy: máy không có docker CLI; cấu hình/probe được chuẩn bị, probe đã exercise trên server Node thật |
| Wi-Fi ↔ 4G / backend public | Chưa chạy: người dùng đã có tài khoản Render và xác minh email; phiên browser bị mất sau gián đoạn, chờ đăng nhập lại. Chưa có backend public URL. |

Full Quality đã chạy lại sau khôi phục UI và thêm standings: PASS; 747 source/tracked/bundle files, 0 unsafe matches. Sau thu gọn khoảng cách mobile đã chạy lại typecheck/build/browser PvP/secret scan. SQL checks dùng harness local có sẵn, không sửa migration hoặc dữ liệu tài khoản.

## Hoàn thiện thao tác và bố cục prototype

- Khôi phục tiêu đề Trường đấu sử học, thẻ hạng/progress/thống kê, luật modal, tìm trận, màn VS, timer/combo/EXP trận và kết quả. Giữ tokens và component/service của app canonical.
- Nút tìm trận/tạo phòng/vào phòng không còn bị khóa vĩnh viễn khi offline: lưu yêu cầu rồi nối máy chủ; có hủy kết nối, timeout và lỗi thật. Hủy không được tự ghép sau khi máy chủ thức.
- Bảng hạng cũ sinh người chơi giả không được chép. `trialStandings.js` tính RP và thống kê từ kết quả server, có giới hạn/TTL; chỉ phiên khách thử nghiệm, không cấp rank hoặc reward tài khoản.
- `node scripts/dev-pvp.mjs` mở frontend + backend local riêng ở port 8450, cache riêng để không ảnh hưởng Vite hiện có. Hai tab có thể ghép trận thật; URL local không phải Internet.
- Người dùng yêu cầu xác nhận trước mọi merge/gộp main hoặc thay đổi dự án chính. Không merge PR109/PR115, không ghi source checkout chính, không tự deploy Firebase site/preview hiện có hoặc đổi database/Auth. Backend thử nghiệm độc lập chỉ dùng nhánh PvP.

## Bước tiếp theo

1. Reviewer kiểm tra bản local; refresh/rebase với PR109/main mới nhất trước khi merge.
2. Dùng blueprint Render trong runbook hoặc hosting Node/container hỗ trợ HTTP polling/WebSocket và HTTPS, một instance. Điền env private trên hosting; health `/health`.
3. Build frontend với VITE_GAME_SERVER_URL public, allow đúng frontend/preview origin.
4. Chạy deployment probe rồi nghiệm thu hai thiết bị A Wi-Fi, B 4G, reconnect/forfeit/play-again.
5. Nếu cần ranked/XP thật: mở task identity bridge, result persistence/idempotent settlement và historical question review riêng.

Đây là software REVIEW candidate có gói deploy; không phải production release hoặc Internet acceptance. Trạng thái trận còn RAM, restart mất trận và chưa hỗ trợ nhiều instance.
