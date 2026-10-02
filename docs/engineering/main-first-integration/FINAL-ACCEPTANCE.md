# PR106 — final independent acceptance, 2026-10-02

Main baseline: c7a5ad5968b95b8d3dc41cab1dfd4dfd48830f88. Candidate: codex/m4-m5-main-integration. This checkpoint supersedes the a21be26 readiness decision where it concerns the newly repaired integration defects. No human approval, main merge or milestone closure is inferred.

## Repairs and independent review

The M5 audit reproduced three P2 integration defects that earlier tests missed: canonical completion bypassed durable offline queueing; the first real video checkpoint could submit watched ranges before server initialization; and canonical completion bypassed optional trusted analytics. All three were repaired under M4-M5-INTEGRATION-001. Preservation checks additionally restored the original M3 asset-ID guard alongside stronger queue ownership, and enforced offline/no-XP at the raw mock completion service boundary without preventing hosted queueing. Original M3 assertions remain unchanged. Applied migrations001–029 remain unchanged.

- Canonical completion now queues the original account/operation/payload after offline or ambiguous transport failures. No XP is shown before a trusted receipt. Ineligible queued completions retain their rejection and ID until retry/discard; ordered account isolation stays intact.
- Actual video Play creates an empty-range checkpoint, pauses until confirmed, then resumes observing real elapsed playback. Retry retains input/ID. Ready session, pending autoplay and callbacks are bound to the exact account/context queue.
- New roll-forward030 preserves the public RPC OID/ACL and isolates its revoked private implementation. Owner locking prevents duplicate completion telemetry; opt-out/replay emits no new events. Optional analytics failure cannot undo learning/XP.

Independent pr106_m4_acceptance approves M4-01..08 technically and the three repaired scopes. Independent pr106_auth_recovery_review approves the queue repair and supplied actual isolated Chrome video proof. No named Hưng/Vinh/Dương approval is represented.

## Verification checkpoint

| Check | Result / evidence |
|---|---|
| Full native PostgreSQL through030 |72/72 PASS, zero skipped; actual concurrency and owner/RLS checks; [log](./native030.txt) |
| Actual Chrome video | Initialization/ack/native resume, about1.42 seconds genuinely observed playback; stable-ID retry; old account/context response suppressed; [log](./video-initialization.txt) |
| Exact030 deployment payload | PGlite through029 validates exact transaction/history body, unchanged public OID/ACL and revoked private grants. UI clipboard copy equals prepared payload. Supabase result confirms20261002003000/main_completion_analytics. SHA256:08fbdd321682b71ee610feeb7c0f2a9e746b07085aace21911e7f2edc9a1a960. This is a prepared/UI-payload comparison, not a server-side body hash claim. |
| Full Quality | Running after restoring an additional original M3 asset-ID guard; final counts pending. Original M3 tests remain unchanged. |
| Hosted030 telemetry/independent-session resume |9/9 PASS, zero skipped: opt-in once under8 concurrent requests/replay; opt-out0; independent SDK video/VN resume/revisions; deliberate real post-commit response loss/recreated durable queue; exact owned cleanup. [Log](./hosted030.txt) |

Screenshot: local output/main-first-integration/supabase-030-applied.png. Development target suchill-test only. The retained dotruc1526 account/password/progress are not modified. Every hosted test uses exact owned disposable A/B users.

## Status and gate

M4 individual cards may be DONE after the delegated independent review and this evidence update. M4 milestone stays OPEN; M5 cards stay BLOCKED while the PO opening decision is absent. Reviewing reused code and repairing integration defects does not claim blocked milestone tasks. Final M5 per-card technical decisions and current-head CI will be recorded here when checks complete.

Optional recovery-email delivery/dedicated callback UI remains in AUTH-USERNAME-001 REVIEW. Historical privileged-key revocation, canonical historical/content/media, physical-device/PWA and production gates are separate. M6/M7 remain locked. After a reviewed merge, verify main again before separate M4/M5 milestone acceptance, as the user requested.
