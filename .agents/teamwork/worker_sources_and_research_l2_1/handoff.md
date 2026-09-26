# Handoff Report: Root Aggregator for Segment 'sources_and_research' (Level 2)

## 1. Observation
- **Tài liệu thẩm định chính:**
  + `docs/content/HISTORICAL-SOURCES.md` (toàn bộ Mục 1 đến Mục 6, 53 dòng)
  + `docs/content/RESEARCH-CANDIDATES.md` (Chủ đề Ứng viên 1–3 và Các điểm cần Review, 50 dòng)
  + `docs/content/DOCUMENT_TEXT_MAP.md` (định vị toàn bộ 24 section ranges, trong đó Segment 2 bao gồm 12 section ranges)
  + `docs/content/CURRICULUM-MAP.md` (đối soát chéo Quiz 3, Quiz 4, CLO-1 đến CLO-4, Danh mục nguồn Mục 5)
  + `docs/content/PILOT-SCREENPLAY.md` (đối soát chéo Scene 01 đến Scene 05)
- **Tài liệu đầu vào tổng hợp:**
  + Evolved Review 1: `.agents/teamwork/segment_sources_and_research/evolved_review_1.md` (138 dòng, tổng hợp ứng viên H1 & H2)
  + Evolved Review 2: `.agents/teamwork/segment_sources_and_research/evolved_review_2.md` (164 dòng, tổng hợp ứng viên H3 & H4)
- **Các quan sát và trích dẫn trực tiếp:**
  + `HISTORICAL-SOURCES.md` dòng 23 ghi: `+ Hầm vũ khí bí mật 287/70 Trần Quý Cáp (nay là đường Nguyễn Đình Chiểu): Nơi xuất phát của Đội 11 đánh vào Đại sứ quán.` -> Quan sát thấy: Đường Trần Quý Cáp đổi tên thành Võ Văn Tần sau năm 1975, không phải Nguyễn Đình Chiểu (Phan Đình Phùng mới đổi thành Nguyễn Đình Chiểu). Hầm này do Anh hùng Trần Văn Lai (Năm Lai) và vợ Đặng Thị Thiệp đào, cất giấu gần 2 tấn vũ khí, là nơi xuất phát của Đội 5 đánh Dinh Độc Lập, không phải Đội 11.
  + `HISTORICAL-SOURCES.md` dòng 18 ghi: `danh sách 5 mục tiêu trọng yếu (Đại sứ quán Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng tham mưu, Biệt khu Thủ đô).` -> Quan sát thấy: Toàn bộ Kịch bản `PILOT-SCREENPLAY.md` (Scene 4 dòng 44, 80, 146) và Giáo trình `CURRICULUM-MAP.md` (CLO-2 dòng 40, Quiz 2 dòng 245–257) quy chuẩn mục tiêu thứ 5 là Bộ Tư lệnh Hải quân.
  + `HISTORICAL-SOURCES.md` dòng 33–34 ghi: `- **Về mốc thời gian:** Đã ghi chú rõ độ lệch múi giờ (Giờ Hà Nội đang áp dụng GMT+7 trong khi Sài Gòn dùng GMT+8 lúc bấy giờ) dẫn đến sự chênh lệch giờ nổ súng thực tế so với hiệu lệnh, đảm bảo tính khách quan lịch sử.` -> Quan sát thấy: Diễn giải sơ lược tạo ngộ nhận chỉ chênh lệch 1 giờ, bỏ qua sự kiện thiên văn Sóc vượt ranh giới nửa đêm làm hai miền đón Tết lệch nhau trọn vẹn 24 giờ (1 ngày đêm).
  + `HISTORICAL-SOURCES.md` dòng 7–14 chỉ liệt kê 2 đầu sách, thiếu vắng hoàn toàn các công trình kinh điển của Viện Lịch sử Quân sự Việt Nam (*Lịch sử Kháng chiến chống Mỹ cứu nước* Tập V, *Lịch sử Quân đội nhân dân Việt Nam* Tập II) và *Văn kiện Đảng Toàn tập* Tập 29.
  + `HISTORICAL-SOURCES.md` dòng 49–52 liệt kê `thuvienphapluat.vn` và `vietnamhoinhap.vn` làm nguồn tham khảo.
  + `HISTORICAL-SOURCES.md` dòng 39–40 khẳng định các thước phim AP Archive / British Pathé trên YouTube "Phù hợp làm tư liệu chèn vào video học tập", ngộ nhận về Educational Fair-Use; thiếu quy chế dán nhãn `perspective: western_archive` và thiếu bộ lọc hình ảnh chiến trường bạo lực theo Luật Trẻ em 2016.
  + `RESEARCH-CANDIDATES.md` dòng 48–50 đưa ra 2 câu hỏi cần Historical Reviewer giải quyết: độ lệch số liệu thương vong giữa nguồn trong nước và quốc tế; bản quyền và Educational Fair-use đối với hình ảnh và phim tài liệu.
  + `RESEARCH-CANDIDATES.md` dòng 8 dùng thuật ngữ "Chiến dịch Mậu Thân (1968)"; dòng 21–33 bó hẹp "12 ngày đêm bảo vệ Hà Nội"; dòng 34–45 thiếu 5 binh chủng hợp thành Bộ đội Trường Sơn và Đường Hồ Chí Minh trên biển.

