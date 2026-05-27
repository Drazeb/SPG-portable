# Slide Specs — Mini Deck (4 slides figées)

Spec figée des 4 slides du mini-deck. Lue par `render-deck.py` (validation) et par le sub-agent `content-mapper` (mapping pack BIG → variables).

**Viewport canonique** : 1280×720 (compatible export PPTX SPG).
**Mode chromatique** : Cover et CTA en Dark Cinema (symétrie chromatique). Big Idea et Méthode en Positif.
**Pattern technique** : tous les éléments en `position: absolute`. Pas de CSS variables runtime (résolues au render Python). Pas de flex/grid pour le layout principal. Classes canoniques SPG (`.display-lg`, `.body-lg`, `.overline`, `.data-xl`, etc.).

---

## Tokens consommés (liste fermée — 16 tokens)

Le mini-deck N'UTILISE QUE ces tokens. Toute extraction en dehors de cette liste est inutile.

| # | Token | Rôle | Slides |
|---|-------|------|--------|
| 1 | `colors.primary.main` | Fond Dark Cinema (HEX) | 01 Cover, 04 CTA |
| 2 | `colors.secondary.main` | Accent unique (point final, CTA bg, divider) | 01-04 |
| 3 | `colors.neutrals.background_primary` | Fond Positif | 02 Big Idea, 03 Méthode |
| 4 | `colors.neutrals.text_primary` | Texte sur fond clair | 02, 03 |
| 5 | `colors.neutrals.text_secondary` | Body secondaire sur fond clair | 02, 03 |
| 6 | `colors.neutrals.border` | Dividers verticaux Slide 3 | 03 |
| 7 | `colors.neutrals.white` | Texte sur fond dark (si `text_primary` est dark) | 01, 04 |
| 8 | `typography.display.family` | Font wordmark + titres | 01-04 |
| 9 | `typography.display.weight` | Graisse titres | 01-04 |
| 10 | `typography.display.tracking` | Letter-spacing display | 01-04 |
| 11 | `typography.display.leading` | Line-height display | 01-04 |
| 12 | `typography.body.family` | Font corps + overlines | 01-04 |
| 13 | `typography.body.leading` | Line-height body | 02, 03 |
| 14 | `typography.data.family` | Font monospace (numéros méthode, contact) | 03, 04 |
| 15 | `ui_physics.radius.xl` | Radius du bouton CTA | 04 |
| 16 | `ui_physics.grid_unit` | Unité de base (informatif) | — |

**Fallbacks** :
- Si `colors.neutrals.white` absent → fallback `#FFFFFF`
- Si `typography.data.family` absent → fallback `typography.body.family`
- Si `ui_physics.radius.xl` absent → fallback `4px`

---

## Variables Mustache (placeholders) — résolues par `render-deck.py`

Deux familles de placeholders :
- `{{TOKEN_path.to.value}}` → résolu depuis `tokens.json` (ex: `{{TOKEN_colors.primary.main}}` → `#0D1623`)
- `{{CONTENT_slide_id.variable}}` → résolu depuis `content.json` (ex: `{{CONTENT_cover.brand}}` → `camille`)

Tout placeholder non résolu = erreur bloquante au render.

---

## Slide 01 — Cover

### Spec narrative
Première slide. Wordmark monumental de la marque + tagline éventuelle + métadonnée (année / "Brand Book"). Mode Dark Cinema. Symétrie chromatique avec la CTA finale.

### Layout (positions absolues, viewport 1280×720)

| Élément | Position | Dimension | Style |
|---------|----------|-----------|-------|
| Background dark | `top:0; left:0` | `1280×720` | `background: {{TOKEN_colors.primary.main}}` |
| Halo radial décoratif | `top:0; left:0` | `1280×720` | `background: radial-gradient(circle at 78% 22%, {{TOKEN_colors.secondary.main}}1F 0%, transparent 55%)` (alpha hex `1F` = 12%) |
| Overline bas-gauche | `top:640px; left:88px` | `width: 400px` | classe `.overline` |
| Wordmark `{{BRAND}}.` | `top:280px; left:88px` | `width: 1104px` | classe `.display-lg` taille ~140px, point final en accent |
| Tagline (opt.) | `top:480px; left:88px` | `width: 700px` | classe `.body-lg` muted, italique |

