# M3-COMPLETION-01 — Completion/account-summary mock adapter

> Status: REVIEW
> Last updated: 2026-10-02

## Assignment
- Owner: Vinh (Member 5).
- Executor: Codex hỗ trợ Vinh.
- Reviewer: Hưng (contract/architecture), Dương (consumer fit).
- Branch: `codex/m3-completion-mock`.
- Started: 2026-10-02; READY → IN PROGRESS after claim.
- Depends on: M3 OPEN, M3-01..05/M3-INTEGRATION-01 DONE; agreement D1–D7 on [PR84](https://github.com/dotruc1526/suchill/pull/84) at `5144fa2dd57d2cc785e5f132fa3b78c923c05da0`.

## Scope / Files claimed
- Contracts: `src/services/next/contracts.ts`, `src/services/next/completionContracts.ts`.
- Mock adapters/store/evidence: `src/services/next/mock.ts`, `src/services/next/mockProgress.ts`, `src/services/next/mockPlaybackProgress.ts`, `src/services/next/mockQuiz.ts`, `src/services/next/mockCompletion.ts`, `src/services/next/mockCompletionEvidence.ts`, `src/services/next/mockCompletionStore.ts`, `src/services/next/mockCompletionTime.ts`.
- Tests: `tests/member5/m3-completion.test.ts`; `tests/member5/fe-011-greeting.test.ts` (UserService interface stub only; no Home behavior change).
- Docs: `docs/tasks/active/M3-COMPLETION-01.md`, `docs/tasks/evidence/M3-COMPLETION-01.md`, active index own entry, board own row.
- Consumers: Dương completion/profile UI after acceptance. No Home source/fixture, App/UI/hotspot, QA83 E2E, migration/env/dependency changes; M3-06 UI stays BLOCKED.

## Acceptance
- [x] Typed completion outcomes/receipt/account summary per D1–D7; caller cannot grant XP.
- [x] Version-bound stored text/recap, VN attempts/end, video policy/fallback and quiz evidence; completedBlockIds alone cannot complete mixed lessons.
- [x] Operation retry/conflict, fresh-ID replay, concurrent calls and adapter recreation grant once with shared store; sessions isolated.
- [x] Deterministic account timezone streak and confirmed summary; unauthorized/empty distinct from errors.
- [x] Typecheck/build/unit/component/E2E and handoff evidence.

## Next action
Hưng review contract/architecture and new explicit-action API; Dương confirm consumer fit before UI claim. Only PO changes gate.

## Checkpoint / handoff
- 2026-10-02: implementation complete; full quality PASS: 91 unit, 22 component, 4 E2E. Focused completion regressions 15/15.
- [Evidence / consumer instructions](../evidence/M3-COMPLETION-01.md).
- No env/migration/dependency/UI impact. In-memory mock only; M3-06 UI remains blocked until reviewer acceptance.
- Checklist marks executor verification only; task remains REVIEW, not DONE.

## Current-main handoff refresh — 2026-10-02
- Rebased from old base `260d2d0` onto `74c8059` (FE-011/Home + PR84/87 merged).
- Board conflict resolved retaining both M3-06 BLOCKED and adapter REVIEW rows.
- Home journey fixture metadata removed from adapter scope per user handoff; Dương will configure catalog metadata inside the later UI consumer claim. No Home source is changed.
- QA-002 PR83 remains separate/open, latest reviewed head `01b3817`; its E2E loading-race finding is separate from this adapter implementation. Do not merge its tests or claim them in this task.
- Verification after rebase: `npm run quality` PASS, 91 unit / 22 component / 4 E2E; scan 334 files / 0 unsafe; diff check PASS. Log `/tmp/suchill-m3-completion-rebase-quality.log`.
- Reviewer request prepared: Hưng checks D1–D7 policy, service placement and explicit-action API; Dương checks signatures/receipt, operation retry and summary read semantics. Local implementation only; no implementation acceptance claimed.

## Consumer review — Dương (Member 4), 2026-10-02

- Reviewed exact runtime head: `13c4d80` on `codex/m3-completion-mock`, base main `74c8059`.
- Verdict: CONSUMER FIT ACCEPTED. No blocking finding in consumer contract; Hưng implementation contract/architecture review remains required. Adapter stays REVIEW; M3-06 UI stays BLOCKED until accepted adapter handoff/merge.
- Review scope/claim: this reviewer record, evidence and adapter board row only; no source/contract/test changes. Started 2026-10-02; executor Codex for Dương; reviewer Hưng handles remaining scope.
- Signatures fit UI: completeLesson separates typed ineligible block IDs/reasons from Result failures; completed/already_completed includes version/account/time/method/rewards receipt; getLessonCompletion returns null for no current-version receipt; getAccountSummary returns confirmed XP/streak/count/identity and nullable account independently from errors.
- Explicit action API accepted for consumer: text/recap acknowledge and authored video fallback recordBlockAction do not grant reward. UI supplies stable IDs/actions only, waits for success and lets service evaluate required evidence; VN/quiz cannot be acknowledged as complete through this method.
- Retry semantics accepted: retain operation ID/payload for action and completion retry. Same-operation replay returns original receipt, which can still contain granted XP. Render accountSummary.totalXp; NEVER add replayed receipt deltas into local totals. Fresh-ID replay returns already_completed/zero deltas. Ineligible does not consume operation ID; new evidence may retry it.
- Recovery/profile: getLessonCompletion restores confirmed receipt; summary read failure retains it and retries only getAccountSummary, never completion. Preserve confirmed totals on read errors; distinguish authorized zero account from null/unauthorized. Empty achievements and string block reasons are usable for M3 copy/empty states.
- Existing 15 focused regressions cover action/evidence, duplicate/replay/recreation, copied receipts, account isolation, version changes, video/fallback, VN choices/end, trusted quiz, timezone and invalid-clock rollback.
- Independent verification on exact head: full npm run quality PASS (exit 0): typecheck/build, 91 unit / 22 component / 4 browser E2E, client scan 334 files / 0 unsafe. git diff origin/main...HEAD --check PASS.
- Limits: browser E2E verifies existing Home/journey/VN, not an unimplemented completion/profile UI. In-memory shared-store recreation is not browser-restart/cross-device persistence. UI claim must configure author-controlled technical catalog metadata (currently intentionally absent from Home fixture), retain shared store and use deterministic clock/timezone fixtures in tests.
- Next: Hưng reviews adapter D1–D7/explicit-action architecture; Vinh opens implementation PR and handles final handoff. After acceptance/merge Dương claims M3-06 and builds pending/confirmed/profile with controller, component and full-loop browser tests. No M3 closure or M4 opening implied.

## PR88 remediation claim — 2026-10-02
- Task remains REVIEW; executor Vinh/Codex; reviewers Hưng/Dương.
- Files claimed: `src/services/next/rewardPolicy.ts` (shared range normalization), `src/services/next/mockCompletionEvidence.ts`, `src/services/next/mockCompletion.ts`, `tests/member5/m3-completion.test.ts`, this card and its evidence.
- Fix adjacent/overlapping reach_end ranges and episode streak qualification independent of requiredLesson; preserve requiredLessonCount and activity/eligibility dedupe. No Home/QA83/UI changes.

## PR88 two-finding remediation — 2026-10-02
- `reach_end` uses the same normalized/merged adjacent and overlapping ranges as watch-threshold counting. Gaps are not bridged; seek-only and near-end-only evidence remain insufficient.
- Streak qualification uses account + activity type/ID + eligibility version, independently of requiredLessonCount. Required episode/scored reward activities qualify even when the containing lesson is not counted as required; requiredLessonCount still only counts required lessons. Same eligibility across content corrections or lesson reuse cannot qualify another day.
- Regression checks adjacent/overlapping/reordered/gapped ranges, non-required VN lesson first completion, replay/minor version/cross-lesson story reuse and account isolation. Both new tests FAIL on the previous runtime (ineligible instead of completed; streak 0 instead of 1), PASS after restoration of the fix. Diagnostic changes were restored.
- Full `npm run quality` PASS: typecheck/build, 93 unit / 22 component / 4 E2E, scan 334 files / 0 unsafe; focused completion 17/17; diff check PASS. Logs: `/tmp/suchill-pr88-remediation-quality.log`, `/tmp/suchill-pr88-remediation-baseline.log` (local only).
- No Home, QA83 harness, UI, dependency, env or migration changes. Prior Dương consumer acceptance applies to dcc3079; Hưng and Dương must re-review this runtime delta. Task remains REVIEW; M3-06 UI stays BLOCKED pending acceptance; milestone gates unchanged.

## Main integration claim — 2026-10-02
- Owner/executor Vinh/Codex; REVIEW; Hưng/Dương review integrated head.
- Files claimed: card/evidence, board adapter row and any overlapping docs resolution; import QA83 merged changes from main unchanged, no independent Home/QA83 edits.
- Input: adapter 5a771db (Hưng CHANGES REQUESTED: optional-only completion and backwards-day findings remained), main cda4a69 (PR83 merged). Resolve actual conflicts preserving both task records, then run full quality and publish integrated head. M3-06 stays BLOCKED.

## Integrated-main verification — 2026-10-02
- Merged main `cda4a69` (PR83) into adapter `5a771db`; the only conflict was active index `docs/tasks/active/README.md`. Retained adapter entry and all current-main task entries.
- Home/global CSS, shared Button and all `tests/qa` browser/fixture files exactly match main. Completion runtime and regression test changes remain exactly as Hưng reviewed at `5a771db`; no runtime delta from integration.
- Full quality on integrated tree PASS: typecheck/build, 93 unit / 22 component / 7 E2E; client scan 338 files / 0 unsafe; diff check PASS. This now includes PR83 delayed 12-second navigation/reload, personalized Home, keyboard/focus/44px and player retry regressions. Log `/tmp/suchill-pr88-integration-quality.log` (local only).
- Corrected reviewer history: Hưng CHANGES REQUESTED at `5a771db` because optional-only completion and backwards-day findings remained; the earlier ACCEPTED wording was inaccurate. This is not a GitHub approval record. Dương still confirms episode-streak/range remediation and final integrated head; both reviewers check current CI before merge. Task REVIEW, M3-06 UI BLOCKED and milestone gates unchanged.
- Files changed by integration: main imports plus active index resolution; this card/evidence and adapter board row for latest handoff. No additional runtime, dependency/env/migration changes. `.DS_Store` untouched.

## Optional-only / backwards-day remediation claim — 2026-10-02
- Executor Vinh/Codex; reviewers Hưng/Dương; REVIEW. Two remaining findings explain Hưng CHANGES REQUESTED at 5a771db; the earlier partial-acceptance wording was inaccurate. Adapter not accepted yet.
- Files claimed: `src/services/next/mockCompletion.ts`, `src/services/next/mockCompletionTime.ts`, `tests/member5/m3-completion.test.ts`, this card/evidence and adapter board row.
- Fail closed for catalogs with no required learning block (optional engagement is not completion authority); reject new completion dates before the account's latest confirmed local completion day before ledger writes; summary cannot count future streak days. Preserve same-operation retry and required lesson/episode dedupe. No UI/Home/QA83 changes.

## Optional-only and backwards-day fix verification — 2026-10-02
- Both new findings reproduced on `6c5a777`: optional-only completion granted a receipt/10 XP; new completion on Oct 2 after Oct 3 was accepted. The two new regressions FAIL before the fix; baseline log `/tmp/suchill-pr88-optional-clock-baseline.log`.
- Optional-only catalogs now fail closed with Result `validation` before completion writes. At least one required learning block must exist; video completionPolicy optional alone also does not establish completion authority. Optional action is engagement only. Mixed required + optional catalogs retain normal behavior; author must configure required learning evidence rather than consumer inventing authority.
- New completions cannot predate the latest confirmed local completion day for the same account; Result validation occurs before receipt, operation, reward, progress or streak writes. Same-operation retries retain original outcome/receipt; rejected operation can retry when clock recovers. Other accounts are independent. Summary ignores qualifying days later than its clock day, without removing the confirmed ledger.
- Regression verifies optional-only mixed/VN/quiz, no writes/XP/streak, optional video alone, required+optional success, full store rollback, idempotent retry, account isolation, same-day recovered-clock success and summary not counting future days. Focused completion suite 19/19 PASS.
- Full quality PASS: typecheck/build, 95 unit / 22 component / 7 E2E, scan 338 files / 0 unsafe; diff check PASS. Log `/tmp/suchill-pr88-optional-clock-quality.log` (local only).
- Hưng/Dương re-review these new changes and current CI before acceptance/merge. Hưng CHANGES REQUESTED at 5a771db covered these remaining findings; no acceptance at that head is claimed. Adapter REVIEW, UI M3-06 BLOCKED; no milestone gate, Home, QA83, env/migration/dependency changes.

## Reviewer acceptance (Hưng — optional-only/backwards-day fixes) — 2026-10-02

- Reviewer: Hưng (Member 3); scope: contract/architecture của runtime delta `68580ed` (hai fix + tests). Dương re-review consumer/integrated head vẫn đang chờ.
- Head đã xác nhận: `68580ed` trên `codex/m3-completion-mock` (PR88 OPEN). Baseline `5a771db`: CHANGES REQUESTED do optional-only completion và backwards-day; ghi ACCEPT trước đó là sai lịch sử review.
- Verdict: ACCEPTED cả hai fix, không blocker. Adapter giữ REVIEW đến khi Dương xác nhận và CI xanh.
- Fix 1 (optional-only): gate `.some(required && !(video && optional))` fail-closed bằng `validation` trước mọi write, bao trùm cả lesson rỗng; `completionPolicy` chỉ tồn tại trên `VideoBlock` trong canonical types nên điều kiện là đầy đủ; lịch sử already_completed và mixed required+optional giữ nguyên; operation ID không bị tiêu thụ.
- Fix 2 (backwards-day): watermark ngày theo account trước write, rollback toàn phần (test deep-equal store); retry cùng operation giữ receipt gốc; summary lọc ngày tương lai, không xóa ledger; cùng-ngày và khác account độc lập. Khớp D6 (không suy eligibility từ device clock).
- Tests: 2 regression mới + 1 cập nhật, assertions zero-write/rollback/isolation/recovery đầy đủ. Tự kiểm sensitivity: chạy suite trên source pre-fix `6c5a777` FAIL đúng 3 test, khôi phục fix PASS 19/19.
- Tự verify độc lập trên `68580ed`: typecheck PASS, build PASS (E2E), 95 unit / 22 component / 7 browser E2E PASS, scan 338/0, `git diff --check` sạch. Không đổi UI/Home/QA83/env/migration.
- Next: Dương re-review và CI xanh trên head hiện tại; sau đó Vinh mở/merge PR88 theo handoff. Không quyết gate M3.

## Review-history correction — 2026-10-02
- Vinh/Codex docs claim: this card and its evidence only; correction requested in Hưng screenshot supplied by Vinh.
- `5a771db`: CHANGES REQUESTED, not ACCEPTED; video-range/episode-streak fixes did not resolve the separate optional-only/backwards-day findings.
- `68580ed`: Hưng confirms no new contract/architecture blocker after those remaining fixes; chat verdict and committed reviewer record do not imply a new GitHub approval submission. Dương consumer re-review of current runtime and CI is still required.
- Pulled remote `0580fe1` first; preserved Hưng latest reviewer record and merged QA-002 DONE/main update. No source/test changes; adapter REVIEW and M3-06 BLOCKED.
