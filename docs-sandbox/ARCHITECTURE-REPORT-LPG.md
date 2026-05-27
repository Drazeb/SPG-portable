# Rapport d'Architecture SPG → Landing Page Generator (LPG)

> **Destinataire** : session d'architecture LPG
> **Source** : 4 mois de développement SPG (oct 2025 – fév 2026)
> **Objectif** : transférer les patterns prouvés, éviter les erreurs déjà commises, accélérer le bootstrap

---

## 1. Ce qui fonctionne et pourquoi

### 1.1 Design Language Bridge (pattern fondamental)

**Le problème résolu** : quand on demande à un LLM de "faire du design créatif avec les couleurs X et la typo Y", il produit du design générique. Les mots ("audacieux", "organique", "asymétrique") sont trop vagues pour guider un output concret.

**La solution** : séparer la **traduction créative** (one-time par brand) de **l'exécution** (par output).

```
Sub0 (one-time)         Sub3 (per-output)
Brand Identity HTML  →  design-language.md    →  Output HTML
                    →  slide-examples.html   →  (s'inspire des exemples concrets)
```

**Pourquoi ça marche** : 24 exemples concrets > 200 lignes de mots. Le subagent d'exécution (Sub3) ne "devine" plus le style — il le VOIT dans des exemples réels, PPTX-compatible, qu'il peut copier/adapter.

**Pour LPG** : même split. Sub0 produit `section-examples.html` (24 types de sections landing page) au lieu de `slide-examples.html`. Le design-language.md reste identique.

### 1.2 Validation programmatique (script > LLM audit)

**Le problème résolu** : demander à un LLM de vérifier la conformité CSS est lent (~30s), non-déterministe, et rate des erreurs subtiles.

**La solution** : `scripts/validate-pptx.js` — 19 règles regex, résultat en <1s, zéro faux négatif.

**Pour LPG** : écrire `scripts/validate-web.js` avec des règles web (a11y, responsive, performance, sémantique HTML). Même architecture : regex sur le HTML, exit 0/1, rapport d'erreurs avec numéros de ligne.

### 1.3 STATUS protocol (communication subagent ↔ orchestrateur)

Chaque subagent retourne `STATUS: OK` ou `STATUS: BLOCKED — [raison]` en première ligne. L'orchestrateur parse ce statut et :
- OK → continue le pipeline
- BLOCKED → relaie la question à l'utilisateur, puis relance

**Pourquoi ça marche** : les subagents ne parlent JAMAIS à l'utilisateur directement. Ça évite les conversations confuses et garantit un flux propre.

**Pour LPG** : copier tel quel.

### 1.4 Batch Assembly avec marqueurs ASSEMBLY

Le HTML généré contient des marqueurs déterministes :
```html
<!-- ASSEMBLY:HEAD_START -->
<!-- ASSEMBLY:HEAD_END -->
<!-- ASSEMBLY:SLIDES_START -->
<!-- ASSEMBLY:SLIDES_END -->
<!-- ASSEMBLY:SCRIPT_START -->
<!-- ASSEMBLY:SCRIPT_END -->
```

L'orchestrateur extrait les blocs par regex et assemble le fichier final. Le premier batch génère le `<style>` (protocole PREMIER_BATCH), les suivants le reçoivent en contexte imposé (protocole BATCH_SUIVANT).

**Pour LPG** : même mécanisme, marqueurs renommés (`SECTIONS_START` au lieu de `SLIDES_START`).

### 1.5 Content-first, design-after

Le pipeline force l'ordre : contenu textuel validé → PUIS design HTML. Si le contenu change, on ne refait que le design (pas le contenu). Si le design est mauvais, on ne touche pas au contenu.

**Pour LPG** : même séquence. Le contenu d'une landing page (hero, features, CTA, proof) est validé avant tout travail visuel.

### 1.6 Brand tokens comme contrat universel

