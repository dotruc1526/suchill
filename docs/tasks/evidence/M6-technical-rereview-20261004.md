# Independent software re-review — 2026-10-04

- Task: M6-M7-FIVE-ROLE-DELIVERY-20261004.
- Reviewer: delegated independent Codex technical reviewer; no human role impersonated.
- Scope: local commits 39b25ae, d47c104, 3efa17d over merged main f929035; M6 software regressions and current preview boundaries.
- Verdict: **SOFTWARE APPROVE for the reviewed local changes.** No demonstrated blocker in this bounded source/test review. This does not close M6/M7 or approve canonical content/public release.

## Actual independent checks

| Check | Actual result | Meaning |
|---|---|---|
| AI answer rendering, backend AI, LAN account access, PWA manifest | 10 PASS, 0 FAIL, 0 SKIP | Emphasis/paragraph rendering; model HTML inert; input/rate-limit/provider deadline and quota behavior; production proxy excluded; Vietnamese manifest |
| Development account proxy + PWA controller | 17 PASS, 0 FAIL, 0 SKIP | Anchored tunnel/LAN routing; normal production SDK preserved; safe update and queue locking; no automatic foreign-controller reload; bounded lifecycle metadata |
| Native Chrome reference preview suite | 6 PASS, 0 FAIL, 0 SKIP | All seven draft routes open; direct-route Back; five-scene VN knowledge retry/reflection/debrief; image loaded; original video and transcript; offline fallback; no progress/reward requests |

Commands actually executed: `node --test tests/qa/ai-answer.test.mjs server/tests/ai.test.js tests/member5/pwa-manifest.test.ts tests/member5/lan-account-access.test.ts`, `node --test tests/member5/account-proxy-config.test.ts tests/member5/pwa-controller.test.ts`, and `node --test tests/qa/preview1954-ui.test.mjs`. The first invocation additionally named a nonexistent pwa-worker test path; it did not execute a worker test and no worker test count is claimed. Root runs full quality independently; this review did not compete with it for production build mutation.

AI SSR harness emitted nonfatal existing HMR-port/dependency-scan warnings (virtual reference module absent in config-less scan); all three renderer checks completed. This is test harness noise, not a proved runtime defect.

## Source conclusions

- AI output is escaped React text with a deliberately small emphasis subset, never HTML/active links. New prompt requests short explanations for younger readers and does not falsely claim retrieval. Factual response quality remains dependent on provider output and requires learning/content evaluation.
- Chapter availability changes only internal preview policy. Draft labels and noXP notices persist; canonical catalog, trusted completion, migration and immutable publication are untouched.
- VN is reached inside lesson 6 and is lazily imported. Reflection selection is neutral; wrong knowledge choices explain and permit retry; scene/feedback/debrief receive programmatic focus; motion honors reduced motion. Current fixture has choices in scenes 1–4 and only the last scene lacks choices, matching the implementation.
- Preview Chrome tests include 375px portrait/844px landscape and 200% CSS root text sizing without horizontal document overflow. This is simulated reflow, **not browser UI zoom or physical-device acceptance**.
- LAN/tunnel account proxy is confined to validated development contexts. Ordinary HTTPS hosting does not forward credentials to the PvP backend. AI requests omit credentials and cannot become indefinite waits.
- Existing M6-02/03/05 software acceptance is not contradicted by these changes. M6-01 manifest software passes; actual installed-icon launch remains outstanding. M6-06 automated evidence does not establish manual assistive-technology acceptance.

## Nonblocking follow-ups and acceptance gaps

1. Generated VN PNG is 2,274,947 bytes in current dist. It is deferred with the VN rather than entry bootstrap; optimize a reviewed WebP/AVIF rendition for weak devices before canonical release performance acceptance.
2. NovelStage is a linear fixture player, not the canonical scene-graph renderer. Intermediate no-choice scenes previously completed early; the root-assigned follow-up below repairs that path. Do not expand this component into canonical story delivery without an explicit renderer contract/task.
3. Actual desktop installed icon launch, TalkBack/VoiceOver/screen-reader reading and announcements, browser UI zoom, target Android/iOS matrix, and release performance acceptance are not produced by this audit. Retain M6-01/M6-06 REVIEW and M6-07 dependency state until their evidence exists.
4. Historical/media source/date wording, rights and reviewed canonical lesson versions remain specialist gates. Current Genève fixture is explicitly unreviewed illustrative content. All7 preview entries are not7 finished lessons; M7-03..09 cannot be accepted from UI tests.

Only this evidence file was changed by the reviewer. No environment, credentials, accounts, migration, dependency, runtime source, hosting or publication change. Root may use this bounded software verdict for integration, preserving separate missing acceptance.

## Root-assigned follow-up repairs and re-review

Root assigned `NovelStage.tsx` and isolated navigation fixtures/tests after the initial review. Non-choice intermediate scenes now offer Continue and advance one scene; final scene alone offers debrief and completion. Native Chrome regression **1 PASS** confirms intermediate completion count0, final count1, focus on new title, unrelated local progress preserved and no reward/service request. No XP callback added.

Content-lane corrected internal story independently re-reviewed: original fixture remains unchanged; revised story has a separate preview identity and stable sceneIDs; remote images removed, document dates distinguished, later implementation not stated as completed. Corrected AI/render/draft regression **5 PASS**. This is software approval, not a substitute historical verdict.

Root then assigned diagnostic and owned-browser cleanup repairs in `tests/qa/chromeHarness.mjs`. Startup/CDP timeouts include a bounded4000-character tail from that owned child only. Cleanup requests Browser.close before disconnect, falls back to the recorded owned PID tree on Windows, and preserves an original test failure if cleanup also fails. Ownership unit **3 PASS** verifies exact PID-specific taskkill arguments, no kill after exit and no tree command for missing/unsafe PID.

The standalone lazy-browser suite exposed a cleanup EBUSY that had obscured a first-test startup error. After repair, cleanup succeeds and the real failure is visible: `Page.getFrameTree` times out before application assertions; second offline/recovery test passes. Chrome stderr shows external-extension registry probes, background registration and updater access-denied diagnostics. This establishes a local browser infrastructure failure, not its definitive cause. Root must retain the failed local full-quality result honestly and use exact-head CI plus further isolated verification; no timeout, retry, assertion or test removal has been made.

Root authorized disabling extensions/background networking/component updates/sync in the fresh owned QA Chrome profile only. App network, service workers, deadlines and every assertion remain enabled. Standalone lazy suite rerun **2 PASS,0 FAIL,0 SKIP** after those isolation flags, including the earlier failing initial fetch/state preservation and explicit offline recovery. Expected failed dynamic imports in the offline scenario are deliberate assertions, not unexpected app errors. Earlier failed aggregate runs are superseded only for this isolated lazy suite, not retroactively claimed as full quality success.

Follow-up files changed: NovelStage, novel-stage-navigation test and two fixtures, chromeHarness and chrome-cleanup test, this report. No environment/migration/account/reward/hosting change; no commit by delegated reviewer. Root is independent reviewer of these delegated source/harness repairs.
