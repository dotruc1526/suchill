> **Paper**: Sử Chill — Chapter MVP: Chiến dịch Mậu Thân 1968 (Bước ngoặt lịch sử) & Hệ thống Kịch bản / Sử liệu / Bản đồ Bài học
> **Category**: Methodology, Background & Context, Argument & Analysis
> **Segments reviewed**: 3 (pilot_screenplay, sources_and_research, curriculum_map)
> **Date**: 2026-09-26

# Paper Summary

Tài liệu được thẩm định là bộ hồ sơ thiết kế nội dung cốt lõi cho **Chapter MVP: Chiến dịch Mậu Thân 1968 (Bước ngoặt lịch sử)** thuộc ứng dụng giáo dục lịch sử tương tác **Sử Chill**, bao gồm 4 văn bản thành phần:
1. `docs/content/PILOT-SCREENPLAY.md` (Segment: `pilot_screenplay` — Methodology): Kịch bản chi tiết phân cảnh (Pilot Video Screenplay) cho tập phim dẫn nhập *"Kế hoạch Giao Thừa"*, thời lượng 110 giây, định dạng dọc 9:16, kết cấu 5 phân cảnh (Scene 01 – Scene 05) kèm bản ghi lời thoại (Full Transcript), mẫu phụ đề WebVTT, quy chuẩn Poster Frame/Thẻ dự phòng văn bản và Bảng kiểm nghiệm thu chất lượng.
2. `docs/content/HISTORICAL-SOURCES.md` (Segment: `sources_and_research` — Background & Context): Hệ thống tài liệu trích nguồn học thuật, chính sử quân sự, tư liệu chuyên đề Biệt động Sài Gòn, nguyên tắc đối chiếu thuật ngữ và mốc thời gian, danh mục kho lưu trữ quốc tế và các cổng thông tin điện tử.
3. `docs/content/RESEARCH-CANDIDATES.md` (Segment: `sources_and_research` — Background & Context): Định hướng nghiên cứu các chủ đề ứng viên thuộc thời kỳ Kháng chiến chống Mỹ cứu nước (Mậu Thân 1968, Điện Biên Phủ trên không 1972, Tuyến đường Trường Sơn) và các điểm cần xin ý kiến Historical Reviewer về số liệu thương vong và bản quyền tư liệu.
4. `docs/content/CURRICULUM-MAP.md` (Segment: `curriculum_map` — Argument & Analysis): Bản đồ bài học tổng thể gồm 4 mục tiêu cốt lõi (CLO-1 đến CLO-4), chu trình học tập đa định dạng (Multi-format Learning Loop) qua 5 bài học (`video` dẫn nhập, `visual_novel` tương tác 5 mũi tiến công, `standard` bản đồ tư liệu hầm ngầm, `synthesis` bài học bước ngoặt Paris, và `quiz` khảo thí 5 câu hỏi có trọng số), khế ước chuyển giao kỹ thuật TypeScript/QA và Danh mục nguồn lịch sử đối chiếu.

Toàn bộ công trình thể hiện lập trường tư tưởng kiên định, tuân thủ nghiêm ngặt nguyên tắc chính trị R3 của sử học cách mạng Việt Nam, tôn vinh "thế trận lòng dân" và đức hy sinh quả cảm của lực lượng Biệt động Sài Gòn — Gia Định, khẳng định bước ngoặt chiến lược buộc đế quốc Mỹ phải xuống thang chiến tranh và ngồi vào bàn đàm phán Paris. Tuy nhiên, qua quá trình thẩm định độc lập và đối chiếu chéo giữa 3 báo cáo chuyên phân đoạn, hồ sơ còn bộc lộ một số sai lệch học thuật, mâu thuẫn chéo giữa tài liệu nguồn với kịch bản/bài học, điểm nghẽn kỹ thuật sản xuất media và vi phạm quy trình kiểm soát cổng chất lượng cần được xử lý dứt điểm trước khi phát hành sản xuất.

