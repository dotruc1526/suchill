# SUPABASE-HOSTED-001 — Verify fresh hosted Supabase integration

> Status: DONE
> Started / last updated: 2026-10-02

## Assignment and authorization

- Owner / Executor: Codex root, integration owner.
- Reviewer: independent Codex application/security reviewer; specialist cross-review.
- Branch: `codex/m3-m5-complete`.
- Dependencies: M4/M5 implementation and native SQL review complete; new empty Supabase project created by user, password saved by user.
- Authorization: user requested all configuration, migrations, Auth, A/B isolation, Storage/API and reward verification before DONE. Target is the new disposable development project `kyfqlhpweetsridmqkvl` in Sử Chill Free organization. No production release, paid plan or canonical content publication.
- Files claimed: root owns this card, task-board/status/evidence docs, `.env.local`, `.env.hosted-test.local`, package/lockfile and any new roll-forward migration; hosted_transport exclusively owns `supabase/hosted-tests/`; hosted_auth exclusively owns `supabase/hosted-auth/`. Reviewer read-only. Existing untracked artifacts preserved.
- Next action: none for hosted technical verification; formal milestone/content acceptance remains separate.

Additional root claim: `scripts/member5/run-fixture-e2e.mjs`, `tests/qa/e2e.test.mjs` and package script isolate mock browser regression builds from hosted `.env.local`. Auth lane may provision the Git-ignored `.env.hosted-browser.local` test-only credentials for root browser QA and remove them afterward.

Hosted conflict repair claim: root owns migration `20261002002600_http_business_conflicts.sql`, `src/services/supabase/rpc.ts`, affected SQL/unit conflict expectations and upgrade regression. Real PostgREST14 indefinitely retries intentionally raised40001; business conflicts must use PT409. Applied migrations001–025 remain immutable.

## Acceptance

- [x] Safe fresh-project configuration; only URL/publishable key in frontend, server-only test secret in ignored local file; source/bundle scans.
- [x] Apply all25 ordered existing migrations unchanged, then new roll-forward026 without reset; record actual PostgreSQL17.11/history.
- [x] Real Auth signup/confirmation/sign-in/persistence/refresh/sign-out and account switching.
- [x] Real anonymous/A/B/trusted REST/RPC matrix; draft/answer keys/private user state inaccessible; trusted completion/rewards deduplicated.
- [x] Actual private Storage uploads/signing/download/path isolation and domain adapter integration.
- [x] Appropriate quality checks and independent review; update each M4 card only on evidenced acceptance.
- [x] External content/old exposed credential prerequisites distinguished from new-project technical evidence.

## Final review / handoff — 2026-10-02

Independent Codex application/security reviewer and root cross-review accepted this development verification after all checks. See [hosted acceptance](../../engineering/hosted-supabase/EVIDENCE.md). Quality238, native-mode50, hosted transport12 and Auth9 pass; actual owned-inbox confirmation/browser login/reload/settings/A-B/sign-out also pass.26 migrations/46 public tables/all RLS/zero public buckets/zero active learning RPCs confirmed.

New project uses fresh keys; URL/publishable only in browser, Node test secret in ignored local file, source/bundle scan clean. Browser A/B exact-manifest cleanup succeeded and .env.hosted-browser.local was removed. The confirmed signup tied to the user-owned email is retained with its 10-XP technical progress; automatic approval review rejected irreversible deletion because the user authorized email testing but not deletion of that account. No alternative deletion was attempted. On 2026-10-02 the user explicitly chose to retain this confirmed test account and its 10-XP progress. The ignored .env.hosted-signup.local manifest is retained locally; browser session is signed out. No account deletion is pending. Retention does not change the passed technical acceptance. Six stable technical Storage files and technical content remain for reproducible QA. Old unidentified-key revocation is not proven by creating this target; no old key is reused and no production release is authorized.

Files changed: claimed configuration/docs/migration026, RPC conflict mapping/regressions, hermetic mock browser build wrapper and guarded hosted harnesses. Original001–025 remain immutable; no database reset. Current Site URL127.0.0.1:5173 requires the local dev server; production needs its own approved origin. Canonical historical/media publication and M6/M7 remain separate.
