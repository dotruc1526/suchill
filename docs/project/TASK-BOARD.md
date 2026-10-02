# Sử Chill — Shared Task Board

> Last updated: 2026-10-02\
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

Phase 9 đã được product owner duyệt ngày 2026-09-23; `SPEC-FIRST FREEZE` kết thúc. Product owner đã duyệt đóng M0 và mở Milestone 1 ngày 2026-09-28:

- Phase 0 và Phase 1: `APPROVED`.
- Phase 2: `APPROVED`.
- Phase 3: `APPROVED`.
- Phase 4: `APPROVED`.
- Phase 5: `APPROVED`.
- Phase 6: `APPROVED`.
- Phase 7: `APPROVED`.
- Phase 8: `APPROVED`.
- Phase 9: `APPROVED`.
- Task implementation chỉ bắt đầu khi dependency đạt, có task card, owner/reviewer và file claim. M2–M7 chỉ mở sau khi Product owner duyệt gate milestone trước trên board này.
- Demo Genève vẫn là fixture kỹ thuật; pilot canonical cần content/historical review riêng.

### Milestone gate

| Milestone | Trạng thái | Điều kiện để mở milestone kế tiếp | Product owner approval |
|---|---|---|---|
| M0 | DONE | Typecheck/build/test, canonical/legacy boundary và client-secret scan đã đạt | Product owner approved close, 2026-09-28; evidence: `fe4072b`, GitHub Quality run #31 success, local `npm run quality` pass with Chrome |
| M1 | DONE | Gate M1 trong Phase 9 có evidence và reviewer kiểm tra | Product Owner nghiệm thu M1-07 và M1-08; approved close, 2026-09-29; evidence: PR #53/#56, QA keyboard 26 checkpoints, quality PASS và ảnh 375px/430px |
| M2 | DONE | Ba gate Phase 9 đạt; M2-01..06 đã được reviewer nghiệm thu và Quality pass | Product Owner Dương approved close, 2026-10-01; evidence: PR #70 / `a4d22b2`, DOC-018 |
| M3 | OPEN | Learning frontend hoàn chỉnh trên mock services theo Gate M3 | Product Owner Dương approved open, 2026-10-01; M3 tasks chỉ bắt đầu sau claim hợp lệ |
| M4–M7 | LOCKED | Mở từng milestone sau khi milestone trước được duyệt | Chưa có |

`DONE` của từng task không tự mở milestone tiếp theo. Executor ghi evidence theo gate Phase 9; reviewer/QA kiểm tra; Product owner duyệt rõ ràng và ghi ngày, evidence, milestone được mở vào bảng này trước khi nhóm bắt đầu implementation milestone kế tiếp. Content track có task/dependency riêng: Member 1 có thể nhận `CONTENT-009` nghiên cứu nguồn sơ bộ trong khi M0 đang mở; việc đó không mở milestone implementation hoặc chốt nội dung canonical.

## Product scope

Sử Chill dạy giai đoạn kháng chiến chống Mỹ ở Việt Nam qua nhiều chapter và lesson đa định dạng. MVP đầu tiên là **một chapter mẫu gồm nhiều lesson**; pilot episode và video là các phần trong chapter, không phải toàn bộ sản phẩm. Thọ (Member 1) lập curriculum map và product owner chọn chapter/pilot; không tự lấy demo Genève hoặc ví dụ cũ làm nội dung canonical.

## Project snapshot

### Đã có

- React/Vite/Tailwind app shell.
- Chapter, lesson, quiz, profile, practice và AI screen demo.
- Visual Novel demo Genève/vĩ tuyến 17.
- Domain types v2, validators, service interfaces, mock adapters, legacy mapper và contract tests của M2.
- AI Battle đang được một nhánh của nhóm phát triển; chưa tích hợp vào app chính.
- Supabase `.env.local` local-only.
- Bộ docs và approval brief.

### Chưa có

