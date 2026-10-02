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

## PR85 integrated-head verification — 2026-10-02
- Integrated current main c29e4a7. Resolved board/index content conflicts and M3-UX-02 rename/delete + add/add by retaining current main's accepted Home card and completed FE-011/QA-002 states. Preserved QA-001 and CONTENT-014 evidence; historical G2/G5 proposal explicitly superseded by D1–D7/PR88/92.
- No Home/UI/adapter/QA83 changes versus main; validators and tests unchanged from original PR85. M3-COMPLETION-01 DONE, M3-06 READY and milestone gates preserved. QA-001 REVIEW; CONTENT-014 historical/media sign-off remains separate.
- Full npm run quality PASS: typecheck/build, 100 unit / 22 component / 7 E2E; scan 347/0 unsafe; 149 changed Markdown-file links checked, zero missing targets; diff check PASS. Log /tmp/suchill-pr85-integration-quality.log (local only).
- Next: Hưng/Dương confirm integrated docs/scope and CI before merge. No dependency/env/migration impact; .DS_Store untouched.
