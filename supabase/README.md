# Sử Chill backend — M4/M5

The migrations implement normalized content, account-owned progress, private answer keys, trusted completion/rewards, streaks, daily review and optional analytics. They contain no canonical seed, remote credentials or production deployment operation. `db.seed.enabled=false` deliberately leaves editorial publication separate.

## Validate locally

```powershell
npm run test:db
```

Without native-test environment variables, the harness runs migration SQL against PGlite's PostgreSQL 18.3 engine. It emulates `auth.users`, `auth.uid()` and Storage metadata/policies, creates distinct `anon`/`authenticated`/`service_role` roles, and executes role-scoped SQL transactions. It tests real PostgreSQL constraints, RLS, grants, PL/pgSQL, transactions and persisted database reopen. PGlite does not supply independent native connections; its concurrent promises use one serialized connection. The optional native factory below supplies PostgreSQL 17 connections. Neither mode emulates Supabase Auth/Storage HTTP or verifies hosted JWT/session behavior.

With Docker and Supabase CLI available, `supabase start` uses the isolated `suchill-local` project configuration and PostgreSQL 17. Apply/review migrations on a disposable local stack first, then run the same anon/A/B policy matrix through real Auth/REST/Storage. Do not reset a hosted database. Once migrations have been shared/applied, add roll-forward migrations instead of editing existing files.

## Browser configuration and hosted gate

The browser requires only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Keep values in the ignored local environment file; never put a privileged key in a public variable. Old exposed privileged credentials must be rotated and rotation confirmed before hosted integration. This branch has no configured hosted project or rotation evidence, and no hosted migration has been applied.

`published-media` is a private bucket with anonymous/authenticated SELECT only for exact paths referenced by published metadata. The adapter resolves these paths through signed Storage URLs. `getPublicUrl()` cannot serve a private bucket. Draft media remains private; avatar insert/update/delete/read is limited to the authenticated user's first path segment. Bucket metadata migration also corrects unsafe pre-existing public flags and MIME/size limits.

## Domain RPC boundary

`learning_read(p_kind text, p_id uuid DEFAULT NULL, p_secondary_id uuid DEFAULT NULL)` returns camelCase JSON DTOs. Public kinds: `chapters`, `chapter`, `lesson`, `document`, `story`, `media`, `quiz`. Account kinds: `profile`, `account`, `settings`, `lesson_progress`, `episode_progress`, `video_progress`, `resume`. `video_progress` uses lesson ID plus block ID as the secondary ID. Story and quiz delivery omit answer keys and explanations until trusted submission. Media includes storage references plus poster/caption/transcript resource metadata; the adapter resolves URLs.

`learning_command(p_kind text, p_input jsonb)` derives ownership exclusively from `auth.uid()`. Kinds: `save_lesson_checkpoint`, `save_episode_checkpoint`, `record_choice`, `save_video_position`, `complete_block`, `complete_lesson`, `submit_practice`, `submit_scored`, `complete_daily_review`, `update_settings`, `track`. Commands use the domain input and a stable `operationId`; settings/analytics can generate one if absent. A provided `expectedSubject` checks that the queued session still matches and cannot override ownership. Optional `expectedRevision` prevents stale lesson/story/video cursor writes. Checkpoint completion hints cannot create authoritative completion; read DTOs include `confirmedCompletedBlockIds`.

SQL error mapping: `P0002` unavailable resource, `42501` unauthorized/session changed, `22023` invalid input/policy, `40001` stale/conflicting operation. Clients should replay the original operation ID after uncertain responses. Reusing that ID with a different signature fails. Each user row is locked before mutation; operation and reward unique constraints enforce idempotency independently of UI state.

## Completion/reward policies