### Variables Mustache

| Placeholder | Source BIG | Contraintes | Exemple Camille |
|-------------|-----------|-------------|-----------------|
| `{{CONTENT_cover.brand}}` | Nom marque (lowercase ou tel quel selon pack) | 1 mot, casse respectée | `camille` |
| `{{CONTENT_cover.tagline}}` | `design-specs.md §01.5` Ancre de Posture (1 phrase courte) ou absent | ≤ 80 caractères, OU vide | `Le Phare de Ralliement.` |
| `{{CONTENT_cover.metadata}}` | `BRAND BOOK · {{YEAR}}` (année extraite de `pack.session` ou date courante) | uppercase, format `BRAND BOOK · 2026` | `BRAND BOOK · 2026` |

### Sources BIG par variable

- `cover.brand` : extrait du nom du pack (`camille-identity-…` → `camille`) ou explicite dans le pitch (titre H1).
- `cover.tagline` : `design-specs.md §01.5` Ancre de Posture — sous-titre du concept (ex Camille : "Le Phare de Ralliement."). Si absent, laisser vide.
- `cover.metadata` : `BRAND BOOK · {YYYY}` où l'année vient de l'identifiant de session (ex `test-camille-test-20260513-1453` → `2026`).

### Anti-patterns spécifiques

- **PAS d'icône, PAS de logo SVG complexe** sur la Cover du mini-deck — uniquement le wordmark texte. (Le logo brand-book est une autre histoire.)
- **PAS de centrage horizontal** du wordmark — alignement gauche, push éditorial.
- **PAS de bold sur le point final** s'il est déjà gras dans la famille display — uniquement changement de couleur.
- **Le halo radial doit rester subtil** (alpha ≤ 15%) — sinon on cuit le PNG en JPEG-look.

---

## Slide 02 — Big Idea

### Spec narrative
La promesse centrale, "ce qu'on défend". Une accroche courte (max 4 mots, validée par regex côté render). Corps explicatif court ~55ch / 2-3 phrases. Mode Positif éditorial.

### Layout (positions absolues)

| Élément | Position | Dimension | Style |
|---------|----------|-----------|-------|
| Background light | `top:0; left:0` | `1280×720` | `background: {{TOKEN_colors.neutrals.background_primary}}` |
| Overline `01 — BIG IDEA` | `top:88px; left:88px` | `width: 400px` | classe `.overline`, accent |
| Ligne séparatrice horizontale | `top:140px; left:88px` | `width: 48px; height: 1px` | `background: {{TOKEN_colors.secondary.main}}` |
| HEADLINE (max 4 mots) | `top:200px; left:88px` | `width: 720px` | classe `.display-xl` taille 88px |
| Subtitle italique (opt.) | `top:380px; left:88px` | `width: 600px` | display italique, taille 28px, accent |
| Body ~55ch | `top:480px; left:88px` | `width: 600px` | classe `.body-lg`, muted |
| Numéro de slide bas-droite | `top:660px; left:1144px` | `width: 80px` | mono, secondary text |

### Variables Mustache

| Placeholder | Source BIG | Contraintes | Exemple Camille |
|-------------|-----------|-------------|-----------------|
| `{{CONTENT_big_idea.eyebrow}}` | constante orchestrée | `01 — BIG IDEA` | `01 — BIG IDEA` |
| `{{CONTENT_big_idea.headline}}` | `design-specs.md §01.2` ou `pitch.md` Intention créative | **max 4 mots**, sans point final | `Un repère qui signale.` (4 mots) |
| `{{CONTENT_big_idea.subtitle}}` | optionnel — phrase mécanisme | ≤ 90 caractères, OU vide | `Pas le bateau, pas la météo — le repère.` |
| `{{CONTENT_big_idea.body}}` | `pitch.md` Intention créative — paragraphe synthétique | 2-3 phrases, ~280-400 caractères | `Pendant que la matière du marché tourbillonne, la marque se tient à part comme un point fixe. Elle ne calme rien — elle signale, et cela suffit à rendre la traversée calculable.` |

