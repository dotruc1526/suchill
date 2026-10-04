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

## Substantive study UI candidate — resumed execution

Task M6-M7-COMPLETE-CANDIDATE-20261004 assigns the technical lane `PreviewDraftLesson.tsx`, new `StudySections.tsx`, `StudyKnowledgeCheck.tsx` and `tests/qa/chapter-study.test.mjs`. Five formerly thin draft lessons now display three full sections each, interactive knowledge checks with deliberate submit, explanations and retry, takeaway and neutral reflection. The original three-point outline remains in a collapsible summary. Source-bound content is authored by the content lane; shared UI uses existing cards/buttons/tokens. Check selections use stable authored IDs; focus moves to feedback after submission and returns to the first enabled choice after retry. Preview checks do not record account progress, completion or reward.

Actual checks: TypeScript PASS; new native Chrome study suite **1 PASS**, followed serially by existing preview suite **6 PASS**, all zero failures/skips in the final runs. New suite exercises all five routes, all15 correct checks/explanations, wrong-first-answer/retry in each lesson, Space-key selection, focus, six reading paragraphs per lesson, portrait375/landscape844 and200% CSS text without overflow, direct reload resetting temporary answers, parent Back and preservation of unrelated fixture state. Fetch/XHR resource checks confirm no account/completion/reward API request. Root independently reused the shared components in episode1/6; original preview suite remains intact and passing.

Earlier new-suite cold-start attempt hit the already recorded Page.getFrameTree infrastructure timeout before UI assertions. A later run passed every interaction but failed an overly broad resource-name assertion because imported source modules were mistaken for API calls. The test now checks fetch/XHR API requests rather than module imports. After content gained extensionless companion imports, the test loader was corrected to use the application's Vite resolution. These are test-harness/fixture fixes, not removed product assertions. Final new-study plus existing-preview result is **7 PASS**.

These are real desktop headless-browser interactions with simulated viewport/text sizing, not physical phone or browser UI zoom/screen-reader evidence. Final source review of the lane's own UI belongs to root. No dependency/global style/App/types/DB/environment/publication mutation or delegated commit.

Read-only candidateImport review identified incomplete validation of individually empty source bindings and unresolved objective-entity bindings despite generated objectiveIDs. Root was notified to resolve or explicitly retain these import-preparation gaps; no import execution or approval is inferred.

## Final independent root integration review

**SOFTWARE APPROVE for the bounded seven-lesson internal candidate and import preparation.** Root repaired the two import findings: every section/check now needs a source binding; seven objective entities are returned; the generated story is checked with the existing graph validator. Independent `chapter1954-import-plan.test.mjs` rerun **2 PASS** verifies ordered domain references, graph validity, in_review/publicationAllowedfalse, private answers separate, rejection of partial chapters/broken answer keys/unknown or empty source bindings, and paragraph identity preserved on reordering. This prepares a trusted import; it neither executes an import nor maps the domain IDs to production database UUIDs.

Source re-review of StudyCompanion, PreviewEpisode, PreviewLessonSix, correctedPreview and the video loader found no new account/reward/publication authority. Episode1/6 use the same source-bound reading/check UI. Original/corrected video switch uses separate keyed players and separate SHA256-based local progress storage. Both media-service adapters remain internal/draft and completion/account operations remain unavailable. Corrected video is an imported build asset, resolved lazily on request, verified by size and SHA256 before a blob URL is created; captions/poster/transcript are matching static candidate assets. Existing default resource option resolves the outer default byte count before the function-body scope; it has no temporal-dead-zone error.

Independent original-video transport suite **2 PASS** retains exact-byte/hash validation, shared download and disposal, plus malformed media rejection. A separate assertion script exercised the new custom resource option with a3-byte known-hash fixture: custom URL used, credentials omitted/no-store, correct blob returned, invalid sizes0/negative/fractional/over50MB rejected. No browser launched during root full quality. Root reports its all7 companion/native corrected-video browser test PASS; this report distinguishes that root evidence from the independently executed suites above.

The config-less SSR import suite still emits nonfatal dependency-scan/HMR warnings; both assertions pass. Minor presentation follow-up reported to root: the download-size hint should distinguish original19MB from corrected15.7MB. This is not a release blocker. Real media listen-through/caption acceptance, historical/learning verdict, physical device/accessibility and trusted DB-import/publication decisions remain separate; no full M6/M7 completion or release acceptance is invented.
