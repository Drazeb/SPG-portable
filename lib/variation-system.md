# Système de Variations

## EXÉCUTION OBLIGATOIRE

**Ce fichier DOIT être lu et appliqué APRÈS validation Content Compliance et AVANT génération HTML/CSS.**

Le système de variations propose des options créatives DÉDUITES du style guide, pas des choix hardcodés.

---

# RÈGLES FONDAMENTALES

## Règle #1 : INCLURE PAR DÉFAUT

**Si une tonalité POURRAIT fonctionner → L'INCLURE dans le tableau.**

- Ne PAS attendre une confirmation explicite du style guide
- L'utilisateur peut rejeter une option ; il ne peut pas deviner une option non proposée
- "Pas d'interdiction" = "Autorisation implicite" = INCLURE

❌ INTERDIT : "Je n'ai pas trouvé de confirmation → je n'inclus pas"
✅ CORRECT : "Je n'ai pas trouvé d'interdiction → j'inclus"

## Règle #2 : MOODS MULTIPLES POSSIBLES

**Un style guide peut suggérer PLUSIEURS moods. Tu DOIS tous les proposer.**

Sources de moods multiples :
- `illustration.composition` → mood principal
- `illustration.metaphor` → mood alternatif possible
- `voice.big_idea` → mood thématique possible
- `photography.style` → mood esthétique possible

Si le style guide dit "Precision Engineering" + "Directionnel", ce sont potentiellement DEUX moods :
- "Blueprint" (precision, schematic)
- "Directional" (mouvement, flèches)

## Règle #3 : PRODUIT CARTÉSIEN

**Tableau = TOUS les moods × TOUTES les tonalités**

Si tu trouves 2 moods et 4 tonalités → **8 options minimum** (+ Mix)

Formule : Nb options = Nb moods × Nb tonalités (+ quelques Mix)

## Règle #4 : Les exemples sont des ILLUSTRATIONS

**INTERDICTION de copier la structure des exemples.**

- Les exemples montrent 1 mood car ils sont simplifiés
- La réalité est souvent 2-3 moods possibles
- Si ton tableau ressemble à un exemple → Tu as probablement été paresseux

---

# A. DÉFINITION DES DIMENSIONS

## A.1 Tonalité (Rythme des fonds)

La tonalité définit le **RYTHME** des fonds de slides. Elle est **mixable par slide**.

| Tonalité | Description | Condition pour la proposer |
|----------|-------------|----------------------------|
| Light | Blanc, très clair | background_primary = blanc/gris clair |
| Dark | Sombre, profond | Une couleur sombre peut servir de fond |
| Warm | Chaud, doré | Fonds orange/jaune/beige autorisés |
| Cool | Froid, bleuté | Fonds bleu/gris froid autorisés |
| Vibrant | Vif, saturé | Fonds colorés vifs autorisés |
| Nature | Vert, organique | Fonds verts autorisés |
| [Autre] | Selon style guide | Toute autre tonalité justifiable |

**Règle Mix** : Ratio ~70/30 recommandé. Pas 2 slides de même tonalité d'accent consécutives.

## A.2 Mood (Style d'illustrations)

Le mood définit le **VOCABULAIRE DÉCORATIF** des illustrations. Il est **global** (non-mixable par slide).

**PLUSIEURS MOODS SONT SOUVENT POSSIBLES. Tu DOIS tous les identifier.**

Le mood n'est PAS une liste fermée. Il est DÉDUIT de PLUSIEURS sources :
1. `illustration.composition` → mood principal
2. `illustration.metaphor` → mood secondaire possible
3. `voice.big_idea` / `voice.personality` → mood thématique
4. `photography.style` → mood esthétique

Exemples de moods (NON EXHAUSTIFS) :