---

# Key Issues Roadmap

### Critical Issues (Sai phạm nghiêm trọng đe dọa tính khả thi sản xuất hoặc làm sai lệch sự thật lịch sử)

* **[pilot_screenplay]:** [Critical] Tại Phân cảnh 05 và Phân cảnh 03, lời dẫn Voiceover phát thanh viên bị quá tải nghiêm trọng so với quỹ thời gian (Scene 05 có tới 53 từ trong 10 giây đòi hỏi tốc độ đọc >300 từ/phút, và Scene 03 có 60 từ dẫn trong 16 giây còn lại đòi hỏi >225 từ/phút so với định mức 135–140 từ/phút), dẫn tới sự bất khả thi về mặt vật lý âm thanh cho cả diễn viên lồng tiếng lẫn engine Microsoft Neural TTS (`vi-VN-NamMinhNeural`), đe dọa làm vỡ timeline sản xuất video 110 giây.
* **[pilot_screenplay]:** [Critical] Tại Phân cảnh 04 (cột Voiceover, Full Transcript và WebVTT cue), kịch bản sử dụng cụm từ phi thực tế về mặt lịch pháp thiên văn "31 tháng Giêng năm 1968" (tháng Giêng âm lịch chỉ có tối đa 30 ngày), cần phải được hiệu chỉnh đồng bộ thành danh xưng Dương lịch chuẩn tắc "ngày 31 tháng 1 năm 1968" (hoặc "Mùng 2 Tết Mậu Thân — ngày 31 tháng 1 năm 1968").
* **[sources_and_research]:** [Critical] Tại `HISTORICAL-SOURCES.md` (Mục 2, dòng 23), Di tích Lịch sử Quốc gia Hầm vũ khí 287/70 Trần Quý Cáp vừa bị ghi sai địa danh đô thị hiện nay thành "đường Nguyễn Đình Chiểu" (thực tế là đường Võ Văn Tần), vừa bị gán sai chiến thuật tác chiến thành nơi xuất phát của Đội 11 đánh Tòa Đại sứ Mỹ (thực tế là căn cứ cất giấu gần 2 tấn vũ khí và là điểm xuất kích trực tiếp của Đội 5 Biệt động đánh Dinh Độc Lập).
* **[sources_and_research]:** [Critical] Tại `HISTORICAL-SOURCES.md` (Mục 2, dòng 18), danh mục 5 mục tiêu trọng yếu của Biệt động Sài Gòn đã ghi nhận "Biệt khu Thủ đô" thay vì "Bộ Tư lệnh Hải quân", gây xung đột dữ liệu học thuật trực tiếp với toàn bộ Kịch bản phân cảnh (`PILOT-SCREENPLAY.md`), Bản đồ bài học và Khảo thí (`CURRICULUM-MAP.md`).

### Major Issues (Khiếm khuyết quan trọng về sử liệu, phương pháp luận, pháp lý hoặc khế ước kỹ thuật)

