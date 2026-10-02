# M3–M5 delivery evidence — 2026-10-02

> Latest acceptance: [hosted verification](../hosted-supabase/EVIDENCE.md) and [all-task review](../review-all/EVIDENCE.md) — Quality238 PASS, native-mode50 PASS on PostgreSQL17.11/migrations26, hosted transport12 and Auth9 PASS.22/27 original REVIEW cards DONE;5 content cards remain REVIEW. Technical delivery is DONE; formal PO milestone/content/release gates remain separate. Older counts below are checkpoint history.

Branch: `codex/m3-m5-complete`, baseline `fb02f7d`. Product Owner authorized complete implementation through M5 in this chat. The baseline includes the existing Home visual restoration; unrelated untracked `.worktrees/`, `branches/`, `output/` and `pr-77-merged.png` are preserved. Technical implementation and hosted independent review are accepted; formal milestone/content/release acceptance remains separate.

## Delivered behavior

| Area | Concrete result |
|---|---|
| M3 learning loop | Service-backed block/lesson confirmation; trusted receipts; pending/confirmed XP and streak; account profile/settings; technical text, VN, scored quiz, daily practice and video-error fallback fixtures |
| M4 backend | 20 ordered normalized migrations; versioned content/relations; immutable publication; private grading keys; account bootstrap/progress/attempts; default-deny grants/RLS and exact reviewed Storage paths |
| M4 adapter/auth | Supabase SDK auth/session persistence; domain RPC projection; safe errors; private signed media URLs; fail-closed client configuration; original-account write preconditions |
| M5 authority | Revisioned checkpoints; required-block/story/video/quiz completion; append-only unique rewards and immutable operation receipts; stable correction reward scopes; account-timezone streak; best-score mastery and authored daily review |
| M5 offline/privacy | Durable ordered owner-scoped queue with unchanged operation IDs; lost-response retry and rejected-operation recovery; optional minimal analytics; backend-only reward/streak events; telemetry failure cannot roll back learning |

React reads service/domain contracts. `App.tsx` composes the app and displays account-confirmed values; it does not calculate or grant XP. Answer keys and correctness are excluded from VN/quiz delivery until trusted submission. AI Battle reward integration and PWA release are outside M3–M5.

## Original implementation verification (before all-task re-review)

- Actual VN model → Supabase adapter → PostgreSQL regression PASS. This exercises first-load checkpoint initialization, transitions and trusted feedback without manually seeding the player cursor. VN regressions also cover simultaneous initialization, account switching during load and rejecting another account's returned progress DTO.
- Unit suite: 125/125 PASS, including replay, revisions, completion, media resource validation, account/settings/telemetry switching, VN initialization and durable queue failures.
- SQL suite checkpoint: 33/33 PASS with 20 migrations. [Database evidence](../../../supabase/tests/EVIDENCE.md) describes each matrix and its limits.
- Component suite: 22/22 PASS. Browser suite: 9/9 PASS, including daily review, video fallback and scored quiz repeat with the approved 20+5 XP reward at ≥80%.
- Final `npm run quality`: **PASS, exit 0** after all staged code changes: typecheck/build, 125 unit + 22 component + 33 PostgreSQL + 9 browser tests (**189 total, zero failed**), and both source/bundle scans. The final scan checked 390 source/tracked/bundle files with zero unsafe matches. `git diff --cached --check` and updated-document local links also pass.

Database tests execute real PostgreSQL 18.3 constraints, RLS, grants, PL/pgSQL and transactions using PGlite. Auth identity and Storage metadata are fixtures. Adapter tests invoke the actual production adapter and UI VN model through SQL; SDK auth/storage transport is stubbed. Promise overlap on the single PGlite connection is serialized and is not proof of independent native-session races.

Browser tests use installed Chromium against the production build on loopback. They cover explicit completion/receipt focus, repeat reward prevention, account switching, offline pending/reconnect, quiz feedback, daily-review confirmation, readable media fallback, navigation/focus and 375/430 px Home sizing. This is interaction/accessibility smoke evidence, not a full screen-reader or low-end-device release audit.

## Independent review and repairs

Separate service/UI/database reviewers found and verified repairs for stale account refresh, token switching between submission and transport, settings/telemetry account attribution, client checkpoint hints being treated as confirmed blocks, premature replay feedback, fabricated video coverage, daily attempt reuse after timezone change, minor correction reward farming, optional-video policy mismatch, and initial VN checkpoint integration. Final service/database reviews report no unresolved P1 in the reviewed paths.

Reviewers are Codex agents, not team-member approvals. Hưng/Vinh and Product Owner acceptance have not been invented or recorded as complete.

## Current hosted environment and remaining acceptance

The user-authorized fresh Free development project is configured and all26 ordered migrations are applied with exact SQL history. Real Auth/email/browser, REST/RPC/Storage and trusted learning checks pass; [hosted evidence](../hosted-supabase/EVIDENCE.md) records versions, checks, repairs and cleanup. Existing migrations001–025 are immutable;026 repairs intentional40001 business conflicts that caused hosted PostgREST14 infinite retries. Final server has0 active learning RPC loops.

No old credential is reused; revocation of the unidentified historically exposed key remains unproved and a separate production follow-up. Five original content cards still need exact source/media/task sign-off; completed technical QA does not create licensing evidence. Formal PO milestone acceptance and M6/M7 opening remain separate.

Known limits: video telemetry bounds implausible ranges using server elapsed time and cannot prove attention; offline playback without server initialization may need authored fallback. Mock data is technical and in-memory, not canonical content or a real account. Achievement list stays empty until an approved catalog/rule exists. Build may warn about the existing native Vite config and the main chunk exceeding 500 kB; PWA/performance gates belong to M6. New runtime dependencies are Supabase JS; PGlite is test-only.

## Handoff

Files are grouped under `src/features/auth|profile|practice|learning/completion`, `src/services/next|supabase|offline`, `src/app`, `supabase/`, technical public assets and related tests/cards. No production migration, seed publication or content/media approval changed. Keep applied/shared migrations immutable and add roll-forward files. Run `npm ci` then `npm run quality`; run `npm run dev` for the clearly labeled technical fixture when public environment variables are absent.

Next action: Product Owner reviews completed branch and formal milestone gate; content owners complete the exact remaining source/media/handoff prerequisites. M6/M7 remain outside the latest requested scope.
