# AUTH-LOGIN-001 — Reproduce login with a fresh account

> Status: DONE\
> Started / last updated: 2026-10-02

- Owner / Executor: Codex root, at the user's request.
- Reviewer: user reproduction accepted on 2026-10-02; existing browser/hosted QA evidence retained.
- Branch: codex/m3-m5-complete.
- Depends on: M4-07 and SUPABASE-HOSTED-001 technical delivery DONE.
- Files claimed: this card, own task-board row, ignored `.env.login-check.local`, own evidence under `output/login-check/`.
- Runtime/source files: claim `src/features/auth/AccountAccess.tsx` only for login error wording; concurrent UX changes preserved. Keep the approved six service error codes unchanged.
- Scope: create one independent synthetic Auth signup without sending mail, test browser login before/after confirmation, reload persistence and sign-out. No password changes, deletion, release or milestone closure.
- Next action: login investigation closed after user confirmation; optional recovery and full username-flow acceptance remain in AUTH-USERNAME-001; milestone acceptance unchanged.

## Acceptance

- [x] Fresh account independent of the retained owned-email account.
- [x] Browser password login tested before and after confirmation.
- [x] Reload and logout verified; credentials/tokens not emitted.
- [x] Report exact provisioning method and limits; do not infer the user's cause without their URL/error.

## Handoff

Fresh hosted signup generated through the trusted `generateLink(type: signup)` API, not the public signup form. No email sent. Browser entered its actual generated password: before confirmation Supabase returned `email_not_confirmed`, while the UI incorrectly asserted wrong email/password. The approved generic domain `unauthorized` code is preserved; wording now includes the confirmation step without claiming which credential is wrong.

The one-use generated token was consumed with `verifyOtp`; fresh confirmed browser login reached Home with 0 XP/0 lessons/streak0. Real page reload restored the same account; profile displayed `Kiểm tra đăng nhập mới` and zeros, with no old account reward/preferences. Sign-out returned to the login form. A deliberate wrong-password attempt confirmed the new `role=alert` guidance, and the password field was cleared afterward.

Evidence: `output/login-check/fresh-account-profile.png`, `output/login-check/login-help.png`. Typecheck PASS; build result recorded below. Runtime change only `src/features/auth/AccountAccess.tsx` (one message); no adapter, shared-contract, migration, dependency or auth-security changes. No new automated tests for this wording-only change; actual browser flow was checked. Concurrent UX files preserved.

Build PASS (145 modules); `git diff --check` PASS; client-secret scan 443 files / 0 unsafe matches. Existing Vite config-loader and >500kB chunk warnings remain; no new dependency/config changes.

## Exact user origin follow-up — localhost:8443

User supplied `http://localhost:8443/`. Both this origin and 127.0.0.1:5173 returned HTTP200/Vite. Actual browser at localhost:8443 logged in with the independent confirmed synthetic account, restored the session after reload and read its zero-XP/zero-lesson profile. Sign-out succeeded. Then the retained owned-email account also logged in via the same 8443 form and showed its expected 10 XP, one completed lesson, streak1 and muted preference. No cross-account state leaked. Screenshots: `output/login-check/localhost-8443-new-account.png`, `output/login-check/localhost-8443-owned-account.png`. Owned account tab remains signed in as a deliverable; password was read only from the existing ignored manifest and never emitted.

Limits: this verifies actual new Auth identity and browser login/confirmation/persistence, not fresh public-form email delivery in this run. The user's origin is now known, but their email/current error and browser state are still unknown; their failure is not declared resolved. Existing saved fixture password passing does not prove the password entered by the user is the same. No password change or account deletion performed; this synthetic fixture is retained in ignored `.env.login-check.local` with its confirmation token removed. QA acceptance is pending; REVIEW is not DONE.

User then confirmed email `dotruc1526@gmail.com` and a rejected-login message (not a stuck loading state). Confirmed exact owned-email login succeeded at8443 using the original fixture credential. Opened only its pre-existing ignored `.env.hosted-signup.local` file in the user's local Codex editor so the owner can privately compare/copy the password; no credential value emitted to chat/logs and no reset performed. User's manual retry remains pending.

Follow-up after the user requested password12345678: duplicate confirmed-email registration returned no session and did not replace the password. Actual hosted recheck after028 again rejected12345678 and accepted the original saved credential, preserving the same UUID,10XP andone completed lesson. [Username delivery evidence](../../engineering/auth-username/EVIDENCE.md) supersedes the earlier one-line error-wording implementation. No owned credential was changed or account recreated; the user can select a new password in Profile themselves.

## User acceptance — 2026-10-02

The user explicitly reported: “Được rồi tôi đã đăng nhập thành công”. This closes the pending manual login reproduction and this investigation. Earlier pending statements are historical checkpoints. No additional credential, account or hosted configuration change was made during the main-integration audit. This acceptance does not certify optional recovery delivery or close AUTH-USERNAME-001.
