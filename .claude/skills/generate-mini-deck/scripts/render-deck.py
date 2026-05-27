#!/usr/bin/env python3
"""
render-deck.py
==============

Compose les 4 slides du mini-deck en un seul HTML standalone (`deck.html`),
en substituant les placeholders Mustache simples par les valeurs du
tokens.json et du content.json.

Usage
-----
    python3 render-deck.py <tokens.json> <content.json> <output_dir>

Le script écrit `output_dir/deck.html` qui sera ensuite passé à
`capture-deck-png.py` pour produire les 4 PNG.

Conventions Mustache (volontairement minimales)
-----------------------------------------------
- `{{TOKEN_path.to.value}}` → valeur depuis tokens.json (paths à points)
- `{{CONTENT_slide.var}}` → valeur depuis content.json
- `{{FONT_QUERY_*}}` → query string Google Fonts (display / body / data)
- `{{SLIDE_0X}}` → injection du template slide-0X (dans deck-shell.html)
- `{{#STEPS_COLUMNS}}{{/STEPS_COLUMNS}}` → directive spéciale slide 03 :
  expansion en N colonnes (3 ou 4) avec dividers verticaux 1px

Validations bloquantes (lève SystemExit en cas d'échec)
-------------------------------------------------------
- HEADLINE Slide 02 max 4 mots
- Slide 03 a 3 ou 4 étapes
- Aucun placeholder `{{...}}` non résolu dans le HTML final
- Tous les tokens listés dans REQUIRED_TOKENS présents dans tokens.json
"""

import sys
import json
import re
from pathlib import Path

# ──────────────────────────────────────────────────────────────────────────
# Constantes
# ──────────────────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent
TEMPLATES_DIR = SKILL_DIR / "templates"

REQUIRED_TOKENS = [
    "colors.primary.main",
    "colors.secondary.main",
    "colors.neutrals.background_primary",
    "colors.neutrals.text_primary",
    "colors.neutrals.text_secondary",
    "colors.neutrals.border",
    "typography.display.family",
    "typography.body.family",
    "ui_physics.radius.xl",
]

# Fallbacks pour les tokens optionnels mais référencés par les templates
TOKEN_FALLBACKS = {
    "colors.neutrals.white": "#FFFFFF",
    "typography.display.weight": "400",
    "typography.display.tracking": "0",
    "typography.display.leading": "1.1",
    "typography.body.leading": "1.55",
    "typography.data.family": None,  # fallback runtime sur body.family
    "ui_physics.grid_unit": "8px",
}

# ──────────────────────────────────────────────────────────────────────────
# Resolution helpers
# ──────────────────────────────────────────────────────────────────────────


def resolve_path(data: dict, dotted_path: str):
    """Suit un path à points (ex 'colors.primary.main') dans un dict imbriqué."""
    current = data
    for part in dotted_path.split("."):
        if not isinstance(current, dict) or part not in current:
            return None
        current = current[part]
    return current


def get_token(tokens: dict, dotted_path: str) -> str:
    """
    Récupère un token. Applique fallback si absent et fallback connu.
    Lève KeyError pour les tokens REQUIRED_TOKENS manquants.
    """
    value = resolve_path(tokens, dotted_path)
    if value is None:
        # Fallback runtime
        if dotted_path == "typography.data.family":
            value = resolve_path(tokens, "typography.body.family") or "ui-monospace"
        elif dotted_path in TOKEN_FALLBACKS:
            value = TOKEN_FALLBACKS[dotted_path]
        elif dotted_path in REQUIRED_TOKENS:
            raise KeyError(f"Token requis manquant : {dotted_path}")
        else:
            value = ""
    return str(value)


def get_content(content: dict, dotted_path: str) -> str:
    """
    Récupère une valeur de content.json. Format attendu pour les feuilles :
    soit string direct, soit dict {value: ..., source: ...}.
    """
    value = resolve_path(content, dotted_path)
    if value is None:
        return ""
    if isinstance(value, dict) and "value" in value:
        return str(value["value"])
    if isinstance(value, list):
        return value  # cas spécial : array (steps)
    return str(value)


