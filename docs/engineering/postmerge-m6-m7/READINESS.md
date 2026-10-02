# Post-merge M4/M5 acceptance and M6/M7 execution readiness

> Date:2026-10-02. Exact reviewed main:8b5ae10befec6390257a2e4cb94dfb4c7af9a081, mergedPR106.
> New isolated branch:codex/m6-pwa-completion. Root contributor checkout remains untouched.

## Main re-review result

Independent postmerge_main_review:APPROVE technical M4/M5, no new actionable runtime finding. Fresh Quality330PASS(230unit/29componentAuth/62SQL/9originalM3Chrome), real hosted9/9 with exact owned cleanup, scan542files/0unsafe. Native72/72 through030 remains applicable because source/tests/migrations001–030 match reviewedPR106 parent2; not rerun. [Review](./MAIN-REVIEW.md), [Quality](./quality-main.txt), [hosted](./hosted-main.txt).

User requested completion throughM7 after merging. Sequential PO closure/opening question is pending; no locked milestone implementation is claimed. M4technicalcardsDONE, M4OPEN; M5technicalchecksAPPROVE but cardsBLOCKED; M5–M7LOCKED until recorded PO gate. Source, published content, credentials and hosted schema are unchanged in this audit.

## M6 task readiness (independent m6_readiness_audit)

| Task | Current state | Concrete implementation / acceptance still required |
|---|---|---|
| M6-01 Manifest/icons | Missing | Owned192/512/maskable/Apple icons,manifest,vi/title/theme metadata; actual install/launch and independent UI review. |
| M6-02 Worker/update/offline | Missing | Build-generated exact static allowlist/version; offline/deep-link document; manual safe-state update; durable queue/Auth untouched. Actual two-version lifecycle and private-cache denial tests. |
| M6-03 Lazy/assets | Missing | Split tabs/overlay/VN/video/quiz and hosted eager consumers; retryable lazy-load errors; optimize owned branding PNGs; measure initial transfer and deferred chunks. |
| M6-04 Mobile video | BLOCKED | CONTENT-007 has no final reviewed MP4/mobile/audio rights/poster package. Existing technical player is not canonical media. |
| M6-05 Polish | Foundation reusable | Review new PWA states at375/430,zoom,safearea,keyboard,mute/reducedmotion using existing tokens/primitives. |
| M6-06 Accessibility | P2 reproduced | textMuted#A0622A contrast3.560:1/nav,4.003:1/app,4.493:1/card; inactive BottomNav9px labels use it. Fix claimed central token/small text; correctvi/title,main/skip semantics; final manual/screen-reader review. |
| M6-07 Device matrix | BLOCKED | Actual Android Chrome installed/browser and iOS Safari+A2HS install/launch/update/offline/sound/low-end performance. Desktop emulation cannot replace these rows. |

Baseline entry JS659611bytes,CSS31412; owned mascot/logoPNG1615784/1597140bytes. No current M6 task cards,manifest,icons,worker or lazy route package. Cards/hotspot claims must precede implementation after PO gate. Root owns App/tokens/CSS/package/PWA config; delegation must avoid shared hotspot edits.

PWA cache design: fixedsw.js generated from exact static build output; anonymous fixed shell/offline/icons/manifest/bootstrap imports/CSS only, credentials omitted. Allowlisted deferred hashed chunks cache on visit. Never cache nonGET,Authorization-bearing,query-bearing,cross-origin,Auth/API/privateuser/Storage/signedmedia. No auto skipWaiting/reload/clearStorage; prompt only safe home without lesson/inflight writes, preserve pending byte-for-byte and old-tab assets. Lazy rejection/offline deep path must have recoverable UI.

Official design references: [installability](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable), [worker lifecycle](https://web.dev/articles/service-worker-lifecycle), [worker APIs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

## M7 task readiness (independent m7_release_audit)

| Task | Reusable evidence | Remaining blocker |
|---|---|---|
| M7-01 Pilot selection | CONTENT-002 selects Mậu Thân1968/Kế hoạch Giao Thừa |1972 authoring approvals do not change selected MVP; no silent substitution. |
| M7-02 Source/claims | Historical authoring/quiz reviews exist | CONTENT-003REVIEW/NEEDS_REVISION; duplicatedSRC-MT68-01..06 have different meanings at registry lines15–20 vs71–76; MAP-MT68 lacks historical verdict. |
| M7-03 Package | Curriculum/screenplay/narration/VTT/text fallback exist | CONTENT-007 final video/mobile/audio rights/poster/source export/manifest absent. |
| M7-04 Combined sign-off | Scoped hash-bound text/history/technical approvals reusable | Final media/audio/MP4,combined production handoff and CONTENT-005QA missing. |
| M7-05 Canonical import | Schema/publication safety exists | M7-04 unmet. May prepare validator/dry-run after claims; do not seed/publish technical fixtures as canonical. |
| M7-06 RC QA | M4/M5 regression/security foundation | Need canonical import,M6/device/media/content gates,productionkey follow-up and account deletion/export/request flow. |
| M7-07 Firebase preview | Deployment plan approves Firebase | No config/CLI login or confirmedproject/site/env/previewURL; privacy/terms/contact/actualretention missing. |
| M7-08 User testing | Automated checks exist | No actual users/device findings for a usablepreview. |
| M7-09 PWA release | None claimed | Abovegates,release/version/rollback and publicURL required. |

Mậu Thânmandatory route is text/schematic withmediaRef:null; candidateassets6/8BLOCKED+2/8pendingoptional. Use approved text/schematic approach to avoid unnecessary third-partyasset licensing; it still needs one finalvideo. Record new authorized narration with no music/SFX under approvedplanning; do not reuse EdgeTTS/poem or reference1954 video. CONTENT-006 isREFERENCE_ONLY/outsidecanonicalscope.

Independent4/4 authoringvalidatorsPASS. Screenplay hash6d1bf23a…e9d56 matches postPR65approval; registry32914d59…cc481 matches authorizedstatus-onlysync. NarrationLFb9e7d17f…37ed/captionsLF917854f6…72c6d match card; CRLFdifferencesalone are not contentregression.1972 authoredfiles match exact approvedCRLFhashes. Preserve all approvedbytes.

Minimum genuine inputs: explicit sequentialPOgate decision; historicalreviewer-approved sourceIDreconciliation/map/finalrevision; authorizednarration/finalvideo package and mediareview; actualAndroid/iOSQA; Firebaseproject/site+authorizedHostingaccount and actualprivacycontact/environment; realinternalusers/testing andreleaseacceptance. Do not publish/create externalaccounts or sendteam messages by inference.

## Next work

After PO response and recorded M4/M5 acceptance, createM6cards and claim eligible01/02/03/05/06 scopes, implement/test/review them on this separatebranch.04/07 remainblocked by actualmedia/device dependencies. OpenM7 only after fullM6gate; no falseDONE or automaticrelease. Optionalusername recovery sender+dedicatedcallback/reset remainsAUTH-USERNAME-001REVIEW and may be completed under its separate activeclaim.
