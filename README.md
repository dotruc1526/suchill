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
pnpm install
pnpm dev
```

Vite dev server có thể đã được môi trường Figma Make/Codex khởi động. Không đưa secret đặc quyền vào source hoặc biến môi trường client.

## Cách nhận việc

Chỉ cần nói tên hoặc vai trò của mình (ví dụ “tôi là Thọ” hoặc “tôi là Member 1”) để AI đọc board và tìm task `READY` phù hợp. Sau đó đọc task card, khai báo owner/files trước khi sửa và cập nhật checkpoint/evidence/handoff. Xem [hướng dẫn task chi tiết](docs/tasks/README.md).

Nội dung Visual Novel mới không được thêm theo cách copy trực tiếp demo cũ. Story phải đi qua screenplay, source/review, domain validator và version workflow đã duyệt trong `docs/specs/`.
