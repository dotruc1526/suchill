# Sử Chill — Shared Task Board

> Last updated: 2026-09-26\
> Owner: Project team\
> Purpose: Nguồn context chung cho product owner, thành viên nhóm và AI agents

## Cách dùng file này

Đây là task board cấp project. Mỗi task phải có một ID duy nhất. Không tạo task mới chỉ bằng cách viết trong chat; hãy ghi task vào file này để người khác và AI có thể đọc lại context.

- Phân vai năm người: [TEAM-OWNERSHIP.md](./TEAM-OWNERSHIP.md).
- Tiến độ/evidence chi tiết: [docs/tasks/README.md](../tasks/README.md).
- Task từ `READY` trở đi phải có task card; task board vẫn là bản tổng hợp ngắn.

Khi nhận task, người phụ trách cập nhật:

- `Owner`.
- `Status`.
- `Started`.
- `Next action`.
- `Blocker` nếu có.
- `Files` dự kiến/chính đã thay đổi.
- `Evidence` sau khi hoàn thành.
- `Handoff note` nếu người khác sẽ tiếp tục.

Không ghi tiến độ bằng phần trăm cảm tính. Dùng acceptance checklist và checkpoint: đã hoàn thành gì, evidence nào, bước tiếp theo và blocker.

## Status vocabulary

| Status | Ý nghĩa |
|---|---|
| `BACKLOG` | Đã biết cần làm nhưng chưa đủ điều kiện bắt đầu |
| `READY` | Đủ context/dependency để nhận việc |
| `IN PROGRESS` | Đang có người thực hiện |
| `BLOCKED` | Không thể tiếp tục vì dependency/quyết định/quyền truy cập |
| `REVIEW` | Đã làm xong phần chính, đang chờ review/approval |
| `DONE` | Acceptance criteria đã đạt và có evidence |
| `CANCELLED` | Không còn nằm trong scope |

## Delivery rule hiện tại

Phase 9 đã được product owner duyệt ngày 2026-09-23; `SPEC-FIRST FREEZE` kết thúc và Milestone 0 được mở:

- Phase 0 và Phase 1: `APPROVED`.
- Phase 2: `APPROVED`.
- Phase 3: `APPROVED`.
- Phase 4: `APPROVED`.
- Phase 5: `APPROVED`.
- Phase 6: `APPROVED`.
- Phase 7: `APPROVED`.
- Phase 8: `APPROVED`.
- Phase 9: `APPROVED`.
- Task implementation chỉ bắt đầu khi dependency đạt, có task card, owner/reviewer và file claim. M1–M7 chỉ mở sau khi Product owner duyệt gate milestone trước trên board này.
- Demo Genève vẫn là fixture kỹ thuật; pilot canonical cần content/historical review riêng.

### Milestone gate

| Milestone | Trạng thái | Điều kiện để mở milestone kế tiếp | Product owner approval |
|---|---|---|---|
| M0 | OPEN | Gate M0 trong Phase 9 có evidence và reviewer kiểm tra | Chưa duyệt đóng M0 |
| M1–M7 | LOCKED | Mở từng milestone sau khi milestone trước được duyệt | Chưa có |

`DONE` của từng task không tự mở milestone tiếp theo. Executor ghi evidence theo gate Phase 9; reviewer/QA kiểm tra; Product owner duyệt rõ ràng và ghi ngày, evidence, milestone được mở vào bảng này trước khi nhóm bắt đầu implementation milestone kế tiếp. Content track có task/dependency riêng: Member 1 có thể nhận `CONTENT-009` nghiên cứu nguồn sơ bộ trong khi M0 đang mở; việc đó không mở milestone implementation hoặc chốt nội dung canonical.

## Product scope

Sử Chill dạy giai đoạn kháng chiến chống Mỹ ở Việt Nam qua nhiều chapter và lesson đa định dạng. MVP đầu tiên là **một chapter mẫu gồm nhiều lesson**; pilot episode và video là các phần trong chapter, không phải toàn bộ sản phẩm. Thọ (Member 1) lập curriculum map và product owner chọn chapter/pilot; không tự lấy demo Genève hoặc ví dụ cũ làm nội dung canonical.

## Project snapshot

### Đã có

- React/Vite/Tailwind app shell.
- Chapter, lesson, quiz, profile, practice và AI screen demo.
- Visual Novel demo Genève/vĩ tuyến 17.
- AI Battle đang được một nhánh của nhóm phát triển; chưa tích hợp vào app chính.
- Supabase `.env.local` local-only.
- Bộ docs và approval brief.

### Chưa có

