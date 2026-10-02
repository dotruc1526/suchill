# Username access — 2026-10-02

Owner/executor: Codex root. Independent source/security review: `username_security`.
Branch: `codex/m3-m5-complete`. Task: [AUTH-USERNAME-001](../../tasks/active/AUTH-USERNAME-001.md).
Status: REVIEW; hosted mailbox delivery and complete manual browser acceptance remain open.

## Result and contract

New registration uses an immutable, normalized 3–32 character username, display name,
password and repeated password. No email is required to begin learning. Existing
email/password accounts keep their Auth UUID, progress, settings and rewards. Profile
can claim one username for an existing account. Passwords and session persistence
remain owned by Supabase Auth; tokens never enter domain DTOs.

Email recovery is separate and optional. A new internal username account can add its
first real mailbox using an authenticated, owner-bound, 20 minute one-use proof.
Only a confirmed real Auth email enables native password reset. Existing real-email
accounts keep their verified mailbox; this custom enrollment cannot bypass Supabase's
secure email-change flow. Password changes use the initiating bearer on the public
Auth user endpoint, with the rendered account explicitly carried through the service
scope. There is no admin password-reset endpoint.

## Deployment and evidence

Project: `suchill-test`, ref `kyfqlhpweetsridmqkvl`.

- Migration027 creates private username mappings, bounded hashed quotas and recovery
  reservations. Applied atomically with exact SQL migration history. Dashboard count27
  was directly observed before migration028.
- Actual GoTrue v2.197.0 inserts `auth.users` before applying admin app metadata within
  the same transaction. Migration028 defers validation to commit and reads the final
  persisted row. The earlier immediate trigger rejected valid admin enrollment and was
  corrected by this roll-forward; migration027 was not edited after application.
  [Installed source ordering](https://github.com/supabase/auth/blob/v2.197.0/internal/api/admin.go#L473-L522).
- User applied `output/username-access/apply-028.sql` and supplied a screenshot showing
  history row `20261002002800 / deferred_username_enrollment`. Subsequent actual GoTrue
  enrollment and rollback tests passed.
- `account-access` function deployed. Function-specific legacy JWT gateway verification
  is OFF for anonymous signup/login; protected claim/recovery/password actions verify
  the user bearer inside the handler. Project-wide Auth email confirmation remains on.
- `scripts/member5/build-account-function.mjs` reproduces the dashboard editor source.
  SHA256 of the deployed normalized bundle:
  `94cc543d795253a7c2287eb0831f39359ffd6b0161b107bc6b94c12a995b9798`.
  Editor clipboard source was compared exactly before deployment. Initial editor fill
  had retained template source; replacing the complete document corrected it.
- Real public function signup returned a session immediately after028, without a mail
  click. `supabase/hosted-auth/username.test.mjs`: 8/8 PASS, covering username login,
  SDK persistence recreation and authorized reads, wrong password, duplicate username,
  signout/re-login, missing recovery-mail configuration, existing owned UUID/10XP/one
  completed lesson and GoTrue rollback for user-metadata-only spoofed enrollment.
- `12345678` still fails for the existing owned email. Duplicate email registration did
  not replace its password; its original saved credential succeeds. No account reset
  or deletion was performed. The user can choose a new password in Profile themselves.
- Browser at `http://localhost:8443/` rendered the new signup without an email field,
  rejected mismatched repeated passwords, and showed the existing account's10XP/one
  lesson and verified mailbox. After the browser tool stopped working, final hosted
  signup/login proof used the actual SDK/adapters. A successful complete new-user UI
  sequence at8443 and375/430px remains a manual acceptance step; API persistence is
  not presented as browser reload proof.

## Quality

- Typecheck PASS; build PASS151 modules; final client-secret scan453 files,0 unsafe matches.
- Combined unit/component/new UI contracts:203PASS. Later account-scope regression and
  final username client/server/SQL recheck:44PASS, including9SQL checks through028.
- Fixture browser E2E:9PASS. This uses an isolated mock build, not hosted Supabase.
- Full DB through028:51PASS/0FAIL/1 native skip (52 total). A timezone fixture was corrected from
  seasonally variable Adak to Pago Pago, always more than24 hours from Kiritimati.
  Existing XP/replay assertions were retained; the failure reflected correct ledger
  idempotency for what had accidentally become the same day. Existing hosted Auth
  matrix re-run after the confirmed-email DTO addition:9/9PASS;17 hosted Auth checks
  across the two independent suites.
- New backend/security review found no Blocker/Critical for mappings, RLS, bearer
  ownership, duplicate credentials, replay/expiry or deferred enrollment. This is AI
  technical review, not a fabricated human/PO approval.

## Environment and open acceptance

Browser still receives only project URL/publishable key. Trusted test credentials and
retained test-user credentials are in ignored `.env*.local`; no secrets are committed.
Edge uses server-only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`,
and optional `ACCOUNT_ACCESS_ORIGINS`. Local origins8443 and5173 are explicitly allowed.

Recovery delivery requires `RESEND_API_KEY` and `ACCOUNT_ACCESS_MAIL_FROM` server secrets,
with a verified sender. They are not configured, so requests fail clearly before mail
or pending-state side effects; basic learning remains usable. No real email was sent
during this username verification. Native password reset now requests current app
origin `/?account=recovery`; exact localhost8443 and127.0.0.1:8443 callback URLs still
need inclusion in hosted Auth redirect allowlist before a real reset-mail test.

Recovery proof keeps a reservation through the Auth update. Definitive4xx failures
release it; timeout/ambiguous5xx keep it locked because Auth may already have committed.
An operator must reconcile the target Auth user's email before invoking server-only
`finish_recovery_email` with the matching request hash. No automatic lease opens a race.
Concurrent setup emails may show stale pending metadata cosmetically; the stored latest
token and reservation determine authority. Per-name quotas supplement native GoTrue
limits; they cannot replace them since a predictable internal identity can also reach
native Auth. Production anti-abuse/sender/origin configuration remains a release gate.

No production release, main merge, M6/M7 opening or historical-key-rotation sign-off is
included. Preserve unrelated Trúc UI/UX changes in the shared checkout.

## Core browser acceptance on PR106 — 2026-10-02

The earlier pending full username browser flow is superseded by actual configured Chrome on allowed origin localhost5173: no-email signup, repeat-password gate, immediate Home, mobile375/430, reload/same UUID/0XP, signout, incorrect/correct username password login and password change/new-password login PASS. [Execution log](../main-first-integration/username-browser.txt). Source is unchanged from reviewed5640f29. Screenshots were visually inspected; local files are output/main-first-integration/username-signup-375.png, username-signup-430.png and username-home-created.png. The exact current-run QA user was removed after UUID/email/username metadata verification; retained user untouched. Temporary QA preview stopped. No actual recovery mail/delivery/reset approval is claimed; that optional acceptance and server sender configuration remain pending. AUTH-USERNAME-001 stays REVIEW.
