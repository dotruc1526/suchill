> **Paper**: Hệ thống Tài liệu Nội dung Chapter MVP Sử Chill: Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 (`PILOT-SCREENPLAY.md`, `HISTORICAL-SOURCES.md`, `RESEARCH-CANDIDATES.md`, `CURRICULUM-MAP.md`)
> **Category**: Historical Education Application, Curriculum Design & Media Engineering
> **Segments reviewed**: 3 (Segment 1: `pilot_screenplay`, Segment 2: `sources_and_research`, Segment 3: `curriculum_map`)
> **Date**: 2026-09-26
> **Synthesis Mode**: Candidate Synthesis (RSA Level 0 — Candidate 2)

---

# Paper Summary

### Tiêu đề Tài liệu Tổng thể
**Hệ thống Đặc tả Nội dung, Kịch bản Đa phương tiện và Khung Sử liệu Tham chiếu cho Chapter MVP "Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968" trong Ứng dụng Giáo dục Lịch sử Tương tác Sử Chill.**

### Tóm tắt Nội dung và Cấu trúc Hệ thống
Hệ thống tài liệu được thẩm định là bộ hồ sơ hạt nhân phục vụ phát triển Chapter sản phẩm khả dụng tối thiểu (MVP Chapter) của nền tảng giáo dục lịch sử tương tác **Sử Chill**, bao gồm 4 văn bản kỹ thuật và học thuật chủ đạo:
1. **`docs/content/PILOT-SCREENPLAY.md` (Segment 1 - pilot_screenplay):** Kịch bản chi tiết phân cảnh tập phim dẫn nhập "Kế hoạch Giao Thừa" (Linear Documentary Video dọc 9:16, thời lượng 110 giây, 5 phân cảnh từ Scene 01 đến Scene 05) tích hợp bản ghi lời thoại (Full Transcript), tệp mẫu phụ đề WebVTT, quy chuẩn Poster Frame / Thẻ tóm tắt dự phòng và Bảng kiểm nghiệm thu chất lượng.
2. **`docs/content/HISTORICAL-SOURCES.md` & `docs/content/RESEARCH-CANDIDATES.md` (Segment 2 - sources_and_research):** Khung căn cứ học thuật, hệ thống thư mục sử liệu chính thống, cơ chế đối soát múi giờ lịch pháp, định hướng khai thác kho lưu trữ quốc tế, phân tích pháp lý Educational Fair-Use và định hướng nghiên cứu mở rộng cho các Chapter tiếp theo (Điện Biên Phủ trên không 1972, Tuyến đường Trường Sơn).
3. **`docs/content/CURRICULUM-MAP.md` (Segment 3 - curriculum_map):** Bản đồ chương trình học tập đa định dạng (Multi-format Learning Loop) kết hợp triết lý Micro-learning (tổng thời lượng 25–30 phút) gồm 5 bài học tuần tự: Video dẫn nhập (`lesson-mt68-01-video`), Visual Novel tương tác 5 mũi tiến công (`lesson-mt68-02-interactive`), Bản đồ lưu trữ địa chỉ đỏ (`lesson-mt68-03-standard`), Bài đọc tổng hợp bước ngoặt Paris (`lesson-mt68-04-synthesis`), và Bài khảo thí trắc nghiệm 5 câu có trọng số (`quiz-mt68-chapter-assessment`), đi kèm khế ước kiểu dữ liệu Domain Type Contract.

### Đánh giá Giá trị Học thuật và Định hướng Chính trị Cốt lõi
Toàn bộ các báo cáo đơn vị (Unit Reports) đều khẳng định tài liệu thể hiện xuất sắc lập trường tư tưởng chính trị cách mạng Việt Nam, tuân thủ nghiêm ngặt nguyên tắc chính trị R3, sử dụng thống nhất thuật ngữ chuẩn mực (*"Kháng chiến chống Mỹ cứu nước"*, *"Tổng tiến công và nổi dậy"*, *"Biệt động Sài Gòn — Gia Định"*), loại bỏ triệt để các quan điểm thiên kiến hoặc từ ngữ của phía bên kia chiến tuyến. Cấu trúc sư phạm được xây dựng công phu, hiện đại, tái hiện trung thực đức hy sinh quả cảm của lực lượng Biệt động và sức mạnh vô địch của "thế trận lòng dân".

