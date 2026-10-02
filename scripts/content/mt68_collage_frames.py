"""Audio-driven camera, parallax objects, mascot reactions and compact subtitles."""
from functools import lru_cache
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from mt68_collage_props import prop, CREAM, INK, RED, TEAL, GOLD

W, H = 1080, 1920


def smooth(x):
    x = min(1, max(0, x))
    return x * x * (3 - 2 * x)


class Frames:
    def __init__(self, package, timeline, font_path):
        self.timeline, self.package = timeline, package
        self.starts = [c['start'] for c in timeline['cues']]
        self.ends = [c['end'] for c in timeline['cues']]
        self.font_path = str(font_path)
        self.bgs = {n: Image.open(package / f'assets/{n}-cutout.png').convert('RGB')
                    for n in ['city', 'logistics', 'research']}
        self.sprites = {n: Image.open(package / f'assets/suu-{n}.png').convert('RGBA')
                        for n in ['cheer', 'thinking', 'pointing']}
        self.props = {n: prop(n) for n in ['crate', 'book', 'radio', 'embassy', 'palace',
                                         'staff', 'navy', 'compound', 'gate']}
        self.gradient = Image.new('RGBA', (W, H))
        d = ImageDraw.Draw(self.gradient)
        for y in range(H):
            alpha = int(130 * max(0, (y - 1450) / 470))
            if y < 170: alpha = int(80 * (1 - y / 170))
            d.line((0, y, W, y), fill=(30, 27, 20, alpha))

    @lru_cache(maxsize=24)
    def font(self, size):
        return ImageFont.truetype(self.font_path, size)

    @lru_cache(maxsize=384)
    def cutout(self, name, size):
        src = self.sprites[name[4:]] if name.startswith('suu-') else self.props[name]
        im = src.copy()
        im.thumbnail((size, size), Image.Resampling.LANCZOS)
        alpha = im.getchannel('A')
        canvas = Image.new('RGBA', (im.width + 32, im.height + 32))
        shadow = Image.new('RGBA', im.size, (32, 22, 12, 120))
        shadow.putalpha(alpha.point(lambda x: int(x * .4)))
        canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(5)), (19, 23))
        canvas.alpha_composite(im, (10, 10))
        return canvas

    def object(self, im, name, x, y, size, t, born=0, drift=1):
        progress = smooth((t - born) / .55)
        if progress <= 0: return
        sprite = self.cutout(name, max(10, int(size * (.88 + .12 * progress))))
        bob = math.sin(t * 1.3 + x / 120) * 9 * drift
        x += math.sin(t * .7) * 16 * drift
        y += bob + (1 - progress) * 75
        if progress < 1:
            sprite = sprite.copy()
            sprite.putalpha(sprite.getchannel('A').point(lambda a: int(a * progress)))
        im.alpha_composite(sprite, (int(x - sprite.width / 2), int(y - sprite.height / 2)))

    def text(self, im, text, center, size=66, fill=CREAM, align='center'):
        d = ImageDraw.Draw(im)
        f = self.font(size)
        lines = text.split('\n')
        y = center[1]
        for line in lines:
            x = center[0] - d.textlength(line, font=f) / 2 if align == 'center' else center[0]
            d.text((x, y), line, font=f, fill=fill, stroke_width=3, stroke_fill=INK)
            y += size * 1.23

    def scene(self, t):
        s = self.starts
        if t < s[2]: return 0, 'city', 0, s[2]
        if t < s[4]: return 1, 'logistics', s[2], s[4]
        if t < s[6]: return 2, 'research', s[4], s[6]
        if t < s[7]: return 3, 'city', s[6], s[7]
        if t < s[8]: return 4, 'logistics', s[7], s[8]
        return 5, 'research', s[8], self.timeline['duration']

    def frame(self, t):
        scene, name, a, b = self.scene(t)
        progress = min(1, (t - a) / (b - a))
        bg = self.bgs[name]
        # Independently moving backdrop and foreground create continuous parallax.
        zoom = 1.04 + .075 * progress
        cw, ch = bg.width / zoom, bg.height / zoom
        cx = bg.width / 2 + math.sin(t * .21) * bg.width * .016
        cy = bg.height / 2 + math.cos(t * .15) * bg.height * .013
        im = bg.transform((W, H), Image.Transform.EXTENT,
                          (cx - cw / 2, cy - ch / 2, cx + cw / 2, cy + ch / 2),
                          Image.Resampling.BICUBIC).convert('RGBA')
        s = self.starts
        if scene == 0:
            if t < 5.8:
                self.text(im, 'MẬU THÂN', (540, 365), 92)
                self.text(im, '1968', (540, 492), 154, '#EDC777')
            else:
                self.object(im, 'book', 690, 730, 525, t, s[1], .7)
                self.text(im, 'ĐỌC TƯ LIỆU', (540, 405), 72)
        elif scene == 1:
            self.object(im, 'crate', 650, 925, 590, t, a)
            if t > s[3] + 1:
                self.object(im, 'crate', 860, 1160, 300, t, s[3] + 1, 1.4)
            kw = 'CHUẨN BỊ' if t < s[3] else 'NHẬN VŨ KHÍ'
            if t > s[3] + 4.5:
                kw = 'HIỆN TRẠNG ≠ NĂM 1968'
                self.object(im, 'book', 520, 740, 375, t, s[3] + 4.5)
            self.text(im, kw.replace('≠', '/'), (540, 360), 60)
        elif scene == 2:
            items = [('embassy', 'Đại sứ quán Mỹ', 290, 620, s[4] + .9),
                     ('palace', 'Dinh Độc Lập', 775, 750, s[4] + 2.15),
                     ('radio', 'Đài Phát thanh\nSài Gòn', 300, 990, s[4] + 3.55),
                     ('staff', 'Bộ Tổng Tham mưu', 790, 1110, s[5] + .85),
                     ('navy', 'Bộ Tư lệnh\nHải quân', 525, 1390, s[5] + 2.5)]
            self.text(im, '5 MỤC TIÊU', (540, 240), 76)
            for obj, label, x, y, born in items:
                self.object(im, obj, x, y, 330, t, born, .45)
                if t > born + .2: self.text(im, label, (x, y + 148), 34)
            if t > s[5] + 5.2: self.text(im, 'TIẾN CÔNG  /  CHIẾM GIỮ', (540, 438), 44)
        elif scene == 3:
            self.object(im, 'compound', 600, 915, 770, t, a, .65)
            self.text(im, 'KHUÔN VIÊN', (540, 358), 70)
            if t > a + 2.2:
                self.text(im, 'TÒA NHÀ CHÍNH', (600, 1160), 60)
                d = ImageDraw.Draw(im)
                d.ellipse((295, 700, 898, 1310), outline=GOLD, width=7)
            if t > a + 4.8: self.text(im, 'KHÔNG ĐỒNG NHẤT', (540, 460), 48, '#EDC777')
        elif scene == 4:
            self.object(im, 'gate', 580, 880, 810, t, a, .5)
            self.text(im, 'DINH ĐỘC LẬP', (540, 350), 68)
            if t > a + 2.1:
                self.text(im, 'BỘC PHÁ KHÔNG NỔ', (540, 1190), 60, '#EDC777')
            if t > a + 4.5: self.text(im, 'CHUẨN BỊ  /  KẾT QUẢ', (540, 465), 48)
        else:
            self.text(im, 'BÀI HAI', (540, 480), 92)
            self.text(im, '5 MỤC TIÊU', (540, 620), 68, '#EDC777')
            self.object(im, 'book', 600, 1210, 490, t, a, .5)
            if t > a + 4: self.text(im, 'KẾT QUẢ RA SAO?', (540, 775), 62)
        pose = 'thinking' if scene in [3, 4] else 'pointing' if int(t / 2.4) % 2 else 'cheer'
        mx, my, size = (520, 1060, 390) if scene == 5 else (210, 1360, 350)
        if scene == 2: mx, my, size = 545, 875, 315
        self.object(im, 'suu-' + pose, mx, my, size, t, a, .6)
        im.alpha_composite(self.gradient)
        self.text(im, 'SỬ CHILL', (65, 64), 30, align='left')
        self.text(im, 'MINH HỌA HƯ CẤU', (65, 107), 22, align='left')
        self.text(im, 'elevenlabs.io', (835, 69), 24)
        for c in self.timeline['captions']:
            if c['start'] <= t < c['end']:
                self.text(im, c['text'], (540, 1640), 46)
                break
        return im.convert('RGB')
