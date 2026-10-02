# M6 software candidate — review and handoff

> Status: REVIEW — software validation complete; full milestone acceptance outstanding
> Date: 2026-10-03 (Asia/Bangkok)

Runtime candidate: 1ec31c5216c0cb87a2adbc757720f4514c18ce2a, including main b9a0f0d (PR111). Branch codex/m6-pwa-completion; draft PR109. No merge conflict. M4/M5 closure and M6 opening are approved by DOC-020/DOC-021; M7 remains locked.

## Verification

| Check | Result | Scope / limit |
|---|---|---|
| TypeScript / production build | PASS | Configured development backend; browser bundle has public configuration only |
| Unit | 268 PASS | Includes21 recovery,16 PWA controller and1 manifest checks |
| Component / Auth / Chrome recovery / lazy | 38 PASS | Includes actual HostedApp StrictMode/remount with one-time callback fixture |
| SQL | 62 PASS,3 native-only skips | Existing SQL suite; applied migrations001–030 unchanged |
| Original M3 Chrome + PWA polish | 10 PASS | Original9 assertions/tests preserved,1 new polish test |
| Two-version Chrome lifecycle | 1 PASS | Actual generated workers/controllers; native WebLocks, multiple tabs, failed install |
| Authoring validators | 4 PASS | Main-approved historical/source/authoring inputs preserved |
| Source/tracked/bundle secret scan | 608 files,0 unsafe matches | Final runtime scan; no credentials printed |
| Total Quality | **379 PASS,0 failures** | Three native SQL skips are not PASS; reused native72 and hosted9 are separate prior evidence, not included |
| Optional desktop icon install/launch | **SKIPPED / unproved** | Installed Chrome lacks experimental PWA.install; manifest and installability checks pass, actual icon launch still required |

[Full Quality](./quality.txt), [worker and optional installation checks](./worker-review.txt), [metrics](./metrics.json). Current software received root integration review and regression repair. Earlier independent recovery helper approval remains recorded in AUTH-USERNAME-001; the newly integrated PWA/HostedApp boundary still requires final QA/reviewer acceptance. No named human review is impersonated and no new task is marked DONE from executor testing alone.

## Concrete review findings repaired

1. Chrome retains failed native module imports for the life of a document. Error boundaries keep the lesson readable, expose return/retry and ask the user to reload explicitly from safe Home after connectivity returns. Reload waits for the existing progress queue WebLock, checks Home/clean URL/online again, never clears pending/Auth storage and never occurs automatically inside a lesson/callback.
2. React StrictMode can execute a useMemo initializer twice. The callback-consuming Supabase runtime is now created once per browser document and reused on remount; the real HostedApp boundary fixture proves recovery stays authorized and learning/sync does not mount before dismissal.
3. Two Vite QA servers could conflict over HMR, and dependency optimization could replace a document after initial navigation. Owned QA servers disable HMR; the new harness rejects the previous document and waits for the final requested path. Original M3 tests were not weakened.
4. Small muted text failed contrast. Token textMuted#855022 achieves nav4.804:1/app5.402:1/card6.063:1; CSS alias matches. New skip link/focus ring/main landmarks work with keyboard; duplicate production offline banners removed while standalone/development M3 behavior remains.

## Cache/update contract

Only root-scope production builds emit sw.js. Development/Figma subpath previews do not register it. A content/policy hash binds a waiting worker to its build. Fixed anonymous shell/offline/icons/manifest/bootstrap JS/CSS are precached; exact build allowlisted deferred assets cache only when visited. Static network fetches omit credentials. NonGET,Authorization,Auth/API/private/Storage,query/cross-origin responses are not cached. Callback navigation stays readable offline and preserves URL parameters without caching tokens.

Updates require an explicit safe Home action. Queue lock waits are bounded; abort cancels only our queued request and never a progress operation or an acquired lock. The exact waiting worker/version is rechecked after the lock. Other tabs never auto-reload; previously visited old hashed assets remain available. Failed new installation removes only its own new cache and leaves the active build usable.

Known limits: unvisited lazy assets/video still need network; old static caches are retained for open tabs and can consume storage over repeated releases. Browsers without WebLocks require completing current actions, closing app tabs and reopening. No promise of fully offline video or canonical content cache is made.

