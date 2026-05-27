---
name: generate-mini-deck
description: Sous-skill autonome du SPG (Slide Presentation Generator). Génère 6 PNG d'archétypes ciblés (Cover · Case Study · Data Viz · Dashboard KPI · Process/Timeline · Icon Grid) à partir d'un pack BIG. Branchable depuis le skill brand-book ou invoqué en mode standalone. Architecture v2 — consomme Phase 0 SPG (Sub0-A + Sub0-B mode mini) et content-mapper avec voice de marque.
---

# Mini Deck Generator v2 — Sous-skill du SPG

Produit **6 slides PNG** (2560×1440, viewport canonique SPG capturé en retina 2x) à partir d'un pack `/brand-identity` complet, en **réutilisant les sub-agents Phase 0 du SPG** (Sub0-A analyse visuelle, Sub0-B génération design language) et en y ajoutant un **content-mapper** dédié au vocabulaire de la marque.

**Différence majeure vs v1** : v1 utilisait des templates Mustache figés (Cover/Big Idea/Méthode/CTA). v2 **consomme l'intelligence du SPG** : Sub0-A produit un rapport visuel structuré, Sub0-B produit le design-language.md + slide-examples HTML avec 6 archétypes ciblés, content-mapper réécrit le texte selon la voice Camille Le Phare.

**Invocation** :
- Mode standalone : appelé par Charles ou Claude Code avec `{pack_path, brand_slug, output_dir}`
- Mode sub-skill : appelé par `brand-book/SKILL.md` (Étape 4bis "Génération mini-deck")

---

## MAPPING DES 6 ARCHÉTYPES (figé)

| Position mini-deck | Archétype SPG | Index SPG | Quand l'utiliser |
|---|---|---|---|
| 1 | **COVER** | #1 | Slide d'ouverture (titre de présentation, nom prospect) |
| 2 | **CASE STUDY** | #12 | Résultat client (chiffres en gros) |
| 3 | **DATA VISUALIZATION** | #9 | Graphique central (donut, bar, area chart SVG) |
| 4 | **DASHBOARD / KPIs** | #10 | Tableau de bord — plusieurs KPI synthétiques côte à côte |
| 5 | **PROCESS / TIMELINE** | #7 | Étapes séquentielles (3-5 steps) |
| 6 | **ICON GRID** | #19 | Grille d'icônes ou pictos pour cataloguer une offre / des fonctionnalités |

Cette sélection couvre les 6 moments-clés d'un pitch B2B : ouverture, preuve client, démonstration chiffrée, dashboard de pilotage, méthodologie, catalogue de l'offre. Les `{slides_a_generer}` passées à Sub0-B sont **"slides 1, 7, 9, 10, 12, 19"** (les indices SPG des 6 archétypes ciblés).

---

## INPUTS

| Argument | Description | Exemple |
|----------|-------------|---------|
| `pack_path` | Path absolu du dossier pack BIG | `/…/camille-identity-le-phare-de-ralliement` |
| `brand_slug` | Slug court (snake-case) | `camille-le-phare` |
| `output_dir` | Dossier où écrire les livrables | `/…/brand-book/outputs/camille-test-v2/pitch-deck-mini-v2/` |

### Pack BIG attendu (`{pack_path}`)

| Fichier | Rôle | Bloquant ? |
|---------|------|------------|
| `{brand}-design-specs.md` | Source de vérité (12 sections, tokens, voice) | OUI |
| `{brand}-pitch.md` | Récit narratif du concept | OUI |
| `{brand}-style-tile.html` | Style-tile HTML (analyse visuelle Sub0-A) | OUI |
| `{brand}-batch2.html` | Batch 2 HTML — composants UI (analyse Sub0-A) | OUI |
| `{brand}-batch3.html` | Batch 3 HTML — sections éditoriales (analyse Sub0-A) | OUI |

---

## OUTPUTS

Dans `{output_dir}` :