* **[pilot_screenplay]:** [Major] Phân cảnh 02 mô tả nắp hầm vũ khí bí mật 287/70 Trần Quý Cáp là "sàn gỗ" và sử dụng hiệu ứng âm thanh "ván sàn gỗ kẽo kẹt", làm sai lệch hiện vật gốc tại Di tích Lịch sử Quốc gia vốn được lát gạch bông xi măng cổ điển với nắp hầm khung thép khảm 4 viên gạch bông nhấc lên êm ru, không tiếng động.
* **[pilot_screenplay]:** [Major] Phân cảnh 04 xác định thời điểm kích nổ bộc phá phá thủng tường bao Tòa Đại sứ Mỹ lúc "2h05 sáng", tạo độ lệch hơn 40 phút so với hồ sơ quân sử chính thống ghi nhận thời điểm điểm hỏa bộc phá thực tế của Đội 11 là khoảng 02h45–02h47 sáng ngày 31/1/1968.
* **[pilot_screenplay]:** [Major] Kịch bản và các tài liệu tóm tắt tạo ra sự nhập nhằng giữa "Đêm Giao thừa" và "Rạng sáng Mùng 2 Tết (31/1/1968)" do chưa diễn giải rõ độ lệch múi giờ lịch âm GMT+7 vs GMT+8, đặc biệt Poster Frame mô tả hình ảnh Tòa Đại sứ Mỹ bốc cháy trong "đêm Giao thừa" dễ gây hiểu lầm thời điểm nổ súng.
* **[pilot_screenplay]:** [Major] Mẫu tập tin phụ đề WebVTT trộn lẫn hai định dạng thời gian (`hh:mm:ss.ttt` và `mm:ss.ttt` từ giây thứ 70) gây nguy cơ lỗi cú pháp parser trên trình duyệt HTML5 di động, đồng thời bỏ sót hoàn toàn cue phụ đề Call-to-Action kết thúc bài học ("Khám phá chi tiết tại Bài 2: Sấm sét nội đô!").
* **[pilot_screenplay]:** [Major] Mặc dù Bảng đặc tả và Bảng nghiệm thu cam kết tuân thủ 100% quy chuẩn R3, toàn văn bản ghi âm thanh phát thanh viên Voiceover thực tế lại vắng bóng hoàn toàn các thuật ngữ định danh bắt buộc như "Kháng chiến chống Mỹ cứu nước" và "Đế quốc Mỹ".
* **[pilot_screenplay]:** [Major] Phân loại nhãn nội dung không đồng nhất giữa Bảng thông số kỹ thuật (tuyên bố 100% `verified_fact`), Bảng phân cảnh Scene 05 (ghi `verified_fact + educational_explanation`) và `CURRICULUM-MAP.md` (chỉ ghi `verified_fact`).
* **[pilot_screenplay]:** [Major] Kịch bản vi phạm quy trình kiểm soát chất lượng (Quality Gate Bypass) khi tác giả tự gắn trạng thái `APPROVED / READY_FOR_PRODUCTION` và tự đánh dấu tích đạt [x] cho toàn bộ 10 tiêu chí nghiệm thu khi các khâu thẩm định độc lập vẫn đang tiến hành.
* **[pilot_screenplay]:** [Major] Kịch bản xuất hiện cảnh báo mâu thuẫn chéo với tài liệu nguồn vệ tinh `HISTORICAL-SOURCES.md` (dòng 23) về đơn vị tác chiến tại Hầm 287/70 Trần Quý Cáp (kịch bản viết đúng Đội 5, nhưng tài liệu nguồn lại viết sai thành Đội 11).
* **[sources_and_research]:** [Major] Tài liệu nguồn giải thích quá sơ sài về độ lệch múi giờ GMT+7 vs GMT+8, che khuất cơ chế thiên văn học của điểm Sóc qua ranh giới nửa đêm (Midnight Boundary) tạo ra độ lệch 24 giờ trọn vẹn giữa lịch âm hai miền, là cội nguồn của hiện tượng Quân khu 5/Tây Nguyên nổ súng sớm tạo hiệu ứng "bất ngờ kép" cho đòn đánh Sài Gòn.
* **[sources_and_research]:** [Major] Danh mục Nguồn cấp 1 của `HISTORICAL-SOURCES.md` hoàn toàn thiếu vắng các công trình chính sử quân sự tối cao của Viện Lịch sử Quân sự Việt Nam (*Lịch sử Kháng chiến chống Mỹ cứu nước* Tập V, *Lịch sử QĐNDVN* Tập II) và *Văn kiện Đảng Toàn tập* Tập 29, tạo khoảng trống truy vết khi kịch bản và bản đồ bài học viện dẫn các nguồn này.
* **[sources_and_research]:** [Major] Việc đưa các trang tin điện tử tổng hợp, website thương mại tư nhân phục vụ SEO (`thuvienphapluat.vn` và `vietnamhoinhap.vn`) vào danh mục nguồn tham chiếu nền tảng làm hạ thấp chuẩn mực phương pháp luận nghiên cứu sử học của một dự án giáo dục chính quy.
* **[sources_and_research]:** [Major] Tài liệu bộc lộ ngộ nhận pháp lý cho rằng cơ chế "Educational Fair-Use" cho phép tải về và lưu trữ cục bộ các thước phim tư liệu thương mại của AP Archive và British Pathé, đòi hỏi phải xác lập Chiến lược Media Hợp pháp 4 Tầng (ưu tiên Public Domain NARA/LOC, hợp tác VTV/TTXVN, nhúng YouTube IFrame API và Motion Graphics).
* **[sources_and_research]:** [Major] Thiếu quy chế bắt buộc dán nhãn dữ liệu góc nhìn (`perspective: western_archive`) đối với tài liệu phía bên kia chiến tuyến trong các kho lưu trữ quốc tế, và thiếu bộ lọc hình ảnh chiến trường bạo lực (làm mờ 15px, cảnh báo 16+) theo quy định của Luật Trẻ em 2016.
* **[sources_and_research]:** [Major] Tài liệu nhầm lẫn cơ chế quản lý nhà nước khi viết "Cục Di sản văn hóa / Bảo tàng Biệt động Sài Gòn", trong khi Bảo tàng Biệt động là bảo tàng ngoài công lập do Sở VHTT TP.HCM cấp phép, còn Cục Di sản văn hóa là cơ quan quản lý hồ sơ khoa học di tích quốc gia.
* **[sources_and_research]:** [Major] Đề cương nghiên cứu Chủ đề Ứng viên 2 (1972) bị bó hẹp địa bàn bảo vệ Hà Nội (bỏ sót Hải Phòng và miền Bắc) và thiếu khuyến cáo chống "bẫy tư liệu ảnh" (nhầm ảnh McCain 1967, nhầm xác F-4/F-105 với B-52); Chủ đề Ứng viên 3 (Trường Sơn) bỏ sót 5 binh chủng hợp thành của Binh đoàn 12, bỏ sót Đường Hồ Chí Minh trên biển và tiềm ẩn lỗi niên đại đường ống xăng dầu.
* **[sources_and_research]:** [Major] Chưa có phán quyết dứt khoát về bài toán chênh lệch số liệu thương vong giữa nguồn trong nước và phương Tây (cần xác lập nguyên tắc độc tôn số liệu SGK/Viện LSQS làm Canonical và giải thích bản chất ngụy tạo của chỉ số "Body Count" phía Mỹ).
* **[curriculum_map]:** [Major] Tài liệu tự gắn trạng thái `APPROVED / PUBLISHED` và khởi tạo mã nguồn TypeScript với `status: "published"`, vi phạm quy trình kiểm soát cổng chất lượng khi các nhiệm vụ kiểm duyệt lịch sử và truyền thông liên quan vẫn đang trong quá trình thẩm định.
* **[curriculum_map]:** [Major] Bảng trình tự bài học gán nhãn đơn nhất `verified_fact` cho Lessons 1, 4, 5 mà không bổ sung nhãn `educational_explanation` cho các cấu phần dẫn dắt sư phạm, phân tích chính trị bước ngoặt Paris và các câu hỏi/phản hồi trắc nghiệm.
* **[curriculum_map]:** [Major] Bản đồ bài học thiếu chỉ dẫn sư phạm bối cảnh (Pre-instruction Grounding) trong Bài học 1 và Bài học 2 về sự chênh lệch lịch âm và thời điểm nổ súng giữa hai miền, khiến Câu hỏi trắc nghiệm 4 trong bài đánh giá cuối Chapter có nguy cơ trở thành một "bẫy kiến thức" bất ngờ đối với người học.
* **[curriculum_map]:** [Major] Ngân hàng câu hỏi khảo thí tại Mục 3.5 mới chỉ trình bày văn bản thô (1–5, A–D), thiếu hệ thống định danh kỹ thuật chuẩn hóa (`id`, `learningObjectiveId`, `correctOptionId`, `difficulty`, `sourceIds`), tạo rủi ro sai lệch dữ liệu khi lập trình viên Frontend và Backend nạp dữ liệu vào cơ sở dữ liệu.