| Mood | Peut correspondre à | Caractéristiques |
|------|---------------------|------------------|
| Orbital | "Centré", "Orbital", "Concentrique" | Cercles, rotations, nœuds |
| Radial | "Rayonnant", "Explosion" | Lignes partant du centre |
| Grid | "Modulaire", "Grille", "Matriciel" | Rectangles, alignements |
| Organic | "Organique", "Fluide", "Naturel" | Courbes fluides |
| Angular | "Géométrique", "Angular", "Angulaire" | Triangles, hexagones, angles |
| Directional | "Directionnel", "Dynamique", "Momentum" | Flèches, vecteurs, lignes de direction |
| Blueprint | "Precision", "Engineering", "Schematic" | Lignes techniques, annotations |
| Isometric | "Isométrique", "3D technique" | Projections isométriques |
| Minimal | "Épuré", "Minimal" | Formes simples, peu d'éléments |
| **[CRÉER]** | **Toute description non listée** | **Créer le nom approprié** |

**Exemple de moods multiples :**
Style guide avec `composition: "Directionnel"` + `metaphor: "Precision Engineering"` →
- Mood 1 : Directional (flèches, momentum)
- Mood 2 : Blueprint (schémas techniques, annotations)
→ **Les DEUX doivent apparaître dans le tableau**

---

# B. PROCESS D'ANALYSE DU STYLE GUIDE

## B.0 CHECKLIST OBLIGATOIRE AVANT PROPOSITION

**Tu DOIS cocher CHAQUE case AVANT de construire le tableau de variations.**

### Analyse Tonalités
- [ ] **B.0.1** `colors.neutrals.background_primary` = ___ → Tonalité : ___
- [ ] **B.0.2** `colors.neutrals.text_primary` = ___ → Utilisable comme fond Dark ? ___
- [ ] **B.0.3** `colors.primary.main` = ___ → Interdit comme fond ? ___ (chercher interdiction explicite)
- [ ] **B.0.4** `colors.secondary.main` = ___ → Interdit comme fond ? ___ (chercher interdiction explicite)
- [ ] **B.0.5** Y a-t-il une interdiction explicite de fonds colorés ? ___ (si NON → INCLURE)
- [ ] **B.0.6** Nombre de tonalités INCLUSES : ___

**Rappel : "Pas d'interdiction" = "Autorisation implicite" = INCLURE**

**Si B.0.6 ≤ 2 (Light/Dark uniquement), citer l'INTERDICTION EXPLICITE trouvée dans le style guide.**

### Analyse Moods (explorer TOUTES les sources)
- [ ] **B.0.7** `illustration.composition` = "___ " → Mood suggéré : ___
- [ ] **B.0.8** `illustration.metaphor` = "___" → Mood secondaire suggéré : ___
- [ ] **B.0.9** `voice.big_idea` ou `photography.style` suggèrent-ils un autre mood ? ___
- [ ] **B.0.10** Liste des moods trouvés : ___ (si 1 seul, justifier pourquoi pas 2+)
- [ ] **B.0.11** Pour chaque mood, les caractéristiques visuelles sont cohérentes ? ___

**Si B.0.10 = 1 seul mood, expliquer pourquoi `metaphor` et `big_idea` ne suggèrent pas d'alternatives.**

---

## B.1 Extraction des Tonalités Possibles

### Étape 1 : `colors.neutrals`
```
background_primary = ___ → Tonalité : ___
background_secondary = ___ → Tonalité : ___
text_primary = ___ → Utilisable comme fond sombre ? ___
```

### Étape 2 : `colors.primary` et `colors.secondary`

**Rappel Règle #1** : Pas d'interdiction = INCLURE.
```
primary.main = ___ → Cette couleur peut-elle être un fond de slide ?
  - Si oui → Quelle tonalité ? (Warm, Cool, Vibrant, Nature, autre)
  - Si non → POURQUOI ? (documenter la raison)

secondary.main = ___ → Cette couleur peut-elle être un fond de slide ?
  - Si oui → Quelle tonalité ?
  - Si non → POURQUOI ?
```

### Étape 3 : Synthèse

| Couleur source | Hex | Utilisable comme fond ? | Tonalité |
|----------------|-----|-------------------------|----------|
| background_primary | ___ | Oui (par défaut) | ___ |
| background_secondary | ___ | ___ | ___ |
| text_primary | ___ | ___ | ___ |
| primary.main | ___ | ___ | ___ |
| secondary.main | ___ | ___ | ___ |

