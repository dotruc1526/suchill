# QA-001 — Schema/story validation evidence

- Date: 2026-10-01; executor: Codex hỗ trợ Vinh; base `30d0a4f`.
- Status: implementation REVIEW; Hưng nghiệm thu contract/architecture.
- Scope: typed domain validators, technical fixtures; not a parser for arbitrary untrusted JSON or canonical publish/release approval.

| Rule / Phase 5, 8 | Check | Result / limit |
|---|---|---|
| Published objectives present, nonblank, unique | `tests/validation/schema-story.test.ts`, chapter/lesson/story table | PASS; fixed missing checks in chapter/story and blank/duplicate IDs in lesson |
| Broken chapter lesson / typed lesson block / scene destination | same suite, code and affected path assertions | PASS; fixture graph with broken target also reports no reachable end and unreachable scene |
| Stable entity/block/order/scene/choice IDs | `tests/member5/validation.test.ts` | PASS; includes global choice identity and blank IDs |
| Narrative/reflection correctness forbidden | existing story regression | PASS; does not infer moral correctness |
| Knowledge answer/feedback/continuing target | existing transition/explanation checks | PASS for covered cases |
| Published dependencies require known + approved lookup | both suites | PASS; absent lookup fails closed, empty approved set rejects source |
| Media source/license/attribution/accessibility | existing media regressions | PASS for metadata; not actual file/license/legal verification |
| Reachable end / unreachable scene | graph regressions | PASS; general cycle-with-exit policy and all-path required-objective coverage remain authoring review requirements, not certified by runtime validator |
| Historical fact/source correctness | CONTENT technical QA separate from historical review | IDs can be checked; facts and licensing require designated reviewer |
| Published version immutable | Phase 5 service/persistence boundary | Not proven by shape validation; no DB/version publication operation in this task |
| External JSON schema and enum discriminator | TypeScript domain + existing validators | Typed input required; arbitrary malformed JSON needs parsing boundary in later ingestion task |

## Finding and verification

Baseline objective table failed three tests: chapter/story accepted empty objective lists, lesson accepted blank objective ID. Published validators now require at least one nonblank unique objective ID; draft behavior and DTO/service shapes remain unchanged. This does not prove IDs correspond to an approved curriculum objective registry.

- Focused validation: 17/17 PASS (5 QA-001 + 12 existing), after reproducing 3 objective failures before correction.
- Full `npm run quality`: PASS; 79 unit, 22 component, 4 browser E2E; typecheck/build PASS; scan 322 files / 0 unsafe.
- Branch is based on current main; QA-002's two extra E2E tests stay in independent PR #83 and are not counted here.
- `git diff --check`: PASS.
- No package/dependency/env/migration change. Source changed only the two claimed validator modules.
- Next: Hưng review and acceptance; keep QA-001 REVIEW, no gate change.
