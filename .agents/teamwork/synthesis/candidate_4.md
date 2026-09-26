> **Paper**: Sử Chill — Chapter MVP: Chiến dịch Mậu Thân 1968 (Bước ngoặt lịch sử)  
> **Documents Reviewed**: `PILOT-SCREENPLAY.md`, `HISTORICAL-SOURCES.md`, `RESEARCH-CANDIDATES.md`, `CURRICULUM-MAP.md`  
> **Category**: Educational Media, Revolutionary Historiography & Interactive Curriculum Architecture  
> **Segments reviewed**: 3 (`pilot_screenplay`, `sources_and_research`, `curriculum_map`)  
> **Date**: 2026-09-26  
> **Synthesizer**: Synthesizer 4 (Level 0 Candidate Synthesis)  

---

# Paper Summary

Tập tài liệu thẩm định Chapter MVP **"Chiến dịch Mậu Thân 1968 (Bước ngoặt lịch sử)"** của dự án giáo dục lịch sử tương tác **Sử Chill** bao gồm 4 văn bản thành phần cốt lõi:
1. `docs/content/PILOT-SCREENPLAY.md` (Kịch bản phân cảnh video dẫn nhập 9:16 "Kế hoạch Giao Thừa", thời lượng 110s, 5 phân cảnh, bản ghi lời thoại, phụ đề WebVTT, poster frame và checklist nghiệm thu);
2. `docs/content/HISTORICAL-SOURCES.md` (Khung nguồn sử liệu chính thống, hồ sơ di tích quốc gia, bài thơ Bác Hồ, phân tích múi giờ, kho tư liệu quốc tế và danh mục cổng thông tin);
3. `docs/content/RESEARCH-CANDIDATES.md` (Định hướng nghiên cứu các Chapter tiếp theo: Mậu Thân 1968, Hà Nội 12 ngày đêm 1972, Đường Trường Sơn, cùng 2 bài toán phản biện về số liệu thương vong và bản quyền tư liệu);
4. `docs/content/CURRICULUM-MAP.md` (Bản đồ chương trình đào tạo 5 bài học micro-learning 25–30 phút, 4 mục tiêu học tập CLO-1 đến CLO-4, đặc tả sư phạm, khế ước dữ liệu TypeScript/JSON và ngân hàng câu hỏi khảo thí trắc nghiệm).

Về mặt học thuật và tư tưởng, toàn bộ công trình thể hiện lập trường lịch sử cách mạng chính thống kiên định, tuân thủ nghiêm ngặt nguyên tắc chính trị R3 (*"Kháng chiến chống Mỹ cứu nước"*, *"Đế quốc Mỹ"*, *"Biệt động Sài Gòn"*), loại trừ triệt để các góc nhìn xuyên tạc hoặc thuật ngữ mang tính định kiến phương Tây. Nội dung tái hiện trung thực 6 trụ cột lịch sử thiêng liêng: Hầm vũ khí bí mật 287/70 Trần Quý Cáp của Anh hùng Trần Văn Lai, Sở chỉ huy tiền phương Phân khu 6 tại Tiệm phở Bình của Chỉ huy trưởng Tư Chu, Thơ chúc Tết Xuân Mậu Thân 1968 của Chủ tịch Hồ Chí Minh làm mật lệnh giờ G, các mũi tiến công sấm sét vào 5 mục tiêu đầu não nội đô, thế trận lòng dân kiên cường, và bước ngoặt địa chính trị buộc Mỹ phải xuống thang chiến tranh và ngồi vào bàn đàm phán Paris.

Tuy nhiên, qua rà soát và đối chiếu chéo độc lập giữa 3 báo cáo chuyên môn của các phân đoạn (`pilot_screenplay`, `sources_and_research`, `curriculum_map`), Hội đồng thẩm định phát hiện hệ thống tài liệu còn tồn tại **04 vấn đề nghiêm trọng cấp độ [Critical]** và **16 vấn đề bất cập cấp độ [Major]** liên quan đến tính khả thi sản xuất video, lỗi ngụy từ lịch pháp, xung đột dữ liệu chéo giữa tài liệu nguồn với kịch bản/bài học, lỗ hổng bản quyền truyền thông quốc tế, sai lệch hiện vật di tích và vi phạm kỷ luật quản trị cổng chất lượng (Quality Gate bypass).

