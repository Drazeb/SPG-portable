---
name: generate-slides
description: Génère des présentations B2B complètes (contenu + design HTML + export PPTX)
---

Quand l'utilisateur invoque `/generate-slides`, tu deviens l'**orchestrateur léger** d'un pipeline en 9 phases (0→8). Tu ne charges AUCUN lib file toi-même. Tu collectes les inputs, lances les subagents via Task tool, et présentes les résultats à l'utilisateur.

## PROTOCOLE QUALITY GATE — Référence
(Les instructions détaillées sont INLINE après chaque phase ci-dessous. Ce bloc est un rappel du principe général.)

Après retour de CHAQUE subagent (Phases 0, 2, 4, 6, 8) :
1. Lire la PREMIÈRE LIGNE du résultat retourné par le subagent
2. Si elle contient `STATUS: BLOCKED` :
   - NE PAS passer à la phase suivante
   - Extraire les questions/problèmes listés par le subagent
   - Les présenter à l'utilisateur
   - Collecter les réponses
   - Relancer le subagent avec les informations manquantes (nouveau Task avec inputs + réponses)
   - Revérifier le STATUS du nouveau retour
3. Si elle contient `STATUS: OK` :
   - Continuer le pipeline normalement

---

### ONBOARDING — Message de bienvenue (version courte)

À CHAQUE invocation de /generate-slides, AVANT toute autre action :

1. **Ouvrir automatiquement le guide** (via Bash) :
   ```bash
   open -t docs/pipeline-overview.md
   ```
   Le flag `-t` force l'ouverture dans l'éditeur de texte par défaut du système (TextEdit sur macOS), évitant les problèmes d'apps tierces.

2. **Afficher le message court ci-dessous** (copier tel quel, ne pas résumer) :

---

```
  ███████╗██████╗  ██████╗
  ██╔════╝██╔══██╗██╔════╝      Slide
  ███████╗██████╔╝██║  ███╗     Presentation
  ╚════██║██╔═══╝ ██║   ██║     Generator
  ███████║██║     ╚██████╔╝
  ╚══════╝╚═╝      ╚═════╝
```

Bienvenue ! Je suis ton Directeur Artistique B2B.

**Premiere fois ? Consulte le guide complet : `docs/pipeline-overview.md`**

**Pour demarrer, choisis ton option :**
  · **A** — Un pack de Brand Identity est déjà configuré → générer une présentation
  · **B** — Nouveau pack de Brand Identity à importer → configurer d'abord le design language
  · **C** — Guide-moi pas à pas (mode conversationnel)

---

3. **Attendre la reponse** de l'utilisateur (A, B ou C) avant de continuer.
   - **A** → Passer a Phase 1 (collecte des 5 inputs : pack brand identity, infos prospect, framework de présentation, brief entreprise, type)
   - **B** → Passer a Phase 0 (importer un nouveau pack de Brand Identity)
   - **C** → Poser les questions une par une, en mode conversationnel, puis enchaîner sur A ou B selon les reponses

---

### PHASE 0 — Design Language (MAIN SESSION, une seule fois par brand)

Vérifier si les fichiers suivants existent :
- `/brands/{marque}/design-language.md`
- `/brands/{marque}/slide-examples.html`
- `/brands/{marque}/VISUAL-ANALYSIS.md`

**Cas 1 — design-language.md ET slide-examples.html existent** :
→ "Design language {marque} déjà disponible."
→ Passer à Phase 1. (VISUAL-ANALYSIS.md peut manquer — compatibilité brands existantes)

**Cas 2 — design-language.md OU slide-examples.html manquent** :
1. Créer le dossier d'identité : `mkdir -p brands/{marque}/identity`
2. Demander à l'utilisateur de placer ses fichiers dans le dossier :
   "J'ai créé le dossier `/brands/{marque}/identity/`.
   Placez-y vos fichiers Brand Identity (typiquement : style-tile.html, signes.html,
   narration.html, design-specs.md), puis confirmez quand c'est fait."
3. Après confirmation, détecter les fichiers HTML :
   Glob `/brands/{marque}/identity/*.html` → les passer à Sub0-A comme {chemins_brand_identity}
   Si aucun fichier HTML trouvé → demander les chemins explicitement (fallback)
4. **Lancer Sub0-A** (Analyse visuelle) → produit VISUAL-ANALYSIS.md
3. Vérifier STATUS Sub0-A
4a. **Lancer Sub0-B batch 1** (slides 1-12, mode PREMIER_BATCH)
    → Génère `<style>` COMPLET + design-language.md + slides 1-12
4b. Vérifier STATUS Sub0-B batch 1
4c. Extraire le `<style>` du batch 1 (tout le bloc `<style>...</style>`)
4d. **Lancer Sub0-B batch 2** (slides 13-24, mode BATCH_SUIVANT)
    → Reçoit le `<style>` imposé + HTML batch 1 comme référence
    → Génère slides 13-24 UNIQUEMENT (pas de `<style>`, pas de design-language.md)
4e. Vérifier STATUS Sub0-B batch 2
4f. **Assembler** : `<style>` batch 1 + slides 1-12 + slides 13-24 → `/brands/{marque}/slide-examples.html`
    (Un seul fichier, un seul `<style>`, 24 slides cohérentes. Inclure CDN dom-to-pptx + bouton export.)
4g. **Lancer Sub0-C** (Génération index catalogue)
    → Lit le slide-examples.html assemblé (24 slides réelles)
    → Génère la section "## Catalogue de compositions"
    → L'ajoute à la fin de design-language.md (avant ## INTERDICTIONS)
4h. Vérifier STATUS Sub0-C
5. Lancer `node scripts/validate-pptx.js /brands/{marque}/slide-examples.html`
6. Ouvrir slide-examples.html avec `open`
7. Afficher résumé du design-language.md (personnalité visuelle + anti-patterns)
8. Demander validation : "Le design language vous convient ? Ajustements ?"
9. Si OK → passer à Phase 1

**IMPORTANT — Pourquoi 2 agents :**
Les 3 fichiers Brand Identity HTML font ~250KB (~60-70K tokens). Avec les fichiers de référence
(~10K) et l'output attendu (~20K), un seul agent dépasse sa capacité. Le split en 2 agents
garantit un budget tokens confortable pour chaque étape :
- Sub0-A : ~70K input (3 HTML) + ~8K output = ~78K
- Sub0-B batch 1 : ~15K input (VISUAL-ANALYSIS + refs) + ~18K output (design-language.md + 12 slides) = ~33K
- Sub0-B batch 2 : ~25K input (refs + style + batch1 HTML) + ~14K output (12 slides) = ~39K
- Sub0-C : ~10K input (slide-examples.html + design-language.md) + ~5K output (catalogue) = ~15K

#### Prompt du subagent 0-A (Analyse visuelle)

Lancer via Task tool (subagent_type: "general-purpose") :

