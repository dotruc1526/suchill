# AUTH-USERNAME-001 — Username/password access with optional recovery email

> Status: REVIEW\
> Started / last updated: 2026-10-02

## Assignment

- Owner / Executor: Codex root.
- Reviewer: username_security source/security review PASS; browser/mail/human acceptance pending.
- Branch: codex/m6-pwa-completion, based on merged main 8b5ae10; original username implementation is retained.
- Dependencies: M4-07, SUPABASE-HOSTED-001 technical delivery DONE.
- Authorization: user requested username/password instead of mandatory email confirmation; selected optional recovery email without blocking learning.
- Files claimed: this card, own board/index entries, new authentication design/evidence, `src/features/auth/`, auth-only additions to `src/services/next/accountContracts.ts`, `src/services/next/mockAccount.ts`, `src/services/supabase/auth.ts`, new trusted account-access backend/function, new auth migration and tests; dev-only middleware registration in `vite.config.ts` if needed. No App/tokens/global CSS/package/lockfile ownership taken.
- Next action: manual hosted browser acceptance at8443; configure optional sender and exact recovery redirect allowlist, then verify mail/reset before DONE.

Exclusive execution lanes: `username_client` owns `src/services/supabase/auth.ts`, its new helper, auth additions to `accountContracts.ts`, mock auth and `tests/member5/username-client.test.ts`; `username_ui` owns `src/features/auth/`; `username_security` owns read-only cross-review plus `tests/member5/username-server.test.ts` and `supabase/tests/username-access.test.mjs`. Root owns backend/migration/hosted deployment/docs and the narrow initial profile route in `src/App.tsx` (existing completed UX patch preserved). Root also adds Auth metadata fields to SQL harness bootstrap; no applied migration edited.

## Contract decision and scope

Root additionally claims `src/services/offline/accountScope.ts`, `supabase/config.toml` and deploy builder. Security mutations receive the account captured by the UI scope and retain its initiating bearer. Recovery reservation remains locked through ambiguous Auth timeout/5xx; a trusted operator must reconcile Auth before releasing it. No automatic lease permits overlapping email changes.

Supabase still owns passwords, sessions and auth.uid(). Username is an application identifier. New username accounts get a server-created internal Auth identity and can start learning immediately. Real recovery email is optional; it must be confirmed before enabling email-based recovery, without blocking an existing session. Existing email/password users and their UUID/progress remain valid. Duplicate registration does not reset credentials. Username uniqueness, immutable mapping, server-only privileged credentials, request limits and generic login failures are required.

## Acceptance

Hosted checkpoint: 027 applied successfully and function source deployed. Actual GoTrue admin enrollment inserts `auth.users` before applying trusted app metadata, so immediate INSERT validation rejected even authorized enrollment. New roll-forward 028 defers the same validation to transaction commit and reads the final persisted row; 027 remains immutable. Added a transaction test matching GoTrue ordering. Source: https://github.com/supabase/auth/blob/v2.197.0/internal/api/admin.go#L473-L522.

- [x] New username signup/login/reload/signout, with no mandatory mailbox click.
- [x] Existing email login and UUID/progress preserved (actual hosted UUID/10XP/one lesson proof).
- [ ] Optional recovery setup/reset is distinct from basic access and cannot take over another account.
- [x] Server-side uniqueness/validation/rate limits; no credential or identity mapping exposed publicly.
- [x] Relevant typecheck/build/auth/security tests and real hosted/browser evidence.
- [x] Accurate handoff and REVIEW until independent acceptance.

## Handoff

[Evidence and deployment](../../engineering/auth-username/EVIDENCE.md). Both027 and028 now applied, and public username signup returns a real session immediately. Hosted username adapter8PASS; source/security gatesPASS. Core code is ready for review; no DONE claim while real recovery delivery/reset and final browser acceptance remain unverified. Additional root claims: account-scope regression, hosted Auth tests/expected confirmed-email DTO, diagnostic/deploy builders and this evidence. Existing unrelated UX edits remain intact.

No old account deletion or password reset is included in this task. User-supplied duplicate-email/password scenario was tested separately: duplicate signup returned no session, requested password remained invalid, original credential still worked.

## PR106 core username UI acceptance — 2026-10-02

