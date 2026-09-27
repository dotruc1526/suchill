# Bàn giao sửa PR #21

> Status: REVIEW
> Started: 2026-09-27

- Owner: Thọ (Member 1).
- Executor: Trúc (Member 2), Codex hỗ trợ; Thọ cấp quyền sửa PR #21 theo xác nhận của Trúc ngày 2026-09-27.
- Reviewer: Thọ kiểm tra lại nội dung; Vinh kiểm tra quiz/metadata. Chưa có sign-off cho bản sửa này.
- Branch làm việc: `codex/pr21-content-fixes`; nhánh PR: `feature/content-expansion-mt68`.
- Task: sửa deliverable đang review của CONTENT-010/011/012; đồng bộ hồ sơ CONTENT-003/004 liên quan trực tiếp.
- Dependency: CONTENT-008 ghi DONE trên nhánh PR; đây là sửa bản nháp theo review, không mở milestone hay production.
- Files claimed: Bài 2–4, quiz, HISTORICAL-SOURCES, hai CSV media; CURRICULUM-MAP (quiz/quote/cờ review); PILOT-SCREENPLAY (cờ review/checklist); MVP-BRIEF (link); board; card CONTENT-003/004/010/011/012, card CONTENT-002/008 (hợp nhất bản trùng và giới hạn handoff); blocked README và file này.
- Acceptance: sửa fact sai và câu hỏi không có căn cứ; source ID có locator; media chưa đủ bằng chứng không được coi là cleared; board/card thống nhất; kiểm tra Markdown/JSON/CSV và diff.
- Next action: Thọ review bản sửa trên PR #21; Vinh kiểm tra JSON/metadata; chưa merge hoặc xác nhận DONE.

## Kết quả bản sửa

- Bài 2: phân biệt khuôn viên/tòa nhà Đại sứ quán, bỏ diễn biến chưa có locator, node/media ID ổn định và fallback văn bản; không tự đổi format VN.
- Bài 3: bộc phá không nổ; bỏ khẳng định thương vong không chính xác; nối nguồn kể lại trận đánh và nguồn về di tích.
- Bài 4: qualification cho quan hệ nhân quả, tách niên biểu chính sách/đàm phán; bỏ quote gán cho Cronkite trong curriculum.
- Quiz: bỏ câu hỏi lịch pháp thiếu căn cứ, giữ năm question ID và coverage CLO-1…4; dùng registry nguồn cụ thể. JSON là authoring-only, chưa seed/DTO.
- Media: cả 8 ứng viên chưa được duyệt; category không phải asset; bỏ clearance suy đoán ở CSV nghiên cứu. Không tải hoặc sửa media.
- Hồ sơ: CONTENT-003 REVIEW/NEEDS_REVISION, CONTENT-004 BLOCKED; CONTENT-010/011/012 REVIEW, executor Trúc. Hợp nhất bốn card trùng ID 002/003/004/008, giữ checkpoint và lịch sử Git.
- Pilot: thu hồi cờ READY_FOR_PRODUCTION và checklist ĐẠT chưa có evidence; chưa viết lại toàn bộ kịch bản.

## Verification

- JSON parse: 5 câu; IDs duy nhất, correctOptionId nằm trong options, objective/source ID có đích.
- CSV parse: 8 media ID duy nhất, tất cả UNVERIFIED/BLOCKED; CSV nghiên cứu 10 dòng chưa cleared.
- Kết quả: diff --check đạt; board/card 010/011/012 cùng REVIEW; không còn ID card CONTENT trùng. Quét toàn bộ docs còn đúng hai link media ngoài Git của CONTENT-006, không có local-path lỗi mới trong phần sửa. Chưa kiểm tra mọi URL media bên ngoài; catalog vẫn UNVERIFIED.
- Không chạy build/typecheck: chỉ sửa Markdown/JSON authoring/CSV trong docs; không đổi source, dependency hoặc runtime. Chưa kiểm thử mapper/seed; không tuyên bố JSON sẵn sàng production.
- Không có tác động environment/migration.

## Acceptance còn thiếu — Thọ cần review trước khi merge

1. Historical/learning sign-off cho bản sửa Bài 2–4 và quiz; chấp nhận tier nguồn báo chí phải có người xác nhận.
2. Bài 2 còn thiếu screenplay VN/scene graph/choice/debrief theo curriculum; bản đồ chưa có tọa độ đã kiểm chứng.
3. Pilot: Scene 05, 110s so với cue cuối 115s, lời dẫn/phụ đề, claim giờ/hiệu lệnh/lịch, vật liệu nắp hầm và thử đọc cần xử lý ở CONTENT-004 sau CONTENT-003.
4. Quyền từng ảnh/audio/nhạc/SFX, item source, attribution, caption/alt và asset cuối chưa đầy đủ.
5. Thọ làm rõ ô reviewer chưa đạt ở CONTENT-002 và DOC-012 còn REVIEW; DONE outline CONTENT-008 không duyệt nội dung sửa lần này.
6. Hai link media local của CONTENT-006 không có trong worktree sạch; đó là media ngoài Git đã có từ trước, không sửa hồ sơ CONTENT-006 trong PR này.

Không tự chuyển DONE, không tự merge. CONTENT-006 vẫn IN PROGRESS/REFERENCE_ONLY; CONTENT-007 BLOCKED; M1–M7 LOCKED.
- Blocker: quyền từng media và historical sign-off chưa đủ; pilot còn lỗi từ CONTENT-003, CONTENT-007 vẫn BLOCKED. CONTENT-006 giữ IN PROGRESS và REFERENCE_ONLY; M1–M7 LOCKED.