### Sources BIG par variable

- `big_idea.headline` : extraire le geste central du concept en 4 mots max depuis `design-specs.md §01.2` ("Intention créative — La Big Idea") ou `pitch.md §2` ("Intention créative").
- `big_idea.body` : paragraphe court qui condense l'intention — pas de jargon, présent énonciatif.

### Validation render

```python
words = re.findall(r"\S+", headline.strip().rstrip('.'))
assert len(words) <= 4, f"HEADLINE doit faire max 4 mots, en a {len(words)}: '{headline}'"
```

### Anti-patterns spécifiques

- **PAS de bullets** sur la Big Idea — c'est une slide manifeste, pas une slide de specs.
- **PAS de chiffres** dans le HEADLINE — le chiffre va sur d'autres slides (méthode, KPI).
- **PAS plus de 4 mots** dans le HEADLINE — gate dur côté render-deck.py.
- **PAS de citation entre guillemets** dans le HEADLINE — la slide N'EST PAS une citation, c'est notre promesse.

---

## Slide 03 — Méthode

### Spec narrative
3 ou 4 étapes / piliers de la méthode. Grille à colonnes égales, dividers verticaux 1px entre colonnes. Mode Positif. Chaque colonne porte : numéro mono accent, titre display, micro-description.

### Layout (positions absolues — 3 OU 4 colonnes)

Pour **3 colonnes** (largeur colonne = 360px, gap = 24px, marges latérales = 88px chacune) :

| Élément | Position | Dimension | Style |
|---------|----------|-----------|-------|
| Background light | `top:0; left:0` | `1280×720` | `background: {{TOKEN_colors.neutrals.background_primary}}` |
| Overline `02 — MÉTHODE` | `top:88px; left:88px` | `width: 400px` | classe `.overline`, accent |
| HEADLINE | `top:144px; left:88px` | `width: 800px` | classe `.display-lg` |
| Colonne 1 | `top:340px; left:88px` | `width: 320px` | — |
| Divider 1 vertical | `top:340px; left:432px` | `width: 1px; height: 280px` | `background: {{TOKEN_colors.neutrals.border}}` |
| Colonne 2 | `top:340px; left:456px` | `width: 320px` | — |
| Divider 2 vertical | `top:340px; left:800px` | `width: 1px; height: 280px` | `background: {{TOKEN_colors.neutrals.border}}` |
| Colonne 3 | `top:340px; left:824px` | `width: 320px` | — |

Pour **4 colonnes** (largeur colonne = 256px, gap = 24px) :

| Élément | Position | Dimension |
|---------|----------|-----------|
| Colonne 1 | `top:340px; left:88px` | `width: 232px` |
| Divider 1 | `top:340px; left:344px` | `width: 1px; height: 280px` |
| Colonne 2 | `top:340px; left:368px` | `width: 232px` |
| Divider 2 | `top:340px; left:624px` | `width: 1px; height: 280px` |
| Colonne 3 | `top:340px; left:648px` | `width: 232px` |
| Divider 3 | `top:340px; left:904px` | `width: 1px; height: 280px` |
| Colonne 4 | `top:340px; left:928px` | `width: 232px` |

### Structure d'une colonne

| Sous-élément | Position relative (offset depuis top de colonne) | Style |
|--------------|-------------------------------------------------|-------|
| Numéro `01.` | `+0px` | mono, accent, font-size 28px |
| Titre étape | `+56px` | classe `.display-md`, font-size 30px |
| Description | `+120px` | classe `.body-base`, text_secondary |

### Variables Mustache

