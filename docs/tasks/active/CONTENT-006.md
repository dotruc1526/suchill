# CONTENT-006 — Review và phát triển video reference

> Status: IN PROGRESS\
> Last updated: 2026-09-24

## Assignment

- Phase / milestone: Phase 3/4; integration target M3/M6/M7 tùy hướng được chọn
- Workstream: Product + Content / Video
- Accountable owner: Trúc (Member 2)
- Executor type: Human team
- Executor name: Trúc
- Reviewer: Historical reviewer + Thọ (Member 1) + Product owner
- Codex task/thread: —
- Branch: `codex/truc-content-006-video-reference`
- Started: 2026-09-24
- Depends on: DOC-004 (`DONE`)

## Scope

- In scope: đánh giá và chọn dùng video làm video lesson, media trong Visual Novel hoặc nội dung mở rộng.
- Out of scope: đưa thẳng file reference vào production hoặc tự động coi nội dung là chính xác.
- Files claimed: `docs/tasks/active/CONTENT-006.md`, `docs/project/TASK-BOARD.md`, `docs/tasks/active/active.md` (hồ sơ nhận diện/bàn giao). Media chỉ đọc để nhận diện, chưa claim chỉnh sửa.
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
| 2026-09-24 | Trúc | Claim task `CONTENT-006` trên nhánh riêng; Trúc là executor duy nhất, Thọ/historical reviewer/Product owner chỉ review hoặc phối hợp | Task card + task board | Tìm đúng đường dẫn `episode-portrait-final.mp4`, lập review artifact, chọn hướng dùng và learning objective | Historical reviewer chưa được chỉ định; chưa xác minh source/license |

## Handoff

- Checkpoint executor 2026-09-24: Trúc xác nhận “mọi thứ đều oke” sau khi đã xác nhận clip, mascot, tranh minh họa và thông tin giọng đọc hiện có. Đây là xác nhận bàn giao của executor, không thay thế historical/media/license review và không tự chuyển task sang DONE. Next: Product owner chỉ định historical/media reviewer; reviewer quyết định quyền audio Edge TTS, nhạc/SFX, history và hướng dùng reference.

- Checkpoint provenance tranh 2026-09-24: Trúc xác nhận các tranh trong danh sách đều do Codex tạo; phiên tạo/prompt/project gốc không còn lưu. Đã cập nhật [active.md](./active.md) để không yêu cầu Trúc đoán lại thông tin đã mất. CONTENT-006 vẫn IN PROGRESS và video vẫn REFERENCE_ONLY vì quyền audio Edge TTS, nhạc/SFX, nguồn xuất cuối và historical/media sign-off chưa được reviewer quyết định. Files changed: active.md, CONTENT-006.md, TASK-BOARD.md. Verification: docs-only, kiểm tra diff/link sau cập nhật; không build/typecheck vì không sửa code.

- Checkpoint quyền/nguồn xuất 2026-09-24: đã tra README/LICENSE `edge-tts`, Microsoft Services Agreement và Microsoft Font FAQ; nguồn và kết luận chi tiết tại [active.md](./active.md). Có căn cứ cho chữ bitmap trong video theo điều kiện Microsoft; quyền phát hành audio Edge TTS vẫn UNKNOWN, không suy từ giấy phép thư viện. File visual nguồn ở ổ D tồn tại nhưng PCM 90 giây đầu khác MP4 hiện tại; report final thiếu các hash mà script khóa audio dự kiến ghi. Hash MP4 hiện tại không đổi. Đính chính mức evidence “clip oke”: xác nhận tổng thể của Trúc, chưa chứng minh kiểm tra riêng từng cue. Files changed: active.md, CONTENT-006.md, TASK-BOARD.md. Verification: đọc nguồn chính thức, kiểm tra đường dẫn/hash/PCM, kiểm tra diff tài liệu; không build/typecheck vì chỉ sửa Markdown; không env/migration impact. Next: Product owner chỉ định reviewer để xử lý quyền/history còn thiếu.

- Checkpoint nghe/xem clip 2026-09-24: Trúc xác nhận “clip oke” cho `public/media/truoc-con-bao/episode-portrait-final.mp4`. Đã cập nhật phiếu 28 cue trong [active.md](./active.md): không ghi lỗi lời đọc, phụ đề, độ rõ giọng hoặc chữ; thiết bị/ứng dụng phát chưa ghi. Đây là evidence từ executor cho kiểm tra nghe/nhìn, không thay thế historical/media/license review. Next: đối chiếu điều khoản Microsoft Neural TTS/Edge TTS, xác nhận audio nhúng/nguồn xuất cuối nếu còn, hoàn thiện permission các asset UNKNOWN và chờ Product owner chỉ định reviewer.

