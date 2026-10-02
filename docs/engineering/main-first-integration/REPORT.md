# Main-first M4/M5 integration candidate — final hosted verification

- Baseline main: c7a5ad5968b95b8d3dc41cab1dfd4dfd48830f88 (M3 DONE / M4 OPEN).
- Source delivery: 61ace4d; candidate: codex/m4-m5-main-integration; [draft PR106](https://github.com/dotruc1526/suchill/pull/106).
- Main was refreshed after implementation and hosted verification; baseline unchanged.

## Result

24 textual conflicts were resolved with accepted main M3/content decisions as the baseline. Main shell/navigation, fixtures, completion controllers and original test assertions are retained. Supabase completion receipts use an explicit domain facade; auth, account preferences, service-backed practice and account-scoped offline checkpoints are connected to the configured runtime. Mock mode retains main behavior.

Independent review found hosted Home reading fixture activity, missing account reduced-motion behavior, hidden queue rejection recovery and missing explicit video fallback confirmation. All four findings were repaired. Hosted UI additionally exposed an action field leaking into the strict offline queue DTO; the facade now maps only backend command fields. The fixture E2E preview now reads the runner's isolated build directory, so configuring local Supabase does not replace M3 fixture tests with the Auth screen. Optional video blocks no longer change required-lesson fallback receipt metadata.

## Review and verification

Independent technical re-review APPROVED these repairs with no actionable blockers. This is Codex technical approval under the user's delegation, not named human QA/PO or milestone acceptance. [Review record](./REVIEW.md).

| Check | Result | Evidence |
|---|---|---|
| Final Quality | typecheck/build PASS; 220 unit +29 component/Auth UI +56 SQL +9 M3 Chrome E2E =314 passed; two native-only SQL skips | [Quality log](./quality-hosted-final.txt) |
| Native PostgreSQL17 final029 | 6 passed, 0 skipped; concurrent requests, owner isolation and required-block fallback covered | [Native log](./native-main-029.txt) |
| Real hosted Supabase canonical facade | 5 passed, 0 skipped; explicit evidence, A/B ownership, actor substitution denial, eight concurrent requests, VN/quiz rewards and replay | [Hosted log](./hosted-main.txt) |
| Configured hosted UI in isolated Chrome | actual password login; mobile375/430; text gate; reload/replay; fallback gate/confirmation; persisted motion; rejected queue recovery; confirmed XP unchanged by retries | [UI log](./hosted-browser.txt) |
| Exact prepared SQL transaction/history payload | syntax/execution PASS; source/history statement match; receipt RLS enabled and default-deny | [Payload validation](./migration-payload-validation.txt) |

Final staged source/tracked/bundle scan:521 files, zero unsafe matches. Final documentation check:91 task cards,713 local links across199 documents PASS. Earlier logs in this directory are historical checkpoints; the linked final logs supersede them.

The retained user account was checked read-only: password sign-in, confirmed email/session and canonical/legacy summaries work; 10XP and one completed technical lesson remain unchanged. Hosted API/UI fixtures used separate disposable users; exact-manifest cleanup passed. No password, account or progress reset was performed on the retained account. Screenshots are in the local root output/main-first-integration directory. Mobile screenshots were visually inspected; no horizontal clipping was found.

## Database impact

User explicitly authorized029 on development project suchill-test (kyfqlhpweetsridmqkvl). An initial automatic review rejected Run without RLS before execution. The then-unapplied migration was hardened with receipt RLS/default-deny and revalidated. Final029 was applied successfully; dashboard history returned version20261002002900 / main_completion_contract. Hosted RPC/UI tests subsequently passed.

Final exact transaction/history payload SHA256: 6b7dfa8e5af99e2b6f1f34e3c10df7adb5448de746140c20fc78030b5b804054. Prepared payload is in local output/main-first-integration/apply-029.sql. Payload validation is isolated; it is not a claim of a post-application server-side hash comparison.

Migrations001–028 are unchanged. Applied029 is now immutable. It introduces authenticated owner-bound canonical read/complete RPCs and a private receipt cache with revoked client grants and RLS without client policies. Completion is trusted, idempotent and serialized per account; published immutable lesson row IDs provide content-version identity separately from stable reward scopes. Existing accounts/progress/content are preserved. No production environment was modified.

## Remaining acceptance gates and handoff

M4 integration cards remain REVIEW for named QA/PO acceptance of this main-based candidate. M5 reused code is preparatory; M5 cards remain BLOCKED until formal M4 acceptance and explicit PO opening of M5. Review/accept M4 separately, then open and review/accept M5. PR106 remains draft; no merge or milestone closure is inferred from technical approval.

Historical privileged-key revocation still requires its existing gate evidence; fresh development credentials are isolated. Main contains overlapping MT68 source/claim registries with conflicting meanings. Main content and its accepted validator commands are preserved; an old-branch independent content-validator task is excluded. Canonical content/media publication, physical-device/performance/PWA acceptance and production release retain their separate gates. Passing fixture authoring checks is not historical/media publication approval.

Root workspace codex/m3-m5-complete and other contributors' uncommitted changes are untouched. Temporary native PostgreSQL and candidate UI test servers are stopped; user localhost8443 is untouched. M6/M7 remain locked. Current-head GitHub Quality and PR mergeability must be checked after the final evidence commit is pushed.

## PR106 readiness continuation

User requested preparation for merge. Core username signup/login/reload/signout and own disposable-account password change passed real configured Chrome; exact-user cleanup passed. [Merge readiness](./MERGE-READINESS.md) records scope, review/CI, known optional recovery configuration and the post-merge re-review sequence. Runtime remains5640f29; this follow-up changes documentation/evidence only. Ready for review does not constitute main merge or milestone/production acceptance.
