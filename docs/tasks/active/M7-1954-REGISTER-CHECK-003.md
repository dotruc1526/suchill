# M7-1954-REGISTER-CHECK-003 — Read-only preparation validator

- Owner / Executor: Codex integration, authorized by Dương 2026-10-03.
- Reviewer: independent software reviewer pending; historical reviewers remain separate.
- Status: REVIEW
- Started: 2026-10-03, Asia/Saigon.
- Depends on: M7 OPEN, M7-01 DONE, M7-02-CHAPTER-001 preparation DONE; Phase 3 APPROVED. Parent historical gate remains REVIEW.
- Branch / base: codex/pr109-register-validator / PR109 3e14b772431164ecda54cd3c7c09de6232d02fe8.
- Files claimed: NEW scripts/content/chapter1954-register/validate.mjs, validate.test.mjs, README.md; this NEW card; NEW docs/tasks/evidence/M7-1954-register-check-2026-10-03.md.
- Acceptance: reject duplicate/dangling/asymmetric source/claim/episode mappings and malformed required data; fail closed for unreviewed canonical use; default register check PASS; mutation and CLI failure tests; no register/runtime/package/CI changes.
- Next action: implement and test; monitor PR109 head/overlap during work and before handoff. Board/index integration remains with integration owner to avoid shared-file claim; this card records the bounded claim and handoff.

READY → IN PROGRESS after checking dependencies and unique file names. Tool targets research-preparation-v1 only; future approved register schema requires its own reviewed contract. A structural PASS does not verify historical truth, source availability or publishing rights.

## Handoff

Validator and 31 dedicated tests PASS; registers unchanged. Five new files only. [Evidence](../evidence/M7-1954-register-check-2026-10-03.md) / [usage](../../../scripts/content/chapter1954-register/README.md). No env/migration/runtime impact. Known limitation: preparation-v1 only and manual invocation; canonical historical approval is separate. Next action: independent software reviewer checks acceptance, integration owner handles shared board/index or future Quality wiring. No self-DONE.