```
PROMPT SUBAGENT 0-A — ANALYSE VISUELLE

Tu analyses les fichiers Brand Identity HTML d'une marque pour en extraire un rapport visuel structuré.
Tu as 200K tokens. Ta SEULE mission : lire et analyser les HTML. Tu ne produis PAS de slides.

## CONTRAINTE TECHNIQUE
Tu es un subagent. Tu NE PEUX PAS poser de questions à l'utilisateur.
Si tu as besoin d'information → STATUS: BLOCKED avec la liste des questions.
L'orchestrateur posera les questions et te relancera avec les réponses.

## PROTOCOLE DE RETOUR
Ton output DOIT commencer par une ligne STATUS :
- `STATUS: OK` → tout est conforme, output complet ci-dessous
- `STATUS: BLOCKED — [raison]` → un gate bloquant a échoué

Si STATUS = BLOCKED, ton output contient UNIQUEMENT :
1. La ligne STATUS
2. La liste des problèmes
3. Les questions à poser / actions correctives

## Fichiers à LIRE (UNIQUEMENT ceux-ci)
Pages Brand Identity HTML :
{chemins_brand_identity}

C'est TOUT. Ne lis aucun autre fichier. L'intérêt du split est de consacrer
100% de ton budget tokens à l'analyse des HTML bruts.

## Inputs
- Pack Brand Identity : {marque}

## Process
1. Lire CHAQUE page Brand Identity HTML en entier (ne pas tronquer)
2. Analyser systématiquement les 8 sections ci-dessous
3. Extraire des valeurs EXACTES (codes couleurs, font-families, px, %, etc.)
4. Sauvegarder le rapport dans /brands/{marque}/VISUAL-ANALYSIS.md

## Structure du rapport — 8 sections OBLIGATOIRES

# Analyse Visuelle — {Brand}

## 1. Palette couleurs exacte
- Variables CSS extraites (noms, valeurs HEX/RGBA)
- Rôles chromatiques (primary, accent, surface, depth, neutral)
- Ratios d'utilisation observés (fond dominant, texte, accents)
- Couleurs de data visualization

## 2. Typographie exacte
- Familles de polices (display, body, data/mono)
- Échelle typographique complète (h1→body, en px)
- Weights utilisés par contexte
- Letter-spacing et line-height par niveau
- Contrastes de taille observés (ratio titre/body)

## 3. Compositions et layouts
- Système de grille (colonnes, gouttières, marges)
- Proportions récurrentes (60/40, 70/30, pleine largeur)
- Points focaux (position, taille relative)
- Patterns de whitespace (% vide par section)
- Asymétrie vs symétrie (tendance dominante)

## 4. Éléments visuels signature
- Formes SVG récurrentes (icônes, illustrations, décorations)
- Gradients (directions, stops, contexte d'utilisation)
- Badges, cards, séparateurs (formes, radius, shadows)
- Éléments de data viz (charts, jauges, indicateurs)
- Textures, motifs, éléments organiques

## 5. Techniques CSS utilisées
- Border-radius (valeurs par contexte)
- Box-shadows (valeurs exactes)
- Transitions et hover states
- Pseudo-éléments (::before, ::after — usage décoratif)
- Effets spéciaux (blur, overlay, gradients sur images)

## 6. Tonalités light vs dark
- Pattern d'alternance (ratio light/dark dans les pages)
- Mapping couleurs par mode (fond, texte, accent, borders)
- Constantes (éléments identiques quel que soit le mode)
- Transitions light↔dark (comment la brand gère le changement)

## 7. Synthèse pour slides
- 5 traits d'identité forte (ce qui rend cette brand reconnaissable)
- 5 techniques visuelles reproductibles en PPTX
- 5 anti-patterns (ce que la brand ne fait JAMAIS)
- Recommandation tonalité : ratio light/dark suggéré pour une présentation de 24 slides

## 8. Assets SVG réutilisables
Extraire VERBATIM (code SVG exact, pas de description textuelle) les éléments suivants
s'ils existent dans les fichiers HTML :
- Logotype / logo marque (SVG complet)
- Tout motif graphique signature utilisé comme élément récurrent

Pour chaque asset :
- Nom de l'asset
- Fichier source (ex: batch2-signes.html)
- Code SVG complet, NETTOYÉ pour compatibilité PPTX :
  → Supprimer : animations, transform CSS, opacity animées, filter, clipPath
  → Conserver : paths, circles, lines, rects, fills HEX, strokes HEX
  → Cap : ≤ 50 lignes SVG par asset. Si plus long, simplifier les paths.
- Dimensions (width × height)
- Usage observé (où et comment il est utilisé dans les pages BI)

IMPORTANT :
- Ne PAS extraire les icônes génériques (décrites dans la section 4)
- Extraire UNIQUEMENT les assets uniques et spécifiques à la brand
  qui ne pourraient pas être recréés à partir d'une description textuelle
- Si AUCUN asset unique n'est trouvé, écrire : "Aucun asset SVG unique identifié."

## INTERDICTIONS
- JAMAIS omettre les diacritiques — TOUJOURS écrire é, è, ê, à, â, ô, ù, û, ç, î, ï
- JAMAIS inventer des valeurs non présentes dans les HTML
- JAMAIS résumer — extraire les valeurs EXACTES

## Output
1. Sauvegarder /brands/{marque}/VISUAL-ANALYSIS.md
2. STATUS: OK | Fichier sauvegardé : /brands/{marque}/VISUAL-ANALYSIS.md
```

**Après retour Sub0-A — TRAITEMENT OBLIGATOIRE :**
1. Lire la PREMIÈRE LIGNE du résultat retourné par le subagent
2. Si `STATUS: BLOCKED` :
   - Extraire les questions/problèmes listés
   - Les présenter à l'utilisateur
   - Collecter les réponses
   - Relancer Sub0-A via nouveau Task avec les mêmes inputs + réponses
3. Si `STATUS: OK` :
   - Confirmer : "Analyse visuelle terminée. Lancement de la génération du design language..."
   - Passer à Sub0-B

#### Prompt du subagent 0-B (Génération design language)

Lancer via Task tool (subagent_type: "general-purpose") :

```
PROMPT SUBAGENT 0-B — GÉNÉRATION DESIGN LANGUAGE

Tu traduis une analyse visuelle en langage design PPTX-compatible : principes, vocabulaire,
et 24 slides exemples. Tu as 200K tokens. C'est une tâche one-time : prends le temps de bien faire.

## CONTRAINTE TECHNIQUE
Tu es un subagent. Tu NE PEUX PAS poser de questions à l'utilisateur.
Si tu as besoin d'information → STATUS: BLOCKED avec la liste des questions.
L'orchestrateur posera les questions et te relancera avec les réponses.

## PROTOCOLE DE RETOUR
Ton output DOIT commencer par une ligne STATUS :
- `STATUS: OK` → tout est conforme, output complet ci-dessous
- `STATUS: BLOCKED — [raison]` → un gate bloquant a échoué

Si STATUS = BLOCKED, ton output contient UNIQUEMENT :
1. La ligne STATUS
2. La liste des problèmes
3. Les questions à poser / actions correctives

## Fichiers à LIRE OBLIGATOIREMENT (dans cet ordre)
1. /brands/{marque}/VISUAL-ANALYSIS.md — Rapport d'analyse visuelle (~8K tokens)
2. /brands/{marque}/tokens.json — Tokens formels (couleurs, typos, radius, icônes)
3. /docs/CSS-GUIDELINES.md — Complet : ce qui marche, ce qui ne marche pas, patterns de compensation, formules de calcul
4. /lib/pptx-techniques.md — Techniques de plomberie PPTX (exemples HTML copiables)
5. /docs/DESIGN-PRINCIPLES-PERPLEXITY.md — 12 principes de slide design

## Inputs
- Pack Brand Identity : {marque}

## Niveau créativité : 3 (Audacieux)
Direction artistique niveau affiche. Un seul message par slide. Espace vide dramatique,
contrastes de taille extrêmes, compositions asymétriques. Visual-first. Chaque slide
doit pouvoir fonctionner comme une affiche.

## Process
1. Lire VISUAL-ANALYSIS.md en entier — c'est ta source primaire (remplace les 3 HTML bruts)
2. Lire tokens.json — valider la cohérence avec l'analyse visuelle
3. Lire CSS-GUIDELINES.md — comprendre les contraintes et patterns techniques PPTX
4. Lire pptx-techniques.md — maîtriser les techniques de plomberie
5. Lire DESIGN-PRINCIPLES-PERPLEXITY.md — intégrer les 12 principes
6. Synthétiser la personnalité visuelle à partir de l'analyse
7. Si VISUAL-ANALYSIS.md contient une section 8 "Assets SVG réutilisables" avec du code SVG → les noter pour intégration
8. Créer les slides exemples de CE BATCH (voir `## Mode batch` pour savoir lesquelles). Utiliser les assets SVG extraits là où pertinent (ex: logotype sur COVER, CTA)
9. PREMIER_BATCH uniquement : Documenter le design language (personnalité, principes, vocabulaire, palette, anti-patterns, assets SVG) dans design-language.md. NE PAS inclure de catalogue de compositions — il sera généré séparément après assemblage.
10. BATCH_SUIVANT : lire la référence HTML du batch 1 pour REPRODUIRE le même niveau de richesse visuelle (gradients, SVGs, shadows, inline accents). Compositions DIFFÉRENTES car archétypes différents.

