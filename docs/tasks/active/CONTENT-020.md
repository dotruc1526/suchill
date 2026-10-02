# CONTENT-020 — Cầu Hàm Rồng – Curriculum, Screenplay & Quiz

> Status: TODO
> Last updated: 2026-10-02

## Assignment

- **Phase / milestone**: Content Track (Phase 2 Expansion)
- **Workstream**: Product + Content / Curriculum & Media authoring
- **Accountable owner**: Thọ (Member 1 — Content Lead)
- **Executor type**: Human (Thọ) + Codex assistance
- **Reviewer**: Trúc (Member 2 — Historical Reviewer), Product Owner (PO nghiệm thu)
- **Branch**: `content/tho-chapter-ham-rong`
- **Started**: 2026-10-02
- **Depends on**: CONTENT-019 (`DONE`)

## Scope

- **In scope**:
  - Add the curriculum map file `docs/content/CURRICULUM-MAP-HAMRONG.md`.
  - Add the screenplay file `docs/content/SCREENPLAY-HAMRONG.md`.
  - Add the quiz bank file `docs/content/QUIZ-HAMRONG.json`.
  - Update the task board with the new files.
  - Ensure all new files pass the existing validators (`validate-1972-authoring.mjs` and any new validator added for this chapter).

- **Out of scope**: UI implementation, video production, deployment scripts.

## Acceptance criteria

- [ ] The three new files are present in the repository under `docs/content/`.
- [ ] All validators run without errors (`node docs/content/validate-1972-authoring.mjs` PASS).
- [ ] A Pull Request is opened from `content/tho-chapter-ham-rong` to `main` with title `feat(content): add Cầu Hàm Rồng curriculum, screenplay & quiz`.
- [ ] PR receives approval from Trúc and the Product Owner, and CI checks pass.

## Verification

- Commands/checks:
  - `git status --porcelain` – no untracked changes after commit.
  - `node docs/content/validate-1972-authoring.mjs` – expected output: PASS.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence |
|---|---|---|---|
| 2026-10-02 | Thọ | Created task card CONTENT-020 | This file |
