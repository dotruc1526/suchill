# Handoff Report - Analyst 2 (sources_and_research)

## 1. Observation
Directly examined source files:
- `docs/content/HISTORICAL-SOURCES.md` (Lines 1 to 53)
- `docs/content/RESEARCH-CANDIDATES.md` (Lines 1 to 50)
- `docs/content/DOCUMENT_TEXT_MAP.md` (Cross-checked with `PILOT-SCREENPLAY.md` and `CURRICULUM-MAP.md`)

Key textual quotes and observations:
1. In `HISTORICAL-SOURCES.md` line 18:
   `"danh sách 5 mục tiêu trọng yếu (Đại sứ quán Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng tham mưu, Biệt khu Thủ đô)."`
   Contradicts `PILOT-SCREENPLAY.md` (line 44, 80, 146) and `CURRICULUM-MAP.md` (line 387-391, 440) which consistently specify: Tòa Đại sứ Mỹ, Dinh Độc Lập, Đài Phát thanh, Bộ Tổng Tham mưu, và Bộ Tư lệnh Hải quân.
2. In `HISTORICAL-SOURCES.md` line 23:
   `"+ Hầm vũ khí bí mật 287/70 Trần Quý Cáp (nay là đường Nguyễn Đình Chiểu): Nơi xuất phát của Đội 11 đánh vào Đại sứ quán."`
   Direct factual conflicts:
   - Đường Trần Quý Cáp sau 1975 đổi tên thành Võ Văn Tần (Quận 3), không phải Nguyễn Đình Chiểu. Quyết định 1288-VH/QĐ xếp hạng Di tích ghi rõ: 287/70 Võ Văn Tần, Phường 5, Quận 3.
   - Hầm 287/70 là nơi xuất phát của Đội 5 đánh Dinh Độc Lập, không phải Đội 11 đánh Tòa Đại sứ (như chính `CURRICULUM-MAP.md` khẳng định tại Câu hỏi 3 và Phân cảnh 4 Screenplay).
3. In `HISTORICAL-SOURCES.md` line 33:
   `"- Về mốc thời gian: Đã ghi chú rõ độ lệch múi giờ (Giờ Hà Nội đang áp dụng GMT+7 trong khi Sài Gòn dùng GMT+8 lúc bấy giờ) dẫn đến sự chênh lệch giờ nổ súng thực tế so với hiệu lệnh, đảm bảo tính khách quan lịch sử."`
   Simplifies an astronomical 24-hour lunar calendar shift into a mere "hour difference", obscuring the historical reality that Northern Tet (Giao thừa 29/1, Mùng 1 Tết 30/1) occurred 1 full day earlier than Southern Tet (Giao thừa 30/1, Mùng 1 Tết 31/1), causing Military Region 5 and Central Highlands to strike on 30/1 while Saigon and Nam Bo struck on 31/1/1968.
4. In `HISTORICAL-SOURCES.md` Section 1 (lines 8-13):
   Omits foundational publications of Viện Lịch sử Quân sự Việt Nam (*Lịch sử Kháng chiến chống Mỹ cứu nước*, Tập V; *Lịch sử QĐNDVN*, Tập II) despite `PILOT-SCREENPLAY.md` repeatedly attributing its facts to Viện Lịch sử Quân sự Việt Nam.
5. In `HISTORICAL-SOURCES.md` line 39-40 and `RESEARCH-CANDIDATES.md` line 49-50:
   Suggests clipping YouTube footage from AP Archive and British Pathé under educational fair-use, ignoring YouTube Terms of Service, AP licensing restrictions, and limitation of Điều 25 Luật SHTT VN for app bundling.
6. In `HISTORICAL-SOURCES.md` Section 6 (lines 49-52):
   Lists `thuvienphapluat.vn` and `vietnamhoinhap.vn` as authoritative historical reference sources.
7. In `RESEARCH-CANDIDATES.md` lines 8 and 21:
   Uses "Chiến dịch Mậu Thân (1968)" instead of the canonical "Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968", and limits Linebacker II strictly to Hanoi without mentioning Hai Phong.