---

# Key Issues Roadmap

### Critical Issues (Prioritized)

* **[pilot_screenplay]:** A potential voiceover pacing overload and timeline collision in Scene 05 (requiring ~318 words/minute in a 10-second window) and Scene 03 (requiring ~225–285 words/minute outside the historical recording) exceeds speech synthesis and voiceover capabilities, creating physical delivery impossibility and risking video production desynchronization.
* **[pilot_screenplay]:** A potential calendrical and linguistic error occurs in Scene 04 where the narration, transcript, and WebVTT cue use the hybrid phrase "31 tháng Giêng năm 1968", which is an impossible date in the lunar calendar (maximum 30 days) and must be corrected to the solar calendar date "ngày 31 tháng 1 năm 1968" (or "rạng sáng Mùng 2 Tết Mậu Thân").
* **[sources_and_research]:** A potential factual error in `HISTORICAL-SOURCES.md` (Section 2, line 23) misnames the current street of National Relic 287/70 Trần Quý Cáp as "Nguyễn Đình Chiểu" (instead of Võ Văn Tần) and incorrectly assigns this weapons cache as the staging base for Team 11 attacking the US Embassy, rather than Team 5 attacking Independence Palace.
* **[sources_and_research]:** A potential target list discrepancy in `HISTORICAL-SOURCES.md` (Section 2, line 18) lists "Biệt khu Thủ đô" instead of "Bộ Tư lệnh Hải quân" among the 5 core targets of the Saigon Special Action Force (Biệt động Sài Gòn), conflicting with the pilot screenplay, curriculum map, and assessment question 2.

### Major Issues

* **[pilot_screenplay]:** A potential architectural and artifactual inaccuracy in Scene 02 depicts the secret weapons trapdoor at 287/70 Trần Quý Cáp as wooden floorboards with squeaking sounds ("sàn gỗ kẽo kẹt"), whereas the national relic site features a specialized 4-tile encaustic cement ("gạch bông") camouflage hatch on a steel frame opened silently.
* **[pilot_screenplay]:** A potential operational timeline discrepancy in Scene 04 states that the US Embassy perimeter wall was breached at 02h05, whereas military history records place the detonation at approximately 02h45–02h47.
* **[pilot_screenplay]:** A potential temporal ambiguity in the poster frame and summary card conflates the midnight New Year's Eve transition with the combat assault on the morning of Lunar New Year Day 2 (31/1/1968), requiring clarification of the GMT+7 versus GMT+8 lunar calendar relationship for learners.
* **[pilot_screenplay]:** A potential technical formatting inconsistency in the WebVTT subtitle template transitions from `00:mm:ss.ttt` to `mm:ss.ttt` after minute one, risking HTML5 parser rendering failures, while also omitting the final Call-To-Action subtitle cue.
* **[pilot_screenplay]:** A potential terminology compliance gap in the spoken voiceover transcript omits the mandatory revolutionary historiographical terms "Kháng chiến chống Mỹ cứu nước" and "Đế quốc Mỹ", despite formal compliance claims in the technical specifications.
* **[pilot_screenplay & curriculum_map]:** A potential content classification mismatch across documents designates the pilot video and lessons 4 and 5 strictly as `verified_fact`, whereas pedagogical transitions, strategic interpretations, and quiz distractors require the hybrid classification `verified_fact` + `educational_explanation`.
* **[pilot_screenplay, sources_and_research, curriculum_map]:** A potential quality governance issue exists across all three documents where draft artifacts prematurely claim "APPROVED", "Verified", or "PUBLISHED" status prior to formal historical review and while prerequisite tasks remain blocked.
* **[sources_and_research]:** A potential historiographical and astronomical oversimplification in `HISTORICAL-SOURCES.md` characterizes the GMT+7 versus GMT+8 calendar divergence as a routine 1-hour time zone gap rather than explaining the midnight-boundary new moon phenomenon that created a 24-hour difference in Lunar New Year between the North and South.
* **[sources_and_research]:** A potential traceability gap in `HISTORICAL-SOURCES.md` omits Tier 1 canonical military publications (Military History Institute of Vietnam, Party Central Committee documents) from the official sources section despite their frequent citation across the screenplay and curriculum map.
* **[sources_and_research]:** A potential academic methodology flaw in `HISTORICAL-SOURCES.md` cites commercial SEO portals (`thuvienphapluat.vn` and `vietnamhoinhap.vn`) as reference sources for an educational curriculum rather than peer-reviewed military history journals and national archives.
* **[sources_and_research]:** A potential legal and copyright risk in `HISTORICAL-SOURCES.md` and `RESEARCH-CANDIDATES.md` relies on an overly broad interpretation of "Educational Fair-Use" for commercial archive footage (AP Archive, British Pathé), necessitating a 4-tier media strategy (Public Domain, domestic licensing, YouTube IFrame embedding, and motion graphics).
* **[sources_and_research]:** A potential sensitivity and pedagogical risk in `HISTORICAL-SOURCES.md` and `RESEARCH-CANDIDATES.md` lacks a mandatory perspective labeling framework (`perspective: western_archive`) for enemy wartime records and a violence filtering/blurring mechanism for graphic battlefield imagery under the Vietnam Child Law 2016.
* **[sources_and_research]:** A potential institutional misattribution in `HISTORICAL-SOURCES.md` represents the Biet Dong Saigon - Gia Dinh Museum as an entity under the National Cultural Heritage Department rather than a licensed specialized non-public museum partnering with the state heritage registry.
* **[sources_and_research]:** A potential curriculum structure and archival validation gap in candidate research topics 2 and 3 omits Hai Phong air defense operations in Linebacker II, lacks warning against misattributed aircraft/pilot photos, and omits the combined-arms structure and Maritime Ho Chi Minh Trail in the Truong Son topic.
* **[curriculum_map]:** A potential pedagogical prerequisite gap in `CURRICULUM-MAP.md` tests learners in Quiz Question 4 on the complex astronomical and timezone causes of the staggered campaign start times without prior instruction in Lessons 1 or 2.
* **[curriculum_map]:** A potential data contract vulnerability in `CURRICULUM-MAP.md` lacks standardized technical schema identifiers (`q-mt68-01`, `opt-01-a`, source IDs, difficulty levels) for the Quiz Question Bank, risking integration failure between frontend and backend systems.

