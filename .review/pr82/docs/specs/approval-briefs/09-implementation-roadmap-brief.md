# Phase 9 — Sau khi duyệt, nhóm sẽ xây app theo thứ tự nào?

**Status:** APPROVED — product owner, 2026-09-23

## Phase 9 có ý nghĩa gì?

Đây là phase cuối của giai đoạn viết đặc tả. Phase 9 biến các quyết định Phase 0–8 thành thứ tự triển khai cụ thể.

Khi Phase 9 được duyệt:

```text
SPEC-FIRST FREEZE kết thúc
→ bắt đầu sửa code
→ triển khai theo từng milestone nhỏ
→ mỗi milestone phải được kiểm tra trước khi sang bước tiếp
```

Không phải duyệt Phase 9 rồi toàn bộ app xuất hiện trong một lần. App được xây theo nhiều phần nhỏ để dễ kiểm tra và tránh conflict.

**Cách làm việc:** M0–M7 là các cổng nghiệm thu theo thứ tự. Trong mỗi mốc, các thành viên được làm song song những task có dependency đã xong và không tranh cùng file. Không cần cả năm người làm lần lượt từng việc. Nghiên cứu và viết pilot có thể chạy sớm; M7 là lúc tích hợp và phát hành pilot đã qua review.

## Trước khi sửa code, AI/thành viên đọc gì?

Context đã được chuẩn hóa thành một đường đọc chung:

```text
AGENTS.md (luật chung)
→ docs/README.md (bản đồ tài liệu)
→ TASK-BOARD.md (việc và trạng thái)
→ ARCHITECTURE.md (ranh giới kỹ thuật)
→ task card + spec liên quan (phạm vi chính xác)
```

`TASK-BOARD` là bảng tổng. `TEAM-OWNERSHIP` phân năm người theo lane. `docs/tasks` lưu checklist, checkpoint, evidence và handoff của từng task/người/AI. Nhờ vậy, AI mới không phải đoán tiến độ từ chat cũ.

## Thứ tự đề xuất

### Milestone 0 — Làm sạch nền móng

- Xác nhận task card, owner/reviewer, file claim và không có conflict.
- Sửa lỗi TypeScript hiện có.
- Chọn `src/features` làm code chính và cô lập code prototype/legacy.
- Làm `App.tsx` nhẹ hơn.
- Chuẩn hóa environment, lập kế hoạch thay khóa Supabase đặc quyền đã từng chia sẻ; hoàn tất rotation trước khi tích hợp backend ở M4.
- Thêm bộ test tối thiểu.

### Milestone 1 — Design system và app shell

- Đồng bộ Figma với tokens màu, khoảng cách, bo góc, shadow và motion.
- Hoàn thiện Button, Card, ChoiceOption, loading/error/empty state.
- Tạo navigation/routing và responsive mobile shell.
- Thêm sound manager, mute và reduced motion.

### Milestone 2 — Types, service và mock data

- Triển khai ID/version/type contract Phase 5.
- Tạo service interface dùng chung.
- Giữ mock adapter để frontend chạy trước khi Supabase hoàn tất.
- Tạo validator cho story/scene/choice.

### Milestone 3 — Learning experience

- Lesson thường.
- Visual Novel player v2.
- Video lesson với caption/transcript/fallback.
- Quiz và feedback.
- Start/resume/retry/back/completion trên mock data.

### Milestone 4 — Supabase backend

- Migration, Auth, RLS, Storage và seed workflow.
- Kết nối service với Supabase.
- Cross-user security tests.
- Draft/published content boundary.

### Milestone 5 — Progress, XP và streak

- Checkpoint/resume đa thiết bị.
- Completion transaction.
- Reward ledger chống cộng trùng.
- XP, streak, attempts và analytics tối thiểu.

### Milestone 6 — PWA và hoàn thiện giao diện

- Manifest, icon, install flow và offline page.
- Lazy loading, nén ảnh/video và tối ưu máy yếu.
- Animation, âm thanh, bo góc và trạng thái tương tác.
- Accessibility review.

### Milestone 7 — Nội dung pilot và release

