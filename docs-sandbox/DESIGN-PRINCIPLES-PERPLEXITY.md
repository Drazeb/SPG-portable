# Principes de Slide Design (Perplexity) — Pour Évaluation

**Objectif** : Cette fiche liste les principes de DESIGN VISUEL issus de la recherche Perplexity. À évaluer par le générateur de design pour déterminer ce qui est déjà implémenté vs ce qui doit être ajouté.

**Note** : Les principes de CONTENU (Action Titles, densité textuelle, etc.) ont déjà été intégrés dans `presentation-excellence.md`. Ce document ne concerne que la partie visuelle/layout/styling.

---

## 1. WHITESPACE (Espace Blanc)

### Source
- Experts : Tufte, Reynolds, Duarte
- Étude : ThinkWithGoogle (2022) — whitespace = +72% rétention

### Principe
Le whitespace (negative space) n'est PAS de l'espace perdu. C'est un **outil de design actif** qui :
- Réduit la charge cognitive
- Améliore la compréhension (+20%)
- Dirige l'attention vers le contenu
- Implique élégance/qualité premium

### Règles Opérationnelles

| Règle | Valeur | Type |
|-------|--------|------|
| **Whitespace par slide** | **40-60%** du slide doit être vide | Règle stricte |
| **Macro whitespace** | Grands espaces entre sections distinctes | Guideline |
| **Micro whitespace** | Petits espaces entre éléments (lignes, images) | Guideline |
| **Marges** | Marges généreuses autour du contenu | Guideline |

### Application Technique
- Ne PAS tenter de remplir chaque centimètre
- Grouper les éléments liés (whitespace autour = unification)
- Séparer les éléments distincts (whitespace entre = séparation)
- Fond simple (couleur unie ou gradient léger)

### Vérification
Mesurer le ratio : `surface_vide / surface_totale` → doit être entre 0.4 et 0.6

---

## 2. TYPOGRAPHIE

### Sources
- Six Minutes, AiPPT, KOAD

### Règles de Sélection de Polices

| Règle | Valeur | Justification |
|-------|--------|---------------|
| **Nombre de polices** | **1-2 maximum** par présentation | Consistance |
| **Type** | **Sans-serif** préféré (Arial, Helvetica, Calibri, Inter) | Lisibilité écran |
| **Polices décoratives** | INTERDITES (Comic Sans, scripts, ornementales) | Professionnalisme |

### Tailles Recommandées

| Élément | Taille minimum | Taille optimale |
|---------|----------------|-----------------|
| **Titre** | 30pt (règle Kawasaki) | 36-44pt |
| **Sous-titre** | 24pt | 28-32pt |
| **Body text** | 18pt | 20-24pt |
| **Légendes** | 14pt | 16-18pt |

### Interligne (Line Spacing)
- **Body text** : 1.15 à 1.5
- Plus d'espace = meilleure lisibilité

### Alignement

| Type | Usage |
|------|-------|
| **Left-aligned** | Standard pour body text (lecture naturelle) |
| **Center-aligned** | Titres, slides intro/conclusion |
| **Right-aligned** | Rarement (éléments spécifiques) |
| **Justified** | À ÉVITER (crée espaces irréguliers) |

### Test de Lisibilité
> "Si quelqu'un avec vision fatiguée, au fond de la salle, avec projecteur médiocre, ne peut pas lire → police trop petite."

---

## 3. CONTRASTE

### Source
- WCAG (Web Content Accessibility Guidelines)

### Ratios de Contraste Minimum

| Type de texte | Ratio minimum |
|---------------|---------------|
| **Normal text** (< 18pt) | **4.5:1** |
| **Large text** (≥ 18pt ou 14pt bold) | **3:1** |

### Exemples de Ratios

| Combinaison | Ratio | Verdict |
|-------------|-------|---------|
| Fond blanc + texte noir | ~21:1 | ✅ Excellent |
| Fond bleu foncé + texte blanc | ~15:1 | ✅ Excellent |
| Fond gris clair + texte gris | <3:1 | ❌ Insuffisant |

### Test Pratique
Convertir le slide en noir & blanc → si illisible, contraste insuffisant.

---

## 4. HIÉRARCHIE VISUELLE

### Sources
- Nancy Duarte, principes de design

### Techniques de Création de Hiérarchie

| Technique | Application | Impact |
|-----------|-------------|--------|
| **Taille** | Titres 3-4× plus gros que body text | Fort |
| **Poids** | Bold pour titres/emphase, Regular pour body | Moyen |
| **Couleur** | Couleur accent pour points clés | Fort |
| **Contraste** | Fort contraste texte/fond (4.5:1 min) | Fort |
| **Espacement** | Grouper éléments liés, séparer distincts | Moyen |
| **Position** | Haut de slide = plus important | Moyen |