## 2. Logic Chain
1. *Từ Quan sát dòng 23 và dòng 18:* Nhận thấy đây không chỉ là lỗi đánh máy hay sơ suất ngữ nghĩa mà là lỗi sai lệch nghiêm trọng về lịch sử địa phương và phá vỡ cấu trúc dữ liệu của toàn bộ dự án. Khi tài liệu nguồn ghi sai địa chỉ và phân công sai cánh quân tại Di tích Hầm 287/70 (Quyết định số 1288-VH/QĐ), đồng thời ghi sai mục tiêu thứ 5 (Biệt khu Thủ đô thay vì Bộ Tư lệnh Hải quân), nó làm sụp đổ tính nhất quán giữa tài liệu tham chiếu với Kịch bản phân cảnh và Bài kiểm tra trắc nghiệm (Quiz 2, Quiz 3). Do đó, phân loại bắt buộc là **[Critical]**.
2. *Từ Quan sát dòng 33–34 và dữ liệu thiên văn học UTC:* Tra cứu thời điểm Sóc của tuần trăng cuối tháng 1/1968 cho thấy trăng non xuất hiện lúc 16h29 UTC ngày 29/01/1968. Tại múi giờ GMT+7 (Hà Nội, theo Quyết định 121-CP), đây là 23h29 đêm 29/01/1968 (trước nửa đêm -> ngày 30/01 là Mùng 1 Tết). Tại múi giờ GMT+8 (Sài Gòn, theo Sắc lệnh 362-TTP), đây là 00h29 sáng 30/01/1968 (sau nửa đêm -> ngày 31/01 mới là Mùng 1 Tết). Hệ quả là hai miền đón Tết lệch nhau 24 giờ. Vì vậy, mật lệnh thơ Bác Hồ đọc nửa đêm 29 rạng 30/01 khiến Quân khu 5 và Tây Nguyên nổ súng rạng sáng 30/01, trong khi Nam Bộ và Sài Gòn nổ súng rạng sáng 31/01. Sai sót này dẫn đến sự hiểu lầm dây chuyền sang `CURRICULUM-MAP.md` (giải thích Quiz 4). Phân loại: **[Major]**.
3. *Từ Quan sát Mục 1 và Mục 6:* Một dự án giáo dục lịch sử quốc gia viện dẫn nhãn kiểm chứng `verified_fact (Viện Lịch sử Quân sự Việt Nam)` nhưng trong danh mục nguồn tham khảo của Chapter lại không hề đăng ký công trình nào của Viện Lịch sử Quân sự, trái lại lại trích dẫn website thương mại tư nhân `thuvienphapluat.vn` và tạp chí kinh tế `vietnamhoinhap.vn`. Đây là lỗ hổng phương pháp luận học thuật cần xử lý triệt để bằng cách thay thế danh mục nguồn chuẩn Tier 1 và Tier 3. Phân loại: **[Major]**.
4. *Từ Quan sát Mục 5 và Điểm Review 2:* Theo Điều 25 Luật SHTT Việt Nam (sửa đổi 2022) và Mục 107 Đạo luật Bản quyền Mỹ, ngoại lệ giảng dạy phi thương mại không bảo hộ việc tải trực tiếp (rip stream) các video độc quyền có bản quyền thương mại từ YouTube để đóng gói phân phối trong ứng dụng di động độc lập. Nguy cơ bị kiện tụng bản quyền và đánh gậy DMCA là hiện hữu. Giải pháp bắt buộc là áp dụng chiến lược đa tầng: Public Domain (NARA/LOC 17 U.S.C. § 105), hợp tác cấp phép trong nước (TTXVN/VTV), nhúng API YouTube IFrame (Deep-linking) và đồ họa Motion Graphics. Phân loại: **[Major]**.
5. *Từ Điểm Review 1:* Báo cáo MACV và chính sách "Body Count" của Westmoreland đã bị chính các tài liệu giải mật Lầu Năm Góc và giới sử học quốc tế khẳng định là bị thổi phồng và gộp cả dân thường bị hỏa lực bom đạn sát hại vào thương vong đối phương. Vì vậy, nguyên tắc bất biến là 100% số liệu bài học của Sử Chill phải lấy SGK và Viện Lịch sử Quân sự Việt Nam làm Canonical, đồng thời hướng trọng tâm sư phạm vào bản chất bước ngoặt chiến lược (làm phá sản "Chiến tranh cục bộ", buộc Mỹ xuống thang và đàm phán Paris).
6. *Từ Quan sát Topic 1–3:* Cần chuẩn hóa tên gọi chính thống "Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968", mở rộng không gian phòng không Hà Nội - Hải Phòng (cảnh báo bẫy ảnh McCain 1967), và bổ sung 5 binh chủng Trường Sơn cùng Đường Hồ Chí Minh trên biển.

