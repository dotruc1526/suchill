# LOCAL-MAIN-INTEGRATION-001 — Consolidate the working preview with PR122

- Owner / Executor: Codex integration / Codex
- Reviewer: Hưng/Vinh; user acceptance pending
- Status: IN PROGRESS (READY claimed 2026-10-04)
- Started: 2026-10-04
- Dependencies: explicit user authorization to save local work, integrate latest main/PR122 and create a tested review PR; LOCAL-1954-001 software evidence; PR122 green CI.
- Files claimed: selected current local preview/plugin/transcript/test/task files; server/aiService.js, server/server.js, src/services/supabase/usernameAuth.ts, scripts/tunnel-online.mjs for preservation and bounded conflict resolution; own board row and integration evidence. No package/types/App/migration claim.
- Acceptance: selected local work saved without logs/checkouts/generated outputs; main-based integrated branch contains PR122 fixes and the working1954/inline transcript/tunnel behavior; auth only uses a development proxy on eligible local/tunnel frontend and HTTPS retains trusted SDK in ordinary hosting; full quality/release/register evidence; GitHub PR prepared, no deploy/merge without reviewer acceptance.
- Next action: save local commits, fetch latest main, create isolated integration branch, reconcile auth/AI conflicts and test combined deliverable.
- Environment/migration: none planned; never copy .env files or secrets into Git.