---

# Cross-Cutting Synthesis & Root Cause Analysis

Qua đối chiếu ma trận chéo giữa 3 báo cáo chuyên phân đoạn, Hội đồng Thẩm định rút ra 4 trục vấn đề liên thông cốt lõi:

```
+---------------------------------------------------------------------------------------------------------+
|                                MA TRẬN LIÊN THÔNG VẤN ĐỀ CHÉO (CROSS-CUTTING)                           |
+---------------------------------------------------------------------------------------------------------+
| Trục Vấn đề                | Segment 1: pilot_screenplay | Segment 2: sources_and_research | Segment 3: curriculum_map |
+---------------------------------------------------------------------------------------------------------+
| 1. Địa chỉ Hầm 287/70      | Viết ĐÚNG Đội 5 đánh Dinh   | Sai đường "Nguyễn Đình Chiểu",  | Giải thích Quiz 3 gộp     |
|    & Đơn vị Biệt động      | Độc Lập; phát hiện nguồn sai| sai gán cho Đội 11 (Critical)   | "Võ Văn Tần / NĐ Chiểu"   |
+---------------------------------------------------------------------------------------------------------+
| 2. Danh mục 5 Mục tiêu     | Nêu đúng 5 mục tiêu         | Ghi nhận sai "Biệt khu Thủ đô"  | Nêu đúng 5 mục tiêu       |
|    trọng yếu nội đô        | (gồm Bộ Tư lệnh Hải quân)   | thay Hải quân (Critical)        | (khớp CLO-2 & Quiz 2)     |
+---------------------------------------------------------------------------------------------------------+
| 3. Lịch pháp & Múi giờ     | Lỗi từ "31 tháng Giêng"     | Diễn giải sơ sài "lệch 1 giờ";  | Quiz 4 hỏi lịch âm nhưng  |
|    (GMT+7 vs GMT+8)        | (Critical); mờ mờ Giao thừa | chưa nêu bản chất thiên văn Sóc | thiếu Pre-instruction ở   |
|                            | và Mùng 2 Tết               | qua Midnight (24h chênh lệch)   | Bài 1 & Bài 2             |
+---------------------------------------------------------------------------------------------------------+
| 4. Cổng Chất lượng (QA)    | Tự gắn `APPROVED`           | Tự gắn `Verified`               | Tự gắn `APPROVED/PUBLISHED`|
|    & Nhãn Nội dung         | Lệch nhãn fact/explanation  | Thiếu schema nhãn góc nhìn      | Lệch nhãn fact/explanation|
+---------------------------------------------------------------------------------------------------------+
```