- Canonical pilot episode được product owner chọn và qua review.
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
| DOC-011 | 9 clarification | MVP video production ownership | Codex | DONE | DOC-010 | [`docs/tasks/done/DOC-011.md`](../tasks/done/DOC-011.md) | Product owner review phân công Member 2, CONTENT-007 và release gate |
| DOC-012 | Product scope | Giới hạn curriculum vào kháng chiến chống Mỹ tại Việt Nam | Codex | DONE | DOC-010, DOC-002 | [`docs/tasks/done/DOC-012.md`](../tasks/done/DOC-012.md) | Product owner review phạm vi dài hạn và MVP một chapter mẫu nhiều lesson |
| DOC-013 | Documentation | Rà soát quy tắc milestone và cách AI tự tìm task theo vai trò | Codex | DONE | DOC-010 | [`docs/tasks/done/DOC-013.md`](../tasks/done/DOC-013.md) | Product owner review; 57 Markdown files có 0 link lỗi, 0 card active/blocked/review lệch |
| DOC-014 | GitHub readiness | Kiểm tra file chuẩn bị đưa lên GitHub và làm rõ content track Member 1 | Codex | DONE | DOC-010 | [`docs/tasks/done/DOC-014.md`](../tasks/done/DOC-014.md) | Product owner review; build pass, typecheck baseline còn lỗi, CONTENT-009 READY |
| DOC-015 | Team handoff | Gán tên 5 thành viên và tạo PR tài liệu trên nhánh riêng | Codex | DONE | DOC-010 | [`docs/tasks/done/DOC-015.md`](../tasks/done/DOC-015.md) | [PR #7](https://github.com/dotruc1526/suchill/pull/7) đã mở vào `main`; Product owner review |
| DOC-016 | Milestone gate | Ghi quyết định Product owner đóng M0 và mở M1 | Product owner | DONE | M0-00..07 | [`docs/tasks/done/DOC-016.md`](../tasks/done/DOC-016.md) | M0 đóng/M1 mở ngày 2026-09-28; source-of-truth và handoff đã đồng bộ |
| DOC-018 | Milestone gate | Audit Gate M2, đóng M2 và mở M3 | Dương (Product Owner) + Codex | DONE | M2-01..06 | [`docs/tasks/done/DOC-018.md`](../tasks/done/DOC-018.md) | Ba gate M2 đạt trên `a4d22b2`; Product Owner duyệt đóng M2/mở M3 ngày 2026-10-01 |
| DOC-017 | Documentation sync | Rà và đồng bộ task/content docs tách khỏi PR #61 | Dương (Member 4); Codex executor | REVIEW | PR #61 merged; `fd52278` reference | [`docs/tasks/active/DOC-017.md`](../tasks/active/DOC-017.md) | PR62 merged `85b79a9`; Hưng post-merge scope ACCEPTED trên `1dcba50`. Audit 2026-10-02 giữ content REVIEW/production BLOCKED; Thọ và Trúc confirmed current card states 2026-10-02, chờ task-level closure; [evidence](../tasks/evidence/DOC-017-closeout.md) |
| M1-01 | Design system | Figma handoff và token contract | Trúc (Member 2) | DONE | Gate M0 | [`docs/tasks/done/M1-01.md`](../tasks/done/M1-01.md) | Handoff đã được Hưng triển khai trong FE-003; Vinh QA xác nhận sau merge PR #33 |

### B. Frontend implementation — theo dependency và milestone gate Phase 9

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| M3-UX-01 | M3 design handoff | UI/UX handoff lesson, Visual Novel, video và quiz | Trúc (Member 2); Codex hỗ trợ | DONE | DOC-018; M1 foundation DONE; M2-01..06 DONE; DOC-005/006/009 | [Task card](../tasks/done/M3-UX-01.md); `docs/engineering/M3-UX-HANDOFF.md`, `docs/engineering/m3-ux/` | PR #77 merged; Hưng/Vinh approved, Dương nhận handoff và Product Owner nghiệm thu tại head `23cf354`; CONTENT-007 vẫn BLOCKED riêng. |
| M3-UX-02 | M3 Home visual follow-up | Khôi phục Home theo ảnh cũ, giữ service journey PR #72 | Trúc; Codex executor | DONE | M3 OPEN; M1/M2 DONE; PR #72/#77 merged | [Card](../tasks/done/M3-UX-02.md) | PR #82 merged `30d0a4f` + FE-011 greeting trên main `8131f05`; Dương consumer ACCEPTED 2026-10-02 (Start/Resume, Back/focus, 375/430px); Hưng UI/tokens ACCEPTED 2026-10-02, không blocker; Vinh checkpoint/focus QA PASS qua text review Dương cung cấp; cả ba scope accepted, DONE; M3 vẫn OPEN |
| FE-001 | Foundation | Sửa TypeScript baseline | Hưng (Member 3) | DONE | DOC-010 | [`docs/tasks/done/FE-001.md`](../tasks/done/FE-001.md) | Đã sửa 18 lỗi typecheck; PR #12/#13 merged vào main; Vinh nghiệm thu M0-02, card đồng bộ ngày 2026-09-28 |
| FE-002 | Foundation | Chọn canonical features architecture và cô lập legacy | Hưng (Member 3) | DONE | FE-001, DOC-010 | [`docs/tasks/done/FE-002.md`](../tasks/done/FE-002.md) | Vinh nghiệm thu: 10 screens trong legacy, không import runtime; `npm run quality` pass ngày 2026-09-28 |
| FE-003 | Design system | Chuẩn hóa tokens và UI primitives (M1-02) | Hưng (Member 3) | DONE | M1-01, FE-001, DOC-010 | [`docs/tasks/done/FE-003.md`](../tasks/done/FE-003.md) | PR #33 merged vào `main`; Vinh QA xác nhận `npm run quality` pass sau merge |
| M1-04 | Layout/navigation | Nghiệm thu TopBar/BottomNav canonical và mobile safe-area | Hưng (Member 3) | DONE | M0-04, FE-003 | [`docs/tasks/done/M1-04.md`](../tasks/done/M1-04.md) | PR #40 scope-correct; quality pass; Vinh QA xác nhận safe-area/touch target/navigation evidence |
| M1-05 | Interaction foundation | Motion tokens, reduced motion, sound service và mute preference | Hưng (Member 3) | DONE | M1-01 | [`docs/tasks/done/M1-05.md`](../tasks/done/M1-05.md) | Được triển khai và review trong PR #33; chỉ là foundation, không đóng FE-009 |
| M1-06 | Component QA | QA showcase UI foundation và accessibility | Vinh (Member 5); Trúc review UI/UX | DONE | FE-003, M1-04, M1-05 | [`docs/tasks/done/M1-06.md`](../tasks/done/M1-06.md) | Vinh QA evidence complete; `npm run quality` pass; Product Owner đóng M1 và mở M2 ngày 2026-09-29. |
| M1-07 | Gate remediation | Sửa narrative choice semantics, Modal focus lifecycle và token hard-code | Hưng (Member 3); Trúc UI/UX review; Vinh accessibility/QA | DONE | M1-01, FE-003, M1-04, M1-05, M1-06 | [`docs/tasks/done/M1-07.md`](../tasks/done/M1-07.md) | PR #53 merged; Hưng/Trúc/Vinh approved; QA keyboard 26 checkpoints và full quality PASS; Product Owner nghiệm thu ngày 2026-09-29. |
| M1-08 | UI remediation | Khôi phục visual intent PR #40, chuẩn hóa icon và typography | Trúc (Member 2); Hưng/Vinh/PO review | DONE | M1-01, FE-003, M1-04, M1-06 | [`docs/tasks/done/M1-08.md`](../tasks/done/M1-08.md) | PR #56 merged as `0661047`; Hưng/Vinh không còn blocker; Product Owner nghiệm thu ảnh 375px/430px ngày 2026-09-29. |
| FE-004 | App shell | Tách navigation/view state khỏi App quá lớn | Hưng (Member 3); Codex bổ sung theo yêu cầu Vinh | DONE | FE-001, DOC-005, DOC-006 | [`docs/tasks/done/FE-004.md`](../tasks/done/FE-004.md) | `tab/view` state ở hook riêng, App 87 dòng; quality + navigation smoke pass; Vinh nghiệm thu ngày 2026-09-28 |
| FE-005 / M3-03 | VN engine | Xây player v2 trên mock adapter | Dương (Member 4); Codex executor | DONE | M1 DONE, M2 DONE, M3 OPEN | [`docs/tasks/done/M3-03.md`](../tasks/done/M3-03.md) | PR #74 merged `fc00d65`; Hưng approved head `7fabea3`, Vinh approved progress/QA, 2/2 Quality PASS; integration vẫn là task riêng. |
| FE-006 / M3-04 | Video | Xây video-led lesson player trên resolved mock media | Dương (Member 4); Codex executor | DONE | M1 DONE, M2 DONE, M3 OPEN | [`docs/tasks/done/M3-04.md`](../tasks/done/M3-04.md) | PR #75 merged `78cdaa5`; Hưng/Vinh approved head `0636c89`, 2/2 Quality PASS; canonical media vẫn chờ CONTENT-007. |
| FE-007 / M3-05 | Quiz | Practice/scored quiz flow trên trusted mock contract | Dương (Member 4); Codex executor | DONE | M1 DONE, M2 DONE, M3 OPEN | [`docs/tasks/done/M3-05.md`](../tasks/done/M3-05.md) | PR #76 merged; Hưng/Vinh approved head `fc7a830`, 2/2 Quality PASS; không client grading/reward. |
| FE-008 | Profile | Hiển thị account XP/streak/achievement | Dương (Member 4) | BACKLOG | FE-004, BE-003 | `src/features/profile/` | Dữ liệu lấy qua service; sync đúng account |
| FE-009 | Feature interaction adoption & polish | Áp dụng foundation M1-05 vào các feature screens: motion, states, radius, sound và mobile performance | Hưng (Member 3); Trúc/Dương phối hợp | BACKLOG | M1-05, FE-005, FE-006, FE-007, FE-008, DOC-005, DOC-009 | `src/features/`, `src/components/ui/` | Chỉ claim sau khi các feature screen tồn tại; không làm lại sound/reduced-motion foundation từ PR #33 |
| FE-010 | Engineering quality | Chuẩn hóa reusable components/functions và performance budget | Hưng (Member 3); Vinh phối hợp | BACKLOG | FE-001, FE-002, FE-003, DOC-006 | `src/components/`, `src/features/`, `src/services/`, `src/types/` | Không gọi DB trong UI; logic dùng chung có test; lazy-load/media optimization; không abstraction thừa |
| FE-011 | M3 personalization | Lời chào Home theo tên người dùng | Dương (Member 4); Codex executor; Vinh/Hưng review | DONE | M2-01, M2-03, M2-04 DONE; M3 OPEN | [Card](../tasks/done/FE-011.md) | PR #81 merged `a7db965`; Hưng/Vinh APPROVE runtime `17dd847` bằng text; Dương cho phép dismiss review cũ và admin merge. Quality 2/2 PASS head `3c1673c`; M3 vẫn OPEN. |
| M3-01 | M3 learning journey | Home/chapter/lesson journey trên mock services | Dương (Member 4); Codex executor | DONE | M1 DONE, M2 DONE, M3 OPEN | [`docs/tasks/done/M3-01.md`](../tasks/done/M3-01.md) | PR #72 merged; Vinh approved và Hưng xác nhận không còn finding tại head `71cbad2`; 2/2 Quality PASS. |
| M3-02 | M3 lesson renderer | Standard/mixed lesson renderer trên mock services | Dương (Member 4); Codex executor | DONE | M2 DONE, M3 OPEN | [`docs/tasks/done/M3-02.md`](../tasks/done/M3-02.md) | PR #73 merged; Vinh approved và Hưng xác nhận không còn finding tại head `6117578`; 2/2 Quality PASS. |
| M3-INTEGRATION-01 | M3 learning integration | Nối journey/lesson renderer với VN, video và quiz players | Dương (Member 4); Codex executor | DONE | M3-01..05 DONE; M3-UX-01 DONE; M3 OPEN | [`docs/tasks/done/M3-INTEGRATION-01.md`](../tasks/done/M3-INTEGRATION-01.md) | PR #79 merged `a55b924`; Hưng/Vinh approved; 2/2 Quality PASS, gồm browser regression đóng/hoàn tất VN và focus restoration. M3 vẫn OPEN. |
| M3-06 | M3 completion/profile | Completion/profile UI trên mock services | Dương; Codex executor; Hưng/Vinh review | DONE | M3 OPEN; learning integration DONE; adapter DONE / PR92 | [Card](../tasks/done/M3-06.md); [runtime evidence](../tasks/evidence/M3-06-runtime.md) | Service-driven completion/profile implemented; 111 unit/23 component/8 E2E PASS, scan 359/0; Vinh service/reward/QA ACCEPTED (text) and Hưng architecture/UI/a11y APPROVED (text); PR94 merged 20e3263, final head e5604e0 CI 2/2 PASS. M3-07 accepted/merged via PR98; Gate M3 awaits PO audit |
| M3-COMPLETION-01 | M3 mock services | Completion/account-summary adapter và tests D1–D7 | Vinh (Member 5); Codex executor | DONE | M3 OPEN; M3-01..05/integration DONE; PR84 agreement `5144fa2` | [card](../tasks/done/M3-COMPLETION-01.md) | PR88 merged a339af6; Hưng accepted contract/architecture runtime 68580ed, Dương approved consumer; merged head e6a3940 CI 2/2 PASS, quality 95/22/7, scan 338/0. Adapter handed off; M3-06 READY for Dương UI claim. |

| M3-07 | M3 QA | Kiểm thử tương tác toàn bộ learning loop | Vinh; Codex executor; Hưng/Dương review | DONE | M3-01..06, integration, QA-001/002 DONE | [Card](../tasks/done/M3-07.md); [evidence](../tasks/evidence/M3-07-learning-loop.md) | Hưng/Dương text ACCEPTED head1541cb9; PR98 merged f0a2bdf, CI2/2 SUCCESS, quality117/23/9 and scan365/0. Both P2 resolved; Gate M3 awaits separate PO decision. |
| M3-07-A11Y-01 | M3 accessibility remediation | Shared loading/error announcements and reduced motion | Vinh; Codex executor; Hưng/Dương review | DONE | M1 shared states DONE; M3-07 P2 confirmed | [Card](../tasks/done/M3-07-A11Y-01.md) | Hưng/Dương text ACCEPTED1541cb9; role/status/error and none/spin/none assertions pass375/430px; PR98 merged f0a2bdf. No milestone gate decision. |
| M3-CONTRACT-REVIEW-01 | M3 historical proposal | G2/G5 review archival | Vinh; Codex bookkeeping | CANCELLED | Superseded by D1–D7 PR84 and accepted adapter/UI | [Archive](../tasks/archived/M3-CONTRACT-REVIEW-01.md) | Historical draft preserved; cancellation does not imply reviewer acceptance of proposal; no runtime blocker. |
| M3-GATE-01 | M3 gate handoff | QA closeout and evidence for Product Owner audit | Vinh prepares; Hưng technical review; Dương PO decision | REVIEW | M3-01..07 and remediation DONE | [Card](../tasks/active/M3-GATE-01.md) | Three technical gate checks have PASS evidence on f0a2bdf; docs/PO review pending. M3 OPEN/M4 LOCKED until explicit PO decision. |
| M3-STATUS-01 | M3 docs | Đồng bộ trạng thái/owner/next action | Dương; Codex executor; Hưng/Vinh review | DONE | M3 OPEN; PR83/88 đã đối chiếu | [Card](../tasks/done/M3-STATUS-01.md) | PR90 merged e7e8aac; Hưng delta APPROVE, Vinh docs/service APPROVE; acceptance head 65c82d2 Quality 2/2 PASS; reviewer-authorized closeout, M3 OPEN |

### C. Backend and Supabase — theo dependency và milestone gate Phase 9

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| M2-01 | M2 domain contract | Triển khai domain types v2 theo Phase 5 | Vinh (Member 5); Codex executor | DONE | Gate M2 open, M0 DONE, DOC-006 | [`docs/tasks/done/M2-01.md`](../tasks/done/M2-01.md) | Hưng ACCEPTED 2026-09-30 trên main `7175bda`; type contract và consumer corrections đạt. Gate M2 do PO quyết riêng. [Review/evidence](../tasks/done/M2-01.md#reviewer-acceptance--2026-09-30) |
| M2-02 | M2 validators | Kiểm tra lesson/story/media và tham chiếu nguồn trước publish | Vinh (Member 5); Codex executor | DONE | M2-01 merged | [`docs/tasks/done/M2-02.md`](../tasks/done/M2-02.md) | Hưng ACCEPTED 2026-09-30 trên main `7175bda`; validators fail closed cho publication lookup. Gate M2 do PO quyết riêng. [Review/evidence](../tasks/done/M2-02.md#reviewer-acceptance--2026-09-30) |
| M2-03 | M2 service contracts | Hoàn thiện interface domain-facing cho learning services | Vinh (Member 5); Codex executor | DONE | M2-01 merged | [`docs/tasks/done/M2-03.md`](../tasks/done/M2-03.md) | Hưng ACCEPTED 2026-09-30 trên main `7175bda`; document/practice/per-question contracts và consumer fit đạt. Gate M2 do PO quyết riêng. [Review/evidence](../tasks/done/M2-03.md#reviewer-acceptance--2026-09-30) |
| M2-04 | M2 mock adapters | Mở rộng mock adapters theo contract cho feature dùng không cần Supabase | Vinh (Member 5) + Dương (Member 4); Codex executor backend adapter | DONE | M2-03 implemented on this branch | [`docs/tasks/done/M2-04.md`](../tasks/done/M2-04.md) | Hưng ACCEPTED 2026-09-30 trên main `7175bda`; published reads, session isolation and quiz boundaries pass. Gate M2 do PO quyết riêng. [Review/evidence](../tasks/done/M2-04.md#reviewer-acceptance--2026-09-30) |
| M2-05 | M2 legacy boundary | Mapper tường minh cho demo legacy sang domain v2 | Vinh (Member 5); Codex executor | DONE | M2-01 merged | [`docs/tasks/done/M2-05.md`](../tasks/done/M2-05.md) | Hưng ACCEPTED 2026-09-30 trên main `7175bda`; Dương consumer boundary đạt, demo giữ fixture-only. Gate M2 do PO quyết riêng. [Review/evidence](../tasks/done/M2-05.md#reviewer-acceptance--2026-09-30) |
| M2-06 | M2 contract tests | Kiểm tra validators và mock/domain contract theo fixture | Vinh (Member 5); Codex executor | DONE | M2-02, M2-03, M2-04 implemented on this branch | [`docs/tasks/done/M2-06.md`](../tasks/done/M2-06.md) | Hưng ACCEPTED 2026-09-30 trên main `7175bda`; contract regressions pass. Gate M2 do PO quyết riêng. [Review/evidence](../tasks/done/M2-06.md#reviewer-acceptance--2026-09-30) |
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
| CONTENT-003 | 3 | Historical source/media review pilot | Trúc (Member 2) | REVIEW | CONTENT-002, DOC-004 | [`docs/tasks/active/CONTENT-003.md`](../tasks/active/CONTENT-003.md) | Historical review được hash-bind cho screenplay/narration; source registry, media/audio rights và handoff còn pending. Không mở production |
| CONTENT-004 | 5 | Viết screenplay scene-by-scene và kịch bản/storyboard video | Thọ (Member 1) | REVIEW | CONTENT-003, CONTENT-008, DOC-006 | [`docs/tasks/active/CONTENT-004.md`](../tasks/active/CONTENT-004.md) | Historical/technical accepted; Trúc media/handoff review recorded 2026-10-02 (authoring scope); media rights/audio/final assets still pending; no production |
| CONTENT-005 | 8 | Content QA và Vietnamese language review | Vinh (Member 5); Thọ phối hợp | BLOCKED | CONTENT-004, CONTENT-007, DOC-009 | [`docs/tasks/blocked/CONTENT-005.md`](../tasks/blocked/CONTENT-005.md) | Không còn critical content issue; video/caption/transcript khớp kịch bản |
| CONTENT-006 | 3/4 | Review và phát triển `episode-portrait-final.mp4` | Trúc (Member 2) | IN PROGRESS | DOC-004 | [`docs/tasks/active/CONTENT-006.md`](../tasks/active/CONTENT-006.md) | Trúc là executor và historical/media reviewer; Thọ cấp quyền review objective/wording; Product owner cấp quyền chốt media/legal; media/legal chốt `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`; 4 claim VERIFIED, 1 claim REVISION_REQUIRED_BEFORE_USE |
| CONTENT-007 | MVP video | Biên tập video theo kịch bản và bàn giao cho bài học canonical | Trúc (Member 2) | BLOCKED | CONTENT-003, CONTENT-004, DOC-004 | [`docs/tasks/blocked/CONTENT-007.md`](../tasks/blocked/CONTENT-007.md) | Một số artifact đã hash-bound historical approval; source/media/audio rights và handoff còn pending; chưa được bắt đầu production |
| CONTENT-008 | MVP curriculum | Lập bản đồ chapter mẫu gồm nhiều lesson đa định dạng | Thọ (Member 1) | DONE | CONTENT-002, DOC-003, DOC-012 | [`docs/tasks/done/CONTENT-008.md`](../tasks/done/CONTENT-008.md) | Learning objectives, lesson order/format và pilot episode/video placement rõ; historical reviewer kiểm tra scope |
| CONTENT-009 | Nghiên cứu nguồn sơ bộ | Thọ lập danh mục nguồn/chủ đề ứng viên trong phạm vi kháng chiến chống Mỹ | Thọ (Member 1) | DONE | DOC-003, DOC-004 | [`docs/tasks/done/CONTENT-009.md`](../tasks/done/CONTENT-009.md) | Đã hoàn tất nghiên cứu 4 chủ đề và Review Round 3 (Final Adversarial Review); sẵn sàng bàn giao cho Product Owner (CONTENT-002) và Historical Reviewer (CONTENT-003) |
| CONTENT-010 | MVP curriculum | Nội dung Bài 2 (Interactive Map - Sấm sét nội đô) | Thọ (Member 1) | REVIEW | CONTENT-008 | [docs/tasks/active/CONTENT-010.md](../tasks/active/CONTENT-010.md) | Interactive lesson/story synced; map pending; Trúc media/handoff review recorded 2026-10-02; rights/assets still pending |
| CONTENT-011 | MVP curriculum | Nội dung Bài 3 (Standard) & Bài 4 (Synthesis) | Thọ (Member 1) | REVIEW | CONTENT-008 | [docs/tasks/active/CONTENT-011.md](../tasks/active/CONTENT-011.md) | Historical review đạt; Vinh recheck ACCEPTED (PR #100 merged 9b96968); Trúc media/handoff review recorded 2026-10-02; Hưng recheck ACCEPTED; PO production handoff pending |
| CONTENT-012 | MVP curriculum | Đóng gói Ngân hàng câu hỏi (Quiz Schema) | Thọ (Member 1) | REVIEW | CONTENT-008 | [docs/tasks/active/CONTENT-012.md](../tasks/active/CONTENT-012.md) | Trúc APPROVED historical/learning scope cho quiz hash `4013b399…667eb` 2026-10-02 (verdict riêng, không suy từ CONTENT-010); chờ Vinh technical QA; không seed/integrate |
| CONTENT-013 | Lập khung giáo trình Chapter Điện Biên Phủ trên không 1972 | Thọ (Member 1) | DONE | CONTENT-009 | [docs/tasks/done/CONTENT-013.md](../tasks/done/CONTENT-013.md) | Product Owner sign-off APPROVED ngày 2026-09-28; curriculum map đã bàn giao |
| CONTENT-014 | MVP authoring remediation | Hoàn thiện gói authoring Mậu Thân sau PR #21 | Trúc (Member 2) | REVIEW | DOC-003, DOC-004, DOC-006, DOC-009 | [docs/tasks/active/CONTENT-014.md](../tasks/active/CONTENT-014.md) | Hưng recheck độc lập ACCEPTED review-state sync 2026-10-02 [recheck](../tasks/evidence/CONTENT-014-hung-recheck-2026-10-02.md) + Vinh recheck ACCEPTED (PR #100 merged 9b96968, Trúc đã review ghi nhận); quiz verdict + authoring sign-off Trúc in PR99; Vinh QA/Hưng acceptance/Trúc handoff in PR103, integration next; media/legal/production pending |
| CONTENT-015 | Kịch bản chi tiết Bài 1 Chapter 1972 (Tối hậu thư từ bầu trời) | Thọ (Member 1) | DONE | CONTENT-013 | [docs/tasks/done/CONTENT-015.md](../tasks/done/CONTENT-015.md) | Thọ đã hoàn thành kịch bản 5 cảnh 110s, VTT captions và nguồn chính thống |
| CONTENT-016 | Flagship Visual Novel coverage | Mỗi chapter canonical có ít nhất một flagship Visual Novel; brief Lesson 2 SAM-2 chapter 1972 | Thọ (Member 1); Codex soạn; Trúc review | DONE | CONTENT-013, CONTENT-015, DOC-003, DOC-004 | [docs/tasks/done/CONTENT-016.md](../tasks/done/CONTENT-016.md) | Thọ và Trúc approve authoring brief; Full Narration, claim wording, StoryVersion JSON và media vẫn cần task/gate riêng; text-first fallback bắt buộc |
| CONTENT-017 | MVP curriculum | Kịch bản chi tiết & Story Data Bài 2 Flagship Visual Novel 1972 (SAM-2 Vạch nhiễu tìm thù) | Thọ (Member 1) | DONE | CONTENT-016 | [`docs/tasks/done/CONTENT-017.md`](../tasks/done/CONTENT-017.md) | PR #54 merged `0075079` 2026-09-30; Trúc APPROVED historical/media, PO APPROVED nghiệm thu; Quality 2/2 SUCCESS; validator PASS trên main; card synced done/ |

### E. QA and release

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| QA-001 | 8 / M3 | Schema/story validation checklist | Vinh (Member 5); Hưng reviewer; Dương consumer | DONE | DOC-006, DOC-009 DONE | [Card](../tasks/done/QA-001.md); [evidence](../tasks/evidence/QA-001-validation.md) | Hưng/Dương ACCEPTED; PR85 merged ed234e9. 17 validation tests PASS; final quality 100 unit/22 component/7 E2E, CI 2/2 PASS. Typed-validator scope only; historical/media/production gates separate. |
| QA-002 | 8 / M3 | Mobile/player interaction test matrix | Vinh; Hưng reviewer; Dương consumer reviewer | DONE | FE-005, FE-006, DOC-009 DONE | [Card](../tasks/done/QA-002.md); [matrix](../tasks/evidence/QA-002-mobile-player-matrix.md) | PR83 merged `cda4a69`; Dương APPROVED `9718317`, Hưng ACCEPTED harness/accessibility trên main merged (76 unit/22 component/7 E2E, scan 332/0); card DONE, M3 OPEN |
| QA-003 | 8 | Supabase RLS/security verification | Vinh (Member 5) | BACKLOG | BE-002, BE-003, DOC-009 | security tests | User cannot read/write another user’s progress |
| QA-004 | 8 | Historical/media release gate | Historical reviewer | BACKLOG | CONTENT-003, CONTENT-005, CONTENT-007 | release checklist | 0 critical historical/source/media issue, gồm video MVP |
| QA-005 | 9 | Pilot release verification | Vinh (Member 5); toàn nhóm phối hợp | BACKLOG | DOC-010, CONTENT-008, CONTENT-007, FE-006, QA-001..004 | release report | MVP có một chapter mẫu nhiều lesson trong phạm vi kháng chiến chống Mỹ và ít nhất một video đã duyệt chạy trong bài học; các acceptance khác pass |
| QA-006 | M3 gate hardening | Chặn E2E Chrome cleanup treo vô hạn và giới hạn thời gian Quality job | Vinh (Member 5); Codex executor | DONE | PR #71 Quality run `36751263388` hung | [`docs/tasks/done/QA-006.md`](../tasks/done/QA-006.md) | Bounded cleanup, page-target wait và 5-minute job timeout đạt; push/pull-request Quality PASS trên `e5d718d` |

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
| CONTENT-003 | Trúc / Trúc | Trúc historical/media; Vinh technical QA | 2026-09-27; review 2026-09-28 | Bổ sung nguồn đọc được cho CLM-MT68-01; chốt review và nguồn audio | Source năm mục tiêu chưa đọc lại được; sign-off/audio còn thiếu | Branch `codex/content-status-sync`; claim 3 tài liệu authoring + card/board/report; [review](../tasks/active/CONTENT-003-004-REVIEW.md); validator PASS |
| CONTENT-012 | Thọ / Trúc | Vinh (QA); Thọ (objective) | 2026-09-27 | Vinh QA quiz sau verdict Trúc (hash `4013b399…667eb`) | authoring-only; không seed/integrate | Branch `feature/content-expansion-mt68`; claim quiz/card; [handoff](../tasks/active/PR21-HANDOFF.md) |
| CONTENT-014 | Trúc / Trúc; Codex hỗ trợ | Vinh technical QA; Hưng recheck độc lập | 2026-09-27 | Integrate PR103 quiz QA/handoff; PO production handoff remains separate | PR này chưa merge (mang verdict + sign-off) | Hưng recheck ACCEPTED (main) + Vinh recheck ACCEPTED (PR #100 merged 9b96968, Trúc reviewed); Trúc media/handoff sign-off trong PR này; validator PASS; [card](../tasks/active/CONTENT-014.md) |
| CONTENT-007 | Trúc, chưa bắt đầu production | Thọ/Product owner + historical reviewer; Vinh media/accessibility | Chưa bắt đầu | Hoàn tất source/media/audio rights, review handoff và dependency riêng; chỉ sau đó mới xem xét claim media output | Một số artifact đã hash-bound historical approval; quiz/map/source/media và production acceptance còn pending | CONTENT-007 remains BLOCKED; CONTENT-006 chỉ REFERENCE_ONLY nội bộ; [card](../tasks/blocked/CONTENT-007.md) |
| CONTENT-006 | Trúc (Member 2) / Trúc | Trúc (historical/media; Thọ cấp quyền objective/wording; Product owner cấp quyền media/legal) | 2026-09-24 | Nếu dùng ngoài `REFERENCE_ONLY`, tạo media package mới: sửa wording, thay/xác minh audio/nhạc/SFX, khóa manifest/hash/source export và review lại | MP4 hiện tại vẫn chứa wording cũ; audio Edge TTS, nhạc/SFX và source export chưa đủ bằng chứng publish | [Evidence và phiếu thực hiện](../tasks/active/active.md): objective accepted; media/legal `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`; 4 claim VERIFIED, 1 claim REVISION_REQUIRED_BEFORE_USE; REFERENCE_ONLY |
| BATTLE-001 | Nhóm AI Battle / nhóm ngoài | Product + Security reviewer | 2026-09-22 | Hoàn thiện prototype và chuẩn bị gói bàn giao | Chưa có repo/branch và contract | Tính năng đang phát triển độc lập |

## Task update log

Mỗi lần handoff quan trọng thêm một dòng mới nhất ở đầu bảng:

| Date | Task | Author | Update | Evidence / next owner |
|---|---|---|---|---|
| 2026-10-02 | CONTENT-004/010/011 | Trúc (Member 2) | Media/handoff review recorded (authoring scope): per-candidate decisions confirmed, text-first fallback sufficient, `mediaRef: null`; rights/audio/final files still pending, "media có quyền" boxes unchecked | [CONTENT-004](../tasks/active/CONTENT-004.md); next Hưng recheck + PO handoff decision; CONTENT-007 BLOCKED, tasks REVIEW |
| 2026-10-02 | PR #99 / CONTENT-017 | Trúc (Member 2) | TEXT APPROVED closeout CONTENT-017 (PR #54 merged `0075079`, Trúc/PO approved, Quality 2/2, validator PASS, card/board/index đồng bộ); không dùng GitHub approve | [CONTENT-017](../tasks/done/CONTENT-017.md); chờ PO xác nhận closeout rồi merge PR #99 |
| 2026-10-02 | CONTENT-012 / CONTENT-014 | Trúc (Member 2) | APPROVED historical/learning scope cho `QUIZ-MT68.json` hash `4013b399…667eb` (verdict riêng, không suy từ CONTENT-010); `reviewStatus` đồng bộ, validator PASS | [CONTENT-012](../tasks/active/CONTENT-012.md); next Vinh QA quiz; CONTENT-004/010/011 chờ Hưng recheck + media/handoff; production BLOCKED |
| 2026-10-02 | CONTENT-017 | Thọ (Member 1) + Codex | PR #54 merged `0075079`: Trúc APPROVED historical/media, PO APPROVED nghiệm thu; Quality 2/2 SUCCESS; re-verified validator PASS trên main; card chuyển done/, board/index đồng bộ | [CONTENT-017](../tasks/done/CONTENT-017.md); M3 vẫn OPEN, production cần gate riêng |
| 2026-10-02 | CONTENT-014 / CONTENT-004/010/011 | Vinh (Member 5) + Codex | Recheck ACCEPTED review-state reconciliation: 8/8 hash khớp card, diff chỉ đổi dòng trạng thái, quiz/map giữ pending đúng, validator PASS; P2 review-state RESOLVED cho 004/010/011 | [CONTENT-014](../tasks/active/CONTENT-014.md); [recheck](../tasks/evidence/CONTENT-014-recheck-2026-10-02.md); Trúc media/handoff + Vinh QA quiz (sau verdict PR #99) còn lại; CONTENT-007 BLOCKED; M3 OPEN/M4 LOCKED |
| 2026-10-02 | CONTENT-014 | Hưng (Member 3 — recheck độc lập) | Recheck ACCEPTED review-state reconciliation: 9/9 reviewed hash khớp, 4/4 current hash khớp, diff đúng 4 dòng trạng thái, quiz/map giữ pending đúng tại base, validator PASS; P2 review-state RESOLVED (kiểm tra độc lập, đồng quan điểm Vinh) | [CONTENT-014](../tasks/active/CONTENT-014.md); [recheck](../tasks/evidence/CONTENT-014-hung-recheck-2026-10-02.md); Trúc media/handoff + Vinh QA quiz (sau verdict PR #99) còn lại; CONTENT-007 BLOCKED; M3 OPEN/M4 LOCKED |
| 2026-10-02 | DOC-017 | Trúc (Member 2 — reviewer) | Xác nhận trạng thái content hiện hành: CONTENT-003/004/010/011/012/014 REVIEW, CONTENT-007 BLOCKED, artifact pilot NEEDS_HISTORICAL_REVIEW; DOC-017 giữ REVIEW | [DOC-017](../tasks/active/DOC-017.md) mục Reviewer confirmation; next reviewer ghi task-level acceptance, giữ production BLOCKED |
| 2026-10-02 | M3-COMPLETION-01 | Hưng (Member 3 — reviewer) | ACCEPTED hai fix `68580ed` (optional-only fail-closed, backwards-day watermark+rollback): 95/22/7 PASS, scan 338/0, sensitivity 3-fail→19/19 | [M3-COMPLETION-01](../tasks/done/M3-COMPLETION-01.md); chờ Dương re-review + CI, giữ REVIEW |
| 2026-10-02 | QA-002 | Hưng (Member 3 — reviewer) | ACCEPTED harness/accessibility trên main `cda4a69`: blank-start/navigate, readiness 20s bounded, reload-loader mới, font fallback, Button 44px; 76/22/7 PASS, scan 332/0; chuyển DONE | [QA-002](../tasks/done/QA-002.md); Dương đã APPROVED, M3 OPEN, không quyết gate |
| 2026-10-02 | CONTENT-014 / CONTENT-012 | Trúc (Member 2) | Đồng bộ historical/language state theo artifact hashes khớp verdict 2026-09-28; quiz giữ `NEEDS_HISTORICAL_REVIEW`, map cũng pending vì report không bound verdict cụ thể | [CONTENT-014](../tasks/active/CONTENT-014.md); Hưng/Vinh recheck PR85; rights/audio/source/handoff pending; CONTENT-007 BLOCKED; M3 OPEN / M4 LOCKED |
| 2026-10-02 | M3-UX-02 | Hưng (Member 3 — reviewer) | UI/tokens ACCEPTED trên main `8131f05`: 0 hex hard-code, icon/typography/targets đạt, ảnh 375/430px đúng phân cấp; typecheck/build/76 unit/22 component/4 E2E PASS, scan 326/0 | [M3-UX-02](../tasks/done/M3-UX-02.md) mục Reviewer acceptance; next Vinh checkpoint/focus QA, giữ REVIEW |
| 2026-10-02 | FE-011 | Dương / Codex | PR #81 merged `a7db965`; ghi nhận hai reviewer APPROVE bằng text và Dương cho phép dismiss review cũ/admin merge; chuyển DONE | [FE-011](../tasks/done/FE-011.md); Quality 2/2 PASS; M3 vẫn OPEN |
| 2026-10-02 | FE-011 | Dương / Codex | Ghi nhận Vinh APPROVE service/QA trên `17dd847` qua review Dương cung cấp; Quality 2/2 success; GitHub vẫn giữ CHANGES_REQUESTED cũ của Hưng, merge bị chặn | [FE-011](../tasks/done/FE-011.md); Hưng/Vinh cập nhật review GitHub, giữ REVIEW |
| 2026-10-02 | FE-011 | Hưng (Member 3 — reviewer) | Re-review head tích hợp `17dd847`: APPROVE UI integration, không blocker; dashboard/focus/tokens/mobile layout đạt; typecheck/build/76 unit/22 component/4 E2E PASS, scan 324/0 | [FE-011](../tasks/done/FE-011.md) mục Reviewer acceptance; next Vinh service/QA review, chưa merge/DONE |
| 2026-10-01 | M3-UX-01 | Trúc / Codex | Push `codex/truc-m3-ui-handoff`, mở PR ready for review; giữ task REVIEW | [PR #77](https://github.com/dotruc1526/suchill/pull/77); LFS upload đạt, merge-tree với main `327bf24` không conflict; Hưng/Vinh/Dương review |
| 2026-10-01 | M3-UX-01 | Trúc / Codex | Thêm điểm nhấn SỬu theo yêu cầu Trúc: hero Chapter/lời chào và mark cạnh tên app trên 6 màn; reuse asset repo có sẵn; trả REVIEW | Browser 20 nhóm PASS, image loading/alt/byte equality và layout đạt; [evidence](../engineering/m3-ux/EVIDENCE.md); Hưng/Vinh/Dương review |
| 2026-10-01 | M3-UX-01 | Trúc / Codex | Reopened theo yêu cầu tự kiểm tra/làm đẹp; polish 6 màn, icon SVG/choice A/B, VN gọn, video controls, panel desktop; trả REVIEW | Browser 19 nhóm PASS ở 375/430px và desktop 1280px; 9 cặp contrast ≥4.5:1; [evidence](../engineering/m3-ux/EVIDENCE.md); Hưng/Vinh/Dương review |
| 2026-10-01 | M3-UX-01 | Trúc / Codex | Hoàn tất UI/UX prototype lesson/VN/video/quiz, flow/state matrix và service/primitive mapping; chuyển REVIEW | Browser 17 nhóm PASS ở 375/430px, typecheck/build PASS; Hưng/Vinh/Dương review; CONTENT-007 vẫn BLOCKED |
| 2026-10-01 | DOC-018 / Gate M2 | Dương (Product Owner) + Codex | Audit ba điều kiện Gate M2 đạt; Product Owner đóng M2 và mở M3. M3 implementation chỉ được bắt đầu theo dependency, task card, reviewer và file claim | PR #70 merge `a4d22b2`; M2-01..06 DONE; [DOC-018](../tasks/done/DOC-018.md); next Dương claim task M3 hợp lệ, Vinh phối hợp contract/QA |
| 2026-09-30 | M2-01..06 | Hưng (Member 3 — reviewer) + Codex | Hưng ghi nghiệm thu task-level ACCEPTED cho cả 6 task M2 trên main `7175bda`; cards chuyển DONE và folder-synced sang `docs/tasks/done/`; board links cập nhật; M2 vẫn OPEN, M3 LOCKED cho đến khi PO audit gate và ghi quyết định | M2-01..06 evidence tại từng card section "Reviewer acceptance — 2026-09-30"; GitHub Quality `7175bda` pass; cards moved via `hung/m2-review-done-sync` branch |
| 2026-09-30 | M2-01/03/04/05/06 | Dương (Member 4) | Consumer review trên `main` tại merge PR #64: CONSUMER FIT: CHANGES REQUESTED với ba P1 (document resolution, practice submission, per-question feedback); M2-05 legacy boundary đạt nhưng không thay sign-off toàn M2 | `main` tại `73d3156`; Hưng quyết contract, Vinh/Codex remediation, Dương re-review; M3 chưa mở; Product Owner quyết gate |
| 2026-09-30 | CONTENT-017 | Thọ (Member 1) | Xử lý triệt để blocker N1, N2, N3 từ review của Dương (Member 4): cập nhật card, dọn sạch 100% link gãy trên board theo DOC-013, đồng bộ wording narration | [`docs/tasks/done/CONTENT-017.md`](../tasks/done/CONTENT-017.md); validator PASS 100% |
| 2026-09-30 | CONTENT-017 | Thọ (Member 1) | Xử lý finding [P1] theo review Trúc: khái quát hóa sơ đồ SAM-2 và Scene 4; cập nhật validator khóa từ ngữ vi mô | [`docs/tasks/done/CONTENT-017.md`](../tasks/done/CONTENT-017.md); validator PASS 100% |
| 2026-09-29 | CONTENT-017 | Thọ (Member 1) | Thọ hoàn thành kịch bản chi tiết 8 scene, sơ đồ khí tài SAM-2 5 node và dữ liệu StoryVersion JSON draft cho Bài 2 Visual Novel 1972; xử lý feedback PO về luồng học tuyến tính đảm bảo đi qua đủ 2 nội dung trước check; mở PR v2 (#54); chuyển REVIEW | [`docs/tasks/done/CONTENT-017.md`](../tasks/done/CONTENT-017.md); `validate-1972-authoring.mjs` PASS 100% |
| 2026-09-29 | M2-02 / M2-06 | Vinh (owner); Codex executor | Review audit found validators could skip existence/approval checks if a published-content lookup was omitted; added fail-closed `lookup_required` issues and regression coverage. All M2 quality checks pass; tasks remain `REVIEW`. | `npm run quality` PASS: typecheck/build; scan 247 files/0 unsafe, unit 27/27, component 9/9, E2E 2/2; Hưng technical review, Dương consumer confirmation, and Product Owner M2 gate remain pending |
| 2026-09-29 | M2-02..06 | Vinh (owner); Codex executor | Hoàn thiện validator bổ sung, service contracts Quiz/User, mock behavior, legacy fixture mapper và contract regression tests; chuyển các task sang `REVIEW`. | `npm run quality` PASS: typecheck/build, scan 245/0 unsafe, unit 26/26, component 9/9, E2E 2/2; không có env/migration/dependency impact; chờ Hưng review và Dương consumer confirmation |
| 2026-09-29 | M2-02/03/05 | Vinh (owner); Codex executor | Tạo card và claim riêng sau khi M2-01 merge; triển khai tiếp trên nền domain contract hiện hành. | Branch `codex/m2-implementation`; validators `src/services/next/validation.ts`, service contracts `contracts.ts`, mapper mới; không có migration/env impact |
| 2026-09-29 | M2-04/06 | Vinh + Dương (consumer reviewer); Codex executor | Claim backend mock adapter and integrated contract tests after defining M2-03 services; Dương consumer confirmation remains a review item. | Branch `codex/m2-implementation`; mock adapter/tests run without Supabase |
| 2026-09-29 | M2-01 / PR #61 | Dương + Codex | Sửa finding P2: đánh dấu `@deprecated` riêng cho toàn bộ legacy exports ở `src/types/index.ts`; giữ demo backward-compatible và task ở `REVIEW`. | `npm run quality` PASS: scan 237/0 unsafe, unit 16/16, component 9/9, E2E 2/2; Hưng review lại contract, Dương xác nhận consumer |
| 2026-09-29 | M2-01 | Codex executor | Hoàn thiện domain types v2 và chuyển `REVIEW`; named block/scene unions, stable ID/version boundary, media/source/progress types và canonical barrel đã sẵn sàng mà không phá demo legacy. | `npm run quality` PASS: scan 237/0 unsafe, unit 16/16, component 9/9, E2E 2/2; Hưng review contract, Dương xác nhận consumer |
| 2026-09-29 | M2-01 | Codex executor; Vinh accountable owner | Tạo và claim task domain types v2 sau khi PR #60 mở M2; claim độc quyền hotspot `src/types/index.ts`, chưa sửa source trong checkpoint này. | [`M2-01`](../tasks/done/M2-01.md); branch `codex/m2-01-domain-types-v2`; next triển khai contract Phase 5 rồi chạy typecheck/test |
| 2026-09-29 | M1 gate / M2 opening | Product Owner | Nghiệm thu M1-07 và M1-08; quyết định `M1 CLOSED, M2 OPEN`. M1-07/M1-08 chuyển `DONE`; M2 được phép bắt đầu theo dependency, task card, owner/reviewer và file claim của Phase 9. | PR #53/#56; [M1-07 QA evidence](../tasks/evidence/M1-07-vinh-keyboard-2026-09-29.md); [M1-08 review evidence](../tasks/evidence/M1-08-review-signoff-2026-09-29.md); ảnh 375px/430px đi cùng card M1-08 |
| 2026-09-29 | FE-011 | Product Owner + Codex | Ghi nhận yêu cầu cá nhân hóa lời chào Home thành `XIN CHÀO, {displayName}` ở M3, không mở rộng scope M1 và không triển khai trước user domain/service contract M2. | Task giữ BACKLOG; fallback `XIN CHÀO`; Dương chỉ claim sau M2-01/03/04 và gate M3, Vinh review contract/QA |
| 2026-09-29 | M1-08 / PR #56 review handoff | Hưng + Vinh; Codex recorded handoff | Hưng/Vinh reported no remaining blocker after review of head `a6f7f7c`; PR #56 merged to `main` as `0661047`. Task remains REVIEW and the milestone gate is unchanged. | [Review evidence](../tasks/evidence/M1-08-review-signoff-2026-09-29.md); next Product Owner visual acceptance and M1 gate audit; M2 remains LOCKED |
| 2026-09-29 | M1-08 / streak layout | Trúc + Codex | Reopened from REVIEW for Product Owner visual feedback; moved the seven-day streak row from the right edge to the horizontal center of its own row; returned to REVIEW after focused verification. | [`M1-08`](../tasks/done/M1-08.md); `npm run typecheck`, `npm run test:component` (8/8) and `npm run build` pass; Hưng/Vinh/PO review |
| 2026-09-29 | M1-08 / mobile follow-up | Trúc + Codex | Updated from `main`, resolved documentation conflicts, kept streak title to one line at 375px/430px, and replaced Home greeting/streak emoji with shared thin-line SVG icons. | Direct browser smoke at 375px/430px; `npm run quality` with Chrome pass: scan 230 files/0 unsafe, unit 16/16, component 9/9, E2E 1/1; dedicated M1-08 PR next |
| 2026-09-29 | M1-08 / PR #56 evidence correction | Trúc + Codex | Replaced the obsolete 375px/430px screenshots with PR #56 evidence and clarified that earlier Hưng/Vinh approvals do not cover this new layout/icon change. | [`M1-08`](../tasks/done/M1-08.md); new screenshot evidence committed beside the card; Hưng/Vinh reviews of PR #56 required before Product Owner visual acceptance |
| 2026-09-29 | M1-08 / PR #56 review fixes | Trúc + Codex | Addressed the four review findings: recaptured correctly framed evidence, hid decorative Home icons from screen readers, routed streak colors through tokens, and added real-browser layout regression checks. | `npm run quality` PASS: typecheck/build, scan 234 files/0 unsafe, unit 16/16, component 9/9, E2E 2/2; task remains REVIEW for Hưng/Vinh and PO |
| 2026-09-29 | M1-07 / Trúc UI/UX review | Trúc (`dotruc1526`) | Reviewed narrative/reflection neutral state, knowledge correct/incorrect feedback, long Vietnamese text at 375px/430px and token-driven UI states; submitted GitHub approval on PR #53 | [`PR #53`](https://github.com/dotruc1526/suchill/pull/53); Trúc approval recorded, Vinh approval also present; M1-07 remains REVIEW pending Product Owner gate | Vinh/PO gate decision |
| 2026-09-29 | M1-07 follow-up | Hưng (Member 3) + Codex | Re-audited the three original findings and fixed a Modal focus-restoration edge case on PR #53; both Trúc and Vinh were requested as reviewers. M1-07 stays REVIEW. | `npm run quality` pass with Chrome after fix: scan 230 files/0 unsafe, unit 16/16, component 8/8, E2E 1/1; Vinh still verifies keyboard behavior in browser, PO gate remains pending; M2 LOCKED. |
| 2026-09-29 | M1-07 / M1-08 review | Hưng (Member 3) + Codex | Hưng accepted M1-07 implementation ownership after correcting the remaining Modal token literal and making choice intent/feedback explicit; APPROVED M1-08 implementation/token/architecture. Both tasks remain REVIEW. | Branch `codex/m1-hung-review-fixes`; `npm run quality` pass: scan 230 files/0 unsafe, unit 16/16, component 8/8, E2E 1/1; next Trúc + Vinh review M1-07, Vinh + Product Owner finish M1-08; M2 remains locked. |
| 2026-09-28 | GOVERNANCE | Product Owner | Thọ (Member 1) tạm ngừng kiêm nhiệm Product Owner, tập trung toàn lực vào Content Lead / biên soạn kịch bản; vai trò Product Owner tách biệt độc lập để đảm bảo khách quan trong nghiệm thu gate và duyệt nội dung | [`TEAM-OWNERSHIP.md`](./TEAM-OWNERSHIP.md); Thọ soạn kịch bản, PO độc lập nghiệm thu |
| 2026-09-28 | M1-08 / PR #40 UI remediation | Trúc + Codex | Trúc hoàn tất phần UI/UX: khôi phục icon nét mảnh từ visual intent `b27fa19`, chuẩn hóa runtime typography về Inter, sửa overflow 375px và chuyển REVIEW; không thêm dependency mới và không tự chuyển DONE | [`M1-08`](../tasks/done/M1-08.md); `npm ci` pass, `npm run quality` pass with Chrome, secret scan 227 files/0 unsafe; next Hưng review implementation/token, Vinh QA/accessibility, Product Owner nghiệm thu hình ảnh |
| 2026-09-28 | M1-07 / Gate M1 | Product Owner + Codex audit | Giao Hưng sửa ba finding M1; Trúc review UI/UX; Vinh bổ sung regression/accessibility QA; giữ M2 khóa | [`M1-07`](../tasks/done/M1-07.md); local = `origin/main` tại `b47b190`; task bắt đầu ở READY, chưa sửa source |
| 2026-09-28 | CONTENT-016 / PR #45 approval | Thọ + Trúc + Product Owner | Approve authoring brief với ba điều kiện: chưa phải Full Narration/StoryVersion; claim 001..005 cần Trúc duyệt từng câu; media chưa chọn và text-first fallback bắt buộc | [`CONTENT-016`](../tasks/done/CONTENT-016.md); merge PR #45, production cần task/gate riêng |
| 2026-09-28 | CONTENT-016 / PR #45 feedback round 2 | Codex | Bổ sung nguồn QĐND với locator hẹp; gỡ `BLOCKED_LOCATOR` thành `READY_FOR_TRUC_REVIEW`; xác định media chưa chọn là guardrail sản xuất, không phải dependency của PR brief | [`CONTENT-016 evidence`](../content/CONTENT-016-EVIDENCE.md); chờ Trúc approve historical/media, sau đó Thọ review product/learning |
| 2026-09-28 | CONTENT-016 / PR #45 | Trúc review + Codex | Bổ sung claim/source locator matrix và historical/fiction/media boundary; khóa claim/asset/mechanic chưa đủ evidence khỏi narration/StoryVersion | [`CONTENT-016 evidence`](../content/CONTENT-016-EVIDENCE.md); chờ Thọ product/learning approval và Trúc re-review locator/media |
| 2026-09-28 | CONTENT-016 | Product Owner + Codex | Chốt rule mỗi chapter canonical có ít nhất một flagship Visual Novel; chuyển Lesson 2 SAM-2 chapter 1972 thành VN brief có interactive artifact | [`CONTENT-016`](../tasks/done/CONTENT-016.md); lịch sử dòng này ghi trạng thái trước approval; M2/M3 vẫn khóa |
| 2026-09-28 | M1-07 / Gate M1 | Product Owner + Vinh QA/Codex | Product owner flagged three M1 gate findings; implementation fix added for narrative choice semantics, Modal focus lifecycle and token-routed primitives; M2 remains locked | [`M1-07`](../tasks/done/M1-07.md); branch `codex/m1-po-blocker-fixes`; `npm run quality` pass after merge main: scan 225 files/0 unsafe, unit 16/16, component 7/7, E2E 1/1; awaiting Hưng/Trúc/Vinh/PO review |
| 2026-09-28 | M1-05 / FE-009 | Hưng + Trúc + Vinh | Tách evidence interaction foundation đã merge trong PR #33 khỏi FE-009; FE-009 chỉ còn adoption/polish sau feature implementation | [`M1-05`](../tasks/done/M1-05.md); FE-009 giữ BACKLOG đến khi FE-005..008 đạt dependency và có card riêng |
| 2026-09-28 | M1-04 / M1-06 | Vinh QA + Codex | Vinh QA accepted M1-04 after Hưng/Trúc handoff; moved M1-04 and M1-06 to `DONE` with compact QA evidence, without opening M2 | Local `npm run quality` pass: typecheck/build, scan 220 files/0 unsafe, unit 16/16, component 5/5, E2E 1/1; `M1-06-QA-EVIDENCE.md`; M2 remains locked until Product owner records M1 closure |
| 2026-09-28 | M1-01 / FE-003 / PR #33 | Vinh (Member 5 QA) / Codex hỗ trợ | Vinh xác nhận QA sau khi PR #33 đã merge; chuyển M1-01 và FE-003 sang DONE, cập nhật card/link board | `main` tại `274d31d`; `npm run quality` exit 0: typecheck/build, scan 217 file/0 unsafe, unit 16/16, component 4/4, E2E 1/1 |
| 2026-09-28 | FE-003 / PR #33 | Trúc (Member 2) / Codex hỗ trợ | Review lại commit `ef82303`; các feedback UI/UX đã được Hưng sửa, Trúc approve phần UI/UX; chưa chuyển DONE vì còn chờ Vinh QA theo guide | `typecheck`, `build`, `test:component`, `tests/member5`, secret scan 217 file pass; next Vinh approve QA |
| 2026-09-28 | M1-01 | Trúc (Member 2) / Codex hỗ trợ | Hoàn thành tài liệu Token Contract & Design Handoff theo Phase 9 và AGENTS.md; chuyển REVIEW | [`docs/engineering/TOKEN-HANDOFF.md`](../engineering/TOKEN-HANDOFF.md); Hưng review để mở FE-003/M1-02 |
| 2026-09-28 | DOC-016 / Gate M0 | Product owner + Codex | Product owner duyệt đóng M0 và mở M1 sau audit; tạo M1-01 `READY` cho Trúc, còn M2–M7 locked | `main` = `origin/main` tại `fe4072b`; GitHub Quality #31 success; local `npm run quality` pass với Chrome (typecheck/build, scan 204 file/0 unsafe, 16 unit, 1 component, 1 E2E) |
| 2026-09-28 | M0-05/M0-06/M0-07 | Vinh (Member 5) / Codex hỗ trợ | Hoàn thiện hai thiếu sót gate M0: sửa `test:unit` để local Node 24+ không gọi thư mục bằng `node --test`, ghi Node supported range và đồng bộ handoff sau khi PR #24 đã merge/CI xanh | `npm run quality` exit 0: typecheck/build, scan 203 file/0 unsafe, unit 16/16, component 1/1, E2E 1/1; PR #24 `MERGED` commit `eedff39`, Quality checks `SUCCESS`; PO quyết định đóng M0/mở M1 |
| 2026-09-28 | CONTENT-003/004 | Trúc (Codex hỗ trợ) | Sửa regression ba tài liệu từ 50bcd1f về authoring v2; review từng cue và media plan; validator PASS | [Review/handoff](../tasks/active/CONTENT-003-004-REVIEW.md); nguồn CLM-MT68-01 chưa đọc lại được, chờ sign-off/audio và Vinh QA |
| 2026-09-28 | CONTENT-003/004/007 | Trúc (Codex hỗ trợ) | Đồng bộ board/card: gỡ hai card mâu thuẫn của CONTENT-004, chuyển thành một card `REVIEW`; sửa link/status board và làm rõ CONTENT-007 vẫn `BLOCKED` | Trúc review historical/media, Vinh technical QA; Product owner mới quyết định mở production sau sign-off |
| 2026-09-28 | FE-004 | Vinh (reviewer) / Codex ghi nhận | Vinh xác nhận bản bổ sung đạt yêu cầu; FE-004 `DONE` trên card và board, không tự đóng M0 | App 87 dòng; `npm run quality` exit 0; browser smoke pass; lời xác nhận trực tiếp “a thấy ok rồi” |
| 2026-09-28 | FE-004 | Codex theo yêu cầu Vinh | Bổ sung tách `tab/view` state khỏi App, chuyển REVIEW để Vinh nghiệm thu; không tự đóng M0 | App 87 dòng; `npm run quality` exit 0; browser smoke 4 tab, VN, quiz/result, lesson/completion, console 0 error |
| 2026-09-28 | CONTENT-004/010/011/015 | Historical Reviewer | Hoàn tất thẩm định sử liệu và ngôn ngữ; approval này không thay technical QA/media/handoff và không tự unblock CONTENT-007 | Báo cáo tại docs/content/HISTORICAL-REVIEW-REPORT-2026-09-28.md; CONTENT-004/010/011 giữ REVIEW |
| 2026-09-28 | CONTENT-015 | Thọ (Member 1) | Hoàn thành Kịch bản chi tiết Bài 1 Chapter 1972 (Tối hậu thư từ bầu trời, 5 phân cảnh 110s, WebVTT, nguồn PK-KQ & Cẩm nang bìa đỏ) | Kịch bản tại docs/content/SCREENPLAY-1972.md và CAPTIONS-1972.vtt |
| 2026-09-28 | DOC-011/012/013/014/015, FE-001, CONTENT-009, CONTENT-013 | Thọ (Product Owner) | PO nghiệm thu đồng loạt 8 task đạt acceptance criteria; chuyển DONE. CONTENT-003/010/011/012 giữ REVIEW chờ Trúc (Historical Reviewer) và Vinh (QA) | Task cards chuyển sang docs/tasks/done/; board cập nhật |
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