---

# Cross-Segment Synthesis & Deduplication Analysis

### 1. Di tích Hầm vũ khí 287/70 Trần Quý Cáp: Mâu thuẫn chéo giữa Tài liệu nguồn, Kịch bản và Khảo thí
- **Hiện tượng:** Căn hầm vũ khí bí mật số 287/70 Trần Quý Cáp của Anh hùng LLVTND Trần Văn Lai (Năm Lai) và bà Đặng Thị Thiệp là "địa chỉ đỏ" trung tâm xuyên suốt cả 3 phân đoạn. Tuy nhiên, tồn tại sự mâu thuẫn dữ liệu nghiêm trọng giữa tài liệu nguồn gốc với các văn bản triển khai:
  - Trong `HISTORICAL-SOURCES.md` (Mục 2, dòng 23), tài liệu ghi: *"Hầm vũ khí bí mật 287/70 Trần Quý Cáp (nay là đường Nguyễn Đình Chiểu): Nơi xuất phát của Đội 11 đánh vào Đại sứ quán"*.
  - Trong `PILOT-SCREENPLAY.md` (Scene 04, dòng 44), kịch bản ghi đúng: Đội 5 xuất kích từ hầm Trần Quý Cáp đánh Dinh Độc Lập; Đội 11 đánh Tòa Đại sứ Mỹ.
  - Trong `CURRICULUM-MAP.md` (Lesson 2 dòng 76; Quiz 3 dòng 132–137), bài học xác định đúng Đội 5 đánh Dinh Độc Lập xuất phát từ hầm 287/70, nhưng phần giải thích dòng 137 lại ghi nhập nhằng: *"đường Võ Văn Tần / Nguyễn Đình Chiểu"*.
