# AI-VN-PREVIEW-001 — Young-reader AI and discoverable VN demo

- Owner / Executor: Codex / Codex
- Reviewer: Hưng/Vinh; user preview acceptance pending
- Status: REVIEW
- Started: 2026-10-04
- Dependencies: explicit user request for accessible AI explanations and visible playable Visual Novel; merged PR123; existing Genève technical fixture only.
- Files claimed: server/aiService.js; server/tests/ai.test.js; src/features/learning/preview1954/Preview1954Learning.tsx; new PreviewNovel.tsx; src/services/reference1954/catalog.ts; tests/qa/ai-answer.test.mjs; own board/card.
- Acceptance: age-appropriate direct answers with explained jargon and honest uncertainty; existing VN accessible from HỌC with explicit demo/noXP label, no canonical1954 story authored/published, no external fixture imagery, back navigation retained.
- Next action: user demo acceptance; restart backend to load changed AI instructions; canonical VN remains a separate authored/reviewed task.
- Environment/migration: none; backend restart required for changed AI instructions.

## Evidence and handoff

Follow-up2026-10-04: standalone game entry superseded by VN-LESSON-PROTOTYPE-001. Existing fixture now sits inside lesson6 preview (intro/story/debrief); no canonical story or full chapter unlock inferred.

Final regression: preview Chrome suite rerun alone4PASS/0FAIL. An earlier concurrent run had a Page.navigate timeout; isolated rerun succeeded. AI/render suite8PASS/0FAIL, including safe formatting and VN fixture rendering.

AI instructions now address children/young readers directly, explain jargon, use short paragraphs and optional familiar examples, avoid mandatory fact/interpretation labels and repeated generic caveats, and retain honest source uncertainty. Output budget500tokens supports the requested explanation length. Existing Genève technical fixture is exposed through a lazy HỌC demo card/hash route; remote fixture images omitted, script unchanged, exit/completion only navigate back with no reward service. Typecheck/build PASS; AI/render checks8PASS. Actual signed-in localhost game opened at scene1/5; choice displayed feedback, Continue advanced to2/5; account10XP/1day/0badges unchanged. Existing1954 Chrome navigation/offline checks retained. Visual acceptance pending; no canonical story publication or release inferred.
