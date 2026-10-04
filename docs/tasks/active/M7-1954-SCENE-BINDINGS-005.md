# M7-1954-SCENE-BINDINGS-005 — Per-scene historical traceability

- Owner: Codex integration under renewed PO five-role authorization, 2026-10-04.
- Executor: content_readiness.
- Reviewer: technical_rereview; historical acceptance remains separate.
- Status: REVIEW (implementation and independent bounded software review complete; exact-head CI pending).
- Started: 2026-10-04.
- Depends on: merged PR125 candidate and PR126 isolated import preparation; both delivered.
- Files claimed: src/services/reference1954/lessonSixBindings.ts; src/services/reference1954/candidateImport.ts; focused scene-binding tests; docs/content/chapter1954/CANONICAL-IMPORT-CANDIDATE.json. Root reserves task board and shared integration scripts.
- Scope: correct draft scene-level claim/source mapping and explicit fictional-scene boundaries without changing published content or approving claims.
- Acceptance: each factual scene uses existing appropriate claim/source IDs; fictional scenes do not invent factual claims; unknown/missing bindings fail; isolated import remains in_review and publicationAllowed=false; focused tests/typecheck/import dry run pass.
- Next action: run exact-head GitHub checks and integrate the bounded draft correction; parent historical/device/publication gates remain separate.
- Blocker: none for draft traceability preparation; parent M7-04/05 historical/publication gates remain unchanged.

## Parallel media correction claim

Executor media_readiness claims `src/features/learning/preview1954/PreviewSourceNotes.tsx`, `src/features/learning/preview1954/PreviewEpisode.tsx` and one focused appended regression in `tests/qa/preview1954-ui.test.mjs`, for the reproduced incorrect original-video warning displayed on the corrected candidate. Pass a version-specific flag and preserve original warning on original video. Reviewer technical_rereview. Record measured audio join evidence separately; no human listening approval. No story or media byte edits.

### Media correction handoff

- Files changed: the two exact preview components above and focused browser/SSR regressions in the claimed QA file; claim paths reconciled in this card. Original note remains the default; corrected v2 selection now describes the actual corrected scene/wording and pending final content/listening review. Three source links and fiction label retained.
- Verification: `npm run typecheck` PASS; `node --test --test-name-pattern 'version-specific source notes' tests/qa/preview1954-ui.test.mjs` **1 PASS, 0 FAIL**. The focused headless browser switch case could not run app assertions locally: harness failed at `Page.enable` with Chrome timeout and updater named-pipe access errors. No repeat loop, no visible desktop/browser control; retain the browser regression for an available isolated runner/CI.
- Audio objective evidence: candidate original 80–83.4s mean/max −20.4/−4.6dB; new ending 83.46–93.46s −21.1/−3.0dB. No measured clipping/large level jump. Package12PASS/decode0 evidence is already in candidate README; no human listening approval inferred.
- Environment/migration/media/publication impact: none. No story or media byte changes. Next: technical reviewer assesses this exact component/test diff; browser switch case remains unverified locally until an isolated browser runner is available.

## Import validation claim

Executor technical_rereview claims scripts/content/chapter1954/story-media-rows.mjs and scripts/content/chapter1954/import.test.mjs: use explicit scene classification to distinguish intentionally fictional scenes from missing factual bindings; reject unknown sources/claims; keep bound factual claims pending final review. Reviewer root. No publication, schema or remote import.

Root claims .github/workflows/quality.yml to include the focused scene-binding regression in the existing boundary suite; docs/project/TASK-BOARD.md and this card for exact handoff. User now explicitly requires the Codex in-app browser; external desktop input stopped. No desktop install/launch result is asserted.

## Integration handoff

Independent technical_rereview SOFTWARE APPROVE for content binding and version-specific notice. Root reviewed normalized importer: 510 pending rows, 6 scene-claim links and 5 scene-source links; three factual scenes, two fictional scenes and one pedagogical recap retain separate pending acceptance. All entities remain in_review and publicationAllowed=false. Original register/media bytes unchanged.

Typecheck PASS, production build PASS; migrated isolated import 3/3 PASS; domain graph 2/2 PASS; scene binding 2/2 PASS; version-specific SSR 1/1 PASS. Initial combined local run had a Vite SSR transport timeout before scene assertions; the isolated rerun passed. Local headless browser failed at Page.enable before app assertions; CI must verify the switch regression. Secret scan: 857 source/tracked/bundle files, zero unsafe matches. Original/corrected media hash verifier PASS. Existing Vite native-config and large-chunk warnings remain.

No environment/schema/live-data/auth/publication/deployment mutation. Desktop Chrome was opened for installability observation, but no installation occurred; user then explicitly selected the Codex browser, so desktop input stopped. Codex webview attachment timed out and open request returned queued; no successful in-app visual result is invented.
