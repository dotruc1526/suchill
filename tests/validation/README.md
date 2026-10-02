# QA-001 — Validation checks

Run `node --test tests/validation/schema-story.test.ts tests/member5/validation.test.ts`.
The bridge `tests/member5/qa001-validation.test.ts` includes these checks in the existing `npm run quality` unit glob; do not run both bridge and original together or count the same tests twice.

Fixtures are synthetic domain entities, not canonical historical content. The validator returns code/path/message; callers must reject errors before publish. See [checklist/evidence](../../docs/tasks/evidence/QA-001-validation.md).
