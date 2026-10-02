# All REVIEW task audit — 2026-10-02

Branch: codex/m3-m5-complete, review baseline da12f40. User explicitly delegated specialist review, repair, re-review and DONE only after acceptance. The initial inventory contains 27 REVIEW cards, including the delivery aggregate. Three Codex specialists reviewed application, database/security and content; root reviewed their repairs and integrated evidence. Named human approvals are never invented.

## Verified repairs

| Finding | Repair and regression |
|---|---|
| Offline retry could send changed payload before checking queued identity, overtake prerequisites or retain successful pending work | Check signature/order under queue lock before network; immutable caller snapshot; remove confirmed entry; queue/session regressions |
| Account reads/preferences and delayed UI actions could cross A/B or A/B/A sessions | Initiating-account read observers, DTO ownership, actor-scoped rendered services, original-subject write preconditions; account snapshot/scope/SDK regressions |
| Token refresh reset active lesson; transport failures could leave account/quiz loading or submission stuck | Reset feature generation only on subject change; safe error/retry UI; quiz duplicate-click/unmount guards |
| Old video queue could write to a new account, retry expired media URLs or stay on a rejected revision | Actor-bound checkpoints; signed URL reload; explicit authoritative reload for rejected local work while transient retries retain original identity |
| Auth identities predating migrations lacked app rows; daily review eligibility omitted from delivery | Roll-forward 021/022, backfill preserves existing settings/rewards; private grading remains redacted |
| Published content could be impossible to complete or carry unsafe media metadata | 023/024 require a valid correct transition, unique grading keys, finite durations/safe paths and playable route to end on every branch |
| A confirmed zero-XP daily attempt could become fresh after timezone reinterpretation | 025 binds every consumed attempt to its original day; complete upgrade from 024, zero-XP backfill and fresh-attempt regressions; mock parity |
| Historical source/claim IDs were redefined; Set-based validator hid duplication | Remove contradictory stale registry; validate unique identities, references, draft boundaries, choices, termination/required coverage and narration/VTT matching; 19 mutation probes |
| Old report asserted media rights without evidence and conflicted on embassy building entry | Explicit provenance conflict notes preserve historical record; current catalog authoritative for rights; unsupported visual/audio cues remain optional unverified draft intent |

## Verification and limits

Native-mode `npm run test:db`: **49/49 PASS**, no skips, 30.5 seconds, dedicated disposable loopback PostgreSQL **17.11**, all 25 migrations. Seven overlapping-session scenarios use eight independent connections blocked behind an explicit profile lock: same-operation receipts, distinct-operation reward dedupe, stale cursor rollback, quiz indexes/bonus, video range/revision, daily claims and independent A/B ownership. Two native guard tests are connection-free; persisted-file reopen deliberately remains PGlite. Auth/Storage HTTP are fixtures and JWT identity is supplied by role-scoped test transactions. This is genuine database concurrency evidence; it does not assert hosted Supabase transport or credential rotation.

Final `npm run quality` **PASS, exit 0** after all code/mock repairs: typecheck/build, **146 unit + 22 component + 41 SQL + 19 authoring + 9 browser tests = 237 passed**, zero failed. One native concurrency test is intentionally skipped in the PGlite-mode Quality run; the separate native-mode run above executes it and all seven children successfully. Both client source/bundle scans checked 398 files with zero unsafe matches. Build/browser runs include media retry/fallback, explicit receipts, account isolation, offline reconnect, keyboard focus and 375/430px layouts. No further code changes occurred after this run.

All 27 initial REVIEW cards were assessed: **16 moved to DONE, 11 remain REVIEW** with specific prerequisites. The audit card itself is separate from that inventory. Post-closure authoring/local-link/card-status checks pass; prior checkpoints and existing named approvals are preserved. The temporary database server was stopped and disposable database count is zero.

Build limitations remain the existing Vite native-config warning and main bundle over 500 kB. Browser checks cover Chromium interaction/accessibility smoke and 375/430px layouts, not real low-end devices/full screen-reader certification. PWA/release/performance remain later milestones.

## Closure matrix

Individual technical tasks close after their own acceptance. Hosted integration and milestone closure remain separate. The following matrix records acceptance after final verification passed.

