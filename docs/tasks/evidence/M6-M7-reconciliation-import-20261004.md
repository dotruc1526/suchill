# Task reconciliation and normalized import preparation

Date: 2026-10-04, Asia/Saigon. Base: main f5b6734 / mergedPR125 with four exact-head checks SUCCESS.

## Delivered

Seven missing M7-03..09 cards now have explicit dependencies, accountable lanes, acceptance, current preparations and next actions. Latest board header and append-only M6/M7 checkpoints supersede stale locked-episode, missing-video, paperwork and pending-CI wording. Earlier snapshots and review decisions remain intact. M6-02/03/05 and M7-01 stay DONE; other formal gates are not falsely closed. Firebase is authorized but deferred by the user because existing team project access returns403; no new project or deployment.

Normalized import tooling maps stable domain identities to namespaced UUIDv5, produces relationships for seven lessons, fourteen documents, twenty questions, seven objectives, six story scenes, two media assets, eighteen sources and forty-two pending claims. Three legacy media source identities use exact existing documented URLs/provenance; original register and media are untouched. Knowledge answers/explanations are inserted only into private answer-key tables, not public scene payloads/questions.

The CLI constructs a fresh in-memory PostgreSQL/PGlite harness, applies all30current migrations and attempts the normalized transaction. It always rolls back; neither remote DB URLs nor privileged credentials are used. It does not upload media or publish content. Pending scene-claim review, historical/learning/media acceptance and actual storage upload remain explicit.

## Verification / review

- Import implementation:3tests PASS,0FAIL. Actual migrated schema validates all rows; anon/authenticated cannot see drafts; private answer keys denied; repeated rollback leaves no rows; invalid foreign key, publish-status tampering and partial candidate fail without partial state.
- Research-register regression:31PASS; structural register validator15sources/42claims/7episodes PASS. Original source/claim flags remain unchanged.
- New handoff documents:50relative links PASS after named CONTENT dependency and CLI link correction.
- Media verifier PASS: original4hashes, correctedpackage4hashes and narration words preserved.
- Independent task/docs review found one missing named Phase9 dependency; M7-03 now explicitly references CONTENT-008/007 and current1954 acceptance, rather than treating older1968 inputs as valid. Root independent import-code review accepts bounded offline preparation; no privileged/live application is supplied.
- New import regression is included in the existing serial GitHub boundary suite. Exact new PR checks are required for integration; no full local Quality rerun is claimed.

Root independently executed the actual dry-run CLI: exit0,518normalizedrows inserted/validated and rolled back; output/chapter1954-import/normalized-plan.json generated for internal authoring review. This file includes private answer keys and is not added to client/public payloads or committed as published content.

No runtime UI, rewards, environment, remote schema or immutable published content changed. Formal historical review, real device/screen-reader observations, canonical import/publication and final release decisions remain external acceptance, not results inferred from this preparation.
