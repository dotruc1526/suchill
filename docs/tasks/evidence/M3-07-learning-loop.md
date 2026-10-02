# M3-07 — Learning-loop coverage plan and evidence

> Status: PLANNED / NOT RUN — claim/checklist approved, no new QA result
> Date: 2026-10-02; owner Vinh; branch codex/m3-07-learning-loop-qa

Hưng architecture/accessibility text approval and Dương learning-consumer GitHub approval apply to PR97 claim head ff3e1ed only. Review notes below are implementation requirements, not PASS results. [Task card](../active/M3-07.md).

## Matrix requirements after reviewer feedback

For each row, record exact named test/file, fixture/service outcome, viewport/account setup, expected result, executed result and limitations. Audit existing tests first; mark EXISTING versus NEW versus NOT VERIFIED and do not count bridge imports twice. No test named here is claimed as newly implemented or executed.

| Scenario | Expected result to verify | Evidence route / current execution state |
|---|---|---|
| Journey Start/Resume, back/re-entry | Correct lesson/checkpoint; heading/opener focus restored | Audit existing e2e.test.mjs journey cases; NOT RUN in this checkpoint |
| Lesson renderer, VN branching/back/restart/debrief | Ordered blocks and authored transitions; no narrative correctness; returning to opener restores focus | Audit existing unit/player/browser coverage; gaps via claimed loop tests/fixture; NOT RUN |
| Required video vs optional video | Service enforces required policy; optional evidence does not satisfy required video; optional-only catalog rejected | Audit completion regressions; trace player → service scenario and exact policy evidence; NOT RUN |
| Video fallback vs watched evidence | Retry/fallback accessible; approved fallback acknowledged with method; no arbitrary bypass of required policy | Audit QA-002 and completion regressions; separate simulated fallback from real playback/canonical-media validation; NOT RUN |
| Practice quiz | Ungraded feedback does not mint scored receipt/reward | Audit quiz/controller tests; exact flow test required; NOT RUN |
| Scored quiz | Completion uses stored trusted receipt, stable retry; UI never grades or adds XP | Audit quiz/service tests; consumer flow coverage required; NOT RUN |
| Completion/profile and re-entry | Only confirmed totals; retry/read retry/re-entry grant once | Audit accepted M3-06 loop and controller cases; NOT RUN |
| Loading/error/offline/empty and account switch | Distinct UI states; no zero-for-error, stale receipt or foreign account data | Deterministic claimed fixture/service tests after baseline audit; NOT RUN |
| Status/error announcements | Pending/confirmed/errors expose appropriate accessible status/alert semantics and meaningful text | Audit existing component/browser assertions; DOM semantics do not certify screen-reader output; NOT RUN |
| Long Vietnamese text | No clipped actions or horizontal overflow at 375px/430px; labels remain understandable | Audit QA-002 existing text scenarios; add explicit long labels/messages where absent; NOT RUN |
| Mute persistence | User interaction/mute preference persists as documented; no autoplay sound or completion coupling | Audit QA-002/M1 sound baseline; test existing preference boundary; NOT RUN |
| Keyboard/focus, targets, reduced motion | Keyboard actions work; focus restores; interactive targets >=44px; reduced motion respected | Audit QA-002/M3-06; run 375px/430px smoke; NOT RUN |

## Verification / remaining work

- Next: inventory exact existing assertions, identify gaps and implement tests only in claimed files; update this matrix with actual results and command logs.
- Claim checkpoint validation: Markdown links/diff only. Existing green CI is not proof of M3-07 QA acceptance.
- No runtime tests run in this reviewer-feedback documentation checkpoint. Task IN PROGRESS; Hưng/Dương review executed evidence later.
- Mock shared store does not certify browser-restart/cross-device persistence. Device, screen reader, webfont visual/canonical media and production historical/legal review remain separate.
- Source defects require an explicit additional source-file claim before repair. No dependency/env/migration/contract change; M3 OPEN/M4 LOCKED.
