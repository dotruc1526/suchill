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

## Final hosted follow-up verification

See [hosted acceptance](../hosted-supabase/EVIDENCE.md): Quality238 PASS =146unit+22component+42SQL+19authoring+9browser,0failed; one intentional native concurrency skip covered by separate native-mode50/50 PASS on PostgreSQL17.11/migrations26. Actual hosted transport12/12 (11 integrations+1guard) and Auth9/9 pass. Owned-inbox fresh signup/email click is server-confirmed; root browser login/reload/settings/A-B/sign-out pass. Final server:26 migrations,46 public tables,all RLS,0 public buckets,0 active learning RPC loops.

Migration026 repairs actual PostgREST14 infinite retries on intentionally raised40001 by returning PT409/HTTP409, preserving function security and original operation receipts. Fixture-only browser QA is now isolated from hosted `.env.local`. Independent Codex application/security reviewer reports no remaining P1 in this scope.

Of27 initial REVIEW cards, **22 are DONE and5 content cards remain REVIEW**. Audit and new hosted follow-up cards are separate; UX cards added concurrently are outside the original inventory. New Free development keys are used; unidentified prior-key revocation is not proved by this target and remains a production follow-up. Formal PO milestone acceptance/content/release remains separate.

Build limitations remain the existing Vite native-config warning and main bundle over 500 kB. Browser checks cover Chromium interaction/accessibility smoke and 375/430px layouts, not real low-end devices/full screen-reader certification. PWA/release/performance remain later milestones.

## Closure matrix

Individual technical tasks close after their own acceptance. Hosted integration and milestone closure remain separate. The following matrix records acceptance after final verification passed.

| Task | Final state | Evidence / remaining prerequisite |
|---|---|---|
| M3-06 | DONE | Completion/profile/service receipts, safe pending/account states, component/browser checks |
| M3-07 | DONE | Technical mock learning loop, quiz/daily/video fallback, offline/account/focus/mobile regressions |
| M3-UX-02 | DONE | Existing visual hierarchy and current service journey, 375/430px/focus/token checks |
| M4-01 | DONE | Fresh Free development project configured. Frontend receives only URL/publishable key; trusted harness secret stays in a Git-ignored Node-only file. Malformed config fails closed and source/bundle scans pass. No old credential is reused. Revocation of the unidentified historical key is unproved and remains a separate production follow-up, not evidence about this fresh target. |
| M4-02 | DONE | Fresh PG17 normalized/versioned schema, publication safety and immutable content tests |
| M4-03 | DONE | Auth row backfill, owned progress/attempt/ledger/streak constraints and upgrade checks |
| M4-04 | DONE | Actual native anon/A/B/trusted grants/RLS matrix; real JWT/REST mediation remains M4-08/milestone gate |
| M4-05 | DONE | Actual private Storage HTTP upload, signed download and tampered/unsigned URL denial pass. Exact published paths are readable; draft/unreferenced and cross-user avatar paths are denied. Deletion checks account for cache and signed-URL TTL. Domain media adapters resolve private resources. |
| M4-06 | DONE | Actual application domain adapters pass against hosted Auth/JWT/PostgREST/Storage. Published DTOs redact private grading; original account binding and safe error mapping pass. Migration026 replaces intentional business-conflict40001 with PT409; stale writes return bounded HTTP409 and preserve original retry receipts. |
| M4-07 | DONE | Hosted Auth9/9 plus fresh public signup: user received/clicked the authorized email, server confirmed identity, browser signed in and restored the session after a real reload. Profile/settings persist; real A/B switching and sign-out pass. Site URL uses the running127.0.0.1:5173 origin with two exact localhost/127 redirects. |
| M4-08 | DONE | Hosted matrix12/12 (11 actual integrations plus one pure target guard), Auth9/9, native-mode50/50 and Quality238 PASS. Anonymous/A/B/trusted publication, user ownership, reward authority, Storage paths and session boundaries pass. Final server check:26 migrations,46 public tables,0 tables without RLS,0 public buckets,0 active learning RPCs. |
| M5-01 | DONE | Account/version checkpoint/resume and stale revision tested across independent sessions/recreated adapters |
| M5-02 | DONE | Required block/knowledge/video/fallback/quiz policies, native trusted completion tests |
| M5-03 | DONE | Genuine same/distinct operation overlap returns stable receipts and one ledger reward |
| M5-04 | DONE | Account timezone/server date, one-day qualification, gap/current/longest and replay guards |
| M5-05 | DONE | Private grading, immutable attempts/unique retry indexes, mastery/base/bonus/daily dedupe |
| M5-06 | DONE | Minimal opt-in event catalog, safe fields, best-effort telemetry and injected-failure tests |
| M5-07 | DONE | Durable ordered actor queue, original retries, pending/confirmed UI and explicit rejected recovery |
| CONTENT-003 | REVIEW | Required readable source pages/historical artifact/audio/media sign-off absent; provenance conflicts recorded |
| CONTENT-004 | REVIEW | Draft screenplay/narration/VTT pass; exact source revision, selected narration/media rights review and task handoff remain. Final MP4 belongs CONTENT-007, not this screenplay prerequisite |
| CONTENT-010 | REVIEW | Draft graph/coverage/choice fallback pass; media/license and task acceptance absent |
| CONTENT-011 | REVIEW | Draft traceability/fallback pass; media/license and task acceptance absent |
| CONTENT-012 | REVIEW | Five-question authoring checks pass; historical/learning sign-off and media/handoff criteria absent |
| CONTENT-014 | DONE | Authoring remediation only: 5 nodes/7 scenes/6 complete paths/5 quiz/9 identical cues110s; reviewed draft boundary |
| CONTENT-017 | DONE | 5 nodes/8 scenes/3 terminating paths; JSON/diagram unchanged from Trúc-approved f641530; narration only taxonomy/media guardrail changes; delegated authoring acceptance |
| DOC-017 | DONE | Current links/status/gates synced; history preserved. fd52278/bc128db/e9f15d1 unavailable locally, prior diff audit remains recorded evidence rather than a new ancestry assertion |
| M3-M5-DELIVERY | DONE | Technical mock/native/hosted acceptance and independent review complete; formal PO milestone/content/release acceptance remains separate |

## Handoff

Hosted development migrations001–026 and technical fixture graph/Storage are applied; no hosted reset, canonical publication, production deployment or M6/M7 opening. Applied001–025 are unchanged. Native runtime/data remain untracked under output/review-native-pg; temporary native server stopped. Unrelated user files and concurrent UX task cards are preserved.

Five content cards remain REVIEW for exact source revision/media rights/task sign-off. Existing historical/language approvals retain their scope. CONTENT-004 final MP4 belongs CONTENT-007 production; missing selected narration/media rights and screenplay handoff remain its true prerequisites. CONTENT-007 stays BLOCKED.
