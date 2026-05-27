# CSS Guidelines pour dom-to-pptx

Ce document liste les règles CSS à respecter pour maximiser la fidélité de conversion HTML → PPTX avec dom-to-pptx.

---

## Principe Fondamental

> **Écrire du CSS "conservateur"** : préférer les propriétés simples et explicites aux propriétés modernes ou implicites.

---

## ⭐ RÈGLE D'OR : SVG dans Container Positionné (TESTÉ Février 2026)

> **Les SVG fonctionnent parfaitement, MAIS jamais `position:absolute` directement sur le SVG.**
> **Toujours mettre le SVG dans un `<div>` container positionné.**

### ✅ CORRECT : SVG dans container positionné

```html
<!-- Container positionné, SVG sans position -->
<div style="position: absolute; top: 200px; left: 200px;">
  <svg width="200" height="200" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="80" fill="#2DD4BF"/>
  </svg>
</div>

<!-- Avec classe CSS -->
<style>
  .svg-container { position: absolute; top: 200px; left: 400px; }
</style>
<div class="svg-container">
  <svg width="200" height="200" viewBox="0 0 200 200">
    <polygon points="100,10 190,100 100,190 10,100" fill="#0F766E"/>
  </svg>
</div>
```

### ❌ INTERDIT : Position directe sur SVG

```html
<!-- ❌ INTERDIT - position:absolute sur le SVG lui-même -->
<svg style="position: absolute; top: 200px; left: 200px;" width="200" height="200">
  <circle cx="100" cy="100" r="80" fill="#2DD4BF"/>
</svg>
```

### Éléments SVG supportés

| Élément | Supporté | Notes |
|---------|----------|-------|
| `<circle>` | ✅ | Dans container positionné |
| `<ellipse>` | ✅ | Dans container positionné |
| `<rect>` | ✅ | Dans container positionné |
| `<polygon>` | ✅ | Hexagones, triangles, formes complexes |
| `<line>` | ✅ | Grilles, lignes décoratives |
| `<path>` lignes droites | ✅ | Commandes M, L uniquement |
| `<path>` courbes (Q, C, S, A) | ❌ | Disparaît - utiliser canvas |
| `<text>` | ❌ | **INTERDIT - utiliser div HTML** |

---

## ⛔ RÈGLE CRITIQUE : Jamais de `<text>` dans SVG (TESTÉ 3 Février 2026)

> **L'élément `<text>` à l'intérieur d'un SVG fait DISPARAÎTRE tout le SVG dans le PPTX.**
> **Toujours utiliser un `<div>` HTML positionné par-dessus le SVG pour les labels.**

### ❌ INTERDIT : `<text>` dans SVG

```html
<!-- ❌ INTERDIT - <text> fait disparaître tout le SVG -->
<div style="position: absolute; top: 300px; left: 280px;">
  <svg width="400" height="200" viewBox="0 0 400 200">
    <polygon points="150,20 250,20 270,50 270,150 250,180 150,180 130,150 130,50" fill="#EA580C"/>
    <text x="200" y="105" font-family="Inter" font-size="14" fill="#FFFFFF">ENGINE</text>
  </svg>
</div>
```

### ✅ CORRECT : SVG pour les formes + div HTML pour le texte

```html
<!-- SVG : formes uniquement -->
<div style="position: absolute; top: 300px; left: 280px;">
  <svg width="400" height="200" viewBox="0 0 400 200">
    <polygon points="150,20 250,20 270,50 270,150 250,180 150,180 130,150 130,50" fill="#EA580C"/>
  </svg>
</div>

<!-- Texte : div HTML positionné par-dessus -->
<div style="position: absolute; top: 390px; left: 440px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; color: #FFFFFF; width: 80px; text-align: center;">
  ENGINE
</div>
```

### Calcul du positionnement du texte

Pour centrer un texte sur une forme SVG :
```
top_texte = top_container_SVG + position_Y_forme_dans_SVG - (hauteur_texte / 2)
left_texte = left_container_SVG + position_X_forme_dans_SVG - (largeur_texte / 2)
```

