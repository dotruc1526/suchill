# CONTENT-006 — Review và phát triển video reference

> Status: IN PROGRESS\
> Last updated: 2026-09-26

## Assignment

- Phase / milestone: Phase 3/4; integration target M3/M6/M7 tùy hướng được chọn
- Workstream: Product + Content / Video
- Accountable owner: Trúc (Member 2)
- Executor type: Human team
- Executor name: Trúc
- Reviewer: Trúc (historical/media reviewer; Thọ cấp quyền review learning objective/wording lịch sử; Product owner cấp quyền chốt media/legal cho CONTENT-006)
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

Reference-only checkpoint đã chốt: learning objective/wording được Trúc review theo quyền Thọ giao; media/legal được Trúc chốt theo quyền Product owner giao ở mức `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`. Các acceptance phía trên vẫn để mở vì chúng áp dụng cho publish/integration package, không phải hồ sơ reference nội bộ.

## Verification

- Commands/checks: media metadata/size/playback; caption/transcript; Phase 3 và Phase 8 checklist.
- Expected result: media package đủ điều kiện để task integration riêng nhận vào.

## Progress checkpoints

| Date/time | Executor | Completed | Evidence | Next action | Blocker |
|---|---|---|---|---|---|
| 2026-09-22 | Codex (review only) | Ghi nhận video 1080×1920, khoảng 93 giây, khoảng 67 MB là `REFERENCE_ONLY` | External local reference | Gán content/video owner và chọn hướng dùng | Chưa có owner; chưa source/history review |
| 2026-09-23 | Codex | Product owner gán Trúc là Member 2, owner dự kiến của video reference | TEAM-OWNERSHIP / DOC-015 | Trúc claim task và chọn hướng đánh giá; historical reviewer kiểm tra nguồn | Chưa claim media file; historical reviewer chưa được chỉ định |
| 2026-09-24 | Trúc | Claim task `CONTENT-006` trên nhánh riêng; Trúc là executor duy nhất, Thọ/historical reviewer/Product owner chỉ review hoặc phối hợp | Task card + task board | Tìm đúng đường dẫn `episode-portrait-final.mp4`, lập review artifact, chọn hướng dùng và learning objective | Historical reviewer chưa được chỉ định; chưa xác minh source/license |
| 2026-09-26 | Trúc (Codex hỗ trợ) | Đồng bộ trạng thái sau quyền mới: objective/wording và media/legal đều đã review trong phạm vi `REFERENCE_ONLY`; không approve publish/integration | Card này, `active.md`, task board | Chỉ tạo việc mới nếu nhóm muốn dùng clip ngoài reference: sửa wording/audio/nhạc/SFX/source export và review lại | Acceptance publish/integration chưa đạt; bản MP4 vẫn chứa wording cũ |
| 2026-09-25 | Trúc (Codex hỗ trợ) | Product owner giao Trúc chốt media/legal; Trúc chốt clip chỉ được dùng nội bộ/reference, không approve publish/integration | Media/legal decision trong `active.md` | Nếu muốn dùng ngoài reference, tạo media package mới: sửa wording, thay/xác minh audio/nhạc/SFX, khóa source export | MP4 hiện tại vẫn chứa wording cũ; quyền publish audio/nhạc/SFX và source export chưa đủ bằng chứng |
| 2026-09-25 | Trúc (Codex hỗ trợ) | Thọ đã cấp quyền cho Trúc review learning objective và wording lịch sử; objective được chấp nhận ở mức `REFERENCE_ONLY`; claim 01:17–01:29 chốt hướng sửa, không giữ cụm “tâm điểm của cả cuộc chiến” | Bảng claim và objective trong `active.md` | Product owner giao Trúc chốt media/legal; nếu dùng ngoài reference phải sửa/kiểm lại media package | Trúc đồng thời là executor; bản MP4 hiện tại vẫn có wording cũ |
| 2026-09-24 | Trúc (Codex hỗ trợ) | Đối chiếu năm nhóm claim lời dẫn với ba nguồn có locator; bốn nhóm `VERIFIED`, một nhóm `NEEDS_REVISION` vì cụm “tâm điểm của cả cuộc chiến” quá rộng | Bảng claim và nguồn S1–S3 trong `active.md` | Superseded by 2026-09-25: Trúc đã chốt objective/wording và media/legal cho reference-only | Trúc đồng thời là executor; bản MP4 hiện tại vẫn cần sửa wording nếu dùng lại |

