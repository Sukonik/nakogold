"""Builds the star-space tile, favicons, social card and star marks from the NAKO GOLD logo pack.
Usage: python3 -I tools/make-brand.py assets/brand/pack /tmp/brand-out, then copy favicon-*, apple-touch-icon, icon-* into assets/icons/ (favicon.ico also to the repo root), og-card.png / ng-tile-512.png / star-*.webp into assets/brand/."""
import sys, os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

PACK, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def load(name):
    im = Image.open(os.path.join(PACK, name)).convert("RGBA")
    return im.crop(im.getchannel("A").getbbox())

NG, STAR, LOCKUP = load("nako-gold-ng.png"), load("nako-gold-star.png"), load("nako-gold-lockup-horizontal.png")

def starfield(w, h, count, seed, near=True):
    """Black space: tiny far stars, a few bright near stars with glow and a 4-point flare."""
    r = np.random.default_rng(seed)
    img = np.zeros((h, w, 3), np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    tints = np.array([[1, 1, 1], [1, .93, .75], [.80, .88, 1], [1, .85, .55]], np.float32)
    S = min(w, h)
    for i in range(count):
        x, y = r.uniform(0, w), r.uniform(0, h)
        mag = r.random() ** 3.2                      # most stars faint, a few bright
        sigma = S * (.0016 + .0042 * mag)
        amp = .25 + .75 * mag
        t = tints[r.integers(len(tints))]
        x0, x1, y0, y1 = int(max(0, x - 6 * sigma)), int(min(w, x + 6 * sigma + 1)), int(max(0, y - 6 * sigma)), int(min(h, y + 6 * sigma + 1))
        if x1 <= x0 or y1 <= y0: continue
        gx, gy = xx[y0:y1, x0:x1] - x, yy[y0:y1, x0:x1] - y
        g = np.exp(-(gx * gx + gy * gy) / (2 * sigma ** 2))
        glow = np.exp(-(gx * gx + gy * gy) / (2 * (sigma * 3.2) ** 2)) * .22 if mag > .35 else 0
        k = (g + glow) * amp
        if near and mag > .6:                          # diffraction cross
            k = k + amp * .5 * (np.exp(-(gy ** 2) / (2 * (sigma * .35) ** 2)) * np.exp(-np.abs(gx) / (sigma * 7)) + np.exp(-(gx ** 2) / (2 * (sigma * .35) ** 2)) * np.exp(-np.abs(gy) / (sigma * 7)))
        img[y0:y1, x0:x1] += k[..., None] * t
    return Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8), "RGB")

def vgrad(w, h, top, bottom):
    a = np.linspace(0, 1, h, dtype=np.float32)[:, None, None]
    return Image.fromarray((np.array(top, np.float32) * (1 - a) + np.array(bottom, np.float32) * a).astype(np.uint8).repeat(w, 1), "RGB")

def place(base, art, width_frac, dy=0.0, shadow=True, glow=True):
    W, H = base.size
    w = int(W * width_frac); h = int(art.height * w / art.width)
    a = art.resize((w, h), Image.LANCZOS)
    x, y = (W - w) // 2, int((H - h) / 2 + H * dy)
    out = base.convert("RGBA")
    alpha = a.getchannel("A")
    if glow:                                           # warm gold lift behind the lettering
        g = Image.new("RGBA", (w, h), (239, 190, 90, 255)); g.putalpha(alpha.point(lambda v: int(v * .55)))
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); layer.paste(g, (x, y))
        out = Image.alpha_composite(out, layer.filter(ImageFilter.GaussianBlur(W * .028)))
    if shadow:                                         # depth: soft black shadow below-right
        s = Image.new("RGBA", (w, h), (0, 0, 0, 255)); s.putalpha(alpha.point(lambda v: int(v * .9)))
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); layer.paste(s, (x + int(W * .008), y + int(W * .016)))
        out = Image.alpha_composite(out, layer.filter(ImageFilter.GaussianBlur(W * .012)))
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0)); layer.paste(a, (x, y), a)
    return Image.alpha_composite(out, layer)

