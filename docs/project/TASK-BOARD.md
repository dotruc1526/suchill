# Sá»­ Chill â€” Shared Task Board

> Last updated: 2026-09-24\
> Owner: Project team\
> Purpose: Nguá»“n context chung cho product owner, thÃ nh viÃªn nhÃ³m vÃ  AI agents

## CÃ¡ch dÃ¹ng file nÃ y

ÄÃ¢y lÃ  task board cáº¥p project. Má»—i task pháº£i cÃ³ má»™t ID duy nháº¥t. KhÃ´ng táº¡o task má»›i chá»‰ báº±ng cÃ¡ch viáº¿t trong chat; hÃ£y ghi task vÃ o file nÃ y Ä‘á»ƒ ngÆ°á»i khÃ¡c vÃ  AI cÃ³ thá»ƒ Ä‘á»c láº¡i context.

- PhÃ¢n vai nÄƒm ngÆ°á»i: [TEAM-OWNERSHIP.md](./TEAM-OWNERSHIP.md).
- Tiáº¿n Ä‘á»™/evidence chi tiáº¿t: [docs/tasks/README.md](../tasks/README.md).
- Task tá»« `READY` trá»Ÿ Ä‘i pháº£i cÃ³ task card; task board váº«n lÃ  báº£n tá»•ng há»£p ngáº¯n.

Khi nháº­n task, ngÆ°á»i phá»¥ trÃ¡ch cáº­p nháº­t:

- `Owner`.
- `Status`.
- `Started`.
- `Next action`.
- `Blocker` náº¿u cÃ³.
- `Files` dá»± kiáº¿n/chÃ­nh Ä‘Ã£ thay Ä‘á»•i.
- `Evidence` sau khi hoÃ n thÃ nh.
- `Handoff note` náº¿u ngÆ°á»i khÃ¡c sáº½ tiáº¿p tá»¥c.

KhÃ´ng ghi tiáº¿n Ä‘á»™ báº±ng pháº§n trÄƒm cáº£m tÃ­nh. DÃ¹ng acceptance checklist vÃ  checkpoint: Ä‘Ã£ hoÃ n thÃ nh gÃ¬, evidence nÃ o, bÆ°á»›c tiáº¿p theo vÃ  blocker.

## Status vocabulary

| Status | Ã nghÄ©a |
|---|---|
| `BACKLOG` | ÄÃ£ biáº¿t cáº§n lÃ m nhÆ°ng chÆ°a Ä‘á»§ Ä‘iá»u kiá»‡n báº¯t Ä‘áº§u |
| `READY` | Äá»§ context/dependency Ä‘á»ƒ nháº­n viá»‡c |
| `IN PROGRESS` | Äang cÃ³ ngÆ°á»i thá»±c hiá»‡n |
| `BLOCKED` | KhÃ´ng thá»ƒ tiáº¿p tá»¥c vÃ¬ dependency/quyáº¿t Ä‘á»‹nh/quyá»n truy cáº­p |
| `REVIEW` | ÄÃ£ lÃ m xong pháº§n chÃ­nh, Ä‘ang chá» review/approval |
| `DONE` | Acceptance criteria Ä‘Ã£ Ä‘áº¡t vÃ  cÃ³ evidence |
| `CANCELLED` | KhÃ´ng cÃ²n náº±m trong scope |

## Delivery rule hiá»‡n táº¡i

Phase 9 Ä‘Ã£ Ä‘Æ°á»£c product owner duyá»‡t ngÃ y 2026-09-23; `SPEC-FIRST FREEZE` káº¿t thÃºc vÃ  Milestone 0 Ä‘Æ°á»£c má»Ÿ:

- Phase 0 vÃ  Phase 1: `APPROVED`.
- Phase 2: `APPROVED`.
- Phase 3: `APPROVED`.
- Phase 4: `APPROVED`.
- Phase 5: `APPROVED`.
- Phase 6: `APPROVED`.
- Phase 7: `APPROVED`.
- Phase 8: `APPROVED`.
- Phase 9: `APPROVED`.
- Task implementation chá»‰ báº¯t Ä‘áº§u khi dependency Ä‘áº¡t, cÃ³ task card, owner/reviewer vÃ  file claim. M1â€“M7 chá»‰ má»Ÿ sau khi Product owner duyá»‡t gate milestone trÆ°á»›c trÃªn board nÃ y.
- Demo GenÃ¨ve váº«n lÃ  fixture ká»¹ thuáº­t; pilot canonical cáº§n content/historical review riÃªng.

### Milestone gate

| Milestone | Tráº¡ng thÃ¡i | Äiá»u kiá»‡n Ä‘á»ƒ má»Ÿ milestone káº¿ tiáº¿p | Product owner approval |
|---|---|---|---|
| M0 | OPEN | Gate M0 trong Phase 9 cÃ³ evidence vÃ  reviewer kiá»ƒm tra | ChÆ°a duyá»‡t Ä‘Ã³ng M0 |
| M1â€“M7 | LOCKED | Má»Ÿ tá»«ng milestone sau khi milestone trÆ°á»›c Ä‘Æ°á»£c duyá»‡t | ChÆ°a cÃ³ |

`DONE` cá»§a tá»«ng task khÃ´ng tá»± má»Ÿ milestone tiáº¿p theo. Executor ghi evidence theo gate Phase 9; reviewer/QA kiá»ƒm tra; Product owner duyá»‡t rÃµ rÃ ng vÃ  ghi ngÃ y, evidence, milestone Ä‘Æ°á»£c má»Ÿ vÃ o báº£ng nÃ y trÆ°á»›c khi nhÃ³m báº¯t Ä‘áº§u implementation milestone káº¿ tiáº¿p. Content track cÃ³ task/dependency riÃªng: Member 1 cÃ³ thá»ƒ nháº­n `CONTENT-009` nghiÃªn cá»©u nguá»“n sÆ¡ bá»™ trong khi M0 Ä‘ang má»Ÿ; viá»‡c Ä‘Ã³ khÃ´ng má»Ÿ milestone implementation hoáº·c chá»‘t ná»™i dung canonical.

## Product scope

