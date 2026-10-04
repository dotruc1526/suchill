# LOCAL-MAIN-INTEGRATION-001 — Consolidate the working preview with PR122

- Owner / Executor: Codex integration / Codex
- Reviewer: Hưng/Vinh; user acceptance pending
- Status: REVIEW (implementation and local verification complete; reviewer acceptance pending)
- Started: 2026-10-04
- Dependencies: explicit user authorization to save local work, integrate latest main/PR122 and create a tested review PR; LOCAL-1954-001 software evidence; PR122 green CI.
- Files claimed: selected current local preview/plugin/transcript/test/task files; server/aiService.js, server/server.js, src/services/supabase/usernameAuth.ts, scripts/tunnel-online.mjs for preservation and bounded conflict resolution; own board row and integration evidence. No package/types/App/migration claim.
- Acceptance: selected local work saved without logs/checkouts/generated outputs; main-based integrated branch contains PR122 fixes and the working1954/inline transcript/tunnel behavior; auth only uses a development proxy on eligible local/tunnel frontend and HTTPS retains trusted SDK in ordinary hosting; full quality/release/register evidence; GitHub PR prepared, no deploy/merge without reviewer acceptance.
- Additional files claimed: src/services/supabase/accountProxyConfig.ts; tests/member5/account-proxy-config.test.ts for the hosting/development authentication boundary.
- Checkpoint: saved local work as aba34e5 and 3f83430; integrated onto main plus PR122 in an isolated checkout. Retained custom AI model with the shared deadline. Confined account proxy selection to LAN and validated development tunnels.
- Next action: review the integrated GitHub PR and its final-head CI; merge/release remain separate acceptance steps.
- Environment/migration: none planned; never copy .env files or secrets into Git.

## Verification and handoff — 2026-10-04

- Base: main06a5424 plus PR12213b6de4; local work preserved on codex/local-preview-save-20261004 (aba34e5,3f83430). Integration uses a separate checkout and commits.
- Combined npm run quality: PASS; typecheck/build, unit/component/database/authoring/browser/PWA/PvP checks;422PASS,0FAIL,3SKIP (native PostgreSQL requires a separate database environment). Source/tracked/bundle scan782files,0unsafe matches.
- Release/reference/register/actual preview Chrome suite:55PASS,0FAIL,0SKIP. Video/caption/transcript package bytes unchanged; episode1 usable, six episodes locked. Prior signed-in localhost evidence is in LOCAL-1954-001.
- Changed files: inherited PR122 PvP disclosure/AI deadline/LAN validation; local preview plugin/config/declaration, transcript service/component and player slots, regression tests, preserved AI custom model/server health/tunnel launcher; account proxy resolver and boundary tests; task board/cards.
- No dependency lock, database migration, secret or deployment change. Standard production builds do not implicitly enable the internal preview; validated hosting preview build remains required. Tunnel launcher is preserved and not publicly started during this integration.
- Known limits: live provider availability, physical-device acceptance and historical/media/publication review remain separate. Vite emitted optimizer/native-loader compatibility warnings during fixture tests; checks completed successfully. No human review or milestone closure inferred from these test results.