### 1. Đồng bộ Di tích Hầm vũ khí 287/70 và Danh mục 5 Mục tiêu Trọng yếu
- **Căn cứ xác thực:** Hồ sơ Di tích Lịch sử Quốc gia (Quyết định số 1288-VH/QĐ của Bộ Văn hóa); *Biệt động Sài Gòn — Gia Định trong Tổng tiến công và nổi dậy Xuân Mậu Thân 1968* (NXB Quân đội Nhân dân); *Lịch sử Nam Bộ kháng chiến* (Tập 2).
- **Phán quyết chuẩn tắc:**
  1. *Hầm vũ khí 287/70 Trần Quý Cáp (nay là số 287/70 đường Võ Văn Tần, Phường 5, Quận 3, TP.HCM):* Là nơi vợ chồng Anh hùng LLVTND Trần Văn Lai (Năm Lai) và bà Đặng Thị Thiệp cất giấu gần 2 tấn vũ khí, là căn cứ xuất phát trực tiếp của **Đội 5 Biệt động đánh bộc phá cổng Dinh Độc Lập** (do đồng chí Tô Hoài Thanh chỉ huy). Đội 11 (do đồng chí Ba Đen chỉ huy) đánh Tòa Đại sứ Mỹ xuất phát từ cơ sở khác. Sai sót tại dòng 23 của `HISTORICAL-SOURCES.md` là lỗi nghiêm trọng cần sửa đổi ngay lập tức để đồng bộ với `PILOT-SCREENPLAY.md` và `CURRICULUM-MAP.md`.
  2. *Danh mục 5 mục tiêu trọng yếu Biệt động:* Bắt buộc thống nhất 100% trên toàn bộ các tài liệu gồm: (1) **Tòa Đại sứ Mỹ**, (2) **Dinh Độc Lập**, (3) **Đài Phát thanh Sài Gòn**, (4) **Bộ Tổng Tham mưu Quân đội Sài Gòn**, và (5) **Bộ Tư lệnh Hải quân Quân đội Sài Gòn**. Loại bỏ dứt khoát mục tiêu "Biệt khu Thủ đô" khỏi `HISTORICAL-SOURCES.md`.

