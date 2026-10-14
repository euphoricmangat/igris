#!/usr/bin/env python3
"""Igris atelier — bake synthetic film/comic plates into public/archive."""

from __future__ import annotations

import json
import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ROOT = Path(__file__).resolve().parents[2]
ARCHIVE = ROOT / "public" / "archive"
W, H = 960, 720


def seed_rng(seed: int) -> random.Random:
    return random.Random(seed)


def noise_field(rng: random.Random, w: int, h: int, scale: float = 0.02) -> np.ndarray:
    """Cheap value-noise via upscaled random grid."""
    gw, gh = max(8, int(w * scale)), max(8, int(h * scale))
    grid = np.array(
        [[rng.random() for _ in range(gw)] for _ in range(gh)], dtype=np.float32
    )
    img = Image.fromarray((grid * 255).astype(np.uint8), mode="L")
    img = img.resize((w, h), Image.Resampling.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0


def film_grain(img: Image.Image, rng: random.Random, amount: float = 0.12) -> Image.Image:
    arr = np.asarray(img.convert("RGB"), dtype=np.float32)
    n = noise_field(rng, arr.shape[1], arr.shape[0], 0.35)
    grain = (n[:, :, None] - 0.5) * 255 * amount
    out = np.clip(arr + grain, 0, 255).astype(np.uint8)
    return Image.fromarray(out, "RGB")


def comic_panel(rng: random.Random, idx: int, mood: str = "day") -> Image.Image:
    """Synthetic comic cell — bold shapes, ink lines, flat color."""
    if mood == "night":
        bg = (8 + rng.randint(0, 10), 8 + rng.randint(0, 8), 14 + rng.randint(0, 16))
        palette = [
            (120, 16, 24),
            (40, 48, 72),
            (20, 20, 28),
            (90, 100, 130),
            (200, 200, 210),
        ]
        ink = (200, 200, 210)
        label = (180, 190, 210)
        accent = (160, 28, 36)
    elif mood == "ember":
        bg = (28 + rng.randint(0, 18), 12 + rng.randint(0, 10), 8 + rng.randint(0, 8))
        palette = [
            (220, 60, 20),
            (160, 30, 18),
            (80, 28, 16),
            (40, 22, 16),
            (240, 200, 150),
        ]
        ink = (20, 10, 8)
        label = (255, 220, 180)
        accent = (220, 70, 24)
    else:
        bg = (18 + rng.randint(0, 20), 16 + rng.randint(0, 16), 14 + rng.randint(0, 12))
        palette = [
            (185, 28, 28),
            (212, 212, 212),
            (40, 40, 48),
            (120, 110, 95),
            (232, 220, 200),
        ]
        ink = (8, 8, 10)
        label = (232, 220, 200)
        accent = (185, 28, 28)

    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)

    for _ in range(5 + rng.randint(0, 4)):
        c = palette[rng.randint(0, len(palette) - 1)]
        x0, y0 = rng.randint(0, W // 2), rng.randint(0, H // 2)
        x1, y1 = x0 + rng.randint(120, 520), y0 + rng.randint(100, 420)
        draw.rectangle([x0, y0, x1, y1], fill=c)

    # Soft atmospheric wash behind ink
    wash = noise_field(rng, W, H, 0.04)
    arr = np.asarray(img, dtype=np.float32)
    tint = np.array(accent, dtype=np.float32)
    arr = arr * (0.92 + 0.08 * wash[:, :, None]) + tint * (0.04 * wash[:, :, None])
    img = Image.fromarray(arr.clip(0, 255).astype(np.uint8), "RGB")
    draw = ImageDraw.Draw(img)

    for _ in range(14 if mood == "day" else 18 if mood == "night" else 16):
        pts = []
        x, y = rng.randint(40, W - 40), rng.randint(40, H - 40)
        for __ in range(7):
            x += rng.randint(-90, 90)
            y += rng.randint(-70, 70)
            pts.append((x, y))
        draw.line(pts, fill=ink, width=rng.randint(2, 6))

    # Speed / motion ticks — denser on later frames
    ticks = 4 + (idx % 5)
    for _ in range(ticks):
        y = rng.randint(80, H - 80)
        x0 = rng.randint(40, W // 3)
        x1 = x0 + rng.randint(80, 220)
        draw.line([(x0, y), (x1, y + rng.randint(-8, 8))], fill=accent, width=2)

    # Occasional circular cell / lens mark
    if idx % 3 == 0:
        cx, cy = rng.randint(W // 4, 3 * W // 4), rng.randint(H // 4, 3 * H // 4)
        r = rng.randint(40, 120)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=ink, width=3)

    draw.rectangle([12, 12, W - 13, H - 13], outline=ink, width=8)
    draw.rectangle([24, H - 64, 140, H - 28], fill=(8, 8, 10))
    draw.text((36, H - 56), f"F{idx:02d}", fill=label)

    img = film_grain(img, rng, 0.1 if mood == "day" else 0.16 if mood == "night" else 0.2)
    if mood == "night":
        img = ImageEnhance.Color(img).enhance(0.85)
        img = ImageEnhance.Brightness(img).enhance(0.92)
    elif mood == "ember":
        img = ImageEnhance.Color(img).enhance(1.2)
        img = ImageEnhance.Contrast(img).enhance(1.12)
    else:
        img = ImageEnhance.Contrast(img).enhance(1.06)
    return img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=90, threshold=2))


