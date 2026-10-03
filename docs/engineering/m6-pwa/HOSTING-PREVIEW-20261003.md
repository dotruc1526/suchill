# M6 temporary Hosting preview — 2026-10-03

Status: REVIEW candidate; independent technical acceptance and actual Android results pending. This does not close M6 or open M7.

## Deliverable

- Project/site: `suchill-preview`, existing Spark project. Temporary channel `m6-android-1954`, seven days; no live deployment or billing change.
- App: https://suchill-preview--m6-android-1954-p8pbahbd.web.app/
- Reference video: https://suchill-preview--m6-android-1954-p8pbahbd.web.app/reference
- PWA build: `bfc05ef6fabc8087b4c0`. Expires 2026-10-10 03:08:46 Asia/Bangkok (2026-10-09T20:08:46.649631383Z).
- Video SHA256 remains `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`; manifest remains `d1bfd0bd021df6bd52a00eb6bac5dbe3c7dbe814a13a0e1edd7d485c23647474`. Video/audio/captions/transcript package unchanged.

## Changes and findings repaired

1. Reproducible multi-entry app/reference build; fixed output directory with ancestor/symlink guards, pinned manifest and four media hashes, output inventory allowlist and privileged-credential rejection. Only explicit public Supabase URL and publishable/anon key reach Vite; private environment loading disabled.
2. Existing worker could substitute app HTML for `/reference`. Reference/media/script routes now bypass worker interception. Regression covers exact route and nested navigation; reference media and Auth/API remain outside PWA caches.
3. New HTML entry enabled local Vite SPA fallback for invalid reference URLs. Local server now uses MPA mode; invalid/traversal/media requests remain rejected.
4. Firebase's real HTTPS endpoint returned HTTP200/full19,289,629 bytes for a Range request, despite `Accept-Ranges: bytes`. Initial HTTPS resume failed. Internal-preview adapter now downloads bounded unchanged bytes once into page memory, verifies size/SHA256 and supplies an object URL to the existing native player. Requests omit credentials and use no-store; unload releases the URL. Playback starts after the download, and transcript remains available while loading or on failure. No reencoding or persistent video cache.
5. Security headers, exact reference no-store routes, noindex and static assets with immutable cache; index/manifest/sw revalidate. Firebase Auth domain synchronization disabled; Supabase stays the backend.

## Verification

- `npm run quality`: PASS, 381 passed / 0 failed / 3 native-only SQL skips (268 unit, 38 component, 62 database, 11 browser, 2 PWA). Authoring validators also passed. No new native SQL execution is claimed.
- Additional reference/release/packaging suite: 15/15 PASS after MPA correction. New transport tests: 2/2 PASS, including exact bytes, shared download, URL lifecycle and oversized/truncated/tampered/unavailable responses.
- Typecheck PASS after transport edit. Final client-secret scan: 664 files, zero unsafe matches.
- Final local production smoke PASS: active worker → reference route, manifest/installability, 1080×1920 native video and 28 caption cues, playback/checkpoint17/reload/resume, unrelated storage preserved, no completion/reward, 375/430/landscape without horizontal overflow, transcript fallback and private/reference cache exclusion.
- Actual HTTPS headers/MIME for app/reference/manifest/worker/icons/VTT/transcript PASS. Final HTTPS player smoke PASS after repair; remote full video SHA256 matches the unchanged source. The raw endpoint still returns HTTP200/full-file to Range requests; that is not a byte-range PASS.
- These browser checks use a separate owned Chrome profile. Emulation is supplemental; no Android/TalkBack/iOS/desktop-icon-launch PASS is inferred.

## Handoff

Files changed: `.firebaserc`, `firebase.json`, `.gitignore`, `.github/workflows/quality.yml`; `scripts/release/build-hosting-preview.mjs`, `hosting-preview.test.mjs`, `hosting-browser-smoke.mjs`; `scripts/content/reference-preview/index.html`, `entry.tsx`, `services.ts`, `serve.mjs`, `video-source.ts`, `video-source.test.mjs`; `scripts/pwa/worker-source.ts`, `tests/qa/pwa-lifecycle.test.mjs`; hosting card, board and deployment/device docs. Existing unrelated `output/` files are excluded from staging.

