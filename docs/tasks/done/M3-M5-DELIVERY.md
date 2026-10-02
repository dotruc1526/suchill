# M3–M5 — Complete learning/backend delivery on isolated branch

> Status: DONE
> Started / last updated: 2026-10-02

## Assignment and authorization

- Owner: Codex (integration owner, authorized by Product Owner in this chat).
- Executor: Codex and delegated implementation/review agents.
- Reviewer: independent Codex review; Hưng/Vinh and Product Owner for team acceptance.
- Branch: `codex/m3-m5-complete`; baseline `fb02f7d` (includes current Home visual restoration).
- Product Owner authorized all work, then explicitly requested complete implementation through M5 on a separate branch. This supersedes the previous implementation lock for this branch; it does not assert that unfinished milestone acceptance already passed.
- Dependency evidence: M0–M2 closed; M3-01..05 and M3-INTEGRATION-01 DONE. Phase 5/6/7/8/9 APPROVED.
- No production release, canonical content production or old privileged credential use is included. The separately authorized hosted follow-up verifies the new development project.

## Original task claims and sequence (completed; final acceptance below)

| ID | Owner / executor | Reviewer | Dependencies | Files claimed | Next action |
|---|---|---|---|---|---|
| M3-06 | Codex / UI + service agents | independent code review; Hưng/Vinh | M3-01..05 DONE | completion/profile features, journey composition; next contracts/mock account/completion; App.tsx (root only) | Review completed service-backed UI and evidence |
| M3-07 | Codex / QA reviewer | Vinh | M3-06 implemented | focused unit/component/browser tests | Review mock/browser loop evidence |
| M4-01..05 | Codex / database agent | independent security review; Vinh | M2 DONE, approved Phase 6, branch implementation authorization | supabase/config.toml, migrations, tests, env setup docs | Review local SQL matrix; hosted/native gate pending |
| M4-06..08 | Codex / root | independent reviewer; Hưng/Vinh | M4 schema verified locally | src/services/supabase/, auth features, runtime composition, adapter/auth/RLS tests | Review adapter/session matrix; hosted Auth/Storage pending |
| M5-01..06 | Codex / database + service agents | independent security review; Vinh | M4 schema/contracts verified locally | progress/completion/reward/streak/quiz/analytics RPCs and tests | Review policy/ledger/analytics evidence; native race gate pending |
| M5-07 | Codex / root | independent reviewer; Hưng/Vinh | M5 services verified locally | offline queue/sync and pending UI/tests | Review durable account-scoped sync and browser evidence |

Hotspot claims: root exclusively owns package/lockfile and App.tsx; database agent exclusively owns new migrations; service agent exclusively owns next/contracts.ts. No tokens/global CSS/type barrel changes are planned. Agent file claims are disjoint. Existing untracked user folders/media are preserved.

## Acceptance

- [x] Entire technical mock loop, explicit block/lesson completion and service-backed account UI; no UI-granted XP.
- [x] Normalized versioned content, protected answer keys/drafts; safe auth/profile/settings/storage implementation.
- [x] Real Postgres SQL evidence for anon/A/B/trusted access; immutable published content.
- [x] Supabase adapters implement domain interfaces; SDK persistence, account switching and original-subject preconditions implemented and locally tested.
- [x] Trusted completion validates required blocks, story checks, video policy/fallback and graded quizzes.
- [x] Unique ledger/operation receipts and account-row serialization; retries/recreated adapters cannot regrant reward in local tests. Native independent-session race verification and actual overlapping HTTP retries pass below.
- [x] Server/account timezone streak, best quiz score, optional privacy-minimal analytics.
- [x] Offline queue uses original operation IDs and account isolation; no premature confirmed reward.
- [x] Final re-review `npm run quality` PASS: typecheck/build, 146 unit + 22 component + 42 SQL + 19 authoring + 9 browser tests (238 passed; native-only test skipped here and verified separately), source/bundle scans with zero unsafe matches.
- [x] Fresh hosted Supabase development integration verified with new project keys and no old-key reuse. Unidentified historical-key revocation remains a separate production follow-up.
- [x] Native PostgreSQL 17.11 migrations and genuine multi-session matrix PASS50/50; eight overlapping independent sessions; actual hosted Auth/REST/Storage matrix also passes; physical devices remain a later release check.

## Final technical acceptance and handoff

The user-authorized fresh suchill-test development project is configured and healthy;26 immutable/roll-forward migrations are applied and actual Auth/JWT/PostgREST/Storage integration passes. Independent Codex application/security review confirms no remaining P1 in this scope. The aggregate is DONE for M3–M5 technical delivery under user delegation; team/PO formal milestone acceptance and canonical content/release gates remain separate. M6/M7 remain locked.

- Evidence: [hosted acceptance](../../engineering/hosted-supabase/EVIDENCE.md), [all-task audit](../../engineering/review-all/EVIDENCE.md), [delivery report](../../engineering/m3-m5/EVIDENCE.md).
- Tests: Quality238 PASS, native-mode50/50 on PostgreSQL17.11, hosted transport12/12 and Auth9/9. Source/bundle scans pass; native server stopped after tests.
- Files changed: account/auth/profile/completion/practice and learning UI; service adapters/domain/offline queue; migrations/tests; hosted Auth/transport harnesses; fixture QA build isolation; task/evidence docs.
- Environment impact: public Vite URL/publishable variables select Supabase; absent variables select technical mock; malformed variables fail closed. Trusted test secret remains ignored and server-only. Migration026 fixes PostgREST14 intentional40001 retry loops; original applied migrations are unchanged. No hosted reset or production deployment.
- Known limits: historical/media approval, unidentified older credential revocation, real low-end-device/full screen-reader/PWA/performance release checks; video telemetry cannot prove attention; achievement catalog is not authored. Existing Vite config/main-chunk warnings remain.
- Next action: Product Owner reviews the completed branch and formal milestone gate; content owners supply exact source/media/task sign-off for the five remaining original REVIEW cards.

## Checkpoints

| Date | Result | Next action |
|---|---|---|
| 2026-10-02 | Isolated implementation, specialist repairs and mock/native review complete | Actual hosted verification |
| 2026-10-02 | Fresh hosted project, Auth email/browser, API/Storage/RLS/reward/offline/video matrix and roll-forward026 verified; independent review accepted | Technical aggregate DONE; formal milestone/content release gates retained |
