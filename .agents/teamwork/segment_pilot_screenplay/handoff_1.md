**Segment scope**: `docs/content/PILOT-SCREENPLAY.md` toàn bộ 7 phần (PILOT_SCREENPLAY_INTRO, SPECS, SCENES, TRANSCRIPT, SUBTITLES, POSTER_FALLBACK, CHECKLIST; dòng 1–205) đối chiếu lịch sử chính thống Việt Nam.

# Potential Mistakes and Improvements

### 1. [Major] Lỗi định dạng dấu thời gian WebVTT (Inconsistent Timestamp Syntax) và thiếu dòng phụ đề kết thúc (Missing Closing CTA Cue)
- **Vị trí quan sát:** `docs/content/PILOT-SCREENPLAY.md`, Mục 4 (Mẫu tập tin phụ đề chuẩn WebVTT), dòng 137–158.
- **Trích dẫn nguyên văn:**
  ```vtt
  00:01:07.000 --> 00:01:10.500
  Tại Tiệm phở Bình, Chỉ huy trưởng Tư Chu phát lệnh: Giờ G đã điểm!

  01:10.800 --> 01:14.000
  Rạng sáng 31 tháng Giêng năm 1968.

  01:14.200 --> 01:17.800
  Tiếng bộc phá sấm sét rung chuyển Sài Gòn!
  ...
  01:46.000 --> 01:50.000
  Buộc Mỹ phải xuống thang và ngồi vào bàn đàm phán Paris!
  ```
- **Phân tích sai lệch kỹ thuật & quy chuẩn:**
  1. *Lỗi định dạng WebVTT:* Từ dòng 99 đến dòng 135 (các cue từ 00:00 đến 01:10), mẫu WebVTT sử dụng định dạng 3 thành phần có giờ `hh:mm:ss.ttt` (ví dụ: `00:00:01.000 --> 00:00:06.500` và `00:01:07.000 --> 00:01:10.500`). Tuy nhiên, bắt đầu từ dòng 137 trở đi (`01:10.800 --> 01:14.000`), dấu thời gian bị lược bỏ trường giờ (`hh`), đột ngột chuyển sang định dạng 2 thành phần `mm:ss.ttt`. Trong đặc tả kỹ thuật WebVTT của W3C và bộ phân tích cú pháp HTML5 video player (đặc biệt trên các trình duyệt di động iOS Safari, Android WebKit, ffmpeg VTT muxer), việc không đồng nhất trường giờ giữa các cue trong cùng một tệp `.vtt` rất dễ gây lỗi cú pháp parser failure hoặc ngắt hiển thị phụ đề từ giây thứ 70 trở đi.
  2. *Thiếu dòng phụ đề kết kịch bản (Missing Closing CTA Cue):* Trong Bảng kịch bản kỹ thuật Scene 05 (dòng 45) và Toàn văn lời thoại (dòng 84–85), lời dẫn có câu kêu gọi hành động sư phạm: *"Hãy cùng bước vào Bài học 2 để trực tiếp khám phá những trận đánh huyền thoại!"* (cột Phụ đề dòng 45 ghi: *"Khám phá chi tiết tại Bài 2: Sấm sét nội đô!"*). Tuy nhiên, trong tệp WebVTT tại dòng 156–158, cue phụ đề cuối cùng dừng lại ở giây `01:50.000` với nội dung *"Buộc Mỹ phải xuống thang và ngồi vào bàn đàm phán Paris!"*, hoàn toàn bỏ sót câu phụ đề kêu gọi vào Bài học 2.
- **Biện pháp khắc phục kiến nghị:**
  1. Chuẩn hóa đồng bộ 100% dấu thời gian sang định dạng `hh:mm:ss.ttt` đầy đủ (ví dụ: `00:01:10.800 --> 00:01:14.000`, `00:01:14.200 --> 00:01:17.800`, ..., `00:01:46.000 --> 00:01:50.000`).
  2. Bổ sung cue phụ đề còn thiếu cho câu kết:
     ```vtt
     00:01:46.500 --> 00:01:50.000
     Khám phá chi tiết tại Bài 2: Sấm sét nội đô!
     ```

---

