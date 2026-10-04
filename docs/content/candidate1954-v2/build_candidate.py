"""Create a NEW 1954 wording-correction candidate; never overwrite v1.
Requires Pillow, edge-tts and explicit portable FFmpeg/ffprobe/font arguments.
No publication, account access, API key or paid speech credits.
"""
import argparse
import asyncio
import hashlib
import json
import math
from pathlib import Path
import shutil
import subprocess
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[2]
SOURCE = ROOT / 'docs/content/preview1954-v1'
EXPECTED_SOURCE = '2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec'
TEXTS = ['Nhưng tại sao một thung lũng ở Tây Bắc',
         'lại trở thành điểm quyết chiến chiến lược của hai bên?',
         'Đó là chuyện của tập sau. Đi thôi!']
TITLE = 'Tập 1 — Trước cơn bão · bản sửa lời dẫn v2'
BG, INK, RED, GOLD = '#F5E6D0', '#3D1A00', '#8B1A1A', '#C8A882'


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run(args):
    return subprocess.check_output([str(item) for item in args], text=True)


def probe(tool, path):
    return json.loads(run([tool, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', path]))


def stamp(seconds):
    ms = round(seconds * 1000)
    return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02}.{ms % 1000:03}'


def write_json(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def draw_scene(font_path, text, number):
    image = Image.new('RGB', (1080, 1920), BG)
    draw = ImageDraw.Draw(image)
    font = lambda size: ImageFont.truetype(str(font_path), size)
    draw.text((72, 72), 'SỬ CHILL · 1954', font=font(42), fill=RED)
    draw.text((72, 140), 'ĐIỆN BIÊN PHỦ · CÂU HỎI CHO TẬP SAU', font=font(32), fill=INK)
    draw.line((72, 220, 1008, 220), fill=RED, width=4)
    # Original geometric illustration: no photo or original MP4 frame is edited.
    draw.ellipse((755, 325, 955, 525), fill='#E7C989')
    for points, color in [([(0, 880), (190, 470), (380, 800), (640, 380), (880, 830), (1080, 560), (1080, 1170), (0, 1170)], '#B5BAA0'),
                          ([(0, 1070), (220, 760), (470, 1020), (750, 660), (1080, 1040), (1080, 1270), (0, 1270)], '#87947A'),
                          ([(0, 1190), (190, 960), (510, 1170), (870, 970), (1080, 1170), (1080, 1360), (0, 1360)], '#63745A')]:
        draw.polygon(points, fill=color)
    draw.rounded_rectangle((68, 540, 1012, 1075), 32, fill='#FBF4E8', outline=GOLD, width=3)
    draw.text((112, 595), 'VÌ SAO Ở ĐÂY?' if number < 28 else 'TIẾP TỤC KHÁM PHÁ', font=font(50), fill=RED)
    body = font(58)
    lines, line = [], ''
    for word in text.split():
        attempt = (line + ' ' + word).strip()
        if line and draw.textlength(attempt, font=body) > 825:
            lines.append(line)
            line = word
        else:
            line = attempt
    lines.append(line)
    if len(lines) > 4:
        raise ValueError('Ending text exceeds readable scene budget')
    for index, line in enumerate(lines):
        draw.text((112, 708 + index * 82), line, font=body, fill=INK)
    draw.text((72, 1420), 'MINH HỌA SƠ ĐỒ · KHÔNG PHẢI TƯ LIỆU', font=font(30), fill=INK)
    draw.text((72, 1690), 'BẢN CHỈNH LỜI DẪN · CHỜ REVIEW CUỐI', font=font(32), fill=RED)
    draw.text((72, 1770), 'Giọng Nam Minh · đoạn cuối được thu mới bằng TTS', font=font(27), fill=INK)
    draw.line((72, 1850, 1008, 1850), fill=RED, width=8)
    return image


async def speech(text, path):
    import edge_tts
    await asyncio.wait_for(edge_tts.Communicate(text, 'vi-VN-NamMinhNeural').save(str(path)), timeout=60)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ffmpeg', type=Path, required=True)
    parser.add_argument('--ffprobe', type=Path, required=True)
    parser.add_argument('--font', type=Path, required=True)
    args = parser.parse_args()
    original = SOURCE / 'pilot-mobile.mp4'
    if digest(original) != EXPECTED_SOURCE:
        raise ValueError('Source identity mismatch; refusing render')
    if (HERE / 'manifest.json').exists():
        raise ValueError('Version already exists; create another version rather than overwrite')
    work = HERE / 'source'
    work.mkdir(exist_ok=True)
    ff = [args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y']
    encoding = ['-c:v', 'libx264', '-threads', '2', '-preset', 'veryfast', '-crf', '23', '-pix_fmt', 'yuv420p',
                '-r', '24', '-c:a', 'aac', '-ar', '48000', '-ac', '1', '-b:a', '128k', '-movflags', '+faststart']
    prefix = work / 'prefix.mp4'
    # Replace from cue26 onset; removed audio/image contain the complete old question.
    run(ff + ['-i', original, '-t', '83.45'] + encoding + [prefix])
    cursor = float(probe(args.ffprobe, prefix)['format']['duration'])
    data = json.loads((SOURCE / 'locked-narration.json').read_text(encoding='utf-8'))
    cues = [dict(cue) for cue in data['cues'][:25]]
    segments, audio_inputs = [prefix], []
    for number, text in enumerate(TEXTS, start=26):
        audio = work / f'cue{number}.mp3'
        asyncio.run(speech(text, audio))
        audio_duration = float(probe(args.ffprobe, audio)['format']['duration'])
        slot = math.ceil((audio_duration + .35) * 24) / 24
        picture = work / f'cue{number}.png'
        draw_scene(args.font, text, number).save(picture)
        segment = work / f'cue{number}.mp4'
        run(ff + ['-loop', '1', '-i', picture, '-i', audio, '-t', slot, '-af', 'apad'] + encoding + [segment])
        duration = float(probe(args.ffprobe, segment)['format']['duration'])
        cues.append({'id': f'caption.c006.candidate.v2.{number}', 'start': stamp(cursor),
                     'end': stamp(cursor + min(audio_duration, duration)), 'text': text})
        audio_inputs.append({'cue': number, 'text': text, 'file': f'source/{audio.name}',
                             'sha256': digest(audio), 'durationSeconds': audio_duration})
        cursor += duration
        segments.append(segment)
    concat = work / 'segments.txt'
    concat.write_text(''.join(f"file '{segment.name}'\n" for segment in segments), encoding='utf-8')
    final = HERE / 'pilot-mobile.mp4'
    run(ff + ['-f', 'concat', '-safe', '1', '-i', concat, '-c', 'copy', '-movflags', '+faststart', final])
    shutil.copyfile(work / 'cue26.png', HERE / 'poster.png')
    write_json(HERE / 'locked-narration.json', {'id': 'narration.c006.candidate.v2', 'reviewStatus': 'in_review', 'cues': cues})
    vtt = ['WEBVTT', '']
    for cue in cues:
        vtt += [cue['id'], f"{cue['start']} --> {cue['end']}", cue['text'], '']
    (HERE / 'captions.vi.vtt').write_text('\n'.join(vtt), encoding='utf-8')
    (HERE / 'transcript.vi.txt').write_text(TITLE + '\n\n' + '\n\n'.join(cue['text'] for cue in cues) + '\n', encoding='utf-8')
    measured = probe(args.ffprobe, final)
    write_json(HERE / 'manifest.json', {'id': 'media.c006.candidate1954.v2', 'title': TITLE,
        'reviewStatus': 'in_review', 'scope': 'academic_non_commercial', 'publicationScope': 'candidate_only',
        'provider': 'Original supplied narration + Microsoft Neural TTS via edge-tts for new ending',
        'voice': 'vi-VN-NamMinhNeural', 'audioIdentityVerified': False, 'sourceIds': ['SRC-DBP54-01', 'SRC-DBP54-02', 'SRC-DBP54-03'],
        'sourceVideoSha256': EXPECTED_SOURCE, 'originalPreserved': True, 'replacementStartSeconds': 83.45,
        'correction': 'Final scene, spoken cue26–28 and baked captions replaced; strategic wording from CONTENT-006.',
        'video': {'width': 1080, 'height': 1920, 'fps': 24, 'durationSeconds': float(measured['format']['duration'])},
        'narrationSha256': digest(HERE / 'locked-narration.json'), 'newAudioInputs': audio_inputs,
        'font': {'fileName': args.font.name, 'sha256': digest(args.font)},
        'timing': {'captionsVerified': False, 'evidence': 'Mechanical cue timing measured from new audio; human listen-through pending'},
        'mediaUseDecision': 'PO supplied materials and assumes media responsibility; no rights paperwork gate under latest exception.',
        'pending': ['final historical/learning acceptance', 'new ending listening/caption sync and visual acceptance', 'real device test'],
        'files': {name: digest(HERE / name) for name in ['pilot-mobile.mp4', 'poster.png', 'captions.vi.vtt', 'transcript.vi.txt']},
        'createdAt': '2026-10-04', 'publicationPerformed': False})
    print('Produced NEW candidate; unchanged original hash:', digest(original))


if __name__ == '__main__':
    main()
