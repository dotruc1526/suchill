# BATTLE-002 — Review AI Battle để tích hợp

> Status: BLOCKED\
> Last updated: 2026-09-23

## Assignment

- Phase / milestone: Experimental track; ngoài MVP gate hiện tại
- Workstream: Product + Frontend + Backend + QA
- Accountable owner: Chưa gán
- Executor type: Human/Codex sau handoff
- Executor name: Chưa gán
- Reviewer: Product owner + security/content reviewers
- Codex task/thread: Chưa có
- Branch: Chưa có
- Started: Chưa bắt đầu
- Depends on: BATTLE-001, DOC-006 (`DONE`), DOC-007 (`DONE`), integration approval

## Scope

- In scope: review prototype handoff, luật chơi, content, service contract, secret boundary, test và kế hoạch tích hợp.
- Out of scope: merge code, gọi AI key từ browser hoặc ghi XP/streak authoritative trước review.
- Files claimed: chưa claim; dự kiến review record và integration plan.
- Shared-contract consumers: `src/features/ai-battle/`, services, progress/reward, QA.

## Acceptance criteria

- [ ] BATTLE-001 bàn giao repo/branch, demo, rules, data/API contract và known issues.
- [ ] Security/content/reward boundary được review; test và migration impact được ghi.
- [ ] Product owner quyết định có tích hợp và task implementation mới được tạo nếu duyệt.

## Verification

- Commands/checks: handoff review, threat/content/contract checklist.
- Expected result: quyết định tích hợp dựa trên evidence, không tự cộng reward.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-23 | Codex | Tạo card review độc lập | Task board / DOC-013 | Chờ BATTLE-001 handoff | Chưa có repo/branch/contract bàn giao |

## Handoff

- Changed files: chưa có.
- Test/build result: chưa áp dụng.
- Environment/migration impact: chưa biết; sẽ review sau handoff.
- Known issues/risks: AI key và reward boundary chưa được review.
- Next owner/action: nhóm AI Battle bàn giao BATTLE-001; Product owner quyết định mở review.
