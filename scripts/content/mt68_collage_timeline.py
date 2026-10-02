"""Decode the fixed audio, concatenate samples, and derive pause-aware captions."""
import hashlib
import json
from pathlib import Path
import subprocess
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[2]
PACKAGE = ROOT / 'docs/content/production/mt68-v2'
CHUNKS = [
    ['Cuối tháng một năm 1968,', 'các đợt tiến công diễn ra', 'tại nhiều đô thị miền Nam.'],
    ['Trong bài này, chúng ta tìm hiểu', 'sự chuẩn bị và đọc tư liệu', 'về các mục tiêu tại Sài Gòn.'],
    ['Cơ sở gắn với Trần Văn Lai', 'cất giấu vũ khí phục vụ', 'trận đánh Dinh Độc Lập.'],
    ['Đội 5 nhận vũ khí trước khi xuất kích.', 'Khi xem ảnh di tích ngày nay,',
     'cần phân biệt hiện trạng', 'với hình ảnh năm 1968.'],
    ['Nguồn tư liệu nhắc đến', 'Đại sứ quán Mỹ, Dinh Độc Lập', 'và Đài Phát thanh Sài Gòn.'],
    ['Hai mục tiêu khác là', 'Bộ Tổng Tham mưu', 'và Bộ Tư lệnh Hải quân.',
     'Danh sách mục tiêu không cho biết', 'toàn bộ kết quả từng trận.'],
    ['Tại Đại sứ quán,', 'cần phân biệt khuôn viên', 'với tòa nhà chính.',
     'Không gọi cuộc tiến công là', 'chiếm toàn bộ tòa nhà.'],
    ['Trong trận đánh Dinh Độc Lập,', 'bộc phá mở cổng không nổ.',
     'Sự chuẩn bị và kết quả thực tế', 'cần được kể riêng.'],
    ['Sang Bài hai, hãy đối chiếu nguồn,', 'khám phá năm mục tiêu',
     'và phân biệt tiến công với chiếm giữ.'],
]


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def stamp(t):
    ms = round(t * 1000)
    return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02}.{ms % 1000:03}'


def prepare(audio_dir):
    out = PACKAGE / 'render'
    out.mkdir(parents=True, exist_ok=True)
    narration = json.loads((ROOT / 'docs/content/PILOT-NARRATION.json').read_text())
    cues, captions, samples = [], [], []
    offset, rate = 0, 44100
    for cue, chunks in zip(narration['cues'], CHUNKS):
        assert ' '.join(chunks) == cue['text'], cue['id']
        path = audio_dir / f"{cue['id']}.mp3"
        raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(path),
                                       '-f', 's16le', '-c:a', 'pcm_s16le', '-ar', str(rate), '-ac', '1', '-'])
        data = np.frombuffer(raw, dtype='<i2')
        samples.append(raw)
        duration = len(data) / rate
        step = int(rate * .025)
        rms = np.array([np.sqrt(np.mean(data[i:i + step].astype(float) ** 2))
                        for i in range(0, len(data), step)])
        active = np.flatnonzero(rms > max(120, rms.max() * .025))
        first, last = max(0, active[0] * .025 - .05), min(duration, (active[-1] + 1) * .025 + .08)
        weights = np.array([len(c.split()) for c in chunks], dtype=float)
        ideals = first + np.cumsum(weights / weights.sum())[:-1] * (last - first)
        boundaries = [first]
        for ideal in ideals:
            lo, hi = max(boundaries[-1] + .4, ideal - .22), min(last - .35, ideal + .22)
            indexes = np.arange(max(0, int(lo / .025)), min(len(rms), int(hi / .025) + 1))
            # Use a nearby natural pause when present; never change the audio.
            quiet = indexes[rms[indexes] < max(130, rms.max() * .045)]
            boundary = quiet[np.argmin(abs(quiet * .025 - ideal))] * .025 if len(quiet) else ideal
            boundaries.append(float(boundary))
        boundaries.append(last)
        start = offset / rate
        for text, a, b in zip(chunks, boundaries, boundaries[1:]):
            captions.append({'start': start + a, 'end': start + b, 'text': text, 'cueId': cue['id']})
        cues.append({'id': cue['id'], 'start': start, 'end': start + duration,
                     'sampleStart': offset, 'sampleCount': len(data), 'inputSha256': sha(path),
                     'decodedPcmSha256': hashlib.sha256(raw).hexdigest(), 'text': cue['text']})
        offset += len(data)
    with wave.open(str(out / 'narration.wav'), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(b''.join(samples))
    timeline = {'duration': offset / rate, 'sampleRate': rate, 'sampleCount': offset,
                'audioPolicy': 'Concatenate decoded samples in order; no padding, atempo, normalization or edits.',
                'captionAlignment': 'Pause-aware syllable interpolation; final listening review pending.',
                'cues': cues, 'captions': captions}
    (out / 'timeline.json').write_text(json.dumps(timeline, ensure_ascii=False, indent=2) + '\n')
    vtt = ['WEBVTT', '']
    for i, c in enumerate(captions):
        vtt += [str(i + 1), f"{stamp(c['start'])} --> {stamp(c['end'])}", c['text'], '']
    (out / 'captions.vi.vtt').write_text('\n'.join(vtt))
    (out / 'transcript.vi.txt').write_text('Kế hoạch Giao Thừa — elevenlabs.io\n\n' +
                                         '\n\n'.join(c['text'] for c in cues) + '\n')
    return timeline


if __name__ == '__main__':
    import sys
    t = prepare(Path(sys.argv[1]))
    print(f"Fixed audio timeline: {t['duration']:.3f}s, {len(t['captions'])} short captions.")
