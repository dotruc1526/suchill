"""Build the approved typography pilot from nine ElevenLabs cue exports.
Requires Pillow, ffmpeg/ffprobe and a font licensed for rendered output.
Leaves media IN_REVIEW; editorial acceptance/publication is a separate step.
"""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
from mt68_video_art import render
import textwrap

ROOT = Path(__file__).resolve().parents[2]
TITLE = 'Kế hoạch Giao Thừa — elevenlabs.io'


def run(args):
    return subprocess.check_output(args, text=True).strip()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--audio-dir', type=Path, required=True)
    parser.add_argument('--font', type=Path, required=True)
    parser.add_argument('--font-license', required=True)
    parser.add_argument('--generation-date', required=True)
    parser.add_argument('--out', type=Path, default=ROOT / 'docs/content/production/mt68-v1/render')
    args = parser.parse_args()
    for binary in ['ffmpeg', 'ffprobe']:
        if not shutil.which(binary):
            parser.error(f'{binary} is required; no media has been produced.')
    if not args.font.is_file() or not args.font_license.strip():
        parser.error('A readable font and license evidence are required.')
    narration_path = ROOT / 'docs/content/PILOT-NARRATION.json'
    narration = json.loads(narration_path.read_text())
    cues = narration['cues']
    # Preflight all exports before writing media; do not truncate speech to fit.
    recordings = []
    for cue in cues:
        candidates = [args.audio_dir / f"{cue['id']}.{ext}" for ext in ['mp3', 'wav', 'm4a']]
        found = [path for path in candidates if path.is_file()]
        if len(found) != 1:
            parser.error(f"Expected one recording for {cue['id']} (mp3/wav/m4a).")
        duration = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                              '-of', 'default=nw=1:nk=1', str(found[0])]))
        slot = cue['endSeconds'] - cue['startSeconds']
        if duration <= 0 or duration > slot:
            parser.error(f"{cue['id']}: {duration:.2f}s exceeds {slot}s; re-record or review timing.")
        recordings.append((found[0], duration, slot))
    args.out.mkdir(parents=True, exist_ok=True)
    segments, inputs = [], []
    for cue, (audio, duration, slot) in zip(cues, recordings):
        picture = render(cue, args.font)
        image_path = args.out / f"{cue['id']}.png"
        picture.save(image_path)
        segment = args.out / f"{cue['id']}.mp4"
        run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-i', str(image_path),
             '-i', str(audio), '-t', str(slot), '-vf', 'fps=24,format=yuv420p,fade=t=in:st=0:d=0.3',
             '-af', 'apad', '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
             '-c:a', 'aac', '-ar', '48000', '-ac', '1', '-b:a', '128k', '-movflags', '+faststart', str(segment)])
        segments.append(segment)
        inputs.append({'cueId': cue['id'], 'sha256': digest(audio), 'durationSeconds': duration})
    # Controlled cue IDs supply relative filenames; no shell interpolation.
    concat = args.out / 'segments.txt'
    concat.write_text(''.join(f"file '{path.name}'\n" for path in segments))
    master = args.out / 'pilot-master.mp4'
    run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '1',
         '-i', str(concat), '-c', 'copy', '-metadata', f'title={TITLE}',
         '-movflags', '+faststart', str(master)])
    final = args.out / 'pilot-mobile.mp4'
    run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(master), '-vf', 'scale=720:1280',
         '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-c:a', 'copy',
         '-metadata', f'title={TITLE}', '-movflags', '+faststart', str(final)])
    render(cues[0], args.font, poster=True).save(args.out / 'poster.png')
    def stamp(seconds):
        ms = round(seconds * 1000)
        return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02}.{ms % 1000:03}'
    vtt = ['WEBVTT', '']
    for cue, (_, duration, _) in zip(cues, recordings):
        # Keep all words verbatim; captions last through the actual recording.
        vtt += [cue['id'], f"{stamp(cue['startSeconds'])} --> {stamp(cue['startSeconds'] + duration)}",
                textwrap.fill(cue['text'], width=44), '']
    (args.out / 'captions.vi.vtt').write_text('\n'.join(vtt))
    transcript = args.out / 'transcript.vi.txt'
    transcript.write_text(TITLE + '\n\n' + '\n\n'.join(c['text'] for c in cues))
    manifest = {
        'id': 'media.mt68.pilot.v1', 'title': TITLE, 'reviewStatus': 'in_review',
        'scope': 'academic_non_commercial', 'provider': 'ElevenLabs', 'plan': 'Free',
        'voiceId': '5g2DMFQF8xR0KmnuNr4U', 'model': 'eleven_v4', 'language': 'Vietnamese',
        'generationDate': args.generation_date, 'audioIdentityVerified': False,
        'audioHumanAcceptance': 'User listened and accepted nine cues in chat, 2026-10-03',
        'visuals': 'Original typography and educational diagrams; no archival imagery/music/SFX',
        'narrationSha256': digest(narration_path), 'audioInputs': inputs,
        'fontLicenseEvidence': args.font_license, 'fontSha256': digest(args.font),
        'sourceIds': ['SRC-MT68-01', 'SRC-MT68-03', 'SRC-MT68-04', 'SRC-MT68-05', 'SRC-MT68-07'],
        'files': {name: digest(args.out / name) for name in
                  ['pilot-mobile.mp4', 'pilot-master.mp4', 'poster.png', 'captions.vi.vtt', 'transcript.vi.txt']},
        'pending': ['final_caption_sync_review', 'device_playback_review', 'voice_id_account_verification',
                    'final_editorial_acceptance', 'service_and_lesson_publication'],
    }
    (args.out / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'Produced IN_REVIEW package at {args.out}; final acceptance/publication still required.')


if __name__ == '__main__':
    main()
