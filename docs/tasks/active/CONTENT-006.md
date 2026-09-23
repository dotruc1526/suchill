# CONTENT-006 — Review và phát triển video reference

> Status: READY\
> Last updated: 2026-09-23

## Assignment

- Phase / milestone: Phase 3/4; integration target M3/M6/M7 tùy hướng được chọn
- Workstream: Product + Content / Video
- Accountable owner: Trúc (Member 2)
- Executor type: Human team
- Executor name: Chưa gán
- Reviewer: Historical reviewer + Thọ (Member 1) + Product owner
- Codex task/thread: —
- Branch: —
- Started: chưa bắt đầu implementation
- Depends on: DOC-004 (`DONE`)

## Scope

- In scope: đánh giá và chọn dùng video làm video lesson, media trong Visual Novel hoặc nội dung mở rộng.
- Out of scope: đưa thẳng file reference vào production hoặc tự động coi nội dung là chính xác.
- Files claimed: chưa claim; external `episode-portrait-final.mp4` là reference, Trúc ghi đường dẫn media/docs khi nhận task.
- Shared-contract consumers: media service, lesson/VN renderer, accessibility và content QA.

## Acceptance criteria

- [ ] Chọn hướng tích hợp và learning objective.
- [ ] Historical/source/media review đạt.
- [ ] Có transcript, caption tiếng Việt, poster, attribution và fallback.
- [ ] Có mobile rendition/compression phù hợp performance budget.

## Verification

- Commands/checks: media metadata/size/playback; caption/transcript; Phase 3 và Phase 8 checklist.
- Expected result: media package đủ điều kiện để task integration riêng nhận vào.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-22 | Codex (review only) | Ghi nhận video 1080×1920, khoảng 93 giây, khoảng 67 MB là `REFERENCE_ONLY` | External local reference | Gán content/video owner và chọn hướng dùng | Chưa có owner; chưa source/history review |
| 2026-09-23 | Codex | Product owner gán Trúc là Member 2, owner dự kiến của video reference | TEAM-OWNERSHIP / DOC-015 | Trúc claim task và chọn hướng đánh giá; historical reviewer kiểm tra nguồn | Chưa claim media file; historical reviewer chưa được chỉ định |

## Handoff

- Changed files: docs only.
- Test/build result: chưa tích hợp app.
- Environment/migration impact: không có.
- Known issues/risks: dung lượng lớn; độ chính xác lịch sử, license/source và accessibility chưa sign-off.
- Next owner/action: Trúc nhận CONTENT-006 nếu muốn xử lý video reference; không mặc định dùng cho video MVP CONTENT-007.
