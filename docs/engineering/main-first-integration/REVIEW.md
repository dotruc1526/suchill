# Main-first integration review — 2026-10-02

Main baseline: c7a5ad5. Delivery: 61ace4d. Candidate branch: codex/m4-m5-main-integration.

## Review checkpoint before comprehensive verification

Executor self-review; independent QA / Product Owner approval remains pending.

- Main navigation, shell, tokens, completion controllers, profile read model and fixture tests preserved.
- Completion API stays canonical; incompatible legacy backend receipts are explicit behind backendContracts and mainServices facade.
- SQL projection supplies account/version/time/reward identity. No component invents XP.
- Account scope retains expected actor and rejects reads across A → B → A transitions.
- Story delivery cannot expose answer keys; optional trusted feedback extends the existing main player.
- Applied migrations 001–028 remain untouched. New029 is not yet applied to hosted development.

Findings repaired before the test phase:
1. New RPC referenced a helper absent from the deployed schema; replaced with explicit operation signature/cache using the existing private.operations table and account lock.
2. Quiz receipt projection must use stable reward_scope_id, rather than content row identity; corrected.
3. Main fixture-version map is not hosted authority; server projects immutable published lesson identity and the existing controller consumes that domain field.
4. Main VN must initialize backend checkpoint before advancing and use trusted feedback for replay; extended existing model without replacing the M3 player.
5. Conflicting historical content decisions from delivery must not replace main approvals; main content files restored and obsolete duplicate cards removed.

Next: comprehensive verification and repair/re-review. This checkpoint does not approve merge, milestone DONE, content publication or production deployment.

## Scope review: content validators

Main HISTORICAL-SOURCES.md contains two MT68 registries with overlapping IDs and differing meanings. The old branch content-review validator rejects this; importing its content task would require changing main historical decisions outside this integration claim. The integration retains main content and both accepted main validator commands; old-branch authoring-validation changes are excluded. No source/claim is published. This is an existing content review issue for CONTENT/M7, not evidence that canonical content is approved.

## Re-review after verification repairs

Syntax/name ambiguity in new029 corrected and tested on PGlite and PostgreSQL17. Canonical read/complete receipts, ineligible same-operation retry, owner substitution, operation conflict, VN answer redaction/trusted grading and scored-quiz rewards pass. Added hosted ServicePractice wiring and auth UI regressions; final verification follows. Production merge and hosted029 remain pending: auto-review rejected executing new029 because specific migration/payload approval is missing. No bypass attempted.

## Final independent re-review — hosted029 applied

This checkpoint supersedes earlier pending029/repair notes above. Applied001–028 remain unchanged;029 was hardened before application and is now immutable.

| Finding | Repair and verification |
|---|---|
| Hosted Home uses fixture activity | Inject account-backed activity; hide unavailable minute goal; preserve main mock goal. Composition regression and real Home UI pass. |
| Stored reduced-motion preference has no runtime effect | Apply account preference to root dataset; suppress transitions/animation and active scaling while preserving layout transforms. Preference/UI regression passes. |
| Rejected offline queue has no recovery controls | Display pending/rejected/error status and account-scoped retry/discard controls; trusted totals remain authoritative. Real stale checkpoint recovery passes. |
| Video fallback cannot explicitly confirm completion | Accessible/media fallback confirmation records canonical action, retains operation IDs on retry and coalesces concurrent clicks. Required recap and explicit fallback completion pass. |
| Optional fallback changes required lesson receipt method | Join only required lesson blocks when computing fallback metadata. Native SQL regression passes. |
| Canonical action leaks into strict queue DTO | Remove action from backend command payload and map method explicitly; composition/offline replay regressions and real fallback UI pass. |
| Fixture E2E reads hosted dist | Preview the runner's isolated build directory with envDir false; original M3 assertions retained. All nine M3 E2E pass. |

Independent reviewer: Codex hosted_contract_tests agent, read-only re-review under user delegation. Decision: APPROVE technical repairs; no actionable blockers found. Reviewer checked action mapping, fallback retry/coalescing and stale-result handling, account-scope resets, hosted Home, motion, queue recovery, fixture preview and regression coverage. The agent relied on root-supplied hosted/browser execution evidence; it did not claim to rerun those external checks.

Final verification:314 Quality tests passed, native0296/6, real hosted5/5 and configured Chrome UI passed. Retained account read-only sign-in and10XP/one lesson are unchanged; disposable fixture cleanup passed. Receipt table RLS is enabled/default-deny and direct client access/actor spoofing are denied. Exact prepared transaction/history payload validates against source.

No named Hưng/Vinh/Dương approval is inferred. Human QA/PO acceptance, M4 closure, M5 opening and separate acceptance, historical-key revocation, canonical content/media and production gates remain. Final evidence is in the [report](./REPORT.md).