| Placeholder | Source BIG | Contraintes | Exemple Camille |
|-------------|-----------|-------------|-----------------|
| `{{CONTENT_methode.eyebrow}}` | constante | `02 — MÉTHODE` | `02 — MÉTHODE` |
| `{{CONTENT_methode.headline}}` | `pitch.md` ou `design-specs.md §01.3` | 1 phrase, ≤ 80 caractères | `Trois mouvements pour un repère qui tient.` |
| `{{CONTENT_methode.steps}}` | `pitch.md` (étapes méthode) OU fallback `design-specs.md §01.3` (territoires) | **3 ou 4 étapes**, chacune : `{number, title, body}` | voir ci-dessous |

Exemple `steps` pour Camille (fallback territoires sémantiques) :
```json
[
  {"number": "01.", "title": "Dévoilement", "body": "Cartographier le marché et la position actuelle avec une rigueur chirurgicale."},
  {"number": "02.", "title": "Cap long terme", "body": "Calibrer une trajectoire tangible — coordonnées datées, jalons codifiés."},
  {"number": "03.", "title": "Ralliement", "body": "Installer le repère qui tient et coordonne les équipes sur la durée."}
]
```

### Sources BIG par variable

- `methode.steps` : si `pitch.md` documente explicitement un process/étapes méthode → extraire. Sinon FALLBACK : extraire 3 territoires sémantiques de `design-specs.md §01.3` (territoire principal/secondaire/tertiaire), reformulés comme étapes actionnables.
- `methode.headline` : phrase d'introduction qui chapeaute les 3-4 étapes.

### Validation render

```python
n_steps = len(steps)
assert n_steps in (3, 4), f"Méthode doit avoir 3 ou 4 étapes, en a {n_steps}"
```

### Anti-patterns spécifiques

- **PAS de 5+ colonnes** — le viewport 1280px ne le supporte pas sans craquer la lisibilité.
- **PAS d'icônes** dans les colonnes — uniquement texte structuré (numéro + titre + body).
- **PAS de tracé décoratif** (flèches, sparklines) — le rythme tient par la grille seule.
- Les numéros restent en mono accent — pas de gras display.

---

## Slide 04 — CTA

### Spec narrative
Slide de clôture. Statement display centré (ou aligné gauche selon ton brand). Bouton CTA + email/URL en mono. Mode Dark Cinema (symétrie chromatique avec la Cover).

### Layout (positions absolues)

| Élément | Position | Dimension | Style |
|---------|----------|-----------|-------|
| Background dark | `top:0; left:0` | `1280×720` | `background: {{TOKEN_colors.primary.main}}` |
| Halo radial décoratif | `top:0; left:0` | `1280×720` | `background: radial-gradient(circle at 22% 78%, {{TOKEN_colors.secondary.main}}1F 0%, transparent 55%)` (symétrie cover : bottom-left au lieu de top-right) |
| Statement | `top:240px; left:88px` | `width: 1104px` | classe `.display-xl` taille 56px, leading 1.15 |
| Bouton CTA | `top:480px; left:88px` | `width: 240px; height: 56px` | `background: {{TOKEN_colors.secondary.main}}; border-radius: {{TOKEN_ui_physics.radius.xl}}` ; texte centré en flex |
| Contact email/URL | `top:560px; left:88px` | `width: 600px` | mono, secondary text |
| Wordmark bas-droite | `top:648px; left:1040px` | `width: 152px` | display, taille 28px |

### Variables Mustache

| Placeholder | Source BIG | Contraintes | Exemple Camille |
|-------------|-----------|-------------|-----------------|
| `{{CONTENT_cta.statement}}` | `pitch.md` (clôture) OU `design-specs.md §01.5` (Ancre de Posture) | 1-2 phrases, ≤ 180 caractères | `Vous cherchez un point fixe ? Tenons le repère ensemble.` |
| `{{CONTENT_cta.label}}` | déduit du concept | verbe d'action, ≤ 24 caractères | `Prendre le quart →` |
| `{{CONTENT_cta.contact}}` | mock contact ou placeholder | format URL ou email | `camille.studio · 2026` (placeholder si absent) |
| `{{CONTENT_cta.brand}}` | nom marque | identique cover | `camille.` |

### Sources BIG par variable