### Principe Clé
Établir un **ordre de lecture clair** pour guider l'œil de l'audience.

### Glance Test (Test des 3 secondes)
> "Votre audience peut-elle comprendre le sens de ce slide en 3 secondes ?"
> Si non → hiérarchie insuffisante ou slide trop chargé.

---

## 5. COULEUR

### Principes

| Règle | Valeur |
|-------|--------|
| **Palette principale** | **2-3 couleurs** maximum |
| **Couleur accent** | **1 couleur** pour highlights/CTA |
| **Consistance** | Même palette sur TOUS les slides |

### Branding
- Aligner avec identité de marque (logos, charte graphique)
- Logo placement : coin (petit, discret) sur chaque slide

### Application B2B
- Consistance = Trust
- Slides qui semblent venir de différents decks → impression de manque de professionnalisme

---

## 6. DATA VISUALIZATION (Tufte)

### Source
- Edward Tufte — référence absolue en data viz depuis 40+ ans
- Livres : "The Visual Display of Quantitative Information", "Visual Explanations"

### Concept 1 : Data-Ink Ratio

**Définition** : Maximiser l'encre représentant la data, minimiser l'encre non-data.

```
Data-Ink Ratio = Encre utilisée pour afficher data / Encre totale du graphique
```

**Objectif** : Ratio le plus élevé possible.

**Application** :
- Supprimer grilles excessives
- Enlever bordures décoratives
- Réduire couleurs non nécessaires
- Simplifier axes

### Concept 2 : Lie Factor

**Définition** : Mesure de l'honnêteté graphique.

```
Lie Factor = Taille de l'effet montré graphiquement / Taille de l'effet dans les données
```

**Règle** : Lie Factor doit être **≈ 1.0** (représentation proportionnelle).
- Si > 1 → Graphique exagère l'effet (trompeur)

### Concept 3 : Chartjunk

**Définition** : Tout ce qui ne représente PAS de data.

**Éléments à ÉLIMINER** :
- Effets 3D inutiles
- Ombres décoratives
- Patterns/textures distrayants
- Icônes décoratives
- Gradients non-fonctionnels

### Les 6 Principes de Graphical Integrity (Tufte)

1. Représentation proportionnelle (nombres = quantités visuelles)
2. Labelling clair et détaillé
3. Montrer variation de DATA, pas variation de DESIGN
4. Utiliser dollars standards (ajuster inflation si comparaisons temporelles)
5. Ne pas utiliser plus de dimensions que nécessaire
6. Contexte adéquat (ne pas sortir data de son contexte)

### Shrink Principle
La plupart des graphiques peuvent être **réduits significativement** sans perte de lisibilité.

### Small Multiples
Série de petits graphiques identiques répétés = excellent pour visualiser grandes quantités de data.

---

## 7. VISUAL BREATHERS (Slides de Respiration)

### Source
- Analyse de decks B2B performants (Spendesk, etc.)

### Principe
Les decks bénéficient de **"visual breathers"** — slides avec TRÈS peu de contenu qui servent de transition.

### Application
- Tous les 3-4 slides denses → insérer 1 slide "breather"
- Slide breather = header seul, ou visual simple + 1 phrase
- Exemple : Slide avec juste "Here's how we work" (bold header)

### Rationale
- Rythme visuel
- Pas d'overwhelm
- Maintient engagement
- Aide lecture asynchrone (buying committee lit sans vous)

---

## 8. BEFORE/AFTER VISUALIZATION

### Source
- Gap Selling, best practices sales decks

### Principe
Le commercial B2B = vendre le **changement d'état**. Plus le gap est visuellement dramatique, plus l'urgence est perçue.

### Pattern 1 : Side-by-side Comparison

```
┌──────────────────────┬──────────────────────┐
│       BEFORE         │        AFTER         │
├──────────────────────┼──────────────────────┤
│ • Pain point 1       │ • Outcome 1          │
│ • Pain point 2       │ • Outcome 2          │
│ • Cost: $X           │ • Savings: $Y        │
└──────────────────────┴──────────────────────┘
```

### Pattern 2 : Gap Visualization

```
Current State ────[THE GAP]────→ Future State
   (problème)    (votre solution)   (objectif)
```

### Règle Design
- Côte-à-côte (pas séquentiel)
- Contraste visuel fort entre les deux états
- Chiffres mis en évidence (taille plus grande)

---

## 9. METRICS SLIDES (Chiffres Clés)

### Format Gagnant

| Élément | Spécification |
|---------|---------------|
| **Chiffre principal** | 80-100pt au centre |
| **Contexte** | Texte minimal autour ("reduction in churn") |
| **Icon** | Simple, pour renforcer visuellement |

