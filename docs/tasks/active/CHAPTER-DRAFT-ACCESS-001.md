# CHAPTER-DRAFT-ACCESS-001 — Open all chapter drafts for review

- Owner / Executor: Codex / Codex
- Reviewer: user preview acceptance; Thọ historical review remains pending
- Status: REVIEW (READY claimed2026-10-04; implementation verified)
- Started: 2026-10-04
- Dependencies: explicit user override of preview locks: “cứ mở hết bài học đi r mới chỉnh lại cho đẹp”. Internal draft access only, no fabricated canonical acceptance.
- Files claimed: src/services/reference1954/catalog.ts; new draftLessons.ts; src/features/learning/preview1954/Preview1954Learning.tsx; new PreviewDraftLesson.tsx; tests/qa/preview1954-ui.test.mjs; own board/card.
- Acceptance: all7entries and direct routes open; existing video1/VN6 preserved; other episodes display actual user outline-derived draft text and reflection prompts; truthful missing-media/quiz status, noXP/completion/backend writes; navigation tests pass.
- Next action: user reviews all7preview entries; continue lesson/media authoring and design after feedback.
- Environment/migration: none.

## Handoff

All7chapter entries enabled under explicit user's revised preview policy. Video1 and lesson6 intro/VN/debrief retained; episodes2–5/7 show objectives,3outline-derived text points and a reflection prompt. Source docs/content/CHAPTER-1954-OUTLINE.md remains unchanged; drafts do not pretend to provide missing videos, VN or scored quizzes. Direct draft routes, heading focus, parent Back and invalid routes verified. No completion/reward/storage/account writes added.

Typecheck/build PASS; actual Chrome suite6PASS/0FAIL includes opening each draft, direct reload/Back, full VN traversal/retry/noXP, original video resume/offline/history. Files changed are the claimed catalog/draft service, preview router/draft component, QA test and own task/board. No env/dependency/migration/hosted deployment. Historical/publication review remains separate; this is user-authorized internal draft access.