- **Phân tích đối soát sử liệu:** Căn cứ Bằng xếp hạng Di tích Lịch sử Quốc gia (Quyết định số 1288-VH/QĐ ngày 16/11/1988 của Bộ Văn hóa) và công trình *Biệt động Sài Gòn — Chợ Lớn — Gia Định trong Tổng tiến công và nổi dậy Xuân Mậu Thân 1968* (NXB QĐND):
  1. *Về địa giới đô thị:* Đường Trần Quý Cáp trước năm 1975 được đổi tên thành đường **Võ Văn Tần**; đường Phan Đình Phùng mới đổi thành đường **Nguyễn Đình Chiểu**. Di tích tọa lạc chính thức tại số **287/70 đường Võ Văn Tần, Phường 5, Quận 3, TP.HCM** (ngôi nhà có lối hẻm sau thông ra đường Nguyễn Đình Chiểu).
  2. *Về cánh quân tác chiến:* Hầm 287/70 cất giấu gần 2 tấn vũ khí (AK, B40, thuốc nổ TNT) là bàn đạp tiếp nhận vũ khí và là điểm xuất phát trực tiếp của **Đội 5 Biệt động** (15 chiến sĩ do đồng chí Ba Thanh / Tô Hoài Thanh chỉ huy) đánh vào cổng Dinh Độc Lập. Trong khi đó, Đội 11 Biệt động (17 chiến sĩ do Ba Đen / Ngô Thành Nguyên chỉ huy) đánh Tòa Đại sứ Mỹ xuất phát từ trạm cơ sở bí mật khác (số 59 Phan Thanh Giản, nay là Điện Biên Phủ, hoặc 248/25 Nguyễn Bỉnh Khiêm).
- **Phán quyết hợp nhất:** Kịch bản `PILOT-SCREENPLAY.md` và Bản đồ bài học `CURRICULUM-MAP.md` đã phản ánh đúng lịch sử. Lỗi nằm ở tài liệu cội nguồn `HISTORICAL-SOURCES.md` (xếp loại **[Critical]**). Cần phát lệnh hiệu chỉnh khẩn cấp dòng 23 của `HISTORICAL-SOURCES.md` và chỉnh lý ghi chú dòng 137 của `CURRICULUM-MAP.md` để đảm bảo tính nhất quán 100% trên toàn bộ hệ thống dữ liệu.

### 2. Xung đột Danh mục 5 Mục tiêu Đầu não ("Bộ Tư lệnh Hải quân" vs "Biệt khu Thủ đô")
- **Hiện tượng:** 
  - Trong `HISTORICAL-SOURCES.md` (Mục 2, dòng 18), danh mục 5 mục tiêu trọng yếu được liệt kê là: *Đại sứ quán Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng tham mưu, **Biệt khu Thủ đô***.
  - Trong `PILOT-SCREENPLAY.md` (Scene 04, dòng 44, 80, 146) và `CURRICULUM-MAP.md` (CLO-2, Lesson 2 dòng 77–81, Data Contracts dòng 387–391, Quiz 2 dòng 245–257), 5 mục tiêu trọng yếu của Biệt động luôn là: *(1) Tòa Đại sứ Mỹ, (2) Dinh Độc Lập, (3) Đài Phát thanh Sài Gòn, (4) Bộ Tổng Tham mưu, và (5) **Bộ Tư lệnh Hải quân***.
- **Phân tích quân sử:** Trong kế hoạch tác chiến đêm Giao thừa Tết Mậu Thân 1968, 5 mục tiêu đầu não phân công cho các cụm Đội Biệt động tinh nhuệ thuộc Phân khu 6 (chỉ huy bởi Tư Chu) đánh điểm huyệt gồm: Đội 11 (Tòa Đại sứ Mỹ), Đội 5 (Dinh Độc Lập), Đội 4 (Đài Phát thanh), Đội 6-7 (Bộ Tổng Tham mưu), và Đội 3 (Bộ Tư lệnh Hải quân). Cứ điểm Biệt khu Thủ đô là mục tiêu do các tiểu đoàn mũi nhọn binh chủng hợp thành (Tiểu đoàn 6 Bình Tân) tiến công ở hướng Tây Nam, không thuộc 5 mũi thọc sâu cảm tử của Biệt động nội đô.
- **Phán quyết hợp nhất:** Việc `HISTORICAL-SOURCES.md` ghi "Biệt khu Thủ đô" là sai lệch so với quân sử và tự mâu thuẫn với toàn bộ các tài liệu khác trong dự án (xếp loại **[Critical]**). Phải chuẩn hóa đồng bộ mục tiêu thứ 5 thành **Bộ Tư lệnh Hải quân Quân đội Sài Gòn**.

