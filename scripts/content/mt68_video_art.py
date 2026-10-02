"""Original typography and diagrams for the approved five-scene storyboard."""
from PIL import Image, ImageDraw, ImageFont

BG, CARD, INK, RED, MUTED = '#F5E6D0', '#FBF4E8', '#3D1A00', '#8B1A1A', '#795B43'
SCENES = [
    ('01 / BỐI CẢNH', 'Mậu Thân\n1968'),
    ('02 / SỰ CHUẨN BỊ', 'Từ cơ sở\nđến xuất kích'),
    ('03 / ĐỌC TƯ LIỆU', 'Năm mục tiêu\ntại Sài Gòn'),
    ('04 / ĐỐI CHIẾU', 'Phân biệt\nsự kiện & kết quả'),
    ('05 / TIẾP TỤC', 'Đọc nguồn.\nĐối chiếu.\nPhân biệt.'),
]


def wrap(text, draw, font, width):
    lines, line = [], ''
    for word in text.split():
        attempt = f'{line} {word}'.strip()
        if line and draw.textlength(attempt, font=font) > width:
            lines.append(line)
            line = word
        else:
            line = attempt
    return lines + [line]


def render(cue, font_path, poster=False):
    image = Image.new('RGB', (1080, 1920), BG)
    d = ImageDraw.Draw(image)
    font = lambda size: ImageFont.truetype(str(font_path), size)
    small, body, heading = font(30), font(44), font(78)
    scene = int(cue['id'][1:3]) - 1
    d.rectangle((0, 0, 20, 1920), fill=RED)
    d.text((78, 82), 'SỬ CHILL  /  LỊCH SỬ QUA TƯ LIỆU', font=small, fill=RED)
    label, title = SCENES[scene]
    if poster:
        label, title = 'BÀI DẪN NHẬP · MẬU THÂN 1968', 'Kế hoạch\nGiao Thừa'
    d.text((78, 196), label, font=small, fill=MUTED)
    d.multiline_text((72, 258), title, font=heading, fill=INK, spacing=4)
    if scene == 0 or poster:
        d.rounded_rectangle((76, 625, 1004, 1080), 32, fill=RED)
        d.text((116, 669), 'CUỐI THÁNG MỘT', font=font(38), fill=CARD)
        d.text((105, 730), '1968', font=font(176), fill=CARD)
        d.text((116, 964), 'Đọc nguồn về tiến công đô thị', font=font(35), fill=CARD)
    elif scene == 1:
        d.text((78, 602), 'DIỄN GIẢI GIÁO DỤC', font=small, fill=MUTED)
        for n, text in enumerate(['Cơ sở cất giấu vũ khí', 'Đội 5 nhận vũ khí', 'Xuất kích']):
            y = 660 + n * 150
            d.rounded_rectangle((76, y, 1004, y + 108), 22, fill=CARD)
            d.text((110, y + 26), text, font=body, fill=INK)
            if n < 2:
                d.line((540, y + 113, 540, y + 141), fill=RED, width=4)
                d.polygon([(532, y + 133), (548, y + 133), (540, y + 143)], fill=RED)
    elif scene == 2:
        targets = ['Đại sứ quán Mỹ', 'Dinh Độc Lập', 'Đài Phát thanh Sài Gòn',
                   'Bộ Tổng Tham mưu', 'Bộ Tư lệnh Hải quân']
        active = range(3) if cue['id'].endswith('a') else range(3, 5)
        for n, text in enumerate(targets):
            y = 588 + n * 109
            selected = n in active
            d.rounded_rectangle((76, y, 1004, y + 94), 20, fill=RED if selected else CARD)
            d.text((105, y + 22), f'{n + 1:02}  {text}', font=font(36),
                   fill=CARD if selected else INK)
    elif scene == 3:
        texts = (['Khuôn viên', '', 'Toàn bộ tòa nhà'] if cue['id'].endswith('a')
                 else ['Bộc phá mở cổng', 'KHÔNG NỔ', 'Chuẩn bị và kết quả: kể riêng'])
        d.rounded_rectangle((76, 650, 1004, 1080), 32, fill=CARD)
        for y, text, size in zip([712, 812, 958], texts, [48, 74, 38]):
            f = font(size)
            x = (1080 - d.textlength(text, font=f)) / 2
            d.text((x, y), text, font=f, fill=RED if y == 812 else INK)
        if cue['id'].endswith('a'):
            # Draw the inequality mark as geometry; the bundled font lacks it.
            d.line((510, 842, 570, 842), fill=RED, width=6)
            d.line((510, 864, 570, 864), fill=RED, width=6)
            d.line((526, 884, 554, 822), fill=RED, width=6)
    else:
        d.rounded_rectangle((76, 746, 1004, 1036), 32, fill=RED)
        d.text((115, 800), 'SANG BÀI HAI', font=font(54), fill=CARD)
        d.text((115, 901), 'Khám phá năm mục tiêu', font=body, fill=CARD)
    # Exact spoken text is always visible; the optional VTT supplies a text track.
    d.rounded_rectangle((76, 1178, 1004, 1660), 28, fill=CARD)
    lines = wrap(cue['text'], d, body, 840)
    if len(lines) > 7:
        raise ValueError(f"Caption overflows for {cue['id']}")
    y = 1212 + (7 - len(lines)) * 29
    for line in lines:
        d.text((114, y), line, font=body, fill=INK)
        y += 58
    d.text((78, 1705), 'Đồ án học tập · Phi thương mại', font=small, fill=MUTED)
    d.text((78, 1760), 'Giọng Hoa · ElevenLabs · elevenlabs.io', font=small, fill=MUTED)
    for n in range(5):
        x = 78 + n * 188
        d.rounded_rectangle((x, 1854, x + 174, 1862), 4, fill=RED if n <= scene else '#C8A882')
    return image
