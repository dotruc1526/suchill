# QA-REVIEW-ALL-001 — Review and repair all 27 REVIEW tasks

> Status: DONE
> Started / last updated: 2026-10-02

## Assignment and authorization

- Owner / Executor: Codex integration owner and delegated specialists.
- Reviewer: independent Codex application, database/security and authoring reviewers; root cross-reviews repairs.
- Authorization: user explicitly requested review of every REVIEW task, repair and re-review until stable/safe, then DONE when acceptance is met (2026-10-02).
- Branch: codex/m3-m5-complete. No milestone opening, content publication or hosted migration is inferred.
- Dependencies: existing task cards and approved specs; M3–M5 implementation authorization and content draft scopes remain applicable.

## Scope and claims

Inventory: M3-06/07, M3-UX-02, M4-01..08, M5-01..07, M3-M5-DELIVERY, DOC-017, CONTENT-003/004/010/011/012/014/017 (27 cards).

| Executor | Files claimed | Next action |
|---|---|---|
| Root | src/app/, App.tsx, package.json/package-lock.json, docs task cards/board/index/evidence | Account lifecycle regressions; native test runtime; evidence and accurate closure |
| Application reviewer | src/services/offline/, src/services/supabase/, feature code and focused member5 tests | Fix queue ordering/payload retries and initiating-account read isolation; re-review UI |
| Database reviewer | supabase migrations/tests/setup docs except adapter.integration.test.mjs | Roll-forward SQL repairs, native independent-session adversarial matrix |
| Content reviewer | historical source registry/report; authoring validators/shared helper/mutation tests | Remove contradictory stale registry, detect duplicate IDs and invalid graphs; draft acceptance audit |

Existing untracked user output/worktree/media files are preserved. Native binaries/data use a new dedicated output/review-native-pg directory only.

## Acceptance

- [x] Every initial REVIEW card assessed against its own acceptance; per-task results and evidence recorded.
- [x] Findings repaired within authorized scope, focused regression tests pass and independent review repeated.
- [x] Typecheck/build/related unit/component/SQL/browser/authoring checks pass on final changes.
- [x] Native PostgreSQL 17 genuine overlapping-session verification completed and evidence recorded.
- [x] Only acceptance-complete cards moved to DONE; remaining external prerequisites explicitly recorded.
- [x] Card/board/index links and status agree, diff check and handoff complete.

## Checkpoints

| Date | Result | Next action |
|---|---|---|
| 2026-10-02 | 27 REVIEW cards inventoried; independent parallel review. Confirmed queue ordering/retry identity, account-read binding and duplicate historical registry findings | Repair and regress; evaluate every acceptance checklist |

## Environment and handoff

Hosted Supabase Auth/email/browser/REST/Storage evidence now passes on the fresh development target. Revocation of an unidentified old exposed credential is unproved and remains a separate production follow-up. Historical approval does not establish media rights; missing licenses cannot be fabricated. Existing named human approvals are preserved with their exact reviewed scope/head. User delegation allows actual Codex review acceptance to be recorded under Codex's name.

Review accepted by Codex specialist peers and root cross-review. [Final evidence and all 27 task decisions](../../engineering/review-all/EVIDENCE.md): 22 DONE,5 content REVIEW after hosted follow-up; Quality238 PASS, native-mode50 PASS, hosted transport12/12 and Auth9/9 PASS, post-closure authoring19 PASS and local card/link checks PASS. The audit itself is complete; unresolved content/media prerequisites remain on their individual cards.

Files changed: actor/session/queue/player/mock services and tests, 5 new roll-forward migrations, native harness/safety/concurrency tests, authoring validators/provenance notes, cards/board/indexes/evidence. Environment: pg test-only dependency; separately authorized fresh hosted configuration/migrations001–026 verified, no old-key use or production deployment. Temporary native server stopped, zero disposable databases remain. Existing unrelated untracked artifacts preserved.

M6/M7 and CONTENT-007 remain outside implementation scope. Next action for this audit: none; follow the exact integration/content prerequisites in the remaining REVIEW cards.