## Handoff

- Checkpoint đồng bộ 2026-09-26: sau khi Thọ giao Trúc review learning objective/wording và Product owner giao Trúc chốt media/legal, hồ sơ CONTENT-006 được đồng bộ ở trạng thái `IN PROGRESS` + `REFERENCE_ONLY`. Trúc đã chấp nhận objective cho mục đích reference nội bộ, xác định wording 01:17–01:29 phải sửa trước khi dùng lại, và chốt media/legal là `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`. Không chuyển `REVIEW`/`DONE`, không coi video là canonical, không mở M1. Docs-only; không build/typecheck vì không sửa code/media. Next: không có việc bắt buộc ngay nếu chỉ giữ reference; nếu muốn dùng ngoài reference, tạo media package mới và review lại.

- Checkpoint learning/wording 2026-09-25: theo thông tin Trúc cung cấp, Thọ đã cấp quyền cho Trúc làm phần review learning objective và wording lịch sử của CONTENT-006. Kết luận trong phạm vi này: learning objective hiện có được chấp nhận cho hồ sơ `REFERENCE_ONLY` (“người xem nêu được mục tiêu tập trung lực lượng của Kế hoạch Navarre và mối liên hệ với việc Pháp phải phân tán lực lượng đối phó trên nhiều hướng”), nhưng chưa chốt hướng tích hợp sản phẩm. Wording lịch sử cần sửa ở 01:17–01:29: không giữ cụm “tâm điểm của cả cuộc chiến”; dùng wording hẹp hơn như “trở thành điểm quyết chiến chiến lược của hai bên” hoặc “trở thành tâm điểm của cuộc đối đầu Đông Xuân 1953–1954”. Bốn nhóm claim còn lại giữ `VERIFIED`; claim cuối chuyển từ `NEEDS_REVISION` sang `REVISION_REQUIRED_BEFORE_USE`, nghĩa là bản video hiện tại vẫn không đủ điều kiện publish/integration nếu chưa sửa script/subtitle/audio hoặc ghi rõ đây là lỗi wording còn tồn tại. CONTENT-006 vẫn `IN PROGRESS`, video vẫn `REFERENCE_ONLY`; chưa chuyển REVIEW/DONE, chưa coi canonical, chưa mở M1. Docs-only; không build/typecheck vì không sửa code. Next: nếu muốn dùng ngoài reference, tạo media package mới và review lại.

- Checkpoint media/legal 2026-09-25: theo thông tin Trúc cung cấp, Product owner cũng muốn Trúc chốt phần media/legal. Trúc chốt media/legal ở mức `APPROVED_FOR_INTERNAL_REFERENCE_ONLY`: clip “Trước cơn bão” được giữ làm tài liệu tham khảo nội bộ, nhưng không được approve để publish, tích hợp lesson/VN, teaser công khai hoặc canonical media. Lý do: quyền phát hành audio Microsoft Neural TTS qua `edge-tts` chưa chứng minh được theo điều khoản áp dụng; nhạc/SFX chưa có permission/manifest; source export cuối chưa khóa vì file/hash/report không khớp đủ; asset AI/Codex thiếu model/prompt/session gốc. Natural Earth/font bitmap có căn cứ riêng nhưng không giải quyết các thiếu sót trên. CONTENT-006 vẫn `IN PROGRESS`, video vẫn `REFERENCE_ONLY`; không chuyển REVIEW/DONE, không mở M1. Docs-only; không build/typecheck vì không sửa code/media. Next: nếu muốn dùng ngoài reference, tạo task/media package mới để sửa wording, thay hoặc chứng minh quyền audio/nhạc/SFX, khóa manifest/hash/source export, rồi review lại.

- Checkpoint claim lịch sử 2026-09-24: Trúc, với vai trò historical/media reviewer đã xác nhận, hoàn tất lượt đối chiếu năm nhóm claim trong lời dẫn; Codex hỗ trợ tra cứu và ghi locator. Bốn nhóm được đánh dấu `VERIFIED`; nhóm 01:17–01:29 là `NEEDS_REVISION` vì “tâm điểm của cả cuộc chiến” rộng hơn bằng chứng. Chi tiết và đề xuất wording tại [active.md](./active.md). Đây là review phía executor, chưa phải kiểm tra độc lập. CONTENT-006 giữ `IN PROGRESS`, video giữ `REFERENCE_ONLY`; không chốt hướng tích hợp, không mở M1. Docs-only; không build/typecheck vì không sửa code; không env/migration impact. Superseded by 2026-09-25: Trúc đã chốt objective/wording và media/legal cho reference-only.

