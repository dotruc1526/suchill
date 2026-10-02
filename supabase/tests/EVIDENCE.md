# M4/M5 local database evidence — 2026-10-02

## Re-review and native PostgreSQL 17 result

The final native-mode run on 2026-10-02 completed with exit 0: **49 tests, 49 passed, 0 failed, 0 skipped**, 30.5 seconds. It used the dedicated disposable loopback PostgreSQL **17.11** cluster, all 25 ordered migrations, actual domain adapters over SQL RPC and eight independent overlapping connections in every native contention subcase. The persisted-file reopen test intentionally remained PGlite; two native-configuration guards are pure pre-connection tests. This result is a native-mode suite count, not a claim that all 49 tests used the native engine.

The PostgreSQL binary was an EDB Windows archive; [PostgreSQL's Windows downloads](https://www.postgresql.org/download/windows/) documents the portable ZIP option. The downloaded archive was [postgresql-17.11-4-windows-x64-binaries.zip](https://get.enterprisedb.com/postgresql/postgresql-17.11-4-windows-x64-binaries.zip), computed SHA-256 `b9424ee7bc60b52450ff910a3630225df32e633f3cb29c1d126d9299d59aea28`; the executable reported 17.11. Runtime files and the disposable cluster live under untracked `output/review-native-pg/`; no Windows service or hosted database was changed. The cluster was stopped after testing and no disposable database remained.

| Re-review evidence | Finding/fix and verified behavior |
|---|---|
| Migration 021 + `review.test.mjs` | Pre-existing Auth identities previously lacked app profile/settings/streak rows and could not execute commands. Missing rows now bootstrap without replacing preferences, granting metadata roles or changing rewards. |
| Migration 022 + `review.test.mjs` | Hosted quiz DTO previously omitted authored daily-review eligibility, leaving its UI control unavailable. Published delivery now projects the flag for anon/A/B while keeping grading keys private. |
| Migration 023 + `review.test.mjs` | Publication now rejects knowledge checks with no correct option or advancing target, duplicate grading keys, unsafe path segments/backslashes and non-finite media duration. Valid repaired draft fixtures can publish. |
| Migration 024 + `review.test.mjs` | A branch reachable from the start could still lead to a closed cycle. Every scene now needs an end route using actual choice policy; retryable incorrect edges cannot falsely supply that route. |
| Migration 025 + `review.test.mjs` | A confirmed zero-XP claim previously left its second attempt unbound. Every valid confirmed attempt now preserves its original day and cannot earn after timezone reinterpretation; genuinely fresh attempts remain eligible. A real database stopped at migration 024 generated old first/zero-XP receipts, then applied the entire migration 025 and preserved those receipts through backfill. |
| `native-safety.test.mjs` | Missing dedicated-cluster opt-in, non-loopback endpoints, wrong port/database/user and all URL query/hash overrides fail before connection. Explicit driver parameters prevent `?host=remote` bypass. Dollar-quoted bootstrap SQL remains intact. |
| `native-concurrency.test.mjs`: identical operation | Eight blocked native sessions overlap; one stored operation and reward return the same immutable original receipt. |
| Distinct operations/reward/streak | Eight distinct simultaneous operation IDs grant 10 XP once, record one first completion and one account-day streak. |
| Checkpoint contention/rollback | One expected-revision write succeeds; seven stale writes return conflict and leave no rejected operation records. |
| Quiz contention | Eight valid graded attempts receive unique attempt identities/retry indexes, with one 20 XP base and one 5 XP bonus. |
| Video contention | Eight range writes merge into one unique range; competing expected-revision writes admit one winner and roll back stale operations. |
| Daily-review contention | Eight simultaneous owned attempts produce one account-day claim/reward of 5 XP. |
| A/B isolation | Locking A does not block B's own learning write. A subject precondition with B's actual identity rejects before mutation; the same textual operation ID remains account scoped. |

Independent peer review rechecked migrations 021–025, private ACLs, zero-XP claim ownership/backfill, end-route semantics and native harness boundaries. No remaining P1 finding was identified in the reviewed SQL paths. All SQL changes are new roll-forward migrations; the existing 001–020 files were preserved.

The native sessions represent concurrent authenticated database identities and logical devices. Auth/JWT refresh/confirmation, PostgREST transport, Storage signing/download/upload HTTP, physical device sessions and rotation of an old privileged key remain unverified. Auth and Storage metadata are fixtures; production content/historical publication remains separately gated. These limits do not invalidate the database invariants proved here, and they remain M4/M5 integration/milestone gates.

## Earlier delivery checkpoint

`npm run test:db` completed with exit 0: **33 tests, 33 passed, 0 failed**, 25.3 seconds. The run included all 20 ordered migrations and the root-owned actual Supabase adapter through SQL integration suite.

| Evidence | Verified behavior |
|---|---|
| `security.test.mjs` | Published UUID/relational DTOs; no delivered quiz/story answer keys; anon draft/user/answer denial; A/B row isolation; no direct user publication/reward writes; private helper ACLs; immutable roots/children/answer keys/ledger; draft references rejected; approved exact Storage paths and owner avatar policies |
| `progress.test.mjs` | Trusted completed block list; optimistic revision conflict; identical operation receipts; distinct concurrent completion requests produce one ledger reward; replay cannot regress completed state; sequential VN traversal, retry feedback and required checks; video initialization, server budget, range union, seek denial, 90%/fallback; trusted quiz grading, retry/mastery and one-time XP |
| `account.test.mjs` | Safe settings; valid account timezone; seven-day audited cooldown; authored enabled daily review and cross-set/account-day cap; attempt/timezone replay defense; yesterday/gap/longest streak; opt-in minimal analytics and disallowed PII; queued expected-subject mismatch mutates no other account, including settings; matching session settings succeed without overriding ownership |
| `regression.test.mjs` | Minor corrected lesson/assessment rows reuse reward scopes; existing unsafe buckets become private; locked assessment prerequisites; 75% pass then later 80%+ bonus exactly once; automatic learning/reward/streak analytics dedupe; synthetic analytics INSERT failure preserves a fresh 10 XP reward and replay receipt; optional video cannot block lesson while required text/threshold video still gate; roll-forward policy repair on an earlier function; persisted PostgreSQL reopen preserves receipts/ledger uniqueness |
| `branching.test.mjs` | Exclusive VN branches do not require unvisited branch knowledge checks; completed replay explores alternatives without progress/attempt/reward mutation; trusted account deletion removes personal records while direct ledger DELETE fails and minimal anonymized audit survives |
| `adapter.integration.test.mjs` | Actual production adapter consumes normalized RPC/media DTOs, submits trusted VN/quiz/text operations, preserves exact retry receipts and rejects a changed account session before writes |

The engine was PGlite PostgreSQL 18.3 with explicit SQL roles plus Auth/Storage metadata fixtures. Test content is technical, not canonical historical publication. Native PostgreSQL 17, independent native sessions/concurrent connections, hosted Auth/JWT/REST/Storage, safe production configuration and credential rotation were not verified by this run. No remote project was contacted or migrated. Hosted/native checks remain required before claiming M4/M5 milestone acceptance.

Final independent database review on 2026-10-02 checked the session precondition before account mutation/receipt replay, settings field whitelist, analytics failure subtransaction, completed VN replay immutability, minor-correction reward identity, daily attempt ownership/day binding and optional-video policy. The optional-video mismatch was repaired with migration 020 and a migration-upgrade regression. No remaining P1 finding was identified in those reviewed paths; this local review does not close the hosted/native gates above.
