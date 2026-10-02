# Sử Chill Documentation

Đây là điểm vào chung cho product owner, designer, frontend, backend, content, QA và AI. Sử Chill tập trung vào giai đoạn kháng chiến chống Mỹ ở Việt Nam; curriculum có nhiều chapter/lesson, còn MVP đầu tiên dùng một chapter mẫu gồm nhiều lesson.

## Nên đọc gì trước?

1. [Kế hoạch tổng thể](./project/APP-PLAN.md) — app cần xây gì và frontend/backend phối hợp ra sao.
2. [Task board](./project/TASK-BOARD.md) — việc cần làm, trạng thái, owner và dependency.
3. [Team ownership](./project/TEAM-OWNERSHIP.md) — năm lane, ranh giới file và reviewer.
4. [Task cards](./tasks/README.md) — tiến độ chi tiết, evidence và handoff của người/AI.
5. [Giải thích Phase 0–9](./project/PHASE-GUIDE.md) — mỗi phase dùng để quyết định điều gì.
6. [Kiến trúc canonical](../ARCHITECTURE.md) — frontend/backend/data phải nối với nhau thế nào.
7. [Chỉ mục specs](./specs/README.md) — approval brief và full spec của từng phase.
8. [Phase 9 bản dễ hiểu](./specs/approval-briefs/09-implementation-roadmap-brief.md) — roadmap đã duyệt; M0–M2 đã đóng và Milestone 3 đang mở.

## Cấu trúc thư mục

```text
docs/
├── README.md
├── project/                 # Kế hoạch, phase guide và task board
├── tasks/                   # Task card active/blocked/done và evidence
├── specs/                   # Phase 0–9 dùng chung cho toàn app
│   ├── approval-briefs/     # Bản ngắn để product owner duyệt
│   └── phases/              # Bản chi tiết cho team triển khai
├── features/                # Tài liệu riêng của từng tính năng
│   ├── visual-novel/
│   └── ai-battle/
├── engineering/             # Quy tắc UI, component, function, hiệu năng
└── platform/                # PWA và kế hoạch phát hành app
```

## Ý nghĩa từng nhóm

- `project`: nhóm đang làm gì, theo thứ tự nào và ai phụ trách.
- `tasks`: hồ sơ tiến độ chi tiết để người/AI claim, checkpoint, review và handoff.
- `specs`: quyết định chung về sản phẩm, nội dung, UX, dữ liệu, backend và QA.
- `features`: yêu cầu riêng của Visual Novel, AI Battle và các feature sau này.
- `engineering`: tiêu chuẩn code và giao diện bắt buộc.
- `platform`: cách chạy Sử Chill dưới dạng web/PWA/mobile.

## Tài liệu theo chủ đề

- [Visual Novel](./features/visual-novel/README.md)
- [AI Battle](./features/ai-battle/README.md)
- [UI/UX và reusable engineering](./engineering/UI-UX-ENGINEERING-GUIDE.md)
- [PWA và hướng phát hành](./platform/APP-DEPLOYMENT-PLAN.md)
- [M3–M5 isolated delivery và nghiệm thu](./tasks/active/M3-M5-DELIVERY.md)
- [Supabase local setup và giới hạn kiểm chứng](../supabase/README.md)

## Trạng thái tài liệu

- `DRAFT`: đang soạn.
- `IN REVIEW`: đã viết xong, đang chờ duyệt.
- `APPROVED`: đã duyệt, được dùng làm đầu vào cho phase sau.
- `SUPERSEDED`: đã được tài liệu mới thay thế.

Phase 0–9 đã được duyệt. `SPEC-FIRST FREEZE` đã kết thúc; M0–M2 đã đóng và Milestone 3 được Product Owner mở ngày 2026-10-01. Product Owner ủy quyền triển khai M3–M5 trên nhánh riêng ngày 2026-10-02; gate nghiệm thu vẫn cần evidence và reviewer. M6–M7 chưa được mở. Mỗi task vẫn cần dependency, owner/reviewer, task card và file claim.