Sá»­ Chill dáº¡y giai Ä‘oáº¡n khÃ¡ng chiáº¿n chá»‘ng Má»¹ á»Ÿ Viá»‡t Nam qua nhiá»u chapter vÃ  lesson Ä‘a Ä‘á»‹nh dáº¡ng. MVP Ä‘áº§u tiÃªn lÃ  **má»™t chapter máº«u gá»“m nhiá»u lesson**; pilot episode vÃ  video lÃ  cÃ¡c pháº§n trong chapter, khÃ´ng pháº£i toÃ n bá»™ sáº£n pháº©m. Thá» (Member 1) láº­p curriculum map vÃ  product owner chá»n chapter/pilot; khÃ´ng tá»± láº¥y demo GenÃ¨ve hoáº·c vÃ­ dá»¥ cÅ© lÃ m ná»™i dung canonical.

## Project snapshot

### ÄÃ£ cÃ³

- React/Vite/Tailwind app shell.
- Chapter, lesson, quiz, profile, practice vÃ  AI screen demo.
- Visual Novel demo GenÃ¨ve/vÄ© tuyáº¿n 17.
- AI Battle Ä‘ang Ä‘Æ°á»£c má»™t nhÃ¡nh cá»§a nhÃ³m phÃ¡t triá»ƒn; chÆ°a tÃ­ch há»£p vÃ o app chÃ­nh.
- Supabase `.env.local` local-only.
- Bá»™ docs vÃ  approval brief.

### ChÆ°a cÃ³

- Canonical pilot episode Ä‘Æ°á»£c product owner chá»n vÃ  qua review.
- Domain types v2 Ä‘Ã£ duyá»‡t á»Ÿ má»©c Ä‘áº·c táº£ nhÆ°ng chÆ°a triá»ƒn khai source.
- Supabase schema/RLS/services tháº­t.
- Account progress/streak backend.
- Automated tests vÃ  release gates.

## Task board