### 2. Chuẩn hóa Lịch pháp Thiên văn và Múi giờ Lịch sử (GMT+7 vs GMT+8)
- **Bản chất khoa học:** 
  - Điểm Sóc tháng Giêng năm Mậu Thân diễn ra lúc 16h29 UTC ngày 29/01/1968.
  - Tại Hà Nội (GMT+7 theo Quyết định 121-CP): Rơi vào **23h29 ngày 29/01/1968** (trước nửa đêm), xác định ngày 30/01/1968 là Mùng 1 Tết. Đêm Giao thừa miền Bắc là đêm 29 rạng 30/01/1968.
  - Tại Sài Gòn (GMT+8 theo Sắc lệnh 362-TTP): Rơi vào **00h29 ngày 30/01/1968** (vượt qua ranh giới nửa đêm sang ngày mới), xác định ngày 31/01/1968 mới là Mùng 1 Tết. Đêm Giao thừa miền Nam là đêm 30 rạng 31/01/1968.
  - Sự phân hóa thiên văn qua Midnight Boundary làm cho hai miền đón Tết **chênh nhau trọn vẹn 24 giờ (1 ngày đêm)**.
- **Tác động sư phạm và truyền thông:**
  1. Xóa bỏ hoàn toàn ngụy từ "31 tháng Giêng" trong Kịch bản phân cảnh; thay bằng "ngày 31 tháng 1 năm 1968" hoặc "Mùng 2 Tết Mậu Thân — ngày 31 tháng 1 năm 1968".
  2. Làm rõ trong Kịch bản và Tài liệu nguồn: Mật lệnh thơ Bác Hồ phát sóng đúng thời khắc Giao thừa miền Bắc (đêm 29 rạng 30/01/1968); Quân khu 5 và Tây Nguyên nổ súng rạng sáng 30/01/1968; Biệt động Sài Gòn nổ súng rạng sáng 31/01/1968 (thời khắc Giao thừa theo giờ Sài Gòn GMT+8, tương ứng rạng sáng Mùng 2 Tết theo lịch miền Bắc GMT+7).
  3. Bổ sung chỉ dẫn Pre-instruction Grounding vào `RecapBlock` Bài 1 hoặc dẫn nhập Bài 2 trong `CURRICULUM-MAP.md` để học sinh làm chủ kiến thức trước khi làm Câu hỏi Quiz 4.

