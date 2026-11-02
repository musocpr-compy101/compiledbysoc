"""Recover the supplied 8x16 pixel font and generate the ASCII wordmark.

The source GIF is retained only as a font reference; its portrait is not published.
Run from the project root: python scripts/extract_ascii.py
"""
from pathlib import Path
from PIL import Image
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "reference" / "well.gif"
OUTPUT = ROOT / "dist" / "assets"
CHARACTERS = ['Y', '.', '_', 'i', 'L', '`', ';', 'W', 'O', ':', '$', '!', 'T', 'M', '"', '4', 'b', ',', 'd', "'", 'l', 'P', 'U', 'y', 'F', '-', 'r', 'c', 'm', 'a', 'n', 'g', 'S', 'C', 'H', 'E', 'X', 'D', 'V', 'R', 'A', 'I', 'G', 'N', '?']

# Additional original 8x16 bitmap glyphs for the uppercase terminal interface.
# The 45 reference glyphs above are never replaced or modified.
UI_GLYPHS = {
    'B': '00 00 FC 66 66 66 7C 66 66 66 66 FC 00 00 00 00',
    'J': '00 00 1E 0C 0C 0C 0C 0C CC CC CC 78 00 00 00 00',
    'K': '00 00 E6 66 6C 6C 78 78 6C 6C 66 E6 00 00 00 00',
    'Q': '00 00 7C C6 C6 C6 C6 C6 C6 D6 DE 7C 06 07 00 00',
    'Z': '00 00 FE C6 86 0C 18 30 60 C2 C6 FE 00 00 00 00',
    '[': '00 00 3C 30 30 30 30 30 30 30 30 3C 00 00 00 00',
    ']': '00 00 3C 0C 0C 0C 0C 0C 0C 0C 0C 3C 00 00 00 00',
    '/': '00 00 02 06 0C 0C 18 18 30 30 60 40 00 00 00 00',
    '>': '00 00 60 30 18 0C 06 0C 18 30 60 00 00 00 00 00',
    '~': '00 00 00 00 76 DC 00 00 00 00 00 00 00 00 00 00',
    '@': '00 00 7C C6 C6 DE DE DE DC C0 C0 7E 00 00 00 00',
    '#': '00 00 6C 6C FE 6C 6C 6C FE 6C 6C 00 00 00 00 00',
}

BANNER_GLYPHS = {
    ' ': ['000'] * 7,
    'B': ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
    'C': ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
    'D': ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
    'E': ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    'I': ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
    'L': ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    'M': ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
    'O': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    'P': ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
    'S': ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
    'Y': ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
}


def banner(text):
    return '\n'.join(' '.join(BANNER_GLYPHS[character][row] for character in text).replace('0', ' ').replace('1', '#').rstrip() for row in range(7))


def extract():
    source = Image.open(SOURCE)
    glyphs, frames = {}, []
    for frame_number in range(source.n_frames):
        source.seek(frame_number)
        frame = source.convert('L')
        rows = []
        for y in range(0, frame.height, 16):
            row = ''
            for x in range(0, frame.width, 8):
                tile = tuple(frame.crop((x, y, x + 8, y + 16)).get_flattened_data())
                if not any(tile):
                    row += ' '
                    continue
                if tile not in glyphs:
                    glyphs[tile] = CHARACTERS[len(glyphs)]
                row += glyphs[tile]
            rows.append(row)
        frames.append({'text': '\n'.join(rows), 'duration': source.info.get('duration', 2000)})
    assert len(glyphs) == len(CHARACTERS), 'Unexpected reference glyph set'
    return glyphs, frames


def create_font(glyphs):
    character_pixels = {character: pixels for pixels, character in glyphs.items()}
    for character, bitmap in UI_GLYPHS.items():
        rows = bytes.fromhex(bitmap)
        assert len(rows) == 16 and character not in character_pixels
        character_pixels[character] = tuple(170 if row & (1 << (7 - col)) else 0 for row in rows for col in range(8))
    font = FontBuilder(1024, isTTF=True)
    names = {character: 'uni%04X' % ord(character) for character in sorted(character_pixels)}
    order = ['.notdef', 'space', *names.values()]
    font.setupGlyphOrder(order)
    font.setupCharacterMap({32: 'space', **{ord(char): name for char, name in names.items()}})
    outlines = {'.notdef': TTGlyphPen(None).glyph(), 'space': TTGlyphPen(None).glyph()}
    for character, pixels in character_pixels.items():
        pen = TTGlyphPen(None)
        for y in range(16):
            for x in range(8):
                if not pixels[y * 8 + x]:
                    continue
                left, bottom = x * 64, (15 - y) * 64
                pen.moveTo((left, bottom))
                pen.lineTo((left, bottom + 64))
                pen.lineTo((left + 64, bottom + 64))
                pen.lineTo((left + 64, bottom))
                pen.closePath()
        outlines[names[character]] = pen.glyph()
    font.setupGlyf(outlines)
    metrics = {name: (512, 0) for name in order}
    for character, pixels in character_pixels.items():
        metrics[names[character]] = (512, min(index % 8 for index, value in enumerate(pixels) if value) * 64)
    font.setupHorizontalMetrics(metrics)
    font.setupHorizontalHeader(ascent=1024, descent=0)
    font.setupOS2(sTypoAscender=1024, sTypoDescender=0, sTypoLineGap=0, usWinAscent=1024, usWinDescent=0)
    font.setupNameTable({'familyName': 'SOC VGA', 'styleName': 'Regular', 'uniqueFontIdentifier': 'SOC-VGA-Reference-UI-2', 'fullName': 'SOC VGA Regular', 'psName': 'SOC-VGA-Regular', 'version': 'Version 2.0'})
    font.setupPost()
    font.font.flavor = 'woff'
    font.save(OUTPUT / 'soc-vga.woff')


if __name__ == '__main__':
    OUTPUT.mkdir(parents=True, exist_ok=True)
    glyphs, _ = extract()
    create_font(glyphs)
    page = ROOT / 'dist' / 'index.html'
    content = page.read_text(encoding='utf-8')
    for marker, text in [('COMPILED', 'COMPILED'), ('BY_SOC', 'BY SOC')]:
        content = re.sub(r'<!-- ' + marker + r'_START -->.*?<!-- ' + marker + r'_END -->', '<!-- ' + marker + '_START -->' + banner(text) + '<!-- ' + marker + '_END -->', content, flags=re.S)
    page.write_text(content, encoding='utf-8')
    print(f'Recovered {len(glyphs)} reference glyphs and generated the ASCII wordmark; no portrait assets emitted.')
