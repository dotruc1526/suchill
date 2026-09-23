# Sử Chill — Project Instructions for Humans and AI

React 19 + Vite 8 + Tailwind CSS 4 + TypeScript. Sản phẩm là ứng dụng học lịch sử về giai đoạn kháng chiến chống Mỹ ở Việt Nam theo hướng mobile-first, phát hành PWA trước. Curriculum dài hạn có nhiều chapter/lesson; MVP đầu tiên dùng một chapter mẫu gồm nhiều lesson đa định dạng.

## 1. Context bắt buộc phải đọc

Trước khi nhận hoặc sửa một task, đọc theo thứ tự:

1. `AGENTS.md` — quy tắc làm việc chung.
2. `docs/README.md` — bản đồ tài liệu.
3. `docs/project/TASK-BOARD.md` — trạng thái, owner và dependency.
4. `ARCHITECTURE.md` — ranh giới code và dữ liệu.
5. Task card trong `docs/tasks/` và spec/feature doc được task liên kết.

Không dùng chat cũ làm nguồn sự thật duy nhất. Nếu tài liệu mâu thuẫn, ưu tiên theo thứ tự: quyết định mới nhất đã `APPROVED` → task card đang làm → kiến trúc → code hiện tại. Ghi rõ mâu thuẫn thay vì tự đổi contract.

## 2. Trạng thái triển khai

- Phase 0–9: `APPROVED` (Phase 9 được product owner duyệt ngày 2026-09-23).
- **Spec-first freeze đã kết thúc**; Milestone 0 được mở theo roadmap Phase 9. Task implementation vẫn phải có card, dependency và file claim trước khi sửa.
- Các milestone sau M0 chỉ bắt đầu khi gate và dependency tương ứng đạt **và Product owner duyệt rõ ràng milestone trước đó trên task board**. Task `DONE` riêng lẻ không tự mở milestone tiếp theo.
- Demo Genève/vĩ tuyến 17 hiện tại là fixture kỹ thuật, không phải pilot/canonical content hay chuẩn nội dung mục tiêu.
- Nội dung canonical chỉ nằm trong phạm vi kháng chiến chống Mỹ ở Việt Nam; ví dụ lịch sử ngoài phạm vi trong tài liệu cũ chỉ minh họa cấu trúc học, không tự trở thành lesson phát hành.
- AI Battle là track thử nghiệm độc lập; chưa tích hợp reward/XP thật nếu chưa qua review contract và bảo mật.
- PWA là target đầu tiên. Capacitor/Android/iOS bị chặn cho đến khi PWA ổn định và được duyệt riêng.

## 3. Task claim và theo dõi tiến độ

Thành viên chỉ cần nói tên hoặc vai trò của mình (ví dụ “tôi là Thọ” hoặc “tôi là Member 1”), không cần biết trước task ID. Năm tên và vai trò nằm ở `docs/project/TEAM-OWNERSHIP.md`. AI đọc task board và task cards, lọc việc đúng vai trò trong milestone đang mở hoặc content track độc lập, đối chiếu dependency/gate/file claim, rồi đề xuất task hợp lệ và bước làm cụ thể. Nếu chưa có task đủ điều kiện, nêu rõ blocker và ai cần xử lý; không tự mở milestone hay bỏ qua dependency.

Trước khi sửa file:

1. Task phải có ID, dependency hợp lệ, acceptance criteria và task card.
2. Điền `Owner`, `Executor`, `Reviewer`, `Status`, `Started`, `Files claimed`, `Next action`.
3. Chuyển `READY` → `IN PROGRESS`; không nhận task `BLOCKED`.
4. Một hotspot chỉ có một owner tại một thời điểm: `package.json`/lockfile, `src/App.tsx`, `src/types/index.ts`, `src/theme/tokens.ts`, global CSS, generated DB types, migrations và PWA config.

