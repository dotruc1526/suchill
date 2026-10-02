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