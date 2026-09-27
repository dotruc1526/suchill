# CONTENT-006 rebuild package draft

> Status: DRAFT / REFERENCE_ONLY
> Source task: [CONTENT-006](../CONTENT-006.md)
> Created: 2026-09-27
> Executor: Truc (Member 2), Codex ho tro

This folder rebuilds the missing sidecar package for the clip "Truoc con bao" from the surviving MP4:

`D:/suchill-render-work/episode-portrait-no-box-text-v3.mp4`

The MP4 itself is not copied into this repo. The source video hash is recorded in [manifest.json](./manifest.json).

## Included

- [transcript.md](./transcript.md) — transcript reconstructed from the CONTENT-006 record.
- [subtitles.vtt](./subtitles.vtt) — draft WebVTT timing rebuilt from the old cue ranges.
- [cues.json](./cues.json) — structured cue list matching the draft VTT.
- [poster.jpg](./poster.jpg) — poster frame extracted from the source MP4 at 00:00:01.
- [fallback.md](./fallback.md) — fallback text, alt text and rebuild notes.
- [manifest.json](./manifest.json) — hashes, provenance and remaining blockers.

## Important limits

This package does not approve publish or integration. The MP4 still contains the wording that CONTENT-006 marked `REVISION_REQUIRED_BEFORE_USE`; audio/voice, music/SFX and source export rights are not cleared for publish. Before use outside `REFERENCE_ONLY`, Truc must replace or re-export the video with approved wording and then rerun the Phase 3/8 media review.

## Listen-through issue log

- 2026-09-27 — Truc reported a subtitle mismatch starting at cue 5 (`00:13.000 --> 00:17.000`, text: "cuộc kháng chiến chống Pháp đã kéo dài nhiều năm rồi."). The VTT/cue timing remains a draft and needs revision before any use outside `REFERENCE_ONLY`.