`brand-schema.json` (50+ tokens) est le contrat entre tous les subagents. Personne ne référence "la couleur verte" — tout le monde référence `colors.primary.main`. Le fichier `tokens.json` par brand est la source de vérité unique.

**Pour LPG** : copier `brand-schema.json` et `brand-token-extractor.md` sans modification.

### 1.7 Gates humaines multiples

Le pipeline s'arrête DEUX FOIS pour validation humaine :
- Après le contenu (Phase 3) — l'utilisateur valide le texte
- Après le design (Phase 5) — l'utilisateur valide le visuel

**Pourquoi** : une erreur de contenu qui se propage dans le design coûte cher à corriger. Les gates empêchent la cascade.

---

## 2. Assets réutilisables tels quels

Ces fichiers peuvent être copiés dans le projet LPG sans modification (ou avec renommage trivial).

| Fichier | Chemin SPG | Pourquoi réutilisable |
|---------|-----------|----------------------|
| **Brand Schema** | `/lib/brand-schema.json` | Schéma universel 50+ tokens, indépendant du format de sortie |
| **Brand Token Extractor** | `/lib/brand-token-extractor.md` | Process d'extraction brand-agnostique |
| **Visual Arbitration Rules** | `/lib/visual-arbitration-rules.md` | Arbre de décision SVG vs placeholder vs mockup — même problème en LP |
| **Design Principles** | `/docs/DESIGN-PRINCIPLES-PERPLEXITY.md` | 12 principes de design universels (whitespace, contraste, hiérarchie) |
| **tokens.json existants** | `/brands/voltapilot/tokens.json` | Tokens déjà extraits, valides pour n'importe quel output |
| | `/brands/posta/tokens.json` | |
| | `/brands/geoforge/tokens.json` | |

### Détail `brand-schema.json` (150 lignes)

Couvre 10 sections : colors (primary, secondary, neutrals, semantic, dataviz), typography (display, body, data, scale, overline), ui_physics (radius, shadows, glassmorphism, strokes, grid_unit), iconography, data_visualization, layout, illustration, photography, logotype, voice.

Aucune de ces sections n'est spécifique aux slides. Un design system pour landing page a besoin de EXACTEMENT les mêmes tokens.

### Détail `visual-arbitration-rules.md` (208 lignes)

Arbre de décision : quand utiliser un SVG custom (concepts abstraits, simples), un placeholder image (éléments réels, screenshots), ou un mockup UI. La règle d'honnêteté — "Un placeholder descriptif est TOUJOURS préférable à un mauvais SVG" — s'applique identiquement aux landing pages.

---

## 3. Assets à adapter

Ces fichiers ont une architecture réutilisable mais un contenu à réécrire pour le contexte landing page.

### 3.1 `content-compliance-checker.md` → forker
**Chemin** : `/lib/content-compliance-checker.md` (494 lignes)

**Ce qui reste** :
- Structure en 4 gates (A: pré-génération, B: post-génération, C: rapport, D: excellence rédactionnelle)
- Chargement dynamique du framework spec
- Score de Readiness 100% = GO, <100% = STOP

**Ce qui change** :
- Le format de sortie : remplacer le box-drawing "slide" par un format "section" (hero, features, proof, CTA)
- Les champs visuels par slide (Requis, Concept, Intention, Contrainte) → adapter pour les sections LP
- Les inputs obligatoires dépendront des frameworks LP (AIDA, PAS, etc.) au lieu de Great Demo/MEDDIC

### 3.2 `design-compliance-checker.md` → forker
**Chemin** : `/lib/design-compliance-checker.md` (123 lignes)

**Ce qui reste** :
- Part A : validation des 13 tokens critiques dans tokens.json (identique)
- Architecture du checker en parties

**Ce qui change** :
- Part C : les 39 règles PPTX → remplacer par des règles web (responsive, semantic HTML, a11y, performance)
- Le script d'export PPTX → pas d'export PPTX, export HTML/CSS standard

