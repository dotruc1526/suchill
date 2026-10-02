# M3-UX-02 — Home restore evidence

Owner: Trúc; executor: Codex. Status: REVIEW, 2026-10-01.

Restored the supplied image hierarchy: greeting, streak/week activity, continue/start lesson with SỬu, daily goal, and red chapter bands. Reuses tokens, cards, progress and existing mascot sprite. Catalog, lesson status and completion counts come through services. Read-only mock activity is isolated in `m3HomeActivity.ts`; 7 days and 6/10 minutes are visual demo data.

Main `a55b924` / PR #79 is integrated. LessonRenderer and VN/video/quiz player wiring and heading callback remain intact. Home continuation uses the existing `startLesson` operation; existing checkpoints are preserved. Back navigation restores chapter/lesson button focus.

Verification:

- Typecheck and production build PASS.
- 74 unit tests, 22 component tests and 4 browser E2E PASS.
- New continuation test covers active lesson in another chapter, first unfinished lesson and all completed; optional activity failure leaves catalog available.
- 375px and 430px: document width equals viewport, chapter card within viewport, primary touch targets at least 44px. Browser manually verified Start → rendered lesson → Chapter → Home and Resume label/focus.
- Client secret scan: 320 files, 0 unsafe matches. `git diff --check` PASS.
- Existing Vite future native-config warnings remain; no dependency/env/migration changes.

Screenshots captured from the built application by mobile E2E:

![Home at 375px](./home-375.png)

![Home at 430px](./home-430.png)

Reproduce screenshots: PowerShell `$env:UPDATE_M3_HOME_EVIDENCE='1'; node --test --test-name-pattern="learning journey stays usable" tests/qa/e2e.test.mjs` after `npm run build`.

Catalog remains the technical 1972 fixture; no invented 1954/1965 chapters or completion percentage. Device/screen-reader and canonical media acceptance remain separate gates. Hưng/Dương/Vinh review before DONE.
