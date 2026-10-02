# M3–M5 — Complete learning/backend delivery on isolated branch

> Status: REVIEW
> Started / last updated: 2026-10-02

## Assignment and authorization

- Owner: Codex (integration owner, authorized by Product Owner in this chat).
- Executor: Codex and delegated implementation/review agents.
- Reviewer: independent Codex review; Hưng/Vinh and Product Owner for team acceptance.
- Branch: `codex/m3-m5-complete`; baseline `fb02f7d` (includes current Home visual restoration).
- Product Owner authorized all work, then explicitly requested complete implementation through M5 on a separate branch. This supersedes the previous implementation lock for this branch; it does not assert that unfinished milestone acceptance already passed.
- Dependency evidence: M0–M2 closed; M3-01..05 and M3-INTEGRATION-01 DONE. Phase 5/6/7/8/9 APPROVED.
- No release, content production, production migration or old privileged credential use is included.

## Task claims and sequence

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
- [x] Unique ledger/operation receipts and account-row serialization; retries/recreated adapters cannot regrant reward in local tests. Native independent-session race verification remains below.
- [x] Server/account timezone streak, best quiz score, optional privacy-minimal analytics.
- [x] Offline queue uses original operation IDs and account isolation; no premature confirmed reward.
- [x] Final re-review `npm run quality` PASS: typecheck/build, 146 unit + 22 component + 41 SQL + 19 authoring + 9 browser tests (237 passed; native-only test skipped here and verified separately), source/bundle scans with zero unsafe matches.
- [ ] Hosted Supabase integration verified after safe configuration and key-rotation confirmation.
- [x] Native PostgreSQL 17.11 migrations and genuine multi-session matrix PASS49/49; eight overlapping independent sessions; actual hosted device/Auth/REST/Storage gate remains separate.

## Environment blocker

Hosted Supabase project and rotation confirmation have been requested without asking for secrets. Until verified, hosted integration and milestone closure are unverified. Native PG17 and local implementation testing are complete. [All-task re-review](../../engineering/review-all/EVIDENCE.md) accepts 16 of 27 initial REVIEW cards; 11 retain specific external prerequisites.

## Handoff

- Changed files: account/auth/profile/completion/practice UI; journey/VN/video integration; mock/service/domain contracts; Supabase SDK/RPC/media adapters; durable offline queue; 20 new normalized migrations and SQL harness; technical fixture assets; related tests and 17 roadmap task cards.
- Evidence: [consolidated report](../../engineering/m3-m5/EVIDENCE.md), [database detail](../../../supabase/tests/EVIDENCE.md), [backend setup](../../../supabase/README.md). Independent Codex service/database/UI review completed; Hưng/Vinh/PO team acceptance remains pending.
- Environment impact: Supabase JS production dependency; PGlite test-only dependency. Public Vite variables only; configured runtime selects Supabase, absent variables select clearly labeled technical mock, malformed variables fail closed. No hosted migration, reset, credential reuse or canonical content publication.
- Known limits: hosted Auth/REST/Storage, rotation, native PostgreSQL 17/concurrency remain unverified; mock is in-memory; video cannot prove attention and may need authored fallback offline; no approved achievement catalog. Existing Vite config/main-chunk warnings recorded in evidence.
- Next action: review this branch and run hosted/native gate checks after safe configuration. Product Owner can close milestones only after acceptance evidence; M6/M7 remain outside scope.

## Checkpoints

| Date | Result | Next action |
|---|---|---|
| 2026-10-02 | Separate branch and individual roadmap claims; service/UI/backend implemented; independent review findings repaired; final Quality PASS | Review branch deliverable |
| 2026-10-02 | Account/session/queue, replay, daily/timezone, correction scopes, video fallback and actual VN model → SQL regressions established | Review branch evidence; hosted/native acceptance pending |

## Re-review decision — 2026-10-02

- Reviewer: Codex specialist review and root cross-review under explicit user delegation. Local implementation/draft checks pass; task remains REVIEW because full acceptance is not evidenced.
- Remaining prerequisite / next action: Hosted acceptance and rotation missing; individual technical task acceptance does not close milestone.
- Evidence: [all-task audit](../../engineering/review-all/EVIDENCE.md). No missing key rotation, license, recording or human historical verdict is fabricated.
