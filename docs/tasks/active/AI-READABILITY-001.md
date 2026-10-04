# AI-READABILITY-001 — Readable assistant answers

- Owner / Executor: Codex / Codex
- Reviewer: Hưng/Vinh; user visual acceptance pending
- Status: REVIEW
- Started: 2026-10-04
- Dependencies: user report and authorization to improve AI answer presentation; merged PR123.
- Files claimed: src/features/ai-assistant/AIScreen.tsx; new AssistantAnswer.tsx; tests/qa/ai-answer.test.mjs; own task/board entries.
- Acceptance: supported bold/italic markup renders as safe React text elements; paragraphs readable; user text stays literal; loading/errors do not claim source retrieval; no artificial response delay; reduced-motion scrolling respected.
- Next action: user visual acceptance; consider conversation context and explicit offline/retry UX as separate follow-up scope.
- Environment/migration: none.

## Handoff

Safe text-only bold/italic and paragraph renderer added for AI messages; user text stays literal. Removed artificial800ms latency, made waiting/error text honest about generation, respected reduced-motion scrolling and guarded Enter during IME composition. Typecheck/build PASS;25render/component checks PASS including screenshot-like emphasis and escaped malicious HTML. No provider prompt/history, historical content, credential or dependency change. Visual acceptance pending; unmatched/unsupported Markdown remains literal.
