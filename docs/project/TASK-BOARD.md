# Sá»­ Chill â€” Shared Task Board

> Last updated: 2026-10-02\
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

Phase 9 Ä‘Ã£ Ä‘Æ°á»£c product owner duyá»‡t ngÃ y 2026-09-23; `SPEC-FIRST FREEZE` káº¿t thÃºc. Product owner Ä‘Ã£ duyá»‡t Ä‘Ã³ng M0 vÃ  má»Ÿ Milestone 1 ngÃ y 2026-09-28:

- Phase 0 vÃ  Phase 1: `APPROVED`.
- Phase 2: `APPROVED`.
- Phase 3: `APPROVED`.
- Phase 4: `APPROVED`.
- Phase 5: `APPROVED`.
- Phase 6: `APPROVED`.
- Phase 7: `APPROVED`.
- Phase 8: `APPROVED`.
- Phase 9: `APPROVED`.
- Task implementation chá»‰ báº¯t Ä‘áº§u khi dependency Ä‘áº¡t, cÃ³ task card, owner/reviewer vÃ  file claim. M2â€“M7 chá»‰ má»Ÿ sau khi Product owner duyá»‡t gate milestone trÆ°á»›c trÃªn board nÃ y.
- Demo GenÃ¨ve váº«n lÃ  fixture ká»¹ thuáº­t; pilot canonical cáº§n content/historical review riÃªng.

### Milestone gate

| Milestone | Tráº¡ng thÃ¡i | Äiá»u kiá»‡n Ä‘á»ƒ má»Ÿ milestone káº¿ tiáº¿p | Product owner approval |
|---|---|---|---|
| M0 | DONE | Typecheck/build/test, canonical/legacy boundary vÃ  client-secret scan Ä‘Ã£ Ä‘áº¡t | Product owner approved close, 2026-09-28; evidence: `fe4072b`, GitHub Quality run #31 success, local `npm run quality` pass with Chrome |
| M1 | DONE | Gate M1 trong Phase 9 cÃ³ evidence vÃ  reviewer kiá»ƒm tra | Product Owner nghiá»‡m thu M1-07 vÃ  M1-08; approved close, 2026-09-29; evidence: PR #53/#56, QA keyboard 26 checkpoints, quality PASS vÃ  áº£nh 375px/430px |
| M2 | DONE | Ba gate Phase 9 Ä‘áº¡t; M2-01..06 Ä‘Ã£ Ä‘Æ°á»£c reviewer nghiá»‡m thu vÃ  Quality pass | Product Owner DÆ°Æ¡ng approved close, 2026-10-01; evidence: PR #70 / `a4d22b2`, DOC-018 |
| M3 | OPEN | Learning frontend hoÃ n chá»‰nh trÃªn mock services theo Gate M3 | Product Owner DÆ°Æ¡ng approved open, 2026-10-01; M3 tasks chá»‰ báº¯t Ä‘áº§u sau claim há»£p lá»‡ |
| M4â€“M7 | LOCKED | Má»Ÿ tá»«ng milestone sau khi milestone trÆ°á»›c Ä‘Æ°á»£c duyá»‡t | ChÆ°a cÃ³ |

`DONE` cá»§a tá»«ng task khÃ´ng tá»± má»Ÿ milestone tiáº¿p theo. Executor ghi evidence theo gate Phase 9; reviewer/QA kiá»ƒm tra; Product owner duyá»‡t rÃµ rÃ ng vÃ  ghi ngÃ y, evidence, milestone Ä‘Æ°á»£c má»Ÿ vÃ o báº£ng nÃ y trÆ°á»›c khi nhÃ³m báº¯t Ä‘áº§u implementation milestone káº¿ tiáº¿p. Content track cÃ³ task/dependency riÃªng: Member 1 cÃ³ thá»ƒ nháº­n `CONTENT-009` nghiÃªn cá»©u nguá»“n sÆ¡ bá»™ trong khi M0 Ä‘ang má»Ÿ; viá»‡c Ä‘Ã³ khÃ´ng má»Ÿ milestone implementation hoáº·c chá»‘t ná»™i dung canonical.

## Product scope

Sá»­ Chill dáº¡y giai Ä‘oáº¡n khÃ¡ng chiáº¿n chá»‘ng Má»¹ á»Ÿ Viá»‡t Nam qua nhiá»u chapter vÃ  lesson Ä‘a Ä‘á»‹nh dáº¡ng. MVP Ä‘áº§u tiÃªn lÃ  **má»™t chapter máº«u gá»“m nhiá»u lesson**; pilot episode vÃ  video lÃ  cÃ¡c pháº§n trong chapter, khÃ´ng pháº£i toÃ n bá»™ sáº£n pháº©m. Thá» (Member 1) láº­p curriculum map vÃ  product owner chá»n chapter/pilot; khÃ´ng tá»± láº¥y demo GenÃ¨ve hoáº·c vÃ­ dá»¥ cÅ© lÃ m ná»™i dung canonical.

## Project snapshot

### ÄÃ£ cÃ³

- React/Vite/Tailwind app shell.
- Chapter, lesson, quiz, profile, practice vÃ  AI screen demo.
- Visual Novel demo GenÃ¨ve/vÄ© tuyáº¿n 17.
- Domain types v2, validators, service interfaces, mock adapters, legacy mapper vÃ  contract tests cá»§a M2.
- AI Battle Ä‘ang Ä‘Æ°á»£c má»™t nhÃ¡nh cá»§a nhÃ³m phÃ¡t triá»ƒn; chÆ°a tÃ­ch há»£p vÃ o app chÃ­nh.
- Supabase `.env.local` local-only.
- Bá»™ docs vÃ  approval brief.

### ChÆ°a cÃ³