- `cta.statement` : reformulation actionnable de l'Ancre de Posture (`§01.5`) ou clôture du pitch.
- `cta.label` : verbe d'action cohérent avec le voice tone (cf `§01.4`). Si la marque a un vocabulaire signature, le réinjecter (ex: pour Camille, "Prendre le quart", "Calibrer la traversée" — vocabulaire instrumental marine).
- `cta.contact` : si le pack ne contient pas de coordonnées concrètes, utiliser un placeholder cohérent (ex: `{brand}.studio · {year}`).

### Anti-patterns spécifiques

- **PAS de bouton "Click here"** — toujours un verbe d'action contextuel.
- **PAS de gros logo** sur la CTA — uniquement le wordmark mini bas-droite.
- **PAS d'email réel inventé** (`contact@camille.com`) — utiliser un placeholder neutre (`{brand}.studio · {year}` ou similaire).
- **Symétrie chromatique avec la Cover** : même fond Dark Cinema, halo en position miroir (bottom-left vs top-right de la cover).

---

## Règles transverses (s'appliquent aux 4 slides)

Issues de `lib/design-compliance-checker.md` :

| Règle | Application |
|-------|------------|
| Pas de CSS variables `var(--…)` à l'exécution | Toutes les `var(...)` sont résolues côté Python avant capture |
| Pas de `right:` / `bottom:` | Toutes positions en `top` + `left` (formules `left = 1280 - right - width`) |
| Pas de coordonnées négatives | top, left ≥ 0 |
| `left + width ≤ 1280` et `top + height ≤ 720` | Tous éléments dans le viewport |
| Pas de pseudo-éléments `::before` / `::after` | Éléments HTML réels |
| Pas de `clip-path` CSS | Pas utilisé dans nos 4 slides |
| Pas de `display: grid` pour layout principal | `position: absolute` partout |
| Flexbox autorisé pour centrer le texte du bouton CTA | Pattern unique : bouton seul |
| Width OBLIGATOIRE sur chaque bloc de texte | Toujours déclarée explicitement |
| Pas de `color: rgba()` sur du texte | Couleur HEX pré-calculée |
| Diacritiques UTF-8 obligatoires | é, è, ê, à, â, ô, ù, û, ç, î, ï |

---

## Récap variables totales

26 placeholders au total :
- Tokens (16) : `{{TOKEN_colors.primary.main}}`, `{{TOKEN_colors.secondary.main}}`, `{{TOKEN_colors.neutrals.background_primary}}`, `{{TOKEN_colors.neutrals.text_primary}}`, `{{TOKEN_colors.neutrals.text_secondary}}`, `{{TOKEN_colors.neutrals.border}}`, `{{TOKEN_colors.neutrals.white}}`, `{{TOKEN_typography.display.family}}`, `{{TOKEN_typography.display.weight}}`, `{{TOKEN_typography.display.tracking}}`, `{{TOKEN_typography.display.leading}}`, `{{TOKEN_typography.body.family}}`, `{{TOKEN_typography.body.leading}}`, `{{TOKEN_typography.data.family}}`, `{{TOKEN_ui_physics.radius.xl}}`, `{{TOKEN_ui_physics.grid_unit}}`
- Contenu (10) : `{{CONTENT_cover.brand}}`, `{{CONTENT_cover.tagline}}`, `{{CONTENT_cover.metadata}}`, `{{CONTENT_big_idea.eyebrow}}`, `{{CONTENT_big_idea.headline}}`, `{{CONTENT_big_idea.subtitle}}`, `{{CONTENT_big_idea.body}}`, `{{CONTENT_methode.eyebrow}}`, `{{CONTENT_methode.headline}}`, `{{CONTENT_methode.steps}}`, `{{CONTENT_cta.statement}}`, `{{CONTENT_cta.label}}`, `{{CONTENT_cta.contact}}`, `{{CONTENT_cta.brand}}`

(Note : `{{CONTENT_methode.steps}}` est un array — résolution spéciale dans `render-deck.py` : génère N colonnes en bouclant sur les items.)