### 3. Giải quyết Dứt điểm Hai Điểm Review trong `RESEARCH-CANDIDATES.md`
1. **Về Số liệu Thương vong (Casualty Figures):**
   - *Phán quyết:* Ban hành nguyên tắc độc tôn số liệu chính sử Việt Nam (Canonical Standard). 100% số liệu đưa vào ứng dụng giáo dục Sử Chill bắt buộc trích xuất nguyên văn từ **Sách giáo khoa Lịch sử của Bộ GD&ĐT** và các công trình của **Viện Lịch sử Quân sự Việt Nam** (*Lịch sử Kháng chiến chống Mỹ cứu nước*, Tập V).
   - *Định hướng sư phạm:* Bóc trần bản chất ngụy tạo của chỉ số đếm xác "Body Count" mà tướng lĩnh Mỹ dùng để che đậy thất bại và tính gộp thương vong của dân thường vô tội; chuyển hướng trọng tâm sư phạm vào **kết quả chính trị và địa chính trị tối cao**: Cuộc Tổng tiến công và nổi dậy Mậu Thân 1968 đã giáng đòn quyết định làm phá sản chiến lược "Chiến tranh cục bộ", đập tan ý chí xâm lược của đế quốc Mỹ, buộc Tổng thống Johnson phải xuống thang chiến tranh, ngừng ném bom miền Bắc và chấp nhận đàm phán tại Paris.
2. **Về Bản quyền Phim ảnh Quốc tế & Educational Fair-Use:**
   - *Phán quyết:* "Educational Fair-Use" không miễn trừ trách nhiệm pháp lý khi tải file video độc quyền của AP Archive, British Pathé hay CBS News về máy chủ ứng dụng di động.
   - *Giải pháp:* Thực thi nghiêm ngặt Chiến lược Media Hợp pháp 4 Tầng: Khai thác tư liệu Public Domain của NARA/LOC (17 U.S.C. § 105); hợp tác nguồn trong nước (VTV, TTXVN, Bảo tàng Biệt động); sử dụng YouTube IFrame API nhúng trực tiếp; và tăng cường đồ họa chuyển động Motion Graphics 2D/3D.

### 4. Kỷ luật Quản trị Cổng Chất lượng (Quality Gate) và Phân loại Dữ liệu
- Toàn bộ 3 văn bản phải bãi bỏ các nhãn trạng thái tự phong sớm (`APPROVED`, `PUBLISHED`, `Verified`) và chuyển về trạng thái `IN_REVIEW` hoặc `PENDING_HISTORICAL_REVISION`.
- Sau khi Content Lead (Member 1 — Thọ) hoàn tất việc sửa đổi 4 vấn đề Critical và 19 vấn đề Major theo báo cáo tổng hợp này, Historical Reviewer sẽ thẩm định lần cuối để cấp quyền `APPROVED_BY_HISTORICAL_REVIEW`, mở khóa cho Member 2 (Video Lead) và Member 4 (Frontend Lead) triển khai sản xuất.
- Chuẩn hóa nhãn dữ liệu: Các nội dung sự thật lịch sử thuần túy gắn nhãn `verified_fact`; các nội dung dẫn nhập, recap, phân tích chính trị và giải thích quiz gắn nhãn kết hợp `verified_fact + educational_explanation`.

---

# Segment Report References

Dưới đây là danh mục đường dẫn tuyệt đối tới 3 báo cáo thẩm định chi tiết theo từng phân đoạn chuyên môn:

| Segment | Tên Phân đoạn / Lĩnh vực | Đường dẫn Báo cáo Thẩm định Chi tiết (Absolute Path) |
|---|---|---|
| **pilot_screenplay** | Kịch bản Video Dẫn nhập (Methodology) | `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_1\unit_report_pilot_screenplay.md` |
| **sources_and_research** | Tài liệu Nguồn & Nghiên cứu (Background & Context) | `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_2\unit_report_sources_and_research.md` |
| **curriculum_map** | Bản đồ Bài học & Khảo thí (Argument & Analysis) | `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_3\unit_report_curriculum_map.md` |

---
*Báo cáo Thẩm định Tổng hợp Ứng viên 3 (Candidate Synthesis Report 3) được hoàn thiện bởi Track Synthesizer 3 trong cấu trúc RSA Level 0 cross-segment synthesis.*