def google_fonts_query(family: str, weights=("400", "600", "700")) -> str:
    """
    Convertit un nom de famille en query string Google Fonts.
    'Crimson Pro' + weights → 'Crimson+Pro:wght@400;600;700'
    'JetBrains Mono'         → 'JetBrains+Mono:wght@400;500;600;700'
    """
    if not family or family.lower() in ("system-ui", "sans-serif", "serif", "monospace"):
        return ""
    name = family.replace(" ", "+")
    return f"{name}:wght@{';'.join(weights)}"


# ──────────────────────────────────────────────────────────────────────────
# Mustache resolver
# ──────────────────────────────────────────────────────────────────────────


def substitute_simple_placeholders(template: str, tokens: dict, content: dict) -> str:
    """
    Substitue tous les placeholders {{TOKEN_x.y.z}} et {{CONTENT_x.y}} dans le template.
    Les directives {{#…}}{{/…}} et les variables {{SLIDE_0X}} / {{FONT_QUERY_*}}
    sont gérées séparément.
    """

    def replacer(match):
        key = match.group(1)
        if key.startswith("TOKEN_"):
            return get_token(tokens, key[len("TOKEN_"):])
        if key.startswith("CONTENT_"):
            val = get_content(content, key[len("CONTENT_"):])
            # Si arraylist (steps), on ne la résout pas ici — la directive STEPS_COLUMNS s'en charge
            if isinstance(val, list):
                return ""
            return val
        # Sinon, laisser tel quel (sera détecté plus tard si non résolu)
        return match.group(0)

    return re.sub(r"\{\{([A-Z_][A-Za-z0-9_.]*)\}\}", replacer, template)


def render_steps_columns(steps: list, tokens: dict, content: dict) -> str:
    """
    Génère le HTML des 3 ou 4 colonnes de la slide Méthode, avec dividers verticaux.

    Layout (3 colonnes) :
        col1: left=88,  width=320
        div1: left=432
        col2: left=456, width=320
        div2: left=800
        col3: left=824, width=320

    Layout (4 colonnes) :
        col1: left=88,  width=232 ; div1: 344
        col2: left=368, width=232 ; div2: 624
        col3: left=648, width=232 ; div3: 904
        col4: left=928, width=232
    """
    n = len(steps)
    if n not in (3, 4):
        raise ValueError(f"Méthode : nombre d'étapes invalide ({n}), attendu 3 ou 4")

    if n == 3:
        col_layouts = [
            {"left": 88, "width": 320},
            {"left": 456, "width": 320},
            {"left": 824, "width": 320},
        ]
        divider_lefts = [432, 800]
    else:  # n == 4
        col_layouts = [
            {"left": 88, "width": 232},
            {"left": 368, "width": 232},
            {"left": 648, "width": 232},
            {"left": 928, "width": 232},
        ]
        divider_lefts = [344, 624, 904]

    parts = []
    border_color = get_token(tokens, "colors.neutrals.border")
    accent = get_token(tokens, "colors.secondary.main")
    text_primary = get_token(tokens, "colors.neutrals.text_primary")
    text_secondary = get_token(tokens, "colors.neutrals.text_secondary")
    body_family = get_token(tokens, "typography.body.family")
    display_family = get_token(tokens, "typography.display.family")
    display_tracking = get_token(tokens, "typography.display.tracking")
    data_family = get_token(tokens, "typography.data.family")

    # Dividers verticaux
    for div_left in divider_lefts:
        parts.append(
            f'<div style="position: absolute; top: 340px; left: {div_left}px; '
            f'width: 1px; height: 280px; background: {border_color};"></div>'
        )

    # Colonnes
    for i, step in enumerate(steps):
        layout = col_layouts[i]
        left = layout["left"]
        width = layout["width"]
        # Extraire {value, source} ou direct
        if isinstance(step, dict) and "value" in step:
            step_data = step["value"]
        else:
            step_data = step
        number = step_data.get("number", f"{i+1:02d}.")
        title = step_data.get("title", "")
        body = step_data.get("body", "")

        # Numéro mono accent
        parts.append(
            f'<div style="position: absolute; top: 340px; left: {left}px; width: {width}px; '
            f'font-family: {data_family}, ui-monospace, monospace; font-size: 26px; font-weight: 600; '
            f'letter-spacing: 0.02em; color: {accent};">{number}</div>'
        )
        # Titre display
        parts.append(
            f'<div style="position: absolute; top: 396px; left: {left}px; width: {width}px; '
            f'font-family: {display_family}, Georgia, serif; font-weight: 400; '
            f'font-size: 30px; line-height: 1.2; letter-spacing: {display_tracking}; '
            f'color: {text_primary};">{title}</div>'
        )
        # Body
        parts.append(
            f'<div style="position: absolute; top: 460px; left: {left}px; width: {width}px; '
            f'font-family: {body_family}, system-ui, sans-serif; font-size: 15px; line-height: 1.55; '
            f'color: {text_secondary};">{body}</div>'
        )

    return "\n  ".join(parts)