Trong khi làm, cập nhật task card ở checkpoint có ý nghĩa: phần đã đạt, evidence, next action và blocker. Không dùng phần trăm cảm tính. Khi xong phần chính, chuyển `REVIEW`; reviewer mới chuyển `DONE` sau khi acceptance và evidence đạt. Handoff phải ghi files changed, test/build result, env/migration impact, known issues và bước tiếp theo.

## 4. Kiến trúc canonical

- `src/theme/tokens.ts`: design tokens duy nhất.
- `src/components/ui/`: UI primitives dùng chung.
- `src/components/layout/`: layout/navigation dùng chung.
- `src/features/`: màn hình và logic theo feature.
- `src/services/`: interfaces và adapters cho mock/Supabase/API.
- `src/types/index.ts`: domain types dùng chung; không để UI phụ thuộc trực tiếp database row.
- `src/data/`: fixture/mock tạm thời, không phải production content source.
- `src/App.tsx`: composition/router nhẹ, mục tiêu dưới 150 dòng khi thực tế cho phép.

Luồng phụ thuộc: `UI → feature hook/controller → service interface → adapter → data source`. React component không gọi Supabase, `fetch` hay raw database trực tiếp. Logic dùng chung phải thành pure function/hook/service có test; tránh abstraction chỉ dùng một lần nếu chưa có lợi ích rõ.

## 5. Design, interaction và accessibility

- Dùng tokens, không tự phát minh màu/radius/shadow/motion rải rác.
- Palette chính: outer `#C8A882`, app `#F5E6D0`, primary `#8B1A1A`, text `#3D1A00`, card `#FBF4E8`.
- Knowledge choice: đúng dùng xanh `#E8F5E2`/`#3A5A2A`; sai dùng đỏ `#FDE8E4`/`#C4341A`.
- Narrative/reflection choice không có đúng/sai: selected dùng trạng thái trung tính/primary, không tô xanh như đáp án đúng.
- Feedback không chỉ dựa vào màu/âm thanh; có text/icon phù hợp, keyboard/focus, screen-reader label.
- Motion ngắn và có mục đích; tôn trọng `prefers-reduced-motion`.
- UI sound chỉ phát sau tương tác, âm lượng nhẹ, có mute và lưu preference.
- Mobile-first, safe-area, nội dung tiếng Việt dài và thiết bị yếu phải được kiểm tra.

## 6. Nội dung lịch sử và media

- Visual Novel được biên kịch scene-by-scene; AI chỉ hỗ trợ ý tưởng/chỉnh sửa, không tự publish story runtime.
- Mọi fact/fiction/perspective/source/media phải theo Phase 2, 3 và 8.
- Không dùng ảnh stock hiện đại hoặc nhân vật/sự kiện sai bối cảnh. Media cần source/license/alt/caption/transcript/fallback theo loại.
- Story đã publish là version bất biến; thay đổi nội dung tạo version mới. Persistent identity không dùng array index.

## 7. Security và backend

- Browser chỉ dùng Supabase publishable/anon key. Service-role/privileged secret chỉ ở trusted backend và không commit, log, chat hoặc bundle client.
- Privileged key đã từng được chia sẻ phải rotate trước Milestone 4/production integration.
- RLS default-deny cho dữ liệu user; bắt buộc test user A không đọc/ghi user B.
- Completion, XP, streak và reward là trusted/idempotent operation; UI không tự quyết định reward.
- Không sửa migration đã áp dụng; tạo migration mới.

## 8. Chất lượng và Definition of Done

- Giữ source file dưới 200 dòng khi hợp lý; giữ component contract nhỏ, rõ.
- Không sửa ngoài scope hoặc ghi đè thay đổi không liên quan của người khác.
- Chạy typecheck/build/test liên quan; nếu không chạy được phải ghi lý do và rủi ro.
- Task chỉ `DONE` khi acceptance đạt, reviewer xác nhận, docs/task/evidence/handoff đã cập nhật.
- Không release khi còn Blocker/Critical về security, lịch sử, accessibility hoặc dữ liệu.

Chi tiết nằm trong `ARCHITECTURE.md`, `docs/specs/` và task card tương ứng; không nhân bản schema dài vào file này.