Tuy nhiên, qua quá trình đối soát chéo độc lập, Hội đồng Thẩm định ghi nhận **04 vấn đề cấp độ Critical** và **13 vấn đề cấp độ Major** (bao gồm 4 vấn đề mang tính hệ thống xuyên suốt các tài liệu và 9 vấn đề đặc thù phân đoạn) đe dọa trực tiếp đến tính chuẩn xác sử học, kỷ luật kiểm soát chất lượng phần mềm và khả năng thi công sản xuất video/kỹ thuật.

---

# Key Issues Roadmap

Tất cả các vấn đề cấp độ Critical và Major được phát hiện trên toàn bộ 3 phân đoạn đều được tổng hợp, đối soát và liệt kê đầy đủ dưới đây, xếp thứ tự ưu tiên theo cấp độ nghiêm trọng:

## I. Critical Issues (Vấn đề Nghiêm trọng Cấp độ Phá vỡ Hệ thống)

* **[sources_and_research]:** Gán sai hướng xuất kích của Biệt động và sai lệch địa danh hành chính đô thị tại Di tích Hầm vũ khí 287/70 Trần Quý Cáp trong `HISTORICAL-SOURCES.md` (dòng 23 ghi hầm này là nơi xuất phát của Đội 11 đánh Tòa Đại sứ Mỹ thay vì Đội 5 đánh Dinh Độc Lập, và ghi nhầm tên đường hiện nay thành Nguyễn Đình Chiểu thay vì Võ Văn Tần).
* **[sources_and_research]:** Xung đột danh mục 5 mục tiêu trọng yếu nội đô giữa tài liệu nguồn tham chiếu và toàn bộ hệ thống kịch bản, bản đồ bài học và câu hỏi trắc nghiệm (dòng 18 của `HISTORICAL-SOURCES.md` ghi nhận mục tiêu thứ 5 là "Biệt khu Thủ đô" thay vì "Bộ Tư lệnh Hải quân").
* **[pilot_screenplay]:** Bất khả thi về mặt vật lý âm thanh do quá tải nhịp độ diễn đọc Voiceover tại Phân cảnh 05 (>300 từ/phút) và Phân cảnh 03 (>225 từ/phút), vượt từ 20% đến 35% ngưỡng dung lượng từ tối đa (311–352 từ so với giới hạn 260 từ), trực tiếp đe dọa vỡ khung thời gian sản xuất video và làm méo tiếng bộ tổng hợp giọng đọc Microsoft Azure Neural TTS.
* **[pilot_screenplay]:** Sai lệch thiên văn lịch pháp và ngôn ngữ học nghiêm trọng khi sử dụng cụm từ phi thực tế "31 tháng Giêng năm 1968" trong lời dẫn Voiceover, bản ghi lời thoại Full Transcript và cue phụ đề WebVTT (tháng Giêng âm lịch theo chu kỳ tuần trăng chỉ có tối đa 29 hoặc 30 ngày, hoàn toàn không bao giờ tồn tại ngày 31).

---

## II. Major Issues (Vấn đề Trọng yếu Cần Hiệu chỉnh Bắt buộc)

### 1. Nhóm Vấn đề Hệ thống Xuyên Phân đoạn (Cross-Segment Systemic Issues)