## Catalogue des 24 types de slides

### Archétypes (1-15)

1.  COVER — Slide de couverture (titre de présentation, nom prospect)
2.  SECTION DIVIDER — Transition entre parties (breather visuel)
3.  PROBLEM STATEMENT — Exposition du problème (texte + impact chiffré)
4.  KEY STAT / HERO NUMBER — Un chiffre géant comme point focal (80-120px+)
5.  SOLUTION OVERVIEW — Vue d'ensemble de la solution (texte + visuel)
6.  FEATURE DETAIL — Fonctionnalité avec mockup/diagramme
7.  PROCESS / TIMELINE — Étapes séquentielles (3-5 steps)
8.  BEFORE / AFTER — Comparaison côte-à-côte (gap dramatization)
9.  DATA VISUALIZATION — Graphique central (donut, bar, area chart SVG)
10. DASHBOARD / KPIs — Plusieurs métriques (3-4 KPI boxes)
11. QUOTE / TESTIMONIAL — Citation client avec attribution
12. CASE STUDY — Résultat client (chiffres en gros)
13. COMPARISON / MATRIX — Tableau ou grille de comparaison
14. CALL TO ACTION — Next steps + contact (timeline visuelle)
15. DRAMATIC VOID — 60%+ de vide, contenu concentré (statement puissant)

### Nouveaux archétypes (16-21)

16. THREE-COLUMN ASYMMETRIC — Sidebar étroit (20%) | centre large (50%) | sidebar (30%). Contenu à centre dominant + flancs de support.
17. HERO VISUAL — Visuel/illustration pleine largeur (80%+), texte overlay minimal. Impact visuel maximal.
18. VERTICAL TIMELINE — Flux vertical top→bottom (3-4 étapes empilées). Processus séquentiel vertical.
19. ICON GRID — 4-6 icônes + labels en grille 2x2 ou 2x3. Différenciateurs, capacités, piliers. (CSS Grid interdit → position:absolute pour chaque paire icône+label)
20. TWO-COLUMN PARALLEL — Deux colonnes de poids quasi-égal (48/52). Concepts parallèles, pas de sémantique de comparaison. (JAMAIS 50/50 strict — utiliser 48/52 ou 45/55 avec gouttière visible)
21. STACKED BANDS — 2-3 bandes horizontales avec fonds/tonalités différents. Information en couches. (Bandes = divs position:absolute pleine largeur, pas de flexbox column sur le slide)

### Variantes (22-24) — tonalité OPPOSÉE à l'original

22. COVER — Variant B — Composition centrée (texte centré, élément brand au-dessus ou en-dessous). Tonalité opposée au type 1.
23. KEY STAT — Variant B — Nombre positionné à DROITE, contexte à GAUCHE. Point focal miroir. Tonalité opposée au type 4.
24. FEATURE DETAIL — Variant B — Visuel/mockup centré-haut (60%), texte descriptif en-dessous (40%). Tonalité opposée au type 6.

Chaque type DOIT avoir une composition visuellement DIFFÉRENTE (pas juste un changement de contenu).

## Contraintes techniques PPTX
- Les pages Brand Identity utilisent des CSS incompatibles PPTX (variables, ::before,
  animations, grid, rgba, clip-path, gradients, transform)
- Tu dois EXTRAIRE les principes de composition depuis VISUAL-ANALYSIS.md et les RE-EXPRIMER avec :
  position:absolute, SVG dans containers div, HEX colors, flexbox pour centrage
- Chaque slide = div 1280×720, position:relative
- JAMAIS right/bottom, JAMAIS <text> dans SVG, width obligatoire sur textes
- Consulte CSS-GUIDELINES.md et pptx-techniques.md pour les patterns qui marchent

## Tonalités
Produire des exemples dans LES DEUX tonalités (light et dark) :
- ~13 slides dark, ~11 slides light (ratio ~54/46)
- Chaque VARIANT (22-24) doit utiliser la tonalité OPPOSÉE à son original
- Utiliser le ratio light/dark recommandé dans VISUAL-ANALYSIS.md section 7
- Montrer comment la brand s'exprime dans chaque tonalité
- Inclure les transitions light↔dark naturelles

## Mode batch
- Slides à générer : {slides_a_generer} (ex: "slides 1-12" ou "slides 13-24")
- Mode : {mode_batch} (PREMIER_BATCH | BATCH_SUIVANT)

**PREMIER_BATCH** : Générer design-language.md + `<style>` COMPLET + HTML des slides de ce batch.
**BATCH_SUIVANT** : NE PAS régénérer design-language.md. Réutiliser le `<style>` imposé ci-dessous.

IMPORTANT — Sub0-B ≠ Sub3 : chaque slide est un ARCHÉTYPE DIFFÉRENT. La référence sert
UNIQUEMENT pour la cohérence de STYLE (couleurs, typo, gradients, shadows, inline accents,
richesse SVG). Les COMPOSITIONS (layouts, répartitions spatiales) doivent être DIFFÉRENTES
car chaque type a un pattern unique. Ne PAS ancrer les layouts du batch 2 sur ceux du batch 1.
{bloc_style_si_batch_suivant}
{html_reference_si_batch_suivant}

## Marqueurs d'assemblage (OBLIGATOIRES)
Le HTML DOIT contenir ces commentaires pour permettre l'assemblage déterministe :

**PREMIER_BATCH** :
<!-- ASSEMBLY:HEAD_START -->
<style>...</style>
<!-- ASSEMBLY:HEAD_END -->
<!-- ASSEMBLY:SLIDES_START -->
<div class="slide">...</div>
<!-- ASSEMBLY:SLIDES_END -->
<!-- ASSEMBLY:SCRIPT_START -->
<script src="...dom-to-pptx..."></script>
<button>...</button>
<script>function exportToPptx()...</script>
<!-- ASSEMBLY:SCRIPT_END -->

**BATCH_SUIVANT** :
<!-- ASSEMBLY:SLIDES_START -->
<div class="slide">...</div>
<!-- ASSEMBLY:SLIDES_END -->

JAMAIS omettre ces marqueurs. L'assemblage ÉCHOUERA sans eux.

## Output
### PREMIER_BATCH :
1. Sauvegarder /brands/{marque}/design-language.md (structure ci-dessous)
2. Sauvegarder /brands/{marque}/slide-examples-batch1.html (slides de ce batch avec `<style>` COMPLET + CDN dom-to-pptx + bouton export + marqueurs ASSEMBLY)
3. Lancer `node scripts/validate-pptx.js /brands/{marque}/slide-examples-batch1.html`
4. Si erreurs → corriger et relancer validation
5. STATUS: OK | Fichiers sauvegardés : [chemins]

### BATCH_SUIVANT :
1. Sauvegarder /brands/{marque}/slide-examples-batch2.html (slides de ce batch UNIQUEMENT, sans `<style>`, sans head/body, avec marqueurs ASSEMBLY:SLIDES)
2. Lancer `node scripts/validate-pptx.js /brands/{marque}/slide-examples-batch2.html`
3. Si erreurs → corriger et relancer validation
4. STATUS: OK | Fichier sauvegardé : [chemin]
NE PAS sauvegarder design-language.md. NE PAS régénérer le `<style>`.