## 2. Logic Chain
1. From Observation 1, `HISTORICAL-SOURCES.md` asserts that the 5 targets include "Biệt khu Thủ đô", whereas the curriculum content establishes "Bộ Tư lệnh Hải quân". Since downstream code, quiz validations, and screenplay rely on the 5 targets, having an uncoordinated target in the source document creates a failure of traceability and content coherence.
2. From Observation 2, designating Hầm 287/70 as the staging base of Đội 11 (attacking the US Embassy) contradicts national relic records (Quyết định số 1288-VH/QĐ) and the screenplay/curriculum itself (where Đội 5 attacks the Independence Palace from Hầm 287/70). Street name misattribution (Nguyễn Đình Chiểu vs Võ Văn Tần) creates an objective geographic and historical error.
3. From Observation 3, the difference in attack times across battlefields in Tet 1968 was caused by the New Moon (thời điểm Sóc) occurring before midnight in GMT+7 (23h29 29/1/1968) vs after midnight in GMT+8 (00h29 30/1/1968), leading to a 1-day difference in Tet celebration dates. Framing this as a mere "timezone offset delay" distorts historical and pedagogical understanding.
4. From Observation 4, the source document must substantiate the attributions made in the screenplay (`verified_fact (Viện Lịch sử Quân sự Việt Nam)`). Without registering these volumes in Section 1, the attribution is unsubstantiated.
5. From Observation 5, AP Archive and British Pathé videos are proprietary commercial assets. Assuming fair use applies to downloading and bundling footage into an app creates critical IP infringement risk. Public domain (NARA / US federal government) or licensed domestic footage (TTXVN, VTV, BT Biệt động) must be used instead.
6. From Observation 6, non-peer-reviewed commercial web aggregators do not satisfy Tier 1/Tier 2 historical source governance.
7. From Observation 7, standard military historiography establishes "Tổng tiến công và nổi dậy" rather than "Chiến dịch" for Mậu Thân 1968, and includes Hải Phòng in Linebacker II defense.

## 3. Caveats
- No archival access was tested for foreign archives behind paywalls; assessment relies on standard international copyright law (Title 17 U.S.C.) and YouTube developer/content terms.
- Did not review or modify the actual video assets or audio recordings since media production belongs to downstream Member 2 (Trúc).
- Did not modify source files directly, adhering to the role of an adversarial reviewer providing an exhaustive candidate review report.

## 4. Conclusion
The documents `HISTORICAL-SOURCES.md` and `RESEARCH-CANDIDATES.md` have established a strong baseline with authentic primary and secondary references, but suffer from 8 substantive flaws classified as **[Major]** and 4 minor inaccuracies:
- Major targets inconsistency (Biệt khu Thủ đô vs Bộ Tư lệnh Hải quân).
- Major geographic and tactical error at Hầm 287/70 (Võ Văn Tần vs Nguyễn Đình Chiểu; Đội 5 vs Đội 11).
- Flawed timezone/lunar calendar explanation.
- Missing core Viện Lịch sử Quân sự works.
- Unsound fair-use assumptions for commercial foreign archives.
- Unregulated perspective labeling and violent imagery filtering.
- Non-academic secondary web sources.
- Non-standard campaign terminology.
Detailed remediation recommendations have been provided in `segment_sources_and_research/handoff_2.md`.

## 5. Verification Method
1. Inspect `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\segment_sources_and_research\handoff_2.md` to verify all findings.
2. Cross-check against `docs/content/HISTORICAL-SOURCES.md` line 18, 23, 33, 40, 50.
3. Cross-check with National Relic Decision Quyết định số 1288-VH/QĐ for Hầm 287/70 đường Võ Văn Tần (Quận 3).
4. Cross-check with *Lịch sử Kháng chiến chống Mỹ cứu nước*, Tập V, Viện Lịch sử Quân sự Việt Nam.