### 3. Hệ thống Lịch pháp, Thiên văn học và Độ lệch Múi giờ (GMT+7 vs GMT+8)
- **Hiện tượng đa chiều:** Vấn đề múi giờ và lịch âm Tết Mậu Thân 1968 xuất hiện ở cả 3 phân đoạn với các góc độ khác nhau:
  1. *Về ngôn ngữ & lịch pháp (Segment 1 - [Critical]):* Kịch bản `PILOT-SCREENPLAY.md` (dòng 44, 76–77, 118–120) dùng cụm từ *"Rạng sáng 31 tháng Giêng năm 1968"*. Đây là lỗi ngụy từ phi thực tế vì tháng Giêng âm lịch chỉ có tối đa 29 hoặc 30 ngày, hoàn toàn không có ngày 31. Bản chất sự kiện là ngày Dương lịch **31 tháng 1 năm 1968** (tương ứng rạng sáng Mùng 2 Tết Âm lịch miền Nam).
  2. *Về cơ sở khoa học thiên văn (Segment 2 - [Major]):* `HISTORICAL-SOURCES.md` (dòng 33–34) diễn giải sơ sài, khiến người học hiểu nhầm độ lệch chỉ là 1 giờ hành chính. Thực tế, thời điểm Sóc rơi vào 23h29 đêm 29/01 (Hà Nội, GMT+7) và 00h29 ngày 30/01 (Sài Gòn, GMT+8). Việc vượt qua ranh giới nửa đêm (Midnight Boundary) đã làm lịch âm hai miền chênh nhau trọn vẹn **24 giờ (1 ngày đêm)**: miền Bắc đón Giao thừa đêm 29/1 (Mùng 1 là ngày 30/1), miền Nam đón Giao thừa đêm 30/1 (Mùng 1 là ngày 31/1). Đây là nguyên nhân sâu xa giải thích vì sao Quân khu 5 và Tây Nguyên nổ súng sớm hơn Nam Bộ 1 ngày.
  3. *Về sư phạm và khảo thí (Segment 3 - [Major]):* `CURRICULUM-MAP.md` đưa câu hỏi phân tích múi giờ vào Quiz 4 (CLO-1), nhưng trong Bài 1 và Bài 2 lại thiếu chỉ dẫn sư phạm củng cố nhận thức trước (Pre-instruction Grounding), biến câu hỏi thành bẫy kiến thức quá khó đối với học sinh K-12.
- **Phán quyết hợp nhất:** Hợp nhất thành giải pháp tổng thể: (1) Sửa dứt điểm cụm từ "31 tháng Giêng" trong kịch bản thành "31 tháng 1 năm 1968" hoặc "rạng sáng Mùng 2 Tết"; (2) Soạn thảo tiểu mục chuyên đề khoa học lịch pháp trong `HISTORICAL-SOURCES.md`; (3) Bổ sung thẻ ghi nhớ sư phạm về độ lệch lịch âm vào `RecapBlock` của Bài 1 trong `CURRICULUM-MAP.md` để làm bàn đạp cho học sinh tự tin trả lời Quiz 4.

### 4. Kỷ luật Quản trị Cổng Chất lượng (Quality Gate Discipline)
- **Hiện tượng vi phạm đồng loạt:** Cả 3 văn bản dự án đều mắc chung một lỗi vi phạm quy trình quản lý chất lượng (Quality Gate Bypass) cấp độ **[Major]**:
  - `PILOT-SCREENPLAY.md`: Ghi trạng thái `APPROVED / READY_FOR_PRODUCTION` và tự đánh dấu tích `[x] ĐẠT` cho toàn bộ 10 tiêu chí nghiệm thu;
  - `HISTORICAL-SOURCES.md`: Ghi `> Trạng thái: Đã kiểm chứng (Verified)`;
  - `CURRICULUM-MAP.md`: Ghi `> **Trạng thái:** APPROVED / PUBLISHED` và TypeScript Model `status: "published"`.
  - Trong khi đó, trên thực tế: Nhiệm vụ thẩm định lịch sử (`CONTENT-003`) đang tiến hành, nhiệm vụ sản xuất video (`CONTENT-007`) đang bị khóa (`BLOCKED`), và kiểm thử tích hợp (`FE-006`, `QA-005`) chưa diễn ra.
