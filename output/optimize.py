from pathlib import Path
from PIL import Image, ImageOps
root = Path(__file__).resolve().parent.parent
target = root / 'assets' / 'fotos'
target.mkdir(exist_ok=True)
before = after = 0
for source in (root / 'fotos').glob('*.jpg'):
    before += source.stat().st_size
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((1200, 1200))
        out = target / (source.stem + '.webp')
        image.save(out, 'WEBP', quality=83, method=6)
        after += out.stat().st_size
for name in ['index.html', 'app.js', 'sw.js']:
    path = root / name
    text = path.read_text(encoding='utf-8')
    import re
    text = re.sub(r'fotos/(100\d+)\.jpg', r'assets/fotos/\1.webp', text)
    text = text.replace('src:`fotos/${id}.jpg`', 'src:`assets/fotos/${id}.webp`')
    text = text.replace('Bolsas artesanais em crochê dourado entre folhagens', 'Bolsa e chinelos com detalhes em crochê dourado entre folhagens')
    text = text.replace('Duas bolsas de crochê em tons de mostarda sobre folhas verdes', 'Bolsa e chinelos em tons de mostarda sobre folhas verdes')
    text = text.replace('Bolsas em tons de mel', 'Bolsa e chinelos em tons de mel').replace('Bolsas entre folhagens', 'Bolsa e chinelos entre folhagens')
    path.write_text(text, encoding='utf-8')
print(f'37 fotos: {before:,} -> {after:,} bytes; redução de {100*(1-after/before):.1f}%')
