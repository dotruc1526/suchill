# CONTENT-003/004 — Review và bàn giao 2026-09-28

Owner/executor: Trúc (Member 2); Codex thực hiện review hỗ trợ theo yêu cầu. Reviewer: Trúc historical/learning/media, Vinh technical QA. Branch: `codex/content-status-sync`. Status: REVIEW, verdict NEEDS_SIGNOFF_AND_MEDIA_EVIDENCE; không phải chữ ký duyệt của Trúc/Vinh.

## Bản được kiểm tra và regression đã sửa

Đã fetch main tại `b2f1451` và hợp nhất vào nhánh tài liệu; giữ các quyết định FE/PO mới. Commit `50bcd1f` thay ba tài liệu từ bản authoring `6a21468` thành bản cũ. Validator trước sửa FAIL `Missing source: SRC-MT68-03`. Khôi phục nội dung ba file dưới đây từ `6a21468`, không sửa narration/VTT/JSON và không khôi phục toàn repo:

- [Registry](../../content/HISTORICAL-SOURCES.md): khôi phục sáu source ID, bảy claim ID và locator; gỡ nhãn Verified chung, gán sai Đội 11 và suy luận quyền media tự động.
- [Screenplay](../../content/PILOT-SCREENPLAY.md): đồng nhất với chín cue narration/VTT v2, năm scene 110s; gỡ APPROVED/READY_FOR_PRODUCTION và checklist ĐẠT chưa có bản xuất.
- [Curriculum](../../content/CURRICULUM-MAP.md): khôi phục mục tiêu/coverage khớp gói authoring; bỏ quiz Markdown cũ mâu thuẫn JSON, không thay chapter đã chọn hay trạng thái task CONTENT-008.

## Đối chiếu toàn bộ lời dẫn pilot

Tra cứu ngày 2026-09-28. SUPPORTED chỉ nghĩa nguồn đọc được hỗ trợ wording giới hạn, không phải human sign-off. Các link/locator chi tiết nằm trong registry.

