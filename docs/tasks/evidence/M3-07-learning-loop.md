# M3-07 — Learning-loop execution and findings

> Status: REVIEW — full quality and accessibility regressions PASS; fixes await reviewer acceptance
> Date: 2026-10-02; owner Vinh; branch codex/m3-07-learning-loop-qa
> Base: main 2abd202 (PR97 claim/checklist merged). Runtime delta: shared LoadingState/ErrorState accessibility only; service contracts unchanged.

[Task card](../active/M3-07.md). PR97 Hưng/Dương acceptance covered the claim only. This execution record does not imply reviewer acceptance, DONE, Gate M3 closure or M4 opening.

## Executed matrix

Browser names below refer to [e2e.test.mjs](../../../tests/qa/e2e.test.mjs). New service/controller integration names refer to [m3-learning-loop.test.ts](../../../tests/member5/m3-learning-loop.test.ts). NEW means added by this task; EXISTING means independently rerun in full quality, counted once.

| Scenario | Exact test / fixture / expected result | Result |
|---|---|---|
| Start/Resume, back, re-entry | EXISTING `learning journey stays usable and uncut at mobile widths`, `learning journey moves focus on forward and back navigation`; production technical catalog, 375/430px; heading/opener focus and Start/Resume remain correct | PASS |
| Journey → ordered players → completion/profile → account isolation | NEW `learning loop: journey → ordered players → completion → profile → re-entry/account isolation`; real models + mock shared store, users a/b; VN neutral choice, required video progress, 30 confirmed XP/one streak day, journey completed, reload grants once, b has zero XP/no receipt | PASS |
| VN branches, back/restart, late responses | EXISTING `M3-03 traverses all scene types and honors both knowledge policies and narrative branching`, `M3-03 resumes exact confirmed scene and replay never rolls progress back` in m3-visual-novel-v2.test.ts; existing browser close/keyboard tests | PASS |
| Required watched video | NEW journey/player loop above: VN alone remains ineligible; saveVideoCheckpoint [0,90] for duration100 permits completion; loadVideoPlayer resumes90. EXISTING completion threshold/reach_end gap/version tests | PASS; model ranges simulated, no real playback certification |
| Optional video | NEW `learning loop: optional video never bypasses required acknowledgement`; optional video unwatched, required recap missing remains ineligible; acknowledgement confirms standard receipt/10XP. EXISTING optional-only fail-closed test | PASS |
| Accessible video fallback | NEW `learning loop: fallback video never bypasses required acknowledgement`; published transcript + authored fallback + explicit accessible_fallback action still requires recap acknowledgement; receipt method accessible_fallback/10XP. EXISTING keyboard video retry fixture | PASS; service fallback simulated, canonical media not certified |
| Practice quiz → completion | NEW `learning loop: practice quiz consumer gates confirmed rewards and retry`; submitted wrong answer permits completed practice, 0XP, requiredLessonCount1; no scored reward | PASS |
| Scored quiz → completion | NEW `learning loop: scored quiz consumer gates confirmed rewards and retry`; wrong grade ineligible, correct trusted receipt retry stable, confirmed25XP, replay never grants twice | PASS |
| Lost response + summary outage | NEW `learning loop: lost completion response and summary outage recover without minting twice`; mock writes once but first response offline; controller retry same operation ID; confirmed receipt survives summary error; read retry total10XP and no extra completion calls | PASS |
| Completion/profile pending, read retry, re-entry | EXISTING `completion/profile loop retains confirmed service totals, retry intent and mobile focus`, plus m3-completion-controller.test.ts stable intents/stale reads/foreign account tests | PASS |
| Deterministic loading/error/offline/empty | NEW browser `M3-07 deterministic renderer states, quiz retry, long Vietnamese and mute persistence at mobile widths`; learning-loop.tsx holds real renderer service promise, typed offline error, Enter retry, empty blocks after reload | PASS including loading/error announcements after remediation |
| Valid zero/empty vs error summary | EXISTING `account summary distinguishes empty/error from confirmed zero and exposes retry` component test; controller `null, zero XP and unauthorized summaries remain distinct` | PASS |
| Status/error announcements | NEW browser checks quiz submit failure role=alert, feedback role=status, result focus; existing completion/profile regions. Loader/error role/status message assertions now enforced at both widths | PASS; P2-01 fixed, re-review pending |
| Long Vietnamese | NEW integrated renderer + practice/scored quiz fixture has long Vietnamese titles/prompts/options/feedback; no horizontal overflow before/after results at375/430px | PASS; system-font fallback interaction only |
| Mute persistence | NEW browser uses real soundService via fixture button, verifies localStorage and aria-pressed after document reload | PASS for preference; audible output/autoplay not certified by this fixture |
| Keyboard, targets, reduced motion | NEW browser Enter retry/submit/mute, result focus, labels/buttons >=44px. Existing VN/back/mobile tests. Emulated reduce/no-preference/reduce; loader animationName none/spin/none at both widths | PASS; P2-02 fixed, re-review pending |