### Quand utiliser cette technique

| Situation | Solution |
|-----------|----------|
| Label sur une forme SVG | div HTML par-dessus |
| Schéma technique avec annotations | SVG formes + divs HTML labels |
| Infographie très complexe (10+ éléments) | Canvas HTML (→ image PNG) |

---

### Exemple canonique : Cercles orbitaux

```html
<!-- Container principal positionné -->
<div style="position: absolute; top: 160px; left: 440px;">
  <svg width="300" height="300" viewBox="0 0 300 300">
    <!-- Grand cercle -->
    <circle cx="150" cy="150" r="140" fill="none" stroke="#2DD4BF" stroke-width="2"/>
    <!-- Cercle moyen -->
    <circle cx="150" cy="150" r="90" fill="none" stroke="#185057" stroke-width="2"/>
    <!-- Cercle central -->
    <circle cx="150" cy="150" r="40" fill="#0F766E"/>
    <!-- Points orbitaux -->
    <circle cx="150" cy="10" r="8" fill="#2DD4BF"/>
    <circle cx="290" cy="150" r="6" fill="#0F766E"/>
  </svg>
</div>
```

### ⚠️ Overflow : Tout doit rester dans les limites

> **Ne jamais faire dépasser un élément hors de la slide (1280x720).** `overflow: hidden` n'est pas géré par dom-to-pptx. Pas de coordonnées négatives. Tous les éléments doivent rester dans 0-1280px (horizontal) et 0-720px (vertical).

```css
/* ❌ ÉVITER - Élément qui dépasse */
.decorative-shape {
  position: absolute;
  right: -50px;  /* Dépasse à droite */
}

/* ❌ ÉVITER - Coordonnées négatives */
.decorative-number {
  position: absolute;
  top: -80px;    /* INTERDIT - sort de la slide */
  right: -40px;  /* INTERDIT - sort de la slide */
}

/* ✅ OK - Entièrement dans la slide */
.decorative-shape {
  position: absolute;
  left: 820px;   /* Calculé : reste dans les 1280px */
}
```

### ⚠️ Positionnement : JAMAIS `right` ou `bottom` (TESTÉ Février 2026)

> **Toujours utiliser `left` et `top`. Convertir `right` et `bottom` en calculant les valeurs.**

```css
/* ❌ INTERDIT - right/bottom causent des troncatures */
.svg-decoration {
  position: absolute;
  top: 200px;
  right: 100px;  /* ❌ INTERDIT */
  width: 400px;
  height: 400px;
}

/* ✅ OBLIGATOIRE - Convertir en left/top */
.svg-decoration {
  position: absolute;
  top: 200px;
  left: 780px;   /* ✅ Calcul : 1280 - 100 - 400 = 780 */
  width: 400px;
  height: 400px;
}
```

**Formules de conversion :**
```
left = 1280 - right - width      (ex: 1280 - 100 - 400 = 780px)
top = 720 - bottom - height      (ex: 720 - 50 - 400 = 270px)
```

### ⚠️ Texte : Width OBLIGATOIRE sur tous les éléments (TESTÉ Février 2026)

> **Chaque élément texte DOIT avoir un `width` explicite pour éviter les retours à la ligne dans PPTX.**

```css
/* ❌ INTERDIT - Texte sans width (retour à la ligne dans PPTX) */
.ghost-text {
  position: absolute;
  top: 80px;
  left: 60px;
  font-size: 140px;
  /* PAS DE WIDTH → "OXYGEN" devient "OXYGE\nN" */
}

/* ✅ OBLIGATOIRE - Width calculé */
.ghost-text {
  position: absolute;
  top: 80px;
  left: 60px;
  font-size: 140px;
  width: 620px;  /* ✅ Calcul : 6 chars × 85px × 1.2 = 612 → 620px */
}
```

**Formule :** `width = nombre_caractères × (font-size × 0.6) × 1.2`

