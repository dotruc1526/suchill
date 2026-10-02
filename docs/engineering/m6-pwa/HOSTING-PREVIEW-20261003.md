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
