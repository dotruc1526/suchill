# Main-first M4/M5 integration candidate

- Baseline main: c7a5ad5968b95b8d3dc41cab1dfd4dfd48830f88 (M3 closed / M4 open).
- Source delivery: 61ace4d; candidate: codex/m4-m5-main-integration.
- Main re-fetched after implementation; baseline unchanged.

## Result

24 textual conflicts resolved with accepted main M3/content decisions as the baseline. Main shell/navigation, fixtures, completion controllers and original tests retained. Backend receipts are explicit behind a domain facade, not an automatic contract merge. Small M3 extensions support trusted story feedback, server-owned content version and optional checkpoint revisions; completion/profile contract remains canonical. Auth, account settings, service-backed practice and offline checkpoint wrappers integrated for configured Supabase runtime. Unconfigured mock mode retains main behavior.

## Review and verification

Review checkpoint preceded comprehensive verification; SQL/helper/identity/checkpoint issues repaired and re-reviewed. [Review](./REVIEW.md) is executor evidence; named QA / Product Owner approval is still pending.

- Final quality: typecheck/build PASS; 210 unit + 29 component/auth UI + 55 SQL + 9 M3 browser tests PASS = 303 passed; two native-only skips.
- PostgreSQL17: full prior run63 passed, then final main facade/race run5 passed. Both native-only skipped cases are covered; no failed native tests. Temporary loopback server stopped.
- Source/tracked/bundle secret scan: 512 files, 0 unsafe matches.
- Task documentation: 91 cards / 688 local links across197 documents PASS.
- Main M3 browser interactions preserve keyboard/focus, mobile375/430, quiz retry and error/offline flows.

## Environment impact and remaining gates

Migration001–028 are unchanged. New029 adds authenticated, owner-bound canonical completion/read RPCs and a private receipt cache. No existing account/progress/content is deleted or reset. Published immutable lesson row IDs serve as content-version identity, separately from stable reward scopes.

Hosted project suchill-test still reports028. Auto-review rejected executing029 because the user has not specifically approved its new schema/history payload. SQL is prepared at the root workspace output/main-first-integration/apply-029.sql; no workaround attempted. Hosted integration verification must follow explicit029 approval/application. Do not merge or claim hosted stability before that check.

Historical privileged-key revocation still requires its existing gate evidence; newly issued development credentials are isolated. M4 tasks are REVIEW for the integrated main candidate. M5 reused code is preparatory; its cards are BLOCKED until M4 is formally accepted and PO opens M5. Existing technical DONE evidence belongs to the isolated delivery branch and is retained as history, not main acceptance.

Main content includes overlapping MT68 source/claim registries with conflicting meanings. Main content and its accepted validator commands are preserved; the old branch's independent content-validator task is excluded. Canonical publication / M7 acceptance still requires historical/media review.

Root workspace (codex/m3-m5-complete) and other contributors' uncommitted UI changes are untouched. This worktree contains the reviewable candidate. M6/M7, canonical publishing and production release are outside this integration.

## Next action

Approve/apply029 on the named development project, then run hosted facade and browser checks. Review PR and M4 gate, accept M4 separately, explicitly open M5, then review/accept M5. No automatic milestone approval or production merge.