### 3.3 `creativity-levels.md` → adapter
**Chemin** : `/lib/creativity-levels.md` (26 lignes)

**Ce qui reste** : 3 niveaux (Prudent / Equilibre / Audacieux), principe "modifier la mise en scène, JAMAIS l'identité brand"

**Ce qui change** : les descriptions visuelles de chaque niveau. Exemple :
- Prudent pour LP : layout grid classique, sections symétriques, CTA standard
- Audacieux pour LP : hero plein écran, animations subtiles, sections asymétriques, micro-interactions

### 3.4 `presentation-excellence.md` → forker
**Chemin** : `/lib/presentation-excellence.md` (285 lignes)

**Ce qui reste** : principes 5-9 (So What Test, Spécificité > Généralité, Verbes actifs, Structure parallèle, Pyramide inversée)

**Ce qui change** : principes 1-4 sont slide-specific (Action Titles, Une idée par slide, Densité, Glance Test). Les remplacer par des principes LP :
- Headline = proposition de valeur claire (pas de "Bienvenue")
- Une promesse par section
- CTA visible sans scroller
- F-pattern ou Z-pattern de lecture

### 3.5 `variation-system.md` → réécriture partielle
**Chemin** : `/lib/variation-system.md` (655 lignes)

**Ce qui reste** : le concept de GATE avec critères mesurables, le format box-drawing compact pour proposer des alternatives

**Ce qui change** : la Section G (layouts) concerne des layouts de slides (1280×720, position:absolute). Pour LP : layouts de sections web (full-width, contained, split, overlap, etc.) avec breakpoints responsive.

Note : les Sections Mood/Tonalité sont déjà dépréciées dans SPG (encodées dans le design language). Ne pas les porter.

### 3.6 `framework-selector.md` + frameworks → réécriture complète du contenu
**Chemin** : `/frameworks/framework-selector.md` (130 lignes)

**Ce qui reste** : le pattern d'architecture (selector + spec.md par framework + chargement dynamique)

**Ce qui change** : les 3 frameworks B2B (Great Demo, Workflow-Driven, MEDDIC) → remplacer par des frameworks LP :
- **AIDA** : Attention → Interest → Desire → Action
- **PAS** : Problem → Agitation → Solution
- **Hero-Features-Proof-CTA** : pattern classique SaaS
- **Storytelling** : narration → transformation → CTA

Chaque framework LP aurait un `reference.md` + `spec.md` avec la même structure standardisée :
```
## 1. Inputs Requis (Obligatoires / Recommandés / Optionnels)
## 2. Structure des Sections
## 3. Règles Critiques
## 4. Checklist de Validation
## 5. Structure JSON Input
```

### 3.7 `validate-pptx.js` → réécriture complète
**Chemin** : `/scripts/validate-pptx.js` (253 lignes)

**Ce qui reste** : l'architecture (Node.js, lecture HTML, validation regex, rapport d'erreurs avec numéros de ligne, exit 0/1)

