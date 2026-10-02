# Hosted Auth verification

Run only against the explicitly guarded disposable development project, after migrations:

```powershell
node --test supabase/hosted-auth/auth.test.mjs
```

Actual hosted result: **9/9 PASS**, documented in [EVIDENCE.md](./EVIDENCE.md).

Configuration comes exclusively from ignored `.env.hosted-test.local`, through the shared
`../hosted-tests/config.mjs` guard. Credentials, access/refresh tokens and generated
confirmation links stay in memory and are never emitted as diagnostics. Synthetic users
receive random passwords and emails; no invitation or mail-send method is called.
Cleanup deletes only exact user IDs created during this run.

For root's visible browser QA, `node supabase/hosted-auth/browser-fixture.mjs provision`
creates two synthetic confirmed accounts and writes their random credentials into
ignored `.env.hosted-browser.local` as JSON. After browser QA/logout, `cleanup`
validates both users against the run manifest, deletes only those users and removes
that local file. Repeated provisioning refuses to overwrite an existing manifest.

The matrix exercises actual hosted Auth and PostgREST through the installed Supabase SDK
and the application's Auth/account adapters: unconfirmed denial, one-use confirmation,
password login, safe signup responses, signup-triggered profile/settings, SDK session
restore, refresh rotation, sign-out, refresh revocation, actor switching, expected-subject
command denial and asynchronous ABA read isolation. Persistence uses the SDK's storage
interface in memory to model browser storage recreation; browser reload coverage is separate.

Fresh confirmation uses admin `generateLink(type: 'signup')` followed by SDK `verifyOtp`.
These APIs generate/consume a verification token without emailing a third party.
Public `signUp` success-without-session is tested on a confirmed duplicate email: GoTrue
returns the sanitized duplicate response before its email-send branch. Invalid-email
public signup is tested too. This does not establish SMTP delivery or fresh public-signup
email delivery; those need an owned inbox or a reviewed custom email hook before release.

Following explicit user authorization for one email to their owned inbox,
`signup-fixture.mjs provision` separately exercised actual fresh public registration
and recorded an unconfirmed server identity plus null adapter session. Credentials
are only in ignored `.env.hosted-signup.local`. It refuses existing accounts and
refuses rerunning an existing manifest, so it does not reset a password or resend.
Root owns mailbox click/redirect/sign-in evidence; `status` reports only the server's
confirmation state and `cleanup` removes only the exact generated signup fixture.

Sign-out invalidates refresh tokens and removes SDK persistence. Existing access JWTs
remain stateless and valid until expiration, as documented by Supabase; the matrix does
not report them as instantly revoked.

Primary references:

- [Generate a verification link](https://supabase.com/docs/reference/javascript/auth-admin-generatelink)
- [Consume an OTP/token hash](https://supabase.com/docs/reference/javascript/auth-verifyotp)
- [GoTrue public-signup implementation](https://github.com/supabase/auth/blob/master/internal/api/signup.go)
- [Sign-out semantics](https://supabase.com/docs/reference/javascript/auth-signout)