- Checkpoint historical/media 2026-09-24: Trúc xác nhận mình là historical/media reviewer riêng và đã xác nhận clip "oke". Kết luận trong phạm vi evidence hiện có: chấp nhận giữ `REFERENCE_ONLY` để tham khảo nội bộ; chưa duyệt tích hợp hoặc phát hành. Đây chưa phải xác nhận từng claim lịch sử: bảng claim trong `active.md` còn chờ đối chiếu nguồn; quyền audio Edge TTS, nhạc/SFX và chuỗi nguồn/xuất bản cuối vẫn UNKNOWN. Docs-only, không build/typecheck; không env/migration impact. Superseded by 2026-09-25: Trúc đã review claim/objective và chốt media/legal ở mức reference-only.

- Checkpoint executor 2026-09-24: Trúc xác nhận “mọi thứ đều oke” sau khi đã xác nhận clip, mascot, tranh minh họa và thông tin giọng đọc hiện có. Đây là xác nhận bàn giao của executor, không thay thế historical/media/license review và không tự chuyển task sang DONE. Superseded by 2026-09-25: Product owner giao Trúc chốt media/legal; quyết định là reference-only, không publish/integration.

- Checkpoint provenance tranh 2026-09-24: Trúc xác nhận các tranh trong danh sách đều do Codex tạo; phiên tạo/prompt/project gốc không còn lưu. Đã cập nhật [active.md](./active.md) để không yêu cầu Trúc đoán lại thông tin đã mất. CONTENT-006 vẫn IN PROGRESS và video vẫn REFERENCE_ONLY; quyết định media/legal 2026-09-25 chỉ cho phép reference nội bộ, không publish/integration. Files changed: active.md, CONTENT-006.md, TASK-BOARD.md. Verification: docs-only, kiểm tra diff/link sau cập nhật; không build/typecheck vì không sửa code.

- Checkpoint quyền/nguồn xuất 2026-09-24: đã tra README/LICENSE `edge-tts`, Microsoft Services Agreement và Microsoft Font FAQ; nguồn và kết luận chi tiết tại [active.md](./active.md). Có căn cứ cho chữ bitmap trong video theo điều kiện Microsoft; quyền phát hành audio Edge TTS vẫn UNKNOWN, không suy từ giấy phép thư viện. File visual nguồn ở ổ D tồn tại nhưng PCM 90 giây đầu khác MP4 hiện tại; report final thiếu các hash mà script khóa audio dự kiến ghi. Hash MP4 hiện tại không đổi. Đính chính mức evidence “clip oke”: xác nhận tổng thể của Trúc, chưa chứng minh kiểm tra riêng từng cue. Files changed: active.md, CONTENT-006.md, TASK-BOARD.md. Verification: đọc nguồn chính thức, kiểm tra đường dẫn/hash/PCM, kiểm tra diff tài liệu; không build/typecheck vì chỉ sửa Markdown; không env/migration impact. Superseded by 2026-09-25 media/legal decision: reference-only, không publish/integration.

- Checkpoint nghe/xem clip 2026-09-24: Trúc xác nhận “clip oke” cho `public/media/truoc-con-bao/episode-portrait-final.mp4`. Đã cập nhật phiếu 28 cue trong [active.md](./active.md): không ghi lỗi lời đọc, phụ đề, độ rõ giọng hoặc chữ; thiết bị/ứng dụng phát chưa ghi. Đây là evidence từ executor cho kiểm tra nghe/nhìn, không thay thế historical/media/license review. Superseded by 2026-09-25 media/legal decision: reference-only, không publish/integration.

- Checkpoint provenance bổ sung 2026-09-24: theo yêu cầu Trúc, đã điền công cụ/dịch vụ còn thiếu trong [active.md](./active.md): mascot SỬu ghi tên công cụ/model cụ thể là “Không nhớ”; giọng đọc ghi Microsoft Neural TTS dùng qua Edge TTS bằng thư viện `edge-tts`, voice `vi-VN-NamMinhNeural`, rate `-25%`, pitch `+0Hz`, thời điểm tạo “Không nhớ”. Docs-only; không env/migration impact; không cần build/typecheck. Next: đối chiếu điều khoản Microsoft Neural TTS/Edge TTS, xác nhận audio nhúng trong MP4 và nghe 28 cue.

