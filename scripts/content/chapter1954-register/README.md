# Chapter 1954 preparation register validator

Requires the project's Node.js 24–26 runtime; no dependencies. Run from the repository root:

```sh
node scripts/content/chapter1954-register/validate.mjs
node --test scripts/content/chapter1954-register/validate.test.mjs
```

An optional directory argument selects another pair of SOURCE-REGISTER.json / CLAIM-REGISTER.json files. Default files resolve relative to the script, independently of the working directory. The CLI exits 0 for structural PASS, 1 for invalid input, missing files, JSON parse errors or unsupported versions. It prints diagnostics with the affected ID/path and never writes register files or makes network requests.

Checks: unique stable IDs; seven episode mappings; nonempty required fields and locator/reference arrays; valid source tiers and HTTPS URLs; source↔claim bindings in both directions; episode↔claim bindings; proposed truth classes; preparation safety fields. Unknown author/publication date may remain explicit null, matching the existing register and Phase 3's institution/date policy. A missing nullable field is rejected. Publication date is not inferred from creation date.

Scope is **research-preparation-v1**. Both roots must stay REVIEW with canonicalUseAllowed=false. Sources/claims must remain needs_historical_review without a reviewer; claims keep truthClass/confidence=null. The validator intentionally rejects promotion even if a reviewer name is filled: an approved/published register needs a separately reviewed schema/tool contract. Proposed classification is only a candidate.

PASS does not verify historical truth, URL availability, source independence, media rights or permission to release. Counts are reported rather than pinned to 15/42, allowing preparation additions with valid mappings. Seven episodes remain fixed by the approved outline. Dates are metadata strings, not a chronology audit.

The tool can be invoked manually with the commands above. The separate Chapter 1954 register quality workflow runs the validator and dedicated tests automatically on every push and pull request, without modifying package.json or the existing Quality workflow. A structural PASS remains separate from historical acceptance.

Task: [M7-1954-REGISTER-CHECK-003](../../../docs/tasks/active/M7-1954-REGISTER-CHECK-003.md). Evidence: [2026-10-03](../../../docs/tasks/evidence/M7-1954-register-check-2026-10-03.md).