**Walkthrough complet :** "OXYGEN" en 140px → Caractères: 6, Largeur/char: 140 × 0.6 = 84px, Total: 6 × 84 = 504px, Avec marge +20%: 504 × 1.2 = 605px → arrondir à 620px

| font-size | Largeur/char (~) | "OXYGEN" (6) | "VoltaPilot" (11) |
|-----------|------------------|--------------|-------------------|
| 140px | 85px | 620px | 1125px |
| 96px | 58px | 420px | 770px |
| 72px | 43px | 310px | 570px |
| 48px | 29px | 210px | 385px |
| 24px | 14px | 100px | 185px |

### ⚠️ Texte : Taille maximale 150px pour les décoratifs

> **Ne jamais utiliser de `font-size` supérieur à 150px.** Les textes 200px+ deviennent des formes géométriques dans PPTX.

| Type de texte | Taille min | Taille max |
|---------------|------------|------------|
| Contenu (titres, paragraphes) | 12px | 96px |
| Texte décoratif (ghost, watermark) | 48px | 150px |
| Chiffres héros (stats mises en avant) | 48px | 140px |

### ⚠️ Transform : Un seul par zone

> **Ne jamais superposer deux éléments avec le même `transform: translate(-50%, -50%)` au même endroit.** PPTX mal gère le z-index dans ce cas. Utiliser des positions absolues explicites différentes pour chaque élément.

### ⚠️ Opacity : Jamais sur le conteneur, toujours dans le fill

> **Ne jamais mettre `opacity` sur un div conteneur. Mettre l'opacité dans le `fill` du SVG avec `rgba()`.**

```html
<!-- ❌ ÉVITER - Opacity sur le conteneur (ignoré) -->
<div style="opacity: 0.15;">
  <svg><polygon fill="#18181B"/></svg>
</div>

<!-- ✅ OK - Opacity dans le fill -->
<div>
  <svg><polygon fill="rgba(24, 24, 27, 0.15)"/></svg>
</div>
```

### ⚠️ Texte avec opacité : Couleurs pleines uniquement (TESTÉ)

> **Ne JAMAIS utiliser `rgba()` ou `color` avec opacité pour du texte.** dom-to-pptx rend tout à 100% opaque. Utiliser des couleurs HEX pleines qui simulent la transparence.

```css
/* ❌ ÉVITER - Opacité texte (devient opaque à 100%) */
.ghost-number { color: rgba(255, 255, 255, 0.10); }  /* Devient blanc plein */
.decorative-text { color: rgba(45, 212, 191, 0.15); } /* Devient #2DD4BF plein */

/* ✅ SOLUTION - Couleurs pleines qui simulent la transparence */
/* Blanc sur fond #0F172A (Carbon) */
.ghost-number-10 { color: #272D38; }  /* Simule 10% blanc */
.ghost-number-20 { color: #3F4451; }  /* Simule 20% blanc */
.ghost-number-30 { color: #57596A; }  /* Simule 30% blanc */

/* Flash #2DD4BF sur fond #0F172A */
.ghost-flash-10 { color: #152E2C; }   /* Simule 10% Flash */
.ghost-flash-20 { color: #1B4542; }   /* Simule 20% Flash */
.ghost-flash-30 { color: #215C58; }   /* Simule 30% Flash */
```

**Formule de calcul :** `R = F.r + (C.r - F.r) × O` (idem pour G, B) — blend couleur C avec opacité O sur fond F.

