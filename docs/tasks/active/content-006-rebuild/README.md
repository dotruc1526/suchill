# CONTENT-006 rebuild package draft

> Status: DRAFT / REFERENCE_ONLY
> Source task: [CONTENT-006](../CONTENT-006.md)
> Created: 2026-09-27
> Executor: Truc (Member 2), Codex ho tro

This folder records the recovered sidecar package for the clip "Truoc con bao" from the surviving MP4 and the later recovered local `dist/media/truoc-con-bao/` files:

`D:/suchill-render-work/episode-portrait-no-box-text-v3.mp4`

The MP4 and audio files are not copied into this repo. Their local paths and hashes are recorded in [manifest.json](./manifest.json).

## Included

- [transcript.md](./transcript.md) — transcript reconstructed from the CONTENT-006 record.
- [subtitles.vtt](./subtitles.vtt) — recovered WebVTT from `dist/media/truoc-con-bao/subtitles.vtt`.
- [cues.json](./cues.json) — recovered structured cue list from `dist/media/truoc-con-bao/cues.json`.
- [storyboard.md](./storyboard.md) — recovered storyboard from `dist/media/truoc-con-bao/storyboard.md`.
- [poster.png](./poster.png) — recovered poster from `dist/media/truoc-con-bao/poster.png`.
- [poster.jpg](./poster.jpg) — derived poster frame extracted from the source MP4 at 00:00:01, kept as secondary evidence.
- [fallback.md](./fallback.md) — fallback text, alt text and rebuild notes.
- [manifest.json](./manifest.json) — hashes, provenance and remaining blockers.

## Important limits

This package does not approve publish or integration. The MP4 still contains the wording that CONTENT-006 marked `REVISION_REQUIRED_BEFORE_USE`; audio/voice, music/SFX and source export rights are not cleared for publish. Before use outside `REFERENCE_ONLY`, Truc must replace or re-export the video with approved wording and then rerun the Phase 3/8 media review.

## Listen-through issue log

- 2026-09-27 — Truc reported a subtitle mismatch starting at cue 5 in the draft (`00:13.000 --> 00:17.000`, text: "cuộc kháng chiến chống Pháp đã kéo dài nhiều năm rồi.").
- 2026-09-27 — Resolved for the recovered sidecar package by replacing the draft VTT/cues with the recovered WordBoundary-timed files from `dist/media/truoc-con-bao/`. Cue 5 is now `00:00:11.800 --> 00:00:16.283`.