## Performance and visual proof

Configured bootstrap JS:659611→620468 bytes (including shared static JS), about5.9percent smaller despite added recovery/PWA behavior. Current bootstrap gzip176813 bytes; baseline Vite-reported gzip185790 is rounded. Lossless owned images:3212924→2156280 bytes, about32.9percent smaller. Every decoded RGBA pixel and original PNG byte hash was verified identical. Deferred lesson/VN/video/quiz/practice/profile/AI chunks are separate. Mobile budgets/low-end device performance are not fabricated.

Actual mock production app:375×812,430×900,812×375 and375px with CSS root font200percent; no horizontal overflow, navigation targets>=44px and visible, keyboard bypass reaches main, AX tree exposes main/navigation/offline announcement. Reduced-motion/mute and original learning/reward/focus regression pass. These are desktop Chrome emulations/AX checks, not Android/iOS device or human screen-reader acceptance.

![375px](./pwa-375x812.png)
![Large text](./pwa-375x812-large-text.png)

## Remaining acceptance / ownership

| Task | Status | Next evidence / owner |
|---|---|---|
| M6-01 | REVIEW | QA desktop icon install/launch, then task verdict |
| M6-02 | REVIEW | Final reviewer verdict on worker/controller/UI plus supplied lifecycle evidence |
| M6-03 | REVIEW | Final reviewer verdict and genuine target-device performance |
| M6-04 | BLOCKED | CONTENT-007 final approved audio/MP4/mobile/poster/VTT/transcript; Trúc/content/media reviewers |
| M6-05 | REVIEW | Final UI/QA acceptance of supplied polish evidence |
| M6-06 | BLOCKED | M6-05 acceptance, complete automated/manual accessibility plus actual screen-reader evidence; Vinh/QA |
| M6-07 | BLOCKED | Approved video and Android Chrome browser/installed+iOS Safari/A2HS+desktop matrix; QA/testers |
| M7 | LOCKED | Complete M6 gate and explicit PO closure/opening before integration/release tasks |

Main PR111 accepts CONTENT-003 source/media preproduction and opens CONTENT-007 for the academic/non-commercial MVP. Approved registry source hash369205fcbd713a74acaa0149e6c21d2c3734260d4265e7b8f87edd5868e3bba5 stays intact; old source/rights planning blockers are superseded. User confirmed on2026-10-03 **no audio exports yet**. Nine p01a..p05 audio files and final rendered/reviewed package still absent. Another active owner has the production script/package claim; this branch does not overwrite it or manufacture media URLs/publication.

M7 additionally needs final content/historical/learning/media sign-off, immutable canonical import, complete security/content regression, Firebase project/site/environment, preview/internal-user results, privacy/contact/release/rollback decisions. Existing1972 approved authoring is not silently substituted for selected Mậu Thân MVP. Optional recovery email remains separate REVIEW: verified sender, exact hosted redirect allowlist and authorized actual mailbox/reset have not been proven. No user account/password/progress, backend schema, applied migration, dependency lockfile, root contributor source or production deployment was changed by this continuation.

## Reproduction / handoff

Run npm run quality with a local CHROME_PATH. npm run test:pwa checks two production versions without backend access. npm run test:pwa:install attempts the owned-profile experimental desktop install and reports unavailable protocol honestly. Icon regeneration: set PWA_SHARP_MODULE to an installed Sharp module path and run node scripts/pwa/build-icons.mjs; checked-in PNGs require no CI dependency addition. Original logo/mascot PNGs remain for lossless comparison. Services/adapters retain trusted/idempotent rewards; no PWA UI awards XP.

## CI asset correction — 2026-10-03

Git LFS tracks all icons and WebP assets. Quality checkout now enables lfs:true so the runner validates real binary assets rather than pointer files. This is an infrastructure-only correction; the reviewed runtime and379PASS source remain unchanged. Current-head GitHub checks are required; earlier head checks are not final evidence. Documentation check103cards/868local links PASS; staged source/tracked/bundle scan613files/0unsafe matches. Three moved CONTENT-003 task links repaired without touching authored/source/verdict bytes.
