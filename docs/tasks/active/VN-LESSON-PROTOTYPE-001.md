# VN-LESSON-PROTOTYPE-001 — Lesson6 preview with visual storytelling

- Owner / Executor: Codex / Codex
- Reviewer: Hưng/Vinh UX; Thọ historical; user visual acceptance pending
- Status: REVIEW (READY claimed 2026-10-04; user visual acceptance pending)
- Started: 2026-10-04
- Dependencies: user explicitly requests execution of a lesson prototype after audit; AI-VN-PREVIEW-001 local fixture. Scope is UI prototype, not M7-03 canonical authoring or publication.
- Files claimed: src/features/learning/preview1954/Preview1954Learning.tsx, PreviewNovel.tsx; new PreviewLessonSix.tsx, NovelStage.tsx, NovelBackdrop.tsx, previewNovel.css; src/services/reference1954/catalog.ts; new src/assets/vn-preview/ image/provenance; tests/qa/ai-answer.test.mjs, preview1954-ui.test.mjs; own board/card.
- Acceptance: existing Genève fixture lives in a clearly labeled lesson6 preview flow (intro → VN → debrief); remove standalone home game card; immersive artwork/dialogue, keyboard usable choices and neutral reflection feedback; explicit noXP/unpublished scope; no claims of complete episodes2–7 or canonical source acceptance; preserve video1 and Back/hash behavior.
- Next action: user visual review of lesson6 prototype; content/learning/media reviewers must accept future authored lesson versions before canonical import.
- Environment/migration: none; no hosted deployment. Existing AI uncommitted changes preserved.

## Content audit

Only episode1 video package exists. Other episodes have outline/research, no complete released lesson payloads. Historical worksheet42verdicts blank; source gaps and media gates remain. User authorizes a UI/content-placement prototype, not fabricated historical reviewer signatures. Lesson6 preview reuses the existing unchanged demo script with fiction label and no remote fixture images.

## Evidence and handoff — 2026-10-04

- Removed the standalone home game card. Chapter list offers video1, lesson6 prototype and five disabled unfinished episodes. Canonical canOpenEpisode still opens only video1; separate canPreviewLesson controls prototype access. Legacy game hash enters lesson6 intro; no fake canonical unlock.
- Lesson6 sequence: intro → five-scene VN → debrief/replay. User choices receive feedback; incorrect knowledge retries; reflections are neutral. All back/exit/finish callbacks only navigate locally and never call completion/reward services. Historical fixture script unchanged.
- Artwork: one generated fictional hall illustration1536×1024,2.27MB, locally lazy-loaded; source/prompt/hash/use limitations recorded in src/assets/vn-preview/PROVENANCE.md. No remote fixture photos or new voiced media. Hall/letter/table/dawn still share the concept backdrop; a complete scene/character art set is not claimed.
- Typecheck/build PASS;26render/component checks PASS. Chrome original video/offline/history checks PASS; isolated lesson6 scene traversal/wrong retry/debrief/mobile375px and landscape200% text/noXP/no account requests/return-to-chapter PASS. Initial selector quoting bug fixed; subsequent Chrome startup Page.getFrameTree timeout passed on isolated retry.
- Signed-in localhost: lesson6 intro and game opened; illustration loaded at1536px. Account remains10XP/1day/0badges. Screenshot output/vn-lesson-six-v1.png.
- No env/dependency/database migration or hosted deployment. Separate local AI/readability work preserved. Final build PASS; source/tracked/bundle scan797files,0unsafe matches. Reviewer status remains REVIEW.
