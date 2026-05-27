#!/usr/bin/env python3
"""
capture-slides-png.py
=====================

Capture une PNG 2560x1440 (retina ×2) pour CHAQUE slide d'un fichier slide-examples
HTML (format SPG : N divs `.slide` empilées verticalement, viewport canonique CSS
1280x720 chacune). Adapté du script `capture-style-tile.py` du brand-book.

Mini-deck v2 : capture exactement 6 slides nommées selon le mapping figé des
archétypes.

Usage
-----
    python3 capture-slides-png.py <input_html_path> <output_dir>

Le fichier HTML doit contenir EXACTEMENT 6 divs `.slide` dans cet ordre :
    1 → slide-01-cover.png
    2 → slide-02-case-study.png
    3 → slide-03-data-viz.png
    4 → slide-04-dashboard-kpi.png
    5 → slide-05-process-timeline.png
    6 → slide-06-icon-grid.png

Dépendances
-----------
    pip install playwright
    playwright install chromium

Pourquoi un PNG par slide ?
---------------------------
Le mini-deck v2 livre 6 PNG indépendantes que brand-book peut injecter en
grille ou liste verticale. Chaque PNG est un viewport canonique SPG (1280x720
en CSS, capturé en retina 2x = 2560x1440 pixels physiques), ce qui correspond
exactement au format slide d'une présentation PowerPoint 16:9.

Pourquoi retina ×2 ?
--------------------
`device_scale_factor=2` double la résolution physique des PNG (2560x1440 au lieu
de 1280x720). Impact sur la taille fichier : ×3 à ×4 (~700KB-1.5MB par slide au
lieu de ~250-450KB). Le bénéfice : les PNG restent nettes quand brand-book les
affiche à différentes échelles (vignette, demi-page, pleine page). Sans retina,
un affichage à 1280px CSS sur écran Retina apparaît flou.

Notes d'implémentation
----------------------
- Viewport navigateur : 1280 x (720 * 6) = 1280 x 4320 (en CSS px), pour contenir
  les 6 slides empilées sans scroll.
- Capture par slide : on calcule `bounding_box()` de chaque `.slide` (en CSS px)
  et on screenshote avec `clip` pour extraire UNIQUEMENT cette slide. Playwright
  applique automatiquement le device_scale_factor en pixels physiques.
- device_scale_factor = 2 (retina, PNG physiques 2560x1440).
- Attente : networkidle + document.fonts.ready + 1500ms buffer.
"""

import sys
from pathlib import Path

# Viewport canonique d'UNE slide SPG (en CSS pixels).
# La PNG capturée sera 2x plus grande (retina) : 2560x1440.
SLIDE_WIDTH = 1280
SLIDE_HEIGHT = 720
EXPECTED_SLIDES = 6
DEVICE_SCALE_FACTOR = 2

# Mapping figé position → nom de fichier PNG (mini-deck v2, 6 archétypes).
SLIDE_NAMES = [
    "slide-01-cover.png",
    "slide-02-case-study.png",
    "slide-03-data-viz.png",
    "slide-04-dashboard-kpi.png",
    "slide-05-process-timeline.png",
    "slide-06-icon-grid.png",
]

EXTRA_WAIT_MS = 1500


def print_usage():
    print(__doc__)
    print("\nUsage: python3 capture-slides-png.py <input_html_path> <output_dir>\n")
    sys.exit(2)


def main():
    if len(sys.argv) != 3:
        print_usage()

    input_html_path = Path(sys.argv[1]).resolve()
    output_dir = Path(sys.argv[2]).resolve()

    if not input_html_path.exists():
        print(f"[ERROR] Le fichier HTML source n'existe pas : {input_html_path}")
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("[ERROR] Playwright n'est pas installe.")
        print()
        print("Installer avec :")
        print("    pip install playwright")
        print("    playwright install chromium")
        sys.exit(1)

    print(f"[INFO] Source HTML       : {input_html_path}")
    print(f"[INFO] Output dossier    : {output_dir}")
    print(f"[INFO] Slides attendues  : {EXPECTED_SLIDES}")
    print(f"[INFO] Viewport / slide  : {SLIDE_WIDTH}x{SLIDE_HEIGHT}")

    file_url = input_html_path.as_uri()
    # Viewport plus large pour absorber padding body et marges inter-slides.
    # Le body a padding 24px + chaque .slide a margin-bottom 24px (5 gaps de 24px = 120px).
    # Hauteur generee : 24 (padding top) + 6*720 + 5*24 (gaps) + 24 (padding bot) = 4488px
    # On prend une marge de securite : 4700px.
    viewport_width = SLIDE_WIDTH + 48  # body padding 24 chaque cote
    viewport_height = 4700

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        try:
            context = browser.new_context(
                viewport={"width": viewport_width, "height": viewport_height},
                device_scale_factor=DEVICE_SCALE_FACTOR,
            )
            page = context.new_page()
            page.goto(file_url, wait_until="networkidle", timeout=30000)

            # Wait fonts ready
            try:
                page.evaluate("document.fonts.ready")
            except Exception:
                pass
            page.wait_for_timeout(EXTRA_WAIT_MS)

            # Enumerate .slide divs
            slides = page.locator(".slide")
            slide_count = slides.count()
            print(f"[INFO] Slides detectees : {slide_count}")

            if slide_count != EXPECTED_SLIDES:
                print(f"[ERROR] Attendu {EXPECTED_SLIDES} slides, trouve {slide_count}.")
                print(f"[ERROR] Le HTML doit contenir exactement {EXPECTED_SLIDES} divs .slide.")
                sys.exit(1)

            # Capture chaque slide
            captured = []
            for i in range(slide_count):
                slide = slides.nth(i)
                box = slide.bounding_box()
                if box is None:
                    print(f"[ERROR] Slide {i+1} : bounding_box() = None.")
                    sys.exit(1)

                output_path = output_dir / SLIDE_NAMES[i]
                page.screenshot(
                    path=str(output_path),
                    clip={
                        "x": box["x"],
                        "y": box["y"],
                        "width": SLIDE_WIDTH,
                        "height": SLIDE_HEIGHT,
                    },
                    type="png",
                )
                size_kb = output_path.stat().st_size / 1024
                width, height = _read_png_dimensions(output_path)
                print(f"[OK]   Slide {i+1} : {output_path.name} ({size_kb:.1f} KB, {width}x{height})")
                captured.append(output_path.name)

        finally:
            browser.close()

    print()
    print(f"[OK]   {len(captured)} PNG capturees dans : {output_dir}")
    for name in captured:
        print(f"        - {name}")


def _read_png_dimensions(png_path):
    try:
        with open(png_path, "rb") as f:
            header = f.read(24)
        if len(header) < 24 or header[:8] != b"\x89PNG\r\n\x1a\n":
            return (None, None)
        width = int.from_bytes(header[16:20], byteorder="big")
        height = int.from_bytes(header[20:24], byteorder="big")
        return (width, height)
    except Exception:
        return (None, None)


if __name__ == "__main__":
    main()
