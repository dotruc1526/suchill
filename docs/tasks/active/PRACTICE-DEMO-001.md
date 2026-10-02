# PRACTICE-DEMO-001 — Navigation practice demo

- Owner: Codex (integration)
- Executor: Codex
- Reviewer: Hưng / Vinh; pending
- Status: REVIEW
- Started: 2026-10-03
- Dependencies: M3-05 DONE; M6/M7 OPEN; explicit user request to inspect PR109 and enable navigation practice demo.
- Files claimed: src/features/practice/PracticeScreen.tsx, src/features/practice/ServicePractice.tsx, src/services/next/practiceDemo.ts, tests/member5/practice-demo.test.ts, this card and TASK-BOARD row.
- Next action: Hưng/Vinh review navigation, mobile layout and demo trust boundary.

## Acceptance

- Demo questions visible from Luyện tập; complete answers submit with correct/incorrect explanations and retry.
- Demo clearly labeled, no real XP/streak/completion or canonical publication.
- Hosted published practice remains accessible; demo works without published backend questions.
- Typecheck/build and related contract/component tests pass.

## PR109 inspection

PR109 is an open draft on codex/m6-pwa-completion, head 5f1c813bafa5b854b3aa0fcf4ac22386ec72f87e. Its stated scope is Android internal trial; historical/public acceptance remains separate. Current checkout feature/ai-chatbot at ce81668 already contains PR109 foundation work and unrelated uncommitted AI changes; preserve those changes. Local guest PracticeScreen has inert buttons; hosted ServicePractice only discovers published lesson quiz blocks, which can yield an empty list. This task addresses those navigation paths locally without merging/publishing PR109.


## Handoff — 2026-10-03

- Changed: PracticeScreen now immediately displays three source-literacy demo questions via existing QuizFlow; ServicePractice displays the same isolated demo independently of backend catalog loading/error/empty state, while retaining published assessments. Added practiceDemo quiz-only adapter and focused regression test.
- Evidence: npm run typecheck PASS; npm run build PASS; focused demo/quiz/component tests 29 PASS, 0 FAIL; diff whitespace check recorded separately.
- Demo grading and explanations belong to the mock adapter. No account completion, reward, XP, streak, backend writes, env, dependency or migration changes. No historical fact publication.
- Known limitations: browser/mobile manual verification and reviewer sign-off pending; existing build warnings about Vite native config/chunk size and component-test reference-preview dependency scan remain. PR109 was inspected for scope and navigation context, not fully accepted or merged. Implementation is in current workspace, not pushed to PR109.
- Unrelated user AI/chat/server changes preserved. Next: reviewer validates tab entry, submit disabled until complete, mixed feedback, retry and hosted empty/error catalog behavior.

## Continuation — 2026-10-03

- User authorized finishing mobile verification and PR109 update.
- Latest PR109 metadata confirms open draft, head 5f1c813bafa5b854b3aa0fcf4ac22386ec72f87e.
- Browser action was not executed: automatic approval review failed because refresh token was revoked. Do not bypass review.
- GitHub connector then failed HTTP 401 token_revoked when reading target files. PR109 update cannot proceed until Codex authentication is restored. No remote files were changed.
- Local deliverable remains ready for review; typecheck/build and 29 relevant tests passed. Direct browser/mobile evidence remains pending. Status stays REVIEW; reviewer acceptance is separate.
- Next action: after user signs out/in, verify browser interaction and apply only claimed practice files to latest PR109 head.
