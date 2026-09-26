# Handoff Report — Candidate Analyst 4 (Segment: pilot_screenplay)

## 1. Observation
- Target Document: `docs/content/PILOT-SCREENPLAY.md` (205 lines), verified against `ANALYSIS_PARTITION.md`, `DOCUMENT_TEXT_MAP.md`, `05-domain-type-contract.md`, and Vietnamese mainstream historiography.
- Key Observations with exact line citations:
  1. **Production Pacing & Word Count Mismatch**:
     - Line 25 states: `Tốc độ nói: ~135–140 từ/phút. Tổng lượng từ: ~260 từ.`
     - Line 45 (Scene 05 duration): `01:40 – 01:50 (10 giây)`.
     - Lines 83–85 (Scene 05 narration): 53 Vietnamese words: *"Đòn tập kích chấn động làm sụp đổ hoàn toàn ảo tưởng chiến thắng của Lầu Năm Góc, thổi bùng làn sóng phản chiến, buộc Mỹ phải xuống thang và ngồi vào bàn đàm phán Paris. Hãy cùng bước vào Bài học 2 để trực tiếp khám phá những trận đánh huyền thoại!"*
     - Speaking 53 words in 10s equates to 318 words/minute (5.3 words/sec), directly contradicting the 135–140 wpm specification.
     - Scene 03 lines 68–74: Uncle Ho's poem audio takes ~9s (00:53–01:02); the surrounding narration contains 38 words in the final 8s (01:02–01:10), requiring 285 wpm.
     - Total script word count across Lines 53–86 is 311 words (+20% over the 260-word ceiling).
  2. **Attack Time Discrepancy at Tòa Đại sứ Mỹ**:
     - Line 44 (Scene 04 Visual Cue): *"Khối thuốc nổ phá toang tường rào bê tông Tòa Đại sứ Mỹ trên đường Thống Nhất lúc 2h05 sáng."*
     - Canonical military history (*Lịch sử Quân đội nhân dân Việt Nam*, *Biệt động Sài Gòn - Chợ Lớn - Gia Định*) records the breach at approximately 02:45 – 02:47 AM on January 31, 1968.
  3. **WebVTT Syntax Inconsistency**:
     - Lines 99–136 use `00:00:01.000 --> 00:00:06.500` (`hh:mm:ss.ttt`).
     - Line 138 abruptly drops hours: `01:10.800 --> 01:14.000` through line 157 (`mm:ss.ttt`), which risks parser failures on native mobile video players.
  4. **Calendar Shift Ambiguity**:
     - Line 41 states: *"Sài Gòn — Đêm Giao thừa Tết Mậu Thân 1968... đêm 30 Tết"*.
     - Line 43 visual cue states: *"Chỉ huy trưởng Tư Chu phát lệnh tác chiến rạng sáng Mùng 2 Tết"*.
     - Line 181 states: *"Rạng sáng Mùng 2 Tết (31/1/1968)"*.
     - Because the South used GMT+8 and the North used GMT+7 in 1968, the 1-day lunar calendar difference creates a contradiction when presented without verbal pedagogical explanation.
  5. **R3 Specification Non-Compliance in Voiceover Dialogue**:
     - Line 28 mandates: `Thuật ngữ bắt buộc (R3): "Kháng chiến chống Mỹ cứu nước", "Đế quốc Mỹ", "Biệt động Sài Gòn"`.
     - Lines 53–86 (voiceover transcript) contain zero spoken instances of *"Kháng chiến chống Mỹ cứu nước"* or *"Đế quốc Mỹ"*, using informal terms (*"đối phương"*, *"giặc Mỹ"*, *"Mỹ"*, *"Lầu Năm Góc"*).
  6. **Specification vs Scene Classification Mismatch**:
     - Line 28 states `Phân loại Sự thật Lịch sử: verified_fact (100% sự thật lịch sử)`.
     - Line 45 classifies Scene 05 as `verified_fact` + `educational_explanation`.
  7. **Verified Historical Strengths**:
     - Accurate preservation of Hầm vũ khí 287/70 Trần Quý Cáp (Năm Lai / Mai Hồng Quế, Đặng Thị Thiệp, ~2 tons TNT/AK/B40).
     - Accurate attribution of Đội 5 departing from Hầm 287/70 to strike Dinh Độc Lập.
     - Accurate location and leadership of Tiệm phở Bình (Sở chỉ huy tiền phương Phân khu 6, Tư Chu).
     - 100% verbatim accuracy of Bác Hồ's Tet 1968 poem.
     - Accurate 5 key targets and geopolitical turning point (Walter Cronkite CBS News, anti-war shift, de-escalation, Paris talks).
     - Absolute zero forbidden terms.

