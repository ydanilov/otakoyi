"""Crops site photos to 1200x630 JPEGs for Open Graph images (next/og cannot read WebP).

Run after changing a source photo:  python3 scripts/build-og-assets.py
Output: src/assets/og/bg/<name>.jpg (committed).
"""
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
OUT = ROOT / "src/assets/og/bg"

SOURCES = {
    "home": "solutions/conferences.webp",
    "works": "works/pump-the-market/hero.webp",
    "solutions": "solutions/exhibitions.webp",
    "studio": "studio/studio.webp",
    **{f"solution-{p.stem}": f"solutions/{p.name}" for p in (PUBLIC / "solutions").glob("*.webp")},
    **{f"case-{d.name}": f"works/{d.name}/{c}" for d in (PUBLIC / "works").iterdir() if d.is_dir()
       for c in ["hero.webp", "whale_pump.webp"] if (d / c).exists()},
}

OUT.mkdir(parents=True, exist_ok=True)
for name, src in sorted(SOURCES.items()):
    im = Image.open(PUBLIC / src).convert("RGB")
    im = ImageOps.fit(im, (1200, 630), Image.LANCZOS, centering=(0.5, 0.45))
    im.save(OUT / f"{name}.jpg", "JPEG", quality=78, optimize=True, progressive=True)
    print(f"{name}.jpg <- {src}")
