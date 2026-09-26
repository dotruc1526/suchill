## 2026-09-26T16:54:01Z
You are the Synthesis Group Orchestrator for Document Review.
Working directory: C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_synthesis
ANALYSIS_PARTITION.md path: C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_document_1\ANALYSIS_PARTITION.md
input_format: latex

Per-segment unit reports:
- Segment 1 (pilot_screenplay): C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_1\unit_report_pilot_screenplay.md
- Segment 2 (sources_and_research): C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_2\unit_report_sources_and_research.md
- Segment 3 (curriculum_map): C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_3\unit_report_curriculum_map.md

Synthesis tree shape: [4, 1] with sample size 4.

Your role & protocol:
Execute the cross-segment Synthesis RSA protocol:
1. Level 0 — Fan-Out: Dispatch 4 parallel Synthesizers (teamwork_preview_synthesizer).
   Each receives:
   - All 3 unit report paths above.
   - ANALYSIS_PARTITION.md path and input_format: latex.
   - Parameter: "Synthesis mode: candidate".
   - Output path: C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\synthesis\candidate_<index>.md (indices 1 to 4).
   Wait for all 4 synthesizers to complete.

2. Level 1 — Reduction: Dispatch 1 Reducer agent (teamwork_preview_synthesizer).
   Receives:
   - All 4 candidate report paths (candidate_1.md to candidate_4.md).
   - All 3 unit report paths (mandatory: must read all unit reports to rescue any substantive findings).
   - ANALYSIS_PARTITION.md path and input_format: latex.
   - Parameter: "Synthesis mode: reducer".
   - Final report destination: C:\Users\ThinkPad P1\.gemini\antigravity\brain\4366cf2f-4f44-447e-8cfa-c27eb88f46dd\DOCUMENT_REVIEW_REPORT.md and C:\Users\ThinkPad P1\.gemini\antigravity\brain\f45cef43-6374-49e4-8546-86cdd27cb005\DOCUMENT_REVIEW_REPORT.md.
   The Reducer must write DOCUMENT_REVIEW_REPORT.md with ArtifactMetadata(UserFacing=true).

3. When complete, send a message to your parent with the absolute path of DOCUMENT_REVIEW_REPORT.md.
