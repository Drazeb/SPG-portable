# Exemples Concrets — Système de Variations

**Ce fichier contient les exemples détaillés extraits de `/lib/variation-system.md`.**

---

## Exemple 1 : Earth Craft (Rapport d'Analyse B.3)

**Source : Section B.3.2 de variation-system.md**

```
═══════════════════════════════════════════════════════════════════════════════
ANALYSE DU STYLE GUIDE EARTH CRAFT
═══════════════════════════════════════════════════════════════════════════════

Checklist B.0 — Analyse Tonalités
─────────────────────────────────────────────────────────────────────────────
- B.0.1 background_primary = #FFFBEB (Cream) → Tonalité : Light/Warm
- B.0.2 text_primary = #292524 (Soil) → Utilisable comme fond Dark ? OUI
- B.0.3 primary.main = #C2410C (Terra) → Interdit comme fond ? NON (audace 2/3, craft visible)
- B.0.4 secondary.main = #65A30D (Sage) → Interdit comme fond ? NON
- B.0.5 Interdiction explicite de fonds colorés ? NON → INCLURE
- B.0.6 Tonalités INCLUSES : 4 (Cream, Soil, Terra, Sage)

Checklist B.0 — Analyse Moods
─────────────────────────────────────────────────────────────────────────────
- B.0.7 illustration.composition = "Organique / Croissance" → Organic Growth
- B.0.8 illustration.metaphor = "Terroir & Craft" → Botanical (prompt: "vintage field guide style")
- B.0.9 voice.big_idea = "ROOTED TECH" → Confirme Organic Growth
- B.0.10 Moods trouvés : 2 (Organic Growth, Botanical) — similaires mais visuellement distincts
- B.0.11 Cohérence ? OUI — les deux expriment la même philosophie

═══════════════════════════════════════════════════════════════════════════════
JUSTIFICATIONS
═══════════════════════════════════════════════════════════════════════════════

Tonalités (4 retenues) :
─────────────────────────────────────────────────────────────────────────────
• Cream (Light) — Fond naturel par défaut, évoque le papier craft, chaleureux
• Soil (Dark) — Fond premium terreux, ancrage profond, contraste élégant
• Terra (Warm) — Signature brand forte, audace artisanale, craft visible
• Sage (Nature) — Accent végétal, cohérent avec "Rooted Tech", fraîcheur

Moods (2 retenus) :
─────────────────────────────────────────────────────────────────────────────
• Organic Growth — formes abstraites (racines, branches, courbes fluides)
• Botanical — illustrations figuratives (style field guide, plantes, mains artisanales)

═══════════════════════════════════════════════════════════════════════════════
SYNTHÈSE
═══════════════════════════════════════════════════════════════════════════════

Earth Craft est une marque artisanale "Rooted Tech" qui valorise l'authenticité
et le savoir-faire. La palette terre/crème/sauge traduit cette connexion au
terroir, tandis que les deux moods (Organic Growth et Botanical) offrent le
choix entre l'abstrait organique et l'illustration naturaliste — deux facettes
de la même philosophie craft.

───────────────────────────────────────────────────────────────────────────────
```

---

## Exemple 2 : IgnitionTech (Tableau Multi-Mood)

**Source : Section C.3 de variation-system.md**

**Analyse du style guide :**
- composition: "Directionnel" → Mood #1 : Directional
- metaphor: "Precision Engineering" → Mood #2 : Blueprint
- background_primary: #FFFFFF → Light
- text_primary: #18181B → Dark possible
- primary.main: #EA580C (orange) → Pas d'interdiction trouvée, contraste OK → **INCLURE comme Ignition**
- photography: "orange and charcoal aesthetic" → Confirme l'orange

**2 moods x 3 tonalites (+ Mix) = 9 options**

```
┌───────────────────────────────────────────────────────────────────────┐
│              VARIATIONS POSSIBLES (IgnitionTech)                      │
├────┬─────────────┬───────────────────┬────────────────────────────────┤
│ #  │ Mood        │ Tonalité          │ Description                    │
├────┼─────────────┼───────────────────┼────────────────────────────────┤
│ 1  │ Directional │ Light             │ Épuré, dynamique, accessible   │
│ 2  │ Directional │ Dark              │ Premium, tech, impactant       │
│ 3  │ Directional │ Ignition (orange) │ Bold, énergique, signature     │
│ 4  │ Directional │ Mix (Light/Dark)  │ Équilibré, accents sombres     │
│ 5  │ Directional │ Mix (Dark/Ignit.) │ Premium avec éclats orange     │
├────┼─────────────┼───────────────────┼────────────────────────────────┤
│ 6  │ Blueprint   │ Light             │ Technique, précis, didactique  │
│ 7  │ Blueprint   │ Dark              │ Industriel, expert, schematic  │
│ 8  │ Blueprint   │ Ignition (orange) │ Ingénierie visible, audacieux  │
│ 9  │ Blueprint   │ Mix (Dark/Ignit.) │ Technique premium, catalyseur  │
└────┴─────────────┴───────────────────┴────────────────────────────────┘
```

