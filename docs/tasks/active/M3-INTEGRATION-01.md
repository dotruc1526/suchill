# M3-INTEGRATION-01 — Learning journey/player integration

> Status: REVIEW\
> Last updated: 2026-10-01

## Assignment

- Phase / milestone: Milestone 3 — Learning frontend on mock services
- Accountable owner: Dương (Member 4 — Frontend Learning)
- Executor: Codex
- Reviewers: Hưng (architecture/UI/accessibility), Vinh (service/progress/QA)
- Branch: `codex/m3-learning-integration`
- Started: 2026-10-01
- Depends on: M3-01..05 `DONE`, M3-UX-01 `DONE`, M3 `OPEN`
- Files claimed: `src/features/learning/journey/`, integration-facing additions to `src/features/learning/lesson/`, `src/services/next/m3JourneyFixture.ts` for a labeled non-canonical interaction fixture, focused M3 integration tests, this card, active index and task-board row.
- Hotspots excluded: no changes to `src/App.tsx`, shared types/services contracts, fixtures/content, global CSS, package/lockfile, reward/completion authority or PWA config.

## Scope

- In scope: replace the lesson-entry placeholder with `LessonRenderer`; map visual-novel/video/quiz blocks to their accepted M3 players with exact lesson/block/resource IDs; preserve Back/focus behavior; visible close/reopen behavior for Visual Novel; integration loading/error states inherited from each accepted feature.
- Out of scope: new canonical content/media, marking blocks complete, XP/streak/reward, profile/completion UI (M3-06), broad visual polish, M3-07 QA closure and closing milestone M3.

## Acceptance criteria

- [x] Journey lesson view renders published ordered blocks through `LessonRenderer` instead of placeholder text.
- [x] VN/video/quiz slots receive exact stable IDs and the shared `LearningServices` instance; UI never imports fixtures or database rows.
- [x] Visual Novel can close and reopen locally without rolling back confirmed progress.
- [x] Back navigation still restores focus to the originating lesson trigger; lesson heading receives forward focus.
- [x] Integration tests cover slot wiring and the current text/recap technical fixture path.
- [x] Typecheck/build/relevant tests pass; handoff records boundaries and known gaps. GitHub Quality pending PR.

## Initial checkpoint — 2026-10-01

- PRs #72–#76 are merged and M3-01..05 have reviewer acceptance recorded on `main`; PR #77 handoff is also accepted.
- The current journey still renders a disabled placeholder in `JourneyLessonEntry`; M3-02 exposes typed slots and M3-03..05 export accepted players.
- Next action: implement a small integration composition without changing shared contracts or fixture publication status.

## Implementation checkpoint — 2026-10-01

- Replaced the disabled lesson placeholder with `IntegratedLessonRenderer`, which composes the accepted M3-02 renderer and M3-03..05 players through typed slots.
- Added pure, typed context mapping for Visual Novel and video. Quiz receives the authored `questionSetId`; all players share the same `LearningServices` instance. No fixture/database import or client completion/reward logic was added.
- Visual Novel opens on demand and closes locally; its accepted progress semantics remain unchanged. Async lesson heading mount now completes the existing forward-focus handoff, while Back still restores the stable lesson trigger.
- Verification: typecheck/build/client-secret scan PASS; 72 unit and 22 component tests PASS; `git diff --check` PASS. Local Windows Chrome again timed out in the two pre-existing journey E2E cases before mounting the Home controls; the same environment behavior occurred before this task, so GitHub Quality is the authoritative E2E run.
- Files changed: claimed journey/lesson integration modules, focused unit/component tests, card/index/board. No env, migration, dependency, shared-contract, canonical content or hotspot impact.
- Known boundary: the current runtime fixture contains text/recap blocks only. Typed VN/video/quiz wiring is covered without adding unreviewed canonical/media fixtures. Completion/profile UI remains M3-06.
- Status: `REVIEW`. Next action: push PR, wait for 2/2 GitHub Quality, then Hưng reviews composition/focus and Vinh reviews service/progress boundaries.

## Vinh review remediation — 2026-10-01

- Addressed Vinh's P2: the Visual Novel opener keeps a ref; closing or completing marks focus for restoration, unmounts the player, then focuses the newly rendered opener in an effect. The same control can reopen the player.
- Added a minimal optional Visual Novel to the existing explicitly labeled technical fixture so a real browser regression can exercise open → close → opener focus → reopen. The story text states that it is non-canonical; no completion/reward or publishable content claim was added.
- Added component wiring assertions and a Chrome E2E for the complete focus lifecycle. Status remains `REVIEW`; next action is local/full GitHub Quality and Vinh re-review.
