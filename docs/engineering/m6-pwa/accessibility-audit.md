# M6-06 — Focused accessibility audit

> Date: 2026-10-03 (Asia/Bangkok)
> Status: SOFTWARE APPROVE for repaired source findings; full manual acceptance outstanding
> Reviewer: independent Codex accessibility/software reviewer

Scope: core Home/chapter/lesson/VN/video/quiz/profile/Auth/recovery/PWA states, shared primitives and the visible AI tab. Read-only source/evidence review; only this report is authored by this lane. Base head d27691e plus the reviewed skip-link correction. Existing media/content rights and historical approval are separate; the requested 1954 trial is not evidence of canonical media acceptance.

## Evidence and limits

| Area | Evidence checked | Result / limit |
|---|---|---|
| Baseline regression | [Existing Quality](./quality.txt), 379 PASS, 0 failures, 3 native-only SQL skips | Reused source evidence, not a new full run |
| Corrected skip-link | main.tsx prevents hash navigation and focuses main; polish assertion requires an empty hash | Independent source re-review APPROVE; root reports typecheck exit0 and actual Chrome10/10 PASS after this fix, original M3 assertions unchanged |
| Vietnamese metadata, main/keyboard | Production polish assertions and screenshots; main/skip/focus, named navigation and offline AX tree | Verified for supplied desktop Chrome evidence; additional nested main finding below |
| Responsive/large text | 375×812, 430×900, 812×375, CSS root font200%; no horizontal overflow and visible navigation >=44px | Desktop emulation; CSS text enlargement is not a complete browser-zoom/reflow audit |
| Learning states | Original M3 Chrome assertions: typed loading/offline/retry/empty, long Vietnamese, forward/back focus | Reused actual browser evidence; errors/statuses use meaningful text |
| VN and quiz | Neutral narrative feedback; knowledge feedback text/icon; focused feedback/result; native fieldset/legend/checkbox | Reused source/component/Chrome evidence; no color-only correctness |
| Video | Native controls, no sound autoplay, metadata preload, captions/transcript/fallback/attribution; mobile fallback retry by keyboard | Player capability is covered; final existing1954 media/caption synchronization, native controls and playback require asset/device acceptance |
| Auth/recovery | Associated labels, autocomplete/paste, repeat-password validation, focused linked error summary, busy/disabled/invalid/retry/success states | Independent actual HostedApp StrictMode/remount check 1 PASS; live email/reset and error-link finding remain separate |
| Motion/sound | Global OS/account reduced-motion rules; M3 live preference/spinner assertions; mute survives reload | Reused browser/source evidence; human playback/vestibular review unproved |
| Dialog primitive | Source focus trap, Escape, restoration and named dialog; fixture exists | No core v2 consumer found; source assertions do not establish screen-reader isolation |

## Measured text contrast

Computed from the current theme tokens using relative luminance and the WCAG ratio formula; all core pairs below meet4.5:1.

| Foreground / background | Ratio |
|---|---:|
| textPrimary / appBg | 12.712 |
| textSecondary / cardBg | 7.440 |
| textMuted / appBg | 5.402 |
| textMuted / cardBg | 6.063 |
| textMuted / navBg | 4.804 |
| primary / primaryText | 7.570 |
| secondary / primaryText | 10.843 |
| correct.text / correct.bg | 6.948 |
| incorrect.text / incorrect.bg | 4.630 |
| accentRed / cardBg | 4.985 |

The two AI muted text uses were changed from #A0622A (4.003 on appBg,4.493 on cardBg) to theme.colors.textMuted, whose ratios pass above. Measured actual thinking-bubble color matches the token.

## Actionable findings sent to root

| ID | Finding / trigger | Narrow repair and verification | Current state |
|---|---|---|---|
| A11Y-01 | Opening a lesson/quiz/profile nests feature main elements inside AppContent main, creating invalid/ambiguous main-landmark structure | Change LessonContentView, QuizFlowView and ProfileScreen roots to section; keep headings/labels/test IDs. Check one application main through these routes | Resolved; independent source re-review APPROVE |
| A11Y-02 | Clicking a recovery error-summary link appends a field hash. Callback dismissal preserves unrelated fragments; clean-URL PWA update/reload is then blocked | Prevent default and focus the target field when present; retain href fallback. Assert target focus and unchanged hash before/after dismissal | Resolved; independent source re-review APPROVE |
| A11Y-03 | AI input has only a placeholder, send button only a glyph; arriving replies/thinking have no explicit log/status semantics | Add meaningful Vietnamese input/send names and polite log/status semantics without changing content | Resolved; independent source re-review APPROVE |
| A11Y-04 | AI small muted text uses the failing contrast pairs measured above | Use theme.colors.textMuted for the two muted text uses; preserve theme palette | Resolved; independent source re-review APPROVE |

These are source/interaction findings; no cross-account, reward-loss or private-cache defect was found in this accessibility scope. The earlier skip-link hash defect is repaired and is not listed as outstanding.

## Remaining acceptance

M6-06 cannot be called full WCAG2.2AA conformance or DONE from these partial checks. Required remaining proof is a complete automated accessibility scan of the target release flows, human screen-reader navigation/announcements (including callback errors, VN feedback, quiz result, pending/confirmed progress and video alternatives), real browser zoom/reflow, and the actual Android/iOS/desktop release matrix. Record device/browser/assistive-technology versions and concrete outcomes. Unsupported tools and absent device evidence are not PASS.

Shared Modal/ChoiceOption have no current core v2 consumer in this audit. Before future use, confirm named/unique dialogs, screen-reader background isolation, large-text overflow and generous close targets; expose narrative selected state programmatically. These are scoped follow-ups, not a reason to rewrite unused prototype screens now.

No accounts, passwords, progress, backend configuration, migrations, dependency lockfile, content runtime, canonical publication or production deployment were changed by this audit. Root owns repairs, targeted verification, task-board/card changes and final handoff; the independent reviewer re-checked all five source fixes and supplied SOFTWARE APPROVE. Root records that exact bounded verdict after the reviewer handed over report writing.

## Final source re-review — 2026-10-03

Independent reviewer: SOFTWARE APPROVE for A11Y-01..04, no remaining source finding in this narrow scope. Root verified typecheck PASS, recovery Chrome 7/7 PASS (linked error focus and unchanged fragment), original M3 Chrome 9/9 PASS, fresh production polish 1/1 PASS and labelled lesson/quiz single-main SSR 1/1 PASS. New test-only selector/fixture failures were corrected before final PASS; original M3 tests were preserved. The full M6-06 task remains REVIEW for the manual/complete-scan acceptance above. [Current handoff](./1954-HANDOFF.md).