**Note :** 9 options parce que 2 moods x 3 tonalites de base + 2 Mix pertinents.

---

## Exemple 3 : TechCorp (Marque Restrictive — Cas Rare)

**Source : Section C.4 de variation-system.md**

**Analyse du style guide :**
- composition: "Grid" → Mood unique (métaphore = "modulaire", pas d'alternative)
- primary.main: #3B82F6 → **Interdiction EXPLICITE trouvée** : "fonds blancs/noirs uniquement"

**1 mood x 2 tonalites (+ Mix) = 3 options**

```
┌────────────────────────────────────────────────────────────────┐
│              VARIATIONS POSSIBLES (TechCorp)                   │
├────┬──────────┬──────────────────┬─────────────────────────────┤
│ #  │ Mood     │ Tonalité         │ Description                 │
├────┼──────────┼──────────────────┼─────────────────────────────┤
│ 1  │ Grid     │ Light            │ Clean, professionnel        │
│ 2  │ Grid     │ Dark             │ Tech, moderne               │
│ 3  │ Grid     │ Mix (Light dom.) │ Équilibré, accents sombres  │
└────┴──────────┴──────────────────┴─────────────────────────────┘
```

**Ce cas a 3 options est l'EXCEPTION RARE. Il requiert :**
- Une interdiction EXPLICITE des fonds colorés (citée)
- Une métaphore qui dit la même chose que la composition (pas d'alternative mood)

---

## Exemple 4 : NordLogistics (Approche Dynamique Layout — Phase 2)

**Source : Section G.8 de variation-system.md**

**Contexte :**
- Présentation NordLogistics
- Mood : Blueprint (choisi en Phase 1)
- Tonalité : Mix Dark/Ignition (choisi en Phase 1)
- Niveau : 3 (Audacieux)
- Style guide : `layout.preferred_composition: "asymmetric"`, `illustration.composition: "Directional"`

**Analyse Slide 1 :**
- Contenu : Titre + 3 specs techniques + 1 schéma architecture
- Style guide : asymétrique préféré, directionnel
- Layouts DÉDUITS et vérifiés :
  - Split 60/40 (schéma dominant) — asymétrique, compatible Blueprint
  - Bento (1 grande zone schéma + 3 petites specs) — asymétrique
  - Full-width schéma + bandeau specs — compatible niveau 3, Blueprint

**Analyse Slide 3 :**
- Contenu : Titre + roadmap 4 étapes
- Style guide : directionnel
- Layouts DÉDUITS et vérifiés :
  - Timeline horizontale — directionnel, montre progression
  - Flowchart connecté — Blueprint, technique
  - Split 50/50 — Pas optimal pour mood Directional (évité)

**Tableau proposé :**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  VARIATIONS DE LAYOUT DISPONIBLES                                            │
│  Contraintes : Mood = Blueprint, Tonalité = Mix Dark/Ignition, Niveau = 3    │
│  Style guide : composition = asymmetric, illustration = Directional          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SLIDE 1 : Situation Technique                                               │
│  Contenu : 4 textes + 1 schéma │ Fond : Dark                                 │
│  ────────────────────────────────────────────────────────────────────────    │
│  Layout actuel : Split 50/50                                                 │
│  Alternatives :                                                              │
│  [1] Split 60/40 (schéma dominant) — favorise asymétrie du style guide       │
│  [2] Bento (1 grande + 3 petites) — asymétrique, met en valeur specs         │
│  [3] Full-width schéma + bandeau bas — audacieux niveau 3, Blueprint         │
│                                                                              │
│  SLIDE 3 : Roadmap Technique                                                 │
│  Contenu : 1 titre + 4 étapes │ Fond : Dark                                  │
│  ────────────────────────────────────────────────────────────────────────    │
│  Layout actuel : Liste verticale                                             │
│  Alternatives :                                                              │
│  [1] Timeline horizontale — compatible mood Directional (progression)        │
│  [2] Flowchart connecté — style Blueprint, technique                         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Réponse utilisateur :**
"Slide 1: 2, Slide 3: 1"

→ Régénération des slides 1 et 3 avec les nouveaux layouts.
