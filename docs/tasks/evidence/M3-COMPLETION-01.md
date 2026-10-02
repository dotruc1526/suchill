# M3-COMPLETION-01 — Adapter evidence / consumer handoff

Date: 2026-10-02. Status: REVIEW, implementation acceptance pending Hưng/Dương.
Original base: `260d2d0`; current rebase base: `origin/main` `74c8059`; approved preparation/agreement source: [PR84](https://github.com/dotruc1526/suchill/pull/84), head `5144fa2dd57d2cc785e5f132fa3b78c923c05da0`. That card records text approvals; do not represent them as GitHub review submissions. PR84 was OPEN at the original implementation read and is now merged into current main; preparation approval is not adapter implementation acceptance.

## Implemented

- D1: `LearningServices.completion`, `users.getAccountSummary`; existing ProgressService methods and ServiceErrorCode preserved. Account-summary stub added to FE-011 test only.
- D2: completed/already_completed receipt vs ineligible block reasons; transport failures remain Result errors. Receipt includes account/lesson/content version/time/method/reason/rewards. Empty rewards means no XP reward; fresh replay returns already_granted deltas of zero; retry of the SAME operation returns its original outcome/receipt.
- D3: account summary derived from confirmed store ledger, required lesson identities and qualifying days; includes locale, timezone, stable achievement shape (empty in M3). An authenticated new mock account can legitimately have zero XP; unauthorized/errors are never transformed into that account. Nullable account result supports empty consumers.
- D4: text/recap explicit action plus published document; VN end and actual recorded choices along the selected path (including retry-until-correct); video unique ranges, reach_end near-end played range, optional policy and approved transcript fallback linked to required recap/check; quiz trusted stored grading receipt, practice complete answers vs scored pass. Bare completedBlockIds do not grant completion.
- D5: operation payload conflicts and eligibility ledger dedupe; synchronous transaction in mock, no await between checking and writing. Shared injected progress store includes completion/evidence/quiz maps and survives adapter recreation. Minor content version with same eligibility requires new evidence without new XP/streak.
- D6: injected adapter clock + account IANA timezone. Consecutive days, same day, gaps and expired current streak covered. Date/timezone validation occurs before transaction writes.
- D7: all keys scoped to session account. Fresh store resets state; shared store models in-memory reload only. No backend/cross-device/disk persistence guarantee.

## Consumer contract

- Create adapter with `createMockLearningServices(catalog, session, clock, sharedProgressStore)`. Retain that store across recreated adapters; never import/write the maps from React.
- Catalog needs author-controlled `completionPolicies`: lessonId, contentVersionId, eligibilityVersion, requiredLesson. Missing/blank/ambiguous metadata fails closed. Lesson domain has no version field yet; this mock metadata does not migrate/change the canonical schema.
- `rewardedAssessmentIds` explicitly lists chapter/final assessments eligible for quiz/bonus XP. Ordinary checks are not automatically reward activities. Episode reward identity uses stable story ID + author-controlled eligibility version, distinct from content/story version.
- `videoFallbacks` is author-controlled `{ blockId, checkBlockId }`, linking published transcript to a required recap or quiz. No caller-controlled approval flag.
- New `completion.recordBlockAction({ lessonId, blockId, operationId, action })` is the explicit text/recap/fallback acknowledgement needed by D4. It records engagement only, does not grant completion/reward; Hưng/Dương must review this API addition alongside the two approved completion operations. Caller cannot acknowledge VN/quiz as complete.
- Existing playback/quiz writes record version-bound evidence automatically when catalog metadata exists. No UI change in this branch; Dương wires the explicit action and completion/profile consumer after review.
- `completeLesson({ lessonId, operationId })` accepts no XP/streak/passed/userId/eligibility fields. Keep operation ID/payload on offline retry. Ineligible result does not spend the operation ID, so later valid evidence can retry.
- `getLessonCompletion(lessonId)` restores confirmed receipt; null means not completed in current content version. Read error is distinct.
- Retry `getAccountSummary` on summary read failure; retain receipt, never resubmit completion just to reload summary. UI must not add receipt XP optimistically, including on same-operation replay.
- Home/journey fixture remains unchanged. Dương configures technical catalog completion metadata under the later UI claim; this adapter fails closed until metadata exists. No canonical content or real rewards introduced.

## Checks

- Latest full `npm run quality` after rebase: typecheck/build PASS, unit **91/91**, component **22/22**, E2E **4/4**, scan **334 files / 0 unsafe**. Original pre-rebase scan: 332/0.
- New focused regression suite **15/15**: checkpoint-only denial; explicit acknowledgement; race/retry/fresh replay/recreation; copies; account isolation; minor versions; timezone/date boundaries/rollback; video overlap/seek/reach_end/optional/fallback; VN jump/end/required attempt; scored/practice receipts; mixed block completion.
- Latest log: `/tmp/suchill-m3-completion-rebase-quality.log` (local diagnostic, not committed); original log `/tmp/suchill-m3-completion-quality.log`.
- The current main has 4 E2E tests. QA-002 PR83's additional two tests are on its separate branch; this result does not claim its 6-test integration.

## Limits / next action

- Browser mocks accept recorded playback/checkpoint events; they are not tamper-proof server evidence. Production authority, RLS and transaction persistence remain later gated backend work.
- No completion/profile browser UI exists in this deliverable; those controller/component/end-to-end cases belong to Dương M3-06 and Vinh M3-07 after acceptance.
- No package/lockfile, env, migration, App/UI, historical content or milestone gate changes.
- Hưng reviews placement, reward/evidence policy and new explicit-action API; Dương confirms consumer fit. Keep this task REVIEW and UI M3-06 BLOCKED until adapter accepted. No self-acceptance or M4 opening.

## Handoff refresh on current main
- Rebase base `74c8059`, retaining FE-011 greeting, Home dashboard and merged M3-06 agreement; board conflict kept both task rows.
- Home source/fixture untouched. FE-011 test change is only a typed UserService stub needed by the new method.
- QA83 remains its own branch/PR; no E2E harness change here. The loading race reported on PR83 must be addressed separately by QA-002's owner scope.
- Post-rebase quality PASS: 91 unit, 22 component, 4 E2E; scan 334/0 unsafe, diff check PASS. No source changes in Home or QA83 files.

## Independent Dương consumer verification — 2026-10-02

- Exact head 13c4d80: CONSUMER FIT ACCEPTED; full Quality independently PASS, 91 unit / 22 component / 4 E2E, scan 334/0 unsafe. See [review record](../active/M3-COMPLETION-01.md).
- Hưng implementation review remains pending; adapter REVIEW / UI BLOCKED. No runtime changes from this review.

## PR88 two-finding remediation — 2026-10-02
- `reach_end` uses the same normalized/merged adjacent and overlapping ranges as watch-threshold counting. Gaps are not bridged; seek-only and near-end-only evidence remain insufficient.
- Streak qualification uses account + activity type/ID + eligibility version, independently of requiredLessonCount. Required episode/scored reward activities qualify even when the containing lesson is not counted as required; requiredLessonCount still only counts required lessons. Same eligibility across content corrections or lesson reuse cannot qualify another day.
- Regression checks adjacent/overlapping/reordered/gapped ranges, non-required VN lesson first completion, replay/minor version/cross-lesson story reuse and account isolation. Both new tests FAIL on the previous runtime (ineligible instead of completed; streak 0 instead of 1), PASS after restoration of the fix. Diagnostic changes were restored.
- Full `npm run quality` PASS: typecheck/build, 93 unit / 22 component / 4 E2E, scan 334 files / 0 unsafe; focused completion 17/17; diff check PASS. Logs: `/tmp/suchill-pr88-remediation-quality.log`, `/tmp/suchill-pr88-remediation-baseline.log` (local only).
- No Home, QA83 harness, UI, dependency, env or migration changes. Prior Dương consumer acceptance applies to dcc3079; Hưng and Dương must re-review this runtime delta. Task remains REVIEW; M3-06 UI stays BLOCKED pending acceptance; milestone gates unchanged.

## Integrated-main verification — 2026-10-02
- Merged main `cda4a69` (PR83) into adapter `5a771db`; the only conflict was active index `docs/tasks/active/README.md`. Retained adapter entry and all current-main task entries.
- Home/global CSS, shared Button and all `tests/qa` browser/fixture files exactly match main. Completion runtime and regression test changes remain exactly as Hưng reviewed at `5a771db`; no runtime delta from integration.
- Full quality on integrated tree PASS: typecheck/build, 93 unit / 22 component / 7 E2E; client scan 338 files / 0 unsafe; diff check PASS. This now includes PR83 delayed 12-second navigation/reload, personalized Home, keyboard/focus/44px and player retry regressions. Log `/tmp/suchill-pr88-integration-quality.log` (local only).
- Hưng's user-provided re-review ACCEPTED contract/architecture at `5a771db`; not represented as a new GitHub approval. Dương still confirms episode-streak/range remediation and final integrated head; both reviewers check current CI before merge. Task REVIEW, M3-06 UI BLOCKED and milestone gates unchanged.
- Files changed by integration: main imports plus active index resolution; this card/evidence and adapter board row for latest handoff. No additional runtime, dependency/env/migration changes. `.DS_Store` untouched.