### 2. [Major] Ghi nhận trạng thái phê duyệt sớm và đánh dấu nghiệm thu chưa kiểm chứng (Premature Approval Status & Inaccurate Checklist State)
- **Vị trí quan sát:** `docs/content/PILOT-SCREENPLAY.md`, Mục Mở đầu (dòng 13) và Mục 6 (Bảng kiểm nghiệm thu chất lượng, dòng 186–202).
- **Trích dẫn nguyên văn:**
  - Dòng 13: `> **Trạng thái:** APPROVED / READY_FOR_PRODUCTION`
  - Dòng 195: `| 4 | **Tính chuẩn xác lịch sử** | 100% khớp tư liệu chính thống (Hầm Năm Lai, Tiệm phở Bình, 5 mục tiêu) | Historical Reviewer | [x] ĐẠT |`
  - Dòng 191–201: Cả 10 mục nghiệm thu đều được đánh dấu tích `[x] ĐẠT`.
- **Phân tích sai lệch quy trình kiểm thử & kiểm duyệt:**
  1. Theo hồ sơ theo dõi nhiệm vụ của dự án (`docs/tasks/blocked/CONTENT-003.md`), nhiệm vụ kiểm duyệt lịch sử và tư liệu truyền thông cho pilot (CONTENT-003) đang ở trạng thái `BLOCKED / Chưa gán Reviewer`, và nhiệm vụ sản xuất video (`CONTENT-007`) cũng đang bị `BLOCKED` chờ kết quả kiểm duyệt lịch sử.
  2. Việc kịch bản tự gắn nhãn `APPROVED / READY_FOR_PRODUCTION` ở dòng 13 và tự tích `[x] ĐẠT` cho Historical Reviewer tại dòng 195 trước khi khâu review hoàn thành thực tế là vi phạm nguyên tắc cổng chất lượng (quality gate bypass). Hơn nữa, các khâu sản xuất video (Trúc - Member 2) và tích hợp player (Dương - Member 4) chưa triển khai nhưng checklist đã tích `[x] ĐẠT` toàn bộ, gây nhầm lẫn về tiến độ thực tế của dự án.
- **Biện pháp khắc phục kiến nghị:**
  1. Điều chỉnh dòng 13 thành: `> **Trạng thái:** PENDING_HISTORICAL_REVIEW` (hoặc chuyển thành `APPROVED_HISTORICALLY` sau khi Historical Reviewer ký duyệt).
  2. Tại Bảng kiểm Mục 6, chuyển các ô đánh dấu của các khâu chưa nghiệm thu thành `[ ] CHƯA NGHIỆM THU` (hoặc để trống để các vai trò phụ trách Trúc, Dương, Vinh thực hiện nghiệm thu theo đúng quy trình phân đoạn). Riêng mục số 4 sẽ do Historical Reviewer chính thức xác nhận sau đợt review này.

---

### 3. [Major] Phát hiện mâu thuẫn chéo giữa Kịch bản và Tài liệu nguồn về căn cứ xuất kích của Đội 11 (Cross-Document Contradiction: Base Assignment for Team 11 vs Team 5)
- **Vị trí quan sát:** 
  - `docs/content/PILOT-SCREENPLAY.md`, Scene 04 (dòng 44) & Scene 02 (dòng 42).
  - Đối chiếu với `docs/content/HISTORICAL-SOURCES.md`, Mục 2 (dòng 23).
  - Đối chiếu với `docs/content/CURRICULUM-MAP.md`, Mục 3.2 (dòng 76) & Mục 3.5 (dòng 133).
- **Trích dẫn nguyên văn:**
  - `PILOT-SCREENPLAY.md` dòng 44: *"Hình ảnh mũi tiến công thứ hai: Đội 5 Biệt động xuất kích từ hầm Trần Quý Cáp, đánh bộc phá cổng Dinh Độc Lập; Đội 4 từ tiệm may Quốc Anh chiếm lĩnh Đài Phát thanh Sài Gòn."*
  - `HISTORICAL-SOURCES.md` dòng 23: *"Hầm vũ khí bí mật 287/70 Trần Quý Cáp (nay là đường Nguyễn Đình Chiểu): Nơi xuất phát của Đội 11 đánh vào Đại sứ quán."*
