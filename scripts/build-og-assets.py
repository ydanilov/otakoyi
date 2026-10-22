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


def rounded(im, radius):
    """Image with rounded corners (alpha mask)."""
    from PIL import ImageDraw

    mask = Image.new("L", im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, *im.size), radius, fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def device(src, width, radius, pad):
    """An app screen in a bezel, like DeviceFrame on the site (card colour, thin border)."""
    from PIL import ImageDraw

    screen = Image.open(PUBLIC / src).convert("RGB")
    screen = screen.resize((width, round(width * screen.height / screen.width)), Image.LANCZOS)
    frame = Image.new("RGBA", (screen.width + 2 * pad, screen.height + 2 * pad), (0, 0, 0, 0))
    ImageDraw.Draw(frame).rounded_rectangle(
        (0, 0, frame.width - 1, frame.height - 1), radius, fill=(15, 15, 15, 255), outline=(38, 38, 38, 255)
    )
    frame.alpha_composite(rounded(screen, radius - pad), (pad, pad))
    return frame


# /control: the tablet console on the right, the branded phone screen overlapping it.
# Composed rather than cropped — the app has no photo. Colours: background / card / border tokens.
card = Image.new("RGBA", (1200, 630), (7, 7, 7, 255))
tablet = device("control/tablet-vj.webp", 700, 30, 12)
phone = device("control/phone-loading.webp", 190, 30, 8)
card.alpha_composite(tablet, (560, 70))
card.alpha_composite(phone, (470, 210))
card.convert("RGB").save(OUT / "control.jpg", "JPEG", quality=82, optimize=True, progressive=True)
print("control.jpg <- control/tablet-vj.webp + control/phone-loading.webp")
