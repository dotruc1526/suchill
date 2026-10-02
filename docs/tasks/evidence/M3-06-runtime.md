# M3-06 — Runtime evidence / review handoff

Date: 2026-10-02. Owner Dương, executor Codex, reviewers Hưng (architecture/UI/a11y), Vinh (service/reward/QA). Branch codex/m3-06-completion-profile, base main 8bcd33a; PR92 adapter handoff and PR93 status closeout already merged.

## Result

Existing technical lessons can acknowledge loaded text/recap, ask the completion service for a verdict, restore confirmed receipts and read account totals. Profile and TopBar use account-summary services instead of legacy data/local XP. No component calculates reward or writes adapter storage. No +XP toast is replayed on restoration; totals always come from summary.

Completion and summary controllers expose independent subscribable snapshots. Submission locks immediately, retains operation ID through offline/thrown/ineligible/validation retries and awaits explicit action writes. Restore failures retry reads; conflict triggers read recovery; unauthorized/not_found cannot be bypassed with a fresh ID. Summary failures retain same-account confirmed values; null and zero remain distinct. Session registry preserves pending intents across lesson remount, keyed by lesson/version; a new services/account/session epoch remounts the subtree and uses fresh controllers. Departing the learning tab unmounts players while retaining journey navigation and registry.

Author-controlled fixture policies identify technical versions/eligibility; no production/canonical content is introduced. Existing optional VN remains optional. Existing adapter policy tests govern mixed/VN/video/quiz/fallback eligibility; no replacement eligibility logic was added to UI.

## Verification

- Full `npm run quality` PASS: typecheck/build, 106 unit (including 11 new controller/session regressions), 23 component, 8 Chrome E2E; client-secret scan 348 files / 0 unsafe.
- Lifecycle follow-up (epoch-keyed subtree and player unmount on profile tab): typecheck and 11 controller tests PASS, build + full 8 E2E PASS. CI runs full quality again on final head.
- New controller tests cover immediate double submit, offline/thrown/ineligible stable retry, independent summary retry, null/zero/error, restore failure/no auto submit, response reordering, foreign account/lesson/version receipt, acknowledgement flush/action retries, typed validation/conflict/auth errors, real fixture service completion/dedupe and registry/session isolation.
- Component test distinguishes empty/error from confirmed 0 XP and exposes semantic retry. Chrome completion loop at 375/430px covers service ineligible verdict, acknowledgement, browser offline -> keyboard retry, confirmed totals, profile heading/lesson return/opener focus, receipt restore and no duplicate XP. Reduced-motion emulation and overflow checks PASS.
- Vietnamese labels visibly wrap at 375px; profile display name uses break-words. Long-name rendering is component-checked. Images visually inspected; no clipping/overflow in the captured states.
- Logs are local only: `.git/m3-quality-final.log`, `.git/m3-epoch-e2e.log`. Diff check PASS.

## Screenshots

[Completion 375px](./M3-06-images/completion-375.png), [430px](./M3-06-images/completion-430.png).
[Profile 375px](./M3-06-images/profile-375.png), [430px](./M3-06-images/profile-430.png).

## Review and limits

Hưng: service/UI boundary, App composition hotspot, session lifecycle, neutral feedback, focus/mobile/accessibility. Vinh: typed retry/error outcomes, account isolation, technical policy metadata, receipt and summary authority, regressions. Runtime evidence is executor verification, not independent acceptance. Task REVIEW; reviewer decides DONE.

In-memory mock does not survive full browser restart or guarantee cross-device persistence. No Supabase/Auth/backend, migration, dependency, secret or canonical media changes. Existing media/player service logic is unchanged; physical devices/screen-reader and canonical media require separate QA gates. M3-07 is still required after M3-06 acceptance; M3 OPEN/M4 LOCKED.

## Final integrated verification
- Integrated main `ed234e9` (PR85 QA/schema validation); kept all its card/board/index updates. Final full quality PASS: typecheck/build, 111 unit, 23 component, 8 Chrome E2E; scan 359/0. Runtime/UI unchanged by integration. Log `.git/m3-integrated-quality.log` local only.