- **Đối chiếu sử liệu chính thống:**
  1. Theo Hồ sơ Di tích Lịch sử cấp Quốc gia (Quyết định số 1288-VH/QĐ của Bộ Văn hóa - Thông tin, nay là Bộ VHTTDL) và công trình *Biệt động Sài Gòn — Chợ Lớn — Gia Định trong Tổng tiến công và nổi dậy Xuân Mậu Thân 1968* (NXB Quân đội nhân dân): Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là đường Võ Văn Tần, Phường 5, Quận 3) do đồng chí Trần Văn Lai (Năm Lai / Mai Hồng Quế) xây dựng chính là nơi tiếp nhận, cất giấu vũ khí và là điểm xuất phát trực tiếp của **Đội 5 Biệt động** (gồm 15 chiến sĩ do đồng chí Tô Hoài Thanh chỉ huy) tiến công vào Dinh Độc Lập lúc rạng sáng Mùng 2 Tết.
  2. Đội 11 (gồm 17 chiến sĩ do đồng chí Ba Đen / Ngô Thành Nguyên chỉ huy) đánh vào Tòa Đại sứ Mỹ xuất phát từ cơ sở khác (trạm cơ sở số 59 Phan Thanh Giản, nay là đường Điện Biên Phủ).
  3. **Đánh giá:** Bản thân `PILOT-SCREENPLAY.md` đã mô tả **hoàn toàn chính xác** sự thật lịch sử (Đội 5 xuất kích từ hầm 287/70 đánh Dinh Độc Lập). Tuy nhiên, tài liệu nguồn liên đới trực tiếp `docs/content/HISTORICAL-SOURCES.md` (dòng 23) lại ghi sai nghiêm trọng cả hai chi tiết: gán hầm 287/70 cho Đội 11 đánh Tòa Đại sứ, và ghi nhầm tên đường hiện nay thành Nguyễn Đình Chiểu (thực tế là Võ Văn Tần).
- **Biện pháp khắc phục kiến nghị:**
  - Giữ vững tính chuẩn xác lịch sử của `PILOT-SCREENPLAY.md`.
  - Ghi nhận yêu cầu hiệu chỉnh đồng bộ sang tệp `docs/content/HISTORICAL-SOURCES.md` (sửa dòng 23 thành: *"Căn hầm chứa vũ khí số 287/70 Trần Quý Cáp (nay là đường Võ Văn Tần): Nơi cất giấu gần 2 tấn vũ khí và là điểm xuất kích của Đội 5 đánh vào Dinh Độc Lập"*).

---

