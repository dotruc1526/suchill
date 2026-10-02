# Main ↔ M3–M5 integration audit — 2026-10-02

**Decision: integration is feasible, but a direct merge is not ready.** Latest main and the isolated delivery each have passing local quality evidence after the narrow test-fixture correction below. Their combination has unresolved Git conflicts and incompatible completion/account contracts. No main merge, push, Supabase deployment or milestone opening was performed.

## Audited revisions and live gate

- Repository: [dotruc1526/suchill](https://github.com/dotruc1526/suchill).
- Latest GitHub main: [`5c795b26f2013fded785d84ec24897eed511ccbc`](https://github.com/dotruc1526/suchill/commit/5c795b26f2013fded785d84ec24897eed511ccbc), merge PR103. Fetched from origin; GitHub compare against `main` at closeout returned `identical`, ahead0/behind0.
- Delivery baseline: `codex/m3-m5-complete` at `7e7d03af5442ba841ff9610c3bcfe52c080e8e81`. Common ancestor: `fb02f7d90c1005593bb14afe98619967369aaebb`. Before this audit's documentation/fixture correction:5 delivery-only commits and110 main-only commits.
- [Main task board at the audited revision](https://github.com/dotruc1526/suchill/blob/5c795b26f2013fded785d84ec24897eed511ccbc/docs/project/TASK-BOARD.md): M3-01..07 DONE; M3 milestone OPEN; M4–M7 LOCKED.
- [M3 gate handoff](https://github.com/dotruc1526/suchill/blob/5c795b26f2013fded785d84ec24897eed511ccbc/docs/tasks/evidence/M3-gate-handoff-2026-10-02.md): three mock-scope checks have PASS evidence; PO decision PENDING / UNSIGNED. M3-GATE-01 DONE closes evidence preparation only.
- Prior PO authorization covers implementation through M5 on this isolated branch. It does not replace main's explicit milestone acceptance record.

## Executed checks

Two managed detached worktrees were used. The user's live checkout, its uncommitted UX edits and localhost server were preserved. No private env manifests were copied into either worktree. Baseline quality runs installed each revision's own package-lock with `npm ci`; runtime LFS images were materialized before those builds.

| Checked tree | Result | Evidence |
|---|---|---|
| Exact main `5c795b2` | `npm run quality` PASS: typecheck/build;117 unit,23 component,9 browser tests; scan372 files/0 unsafe | Local `main-install.log`, `main-quality.log` |
| Exact delivery `7e7d03a` before correction | Typecheck/build PASS; quality stopped at source scan because a synthetic test credential matched the secret-key pattern | Local `branch-quality.log` |
| Delivery plus one fixture-string correction | Full quality PASS:176 unit,22 component,51 SQL,19 authoring,9 browser tests;277 PASS total,1 native-only SQL test skipped; scan448/0 unsafe | Local `branch-quality-fixed.log` |
| Unresolved trial merge |24 distinct conflict paths:15 docs,8 runtime/service files,1 browser-test file | [Complete path list](./conflicts.json); local `trial-merge.log` |
| Diagnostic merge, choosing delivery files ONLY for Git conflicts | Typecheck FAIL:48 diagnostics; unit FAIL:193 PASS/26 FAIL out of219; build PASS | Local `trial-typecheck.log`, `trial-unit.log`, `trial-build.log`; [automatic contract merge](./automatic-contract-merge.txt) |

The diagnostic conflict choices are deliberately incomplete and are not a proposed resolution. They show that selecting one side of the visible conflict markers does not restore compatibility. The final diagnostic was repeated using the delivery's own installed lockfile, with the fixture correction; main-only nonconflicting files and automatic merges remained present. An earlier exploratory run used shared local dependencies and is not the dependency basis for the final counts.

Build transpilation alone did not detect the contract failures. Git also reported `src/services/next/contracts.ts` as automatically merged although it contained duplicate imports/exports and two `completion` properties. The scoped source scan and typecheck are required in integration CI.

## Findings and required treatment

| Finding | Executable/source evidence | Required integration treatment |
|---|---|---|
| **P1: completion API and receipt incompatible** | Main uses `recordBlockAction`, `getLessonCompletion`, `CompletionOutcome.kind` and a version/account/time-bound receipt. Delivery uses `completeBlock`, `completeDailyReview` and a flat confirmed receipt. Trial tests fail with `services.completion.recordBlockAction is not a function`; TS reports duplicate CompletionService/receipt exports and missing methods | Reconcile against accepted main D1–D7 contract, extend it for daily review, then update mock/Supabase/offline adapters and consumers together. Never fill confirmed receipt fields with invented client values |
| **P1: account summary contract incompatible** | Main `users.getAccountSummary()` includes locale, requiredLessonCount and structured achievements; delivery `account.getSummary()` exposes completedLessons/string achievement IDs. TS reports missing read methods and incompatible summary shapes | Add an explicit domain projection/bridge and preserve unauthorized/error/empty vs authenticated-zero distinctions, account-scoped reads and session-switch invalidation |
| **P1: composition and journey overlap** | Conflicts in App, LearningJourney, JourneyLessonEntry and IntegratedLessonRenderer. Main ProfileScreen/controller depends on CompletionSession; delivery App uses useLearningAccount/AccountProfile. Main mock playback additions refer to a completion store absent from delivery's chosen MockProgressStore | Preserve reviewed M3 UX/focus/tab behavior while wiring real Auth/account scope and trusted backend semantics. Choose one consistent store/controller composition and adapt VN/video/quiz consumers to trusted feedback. Retain both heads' meaningful regressions |
| **P1: documents would overwrite current review decisions** | Conflict paths include content artifacts and cards. Delivery has CONTENT-014/DOC-017 DONE while latest main keeps them REVIEW and preserves newer exact-artifact QA/media/handoff records | Use current main content/review records as the reconciliation base. Preserve isolated implementation evidence as branch-specific history. Do not replace historical/media/PO acceptance with technical branch completion |
| **P2: committed delivery quality blocked by a test fixture** | The fake server credential in username-server.test.ts matched the tracked-file secret scan. The earlier precommit scan did not inspect this then-untracked test via `git ls-files` | Changed only the synthetic credential string to a non-key-shaped fixture. Security assertions and scanner stayed intact; full clean-checkout quality now passes. This correction is included in the working delivery branch |

An additional SSR probe mounted main's ProfileScreen without its required CompletionSession and reproduced `CompletionSession missing`. This demonstrates the composition requirement; it is **not** evidence that the diagnostic delivery App's currently selected AccountProfile tab crashes. The actual login accepted by the user remains working.

## Supabase and environment impact

- Main contains no Supabase migration implementation; all28 delivery migrations are additions, so no SQL-file Git conflict was reported. This does not certify adapter compatibility: the existing `private.completion_receipt` returns delivery's flat DTO and the adapter lacks main's completion-read/action/account-summary methods.
- The development project already has migrations001–028 applied. Integration must preserve those files and history. Any receipt/read projection or command change needs a new roll-forward migration; do not edit/reapply applied SQL, reset the hosted database or recreate the retained user.
- Main runs technical mocks. Delivery selects Supabase only from public Vite URL/publishable-key variables and otherwise selects mock adapters. Integration must keep this selection explicit and keep privileged credentials in trusted backend only.
- Native multi-session and real hosted RLS/Auth/Storage matrices were verified in previous delivery evidence. They were not rerun against an integrated candidate here, because no valid integrated candidate exists yet. The SQL51 PASS run is local PGlite coverage; its native-only test remained skipped.
- Optional recovery sender/configuration and exact recovery redirect allowlist remain separate AUTH-USERNAME-001 acceptance work. Successful basic login does not close that full feature.
- Existing bundle-size/native-config warnings persist in standalone checks; no PWA/device/performance or canonical-media release certification is added by this audit.

## Concrete integration route

1. Record the PO's explicit M3 close/open-M4 decision against the current main gate evidence.
2. Start an integration branch from latest main. Claim shared contracts, composition, mocks, adapters and new migrations with one owner per hotspot. Preserve main M3 task acceptance and newer content records.
3. Reconcile completion/account/feedback contracts before wiring the delivery backend; add server-projected receipt reads/outcomes where needed using a new migration. Preserve reward idempotency and original-account preconditions.
4. Extract M4 foundation/integration and M5 progress/reward/offline changes by file/task into reviewable commits/PRs. The first delivery commit contains both milestones, so a blind cherry-pick is not a safe milestone split. A combined integration branch can be prepared, but M4 and M5 acceptance should be recorded separately.
5. Run typecheck/build/secret scan and both meaningful M3 and M4–M5 regressions, then native/hosted adapter, account-isolation and reward race checks against the resolved candidate. Review migrations/env and content-document reconciliation before merging to main.

Until those steps produce a passing, reviewed integration candidate, **do not merge the existing delivery branch directly into main**. This audit is REVIEW for the user's integration decision; it opens no milestone.

## Handoff

- Changed live-workspace files: this report and audit artifacts/card, own board/index entries; one synthetic username-server test credential; AUTH-LOGIN-001 moved to done after the user's explicit successful-login confirmation.
- A concurrent decision-review document copied the same synthetic credential literal. It was replaced with a description while preserving that review's findings; final live-workspace source/bundle scan469/0 unsafe. Concurrent review entries are preserved separately.
- Runtime/auth/database source and hosted configuration were not changed in this audit. Existing uncommitted App/navigation/Button/AI/CSS/token/UI-tooling work remains separate and was excluded from committed-tree compatibility checks.
- Full verbose logs are local ignored `.log` files beside this report; portable findings, conflict paths and the automatically merged contract are saved as tracked documentation artifacts. Trial worktrees are cleaned up after evidence capture.