- **Phán quyết hợp nhất:** Yêu cầu toàn bộ các tài liệu phải điều chỉnh trạng thái về đúng thực tế quản trị dự án: chuyển về `IN_REVIEW` hoặc `PENDING_HISTORICAL_REVISION`. Trạng thái `APPROVED_BY_HISTORICAL_REVIEW` chỉ được cấp chính thức sau khi Content Lead hoàn tất việc tiếp thu và sửa đổi toàn bộ các lỗi Critical và Major nêu trong báo cáo này.

### 5. Chuẩn hóa Phân loại Nội dung (`verified_fact` vs `educational_explanation`)
- **Hiện tượng mâu thuẫn:**
  - `PILOT-SCREENPLAY.md` (Mục 1, dòng 27) tuyên bố kịch bản là `verified_fact (100% sự thật lịch sử)`, nhưng Scene 05 lại gán nhãn `verified_fact + educational_explanation`.
  - `CURRICULUM-MAP.md` (Mục 2, dòng 44, 47, 48) gán nhãn đơn nhất `verified_fact` cho toàn bộ Lesson 1, Lesson 4 và Lesson 5.
- **Phân tích quản trị dữ liệu:** Theo Khế ước Kiểu dữ liệu Phase 5 và Quy chuẩn Phase 3, nhãn `verified_fact` chỉ đại diện cho các sự kiện lịch sử thuần túy đã được kiểm chứng bằng chính sử. Các đoạn bình luận chính trị, tổng kết ý nghĩa ngoại giao (Lesson 4), lời kêu gọi hành động tương tác (Scene 05), và các phương án nhiễu cùng lời giải thích củng cố tri thức (Lesson 5 Quiz) thuộc lớp `educational_explanation`.
- **Phán quyết hợp nhất:** Chuẩn hóa thống nhất trên toàn bộ hệ thống: Lesson 1, Lesson 4 và Lesson 5 được phân loại kết hợp: `verified_fact` + `educational_explanation`.

### 6. Ràng buộc Sản xuất Media và Bản quyền Tư liệu Quốc tế
- **Bất khả thi về nhịp độ Voiceover (Segment 1 - [Critical]):** Scene 05 nhồi nhét 53 từ trong 10 giây (tốc độ ~318 từ/phút, gấp 2,3 lần quy chuẩn 135–140 wpm); Scene 03 nhồi 60 từ dẫn trong 16 giây còn lại sau đoạn thơ Bác Hồ (~225–285 wpm). Giải pháp bắt buộc: rút gọn lời thoại Scene 05 xuống 23 từ, chuyển câu điều hướng Call-to-Action sang nút bấm UI đồ họa; phân định rõ 9 giây im lặng của voiceover nhường chỗ cho bản ghi âm Bác Hồ trong Scene 03.
- **Chi tiết hiện vật nắp hầm 287/70 (Segment 1 - [Major]):** Hiện vật Di tích Quốc gia được lát bằng gạch bông xi măng hoa văn cổ điển thập niên 1960; nắp hầm ngụy trang bằng 4 viên gạch bông trùng khít trên khung thép ngầm mở bằng giác hút chân không êm ru. Mô tả "sàn gỗ" và SFX "ván sàn gỗ kẽo kẹt" là sai lệch hiện vật, cần sửa lại thành đồ họa gạch bông và tiếng chốt cơ khí êm ru.
- **Cú pháp WebVTT (Segment 1 - [Major]):** Mẫu phụ đề chuyển đổi cú pháp từ `00:mm:ss.ttt` sang `mm:ss.ttt` từ giây 70 gây lỗi parser HTML5 và thiếu cue CTA kết thúc video. Cần đồng bộ 100% timestamp có trường giờ `00:`.
- **Rủi ro Bản quyền Kho lưu trữ Quốc tế (Segment 2 - [Major]):** Tư liệu AP Archive và British Pathé trên YouTube được bảo hộ thương mại toàn cầu, không thuộc diện miễn trừ của "Educational Fair-Use". Nghiêm cấm tải file MP4 về lưu trữ cục bộ; bắt buộc triển khai Chiến lược Media 4 Tầng: (1) Khai thác Public Domain từ LOC/NARA; (2) Hợp tác bản quyền trong nước với TTXVN/VTV; (3) Nhúng Deep-Linking qua YouTube IFrame Player API; (4) Tăng cường đồ họa Motion Graphics 2D/3D.
- **Gắn nhãn Góc nhìn & Bộ lọc Hình ảnh Nhạy cảm (Segment 2 - [Major]):** Bắt buộc gắn cờ dữ liệu `perspective: western_archive` đối với tài liệu phía bên kia chiến tuyến để tránh gây hoang mang tư tưởng cho học sinh; áp dụng bộ lọc làm mờ (Blur 15px) và cảnh báo `[16+ Sensitive Historic Photo]` cho các bức ảnh chiến sự bạo lực, bảo vệ học sinh theo Luật Trẻ em 2016.