- Checkpoint provenance bổ sung 2026-09-24: theo yêu cầu Trúc, đã điền công cụ/dịch vụ còn thiếu trong [active.md](./active.md): mascot SỬu ghi tên công cụ/model cụ thể là “Không nhớ”; giọng đọc ghi Microsoft Neural TTS dùng qua Edge TTS bằng thư viện `edge-tts`, voice `vi-VN-NamMinhNeural`, rate `-25%`, pitch `+0Hz`, thời điểm tạo “Không nhớ”. Docs-only; không env/migration impact; không cần build/typecheck. Next: đối chiếu điều khoản Microsoft Neural TTS/Edge TTS, xác nhận audio nhúng trong MP4 và nghe 28 cue.

- Checkpoint phiếu thực hiện 2026-09-24: đã thêm phần “Bắt đầu tại đây” ở đầu [active.md](./active.md), gồm mẫu bổ sung nguồn đã điền sẵn thông tin Trúc cung cấp và phiếu nghe 28 cue chia 6 lượt theo VTT. Executor vẫn Trúc. Next: điền công cụ/dịch vụ tạo asset còn thiếu, sau đó nghe MP4 và ghi kết quả từng nhóm cue. Chưa có kết quả nghe hoặc approval mới. Files changed: active.md, CONTENT-006.md, TASK-BOARD.md; docs-only, không env/migration impact; không cần build/typecheck.

- Checkpoint provenance 2026-09-24: Trúc cung cấp thông tin nguồn tạo asset: mascot SỬu do AI generate; tranh minh họa do Codex tạo; giọng đọc là giọng tiếng Việt nam của Microsoft Neural TTS, đã chỉnh tốc độ/chất lượng hậu kỳ cho nhân vật SỬu. Đã ghi vào [active.md](./active.md) như user-provided provenance. Next: bổ sung công cụ/model hoặc dịch vụ cụ thể, prompt/file gốc nếu còn, điều khoản/quyền dùng tương ứng và xác nhận audio nhúng trong MP4; vẫn cần historical/media reviewer sign-off trước REVIEW/DONE.

- Checkpoint trực tiếp 2026-09-24: FFmpeg giải mã MP4 hiện tại đủ 2.241 frame, không lỗi; đã xem 12 khung mẫu. PCM 90 giây đầu khác audio rời, chưa xác định nguyên nhân hoặc đồng bộ lời đọc. Natural Earth xác minh điều khoản public domain cho dữ liệu nền; các asset khác có sổ nguồn/UNKNOWN tại [active.md](./active.md). Next: Trúc bổ sung provenance và xác nhận audio dùng khi xuất; nghe đối chiếu 28 cue; Product owner chỉ định reviewer. Docs-only; không env/migration impact; chưa sign-off lịch sử/media.

- Checkpoint kiểm kê 2026-09-24: hồ sơ review sơ bộ đã điền tại [active.md](./active.md): 28 cue VTT khớp text/timing cues.json, đã xem poster, lập bảng nguồn/claim và quyền asset, transcript từ VTT, fallback/alt dự thảo. Transcript app là bản tóm tắt; hash report sync cũ khác MP4 hiện tại. Nguồn S1 đọc lỗi 502, S2 đọc được nhưng chưa có historical sign-off. Next: Trúc bổ sung provenance/permission từng asset và đối chiếu audio/video bản hiện tại; Product owner chỉ định reviewer. Không thay code/media; chưa chạy playback/decode/build; task IN PROGRESS.

- Xác nhận mới nhất 2026-09-24: Trúc chọn “Trước cơn bão”, đường dẫn `public/media/truoc-con-bao/episode-portrait-final.mp4`, làm reference cho task. Bước nhận diện clip hoàn tất theo xác nhận người dùng; chênh lệch bản ~67 MB vẫn là lưu ý phiên bản. Tiếp theo lập hồ sơ nguồn/media cho clip này; source/license và reviewer chuyên môn vẫn chưa được xác nhận.

- Checkpoint 2026-09-24: Trúc, với Codex hỗ trợ, hoàn tất khảo sát identity hai file trùng tên; evidence và SHA-256 tại [active.md](./active.md). Tập 1 gần thời lượng reference nhưng khác dung lượng; chưa xác nhận bản gốc. Tiếp theo: Trúc/người cung cấp xác nhận đường dẫn/bản reference gốc và nguồn bàn giao. Chưa chạy decode/playback, chưa xác minh lịch sử/license; giữ task IN PROGRESS vì còn có thể chuẩn bị hồ sơ, chưa đạt acceptance để REVIEW.

- Changed files: docs only.
- Test/build result: chưa tích hợp app.
- Environment/migration impact: không có.
- Known issues/risks: dung lượng lớn; độ chính xác lịch sử, license/source và accessibility chưa sign-off.
- Next owner/action: Product owner chỉ định historical/media reviewer. Trúc đã xác nhận executor-side “mọi thứ đều oke”; tranh trong danh sách đều do Codex tạo và phiên tạo/project gốc không còn lưu. Đã tra cứu điều khoản công khai; quyền audio Edge TTS vẫn UNKNOWN và cần reviewer xử lý. Evidence và một việc tiếp theo ở đầu `active.md`.
