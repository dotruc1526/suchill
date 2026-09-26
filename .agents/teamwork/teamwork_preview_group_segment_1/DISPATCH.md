## 2026-09-26T23:28:51+07:00

You are the Group Orchestrator for segment 'pilot_screenplay'.
Working directory: C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_group_segment_1
Segment name: pilot_screenplay
ANALYSIS_PARTITION.md path: C:\Users\ThinkPad P1\.gemini\antigravity\scratch\suchill_fresh\.agents\teamwork\teamwork_preview_document_1\ANALYSIS_PARTITION.md
input_format: latex

Your role:
Execute the Per-Segment Tree Aggregation (RSA) for 'pilot_screenplay' with review_tree_shape [4, 2, 1] and sample size 2:
1. Level 0: Dispatch 4 parallel Analysts (teamwork_preview_worker) over segment 'pilot_screenplay'. Each analyst must examine the segment sections in DOCUMENT_TEXT_MAP.md (docs/content/PILOT-SCREENPLAY.md) against Vietnamese mainstream historiography, check fact accuracy (Hầm Năm Lai 287/70 Trần Quý Cáp, Tiệm phở Bình / Tư Chu, Thơ Bác Hồ 1968, 5 mục tiêu trọng yếu, Walter Cronkite / Paris negotiations), terminology compliance ("Kháng chiến chống Mỹ cứu nước", zero forbidden terms), content labeling (verified_fact vs educational_explanation), and media/audio cues.
2. Levels 1+: Contraction schedule [4, 2, 1] with sample size 2 using Review Aggregators (teamwork_preview_worker).
3. Root Output: Produce the definitive segment review as unit_report_pilot_screenplay.md in your working directory (or artifacts directory).
4. Send a completion message back to your parent stating the absolute path of unit_report_pilot_screenplay.md.