def expand_directives(template: str, tokens: dict, content: dict) -> str:
    """
    Expande les directives spéciales {{#STEPS_COLUMNS}}{{/STEPS_COLUMNS}}.
    """
    if "{{#STEPS_COLUMNS}}{{/STEPS_COLUMNS}}" in template:
        steps_raw = resolve_path(content, "methode.steps")
        # Support deux formats : value+source OU array direct
        if isinstance(steps_raw, dict) and "value" in steps_raw:
            steps = steps_raw["value"]
        else:
            steps = steps_raw
        if not isinstance(steps, list):
            raise ValueError(f"methode.steps doit être une liste, reçu : {type(steps).__name__}")
        steps_html = render_steps_columns(steps, tokens, content)
        template = template.replace("{{#STEPS_COLUMNS}}{{/STEPS_COLUMNS}}", steps_html)
    return template


def validate_no_unresolved(html: str, slide_name: str):
    """Lève SystemExit si des placeholders {{...}} restent dans le HTML final."""
    leftovers = re.findall(r"\{\{[^}]+\}\}", html)
    if leftovers:
        print(f"[ERROR] Placeholders non résolus dans {slide_name} :")
        for leftover in leftovers:
            print(f"        {leftover}")
        sys.exit(1)


def validate_big_idea_headline(content: dict):
    """HEADLINE Slide 02 max 4 mots."""
    headline = get_content(content, "big_idea.headline")
    if not headline:
        print("[ERROR] big_idea.headline vide dans content.json")
        sys.exit(1)
    cleaned = headline.strip().rstrip(".").rstrip("!").rstrip("?")
    words = re.findall(r"\S+", cleaned)
    if len(words) > 4:
        print(f"[ERROR] big_idea.headline doit faire MAX 4 mots, en a {len(words)} : '{headline}'")
        sys.exit(1)
    print(f"[OK]    big_idea.headline : {len(words)} mots ('{headline}')")


def validate_methode_steps(content: dict):
    """Slide 03 a 3 ou 4 étapes."""
    steps_raw = resolve_path(content, "methode.steps")
    if isinstance(steps_raw, dict) and "value" in steps_raw:
        steps = steps_raw["value"]
    else:
        steps = steps_raw
    if not isinstance(steps, list):
        print(f"[ERROR] methode.steps doit être une liste, reçu : {type(steps_raw).__name__}")
        sys.exit(1)
    if len(steps) not in (3, 4):
        print(f"[ERROR] methode.steps doit avoir 3 ou 4 items, en a {len(steps)}")
        sys.exit(1)
    print(f"[OK]    methode.steps : {len(steps)} étapes")


def validate_required_tokens(tokens: dict):
    """Tous les tokens REQUIRED présents."""
    missing = []
    for tok in REQUIRED_TOKENS:
        if resolve_path(tokens, tok) is None:
            missing.append(tok)
    if missing:
        print("[ERROR] Tokens requis manquants dans tokens.json :")
        for m in missing:
            print(f"        {m}")
        sys.exit(1)
    print(f"[OK]    {len(REQUIRED_TOKENS)} tokens requis présents")


