"""Prepare committed WOFF2 files and print fallback metrics; no runtime dependency.

Requires fonttools[woff]. Pass local Arial and optional Roboto references to
recalculate metrics. Reference system fonts are never copied into the project.
"""
import argparse
import json
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "public" / "fonts"


def convert(name):
    source = FONTS / f"{name}.ttf"
    font = TTFont(source, recalcTimestamp=False)
    cmap = font.getBestCmap()
    advances = dict(font["hmtx"].metrics)
    font.flavor = "woff2"
    target = FONTS / f"{name}.woff2"
    font.save(target)
    restored = TTFont(target)
    assert restored.getBestCmap() == cmap, "Character coverage changed"
    assert restored["hmtx"].metrics == advances, "Glyph spacing changed"
    print(f"{name}: {source.stat().st_size} -> {target.stat().st_size} bytes; coverage and spacing preserved")


def load(path, weight=400):
    font = TTFont(path)
    if "fvar" in font:
        font = instantiateVariableFont(font, {"wght": weight, "wdth": 100}, inplace=False)
    return font


def width(font, text):
    cmap = font.getBestCmap()
    return sum(font["hmtx"][cmap[ord(c)]][0] for c in text if ord(c) in cmap) / font["head"].unitsPerEm


def fallback(target, reference, sample):
    common = target.getBestCmap().keys() & reference.getBestCmap().keys()
    sample = "".join(char for char in sample if ord(char) in common)
    scale = width(target, sample) / width(reference, sample)
    metrics = target["hhea"]
    upm = target["head"].unitsPerEm
    return {
        "size-adjust": f"{scale * 100:.4f}%",
        "ascent-override": f"{metrics.ascent / upm / scale * 100:.4f}%",
        "descent-override": f"{abs(metrics.descent) / upm / scale * 100:.4f}%",
        "line-gap-override": f"{metrics.lineGap / upm / scale * 100:.4f}%",
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--arial-dir", type=Path)
    parser.add_argument("--roboto", type=Path)
    parser.add_argument("--roboto-italic", type=Path)
    args = parser.parse_args()
    for name in ("Barlow-Regular", "Barlow-SemiBold"):
        convert(name)
    # Current ES/CA/EN copy weights the average widths rather than an arbitrary alphabet.
    translations = [json.loads((ROOT / "src/i18n/locales" / f"{language}.json").read_text(encoding="utf-8")) for language in ("es", "ca", "en")]

    def strings(value):
        if isinstance(value, str):
            return [value]
        if isinstance(value, dict):
            return [text for item in value.values() for text in strings(item)]
        if isinstance(value, list):
            return [text for item in value for text in strings(item)]
        return []

    body = " ".join(text for data in translations for text in strings(data))
    display = "DE LA PISTA SALIÓ UN CLUB ASÍ SE VIVE EN LA ARENA NOS VEMOS EN LA ARENA LIGA DE CLUBES PRÓXIMOS ENCUENTROS RESULTADOS CLASIFICACIÓN CONOCE EL CLUB ESCRIU-NOS LLIGA DE CLUBS CLUBS LEAGUE UPCOMING FIXTURES GET IN TOUCH"
    brand = "BLOCK N’ ROLL WE WILL BLOCK N’ ROLL!"
    targets = [
        ("body", "Barlow-Regular.woff2", "arial.ttf", body, 400),
        ("body-bold", "Barlow-SemiBold.woff2", "arialbd.ttf", body, 700),
        ("display", "BarlowCondensed-BlackItalic.woff2", "arialbi.ttf", display, 900),
        ("brand", "FEASFBRG.woff2", "arialbd.ttf", brand, 700),
    ]
    result = {}
    for role, name, arial, sample, weight in targets:
        target = load(FONTS / name)
        if args.arial_dir:
            result[role + "-arial"] = fallback(target, load(args.arial_dir / arial), sample)
            if role == "display" and (args.arial_dir / "arialnbi.ttf").exists():
                result[role + "-arial-narrow"] = fallback(target, load(args.arial_dir / "arialnbi.ttf"), sample)
        if args.roboto:
            reference = args.roboto_italic if role == "display" and args.roboto_italic else args.roboto
            result[role + "-roboto"] = fallback(target, load(reference, weight), sample)
    print(json.dumps(result, ensure_ascii=False, indent=2))
