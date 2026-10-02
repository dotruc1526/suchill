# Recovery callback software handoff — 2026-10-03

> Status: REVIEW; actual sender/mail/redirect acceptance pending

The optional AuthService recovery contract authorizes reset only from the SDK PASSWORD_RECOVERY event plus a server-verified matching subject. Query/fragment parameters only select the dedicated screen. A page-only grant binds subject/epoch and SDK session; signout/real signin/account ABA invalidates it permanently. Mutation uses the captured verified bearer, and transient offline/server failures remain retryable. Callback secrets are cleaned after proof consumption/rejection; failed initial exchange retains them only for explicit reload, never domain/UI/storage/log copies.

HostedApp shares one runtime per document so StrictMode/remount cannot consume the callback in a discarded SDK instance. It mounts recovery before HostedRuntime/learning/automatic queue sync. Password repeat/8..128 validation, focused errors, account-switch and stale-result guards are covered by tests; unchanged pending bytes are proven with owned fixtures. Earlier independent helper verdict APPROVE and the new integrated boundary evidence are in [M6 review](../m6-pwa/REVIEW.md) and AUTH-USERNAME-001. Existing retained user credentials/progress were not reset.

Live verified sender, exact project redirect allowlist, authorized recipient mail delivery and complete real-mail password reset still require evidence. Fixture tests cannot establish that acceptance. No backend migration/env/account mutation in this continuation.