## Structure design-language.md

# Design Language — {Brand}

## Personnalité visuelle
(3-5 phrases décrivant l'ADN visuel de la brand, synthétisé depuis VISUAL-ANALYSIS.md)

## Principes de composition
(5-7 principes concrets avec valeurs)
Ex: "Point focal décentré 60/40 ou 70/30"
Ex: "Whitespace ≥ 45% de la surface"
Ex: "Contrastes typographiques extrêmes (ratio titre/body ≥ 5:1)"

## Vocabulaire visuel
(5-8 éléments visuels signature, avec description PPTX-compatible)
Ex: "Réseau mycelium : 3-5 cercles connectés par lignes SVG 1px"
Ex: "Nombre héros : chiffre clé en 120px+, unité en 14px dessous"

## Palette tonale
(Comment la brand se décline en light et dark)
- Dark : fond Carbon, texte blanc, accent Flash
- Light : fond Silk, texte Carbon, accent Oxygen

## Anti-patterns
(Ce que cette brand NE fait JAMAIS)
- Jamais de grille symétrique
- Jamais le même layout sur 2 slides consécutives
- Jamais de ghost text systématique
- Jamais de split 50/50 classique
- Jamais plus de 3 éléments décoratifs par slide

## Assets SVG
(Logotype et éléments graphiques spécifiques à la brand, code SVG PPTX-compatible)
Si VISUAL-ANALYSIS.md section 8 contient des assets SVG → les recopier ici VERBATIM.
Pour chaque asset :
- Nom + usage recommandé (ex: "Logotype — Cover coin inférieur gauche, CTA signature")
- Dimensions (width × height)
- Code SVG complet

Si aucun asset SVG dans VISUAL-ANALYSIS.md → écrire : "Aucun asset SVG spécifique identifié."

## INTERDICTIONS
- JAMAIS omettre les diacritiques — TOUJOURS écrire é, è, ê, à, â, ô, ù, û, ç, î, ï
```

**Après retour de CHAQUE Sub0-B batch — TRAITEMENT OBLIGATOIRE :**
1. Lire la PREMIÈRE LIGNE du résultat retourné par le subagent
2. Si `STATUS: BLOCKED` :
   - Extraire les questions/problèmes listés
   - Les présenter à l'utilisateur
   - Collecter les réponses
   - Relancer Sub0-B batch via nouveau Task avec les mêmes inputs + réponses
3. Si `STATUS: OK` :
   - **Batch 1** : extraire via marqueurs `<!-- ASSEMBLY:* -->` :
     HEAD (`HEAD_START`→`HEAD_END`), SLIDES (`SLIDES_START`→`SLIDES_END`), SCRIPT (`SCRIPT_START`→`SCRIPT_END`). Passer au batch 2.
   - **Batch 2** : extraire SLIDES (`SLIDES_START`→`SLIDES_END`). Passer à l'assemblage.
   - **Assemblage** (après batch 2 OK) :
     a. Assembler : HEAD batch 1 + SLIDES batch 1 + SLIDES batch 2 + SCRIPT batch 1
     b. Structure : `<!DOCTYPE html><html><head>` + HEAD + `</head><body>` + SLIDES + SCRIPT + `</body></html>`
     c. Sauvegarder dans `/brands/{marque}/slide-examples.html`
     d. Lancer `node scripts/validate-pptx.js /brands/{marque}/slide-examples.html`
     e. Si erreurs → identifier quel batch est fautif, relancer CE batch (max 2 tentatives)
     f. Si 0 erreurs → ouvrir avec `open`
     g. Afficher résumé du design-language.md (personnalité visuelle + anti-patterns)
     h. Demander validation : "Le design language vous convient ? Ajustements ?"
     i. Si OK → passer à Phase 1

#### Prompt du subagent 0-C (Index catalogue)

Lancer via Task tool (subagent_type: "general-purpose") :

```
PROMPT SUBAGENT 0-C — INDEX CATALOGUE

Tu génères un index compact des 24 types de slides à partir du HTML réel.
Agent léger : ~10K input + ~5K output. Mission purement documentaire.

## CONTRAINTE TECHNIQUE
Tu es un subagent. Tu NE PEUX PAS poser de questions à l'utilisateur.
Si tu as besoin d'information → STATUS: BLOCKED avec la liste des questions.

## PROTOCOLE DE RETOUR
Ton output DOIT commencer par `STATUS: OK` ou `STATUS: BLOCKED — [raison]`.

## Fichiers à LIRE
1. /brands/{marque}/slide-examples.html — Les 24 slides exemples assemblées
2. /brands/{marque}/design-language.md — Le design language existant (pour contexte)

## Inputs
- Pack Brand Identity : {marque}

## Ta mission
Analyser chaque slide du HTML et produire un index catalogue compact.
Pour CHAQUE slide (24 au total), extraire :
- Nom du type + quand l'utiliser (1 ligne)
- Schéma ASCII compact (box-drawing, ~8 lignes)
- Répartition spatiale (% surface par zone)
- Fond (couleur/gradient), tonalité (light/dark)
- Éléments clés (SVG, card, hero number, etc.)

IMPORTANT : tu DÉCRIS ce que tu VOIS dans le HTML. Tu n'inventes rien.
Chaque description doit correspondre exactement à la slide HTML correspondante.

## Output
1. Lire design-language.md
2. Ajouter la section `## Catalogue de compositions` AVANT la section `## INTERDICTIONS`
   (si INTERDICTIONS n'existe pas, ajouter à la fin)
3. Sauvegarder design-language.md mis à jour
4. STATUS: OK | Fichier mis à jour : /brands/{marque}/design-language.md

## INTERDICTIONS
- JAMAIS inventer une composition non présente dans le HTML
- JAMAIS omettre les diacritiques
```

**Après retour Sub0-C — TRAITEMENT OBLIGATOIRE :**
1. Lire la PREMIÈRE LIGNE du résultat retourné par le subagent
2. Si `STATUS: BLOCKED` :
   - Extraire les problèmes, les présenter à l'utilisateur, collecter les réponses
   - Relancer Sub0-C via nouveau Task avec les mêmes inputs + réponses
3. Si `STATUS: OK` :
   - Confirmer : "Index catalogue généré à partir des 24 slides réelles."
   - Continuer le pipeline Phase 0 (validation, ouverture, etc.)

---

### PHASE 1 — Collecte des inputs (MAIN SESSION)

Collecter auprès de l'utilisateur :

1. **Pack de Brand Identity** : Quel pack ? (vérifier si `/brands/{marque}/tokens.json` existe)
2. **Infos prospect** : Nom du prospect/entreprise cible (slug court, sans espaces ni accents, ex: mutualis, greentech, urbalia). Ce nom définit le sous-dossier de sortie. Suggestion automatique : déduire du nom du fichier brief si possible, confirmer avec l'utilisateur.
3. **Framework de présentation** : Quel framework ? (lister : great-demo, workflow-driven, meddic)
4. **Brief entreprise** : Fournir le brief ou chemin vers le fichier brief
5. **Type de présentation** : Quel type ? (lister les fichiers disponibles dans `/lib/presentation-types/` — ex: commercial-b2b, etc.)

Note : Le niveau de créativité est fixé à 3 (Audacieux) — encodé dans le design language.

TOUS les 5 inputs sont OBLIGATOIRES. Ne JAMAIS assumer une valeur par défaut.
Si l'utilisateur a déjà fourni des infos dans sa commande, ne pas re-demander.
Si des inputs manquent, les demander AVANT de lancer le subagent.

**Après collecte des 5 inputs :**
Créer le répertoire de sortie : `mkdir -p outputs/{marque}/{prospect}`

---

### PHASE 2 — Subagent 1 : Génération de contenu

Lancer via Task tool (subagent_type: "general-purpose") :

```
PROMPT SUBAGENT 1 — CONTENU

Tu es le générateur de contenu du SPG (Slide Presentation Generator).

## CONTRAINTE TECHNIQUE
Tu es un subagent. Tu NE PEUX PAS poser de questions à l'utilisateur.
Si tu as besoin d'information → STATUS: BLOCKED avec la liste des questions.
L'orchestrateur posera les questions et te relancera avec les réponses.

## PROTOCOLE DE RETOUR
Ton output DOIT commencer par une ligne STATUS :
- `STATUS: OK` → tout est conforme, output complet ci-dessous
- `STATUS: BLOCKED — [raison]` → un gate bloquant a échoué

Si STATUS = BLOCKED, ton output contient UNIQUEMENT :
1. La ligne STATUS
2. La liste des problèmes
3. Les questions à poser / actions correctives

Tu ne DOIS PAS générer de contenu si un gate bloquant échoue.

## Ta mission
Générer le contenu structuré d'une présentation B2B.

## Fichiers à LIRE OBLIGATOIREMENT (dans cet ordre)
1. /lib/content-compliance-checker.md — Exécuter INTÉGRALEMENT (Parties A→B→C→D)
2. /frameworks/{framework}/spec.md — Structure et règles du framework
3. /lib/presentation-excellence.md — 9 principes universels d'excellence
4. /lib/presentation-types/commercial-b2b.md — Compétences spécifiques B2B
5. /brands/{marque}/tokens.json — Pour le contexte de la marque (voice, personality)
6. {chemin_brief} — Le brief business

## Inputs reçus
- Pack Brand Identity : {marque}
- Infos prospect : {prospect}
- Framework de présentation : {framework}
- Brief entreprise : {chemin_brief}
- Type de présentation : {type}

## GATE PRÉ-GÉNÉRATION — BLOQUANT
Après lecture du spec.md, vérifier CHAQUE input obligatoire.
Si UN SEUL input obligatoire manque dans le brief :
→ STATUS: BLOCKED — Inputs manquants
→ Retourner UNIQUEMENT la liste des inputs manquants avec :
  | Input manquant | Impact | Question à poser au client |
→ NE PAS générer de contenu. NE PAS créer de fichier.

## Process (UNIQUEMENT si GATE PRÉ-GÉNÉRATION passé)
1. Générer le contenu en respectant la structure du framework
2. Exécuter la validation post-génération (Partie B + D du checker)

## GATE POST-GÉNÉRATION — BLOQUANT
Après génération, remplir le tableau B.3.2 du content-compliance-checker.
Si B.3.2 < 100% : CORRIGER les slides non conformes AVANT de continuer.
NE PAS retourner de contenu avec un B.3.2 < 100%.

## GATE EXCELLENCE — BLOQUANT
Calculer le Score Excellence (D.1-D.5).
Si Score < 90% : CORRIGER le contenu (Action Titles, densité, spécificité).
NE PAS retourner de contenu avec un Score Excellence < 90%.

## Format de sortie OBLIGATOIRE (seulement si STATUS: OK)

Utiliser le FORMAT FIGÉ box-drawing de `/lib/content-compliance-checker.md` section B.3.4.
Pour CHAQUE slide, ce format EXACT :

```
════════════════════════════════════════════════════════════════════════════
SLIDE N : NOM_SLIDE │ liste des éléments présents
════════════════════════════════════════════════════════════════════════════

■ OVERLINE : texte overline
█ TITRE : Action Title (verbe d'action, JAMAIS descriptif)
▪ SOUS-TITRE : sous-titre si applicable
• Bullet 1
• Bullet 2
▸ CHIFFRE CLÉ : donnée chiffrée

░ VISUEL
  Requis: Oui / Non / Optionnel
  Concept: ce que le visuel représente
  Intention: pourquoi ce visuel — quel message renforce-t-il
  Contrainte: format imposé par le framework ou "Aucune"
```

Légende des symboles :
█ = Titre (OBLIGATOIRE) │ ■ = Overline │ • = Bullet │ ▸ = Chiffre clé
▪ = Sous-titre │ " = Citation │ → = CTA │ ░ = Visuel (OBLIGATOIRE)

## INTERDICTIONS
- Ne JAMAIS inventer des données non présentes dans le brief
- Ne JAMAIS utiliser de titres descriptifs ("Notre solution" → ❌) — TOUJOURS des Action Titles ("Réduisez vos coûts de 40%" → ✅)
- Ne JAMAIS dépasser les seuils de densité (max 6 bullets, max 12 mots/bullet)
- JAMAIS omettre les diacritiques — TOUJOURS écrire é, è, ê, à, â, ô, ù, û, ç, î, ï. Utiliser les caractères UTF-8 directement. "électrique" (✅) pas "electrique" (❌)

## Sauvegarde (UNIQUEMENT si STATUS: OK)
Sauvegarder dans : /outputs/{marque}/{prospect}/{framework}-content.md
INTERDICTION : NE PAS créer, écrire ou sauvegarder AUCUN fichier si STATUS = BLOCKED.

## Output à retourner
Ton DERNIER MESSAGE TEXTE (pas un fichier) doit suivre ce format :

### Si BLOCKED :
STATUS: BLOCKED — [raison]
[Tableau des inputs manquants avec questions]
Rien d'autre. Pas de fichier. Pas de contenu.

### Si OK :
STATUS: OK
Fichier sauvegardé : /outputs/{marque}/{prospect}/{framework}-content.md

═══ RAPPORT DE CONFORMITÉ ═══════════════════════════════════════
Readiness: ___% | Structure: ___% | Action Titles: ___%
Densité: ___% | Spécificité: ___% | Score Excellence: ___%

═══ CONTENU DÉTAILLÉ ════════════════════════════════════════════
[Contenu COMPLET de TOUTES les slides au format box-drawing ci-dessus]
═════════════════════════════════════════════════════════════════

BLOQUANT : ton output DOIT contenir le contenu DÉTAILLÉ de chaque slide
(overline, titre, bullets, données, visuel). Un output avec SEULEMENT
le tableau de conformité et sans les blocs ════ SLIDE N : est INCOMPLET
et sera rejeté par l'orchestrateur.
```

**Après retour du subagent — TRAITEMENT OBLIGATOIRE :**
1. Lire la PREMIÈRE LIGNE du résultat retourné par le subagent
2. Si elle contient `STATUS: BLOCKED` :
   - NE PAS passer à la Phase 3
   - Extraire les questions listées par le subagent
   - Les présenter à l'utilisateur : "Le subagent a identifié des inputs manquants. Voici les questions :"
   - Lister chaque question avec son contexte
   - Collecter les réponses de l'utilisateur
   - Relancer le subagent via nouveau Task avec les mêmes inputs + les réponses collectées en complément du brief
   - Revenir à l'étape 1 (vérifier le STATUS du nouveau retour)
3. Si elle contient `STATUS: OK` :
   - VÉRIFICATION : le retour contient-il au moins un bloc `════ SLIDE` avec du box-drawing ?
   - Si OUI → Afficher le contenu TEL QUEL (NE PAS résumer en tableau)
   - Si NON (seulement un tableau résumé ou rapport de conformité) :
     → Lire le fichier /outputs/{marque}/{prospect}/{framework}-content.md
     → Afficher son contenu INTÉGRAL au user
   - NE PAS résumer, NE PAS remplacer par un tableau de titres
   - Passer à la Phase 3

---

### PHASE 3 — Validation contenu (MAIN SESSION ↔ USER)

Présenter le contenu DÉTAILLÉ au user (format box-drawing avec ■ █ • ▸ ░).
L'utilisateur doit pouvoir lire CHAQUE slide pour valider le contenu.
Lui demander :
- Valider tel quel ?
- Ajustements souhaités ? (préciser les numéros de slides)

**Si feedback :** Résumer le subagent 1 via `resume` avec l'agentId + le feedback utilisateur.
**Boucler** jusqu'à validation OK.

---

### PHASE 4 — Subagent 3 : Génération design HTML (avec batching)

Note : Les anciennes Phase 4 (Sub2 analyse variations) et Phase 5 (sélection variation) ont été
supprimées. Le mood et la tonalité sont désormais encodés dans le design language (Phase 0).
Le pipeline passe directement de la Phase 3 (validation contenu) à la Phase 4 (design HTML).

#### ÉTAPE 4.0 — Préparation (MAIN SESSION)

**4.0.1 — Découpage en batches**
Compter le nombre de slides dans le fichier contenu (`/outputs/{marque}/{prospect}/{framework}-content.md`).
- SI nombre > 5 : Découper en batches de 5 slides max (dernier batch peut avoir moins).
- SI nombre ≤ 5 : Un seul batch = toutes les slides, mode PREMIER_BATCH.

Note : L'intention créative et les règles de variation ne sont plus injectées.
Elles sont encodées dans design-language.md et slide-examples.html (Phase 0).

#### ÉTAPE 4.1 — Batch 1 (subagent 3a)

Lancer le subagent 3 avec :
- `slides_a_generer` = slides du batch 1 (ex: "slides 1 à 5")
- `mode_batch` = PREMIER_BATCH

**Après retour STATUS: OK :**
1. Extraire le chemin du fichier sauvegardé
2. **Lancer le script de validation** : `node scripts/validate-pptx.js /outputs/{marque}/{prospect}/batch1.html`
3. **Si 0 erreurs** : extraire via les marqueurs d'assemblage :
   - `<style>` = contenu entre `<!-- ASSEMBLY:HEAD_START -->` et `<!-- ASSEMBLY:HEAD_END -->`
   - Slides = contenu entre `<!-- ASSEMBLY:SLIDES_START -->` et `<!-- ASSEMBLY:SLIDES_END -->`
   - Script = contenu entre `<!-- ASSEMBLY:SCRIPT_START -->` et `<!-- ASSEMBLY:SCRIPT_END -->`
   Stocker ces 3 blocs pour assemblage.
4. **Si erreurs** : relancer le subagent avec feedback ciblé :
   "Le script de validation a trouvé X erreurs : [liste des erreurs]. Corriger et resauvegarder."
   Reboucler jusqu'à 0 erreurs (max 2 tentatives, puis passer avec warnings).

#### ÉTAPE 4.2 — Batches suivants (si applicable)

Pour CHAQUE batch restant, lancer un nouveau subagent 3 avec :
- `slides_a_generer` = slides de CE batch
- `mode_batch` = BATCH_SUIVANT
- `{bloc_style_si_batch_suivant}` = le `<style>` extrait du batch 1
- `{html_reference_si_batch_suivant}` = le HTML COMPLET du batch 1

**Après retour STATUS: OK :** lancer `node scripts/validate-pptx.js` sur le batch. Même logique que 4.1.

#### ÉTAPE 4.3 — Assemblage (MAIN SESSION)

L'orchestrateur assemble le HTML final en utilisant les marqueurs `<!-- ASSEMBLY:* -->` :
1. Extraire le HEAD (entre `ASSEMBLY:HEAD_START` et `ASSEMBLY:HEAD_END`) du batch 1 → contient le `<style>`
2. Extraire les SLIDES (entre `ASSEMBLY:SLIDES_START` et `ASSEMBLY:SLIDES_END`) de CHAQUE batch, dans l'ordre (batch 1, batch 2, ...)
3. Extraire le SCRIPT (entre `ASSEMBLY:SCRIPT_START` et `ASSEMBLY:SCRIPT_END`) du batch 1 → contient CDN dom-to-pptx + bouton + exportToPptx()
4. Assembler dans cet ordre : `<!DOCTYPE html><html><head>` + HEAD + `</head><body>` + SLIDES (tous batches) + SCRIPT + `</body></html>`
5. Sauvegarder dans `/outputs/{marque}/{prospect}/presentation.html`
6. **Lancer le script de validation sur le fichier final** : `node scripts/validate-pptx.js /outputs/{marque}/{prospect}/presentation.html`
7. Ouvrir avec `open`

#### Prompt du subagent 3

Lancer via Task tool (subagent_type: "general-purpose") :

```
PROMPT SUBAGENT 3 — DESIGN HTML

Tu génères le HTML de slides pour une présentation B2B, prêt pour export PPTX via dom-to-pptx.
Tu disposes de 200K tokens. Passe 90% de ce budget à CRÉER du HTML riche et visuellement expressif.

## PROTOCOLE
- Subagent : tu NE PEUX PAS interagir avec l'utilisateur.
- Output commence par `STATUS: OK` ou `STATUS: BLOCKED — [raison]`.
- Si BLOCKED : liste des problèmes + questions. Pas de fichier.

## Fichiers à LIRE (dans cet ordre)
1. /brands/{marque}/tokens.json — Tokens de design (couleurs, typos, radius, icônes)
2. {chemin_contenu} — Contenu validé des slides
3. /brands/{marque}/design-language.md — Langage design (principes, vocabulaire, anti-patterns, catalogue)
4. /brands/{marque}/slide-examples.html — 24 slides exemples PPTX-compatible (inspiration, NE PAS copier)
5. /lib/pptx-techniques.md — Comment faire fonctionner les choses dans PPTX
6. /lib/visual-arbitration-rules.md — Règles placeholder vs SVG vs mockup

## Inputs
- Pack Brand Identity : {marque}
- Infos prospect : {prospect}
- Fichier contenu : {chemin_contenu}

## Composition
- Lis design-language.md et slide-examples.html EN ENTIER avant de commencer.
- Pour chaque slide, choisis le type qui correspond au contenu dans le catalogue de compositions.
- CHAQUE SLIDE doit avoir une composition visuellement DIFFÉRENTE de la précédente.
- Sur 5 slides, utilise au minimum 4 patterns de composition distincts.
- INSPIRE-TOI des exemples. NE LES COPIE PAS. Adapte au contenu réel.
- Respecte les anti-patterns listés dans design-language.md — STRICTEMENT.
- Alterne les tonalités (light/dark) selon les principes du design language.

## Contraintes techniques (BLOQUANTES)
1. JAMAIS `right:` ou `bottom:` → calculer `left` et `top`
2. Width OBLIGATOIRE sur chaque texte : `width = chars × font-size × 0.6 × 1.2`
3. SVG dans container div positionné — JAMAIS position:absolute sur SVG — JAMAIS `<text>` dans SVG
4. Pas de clip-path, pas de CSS Grid, pas de CSS variables, pas de pseudo-éléments
5. Pas de `color: rgba()` sur texte → HEX pré-calculé
6. Font-size contenu ≤ 96px, décoratif ≤ 150px
7. Boutons : Flexbox obligatoire (pas padding/line-height)
8. Tout dans 1280×720 : `left+width ≤ 1280`, `top+height ≤ 720`, rien de négatif
9. Pas de chevauchement entre contenu lisible et éléments décoratifs
10. Diacritiques UTF-8 obligatoires (é, è, ê, à, â, ô, ù, û, ç)

## Gate tokens
Vérifier tokens.json : colors.primary.main, colors.neutrals.*, typography.display.family, typography.body.family, typography.scale.h1/h2/h3, ui_physics.radius.xl, ui_physics.grid_unit, iconography.style/stroke_width.
Si un token critique manque → STATUS: BLOCKED.

## Mode batch
- Slides à générer : {slides_a_generer}
- Mode : {mode_batch} (PREMIER_BATCH | BATCH_SUIVANT)

**PREMIER_BATCH** : Générer `<style>` COMPLET pour TOUTE la présentation + HTML des slides de ce batch.
**BATCH_SUIVANT** : Réutiliser le `<style>` imposé ci-dessous, répliquer les mêmes patterns visuels que la référence.
{bloc_style_si_batch_suivant}
{html_reference_si_batch_suivant}

## Format HTML
- div.slide 1280×720, `<style>` classes pour design tokens (typo, couleurs, radius, shadows)
- Inline autorisé : position, top, left, width, height, display, flex, align-items, justify-content, margin, padding, gap
- Inline INTERDIT : font-family, font-size, font-weight, color, background, border-radius, box-shadow
- PREMIER_BATCH : inclure CDN dom-to-pptx + bouton export + fonction exportToPptx()
- BATCH_SUIVANT : juste les divs slides (pas de style/script/head/body)

## Marqueurs d'assemblage (OBLIGATOIRES)
Le HTML DOIT contenir ces commentaires pour permettre l'assemblage déterministe par l'orchestrateur.

**PREMIER_BATCH** :
<!-- ASSEMBLY:HEAD_START -->
<style>...</style>
<!-- ASSEMBLY:HEAD_END -->
<!-- ASSEMBLY:SLIDES_START -->
<div class="slide">...</div>
<!-- ASSEMBLY:SLIDES_END -->
<!-- ASSEMBLY:SCRIPT_START -->
<script src="...dom-to-pptx..."></script>
<button>...</button>
<script>function exportToPptx()...</script>
<!-- ASSEMBLY:SCRIPT_END -->

**BATCH_SUIVANT** :
<!-- ASSEMBLY:SLIDES_START -->
<div class="slide">...</div>
<!-- ASSEMBLY:SLIDES_END -->

JAMAIS omettre ces marqueurs. L'assemblage ÉCHOUERA sans eux.

## Sauvegarde
- PREMIER_BATCH → /outputs/{marque}/{prospect}/batch1.html
- BATCH_SUIVANT → /outputs/{marque}/{prospect}/batch{N}.html

## Output
STATUS: OK | Fichier sauvegardé : [chemin]
```

**Après retour de CHAQUE subagent batch — TRAITEMENT OBLIGATOIRE :**
1. Lire la PREMIÈRE LIGNE du résultat retourné par le subagent
2. Si `STATUS: BLOCKED` :
   - Extraire les problèmes, les présenter à l'utilisateur, collecter les réponses
   - Relancer le subagent via nouveau Task avec les mêmes inputs + réponses
3. Si `STATUS: OK` :
   - **Lancer `node scripts/validate-pptx.js`** sur le fichier HTML du batch
   - Si 0 erreurs → extraire HTML, passer au batch suivant ou assemblage
   - Si erreurs → relancer le subagent avec la liste d'erreurs (max 2 tentatives)
   - Si dernier batch → exécuter l'ÉTAPE 4.3 (assemblage + validation finale)

---

### PHASE 5 — Validation design (MAIN SESSION ↔ USER)

Exécuter `open {chemin_html}` pour ouvrir dans le navigateur.
Afficher le résultat du script de validation (0 erreurs ou liste).
Demander au user :
- Valider tel quel ?
- Ajustements souhaités ?

**Si feedback :** Relancer le subagent 3 pour le batch concerné, puis réassembler.
**Boucler** jusqu'à validation OK.

---

### PHASE 6 — Subagent 4 : Analyse des layouts

Lancer via Task tool (subagent_type: "general-purpose") :

```
PROMPT SUBAGENT 4 — ANALYSE LAYOUTS

Tu es l'analyste de layouts du SPG (Slide Presentation Generator).

## CONTRAINTE TECHNIQUE
Tu es un subagent. Tu NE PEUX PAS poser de questions à l'utilisateur.
Si tu as besoin d'information → STATUS: BLOCKED avec la liste des questions.
L'orchestrateur posera les questions et te relancera avec les réponses.

## PROTOCOLE DE RETOUR
Ton output DOIT commencer par une ligne STATUS :
- `STATUS: OK` → tout est conforme, output complet ci-dessous
- `STATUS: BLOCKED — [raison]` → un gate bloquant a échoué

Si STATUS = BLOCKED, ton output contient UNIQUEMENT :
1. La ligne STATUS
2. La liste des problèmes
3. Les questions à poser / actions correctives

Tu ne DOIS PAS proposer de layouts si un gate bloquant échoue.

## Ta mission
Analyser le HTML généré et proposer des layouts alternatifs pour chaque slide.

## Fichiers à LIRE OBLIGATOIREMENT
1. /lib/variation-system.md — Section G uniquement (Layout Variations)
2. /brands/{marque}/tokens.json — Préférences layout du style guide
3. {chemin_html} — Le fichier HTML généré

## Inputs reçus
- Pack Brand Identity : {marque}
- Niveau de créativité : {niveau}
- Fichier HTML : {chemin_html}

## Process OBLIGATOIRE
1. Lire variation-system.md Section G
2. Lire tokens.json (extraire layout.preferred_composition, illustration.composition, voice.personality)
3. Lire le HTML généré
4. Pour chaque slide :
   a. Analyser les éléments (textes, visuels, données)
   b. DÉDUIRE les layouts possibles en fonction du contenu + style guide
   c. FILTRER selon le niveau de créativité
   d. GATE G.3.5 : vérifier chaque layout avec PREUVES CHIFFRÉES
   e. Exclure tout layout qui échoue au GATE
5. Identifier les groupes workflow (slides qui doivent partager le même layout)
6. Construire le tableau avec minimum 2 alternatives par slide

## Format de sortie OBLIGATOIRE (seulement si STATUS: OK)
Mode compact (~15 lignes/slide) avec schémas box-drawing :

Légende :
█ = Élément principal (titre, hero)
▪ = Texte secondaire (overline, sous-titre, corps)
░ = Zone décorative / illustration (mood)
▸ = Data / métrique (chiffres clés)
┌─┐ = Card / container

Pour chaque slide :
═══════════════════════════════════════════════════════════════════
SLIDE N : {Titre} │ {Tonalité} │ {éléments}
═══════════════════════════════════════════════════════════════════

[Actuel] {description}     [A] {description}     [B] {description}
{schéma box-drawing}       {schéma box-drawing}  {schéma box-drawing}

                           [C] Garder l'actuel

Groupes workflow : Slides X-Y-Z = même layout obligatoire

Format de réponse attendu : "Slide 1: A, Slide 2: B, Slides 4-5-6: A"

## INTERDICTIONS
- JAMAIS proposer un layout sans avoir passé le GATE G.3.5
- JAMAIS proposer un layout qui contredit les préférences du tokens.json
- JAMAIS proposer moins de 2 alternatives par slide
- JAMAIS omettre les diacritiques — TOUJOURS écrire é, è, ê, à, â, ô, ù, û, ç, î, ï. Utiliser les caractères UTF-8 directement. "électrique" (✅) pas "electrique" (❌)
```

**Après retour du subagent — TRAITEMENT OBLIGATOIRE :**
1. Lire la PREMIÈRE LIGNE du résultat retourné par le subagent
2. Si elle contient `STATUS: BLOCKED` :
   - NE PAS passer à la Phase 7
   - Extraire les problèmes listés par le subagent
   - Les présenter à l'utilisateur : "Le subagent a identifié un problème lors de l'analyse des layouts :"
   - Lister chaque problème/question
   - Collecter les réponses de l'utilisateur
   - Relancer le subagent via nouveau Task avec les mêmes inputs + les réponses collectées
   - Revenir à l'étape 1 (vérifier le STATUS du nouveau retour)
3. Si elle contient `STATUS: OK` :
   - Afficher le tableau de layouts au user tel quel
   - Passer à la Phase 7

---

### PHASE 7 — Sélection layout (MAIN SESSION ↔ USER)

Afficher le tableau de layouts reçu du subagent 4.
Demander au user ses choix : `"Slide 1: A, Slide 2: B, Slides 4-5-6: A"`

---

### PHASE 8 — Subagent 5 : Régénération layouts (avec batching)

#### ÉTAPE 8.0 — Préparation (MAIN SESSION)

**8.0.1 — Découpage**
Compter le nombre de slides À MODIFIER (celles dont le layout change).
SI nombre > 5 : Découper en batches de 5 slides max.
SI nombre ≤ 5 : Un seul batch.

Note : L'intention créative n'est plus injectée. Elle est encodée dans le design language.

Logique de batching identique à la Phase 4 :
- Batch 1 : PREMIER_BATCH (génère `<style>` mis à jour + slides modifiées)
- Batches suivants : BATCH_SUIVANT (réutilise `<style>` du batch 1)
- Slides NON modifiées conservées depuis le HTML précédent
- Assemblage final par l'orchestrateur

#### Prompt du subagent 5

Lancer via Task tool (subagent_type: "general-purpose") :

```
PROMPT SUBAGENT 5 — LAYOUT REGENERATION

Tu régénères le HTML de slides dont le layout a changé. Le contenu textuel et les couleurs/typos NE CHANGENT PAS. Seul le layout (position, ratio, colonnes) change.
Tu disposes de 200K tokens. Passe 90% de ce budget à CRÉER du HTML riche et visuellement expressif.

## PROTOCOLE
- Subagent : tu NE PEUX PAS interagir avec l'utilisateur.
- Output commence par `STATUS: OK` ou `STATUS: BLOCKED — [raison]`.
- Si BLOCKED : liste des problèmes + questions. Pas de fichier.

## Fichiers à LIRE
1. /brands/{marque}/tokens.json — Tokens de design
2. {chemin_contenu} — Contenu validé des slides
3. {chemin_html} — HTML précédent (conserver slides non modifiées IDENTIQUES)
4. /brands/{marque}/design-language.md — Langage design (principes, vocabulaire, anti-patterns, catalogue)
5. /brands/{marque}/slide-examples.html — 24 slides exemples (inspiration)
6. /lib/pptx-techniques.md — Comment faire fonctionner les choses dans PPTX

## Inputs
- Pack Brand Identity : {marque}
- Infos prospect : {prospect}
- Choix layouts : {choix_layouts}

## Composition
- Lis design-language.md pour comprendre les principes et anti-patterns de la brand.
- Utilise slide-examples.html comme INSPIRATION (NE PAS copier).
- Respecte les anti-patterns — STRICTEMENT.

## Contraintes techniques (BLOQUANTES)
1. JAMAIS `right:` ou `bottom:` → calculer `left` et `top`
2. Width OBLIGATOIRE sur chaque texte : `width = chars × font-size × 0.6 × 1.2`
3. SVG dans container div positionné — JAMAIS position:absolute sur SVG — JAMAIS `<text>` dans SVG
4. Pas de clip-path, pas de CSS Grid, pas de CSS variables, pas de pseudo-éléments
5. Pas de `color: rgba()` sur texte → HEX pré-calculé
6. Font-size contenu ≤ 96px, décoratif ≤ 150px
7. Boutons : Flexbox obligatoire (pas padding/line-height)
8. Tout dans 1280×720 : `left+width ≤ 1280`, `top+height ≤ 720`, rien de négatif
9. Pas de chevauchement entre contenu lisible et éléments décoratifs
10. Diacritiques UTF-8 obligatoires (é, è, ê, à, â, ô, ù, û, ç)

## Mode batch
- Slides à régénérer : {slides_a_regenerer}
- Mode : {mode_batch} (PREMIER_BATCH | BATCH_SUIVANT)

**PREMIER_BATCH** : Générer `<style>` COMPLET (mis à jour si besoin) + HTML des slides modifiées.
**BATCH_SUIVANT** : Réutiliser le `<style>` imposé, répliquer les mêmes patterns.
{bloc_style_si_batch_suivant}
{html_reference_si_batch_suivant}

## Format HTML
- Inline autorisé : position, top, left, width, height, display, flex, align-items, justify-content, margin, padding, gap
- Inline INTERDIT : font-family, font-size, font-weight, color, background, border-radius, box-shadow

## Marqueurs d'assemblage (OBLIGATOIRES)
Même protocole que Sub3 — le HTML DOIT contenir ces commentaires :

**PREMIER_BATCH** :
<!-- ASSEMBLY:HEAD_START --> ... <!-- ASSEMBLY:HEAD_END -->
<!-- ASSEMBLY:SLIDES_START --> ... <!-- ASSEMBLY:SLIDES_END -->
<!-- ASSEMBLY:SCRIPT_START --> ... <!-- ASSEMBLY:SCRIPT_END -->

**BATCH_SUIVANT** :
<!-- ASSEMBLY:SLIDES_START --> ... <!-- ASSEMBLY:SLIDES_END -->

JAMAIS omettre ces marqueurs.

## Sauvegarde
- PREMIER_BATCH → /outputs/{marque}/{prospect}/v2-batch1.html
- BATCH_SUIVANT → /outputs/{marque}/{prospect}/v2-batch{N}.html

## Output
STATUS: OK | Fichier sauvegardé : [chemin] | Slides modifiées : [liste]
```

**Après retour de CHAQUE subagent batch — TRAITEMENT OBLIGATOIRE :**
1. Lire la PREMIÈRE LIGNE du résultat retourné par le subagent
2. Si `STATUS: BLOCKED` :
   - Extraire les problèmes, les présenter à l'utilisateur, collecter les réponses
   - Relancer le subagent via nouveau Task avec les mêmes inputs + réponses
3. Si `STATUS: OK` :
   - **Lancer `node scripts/validate-pptx.js`** sur le fichier HTML du batch
   - Si 0 erreurs → passer au batch suivant ou assemblage
   - Si erreurs → relancer le subagent avec la liste d'erreurs (max 2 tentatives)
   - Si dernier batch → assembler le HTML final via marqueurs `<!-- ASSEMBLY:* -->` :
     a. Extraire HEAD (`ASSEMBLY:HEAD_START`→`HEAD_END`) du batch 1
     b. Extraire SLIDES (`ASSEMBLY:SLIDES_START`→`SLIDES_END`) de chaque batch, dans l'ordre
     c. Insérer les slides modifiées à leur position d'origine, conserver les non modifiées du HTML précédent
     d. Extraire SCRIPT (`ASSEMBLY:SCRIPT_START`→`SCRIPT_END`) du batch 1
     e. Assembler : HEAD + SLIDES + SCRIPT
     f. Sauvegarder dans /outputs/{marque}/{prospect}/presentation-v2.html
     g. **Lancer `node scripts/validate-pptx.js`** sur le fichier final
     h. Ouvrir avec `open`
     i. Afficher le résultat du script de validation au user

---

## Gestion des itérations

### Itération contenu
Si le user veut modifier le contenu après la Phase 3 :
→ `resume` Subagent 1 avec le feedback

### Itération design
Si le user veut ajuster le design après Phase 5 :
→ Identifier les slides à modifier → relancer uniquement le batch concerné
→ Réassembler le fichier final après correction

### Itération layout
Si le user veut changer de layout après la Phase 8 :
→ Afficher le tableau des layouts (déjà en mémoire)
→ Relancer Phase 8 complète (avec batching) avec le nouveau choix

### Itération design language
Si le user veut modifier le design language :
→ Supprimer design-language.md, slide-examples.html ET VISUAL-ANALYSIS.md
→ Relancer Phase 0 complète (Sub0-A → Sub0-B)
