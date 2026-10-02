# MAIN-INTEGRATION-AUDIT-002 — Audit latest main against M3–M5 delivery

> Status: REVIEW
> Started / last updated: 2026-10-02

- Owner / Executor: Codex root, requested by the user after successful login.
- Reviewer: user / Product Owner for integration decision; technical evidence prepared by Codex.
- Branch: `codex/m3-m5-complete`, committed baseline `7e7d03a`.
- Dependencies: latest GitHub main fetched (`5c795b2`); M3 task-level closeout available; existing isolated M4–M5 implementation authorization.
- Ready check: READY → IN PROGRESS for read-only comparison and isolated trial; no milestone opening required.
- Files claimed: this card, own task-board row, `docs/engineering/main-integration-20261002/`, isolated disposable audit checkout. Narrow additional claim: the synthetic credential in `tests/member5/username-server.test.ts`, which blocks the committed branch's secret scan. Existing uncommitted UX work is excluded.
- Next action: user/PO reviews the integration report; prepare a main-based integration task after contract ownership and milestone decisions are recorded. Direct merge is not ready.

## Acceptance

- [x] Verify exact live main revision and M3/M4 gate state from current GitHub documents.
- [x] Trial integration preserves current checkout and records every conflict.
- [x] Distinguish Git conflicts from service/behavior incompatibilities with executable evidence.
- [x] Record test results, migration/env effects, uncommitted-work boundary and a concrete integration recommendation.
- [x] No main merge, push, deployment, account/password change or gate closure occurs during this audit.

## Context

User explicitly confirmed successful local login on 2026-10-02. Basic access is now user-verified; optional recovery delivery and final username feature acceptance remain separate. This audit concerns compatibility of committed branches, not a production release.

## Evidence and handoff

[Integration report](../../engineering/main-integration-20261002/REPORT.md), including exact revisions, all24 conflict paths, contract incompatibilities and migration/merge sequencing. Main full quality149 PASS; delivery after one synthetic test-fixture correction full quality277 PASS/1 native-only SKIP. Diagnostic merge still has48 type errors and26/219 failed unit tests; its passing build does not certify runtime compatibility.

Additional own documentation claims: login card/index/board closeout after explicit user acceptance; no other authentication acceptance is inferred. One synthetic credential literal in the concurrent decision-review document was replaced with its description so the source scanner still passes; its findings were preserved. Existing uncommitted UX hotspots were preserved and excluded from the trial.