* **[pilot_screenplay / sources_and_research / curriculum_map]:** Vi phạm đồng bộ quy trình kiểm soát chất lượng (Quality Gate Bypass) khi cả ba tài liệu đều tự gắn trạng thái phê duyệt sớm (`APPROVED / READY_FOR_PRODUCTION` ở kịch bản, `Verified` ở tài liệu nguồn, `APPROVED / PUBLISHED` và `status: "published"` ở bản đồ bài học) trong khi nhiệm vụ thẩm định lịch sử (`CONTENT-003`) đang tiến hành và nhiệm vụ sản xuất video (`CONTENT-007`) đang bị khóa tạm thời (`BLOCKED`).
* **[sources_and_research / pilot_screenplay / curriculum_map]:** Diễn giải giản lược và thiếu nhất quán về bản chất thiên văn lịch pháp của hiện tượng hai miền đón Tết lệch nhau 24 giờ do múi giờ GMT+7 vs GMT+8 (tài liệu nguồn viết sơ sài như chênh lệch 1 giờ hành chính, kịch bản dùng từ ngữ gây hiểu lầm bộc phá nổ trong đêm Giao thừa, và bản đồ bài học thiếu chỉ dẫn bối cảnh nền tảng khiến người học dễ thất bại ở Câu hỏi khảo thí số 4).
* **[pilot_screenplay / curriculum_map]:** Không nhất quán trong việc gán nhãn phân loại nội dung dữ liệu (`verified_fact` đơn nhất so với `verified_fact + educational_explanation`) giữa Bảng thông số kỹ thuật, Bảng phân cảnh chi tiết và Bản đồ trình tự bài học.
* **[sources_and_research / curriculum_map]:** Lỗ hổng truy xuất nguồn và thiếu chuẩn mực học thuật trong `HISTORICAL-SOURCES.md` khi vừa bỏ sót các công trình chính sử nền tảng tối cao của Viện Lịch sử Quân sự Việt Nam và Văn kiện Đảng (trong khi `CURRICULUM-MAP.md` đã có đầy đủ), vừa viện dẫn các trang tin thương mại tư nhân và tạp chí kinh tế tổng hợp (`thuvienphapluat.vn`, `vietnamhoinhap.vn`).

### 2. Nhóm Vấn đề Trọng yếu Đặc thù Phân cảnh và Kỹ thuật Media (Segment 1: pilot_screenplay)

* **[pilot_screenplay]:** Sai lệch chi tiết vật thể di tích lịch sử khi mô tả đồ họa 3D nắp hầm vũ khí bí mật 287/70 Trần Quý Cáp là "sàn gỗ mở ra" cùng hiệu ứng âm thanh "ván sàn gỗ kẽo kẹt", làm biến dạng kiến trúc ngụy trang gạch bông xi măng 4 viên cổ điển độc nhất vô nhị của Di tích Lịch sử cấp Quốc gia.
* **[pilot_screenplay]:** Khoảng lệch thời gian tác chiến quân sự hơn 40 phút tại mục tiêu Tòa Đại sứ Mỹ (kịch bản mô tả điểm hỏa bộc phá phá thủng tường rào bê tông lúc 02h05 sáng, trong khi quân sử và hồ sơ Đội 11 ghi nhận thời điểm kích nổ thực tế diễn ra vào khoảng 02h45 đến 02h47 sáng ngày 31/1/1968).
* **[pilot_screenplay]:** Đứt gãy cú pháp timestamp của tệp phụ đề chuẩn WebVTT (đột ngột chuyển từ định dạng chuẩn 3 thành phần `hh:mm:ss.ttt` sang 2 thành phần `mm:ss.ttt` từ giây 70.800) gây nguy cơ lỗi parser trên trình duyệt HTML5/iOS Safari, đồng thời bỏ sót hoàn toàn cue phụ đề Call-to-Action chuyển tiếp sang Bài học 2 ở cuối video.
* **[pilot_screenplay]:** Khoảng trống tuân thủ quy chuẩn chính trị R3 trong bản ghi âm lời thoại Voiceover thực tế (hai cụm từ bắt buộc "Kháng chiến chống Mỹ cứu nước" và "Đế quốc Mỹ" hoàn toàn vắng bóng trong lời đọc của phát thanh viên mặc dù bảng kiểm nghiệm thu tự tích đạt).

