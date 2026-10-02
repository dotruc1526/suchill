# M6-ACCEPTANCE-002 — Independent review and remaining release preparation

> Status: REVIEW
> Last updated: 2026-10-03

- Owner: Codex root under user's explicit “làm tất cả cho tôi”.
- Executor: root; independent read-only reviewers hosting_catalog_review, accessibility_review, content_release_audit.
- Reviewer: disjoint technical reviewers; root reviews delegated reports and external inputs. Named human historical/media/PO/device decisions remain distinct.
- Started: 2026-10-03; READY → IN PROGRESS after M6 OPEN and completed software candidates.
- Branch: codex/m6-pwa-completion; initial HEAD12456ddaa8ea6b6f5aa3cb4cd54ebea80cc9b395.
- Depends on: DOC-021/M6 OPEN; HOSTING-PREVIEW-001 and MVP-1954-CATALOG-001 REVIEW with local/HTTPS/CI evidence; explicit user continuation.
- Files claimed: this card; docs/project/TASK-BOARD.md; docs/platform/release/READINESS.md, FIREBASE-PREVIEW.md, INTERNAL-TEST.md, ROLLBACK.md. Reviewers only write separate reports under root workspace output/. Any runtime repair requires a narrow added claim before editing; all media immutable.
- Acceptance: independently review current software, repair/retest actual findings; record user-observed device results accurately; exercise isolated temporary Hosting rollback if possible; record concise revision-bound test results and reviewer verdicts; replace stale setup claims in readiness docs; no missing approval/test may be labeled passed.
- Next action: deploy repaired build37ad329a8f1a2abd4cff to the existing temporary channel, verify actual HTTPS, then independent reviewer closes only this bounded task.

Preserve original1954video/audio/sidecars and temporary locks on episodes2–7. No new media production, account/password/progress mutation, canonical seed/publication, live promotion/billing, merge or M7 opening. User's broad work request authorizes completion efforts, not fabricated reviewer or prerequisite evidence. M6-04/07 BLOCKED cards are not claimed for implementation.

## Narrow repair claim — 2026-10-03

Independent reviewer found P2 catalog Back pushes an extra history entry, so Android/browser Back reopens the just-left video. Root claims src/features/learning/preview1954/Preview1954Learning.tsx and tests/qa/preview1954-ui.test.mjs for history-aware parent back with direct-link fallback and a mixed UI/browser-back regression. Root also claims PreviewEpisode.tsx, new PreviewSourceNotes.tsx and src/services/reference1954/sourceNotes.ts to expose existing reviewed source links and interim context/illustration label; no new narration, historical signoff or media edit. Catalog stays REVIEW until re-review.

User requests no evidence paperwork. Keep tracked updates minimal and use test outputs plus concise reviewer verdict; do not ask for extra device details. Missing physical/manual/media acceptance cannot be turned into PASS by omitting paperwork.

## Automated accessibility repair claim — 2026-10-03

Independent axe scan found unnamed/prohibited mascot semantics and keyboard-inaccessible scrolling in Profile. Root additionally claims src/Mascot.tsx, src/App.tsx (single hotspot owner root), src/components/layout/TopBar.tsx, src/features/ai-assistant/AIScreen.tsx and tests/qa/pwa-polish.test.mjs. Give meaningful images valid semantics, mark decorative AI mascots, expose named focusable scroll regions and valid named status groups; verify axe and keyboard regression. No redesign/token/backend/media change.

## Remaining accessibility repair claim — 2026-10-03

Independent scan found duplicate quiz heading/result IDs when practice and scored consumers coexist, and an unsupported accessible name on the focused Visual Novel scene. Root claims src/features/quiz/v2/QuizFlowView.tsx, src/features/visual-novel/v2/VisualNovelSceneView.tsx and tests/qa/e2e.test.mjs; existing pwa-polish test claim covers repeated-instance label/control regression. Use per-instance React IDs and a named scene group. Existing quiz/reward/story contracts stay unchanged.

## Minimal status handoff claim — 2026-10-03

Root additionally claims docs/tasks/active/M6-06.md, docs/tasks/blocked/M6-07.md, docs/engineering/m6-pwa/accessibility-audit.md and HOSTING-PREVIEW-20261003.md for concise current check results only. No implementation claim or status bypass on BLOCKED tasks. Independent reviewer retains Hosting/catalog cards and their exact board rows until handoff.

## Bounded software handoff — 2026-10-03

Quality PASS: 381 passed, 0 failed, 3 native-only SQL skips; source/client-bundle secret scan 686 files, zero unsafe matches. Reference/package/transport/CORS19/19 and catalog4/4 PASS. Independent accessibility re-review SOFTWARE APPROVE: eight repaired states, zero direct WCAG-tag violations, plus three hosted Auth views without violations; texture contrast requires human judgment, no full conformance claim. Hosting reviewer APPROVE/DONE; catalog APPROVE awaits deployed repaired-build smoke. Original MP4/sidecars/manifest unchanged. Isolated preview rollback PASS; user Android observations retained without another questionnaire. Executor IN PROGRESS → REVIEW. No env/migration/account/reward/media/live impact from these repairs. M6-01/06 REVIEW, M6-04/07 BLOCKED, M7 LOCKED for existing gates.