| Task | Final state | Evidence / remaining prerequisite |
|---|---|---|
| M3-06 | DONE | Completion/profile/service receipts, safe pending/account states, component/browser checks |
| M3-07 | DONE | Technical mock learning loop, quiz/daily/video fallback, offline/account/focus/mobile regressions |
| M3-UX-02 | DONE | Existing visual hierarchy and current service journey, 375/430px/focus/token checks |
| M4-01 | REVIEW | Safe client config/scans pass; hosted configuration and exposed privileged-key rotation evidence absent |
| M4-02 | DONE | Fresh PG17 normalized/versioned schema, publication safety and immutable content tests |
| M4-03 | DONE | Auth row backfill, owned progress/attempt/ledger/streak constraints and upgrade checks |
| M4-04 | DONE | Actual native anon/A/B/trusted grants/RLS matrix; real JWT/REST mediation remains M4-08/milestone gate |
| M4-05 | REVIEW | Storage SQL/private paths and URL adapter pass; real Storage HTTP/signing unverified |
| M4-06 | REVIEW | Domain adapters invoke actual SQL; real PostgREST transport unverified |
| M4-07 | REVIEW | Account/session safety tests pass; real Auth confirmation/refresh/session persistence unverified |
| M4-08 | REVIEW | PG17 security/concurrency complete; full Auth/JWT/REST/Storage integration absent |
| M5-01 | DONE | Account/version checkpoint/resume and stale revision tested across independent sessions/recreated adapters |
| M5-02 | DONE | Required block/knowledge/video/fallback/quiz policies, native trusted completion tests |
| M5-03 | DONE | Genuine same/distinct operation overlap returns stable receipts and one ledger reward |
| M5-04 | DONE | Account timezone/server date, one-day qualification, gap/current/longest and replay guards |
| M5-05 | DONE | Private grading, immutable attempts/unique retry indexes, mastery/base/bonus/daily dedupe |
| M5-06 | DONE | Minimal opt-in event catalog, safe fields, best-effort telemetry and injected-failure tests |
| M5-07 | DONE | Durable ordered actor queue, original retries, pending/confirmed UI and explicit rejected recovery |
| CONTENT-003 | REVIEW | Required readable source pages/historical artifact/audio/media sign-off absent; provenance conflicts recorded |
| CONTENT-004 | REVIEW | Draft screenplay/narration/VTT pass; recording, rights, media review and listening/viewing handoff absent |
| CONTENT-010 | REVIEW | Draft graph/coverage/choice fallback pass; media/license and task acceptance absent |
| CONTENT-011 | REVIEW | Draft traceability/fallback pass; media/license and task acceptance absent |
| CONTENT-012 | REVIEW | Five-question authoring checks pass; historical/learning sign-off and media/handoff criteria absent |
| CONTENT-014 | DONE | Authoring remediation only: 5 nodes/7 scenes/6 complete paths/5 quiz/9 identical cues110s; reviewed draft boundary |
| CONTENT-017 | DONE | 5 nodes/8 scenes/3 terminating paths; JSON/diagram unchanged from Trúc-approved f641530; narration only taxonomy/media guardrail changes; delegated authoring acceptance |
| DOC-017 | DONE | Current links/status/gates synced; history preserved. fd52278/bc128db/e9f15d1 unavailable locally, prior diff audit remains recorded evidence rather than a new ancestry assertion |
| M3-M5-DELIVERY | REVIEW | Individual technical scope verified; hosted acceptance/key rotation still absent |

## Handoff

No hosted migration, canonical publication, production media creation or M6/M7 opening. Existing migrations 001–020 unchanged; apply new 021–025 after review on a disposable stack. New pg dependency is test-only; native ZIP/runtime/data live under untracked output/review-native-pg and the temporary server is stopped after tests. Existing unrelated untracked files are preserved.

For remaining integration tasks, supply a safely configured disposable Supabase stack/project and explicit rotation evidence, then run Auth/REST/Storage through actual HTTP. For remaining content tasks, content/historical owners must provide readable source evidence and exact selected media/recording/license manifests; existing draft QA does not establish those facts. CONTENT-007 stays BLOCKED.