### 7. Khế ước Dữ liệu Kỹ thuật và Nền tảng Nguồn Chính sử
- **Bổ sung Nguồn Chính sử Cấp 1 (Segment 2 - [Major]):** `HISTORICAL-SOURCES.md` còn thiếu 3 bộ công trình nền tảng: *Lịch sử Kháng chiến chống Mỹ cứu nước* (Tập V), *Lịch sử Quân đội nhân dân Việt Nam* (Tập II), và *Văn kiện Đảng Toàn tập* (Tập 29). Bắt buộc bổ sung vào Mục 1 kèm siêu dữ liệu xuất bản đầy đủ.
- **Loại bỏ Trang tin Thương mại (Segment 2 - [Major]):** Loại bỏ ngay `thuvienphapluat.vn` và `vietnamhoinhap.vn` khỏi danh mục nguồn; thay thế bằng *Tạp chí Lịch sử Quân sự*, *Báo Nhân Dân*, *Báo Quân đội nhân dân*, và *Trung tâm Lưu trữ Quốc gia II*.
- **Chuẩn hóa Technical Schema IDs cho Quiz (Segment 3 - [Major]):** Cung cấp mã định danh chuẩn hóa cho 5 câu hỏi trắc nghiệm (`q-mt68-01` đến `q-mt68-05`), mã đáp án (`opt-01-a`), độ khó và mảng `sourceIds` để đảm bảo khế ước dữ liệu kỹ thuật không bị gãy đổ khi Backend và Frontend triển khai.

---

# Conflict Resolution Log & Evidence Matrix