def color_field(rng: random.Random, kind: str) -> Image.Image:
    """Soft atmospheric plate for Overlay mill."""
    base = noise_field(rng, W, H, 0.015)
    detail = noise_field(rng, W, H, 0.06)
    field = 0.65 * base + 0.35 * detail

    if kind == "ash":
        r = 140 + field * 70
        g = 136 + field * 60
        b = 128 + field * 50
    elif kind == "crimson":
        r = 90 + field * 140
        g = 20 + field * 40
        b = 24 + field * 35
    else:  # steel
        r = 70 + field * 90
        g = 74 + field * 95
        b = 82 + field * 110

    arr = np.stack([r, g, b], axis=-1).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(arr, "RGB")
    # Soft vignette
    cx, cy = W / 2, H / 2
    yy, xx = np.mgrid[0:H, 0:W]
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    vig = 1 - np.clip(dist / (0.85 * max(cx, cy)), 0, 1) * 0.45
    a = np.asarray(img, dtype=np.float32) * vig[:, :, None]
    img = Image.fromarray(a.clip(0, 255).astype(np.uint8), "RGB")
    return film_grain(img, rng, 0.08)


def halftone_plate(rng: random.Random) -> Image.Image:
    img = Image.new("RGB", (W, H), (232, 224, 214))
    draw = ImageDraw.Draw(img)
    step = 14
    for y in range(0, H, step):
        for x in range(0, W, step):
            n = (math.sin(x * 0.02 + y * 0.015) + 1) * 0.5
            radius = 1 + int(n * 6 * rng.uniform(0.7, 1.1))
            c = (20, 18, 16) if n > 0.35 else (160, 40, 40)
            draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=c)
    return ImageEnhance.Contrast(img).enhance(1.15)


def write_set(folder: str, images: list[Image.Image], meta: dict) -> None:
    out = ARCHIVE / folder
    out.mkdir(parents=True, exist_ok=True)
    frames = []
    for i, im in enumerate(images):
        name = f"frame-{i:02d}.png"
        im.save(out / name, optimize=True)
        frames.append(name)
    manifest = {**meta, "frames": frames, "width": W, "height": H}
    (out / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"wrote {out} ({len(frames)} frames)")


def main() -> None:
    ARCHIVE.mkdir(parents=True, exist_ok=True)

    rng = seed_rng(0x164715)
    reel = [comic_panel(rng, i) for i in range(16)]
    write_set(
        "reel-sprocket-01",
        reel,
        {
            "accession": "IGR.REEL.001",
            "title": "Sprocket Opera",
            "kind": "filmstrip",
        },
    )

    rng2 = seed_rng(0x0E3A11)
    overlay = [
        color_field(rng2, "ash"),
        color_field(rng2, "crimson"),
        color_field(rng2, "steel"),
        halftone_plate(rng2),
    ]
    write_set(
        "overlay-mill",
        overlay,
        {
            "accession": "IGR.OVL.001",
            "title": "Mill Room",
            "kind": "layers",
        },
    )

    rng3 = seed_rng(0xA11C0DE)
    nocturne = [comic_panel(rng3, i, mood="night") for i in range(18)]
    write_set(
        "reel-nocturne",
        nocturne,
        {
            "accession": "IGR.REEL.002",
            "title": "Nocturne Cut",
            "kind": "filmstrip",
        },
    )

    rng4 = seed_rng(0xFA11DE01)
    halide = [
        color_field(rng4, "steel"),
        color_field(rng4, "crimson"),
        color_field(rng4, "ash"),
        halftone_plate(rng4),
        film_grain(color_field(rng4, "crimson"), rng4, 0.22),
    ]
    write_set(
        "overlay-halide",
        halide,
        {
            "accession": "IGR.OVL.002",
            "title": "Halide Chamber",
            "kind": "layers",
        },
    )

    rng5 = seed_rng(0xE4BE12)
    ember = [comic_panel(rng5, i, mood="ember") for i in range(16)]
    write_set(
        "reel-ember",
        ember,
        {
            "accession": "IGR.REEL.003",
            "title": "Ember Register",
            "kind": "filmstrip",
        },
    )

    rng6 = seed_rng(0xC1DE12)
    cinder = [
        color_field(rng6, "crimson"),
        color_field(rng6, "ash"),
        film_grain(color_field(rng6, "ash"), rng6, 0.28),
        halftone_plate(rng6),
        color_field(rng6, "steel"),
    ]
    write_set(
        "overlay-cinder",
        cinder,
        {
            "accession": "IGR.OVL.003",
            "title": "Cinder Press",
            "kind": "layers",
        },
    )

    root_manifest = {
        "generated_by": "tools/atelier/generate_plates.py",
        "sets": [
            "reel-sprocket-01",
            "reel-nocturne",
            "reel-ember",
            "overlay-mill",
            "overlay-halide",
            "overlay-cinder",
        ],
    }
    (ARCHIVE / "manifest.json").write_text(
        json.dumps(root_manifest, indent=2), encoding="utf-8"
    )
    print("atelier complete")


if __name__ == "__main__":
    main()