**Total tonalités distinctes : ___**

---

## B.2 Extraction des Moods (PLURIEL)

**Produit une LISTE de moods, pas un seul.**

### Étape 1 : `illustration.composition` → Mood #1

| Composition | Mood | | Composition | Mood |
|-------------|------|-|-------------|------|
| "Centré/Orbital" | Orbital | | "Directionnel/Dynamique" | Directional |
| "Rayonnant" | Radial | | "Épuré/Minimal" | Minimal |
| "Modulaire/Grille" | Grid | | **Autre** | **Créer** |
| "Organique/Fluide" | Organic | | | |
| "Géométrique/Angular" | Angular | | | |

### Étape 2 : `illustration.metaphor` → Mood #2 potentiel

| Métaphore | Mood | | Métaphore | Mood |
|-----------|------|-|-----------|------|
| "Precision Engineering" | Blueprint | | "Organic growth/Nature" | Organic |
| "Technical/Schematic" | Blueprint | | "Flow/Fluide" | Organic |
| "Isometric/3D technique" | Isometric | | "Network/Connected" | Grid ou Orbital |

### Étape 3 : `voice.big_idea` → Mood #3 ? / `photography.style` → Mood #4 ?

### Étape 4 : Consolider (dédoublonner)

| Source | Valeur | Mood déduit |
|--------|--------|-------------|
| composition | ___ | ___ |
| metaphor | ___ | ___ |
| big_idea | ___ | ___ |
| photography | ___ | ___ |

**Moods retenus :** ___ — Si 1 seul, justifier : `metaphor` et `composition` disent-ils vraiment la même chose ?

---

## B.3 Format de Sortie de l'Analyse (OBLIGATOIRE)

**Après B.0, B.1 et B.2, PRODUIRE ce rapport AVANT d'afficher le tableau.**

### B.3.1 Structure du Rapport

```
═══════════════════════════════════════════════════════════════════════════════
ANALYSE DU STYLE GUIDE [MARQUE]
═══════════════════════════════════════════════════════════════════════════════
Checklist B.0 — Analyse Tonalités
- B.0.1 background_primary = [hex] ([nom]) → Tonalité : [type]
- B.0.2 text_primary = [hex] ([nom]) → Utilisable comme fond Dark ? [OUI/NON]
- B.0.3 primary.main = [hex] ([nom]) → Interdit comme fond ? [OUI/NON] ([raison])
- B.0.4 secondary.main = [hex] ([nom]) → Interdit comme fond ? [OUI/NON]
- B.0.5 Interdiction explicite de fonds colorés ? [OUI/NON] → [INCLURE/EXCLURE]
- B.0.6 Tonalités INCLUSES : [n] ([liste])

Checklist B.0 — Analyse Moods
- B.0.7 illustration.composition = "[valeur]" → [Mood déduit]
- B.0.8 illustration.metaphor = "[valeur]" → [Mood déduit]
- B.0.9 voice.big_idea = "[valeur]" → Confirme [Mood]
- B.0.10 Moods trouvés : [n] ([liste]) — [commentaire]
- B.0.11 Cohérence ? [OUI/NON] — [explication]

JUSTIFICATIONS
• [Tonalité] ([Type]) — [1 phrase]  (répéter pour chaque)
• [Mood] — [Description visuelle]   (répéter pour chaque)

SYNTHÈSE : [2-3 phrases : qui est la marque, pourquoi ces tonalités, pourquoi ces moods]
───────────────────────────────────────────────────────────────────────────────
```

> Voir /lib/examples/variation-examples.md pour des exemples concrets.

### B.3.3 Règles pour la Synthèse

2-3 phrases accessibles : (1) Qui est la marque, (2) Pourquoi ces tonalités, (3) Pourquoi ces moods.

**APRÈS ce rapport, afficher le tableau des variations (section C).**

---

# C. FORMAT DU TABLEAU DE PROPOSITIONS

