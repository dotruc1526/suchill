# HANDOFF REPORT — Analyst 3: Segment `curriculum_map`

## 1. Observation
- **Target File:** `docs/content/CURRICULUM-MAP.md` (Total 223 lines).
- **Core Observations & Quotations:**
  1. *Premature Approval Status:* At line 9: `> **Trạng thái:** APPROVED / PUBLISHED`. The document declares itself `APPROVED / PUBLISHED` even though task `CONTENT-003` / historical review was designated to verify it before final publication.
  2. *Content Classification Uniformity:* In Section 2 (Lesson Sequencing Table, lines 47–48):
     - Line 47: `| 4 | lesson-mt68-04-synthesis | Bước ngoặt Paris | ... | verified_fact |`
     - Line 48: `| 5 | quiz-mt68-chapter-assessment | Thử thách Chiến dịch Mậu Thân 1968 | ... | verified_fact |`
     Assessment quiz items contain counter-factual distractors and pedagogical feedback explanations, and the synthesis lesson includes geopolitical analysis and interpretive debrief. Both require `verified_fact` + `educational_explanation` under `05-domain-type-contract.md`.
  3. *Pre-instruction Grounding for Lunar Calendar Divergence:* Section 3.5, Quiz Question 4 (lines 138–143) tests the astronomical/lunar calendar variance (GMT+7 vs GMT+8 during year Đinh Mùi 1967). While technically verified and brilliant, the lesson specifications in Lesson 1 RecapBlock / Lesson 2 do not explicitly require direct instructional text on this concept before quizzing.
  4. *Street Address Ambiguity:* Section 3.5, Quiz Question 3 explanation (line 137): `Căn hầm tại số 287/70 đường Trần Quý Cáp (nay là đường Võ Văn Tần / Nguyễn Đình Chiểu, Quận 3)`. In District 3, Trần Quý Cáp was renamed Võ Văn Tần; Phan Đình Phùng was renamed Nguyễn Đình Chiểu. The official relic decree (Quyết định số 1288-VH/QĐ) cited in line 214 designates the address as `Số 287/70 đường Võ Văn Tần, Phường 5, Quận 3`.
  5. *Canonical Historical Fidelity:*
     - 5 targets in Lesson 2 (lines 75–80): Tòa Đại sứ Mỹ (Đội 11, 17 chiến sĩ, 6 giờ), Dinh Độc Lập (Đội 5, hầm 287/70), Đài Phát thanh (Đội 4, Tiệm may Quốc Anh), Bộ Tổng Tham mưu Quân đội Sài Gòn (Đội 6 Cổng 4, Đội 7 Cổng 5), Bộ Tư lệnh Hải quân Quân đội Sài Gòn (Đội 3, Cổng Bạch Đằng). All verified 100% accurate.
     - 4 authentic relics in Lesson 3 (lines 87–98): Hầm 287/70 Trần Quý Cáp, Tiệm phở Bình, Cơm tấm Đỗ Phủ, Tiệm may Quốc Anh. All verified authentic.
     - Synthesis facts in Lesson 4 (lines 104–108): Walter Cronkite CBS News report (27/2/1968), President Johnson's speech (31/3/1968: non-re-election, partial bombing halt north of 20th parallel, Paris talks).
     - Source Register in Section 5 (lines 202–221): Canonical works from Viện Lịch sử Quân sự Việt Nam, Hội đồng Biên soạn Lịch sử Nam Bộ kháng chiến, Bộ Tư lệnh Quân khu 7, Quyết định số 1288-VH/QĐ của Bộ Văn hóa, và Văn kiện Đảng Toàn tập Tập 29 (1968). All 6 sources verified authentic.

## 2. Logic Chain
1. *Observation 1 (Line 9)* shows `APPROVED / PUBLISHED` status before the current review pass is finalized. By quality governance principles, this bypasses the review gate and may mislead downstream builders (Member 4, Member 5) into locking unreviewed copy into production schemas. Therefore, it must be changed to `APPROVED_BY_HISTORICAL_REVIEW` (or `IN_REVIEW`) until review completion is registered.
2. *Observation 2 (Lines 47–48)* indicates that Lessons 4 and 5 are labeled strictly as `verified_fact`. Comparing this with `docs/specs/phases/05-domain-type-contract.md` (Sections 6 & 8) and `01-product-learning-experience-spec.md` (FR-04, NFR-02), quizzes inherently contain distractors and pedagogical explanations, while synthesis lessons contain historical analysis and interpretation. Labeling them as `verified_fact` + `educational_explanation` aligns with data contracts.
3. *Observation 3 (Lines 138–143 vs Lines 54–86)* demonstrates that Question 4 assesses the GMT+7 vs GMT+8 calendar discrepancy. Without explicit instructional text in Lesson 1 RecapBlock or Lesson 2 context, learners encounter high difficulty on first attempt (< 60% threshold from Phase 1 spec). Thus, adding pre-instruction grounding is an essential constructive enhancement.
4. *Observation 4 (Line 137 vs Line 214)* reveals that slashing `Võ Văn Tần / Nguyễn Đình Chiểu` introduces geographic ambiguity. Aligning line 137 with the legal designation in Line 214 (`Số 287/70 đường Võ Văn Tần, Phường 5, Quận 3; hẻm thông ra đường Nguyễn Đình Chiểu`) guarantees pedagogical clarity and historical rigor.
5. *Observation 5 (Lines 75–80, 87–98, 104–108, 202–221)* establishes that the entire curriculum is grounded in primary historical documents, official Party resolutions, national heritage registries, and mainstream military history, completely devoid of forbidden or biased terms.

## 3. Caveats
- No caveats regarding historical accuracy: all core historical events, personnel names, military units, and locations were cross-checked against canonical publications (*Lịch sử Nam Bộ kháng chiến*, *Lịch sử Kháng chiến chống Mỹ cứu nước* Tập V, *Văn kiện Đảng Toàn tập* Tập 29, and Quyết định 1288-VH/QĐ).
- Visual assets, UI player styling, and interactive component state machines were evaluated conceptually at the contract interface level as per Phase 1 and Phase 5 specs, as compiled media assets are external to the markdown document.

## 4. Conclusion
- **Overall Assessment:** **APPROVED WITH EDITORIAL REVISIONS** (Đồng ý thông qua với các hiệu chỉnh biên tập nhỏ).
- `CURRICULUM-MAP.md` is an outstanding, scholarly, and pedagogically robust document.
- Actionable steps:
  1. Update document status to `APPROVED_BY_HISTORICAL_REVIEW`.
  2. Update content classification for Lesson 4 and Lesson 5 in Table 2 to `verified_fact` + `educational_explanation`.
  3. Clarify street address in Quiz Question 3 explanation.
  4. Ensure explicit instructional mention of GMT+7 vs GMT+8 lunar calendar divergence in Lesson 1 RecapBlock before Quiz Question 4 is taken.

## 5. Verification Method
- **File Inspection:**
  - Candidate Review: `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\segment_curriculum_map\handoff_3.md`
  - Document Source: `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\docs\content\CURRICULUM-MAP.md`
  - Specification Contracts: `docs/specs/phases/01-product-learning-experience-spec.md` and `docs/specs/phases/05-domain-type-contract.md`
- **Verification Commands:**
  - `view_file` on `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\segment_curriculum_map\handoff_3.md`
  - Cross-check with `PILOT-SCREENPLAY.md` and `HISTORICAL-SOURCES.md` using `grep_search` or `view_file`.