```
{output_dir}/
├── slide-examples-customized.html   ← 6 slides finales avec contenu Camille Le Phare
├── content-mapping.json             ← variables adaptées + sources (audit)
├── slide-01-cover.png               ← 2560×1440 (retina ×2)
├── slide-02-case-study.png          ← 2560×1440 (retina ×2)
├── slide-03-data-viz.png            ← 2560×1440 (retina ×2)
├── slide-04-dashboard-kpi.png       ← 2560×1440 (retina ×2)
├── slide-05-process-timeline.png    ← 2560×1440 (retina ×2)
└── slide-06-icon-grid.png           ← 2560×1440 (retina ×2)
```

Et secondaire (créé une fois par brand, dans le dossier SPG) :

```
/SPG/brands/{brand_slug}/
├── identity/                      ← copie locale du pack BIG (lue par Sub0-A)
│   ├── {brand}-style-tile.html
│   ├── {brand}-batch2.html
│   ├── {brand}-batch3.html
│   ├── {brand}-design-specs.md
│   └── {brand}-pitch.md
├── VISUAL-ANALYSIS.md             ← produit par Sub0-A (8 sections, ~20-25 KB)
├── design-language.md             ← produit par Sub0-B (personnalité, vocabulaire, anti-patterns, assets SVG)
└── slide-examples-mini.html       ← produit par Sub0-B mode mini (6 archétypes ciblés)
```

---

## FICHIERS DE RÉFÉRENCE

### Lus en amont par l'orchestrateur (pour passer les chemins aux sub-agents)

| Fichier | Ce qu'il contient | Utilisé par |
|---------|-------------------|-------------|
| `/SPG/.claude/skills/generate-slides/SKILL.md` | Prompts canoniques Sub0-A (L122-239) et Sub0-B (L256-453) | Sub-agents A et B |

### Lus par Sub0-A (analyse visuelle)

- Les 3 fichiers HTML du pack identity ({brand}-style-tile.html, {brand}-batch2.html, {brand}-batch3.html)

### Lus par Sub0-B (génération design language + 6 slides)

Le sub-agent reçoit son prompt canonique du SPG (cf SKILL.md du SPG L256-453) + une **liste de 5 libs créatives à lire EN PLUS** pour garantir la qualité visuelle :

| Lib créative | Pourquoi |
|---|---|
| `/SPG/lib/presentation-excellence.md` | 9 principes universels (Action Titles, glance test, densité) |
| `/SPG/lib/visual-arbitration-rules.md` | Placeholder vs SVG vs mockup |
| `/SPG/lib/design-compliance-checker.md` | 39 règles HTML/PPTX bloquantes |
| `/SPG/lib/creativity-levels.md` | Niveau 3 Audacieux par défaut |
| `/SPG/lib/brand-token-extractor.md` | Règles d'extraction style guide → tokens |

Plus le `VISUAL-ANALYSIS.md` produit par Sub0-A.

### Lus par content-mapper (Sub-agent C)

- `{pack_path}/{brand}-pitch.md` (concept, voice, vocabulaire signature)
- `{pack_path}/{brand}-design-specs.md` (preferred_words, forbidden_words, ICP)
- `/SPG/brands/{brand_slug}/design-language.md` (anti-patterns, principes)
- `/SPG/brands/{brand_slug}/slide-examples-mini.html` (compositions à NE PAS modifier)
- `/SPG/lib/presentation-excellence.md` (règles rédactionnelles)

---

## WORKFLOW — 5 étapes

### Étape 1 — Préparation dossier identity (orchestrateur)

**Exécuteur** : orchestrateur (Bash + Read)

1. Identifier `{brand}` = préfixe des fichiers du pack (ex `camille-design-specs.md` → `camille`)
2. Vérifier les 5 fichiers bloquants existent dans `{pack_path}`
3. Créer `/SPG/brands/{brand_slug}/identity/` si absent
4. Copier les 5 fichiers du pack BIG vers `identity/` **sans renommage** (préfixe `{brand}-` conservé, convention SPG)
5. Vérifier si les fichiers suivants existent déjà :
   - `/SPG/brands/{brand_slug}/VISUAL-ANALYSIS.md` → si oui, skip Étape 2
   - `/SPG/brands/{brand_slug}/design-language.md` + `slide-examples-mini.html` (avec 6 slides aux archétypes 1, 7, 9, 10, 12, 19) → si oui, skip Étape 3