- Chọn một chapter mẫu trong phạm vi kháng chiến chống Mỹ ở Việt Nam, lập bản đồ nhiều lesson đa định dạng và chọn pilot episode trong chapter đó; không mặc định dùng demo Genève hiện tại.
- Member 1 bàn giao kịch bản/nguồn; Member 2 biên tập ít nhất một video theo kịch bản cho bài học MVP; Member 4 đưa video đã duyệt vào bài học. `CONTENT-007` theo dõi media này riêng với video reference `CONTENT-006`.
- Viết/review lịch sử/media/ngôn ngữ.
- Chạy toàn bộ test Phase 8.
- Deploy preview, kiểm thử nhóm, sửa lỗi rồi phát hành PWA.

## Chia nhóm 5 người mà không conflict

Đề xuất năm workstream:

| Nhóm/người | Phạm vi chính |
|---|---|
| Product + Content — Thọ | Pilot, screenplay, source, review và acceptance |
| UI/UX Figma + video — Trúc | Thiết kế, component variants, prototype; biên tập video bài học theo kịch bản và bàn giao media package |
| Frontend Foundation — Hưng | App shell, tokens, primitives, routing và PWA |
| Frontend Learning — Dương | Lesson, Visual Novel, video và quiz |
| Backend + QA — Vinh | Supabase, services, RLS, progress/reward và test |

Codex có thể làm integration owner — người ghép các nhánh, thực hiện task end-to-end và kiểm tra contract — như bạn đã yêu cầu trước đó.

Chi tiết đầu ra, handoff và việc từng người theo milestone nằm ở [Team ownership](../../project/TEAM-OWNERSHIP.md#11-việc-cụ-thể-và-đầu-ra-của-từng-thành-viên).

Mỗi task phải khai báo trước file sẽ sửa. Các file dùng chung như `App.tsx`, `src/types/index.ts`, `tokens.ts`, `package.json`, lockfile và migrations chỉ có một owner trong cùng thời điểm.

Tiến độ không ghi kiểu “đã xong 70%”. Mỗi task dùng acceptance checklist và checkpoint: đã làm gì, evidence, bước tiếp theo, blocker. Người/AI làm xong chuyển `REVIEW`; reviewer mới chuyển `DONE`.

## Những phần chưa đưa vào MVP core

- Capacitor/Google Play/App Store: chờ PWA ổn định và duyệt riêng.
- AI Battle: tiếp tục phát triển riêng, chưa cộng XP thật; tích hợp sau handoff/review.
- CMS/story editor hoàn chỉnh.
- Offline toàn bộ video/chapter.
- Leaderboard, streak freeze và monetization.

## Việc product owner cần cung cấp trong lúc triển khai

- Chọn hoặc duyệt canonical pilot episode trước release.
- Duyệt Figma/design system ở milestone giao diện.
- Thực hiện/cho phép rotate Supabase privileged key trước integration.
- Đã gán Thọ, Trúc, Hưng, Dương và Vinh vào năm workstream; còn cần chỉ định historical reviewer và claim executor/file theo từng task.
- Cung cấp repo/branch AI Battle khi muốn review tích hợp.

## Bạn đang duyệt điều gì?

- Mở code freeze sau khi Phase 9 được duyệt.
- Thứ tự milestone 0–7 ở trên.
- PWA là release target đầu tiên; Capacitor để sau.
- Codex có thể nhận implementation end-to-end, team người làm theo workstream/file ownership.
- Không release nếu chưa có canonical content và chưa qua Phase 8 gates.
- Mỗi milestone là thay đổi nhỏ, có test và handoff; không làm một lần khổng lồ.
- Duyệt Phase 9 chỉ mở Milestone 0; không tự động cho phép làm tất cả milestone cùng lúc.

Product owner đã duyệt Phase 9 ngày 2026-09-23. Milestone 0 được mở; task đầu tiên là M0-00 (claim/context), tiếp theo M0-01 (baseline). Mỗi milestone sau chỉ mở khi gate của milestone trước có evidence, reviewer/QA kiểm tra và Product owner duyệt rõ ràng trên task board.
