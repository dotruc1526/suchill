# Sử Chill

Ứng dụng mobile-first giúp học lịch sử giai đoạn kháng chiến chống Mỹ ở Việt Nam qua nhiều chapter và lesson: bài học ngắn, Visual Novel được biên kịch trước, video, quiz, tiến độ tài khoản, XP và streak. MVP đầu tiên triển khai một chapter mẫu gồm nhiều lesson đa định dạng.

## Trạng thái hiện tại

- Phase 0–8 đã duyệt.
- Phase 9 (roadmap triển khai) đã được product owner duyệt ngày 2026-09-23; Milestone 0 được mở.
- Implementation đi theo task card, dependency và gate của roadmap; các milestone sau M0 chưa tự động mở.
- Demo Genève/vĩ tuyến 17 hiện tại chỉ là fixture kỹ thuật, không phải pilot nội dung chính thức.
- PWA là mục tiêu phát hành đầu tiên; Capacitor được xem xét sau khi PWA ổn định.

## Bắt đầu đọc project

1. [Quy tắc cho thành viên và AI](AGENTS.md)
2. [Bản đồ tài liệu](docs/README.md)
3. [Task board](docs/project/TASK-BOARD.md)
4. [Kiến trúc canonical](ARCHITECTURE.md)
5. [Phase 9 bản dễ duyệt](docs/specs/approval-briefs/09-implementation-roadmap-brief.md)

## Chạy local

```bash
npm ci
npm run dev
```

Vite dev server có thể đã được môi trường Figma Make/Codex khởi động. Không đưa secret đặc quyền vào source hoặc biến môi trường client.

## Kiểm tra chất lượng (local/CI)

Sau `npm ci`, chạy `npm run quality` để kiểm tra TypeScript, tạo production build, quét source và bundle (bắt buộc có bundle), rồi chạy unit, component và E2E. Vì E2E build lại, lệnh quét bundle lần cuối sau test để kiểm tra đúng artifact cuối cùng; mỗi bước fail-fast. CI dùng đúng lệnh này. Không cần Supabase credential hoặc mạng ngoài trong lúc test; E2E dùng server loopback và Chrome/Chromium đã cài trên máy. Nếu trình duyệt không nằm trong đường mặc định, đặt `CHROME_PATH` trỏ tới executable trước khi chạy. CI workflow tự provision Chrome và truyền đường dẫn này.

Khi cần chạy riêng từng tầng: `npm run typecheck`, `npm run build`, `npm run test:unit`, `npm run test:component`, `npm run test:e2e`. Lưu exit code và số test pass/fail trong task card. E2E tự build trước khi chạy; cảnh báo Vite native config hiện không chặn build. `npm test` chạy cả ba tầng test, còn `npm run quality` thêm typecheck và secret scan.

## Cách nhận việc

Chỉ cần nói tên hoặc vai trò của mình (ví dụ “tôi là Thọ” hoặc “tôi là Member 1”) để AI đọc board và tìm task `READY` phù hợp. Sau đó đọc task card, khai báo owner/files trước khi sửa và cập nhật checkpoint/evidence/handoff. Xem [hướng dẫn task chi tiết](docs/tasks/README.md).

Nội dung Visual Novel mới không được thêm theo cách copy trực tiếp demo cũ. Story phải đi qua screenplay, source/review, domain validator và version workflow đã duyệt trong `docs/specs/`.