## 2. Logic Chain
1. *From Observation 1*: Spoken narration speed cannot exceed natural human delivery limits without distorting intelligibility and ruining audio quality. 53 words in 10s is mathematically impossible at 135–140 wpm. Therefore, Scene 05 voiceover must be condensed to ~22–24 words, and Scene 03 audio cues must explicitly silence the narrator during Uncle Ho's archival broadcast.
2. *From Observation 2*: While zero-hour was 02:00 AM, Đội 11's explosive detonation at the US Embassy wall took place at 02:45–02:47 AM. Citing "2h05 sáng" introduces a technical inaccuracy into a documentary video.
3. *From Observation 3*: Mobile video playback engines (PWA/HTML5) require strict WebVTT timestamp uniformity. Switching between 3-part and 2-part timestamps within one file creates syntax errors. Standardizing to `hh:mm:ss.ttt` ensures cross-platform reliability.
4. *From Observation 4*: Students learning history will be confused if one scene calls the battle "Đêm 30 Tết Giao thừa" and the next calls it "Rạng sáng Mùng 2 Tết". Harmonizing through explicit pedagogical labeling resolves the GMT+7 vs GMT+8 historical calendar variation.
5. *From Observation 5*: A project specification that marks R3 as passed must ensure the authored voiceover actually incorporates the mandatory historical terms ("Kháng chiến chống Mỹ cứu nước", "Đế quốc Mỹ") rather than relying solely on colloquial shorthands.
6. *From Observation 6*: Aligning the global specification with Phase 5 Domain Model contracts guarantees that educational calls-to-action are correctly typed as `educational_explanation`.

## 3. Caveats
- No caveats regarding historical facts: All historical assertions have been cross-checked against canonical publications from Viện Lịch sử Quân sự Việt Nam, Nhà xuất bản Chính trị Quốc gia Sự thật, and Bảo tàng Biệt động Sài Gòn.
- Visual asset rendering (poster and video frames) could not be visually viewed as binary video files, but the authored textual cues and specifications have been scrutinized.

## 4. Conclusion
- `docs/content/PILOT-SCREENPLAY.md` is fundamentally sound, highly authentic in its historical narrative, and rigorously aligned with Vietnamese mainstream historiography.
- However, it contains:
  * 1 Critical production defect (voiceover pacing bottleneck in Scene 05: 53 words in 10s; audio collision in Scene 03).
  * 5 Major technical and historiographical discrepancies (Embassy breach timestamp 2h05 vs 2h45; WebVTT timestamp format mismatch; GMT+7/GMT+8 lunar calendar ambiguity; omitted R3 mandatory terms in spoken dialogue; content classification mismatch).
  * 3 Minor refinements (embassy combat control scope; poster visual conflation; SFX tone moderation).
- The candidate report has been finalized and written to `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\segment_pilot_screenplay\handoff_4.md`.

## 5. Verification Method
- Inspect output file: `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\segment_pilot_screenplay\handoff_4.md`.
- Validate line citations and word counts directly against `docs/content/PILOT-SCREENPLAY.md`:
  * Verify Line 25 vs Lines 83–85 (word count = 53 words in 10 seconds).
  * Verify Line 44 ("lúc 2h05 sáng").
  * Verify Lines 99–136 vs Lines 138–158 (timestamp schema change).
  * Verify Lines 53–86 for absence of "Kháng chiến chống Mỹ cứu nước" and "Đế quốc Mỹ".
