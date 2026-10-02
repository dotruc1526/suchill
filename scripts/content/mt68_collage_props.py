"""Symbolic paper cut-outs; these are not architectural reconstructions or maps."""
from PIL import Image, ImageDraw

CREAM, INK, RED, TEAL, GOLD, OLIVE = '#F5E6D0', '#3D1A00', '#9D342C', '#346366', '#C79848', '#647144'


def prop(kind):
    im = Image.new('RGBA', (600, 600))
    d = ImageDraw.Draw(im)
    line = lambda points, color=INK, width=10: d.line(points, fill=color, width=width, joint='curve')
    poly = lambda points, fill: d.polygon(points, fill=fill, outline=INK, width=5)
    if kind == 'crate':
        poly([(85, 220), (405, 170), (535, 265), (220, 320)], GOLD)
        poly([(85, 220), (220, 320), (220, 510), (85, 405)], '#927044')
        poly([(220, 320), (535, 265), (535, 448), (220, 510)], '#BC945D')
        for y in [360, 405, 450]:
            line([(220, y), (535, y - 55)], '#795A36', 5)
        for x in [278, 462]:
            poly([(x, 310 - (x - 220) / 6), (x + 25, 306 - (x - 220) / 6),
                  (x + 25, 503 - (x - 220) / 6), (x, 506 - (x - 220) / 6)], OLIVE)
    elif kind == 'book':
        poly([(40, 230), (275, 195), (310, 260), (550, 195), (565, 440),
              (315, 485), (290, 475), (50, 505)], TEAL)
        poly([(58, 198), (270, 180), (303, 220), (303, 452), (270, 426), (70, 459)], CREAM)
        poly([(306, 220), (525, 172), (552, 410), (307, 455)], '#E7CD9C')
        for y in range(255, 405, 38):
            line([(100, y), (251, y - 12)], '#BFAE84', 5)
            line([(340, y), (505, y - 35)], '#BFAE84', 5)
        line([(303, 220), (307, 455)], '#B49362', 6)
    elif kind == 'radio':
        d.rounded_rectangle((65, 220, 535, 475), 35, fill=TEAL, outline=CREAM, width=12)
        d.rounded_rectangle((110, 265, 350, 425), 18, fill=INK)
        for x in range(130, 335, 22): line([(x, 278), (x, 410)], GOLD, 8)
        for y in [305, 392]: d.ellipse((407, y - 23, 453, y + 23), fill=GOLD, outline=CREAM, width=5)
        line([(142, 220), (175, 80)], CREAM, 10)
    elif kind in ['embassy', 'palace', 'staff']:
        y = 200 if kind != 'palace' else 290
        poly([(60, y), (535, y - 35), (548, 480), (70, 500)], TEAL if kind != 'palace' else '#D7BE85')
        poly([(50, y), (535, y - 40), (550, y + 5), (60, y + 40)], OLIVE)
        rows = 3 if kind == 'embassy' else 2
        for r in range(rows):
            for c in range(5):
                x, wy = 104 + c * 80, y + 72 + r * 71
                d.rectangle((x, wy, x + 40, wy + 35), fill=CREAM)
        if kind == 'palace':
            for x in [95, 175, 255, 335, 415, 495]:
                d.rectangle((x, y + 45, x + 14, 480), fill=CREAM)
        if kind == 'staff':
            d.ellipse((215, 90, 355, 230), fill=GOLD, outline=CREAM, width=7)
            line([(242, 165), (327, 165)], INK, 7)
            line([(285, 122), (285, 207)], INK, 7)
    elif kind == 'navy':
        d.ellipse((260, 70, 340, 150), outline=CREAM, width=20)
        line([(300, 130), (300, 460)], CREAM, 28)
        line([(170, 250), (430, 250)], CREAM, 25)
        d.arc((90, 160, 510, 530), 0, 180, fill=CREAM, width=25)
        poly([(100, 347), (87, 440), (175, 424)], CREAM)
        poly([(500, 347), (513, 440), (425, 424)], CREAM)
        line([(300, 465), (300, 490)], GOLD, 26)
    elif kind == 'compound':
        poly([(70, 260), (510, 220), (550, 485), (85, 530)], OLIVE)
        poly([(150, 170), (410, 150), (425, 395), (155, 417)], CREAM)
        poly([(135, 173), (406, 136), (432, 159), (146, 203)], TEAL)
        for x in [195, 265, 335]:
            for y in [231, 301]: d.rectangle((x, y, x + 37, y + 40), fill=TEAL)
        for x in range(70, 550, 37):
            line([(x, 390), (x, 535)], GOLD, 9)
        line([(68, 438), (550, 438)], GOLD, 9)
    elif kind == 'gate':
        for x in [90, 490]: d.rectangle((x, 90, x + 35, 525), fill=CREAM, outline=INK, width=5)
        for x in range(142, 484, 42): line([(x, 164), (x, 499)], TEAL, 15)
        for y in [195, 444]: line([(130, y), (500, y)], TEAL, 18)
        line([(315, 180), (315, 506)], INK, 12)
        d.ellipse((280, 297, 341, 358), fill=RED, outline=CREAM, width=7)
    return im
