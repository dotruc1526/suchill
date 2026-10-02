# PR119-INTEGRATION-REVIEW-001

- Owner / Executor: Codex integration
- Reviewer: Codex requested technical review; Hưng/Vinh specialist acceptance remains separate
- Status: IN PROGRESS
- Started: 2026-10-03
- Dependency: PR119 exists; user explicitly requested review, fixes and merge to PR109 branch.
- Files claimed: src/services/gameServerConfig.ts, tests/member5/game-server-config.test.ts, server/server.js, server/tests/ai.test.js, server/tests/deployment.test.js, this card and review evidence.
- Existing uncommitted Socket.IO CORS callback correction in server/server.js is preserved and included as a relevant integration fix.
- Acceptance: resolve CI failure; preserve HTTP LAN support; no public production account-access proxy; bound AI endpoint calls; related tests and required CI pass before merge.
- Next action: remediate review findings, push, inspect final diff and CI, merge exact reviewed head to PR109 branch only.

## Review remediation

- CI failure confirmed: stale loopback-only test conflicts with explicitly delivered LAN support. Added positive HTTP private-LAN tests and negative HTTPS/public/hostname-spoof cases, and anchored fallback host matching.
- Production no longer exposes development account-access proxy. Development responses are no-store and upstream calls time out.
- AI calls limited to 10/IP/minute, 8 in flight and bounded IP map. Tests inject a provider stub rather than contacting real AI on CI.
- Preserved and included existing Socket.IO CORS callback fix, sharing the same allowed-origin predicate as HTTP/handshake.
- Focused regression 6/6 PASS. Full quality running; merge remains contingent on final required checks.
- Additional review claim: src/services/supabase/usernameAuth.ts. Anchored private IPv4 matching and HTTP development gate prevent credential forwarding to public hosts such as 10.attacker.com; HTTPS keeps trusted SDK path.
- CI quality failure in tests/qa/pwa-polish.test.mjs:74 resolved: AIScreen.tsx status text updated to start with 'Đang tra cứu' (matching case-sensitive contract) and hold a natural 800ms minimum thinking state so aria status is perceivable and reliably asserted in headless Chrome.
- Full local quality suite (typecheck, build, env audit, unit, component, db, authoring, e2e, pwa, pvp, pvp:ui) PASS with 0 failures and 0 unsafe client secrets.
- PR119 -> PR109 merge evaluation: PR109 is in DRAFT awaiting PO M6 Android trial closure with clean CI. Merging PR119 (+4k lines: Socket.IO PvP backend, Gemini AI, LAN proxy) into PR109 directly would cause scope creep on M6 closure. PR119 should remain targeted to PR109 as a reviewed integration candidate, pushed to green CI, but kept unmerged until PO / Vinh / Hưng approve and public backend hosting is provisioned.
