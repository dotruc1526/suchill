# POSTMERGE-AUDIT-20261004 — Latest main regression audit

- Owner: Codex integration
- Executor: Codex
- Reviewer: Hưng / Vinh; user integration acceptance pending
- Status: REVIEW (READY → IN PROGRESS → REVIEW on 2026-10-04)
- Started: 2026-10-04
- Dependencies: user requested latest GitHub review and repairs; main 06a5424 fetched; M6/M7 OPEN, experimental PvP track available.
- Files claimed: server/gameSnapshot.js, server/socketHandler.js, server/aiService.js, server/tests/ai.test.js, server/tests/multiplayer.test.js, src/services/aiChatService.ts, src/services/aiChatRequest.ts, tests/member5/ai-chat-request.test.ts, this card, own board row and evidence.
- Acceptance: preserve contributor changes; reproduce and repair confirmed regressions; run quality and release/register checks; prepare GitHub PR with exact evidence; no fabricated historical/device/release acceptance.
- Next action: inspect final GitHub CI; Hưng/Vinh review the bounded repair PR before integration.
- Environment/migration: no migration or credential changes planned.

## Additional confirmed claim

Claim src/services/supabase/usernameAuth.ts and tests/member5/lan-account-access.test.ts for the missing LAN request deadline and response-shape validation only. The original checkout's uncommitted auth edits remain untouched.

## Checkpoint / handoff

- Fixed: pending PvP correctness disclosure via score/combo/EXP and opponent event; AI client deadline/body validation and a shared server provider deadline with no quota/auth retry amplification; LAN auth deadline and payload validation.
- Evidence: [audit report](../evidence/POSTMERGE-AUDIT-20261004.md). PvP regression failed on baseline (120 score leaked) and passed after repair. Local quality: 418 PASS, 0 FAIL, 3 native-only SQL SKIP. Additional final LAN test: 1 PASS; final typecheck PASS. Release/1954 checks: 55 PASS; register CLI PASS.
- Files changed: claimed runtime files and tests, card, own board row and evidence only.
- Environment/migration: none. No live deployment, credential rotation or applied migration changes.
- Known issues: real provider/key/quota and public backend URL require configured environment verification; actual phone Wi-Fi/4G, historical/media sign-off and M6/M7 acceptance remain separate. Original uncommitted contributor work is preserved.
