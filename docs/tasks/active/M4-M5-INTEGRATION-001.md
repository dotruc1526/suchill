# M4-M5-INTEGRATION-001 — Main-first integration

> Status: REVIEW
> Last updated: 2026-10-02

- Owner: Product Owner (requested)
- Executor: Codex
- Reviewer: QA / Product Owner; approval pending
- Status: REVIEW
- Started: 2026-10-02
- Branch: codex/m4-m5-main-integration
- Depends on: DOC-019 DONE; M3 DONE; M4 OPEN
- Files claimed: this isolated worktree's services/adapters, runtime composition, new roll-forward migration, integration tests and evidence. Main M3 components/contracts remain the baseline. Root workspace changes belong to their existing owners.
- Next action: reconcile backend service contracts with accepted main M3, review the candidate, then run comprehensive verification.

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