| Cue / claim | Nguồn và locator đã kiểm tra | Kết quả |
|---|---|---|
| p01a / CLM-MT68-07 | [Office of the Historian](https://history.state.gov/milestones/1961-1968/tet), mở đầu và đoạn “The first phase” | SUPPORTED: cuối tháng 1, nhiều đô thị; không đồng nhất thời điểm mọi nơi |
| p01b | Mục tiêu giới thiệu cách đọc nguồn | Educational explanation; không có fact mới |
| p02a, p02b / CLM-MT68-04 | [VOH](https://voh.com.vn/du-lich/can-nha-287-70-dia-chi-do-mang-ten-biet-dong-sai-gon-492233.html), đoạn Trần Văn Lai và Đội 5 nhận vũ khí; đối chiếu [Nhân Dân](https://nhandan.vn/dem-mua-xuan-nam-ay-post382619.html), đoạn đội Biệt động 5 có mặt tại hầm | SUPPORTED trong giới hạn hậu cần; ảnh hiện trạng không là ảnh năm 1968. VOH là báo chí có biên tập, cần Trúc chấp nhận tier nguồn |
| p03a, p03b / CLM-MT68-01 | [TTDN/nguồn baotintuc.vn](https://ttdn.vn/nghien-cuu-trao-doi/ly-luan-thuc-tien/biet-dong-sai-gon-cu-dam-thep-xuan-mau-than-1968-bai-3-nhung-chien-cong-hien-hach-72809), đoạn nêu 5 mục tiêu chiến lược; đối chiếu [Nhân Dân](https://nhandan.vn/special/bietdongsaigon-chinnghia/index.html), đoạn các đội biệt động tấn công và caption 5 mục tiêu trọng yếu | SUPPORTED_WITH_REPLACEMENT_SOURCE: danh sách năm mục tiêu đọc được gồm Dinh Độc Lập, Đại sứ quán Mỹ, Bộ Tổng tham mưu, Bộ Tư lệnh Hải quân và Đài Phát thanh Sài Gòn. URL QĐND cũ vẫn redirect loop nên không dùng làm locator hiện hành |
| p04a / CLM-MT68-02 | [ADST](https://adst.org/2013/07/viet-cong-invade-american-embassy-the-1968-tet-offensive/), phần phân biệt grounds/building và tường thuật Wendt | SUPPORTED: phân biệt khuôn viên với tòa nhà. Lời dẫn có ngày khác; không dùng nguồn này chứng minh ngày/giờ trong pilot |
| p04b / CLM-MT68-03 | [Nhân Dân](https://nhandan.vn/dem-mua-xuan-nam-ay-post382619.html), đoạn đội hình tới cổng sau và bộc phá không nổ | SUPPORTED; không chuyển thành khẳng định cổng bị phá sập |
| p05 | Chỉ dẫn sang Bài 2 đọc nguồn | Educational explanation; không có fact mới |

Đối chiếu liên kết curriculum/quiz: [FRUS Document 230](https://history.state.gov/historicaldocuments/frus1964-68v06/d230), đoạn đầu hỗ trợ mốc phiên họp toàn thể 13/5/1968 của CLM-MT68-06. CLM-MT68-05 là diễn giải tác động, giữ qualification và góc nhìn nguồn; không suy ra một trận đánh lập tức kết thúc chiến tranh. Đây không thay full sign-off Bài 2–4.

## Learning và pacing

- CLO-1 có cue p01a và câu hỏi q-mt68-01; CLO-3 có p02a/p02b và q-mt68-03. Scene 3–4 chuẩn bị cho CLO-2 của Bài 2.
- Narrator ngoài bối cảnh; sơ đồ ghi DIỄN GIẢI GIÁO DỤC, không giả nhân chứng, không cho người học đổi kết quả lịch sử.
- Chín cue liên tục 0–110s, JSON/VTT khớp chữ. Đây là timing kế hoạch; chưa có audio để đo nhịp nói hoặc nghe nghiệm thu.
- Transcript là narration JSON theo thứ tự cue; fallback đọc cùng chữ, tránh một bản lời dẫn khác. Cần kiểm tra wrap/cỡ chữ/caption trên video thật sau này.

## Media review

Đọc đủ tám dòng catalog và MEDIA-REVIEW-MT68. MED-01/02/03/05/06/07 còn BLOCKED; MED-04/08 NEEDS_MEDIA_REVIEW theo hồ sơ có sẵn. Không tái xác nhận license của asset chưa dùng trong lượt này. Tất cả chỉ là candidate optional, không gắn vào pilot bắt buộc.

Phương án hiện hành: chữ/sơ đồ nguyên bản, narration mới có quyền; không nhạc/SFX, không bản ghi thơ, không clip CBS, không audio Edge TTS từ CONTENT-006. Chưa có audio, font/source thiết kế hoặc file xuất thật để duyệt. Quyền thực hiện review không thay evidence quyền sử dụng.

Phân biệt gate: trước sản xuất cần script/claim được duyệt và phương án quyền media rõ; MP4/poster/hash/playback là đầu ra phải nghiệm thu trong CONTENT-007, không phải điều kiện phải có MP4 trước khi bắt đầu tạo MP4. CONTENT-007 vẫn BLOCKED vì source/sign-off còn thiếu.

## Công việc còn lại — mỗi dòng một người thực hiện

| Việc | Executor | Đầu ra cần có |
|---|---|---|
| Ghi quyết định historical/learning trên bản review này | Trúc | Verdict có ngày và bản tài liệu cụ thể; CLM-MT68-01 đã có nguồn thay thế đọc được, còn cần Trúc ký kết luận reviewer |
| Chọn nguồn giọng đọc có quyền | Trúc | Người đọc/dịch vụ, phạm vi cho phép, evidence; chưa cần MP4 cuối |
| Kiểm tra độc lập kỹ thuật revision | Vinh | Validator, diff và đồng nhất các file; không suy ra approval từ review PR #23 cũ |
| Xác nhận ô reviewer CONTENT-002 và quyết định gate production | Thọ | Quyết định ghi vào card/board sau review, không tự mở M1 |

## Verification và handoff

- PASS sau sửa: `node docs/content/validate-mt68-authoring.mjs`: 5 node, 7 scene, 6 đường đi kết thúc, 5 quiz, 9 cue 110s; ID nguồn/claim và local link trong tập validator hợp lệ.
- `git diff --check` và local Markdown links của file thay đổi được kiểm tra trước bàn giao.
- Không chạy app build/typecheck: revision chỉ tài liệu authoring và hồ sơ review, không thay runtime/dependency/migration. Validator nội dung là kiểm tra liên quan; không chứng minh media playback, quyền sử dụng hay lịch sử tự động.
- Không environment/migration impact. CONTENT-003/004 giữ REVIEW, CONTENT-007 BLOCKED; CONTENT-006 giữ IN PROGRESS/REFERENCE_ONLY, M0 OPEN.
- Update 2026-09-28: CLM-MT68-01 đã có locator thay thế đọc được từ TTDN/TTXVN và Nhân Dân. Việc còn lại không phải tìm nguồn năm mục tiêu nữa mà là Trúc ghi sign-off reviewer, chọn nguồn audio có quyền và Vinh QA kỹ thuật.
- GitHub API đọc PR #29 gặp rate limit; không dùng lỗi API để kết luận PR đã merge. Nhánh được cập nhật dựa trên remote main đã fetch; không merge vào main trong lượt này.
