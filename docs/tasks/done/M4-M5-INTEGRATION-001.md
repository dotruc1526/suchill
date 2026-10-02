# M4-M5-INTEGRATION-001 — Main-first integration

> Status: DONE
> Last updated: 2026-10-03

- Owner: Product Owner (requested)
- Executor: Codex
- Reviewer: Independent Codex technical re-review APPROVED; Product Owner Dương accepted M4/M5 via DOC-020/DOC-021
- Status: DONE
- Started: 2026-10-02
- Branch: codex/m4-m5-main-integration
- Depends on: DOC-019 DONE; M3 DONE; DOC-020/DOC-021 APPROVED; M4/M5 CLOSED
- Files claimed: this isolated worktree's services/adapters, runtime composition, new roll-forward migration, integration tests and evidence. Main M3 components/contracts remain the baseline. Root workspace changes belong to their existing owners.
- Next action: push final evidence to PR106 and verify current-head CI/mergeability; after reviewed merge re-review main, then obtain PO M4 acceptance/open M5 and separate M5 acceptance.

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

## PR106 merge-readiness continuation — 2026-10-02

User requested continuation so PR106 can be merged. Main remainsc7a5ad5; candidate5640f29 has2/2 Quality SUCCESS and mergeability clean; no GitHub change-request review/comments are present. Claim: this card, integration board row, docs/engineering/main-first-integration/MERGE-READINESS.md and PR-BODY.md, docs/tasks/active/AUTH-USERNAME-001.md and docs/engineering/auth-username/EVIDENCE.md handoff only, isolated ignored QA scripts/logs and root output/main-first-integration status/proofs. Executor Codex; existing independent technical review APPROVED, human milestone acceptance separate. Next action: verify actual username signup/login/reload/signout UI on a permitted local origin with a disposable account; record missing optional recovery sender/config as an acceptance limit; recheck current-head CI and switch PR from Draft to Ready for review. This prepares code review/merge without closing M4, opening M5 or publishing/deploying content. No new milestone task implementation is claimed.

Additional evidence files claimed: docs/engineering/main-first-integration/username-browser.txt and REPORT.md checkpoint/handoff only. No runtime or applied migration edit.

Core username configured Chrome UI PASS; exact synthetic cleanup PASS. Optional recovery remains pending; AUTH card stays REVIEW. Runtime unchanged, evidence/docs updated. Next action: commit/push evidence, verify current-head CI and convert PR106 to Ready for review, without main merge or milestone closure.

## Full M4/M5 integration acceptance audit — 2026-10-02

User requested recheck/completion through M5 and merge readiness. Independent read-only reviewers: pr106_m4_acceptance, pr106_m5_acceptance, pr106_auth_recovery_review; exact baselinea21be26. Claim root: integration acceptance report/review/evidence, this card and integration board checkpoint; M4 cards status/paths only after independent acceptance; M5 cards evidence only while gate locked. Finding triage adds claims for mainServices.ts, canonical/offline queue integration, completion controller and video checkpoint helpers/tests, analytics roll-forward migration030 only if isolated reproduction proves necessary. Applied001–029 are immutable. Corrections are integration defects in preexisting authorized delivery, not a new claim of blocked M5 tasks or content publication. Preserve root contributor changes and retained account. Next action: reproduce/fix findings, independent re-review, relevant native/hosted/Quality validation, per-card acceptance table and explicit remaining PO gates. Optional recovery sender remains a separate AUTH addon acceptance.

## Independent M4 task closure claim — 2026-10-02

- Executor / reviewer: Codex pr106_m4_acceptance, independent technical review under the user's explicit authorization to review, repair, re-review and mark acceptance-complete tasks DONE. No named human review or PO milestone approval is inferred.
- Scope / files claimed: docs/tasks/active/M4-01..08.md moved to docs/tasks/done/ with main-based acceptance checkpoints; docs/project/TASK-BOARD.md M4 candidate rows and links; relative documentation links affected by those moves. Root owns the final acceptance report and other runtime/evidence changes.
- Status: IN PROGRESS for this documentation checkpoint; integration task remains REVIEW. M4 remains OPEN and M5 remains LOCKED/BLOCKED.
- Verified basis: current main-based M4 technical review APPROVED; independent59/59 service/Auth/config/session checks,32 SQL PASS plus one native-only skip;522 source/tracked/bundle files with0 unsafe matches. Native030 full72/72 and real Chrome video initialization/retry/context PASS were supplied by root. Final Quality and hosted030 execution are still in progress and are not claimed complete here.
- Next action: record per-card technical approval/evidence and handoff, migrate card links, run documentation validator and diff check. Finalexact counts will be recorded by root in docs/engineering/main-first-integration/FINAL-ACCEPTANCE.md.