| Vấn đề Đối chiếu | Segment 1 (`pilot_screenplay`) | Segment 2 (`sources_and_research`) | Segment 3 (`curriculum_map`) | Phán quyết Tổng hợp & Căn cứ Xác lập (Resolution & Evidence) |
|---|---|---|---|---|
| **Căn cứ xuất phát của Đội 5 và Đội 11** | Đúng lịch sử: Đội 5 xuất phát từ hầm 287/70; Đội 11 đánh Tòa Đại sứ. | **Sai nghiêm trọng (dòng 23):** Gán hầm 287/70 cho Đội 11 và ghi nhầm đường Nguyễn Đình Chiểu. | Đúng lịch sử: Đội 5 xuất phát từ 287/70 (Quiz 3), nhưng ghi chú đường còn lẫn lộn. | **Phán quyết: Khẳng định tính đúng của Segment 1 & 3.** Sửa dòng 23 `HISTORICAL-SOURCES.md` và chỉnh lý dòng 137 `CURRICULUM-MAP.md`. Căn cứ: Quyết định số 1288-VH/QĐ và Lịch sử Biệt động Sài Gòn (NXB QĐND). |
| **Danh mục 5 mục tiêu trọng yếu** | Nêu đúng 5 mục tiêu, bao gồm **Bộ Tư lệnh Hải quân** (Scene 04). | **Sai nghiêm trọng (dòng 18):** Nêu **Biệt khu Thủ đô** thay vì Bộ Tư lệnh Hải quân. | Nêu đúng 5 mục tiêu, bao gồm **Bộ Tư lệnh Hải quân** (CLO-2, Lesson 2, Quiz 2). | **Phán quyết: Đồng thuận chuẩn hóa theo Segment 1 & 3.** Sửa dòng 18 `HISTORICAL-SOURCES.md` thành "Bộ Tư lệnh Hải quân". Biệt khu Thủ đô là mục tiêu của bộ đội chủ lực, không thuộc 5 trận đánh Biệt động. |
| **Niên biểu "31 tháng Giêng"** | **[Critical]:** Narration ghi "31 tháng Giêng" là ngụy từ lịch pháp. | Phân tích sâu ranh giới nửa đêm GMT+7 vs GMT+8 lệch 24h. | Giải thích Quiz 4 phân tích tháng 11 âm thiếu/đủ năm Đinh Mùi. | **Phán quyết: Chấp thuận cảnh báo Critical của Segment 1.** Âm lịch tối đa 30 ngày. Phải sửa thành "ngày 31 tháng 1 năm 1968" (Dương lịch) hoặc "rạng sáng Mùng 2 Tết Mậu Thân". |
| **Hiện vật nắp hầm 287/70** | **[Major]:** Kịch bản mô tả "sàn gỗ kẽo kẹt" là sai hiện vật. | Xác định hầm 287/70 là Di tích Quốc gia do gia đình Năm Lai bảo tồn. | Khẳng định giá trị Di tích Quốc gia theo Quyết định 1288-VH/QĐ. | **Phán quyết: Chấp thuận sửa đổi theo Segment 1.** Hiện vật thực tế là nền gạch bông xi măng cổ điển, nắp hầm 4 viên gạch bông khung thép gioăng cao su ngầm mở êm ru. Sửa Visuals và SFX. |
| **Giờ nổ bộc phá Tòa Đại sứ** | **[Major]:** Kịch bản ghi 02h05 là lệch ~40 phút so với thực tế (02h45–02h47). | Ghi nhận Đội 11 làm chủ trận địa suốt 6 giờ. | Ghi nhận Đội 11 nổ bộc phá đánh Tòa Đại sứ lúc rạng sáng 31/1. | **Phán quyết: Tiếp thu hiệu chỉnh thời gian của Segment 1.** Giờ G toàn thành là 02h00, bộc phá cổng Đại sứ quán điểm hỏa lúc 02h45–02h47 sáng. Căn cứ: *Lịch sử Nam Bộ kháng chiến (Tập 2)*. |
| **Quy chế Bản quyền Media Quốc tế** | Đề xuất chèn watermark trích dẫn Walter Cronkite CBS News. | **[Major]:** Cảnh báo vi phạm bản quyền AP/Pathé; bác bỏ ngộ nhận Fair-Use. | Trích dẫn tư liệu phóng sự truyền hình Mỹ trong Lesson 4. | **Phán quyết: Ban hành Chiến lược Media 4 Tầng theo Segment 2.** Nghiêm cấm tải trực tiếp video AP/Pathé về máy chủ; chuyển sang dùng YouTube IFrame API và tư liệu Public Domain NARA/LOC. |
| **Phân loại nhãn nội dung** | Tuyên bố 100% `verified_fact`, nhưng Scene 05 dùng nhãn kép. | Không trực tiếp can thiệp nhãn kỹ thuật. | Bảng bài học ghi đơn nhãn `verified_fact` cho cả bài dẫn và Quiz. | **Phán quyết: Chuẩn hóa theo phân tích của Segment 1 & 3.** Cập nhật Lesson 1, 4, 5 thành nhãn kết hợp: `verified_fact` + `educational_explanation` để đảm bảo tính chặt chẽ của schema. |

---

# Segment Report References

| Segment | Report Path |
|---|---|
| pilot_screenplay | `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_1\unit_report_pilot_screenplay.md` |
| sources_and_research | `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_2\unit_report_sources_and_research.md` |
| curriculum_map | `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_3\unit_report_curriculum_map.md` |