### 3. Nhóm Vấn đề Trọng yếu về Pháp lý, Lưu trữ và Nghiên cứu Mở rộng (Segment 2: sources_and_research)

* **[sources_and_research]:** Ngộ nhận pháp lý nghiêm trọng về ngoại lệ giáo dục "Educational Fair-Use" khi cho rằng ứng dụng được tự do tải về và lưu trữ cục bộ các video độc quyền có bản quyền thương mại toàn cầu từ AP Archive và British Pathé (cần thiết lập chiến lược Media 4 tầng: Public Domain, cấp phép trong nước, nhúng YouTube IFrame API và đồ họa chuyển động).
* **[sources_and_research]:** Thiếu quy chế dán nhãn góc nhìn bắt buộc (`perspective: western_archive`) cho các tài liệu xuất xứ từ kho lưu trữ phương Tây và thiếu bộ lọc kiểm duyệt làm mờ hình ảnh chiến sự bạo lực nhạy cảm theo Luật Trẻ em 2016.
* **[sources_and_research]:** Nhầm lẫn thể chế quản lý nhà nước đối với Bảo tàng Biệt động Sài Gòn — Gia Định khi ghi danh là đơn vị trực thuộc Cục Di sản văn hóa (trong khi đây là bảo tàng ngoài công lập do Sở Văn hóa và Thể thao TP.HCM cấp phép hoạt động).
* **[sources_and_research]:** Giới hạn không gian hẹp và bẫy nhầm lẫn tư liệu hình ảnh trong đề cương các Chapter nghiên cứu mở rộng (Ứng viên 2 bỏ sót Hải Phòng và lực lượng Phòng không - Không quân, tiềm ẩn bẫy ảnh John McCain 1967; Ứng viên 3 bỏ sót cấu trúc 5 binh chủng của Binh đoàn 12 và tuyến đường Hồ Chí Minh trên biển của Đoàn 759).

### 4. Nhóm Vấn đề Trọng yếu về Cấu trúc Khảo thí và Sư phạm (Segment 3: curriculum_map)

* **[curriculum_map]:** Ngân hàng câu hỏi trắc nghiệm (Quiz 1–5) thiếu hoàn toàn hệ thống định danh kỹ thuật chuẩn hóa (Schema IDs: `id`, `learningObjectiveId`, `correctOptionId`, `sourceIds`, `difficulty`), tiềm ẩn nguy cơ lỗi Foreign Key và chấm điểm lệch pha khi lập trình viên nạp dữ liệu mẫu lên cơ sở dữ liệu.

---

# Cross-Segment Synthesis & Deduplication Analysis

### 1. Ma trận Đối soát và Hợp nhất Phát hiện Liên phân đoạn (Cross-Report Reconciliation Matrix)

