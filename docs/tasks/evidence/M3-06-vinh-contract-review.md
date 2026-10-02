# M3-06 — Vinh contract review of G2/G5

> Date: 2026-10-01; status: DRAFT recommendations, not canonical contract approval.
> Input: [Dương preparation at 49c69d9](https://github.com/dotruc1526/suchill/blob/49c69d939d0a991fb1270572ac1325cc2a594d96/docs/tasks/evidence/M3-06-preparation.md).
> Source policy: approved [Phase 7](../../specs/phases/07-progress-reward-analytics-spec.md).

## Review result

Proposal direction fits M3 mock UI and Phase 7: service owns completion eligibility/reward, UI displays receipts and pending state. Implementation is not ready until the following evidence/schema decisions are agreed. Current checkpoint writes accept caller-provided completedBlockIds; those writes are resume data, not sufficient reward proof.

## Concrete recommended contract shape

Names below remain proposed; Hưng reviews service placement before coding.

| Operation / type | Recommendation |
|---|---|
| Complete lesson input | lessonId + operationId; user from session. Adapter binds request/retry to a fixed catalog revision and required block/story/assessment identities; no XP/passed/userId/eligibility flag from UI |
| Completion outcome | discriminated completed(receipt) or requirements_unmet(missing block IDs/reasons); transport failures remain existing Result errors. Do not collapse unmet policy into server_error |
| Receipt | stable receiptId, userId, lessonId, content revision identity, completedAt, reward entries with eligibilityVersion and grant state granted/already_granted/no_reward; XP delta from service only |
| Read completion | Result<receipt or null>; null means not completed, error means unknown, never silently zero progress |
| Account summary | userId, asOf, confirmed totalXp, completedLessonCount, account timezone, current/longest streak and stable achievement IDs. Result<summary or null>; session unauthorized stays typed error |
| Pending | controller-owned unsent operation + fixed payload; no fake confirmed receipt and no optimistic XP/streak change |

A minor content correction must not automatically change reward eligibilityVersion. Phase 7 dedupe key is account + rewardType + activityId + eligibilityVersion; operationId also binds payload for retry. A new operationId must not permit replay reward. Summary read retries must not resubmit completion. Account switch invalidates pending display and stale responses.

## Evidence authority and required agreement

1. **Content/reward revision identity (Vinh + Hưng + PO):** current Lesson has no explicit version field. Choose catalog-owned revision/eligibility mapping before adding receipt fields; do not use array order, random version or edited title.
2. **Required block evidence (Vinh + Dương + PO):** VN needs matching story version/end and valid required attempts; video needs stored merged unique ranges ≥90% or approved fallback + required recap/check; quiz needs complete practice receipt or trusted scored pass. Text/recap needs explicit acknowledged action bound to document revision. Existing freely submitted completedBlockIds alone cannot authorize any of these rewards.
3. **Fallback decision (PO + content/QA):** no automatic reward from opening a transcript; define which recap/check is required and how its service evidence is linked. Optional video does not block completion.
4. **Mock persistence/isolation (Vinh + Hưng):** injectable store, deterministic clock/account timezone, atomic mock dedupe and recreate-adapter tests. Label summaries/receipts as mock confirmed, never claim backend/cross-device authority. Supabase transactions/RLS remain M4/M5.

These are open contract decisions, not new XP/threshold policy: defaults already approved by Phase 7. Do not change policy or open a milestone from this review.

## Implementation / verification handoff

- Hưng/PO/Dương agree review decisions → create source task/card/claim for contract + mock + unit tests, then consumer UI. Update all consumers for required interface additions before merging.
- Tests: missing/stale/foreign evidence rejects; optional video accepted; required video seek-only rejects; fallback without recap rejects; same operation/same payload returns same receipt; same operation/different payload conflicts; new operation replay no extra reward; day/timezone and user isolation; recreate adapter restores receipt; summary read failure preserves confirmed receipt.
- UI: loading/error/empty/offline/pending/confirmed/already-rewarded, same retry payload, no client XP calculation; long Vietnamese copy and keyboard/status/focus at 375px/430px.
- M3-07 waits for accepted M3-06 runtime. This review claims documentation only; no completion adapter, production reward or M4 implementation.


## Current-context clarification — 2026-10-02
- The proposal above is a historical 2026-10-01 review, not the current contract or implementation blocker. Approved D1–D7 in PR84 and accepted adapter PR88 (a339af6) supersede its open decisions. PR92 (c29e4a7) records adapter DONE and M3-06 READY for Dương UI claim.
- Preserve original recommendations as evidence; no new runtime claim or contract decision here. Hưng reviews this archived proposal record only. M3-07 still waits for accepted M3-06 UI; M3 OPEN/M4 LOCKED.

## Final archival context — 2026-10-02
- [Proposal task](../archived/M3-CONTRACT-REVIEW-01.md) CANCELLED/superseded; no acceptance of this draft inferred. Canonical D1–D7 adapter and UI are accepted, M3-07 QA merged via PR98/f0a2bdf. No further G2/G5 runtime decision pending here; PO gate remains separate.