### 4. [Major] Phân tích và thẩm định các yếu tố lịch sử chuẩn xác cốt lõi (Verified Historical Strengths)
Toàn bộ kịch bản 110 giây thể hiện mức độ am hiểu sử liệu sâu sắc, bám sát các công trình nghiên cứu chính thống của Viện Lịch sử Quân sự Việt Nam và Hội đồng chỉ đạo biên soạn Lịch sử Nam Bộ kháng chiến:
1. **Hầm vũ khí 287/70 Trần Quý Cáp:** Tái hiện chính xác danh tính Anh hùng Lực lượng vũ trang nhân dân Trần Văn Lai (Năm Lai) dưới vỏ bọc nhà thầu khoán dinh Độc Lập Mai Hồng Quế; vinh danh người vợ kiên trung Đặng Thị Thiệp (đã được phong tặng danh hiệu Anh hùng LLVTND năm 2020); khối lượng vũ khí cất giấu gần 2 tấn (gồm thuốc nổ TNT, súng AK-47, đạn B40, lựu đạn) được giữ bí mật tuyệt đối giữa lòng nội đô nhờ thế trận lòng dân.
2. **Sở chỉ huy tiền phương Tiệm phở Bình:** Nêu bật địa chỉ lịch sử số 7 Yên Đổ (nay là số 7 Lý Chính Thắng), nơi đặt Sở chỉ huy tiền phương Phân khu 6 (cánh Bắc / nội đô Sài Gòn - Gia Định) do Chỉ huy trưởng Biệt động Sài Gòn Nguyễn Đức Hùng (Tư Chu) trực tiếp chỉ huy và truyền đạt mệnh lệnh giờ G.
3. **Thơ chúc Tết Xuân Mậu Thân 1968 của Chủ tịch Hồ Chí Minh:** Trích dẫn nguyên văn 100% 4 câu thơ lịch sử: *"Xuân này hơn hẳn mấy xuân qua / Thắng trận tin vui khắp nước nhà / Nam Bắc thi đua đánh giặc Mỹ / Tiến lên! Toàn thắng ắt về ta!"*. Kịch bản xác định chuẩn xác vai trò của bài thơ phát trên Đài Tiếng nói Việt Nam như một quy ước mật lệnh phát động cuộc Tổng tiến công và nổi dậy trên toàn miền Nam.
4. **Năm mục tiêu đầu não trung tâm:** Phản ánh đúng 5 mục tiêu then chốt làm rung chuyển cơ quan đầu não đối phương tại Sài Gòn: Tòa Đại sứ Mỹ (Đội 11), Dinh Độc Lập (Đội 5), Đài Phát thanh Sài Gòn (Đội 4), Bộ Tổng Tham mưu và Bộ Tư lệnh Hải quân. Trận đánh kiên cường hơn 6 giờ đồng hồ của Đội 11 tại Tòa Đại sứ Mỹ được khắc họa trang nghiêm, hào hùng.
5. **Ý nghĩa bước ngoặt chiến lược:** Đánh giá đúng tầm vóc địa chính trị của chiến dịch: làm sụp đổ ảo tưởng chiến thắng của Lầu Năm Góc, thổi bùng phong trào phản chiến tại Mỹ (qua phóng sự chấn động của ký giả Walter Cronkite trên CBS News ngày 27/2/1968), làm phá sản chiến lược "Chiến tranh cục bộ", buộc Tổng thống Lyndon B. Johnson phải tuyên bố xuống thang chiến tranh, ngừng ném bom miền Bắc từ vĩ tuyến 20 trở ra và chấp nhận ngồi vào bàn đàm phán tại Hội nghị Paris.
6. **Thuật ngữ chính trị - lịch sử:** 100% tuân thủ các quy chuẩn lịch sử Việt Nam ("Kháng chiến chống Mỹ cứu nước", "Đế quốc Mỹ", "Biệt động Sài Gòn", "Tổng tiến công và nổi dậy"). Tuyệt đối không xuất hiện các thuật ngữ mang định kiến phương Tây hoặc phản ánh sai bản chất cuộc kháng chiến giải phóng dân tộc.

---

# Minor Corrections and Typos

### 1. [Minor] Đồng bộ nhãn phân loại nội dung giữa Bảng Thông số kỹ thuật và Phân cảnh 5
- **Vị trí:** `docs/content/PILOT-SCREENPLAY.md`, Bảng 1 dòng 28 so với Bảng 2 dòng 45.
- **Phân tích:** Dòng 28 ghi: *"Phân loại Sự thật Lịch sử: verified_fact (100% sự thật lịch sử)"*. Tuy nhiên, tại Phân cảnh 5 (dòng 45), nhãn nội dung được phân loại chính xác là: `verified_fact` + `educational_explanation` vì có chứa lời dẫn sư phạm chuyển tiếp sang Bài học 2 (*"Hãy cùng bước vào Bài học 2 để trực tiếp khám phá những trận đánh huyền thoại!"*).
- **Khắc phục:** Hiệu chỉnh dòng 28 thành: `verified_fact` (kết hợp `educational_explanation` cho phần chuyển tiếp sư phạm cuối video) để bảo đảm tính nhất quán trong hợp đồng dữ liệu.

### 2. [Minor] Thống nhất thuật ngữ "Mật lệnh" thay vì "Mật hiệu" trong Phụ đề
- **Vị trí:** `docs/content/PILOT-SCREENPLAY.md`, dòng 132 so với dòng 43 và dòng 72.
- **Phân tích:** Lời dẫn Voiceover (dòng 72) và Bảng kịch bản (dòng 43) sử dụng thuật ngữ quân sự chuẩn mực: *"Bốn câu thơ hào sảng chính là mật lệnh mở màn cuộc Tổng tiến công và nổi dậy trên toàn miền Nam"*. Nhưng tại dòng 132 của phụ đề WebVTT lại dùng từ: *"Đó chính là mật hiệu mở màn..."*. Thuật ngữ "mật lệnh" (operational order / directive) mang tính trang trọng, chính quy và chuẩn xác hơn theo các văn kiện chỉ đạo của Trung ương Cục và Quân ủy Miền.
- **Khắc phục:** Sửa dòng 132 thành: `"Đó chính là mật lệnh mở màn Tổng tiến công toàn miền Nam."`