- Canonical pilot episode được product owner chọn và qua review.
- Domain types v2 đã duyệt ở mức đặc tả nhưng chưa triển khai source.
- Supabase schema/RLS/services thật.
- Account progress/streak backend.
- Automated tests và release gates.

## Task board

### A. Documentation and product

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| DOC-001 | 0 | Repository & context audit | Codex | DONE | — | `docs/specs/phases/00-repository-context-audit.md` | Phase 0 approved |
| DOC-002 | 1 | Product & learning experience spec | Codex + Product owner | DONE | DOC-001 | `docs/specs/phases/01-product-learning-experience-spec.md` | Product owner approved |
| DOC-003 | 2 | Content & story authoring model | Codex + Content lead | DONE | DOC-002 | `docs/specs/phases/02-content-story-authoring-model.md` | Phase 2 approved; scenario-driven authoring accepted |
| DOC-004 | 3 | Historical accuracy & media governance | Codex + Historical reviewer | DONE | DOC-003 | `docs/specs/phases/03-historical-media-governance.md` | Phase 3 approved; media/fiction/source gates accepted |
| DOC-005 | 4 | UX flow & player state spec | Codex + Product owner | DONE | DOC-003 | `docs/specs/phases/04-player-state-spec.md` | Phase 4 approved; state/transition đã khóa |
| DOC-006 | 5 | Domain model & type contract | Codex + Product owner | DONE | DOC-003, DOC-005 | `docs/specs/phases/05-domain-type-contract.md` | Phase 5 approved; ID/version/domain boundary đã khóa |
| DOC-007 | 6 | Database & service layer spec | Codex + Product owner | DONE | DOC-004, DOC-006 | `docs/specs/phases/06-database-service-spec.md` | Phase 6 approved; Supabase/RLS/service boundary đã khóa |
| DOC-008 | 7 | Progress, XP, streak & analytics spec | Codex + Product owner | DONE | DOC-006, DOC-007 | `docs/specs/phases/07-progress-reward-analytics-spec.md` | Phase 7 approved; completion/XP/streak/idempotency đã khóa |
| DOC-009 | 8 | QA, accessibility & content review | Codex + Product owner | DONE | DOC-004, DOC-005, DOC-006 | `docs/specs/phases/08-qa-accessibility-release-spec.md` | Phase 8 approved; QA/accessibility/release gates đã khóa |
| DOC-010 | 9 | Implementation roadmap + context hardening | Codex + Product owner | DONE | DOC-007, DOC-008, DOC-009 | [`docs/tasks/done/DOC-010.md`](../tasks/done/DOC-010.md) | Product owner duyệt Phase 9 ngày 2026-09-23; M0 được mở |
| DOC-011 | 9 clarification | MVP video production ownership | Codex | REVIEW | DOC-010 | [`docs/tasks/active/DOC-011.md`](../tasks/active/DOC-011.md) | Product owner review phân công Member 2, CONTENT-007 và release gate |
| DOC-012 | Product scope | Giới hạn curriculum vào kháng chiến chống Mỹ tại Việt Nam | Codex | REVIEW | DOC-010, DOC-002 | [`docs/tasks/active/DOC-012.md`](../tasks/active/DOC-012.md) | Product owner review phạm vi dài hạn và MVP một chapter mẫu nhiều lesson |
| DOC-013 | Documentation | Rà soát quy tắc milestone và cách AI tự tìm task theo vai trò | Codex | REVIEW | DOC-010 | [`docs/tasks/active/DOC-013.md`](../tasks/active/DOC-013.md) | Product owner review; 57 Markdown files có 0 link lỗi, 0 card active/blocked/review lệch |
| DOC-014 | GitHub readiness | Kiểm tra file chuẩn bị đưa lên GitHub và làm rõ content track Member 1 | Codex | REVIEW | DOC-010 | [`docs/tasks/active/DOC-014.md`](../tasks/active/DOC-014.md) | Product owner review; build pass, typecheck baseline còn lỗi, CONTENT-009 READY |
| DOC-015 | Team handoff | Gán tên 5 thành viên và tạo PR tài liệu trên nhánh riêng | Codex | REVIEW | DOC-010 | [`docs/tasks/active/DOC-015.md`](../tasks/active/DOC-015.md) | [PR #7](https://github.com/dotruc1526/suchill/pull/7) đã mở vào `main`; Product owner review |

### B. Frontend implementation — theo dependency và milestone gate Phase 9

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| FE-001 | Foundation | Sửa TypeScript baseline | Hưng (Member 3) | REVIEW | DOC-010 | [`docs/tasks/active/FE-001.md`](../tasks/active/FE-001.md) | Đã sửa 18 lỗi typecheck; `npx tsc --noEmit` pass 100% |
| FE-002 | Foundation | Chọn canonical features architecture và cô lập legacy | Hưng (Member 3) | BACKLOG | FE-001, DOC-010 | `src/features/`, `src/screens/` | Không còn duplicate runtime path |
| FE-003 | Design system | Chuẩn hóa tokens và UI primitives | Hưng (Member 3) | BACKLOG | FE-001, DOC-010 | `src/theme/`, `src/components/ui/` | UI dùng tokens; ChoiceOption được reuse |
| FE-004 | App shell | Tách navigation/view state khỏi App quá lớn | Hưng (Member 3) | BACKLOG | FE-001, DOC-005, DOC-006 | `src/App.tsx`, app-state modules | App shell nhẹ, flow test được |
| FE-005 | VN engine | Xây player v2 trên mock adapter | Dương (Member 4) | BACKLOG | FE-003, DOC-005, DOC-006 | `src/features/visual-novel/` | Scene/choice/retry/debrief/resume/error pass |
| FE-006 | Video | Xây video-led lesson player và tích hợp media đã duyệt | Dương (Member 4) | BACKLOG | FE-003, DOC-005, DOC-006 | `src/features/learning/` | Player chạy trên mock trước; tích hợp bài học canonical sau CONTENT-007 với caption/transcript/resume/fallback |
| FE-007 | Quiz | Hợp nhất knowledge check và chapter quiz rules | Dương (Member 4) | BACKLOG | FE-003, DOC-006, DOC-008 | `src/features/quiz/` | Không duplicate reward; feedback accessible |
| FE-008 | Profile | Hiển thị account XP/streak/achievement | Dương (Member 4) | BACKLOG | FE-004, BE-003 | `src/features/profile/` | Dữ liệu lấy qua service; sync đúng account |
| FE-009 | UI/UX polish | Motion, interaction states, radius tokens và UI sound | Hưng (Member 3); Trúc/Dương phối hợp | BACKLOG | FE-003, DOC-005, DOC-009 | `src/theme/`, `src/components/ui/`, feature UI | Hiệu ứng mượt; sound có mute; reduced motion; radius nhất quán; mobile performance pass |
| FE-010 | Engineering quality | Chuẩn hóa reusable components/functions và performance budget | Hưng (Member 3); Vinh phối hợp | BACKLOG | FE-001, FE-002, FE-003, DOC-006 | `src/components/`, `src/features/`, `src/services/`, `src/types/` | Không gọi DB trong UI; logic dùng chung có test; lazy-load/media optimization; không abstraction thừa |

### C. Backend and Supabase — theo dependency và milestone gate Phase 9

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| BE-001 | Supabase foundation | Chuẩn hóa client-safe env và Supabase client boundary | Vinh (Member 5) | BACKLOG | DOC-007, DOC-010 | `src/services/`, env docs | Browser chỉ dùng publishable/anon key |
| BE-002 | Content | Tạo content migrations, RLS và seed workflow | Vinh (Member 5) | BACKLOG | BE-001, DOC-007 | `supabase/migrations/`, seed files | Published content đọc được; draft bị bảo vệ |
| BE-003 | Progress | Account/profile/lesson/episode checkpoint | Vinh (Member 5) | BACKLOG | BE-001, DOC-007, DOC-008 | migrations + `src/services/` | Resume cross-device, user isolation |
| BE-004 | Reward | Completion, XP, achievement và streak idempotency | Vinh (Member 5) | BACKLOG | BE-003, DOC-008 | migrations + service/edge operation | Không cộng trùng cùng activity/day |
| BE-005 | Attempts | Choice/quiz attempts và analytics events | Vinh (Member 5) | BACKLOG | BE-003, DOC-008 | migrations + service | Payload đúng contract, privacy reviewed |
| BE-006 | Media | Media/source metadata và storage policy | Vinh (Member 5) | BACKLOG | BE-002, DOC-004 | migrations/storage docs | Attribution, caption, fallback metadata đầy đủ |

### D. Content and historical review

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| CONTENT-001 | 2 | Chốt story/scene/choice template | Content lead | DONE | DOC-003 | `docs/specs/phases/02-content-story-authoring-model.md` | Templates và choice taxonomy đã được duyệt trong Phase 2 |
| CONTENT-002 | 3 | Chọn chapter mẫu và pilot episode trong phạm vi sản phẩm | Thọ (Member 1); Product owner quyết định | DONE | DOC-003, DOC-004, DOC-012 | [`docs/tasks/done/CONTENT-002.md`](../tasks/done/CONTENT-002.md) | Product owner chọn chapter thuộc kháng chiến chống Mỹ; không mặc định dùng Genève demo |
| CONTENT-003 | 3 | Historical source/media review pilot | Historical reviewer | DONE | CONTENT-002, DOC-004 | [`docs/tasks/done/CONTENT-003.md`](../tasks/done/CONTENT-003.md) | Fact, fiction, image/license review pass |
| CONTENT-004 | 5 | Viết screenplay scene-by-scene và kịch bản/storyboard video | Thọ (Member 1) | DONE | CONTENT-003, CONTENT-008, DOC-006 | [`docs/tasks/done/CONTENT-004.md`](../tasks/done/CONTENT-004.md) | Scene có objective, role, choice, source; bàn giao kịch bản video cho Trúc |
| CONTENT-005 | 8 | Content QA và Vietnamese language review | Vinh (Member 5); Thọ phối hợp | BLOCKED | CONTENT-004, CONTENT-007, DOC-009 | [`docs/tasks/blocked/CONTENT-005.md`](../tasks/blocked/CONTENT-005.md) | Không còn critical content issue; video/caption/transcript khớp kịch bản |
| CONTENT-006 | 3/4 | Review và phát triển `episode-portrait-final.mp4` | Trúc (Member 2) | IN PROGRESS | DOC-004 | [`docs/tasks/active/CONTENT-006.md`](../tasks/active/CONTENT-006.md) | Trúc là executor và historical/media reviewer; Thọ cấp quyền review objective/wording; Product owner cấp quyền chốt media/legal; media/legal chốt `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`; 4 claim VERIFIED, 1 claim REVISION_REQUIRED_BEFORE_USE |
| CONTENT-007 | MVP video | Biên tập video theo kịch bản và bàn giao cho bài học canonical | Trúc (Member 2) | BLOCKED | CONTENT-003, CONTENT-004, DOC-004 | [`docs/tasks/blocked/CONTENT-007.md`](../tasks/blocked/CONTENT-007.md) | Ít nhất một video qua source/history/media review, có caption/transcript/poster/fallback/mobile rendition; Dương tích hợp vào lesson |
| CONTENT-008 | MVP curriculum | Lập bản đồ chapter mẫu gồm nhiều lesson đa định dạng | Thọ (Member 1) | DONE | CONTENT-002, DOC-003, DOC-012 | [`docs/tasks/done/CONTENT-008.md`](../tasks/done/CONTENT-008.md) | Learning objectives, lesson order/format và pilot episode/video placement rõ; historical reviewer kiểm tra scope |
| CONTENT-009 | Nghiên cứu nguồn sơ bộ | Thọ lập danh mục nguồn/chủ đề ứng viên trong phạm vi kháng chiến chống Mỹ | Thọ (Member 1) | REVIEW | DOC-003, DOC-004 | [`docs/tasks/active/CONTENT-009.md`](../tasks/active/CONTENT-009.md) | Đã hoàn tất nghiên cứu 4 chủ đề và Review Round 3 (Final Adversarial Review); sẵn sàng bàn giao cho Product Owner (CONTENT-002) và Historical Reviewer (CONTENT-003) |

### E. QA and release

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| QA-001 | 8 | Schema/story validation checklist | Vinh (Member 5) | BACKLOG | DOC-006, DOC-009 | tests/validation | Broken links/missing objectives detected |
| QA-002 | 8 | Mobile/player interaction test matrix | Vinh (Member 5); Dương phối hợp | BACKLOG | FE-005, FE-006, DOC-009 | test docs | Start/resume/retry/error/accessibility pass |
| QA-003 | 8 | Supabase RLS/security verification | Vinh (Member 5) | BACKLOG | BE-002, BE-003, DOC-009 | security tests | User cannot read/write another user’s progress |
| QA-004 | 8 | Historical/media release gate | Historical reviewer | BACKLOG | CONTENT-003, CONTENT-005, CONTENT-007 | release checklist | 0 critical historical/source/media issue, gồm video MVP |
| QA-005 | 9 | Pilot release verification | Vinh (Member 5); toàn nhóm phối hợp | BACKLOG | DOC-010, CONTENT-008, CONTENT-007, FE-006, QA-001..004 | release report | MVP có một chapter mẫu nhiều lesson trong phạm vi kháng chiến chống Mỹ và ít nhất một video đã duyệt chạy trong bài học; các acceptance khác pass |

### F. App distribution and experimental features

| ID | Area | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| PLATFORM-001 | Distribution | Chốt hướng phát hành theo giai đoạn | Codex + Product owner | DONE | — | `docs/platform/APP-DEPLOYMENT-PLAN.md` | PWA đã duyệt; Capacitor chờ PWA ổn định và duyệt riêng |
| PLATFORM-002 | Web | Chuẩn bị Firebase Hosting preview | Hưng (Member 3); Vinh phối hợp | BACKLOG | DOC-010, QA-005 | `firebase.json`, `.firebaserc`, CI config | Preview URL chạy build production; env không lộ secret |
| PLATFORM-003 | PWA | Manifest, service worker, icons và update flow | Hưng (Member 3) | BACKLOG | PLATFORM-002 | web/PWA config | Cài được trên màn hình chính; cache/update được kiểm thử |
| PLATFORM-004 | Android | Đánh giá và xin duyệt Capacitor sau PWA | Unassigned | BLOCKED | PLATFORM-003, QA-005, product approval | [`docs/tasks/blocked/PLATFORM-004.md`](../tasks/blocked/PLATFORM-004.md) | Chưa triển khai cho đến khi PWA ổn định và product owner duyệt |
| PLATFORM-005 | iOS | Đánh giá iOS sau Android | Unassigned | BLOCKED | PLATFORM-004, product approval | [`docs/tasks/blocked/PLATFORM-005.md`](../tasks/blocked/PLATFORM-005.md) | Chưa triển khai cho đến khi Android và product owner sẵn sàng |
| BATTLE-001 | AI Battle | Prototype người học đấu trí với AI | Nhóm AI Battle | IN PROGRESS | — | [`docs/tasks/active/BATTLE-001.md`](../tasks/active/BATTLE-001.md) | Bàn giao code, rules, contract, AI key boundary, demo và blockers |
| BATTLE-002 | AI Battle | Review để tích hợp vào Sử Chill | Product + Frontend + Backend + QA | BLOCKED | BATTLE-001, DOC-006, DOC-007 | [`docs/tasks/blocked/BATTLE-002.md`](../tasks/blocked/BATTLE-002.md) | Chỉ mở sau handoff và security/content review |

## Active/review tasks

Chỉ các task có status `IN PROGRESS` được coi là đang có người làm. Task `REVIEW` đã có deliverable và đang chờ approval. Khi giao task mới, chuyển task từ `READY` sang `IN PROGRESS` và điền owner + started date.

| ID | Owner / executor | Reviewer | Started | Current next action | Blocker | Last checkpoint |
|---|---|---|---|---|---|---|
| CONTENT-009 | Thọ (Member 1) / Teamwork Reviewer | Historical reviewer + Product owner | 2026-09-26 | Bàn giao hồ sơ nghiên cứu 4 chủ đề và 8 Claim metadata cho CONTENT-002 / CONTENT-003 | Chờ Product Owner họp chọn Chapter mẫu tại CONTENT-002 | Hoàn tất Review Round 3 (Final Adversarial Review): Đính chính ngày truyền thống không quân, nhân sự Pa Thí/Truông Bồn, bổ sung toàn diện verified facts cho 100% lessons, chuẩn hóa bidirectional supports_claims và Phase 3 schema |
| DOC-011 | Codex / Codex | Product owner | 2026-09-23 | Review quyết định video MVP và task CONTENT-007 | Chờ review tài liệu | Member 2 sản xuất; Member 1 script/source; Member 4 tích hợp player |
| DOC-012 | Codex / Codex | Product owner | 2026-09-23 | Review scope kháng chiến chống Mỹ và MVP chapter mẫu | Chờ review tài liệu | Product owner chốt một chapter mẫu nhiều lesson; CONTENT-008 đã tạo |
| DOC-013 | Codex / Codex | Product owner | 2026-09-23 | Review quy tắc milestone gate và role discovery | Chờ review tài liệu | Đã đồng bộ AGENTS/Architecture/Phase 9; tạo sáu blocked cards; link/status check OK |
| DOC-014 | Codex / Codex | Product owner | 2026-09-23 | Review GitHub readiness và CONTENT-009 | Chờ review tài liệu | `.env.local` ignored; build pass; typecheck baseline 18 lỗi; 59 Markdown links OK |
| DOC-015 | Codex / Codex | Product owner | 2026-09-23 | Review [PR #7](https://github.com/dotruc1526/suchill/pull/7) | Chờ review tài liệu | Đã gán Thọ/Trúc/Hưng/Dương/Vinh; build pass; docs links pass; nhánh riêng đã push |
| CONTENT-006 | Trúc (Member 2) / Trúc | Trúc (historical/media; Thọ cấp quyền objective/wording; Product owner cấp quyền media/legal) | 2026-09-24 | Nếu dùng ngoài `REFERENCE_ONLY`, tạo media package mới: sửa wording, thay/xác minh audio/nhạc/SFX, khóa manifest/hash/source export và review lại | MP4 hiện tại vẫn chứa wording cũ; audio Edge TTS, nhạc/SFX và source export chưa đủ bằng chứng publish | [Evidence và phiếu thực hiện](../tasks/active/active.md): objective accepted; media/legal `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`; 4 claim VERIFIED, 1 claim REVISION_REQUIRED_BEFORE_USE; REFERENCE_ONLY |
| BATTLE-001 | Nhóm AI Battle / nhóm ngoài | Product + Security reviewer | 2026-09-22 | Hoàn thiện prototype và chuẩn bị gói bàn giao | Chưa có repo/branch và contract | Tính năng đang phát triển độc lập |

## Task update log

Mỗi lần handoff quan trọng thêm một dòng mới nhất ở đầu bảng:

| Date | Task | Author | Update | Evidence / next owner |
|---|---|---|---|---|
| 2026-09-26 | CONTENT-006 | Trúc (Codex hỗ trợ) | Đồng bộ sau quyền mới: Thọ giao Trúc review objective/wording và Product owner giao Trúc chốt media/legal; hồ sơ chỉ đạt `REFERENCE_ONLY`, không publish/integration | `active.md` và card CONTENT-006; next chỉ phát sinh nếu tạo media package mới hoặc sửa wording/audio/nhạc/SFX/source export |

| 2026-09-26 | CONTENT-009 | Teamwork Reviewer (Round 3) | Hoàn thành Review Round 3 (Final Adversarial Review): Sửa nhầm lẫn ngày truyền thống không quân (03/4 là ngày đánh thắng trận đầu), đính chính tên phi công Pa Thí (Đinh Công Vượng thay vì Đinh Tôn) và chỉ huy Truông Bồn (Trần Thị Doãn); bổ sung đầy đủ verified facts cho 100% bài học ở cả 4 chủ đề; chuẩn hóa schema Phase 3 hai chiều (supports_claims, text_or_reference, historical_scope, reviewer) | Evidence tại docs/features/research-content-009.md; bàn giao PO (CONTENT-002) & Historical Reviewer (CONTENT-003) |
| 2026-09-26 | CONTENT-009 | Teamwork Reviewer (Round 2) | Hoàn thành Review Round 2 (Adversarial Review): Bổ sung vũ khí Mk-81 Phi đội Quyết Thắng, hiện vật SRC-HR-06 Ngô Thị Tuyển, sự kiện Truông Bồn, claim CLM-V17-002 súng trường, chuẩn hóa 100% Phase 3 Claim schema (review_status, reviewer) và đồng bộ Task Board | Evidence tại docs/features/research-content-009.md; bàn giao PO (CONTENT-002) & Historical Reviewer (CONTENT-003) |
| 2026-09-24 | CONTENT-006 | Codex (đồng bộ hồ sơ sau PR #8) | Sửa hai dòng board còn `READY`/“chưa claim executor” cho khớp card: Trúc là executor, `IN PROGRESS`, started 2026-09-24; ghi nhánh và files claimed | Card/handoff trên `main` sau PR #8; Product owner chỉ định historical/media reviewer, Trúc tiếp tục hồ sơ; video giữ `REFERENCE_ONLY` |
| 2026-09-24 | CONTENT-006 | Trúc (Codex hỗ trợ) | Trúc xác nhận executor-side “mọi thứ đều oke” cho hồ sơ hiện có | Không chuyển DONE; next PO chỉ định historical/media reviewer xử lý quyền audio, nhạc/SFX, history và hướng dùng reference |
| 2026-09-24 | CONTENT-006 | Trúc (Codex hỗ trợ) | Trúc xác nhận tranh trong danh sách đều do Codex tạo; phiên tạo/prompt/project gốc không còn lưu | active.md/CONTENT-006 cập nhật provenance; next PO chỉ định reviewer xử lý quyền audio, nhạc/SFX và hướng dùng reference |
| 2026-09-24 | CONTENT-006 | Trúc (Codex hỗ trợ) | Hoàn tất lượt tra cứu quyền Edge TTS/font và dấu vết xuất; font bitmap có căn cứ điều kiện, quyền audio chưa xác nhận; đính chính clip oke là xác nhận tổng thể | active.md có nguồn, PCM hash và phần tranh đã được Trúc xác nhận ở checkpoint sau; PO chỉ định reviewer |
| 2026-09-24 | CONTENT-006 | Trúc + Codex | Trúc xác nhận “clip oke” cho video `Trước cơn bão`; cập nhật phiếu 28 cue như kiểm tra nghe/xem đạt theo executor | Evidence tại `docs/tasks/active/active.md`; next Trúc hoàn thiện điều khoản/permission và chờ Product owner chỉ định reviewer |
| 2026-09-24 | CONTENT-006 | Trúc + Codex | Tạo nhánh riêng và claim task video reference; mỗi task có một executor duy nhất, reviewer/phối hợp không tính là executor | Branch `codex/truc-content-006-video-reference`; Trúc tiếp tục xác minh file, nguồn/license và review artifact |
| 2026-09-23 | DOC-015 | Codex | Push nhánh `codex/phase-9-team-handoff`, mở [PR #7](https://github.com/dotruc1526/suchill/pull/7) vào `main` | Product owner review PR; `.vscode` và secret/build folder không vào Git |
| 2026-09-23 | DOC-015 | Product owner + Codex | Gán Thọ/Trúc/Hưng/Dương/Vinh vào năm lane và planned task ownership | Team ownership, task board/card; tạo branch riêng và PR tài liệu |
| 2026-09-23 | DOC-014 / CONTENT-009 | Codex | Kiểm tra trước GitHub và tạo task nghiên cứu sơ bộ cho Member 1 ngoài milestone code | Build pass; typecheck baseline 18 lỗi; 59 Markdown links OK; Product owner review DOC-014 |
| 2026-09-23 | DOC-013 | Codex | Đồng bộ rule duyệt từng milestone, AI tự tìm task theo vai trò; bổ sung 6 blocked cards thiếu | 57 Markdown files: 0 local link lỗi; 0 card active/blocked/review lệch; Product owner review |
| 2026-09-23 | DOC-012 / CONTENT-008 | Product owner + Codex | Chốt phạm vi kháng chiến chống Mỹ ở Việt Nam; MVP đầu tiên một chapter mẫu nhiều lesson | Cập nhật product scope, Phase 1 addendum, roadmap và curriculum task cho Member 1 |
| 2026-09-23 | DOC-011 / CONTENT-007 | Product owner + Codex | Member 2 sản xuất video theo kịch bản cho bài học MVP; tách khỏi FE-006 player và CONTENT-006 reference | CONTENT-007 blocked chờ pilot/script/source; Member 4 tích hợp sau media review |
| 2026-09-23 | DOC-010 | Product owner | Duyệt Phase 9; spec-first freeze kết thúc, M0 được mở | Phase 9 spec/brief và task card chuyển APPROVED/DONE; next M0-00 |
| 2026-09-23 | DOC-010 | Codex | APP-PLAN giữ cấu trúc; sửa dòng pilot/Genève và next steps; hướng dẫn xem tiến độ từng người qua board/card | Links và diff check OK; Product owner review Phase 9 |
| 2026-09-23 | DOC-010 | Codex | Bổ sung phân công năm người, quy tắc chạy song song và security timing trong Phase 9; hoàn tác sửa APP-PLAN theo phản hồi | Product owner review Phase 9; APP-PLAN giữ nguyên bản cũ |
| 2026-09-22 | DOC-010 | Codex | Harden context: cập nhật AGENTS, Architecture, README; thêm team ownership và task cards | `AGENTS.md`, `ARCHITECTURE.md`, `docs/project/TEAM-OWNERSHIP.md`, `docs/tasks/`; Product owner review Phase 9 |
| 2026-09-22 | DOC-009 / DOC-010 | Product owner + Codex | Phase 8 approved; tạo Phase 9 implementation roadmap để review | `08-qa-accessibility-release-spec.md`, `09-implementation-roadmap.md` |
| 2026-09-22 | DOC-008 / DOC-009 | Product owner + Codex | Phase 7 approved; tạo Phase 8 QA/accessibility/release gate spec để review | `07-progress-reward-analytics-spec.md`, `08-qa-accessibility-release-spec.md` |
| 2026-09-22 | DOC-007 / DOC-008 | Product owner + Codex | Phase 6 approved; tạo Phase 7 progress/reward/analytics spec để review | `06-database-service-spec.md`, `07-progress-reward-analytics-spec.md` |
| 2026-09-22 | DOCS-STRUCTURE / DOC-007 | Codex | Tách specs chung khỏi feature Visual Novel; mở rộng Phase 6 brief bằng ví dụ và glossary | `docs/README.md`, `docs/specs/`, `docs/features/` |
| 2026-09-22 | DOC-006 / DOC-007 | Product owner + Codex | Phase 5 approved; tạo Phase 6 Supabase/database/service spec để review | `05-domain-type-contract.md`, `06-database-service-spec.md` |
| 2026-09-22 | DOC-005 / DOC-006 | Product owner + Codex | Phase 4 approved; tạo Phase 5 domain/type contract để review | `04-player-state-spec.md`, `05-domain-type-contract.md` |
| 2026-09-22 | PLATFORM-001 | Product owner | Duyệt PWA trước; Capacitor chỉ xem xét sau khi PWA ổn định | `docs/platform/APP-DEPLOYMENT-PLAN.md` |
| 2026-09-22 | FE-009 / DOC-005 | Product owner | Bổ sung yêu cầu UI bắt mắt, animation, âm thanh chạm và bo góc nhất quán | Phase 4 brief/spec và app plan đã cập nhật |
| 2026-09-22 | FE-010 | Product owner | Yêu cầu function/component tái sử dụng và tối ưu hiệu năng | `docs/engineering/UI-UX-ENGINEERING-GUIDE.md` |
| 2026-09-22 | PLATFORM-001 / BATTLE-001 | Codex | Chốt hướng Web/PWA/Capacitor và ghi nhận AI Battle đang phát triển | `docs/platform/APP-DEPLOYMENT-PLAN.md`, `docs/features/ai-battle/README.md` |
| 2026-09-22 | DOC-004 | Codex | Phase 3 historical/media governance đã tạo; Genève demo được giữ là non-canonical fixture | Chờ Product owner duyệt Phase 3 |
| 2026-09-22 | DOC-004 | Codex | Phase 3 approved; thêm video reference với ba hướng tích hợp và checklist cải thiện | CONTENT-006 ready |
| 2026-09-22 | DOC-003 | Codex | Phase 2 approved; mở Phase 3 về historical/media governance | DOC-004 bắt đầu |
| 2026-09-21 | DOC-003 | Codex | Đã thêm scenario-driven authoring, role patterns và 4 choice types | Chờ Product owner review |
| 2026-09-21 | DOC-002 | Codex | Phase 1 approved; bổ sung multi-format lesson, video và account streak | Phase 2 mở |

## Task card template

Dùng [TASK-TEMPLATE.md](../tasks/TASK-TEMPLATE.md). Task `READY`, `IN PROGRESS` hoặc `REVIEW` phải có card trong `docs/tasks/active/`; `BLOCKED` ở `docs/tasks/blocked/`; đã được reviewer xác nhận thì chuyển sang `docs/tasks/done/`.

## Quy tắc giao task cho AI

Thành viên có thể bắt đầu bằng câu “Tôi là Thọ/Trúc/Hưng/Dương/Vinh; hãy đọc tài liệu và tìm việc tiếp theo cho tôi.” AI tự đối chiếu [phân vai](./TEAM-OWNERSHIP.md), milestone đang mở, bảng task và card để chỉ ra ID, mục tiêu, dependency, file được claim, acceptance và bước đầu tiên. Nếu chưa có việc hợp lệ, AI nêu blocker, người cần quyết định và việc chuẩn bị được phép; không yêu cầu thành viên tự đoán ID.

Prompt giao việc nên có:

```text
Task ID: FE-005
Đọc trước: AGENTS.md, docs/README.md, docs/project/TASK-BOARD.md, ARCHITECTURE.md, task card và specs được task liên kết
Scope: chỉ làm các file/modules được ghi trong task
Không làm: không mở rộng sang task khác, không đổi contract chưa duyệt
Acceptance: đọc từ task card
Trước khi sửa: claim owner/executor/reviewer/branch/files và chuyển status phù hợp
Khi làm: cập nhật checkpoint theo acceptance checklist, không dùng phần trăm cảm tính
Khi xong: chuyển REVIEW, cập nhật evidence/handoff; reviewer mới chuyển DONE
```

AI phải đọc task board trước khi làm việc. Nếu task `BLOCKED` hoặc dependency chưa `DONE/APPROVED`, AI không tự ý bỏ qua; phải ghi blocker và dừng ở phạm vi an toàn.

## Definition of Done cho task

- Acceptance criteria đạt.
- File/module thay đổi được ghi lại.
- Không tạo conflict với task khác.
- Typecheck/build/test phù hợp đã chạy hoặc ghi rõ vì sao chưa chạy.
- Content task có review/source status.
- Backend task có migration/RLS/security evidence.
- Task board cập nhật status, evidence và handoff note.
