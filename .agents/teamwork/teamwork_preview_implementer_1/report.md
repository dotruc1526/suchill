# Implementation Report — CONTENT-009

> **Executor:** teamwork_preview_implementer (Thọ — Member 1 + AI)\
> **Working Directory:** `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_implementer_1`\
> **Project Root:** `C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh`\
> **Deliverable:** `docs/features/research-content-009.md`\
> **Status:** COMPLETED & VERIFIED

---

## 1. What was implemented
1. **Created `docs/features/research-content-009.md`**:
   - Researched and proposed **4 candidate topics** (exceeding requirement of >= 3) on the Air War during the Resistance War against America in Vietnam (1964–1973/1975):
     - **Topic 1:** 12 ngày đêm "Điện Biên Phủ trên không" (Linebacker II - 12/1972: Hà Nội - Hải Phòng)
     - **Topic 2:** Bản hùng ca bảo vệ Cầu Hàm Rồng & Trận đầu đánh thắng của Không quân tiêm kích (1965 – 1972: Thanh Hóa)
     - **Topic 3:** Tuyến lửa Vĩ tuyến 17 & "Túi nước ngập" Vùng Cán Xoong (1965 – 1968: Nam Quân khu 4)
     - **Topic 4 (Bonus):** Cánh én thầm lặng: Không quân vận tải chiến lược & Đột kích bất đối xứng (1968 – 1975: Đoàn 919)
   - For **EACH topic**, provided:
     - Proposed 5-lesson curriculum structure with explicit Learning Objectives and Format Distribution (Interactive Visual Novel, Video-led documentary, Map tactics, Choice-driven dilemmas, Knowledge Quiz).
     - At least 5 traceable bibliographic sources per topic, prioritizing official publications from Viện Lịch sử Quân sự Việt Nam, Bộ Tổng tham mưu, Quân chủng Phòng không - Không quân, Quân khu 4, Đoàn 919, alongside international/USAF reference sources.
     - Strict 3-layer separation: **Raw facts (Nguồn gốc)**, **Interpretation (Diễn giải lịch sử/sư phạm)**, and **Narrative ideas & game mechanics (Ý tưởng kể chuyện & tình huống lựa chọn)**.
     - Explicit identification and classification of **Contradictions & Disputed Claims** (e.g. B-52 casualty numbers 34 vs 15, MiG-21 vs SAM-2 claims, Ham Rong 47 vs 4 air victory counts, 1967 vs 1972 first B-52 shootdown), with proposed qualified handling for Historical Reviewer.
   - Comprehensive **Comparison Table (Bảng so sánh tổng quát)** evaluating all 4 candidate topics across 6 criteria (source richness, dramatic tension, modularity into lessons, controversy risk, media asset leverage, content team recommendation) for the Product Owner's decision at CONTENT-002.
   - Strict adherence to Phase 3 Historical & Media Governance (`docs/specs/phases/03-historical-media-governance.md`): explicitly designated as **CANDIDATE / DRAFT**, not canonical/approved, awaiting formal sign-off.
2. **Updated `docs/tasks/active/CONTENT-009.md`**:
   - Checked off acceptance criteria.
   - Added checkpoint for 2026-09-26.
   - Updated Handoff section.

---

## 2. Verification Record
- **Deep Verification (Content & Requirements Compliance):**
  - **R1 (Candidate topics):** 4 topics proposed (all with 5 detailed lessons each). Pass.
  - **R2 (Traceable sources & 3-layer separation):** Each topic contains 5 sources with title, publisher/institution, publication year, tier classification, and page/chapter references. Distinct Raw facts, Interpretation, and Narrative ideas. Pass.
  - **R3 (Contradictions & Discrepancies):** Disputed claims clearly marked with `[DISPUTED]`, `[QUALIFIED]`, contrasting Vietnamese official sources and USAF/US Navy records, with recommended handling for Historical Reviewer. Pass.
  - **R4 (Comparison table):** Multi-criteria matrix included with explicit disclaimer that canonical status is not self-assigned. Pass.
  - **R5 (Target file & Language):** Output written to `docs/features/research-content-009.md` entirely in Vietnamese. Pass.
- **Shallow Verification (File integrity & Formatting):**
  - Inspected `docs/features/research-content-009.md` in full (363 lines, 59,917 bytes). Markdown headers, tables, callout blocks, and relative links verified.
  - Inspected `docs/tasks/active/CONTENT-009.md` diff and integrity.
- **Unverified aspects:**
  - Historical truth verification of conflicting statistics cannot be decided unilaterally by the implementer; it requires domain approval from the designated Historical Reviewer during CONTENT-003.
  - Selection of the final MVP chapter belongs to the Product Owner during CONTENT-002.
