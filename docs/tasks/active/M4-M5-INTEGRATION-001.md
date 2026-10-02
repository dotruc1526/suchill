# M4-M5-INTEGRATION-001 — Main-first integration

> Status: REVIEW
> Last updated: 2026-10-02

- Owner: Product Owner (requested)
- Executor: Codex
- Reviewer: Codex independent technical re-review APPROVED; named QA / Product Owner acceptance pending
- Status: REVIEW
- Started: 2026-10-02
- Branch: codex/m4-m5-main-integration
- Depends on: DOC-019 DONE; M3 DONE; M4 OPEN
- Files claimed: this isolated worktree's services/adapters, runtime composition, new roll-forward migration, integration tests and evidence. Main M3 components/contracts remain the baseline. Root workspace changes belong to their existing owners.
- Next action: update PR106 with final hosted verification, obtain named QA/PO acceptance for M4, then explicitly open and separately accept M5.

## Scope and gates

User authorized integrating the isolated M4/M5 work onto current main, prioritizing accepted main M3 on conflicts. M5 code is preparatory reuse only until M4 acceptance and explicit M5 gate approval; this task does not open M5, approve other tasks, publish content, or deploy production.

## Acceptance

- Preserve main M3 accepted navigation, completion contracts and tests.
- Integrate backend/auth without exposing answer keys or privileged credentials.
- Applied migrations 001–028 stay immutable; any database change rolls forward.
- Review candidate and repair findings before comprehensive verification.
- Record typecheck/build/test, account isolation, idempotency and environment impact.
- Present M4 and M5 separately for acceptance; do not infer reviewer approval.

## Checkpoint

Current GitHub main: c7a5ad5968b95b8d3dc41cab1dfd4dfd48830f88 (DOC-019). Source delivery: 61ace4d. Fresh managed worktree and integration branch created. No production database changes.

## Review-before-verification checkpoint

Main M3 restored; explicit backend contract/facade and new029 prepared. Typecheck PASS. Executor review findings repaired; see [review record](../../engineering/main-first-integration/REVIEW.md). Comprehensive verification starts after this checkpoint. Hosted029 and independent QA/PO approval remain pending.

## Verification and handoff

303 quality tests passed; PostgreSQL17 full63 and final canonical/race5 passed; scan512/0 unsafe; docs91 cards/688 links passed. [Report](../../engineering/main-first-integration/REPORT.md). Hosted029 blocked by automatic approval review pending specific payload approval. Main integration is REVIEW, not DONE; M4/M5 gates require separate QA/PO acceptance. Root workspace changes untouched.

## Hosted verification checkpoint — 2026-10-02

User explicitly approved applying the exact prepared migration029 transaction/history payload to suchill-test (kyfqlhpweetsridmqkvl). SHA256: f508b20637514afb6246541737adb75f9269596b67ddb4b2df02a413ac496c42. No account reset/deletion is included. Executor: Codex; independent technical reviewer: Codex integration_review agent; human QA/PO acceptance remains pending. Files additionally claimed: supabase/hosted-tests/main-contract.test.mjs and this task's integration evidence. Next action: apply029, verify retained account and hosted canonical facade/account isolation/idempotency, review findings and update PR106 evidence. Task stays REVIEW during verification; no M5 gate change.


Hosted execution was stopped before any SQL by automatic approval review: Run without RLS was rejected. Unapplied029 now explicitly enables RLS on the private receipt table with no client policies, in addition to revoked grants. No applied migration changed. Rebuilt exact transaction/history payload SHA256: ef7667ef0fd1df946ed3371605e130325cdabf37a19156d83edaa7df60ea38af. Re-review and database regression verification required before applying.

Independent review found hosted composition gaps: fixture Home activity, unused reduced-motion preference, hidden queue rejection recovery, and missing explicit video fallback completion UI. Additional files claimed by root: src/App.tsx, src/app/HostedApp.tsx, src/app/HostedSyncStatus.tsx, src/features/learning/journey/LearningJourney.tsx, src/index.css, related integration regressions. Delegated fallback executor claims only src/features/learning/journey/IntegratedLessonRenderer.tsx, new src/features/learning/completion/VideoFallbackControl.tsx and tests/member5/video-fallback-control.test.ts. Reviewer: independent integration_review agent; re-review after repairs is required. Main mock behavior remains the baseline.029 is still unapplied; also repair optional-block fallback receipt method mismatch before hosted execution.


029 applied successfully on suchill-test after RLS hardening and required-block metadata repair, before initial hosted execution. Exact final transaction/history SHA2566b7dfa8e5af99e2b6f1f34e3c10df7adb5448de746140c20fc78030b5b804054 passed isolated full-payload validation. Hosted canonical facade5 PASS, disposable A/B cleanup passed; retained account readonly sign-in and10XP/1completed lesson unchanged. Additional regression files claimed: tests/member5/hosted-composition.test.ts and supplemental main-contract SQL test. UI verification continues.029 is now immutable.

Additional UI claim: JourneyHome.tsx; hide unavailable minute goal in hosted summary (goalMinutes0) instead of announcing a fabricated completed goal. Existing mock goal10 remains unchanged.

Fallback delegate was interrupted before final typecheck; root resumes its claimed files. Additional shared operation claim: completionOperation.ts, explicit string operationId annotation compatible with existing contracts. Re-review and full Quality required.

QA found the isolated fixture runner exported SUCHILL_QA_BUILD_DIR but accepted main E2E preview ignored it, reading hosted dist once ignored.env was configured. Claim tests/qa/e2e.test.mjs for build directory wiring only; original M3 test assertions remain unchanged.

Hosted UI found canonical action leaking into offline queue DTO: mainServices.recordBlockAction spread action field, queue rejects unknown keys. Claim src/services/mainServices.ts and regression tests/member5/main-offline-integration.test.ts; map explicit backend fields and verify runtime wrapper composition. No029 change.

## Final evidence and documentation claim — 2026-10-02

Claim: docs/project/TASK-BOARD.md integration checkpoint only; docs/tasks/active/M4-01..08.md and docs/tasks/blocked/M5-01..07.md integration handoff notes only; docs/engineering/main-first-integration/{REPORT.md,REVIEW.md,PR-BODY.md,quality-hosted-final.txt,native-main-029.txt,hosted-main.txt,hosted-browser.txt,migration-payload-validation.txt}. Root output/main-first-integration/STATUS.md is the local handoff. Preserve all milestone gates and prior evidence; no other contributor's root files are changed. Next action: document final PASS and independent technical approval, commit/push PR106, verify current-head CI. Human QA/PO acceptance is separate.
## Final technical verification and re-review — 2026-10-02

Independent read-only Codex re-review: APPROVED repaired integration; no actionable technical blockers. Quality314 PASS; native0296/6; real hosted canonical5/5; configured hosted Chrome UI login375/430/text/reload/fallback/motion/rejected queue recovery PASS. Retained account sign-in and10XP/one completed technical lesson checked read-only, unchanged. Disposable users cleaned up. Applied029 is immutable;001–028 unchanged. Temporary test servers stopped; root/user localhost8443 unchanged. [Final report](../../engineering/main-first-integration/REPORT.md) and [review](../../engineering/main-first-integration/REVIEW.md) supersede older pending verification checkpoints. Task remains REVIEW for named QA/PO main acceptance; M5 gate remains locked. Next action: commit/push final evidence to PR106, check current-head GitHub Quality, obtain separate M4 acceptance before opening/accepting M5.