## 3. Caveats
- Báo cáo này tập trung thẩm định sử liệu, phương pháp luận học thuật, bản quyền tư liệu và định hướng chương trình của `HISTORICAL-SOURCES.md` và `RESEARCH-CANDIDATES.md`. Các chi tiết kỹ thuật về nhịp độ voiceover kịch bản thuộc thẩm quyền xử lý của Segment 1 (`unit_report_pilot_screenplay.md`), và việc ánh xạ dữ liệu TypeScript thuộc thẩm quyền của Segment 3 (`unit_report_curriculum_map.md`).
- Việc tra cứu giờ Sóc thiên văn dựa trên thuật toán lịch thiên văn của Viện Hàn lâm Khoa học và Công nghệ Việt Nam và các công trình nghiên cứu lịch sử thiên văn đã công bố.

## 4. Conclusion
- Phán quyết thẩm định chung cho Segment 'sources_and_research' là **NEEDS_REVISION** (Yêu cầu chỉnh sửa hoàn thiện).
- Báo cáo thẩm định chính thức đã được hoàn thành và xuất bản tại:
  `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_2\unit_report_sources_and_research.md`.
- Toàn bộ 10 đầu việc hành động trong Ma trận Thực thi (ACT-01 đến ACT-10) đã được phân nhiệm rõ ràng cho Member 1 (Thọ), Codex, Member 2 (Trúc) và Member 5 (Vinh).

## 5. Verification Method
- **Kiểm tra tính hiện diện và tính toàn vẹn của tệp báo cáo:**
  Xem xét tệp `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_2\unit_report_sources_and_research.md` qua công cụ `view_file`.
- **Kiểm tra độ phủ 7 mục tiêu bắt buộc:**
  + Section 1: Executive Summary & Verdict (Đạt trạng thái NEEDS_REVISION).
  + Section 2: Detailed Section-by-Section Verification (Đủ 12 section ranges).
  + Section 3: Official Historiography compliance & canonical legitimacy (Bổ sung Viện LSQS, Văn kiện Đảng, phân định pháp lý Di tích 1288-VH/QĐ và Bảo tàng Biệt động Sài Gòn).
  + Section 4: Timezone & Timeline logic (Phân tích chi tiết Quyết định 121-CP, Sắc lệnh 362-TTP, điểm Sóc thiên văn 23h29 vs 00h29, ranh giới nửa đêm, độ lệch 24 giờ và bất ngờ kép).
  + Section 5: Multilateral / International Archives (Chiến lược bản quyền 4 tầng, Điều 25 Luật SHTT, 17 U.S.C. § 105, gắn nhãn `perspective: western_archive`, bộ lọc bạo lực Luật Trẻ em 2016).
  + Section 6: Resolution of Review Points (Canonical số liệu SGK/Viện LSQS, vạch trần Body Count MACV, khẳng định bước ngoặt chiến lược; bác bỏ Fair-use tải video lậu).
  + Section 7: Actionable Recommendations & Implementation Matrix (Bảng ma trận ACT-01 đến ACT-10).
  + Danh mục Potential Mistakes (Critical, Major) và Minor Corrections.
- **Điều kiện vô hiệu hóa (Invalidation conditions):** Báo cáo bị vô hiệu nếu phát hiện văn bản pháp quy múi giờ khác thay thế Sắc lệnh 362-TTP trước năm 1968, hoặc có bằng chứng chứng minh Đội 11 xuất phát từ hầm 287/70 Trần Quý Cáp.