### Exemple Layout

```
┌─────────────────────────────────────┐
│                                     │
│              73%                    │  ← Chiffre géant
│                                     │
│     reduction in processing time    │  ← Contexte minimal
│                                     │
│            [icon ⏱️]                │  ← Renforcement visuel
│                                     │
└─────────────────────────────────────┘
```

---

## 10. SOCIAL PROOF SLIDES (Logos, Testimonials)

### Logo Wall

| Spécification | Valeur |
|---------------|--------|
| **Nombre de logos** | 8-12 reconnaissables |
| **Organisation** | Par industrie ou taille |
| **Qualité** | Haute résolution, pas pixelisés |

### Testimonial Quote

| Élément | Spécification |
|---------|---------------|
| **Quote** | 2-3 lignes maximum |
| **Photo** | Personne qui témoigne |
| **Attribution** | Nom + Titre + Entreprise |

### Case Study Metrics

| Élément | Spécification |
|---------|---------------|
| **Client** | Nom visible |
| **Challenge** | 1 ligne |
| **Result** | Chiffres en gros (60pt+) |

---

## 11. CLOSING/CTA SLIDES

### Format Next Steps

```
┌─────────────────────────────────────┐
│     NEXT STEPS                      │
│                                     │
│  1. Schedule technical deep-dive    │
│     (Week of [date])                │
│                                     │
│  2. Provide ROI calculator          │
│     (Send by [date])                │
│                                     │
│  3. Introduce to your CFO           │
│     (Meeting [date])                │
│                                     │
│  📧 Contact: [name@company.com]     │
│  📞 Direct: [phone]                 │
└─────────────────────────────────────┘
```

### Éléments Essentiels
- Steps numérotés (1, 2, 3)
- Timeframes spécifiques (pas "soon" ou "later")
- Contact direct (nom + email + phone)
- Ton confiant ("Let's do this" vs "Thank you")

### Mutual Action Plan (Timeline Visuelle)

```
Week 1       Week 2        Week 4        Week 6
  │            │             │             │
  ▼            ▼             ▼             ▼
Discovery → Tech eval → Legal rev → Go-live
```

---

## 12. CHECKLIST QUALITÉ VISUELLE

### Checklist Finale (avant export)

- [ ] Aucune faute d'orthographe/grammaire
- [ ] Images haute résolution (pas pixelisées)
- [ ] Alignement parfait des éléments
- [ ] Couleurs consistantes (pas de variations)
- [ ] Graphiques professionnels (pas clipart)
- [ ] Formatting uniforme (tailles, espacements)
- [ ] Logo placement consistant
- [ ] Whitespace 40-60%
- [ ] Contraste texte/fond ≥ 4.5:1

### Test Final
> "Imprimer deck → si ça a l'air cheap sur papier, ça a l'air cheap à l'écran."

---

## RÉCAPITULATIF POUR LE GÉNÉRATEUR DE DESIGN

| Principe | Valeur Clé | Mesurable ? |
|----------|------------|-------------|
| Whitespace | 40-60% | ✅ Oui (ratio surface) |
| Typo - Polices | 1-2 max | ✅ Oui (count) |
| Typo - Taille min | 18pt body, 30pt titre | ✅ Oui |
| Typo - Interligne | 1.15-1.5 | ✅ Oui |
| Contraste | 4.5:1 minimum | ✅ Oui (ratio calculable) |
| Couleurs | 2-3 palette + 1 accent | ✅ Oui (count) |
| Data-ink ratio | Maximiser | ⚠️ Subjectif |
| Chartjunk | Éliminer | ⚠️ Subjectif |
| Visual breathers | 1 pour 3-4 denses | ✅ Oui (ratio slides) |
| Before/After | Côte-à-côte | ✅ Oui (layout) |
| Metrics | 80-100pt chiffre | ✅ Oui |
| Logo wall | 8-12 logos | ✅ Oui |
| CTA | Steps numérotés + dates | ✅ Oui |

---

## QUESTIONS POUR LE GÉNÉRATEUR DE DESIGN

1. **Whitespace 40-60%** — Est-ce mesuré/appliqué actuellement ?
2. **Contraste 4.5:1** — Y a-t-il une vérification automatique ?
3. **Data-ink ratio** — Les graphiques générés suivent-ils Tufte ?
4. **Visual breathers** — Le système insère-t-il des slides de respiration ?
5. **Before/After layouts** — Existe-t-il des templates côte-à-côte ?
6. **Metrics slides** — Y a-t-il un template "chiffre géant centré" ?
7. **Tailles de police** — Sont-elles conformes aux minimums (18pt body, 30pt titre) ?