# ──────────────────────────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────────────────────────


def main():
    if len(sys.argv) != 4:
        print("Usage: python3 render-deck.py <tokens.json> <content.json> <output_dir>")
        sys.exit(2)

    tokens_path = Path(sys.argv[1]).resolve()
    content_path = Path(sys.argv[2]).resolve()
    output_dir = Path(sys.argv[3]).resolve()

    if not tokens_path.exists():
        print(f"[ERROR] tokens.json introuvable : {tokens_path}")
        sys.exit(1)
    if not content_path.exists():
        print(f"[ERROR] content.json introuvable : {content_path}")
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"[INFO] tokens    : {tokens_path}")
    print(f"[INFO] content   : {content_path}")
    print(f"[INFO] output    : {output_dir}")
    print()

    # Charger inputs
    with open(tokens_path, "r", encoding="utf-8") as f:
        tokens = json.load(f)
    with open(content_path, "r", encoding="utf-8") as f:
        content = json.load(f)

    # Validations pré-render
    validate_required_tokens(tokens)
    validate_big_idea_headline(content)
    validate_methode_steps(content)
    print()

    # Charger templates
    shell = (TEMPLATES_DIR / "deck-shell.html").read_text(encoding="utf-8")
    slide_templates = {
        "01": (TEMPLATES_DIR / "slide-01-cover.html").read_text(encoding="utf-8"),
        "02": (TEMPLATES_DIR / "slide-02-big-idea.html").read_text(encoding="utf-8"),
        "03": (TEMPLATES_DIR / "slide-03-methode.html").read_text(encoding="utf-8"),
        "04": (TEMPLATES_DIR / "slide-04-cta.html").read_text(encoding="utf-8"),
    }

    # Render chaque slide
    rendered_slides = {}
    for slide_id, tpl in slide_templates.items():
        # Étape 1 — expand directives (slide 03 only)
        tpl = expand_directives(tpl, tokens, content)
        # Étape 2 — simple placeholders
        tpl = substitute_simple_placeholders(tpl, tokens, content)
        # Étape 3 — validation finale
        validate_no_unresolved(tpl, f"slide-{slide_id}")
        rendered_slides[slide_id] = tpl
        print(f"[OK]    Slide {slide_id} rendue ({len(tpl)} chars)")

    # Compose deck-shell
    deck_html = shell
    # Substituer les SLIDE_0X
    for slide_id, html in rendered_slides.items():
        deck_html = deck_html.replace(f"{{{{SLIDE_{slide_id}}}}}", html)

    # Compose les FONT_QUERY_* — Google Fonts
    display_family = get_token(tokens, "typography.display.family")
    body_family = get_token(tokens, "typography.body.family")
    data_family = get_token(tokens, "typography.data.family")

    deck_html = deck_html.replace(
        "{{FONT_QUERY_DISPLAY}}",
        google_fonts_query(display_family, ("400", "500", "600")),
    )
    deck_html = deck_html.replace(
        "{{FONT_QUERY_BODY}}",
        google_fonts_query(body_family, ("300", "400", "500", "600", "700")),
    )
    deck_html = deck_html.replace(
        "{{FONT_QUERY_DATA}}",
        google_fonts_query(data_family, ("400", "500", "600")),
    )

    # Résoudre les CONTENT_cover.brand restants dans le shell
    deck_html = substitute_simple_placeholders(deck_html, tokens, content)

    # Validation finale sur le deck complet
    validate_no_unresolved(deck_html, "deck.html")

    # Écrire
    output_path = output_dir / "deck.html"
    output_path.write_text(deck_html, encoding="utf-8")

    size_kb = output_path.stat().st_size / 1024
    print()
    print(f"[OK]    deck.html écrit : {output_path}")
    print(f"[OK]    Taille : {size_kb:.1f} KB")


if __name__ == "__main__":
    main()