| Chủ đề / Lĩnh vực | Segment 1 (`pilot_screenplay`) | Segment 2 (`sources_and_research`) | Segment 3 (`curriculum_map`) | Đánh giá Tổng hợp & Hướng Giải quyết Hợp nhất |
|---|---|---|---|---|
| **Di tích Hầm vũ khí bí mật 287/70 Trần Quý Cáp** | • Phát hiện [Major 4.1]: Mô tả "sàn gỗ" và SFX "ván gỗ kẽo kẹt" sai hiện vật.<br>• Phát hiện [Major 4.8]: Cảnh báo `HISTORICAL-SOURCES.md` gán sai cho Đội 11. | • Phát hiện **[Critical 1]**: Gán sai Hầm 287/70 cho Đội 11 (Tòa Đại sứ) và sai tên đường Nguyễn Đình Chiểu. | • Khảo thí chuẩn xác [Quiz 3]: Đội 5 đánh Dinh Độc Lập.<br>• Góp ý [Minor 1]: Làm rõ tên đường Võ Văn Tần (hẻm thông sang NĐC). | **Hợp nhất thành 01 vấn đề [Critical] về Sử liệu và 01 vấn đề [Major] về Kỹ thuật:**<br>1. Sửa ngay dòng 23 `HISTORICAL-SOURCES.md` thành Đội 5 đánh Dinh Độc Lập tại số 287/70 Võ Văn Tần.<br>2. Sửa kịch bản 3D thành nắp hầm 4 viên gạch bông ngụy trang đóng mở êm ái. |
| **Danh mục 5 Mục tiêu Trọng yếu Biệt động** | • Chuẩn xác 100% (Scene 04): Tòa Đại sứ, Dinh Độc Lập, Đài Phát thanh, BTTM, Bộ Tư lệnh Hải quân. | • Phát hiện **[Critical 2]**: Dòng 18 ghi "Biệt khu Thủ đô" thay vì "Bộ Tư lệnh Hải quân". | • Chuẩn xác 100% (CLO-2, Lesson 2, Quiz 2): 5 mục tiêu có Bộ Tư lệnh Hải quân. | **Giải quyết xung đột triệt để:** Bác bỏ chữ "Biệt khu Thủ đô" trong `HISTORICAL-SOURCES.md`. Buộc tài liệu nguồn phải hiệu chỉnh đồng bộ theo Kịch bản và Bản đồ bài học (sửa thành Bộ Tư lệnh Hải quân). |
| **Múi giờ Lịch âm & Độ lệch Ngày nổ súng (GMT+7 vs GMT+8)** | • Phát hiện **[Critical 3.2]**: Lỗi ngụy từ "31 tháng Giêng".<br>• Phát hiện [Major 4.3]: Nhập nhằng Đêm Giao thừa vs Rạng sáng Mùng 2 Tết. | • Phát hiện [Major 3]: Diễn giải sơ sài chênh lệch múi giờ, che khuất độ lệch 24 giờ do thời điểm Sóc. | • Phát hiện [Major 3]: Quiz 4 hỏi sâu về độ lệch lịch âm nhưng thiếu Pre-grounding ở Bài 1/2. | **Hợp nhất thành chuỗi giải pháp toàn diện:**<br>1. Xóa bỏ cụm từ "31 tháng Giêng", thay bằng "31 tháng 1 năm 1968" (Mùng 2 Tết).<br>2. Soạn đoạn văn chuyên đề giải thích hiện tượng Sóc nhảy vọt 24h và yếu tố "Bất ngờ trong bất ngờ".<br>3. Bổ sung thẻ ghi nhớ sư phạm trong Bài 1/2 làm bàn đạp cho Câu hỏi 4. |
| **Kỷ luật Cổng Chất lượng (Quality Gate)** | • Phát hiện [Major 4.7]: Tự phong `APPROVED` và tích `[x] ĐẠT` toàn bộ checklist khi task blocked. | • Phát hiện [Executive/2.1]: Tự phong trạng thái `Verified` khi nguồn còn sai sót nghiêm trọng. | • Phát hiện [Major 1]: Tự phong `APPROVED / PUBLISHED` và gán code `status: "published"`. | **Hợp nhất thành 01 vấn đề [Major] có tính hệ sinh thái:** Hạ toàn bộ trạng thái về `IN_REVIEW` hoặc `PENDING_HISTORICAL_REVISION`. Khóa cứng quy trình, chỉ cấp phép `APPROVED` sau khi hoàn tất sửa đổi. |
| **Phân loại Nhãn Nội dung Dữ liệu** | • Phát hiện [Major 4.6]: Spec ghi `verified_fact`, nhưng Scene 05 ghi `verified_fact + educational_explanation`. | — (Không đề cập sâu) | • Phát hiện [Major 2]: Lesson 1, 4, 5 ghi `verified_fact` đơn nhất, bỏ sót diễn giải sư phạm. | **Hợp nhất thành 01 chuẩn dữ liệu duy nhất:** Kết hợp `verified_fact` (sự kiện lịch sử cốt lõi) + `educational_explanation` (cho câu nối sư phạm, bình luận chính trị và phản hồi câu hỏi). |
| **Chuẩn mực Nguồn Chính sử & Bản quyền Media** | • Phát hiện [Minor 6]: Cần watermark chú thích Walter Cronkite CBS News. | • Phát hiện [Major 4, 5, 6, 7]: Thiếu nguồn Viện LSQS/Đảng; dẫn web tư nhân; rủi ro Fair Use; thiếu nhãn góc nhìn. | • Chuẩn tắc [Section 5]: Đã tích hợp đầy đủ Viện LSQS, Lịch sử Nam Bộ, Văn kiện Đảng, QĐ 1288. | **Hợp nhất giải pháp quản trị tư liệu:** Lấy Source Register của `CURRICULUM-MAP.md` làm chuẩn mẫu để bổ sung cho `HISTORICAL-SOURCES.md`; loại bỏ website tư nhân; áp dụng chiến lược Media 4 tầng. |