**Référence VoltaPilot (fond Carbon #0F172A) :**

| Couleur | 10% | 20% | 30% |
|---------|-----|-----|-----|
| Blanc | #272D38 | #3F4451 | #57596A |
| Flash #2DD4BF | #152E2C | #1B4542 | #215C58 |

### ⚠️ Formes superposées : Couleurs solides

> **Pour des formes SVG superposées, utiliser des couleurs solides (hex) plutôt que des rgba superposés.** Les rgba superposés donnent un rendu imprévisible. Pré-calculer la couleur résultante.

### 💡 Positionnement : Préférer les formes complètes

> **Si une forme décorative est mal positionnée dans le PPTX, c'est facile à corriger manuellement. Par contre, une forme tronquée/rognée est irrécupérable.**

Donc toujours s'assurer que les formes sont **entières**, même si leur position n'est pas parfaite.

### ⭐ Graphiques complexes : Canvas HTML (pas SVG)

> **Pour les graphiques avec courbes ou data viz complexes, utiliser un `<canvas>` HTML.**

Le canvas est converti en image PNG dans le PPTX : rendu fidèle, supporte les courbes, redimensionnable/deplacable. Inconvenient : non editable dans PPTX.

```html
<canvas id="chartCanvas" width="1120" height="440"></canvas>
<script>
  const ctx = document.getElementById('chartCanvas').getContext('2d');
  ctx.beginPath();
  ctx.moveTo(0, 380);
  ctx.lineTo(280, 340);
  ctx.lineTo(560, 260);
  ctx.stroke();
</script>
```

---

## Résumé des Tests (Février 2026)

### ✅ Ce qui FONCTIONNE BIEN

| Feature | Verdict | Notes |
|---------|---------|-------|
| Gradients de fond | ✅ | `linear-gradient()` sur backgrounds larges |
| Overlays RGBA | ✅ | Cercles/formes semi-transparentes |
| Position absolute | ✅ | Asymétrie, chevauchements |
| Transform translate | ✅ | Centrage via `transform: translate(-50%, -50%)` |
| Shadows sur fond sombre | ✅ | Cards claires sur fond coloré/sombre |

### ⚠️ Ce qui NÉCESSITE COMPENSATION

| Feature | Problème | Compensation |
|---------|----------|--------------|
| Badge avec gradient | Forme déformée (ellipse) | Couleur solide + `border-left` accent |
| Bordure fine transparente | Disparaît | Fill léger + bordure plus épaisse |
| Cercle décoratif (border seule) | Disparaît | Ajouter fill + bordure 3px |
| Watermark faible opacité | Trop pâle | Augmenter opacité (8% → 12%) |

### ❌ Ce qui NE FONCTIONNE PAS

| Feature | Problème | Alternative |
|---------|----------|-------------|
| Shadows sur fond clair | Blur non rendu, aspect "cheap" | Bordure seule, pas de shadow |
| Hack forme derrière | Effet relief, pas ombre | Ne pas utiliser |
| Shadows colorées | Rendu identique aux noires | Pas de gain |
| **clip-path** | Devient rectangle | **SVG polygon** |
| **background-image pattern** | Disparaît | **SVG lignes** |

**Shadows** : ✅ fond sombre/coloré uniquement. ❌ fond clair (rendu "cheap"). Pas de shadow colorée (rendu = noir).

---

## Patterns de Compensation

| Élément | Problème | Solution |
|---------|----------|----------|
| **Badge** | Gradient déforme la forme | Couleur solide + `border-left: 4px solid accent` + `border-radius: 8px` |
| **Cercle décoratif** | Bordure seule disparaît | Ajouter `background: rgba(…, 0.04)` + `border: 3px solid` |
| **Glassmorphism** | Trop subtil (disparaît) | Augmenter fill à 0.08 et bordure à 2px/0.15 — voir CSS ci-dessous |
| **Watermarks** | Trop pâle | Opacité minimum 12% (pas 8%) |

### Patterns CSS Détaillés

#### Badge : Couleur Solide + Accent

```css
/* ❌ AVANT - Gradient qui déforme */
.badge { background: linear-gradient(90deg, #2DD4BF, #0F766E); border-radius: 100px; }

/* ✅ APRÈS - Solide + accent */
.badge { background: #2DD4BF; border-radius: 8px; border-left: 4px solid #0F766E; }
```

#### Cercle Décoratif : Fill + Bordure

```css
/* ❌ AVANT - Bordure seule (disparaît) */
.decorative-circle { border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 50%; }

/* ✅ APRÈS - Fill + bordure visible */
.decorative-circle { background: rgba(255, 255, 255, 0.04); border: 3px solid rgba(255, 255, 255, 0.1); border-radius: 50%; }
```

#### Glassmorphism : Fill + Bordure Renforcée

```css
/* ❌ AVANT - Trop subtil */
.glass-box { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); }

/* ✅ APRÈS - Plus visible */
.glass-box { background: rgba(255, 255, 255, 0.08); border: 2px solid rgba(255, 255, 255, 0.15); }
```

#### Shadows : Fond Sombre UNIQUEMENT

```css
/* ✅ OK - Card sur fond coloré */
.slide-dark-bg { background: linear-gradient(135deg, #0F766E 0%, #0d5c54 100%); }
.card-on-dark { background: #FFFFFF; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25); border: 1px solid rgba(45, 212, 191, 0.15); }

/* ❌ ÉVITER - Card sur fond clair */
.slide-light-bg { background: #F8FAFC; }
.card-on-light { background: #FFFFFF; /* PAS de box-shadow */ border: 1px solid #E2E8F0; }
```

---

## Propriétés CSS : Ce qui Marche

### ✅ Layout

```css
/* POSITION ABSOLUTE - RECOMMANDÉ pour les slides */
position: absolute;
top: 80px;
left: 64px;
width: 600px;      /* ✅ Pixels explicites */
height: 340px;     /* ✅ Pixels explicites */

/* Padding/Margin - OK */
padding: 48px 56px;
margin-bottom: 24px;
```

### ⚠️ Flexbox : Avec prudence

> **Préférer `position: absolute` avec coordonnées fixes pour les layouts de slides.** Flexbox peut causer des superpositions ou positionnements incorrects.

```css
/* ❌ ÉVITER - Flexbox pour layout principal de slide */
.slide-content { display: flex; flex-direction: column; gap: 24px; }

/* ✅ OK - Positions absolues explicites */
.slide-title { position: absolute; top: 80px; left: 64px; width: 600px; }
.slide-text { position: absolute; top: 180px; left: 64px; width: 600px; }
```

- **Flexbox OK pour :** boutons, badges, petits composants internes
- **Flexbox NON pour :** structure principale de slide, multi-colonnes, espacement vertical

### ✅ Boutons : Flexbox OBLIGATOIRE pour centrer le texte (TESTÉ)

> **Pour les boutons avec texte centré, utiliser UNIQUEMENT Flexbox. Padding et line-height ne fonctionnent pas.**

dom-to-pptx ne gère pas correctement le centrage via padding ou line-height. Seul Flexbox centre correctement le texte.

```css
/* ❌ ÉVITER - Padding (texte décalé en haut à gauche) */
.btn-bad-1 { padding: 16px 32px; background: #0F766E; }

/* ❌ ÉVITER - line-height = height (texte mal centré) */
.btn-bad-2 { height: 52px; line-height: 52px; text-align: center; }

/* ❌ ÉVITER - Texte positionné absolument (texte en haut à gauche) */
.btn-bad-3 { position: relative; }
.btn-bad-3 span { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* ✅ SOLUTION - Flexbox (seule méthode qui fonctionne) */
.btn-good { position: absolute; width: 220px; height: 52px; background: #0F766E; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.btn-good span { color: white; font-family: Inter, sans-serif; font-size: 16px; font-weight: 600; }
```

**Structure bouton recommandée :**
```html
<div class="btn-good" style="position: absolute; top: 500px; left: 80px;">
  <span>Découvrir la solution</span>
</div>
```

### ✅ Couleurs

- `background: #0F766E;` ✅ Hex direct
- `background: rgba(45, 212, 191, 0.15);` ✅ RGBA OK
- `background: var(--oxygen);` ❌ CSS variables ignorées

### ✅ Typographie

- `font-family: 'Inter', sans-serif;` ✅
- `font-size: 56px;` ✅
- `font-weight: 700;` ✅ Valeurs numériques
- `line-height: 1.2;` ✅
- `letter-spacing: -0.03em;` ✅
- `text-align: center | left | right;` ✅

### ✅ Bordures et Arrondis

- `border: 1px solid #E2E8F0;` ✅
- `border-left: 4px solid #2DD4BF;` ✅
- `border-radius: 8px;` ✅
- `border-radius: 50%;` ✅ Cercles OK

### ✅ Gradients de Fond

`linear-gradient()` fonctionne sur les backgrounds larges. Ex: `background: linear-gradient(135deg, #0F172A 0%, #0F766E 100%);`

### ✅ Transform Translate

`transform: translate(-50%, -50%)` fonctionne pour le centrage (avec `top: 50%; left: 50%`). Un seul par zone.

---

## Propriétés CSS : Ce qui Ne Marche Pas

### ❌ CSS Grid

```css
display: grid;           /* ⚠️ Résultats imprévisibles */

/* PRÉFÉRER Flexbox ou position absolute */
```

Autres propriétés non supportées : `white-space: nowrap` (utiliser largeurs généreuses), `var(--color)` (utiliser hex direct), `::before` / `::after` (utiliser éléments HTML réels).

---

## Règles pour les Textes

### Règle du +20%

> Toujours donner **20% de largeur en plus** que ce qui semble nécessaire visuellement. Ex: texte ~500px → `width: 600px`.

---

## ✅ Formes Complexes : Supportées via SVG (CORRIGÉ Février 2026)

> **Les formes complexes (hexagones, triangles, diagonales) FONCTIONNENT avec SVG `<polygon>`.**
> **Les formes simples (cercles, rectangles, lignes) fonctionnent en CSS OU SVG.**

**Pattern canonique** : `<div style="position:absolute; top/left"><svg>...</svg></div>` — Voir exemple "Cercles orbitaux" ci-dessus.

```html
<!-- ✅ Hexagone -->
<div style="position: absolute; top: 200px; left: 80px;">
  <svg width="64" height="74" viewBox="0 0 64 74">
    <polygon points="32,0 64,18.5 64,55.5 32,74 0,55.5 0,18.5" fill="#0F766E"/>
  </svg>
</div>

<!-- ✅ Triangle -->
<div style="position: absolute; top: 200px; left: 200px;">
  <svg width="100" height="100" viewBox="0 0 100 100">
    <polygon points="50,10 90,90 10,90" fill="#2DD4BF"/>
  </svg>
</div>

<!-- ✅ Forme diagonale -->
<div style="position: absolute; top: 0; left: 0;">
  <svg width="700" height="720" viewBox="0 0 700 720">
    <polygon points="0,0 600,0 700,720 0,720" fill="#0F766E"/>
  </svg>
</div>
```

### Formes simples : CSS ou SVG — Exemples copiables

```html
<!-- ✅ Cercle (dans container) -->
<div style="position: absolute; top: 100px; left: 100px;">
  <svg width="100" height="100" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="40" fill="#0F766E"/>
  </svg>
</div>

<!-- ✅ Rectangle -->
<div style="width: 200px; height: 100px; background: #2DD4BF;"></div>

<!-- ✅ Rectangle arrondi -->
<div style="width: 200px; height: 100px; background: #2DD4BF; border-radius: 16px;"></div>

<!-- ✅ Cercle contour -->
<div style="width: 100px; height: 100px; border: 4px solid #2DD4BF; border-radius: 50%;"></div>

<!-- ✅ Ligne -->
<div style="width: 200px; height: 4px; background: #0F766E;"></div>
```

### ❌ clip-path CSS → utiliser SVG polygon

`clip-path` devient un rectangle dans PPTX. Toujours utiliser SVG `<polygon>` dans un container positionné à la place.

---

## Configuration dom-to-pptx

### ⚠️ Script d'Export Standard (OBLIGATOIRE)

```html
<script src="https://unpkg.com/dom-to-pptx@1.1.4/dist/dom-to-pptx.bundle.js"></script>

<script>
async function exportToPptx() {
  // ⚠️ OBLIGATOIRE : Array.from() pour convertir NodeList en Array
  const slides = Array.from(document.querySelectorAll('.slide'));
  const btn = document.querySelector('.export-btn');

  btn.textContent = 'Export en cours...';
  btn.disabled = true;

  try {
    // ⚠️ Configuration minimale - PAS de fonts (cause erreurs CORS)
    await domToPptx.exportToPptx(slides, {
      fileName: 'NomPresentation.pptx'
    });

    btn.textContent = 'Export réussi !';
    setTimeout(() => {
      btn.textContent = 'Exporter en PPTX';
      btn.disabled = false;
    }, 2000);
  } catch (error) {
    console.error('Export error:', error);
    alert('Erreur export: ' + error.message);
    btn.textContent = 'Erreur - Réessayer';
    btn.disabled = false;
  }
}
</script>
```

**Points critiques :**
- `Array.from()` **OBLIGATOIRE** - `querySelectorAll` retourne une NodeList, pas un Array
- **PAS de configuration `fonts`** - cause des erreurs CORS
- **Gestion d'erreur avec `alert()`** - pour diagnostic utilisateur

**Ce script est aussi référencé dans design-compliance-checker.md C.3.**

---

## Checklist Pré-Export

### ⚠️ Règles BLOQUANTES (vérifier AVANT génération)
- [ ] **SVG : toujours dans container positionné** → jamais position:absolute sur le SVG lui-même
- [ ] **Pas de coordonnées négatives** (top/left/right/bottom ≥ 0)
- [ ] **Tous les éléments dans 1280×720** (pas de dépassement)
- [ ] **Taille texte décoratif ≤ 150px** (ghost numbers, watermarks)
- [ ] **Taille texte contenu ≤ 96px** (titres, paragraphes)
- [ ] **Un seul `transform: translate(-50%, -50%)` par zone**
- [ ] **Pas de clip-path** → utiliser SVG polygon à la place
- [ ] **Shadows sur fond sombre UNIQUEMENT**
- [ ] **Pas de `color: rgba()` sur texte** → couleurs HEX pleines
- [ ] **Boutons : Flexbox obligatoire** → pas de padding/line-height pour centrer
- [ ] **JAMAIS `right` ou `bottom`** → toujours `left` et `top` calculés
- [ ] **Width OBLIGATOIRE sur tous les textes** → formule : chars × font × 0.6 × 1.2

### Règles de base
- [ ] Largeurs en pixels (pas de %, pas d'auto)
- [ ] Pas de CSS variables
- [ ] Pas de pseudo-éléments
- [ ] **Position absolute** pour layout principal (pas flexbox)
- [ ] **Flexbox pour boutons** (centrage texte)
- [ ] **Width explicite sur CHAQUE texte** (formule +20%)

### SVG et Formes
- [ ] **SVG dans container positionné** → `<div style="position:absolute"><svg>...</svg></div>`
- [ ] **Jamais position:absolute sur le SVG** → seulement sur le container
- [ ] **JAMAIS `<text>` dans SVG** → utiliser div HTML positionné par-dessus
- [ ] **Formes complexes (hexagones, triangles)** → SVG `<polygon>` dans container
- [ ] **Cercles** → SVG `<circle>` dans container OU `div` + `border-radius: 50%`
- [ ] **Lignes** → SVG `<line>` dans container OU `div` fin
- [ ] **Formes entières** → jamais tronquées

### Graphiques et Data Viz
- [ ] **Graphiques complexes** → canvas HTML (converti en image)
- [ ] **Courbes lisses** → canvas (pas SVG path)

### Shadows et effets
- [ ] **Shadows uniquement sur fond sombre/coloré**
- [ ] **Bordures fines → fill + bordure épaisse**
- [ ] **Badges → couleur solide + accent**
- [ ] **Watermarks → opacité 12% minimum**

---

## Tableau Récapitulatif Final

### ⚠️ RÈGLES BLOQUANTES (Février 2026 - TESTÉES)

| Règle | Limite | Conséquence si violée |
|-------|--------|----------------------|
| **SVG position:absolute directe** | ❌ INTERDIT | **Disparaît ou tronqué** |
| **`<text>` dans SVG** | ❌ INTERDIT | **Tout le SVG disparaît** |
| **Coordonnées négatives** | ❌ INTERDIT | Éléments mal positionnés/coupés |
| **Éléments hors slide** | Max 1280×720 | Rendu imprévisible |
| **Taille texte décoratif** | Max 150px | Devient formes géométriques |
| **Taille texte contenu** | Max 96px | Rendu imprévisible |
| **Transform superposés** | 1 par zone | Conflits de z-index |
| **clip-path CSS** | ❌ INTERDIT | Utiliser SVG polygon |
| **Shadows fond clair** | ❌ INTERDIT | Rendu "cheap" |
| **`color: rgba()` texte** | ❌ INTERDIT | Devient 100% opaque |
| **Bouton padding/line-height** | ❌ INTERDIT | Texte mal centré |
| **`right` / `bottom`** | ❌ INTERDIT | Éléments tronqués, mal positionnés |
| **Texte sans `width`** | ❌ INTERDIT | Retours à la ligne dans PPTX |

### Propriétés CSS — Tableau Complet

| Propriété | Fonctionne | Notes |
|-----------|------------|-------|
| `position: absolute` | ✅ | **Recommandé pour layouts** |
| `display: flex` | ⚠️ | Petits composants seulement |
| `display: grid` | ❌ | Utiliser position absolute |
| `width: Xpx` | ✅ | Toujours pixels |
| `linear-gradient` (fond) | ✅ | OK sur backgrounds |
| `linear-gradient` (badge) | ❌ | Couleur solide |
| `box-shadow` (fond sombre) | ✅ | OK avec contraste |
| `box-shadow` (fond clair) | ❌ | Bordure seule |
| `transform: translate` | ✅ | **UN SEUL par zone** |
| `border-radius` | ✅ | OK |
| `rgba()` overlays | ✅ | OK |
| `font-size` (contenu) | ✅ | **Max 96px** |
| `font-size` (décoratif) | ⚠️ | **Max 150px** |
| `font-weight` | ✅ | **400-800 tous supportés** |
| `top/left` négatif | ❌ | **INTERDIT** |
| `white-space: nowrap` | ❌ | Largeur généreuse |
| `var(--color)` | ❌ | Hex direct |
| `::before` / `::after` | ❌ | Élément réel |
| **SVG dans container** | ✅ | **`<div position:absolute><svg>` = OK** |
| **SVG position directe** | ❌ | **`<svg position:absolute>` = INTERDIT** |
| **`clip-path`** | ❌ | **→ SVG polygon dans container** |
| **SVG `<polygon>`** | ✅ | **Dans container positionné** |
| **SVG `<line>`** | ✅ | **Dans container positionné** |
| **SVG `<circle>`** | ✅ | **Dans container positionné** |
| **SVG `<rect>`** | ✅ | **Dans container positionné** |
| **SVG `<path>` lignes** | ✅ | **M, L uniquement - dans container** |
| **SVG `<path>` courbes** | ❌ | **Q, C, S, A disparaissent** |
| **SVG `<text>`** | ❌ | **INTERDIT → div HTML par-dessus** |
| **`<canvas>` HTML** | ✅ | **Graphiques complexes (→ image)** |
| **`opacity` sur conteneur** | ❌ | **→ rgba() dans fill** |
| **`color: rgba()` texte** | ❌ | **→ Couleurs HEX pleines** |
| **Bouton padding** | ❌ | **→ Flexbox obligatoire** |
| **Bouton Flexbox** | ✅ | **Seule méthode pour centrer texte** |
| **`right` positioning** | ❌ | **→ Calculer `left` : 1280 - right - width** |
| **`bottom` positioning** | ❌ | **→ Calculer `top` : 720 - bottom - height** |
| **Texte sans `width`** | ❌ | **→ width = chars × font × 0.6 × 1.2** |