## Historical findings at23e810a — fixed in remediation, re-review pending

1. **P2-01 — lesson loading/load failure has no live announcement.** Affected M1 shared states and M3 lesson/quiz initial loading/read error. Reproduce: open learning-loop.html, hold lesson promise, release offline; visible Vietnamese message changes but neither state exposes role=status/alert or aria-live. Both widths produce `announcement:false`, `load error has alert/live region = false`. Locations: `src/components/ui/states/LoadingState.tsx`, `src/components/ui/states/ErrorState.tsx`; consumed by LessonRenderer/QuizFlow. Missing acceptance: Phase8 status/error announcements. User authorized repair after both reviewers confirmed the finding; separate runtime claim [M3-07-A11Y-01](../active/M3-07-A11Y-01.md) recorded before source edits. Fix: role=status/alert with aria-atomic and decorative elements aria-hidden.
2. **P2-02 — loading spinner keeps spinning under reduced motion.** Same controlled loading state with CDP prefers-reduced-motion:reduce: computed animationName `spin` at375/430px. Location: `src/components/ui/states/LoadingState.tsx`. Missing acceptance: Phase8 reduced-motion handling. Fix under the separate claim: motion-reduce:animate-none. Diagnostic-only audit replaced with assertions for computed animationName none/spin/none under live preference changes; both widths pass.

No new reward, account isolation or learning transition blocker was reproduced. Two initial test-authoring failures were corrected: practice correctly grants0XP; disabled fieldset descendants must be queried with :disabled rather than the input.disabled attribute. No product behavior was changed to make tests pass.

## Verification and handoff after remediation

- `node --test tests/member5/m3-learning-loop.test.ts`: 6/6 PASS.
- Focused new browser test: 1/1 PASS, both mobile widths; loading/error semantics and reduced-motion assertions pass. Before source fixes, the new assertion failed on missing loading status, proving the regression detects P2-01.
- `npm run quality`: exit0; typecheck/build PASS, **117 unit / 23 component / 9 browser E2E PASS**; client scan365 files /0 unsafe. Local log: /tmp/suchill-m3-07-a11y-quality.log (ephemeral, not repository evidence storage).
- `git diff --check`: PASS. No new CI result claimed until implementation is pushed.
- Changed files since23e810a: LoadingState.tsx, ErrorState.tsx, browser assertions, remediation card and parent card/index/board/status/evidence. Original integration suite and fixtures unchanged.
- Runtime impact: all shared LoadingState/ErrorState consumers gain live semantics; spinner honors CSS media preference. Env, migrations, dependencies and public component APIs unchanged. No Home/hotspot changes; existing QA-002 assertions preserved.
- Limits: technical fixtures and shared in-memory mock, no real-device/screen-reader/audio/canonical-media/webfont-visual/backend-persistence certification. Scored grading and watched video evidence are mock service outcomes; no production reward/security guarantee.
- Next: Hưng architecture/accessibility and Dương consumer re-review the new runtime delta and assertions before accepting M3-07. Both P2 fixed in executor verification; no final reviewer acceptance inferred. PO audits Gate M3 only after task acceptance. M3 OPEN/M4 LOCKED.
