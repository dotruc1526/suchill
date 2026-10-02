# PR106 — final independent acceptance, 2026-10-02

Main baseline:2ee9c51abb661e874365c2912a2f19a4c677ec64. Candidate:codex/m4-m5-main-integration. Reviewed/tested runtime:0c9f0d818a9808a8d2c4ecaecf516839a2bffe5b (repairs02c54e1 plus refreshed main). This report supersedes earlier a21be26/5640f29 readiness counts and pending findings. [PR106](https://github.com/dotruc1526/suchill/pull/106). Current-head GitHub CI must pass before merge; no main merge or PO milestone approval is claimed.

## Result and preserved main

Main advanced during acceptance with content PR65/107/108. It was merged cleanly into the candidate; accepted main authoring/PO/historical/architecture evidence and original M3 test assertions remain byte-identical. A compatibility page at the former CONTENT-018 active-card path resolves a stale main link without modifying the hash-bound lesson. Root contributor changes and user localhost8443 remain untouched.

Independent audit reproduced3 P2 defects missed by earlier tests: canonical completion bypassed durable offline queueing; first video save could include ranges before server initialization; canonical completion bypassed trusted optional analytics. The repairs preserve stable account-bound IDs, pending/no-optimistic-XP semantics, ordered recovery and owner isolation. Raw mock completion now fails offline at the service boundary while hosted controllers still reach durable queueing. Video retains original asset-ID guard plus exact queue/account/context guards.

## Verification

| Check | Result / evidence |
|---|---|
| Full Quality after refreshed-main merge |330 PASS:230 unit,29 component/Auth UI,62 SQL,9 original M3 Chrome E2E. Typecheck/build PASS;3 native-only SQL skips covered by native run. [Log](./quality030.txt) |
| Full native PostgreSQL17 through030 |72/72 PASS, zero skipped; actual multi-session concurrency, owner/RLS, failure isolation. [Log](./native030.txt) |
| Actual hosted Supabase030 + canonical facade |9/9 PASS, zero skipped: opt-in once under8 concurrent requests/replay; opt-out0; independent SDK video/VN resume/revisions; deliberately lost response after real commit and recreated durable queue; exact owned cleanup. [Log](./hosted030.txt) |
| Actual isolated Chrome video | Actual Play→empty init→native pause until held ack→same-video resume→about1.42 seconds genuinely observed ranges; exact-ID retry; late account/context callback cannot restart new video. [Log](./video-initialization.txt) |
| New accepted-main authoring validators | Lesson03 reading and1972 quiz PASS. All imported authored content remains identical to main; validators do not replace historical/media review. |
| Docs/status/link validation |93 task cards and local-link validator PASS; final exact link count recorded in local status. M4 cards/board DONE; M5 cards/board BLOCKED. |
| Source/tracked/bundle credential scan |0 unsafe matches; Quality checked541 files. Final staged scan must also pass. |

Hosted video cursor test reports4 seconds using the approved elapsed-time budget after a2-second wall-clock wait; it verifies server persistence/revisions, not decoding/attention. Separate Chrome test above observes actual native playback. Independent SDK sessions establish cross-client persistence; no claim of physical mobile testing is made.

## Independent review and task acceptance

pr106_m4_acceptance independently APPROVED M4-01..08 and offline/video/030 repair scopes (59 service/Auth/config/session checks;36 focused repair checks; SQL rights audit). pr106_m5_acceptance reproduced findings, independently reviewed reused M5 acceptance and ran the final9 hosted tests; remaining mock offline finding was repaired and independently approved by pr106_auth_recovery_review. Its final71 tests verify mock/controller/offline/video/component/Auth paths. These are delegated Codex technical approvals, not fabricated Hưng/Vinh/Dương approvals. Final Quality proves the original M3 assertions still pass after repair.

M4-01..08: DONE for individual technical acceptance. M4 milestone remains OPEN pending PO acceptance. M5 reused implementation now meets its technical checks, but cards remain BLOCKED until PO closes M4 and explicitly opens M5.

| Card | Scope | Technical review | Formal board status | Evidence |
|---|---|---|---|---|
| M5-01 | Checkpoint/resume | APPROVE technical | BLOCKED: PO gate | Independent hosted SDKs restore video cursor/ranges/revision and VN scene; stale writes and A/B access rejected. Native lesson/version/account revision tests pass. Physical-device QA remains M6. |
| M5-02 | Trusted completion | APPROVE technical | BLOCKED: PO gate | Required evidence and fallback/server watch policies pass; first actual video play initializes before recording ranges. Canonical owner/version receipts remain trusted. |
| M5-03 | Reward ledger/XP | APPROVE technical | BLOCKED: PO gate | Native owner-lock races and8 concurrent hosted requests yield one receipt/reward; lost real post-commit response replays the same receipt without extraXP. |
| M5-04 | Streak | APPROVE technical | BLOCKED: PO gate | Server account timezone/day/current/longest and7-day timezone-change cooldown pass; hosted replay creates only one streak qualification. |
| M5-05 | Quiz attempts/mastery | APPROVE technical | BLOCKED: PO gate | Private authoritative grading, retry/best/mastery/base-bonus/daily XP tests pass; hosted scored quiz retry grants no extra reward. |
| M5-06 | Minimal analytics | APPROVE technical | BLOCKED: PO gate | 030 opt-in trusted minimal block/lesson/reward/streak events emit once; opt-out0, replay0, privacy rejection and analytics-failure rollback isolation pass. |
| M5-07 | Offline pending sync | APPROVE technical | BLOCKED: PO gate | Canonical durable owner/operation/payload survives offline/reload/lost response. Ineligible intent remains recoverable, queue order/isolation holds; confirmed XP waits for server receipt. Original mock M3 offline pending behavior preserved. |

## Database and account impact

Migration030 was independently approved and applied to development suchill-test (kyfqlhpweetsridmqkvl). Applied001–029 remain immutable. The public RPC keeps its OID/ACL; its private implementation is revoked from public/anon/authenticated. Owner locking makes telemetry idempotent; optional analytics failure cannot undo learning/XP/receipt. No content publication, reset or production deployment occurred.

Exact transaction/history payload was executed in isolated PGlite through029 with source/history-body equality, unchanged public OID/ACL and private access denied. Browser clipboard copy equalled the prepared payload; Supabase Results confirmed20261002003000/main_completion_analytics. SHA256:08fbdd321682b71ee610feeb7c0f2a9e746b07085aace21911e7f2edc9a1a960. This is a prepared/UI-payload comparison, not a server-side body hash claim. Screenshot is local output/main-first-integration/supabase-030-applied.png.

The retained dotruc1526 account/password/progress is not changed. Hosted tests use only exact owned disposable A/B users and clean them up. Temporary native/Chrome test servers stop in finally; no user browser session or localhost8443 is commandeered.

## Remaining gates and sequence

1. Confirm current-head GitHub Quality and mergeability, then review/merge the candidate.
2. Re-review main after merge as requested: M3 regression, configured Supabase/Auth, account ownership/reward; repair and re-review any finding before proceeding.
3. PO closes M4 and explicitly opens M5 on the board; accept M5 separately using these current checks. No new blocked task or M6/M7 implementation is claimed.

AUTH-USERNAME-001 remains REVIEW: core signup/login/password-change works; optional recovery needs verified sender/server configuration and a dedicated recovery callback/reset UI with invalid/expired-link handling. This addon is not complete. Historical privileged-key revocation for production, canonical content/media, physical-device/PWA and production gates stay separate. M6/M7 remain locked.
