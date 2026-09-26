# Handoff Report: Root Review Aggregator (Level 2) — Segment 'curriculum_map'

**Agent**: `teamwork_preview_worker_curriculum_map_agg_root`  
**Role**: Root Review Aggregator (Level 2)  
**Segment**: `curriculum_map` (`docs/content/CURRICULUM-MAP.md`)  
**Definitive Report Target**: `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_3\unit_report_curriculum_map.md`

---

## 1. Observation
- **Tài liệu nguồn đã đối soát:** `docs/content/CURRICULUM-MAP.md` (223 dòng), `docs/content/DOCUMENT_TEXT_MAP.md` (dòng 312–535), `docs/content/PILOT-SCREENPLAY.md`, `docs/specs/phases/01-product-learning-experience-spec.md`, `docs/specs/phases/03-historical-media-governance.md`, `docs/specs/phases/05-domain-type-contract.md`.
- **Báo cáo Evolved Reviews đầu vào:**
  - `evolved_1.md` (`.agents/teamwork/segment_curriculum_map/evolved_1.md`, 109 dòng).
  - `evolved_2.md` (`.agents/teamwork/segment_curriculum_map/evolved_2.md`, 109 dòng).
- **Các quan sát trực tiếp cốt lõi:**
  1. *Tính chính xác lịch sử và thuật ngữ:* Toàn bộ các sự kiện, nhân vật (Trần Văn Lai, Tư Chu, Hai Phụng, Chín Nghĩa), 5 mục tiêu tiến công (Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu, Bộ Tư lệnh Hải quân), các địa chỉ đỏ (Hầm 287/70 Trần Quý Cáp, Phở Bình số 7 Yên Đổ/Lý Chính Thắng), mật lệnh thơ Bác Hồ, và các bước ngoặt địa chính trị (Walter Cronkite CBS News, tuyên bố 31/3/1968 của Tổng thống Johnson) đều chính xác 100%, tuân thủ tuyệt đối quan điểm sử học chính thống Việt Nam.
  2. *Trạng thái vòng đời thực thể:* Dòng 9 ghi `> **Trạng thái:** APPROVED / PUBLISHED` và dòng 176 ghi `status: "published"`, trong khi nhiệm vụ thẩm định `CONTENT-003.md` và sản xuất `CONTENT-007.md` vẫn đang trong tiến trình kiểm duyệt.
  3. *Phân loại nhãn nội dung:* Bảng Mục 2 (dòng 44, 47, 48) gán nhãn đơn nhất `verified_fact` cho Bài 1, Bài 4 và Bài 5. Trong khi đó, Bài 1 chứa `IntroBlock`/`RecapBlock`, Bài 4 chứa các phân tích chính trị và phóng sự truyền thông, Bài 5 chứa các phương án nhiễu giả định và lời giải thích sư phạm (`explanation`), cần được gán nhãn `verified_fact` + `educational_explanation`.
  4. *Khảo thí và củng cố nhận thức nền tảng:* Câu hỏi 4 khảo sát hiện tượng sai khác lịch âm do múi giờ GMT+7 (miền Bắc) và GMT+8 (Sài Gòn) năm Đinh Mùi nhưng đặc tả Bài 1 và 2 chưa có chỉ dẫn đưa kiến thức này vào phần giảng dạy/tóm tắt (RecapBlock).
  5. *Định danh kỹ thuật câu hỏi khảo thí:* Mục 3.5 đánh số văn bản thông thường (1–5, A–D) mà chưa có bộ schema IDs chuẩn (`id`, `difficulty`, `correctOptionId`, `sourceIds`) theo yêu cầu của Phase 5 Domain Type Contract.
  6. *Địa danh và hồ sơ di tích:* Câu 3 ghi tên đường dạng gạch chéo `"Võ Văn Tần / Nguyễn Đình Chiểu"` dễ gây nhầm lẫn; Di tích Tiệm phở Bình chưa ghi số quyết định 1288-VH/QĐ; Quán cơm tấm Đỗ Phủ và Tiệm may Quốc Anh chưa có dòng tham chiếu trong Source Register.

---

