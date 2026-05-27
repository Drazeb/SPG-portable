# Techniques PPTX — Plomberie HTML→PPTX

Comment faire fonctionner les choses techniquement avec dom-to-pptx. Pas de composants de design — invente tes propres composants en utilisant ces techniques.

---

## 1. Positionner un SVG

SVG JAMAIS en position:absolute directement. Toujours dans un container div positionné.

```html
<div style="position: absolute; top: 200px; left: 200px;">
  <svg width="200" height="200" viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="80" fill="#2DD4BF"/>
  </svg>
</div>
```

## 2. Centrer du texte dans une forme

Flexbox OBLIGATOIRE. Padding et line-height ne fonctionnent pas dans PPTX.

```html
<div style="display: flex; align-items: center; justify-content: center; width: 220px; height: 52px;">
  <span class="btn-text" style="width: 140px;">Texte centré</span>
</div>
```

## 3. Bouton cliquable

Div flex + span. Jamais padding pour centrer.

```html
<div class="btn-primary" style="position: absolute; top: 500px; left: 80px; display: flex; align-items: center; justify-content: center; width: 220px; height: 52px;">
  <span style="width: 160px;">Découvrir</span>
</div>
```

## 4. Texte sur un SVG

SVG pour les formes, div HTML positionné par-dessus pour le texte. JAMAIS `<text>` dans SVG.

```html
<div style="position: absolute; top: 300px; left: 280px;">
  <svg width="140" height="140" viewBox="0 0 140 140">
    <polygon points="70,0 140,35 140,105 70,140 0,105 0,35" fill="#0F766E"/>
  </svg>
</div>
<div style="position: absolute; top: 355px; left: 310px; width: 80px; text-align: center;">
  LABEL
</div>
```

## 5. Formes complexes

SVG polygon dans un container. Hexagones, triangles, diagonales.

```html
<div style="position: absolute; top: 0; left: 640px;">
  <svg width="640" height="720" viewBox="0 0 640 720">
    <polygon points="100,0 640,0 640,720 0,720" fill="#0F766E"/>
  </svg>
</div>
```

## 6. Texte semi-transparent (opacité simulée)

`color: rgba()` devient 100% opaque dans PPTX. Pré-calculer la couleur HEX blendée.

Formule : `R = fond.r + (couleur.r - fond.r) × opacité` (idem G, B)

Exemple (blanc 10% sur fond #0F172A) : `color: #272D38;`

## 7. Shadows qui marchent

Fond SOMBRE uniquement. Sur fond clair le rendu est "cheap" — utiliser une bordure à la place.

```css
/* Fond sombre = OK */
.card-on-dark { box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25); }
/* Fond clair = bordure seule */
.card-on-light { border: 1px solid #E2E8F0; }
```

## 8. Badge sans gradient

Les gradients déforment les badges. Couleur solide + accent latéral.

```css
.badge { background: #2DD4BF; border-radius: 8px; border-left: 4px solid #0F766E; }
```

## 9. Glassmorphism visible

Fill + bordure renforcée. Trop subtil = disparaît.

```css
.glass { background: rgba(255, 255, 255, 0.08); border: 2px solid rgba(255, 255, 255, 0.15); }
```

## 10. Cercle décoratif visible

Bordure seule disparaît. Ajouter un fill + bordure épaisse.

```css
.deco-circle { background: rgba(255, 255, 255, 0.04); border: 3px solid rgba(255, 255, 255, 0.1); border-radius: 50%; }
```
