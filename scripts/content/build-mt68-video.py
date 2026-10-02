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
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
TITLE = 'Kế hoạch Giao Thừa — elevenlabs.io'


def run(args):
    return subprocess.check_output(args, text=True).strip()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def wrap(text, draw, font, width):
    lines, current = [], ''
    for word in text.split():
        candidate = f'{current} {word}'.strip()
        if current and draw.textlength(candidate, font=font) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    return lines + [current]


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
    font = ImageFont.truetype(str(args.font), 40)
    small = ImageFont.truetype(str(args.font), 23)
    segments, inputs = [], []
    for cue, (audio, duration, slot) in zip(cues, recordings):
        picture = Image.new('RGB', (720, 1280), '#F5E6D0')
        draw = ImageDraw.Draw(picture)
        draw.rounded_rectangle((36, 200, 684, 1080), radius=28, fill='#FBF4E8')
        draw.text((52, 75), 'SỬ CHILL · MẬU THÂN 1968', font=small, fill='#8B1A1A')
        lines = wrap(cue['text'], draw, font, 584)
        if len(lines) * 64 > 780:
            parser.error(f"{cue['id']}: typography overflows; review layout.")
        y = 620 - len(lines) * 32
        for line in lines:
            draw.text((68, y), line, font=font, fill='#3D1A00')
            y += 64
        draw.text((52, 1130), 'Đồ án học tập · Phi thương mại', font=small, fill='#3D1A00')
        draw.text((52, 1175), 'Giọng đọc: ElevenLabs · elevenlabs.io', font=small, fill='#3D1A00')
        image_path = args.out / f"{cue['id']}.png"
        picture.save(image_path)
        segment = args.out / f"{cue['id']}.mp4"
        run(['ffmpeg', '-y', '-loglevel', 'error', '-loop', '1', '-i', str(image_path),
             '-i', str(audio), '-t', str(slot), '-vf', 'fps=24,format=yuv420p',
             '-af', 'apad', '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
             '-c:a', 'aac', '-ar', '48000', '-ac', '1', '-movflags', '+faststart', str(segment)])
        segments.append(segment)
        inputs.append({'cueId': cue['id'], 'sha256': digest(audio), 'durationSeconds': duration})
    # Controlled cue IDs supply relative filenames; no shell interpolation.
    concat = args.out / 'segments.txt'
    concat.write_text(''.join(f"file '{path.name}'\n" for path in segments))
    final = args.out / 'pilot-mobile.mp4'
    run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '1',
         '-i', str(concat), '-c', 'copy', '-metadata', f'title={TITLE}',
         '-movflags', '+faststart', str(final)])
    shutil.copyfile(args.out / f"{cues[0]['id']}.png", args.out / 'poster.png')
    shutil.copyfile(ROOT / 'docs/content/PILOT-CAPTIONS.vtt', args.out / 'captions.vi.vtt')
    transcript = args.out / 'transcript.vi.txt'
    transcript.write_text(TITLE + '\n\n' + '\n\n'.join(c['text'] for c in cues))
    manifest = {
        'id': 'media.mt68.pilot.v1', 'title': TITLE, 'reviewStatus': 'in_review',
        'scope': 'academic_non_commercial', 'provider': 'ElevenLabs', 'plan': 'Free',
        'voiceId': '5g2DMFQF8xR0KmnuNr4U', 'model': 'eleven_v4', 'language': 'Vietnamese',
        'generationDate': args.generation_date, 'audioIdentityVerified': False,
        'narrationSha256': digest(narration_path), 'audioInputs': inputs,
        'fontLicenseEvidence': args.font_license, 'fontSha256': digest(args.font),
        'sourceIds': ['SRC-MT68-01', 'SRC-MT68-03', 'SRC-MT68-04', 'SRC-MT68-05', 'SRC-MT68-07'],
        'files': {name: digest(args.out / name) for name in
                  ['pilot-mobile.mp4', 'poster.png', 'captions.vi.vtt', 'transcript.vi.txt']},
        'pending': ['listen_and_caption_sync', 'mobile_playback', 'voice_and_model_evidence',
                    'final_editorial_acceptance', 'service_and_lesson_publication'],
    }
    (args.out / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'Produced IN_REVIEW package at {args.out}; final acceptance/publication still required.')


if __name__ == '__main__':
    main()
