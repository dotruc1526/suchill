# PVP public trial — 2026-10-03 (Asia/Saigon)

User cho phép hoàn tất bản thử online, giữ yêu cầu xác nhận trước mọi merge/tác động dự án chính. Không merge PR109/PR115/PR120/main; không deploy Firebase hoặc chỉnh Auth/database. Branch `codex/dautri-public-trial` dựa trên PvP `d48769a`, giữ nhánh PR115 có thay đổi AI/luyện tập của task khác.

## Triển khai thực

- Public URL: https://suchill-dautri-pvp-p3vm.onrender.com
- Render service `srv-db03o1u0tbcc7382et1g`, Free/Singapore/Docker, blueprint `exs-db03nte0tbcc7382ecug`.
- Live deploy `dep-db03rrm0tbcc7382r2o0`, commit `4dd1d26b56903d56dcbc2963e98b69875a88b671`; Render build/deploy thành công 49.2s.
- Frontend + backend cùng origin HTTPS, Dockerfile.pvp-trial/context root. SESSION_SECRET giữ tại Render; browser không có Supabase config hoặc privileged keys. UI khách nhập tên, không cần tài khoản học tập.
- Blueprint/service chuyển từ nhánh tích hợp cũ sang trial riêng bằng UI Render đã đăng nhập. Không thay service dự án chính. Runtime auto deploy off theo blueprint.

## Kiểm chứng

| Check | Result |
|---|---|
| Typecheck + standalone Vite build | PASS; 64 modules, JS 294.01 kB raw/91.40 kB gzip; không lấy learning/reference media |
| Backend | 19/19 PASS; gồm origin Render, hai client thật, queue ngẫu nhiên, no bot, polling fallback, reconnect, locks/deadline, standings |
| Canonical browser PvP | 4/4 PASS sau thêm serverOrigin tùy chọn; không đổi account/reward contracts |
| Built standalone browser | 2/2 PASS: Express phục vụ asset/health, origin-deny, không account config; hai trang nhập tên và hoàn tất trận thật, 375px không overflow |
| Public smoke-online | PASS trên URL HTTPS: health/origin/twoClients/sameQuestion/forfeit, rewardsPersisted false |
| Public Chrome smoke | PASS hai trang Internet: nhập tên, room code, cùng câu, bỏ cuộc/kết quả, rematch/cancel. Screenshot output/pvp-public-375.png |
| Source/tracked/bundle scanner | 0 unsafe matches (759 files gồm evidence-only update) |
| Docker runtime | PASS thực tế trên Render; máy local không có Docker CLI |
| Physical Wi-Fi ↔ 4G | Chưa chạy trên hai thiết bị thật; user nghiệm thu tiếp, không suy từ hai trang cùng máy |

Public probe tạo phiên QA khách và kết quả trial, không ghi tài khoản/XP/rank production. Chrome screenshot timeout khi chạy combined ban đầu được sửa bằng Page.bringToFront; standalone browser rerun và public browser PASS.

## Cách chơi và giới hạn

Hai người mở cùng public URL, nhập tên riêng → VÀO TRƯỜNG ĐẤU → TÌM ĐỐI THỦ ONLINE; hoặc A tạo phòng và B nhập mã. Dashboard Render có thể đóng, không phải client trò chơi. Chưa có người tìm trận thì chờ, không bot.

Free có thể ngủ khi idle, lần mở đầu chờ khởi động. Trận/thống kê/hạng RAM có thể mất khi restart; phiên khách chưa liên kết account. Bộ 10 câu prototype chưa nghiệm thu lịch sử; đây là trial, không phải release sản phẩm chính. PR120 giữ draft/REVIEW, không DONE khi physical-network acceptance chưa đạt.
