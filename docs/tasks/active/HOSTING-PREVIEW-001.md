# HOSTING-PREVIEW-001 — HTTPS preview for actual Android checks

> Status: REVIEW
> Last updated: 2026-10-03

- Owner: Codex root, under the user's M6–M7 request and Android test input.
- Executor: root.
- Reviewer: independent technical reviewer; actual phone results from the user.
- Started: 2026-10-03; READY → IN PROGRESS after software prerequisites and explicit Firebase project/terms approval.
- Depends on: M6-02/03/05 DONE; MVP-1954-001 bounded internal-preview DONE; user confirms Android and Google two-step verification, explicitly approves Firebase terms/project creation.
- Files claimed: firebase.json, .firebaserc, .gitignore; scripts/release/build-hosting-preview.mjs; scripts/content/reference-preview/index.html; this card and task board. Existing video/audio, App/router, production content and migrations are unchanged.
- Acceptance: verified Spark project/site suchill-preview; reproducible static app plus reference-preview build; only publishable/anon client configuration, no secret or account data in hosted files; reviewed headers/SPA fallback; temporary HTTPS preview URL and real browser smoke tests. No live channel/canonical publication or full M6/M7 closure.
- Next action: prepare/review build and Hosting config, authenticate official CLI through the user's authorized Google session, deploy a temporary preview and obtain actual Android observations.

Project was created through Firebase console after action-time terms approval. Gemini/Analytics/developer-program signup were disabled in setup. Console verifies Spark ($0/month) and project ID suchill-preview. Existing Supabase remains the backend; Firebase SDK/backend/billing is not added.

Firebase preview URLs are public to anyone knowing the URL; this is a time-limited test build, not a canonical content release. [Official preview behavior](https://firebase.google.com/docs/hosting/test-preview-deploy). Final1954wording/rights, full curriculum, manual/device and release gates remain recorded separately.

## Continuation claim — 2026-10-03

Root resumes the existing IN PROGRESS claim. Additional files claimed before edits: scripts/pwa/worker-source.ts and tests/qa/pwa-lifecycle.test.mjs for the reference-route navigation defect; scripts/release/hosting-preview.test.mjs for packaging/security checks; docs/platform/release/FIREBASE-PREVIEW.md and DEVICE-MATRIX.md for verified deployment/test evidence. Reviewer remains independent technical review pending; no human reviewer is impersonated. The reference media package is immutable. Build will use only two explicit public Supabase values and a fixed output directory; no private env loading or live-channel deploy.

Root additionally claims scripts/release/hosting-browser-smoke.mjs and .github/workflows/quality.yml before edits: reproducible isolated-profile smoke verification and CI execution of the new package tests. Real-device observations remain pending; browser emulation is supplementary only.

Root additionally claims scripts/content/reference-preview/serve.mjs before a narrow fix. The new multi-entry HTML exposes Vite SPA fallback on invalid reference URLs; use MPA mode so invalid requests remain denied. No package/content modification.

## HTTPS finding and repair claim — 2026-10-03

Real Firebase preview returns HTTP200/full19,289,629 bytes to Range requests. HTTPS browser resume therefore fails, while local range-serving smoke passes. Root claims scripts/content/reference-preview/video-source.ts, video-source.test.mjs, services.ts, entry.tsx and the new hosting evidence report. Repair is bounded to internal preview transport: download unchanged bytes once in page memory, enforce size/SHA256, use a local object URL for seeking, release on unload and retain transcript fallback. No reencoding, persistent video caching, new content or backend mutation. Reviewer acceptance remains pending.

## Completed implementation handoff — 2026-10-03

Executor IN PROGRESS → REVIEW after local and actual HTTPS smoke PASS. [Evidence](../../engineering/m6-pwa/HOSTING-PREVIEW-20261003.md). Channel m6-android-1954 deployed successfully, expires2026-10-10 03:08 Asia/Bangkok. App https://suchill-preview--m6-android-1954-p8pbahbd.web.app/ ; reference /reference. Video/audio/package hashes unchanged. Quality381PASS/0fail/3nativeSQLskips; reference15/15PASS; transport2/2PASS; typecheck and final source/bundle security scan PASS; actual HTTPS player/caption/resume/fallback/cache/header/hash checks PASS. Native byte-range limitation repaired in internal-preview transport, not in the media. No env/schema/migration/account/Auth redirect/billing/live impact.

Root performed implementation self-review and automated/browser checks; no independent reviewer acceptance is claimed for this continuation. Actual Android/TalkBack results were requested from the user and are pending. Next action: reviewer evaluates this commit/evidence, collect phone results and fix concrete findings. M6 content/rights/manual/device gates remain unresolved; M7 stays LOCKED and no task-level DONE is inferred.
## User Android finding — 2026-10-03

User cannot log in by username on Android HTTPS preview; created account does not imply successful browser login. Technical unauthenticated/player smoke remains valid, full Auth/device acceptance fails. Root reproduced exact-origin CORS403; repair claimed under AUTH-USERNAME-001. This task remains REVIEW pending corrected Auth and actual-device review.

Android Auth finding technically repaired: exact CORS origin configured, live separate QA signup/login/read and arbitrary-origin rejection PASS. User retest pending; [evidence](../../engineering/m6-pwa/HOSTING-PREVIEW-20261003.md). CORS configuration is the sole follow-up backend environment change. No independent review/user PASS is inferred.
