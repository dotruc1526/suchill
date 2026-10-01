# QA-002 — Mobile/player interaction matrix

> Date: 2026-10-01
> Revision tested: `main` base `1dcba50` plus branch `codex/qa-002-mobile-player-matrix`
> Scope: technical M3 mock services and non-canonical fixtures; not pilot media or release sign-off

## Method and result

`A` = automated browser on local Chrome; `U` = model/unit; `C` = server-rendered component. Browser checks use CSS viewports 375×812 and 430×932, not physical devices. All listed checks pass after the touch-target correction. The source of each assertion is named so prototype images are not mistaken for runtime evidence.

| ID | Flow / condition | Evidence | Result |
|---|---|---|---|
| J-01 | Journey opens a chapter and lesson; forward focus reaches headings, Back restores each trigger | `tests/qa/e2e.test.mjs` “learning journey moves focus…” (`A`) | PASS |
| J-02 | At 375px and 430px the journey has no horizontal overflow and primary action is at least 44px high | `tests/qa/e2e.test.mjs` “learning journey stays usable…” (`A`) | PASS |
| VN-01 | VN opens via Enter, focuses its heading, closes via Enter and restores opener focus; close button stays visible and at least 44×44px at both widths | `tests/qa/e2e.test.mjs` “Visual Novel remains keyboard…” (`A`) | PASS |
| VN-02 | VN closes/reopens and completion restores opener focus without discarding confirmed progress | `tests/qa/e2e.test.mjs` “Visual Novel close and completion…” (`A`); `tests/member5/m3-visual-novel-v2.test.ts` (`U`) | PASS |
| VN-03 | Saved scene resumes by stable ID; replay/restart does not roll back checkpoint; retryable wrong answer stays in the same scene | `tests/member5/m3-visual-novel-v2.test.ts` (`U`) | PASS |
| VN-04 | Offline story load shows an error; retry via Enter reloads the same story and focuses the player heading at both widths | `tests/qa/fixtures/video-player-mobile.*` + `tests/qa/e2e.test.mjs` “player mock exposes…” (`A`) | PASS |
| VN-05 | Narrative/reflection is neutral; knowledge feedback has text/icon and focusable status; service/invalid-scene errors offer Close and Retry | `tests/qa/component.test.mjs` M3-03 cases (`C`) | PASS |
| VID-01 | Published resolved asset loads; absent progress starts at zero; saved position resumes exactly; missing/non-video media fails closed | `tests/member5/m3-video-player.test.ts` (`U`) | PASS |
| VID-02 | Video has native controls, no autoplay, poster, Vietnamese caption track, transcript link and prepared fallback markup | `tests/qa/component.test.mjs` M3-04 case (`C`) | PASS |
| VID-03 | Invalid media triggers visible transcript fallback; missing asset shows service error and keyboard Retry at 375px/430px; no horizontal overflow; retry target ≥44×44px | `tests/qa/fixtures/video-player-mobile.*` + `tests/qa/e2e.test.mjs` “player mock exposes…” (`A`) | PASS |
| VID-04 | Checkpoint saves bounded watched ranges; failed save retains queued payload and retries with the same operation ID; paused seek does not count as watched | `tests/member5/m3-video-player.test.ts` (`U`); `tests/qa/component.test.mjs` M3-04 cases (`C`) | PASS |
| QZ-01 | Adjacent quiz contract rejects incomplete submit, uses trusted feedback, and preserves loading/error behavior | `tests/member5/m3-quiz-flow.test.ts` (`U`); `tests/qa/component.test.mjs` M3-05 cases (`C`) | PASS, supporting coverage only |

## Finding and correction

- Browser test initially measured the VN `ĐÓNG` button at **42px high** at 375px. This missed the project's practical 44px touch-target goal.
- QA-002 claimed `src/components/ui/Button.tsx` and gave the shared default `md` button a minimum 44×44px hit area. The focused VN test now passes at 375px and 430px. Hưng should review the shared primitive impact.

## Limits and next gate

- The browser fixture uses mock media URLs to exercise **failure and fallback**, not successful real playback. Caption timing, poster loading on a real network, native player controls on iOS/Android and actual device performance remain unverified until reviewed canonical media exists.
- No physical phone or screen reader was used. Automated semantic/focus checks do not replace VoiceOver/TalkBack and manual contrast/touch review for release.
- This matrix does not certify the complete MVP loop, authenticated progress, trusted rewards or offline sync. M3-06 completion/profile and M3-07 feature interaction tests are separate; M4 backend remains locked.
- No Blocker/Critical was found in the tested technical mock paths after the 44px correction. Hưng reviews QA-002 evidence and the shared button change; Dương confirms expected player behavior. Product Owner alone decides M3 gate.

## Reproduction

- `npm run quality` (run with localhost/Chrome permission): typecheck, build, client-secret scan, unit, component and six browser E2E tests.
- Focused browser checks: `node --test --test-name-pattern='Visual Novel remains keyboard' tests/qa/e2e.test.mjs` and `node --test --test-name-pattern='player mock exposes mobile' tests/qa/e2e.test.mjs`.
- `git diff --check`.
