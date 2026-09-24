---
name: su-chill-task-handoff
description: Prepare or receive the single active Sử Chill task before coding, validate its card, dependencies, file claims, model choice, and scope, and prevent work outside the approved handoff.
---

# Sử Chill task handoff

Use this skill when creating `active.md`, choosing the next Sử Chill task, handing work to another human/AI, or starting a task that was handed off.

## Read the sources

Read each selected file completely in this order:

1. Repository `AGENTS.md`.
2. `docs/README.md`.
3. `docs/project/TASK-BOARD.md`.
4. `ARCHITECTURE.md`.
5. Root `active.md`.
6. The task card and only the specs/features it links.

Treat `active.md` as a pointer, not a new source of product contracts. Resolve conflicts using the precedence in `AGENTS.md`; report the conflict instead of silently changing a contract.

## Create a handoff

Write exactly one task in `active.md`. Include:

- task ID, title, milestone, status, dependency and task-card link;
- proposed branch, executor/reviewer and file claims or the condition for claiming them;
- recommended model and reasoning effort with a short workload-based rationale;
- required skills and exact read order;
- in-scope steps, forbidden work, verification and completion conditions;
- explicit stop conditions and the next reviewer/owner.

Use current official OpenAI documentation when a model recommendation is newly created or materially changed. Prefer the lightest model/effort that meets the task's risk and completeness needs.

Do not mark a task executable merely because it appears in `active.md`. Board/card status and dependency gates remain authoritative.

## Receive a handoff

Before editing:

1. Confirm `active.md` names exactly one task and matches the board/card.
2. Confirm the milestone is open, dependencies are satisfied and the task is `READY` or `IN PROGRESS`.
3. Confirm owner, executor, reviewer, branch, started date and exact file claims.
4. Check hotspot claims and existing Git changes.
5. If any check fails, update or report the handoff only; do not code.

During execution:

- Work only on the handed-off task and claimed files.
- Do not start a newly unblocked task in the same run.
- Record meaningful checkpoints, commands, evidence, blockers and environment/migration impact in the task card.
- Move completed implementation to `REVIEW`; only the reviewer moves it to `DONE`.

## Stop conditions

Stop before implementation when `active.md` is missing/stale, the task is blocked, a dependency or milestone gate is unmet, a file claim conflicts, a required decision is absent, or the requested work extends beyond the task card.

After completing the task, stop at handoff. Change `active.md` to the next task only after reviewer/Product owner approval is recorded on the board/card.