## Final preservation repair claim — 2026-10-02

Root claims src/services/next/mockCompletion.ts and tests/member5/m3-completion.test.ts for the independently reproduced offline mock regression after canonical queue correction. Original M3 E2E requires pending intent/no confirmed XP when offline. Preserve all original assertions; enforce offline at the mock service boundary while hosted intent still reaches its durable queue. Reviewer finding: pr106_m5_acceptance; independent re-review requested after repair.

## Verified integration checkpoint and refreshed main claim — 2026-10-02

Full native through03072/72 PASS; exact030 payload applied to development target; real hosted030+canonical9/9 PASS and all exact owned fixtures cleaned. Actual Chrome video initialization/retry/stale account guards PASS. Independent M4 review moved8 cards toDONE and board/card/link validation passes. Agent docs claim was interrupted after factual card/board updates; root retains prior independent acceptance verdict and completes the handoff. Final Quality found offline mock regression; service-boundary guard and26 focused regression tests nowPASS; Quality rerun and independent review remain required.

Remote main advanced to2ee9c51 (content PR65/107/108); no runtime changes,19 content/docs paths. Root claims merge refresh into this integration branch, retains main historical/PO/architecture decisions, no publishing or direct main write. git merge-tree predicts clean merge. Next action: commit reviewed corrections, merge currentmain into candidate, run final Quality plus accepted new content validators, review fresh status/CI and complete acceptance report. M4 milestone remainsOPEN; M5LOCKED/BLOCKED.

Documentation preservation claim: refreshed main leaves docs/content/LESSON-03-1972-STANDARD.md linking ../tasks/active/CONTENT-018.md after its accepted card moved to done. Root fixes only that local card path to ../tasks/done/CONTENT-018.md. No authored historical/media/assessment content or review hash meaning is changed. All other accepted main content remains byte-identical.

Hash preservation correction: no authored lesson bytes will change. The proposed one-link edit was reverted after verifying hash-bound human approvals. Root claims only docs/tasks/active/CONTENT-018.md as a compatibility redirect to the canonical done card; it has no task status or duplicate claim. All imported main content and review artifacts remain byte-identical.

## Final current verification and handoff — 2026-10-02

Main2ee9c51 merged cleanly; runtime0c9f0d8 finalQuality330PASS(230unit/29component/62SQL/9originalM3Chrome),3native-onlyskipscoveredbynative72/72, hosted9/9, actualChromevideo3assertionsPASS. Independent finalAuthreview71PASS/APPROVE closes mockoffline andasset/queueguard findings; M4technicalcardsDONE, M5per-cardtechnicalAPPROVEevidencerecordedbutformalBLOCKEDunchanged. Exactmaincontent/reviewbytespreservedviaold-cardlinkredirect.030appliedtodevelopment;001–029unchanged. Docs/link/status andsecret scanpass. Noaccountreset/mainmerge/productionrelease. [Finalacceptance](../../engineering/main-first-integration/FINAL-ACCEPTANCE.md) supersedesoldercounts/pendingnotes. Nextaction:commit/pushfinaldocs,checkcurrentheadCI/mergeability,reviewmainaftermergebeforeseparatemilestoneacceptance.

## Superseding PO acceptance / status synchronization — 2026-10-03

PR106 merged; independent merged-main reviewQuality330/hosted9PASS and reused unchangednative72 accepted. MainPR110 records Product Owner Dương closure of M4/M5 and opening of M6 in [DOC-020](./DOC-020.md)/[DOC-021](./DOC-021.md). These actual APPROVED decisions resolve prior pending milestone acceptance and supersede old gate snapshots. Main board already saysDONE; root synchronizes this card and path, preserving history. DONE applies to prior M4/M5 integration only, not Auth recovery addon or new M6/M7. Next action: review current M6 separately under its own cards and gate.
