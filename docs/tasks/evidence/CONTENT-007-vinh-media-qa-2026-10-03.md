# CONTENT-007 — Vinh video v2 media QA, 2026-10-03

## Scope and verdict

PR112 reviewed head `eb60b3c`, candidate `media.mt68.pilot.collage.v2`. Owner Trúc; Vinh technical QA, Codex executor; consumer reviewer Dương. Parent remains REVIEW, not_published/storageUrl=null.

**TECHNICAL CHECKS PASS; final listening and physical-device QA remain pending.** This is independent package validation and Chrome phone-viewport emulation, not a human listening verdict, actual handset test or lesson integration acceptance.

## Independent evidence

- 6/6 SHA-256 matches Trúc-approved master/mobile/poster/VTT/transcript/timeline. No media bytes or accepted caption/timeline changed.
- Both MP4s fully decoded with ffmpeg; faststart moov precedes mdat. H.264/yuv420p/30fps; master 1080×1920, mobile720×1280; AAC mono44.1kHz. Duration63.066667s, assembled PCM63.059592s (frame rounding).
- 33 WebVTT cues have positive duration, ordered non-overlapping times within media duration; exact normalized text equals nine narration cue texts and transcript. This does not establish word-level speech alignment.
- WAV44.1kHz/2,780,928 samples; all nine timeline segment PCM hashes match, confirming sample continuity without edits.
- Chrome375×812 and430×932: mobile decoded720×1280, inline, initially paused/no autoplay, no horizontal overflow. All33 caption midpoints seeked with active text matching expected cue. Touch play advances from36s, no video error; seek near end then play reaches ended. These are native-video package harness checks, not the application player.
- Viewed 375/430 screenshots at36s: burned-in subtitle and illustration labels visible without clipping. Harness hid sidecar track for screenshot to avoid showing duplicate captions; sidecar activation was checked separately.

[375px screenshot](./content007-vinh-media-qa/375px.png) · [430px screenshot](./content007-vinh-media-qa/430px.png) · [browser result](./content007-vinh-media-qa/browser-results.json) · [media probe/hashes](./content007-vinh-media-qa/media-results.json)

## Reproduction

- `node scripts/member5/qa-content007-media.mjs` (Chrome/Chromium available; optional CHROME_PATH). Loads actual local MP4/VTT/poster/transcript via a range-capable temporary HTTP server. Screenshots/results written to OS temporary directory; no external requests or publication.
- `ffprobe -v error -show_streams -show_format -of json <master-or-mobile.mp4>`; `ffmpeg -v error -i <master-or-mobile.mp4> -f null -`.
- Approved hashes bound in manifest humanAcceptances; caption/PCM comparisons measured against timeline and narration.wav. App suite not run: no runtime/env/migration changes.

## Remaining handoff

1. Human reviewer listens to all33 cues against speech and confirms pronunciation/sync. Interpolated timing cannot receive final listening PASS from structural tests.
2. Actual Android/iOS phone playback and platform caption behavior remain untested; no physical device connected in this QA environment.
3. Thọ SCRIPT APPROVED được ghi tại bdc6dc9, đúng master/mobile hashes. Dương consumer/publication remains pending. Integration must keep captions/text transcript available, native autoplay disabled and accessible controls; avoid displaying burned-in and sidecar captions twice. Resume/fallback/service behavior must be tested in the real consumer separately.

Changed files: this evidence and snapshots, package QA harness, QA section in CONTENT-007 and technicalQa metadata in manifest/handoff. No media/content wording changes. No env/migration/dependency impact; approval hash of accepted assets stays unchanged. Do not mark CONTENT-007 DONE or published from this technical result.

## Integration with concurrent script review

Rebased onto bdc6dc9 (Thọ SCRIPT APPROVED). Kept both script and QA records; changes upstream are documentation-only. All six approved media hashes still match; no rerender or word/timing edit. Earlier pending Thọ references are snapshots superseded by this record.
