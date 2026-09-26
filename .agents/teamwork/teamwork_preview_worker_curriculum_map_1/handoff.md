# Handoff Report — Candidate Analyst 1 (Segment curriculum_map)

## 1. Observation
- **Target File Analyzed:** `docs/content/CURRICULUM-MAP.md` (Total 223 lines), covering all 5 sections:
  - CURRICULUM_MAP_OVERVIEW (Lines 1–36)
  - CURRICULUM_MAP_SEQUENCING (Lines 38–50)
  - CURRICULUM_MAP_LESSON_SPECS (Lines 52–151)
  - CURRICULUM_MAP_DATA_CONTRACTS (Lines 153–200)
  - CURRICULUM_MAP_SOURCE_REGISTER (Lines 202–223)
- **Supporting Documentation & Specifications Checked:**
  - `docs/content/DOCUMENT_TEXT_MAP.md`
  - `docs/content/PILOT-SCREENPLAY.md`
  - `docs/content/HISTORICAL-SOURCES.md`
  - `docs/content/SGK-LESSON-MAUTHAN.md`
  - `docs/content/PEDAGOGY-FRAMEWORK.md`
  - `docs/specs/phases/01-product-learning-experience-spec.md`
  - `docs/specs/phases/03-historical-media-governance.md`
  - `docs/specs/phases/05-domain-type-contract.md`
  - `docs/tasks/done/CONTENT-008.md`
  - `docs/tasks/blocked/CONTENT-003.md`
- **Key Verbatim Findings:**
  1. *Premature Approval & Publication status:* Line 9 declares `> **Trạng thái:** APPROVED / PUBLISHED`, and Chapter Model TypeScript contract (line 488) sets `status: "published"`, while the historical review task `CONTENT-003` is still `BLOCKED` awaiting formal reviewer sign-off.
  2. *Content Classification mismatch:* Table in Section 2 (lines 42–48) labels Lesson 1, Lesson 4, and Lesson 5 solely as `verified_fact`. However:
     - Lesson 1 contains `IntroBlock` and `RecapBlock` (scaffolding explanations), and `PILOT-SCREENPLAY.md` Scene 05 explicitly classifies the scene as `verified_fact` + `educational_explanation`.
     - Lesson 4 is a political synthesis and strategic interpretation, which falls under `educational_explanation` according to Phase 3 Section 4.1.
     - Lesson 5 Quiz comprises plausible distractors and feedback explanations (`explanation`), requiring `verified_fact` + `educational_explanation`.
  3. *Missing Programmatic IDs in Question Bank:* Section 3.5 (lines 119–150) lists Questions 1 to 5 with simple A/B/C/D labels, missing standardized entity IDs (`id`, `optionIds`, `correctOptionId`, `difficulty`, `sourceIds`) mandated by `05-domain-type-contract.md` Section 8.
  4. *Historical Geography Ambiguity:* Question 3 explanation (line 137) states `(nay là đường Võ Văn Tần / Nguyễn Đình Chiểu, Quận 3)`. Đường Trần Quý Cáp sau 1975 đổi tên thành Võ Văn Tần (Phan Đình Phùng đổi thành Nguyễn Đình Chiểu); Quyết định 1288-VH/QĐ chính thức định danh là số 287/70 Võ Văn Tần.
  5. *Source Register Completeness:* Section 5 accurately cites canonical volumes (Viện Lịch sử Quân sự Việt Nam, Lịch sử Nam Bộ kháng chiến, Quyết định 1288-VH/QĐ cho Hầm 287/70, Văn kiện Đảng Toàn tập Tập 29, Bảo tàng Biệt động Sài Gòn), but lacks publication years and the specific decision number for Tiệm phở Bình (Quyết định số 43/2011/QĐ-BVHTTDL).
  6. *Historical & Pedagogical Excellence:* CLO-1 through CLO-4, all 5 targets in Lesson 2, the 4 secret infrastructure sites in Lesson 3, the Paris talks synthesis in Lesson 4, and all 5 Quiz questions (especially Question 4 on GMT+7 vs GMT+8 lunar calendar divergence) are thoroughly accurate and align 100% with canonical Vietnamese military historiography. Zero forbidden terms found.

## 2. Logic Chain
1. From Observation 1: Under Phase 3 Governance and Phase 5 Domain Contract, an entity cannot be marked `published` before formal historical and QA review gates pass. Resetting to `in_review` prevents premature deployment.
2. From Observation 2: Under Phase 3 Table 4.1, blending verified facts with pedagogical explanations without distinct tagging violates truth governance. Aligning table labels ensures frontend components render correct badges and citations.
3. From Observation 3: Without machine-readable question IDs and difficulty tags in the handoff spec, Frontend and Backend engineers would generate non-deterministic keys, breaking foreign-key integrity checks during QA-005.
4. From Observation 4: Clarifying the administrative address of Hầm 287/70 prevents students from confusing the post-1975 street renamings of Trần Quý Cáp and Phan Đình Phùng.
5. From Observation 5: Adding publication years and the relic decision number for Tiệm phở Bình upgrades the Source Register to full scholarly and archival traceability.
6. From Observation 6: The pedagogical framework, historical narrative, and assessment alignment are robust and valid, requiring only minor technical and data contract adjustments.

## 3. Caveats
- The Scene Graph for Lesson 2 (Visual Novel branching) is currently an architectural outline in CURRICULUM-MAP.md; detailed dialogue scripts and branching nodes will be authored by Member 1 in a future task.
- Interactive Archive Cards for Lesson 3 and audio clips for Lesson 4 were reviewed at the specification/metadata level, as physical media asset files are hosted in Supabase storage and not stored directly in this repo.

## 4. Conclusion
- The Curriculum Map `docs/content/CURRICULUM-MAP.md` is **historically authentic, pedagogically rigorous, and fully compliant with Vietnamese mainstream historiography**.
- **Overall Assessment:** **Approved with Minor Revisions** (Needs technical schema IDs, content classification label synchronization, and status update to `in_review` pending CONTENT-003 closure).
- The detailed candidate review has been written to:
  `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\segment_curriculum_map\handoff_1.md`.

## 5. Verification Method
- Inspect candidate review output file:
  `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\segment_curriculum_map\handoff_1.md`
- Inspect target curriculum map:
  `docs/content/CURRICULUM-MAP.md` lines 1–223
- Cross-reference against:
  - `docs/specs/phases/03-historical-media-governance.md`
  - `docs/specs/phases/05-domain-type-contract.md`
  - Quyết định số 1288-VH/QĐ (Bộ Văn hóa - Thông tin)
  - Quyết định số 43/2011/QĐ-BVHTTDL (Bộ VHTTDL)
  - *Văn kiện Đảng Toàn tập*, Tập 29 (1968), NXB CTQG
  - *Lịch sử Nam Bộ kháng chiến*, Tập 2, NXB CTQG Sự thật