### 3. [Minor] Bổ sung định danh chủ thể đối phương cho hai mục tiêu cơ quan chỉ huy quân sự
- **Vị trí:** `docs/content/PILOT-SCREENPLAY.md`, Scene 04 dòng 44, 80, 145.
- **Trích dẫn:** *"Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu và Bộ Tư lệnh Hải quân."*
- **Phân tích:** Trong văn cảnh giảng dạy cho thế hệ trẻ (học sinh/người học hiện đại), việc ghi vắn tắt *"Bộ Tổng Tham mưu và Bộ Tư lệnh Hải quân"* có thể khiến người học chưa nắm vững lịch sử dễ nhầm lẫn với cơ quan chỉ huy của Quân đội nhân dân Việt Nam. Trong tài liệu liên quan (`docs/content/CURRICULUM-MAP.md`, dòng 78–79, 131), tác giả đã viết rõ ràng: *"Bộ Tổng Tham mưu Quân đội Sài Gòn"* và *"Bộ Tư lệnh Hải quân Quân đội Sài Gòn"*.
- **Khắc phục:** Khuyến nghị bổ sung định danh trong phụ đề hiển thị hoặc chú thích đồ họa: *"Bộ Tổng Tham mưu và Bộ Tư lệnh Hải quân quân đội Sài Gòn"* để tăng tính khúc chiết sư phạm.

### 4. [Minor] Tiết chế chỉ dẫn âm thanh hiện trường (SFX Cue Direction)
- **Vị trí:** `docs/content/PILOT-SCREENPLAY.md`, Scene 04 dòng 44 (cột SFX).
- **Trích dẫn:** `SFX: Tiếng súng AK-47 điểm xạ đanh gọn, tiếng lính Mỹ hoảng loạn kêu thét, tiếng cánh quạt trực thăng Huey gầm rú rách toạc màn đêm.`
- **Phân tích:** Việc mô tả *"tiếng lính Mỹ hoảng loạn kêu thét"* mang tính kịch hóa phim ảnh hành động. Khi chuyển giao cho đạo diễn âm thanh (Member 2 - Trúc), cần lưu ý chỉ dẫn hòa âm tạo cảm giác chiến sự chân thực, khốc liệt nhưng giữ vững tính trang nghiêm, khách quan của phim tài liệu lịch sử, tránh lồng tiếng la hét phóng đại làm giảm tính chính luận của tác phẩm.
- **Khắc phục:** Ghi chú đạo diễn âm thanh: Lồng tiếng radio đàm thoại chiến thuật quân sự tiếng Anh gấp gáp, xáo trộn qua bộ đàm quân sự Mỹ thay vì tiếng kêu thét kịch tính hóa quá mức.

### 5. [Minor] Chú giải rõ ràng về tính chất hai múi giờ và lịch âm trong bối cảnh lịch sử
- **Vị trí:** `docs/content/PILOT-SCREENPLAY.md`, Scene 01 dòng 41, Scene 03 dòng 43 và Thẻ dự phòng dòng 175, 180.
- **Phân tích:** Kịch bản gọi thời điểm bắt đầu là *"Đêm Giao thừa Tết Mậu Thân 1968"* (đêm 30/1/1968), trong khi thẻ tóm tắt dòng 180 ghi *"Rạng sáng Mùng 2 Tết (31/1/1968)"*. Đồ họa Scene 03 đã thể hiện bản đồ múi giờ GMT+7 (Hà Nội) và GMT+8 (Sài Gòn). Đây là điểm khác biệt lịch âm năm Đinh Mùi rất độc đáo (miền Bắc tháng 11 thiếu nên Giao thừa là đêm 29/1, miền Nam tháng 11 đủ nên Giao thừa là đêm 30/1).
- **Khắc phục:** Đồ họa visual cue ở Scene 03 cần hiển thị rõ dòng text ngắn giải thích: *"Do chênh lệch múi giờ và cách tính lịch âm, đêm 30 rạng sáng 31/1/1968 là Giao thừa tại Sài Gòn, tương ứng rạng sáng Mùng 2 Tết theo lịch Hà Nội"* để người học không bị mâu thuẫn nhận thức giữa hai mốc thời gian.