Environment/migration impact: frontend preview uses existing public Supabase configuration. No Supabase migration/account/password/progress/redirect mutation, Firebase SDK/backend, canonical publication, new video, live promotion or merge. CLI authenticates through official Firebase OAuth; credentials remain in CLI-managed state outside repo.

Known limits: preview video downloads ~19MB before playing; weak-device/slow-network memory/performance requires genuine Android evidence. Firebase byte-range limitation is recorded, not labeled PASS. Historical cue27, voice/music/SFX rights, manual screen reader/device acceptance, recovery email callback allowlist and full multi-lesson1954curriculum remain open. Independent reviewer has not accepted this continuation. M6-01/06 stay REVIEW, M6-04/07 stay BLOCKED, M7 stays LOCKED.

Next: verify final HTTPS smoke/hash, preserve exact commit/CI evidence, collect actual Android model/OS/Chrome and install/icon/playback/caption/resume/rotation/large-text/offline/TalkBack observations. Reviewers accept only demonstrated criteria; PO closes M6 and opens M7 separately.

[Firebase preview channels](https://firebase.google.com/docs/hosting/test-preview-deploy) · [CLI](https://firebase.google.com/docs/cli) · [channel lifecycle](https://firebase.google.com/docs/hosting/manage-hosting-resources)

## Actual Android Auth finding and corrected environment — 2026-10-03

User reported a created account could not log in by username on Android; full Auth/device acceptance therefore did not pass. Live OPTIONS and POST to account-access reproduced403/no CORS for the exact preview origin. Dashboard had no custom secrets, so original four default local origins were preserved and ACCOUNT_ACCESS_ORIGINS was set to those plus ONLY https://suchill-preview--m6-android-1954-p8pbahbd.web.app. No wildcard/suffix rule, password/account/progress/JWT/RLS change, Auth redirect change or frontend rebuild. This is the one backend environment change in this continuation; the earlier hosting-only no-backend-impact checkpoint predates it.

After Save, live preview OPTIONS204 with exact ACAO; arbitrary domain403/no ACAO; existing localhost8443OPTIONS204. New CORS tests plus username server tests20/20PASS. A separate new disposable QA identity completed actual same-origin-header signup→signout→same-UUID username login→0XP account read; incorrect password rejected and session identity preserved. No user's account was used/changed; the QA identity is retained, no deletion or credential publication. Configuration proof is retained locally at C:/Users/Thinkpad/Desktop/suchill/output/hosting-preview-cors.png; it shows only public origin-setting name/digest.

User was asked to reload and retry the existing username/password, without creating another account. Actual Android retest pending. REVIEW remains; login availability repair is not independent QA acceptance or full M6/M7 closure. Remove ONLY this temporary origin when its channel is retired; preserve the four prior local origins. Configuration storage and immediate application follow [Supabase environment documentation](https://supabase.com/docs/guides/functions/secrets); browser preflight context follows [Supabase CORS docs](https://supabase.com/docs/guides/functions/cors).

## User retest — 2026-10-03

User replied “Đăng nhập được” after reloading/retrying on Android. The reported username-login finding is resolved with actual user acceptance; no new account or password reset was needed. Install/icon/video-resume/rotation/offline/TalkBack and device/version details have not yet been supplied. Root requested those remaining observations. This confirms only login, not full device/milestone acceptance.

Hosting/code commit e9accf3c677f6a04552acfe2907956f7cc1eec7e: GitHub Quality2/2SUCCESS ([push](https://github.com/dotruc1526/suchill/actions/runs/37059064188), [PR](https://github.com/dotruc1526/suchill/actions/runs/37059068125)). Follow-up CORS-regression/evidence commit103c513c81004b908cabed6f57c29dcb0378c775 CI was in progress at this checkpoint; no old-head result is claimed for it.

## Latest accepted user observations and CI — 2026-10-03

User clarified “Đã thử hết, đều chạy được”: basic Android install/icon, video/caption/resume, rotation/large text and offline opening PASS by user report on build bfc05ef6fabc8087b4c0. Model/version/TalkBack, two-build update and other devices are not confirmed. No full device/WCAG/milestone closure is inferred. Commit8c5244dea182731bdf6ee98f00ab2d46b589148f Quality2/2SUCCESS ([push](https://github.com/dotruc1526/suchill/actions/runs/37060437982), [PR](https://github.com/dotruc1526/suchill/actions/runs/37060444972)); prior103c513 Quality2/2SUCCESS as well. The user next requests Chapter1/1954 and only episode1 open, tracked in [MVP-1954-CATALOG-001](../../tasks/done/MVP-1954-CATALOG-001.md).

## Chapter1/1954 catalog continuation — 2026-10-03

User supplied the seven-episode outline and requested Chapter1—Năm1954 in HỌC, existing Tập1—Trước cơn bão open and Tập2–7 temporarily locked. This approved preview placement supersedes the technical fixture presentation only in the explicit Hosting-preview build. Outline remains DRAFT authoring input; no new facts/quiz/reward package, canonical database seed, media/audio edit or publication approval.

Changes: preview-only learning read model with stable episode IDs; six disabled buttons, handler and hash-route guards; home/chapter/inline-video navigation with back/focus and safe PWA-update state. Lazy player/media load only on episode1 opening. Existing local services and verified19MB transport relocated to canonical src/services/reference1954 and reexported from scripts for compatibility. Original context IDs, SHA storage key and files are preserved. No automatic XP/completion/unlock or private account/progress changes. Account/SDK/recovery/routes for normal published builds are unchanged.

Verification: npm run quality PASS381/0fail/3nativeSQLskips, finalscan680/0unsafe. Additional19 release/package/reference/transport/CORS tests PASS. New3 tests PASS: availability/direct-route denial, real Chrome integrated catalog/disabled states/back/focus/375/430/landscape/200%type/reduced motion, exact native1080video/28cues/17second reload resume, unrelated storage preserved/no completion or backend request, media failure with transcript/retry. Local production and final actual HTTPS reference smoke PASS. No new native SQL execution.

Actual hosted UI in the existing signed-in browser was inspected after the safe update at Home: HỌC shows CHƯƠNG01/NĂM1954; seven correct titles, six disabled controls; episode1 opens inline. Existing30XP/2-day account summary stayed unchanged. Screenshot proof retained locally at C:/Users/Thinkpad/Desktop/suchill/output/chapter-1954-preview.jpg. Browser inspection did not play/complete a canonical lesson or change the user's account. Physical Android previous basic checks PASS by user report; this new UI has automated/real HTTPS browser evidence, not a new physical-phone/TalkBack verdict.

Same temporary channel updated successfully; build cdc8b3db5c5f0b5ade70, expires2026-10-10 03:43:37 Asia/Bangkok. Original MP4 SHA256 and manifest unchanged. Logs: output/hosting-preview/catalog-{quality,tests,reference,build,production-smoke,https-smoke}.txt and catalog-deploy.json. REVIEW handoff pending independent reviewer. M6-01/06 REVIEW, M6-04/07 BLOCKED and M7 LOCKED remain; rights/cue27/manual screen-reader/full-device/multi-lesson content gates are not bypassed.

## Current reviewed candidate — 2026-10-03

Build37ad329a8f1a2abd4cff, source0925a30;85e4f3c integrates docs-only approved M7 scheduling decision. Same temporary URL expires2026-10-10 04:16:46 Asia/Bangkok. Quality381/reference19/catalog4 PASS; actual HTTPS smoke and independent hosting/browser/hash re-review PASS; exact85e4f3c CI push/PR SUCCESS. Safe Home update in existing IAB preserves30XP/2days; all seven titles/six disabled buttons observed, episode1 sources expanded and UIBack→browserBack returns Home. Original MP4/sidecars/manifest unchanged. Accessibility reviewer SOFTWARE APPROVE after fresh axe8targeted states; manual/full-device/media gate remains open. Hosting/catalog are bounded technical tasks only; M7 now OPEN alongside M6 by latest approved PO decision, superseding earlier LOCKED checkpoints. Isolated prior-version rollback PASS; no live/backend/schema/account mutation in these repairs. User requests no further device paperwork; no unknown manual/rights result is converted to PASS.
