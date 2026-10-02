"""Render native portrait collage animation over the fixed, accepted audio."""
import argparse
import hashlib
import json
import math
from pathlib import Path
import subprocess
import time
from mt68_collage_timeline import ROOT, PACKAGE, prepare, sha
from mt68_collage_frames import Frames, W, H


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--audio-dir', type=Path, required=True)
    p.add_argument('--font', type=Path, required=True)
    args = p.parse_args()
    timeline = prepare(args.audio_dir)
    out = PACKAGE / 'render'
    renderer = Frames(PACKAGE, timeline, args.font)
    fps, duration = 30, timeline['duration']
    count = math.ceil(duration * fps)
    master = out / 'pilot-collage-master.mp4'
    command = ['ffmpeg', '-y', '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
               '-s', f'{W}x{H}', '-r', str(fps), '-i', '-', '-i', str(out / 'narration.wav'),
               '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-pix_fmt', 'yuv420p',
               '-c:a', 'aac', '-b:a', '128k', '-t', str(duration),
               '-metadata', 'title=Kế hoạch Giao Thừa — SỬu dẫn chuyện — elevenlabs.io',
               '-movflags', '+faststart', str(master)]
    proc = subprocess.Popen(command, stdin=subprocess.PIPE)
    began = time.monotonic()
    try:
        for i in range(count):
            image = renderer.frame(i / fps)
            proc.stdin.write(image.tobytes())
            if i in [30, 9 * fps, 22 * fps, 36 * fps, 44 * fps, 52 * fps, 60 * fps]:
                image.save(out / f'frame-{int(i / fps):02}.jpg')
            if i % (fps * 5) == 0:
                print(f'Render {i / fps:.0f}/{duration:.1f}s; elapsed {time.monotonic() - began:.0f}s', flush=True)
        proc.stdin.close()
        if proc.wait() != 0:
            raise RuntimeError('FFmpeg failed; output is not ready.')
    except BaseException:
        proc.kill()
        proc.wait()
        raise
    mobile = out / 'pilot-collage-mobile.mp4'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(master), '-vf', 'scale=720:1280',
                    '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-c:a', 'copy',
                    '-movflags', '+faststart', str(mobile)], check=True)
    renderer.frame(1).save(out / 'poster.png')
    checks = {}
    for path in [master, mobile]:
        data = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams',
                                                   '-show_format', '-of', 'json', str(path)]))
        subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'null', '-'], check=True)
        checks[path.name] = {'bytes': path.stat().st_size, 'duration': data['format']['duration'],
                             'streams': [{k: s[k] for k in ['codec_name', 'width', 'height', 'duration',
                                                           'r_frame_rate'] if k in s} for s in data['streams']],
                             'decode': 'PASS'}
    (out / 'media-checks.json').write_text(json.dumps(checks, indent=2) + '\n')
    manifest = {
        'id': 'media.mt68.pilot.collage.v2', 'reviewStatus': 'in_review',
        'title': 'Kế hoạch Giao Thừa — SỬu dẫn chuyện — elevenlabs.io',
        'scope': 'academic_non_commercial', 'date': '2026-10-03',
        'durationSeconds': duration, 'audio': {'provider': 'ElevenLabs', 'plan': 'Free',
        'voiceId': '5g2DMFQF8xR0KmnuNr4U', 'model': 'eleven_v4', 'language': 'Vietnamese',
        'audioIdentityVerified': False,
        'identityEvidence': 'UI observed Hoa / Eleven v4 / Vietnamese; voice ID supplied by user, not copied from account.',
        'humanAcceptance': 'User accepted all nine original MP3s in chat, 2026-10-03',
        'policy': timeline['audioPolicy'], 'pcmSha256': sha(out / 'narration.wav'),
        'inputs': [{k: c[k] for k in ['id', 'inputSha256', 'decodedPcmSha256', 'sampleStart', 'sampleCount']}
                   for c in timeline['cues']]},
        'visuals': {'style': 'cinematic historical collage / 2D paper cut-out / vintage Vietnamese scrapbook',
                    'mascotReference': 'docs/engineering/m3-ux/assets/suu.png',
                    'fictionalLabel': 'MINH HỌA HƯ CẤU',
                    'assets': {x.name: sha(x) for x in (PACKAGE / 'assets').glob('*cutout.png')},
                    'mascotAssets': {x.name: sha(x) for x in (PACKAGE / 'assets').glob('suu-*.png')},
                    'generationTool': 'built-in imagegen',
                    'architecturalIcons': 'Symbolic diagrams, not reconstructions or maps',
                    'motion': '30fps push-in, pan, foreground parallax, object reveals and mascot reactions'},
        'fontSha256': sha(args.font), 'fontLicense': 'Google Noto, SIL OFL 1.1; bundled LibreOffice LICENSE:1996–2004',
        'narrationSha256': sha(ROOT / 'docs/content/PILOT-NARRATION.json'),
        'registrySha256': sha(ROOT / 'docs/content/HISTORICAL-SOURCES.md'),
        'sourceIds': ['SRC-MT68-01', 'SRC-MT68-03', 'SRC-MT68-04', 'SRC-MT68-05', 'SRC-MT68-07'],
        'sourceScope': 'p03a/p03b supported by source 07 for target names only; source 02 remains candidate',
        'files': {x.name: sha(x) for x in [master, mobile, out / 'poster.png', out / 'captions.vi.vtt',
                                           out / 'transcript.vi.txt', out / 'timeline.json']},
        'pending': ['final_listening_caption_review', 'historical_illustration_review',
                    'device_playback', 'final_editorial_acceptance', 'service_lesson_publication'],
    }
    (out / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'IN_REVIEW package ready: {out}', flush=True)


if __name__ == '__main__':
    main()