### 2. Phân tích Dập tắt Mâu thuẫn (Conflict Resolution)
- **Vấn đề Đội 5 vs Đội 11 tại Hầm 287/70 Trần Quý Cáp:** `HISTORICAL-SOURCES.md` mâu thuẫn với cả `PILOT-SCREENPLAY.md` và `CURRICULUM-MAP.md`. Căn cứ Quyết định xếp hạng Di tích Quốc gia 1288-VH/QĐ và công trình *Biệt động Sài Gòn — Chợ Lớn — Gia Định...* (NXB QĐND), Hầm 287/70 do ông Năm Lai đào là căn cứ cất giấu 2 tấn vũ khí và là điểm xuất phát trực tiếp của Đội 5 đánh Dinh Độc Lập. Do đó, khẳng định `PILOT-SCREENPLAY.md` và `CURRICULUM-MAP.md` đúng; `HISTORICAL-SOURCES.md` sai hoàn toàn và bắt buộc phải sửa đổi.
- **Vấn đề Mục tiêu thứ 5 (Biệt khu Thủ đô vs Bộ Tư lệnh Hải quân):** Biệt khu Thủ đô là địa bàn tác chiến của tiểu đoàn mũi nhọn bên ngoài, không thuộc biên chế 5 trận đánh then chốt nội đô của Biệt động. Việc `HISTORICAL-SOURCES.md` ghi Biệt khu Thủ đô là lỗi sao chép bất cẩn. Phán quyết chuẩn tắc: Xác lập 5 mục tiêu theo `PILOT-SCREENPLAY.md` và `CURRICULUM-MAP.md`.

---

# Segment Report References

| Phân đoạn Thẩm định (Segment) | Hạng mục Tài liệu Đánh giá | Đường dẫn Tuyệt đối Tệp Báo cáo Chi tiết (Unit Report Path) |
|---|---|---|
| **pilot_screenplay** | Kịch bản chi tiết video dẫn nhập `docs/content/PILOT-SCREENPLAY.md` | `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_1\unit_report_pilot_screenplay.md` |
| **sources_and_research** | Căn cứ sử liệu `HISTORICAL-SOURCES.md` & Đề cương `RESEARCH-CANDIDATES.md` | `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_2\unit_report_sources_and_research.md` |
| **curriculum_map** | Bản đồ chương trình học `docs/content/CURRICULUM-MAP.md` | `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_3\unit_report_curriculum_map.md` |

---
*Báo cáo Tổng hợp Ứng viên 2 (Candidate Synthesis Report 2) được thiết lập bởi Synthesizer 2 trong tiến trình Thẩm định Tài liệu RSA Level 0.*
