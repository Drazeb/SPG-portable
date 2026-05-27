#!/usr/bin/env python3
"""
capture-deck-png.py
===================

Capture 4 PNG (1280×720) à partir du deck.html composé par render-deck.py,
via Playwright headless Chromium. Un PNG par slide, nommé selon la
convention canonique du sous-skill.

Usage
-----
    python3 capture-deck-png.py <deck.html> <output_dir>

Produit dans `output_dir/` :
    slide-01-cover.png
    slide-02-big-idea.png
    slide-03-methode.png
    slide-04-cta.png

Dépendances
-----------
    pip install playwright
    playwright install chromium

Notes
-----
- Viewport canonique : 1280×720 (CSS px, 1 slide à la fois "visible" via clip).
- `device_scale_factor=2` (retina ×2) : PNG physiques 2560×1440, ~700KB-1.5MB chacune.
  Le doublement de résolution permet l'affichage net du PNG à différentes
  échelles dans le brand book (vignette, demi-page, pleine page).
- Attente : `networkidle` + `document.fonts.ready` + 2s buffer (Google Fonts).
- `clip` sur chaque `.slide` via `bounding_box()` du locator — cible le
  rectangle exact de la slide dans le document, indépendamment du padding
  body / gap entre slides.
"""

import sys
from pathlib import Path

VIEWPORT_WIDTH = 1280
VIEWPORT_HEIGHT = 720
EXTRA_WAIT_MS = 2000

SLIDE_FILENAMES = [
    "slide-01-cover.png",
    "slide-02-big-idea.png",
    "slide-03-methode.png",
    "slide-04-cta.png",
]


def main():
    if len(sys.argv) != 3:
        print("Usage: python3 capture-deck-png.py <deck.html> <output_dir>")
        sys.exit(2)

    deck_html_path = Path(sys.argv[1]).resolve()
    output_dir = Path(sys.argv[2]).resolve()

    if not deck_html_path.exists():
        print(f"[ERROR] deck.html introuvable : {deck_html_path}")
        sys.exit(1)
    if not deck_html_path.is_file():
        print(f"[ERROR] Chemin source n'est pas un fichier : {deck_html_path}")
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("[ERROR] Playwright non installé.")
        print()
        print("Installer avec :")
        print("    pip install playwright")
        print("    playwright install chromium")
        sys.exit(1)

    print(f"[INFO] deck.html    : {deck_html_path}")
    print(f"[INFO] output_dir   : {output_dir}")
    print(f"[INFO] viewport     : {VIEWPORT_WIDTH}x{VIEWPORT_HEIGHT}")
    print()

    file_url = deck_html_path.as_uri()

    with sync_playwright() as p:
        # Viewport assez grand pour contenir TOUS les slides empilés
        # (4 × 720 + paddings). On capture ensuite chaque .slide via bounding_box.
        browser = p.chromium.launch(headless=True)
        try:
            context = browser.new_context(
                viewport={"width": VIEWPORT_WIDTH, "height": 4400},
                device_scale_factor=2,
            )
            page = context.new_page()

            page.goto(file_url, wait_until="networkidle", timeout=30000)

            # Attendre fonts ready (Google Fonts FOUT)
            page.evaluate("document.fonts.ready")
            page.wait_for_timeout(EXTRA_WAIT_MS)

            # Récupérer tous les .slide
            slides = page.locator(".slide")
            count = slides.count()

            if count != 4:
                print(f"[WARN] {count} slides trouvées (attendu : 4)")

            n_to_capture = min(count, 4)

            for i in range(n_to_capture):
                target = output_dir / SLIDE_FILENAMES[i]
                # Capture par bounding_box (clip exact sur la slide)
                bbox = slides.nth(i).bounding_box()
                if bbox is None:
                    print(f"[ERROR] Impossible de récupérer le bounding box du slide {i+1}")
                    sys.exit(1)
                page.screenshot(
                    path=str(target),
                    clip={
                        "x": bbox["x"],
                        "y": bbox["y"],
                        "width": VIEWPORT_WIDTH,
                        "height": VIEWPORT_HEIGHT,
                    },
                    type="png",
                )
                size_kb = target.stat().st_size / 1024
                print(f"[OK]   {SLIDE_FILENAMES[i]:30s} ({size_kb:6.1f} KB)")
        finally:
            browser.close()

    print()
    print(f"[OK]   {n_to_capture} PNG capturées dans {output_dir}")


if __name__ == "__main__":
    main()