- Checkpoint phiếu thực hiện 2026-09-24: đã thêm phần “Bắt đầu tại đây” ở đầu [active.md](./active.md), gồm mẫu bổ sung nguồn đã điền sẵn thông tin Trúc cung cấp và phiếu nghe 28 cue chia 6 lượt theo VTT. Executor vẫn Trúc. Next: điền công cụ/dịch vụ tạo asset còn thiếu, sau đó nghe MP4 và ghi kết quả từng nhóm cue. Chưa có kết quả nghe hoặc approval mới. Files changed: active.md, CONTENT-006.md, TASK-BOARD.md; docs-only, không env/migration impact; không cần build/typecheck.

- Checkpoint provenance 2026-09-24: Trúc cung cấp thông tin nguồn tạo asset: mascot SỬu do AI generate; tranh minh họa do Codex tạo; giọng đọc là giọng tiếng Việt nam của Microsoft Neural TTS, đã chỉnh tốc độ/chất lượng hậu kỳ cho nhân vật SỬu. Đã ghi vào [active.md](./active.md) như user-provided provenance. Next: bổ sung công cụ/model hoặc dịch vụ cụ thể, prompt/file gốc nếu còn, điều khoản/quyền dùng tương ứng và xác nhận audio nhúng trong MP4; vẫn cần historical/media reviewer sign-off trước REVIEW/DONE.

- Checkpoint trực tiếp 2026-09-24: FFmpeg giải mã MP4 hiện tại đủ 2.241 frame, không lỗi; đã xem 12 khung mẫu. PCM 90 giây đầu khác audio rời, chưa xác định nguyên nhân hoặc đồng bộ lời đọc. Natural Earth xác minh điều khoản public domain cho dữ liệu nền; các asset khác có sổ nguồn/UNKNOWN tại [active.md](./active.md). Docs-only; không env/migration impact. Superseded by 2026-09-25 media/legal decision: reference-only, không publish/integration.

- Checkpoint kiểm kê 2026-09-24: hồ sơ review sơ bộ đã điền tại [active.md](./active.md): 28 cue VTT khớp text/timing cues.json, đã xem poster, lập bảng nguồn/claim và quyền asset, transcript từ VTT, fallback/alt dự thảo. Transcript app là bản tóm tắt; hash report sync cũ khác MP4 hiện tại. Không thay code/media; chưa chạy playback/decode/build; task IN PROGRESS. Superseded by 2026-09-25: claim/objective/media/legal đã được chốt ở mức reference-only.

- Xác nhận mới nhất 2026-09-24: Trúc chọn “Trước cơn bão”, đường dẫn `public/media/truoc-con-bao/episode-portrait-final.mp4`, làm reference cho task. Bước nhận diện clip hoàn tất theo xác nhận người dùng; chênh lệch bản ~67 MB vẫn là lưu ý phiên bản. Tiếp theo lập hồ sơ nguồn/media cho clip này; source/license và reviewer chuyên môn vẫn chưa được xác nhận.

- Checkpoint 2026-09-24: Trúc, với Codex hỗ trợ, hoàn tất khảo sát identity hai file trùng tên; evidence và SHA-256 tại [active.md](./active.md). Tập 1 gần thời lượng reference nhưng khác dung lượng; chưa xác nhận bản gốc. Tiếp theo: Trúc/người cung cấp xác nhận đường dẫn/bản reference gốc và nguồn bàn giao. Chưa chạy decode/playback, chưa xác minh lịch sử/license; giữ task IN PROGRESS vì còn có thể chuẩn bị hồ sơ, chưa đạt acceptance để REVIEW.

- Changed files: docs only.
- Test/build result: chưa tích hợp app.
- Environment/migration impact: không có.
- Known issues/risks: một claim cần sửa wording trong bản media; audio Edge TTS, nhạc/SFX và chuỗi xuất cuối chưa đủ bằng chứng publish; accessibility/mobile package chưa đạt.
- Next owner/action: nếu muốn dùng ngoài `REFERENCE_ONLY`, tạo task/media package mới để sửa wording, thay hoặc chứng minh quyền audio/nhạc/SFX, khóa manifest/hash/source export và chạy lại review. Video hiện chỉ `REFERENCE_ONLY`.
