# Hosted Supabase transport verification

Task: SUPABASE-HOSTED-001 / M4-05, M4-06, M4-08. Owner: Codex integration. Executor: hosted transport agent. Reviewer: independent delegated security reviewer. Status: REVIEW. Started: 2026-10-02. Exclusive claim: `supabase/hosted-tests/`; no migration, package, app, task-board or Auth-global-settings edits. [Final evidence](./EVIDENCE.md): 12/12 PASS (11 hosted integration tests and one pure guard); root/reviewer controls task acceptance.

This suite uses the actual Supabase SDK, Auth JWTs, PostgREST RPC/table transport and Storage API of the explicitly authorized fresh test project `kyfqlhpweetsridmqkvl`. It does not bootstrap or emulate `auth`/`storage` schemas. Technical fixture content is not canonical history and must not be promoted to production.

Next action: verify migrations 001–026 and `fixtures.sql` through the trusted project setup lane, then run the suite with the ignored `.env.hosted-test.local` file. Migration 026 translates business conflicts to `PT409`, avoiding a real hosted PostgREST retry-loop defect discovered by this matrix. The suite rejects any other URL/ref and any nonignored credential file. Never commit or print credentials, signed URL tokens, passwords or sessions.

Required fields:

```text
SUCHILL_HOSTED_PROJECT_REF=kyfqlhpweetsridmqkvl
SUCHILL_HOSTED_URL=https://kyfqlhpweetsridmqkvl.supabase.co
SUCHILL_HOSTED_PUBLISHABLE_KEY=<browser-safe publishable key>
SUCHILL_HOSTED_SECRET_KEY=<trusted Node-only secret key>
SUCHILL_HOSTED_TEST_ALLOW=1
```

Run only after the setup lane approves hosted writes:

```powershell
node --test --test-concurrency=1 supabase/hosted-tests/*.test.mjs
```

`fixtures.sql` creates a stable UUID namespace and guarded immutable published graph, with technical Vietnamese text only. Reapplying an existing complete namespace is a no-op. Storage objects are uploaded exclusively through the Storage API; they are never inserted directly into `storage.objects`. Test users are generated with synthetic `@example.invalid` email addresses, server-side automatic confirmation and a per-run metadata marker; no email is sent. Cleanup deletes only exact IDs created in the current run after rechecking marker/email, and only their exact avatar paths. Published technical content and its dedicated fixed-path assets remain for reproducible verification.

`cleanup.mjs` is an integration-owner-authorized repair for interrupted older runs, executed only after all transport suites finish. It enumerates every Auth page, selects the exact generated transport UUID marker/email namespace, revalidates each identity and unchanged marker, and deletes only that synthetic identity plus the three known avatar filenames. Browser QA/Auth-lane/real accounts cannot match. Executed follow-up: one orphan removed, zero matching users remaining.
