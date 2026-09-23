# Sử Chill — Các phase có nghĩa là gì?

> Mục đích: giúp cả nhóm hiểu vì sao cần từng phase và sản phẩm cụ thể của phase đó là gì.

## Tóm tắt dễ hiểu

Các phase không phải là chín phiên bản của app. Chúng là chín bước ra quyết định trước khi và trong khi triển khai Visual Novel.

Mỗi phase có hai tài liệu:

- **Approval brief:** bản ngắn, dễ hiểu, có ví dụ; product owner dùng để duyệt.
- **Full spec:** bản chi tiết; frontend, backend, content và QA dùng để triển khai.

Product owner chỉ cần đọc approval brief. Full spec là tài liệu tham khảo khi muốn kiểm tra sâu.

```text
Phase 0–3: Quyết định xây cái gì và nội dung phải đúng ra sao
Phase 4–6: Quyết định trải nghiệm, data contract và backend vận hành thế nào
Phase 7–8: Quyết định progress, XP, analytics và cách kiểm thử
Phase 9: Chuyển mọi quyết định thành sprint/task để code và release
```

Mục đích của thứ tự này là tránh tình trạng frontend tạo một schema, backend tạo schema khác, content writer viết story không chạy được và QA chỉ phát hiện vấn đề sau khi đã code xong.

## Ý nghĩa từng phase

| Phase | Câu hỏi phase trả lời | Output dùng để làm gì | Ai nên duyệt |
|---|---|---|---|
| 0 — Repository Audit | Project hiện có gì, lỗi gì, code nào đang chạy? | Tạo baseline và tránh thiết kế dựa trên giả định sai | Tech lead |
| 1 — Product & Learning | Visual Novel tồn tại để dạy gì và người học hoàn thành thế nào? | Chốt mục tiêu, learning loop và requirements | Product + learning lead |
| 2 — Content Authoring | Writer phải viết story, scene và choice theo format nào? | Tạo template và quy tắc để content có thể đưa vào hệ thống | Content lead + learning lead |
| 3 — Historical & Media | Fact, ảnh và nguồn được kiểm chứng, gắn nhãn ra sao? | Ngăn bịa sử, sai nguồn và nhầm hư cấu với sự thật | Historical reviewer |
| 4 — UX & Player State | Khi start, chọn, sai, retry, resume hoặc mất mạng thì UI làm gì? | Frontend dùng để xây state machine và màn hình | Product + frontend + QA |
| 5 — Domain & Types | Dữ liệu story/progress có field nào, required hay optional? | Frontend và backend dùng chung một contract | Frontend + backend lead |
| 6 — Database & Services | Supabase có bảng, quan hệ, RLS và service API thế nào? | Backend tạo migration; frontend gọi qua service | Backend + security reviewer |
| 7 — Progress, XP & Analytics | Khi nào cộng XP, lưu attempt, chống cộng lặp và đo event gì? | Xây progress/reward/analytics chính xác | Product + backend + data |
| 8 — QA & Accessibility | Phải test gì trước khi release? | Tạo test matrix, content checklist và release gate | QA + accessibility + content |
| 9 — Implementation Roadmap | Ai code việc gì, theo sprint nào, dependency ra sao? | Backlog cuối cùng để team triển khai | Toàn nhóm |

## Vì sao chưa nhảy thẳng đến database?

Database phụ thuộc vào các quyết định chưa được chốt:

- Một episode gồm loại scene nào.
- Choice có bao nhiêu loại.
- Branching trỏ tới scene ra sao.
- Completion được tính khi nào.
- Có lưu narrative choice không.
- Story cần version và publishing workflow thế nào.

Nếu tạo database trước Phase 5, nhóm có nguy cơ phải đổi table và migration nhiều lần khi content/UX contract thay đổi.

## Phase khác với kế hoạch build như thế nào?

- **Phase docs** trả lời: hệ thống đúng phải hoạt động như thế nào.
- **App plan** trả lời: frontend/backend/content/QA sẽ triển khai theo thứ tự nào.
- **Sprint backlog ở Phase 9** trả lời: task cụ thể giao cho ai, estimate bao nhiêu và kiểm thử thế nào.

Kế hoạch build khung hiện nằm tại [APP-PLAN.md](./APP-PLAN.md). Nó có thể dùng ngay để cả nhóm hiểu hướng đi, nhưng task chi tiết vẫn được cập nhật khi các contract quan trọng được duyệt.

## Người duyệt cần làm gì sau mỗi phase?

Chỉ cần thực hiện một trong hai lựa chọn:

### Duyệt

```text
Duyệt Phase X theo đề xuất, làm Phase X+1.
```

### Yêu cầu sửa

```text
Phase X chưa duyệt.
- Sửa mục ... thành ...
- Cần giải thích thêm ...
```

Người duyệt không cần tự viết code hoặc tự hoàn thành các mục “chưa làm”. Các mục đó chỉ cho biết phần nào thuộc phase tiếp theo.

## Trạng thái hiện tại

- Phase 0: `APPROVED`.
- Phase 1: `APPROVED`.
- Phase 2: `APPROVED`.
- Phase 3: `APPROVED`.
- Phase 4: `APPROVED`.
- Phase 5: `APPROVED`.
- Phase 6: `APPROVED`.
- Phase 7: `APPROVED`.
- Phase 8: `APPROVED`.
- Phase 9: `APPROVED` ngày 2026-09-23.
- Delivery mode: Milestone 0 đã mở; M1–M7 chỉ mở lần lượt sau khi Product owner duyệt gate milestone trước trên task board.
- Code implementation: task phải có card, owner/reviewer, dependency và file claim trước khi sửa.
- Codex giữ vai trò integration owner xuyên suốt implementation.
- Master build plan: đã có bản `DRAFT` để nhóm định hướng frontend/backend.

## Có bắt buộc duyệt hết mới sửa code không?

Về kỹ thuật thì không bắt buộc; một project có thể vừa thiết kế vừa code. Tuy nhiên Sử Chill đã chọn workflow thận trọng hơn:

```text
Duyệt Phase 0–9
→ Khóa roadmap và contracts
→ Triển khai theo milestone
→ Verify từng milestone
→ Release
```

Lợi ích là giảm rework và conflict giữa content, frontend, backend và database. Đổi lại, thời điểm bắt đầu implementation sẽ muộn hơn. Product owner luôn có thể phá freeze bằng một yêu cầu rõ ràng cho task cụ thể, nhưng việc duyệt một phase tự nó không được hiểu là cho phép sửa code.