**Quality gate** :
- `STATUS: OK` → continuer
- `STATUS: BLOCKED` → 1 ou plusieurs des 5 fichiers du pack BIG manquants

---

### Étape 2 — Sub0-A · Analyse visuelle (sub-agent)

**Exécuteur** : sub-agent Task tool `general-purpose`

**Prompt** : reprise EXACTE du prompt Sub0-A du SPG (cf `/SPG/.claude/skills/generate-slides/SKILL.md` L122-239).

Variables à substituer dans le prompt :
- `{marque}` = `{brand_slug}` (ex `camille-le-phare`)
- `{chemins_brand_identity}` = chemins absolus des 3 HTML dans `/SPG/brands/{brand_slug}/identity/`

**Output produit** : `/SPG/brands/{brand_slug}/VISUAL-ANALYSIS.md` (~20-25 KB, 8 sections obligatoires)

**Quality gate** :
- `STATUS: OK` si VISUAL-ANALYSIS.md écrit avec les 8 sections
- `STATUS: BLOCKED` sinon (questions remontées à l'utilisateur)

**Skip condition** : si VISUAL-ANALYSIS.md existe déjà → skip cette étape (compatibilité brand-book itérations).

---

### Étape 3 — Sub0-B mode MINI · Design language + 6 archétypes (sub-agent)

**Exécuteur** : sub-agent Task tool `general-purpose`

**Prompt** : reprise EXACTE du prompt Sub0-B du SPG (cf `/SPG/.claude/skills/generate-slides/SKILL.md` L256-453).

Variables à substituer dans le prompt :
- `{marque}` = `{brand_slug}`
- `{slides_a_generer}` = **"slides 1, 7, 9, 10, 12, 19"** (les 6 archétypes ciblés du mapping)
- `{mode_batch}` = `PREMIER_BATCH` (un seul batch pour les 6 slides)
- `{bloc_style_si_batch_suivant}` = vide (pas de batch précédent)
- `{html_reference_si_batch_suivant}` = vide

**Ajout au prompt canonique** : l'orchestrateur ajoute une section "LIBS CRÉATIVES À LIRE EN PLUS" en tête du prompt avec les 5 libs (`presentation-excellence.md`, `visual-arbitration-rules.md`, `design-compliance-checker.md`, `creativity-levels.md`, `brand-token-extractor.md`). Ces libs renforcent la qualité éditoriale et la compliance PPTX.

**Adaptation tonalité au mode mini** : la consigne SPG canonique "Produire des exemples dans LES DEUX tonalités, ratio ~54/46 dark/light" est adaptée pour 6 slides comme suit :

**Règle d'alternance obligatoire** :
- Slide 1 COVER : DARK (signature d'ouverture, atmosphère brand)
- Au moins 2 slides LIGHT sur les 6 (jamais full-dark)
- Pas d'enchaînement de 3+ slides dans la même tonalité
- Pattern recommandé : **Dark · Light · Dark · Light · Dark · Light**
  (alternance stricte sur 6, terminaison Light qui ouvre vers la suite du
  pitch ou un Q&A)
  OU variations selon le ratio recommandé dans VISUAL-ANALYSIS.md section 7
  (ex Dark · Light · Dark · Light · Light · Dark si la marque tend dark)

**Justification** : SPG complet alterne sur 24 slides via ratio ~54/46.
Sur 6 slides, l'alternance doit être PLUS marquée car la fatigue chromatique
s'installe plus vite. Pas d'enchaînement de 3+ slides dans la même tonalité.

**Output produit** :
- `/SPG/brands/{brand_slug}/design-language.md` (personnalité, vocabulaire visuel, anti-patterns, palette tonale, assets SVG)
- `/SPG/brands/{brand_slug}/slide-examples-mini.html` (6 slides assemblées : `<style>` + 6 `.slide` divs + marqueurs ASSEMBLY)

**Quality gate** :
- `STATUS: OK` si les 2 fichiers sont écrits + `node scripts/validate-pptx.js slide-examples-mini.html` passe sans erreurs
- `STATUS: BLOCKED` sinon

**Skip condition** : si `design-language.md` ET `slide-examples-mini.html` (avec EXACTEMENT 6 slides correspondant aux archétypes 1, 7, 9, 10, 12, 19) existent déjà → skip. Sinon → exécuter (même si design-language.md existe, on régénère car le slide-examples peut être périmé).

---

### Étape 4 — Content-mapper (sub-agent C)

**Exécuteur** : sub-agent Task tool `general-purpose`

**Mission** : adapter le contenu textuel des 6 slides au vocabulaire de la marque, **sans modifier les compositions visuelles** (mêmes layouts, mêmes couleurs, mêmes SVG, mêmes positions absolute).

**Prompt** : voir `ref/prompts/content-mapper.md`.

Variables passées :
- `pack_path`, `brand_slug`, `output_dir`
- Path du `slide-examples-mini.html` (input)
- Path du `design-language.md` (référence anti-patterns)
- Path du `pitch.md` et `design-specs.md` du pack BIG
- Path de `presentation-excellence.md` (règles rédactionnelles)

**Output produit** :
- `{output_dir}/slide-examples-customized.html` (6 slides avec contenu Camille Le Phare)
- `{output_dir}/content-mapping.json` (audit : pour chaque slide, quel texte a changé et pourquoi)

**Voice à respecter strictement** (extraite de `{brand}-design-specs.md §01.4` Camille Le Phare) :
- **Preferred** : repère, signal, traversée, ralliement, quart, cap, coordonnées, calibré, veille, foyer, instrument, codifié, cadence, portée, éphéméride, surplomb, bordée
- **Forbidden** : disruption, synergies, leverage, game-changer, exclamations, "très", "significativement", "considérablement"
- **Tone** : phrases courtes, présent énonciatif, données chiffrées datables, métaphores tenues de bout en bout

**Quality gate** :
- `STATUS: OK` si :
  - Les 6 slides ont leur contenu textuel adapté
  - Aucun mot du forbidden_words n'apparaît
  - Au moins 6 preferred_words sont utilisés dans l'ensemble du deck
  - Les compositions (CSS classes, position absolute, SVG) sont **inchangées** vs slide-examples-mini.html
- `STATUS: BLOCKED` sinon

---

### Étape 5 — Capture PNG (orchestrateur)

**Exécuteur** : script Python Playwright (réutilisation du pattern `capture-style-tile.py` du brand-book, adapté pour capturer chaque `.slide` individuellement)

**Script** : `scripts/capture-slides-png.py`

Commande :
```bash
python3 "{this_skill}/scripts/capture-slides-png.py" \
  "{output_dir}/slide-examples-customized.html" \
  "{output_dir}"
```

Le script :
1. Lance headless Chromium avec `device_scale_factor=2` (capture retina ×2)
2. Viewport canonique 1280×720 par slide (rendu CSS) → PNG finale 2560×1440 (pixels physiques)
3. Wait : `networkidle` + `document.fonts.ready` + 1.5s buffer
4. Pour chaque `.slide` (6 au total) : `bounding_box()` + `page.screenshot(clip=...)` à 1280×720 (CSS) capturé en retina 2x
5. Nommage figé :
   - `slide-01-cover.png`
   - `slide-02-case-study.png`
   - `slide-03-data-viz.png`
   - `slide-04-dashboard-kpi.png`
   - `slide-05-process-timeline.png`
   - `slide-06-icon-grid.png`

**Quality gate** :
- `STATUS: OK` si 6 PNG produites (chacune ~700KB-1.5MB en retina)
- `STATUS: BLOCKED` si Playwright non installé OU < 6 slides détectées dans le HTML

---

## RÈGLES NON-NÉGOCIABLES

1. **Réutilisation stricte des prompts Sub0-A et Sub0-B du SPG** — pas de version simplifiée, sinon on perd le cerveau (catalogue 24 types, 39 règles PPTX, gestion light/dark, assets SVG, etc.)
2. **Mapping figé 6 archétypes** — toujours les mêmes indices SPG (1, 7, 9, 10, 12, 19), même ordre, même nommage PNG
3. **Mode PREMIER_BATCH unique** — pas de découpage en 2 batches pour 6 slides (le budget tokens tient largement)
4. **Voice de marque sacrée** — utiliser les `preferred_words` du pack BIG, JAMAIS les `forbidden_words`. Content-mapper applique cette règle.
5. **Compositions intouchables par content-mapper** — il modifie le TEXTE, pas les divs/SVG/CSS/positions. Le visuel vient de Sub0-B (qui a digéré VISUAL-ANALYSIS.md).
6. **Diacritiques UTF-8 obligatoires** — é, è, ê, à, â, ô, ù, û, ç, î, ï (jamais d'entités HTML, jamais d'ASCII forcé)
7. **Aucun fichier généré dans `/tmp/`** — toujours `{output_dir}` ou `/SPG/brands/{brand_slug}/`
8. **Skip intelligent** — Sub0-A et Sub0-B sont skippés si leurs outputs existent déjà ET sont à jour (vérification du nombre de slides + indices archétypes pour Sub0-B). Content-mapper et capture PNG s'exécutent toujours.

---

## DÉPENDANCES EXTERNES

### Python + Playwright (pour capture-slides-png.py)

```bash
pip install playwright
playwright install chromium
```

Si non installé, le script échoue avec message explicite + commande d'installation.

### Node.js (pour validate-pptx.js)

`/SPG/scripts/validate-pptx.js` validé que Sub0-B produit du HTML PPTX-compatible. Pas de dépendance pip.

### Google Fonts

Les fonts sont chargées dynamiquement via `<link>` Google Fonts dans le `<head>` du slide-examples HTML produit par Sub0-B. Pas de self-hosting.

---

## CE QUI N'EST PAS DANS CE SKILL

- **Export PPTX** : pas implémenté ici. Le slide-examples-customized.html contient le bouton export si Sub0-B l'a inclus dans le SCRIPT, mais le mini-deck v2 livre des PNG.
- **Slides supplémentaires hors mapping** : hors périmètre. Si besoin d'un mapping différent → modifier la table des 6 archétypes et la variable `{slides_a_generer}`.
- **Itération sur le contenu après capture** : pour modifier un texte, ré-éditer `slide-examples-customized.html` puis relancer `scripts/capture-slides-png.py` uniquement (pas besoin de relancer Sub0-A/B).
- **Animation** : aucune. Snapshot statique pour PNG.

---

## INTÉGRATION DEPUIS BRAND-BOOK

À l'**Étape 4bis** de `brand-book/SKILL.md`, brand-book lance un sub-agent qui invoque ce skill avec :
- `pack_path` = path du pack BIG source
- `brand_slug` = slug court (ex `camille-le-phare`)
- `output_dir` = `{brand_book_output}/pitch-deck-mini-v2/`

Le sub-agent lit ce SKILL.md et exécute les 5 étapes. Brand-book lit ensuite les 6 PNG depuis `pitch-deck-mini-v2/` pour les injecter en section dédiée du `{brand}-brand-book.html`.

**Pas d'invocation Python pilote** — le sub-agent dédié garde l'isolation des contextes (le SPG ne pollue pas brand-book).

---

## DIFFÉRENCES v1 → v2

| Aspect | v1 (templates Mustache) | v2 (Phase 0 SPG, 6 slides retina) |
|---|---|---|
| Architecture | 4 templates HTML figés, render Python | 3 sub-agents (Sub0-A + Sub0-B + content-mapper) + capture PNG |
| Cerveau | Aucun — substitution `{{TOKEN_x}}` | Sub0-A digère 3 HTML brand identity, Sub0-B produit design-language + 6 slides PPTX-compatible avec libs créatives |
| Slides | 4 (Cover/Big Idea/Méthode/CTA) | 6 (Cover/Case Study/Data Viz/Dashboard KPI/Process/Icon Grid) — alternance dark/light obligatoire |
| Résolution PNG | 1280×720 (1×) | 2560×1440 (retina ×2) — net à toute échelle dans brand book |
| Tokens | Extraction CSS basique | Tokens incluses dans le design-language + Sub0-B applique les 39 règles PPTX |
| Voice de marque | Substitution textuelle | Content-mapper dédié avec preferred/forbidden_words du pack BIG |
| Compositions | 4 templates rigides | 6 compositions générées dynamiquement par Sub0-B en s'inspirant de VISUAL-ANALYSIS.md |
| Coût | ~3K tokens Python | ~150-200K tokens sub-agents (mais cerveau réel, qualité élite) |