Actual configured Chrome UI on allowed origin localhost5173: signup without email/confirmation,375/430 mobile fit, repeat-password validation, immediate Home, persistent browser reload/same UUID/0XP, signout, wrong-password rejection, correct username login and own synthetic password change/new-password login PASS. [UI evidence](../../engineering/main-first-integration/username-browser.txt). Runtime is unchanged from reviewed5640f29. Disposable account deleted only after checking exact newly generated UUID/email/username metadata; retained account/password/progress untouched. No real recovery email sent. This supersedes the earlier pending complete new-user browser sequence; optional recovery sender/delivery/reset acceptance remains pending and this card stays REVIEW. Next action: configure verified recovery sender and callback allowlist, validate real recovery with authorized recipient, then obtain separate reviewer/PO acceptance.

## Post-merge recovery rework — 2026-10-02

Independent postmerge reviewer identified a concrete missing acceptance: the SDK PASSWORD_RECOVERY event is discarded and /?account=recovery opens the learning Home instead of a reset form. This resumes the existing active Auth scope, independently of locked M6/M7. Core username acceptance remains reusable; no original account credentials/progress are changed.

- Owner / Executor: Codex root coordinating disjoint recovery client/UI work.
- Reviewer: independent postmerge_main_review; final mail/sender/redirect acceptance still pending.
- Started: 2026-10-02. Status: IN PROGRESS (reopened from REVIEW for the verified recovery gap).
- Files claimed: root owns this card, its board row, docs/engineering/auth-username/recovery-callback.md and src/app/HostedApp.tsx; client lane owns auth-only additions to src/services/next/accountContracts.ts, src/services/supabase/auth.ts, a new passwordRecovery.ts helper and tests/member5/password-recovery.test.ts; UI lane owns new recovery feature files and tests/qa/password-recovery-ui.test.mjs. Package/lockfile, App.tsx, tokens, global CSS, all applied migrations and unrelated contributor files remain unclaimed.
- Acceptance: a dedicated callback/reset form only becomes usable after an SDK recovery event plus server-verified matching Auth subject; valid, missing/expired, offline/retry, repeated-password and account-switch cases; callback secrets are not surfaced in domain/UI/logs; own pending progress is preserved. Ordinary signin/signup and existing M3/M4/M5 regression must pass. Hosted email delivery/sender and real authorized recipient acceptance remain separate and unverified.
- Next action: agree the minimal optional AuthService recovery contract, implement in claimed lanes, verify meaningful unit/browser checks and obtain an independent review before returning to REVIEW. No task DONE or milestone gate is inferred.

Client lane additionally claims only the concurrent-listener fixture in tests/member5/username-client.test.ts; all prior assertions remain unchanged. It must model multiple SDK subscriptions so the recovery observer cannot be accidentally overwritten by the fixture.

## Recovery software review — 2026-10-02

Independent recovery_review APPROVE final helper SHA256 e2e216fa1a831ae66985fe8f2e7daf2601bb554b9af5013e60fe5db7f2a91468. Independent44 unique checks PASS:21new recovery,11legacy username client,6legacy AuthUI+6new recovery Chrome/SSR. Includes SDK delayed event, expired/query-only existingaccount denial, refocus, ABA, mutation bearer pinning, transientnull503, concurrent submit, callback reload after memoized initialnetwork failure,375/430/reduced-motion/keyboard/200percent text and exact pending preservation. Added dedicated callback before HostedRuntime so learning/sync waits dismissal. No migration/backend/user account/env mutation.

Status REVIEW remains required: verified optional sender, exact hosted redirect allowlist and authorized real mailbox/reset delivery acceptance are still unverified; unit/browser fixtures are not live email proof. Next action is finish that external acceptance when verified sender/project configuration is available. Existing core username/password access stays accepted.

## Root integration finding — 2026-10-03

React StrictMode re-runs useMemo initializers; createLearningRuntime constructs an SDK that consumes a one-time recovery URL. Root claims the existing HostedApp initializer plus a new owned hosted-recovery fixture and browser assertion. A per-document runtime is shared across StrictMode/remount, keeping the original verified recovery tracker. This is software rework under the active recovery card, not evidence of real email delivery. Previous helper approval is preserved; the new integrated boundary needs review with this evidence.