- Canonical pilot episode Ä‘Æ°á»£c product owner chá»n vÃ  qua review.
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
| DOC-011 | 9 clarification | MVP video production ownership | Codex | DONE | DOC-010 | [`docs/tasks/done/DOC-011.md`](../tasks/done/DOC-011.md) | Product owner review phÃ¢n cÃ´ng Member 2, CONTENT-007 vÃ  release gate |
| DOC-012 | Product scope | Giá»›i háº¡n curriculum vÃ o khÃ¡ng chiáº¿n chá»‘ng Má»¹ táº¡i Viá»‡t Nam | Codex | DONE | DOC-010, DOC-002 | [`docs/tasks/done/DOC-012.md`](../tasks/done/DOC-012.md) | Product owner review pháº¡m vi dÃ i háº¡n vÃ  MVP má»™t chapter máº«u nhiá»u lesson |
| DOC-013 | Documentation | RÃ  soÃ¡t quy táº¯c milestone vÃ  cÃ¡ch AI tá»± tÃ¬m task theo vai trÃ² | Codex | DONE | DOC-010 | [`docs/tasks/done/DOC-013.md`](../tasks/done/DOC-013.md) | Product owner review; 57 Markdown files cÃ³ 0 link lá»—i, 0 card active/blocked/review lá»‡ch |
| DOC-014 | GitHub readiness | Kiá»ƒm tra file chuáº©n bá»‹ Ä‘Æ°a lÃªn GitHub vÃ  lÃ m rÃµ content track Member 1 | Codex | DONE | DOC-010 | [`docs/tasks/done/DOC-014.md`](../tasks/done/DOC-014.md) | Product owner review; build pass, typecheck baseline cÃ²n lá»—i, CONTENT-009 READY |
| DOC-015 | Team handoff | GÃ¡n tÃªn 5 thÃ nh viÃªn vÃ  táº¡o PR tÃ i liá»‡u trÃªn nhÃ¡nh riÃªng | Codex | DONE | DOC-010 | [`docs/tasks/done/DOC-015.md`](../tasks/done/DOC-015.md) | [PR #7](https://github.com/dotruc1526/suchill/pull/7) Ä‘Ã£ má»Ÿ vÃ o `main`; Product owner review |
| DOC-016 | Milestone gate | Ghi quyáº¿t Ä‘á»‹nh Product owner Ä‘Ã³ng M0 vÃ  má»Ÿ M1 | Product owner | DONE | M0-00..07 | [`docs/tasks/done/DOC-016.md`](../tasks/done/DOC-016.md) | M0 Ä‘Ã³ng/M1 má»Ÿ ngÃ y 2026-09-28; source-of-truth vÃ  handoff Ä‘Ã£ Ä‘á»“ng bá»™ |
| DOC-018 | Milestone gate | Audit Gate M2, Ä‘Ã³ng M2 vÃ  má»Ÿ M3 | DÆ°Æ¡ng (Product Owner) + Codex | DONE | M2-01..06 | [`docs/tasks/done/DOC-018.md`](../tasks/done/DOC-018.md) | Ba gate M2 Ä‘áº¡t trÃªn `a4d22b2`; Product Owner duyá»‡t Ä‘Ã³ng M2/má»Ÿ M3 ngÃ y 2026-10-01 |
| DOC-017 | Documentation sync | RÃ  vÃ  Ä‘á»“ng bá»™ task/content docs tÃ¡ch khá»i PR #61 | DÆ°Æ¡ng (Member 4); Codex executor | REVIEW | PR #61 merged; `fd52278` reference | [`docs/tasks/active/DOC-017.md`](../tasks/active/DOC-017.md) | PR62 merged `85b79a9`; HÆ°ng post-merge scope ACCEPTED trÃªn `1dcba50`. Audit 2026-10-02 giá»¯ content REVIEW/production BLOCKED; Thá» vÃ  TrÃºc confirmed current card states 2026-10-02, chá» task-level closure; [evidence](../tasks/evidence/DOC-017-closeout.md) |
| M1-01 | Design system | Figma handoff vÃ  token contract | TrÃºc (Member 2) | DONE | Gate M0 | [`docs/tasks/done/M1-01.md`](../tasks/done/M1-01.md) | Handoff Ä‘Ã£ Ä‘Æ°á»£c HÆ°ng triá»ƒn khai trong FE-003; Vinh QA xÃ¡c nháº­n sau merge PR #33 |

### B. Frontend implementation â€” theo dependency vÃ  milestone gate Phase 9

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| M3-UX-01 | M3 design handoff | UI/UX handoff lesson, Visual Novel, video vÃ  quiz | TrÃºc (Member 2); Codex há»— trá»£ | DONE | DOC-018; M1 foundation DONE; M2-01..06 DONE; DOC-005/006/009 | [Task card](../tasks/done/M3-UX-01.md); `docs/engineering/M3-UX-HANDOFF.md`, `docs/engineering/m3-ux/` | PR #77 merged; HÆ°ng/Vinh approved, DÆ°Æ¡ng nháº­n handoff vÃ  Product Owner nghiá»‡m thu táº¡i head `23cf354`; CONTENT-007 váº«n BLOCKED riÃªng. |
| M3-UX-02 | M3 Home visual follow-up | KhÃ´i phá»¥c Home theo áº£nh cÅ©, giá»¯ service journey PR #72 | TrÃºc; Codex executor | DONE | M3 OPEN; M1/M2 DONE; PR #72/#77 merged | [Card](../tasks/done/M3-UX-02.md) | PR #82 merged `30d0a4f` + FE-011 greeting trÃªn main `8131f05`; DÆ°Æ¡ng consumer ACCEPTED 2026-10-02 (Start/Resume, Back/focus, 375/430px); HÆ°ng UI/tokens ACCEPTED 2026-10-02, khÃ´ng blocker; Vinh checkpoint/focus QA PASS qua text review DÆ°Æ¡ng cung cáº¥p; cáº£ ba scope accepted, DONE; M3 váº«n OPEN |
| FE-001 | Foundation | Sá»­a TypeScript baseline | HÆ°ng (Member 3) | DONE | DOC-010 | [`docs/tasks/done/FE-001.md`](../tasks/done/FE-001.md) | ÄÃ£ sá»­a 18 lá»—i typecheck; PR #12/#13 merged vÃ o main; Vinh nghiá»‡m thu M0-02, card Ä‘á»“ng bá»™ ngÃ y 2026-09-28 |
| FE-002 | Foundation | Chá»n canonical features architecture vÃ  cÃ´ láº­p legacy | HÆ°ng (Member 3) | DONE | FE-001, DOC-010 | [`docs/tasks/done/FE-002.md`](../tasks/done/FE-002.md) | Vinh nghiá»‡m thu: 10 screens trong legacy, khÃ´ng import runtime; `npm run quality` pass ngÃ y 2026-09-28 |
| FE-003 | Design system | Chuáº©n hÃ³a tokens vÃ  UI primitives (M1-02) | HÆ°ng (Member 3) | DONE | M1-01, FE-001, DOC-010 | [`docs/tasks/done/FE-003.md`](../tasks/done/FE-003.md) | PR #33 merged vÃ o `main`; Vinh QA xÃ¡c nháº­n `npm run quality` pass sau merge |
| M1-04 | Layout/navigation | Nghiá»‡m thu TopBar/BottomNav canonical vÃ  mobile safe-area | HÆ°ng (Member 3) | DONE | M0-04, FE-003 | [`docs/tasks/done/M1-04.md`](../tasks/done/M1-04.md) | PR #40 scope-correct; quality pass; Vinh QA xÃ¡c nháº­n safe-area/touch target/navigation evidence |
| M1-05 | Interaction foundation | Motion tokens, reduced motion, sound service vÃ  mute preference | HÆ°ng (Member 3) | DONE | M1-01 | [`docs/tasks/done/M1-05.md`](../tasks/done/M1-05.md) | ÄÆ°á»£c triá»ƒn khai vÃ  review trong PR #33; chá»‰ lÃ  foundation, khÃ´ng Ä‘Ã³ng FE-009 |
| M1-06 | Component QA | QA showcase UI foundation vÃ  accessibility | Vinh (Member 5); TrÃºc review UI/UX | DONE | FE-003, M1-04, M1-05 | [`docs/tasks/done/M1-06.md`](../tasks/done/M1-06.md) | Vinh QA evidence complete; `npm run quality` pass; Product Owner Ä‘Ã³ng M1 vÃ  má»Ÿ M2 ngÃ y 2026-09-29. |
| M1-07 | Gate remediation | Sá»­a narrative choice semantics, Modal focus lifecycle vÃ  token hard-code | HÆ°ng (Member 3); TrÃºc UI/UX review; Vinh accessibility/QA | DONE | M1-01, FE-003, M1-04, M1-05, M1-06 | [`docs/tasks/done/M1-07.md`](../tasks/done/M1-07.md) | PR #53 merged; HÆ°ng/TrÃºc/Vinh approved; QA keyboard 26 checkpoints vÃ  full quality PASS; Product Owner nghiá»‡m thu ngÃ y 2026-09-29. |
| M1-08 | UI remediation | KhÃ´i phá»¥c visual intent PR #40, chuáº©n hÃ³a icon vÃ  typography | TrÃºc (Member 2); HÆ°ng/Vinh/PO review | DONE | M1-01, FE-003, M1-04, M1-06 | [`docs/tasks/done/M1-08.md`](../tasks/done/M1-08.md) | PR #56 merged as `0661047`; HÆ°ng/Vinh khÃ´ng cÃ²n blocker; Product Owner nghiá»‡m thu áº£nh 375px/430px ngÃ y 2026-09-29. |
| FE-004 | App shell | TÃ¡ch navigation/view state khá»i App quÃ¡ lá»›n | HÆ°ng (Member 3); Codex bá»• sung theo yÃªu cáº§u Vinh | DONE | FE-001, DOC-005, DOC-006 | [`docs/tasks/done/FE-004.md`](../tasks/done/FE-004.md) | `tab/view` state á»Ÿ hook riÃªng, App 87 dÃ²ng; quality + navigation smoke pass; Vinh nghiá»‡m thu ngÃ y 2026-09-28 |
| FE-005 / M3-03 | VN engine | XÃ¢y player v2 trÃªn mock adapter | DÆ°Æ¡ng (Member 4); Codex executor | DONE | M1 DONE, M2 DONE, M3 OPEN | [`docs/tasks/done/M3-03.md`](../tasks/done/M3-03.md) | PR #74 merged `fc00d65`; HÆ°ng approved head `7fabea3`, Vinh approved progress/QA, 2/2 Quality PASS; integration váº«n lÃ  task riÃªng. |
| FE-006 / M3-04 | Video | XÃ¢y video-led lesson player trÃªn resolved mock media | DÆ°Æ¡ng (Member 4); Codex executor | DONE | M1 DONE, M2 DONE, M3 OPEN | [`docs/tasks/done/M3-04.md`](../tasks/done/M3-04.md) | PR #75 merged `78cdaa5`; HÆ°ng/Vinh approved head `0636c89`, 2/2 Quality PASS; canonical media váº«n chá» CONTENT-007. |
| FE-007 / M3-05 | Quiz | Practice/scored quiz flow trÃªn trusted mock contract | DÆ°Æ¡ng (Member 4); Codex executor | DONE | M1 DONE, M2 DONE, M3 OPEN | [`docs/tasks/done/M3-05.md`](../tasks/done/M3-05.md) | PR #76 merged; HÆ°ng/Vinh approved head `fc7a830`, 2/2 Quality PASS; khÃ´ng client grading/reward. |
| FE-008 | Profile | Hiá»ƒn thá»‹ account XP/streak/achievement | DÆ°Æ¡ng (Member 4) | BACKLOG | FE-004, BE-003 | `src/features/profile/` | Dá»¯ liá»‡u láº¥y qua service; sync Ä‘Ãºng account |
| FE-009 | Feature interaction adoption & polish | Ãp dá»¥ng foundation M1-05 vÃ o cÃ¡c feature screens: motion, states, radius, sound vÃ  mobile performance | HÆ°ng (Member 3); TrÃºc/DÆ°Æ¡ng phá»‘i há»£p | BACKLOG | M1-05, FE-005, FE-006, FE-007, FE-008, DOC-005, DOC-009 | `src/features/`, `src/components/ui/` | Chá»‰ claim sau khi cÃ¡c feature screen tá»“n táº¡i; khÃ´ng lÃ m láº¡i sound/reduced-motion foundation tá»« PR #33 |
| FE-010 | Engineering quality | Chuáº©n hÃ³a reusable components/functions vÃ  performance budget | HÆ°ng (Member 3); Vinh phá»‘i há»£p | BACKLOG | FE-001, FE-002, FE-003, DOC-006 | `src/components/`, `src/features/`, `src/services/`, `src/types/` | KhÃ´ng gá»i DB trong UI; logic dÃ¹ng chung cÃ³ test; lazy-load/media optimization; khÃ´ng abstraction thá»«a |
| FE-011 | M3 personalization | Lá»i chÃ o Home theo tÃªn ngÆ°á»i dÃ¹ng | DÆ°Æ¡ng (Member 4); Codex executor; Vinh/HÆ°ng review | DONE | M2-01, M2-03, M2-04 DONE; M3 OPEN | [Card](../tasks/done/FE-011.md) | PR #81 merged `a7db965`; HÆ°ng/Vinh APPROVE runtime `17dd847` báº±ng text; DÆ°Æ¡ng cho phÃ©p dismiss review cÅ© vÃ  admin merge. Quality 2/2 PASS head `3c1673c`; M3 váº«n OPEN. |
| M3-01 | M3 learning journey | Home/chapter/lesson journey trÃªn mock services | DÆ°Æ¡ng (Member 4); Codex executor | DONE | M1 DONE, M2 DONE, M3 OPEN | [`docs/tasks/done/M3-01.md`](../tasks/done/M3-01.md) | PR #72 merged; Vinh approved vÃ  HÆ°ng xÃ¡c nháº­n khÃ´ng cÃ²n finding táº¡i head `71cbad2`; 2/2 Quality PASS. |
| M3-02 | M3 lesson renderer | Standard/mixed lesson renderer trÃªn mock services | DÆ°Æ¡ng (Member 4); Codex executor | DONE | M2 DONE, M3 OPEN | [`docs/tasks/done/M3-02.md`](../tasks/done/M3-02.md) | PR #73 merged; Vinh approved vÃ  HÆ°ng xÃ¡c nháº­n khÃ´ng cÃ²n finding táº¡i head `6117578`; 2/2 Quality PASS. |
| M3-INTEGRATION-01 | M3 learning integration | Ná»‘i journey/lesson renderer vá»›i VN, video vÃ  quiz players | DÆ°Æ¡ng (Member 4); Codex executor | DONE | M3-01..05 DONE; M3-UX-01 DONE; M3 OPEN | [`docs/tasks/done/M3-INTEGRATION-01.md`](../tasks/done/M3-INTEGRATION-01.md) | PR #79 merged `a55b924`; HÆ°ng/Vinh approved; 2/2 Quality PASS, gá»“m browser regression Ä‘Ã³ng/hoÃ n táº¥t VN vÃ  focus restoration. M3 váº«n OPEN. |
| M3-06 | M3 completion/profile | Completion/profile UI trÃªn mock services | DÆ°Æ¡ng; Codex executor; HÆ°ng/Vinh review | DONE | M3 OPEN; learning integration DONE; adapter DONE / PR92 | [Card](../tasks/done/M3-06.md); [runtime evidence](../tasks/evidence/M3-06-runtime.md) | Service-driven completion/profile implemented; 111 unit/23 component/8 E2E PASS, scan 359/0; Vinh service/reward/QA ACCEPTED (text) and HÆ°ng architecture/UI/a11y APPROVED (text); PR94 merged 20e3263, final head e5604e0 CI 2/2 PASS. M3-07 awaits separate card/claim |
| M3-COMPLETION-01 | M3 mock services | Completion/account-summary adapter vÃ  tests D1â€“D7 | Vinh (Member 5); Codex executor | DONE | M3 OPEN; M3-01..05/integration DONE; PR84 agreement `5144fa2` | [card](../tasks/done/M3-COMPLETION-01.md) | PR88 merged a339af6; HÆ°ng accepted contract/architecture runtime 68580ed, DÆ°Æ¡ng approved consumer; merged head e6a3940 CI 2/2 PASS, quality 95/22/7, scan 338/0. Adapter handed off; M3-06 READY for DÆ°Æ¡ng UI claim. |

| M3-07 | M3 QA | Kiá»ƒm thá»­ tÆ°Æ¡ng tÃ¡c toÃ n bá»™ learning loop | Vinh; Codex executor; HÆ°ng/DÆ°Æ¡ng review | IN PROGRESS | M3-01..06, integration, QA-001/002 DONE | [Card](../tasks/active/M3-07.md) | Claimed 2026-10-02 on main 0bd9e7a, branch codex/m3-07-learning-loop-qa; explicit test/docs files in card. Audit coverage and verify journey/players/completion/profile, failure states and mobile/focus. No QA acceptance or milestone gate change yet. HÆ°ng architecture/accessibility claim APPROVED (text), DÆ°Æ¡ng learning-consumer claim GitHub APPROVED at ff3e1ed; both 2026-10-02. Implement explicit coverage matrix; results not yet accepted. |
| M3-STATUS-01 | M3 docs | Äá»“ng bá»™ tráº¡ng thÃ¡i/owner/next action | DÆ°Æ¡ng; Codex executor; HÆ°ng/Vinh review | DONE | M3 OPEN; PR83/88 Ä‘Ã£ Ä‘á»‘i chiáº¿u | [Card](../tasks/done/M3-STATUS-01.md) | PR90 merged e7e8aac; HÆ°ng delta APPROVE, Vinh docs/service APPROVE; acceptance head 65c82d2 Quality 2/2 PASS; reviewer-authorized closeout, M3 OPEN |

### C. Backend and Supabase â€” theo dependency vÃ  milestone gate Phase 9

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| M2-01 | M2 domain contract | Triá»ƒn khai domain types v2 theo Phase 5 | Vinh (Member 5); Codex executor | DONE | Gate M2 open, M0 DONE, DOC-006 | [`docs/tasks/done/M2-01.md`](../tasks/done/M2-01.md) | HÆ°ng ACCEPTED 2026-09-30 trÃªn main `7175bda`; type contract vÃ  consumer corrections Ä‘áº¡t. Gate M2 do PO quyáº¿t riÃªng. [Review/evidence](../tasks/done/M2-01.md#reviewer-acceptance--2026-09-30) |
| M2-02 | M2 validators | Kiá»ƒm tra lesson/story/media vÃ  tham chiáº¿u nguá»“n trÆ°á»›c publish | Vinh (Member 5); Codex executor | DONE | M2-01 merged | [`docs/tasks/done/M2-02.md`](../tasks/done/M2-02.md) | HÆ°ng ACCEPTED 2026-09-30 trÃªn main `7175bda`; validators fail closed cho publication lookup. Gate M2 do PO quyáº¿t riÃªng. [Review/evidence](../tasks/done/M2-02.md#reviewer-acceptance--2026-09-30) |
| M2-03 | M2 service contracts | HoÃ n thiá»‡n interface domain-facing cho learning services | Vinh (Member 5); Codex executor | DONE | M2-01 merged | [`docs/tasks/done/M2-03.md`](../tasks/done/M2-03.md) | HÆ°ng ACCEPTED 2026-09-30 trÃªn main `7175bda`; document/practice/per-question contracts vÃ  consumer fit Ä‘áº¡t. Gate M2 do PO quyáº¿t riÃªng. [Review/evidence](../tasks/done/M2-03.md#reviewer-acceptance--2026-09-30) |
| M2-04 | M2 mock adapters | Má»Ÿ rá»™ng mock adapters theo contract cho feature dÃ¹ng khÃ´ng cáº§n Supabase | Vinh (Member 5) + DÆ°Æ¡ng (Member 4); Codex executor backend adapter | DONE | M2-03 implemented on this branch | [`docs/tasks/done/M2-04.md`](../tasks/done/M2-04.md) | HÆ°ng ACCEPTED 2026-09-30 trÃªn main `7175bda`; published reads, session isolation and quiz boundaries pass. Gate M2 do PO quyáº¿t riÃªng. [Review/evidence](../tasks/done/M2-04.md#reviewer-acceptance--2026-09-30) |
| M2-05 | M2 legacy boundary | Mapper tÆ°á»ng minh cho demo legacy sang domain v2 | Vinh (Member 5); Codex executor | DONE | M2-01 merged | [`docs/tasks/done/M2-05.md`](../tasks/done/M2-05.md) | HÆ°ng ACCEPTED 2026-09-30 trÃªn main `7175bda`; DÆ°Æ¡ng consumer boundary Ä‘áº¡t, demo giá»¯ fixture-only. Gate M2 do PO quyáº¿t riÃªng. [Review/evidence](../tasks/done/M2-05.md#reviewer-acceptance--2026-09-30) |
| M2-06 | M2 contract tests | Kiá»ƒm tra validators vÃ  mock/domain contract theo fixture | Vinh (Member 5); Codex executor | DONE | M2-02, M2-03, M2-04 implemented on this branch | [`docs/tasks/done/M2-06.md`](../tasks/done/M2-06.md) | HÆ°ng ACCEPTED 2026-09-30 trÃªn main `7175bda`; contract regressions pass. Gate M2 do PO quyáº¿t riÃªng. [Review/evidence](../tasks/done/M2-06.md#reviewer-acceptance--2026-09-30) |
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
| CONTENT-002 | 3 | Chá»n chapter máº«u vÃ  pilot episode trong pháº¡m vi sáº£n pháº©m | Thá» (Member 1); Product owner quyáº¿t Ä‘á»‹nh | DONE | DOC-003, DOC-004, DOC-012 | [`docs/tasks/done/CONTENT-002.md`](../tasks/done/CONTENT-002.md) | Product owner chá»n chapter thuá»™c khÃ¡ng chiáº¿n chá»‘ng Má»¹; khÃ´ng máº·c Ä‘á»‹nh dÃ¹ng GenÃ¨ve demo |
| CONTENT-003 | 3 | Historical source/media review pilot | TrÃºc (Member 2) | REVIEW | CONTENT-002, DOC-004 | [`docs/tasks/active/CONTENT-003.md`](../tasks/active/CONTENT-003.md) | Historical review Ä‘Æ°á»£c hash-bind cho screenplay/narration; source registry, media/audio rights vÃ  handoff cÃ²n pending. KhÃ´ng má»Ÿ production |
| CONTENT-004 | 5 | Viáº¿t screenplay scene-by-scene vÃ  ká»‹ch báº£n/storyboard video | Thá» (Member 1) | REVIEW | CONTENT-003, CONTENT-008, DOC-006 | [`docs/tasks/active/CONTENT-004.md`](../tasks/active/CONTENT-004.md) | Historical/language state synced to exact approved artifact hashes; Vinh ACCEPTED technical structure; media/audio/handoff remain pending via CONTENT-014; no production |
| CONTENT-005 | 8 | Content QA vÃ  Vietnamese language review | Vinh (Member 5); Thá» phá»‘i há»£p | BLOCKED | CONTENT-004, CONTENT-007, DOC-009 | [`docs/tasks/blocked/CONTENT-005.md`](../tasks/blocked/CONTENT-005.md) | KhÃ´ng cÃ²n critical content issue; video/caption/transcript khá»›p ká»‹ch báº£n |
| CONTENT-006 | 3/4 | Review vÃ  phÃ¡t triá»ƒn `episode-portrait-final.mp4` | TrÃºc (Member 2) | IN PROGRESS | DOC-004 | [`docs/tasks/active/CONTENT-006.md`](../tasks/active/CONTENT-006.md) | TrÃºc lÃ  executor vÃ  historical/media reviewer; Thá» cáº¥p quyá»n review objective/wording; Product owner cáº¥p quyá»n chá»‘t media/legal; media/legal chá»‘t `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`; 4 claim VERIFIED, 1 claim REVISION_REQUIRED_BEFORE_USE |
| CONTENT-007 | MVP video | BiÃªn táº­p video theo ká»‹ch báº£n vÃ  bÃ n giao cho bÃ i há»c canonical | TrÃºc (Member 2) | BLOCKED | CONTENT-003, CONTENT-004, DOC-004 | [`docs/tasks/blocked/CONTENT-007.md`](../tasks/blocked/CONTENT-007.md) | Má»™t sá»‘ artifact Ä‘Ã£ hash-bound historical approval; source/media/audio rights vÃ  handoff cÃ²n pending; chÆ°a Ä‘Æ°á»£c báº¯t Ä‘áº§u production |
| CONTENT-008 | MVP curriculum | Láº­p báº£n Ä‘á»“ chapter máº«u gá»“m nhiá»u lesson Ä‘a Ä‘á»‹nh dáº¡ng | Thá» (Member 1) | DONE | CONTENT-002, DOC-003, DOC-012 | [`docs/tasks/done/CONTENT-008.md`](../tasks/done/CONTENT-008.md) | Learning objectives, lesson order/format vÃ  pilot episode/video placement rÃµ; historical reviewer kiá»ƒm tra scope |
| CONTENT-009 | NghiÃªn cá»©u nguá»“n sÆ¡ bá»™ | Thá» láº­p danh má»¥c nguá»“n/chá»§ Ä‘á» á»©ng viÃªn trong pháº¡m vi khÃ¡ng chiáº¿n chá»‘ng Má»¹ | Thá» (Member 1) | DONE | DOC-003, DOC-004 | [`docs/tasks/done/CONTENT-009.md`](../tasks/done/CONTENT-009.md) | ÄÃ£ hoÃ n táº¥t nghiÃªn cá»©u 4 chá»§ Ä‘á» vÃ  Review Round 3 (Final Adversarial Review); sáºµn sÃ ng bÃ n giao cho Product Owner (CONTENT-002) vÃ  Historical Reviewer (CONTENT-003) |
| CONTENT-010 | MVP curriculum | Ná»™i dung BÃ i 2 (Interactive Map - Sáº¥m sÃ©t ná»™i Ä‘Ã´) | Thá» (Member 1) | REVIEW | CONTENT-008 | [docs/tasks/active/CONTENT-010.md](../tasks/active/CONTENT-010.md) | Interactive lesson/story review state synced to reviewed hashes; map remains pending; media/source/technical handoff still pending via CONTENT-014 |
| CONTENT-011 | MVP curriculum | Ná»™i dung BÃ i 3 (Standard) & BÃ i 4 (Synthesis) | Thá» (Member 1) | REVIEW | CONTENT-008 | [docs/tasks/active/CONTENT-011.md](../tasks/active/CONTENT-011.md) | Historical review Ä‘áº¡t; chá» Vinh technical QA vÃ  media/handoff sign-off qua CONTENT-014 |
| CONTENT-012 | MVP curriculum | ÄÃ³ng gÃ³i NgÃ¢n hÃ ng cÃ¢u há»i (Quiz Schema) | Thá» (Member 1) | REVIEW | CONTENT-008 | [docs/tasks/active/CONTENT-012.md](../tasks/active/CONTENT-012.md) | Quiz historical/learning verdict riÃªng cÃ²n pending cho hash trong card; khÃ´ng suy tá»« CONTENT-010; khÃ´ng seed/integrate |
| CONTENT-013 | Láº­p khung giÃ¡o trÃ¬nh Chapter Äiá»‡n BiÃªn Phá»§ trÃªn khÃ´ng 1972 | Thá» (Member 1) | DONE | CONTENT-009 | [docs/tasks/done/CONTENT-013.md](../tasks/done/CONTENT-013.md) | Product Owner sign-off APPROVED ngÃ y 2026-09-28; curriculum map Ä‘Ã£ bÃ n giao |
| CONTENT-014 | MVP authoring remediation | HoÃ n thiá»‡n gÃ³i authoring Máº­u ThÃ¢n sau PR #21 | TrÃºc (Member 2) | REVIEW | DOC-003, DOC-004, DOC-006, DOC-009 | [docs/tasks/active/CONTENT-014.md](../tasks/active/CONTENT-014.md) | TrÃºc Ä‘á»“ng bá»™ historical state theo artifact hashes, quiz giá»¯ pending; HÆ°ng/Vinh recheck PR85 [report](../tasks/evidence/CONTENT-014-technical-qa.md); media/legal/production pending |
| CONTENT-015 | Ká»‹ch báº£n chi tiáº¿t BÃ i 1 Chapter 1972 (Tá»‘i háº­u thÆ° tá»« báº§u trá»i) | Thá» (Member 1) | DONE | CONTENT-013 | [docs/tasks/done/CONTENT-015.md](../tasks/done/CONTENT-015.md) | Thá» Ä‘Ã£ hoÃ n thÃ nh ká»‹ch báº£n 5 cáº£nh 110s, VTT captions vÃ  nguá»“n chÃ­nh thá»‘ng |
| CONTENT-017 | MVP curriculum | Ká»‹ch báº£n chi tiáº¿t & Story Data BÃ i 2 Flagship Visual Novel 1972 (SAM-2 Váº¡ch nhiá»…u tÃ¬m thÃ¹) | Thá» (Member 1) | DONE | CONTENT-016 | [`docs/tasks/done/CONTENT-017.md`](../tasks/done/CONTENT-017.md) | ÄÃ£ hoÃ n thÃ nh vÃ  merge vÃ o main qua PR #54; validator PASS |
| CONTENT-018 | MVP curriculum | BÃ i 3 Chapter 1972: 12 NgÃ y Ä‘Ãªm rá»±c lá»­a (Standard Reading) | Thá» (Member 1) | REVIEW | CONTENT-017 | [`docs/tasks/active/CONTENT-018.md`](../tasks/active/CONTENT-018.md) | HoÃ n thÃ nh bÃ i Ä‘á»c tiÃªu chuáº©n 3 pháº§n, Ä‘á»‘i chiáº¿u sá»‘ liá»‡u Viá»‡t Nam/USAF; validator 1972-lesson03 PASS; chá» TrÃºc/PO duyá»‡t |
| CONTENT-019 | MVP curriculum | BÃ i 4 Chapter 1972: ÄÃ³ng gÃ³i NgÃ¢n hÃ ng cÃ¢u há»i tráº¯c nghiá»‡m (Quiz Schema) | Thá» (Member 1) | REVIEW | CONTENT-018 | [`docs/tasks/active/CONTENT-019.md`](../tasks/active/CONTENT-019.md) | HoÃ n thÃ nh ngÃ¢n hÃ ng 5 cÃ¢u há»i phá»§ 4 CLO; validator 1972-quiz PASS; chá» TrÃºc/PO duyá»‡t |

### E. QA and release

| ID | Phase | Task | Owner | Status | Depends on | Files | Acceptance / next action |
|---|---|---|---|---|---|---|---|
| QA-001 | 8 / M3 | Schema/story validation checklist | Vinh (Member 5); HÆ°ng reviewer; DÆ°Æ¡ng consumer | DONE | DOC-006, DOC-009 DONE | [Card](../tasks/done/QA-001.md); [evidence](../tasks/evidence/QA-001-validation.md) | HÆ°ng/DÆ°Æ¡ng ACCEPTED; PR85 merged ed234e9. 17 validation tests PASS; final quality 100 unit/22 component/7 E2E, CI 2/2 PASS. Typed-validator scope only; historical/media/production gates separate. |
| QA-002 | 8 / M3 | Mobile/player interaction test matrix | Vinh; HÆ°ng reviewer; DÆ°Æ¡ng consumer reviewer | DONE | FE-005, FE-006, DOC-009 DONE | [Card](../tasks/done/QA-002.md); [matrix](../tasks/evidence/QA-002-mobile-player-matrix.md) | PR83 merged `cda4a69`; DÆ°Æ¡ng APPROVED `9718317`, HÆ°ng ACCEPTED harness/accessibility trÃªn main merged (76 unit/22 component/7 E2E, scan 332/0); card DONE, M3 OPEN |
| QA-003 | 8 | Supabase RLS/security verification | Vinh (Member 5) | BACKLOG | BE-002, BE-003, DOC-009 | security tests | User cannot read/write another userâ€™s progress |
| QA-004 | 8 | Historical/media release gate | Historical reviewer | BACKLOG | CONTENT-003, CONTENT-005, CONTENT-007 | release checklist | 0 critical historical/source/media issue, gá»“m video MVP |
| QA-005 | 9 | Pilot release verification | Vinh (Member 5); toÃ n nhÃ³m phá»‘i há»£p | BACKLOG | DOC-010, CONTENT-008, CONTENT-007, FE-006, QA-001..004 | release report | MVP cÃ³ má»™t chapter máº«u nhiá»u lesson trong pháº¡m vi khÃ¡ng chiáº¿n chá»‘ng Má»¹ vÃ  Ã­t nháº¥t má»™t video Ä‘Ã£ duyá»‡t cháº¡y trong bÃ i há»c; cÃ¡c acceptance khÃ¡c pass |
| QA-006 | M3 gate hardening | Cháº·n E2E Chrome cleanup treo vÃ´ háº¡n vÃ  giá»›i háº¡n thá»i gian Quality job | Vinh (Member 5); Codex executor | DONE | PR #71 Quality run `36751263388` hung | [`docs/tasks/done/QA-006.md`](../tasks/done/QA-006.md) | Bounded cleanup, page-target wait vÃ  5-minute job timeout Ä‘áº¡t; push/pull-request Quality PASS trÃªn `e5d718d` |

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
| CONTENT-003 | TrÃºc / TrÃºc | TrÃºc historical/media; Vinh technical QA | 2026-09-27; review 2026-09-28 | Bá»• sung nguá»“n Ä‘á»c Ä‘Æ°á»£c cho CLM-MT68-01; chá»‘t review vÃ  nguá»“n audio | Source nÄƒm má»¥c tiÃªu chÆ°a Ä‘á»c láº¡i Ä‘Æ°á»£c; sign-off/audio cÃ²n thiáº¿u | Branch `codex/content-status-sync`; claim 3 tÃ i liá»‡u authoring + card/board/report; [review](../tasks/active/CONTENT-003-004-REVIEW.md); validator PASS |
| CONTENT-012 | Thá» / TrÃºc | Vinh (QA); Thá» (objective) | 2026-09-27 | REVIEW nÄƒm cÃ¢u há»i vÃ  source ID | ChÆ°a xÃ¡c nháº­n mapper/seed contract; authoring-only | Branch `feature/content-expansion-mt68`; claim quiz/card; [handoff](../tasks/active/PR21-HANDOFF.md) |
| CONTENT-014 | TrÃºc / TrÃºc; Codex há»— trá»£ | Vinh technical QA | 2026-09-27 | Vinh xÃ¡c nháº­n task-level handoff vÃ  validator evidence | ChÆ°a cÃ³ technical QA sign-off cho card CONTENT-014 | Authoring remediation hoÃ n táº¥t; validator PASS; [card](../tasks/active/CONTENT-014.md) |
| CONTENT-007 | TrÃºc, chÆ°a báº¯t Ä‘áº§u production | Thá»/Product owner + historical reviewer; Vinh media/accessibility | ChÆ°a báº¯t Ä‘áº§u | HoÃ n táº¥t source/media/audio rights, review handoff vÃ  dependency riÃªng; chá»‰ sau Ä‘Ã³ má»›i xem xÃ©t claim media output | Má»™t sá»‘ artifact Ä‘Ã£ hash-bound historical approval; quiz/map/source/media vÃ  production acceptance cÃ²n pending | CONTENT-007 remains BLOCKED; CONTENT-006 chá»‰ REFERENCE_ONLY ná»™i bá»™; [card](../tasks/blocked/CONTENT-007.md) |
| CONTENT-018 | Thá» (Member 1) | TrÃºc (historical); Product Owner | 2026-09-28 | REVIEW bÃ i Ä‘á»c tiÃªu chuáº©n BÃ i 3 1972, Ä‘á»‘i chiáº¿u sá»‘ liá»‡u vÃ  cÃ¢u há»i suy ngáº«m; chá» TrÃºc/PO duyá»‡t | KhÃ´ng | Branch `content/tho-chapter-1972-package`; [card](../tasks/active/CONTENT-018.md); [lesson](../content/LESSON-03-1972-STANDARD.md); validator PASS |
| CONTENT-019 | Thá» (Member 1) | TrÃºc (historical); Product Owner | 2026-09-29 | REVIEW ngÃ¢n hÃ ng 5 cÃ¢u há»i tráº¯c nghiá»‡m Chapter 1972 phá»§ 4 CLO; chá» TrÃºc/PO duyá»‡t | KhÃ´ng | Branch `content/tho-chapter-1972-package`; [card](../tasks/active/CONTENT-019.md); [quiz](../content/QUIZ-1972.json); validator PASS |
| CONTENT-006 | TrÃºc (Member 2) / TrÃºc | TrÃºc (historical/media; Thá» cáº¥p quyá»n objective/wording; Product owner cáº¥p quyá»n media/legal) | 2026-09-24 | Náº¿u dÃ¹ng ngoÃ i `REFERENCE_ONLY`, táº¡o media package má»›i: sá»­a wording, thay/xÃ¡c minh audio/nháº¡c/SFX, khÃ³a manifest/hash/source export vÃ  review láº¡i | MP4 hiá»‡n táº¡i váº«n chá»©a wording cÅ©; audio Edge TTS, nháº¡c/SFX vÃ  source export chÆ°a Ä‘á»§ báº±ng chá»©ng publish | [Evidence vÃ  phiáº¿u thá»±c hiá»‡n](../tasks/active/active.md): objective accepted; media/legal `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`; 4 claim VERIFIED, 1 claim REVISION_REQUIRED_BEFORE_USE; REFERENCE_ONLY |
| BATTLE-001 | NhÃ³m AI Battle / nhÃ³m ngoÃ i | Product + Security reviewer | 2026-09-22 | HoÃ n thiá»‡n prototype vÃ  chuáº©n bá»‹ gÃ³i bÃ n giao | ChÆ°a cÃ³ repo/branch vÃ  contract | TÃ­nh nÄƒng Ä‘ang phÃ¡t triá»ƒn Ä‘á»™c láº­p |

## Task update log

Má»—i láº§n handoff quan trá»ng thÃªm má»™t dÃ²ng má»›i nháº¥t á»Ÿ Ä‘áº§u báº£ng:

| Date | Task | Author | Update | Evidence / next owner |
|---|---|---|---|---|
| 2026-10-02 | CONTENT-018/PR #65 | Thá» (Member 1) | TÃ¡ch má»‘c Báº¡ch Mai 22/12 khá»i KhÃ¢m ThiÃªn 26/12, ghi Ä‘Ãºng 28 náº¡n nhÃ¢n (27 nhÃ¢n viÃªn y táº¿, 1 bá»‡nh nhÃ¢n) vÃ  thÃªm nguá»“n NhÃ¢n DÃ¢n; bá» wording vÆ°á»£t chá»©ng cá»© vá» TÃ²a Äáº¡i sá»©; sá»­a handoff M3 theo `LearningDocument`/service contract hiá»‡n hÃ nh; khÃ´ng tá»± duyá»‡t historical gate | Ba content validators PASS; reviewer TrÃºc cáº§n re-review trÃªn head má»›i; CONTENT-018/019 giá»¯ REVIEW |
| 2026-10-02 | DOC-017 | TrÃºc (Member 2 â€” reviewer) | XÃ¡c nháº­n tráº¡ng thÃ¡i content hiá»‡n hÃ nh: CONTENT-003/004/010/011/012/014 REVIEW, CONTENT-007 BLOCKED, artifact pilot NEEDS_HISTORICAL_REVIEW; DOC-017 giá»¯ REVIEW | [DOC-017](../tasks/active/DOC-017.md) má»¥c Reviewer confirmation; next reviewer ghi task-level acceptance, giá»¯ production BLOCKED |
| 2026-10-02 | M3-COMPLETION-01 | HÆ°ng (Member 3 â€” reviewer) | ACCEPTED hai fix `68580ed` (optional-only fail-closed, backwards-day watermark+rollback): 95/22/7 PASS, scan 338/0, sensitivity 3-failâ†’19/19 | [M3-COMPLETION-01](../tasks/done/M3-COMPLETION-01.md); chá» DÆ°Æ¡ng re-review + CI, giá»¯ REVIEW |
| 2026-10-02 | QA-002 | HÆ°ng (Member 3 â€” reviewer) | ACCEPTED harness/accessibility trÃªn main `cda4a69`: blank-start/navigate, readiness 20s bounded, reload-loader má»›i, font fallback, Button 44px; 76/22/7 PASS, scan 332/0; chuyá»ƒn DONE | [QA-002](../tasks/done/QA-002.md); DÆ°Æ¡ng Ä‘Ã£ APPROVED, M3 OPEN, khÃ´ng quyáº¿t gate |
| 2026-10-02 | CONTENT-014 / CONTENT-012 | TrÃºc (Member 2) | Äá»“ng bá»™ historical/language state theo artifact hashes khá»›p verdict 2026-09-28; quiz giá»¯ `NEEDS_HISTORICAL_REVIEW`, map cÅ©ng pending vÃ¬ report khÃ´ng bound verdict cá»¥ thá»ƒ | [CONTENT-014](../tasks/active/CONTENT-014.md); HÆ°ng/Vinh recheck PR85; rights/audio/source/handoff pending; CONTENT-007 BLOCKED; M3 OPEN / M4 LOCKED |
| 2026-10-02 | M3-UX-02 | HÆ°ng (Member 3 â€” reviewer) | UI/tokens ACCEPTED trÃªn main `8131f05`: 0 hex hard-code, icon/typography/targets Ä‘áº¡t, áº£nh 375/430px Ä‘Ãºng phÃ¢n cáº¥p; typecheck/build/76 unit/22 component/4 E2E PASS, scan 326/0 | [M3-UX-02](../tasks/done/M3-UX-02.md) má»¥c Reviewer acceptance; next Vinh checkpoint/focus QA, giá»¯ REVIEW |
| 2026-10-02 | FE-011 | DÆ°Æ¡ng / Codex | PR #81 merged `a7db965`; ghi nháº­n hai reviewer APPROVE báº±ng text vÃ  DÆ°Æ¡ng cho phÃ©p dismiss review cÅ©/admin merge; chuyá»ƒn DONE | [FE-011](../tasks/done/FE-011.md); Quality 2/2 PASS; M3 váº«n OPEN |
| 2026-10-02 | FE-011 | DÆ°Æ¡ng / Codex | Ghi nháº­n Vinh APPROVE service/QA trÃªn `17dd847` qua review DÆ°Æ¡ng cung cáº¥p; Quality 2/2 success; GitHub váº«n giá»¯ CHANGES_REQUESTED cÅ© cá»§a HÆ°ng, merge bá»‹ cháº·n | [FE-011](../tasks/done/FE-011.md); HÆ°ng/Vinh cáº­p nháº­t review GitHub, giá»¯ REVIEW |
| 2026-10-02 | FE-011 | HÆ°ng (Member 3 â€” reviewer) | Re-review head tÃ­ch há»£p `17dd847`: APPROVE UI integration, khÃ´ng blocker; dashboard/focus/tokens/mobile layout Ä‘áº¡t; typecheck/build/76 unit/22 component/4 E2E PASS, scan 324/0 | [FE-011](../tasks/done/FE-011.md) má»¥c Reviewer acceptance; next Vinh service/QA review, chÆ°a merge/DONE |
| 2026-10-01 | CONTENT-018 / CONTENT-019 | Thá» (Member 1) | Kháº¯c phá»¥c 6 Ä‘iá»ƒm review cá»§a TrÃºc/DÆ°Æ¡ng/HÆ°ng: chuáº©n hÃ³a q04 KhÃ¢m ThiÃªn, 5 node sÆ¡ Ä‘á»“, rewrite M3 guide theo boundary service/receipt, gá»¡ SQL/policy out-of-scope, move card CONTENT-017 sang done/ | [`docs/content/CHAPTER-1972-PACKAGE.md`](../content/CHAPTER-1972-PACKAGE.md); 3 validators PASS; card CONTENT-017 moved to done/ |
| 2026-10-01 | M3-UX-01 | TrÃºc / Codex | Push `codex/truc-m3-ui-handoff`, má»Ÿ PR ready for review; giá»¯ task REVIEW | [PR #77](https://github.com/dotruc1526/suchill/pull/77); LFS upload Ä‘áº¡t, merge-tree vá»›i main `327bf24` khÃ´ng conflict; HÆ°ng/Vinh/DÆ°Æ¡ng review |
| 2026-10-01 | M3-UX-01 | TrÃºc / Codex | ThÃªm Ä‘iá»ƒm nháº¥n Sá»¬u theo yÃªu cáº§u TrÃºc: hero Chapter/lá»i chÃ o vÃ  mark cáº¡nh tÃªn app trÃªn 6 mÃ n; reuse asset repo cÃ³ sáºµn; tráº£ REVIEW | Browser 20 nhÃ³m PASS, image loading/alt/byte equality vÃ  layout Ä‘áº¡t; [evidence](../engineering/m3-ux/EVIDENCE.md); HÆ°ng/Vinh/DÆ°Æ¡ng review |
| 2026-10-01 | M3-UX-01 | TrÃºc / Codex | Reopened theo yÃªu cáº§u tá»± kiá»ƒm tra/lÃ m Ä‘áº¹p; polish 6 mÃ n, icon SVG/choice A/B, VN gá»n, video controls, panel desktop; tráº£ REVIEW | Browser 19 nhÃ³m PASS á»Ÿ 375/430px vÃ  desktop 1280px; 9 cáº·p contrast â‰¥4.5:1; [evidence](../engineering/m3-ux/EVIDENCE.md); HÆ°ng/Vinh/DÆ°Æ¡ng review |
| 2026-10-01 | M3-UX-01 | TrÃºc / Codex | HoÃ n táº¥t UI/UX prototype lesson/VN/video/quiz, flow/state matrix vÃ  service/primitive mapping; chuyá»ƒn REVIEW | Browser 17 nhÃ³m PASS á»Ÿ 375/430px, typecheck/build PASS; HÆ°ng/Vinh/DÆ°Æ¡ng review; CONTENT-007 váº«n BLOCKED |
| 2026-10-01 | DOC-018 / Gate M2 | DÆ°Æ¡ng (Product Owner) + Codex | Audit ba Ä‘iá»u kiá»‡n Gate M2 Ä‘áº¡t; Product Owner Ä‘Ã³ng M2 vÃ  má»Ÿ M3. M3 implementation chá»‰ Ä‘Æ°á»£c báº¯t Ä‘áº§u theo dependency, task card, reviewer vÃ  file claim | PR #70 merge `a4d22b2`; M2-01..06 DONE; [DOC-018](../tasks/done/DOC-018.md); next DÆ°Æ¡ng claim task M3 há»£p lá»‡, Vinh phá»‘i há»£p contract/QA |
| 2026-09-30 | M2-01..06 | HÆ°ng (Member 3 â€” reviewer) + Codex | HÆ°ng ghi nghiá»‡m thu task-level ACCEPTED cho cáº£ 6 task M2 trÃªn main `7175bda`; cards chuyá»ƒn DONE vÃ  folder-synced sang `docs/tasks/done/`; board links cáº­p nháº­t; M2 váº«n OPEN, M3 LOCKED cho Ä‘áº¿n khi PO audit gate vÃ  ghi quyáº¿t Ä‘á»‹nh | M2-01..06 evidence táº¡i tá»«ng card section "Reviewer acceptance â€” 2026-09-30"; GitHub Quality `7175bda` pass; cards moved via `hung/m2-review-done-sync` branch |
| 2026-09-30 | M2-01/03/04/05/06 | DÆ°Æ¡ng (Member 4) | Consumer review trÃªn `main` táº¡i merge PR #64: CONSUMER FIT: CHANGES REQUESTED vá»›i ba P1 (document resolution, practice submission, per-question feedback); M2-05 legacy boundary Ä‘áº¡t nhÆ°ng khÃ´ng thay sign-off toÃ n M2 | `main` táº¡i `73d3156`; HÆ°ng quyáº¿t contract, Vinh/Codex remediation, DÆ°Æ¡ng re-review; M3 chÆ°a má»Ÿ; Product Owner quyáº¿t gate |
| 2026-09-30 | CONTENT-017 | Thá» (Member 1) | Xá»­ lÃ½ triá»‡t Ä‘á»ƒ blocker N1, N2, N3 tá»« review cá»§a DÆ°Æ¡ng (Member 4): cáº­p nháº­t card, dá»n sáº¡ch 100% link gÃ£y trÃªn board theo DOC-013, Ä‘á»“ng bá»™ wording narration | [`docs/tasks/done/CONTENT-017.md`](../tasks/done/CONTENT-017.md); validator PASS 100% |
| 2026-09-30 | CONTENT-017 | Thá» (Member 1) | Xá»­ lÃ½ finding [P1] theo review TrÃºc: khÃ¡i quÃ¡t hÃ³a sÆ¡ Ä‘á»“ SAM-2 vÃ  Scene 4; cáº­p nháº­t validator khÃ³a tá»« ngá»¯ vi mÃ´ | [`docs/tasks/done/CONTENT-017.md`](../tasks/done/CONTENT-017.md); validator PASS 100% |
| 2026-09-29 | CONTENT-017 | Thá» (Member 1) | Thá» hoÃ n thÃ nh ká»‹ch báº£n chi tiáº¿t 8 scene, sÆ¡ Ä‘á»“ khÃ­ tÃ i SAM-2 5 node vÃ  dá»¯ liá»‡u StoryVersion JSON draft cho BÃ i 2 Visual Novel 1972; xá»­ lÃ½ feedback PO vá» luá»“ng há»c tuyáº¿n tÃ­nh Ä‘áº£m báº£o Ä‘i qua Ä‘á»§ 2 ná»™i dung trÆ°á»›c check; má»Ÿ PR v2 (#54); chuyá»ƒn REVIEW | [`docs/tasks/done/CONTENT-017.md`](../tasks/done/CONTENT-017.md); `validate-1972-authoring.mjs` PASS 100% |
| 2026-09-29 | M2-02 / M2-06 | Vinh (owner); Codex executor | Review audit found validators could skip existence/approval checks if a published-content lookup was omitted; added fail-closed `lookup_required` issues and regression coverage. All M2 quality checks pass; tasks remain `REVIEW`. | `npm run quality` PASS: typecheck/build; scan 247 files/0 unsafe, unit 27/27, component 9/9, E2E 2/2; HÆ°ng technical review, DÆ°Æ¡ng consumer confirmation, and Product Owner M2 gate remain pending |
| 2026-09-29 | M2-02..06 | Vinh (owner); Codex executor | HoÃ n thiá»‡n validator bá»• sung, service contracts Quiz/User, mock behavior, legacy fixture mapper vÃ  contract regression tests; chuyá»ƒn cÃ¡c task sang `REVIEW`. | `npm run quality` PASS: typecheck/build, scan 245/0 unsafe, unit 26/26, component 9/9, E2E 2/2; khÃ´ng cÃ³ env/migration/dependency impact; chá» HÆ°ng review vÃ  DÆ°Æ¡ng consumer confirmation |
| 2026-09-29 | M2-02/03/05 | Vinh (owner); Codex executor | Táº¡o card vÃ  claim riÃªng sau khi M2-01 merge; triá»ƒn khai tiáº¿p trÃªn ná»n domain contract hiá»‡n hÃ nh. | Branch `codex/m2-implementation`; validators `src/services/next/validation.ts`, service contracts `contracts.ts`, mapper má»›i; khÃ´ng cÃ³ migration/env impact |
| 2026-09-29 | M2-04/06 | Vinh + DÆ°Æ¡ng (consumer reviewer); Codex executor | Claim backend mock adapter and integrated contract tests after defining M2-03 services; DÆ°Æ¡ng consumer confirmation remains a review item. | Branch `codex/m2-implementation`; mock adapter/tests run without Supabase |
| 2026-09-29 | M2-01 / PR #61 | DÆ°Æ¡ng + Codex | Sá»­a finding P2: Ä‘Ã¡nh dáº¥u `@deprecated` riÃªng cho toÃ n bá»™ legacy exports á»Ÿ `src/types/index.ts`; giá»¯ demo backward-compatible vÃ  task á»Ÿ `REVIEW`. | `npm run quality` PASS: scan 237/0 unsafe, unit 16/16, component 9/9, E2E 2/2; HÆ°ng review láº¡i contract, DÆ°Æ¡ng xÃ¡c nháº­n consumer |
| 2026-09-29 | M2-01 | Codex executor | HoÃ n thiá»‡n domain types v2 vÃ  chuyá»ƒn `REVIEW`; named block/scene unions, stable ID/version boundary, media/source/progress types vÃ  canonical barrel Ä‘Ã£ sáºµn sÃ ng mÃ  khÃ´ng phÃ¡ demo legacy. | `npm run quality` PASS: scan 237/0 unsafe, unit 16/16, component 9/9, E2E 2/2; HÆ°ng review contract, DÆ°Æ¡ng xÃ¡c nháº­n consumer |
| 2026-09-29 | M2-01 | Codex executor; Vinh accountable owner | Táº¡o vÃ  claim task domain types v2 sau khi PR #60 má»Ÿ M2; claim Ä‘á»™c quyá»n hotspot `src/types/index.ts`, chÆ°a sá»­a source trong checkpoint nÃ y. | [`M2-01`](../tasks/done/M2-01.md); branch `codex/m2-01-domain-types-v2`; next triá»ƒn khai contract Phase 5 rá»“i cháº¡y typecheck/test |
| 2026-09-29 | M1 gate / M2 opening | Product Owner | Nghiá»‡m thu M1-07 vÃ  M1-08; quyáº¿t Ä‘á»‹nh `M1 CLOSED, M2 OPEN`. M1-07/M1-08 chuyá»ƒn `DONE`; M2 Ä‘Æ°á»£c phÃ©p báº¯t Ä‘áº§u theo dependency, task card, owner/reviewer vÃ  file claim cá»§a Phase 9. | PR #53/#56; [M1-07 QA evidence](../tasks/evidence/M1-07-vinh-keyboard-2026-09-29.md); [M1-08 review evidence](../tasks/evidence/M1-08-review-signoff-2026-09-29.md); áº£nh 375px/430px Ä‘i cÃ¹ng card M1-08 |
| 2026-09-29 | FE-011 | Product Owner + Codex | Ghi nháº­n yÃªu cáº§u cÃ¡ nhÃ¢n hÃ³a lá»i chÃ o Home thÃ nh `XIN CHÃ€O, {displayName}` á»Ÿ M3, khÃ´ng má»Ÿ rá»™ng scope M1 vÃ  khÃ´ng triá»ƒn khai trÆ°á»›c user domain/service contract M2. | Task giá»¯ BACKLOG; fallback `XIN CHÃ€O`; DÆ°Æ¡ng chá»‰ claim sau M2-01/03/04 vÃ  gate M3, Vinh review contract/QA |
| 2026-09-29 | M1-08 / PR #56 review handoff | HÆ°ng + Vinh; Codex recorded handoff | HÆ°ng/Vinh reported no remaining blocker after review of head `a6f7f7c`; PR #56 merged to `main` as `0661047`. Task remains REVIEW and the milestone gate is unchanged. | [Review evidence](../tasks/evidence/M1-08-review-signoff-2026-09-29.md); next Product Owner visual acceptance and M1 gate audit; M2 remains LOCKED |
| 2026-09-29 | M1-08 / streak layout | TrÃºc + Codex | Reopened from REVIEW for Product Owner visual feedback; moved the seven-day streak row from the right edge to the horizontal center of its own row; returned to REVIEW after focused verification. | [`M1-08`](../tasks/done/M1-08.md); `npm run typecheck`, `npm run test:component` (8/8) and `npm run build` pass; HÆ°ng/Vinh/PO review |
| 2026-09-29 | M1-08 / mobile follow-up | TrÃºc + Codex | Updated from `main`, resolved documentation conflicts, kept streak title to one line at 375px/430px, and replaced Home greeting/streak emoji with shared thin-line SVG icons. | Direct browser smoke at 375px/430px; `npm run quality` with Chrome pass: scan 230 files/0 unsafe, unit 16/16, component 9/9, E2E 1/1; dedicated M1-08 PR next |
| 2026-09-29 | M1-08 / PR #56 evidence correction | TrÃºc + Codex | Replaced the obsolete 375px/430px screenshots with PR #56 evidence and clarified that earlier HÆ°ng/Vinh approvals do not cover this new layout/icon change. | [`M1-08`](../tasks/done/M1-08.md); new screenshot evidence committed beside the card; HÆ°ng/Vinh reviews of PR #56 required before Product Owner visual acceptance |
| 2026-09-29 | M1-08 / PR #56 review fixes | TrÃºc + Codex | Addressed the four review findings: recaptured correctly framed evidence, hid decorative Home icons from screen readers, routed streak colors through tokens, and added real-browser layout regression checks. | `npm run quality` PASS: typecheck/build, scan 234 files/0 unsafe, unit 16/16, component 9/9, E2E 2/2; task remains REVIEW for HÆ°ng/Vinh and PO |
| 2026-09-29 | M1-07 / TrÃºc UI/UX review | TrÃºc (`dotruc1526`) | Reviewed narrative/reflection neutral state, knowledge correct/incorrect feedback, long Vietnamese text at 375px/430px and token-driven UI states; submitted GitHub approval on PR #53 | [`PR #53`](https://github.com/dotruc1526/suchill/pull/53); TrÃºc approval recorded, Vinh approval also present; M1-07 remains REVIEW pending Product Owner gate | Vinh/PO gate decision |
| 2026-09-29 | M1-07 follow-up | HÆ°ng (Member 3) + Codex | Re-audited the three original findings and fixed a Modal focus-restoration edge case on PR #53; both TrÃºc and Vinh were requested as reviewers. M1-07 stays REVIEW. | `npm run quality` pass with Chrome after fix: scan 230 files/0 unsafe, unit 16/16, component 8/8, E2E 1/1; Vinh still verifies keyboard behavior in browser, PO gate remains pending; M2 LOCKED. |
| 2026-09-29 | M1-07 / M1-08 review | HÆ°ng (Member 3) + Codex | HÆ°ng accepted M1-07 implementation ownership after correcting the remaining Modal token literal and making choice intent/feedback explicit; APPROVED M1-08 implementation/token/architecture. Both tasks remain REVIEW. | Branch `codex/m1-hung-review-fixes`; `npm run quality` pass: scan 230 files/0 unsafe, unit 16/16, component 8/8, E2E 1/1; next TrÃºc + Vinh review M1-07, Vinh + Product Owner finish M1-08; M2 remains locked. |
| 2026-09-28 | GOVERNANCE | Product Owner | Thá» (Member 1) táº¡m ngá»«ng kiÃªm nhiá»‡m Product Owner, táº­p trung toÃ n lá»±c vÃ o Content Lead / biÃªn soáº¡n ká»‹ch báº£n; vai trÃ² Product Owner tÃ¡ch biá»‡t Ä‘á»™c láº­p Ä‘á»ƒ Ä‘áº£m báº£o khÃ¡ch quan trong nghiá»‡m thu gate vÃ  duyá»‡t ná»™i dung | [`TEAM-OWNERSHIP.md`](./TEAM-OWNERSHIP.md); Thá» soáº¡n ká»‹ch báº£n, PO Ä‘á»™c láº­p nghiá»‡m thu |
| 2026-09-28 | M1-08 / PR #40 UI remediation | TrÃºc + Codex | TrÃºc hoÃ n táº¥t pháº§n UI/UX: khÃ´i phá»¥c icon nÃ©t máº£nh tá»« visual intent `b27fa19`, chuáº©n hÃ³a runtime typography vá» Inter, sá»­a overflow 375px vÃ  chuyá»ƒn REVIEW; khÃ´ng thÃªm dependency má»›i vÃ  khÃ´ng tá»± chuyá»ƒn DONE | [`M1-08`](../tasks/done/M1-08.md); `npm ci` pass, `npm run quality` pass with Chrome, secret scan 227 files/0 unsafe; next HÆ°ng review implementation/token, Vinh QA/accessibility, Product Owner nghiá»‡m thu hÃ¬nh áº£nh |
| 2026-09-28 | M1-07 / Gate M1 | Product Owner + Codex audit | Giao HÆ°ng sá»­a ba finding M1; TrÃºc review UI/UX; Vinh bá»• sung regression/accessibility QA; giá»¯ M2 khÃ³a | [`M1-07`](../tasks/done/M1-07.md); local = `origin/main` táº¡i `b47b190`; task báº¯t Ä‘áº§u á»Ÿ READY, chÆ°a sá»­a source |
| 2026-09-28 | CONTENT-016 / PR #45 approval | Thá» + TrÃºc + Product Owner | Approve authoring brief vá»›i ba Ä‘iá»u kiá»‡n: chÆ°a pháº£i Full Narration/StoryVersion; claim 001..005 cáº§n TrÃºc duyá»‡t tá»«ng cÃ¢u; media chÆ°a chá»n vÃ  text-first fallback báº¯t buá»™c | [`CONTENT-016`](../tasks/done/CONTENT-016.md); merge PR #45, production cáº§n task/gate riÃªng |
| 2026-09-28 | CONTENT-016 / PR #45 feedback round 2 | Codex | Bá»• sung nguá»“n QÄND vá»›i locator háº¹p; gá»¡ `BLOCKED_LOCATOR` thÃ nh `READY_FOR_TRUC_REVIEW`; xÃ¡c Ä‘á»‹nh media chÆ°a chá»n lÃ  guardrail sáº£n xuáº¥t, khÃ´ng pháº£i dependency cá»§a PR brief | [`CONTENT-016 evidence`](../content/CONTENT-016-EVIDENCE.md); chá» TrÃºc approve historical/media, sau Ä‘Ã³ Thá» review product/learning |
| 2026-09-28 | CONTENT-016 / PR #45 | TrÃºc review + Codex | Bá»• sung claim/source locator matrix vÃ  historical/fiction/media boundary; khÃ³a claim/asset/mechanic chÆ°a Ä‘á»§ evidence khá»i narration/StoryVersion | [`CONTENT-016 evidence`](../content/CONTENT-016-EVIDENCE.md); chá» Thá» product/learning approval vÃ  TrÃºc re-review locator/media |
| 2026-09-28 | CONTENT-016 | Product Owner + Codex | Chá»‘t rule má»—i chapter canonical cÃ³ Ã­t nháº¥t má»™t flagship Visual Novel; chuyá»ƒn Lesson 2 SAM-2 chapter 1972 thÃ nh VN brief cÃ³ interactive artifact | [`CONTENT-016`](../tasks/done/CONTENT-016.md); lá»‹ch sá»­ dÃ²ng nÃ y ghi tráº¡ng thÃ¡i trÆ°á»›c approval; M2/M3 váº«n khÃ³a |
| 2026-09-28 | M1-07 / Gate M1 | Product Owner + Vinh QA/Codex | Product owner flagged three M1 gate findings; implementation fix added for narrative choice semantics, Modal focus lifecycle and token-routed primitives; M2 remains locked | [`M1-07`](../tasks/done/M1-07.md); branch `codex/m1-po-blocker-fixes`; `npm run quality` pass after merge main: scan 225 files/0 unsafe, unit 16/16, component 7/7, E2E 1/1; awaiting HÆ°ng/TrÃºc/Vinh/PO review |
| 2026-09-28 | M1-05 / FE-009 | HÆ°ng + TrÃºc + Vinh | TÃ¡ch evidence interaction foundation Ä‘Ã£ merge trong PR #33 khá»i FE-009; FE-009 chá»‰ cÃ²n adoption/polish sau feature implementation | [`M1-05`](../tasks/done/M1-05.md); FE-009 giá»¯ BACKLOG Ä‘áº¿n khi FE-005..008 Ä‘áº¡t dependency vÃ  cÃ³ card riÃªng |
| 2026-09-28 | M1-04 / M1-06 | Vinh QA + Codex | Vinh QA accepted M1-04 after HÆ°ng/TrÃºc handoff; moved M1-04 and M1-06 to `DONE` with compact QA evidence, without opening M2 | Local `npm run quality` pass: typecheck/build, scan 220 files/0 unsafe, unit 16/16, component 5/5, E2E 1/1; `M1-06-QA-EVIDENCE.md`; M2 remains locked until Product owner records M1 closure |
| 2026-09-28 | M1-01 / FE-003 / PR #33 | Vinh (Member 5 QA) / Codex há»— trá»£ | Vinh xÃ¡c nháº­n QA sau khi PR #33 Ä‘Ã£ merge; chuyá»ƒn M1-01 vÃ  FE-003 sang DONE, cáº­p nháº­t card/link board | `main` táº¡i `274d31d`; `npm run quality` exit 0: typecheck/build, scan 217 file/0 unsafe, unit 16/16, component 4/4, E2E 1/1 |
| 2026-09-28 | FE-003 / PR #33 | TrÃºc (Member 2) / Codex há»— trá»£ | Review láº¡i commit `ef82303`; cÃ¡c feedback UI/UX Ä‘Ã£ Ä‘Æ°á»£c HÆ°ng sá»­a, TrÃºc approve pháº§n UI/UX; chÆ°a chuyá»ƒn DONE vÃ¬ cÃ²n chá» Vinh QA theo guide | `typecheck`, `build`, `test:component`, `tests/member5`, secret scan 217 file pass; next Vinh approve QA |
| 2026-09-28 | M1-01 | TrÃºc (Member 2) / Codex há»— trá»£ | HoÃ n thÃ nh tÃ i liá»‡u Token Contract & Design Handoff theo Phase 9 vÃ  AGENTS.md; chuyá»ƒn REVIEW | [`docs/engineering/TOKEN-HANDOFF.md`](../engineering/TOKEN-HANDOFF.md); HÆ°ng review Ä‘á»ƒ má»Ÿ FE-003/M1-02 |
| 2026-09-28 | DOC-016 / Gate M0 | Product owner + Codex | Product owner duyá»‡t Ä‘Ã³ng M0 vÃ  má»Ÿ M1 sau audit; táº¡o M1-01 `READY` cho TrÃºc, cÃ²n M2â€“M7 locked | `main` = `origin/main` táº¡i `fe4072b`; GitHub Quality #31 success; local `npm run quality` pass vá»›i Chrome (typecheck/build, scan 204 file/0 unsafe, 16 unit, 1 component, 1 E2E) |
| 2026-09-28 | M0-05/M0-06/M0-07 | Vinh (Member 5) / Codex há»— trá»£ | HoÃ n thiá»‡n hai thiáº¿u sÃ³t gate M0: sá»­a `test:unit` Ä‘á»ƒ local Node 24+ khÃ´ng gá»i thÆ° má»¥c báº±ng `node --test`, ghi Node supported range vÃ  Ä‘á»“ng bá»™ handoff sau khi PR #24 Ä‘Ã£ merge/CI xanh | `npm run quality` exit 0: typecheck/build, scan 203 file/0 unsafe, unit 16/16, component 1/1, E2E 1/1; PR #24 `MERGED` commit `eedff39`, Quality checks `SUCCESS`; PO quyáº¿t Ä‘á»‹nh Ä‘Ã³ng M0/má»Ÿ M1 |
| 2026-09-28 | CONTENT-003/004 | TrÃºc (Codex há»— trá»£) | Sá»­a regression ba tÃ i liá»‡u tá»« 50bcd1f vá» authoring v2; review tá»«ng cue vÃ  media plan; validator PASS | [Review/handoff](../tasks/active/CONTENT-003-004-REVIEW.md); nguá»“n CLM-MT68-01 chÆ°a Ä‘á»c láº¡i Ä‘Æ°á»£c, chá» sign-off/audio vÃ  Vinh QA |
| 2026-09-28 | CONTENT-003/004/007 | TrÃºc (Codex há»— trá»£) | Äá»“ng bá»™ board/card: gá»¡ hai card mÃ¢u thuáº«n cá»§a CONTENT-004, chuyá»ƒn thÃ nh má»™t card `REVIEW`; sá»­a link/status board vÃ  lÃ m rÃµ CONTENT-007 váº«n `BLOCKED` | TrÃºc review historical/media, Vinh technical QA; Product owner má»›i quyáº¿t Ä‘á»‹nh má»Ÿ production sau sign-off |
| 2026-09-28 | FE-004 | Vinh (reviewer) / Codex ghi nháº­n | Vinh xÃ¡c nháº­n báº£n bá»• sung Ä‘áº¡t yÃªu cáº§u; FE-004 `DONE` trÃªn card vÃ  board, khÃ´ng tá»± Ä‘Ã³ng M0 | App 87 dÃ²ng; `npm run quality` exit 0; browser smoke pass; lá»i xÃ¡c nháº­n trá»±c tiáº¿p â€œa tháº¥y ok rá»“iâ€ |
| 2026-09-28 | FE-004 | Codex theo yÃªu cáº§u Vinh | Bá»• sung tÃ¡ch `tab/view` state khá»i App, chuyá»ƒn REVIEW Ä‘á»ƒ Vinh nghiá»‡m thu; khÃ´ng tá»± Ä‘Ã³ng M0 | App 87 dÃ²ng; `npm run quality` exit 0; browser smoke 4 tab, VN, quiz/result, lesson/completion, console 0 error |
| 2026-09-28 | CONTENT-004/010/011/015 | Historical Reviewer | HoÃ n táº¥t tháº©m Ä‘á»‹nh sá»­ liá»‡u vÃ  ngÃ´n ngá»¯; approval nÃ y khÃ´ng thay technical QA/media/handoff vÃ  khÃ´ng tá»± unblock CONTENT-007 | BÃ¡o cÃ¡o táº¡i docs/content/HISTORICAL-REVIEW-REPORT-2026-09-28.md; CONTENT-004/010/011 giá»¯ REVIEW |
| 2026-09-28 | CONTENT-015 | Thá» (Member 1) | HoÃ n thÃ nh Ká»‹ch báº£n chi tiáº¿t BÃ i 1 Chapter 1972 (Tá»‘i háº­u thÆ° tá»« báº§u trá»i, 5 phÃ¢n cáº£nh 110s, WebVTT, nguá»“n PK-KQ & Cáº©m nang bÃ¬a Ä‘á») | Ká»‹ch báº£n táº¡i docs/content/SCREENPLAY-1972.md vÃ  CAPTIONS-1972.vtt |
| 2026-09-28 | DOC-011/012/013/014/015, FE-001, CONTENT-009, CONTENT-013 | Thá» (Product Owner) | PO nghiá»‡m thu Ä‘á»“ng loáº¡t 8 task Ä‘áº¡t acceptance criteria; chuyá»ƒn DONE. CONTENT-003/010/011/012 giá»¯ REVIEW chá» TrÃºc (Historical Reviewer) vÃ  Vinh (QA) | Task cards chuyá»ƒn sang docs/tasks/done/; board cáº­p nháº­t |
| 2026-09-26 | CONTENT-006 | TrÃºc (Codex há»— trá»£) | Äá»“ng bá»™ sau quyá»n má»›i: Thá» giao TrÃºc review objective/wording vÃ  Product owner giao TrÃºc chá»‘t media/legal; há»“ sÆ¡ chá»‰ Ä‘áº¡t `REFERENCE_ONLY`, khÃ´ng publish/integration | `active.md` vÃ  card CONTENT-006; next chá»‰ phÃ¡t sinh náº¿u táº¡o media package má»›i hoáº·c sá»­a wording/audio/nháº¡c/SFX/source export |

| 2026-09-26 | CONTENT-009 | Teamwork Reviewer (Round 3) | HoÃ n thÃ nh Review Round 3 (Final Adversarial Review): Sá»­a nháº§m láº«n ngÃ y truyá»n thá»‘ng khÃ´ng quÃ¢n (03/4 lÃ  ngÃ y Ä‘Ã¡nh tháº¯ng tráº­n Ä‘áº§u), Ä‘Ã­nh chÃ­nh tÃªn phi cÃ´ng Pa ThÃ­ (Äinh CÃ´ng VÆ°á»£ng thay vÃ¬ Äinh TÃ´n) vÃ  chá»‰ huy TruÃ´ng Bá»“n (Tráº§n Thá»‹ DoÃ£n); bá»• sung Ä‘áº§y Ä‘á»§ verified facts cho 100% bÃ i há»c á»Ÿ cáº£ 4 chá»§ Ä‘á»; chuáº©n hÃ³a schema Phase 3 hai chiá»u (supports_claims, text_or_reference, historical_scope, reviewer) | Evidence táº¡i docs/features/research-content-009.md; bÃ n giao PO (CONTENT-002) & Historical Reviewer (CONTENT-003) |
| 2026-09-26 | CONTENT-009 | Teamwork Reviewer (Round 2) | HoÃ n thÃ nh Review Round 2 (Adversarial Review): Bá»• sung vÅ© khÃ­ Mk-81 Phi Ä‘á»™i Quyáº¿t Tháº¯ng, hiá»‡n váº­t SRC-HR-06 NgÃ´ Thá»‹ Tuyá»ƒn, sá»± kiá»‡n TruÃ´ng Bá»“n, claim CLM-V17-002 sÃºng trÆ°á»ng, chuáº©n hÃ³a 100% Phase 3 Claim schema (review_status, reviewer) vÃ  Ä‘á»“ng bá»™ Task Board | Evidence táº¡i docs/features/research-content-009.md; bÃ n giao PO (CONTENT-002) & Historical Reviewer (CONTENT-003) |
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
