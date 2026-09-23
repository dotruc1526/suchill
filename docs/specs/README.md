# Sử Chill — App Specification Phases

Các phase trong thư mục này áp dụng cho **toàn bộ ứng dụng**, không chỉ Visual Novel. Visual Novel là feature trọng tâm được dùng để kiểm tra nhiều quyết định UX/content, nhưng database, service, progress, QA và roadmap là cấu trúc chung của Sử Chill.

> Delivery mode: Phase 0–9 `APPROVED`; Milestone 0 mở từ 2026-09-23. Task implementation theo dependency và milestone gate.

## Trạng thái

| Phase | Duyệt nhanh | Full spec | Trạng thái |
|---|---|---|---|
| 0 — Repository & Context Audit | [Bản dễ hiểu](./approval-briefs/00-repository-audit-brief.md) | [Bản chi tiết](./phases/00-repository-context-audit.md) | APPROVED |
| 1 — Product & Learning Experience | [Bản dễ hiểu](./approval-briefs/01-product-learning-brief.md) | [Bản chi tiết](./phases/01-product-learning-experience-spec.md) | APPROVED |
| 2 — Content & Story Authoring | [Bản dễ hiểu](./approval-briefs/02-content-authoring-brief.md) | [Bản chi tiết](./phases/02-content-story-authoring-model.md) | APPROVED |
| 3 — Historical Accuracy & Media | [Bản dễ hiểu](./approval-briefs/03-historical-media-brief.md) | [Bản chi tiết](./phases/03-historical-media-governance.md) | APPROVED |
| 4 — UX Flow & Player State | [Bản dễ hiểu](./approval-briefs/04-player-ux-brief.md) | [Bản chi tiết](./phases/04-player-state-spec.md) | APPROVED |
| 5 — Domain Model & Types | [Bản dễ hiểu](./approval-briefs/05-domain-type-brief.md) | [Bản chi tiết](./phases/05-domain-type-contract.md) | APPROVED |
| 6 — Database & Services | [Bản dễ hiểu](./approval-briefs/06-database-service-brief.md) | [Bản chi tiết](./phases/06-database-service-spec.md) | APPROVED |
| 7 — Progress, XP & Analytics | [Bản dễ hiểu](./approval-briefs/07-progress-reward-brief.md) | [Bản chi tiết](./phases/07-progress-reward-analytics-spec.md) | APPROVED |
| 8 — QA, Accessibility & Content Review | [Bản dễ hiểu](./approval-briefs/08-qa-accessibility-brief.md) | [Bản chi tiết](./phases/08-qa-accessibility-release-spec.md) | APPROVED |
| 9 — Implementation Roadmap | [Bản dễ hiểu](./approval-briefs/09-implementation-roadmap-brief.md) | [Bản chi tiết](./phases/09-implementation-roadmap.md) | APPROVED — 2026-09-23 |

Mỗi phase có hai lớp:

- `approval-briefs`: giải thích đời thường để product owner duyệt.
- `phases`: contract chi tiết để designer/frontend/backend/content/QA triển khai.

Các quyết định riêng của feature được tổng hợp trong [features](../features/); không đặt toàn bộ phase dưới một feature nữa.

## Cách duyệt

Đọc approval brief của phase hiện tại rồi phản hồi:

```text
Duyệt Phase X theo đề xuất.
```

Hoặc ghi rõ điểm cần sửa. Phase tiếp theo chỉ bắt đầu khi phase hiện tại được duyệt.

## Template

Dùng [phase-template.md](./phase-template.md) cho phase tiếp theo.
