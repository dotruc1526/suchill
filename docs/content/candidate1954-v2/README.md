# Trước cơn bão — corrected candidate v2

Task: [M6-M7-COMPLETE-CANDIDATE-20261004](../../tasks/active/M6-M7-COMPLETE-CANDIDATE-20261004.md). New immutable candidate; original `preview1954-v1` remains untouched. Not automatically published or connected to account rewards.

## Actual correction

- Retains original video/audio content through 83.45 seconds, re-encoded into this separate file. Original cues 1–25 remain exact in new captions/transcript.
- Replaces the entire final scene from cue 26 onset: the old picture, burned subtitles **and audio** for cues 26–28 are absent from this ending. This is not a subtitle-only correction or an overlay on the incorrect narration.
- New wording: “Nhưng tại sao một thung lũng ở Tây Bắc lại trở thành điểm quyết chiến chiến lược của hai bên?” This follows the narrower wording already recorded by CONTENT-006. Closing cue remains “Đó là chuyện của tập sau. Đi thôi!”
- New spoken ending generated on 2026-10-04 with `edge-tts 7.2.8`, `vi-VN-NamMinhNeural`. Three exact text/audio files, hashes and measured durations are recorded in the manifest. No paid account/API key/ElevenLabs credits used.
- New ending pictures are original programmatic geometric illustrations and typography from `build_candidate.py`; no original picture editing, external photo, new creative image-generation call, added music or SFX. Arial font file hash is recorded. The visible label identifies the illustration and candidate state.
- Original audio/provider identity is not retroactively authenticated. Latest PO accepts responsibility for supplied materials and waived additional media rights paperwork; that is the use decision, not a new licensing finding.

## File and timing evidence

Candidate MP4: 15,724,204 bytes, SHA256 `82e6cf658d3c47575ac107a8f56a096616ba847ae1acc3a6628a9b85fde95716`. Actual ffprobe: 1080×1920, 24fps, H.264/AAC, 94.979667 seconds.

New cue timing:

| Cue | Start | Caption end |
|---|---|---|
| 26 | 83.458 s | 86.458 s |
| 27 | 86.833 s | 90.385 s |
| 28 | 90.750 s | 94.590 s |

Small pauses between separately recorded cues are intentional; captions are mechanically matched to measured recording durations, pending a final listen-through.

Validation: package **12/12 checks PASS, zero errors**; FFmpeg full decode with `-xerror` **exit 0**. Poster and new cue 27 frame viewed: readable Vietnamese, no overflow or old “tâm điểm của cả cuộc chiến” wording. No human audio/physical-device/final historical acceptance is inferred from these checks.

## Reproduction and independent checks

`build_candidate.py` accepts `--ffmpeg`, `--ffprobe`, `--font`; requires Pillow and edge-tts. Set temporary dependency directory as `PYTHONPATH` if needed. It refuses a changed original MP4 hash and refuses to overwrite an existing completed manifest. For further edits, create v3. Original footage is the only input video. The recipe records every new audio export; regenerating TTS may produce different bytes, so replay the retained files for exact version review.

`node scripts/release/validate-media-package.mjs docs/content/candidate1954-v2 docs/content/candidate1954-v2/locked-narration.json` with a valid process-local `FFPROBE_PATH` verifies media metadata/hashes and exact caption/transcript words.

`node docs/content/candidate1954-v2/verify_candidate.mjs` checks unchanged original files, retained initial cues, corrected exact ending, new audio/art hashes, and absence of old wording from new narration/captions/transcript.

Regenerable intermediate segment MP4s are ignored. Final candidate MP4, poster, new audio/art source, locked narration and sidecars are retained. No environment or database change required. Known limits: abrupt art-style transition at the new ending; narrator timbre/volume continuity and final caption listening need concrete review; attractive scene artwork, mobile performance and final historical acceptance remain separate from this exact wording correction.
