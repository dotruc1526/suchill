# Latest-main audit — 2026-10-04

Baseline: GitHub main `06a5424` (PR121). Fetched remote and reviewed PR109/115/119/121 merge history. Main Quality run37087957576 and Chapter1954 run37087957583 were successful. No open PR existed at audit start. Audit uses a separate main-based checkout; the original feature/ai-chatbot checkout and all its tracked/untracked work remain untouched.

## Confirmed findings and repairs

| Finding | Effect | Repair / executable evidence |
|---|---|---|
| P1: pending answer score, combo and trial EXP published through snapshots; opponent_answered includes score | A player can infer correctness before both players lock or time expires | Store pre-answer totals; omit opponent event score; publish updated totals only at question_end. New network regression failed on baseline with actual120 versus expectedundefined; passes after repair. |
| P2: AI frontend fetch/body read has no deadline; backend grants12seconds separately to four provider attempts | Thinking/disabled input can persist on a stalled network; one request can occupy a provider slot for48seconds | Frontend15second deadline covers headers/body; malformed payloads safely fall back. Backend shares one12second signal and retries only model404, stopping quota/auth/server/network failures. Tests cover stalled fetch/body, invalid payloads, nonretry status and shared deadline. |
| P2: LAN account proxy fetch has no deadline and accepts arbitrary JSON as success | Login/recovery can remain pending indefinitely; arrays/null can cross the service contract |25second abort and no-store/omit credentials; reject nonobject/array payloads. Regression covers SDK fallback after timeout, malformed JSON shape and trusted SDK path for HTTPS/public lookalike host. |

Provider model names retained; current [Google model catalog](https://ai.google.dev/gemini-api/docs/models) supports the existing primary model naming. No actual provider request or billable generation was performed. Learner errors no longer expose server configuration steps or falsely describe unavailable service as archive retrieval. Existing historical fallback text was not rewritten or promoted to canonical content.

## Validation

- Local full `npm run quality`: exit0,418PASS/0FAIL/3SKIP. Native-only SQL concurrency cases remain explicit skips; PGlite ownership/reward/migration tests ran. This run preceded the final bounded LAN-only edit.
- Final LAN regression:1PASS; final typecheck:PASS. Final GitHub CI must validate the committed combined diff.
- Release/reference1954/register tests:55PASS/0FAIL, including Chrome375/430px, offline transcript, Back navigation, immutable video/hash and six episode locks.
- Register CLI:15sources/42claims/7episodes PASS (structural preparation only).
- Source/bundle secret scan:771files,0unsafe matches; both dependency installs audited0vulnerabilities.
- Final diff whitespace check:PASS. Original M3/learning tests retained unchanged.

Local attempts initially lacked isolated backend/frontend dependencies; installed exact lockfiles and reran. An interrupted tool session did not provide a complete result; the completed rerun above is the reported evidence.

## Scope and integration handoff

No migration/environment/account/secret changes; no deployment or milestone closure. Public backend and Gemini configuration cannot be inferred from green CI. Actual device Wi-Fi/4G and final historical/media/security/release acceptance still require their own evidence. GitHub fixes are prepared as a review PR; task remains REVIEW until the reviewer accepts it under AGENTS.md.