## C.1 Template Standard

```
┌──────────────────────────────────────────────────────────────────┐
│           VARIATIONS POSSIBLES (déduites du style guide)         │
├────┬──────────────┬──────────────────┬───────────────────────────┤
│ #  │ Mood         │ Tonalité         │ Description               │
├────┼──────────────┼──────────────────┼───────────────────────────┤
│ 1  │ [mood]       │ [tonalité 1]     │ [description contextuelle]│
│ 2  │ [mood]       │ [tonalité 2]     │ [description contextuelle]│
│ ...│ ...          │ ...              │ ...                       │
└────┴──────────────┴──────────────────┴───────────────────────────┘
```

## C.2 Règles de Construction

**Rappel** : Produit cartésien (Règle #3) : Nb options = Nb moods × Nb tonalités (+ Mix)

1. **Lister TOUS les moods trouvés** (souvent 2-3)
2. **Lister TOUTES les tonalités** (inclure par défaut sauf interdiction explicite)
3. **Chaque combinaison mood×tonalité = une ligne**
4. **Descriptions contextuelles** : adapter au secteur/persona du brief

> Voir /lib/examples/variation-examples.md pour des exemples concrets.

---

# D. RÈGLES DE CONFORMITÉ VARIATION

## D.1 Conformité Tonalité

**Checklist obligatoire :**

- [ ] Toutes les tonalités possibles ont été explorées (pas seulement Light/Dark)
- [ ] Si seulement 2 tonalités, la raison est documentée
- [ ] Fonds conformes à ceux définis dans le style guide
- [ ] Couleurs de texte adaptées au fond (contraste suffisant)
- [ ] Si Mix : ratio ~70/30 respecté
- [ ] Si Mix : pas 2 slides de même tonalité d'accent consécutives

## D.2 Conformité Mood

**Checklist obligatoire :**

- [ ] Le mood correspond EXACTEMENT à `illustration.composition`
- [ ] Si pas de correspondance exacte, un nouveau mood a été créé
- [ ] Le mood n'a PAS été forcé dans un mapping approximatif
- [ ] Éléments décoratifs conformes à `illustration.composition`
- [ ] Trait = `illustration.trait`
- [ ] Mouvement = `illustration.movement`
- [ ] Couleurs = `illustration.nodes` uniquement

## D.3 Règle de Variation Intra-Mood

**Même avec un seul mood, VARIER les illustrations entre slides.**

| Levier | Exemples |
|--------|----------|
| Taille | Petits éléments vs grands éléments |
| Position | Centre, coin, hors-champ partiel |
| Densité | 2 éléments vs 5 éléments |
| Formes | Variations dans le vocabulaire du mood |
| Opacité | Éléments légers vs marqués |
| Direction | Variations d'orientation |

---

# E. WORKFLOW COMPLET

**Voir G.7 pour le workflow complet Phases 1 + 2.**

Phase 1 (variations globales) : B.0 → B.1 → B.2 → B.3 → Tableau C → Choix → Génération → Partie E du checker.

**Rappel :** Un tableau de 3-4 options est l'EXCEPTION (marque très restrictive). La norme est 8-12 options.

**Itération :** Si l'utilisateur demande une autre variation, ne PAS re-demander les inputs contenu. Afficher le tableau, attendre le choix, régénérer.

---

# F. ANTI-PATTERNS À ÉVITER

## F.1 Erreurs INTERDITES

| Erreur | Correction |
|--------|------------|
| Ne proposer qu'UN seul mood | Explorer composition + metaphor + big_idea pour trouver 2-3 moods |
| Exclure une tonalité "par prudence" | INCLURE par défaut, exclure seulement si interdiction EXPLICITE |
| "Pas de confirmation" → exclure | "Pas d'interdiction" → INCLURE |
| Forcer "Directionnel" dans "Angular" | Créer un mood "Directional" |
| Ignorer `metaphor` comme source de mood | Toujours vérifier si metaphor suggère un mood différent |
| Proposer 3-4 options pour toutes les marques | Calculer : moods × tonalités = nb options (souvent 8-12) |
| Copier la structure des exemples | Chaque marque a sa propre matrice moods × tonalités |
| Être "conservateur par défaut" | L'utilisateur peut rejeter ; il ne peut pas deviner ce que tu n'as pas proposé |

**Auto-check** : Si ton tableau a ≤4 options pour une marque non-restrictive, revoir F.1.

## F.4 Erreurs Layout (Phase 2)

| Erreur | Correction |
|--------|------------|
| Utiliser une liste fermée de types de slides | DÉDUIRE le type du contenu de la slide |
| Utiliser une liste fermée de layouts | DÉDUIRE les layouts possibles dynamiquement |
| Proposer un layout sans vérifier le style guide | TOUJOURS vérifier contre `tokens.json` |
| Ignorer `layout.composition` (distinct de `illustration.composition`) | Vérifier les DEUX séparément |
| Proposer 1 seule alternative par slide | Minimum 2-3 alternatives |
| Layouts différents dans un même segment workflow | Même layout pour tout le segment |
| Changer les couleurs avec le layout | Le layout ne change que l'arrangement |
| **Vérifier APRÈS avoir proposé/généré** | **Vérifier AVANT de proposer (GATE G.3.5)** |
| **Utiliser des critères subjectifs ("à peu près asymétrique")** | **Utiliser des critères MESURABLES (ratio ≥ 60/40)** |
| **Se déclarer conforme sans preuves chiffrées** | **Montrer les calculs (ratios, positions en px)** |

---

# G. VARIATIONS DE LAYOUT (Phase 2) — APPROCHE DYNAMIQUE

## G.1 Définition

Layouts = ARRANGEMENT SPATIAL (APRÈS génération). Scope par slide, DÉDUIT du contenu + style guide.

**RESTE IDENTIQUE :** Couleurs, typographies, mood, tonalité, contenu textuel.
**CHANGE :** Position des éléments, ratio texte/visuel, colonnes, placement illustrations, hiérarchie spatiale.

---

## G.2 Process de Déduction des Layouts (DYNAMIQUE)

**PAS DE LISTE FERMÉE. Le générateur DÉDUIT les layouts possibles.**

**Étape 1 — Analyser le contenu** de chaque slide : nb éléments textuels, nb visuels, type de données (metrics, timeline, avant/après...), ratio texte/visuel, appartenance à un groupe workflow.

**Étape 2 — Analyser le style guide** (`tokens.json`) : `layout.preferred_composition`, `layout.grid_columns`, `illustration.composition` (doit matcher le mood), `voice.personality` ("bold" → layouts impactants).

**Étape 3 — Générer les layouts candidats** en fonction de :
1. **Contenu** : titre + 3 bullets + schéma → 2 zones minimum
2. **Style guide** : `asymmetric` → splits 60/40
3. **Mood** : "Orbital" → compositions centrées

| Contenu slide | Style guide | Layouts à proposer |
|---------------|-------------|-------------------|
| Titre + 5 bullets + metrics | `symmetric` | Split 50/50, 3 colonnes égales |
| Titre + 1 schéma dominant | `asymmetric` | Hero 70/30, Full-width + bandeau |
| Titre + timeline 4 étapes | "Directional" | Timeline horizontale, Flowchart |
| Titre + avant/après | N/A | Split vertical, Before/After |
| Titre + 1 métrique clé | `centered` | Métrique hero centrale, focal point |

**Étape 4 — Filtrer selon créativité** : Niveau 1 = symétriques uniquement ; Niveau 2 = légère asymétrie ; Niveau 3 = tous layouts (diagonales, overlays, hors-cadre).

**Étape 5 — Filtrer selon PPTX** : Exclure coordonnées négatives, overlaps complexes, CSS non convertible (voir `/docs/CSS-GUIDELINES.md`).

---

## G.3 Checklist de Conformité Style Guide (OBLIGATOIRE)

**AVANT de proposer un layout, vérifier contre `tokens.json` :**

### G.3.1 Analyse des préférences layout du style guide

- [ ] `layout.preferred_composition` lu : ___
- [ ] `layout.grid_columns` lu : ___
- [ ] `layout.section_rhythm` lu : ___
- [ ] `illustration.composition` lu : ___
- [ ] `voice.personality` lu : ___

### G.3.2 Vérification de compatibilité

Pour CHAQUE layout proposé, remplir ce tableau :

| Layout | Compatible composition ? | Compatible mood ? | Compatible tonalité ? | Compatible PPTX ? | Validé ? |
|--------|--------------------------|-------------------|----------------------|-------------------|----------|
| [layout 1] | ✅/❌ (raison) | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| [layout 2] | ✅/❌ (raison) | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |

### G.3.3 Règles de compatibilité style guide → layout

| Préférence style guide | Layouts FAVORISÉS | Layouts ÉVITÉS |
|------------------------|-------------------|----------------|
| `composition: symmetric` | Splits égaux, centré, colonnes égales | Diagonales, bento, asymétrie forte |
| `composition: asymmetric` | Splits 60/40, bento, hero dominant | Symétrie stricte, colonnes égales |
| `composition: centered` | Hero central, focal point, métrique hero | Splits latéraux égaux |
| `mood: Orbital` | Compositions centrées, éléments radiaux | Layouts linéaires, timelines |
| `mood: Directional` | Timelines, flowcharts, progressions | Layouts statiques, centrés |
| `mood: Grid` | Colonnes égales, matrices, cartes | Asymétrie forte, compositions fluides |
| `mood: Blueprint` | Schémas techniques, annotations, grids | Compositions organiques |

### G.3.4 Critères OBJECTIFS et MESURABLES (OBLIGATOIRE)

**Pour éviter l'auto-complaisance, utiliser ces définitions STRICTES :**

| Terme | Définition OBJECTIVE | Comment vérifier |
|-------|---------------------|------------------|
| **Symétrique** | Ratio gauche/droite entre 45/55 et 55/45 | Mesurer largeur zones en px |
| **Asymétrique** | Ratio gauche/droite ≥ 60/40 ou ≤ 40/60 | Mesurer largeur zones en px |
| **Centré** | Élément principal à ≤ 10% du centre horizontal (640px) | Position left + width/2 ≈ 640px ±64px |
| **Directionnel** | Présence de ≥1 élément de flux (flèche, timeline, numérotation séquentielle) | Compter les éléments de direction |
| **Hero** | Un élément occupe ≥ 60% de la surface slide | Calculer surface élément / (1280×720) |

**Vérification BINAIRE (oui/non, pas de "à peu près") :**
- **Asymétrique** : ratio gauche/droite ≥ 60/40 ? Sinon = équilibré
- **Directionnel** : nb flèches ≥ 1 OU timeline/progression ? Sinon = pas directionnel
- **Centré** : position X centre dans [576-704px] (640±64) ? Sinon = pas centré

---

## G.3.5 GATE BLOQUANT — Vérification AVANT Proposition

**RÈGLE CRITIQUE : La vérification doit être faite AVANT de proposer, pas après.**

### Ordre OBLIGATOIRE du process

```
❌ INTERDIT :
   Proposer intuitivement → Générer → Vérifier après → "Ça tombe bien, c'était conforme"

✅ OBLIGATOIRE :
   Vérifier AVANT → Ne proposer QUE ce qui est conforme → Générer
```

### GATE : Checklist à remplir AVANT d'afficher le tableau

```
═══════════════════════════════════════════════════════════════════
GATE G.3.5 — VÉRIFICATION PRÉ-PROPOSITION (OBLIGATOIRE)
═══════════════════════════════════════════════════════════════════
1. PRÉFÉRENCES EXTRAITES :
   layout.composition = ___ | illustration.composition = ___ | voice.personality = ___

2. POUR CHAQUE LAYOUT CANDIDAT :
   Layout : [description]
   ┌─────────────────────────────────────────────────────────────┐
   │ Asymétrique : ratio ___ / ___ = ___% → ≥60/40 ? → VERDICT │
   │ Directionnel : nb flèches ___ | timeline? ___ → VERDICT    │
   │ Centré : position X = ___px → dans [576-704] ? → VERDICT   │
   └─────────────────────────────────────────────────────────────┘
   → ❌ Non conforme : NE PAS PROPOSER | ✅ Conforme : OK

3. LAYOUTS VALIDÉS :
   - Layout 1 : [description] — validé car [chiffres]
   - Layout 2 : [description] — validé car [chiffres]
═══════════════════════════════════════════════════════════════════
```

**Valeurs RÉELLES obligatoires (pas de "environ"). Sans ce rapport rempli, le tableau ne peut PAS être affiché.**

---

## G.4 Règles de Cohérence

- [ ] **Workflow** : Slides d'un même segment = MÊME layout
- [ ] **Mood** : Layout respecte `illustration.composition` + vocabulaire du mood choisi
- [ ] **Tonalité** : Le layout ne change PAS le fond (fixé en Phase 1)
- [ ] **Contenu** : TOUT le contenu textuel + visuels conservés (rien perdu/tronqué)
- [ ] **PPTX** : Convertible sans perte, pas de coordonnées négatives, CSS supporté (voir `/docs/CSS-GUIDELINES.md`)

---

## G.5 Format du Tableau de Propositions

**APRÈS génération initiale, afficher le tableau avec REPRÉSENTATION VISUELLE des layouts.**

### G.5.1 Deux Modes Disponibles

| Mode | Usage | Lignes/slide |
|------|-------|--------------|
| **Compact** (défaut) | Présentations standard, optimisation tokens | ~15 lignes |
| **Complet** | Présentations complexes, besoin de clarté maximale | ~50 lignes |

**Par défaut : Mode Compact.**

### G.5.2 Légende des Schémas

```
█ = Élément principal (titre, hero)
▪ = Texte secondaire (overline, sous-titre, corps)
▫ = Élément tertiaire (badge, label, date)
░ = Zone décorative / illustration (mood)
▸ = Data / métrique (chiffres clés)
┌─┐ = Card / container
╭─╮ = Élément arrondi (chart, graphique)
```

### G.5.3 Mode Compact (par défaut)

**Format : Schémas côte à côte, ~15 lignes par slide**

```
═══════════════════════════════════════════════════════════════════════════════
SLIDE 1 : [Titre] │ [Tonalité] │ [description contenu]
═══════════════════════════════════════════════════════════════════════════════

[Actuel] [Nom layout]         [A] [Nom alternative]       [B] [Nom alternative]
┌───────────┬────────┐        ┌────────────────────┐      ┌─────────┬─────────┐
│ ZONE 1    │ ZONE 2 │        │      ZONE 1        │      │ ZONE 1  │ ZONE 2  │
│ éléments  │ éléments│       │     éléments       │      │éléments │éléments │
│           │        │        │                    │      │         │         │
└───────────┴────────┘        └────────────────────┘      └─────────┴─────────┘
    XX%        YY%                   centré                   50%       50%

                              [C] Garder l'actuel
```

**Exemple concret (Slide Situation) :**

```
═══════════════════════════════════════════════════════════════════════════════
SLIDE 1 : Situation │ Light │ titre + badge + card problèmes + delta
═══════════════════════════════════════════════════════════════════════════════

[Actuel] Split 55/45          [A] Centré focal            [B] Split 50/50
┌───────────┬────────┐        ┌────────────────────┐      ┌─────────┬─────────┐
│ █ TITRE   │  ░░░   │        │      █ TITRE       │      │ █ TITRE │ ┌─────┐ │
│ ▫ badge   │  déco  │        │   ┌──────────┐     │      │ ▫ badge │ │CARD │ │
│ ┌──────┐  │        │        │   │   CARD   │     │      │ ▸ delta │ │probl│ │
│ │ CARD │  │        │        │   └──────────┘     │      │  ░░░    │ └─────┘ │
│ └──────┘  │        │        │      ▸ delta       │      │         │   ░░░   │
│ ▸ delta   │        │        └────────────────────┘      └─────────┴─────────┘
└───────────┴────────┘             centré                      50%      50%
     55%       45%
                              [C] Garder l'actuel
```

### G.5.4 Mode Complet (sur demande)

Mode Complet : Même contenu que Compact mais avec un bloc détaillé par layout (~50 lignes/slide).
Inclut description complète des éléments, schéma agrandi, ratios mesurés.
Utiliser uniquement si l'utilisateur le demande ou si les layouts sont difficiles à distinguer.

### G.5.5 Groupes Workflow

**Les slides d'un même workflow sont regroupées avec UN SEUL schéma :**

```
═══════════════════════════════════════════════════════════════════════════════
SLIDES 4-5-6 : Workflow Segment (même layout obligatoire)
Contenu type : step indicator + titre + action + interface mockup │ Light
═══════════════════════════════════════════════════════════════════════════════

[Actuel] Split 45/55          [A] Hero Mockup 35/65       [B] Split 50/50
┌────────┬───────────┐        ┌──────┬───────────────┐    ┌─────────┬─────────┐
│ █ TITRE│           │        │█TITRE│               │    │ █ TITRE │         │
│ ▪ action│ ┌───────┐│        │▪ act │  ┌─────────┐  │    │ ▪ action│┌───────┐│
│ ▸ temps │ │MOCKUP ││        │▸ tps │  │ MOCKUP  │  │    │ ▸ temps ││MOCKUP ││
│        │ │       ││        │      │  │ (hero)  │  │    │         ││       ││
│        │ └───────┘│        │      │  └─────────┘  │    │         │└───────┘│
└────────┴───────────┘        └──────┴───────────────┘    └─────────┴─────────┘
   45%       55%                35%        65%                50%       50%

                              [C] Garder l'actuel
```

### G.5.6 Format de Réponse Utilisateur

```
"Slide 1: A, Slide 2: B, Slides 4-5-6: A, Slide 7: garder"
```

Ou format numérique :
```
"1:A, 2:B, 4-6:A, 7:C"
```

---

## G.6 Checklist Pré-Proposition (OBLIGATOIRE)

**Voir G.3.5 pour le GATE bloquant.** Vérifier aussi :

- [ ] **G.6.1** La génération initiale est terminée (présentation complète)
- [ ] **G.6.2** Le mood choisi est noté : ___
- [ ] **G.6.3** La tonalité choisie est notée : ___
- [ ] **G.6.4** Le niveau de créativité est noté : ___
- [ ] **G.6.5** Chaque slide a été analysée (contenu, éléments)
- [ ] **G.6.6** Les groupes workflow sont identifiés (même layout obligatoire)
- [ ] **G.6.7** MINIMUM 2 alternatives par slide/groupe (pas de paresse)

---

## G.7 Workflow Complet (Phases 1 + 2)

**Phase 2 = AUTOMATIQUE après chaque génération.**

```
PHASE 1 : Mood × Tonalité
1. Content Compliance validé → 2. Lire variation-system.md → 3. tokens.json
4. Checklist B.0 → 5. Tonalités (B.1) → 6. Moods (B.2) → 7. Rapport (B.3)
8. Tableau produit cartésien → 9. Afficher + attendre choix → 10. Générer

PHASE 2 : Layout (par slide)
11. Analyser contenu chaque slide → 12. Préférences layout (G.3.1)
13. Déduire layouts candidats → 14. Filtrer (créativité + PPTX)
    ╔══════════════════════════════════════════════════╗
    ║  GATE G.3.5 — Voir G.3.5 pour process complet. ║
    ║  Preuves chiffrées obligatoires. BLOQUANT.      ║
    ╚══════════════════════════════════════════════════╝
15. Groupes workflow → 16. Tableau layouts validés → 17. Choix → 18. Régénérer

ITÉRATION : "Autre mood/tonalité" → étape 4 | "Autre layout" → étape 13 (repasser GATE)
```

> Voir /lib/examples/variation-examples.md pour un exemple concret (NordLogistics).