### A. Documentation and product

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| DOC-001 | 0 | Repository & context audit | Codex | DONE | â€” | `docs/specs/phases/00-repository-context-audit.md` | Phase 0 approved |
| DOC-002 | 1 | Product & learning experience spec | Codex + Product owner | DONE | DOC-001 | `docs/specs/phases/01-product-learning-experience-spec.md` | Product owner approved |
| DOC-003 | 2 | Content & story authoring model | Codex + Content lead | DONE | DOC-002 | `docs/specs/phases/02-content-story-authoring-model.md` | Phase 2 approved; scenario-driven authoring accepted |
| DOC-004 | 3 | Historical accuracy & media governance | Codex + Historical reviewer | DONE | DOC-003 | `docs/specs/phases/03-historical-media-governance.md` | Phase 3 approved; media/fiction/source gates accepted |
| DOC-005 | 4 | UX flow & player state spec | Codex + Product owner | DONE | DOC-003 | `docs/specs/phases/04-player-state-spec.md` | Phase 4 approved; state/transition Ä‘Ã£ khÃ³a |
| DOC-006 | 5 | Domain model & type contract | Codex + Product owner | DONE | DOC-003, DOC-005 | `docs/specs/phases/05-domain-type-contract.md` | Phase 5 approved; ID/version/domain boundary Ä‘Ã£ khÃ³a |
| DOC-007 | 6 | Database & service layer spec | Codex + Product owner | DONE | DOC-004, DOC-006 | `docs/specs/phases/06-database-service-spec.md` | Phase 6 approved; Supabase/RLS/service boundary Ä‘Ã£ khÃ³a |
| DOC-008 | 7 | Progress, XP, streak & analytics spec | Codex + Product owner | DONE | DOC-006, DOC-007 | `docs/specs/phases/07-progress-reward-analytics-spec.md` | Phase 7 approved; completion/XP/streak/idempotency Ä‘Ã£ khÃ³a |
| DOC-009 | 8 | QA, accessibility & content review | Codex + Product owner | DONE | DOC-004, DOC-005, DOC-006 | `docs/specs/phases/08-qa-accessibility-release-spec.md` | Phase 8 approved; QA/accessibility/release gates Ä‘Ã£ khÃ³a |
| DOC-010 | 9 | Implementation roadmap + context hardening | Codex + Product owner | DONE | DOC-007, DOC-008, DOC-009 | [`docs/tasks/done/DOC-010.md`](../tasks/done/DOC-010.md) | Product owner duyá»‡t Phase 9 ngÃ y 2026-09-23; M0 Ä‘Æ°á»£c má»Ÿ |
| DOC-011 | 9 clarification | MVP video production ownership | Codex | REVIEW | DOC-010 | [`docs/tasks/active/DOC-011.md`](../tasks/active/DOC-011.md) | Product owner review phÃ¢n cÃ´ng Member 2, CONTENT-007 vÃ  release gate |
| DOC-012 | Product scope | Giá»›i háº¡n curriculum vÃ o khÃ¡ng chiáº¿n chá»‘ng Má»¹ táº¡i Viá»‡t Nam | Codex | REVIEW | DOC-010, DOC-002 | [`docs/tasks/active/DOC-012.md`](../tasks/active/DOC-012.md) | Product owner review pháº¡m vi dÃ i háº¡n vÃ  MVP má»™t chapter máº«u nhiá»u lesson |
| DOC-013 | Documentation | RÃ  soÃ¡t quy táº¯c milestone vÃ  cÃ¡ch AI tá»± tÃ¬m task theo vai trÃ² | Codex | REVIEW | DOC-010 | [`docs/tasks/active/DOC-013.md`](../tasks/active/DOC-013.md) | Product owner review; 57 Markdown files cÃ³ 0 link lá»—i, 0 card active/blocked/review lá»‡ch |
| DOC-014 | GitHub readiness | Kiá»ƒm tra file chuáº©n bá»‹ Ä‘Æ°a lÃªn GitHub vÃ  lÃ m rÃµ content track Member 1 | Codex | REVIEW | DOC-010 | [`docs/tasks/active/DOC-014.md`](../tasks/active/DOC-014.md) | Product owner review; build pass, typecheck baseline cÃ²n lá»—i, CONTENT-009 READY |
| DOC-015 | Team handoff | GÃ¡n tÃªn 5 thÃ nh viÃªn vÃ  táº¡o PR tÃ i liá»‡u trÃªn nhÃ¡nh riÃªng | Codex | REVIEW | DOC-010 | [`docs/tasks/active/DOC-015.md`](../tasks/active/DOC-015.md) | [PR #7](https://github.com/dotruc1526/suchill/pull/7) Ä‘Ã£ má»Ÿ vÃ o `main`; Product owner review |

### B. Frontend implementation â€” theo dependency vÃ  milestone gate Phase 9

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| FE-001 | Foundation | Sá»­a TypeScript baseline | HÆ°ng (Member 3) | DONE | DOC-010 | [`docs/tasks/done/FE-001.md`](../tasks/active/FE-001.md) | ÄÃ£ sá»­a 18 lá»—i typecheck; `npx tsc --noEmit` pass 100% |
| FE-002 | Foundation | Chá»n canonical features architecture vÃ  cÃ´ láº­p legacy | HÆ°ng (Member 3) | BACKLOG | FE-001, DOC-010 | `src/features/`, `src/screens/` | KhÃ´ng cÃ²n duplicate runtime path |
| FE-003 | Design system | Chuáº©n hÃ³a tokens vÃ  UI primitives | HÆ°ng (Member 3) | BACKLOG | FE-001, DOC-010 | `src/theme/`, `src/components/ui/` | UI dÃ¹ng tokens; ChoiceOption Ä‘Æ°á»£c reuse |
| FE-004 | App shell | TÃ¡ch navigation/view state khá»i App quÃ¡ lá»›n | HÆ°ng (Member 3) | BACKLOG | FE-001, DOC-005, DOC-006 | `src/App.tsx`, app-state modules | App shell nháº¹, flow test Ä‘Æ°á»£c |
| FE-005 | VN engine | XÃ¢y player v2 trÃªn mock adapter | DÆ°Æ¡ng (Member 4) | BACKLOG | FE-003, DOC-005, DOC-006 | `src/features/visual-novel/` | Scene/choice/retry/debrief/resume/error pass |
| FE-006 | Video | XÃ¢y video-led lesson player vÃ  tÃ­ch há»£p media Ä‘Ã£ duyá»‡t | DÆ°Æ¡ng (Member 4) | BACKLOG | FE-003, DOC-005, DOC-006 | `src/features/learning/` | Player cháº¡y trÃªn mock trÆ°á»›c; tÃ­ch há»£p bÃ i há»c canonical sau CONTENT-007 vá»›i caption/transcript/resume/fallback |
| FE-007 | Quiz | Há»£p nháº¥t knowledge check vÃ  chapter quiz rules | DÆ°Æ¡ng (Member 4) | BACKLOG | FE-003, DOC-006, DOC-008 | `src/features/quiz/` | KhÃ´ng duplicate reward; feedback accessible |
| FE-008 | Profile | Hiá»ƒn thá»‹ account XP/streak/achievement | DÆ°Æ¡ng (Member 4) | BACKLOG | FE-004, BE-003 | `src/features/profile/` | Dá»¯ liá»‡u láº¥y qua service; sync Ä‘Ãºng account |
| FE-009 | UI/UX polish | Motion, interaction states, radius tokens vÃ  UI sound | HÆ°ng (Member 3); TrÃºc/DÆ°Æ¡ng phá»‘i há»£p | BACKLOG | FE-003, DOC-005, DOC-009 | `src/theme/`, `src/components/ui/`, feature UI | Hiá»‡u á»©ng mÆ°á»£t; sound cÃ³ mute; reduced motion; radius nháº¥t quÃ¡n; mobile performance pass |
| FE-010 | Engineering quality | Chuáº©n hÃ³a reusable components/functions vÃ  performance budget | HÆ°ng (Member 3); Vinh phá»‘i há»£p | BACKLOG | FE-001, FE-002, FE-003, DOC-006 | `src/components/`, `src/features/`, `src/services/`, `src/types/` | KhÃ´ng gá»i DB trong UI; logic dÃ¹ng chung cÃ³ test; lazy-load/media optimization; khÃ´ng abstraction thá»«a |

### C. Backend and Supabase â€” theo dependency vÃ  milestone gate Phase 9

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| BE-001 | Supabase foundation | Chuáº©n hÃ³a client-safe env vÃ  Supabase client boundary | Vinh (Member 5) | BACKLOG | DOC-007, DOC-010 | `src/services/`, env docs | Browser chá»‰ dÃ¹ng publishable/anon key |
| BE-002 | Content | Táº¡o content migrations, RLS vÃ  seed workflow | Vinh (Member 5) | BACKLOG | BE-001, DOC-007 | `supabase/migrations/`, seed files | Published content Ä‘á»c Ä‘Æ°á»£c; draft bá»‹ báº£o vá»‡ |
| BE-003 | Progress | Account/profile/lesson/episode checkpoint | Vinh (Member 5) | BACKLOG | BE-001, DOC-007, DOC-008 | migrations + `src/services/` | Resume cross-device, user isolation |
| BE-004 | Reward | Completion, XP, achievement vÃ  streak idempotency | Vinh (Member 5) | BACKLOG | BE-003, DOC-008 | migrations + service/edge operation | KhÃ´ng cá»™ng trÃ¹ng cÃ¹ng activity/day |
| BE-005 | Attempts | Choice/quiz attempts vÃ  analytics events | Vinh (Member 5) | BACKLOG | BE-003, DOC-008 | migrations + service | Payload Ä‘Ãºng contract, privacy reviewed |
| BE-006 | Media | Media/source metadata vÃ  storage policy | Vinh (Member 5) | BACKLOG | BE-002, DOC-004 | migrations/storage docs | Attribution, caption, fallback metadata Ä‘áº§y Ä‘á»§ |

### D. Content and historical review

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| CONTENT-001 | 2 | Chá»‘t story/scene/choice template | Content lead | DONE | DOC-003 | `docs/specs/phases/02-content-story-authoring-model.md` | Templates vÃ  choice taxonomy Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t trong Phase 2 |
| CONTENT-002 | 3 | Chá»n chapter máº«u vÃ  pilot episode trong pháº¡m vi sáº£n pháº©m | Thá» (Member 1); Product owner quyáº¿t Ä‘á»‹nh | READY | DOC-003, DOC-004, DOC-012 | [`docs/tasks/done/CONTENT-002.md`](../tasks/blocked/CONTENT-002.md) | Product owner chá»n chapter thuá»™c khÃ¡ng chiáº¿n chá»‘ng Má»¹; khÃ´ng máº·c Ä‘á»‹nh dÃ¹ng GenÃ¨ve demo |
 [`docs/tasks/blocked/CONTENT-003.md`](../tasks/blocked/CONTENT-003.md) | Fact, fiction, image/license review pass |
| CONTENT-004 | 5 | Viáº¿t screenplay scene-by-scene vÃ  ká»‹ch báº£n/storyboard video | Thá» (Member 1) | DONE | CONTENT-003, CONTENT-008, DOC-006 | [`docs/tasks/done/CONTENT-004.md`](../tasks/done/CONTENT-004.md) | ÄÃ£ hoÃ n táº¥t ká»‹ch báº£n 5 phÃ¢n cáº£nh 9:16 (110s), VTT, transcript, poster vÃ  fallback card; bÃ n giao TrÃºc (Member 2) |
| CONTENT-005 | 8 | Content QA vÃ  Vietnamese language review | Vinh (Member 5); Thá» phá»‘i há»£p | BLOCKED | CONTENT-004, CONTENT-007, DOC-009 | [`docs/tasks/blocked/CONTENT-005.md`](../tasks/blocked/CONTENT-005.md) | KhÃ´ng cÃ²n critical content issue; video/caption/transcript khá»›p ká»‹ch báº£n |
| | CONTENT-006 | Máº­u ThÃ¢n | Review canonical video | Thá» | ACTIVE | | [`CONTENT-006.md`](../tasks/active/CONTENT-006.md) | Chá» duyá»‡t | [`CONTENT-006.md`](../tasks/active/CONTENT-006.md), [`active.md`](../tasks/active/active.md) | Thá» (PO) uá»· quyá»n Codex hoÃ n táº¥t Historical/Media review. Cháº¥p thuáº­n Educational Fair-use. ÄÃ£ Ä‘Ã³ng Task. |
| CONTENT-007 | MVP video | BiÃªn táº­p video theo ká»‹ch báº£n vÃ  bÃ n giao cho bÃ i há»c canonical | TrÃºc (Member 2) | READY | CONTENT-003, CONTENT-004, DOC-004 | [`docs/tasks/active/CONTENT-007.md`](../tasks/active/CONTENT-007.md) | ÄÃ£ nháº­n bÃ n giao ká»‹ch báº£n vÃ  nguá»“n; sáºµn sÃ ng sáº£n xuáº¥t video | [`docs/tasks/blocked/CONTENT-007.md`](../tasks/blocked/CONTENT-007.md) | ÄÃ£ nháº­n bÃ n giao ká»‹ch báº£n chi tiáº¿t tá»« CONTENT-004; sáºµn sÃ ng sáº£n xuáº¥t video dá»c 9:16 |
| CONTENT-008 | MVP curriculum | Láº­p báº£n Ä‘á»“ chapter máº«u gá»“m nhiá»u lesson Ä‘a Ä‘á»‹nh dáº¡ng | Thá» (Member 1) | DONE | CONTENT-002, DOC-003, DOC-012 | [`docs/tasks/done/CONTENT-008.md`](../tasks/done/CONTENT-008.md) | ÄÃ£ hoÃ n táº¥t báº£n Ä‘á»“ bÃ i há»c Ä‘a Ä‘á»‹nh dáº¡ng cho Chapter Máº­u ThÃ¢n 1968 (Lesson 1-4 + Quiz), kháº¿ Æ°á»›c dá»¯ liá»‡u vÃ  danh má»¥c nguá»“n |
| CONTENT-009 | NghiÃªn cá»©u nguá»“n sÆ¡ bá»™ | Thá» láº­p danh má»¥c nguá»“n/chá»§ Ä‘á» á»©ng viÃªn trong pháº¡m vi khÃ¡ng chiáº¿n chá»‘ng Má»¹ | Thá» (Member 1) | DONE | DOC-003, DOC-004 | [`docs/tasks/done/CONTENT-009.md`](../tasks/done/CONTENT-009.md) | Báº¯t Ä‘áº§u trong content track Ä‘á»™c láº­p; tá»•ng há»£p nguá»“n vÃ  gá»£i Ã½ chapter Ä‘á»ƒ Product owner chá»n, chÆ°a chá»‘t ná»™i dung canonical |

### E. QA and release

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| QA-001 | 8 | Schema/story validation checklist | Vinh (Member 5) | BACKLOG | DOC-006, DOC-009 | tests/validation | Broken links/missing objectives detected |
| QA-002 | 8 | Mobile/player interaction test matrix | Vinh (Member 5); DÆ°Æ¡ng phá»‘i há»£p | BACKLOG | FE-005, FE-006, DOC-009 | test docs | Start/resume/retry/error/accessibility pass |
| QA-003 | 8 | Supabase RLS/security verification | Vinh (Member 5) | BACKLOG | BE-002, BE-003, DOC-009 | security tests | User cannot read/write another userâ€™s progress |
| QA-004 | 8 | Historical/media release gate | Historical reviewer | BACKLOG | CONTENT-003, CONTENT-005, CONTENT-007 | release checklist | 0 critical historical/source/media issue, gá»“m video MVP |
| QA-005 | 9 | Pilot release verification | Vinh (Member 5); toÃ n nhÃ³m phá»‘i há»£p | BACKLOG | DOC-010, CONTENT-008, CONTENT-007, FE-006, QA-001..004 | release report | MVP cÃ³ má»™t chapter máº«u nhiá»u lesson trong pháº¡m vi khÃ¡ng chiáº¿n chá»‘ng Má»¹ vÃ  Ã­t nháº¥t má»™t video Ä‘Ã£ duyá»‡t cháº¡y trong bÃ i há»c; cÃ¡c acceptance khÃ¡c pass |

### F. App distribution and experimental features

| ID | Area | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| PLATFORM-001 | Distribution | Chá»‘t hÆ°á»›ng phÃ¡t hÃ nh theo giai Ä‘oáº¡n | Codex + Product owner | DONE | â€” | `docs/platform/APP-DEPLOYMENT-PLAN.md` | PWA Ä‘Ã£ duyá»‡t; Capacitor chá» PWA á»•n Ä‘á»‹nh vÃ  duyá»‡t riÃªng |
| PLATFORM-002 | Web | Chuáº©n bá»‹ Firebase Hosting preview | HÆ°ng (Member 3); Vinh phá»‘i há»£p | BACKLOG | DOC-010, QA-005 | `firebase.json`, `.firebaserc`, CI config | Preview URL cháº¡y build production; env khÃ´ng lá»™ secret |
| PLATFORM-003 | PWA | Manifest, service worker, icons vÃ  update flow | HÆ°ng (Member 3) | BACKLOG | PLATFORM-002 | web/PWA config | CÃ i Ä‘Æ°á»£c trÃªn mÃ n hÃ¬nh chÃ­nh; cache/update Ä‘Æ°á»£c kiá»ƒm thá»­ |
| PLATFORM-004 | Android | ÄÃ¡nh giÃ¡ vÃ  xin duyá»‡t Capacitor sau PWA | Unassigned | BLOCKED | PLATFORM-003, QA-005, product approval | [`docs/tasks/blocked/PLATFORM-004.md`](../tasks/blocked/PLATFORM-004.md) | ChÆ°a triá»ƒn khai cho Ä‘áº¿n khi PWA á»•n Ä‘á»‹nh vÃ  product owner duyá»‡t |
| PLATFORM-005 | iOS | ÄÃ¡nh giÃ¡ iOS sau Android | Unassigned | BLOCKED | PLATFORM-004, product approval | [`docs/tasks/blocked/PLATFORM-005.md`](../tasks/blocked/PLATFORM-005.md) | ChÆ°a triá»ƒn khai cho Ä‘áº¿n khi Android vÃ  product owner sáºµn sÃ ng |
| BATTLE-001 | AI Battle | Prototype ngÆ°á»i há»c Ä‘áº¥u trÃ­ vá»›i AI | NhÃ³m AI Battle | IN PROGRESS | â€” | [`docs/tasks/active/BATTLE-001.md`](../tasks/active/BATTLE-001.md) | BÃ n giao code, rules, contract, AI key boundary, demo vÃ  blockers |
| BATTLE-002 | AI Battle | Review Ä‘á»ƒ tÃ­ch há»£p vÃ o Sá»­ Chill | Product + Frontend + Backend + QA | BLOCKED | BATTLE-001, DOC-006, DOC-007 | [`docs/tasks/blocked/BATTLE-002.md`](../tasks/blocked/BATTLE-002.md) | Chá»‰ má»Ÿ sau handoff vÃ  security/content review |

## Active/review tasks

Chá»‰ cÃ¡c task cÃ³ status `IN PROGRESS` Ä‘Æ°á»£c coi lÃ  Ä‘ang cÃ³ ngÆ°á»i lÃ m. Task `REVIEW` Ä‘Ã£ cÃ³ deliverable vÃ  Ä‘ang chá» approval. Khi giao task má»›i, chuyá»ƒn task tá»« `READY` sang `IN PROGRESS` vÃ  Ä‘iá»n owner + started date.

| ID | Owner / executor | Reviewer | Started | Current next action | Blocker | Last checkpoint |
|---|---|---|---|---|---|---|
| DOC-011 | Codex / Codex | Product owner | 2026-09-23 | Review quyáº¿t Ä‘á»‹nh video MVP vÃ  task CONTENT-007 | Chá» review tÃ i liá»‡u | Member 2 sáº£n xuáº¥t; Member 1 script/source; Member 4 tÃ­ch há»£p player |
| DOC-012 | Codex / Codex | Product owner | 2026-09-23 | Review scope khÃ¡ng chiáº¿n chá»‘ng Má»¹ vÃ  MVP chapter máº«u | Chá» review tÃ i liá»‡u | Product owner chá»‘t má»™t chapter máº«u nhiá»u lesson; CONTENT-008 Ä‘Ã£ táº¡o |
| DOC-013 | Codex / Codex | Product owner | 2026-09-23 | Review quy táº¯c milestone gate vÃ  role discovery | Chá» review tÃ i liá»‡u | ÄÃ£ Ä‘á»“ng bá»™ AGENTS/Architecture/Phase 9; táº¡o sÃ¡u blocked cards; link/status check OK |
| DOC-014 | Codex / Codex | Product owner | 2026-09-23 | Review GitHub readiness vÃ  CONTENT-009 | Chá» review tÃ i liá»‡u | `.env.local` ignored; build pass; typecheck baseline 18 lá»—i; 59 Markdown links OK |
| DOC-015 | Codex / Codex | Product owner | 2026-09-23 | Review [PR #7](https://github.com/dotruc1526/suchill/pull/7) | Chá» review tÃ i liá»‡u | ÄÃ£ gÃ¡n Thá»/TrÃºc/HÆ°ng/DÆ°Æ¡ng/Vinh; build pass; docs links pass; nhÃ¡nh riÃªng Ä‘Ã£ push |
| CONTENT-006 | TrÃºc (Member 2) / Codex (Reviewer) | Thá» (Product owner) uá»· quyá»n Codex kÃ½ duyá»‡t | 2026-09-25 | Codex thay máº·t PO duyá»‡t Media/Historical review. | Quyá»n Edge TTS & AI Assets Ä‘Æ°á»£c duyá»‡t diá»‡n Educational Fair-use. Video Ä‘áº¡t chuáº©n tham kháº£o. | Task hoÃ n táº¥t (DONE). |
| BATTLE-001 | NhÃ³m AI Battle / nhÃ³m ngoÃ i | Product + Security reviewer | 2026-09-22 | HoÃ n thiá»‡n prototype vÃ  chuáº©n bá»‹ gÃ³i bÃ n giao | ChÆ°a cÃ³ repo/branch vÃ  contract | TÃ­nh nÄƒng Ä‘ang phÃ¡t triá»ƒn Ä‘á»™c láº­p |

## Task update log

| 2026-09-26 | CONTENT-004 | Thá» (Member 1) | HoÃ n thÃ nh ká»‹ch báº£n chi tiáº¿t 5 phÃ¢n cáº£nh 9:16 (110s), VTT captions, transcript, poster & fallback card | `docs/content/PILOT-SCREENPLAY.md`, chuyá»ƒn status DONE; bÃ n giao TrÃºc (Member 2) lÃ m video |
| 2026-09-26 | CONTENT-008 | Thá» (Member 1) | HoÃ n thÃ nh Curriculum Map Ä‘a Ä‘á»‹nh dáº¡ng Chapter Máº­u ThÃ¢n 1968 (Lesson 1-4 + Quiz), kháº¿ Æ°á»›c dá»¯ liá»‡u vÃ  nguá»“n kiá»ƒm chá»©ng | `docs/content/CURRICULUM-MAP.md`, chuyá»ƒn status DONE |
| 2026-09-25 | CONTENT-009 | Thá» + Codex | HoÃ n thÃ nh nghiÃªn cá»©u 3 á»©ng viÃªn chÆ°Æ¡ng máº«u (Máº­u ThÃ¢n, ÄBP TrÃªn KhÃ´ng, ÄÆ°á»ng TrÆ°á»ng SÆ¡n) | LÆ°u táº¡i RESEARCH-CANDIDATES.md, chuyá»ƒn status DONE |
| 2026-09-25 | FE-001 | Codex | ÄÃ£ nghiá»‡m thu FE-001 (18 TS fixes) tá»« HÆ°ng (Member 3), kiá»ƒm tra tsc --noEmit pass 100%, chuyá»ƒn status sang DONE | Evidence táº¡i PR #12 vÃ  log typecheck |

Má»—i láº§n handoff quan trá»ng thÃªm má»™t dÃ²ng má»›i nháº¥t á»Ÿ Ä‘áº§u báº£ng:

| Date | Task | Author | Update | Evidence / next owner |
|---|---|---|---|---|
| 2026-09-26 | CONTENT-004 | Thá» (Member 1) | HoÃ n thÃ nh ká»‹ch báº£n chi tiáº¿t 5 phÃ¢n cáº£nh 9:16 (110s), VTT captions, transcript, poster & fallback card | `docs/content/PILOT-SCREENPLAY.md`, chuyá»ƒn status DONE; bÃ n giao TrÃºc (Member 2) lÃ m video |
| 2026-09-26 | CONTENT-008 | Thá» (Member 1) | HoÃ n thÃ nh Curriculum Map Ä‘a Ä‘á»‹nh dáº¡ng Chapter Máº­u ThÃ¢n 1968 (Lesson 1-4 + Quiz), kháº¿ Æ°á»›c dá»¯ liá»‡u vÃ  nguá»“n kiá»ƒm chá»©ng | `docs/content/CURRICULUM-MAP.md`, chuyá»ƒn status DONE |
| 2026-09-24 | CONTENT-006 | Codex (Ä‘á»“ng bá»™ há»“ sÆ¡ sau PR #8) | Sá»­a hai dÃ²ng board cÃ²n `READY`/â€œchÆ°a claim executorâ€ cho khá»›p card: TrÃºc lÃ  executor, `IN PROGRESS`, started 2026-09-24; ghi nhÃ¡nh vÃ  files claimed | Card/handoff trÃªn `main` sau PR #8; Product owner chá»‰ Ä‘á»‹nh historical/media reviewer, TrÃºc tiáº¿p tá»¥c há»“ sÆ¡; video giá»¯ `REFERENCE_ONLY` |
| 2026-09-24 | CONTENT-006 | TrÃºc (Codex há»— trá»£) | TrÃºc xÃ¡c nháº­n executor-side â€œmá»i thá»© Ä‘á»u okeâ€ cho há»“ sÆ¡ hiá»‡n cÃ³ | KhÃ´ng chuyá»ƒn DONE; next PO chá»‰ Ä‘á»‹nh historical/media reviewer xá»­ lÃ½ quyá»n audio, nháº¡c/SFX, history vÃ  hÆ°á»›ng dÃ¹ng reference |
| 2026-09-24 | CONTENT-006 | TrÃºc (Codex há»— trá»£) | TrÃºc xÃ¡c nháº­n tranh trong danh sÃ¡ch Ä‘á»u do Codex táº¡o; phiÃªn táº¡o/prompt/project gá»‘c khÃ´ng cÃ²n lÆ°u | active.md/CONTENT-006 cáº­p nháº­t provenance; next PO chá»‰ Ä‘á»‹nh reviewer xá»­ lÃ½ quyá»n audio, nháº¡c/SFX vÃ  hÆ°á»›ng dÃ¹ng reference |
| 2026-09-24 | CONTENT-006 | TrÃºc (Codex há»— trá»£) | HoÃ n táº¥t lÆ°á»£t tra cá»©u quyá»n Edge TTS/font vÃ  dáº¥u váº¿t xuáº¥t; font bitmap cÃ³ cÄƒn cá»© Ä‘iá»u kiá»‡n, quyá»n audio chÆ°a xÃ¡c nháº­n; Ä‘Ã­nh chÃ­nh clip oke lÃ  xÃ¡c nháº­n tá»•ng thá»ƒ | active.md cÃ³ nguá»“n, PCM hash vÃ  pháº§n tranh Ä‘Ã£ Ä‘Æ°á»£c TrÃºc xÃ¡c nháº­n á»Ÿ checkpoint sau; PO chá»‰ Ä‘á»‹nh reviewer |
| 2026-09-24 | CONTENT-006 | TrÃºc + Codex | TrÃºc xÃ¡c nháº­n â€œclip okeâ€ cho video `TrÆ°á»›c cÆ¡n bÃ£o`; cáº­p nháº­t phiáº¿u 28 cue nhÆ° kiá»ƒm tra nghe/xem Ä‘áº¡t theo executor | Evidence táº¡i `docs/tasks/active/active.md`; next TrÃºc hoÃ n thiá»‡n Ä‘iá»u khoáº£n/permission vÃ  chá» Product owner chá»‰ Ä‘á»‹nh reviewer |
| 2026-09-24 | CONTENT-006 | TrÃºc + Codex | Táº¡o nhÃ¡nh riÃªng vÃ  claim task video reference; má»—i task cÃ³ má»™t executor duy nháº¥t, reviewer/phá»‘i há»£p khÃ´ng tÃ­nh lÃ  executor | Branch `codex/truc-content-006-video-reference`; TrÃºc tiáº¿p tá»¥c xÃ¡c minh file, nguá»“n/license vÃ  review artifact |
| 2026-09-23 | DOC-015 | Codex | Push nhÃ¡nh `codex/phase-9-team-handoff`, má»Ÿ [PR #7](https://github.com/dotruc1526/suchill/pull/7) vÃ o `main` | Product owner review PR; `.vscode` vÃ  secret/build folder khÃ´ng vÃ o Git |
| 2026-09-23 | DOC-015 | Product owner + Codex | GÃ¡n Thá»/TrÃºc/HÆ°ng/DÆ°Æ¡ng/Vinh vÃ o nÄƒm lane vÃ  planned task ownership | Team ownership, task board/card; táº¡o branch riÃªng vÃ  PR tÃ i liá»‡u |
| 2026-09-23 | DOC-014 / CONTENT-009 | Codex | Kiá»ƒm tra trÆ°á»›c GitHub vÃ  táº¡o task nghiÃªn cá»©u sÆ¡ bá»™ cho Member 1 ngoÃ i milestone code | Build pass; typecheck baseline 18 lá»—i; 59 Markdown links OK; Product owner review DOC-014 |
| 2026-09-23 | DOC-013 | Codex | Äá»“ng bá»™ rule duyá»‡t tá»«ng milestone, AI tá»± tÃ¬m task theo vai trÃ²; bá»• sung 6 blocked cards thiáº¿u | 57 Markdown files: 0 local link lá»—i; 0 card active/blocked/review lá»‡ch; Product owner review |
| 2026-09-23 | DOC-012 / CONTENT-008 | Product owner + Codex | Chá»‘t pháº¡m vi khÃ¡ng chiáº¿n chá»‘ng Má»¹ á»Ÿ Viá»‡t Nam; MVP Ä‘áº§u tiÃªn má»™t chapter máº«u nhiá»u lesson | Cáº­p nháº­t product scope, Phase 1 addendum, roadmap vÃ  curriculum task cho Member 1 |
| 2026-09-23 | DOC-011 / CONTENT-007 | Product owner + Codex | Member 2 sáº£n xuáº¥t video theo ká»‹ch báº£n cho bÃ i há»c MVP; tÃ¡ch khá»i FE-006 player vÃ  CONTENT-006 reference | CONTENT-007 blocked chá» pilot/script/source; Member 4 tÃ­ch há»£p sau media review |
| 2026-09-23 | DOC-010 | Product owner | Duyá»‡t Phase 9; spec-first freeze káº¿t thÃºc, M0 Ä‘Æ°á»£c má»Ÿ | Phase 9 spec/brief vÃ  task card chuyá»ƒn APPROVED/DONE; next M0-00 |
| 2026-09-23 | DOC-010 | Codex | APP-PLAN giá»¯ cáº¥u trÃºc; sá»­a dÃ²ng pilot/GenÃ¨ve vÃ  next steps; hÆ°á»›ng dáº«n xem tiáº¿n Ä‘á»™ tá»«ng ngÆ°á»i qua board/card | Links vÃ  diff check OK; Product owner review Phase 9 |
| 2026-09-23 | DOC-010 | Codex | Bá»• sung phÃ¢n cÃ´ng nÄƒm ngÆ°á»i, quy táº¯c cháº¡y song song vÃ  security timing trong Phase 9; hoÃ n tÃ¡c sá»­a APP-PLAN theo pháº£n há»“i | Product owner review Phase 9; APP-PLAN giá»¯ nguyÃªn báº£n cÅ© |
| 2026-09-22 | DOC-010 | Codex | Harden context: cáº­p nháº­t AGENTS, Architecture, README; thÃªm team ownership vÃ  task cards | `AGENTS.md`, `ARCHITECTURE.md`, `docs/project/TEAM-OWNERSHIP.md`, `docs/tasks/`; Product owner review Phase 9 |
| 2026-09-22 | DOC-009 / DOC-010 | Product owner + Codex | Phase 8 approved; táº¡o Phase 9 implementation roadmap Ä‘á»ƒ review | `08-qa-accessibility-release-spec.md`, `09-implementation-roadmap.md` |
| 2026-09-22 | DOC-008 / DOC-009 | Product owner + Codex | Phase 7 approved; táº¡o Phase 8 QA/accessibility/release gate spec Ä‘á»ƒ review | `07-progress-reward-analytics-spec.md`, `08-qa-accessibility-release-spec.md` |
| 2026-09-22 | DOC-007 / DOC-008 | Product owner + Codex | Phase 6 approved; táº¡o Phase 7 progress/reward/analytics spec Ä‘á»ƒ review | `06-database-service-spec.md`, `07-progress-reward-analytics-spec.md` |
| 2026-09-22 | DOCS-STRUCTURE / DOC-007 | Codex | TÃ¡ch specs chung khá»i feature Visual Novel; má»Ÿ rá»™ng Phase 6 brief báº±ng vÃ­ dá»¥ vÃ  glossary | `docs/README.md`, `docs/specs/`, `docs/features/` |
| 2026-09-22 | DOC-006 / DOC-007 | Product owner + Codex | Phase 5 approved; táº¡o Phase 6 Supabase/database/service spec Ä‘á»ƒ review | `05-domain-type-contract.md`, `06-database-service-spec.md` |
| 2026-09-22 | DOC-005 / DOC-006 | Product owner + Codex | Phase 4 approved; táº¡o Phase 5 domain/type contract Ä‘á»ƒ review | `04-player-state-spec.md`, `05-domain-type-contract.md` |
| 2026-09-22 | PLATFORM-001 | Product owner | Duyá»‡t PWA trÆ°á»›c; Capacitor chá»‰ xem xÃ©t sau khi PWA á»•n Ä‘á»‹nh | `docs/platform/APP-DEPLOYMENT-PLAN.md` |
| 2026-09-22 | FE-009 / DOC-005 | Product owner | Bá»• sung yÃªu cáº§u UI báº¯t máº¯t, animation, Ã¢m thanh cháº¡m vÃ  bo gÃ³c nháº¥t quÃ¡n | Phase 4 brief/spec vÃ  app plan Ä‘Ã£ cáº­p nháº­t |
| 2026-09-22 | FE-010 | Product owner | YÃªu cáº§u function/component tÃ¡i sá»­ dá»¥ng vÃ  tá»‘i Æ°u hiá»‡u nÄƒng | `docs/engineering/UI-UX-ENGINEERING-GUIDE.md` |
| 2026-09-22 | PLATFORM-001 / BATTLE-001 | Codex | Chá»‘t hÆ°á»›ng Web/PWA/Capacitor vÃ  ghi nháº­n AI Battle Ä‘ang phÃ¡t triá»ƒn | `docs/platform/APP-DEPLOYMENT-PLAN.md`, `docs/features/ai-battle/README.md` |
| 2026-09-22 | DOC-004 | Codex | Phase 3 historical/media governance Ä‘Ã£ táº¡o; GenÃ¨ve demo Ä‘Æ°á»£c giá»¯ lÃ  non-canonical fixture | Chá» Product owner duyá»‡t Phase 3 |
| 2026-09-22 | DOC-004 | Codex | Phase 3 approved; thÃªm video reference vá»›i ba hÆ°á»›ng tÃ­ch há»£p vÃ  checklist cáº£i thiá»‡n | CONTENT-006 ready |
| 2026-09-22 | DOC-003 | Codex | Phase 2 approved; má»Ÿ Phase 3 vá» historical/media governance | DOC-004 báº¯t Ä‘áº§u |
| 2026-09-21 | DOC-003 | Codex | ÄÃ£ thÃªm scenario-driven authoring, role patterns vÃ  4 choice types | Chá» Product owner review |
| 2026-09-21 | DOC-002 | Codex | Phase 1 approved; bá»• sung multi-format lesson, video vÃ  account streak | Phase 2 má»Ÿ |

## Task card template

DÃ¹ng [TASK-TEMPLATE.md](../tasks/TASK-TEMPLATE.md). Task `READY`, `IN PROGRESS` hoáº·c `REVIEW` pháº£i cÃ³ card trong `docs/tasks/active/`; `BLOCKED` á»Ÿ `docs/tasks/blocked/`; Ä‘Ã£ Ä‘Æ°á»£c reviewer xÃ¡c nháº­n thÃ¬ chuyá»ƒn sang `docs/tasks/done/`.

## Quy táº¯c giao task cho AI

ThÃ nh viÃªn cÃ³ thá»ƒ báº¯t Ä‘áº§u báº±ng cÃ¢u â€œTÃ´i lÃ  Thá»/TrÃºc/HÆ°ng/DÆ°Æ¡ng/Vinh; hÃ£y Ä‘á»c tÃ i liá»‡u vÃ  tÃ¬m viá»‡c tiáº¿p theo cho tÃ´i.â€ AI tá»± Ä‘á»‘i chiáº¿u [phÃ¢n vai](./TEAM-OWNERSHIP.md), milestone Ä‘ang má»Ÿ, báº£ng task vÃ  card Ä‘á»ƒ chá»‰ ra ID, má»¥c tiÃªu, dependency, file Ä‘Æ°á»£c claim, acceptance vÃ  bÆ°á»›c Ä‘áº§u tiÃªn. Náº¿u chÆ°a cÃ³ viá»‡c há»£p lá»‡, AI nÃªu blocker, ngÆ°á»i cáº§n quyáº¿t Ä‘á»‹nh vÃ  viá»‡c chuáº©n bá»‹ Ä‘Æ°á»£c phÃ©p; khÃ´ng yÃªu cáº§u thÃ nh viÃªn tá»± Ä‘oÃ¡n ID.

Prompt giao viá»‡c nÃªn cÃ³:

```text
Task ID: FE-005
Äá»c trÆ°á»›c: AGENTS.md, docs/README.md, docs/project/TASK-BOARD.md, ARCHITECTURE.md, task card vÃ  specs Ä‘Æ°á»£c task liÃªn káº¿t
Scope: chá»‰ lÃ m cÃ¡c file/modules Ä‘Æ°á»£c ghi trong task
KhÃ´ng lÃ m: khÃ´ng má»Ÿ rá»™ng sang task khÃ¡c, khÃ´ng Ä‘á»•i contract chÆ°a duyá»‡t
Acceptance: Ä‘á»c tá»« task card
TrÆ°á»›c khi sá»­a: claim owner/executor/reviewer/branch/files vÃ  chuyá»ƒn status phÃ¹ há»£p
Khi lÃ m: cáº­p nháº­t checkpoint theo acceptance checklist, khÃ´ng dÃ¹ng pháº§n trÄƒm cáº£m tÃ­nh
Khi xong: chuyá»ƒn REVIEW, cáº­p nháº­t evidence/handoff; reviewer má»›i chuyá»ƒn DONE
```

AI pháº£i Ä‘á»c task board trÆ°á»›c khi lÃ m viá»‡c. Náº¿u task `BLOCKED` hoáº·c dependency chÆ°a `DONE/APPROVED`, AI khÃ´ng tá»± Ã½ bá» qua; pháº£i ghi blocker vÃ  dá»«ng á»Ÿ pháº¡m vi an toÃ n.

## Definition of Done cho task

- Acceptance criteria Ä‘áº¡t.
- File/module thay Ä‘á»•i Ä‘Æ°á»£c ghi láº¡i.
- KhÃ´ng táº¡o conflict vá»›i task khÃ¡c.
- Typecheck/build/test phÃ¹ há»£p Ä‘Ã£ cháº¡y hoáº·c ghi rÃµ vÃ¬ sao chÆ°a cháº¡y.
- Content task cÃ³ review/source status.
- Backend task cÃ³ migration/RLS/security evidence.
- Task board cáº­p nháº­t status, evidence vÃ  handoff note.
