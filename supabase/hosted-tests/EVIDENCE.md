# Hosted REST, Storage and trusted learning evidence

Verified on 2026-10-02 against the user-authorized fresh Supabase test project `kyfqlhpweetsridmqkvl` (`suchill-test`), with migrations 001–026 and the dedicated technical fixture graph. Branch: `codex/m3-m5-complete`. Executor: Codex hosted transport lane. Independent source reviewer: Codex application reviewer. No canonical historical acceptance is implied.

Final command:

```powershell
node --test --test-concurrency=1 supabase/hosted-tests/*.test.mjs
```

Result: **12/12 PASS**, 117.096 seconds, zero failures/skips. This is **11 actual hosted integration tests plus one pure configuration guard**, not 12 independent hosted environments. Runtime requests use the official Supabase JS SDK and actual Auth, JWT, PostgREST, database transactions and Storage HTTP endpoints. Each of the four integration files provisions separate synthetic A/B accounts and cleans exactly its own users and avatar paths; all eight users from the final aggregate run were deleted successfully.

| Area | Actual verification | Result |
|---|---|---|
| Target/key guard | Exact authorized HTTPS project/ref, explicit file opt-in, Git-ignored credential file, separate publishable/secret key classes | PASS |
| Domain transport | App's real `createSupabaseLearningServices`, camelCase catalog/lesson/document/story/quiz DTOs, not-found/validation mapping | PASS |
| Published/draft boundaries | Anon/A/B public graph delivery; direct REST draft rows filtered; question/VN correctness and explanations absent from delivery | PASS |
| Private authority | Private key tables and private-schema reward RPC inaccessible; public reward helper unavailable | PASS |
| RLS ownership | Real A/B sign-ins/JWTs; both directions of cross-user table/profile reads filtered; anon user tables empty | PASS |
| Mutation authority | Direct progress/reward/streak writes, other-user profile changes, draft publication and body ownership overrides denied | PASS |
| Session binding | A's expected subject under B's token rejected; B progress untouched | PASS |
| Revision transport | Stale RPC returns real HTTP409 / `PT409` within 20 seconds; adapter returns `conflict`; exact retry keeps receipt; fresh revision persists | PASS |
| Storage publication | Three private buckets; anon real signed video/poster/VTT/transcript HTTP downloads; unsigned public/tampered-signing-token access denied | PASS |
| Storage path boundary | Anon/A/B cannot sign unreferenced published path or sign/download draft; listing exposes only exact approved paths | PASS |
| Avatar isolation | A owns upload/read/sign/update/remove; B/anon read/sign denied; B insert/update/delete cannot affect A; invalid MIME denied | PASS |
| Trusted lesson reward | Eight overlapping actual HTTP requests for one operation return the same receipt; recreated adapter replay; ledger contains exactly one 10-XP reward | PASS |
| VN | Actual feature model initializes/traverses hosted graph; wrong feedback remains on check; reached end gates completion; one-time 20-XP reward | PASS |
| Quiz/daily review | Wrong/pass grading, feedback, duplicate submission keeps same attempt, improved/repeated attempts cannot farm XP; scored25/daily5; other-user daily attempt denied | PASS |
| Offline/uncertain response | B queues block+lesson while offline, A cannot send B queue; real server commits10XP then response deliberately lost; recreated durable queue replays original operation and clears without duplicate XP | PASS |
| Video | Initialization required; immediate fabricated full playback/seek cannot complete; overlapping ranges merge uniquely; stale revision rejected; 45 seconds of actual elapsed time satisfies approved2x budget, trusted90% completion grants10XP once | PASS |
| Accessible fallback | Authored recap is required before published transcript fallback; trusted method and lesson reward confirmed | PASS |

Two real integration problems were diagnosed and addressed:

1. Business conflicts raised with PostgreSQL `40001` caused hosted PostgREST14 to retry indefinitely, timing out the first stale-revision test. The independent direct-SDK probe disabled SDK retries and still timed out, separating this from client retries. Migration026 now changes intentional business conflict raises to `PT409`; the app maps that state to `conflict`. The final HTTP test proves409/PT409 and a bounded response. Supabase documents this behavior and the HTTP-code fix in its [official troubleshooting guide](https://supabase.com/docs/guides/troubleshooting/high-cpu-and-infinite-transaction-retries-when-using-custom-error-codes-in-rpc-functions-77326b). The setup lane separately checks residual retrying backends. The authorized follow-up `cleanup.mjs` exhaustively enumerated users, revalidated exact generated namespace/ID/email/marker, deleted one pre-fix synthetic orphan and confirmed zero matching users remain; browser/Auth-lane users were excluded.
2. An avatar's immediately repeated download could serve cached bytes after the owner deleted it. The final deletion proof uses test upload cacheControl0, authoritative folder disappearance, denial of a new signature, and the SDK's cacheNonce/no-store request. Previously issued signed URLs are capabilities valid for their TTL; this matrix does not promise their immediate revocation.

Safety and limits:

- Credentials are read only from the ignored `.env.hosted-test.local`. The trusted secret stays in the Node test process. No password, key, Auth session/token, signed URL token or raw SDK diagnostic is recorded here or logged by the harness.
- Test identities use random `@example.invalid` addresses, per-run metadata and server-side automatic confirmation; no outbound email is sent and Auth security settings are unchanged. Cleanup rechecks exact ID/email/metadata ownership before deletion.
- The stable technical content and six dedicated Storage fixture files remain under `hosted-technical/v1/` for reproducible testing. Storage files are created only through the actual Storage API, with no direct `storage.objects` insert or Auth/Storage schema emulation.
- The tiny video object tests binary Storage transport and signing, not media decoding. Real server-side video telemetry is independently tested by elapsed time; historical/media licensing and production-video playback remain their own content/UI gates.
- This suite proves trusted learning transport on the fresh test project. It does not establish revocation of a credential from an older unrelated project, mail delivery/SMTP, production deployment, canonical historical review or M6/M7 readiness. The Auth lane provides separate hosted confirmation/refresh/persistence evidence.

Files changed: configuration guard/helper, synthetic-user context, exact-namespace orphan cleanup, stable technical IDs/SQL fixture, four integration suites, this evidence and the lane README. No application, migration, package, shared task board or task-card file was edited by the hosted transport lane.
