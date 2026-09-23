# Sử Chill — Team Ownership

> Status: TEAM SLOTS ASSIGNED; task claims still required\
> Last updated: 2026-09-23

File này trả lời câu hỏi “ai phụ trách phần nào?”. `TASK-BOARD.md` cho biết toàn project có những việc gì; task card cho biết chi tiết một việc; file này cho biết ranh giới trách nhiệm của năm thành viên.

Để xem một người đang làm tới đâu, tìm tên người đó trên [task board](./TASK-BOARD.md) rồi mở task card tương ứng. [Hướng dẫn đọc và đồng bộ tiến độ](../tasks/README.md#xem-tiến-độ-theo-từng-thành-viên) nêu cách cập nhật; không ghi tiến độ hằng ngày vào `APP-PLAN.md`.

## 1. Nhóm 5 người đề xuất

| Slot | Tên thành viên | Lane chính | Trách nhiệm | Reviewer chéo đề xuất |
|---|---|---|---|---|
| Member 1 | Thọ | Product + Content | lập curriculum nhiều chapter, chọn chapter mẫu và các lesson MVP, kịch bản video/story, nguồn, lịch sử, nghiệm thu | Historical reviewer / product owner |
| Member 2 | Trúc | UI/UX Figma + video production | flow, visual, variants, biên tập video theo kịch bản, assets và handoff | Thọ + historical reviewer (video); Hưng (UI) |
| Member 3 | Hưng | Frontend Foundation | app shell, tokens, primitives, routing, PWA | Vinh |
| Member 4 | Dương | Frontend Learning | lesson, Visual Novel, video, quiz, profile UI | Hưng / Vinh |
| Member 5 | Vinh | Backend + QA | services, Supabase, RLS, progress/reward, automated tests | Hưng / product owner |
| Integration owner | Codex, trừ khi đổi | Cross-lane integration | contract, merge order, end-to-end verification và handoff | Product owner |

Một người có thể hỗ trợ lane khác, nhưng mỗi task vẫn chỉ có một accountable owner. Tên năm thành viên đã được gán theo quyết định Product owner ngày 2026-09-23; từng task vẫn phải được claim riêng trước khi làm. Historical reviewer chưa được chỉ định.

## 1.1 Việc cụ thể và đầu ra của từng thành viên

| Slot | Việc chính theo milestone | Bàn giao để người khác tiếp tục |
|---|---|---|
| Member 1 — Product + Content | M0: chốt mục tiêu MVP và tiêu chí nghiệm thu; content track: phác curriculum nhiều chapter trong phạm vi kháng chiến chống Mỹ, chọn một chapter mẫu nhiều lesson cho MVP, learning objectives, kịch bản video/story, nguồn và media; M7: điều phối historical/learning/media review, duyệt nội dung và release candidate | Curriculum map/chapter lesson outline (CONTENT-008), pilot brief, source register, kịch bản/storyboard bàn giao Member 2, screenplay scene-by-scene, biên bản review. Historical reviewer phải là người có chuyên môn được chỉ định; không mặc định Member 1 tự duyệt nội dung mình viết. |
| Member 2 — UI/UX Figma + video production | M1: thiết kế mobile flow, token và component states; sau khi có kịch bản/nguồn đã review: biên tập video cho bài học MVP; M3: handoff màn lesson/VN/video/quiz; M6: rendition mobile và rà accessibility | Figma/prototype, token handoff, component states; video xuất phù hợp mobile, poster, phụ đề tiếng Việt, transcript, nguồn/license/alt và fallback. Member 1/historical reviewer duyệt nội dung; Member 4 tích hợp video vào lesson. |
| Member 3 — Frontend Foundation | M0: sửa baseline TypeScript, cô lập legacy, làm app shell; M1: tokens, primitives, layout/navigation; M4: phối hợp auth/session UI; M6: manifest, service worker, offline/update flow và tối ưu tải | Build/typecheck evidence, component API, app-state boundary, PWA test report. Claim riêng các hotspot `App.tsx`, tokens, global CSS, package/lockfile và PWA config. |
| Member 4 — Frontend Learning | M2: phối hợp mock adapter và contract consumption; M3: home/lesson, Visual Novel v2, video player, quiz, practice/profile UI; sau media review: gắn video của Member 2 vào bài học canonical; M5: hiển thị checkpoint, pending/confirmed XP/streak; M6: sửa lỗi mobile/accessibility feature | Feature demo, video lesson chạy với caption/transcript/fallback, interaction tests, loading/error/offline states, handoff contract cho Member 5. Chỉ hiển thị reward do service xác nhận. |
| Member 5 — Backend + QA | M0: test foundation, env/security boundary và quality commands; M2: domain types, validators, service interfaces/mock tests; M4: migrations, Auth, RLS, Storage, adapters và cross-user tests; M5: trusted completion/XP/streak/analytics; M6–M7: regression, security và release gate evidence | Contracts, migrations, test reports, security matrix, env impact và rollback notes. Product owner phối hợp rotation của privileged key trước M4; Member 5 không đưa key vào client/chat/repo. |

Codex/integration owner giữ thứ tự merge, giải quyết thay đổi contract giữa các lane và chạy kiểm tra end-to-end. Người này không thay reviewer chuyên môn lịch sử, bảo mật hoặc product owner.

## 1.2 Thứ tự và việc song song

M0 → M7 là thứ tự **gate**, không phải yêu cầu cả năm người chờ nhau làm từng việc một. Trong milestone đang mở, các task không phụ thuộc nhau có thể chạy cùng lúc nếu đã có task card, owner/reviewer và file claim riêng. Milestone sau chỉ mở khi gate của milestone trước có evidence, reviewer/QA kiểm tra và Product owner duyệt trên task board.

- Sau khi M0 được duyệt, Member 2 làm thiết kế M1. Member 5 có thể trao đổi ý tưởng contract M2, nhưng chỉ claim/triển khai task M2 sau khi M1 được duyệt mở M2.
- Member 1 có thể nhận `CONTENT-009` để tìm nguồn và so sánh chủ đề ứng viên ngay khi M0 đang mở. Đây là content track độc lập, không mở M1/M2 và không biến nghiên cứu thành nội dung canonical. Sau đó Product owner chọn chapter/pilot ở `CONTENT-002`; Member 1 mới lập curriculum map `CONTENT-008` và screenplay `CONTENT-004` theo dependency. Nội dung chỉ được seed/publish sau historical review và backend gate M4.
- Member 3 làm shell/primitives, Member 4 làm feature UI trên mock, Member 5 làm service/test trong các file riêng; mọi shared contract phải thống nhất consumer và merge order trước.
- M4 cần contract M2; M5 cần backend M4; PWA polish M6 cần learning flow và progress phù hợp; M7 release cần tất cả gate còn lại và pilot đã duyệt.
- AI Battle là track riêng. Không đưa vào critical path MVP hoặc cộng XP/streak thật trước integration review.

## 2. Quyền sở hữu file

| Khu vực | Owner mặc định |
|---|---|
| `docs/features/`, screenplay/source input | Product + Content |
| Figma và approved asset handoff | UI/UX Figma |
| `src/App.tsx`, `src/app/`, `src/theme/`, `src/components/ui/`, PWA config | Frontend Foundation |
| `src/features/` | Frontend Learning |
| `src/types/`, `src/services/`, `supabase/`, `tests/` | Backend + QA |

Đây là mặc định, không thay thế `Files claimed` của task. Hotspot chỉ được một task claim trong cùng thời điểm.

## 3. Khi phân công task

1. Chọn task `READY` trên task board.
2. Tạo/cập nhật task card trong `docs/tasks/active/`.
3. Xác nhận người nhận theo bảng trên; điền executor, reviewer và các file được claim vào task card.
4. Ghi branch/task Codex nếu có.
5. Khi handoff, người nhận mới xác nhận trước khi đổi owner.

## 4. Theo dõi AI

AI không được xem là “đang làm” chỉ vì đã nhận prompt. Task card phải có `Executor: AI/Codex`, task/thread hoặc branch, checkpoint cuối, next action và evidence. Tiến độ được đo bằng checklist acceptance đã hoàn thành, không bằng phần trăm tự ước lượng.

## 5. Conflict rule

- Không có hai task `IN PROGRESS` cùng claim một hotspot.
- Thay đổi shared contract phải ghi consumers và thứ tự merge.
- Nếu phát hiện conflict, task sau chuyển `BLOCKED`, ghi rõ file/task đang giữ quyền sở hữu.
- Integration owner không tự ghi đè thay đổi của member; phải review/handoff trước.
