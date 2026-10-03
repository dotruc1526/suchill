# PR119-INTEGRATION-REVIEW-001

- Owner / Executor: Codex integration
- Reviewer: Codex technical review complete; Hưng/Vinh specialist acceptance remains separate
- Status: REVIEW
- Started: 2026-10-03
- Dependency: PR109 merged to `main`; user explicitly requested PR115-first integration of the shared PR115/PR119 feature head into `main`.
- Files claimed: src/services/gameServerConfig.ts, tests/member5/game-server-config.test.ts, src/services/supabase/usernameAuth.ts, src/features/ai-assistant/AIScreen.tsx, server/server.js, server/aiService.js, server/env.example, server/RENDER-SETUP.md, render.yaml, server/tests/ai.test.js, this card and review evidence.
- Existing uncommitted Socket.IO CORS callback correction in server/server.js is preserved and included as a relevant integration fix.
- Acceptance: resolve CI failure; preserve HTTP LAN support; no public production account-access proxy; bound AI endpoint calls; related tests and required CI pass before merge.
- Next action: update PR115 to the reviewed head, target `main`, then merge it after final CI. PR119 carries the same feature commits and becomes redundant; close it as superseded after verifying PR115's merge. Keep Internet/backend deployment and specialist acceptance as separate REVIEW gates.

## Review remediation

- CI failure confirmed: stale loopback-only test conflicts with explicitly delivered LAN support. Added positive HTTP private-LAN tests and negative HTTPS/public/hostname-spoof cases, and anchored fallback host matching.
- Production no longer exposes development account-access proxy. Development responses are no-store and upstream calls time out.
- AI calls limited to 10/IP/minute, 8 in flight and bounded IP map. Tests inject a provider stub rather than contacting real AI on CI.
- Preserved and included existing Socket.IO CORS callback fix, sharing the same allowed-origin predicate as HTTP/handshake.
- Focused regression 6/6 PASS. Full quality running; merge remains contingent on final required checks.
- Additional review claim: src/services/supabase/usernameAuth.ts. Anchored private IPv4 matching and HTTP development gate prevent credential forwarding to public hosts such as 10.attacker.com; HTTPS keeps trusted SDK path.
- CI quality failure in tests/qa/pwa-polish.test.mjs:74 resolved: AIScreen.tsx status text updated to start with 'Đang tra cứu' (matching case-sensitive contract) and hold a natural 800ms minimum thinking state so aria status is perceivable and reliably asserted in headless Chrome.
- Review found the AI UI implied source retrieval although the service only sends a prompt to Gemini. The UI and system prompt now state that answers are AI-generated, may be wrong, and are not source-verified. The model timeout is also cleared on every response/error path.
- Local verification on the main-synced candidate: typecheck/build/env scan PASS; unit 275/275; component/browser 38/38; database 62 PASS / 3 native-only SKIP; authoring PASS; fixture E2E 11/11; PWA 2/2; PvP server 22/22; PvP browser 4/4. Server dependencies were installed separately from `server/package-lock.json`; no provider secret was used. The three skips require a dedicated native PostgreSQL 17 instance. Vite reports existing native-config-loader compatibility warnings and a missing optional reference-preview virtual module during browser suites; those suites still passed.
- User's 2026-10-03 instruction explicitly authorizes merging the reviewed feature to `main`, superseding the earlier requirement to wait for the user's merge confirmation. This does not close PVP-ONLINE-001: public backend deployment, Wi-Fi↔4G acceptance and Hưng/Vinh specialist acceptance remain pending. Do not claim production readiness or task DONE.
- Render setup now declares the Gemini key as a server-only optional environment variable; the deployment guide explains that leaving it unset keeps the assistant on its local fallback.