**Ce qui change** : les 19 règles PPTX → remplacer par des règles web :
- Sémantique HTML (pas de `<div>` pour tout, utiliser `<section>`, `<nav>`, `<main>`)
- Responsive (pas de largeurs fixes en px, utiliser max-width, %, vw/vh)
- Accessibilité (attributs alt, contraste, aria-labels, skip-to-content)
- Performance (pas d'images inline base64 trop lourdes, lazy loading)
- SEO basique (meta title, description, h1 unique, headings ordonnés)

### 3.8 `SKILL.md` (orchestrateur) → forker et adapter
**Chemin** : `.claude/skills/generate-slides/SKILL.md` (1134 lignes)

**Ce qui reste** :
- Architecture multi-phase avec gates humaines
- STATUS protocol
- Batch assembly avec marqueurs ASSEMBLY
- PREMIER_BATCH / BATCH_SUIVANT
- Onboarding (ASCII art + 3 modes A/B/C)
- Logique d'itération (re-run phases indépendamment)

**Ce qui change** :
- Noms des phases (slides → sections)
- Canvas fixe 1280×720 → responsive web (mobile-first ou desktop-first)
- Export PPTX → export HTML/CSS statique (ou framework si choisi)
- Sub3/Sub5 : les prompts de design doivent cibler du CSS web standard au lieu de CSS PPTX-compatible
- Sub4 : layouts de sections web au lieu de layouts de slides
- Le catalogue de 24 types de slides → 24 types de sections LP

### 3.9 `design-language.md` par brand → structure à adapter
**Chemin** : `/brands/{brand}/design-language.md`

**Ce qui reste** : personnalité visuelle, principes de composition, vocabulaire visuel, palette tonale, anti-patterns, assets SVG

**Ce qui change** : le "Catalogue de compositions" — 24 types de slides → 24 types de sections LP (hero, features grid, testimonial, pricing, FAQ, footer, etc.)

### 3.10 `pptx-techniques.md` → remplacer
**Chemin** : `/lib/pptx-techniques.md` (108 lignes)

**Ne PAS porter le contenu** (10 techniques de workaround PPTX). Créer un équivalent `web-techniques.md` avec :
- CSS Grid + Flexbox patterns courants
- Animations CSS subtiles (transitions, scroll-triggered)
- Responsive images (picture/source, srcset)
- Composants interactifs (accordéon, tabs, slider) en vanilla JS
- Dark mode via CSS custom properties

---

## 4. Ce qu'il faut NE PAS porter

### 4.1 Contraintes PPTX (à éliminer)

| Élément | Pourquoi le skip |
|---------|-----------------|
| `docs/CSS-GUIDELINES.md` (730 lignes) | 100% workarounds pour dom-to-pptx. Les LP utilisent du CSS web standard. |
| `lib/pptx-techniques.md` (108 lignes) | 10 hacks pour contourner les limitations de dom-to-pptx |
| `scripts/validate-pptx.js` contenu | Les 19 règles sont PPTX-only (pas de right/bottom, pas de grid, etc.) |
| Canvas fixe 1280×720px | Les LP sont responsive. Pas de dimensions fixes. |
| `position: absolute` partout | SPG l'utilise car flexbox/grid cassent dans PPTX. LP utilise du layout web normal. |
| Calcul de `width` par formule `chars × font × 0.6 × 1.2` | Hack PPTX. En web, les textes ont un flow naturel. |
| Pas de CSS variables `var(--x)` | Restriction PPTX. En LP, les CSS custom properties sont la BONNE pratique. |
| Pas de `::before`/`::after` | Restriction PPTX. En LP, les pseudo-éléments sont utiles. |
| Pas de `clip-path` | Restriction PPTX. En LP, clip-path est un outil créatif. |
| Pas de `display: grid` | Restriction PPTX. En LP, CSS Grid est le layout par défaut. |
| Semi-transparence par HEX pré-calculé | Hack PPTX. En LP, `rgba()` et `opacity` marchent. |
| `dom-to-pptx` dependency | Pas d'export PPTX en LP. |

### 4.2 Contenu B2B sales-specific

| Élément | Pourquoi le skip |
|---------|-----------------|
| Frameworks Great Demo / MEDDIC / Workflow-Driven | Méthodologies de vente B2B. Les LP ont d'autres frameworks (AIDA, PAS, etc.) |
| `lib/presentation-types/commercial-b2b.md` | Layer de compétence spécifique aux présentations commerciales B2B |
| Principes "Une idée par slide" / "Glance Test 3s" | Spécifiques au format diapositive. LP a ses propres patterns (above-the-fold, scan pattern) |

### 4.3 Artefacts de développement obsolètes

| Élément | Pourquoi le skip |
|---------|-----------------|
| Sections Mood/Tonalité de `variation-system.md` | Déjà dépréciées dans SPG, encodées dans le design language |
| Sub2 (variation analysis) | Supprimé dans SPG. Ne pas réintroduire. |
| `brands/voltapilot-alternative/` | Expérimentation abandonnée. Un seul tokens.json sans design language. |

---

## 5. Pièges et leçons

### 5.1 Le piège des mots vagues (leçon #1, la plus importante)

**L'erreur** : on a commencé par demander au subagent de design "fais un design audacieux avec une tonalité organique et un ratio asymétrique 60/40". Résultat : output générique, identique quelle que soit la brand.

**La cause racine** : un LLM ne peut pas transformer des adjectifs en CSS concret de manière fiable. "Audacieux" signifie quoi en CSS ? Personne ne sait — y compris le LLM.

**La solution qui a marché** : le Design Language Bridge. Au lieu de mots, on donne 24 exemples HTML concrets que le LLM peut VOIR et COPIER. Résultat : qualité créative multipliée par ~3×.

**Action LPG** : implémenter le Design Language Bridge dès le jour 1. Ne JAMAIS essayer de faire du design à partir de descriptions textuelles seules. Toujours produire des exemples concrets (section-examples.html) d'abord.

### 5.2 Le piège du contexte window (leçon #2)

**L'erreur** : on a essayé de faire lire 3 fichiers Brand Identity HTML (~250KB total) + les guidelines + le brief en un seul appel subagent.

**La cause** : les Brand Identity HTML sont MASSIFS (80-100KB chacun). Ça explose le contexte.

**La solution** : split en Sub0-A (lecture seule → rapport textuel ~8KB) puis Sub0-B (travaille à partir du rapport, pas des originaux).

**Action LPG** : planifier un budget token par subagent. Si un input dépasse ~30K tokens, le pré-processer dans un agent dédié qui produit un rapport condensé.

### 5.3 Le piège du batching improvisé (leçon #3)

**L'erreur** : pour les 24 slides exemples, on a d'abord lancé 2 batches en parallèle. Résultat : incohérence de style entre batch 1 et batch 2 (couleurs différentes, typo différente, ambiance différente).

**La cause** : les batches parallèles n'ont pas de contexte partagé. Chaque batch "invente" sa propre interprétation.

**La solution** : protocole PREMIER_BATCH / BATCH_SUIVANT séquentiel. Le batch 1 génère le `<style>` complet. Le batch 2 reçoit ce `<style>` comme contexte imposé + le HTML du batch 1 comme référence visuelle. Résultat : cohérence à 95%+.

**Action LPG** : NE JAMAIS paralléliser les batches de design. Toujours séquentiel avec le `<style>` du batch 1 imposé aux suivants.

### 5.4 Le piège du catalogue dans le batch créatif (leçon #4)

**L'erreur** : on a demandé à Sub0-B batch 1 de produire simultanément les 12 slides ET le catalogue descriptif des 24 types. Résultat : le catalogue volait ~15-20% du focus créatif, et les descriptions des types 13-24 (pas encore générés) étaient inventées.

**La cause** : le catalogue est une tâche analytique (décrire ce qui existe). Le design est une tâche créative (inventer). Mélanger les deux dans le même contexte dégrade les deux.

**La solution** : Sub0-C post-assembly. D'abord on génère les 24 slides (Sub0-B batch 1+2), on les assemble, PUIS un agent séparé (Sub0-C) les lit et produit le catalogue descriptif.

**Action LPG** : séparer les tâches analytiques des tâches créatives. Ne jamais demander à un agent créatif de AUSSI documenter ce qu'il fait pendant qu'il le fait.

### 5.5 Le piège du format de sortie Sub1 (leçon #5)

**L'erreur** : Sub1 (content) retournait un résumé en tableau au lieu du contenu détaillé en box-drawing. L'orchestrateur affichait ce résumé comme si c'était le contenu final.

**La cause** : le prompt de Sub1 n'était pas assez explicite sur le format de sortie. Et l'orchestrateur ne vérifiait pas la présence des marqueurs de contenu détaillé.

**La solution** : (1) marqueurs `═══ CONTENU DÉTAILLÉ ═══` obligatoires dans le prompt Sub1, (2) l'orchestrateur vérifie la présence de `════ SLIDE` dans l'output avant d'afficher, (3) fallback sur le fichier sauvegardé si le résumé est détecté.

**Action LPG** : toujours définir des marqueurs de format OBLIGATOIRES dans les prompts subagent ET vérifier leur présence côté orchestrateur. Double validation = zéro ambiguïté.

### 5.6 Le piège de la validation LLM (leçon #6)

**L'erreur** : les premières versions utilisaient un subagent LLM pour "auditer" la conformité CSS. Résultat : lent (~30s), inconsistant (rate des erreurs une fois sur deux), et coûteux en tokens.

**La solution** : `validate-pptx.js` — script Node.js déterministe. 19 règles regex, <1s, zéro faux négatif.

**Action LPG** : pour toute règle qui peut être vérifiée par regex/AST, utiliser un script. Réserver le jugement LLM aux aspects subjectifs (qualité du copywriting, pertinence du design).

### 5.7 Le piège du "trop de phases" (leçon #7)

**L'erreur** : le pipeline avait 11 phases (0-10) avec Sub2 (mood/tonalité). C'était trop : chaque phase = un point de friction, un risque de blocage, un coût en tokens.

**La solution** : suppression de Sub2, encodage du mood/tonalité dans le design language (Sub0). Pipeline réduit à 9 phases.

**Action LPG** : viser le nombre minimum de phases. Chaque phase doit justifier son existence par un output unique et nécessaire. Si deux phases peuvent fusionner sans perte de qualité, les fusionner.

---

## 6. Pipeline recommandé pour LPG

### 6.1 Architecture simplifiée

```
Phase 0 — Design Language (one-time per brand)
  Sub0-A : Brand Identity HTML → VISUAL-ANALYSIS.md
  Sub0-B batch 1 : VISUAL-ANALYSIS + refs → design-language.md + <style> + sections 1-12
  Sub0-B batch 2 : <style> imposé + batch1 ref → sections 13-24
  Orchestrator : assemble section-examples.html
  Sub0-C : catalogue des 24 types de sections → append to design-language.md
  validate-web.js sur section-examples.html

Phase 1 — Inputs (orchestrateur + user)
  Collecter : brand, framework LP, brief/objectif, audience cible, CTA principal

Phase 2 — Contenu (Sub1)
  Framework spec → structured content par section
  Gates : PRE (inputs), POST (structure), EXCELLENCE (copywriting)

Phase 3 — Validation contenu (user)
  L'utilisateur valide ou demande des modifications

Phase 4 — Design HTML (Sub3, batches séquentielles)
  tokens.json + contenu + design-language.md + section-examples.html → HTML responsive
  validate-web.js sur chaque batch
  Orchestrator : assemble landing-page.html

Phase 5 — Validation design (user)
  L'utilisateur valide ou demande des modifications

Phase 6 — Export final
  HTML/CSS statique prêt à l'emploi (pas de PPTX)
```

### 6.2 Différences clés avec SPG

| Aspect | SPG | LPG |
|--------|-----|-----|
| **Canvas** | 1280×720px fixe | Responsive (mobile-first ou desktop-first) |
| **Layout** | `position: absolute` partout | CSS Grid + Flexbox |
| **Export** | dom-to-pptx → .pptx | HTML/CSS statique |
| **Unité atomique** | slide (1 idée) | section (hero, features, etc.) |
| **CSS** | Sous-ensemble PPTX-compatible | CSS web complet (variables, grid, pseudo, animations) |
| **Sub4/Sub5 (layouts)** | Nécessaire (variations de layout par slide) | **À évaluer** — peut-être pas nécessaire si le design language suffit |
| **Frameworks** | Great Demo, MEDDIC, Workflow-Driven | AIDA, PAS, Hero-Features-Proof-CTA |
| **Phases** | 9 (0-8) | 7 (0-6) — pas de layout analysis/regen si non nécessaire |

### 6.3 Sous-agents recommandés

| Agent | Rôle | Input | Output |
|-------|------|-------|--------|
| **Sub0-A** | Visual Analysis | Brand Identity HTML | VISUAL-ANALYSIS.md |
| **Sub0-B** (×2 batches) | Section Examples | VISUAL-ANALYSIS + design refs | section-examples.html + design-language.md |
| **Sub0-C** | Catalogue | section-examples.html assemblé | Catalogue ajouté à design-language.md |
| **Sub1** | Content Generation | Framework spec + brief + excellence | Contenu structuré par section |
| **Sub3** (×N batches) | Design HTML | tokens + content + design-language + section-examples | HTML responsive par batch |

**Sub4/Sub5 retirés (recommandation)** : pour les landing pages, les variations de layout sont moins critiques que pour les slides. Si la qualité du design language est bonne, Sub3 devrait produire un layout satisfaisant dès le premier essai. Ajouter Sub4/Sub5 seulement si les tests montrent qu'ils sont nécessaires.

### 6.4 Fichiers à créer en priorité

```
/landing-page-generator/
├── CLAUDE.md                           # Instructions projet LPG
├── package.json                        # Dépendances (aucune NPM spéciale)
├── /scripts
│   └── validate-web.js                 # Validation HTML web (a11y, responsive, sémantique)
├── /lib
│   ├── brand-schema.json               # ← copié de SPG
│   ├── brand-token-extractor.md        # ← copié de SPG
│   ├── visual-arbitration-rules.md     # ← copié de SPG
│   ├── content-compliance-checker.md   # ← forké de SPG (format section)
│   ├── design-compliance-checker.md    # ← forké de SPG (règles web)
│   ├── creativity-levels.md            # ← adapté de SPG (descriptions LP)
│   ├── web-techniques.md               # ← NOUVEAU (remplace pptx-techniques.md)
│   └── landing-page-excellence.md      # ← forké de SPG (principes LP)
├── /frameworks
│   ├── framework-selector.md           # ← structure SPG, contenu LP
│   ├── aida/spec.md + reference.md
│   ├── pas/spec.md + reference.md
│   └── hero-features-cta/spec.md + reference.md
├── /brands                             # ← tokens.json copiés de SPG
│   ├── voltapilot/tokens.json
│   └── posta/tokens.json
├── /docs
│   ├── DESIGN-PRINCIPLES-PERPLEXITY.md # ← copié de SPG
│   ├── WEB-CSS-GUIDELINES.md           # ← NOUVEAU (best practices CSS web)
│   └── pipeline-overview.md            # ← structure SPG, contenu LP
├── /.claude/skills
│   └── generate-landing-page/SKILL.md  # ← forké de SPG, adapté LP
└── /outputs                            # Fichiers générés
```

### 6.5 Ordre de développement recommandé

1. **Sprint 0** : structure projet + copier les assets réutilisables + validate-web.js basique
2. **Sprint 1** : Sub0 adapté pour sections LP (design language bridge)
3. **Sprint 2** : frameworks LP (AIDA, PAS) + content-compliance adapté + Sub1
4. **Sprint 3** : Sub3 adapté pour CSS web responsive + design-compliance adapté
5. **Sprint 4** : test end-to-end + itérations qualité
6. **Sprint 5** : si nécessaire, ajouter Sub4/Sub5 (layout variations)

---

## Annexe A — Inventaire complet des fichiers SPG

```
/lib/
  brand-schema.json             (150 lignes)  → COPIER
  brand-token-extractor.md      (266 lignes)  → COPIER
  visual-arbitration-rules.md   (208 lignes)  → COPIER
  content-compliance-checker.md (494 lignes)  → FORKER
  design-compliance-checker.md  (123 lignes)  → FORKER
  creativity-levels.md          (26 lignes)   → ADAPTER
  variation-system.md           (655 lignes)  → NE PAS PORTER (sauf pattern GATE)
  presentation-excellence.md    (285 lignes)  → FORKER (principes 5-9)
  pptx-techniques.md            (108 lignes)  → NE PAS PORTER
  /presentation-types/
    commercial-b2b.md                          → NE PAS PORTER
  /examples/
    content-report-example.md                  → ADAPTER
    variation-examples.md                      → NE PAS PORTER

/frameworks/
  framework-selector.md         (130 lignes)  → FORKER (structure)
  great-demo/spec.md + reference.md           → NE PAS PORTER (contenu B2B)
  meddic/spec.md + reference.md               → NE PAS PORTER
  workflow-driven/spec.md + reference.md      → NE PAS PORTER

/docs/
  CSS-GUIDELINES.md             (730 lignes)  → NE PAS PORTER
  DESIGN-PRINCIPLES-PERPLEXITY.md (409 lignes) → COPIER
  pipeline-overview.md          (98 lignes)   → FORKER (structure)
  ONBOARDING-TEMPLATE.md                      → FORKER
  WORKFLOW.md                                 → FORKER

/scripts/
  validate-pptx.js              (253 lignes)  → FORKER (architecture, pas les règles)

/brands/
  voltapilot/tokens.json       (148 lignes)  → COPIER
  posta/tokens.json             (150 lignes)  → COPIER
  geoforge/tokens.json        (140 lignes)  → COPIER

/.claude/skills/
  generate-slides/SKILL.md      (1134 lignes) → FORKER (architecture pipeline)
```

## Annexe B — Les 24 types de sections LP (recommandation)

À la place des 24 types de slides SPG, voici une proposition de 24 types de sections pour les landing pages :

| # | Type de section | Description |
|---|----------------|-------------|
| 1 | Hero — Titre + CTA | Proposition de valeur, headline, sous-titre, CTA principal |
| 2 | Hero — Vidéo/Image full-width | Hero visuel avec overlay texte |
| 3 | Problème — Pain points | Identification des problèmes audience (PAS framework) |
| 4 | Solution — Bénéfices clés | 3-4 bénéfices avec icônes |
| 5 | Features Grid — 3 colonnes | Grille de fonctionnalités |
| 6 | Features Grid — 2 colonnes | Variante plus spacieuse |
| 7 | Feature Spotlight — Image gauche | Feature détaillée avec visuel à gauche |
| 8 | Feature Spotlight — Image droite | Feature détaillée avec visuel à droite |
| 9 | Social Proof — Logos clients | Barre de logos "Ils nous font confiance" |
| 10 | Testimonial — Citation unique | Témoignage client avec photo + nom + rôle |
| 11 | Testimonials — Carrousel/Grid | Multiples témoignages |
| 12 | Metrics — Chiffres clés | 3-4 KPIs en gros chiffres |
| 13 | Pricing — Tableau comparatif | 2-3 plans avec feature comparison |
| 14 | Pricing — Simple | Prix unique avec CTA |
| 15 | How It Works — Steps | Process en 3-5 étapes numérotées |
| 16 | Comparison — Before/After | Avant vs après avec le produit |
| 17 | FAQ — Accordéon | Questions fréquentes |
| 18 | CTA — Bannière full-width | Call-to-action fort avec background contrasté |
| 19 | CTA — Formulaire inline | CTA avec champ email/formulaire |
| 20 | Team — Grille de profils | Équipe avec photos + rôles |
| 21 | Blog/Resources — Cards | Articles ou ressources récentes |
| 22 | Integration — Logos + description | Intégrations avec d'autres outils |
| 23 | Footer — Navigation + CTA | Footer avec liens, CTA secondaire, légal |
| 24 | Divider — Visual breather | Section de respiration visuelle (citation, image, stat unique) |