def bevel(img, radius_frac, rim=True, gloss_on=True):
    """3D tile: rounded mask, gold-white rim light top-left fading to dark bottom-right, soft gloss at the top."""
    W, H = img.size; rad = int(W * radius_frac)
    mask = Image.new("L", (W, H), 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, W - 1, H - 1), rad, fill=255)
    out = img.convert("RGBA")
    if rim:
        t = max(2, int(W * .028))
        inner = Image.new("L", (W, H), 0); ImageDraw.Draw(inner).rounded_rectangle((t, t, W - 1 - t, H - 1 - t), max(1, rad - t), fill=255)
        ring = ImageChops.subtract(mask, inner)
        diag = np.add.outer(np.linspace(0, 1, H, dtype=np.float32), np.linspace(0, 1, W, dtype=np.float32)) / 2
        c0, c1 = np.array([255, 233, 160], np.float32), np.array([70, 48, 14], np.float32)
        col = (c0 * (1 - diag[..., None]) + c1 * diag[..., None]).astype(np.uint8)
        rl = Image.fromarray(col, "RGB").convert("RGBA"); rl.putalpha(ring)
        out = Image.alpha_composite(out, rl)
        gloss = Image.new("RGBA", (W, H), (255, 255, 255, 0)); d = ImageDraw.Draw(gloss)
        if not gloss_on: d = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
        d.ellipse((-W * .2, -H * .72, W * 1.2, H * .30), fill=(255, 255, 255, 16))
        gloss.putalpha(ImageChops.multiply(gloss.getchannel("A"), inner))
        out = Image.alpha_composite(out, gloss)
    out.putalpha(mask)
    return out

def tile(size, stars, ng_frac, radius, rim=True, full_bleed=False, ss=4, seed=11, glow=True, shadow=True, gloss=True):
    N = size * ss
    base = starfield(N, N, stars, seed)
    t = place(base, NG, ng_frac, glow=glow, shadow=shadow)
    t = t if full_bleed else bevel(t, radius, rim, gloss)
    return t.resize((size, size), Image.LANCZOS)

# --- favicons (small = few stars so the lettering stays crisp) ---
tile(16, 4, .92, .22, rim=False, ss=16, glow=False, shadow=False).save(f"{OUT}/favicon-16.png")
tile(32, 7, .90, .20, rim=True, ss=12, glow=False, shadow=False, gloss=False).save(f"{OUT}/favicon-32.png")
tile(48, 14, .88, .20, rim=True, ss=10, gloss=False).save(f"{OUT}/favicon-48.png")
Image.open(f"{OUT}/favicon-48.png").save(f"{OUT}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)], append_images=[])
# real multi-size ico
ims = [Image.open(f"{OUT}/favicon-{n}.png").convert("RGBA") for n in (16, 32, 48)]
ims[2].save(f"{OUT}/favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
# --- app icons: full-bleed so OS masks apply; lettering inside the maskable safe zone ---
tile(180, 70, .66, 0, full_bleed=True, ss=4).convert("RGB").save(f"{OUT}/apple-touch-icon.png")
tile(192, 70, .66, 0, full_bleed=True, ss=4).convert("RGB").save(f"{OUT}/icon-192.png")
tile(512, 150, .66, 0, full_bleed=True, ss=2).convert("RGB").save(f"{OUT}/icon-512.png")
# showcase tile at large size (rounded, bevelled)
tile(512, 130, .84, .16, ss=2).save(f"{OUT}/ng-tile-512.png")
# --- social card 1200x630 with the horizontal lockup on star space ---
W, H = 2400, 1260
card = starfield(W, H, 330, 21)
card = place(card, LOCKUP, .56, glow=True, shadow=True).convert("RGB").resize((1200, 630), Image.LANCZOS)
card.save(f"{OUT}/og-card.png", optimize=True)
# --- star marks (transparent) ---
for n in (96, 256, 512):
    s = STAR.copy(); s.thumbnail((n, n), Image.LANCZOS)
    canvas = Image.new("RGBA", (n, n), (0, 0, 0, 0)); canvas.paste(s, ((n - s.width) // 2, (n - s.height) // 2), s)
    canvas.save(f"{OUT}/star-{n}.webp", "WEBP", quality=90, method=6)
print("ok")