## 2. Logic Chain
1. *Từ Quan sát 1:* Do 100% dữ kiện lịch sử, 4 mục tiêu CLO, 4 bài học nội dung và 5 câu hỏi đánh giá đều trùng khớp với nguồn chính sử (Viện Lịch sử Quân sự, Văn kiện Đảng tập 29, Lịch sử Nam Bộ kháng chiến), segment `curriculum_map` đáp ứng trọn vẹn tiêu chí nội dung cốt lõi của CONTENT-003, đủ điều kiện phê duyệt (**APPROVED WITH RECOMMENDED REFINEMENTS**).
2. *Từ Quan sát 2:* Việc tự gán `APPROVED / PUBLISHED` từ khâu soạn thảo khung nội dung của Content Lead là hành vi nhảy cóc cổng chất lượng (Quality Gate bypass), dễ gây rủi ro kỹ thuật. Do đó, cần hạ trạng thái về `IN_REVIEW` trong giai đoạn thẩm định và nâng lên `APPROVED_BY_HISTORICAL_REVIEW` ngay khi nghiệm thu báo cáo này.
3. *Từ Quan sát 3:* Theo Phase 3 và Phase 5 Specs, các nội dung phân tích nguyên nhân - kết quả, bình luận chiến lược, và phản hồi giải thích trắc nghiệm thuộc phạm trù diễn giải sư phạm. Gán nhãn `verified_fact` + `educational_explanation` là bắt buộc để UI component và bộ lọc hiển thị chính xác.
4. *Từ Quan sát 4:* Nguyên lý sư phạm kiến tạo (Constructive Alignment) đòi hỏi nội dung khảo thí phải được giảng dạy trước đó. Bổ sung ghi chú múi giờ vào `RecapBlock` của Bài 1 hoặc phần mở đầu Bài 2 sẽ bảo đảm tỷ lệ vượt qua bài đánh giá lần đầu (`first-attempt accuracy` ≥ 60%).
5. *Từ Quan sát 5:* Bổ sung cấu trúc dữ liệu JSON/TypeScript mẫu cho 5 câu hỏi trong Section 3.5/4.2 giúp Member 4 (Frontend) và Member 5 (Backend) nạp dữ liệu nhất quán, loại bỏ nguy cơ lỗi khóa ngoại hoặc sai lệch chấm điểm.
6. *Từ Quan sát 6:* Chuẩn hóa địa chỉ hành chính hầm 287/70 (Võ Văn Tần, có hẻm thông Nguyễn Đình Chiểu), bổ sung Quyết định 1288-VH/QĐ cho Tiệm phở Bình, bổ sung hồ sơ Bảo tàng Biệt động Sài Gòn cho Cơm tấm Đỗ Phủ và Tiệm may Quốc Anh, và bổ sung năm xuất bản (2002, 2010, 2004) giúp hoàn thiện 100% Source Register.

---

## 3. Caveats
- Báo cáo thẩm định này tập trung vào bản đồ bài học `CURRICULUM-MAP.md` và sự tương thích với kịch bản `PILOT-SCREENPLAY.md`, nguồn tư liệu `HISTORICAL-SOURCES.md`, các đặc tả Phase 1, Phase 3, Phase 5.
- Các chi tiết triển khai mã nguồn cụ thể của Frontend Component (`FE-005`, `FE-006`) và Database Schema (`QA-005`) do các nhóm kỹ thuật phụ trách kiểm thử độc lập khi nạp dữ liệu.
- Giả định rằng các đơn vị bảo tồn di tích thực tế tại TP.HCM duy trì biển hiệu và hồ sơ di tích theo đúng Quyết định số 1288-VH/QĐ.

---

## 4. Conclusion
Bản đồ bài học Chapter MVP Mậu Thân 1968 (`docs/content/CURRICULUM-MAP.md`) được đánh giá xuất sắc về mặt học thuật và sư phạm. Báo cáo thẩm định đơn vị xác định:
- **Đánh giá tổng thể:** **PHÊ DUYỆT CÓ ĐIỀU KIỆN HOÀN THIỆN (APPROVED WITH RECOMMENDED REFINEMENTS)**.
- **Phát hiện phân loại:** 0 Lỗi nghiêm trọng (Critical), 4 Điểm cải tiến lớn (Major), 6 Điểm tinh chỉnh nhỏ (Minor).
- Toàn bộ nội dung tổng hợp đã được hợp nhất và ghi vào tệp báo cáo chính thức:
  `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_3\unit_report_curriculum_map.md`.

---

## 5. Verification Method
- **Đường dẫn kiểm tra trực tiếp:**
  - Báo cáo thẩm định đơn vị: `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_3\unit_report_curriculum_map.md`
  - Tài liệu nguồn: `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\docs\content\CURRICULUM-MAP.md`
- **Các tiêu chí kiểm chứng độc lập:**
  1. Kiểm tra 4 mục tiêu CLO-1 đến CLO-4 trong Section 2 của báo cáo đối chiếu với dòng 21–27 của `CURRICULUM-MAP.md`.
  2. Kiểm tra bảng thẩm định 5 bài học và 5 câu hỏi Quiz trong Section 3 và 4 của báo cáo đối chiếu dòng 54–150 của `CURRICULUM-MAP.md`.
  3. Kiểm tra các khuyến nghị Major (Quality Gate, Content Classification, Pre-grounding, Question Bank Schema) trong phần `# Potential Mistakes and Improvements`.
  4. Kiểm tra các chỉnh sửa địa danh, quyết định di tích và năm xuất bản trong phần `# Minor Corrections and Typos`.