- Text/recap require an explicit completion command. Lesson completion requires every required block except video with the authored `optional` policy, and prerequisites are enforced for learning and scored submissions. Migration `20261002002000_optional_video_completion.sql` rolls this policy forward for stacks that applied an earlier completion function; required text and `watch_threshold` video remain gates.
- VN progress accepts only authored transitions. Choice selections lock; retryable incorrect knowledge checks remain on their scene. Completion requires a reached end and required checks on the authoritative visited branch. Replay feedback before completion requires prior submissions/selections; a completed episode may explore valid alternative choices without changing progress, attempts or XP.
- Video ranges are bounded, merged and counted uniquely on the server. Playback initializes with an empty checkpoint. Accepted unique duration cannot exceed twice elapsed time since that video's server initialization plus five seconds. The UI supports at most 2x playback. `watch_threshold` requires 90%; `reach_end` requires playback evidence near the end. This prevents immediate forged full-duration reports but cannot prove attention: browser telemetry remains an input. Offline playback without a server initialization may require the approved fallback route.
- Video fallback requires published transcript metadata and a completed authored knowledge check or required recap. Caption/transcript paths and linked documents must pass publication checks.
- Practice submits all questions; scored assessment defaults to 70% pass. Trusted grading stores attempts/mastery and exposes only submitted feedback. First pass grants 20 XP; a score of at least 80% grants the one-time 5 XP bonus, on that first pass or a later improved retry. Pure VN/quiz lessons add no separate 10 XP; standard/video/mixed lessons grant 10 on first completion, with episode rewards of 20 handled separately.
- Reward scope is stable across minor corrections: new immutable lesson/assessment rows reuse the original `reward_scope_id` and `eligibility_version`. A deliberately approved new reward eligibility uses a new eligibility version. VN uses stable story identity. Published roots, children and answer keys cannot be rewritten in place.
- Daily review requires an authored practice set with `daily_review_enabled=true` and a same-account-day completed attempt containing at least three questions. The minimum three is the implementation policy for the MVP review contract. Reward is 5 XP once per account day across all sets; an attempt cannot earn again after a timezone change.
- Streak qualification uses the server timestamp and account IANA timezone; one day row, consecutive days extend, gaps reset current, and longest is retained. A timezone change is audited, has a seven-day cooldown and cannot create a second qualification while the previous timezone is still on the qualified day. No streak freeze or AI Battle reward exists.
- Ledger writes are append-only and trusted. Authorized Auth account deletion cascades personal learning records and leaves a minimal anonymized deletion audit. Ordinary ledger changes still fail. Achievement read model is empty until an approved achievement catalog/rule is authored; no catalog was specified in Phase 7.

## Analytics and evidence

Analytics is opt-in, disabled by default, and event-specific with primitive metadata only. Learning commands emit the approved minimal events once per new operation. Actual ledger/day insertions emit trusted reward/streak events; clients cannot author those events. Analytics runs in a guarded subtransaction and any failure leaves learning/reward receipts intact. Product telemetry does not determine progress or rewards.

Database tests cover publication/draft boundaries, private keys, cross-user grants/RLS, Storage paths, immutable records, trusted block/lesson policies, path-scoped VN checks and replay, video seeking/union/budget/fallback, quiz retries/mastery/bonus, correction reward scopes, timezone/daily review, optional analytics/failure, session preconditions, account deletion, same-operation/recreated-adapter replay and persisted database reopen. Test content is explicitly technical and never serves as canonical historical publication evidence.

Publication additionally rejects duplicate grading keys, impossible knowledge-check choices, scene branches without a playable end route, unsafe Storage path segments and non-finite media durations. The question-set DTO includes the authored `dailyReviewEligible` flag. Existing Auth identities receive missing profile/settings/streak rows without replacing preferences. All of these changes use migrations 021–024.

Migration 025 binds every confirmed daily-review attempt, including a zero-XP claim after another attempt already qualified that account day. Replay after a timezone change preserves that attempt's original day and cannot create another reward. Upgrading an older database backfills bindings from existing confirmed receipts. Fresh future-day attempts retain normal eligibility.

## Native PostgreSQL verification

`supabase/tests/nativeHarness.mjs` can run the SQL suites against a dedicated disposable PostgreSQL 17 cluster on loopback port 54329. The harness requires explicit opt-in, accepts no URL query/hash overrides, builds normalized connection parameters and creates/drops only its randomly named `suchill_review_<uuid>` databases. It initializes test-only Auth/Storage metadata schemas; it does not start Supabase HTTP services. Native role bootstrap affects only the explicitly selected disposable cluster.

```powershell
$env:SUCHILL_NATIVE_PG_URL = 'postgresql://postgres@127.0.0.1:54329/postgres'
$env:SUCHILL_NATIVE_PG_TEST_CLUSTER = '1'
npm run test:db
Remove-Item Env:SUCHILL_NATIVE_PG_URL
Remove-Item Env:SUCHILL_NATIVE_PG_TEST_CLUSTER
```

The normal command without these environment variables uses PGlite and explicitly skips the native concurrency suite. The persisted PGlite reopen test remains PGlite even during a native run. Native concurrency tests require eight overlapping independent sessions, verified as blocked native backends before releasing an account-row barrier. They cover identical/distinct operation IDs, reward/streak uniqueness, stale revisions and rollback, quiz attempts, video union, daily claims and A/B isolation. [Database evidence](./tests/EVIDENCE.md) records actual run results and their remaining boundaries.

The re-review native-mode suite passed **49/49** on PostgreSQL 17.11 with migrations 001–025. The suite count includes the intentional PGlite reopen test and two pure configuration guards; the evidence separates those from native SQL/concurrency verification.

Hosted Auth/REST/Storage behavior and credential rotation still require a safely configured Supabase project. Local database evidence does not confirm those integration gates or close M4/M5 milestone acceptance.
