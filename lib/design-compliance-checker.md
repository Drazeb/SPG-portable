# Design Compliance Checker

**Exécuter AVANT de générer toute présentation HTML/CSS.**

---

## PARTIE A : TOKENS CRITIQUES

Vérifier que `tokens.json` contient TOUS les tokens ci-dessous. Si un token manque → STOP.

| # | Token | Vérifié |
|---|-------|---------|
| 1 | `colors.primary.main` | ☐ |
| 2 | `colors.neutrals.text_primary` | ☐ |
| 3 | `colors.neutrals.background_primary` | ☐ |
| 4 | `colors.neutrals.border` | ☐ |
| 5 | `typography.display.family` | ☐ |
| 6 | `typography.body.family` | ☐ |
| 7 | `typography.scale.h1` | ☐ |
| 8 | `typography.scale.h2` | ☐ |
| 9 | `typography.scale.h3` | ☐ |
| 10 | `ui_physics.radius.xl` | ☐ |
| 11 | `ui_physics.grid_unit` | ☐ |
| 12 | `iconography.style` | ☐ |
| 13 | `iconography.stroke_width` | ☐ |

---

## PARTIE C : RÈGLES TECHNIQUES PPTX (39 RÈGLES BLOQUANTES)

**Toute violation = génération refusée.** Le niveau de créativité ne justifie JAMAIS de violer ces règles.

### Positionnement

1. JAMAIS `right:` ou `bottom:` → calculer `left` et `top` (formules : `left = 1280 - right - width`, `top = 720 - bottom - height`)
2. Aucune coordonnée négative (top, left ≥ 0)
3. Tous les éléments dans 0–1280px (horizontal) et 0–720px (vertical)
4. `left + width ≤ 1280`, `top + height ≤ 720`
5. Un seul `transform: translate(-50%, -50%)` par zone

### Texte

6. Width OBLIGATOIRE sur chaque texte : `width = chars × (font-size × 0.6) × 1.2`
7. Font-size contenu : max 96px
8. Font-size décoratif (ghost, watermark) : max 150px
9. JAMAIS `color: rgba()` sur texte → couleur HEX pré-calculée
10. Font-weight 400–800 : tous supportés

### SVG et formes

11. SVG TOUJOURS dans un container div positionné (`<div style="position:absolute"><svg>`)
12. JAMAIS `position:absolute` directement sur un `<svg>`
13. JAMAIS `<text>` dans SVG → div HTML positionné par-dessus
14. JAMAIS `clip-path` CSS → SVG `<polygon>` dans container
15. Éléments SVG supportés : circle, ellipse, rect, polygon, line, path (M/L seulement)
16. SVG path courbes (Q, C, S, A) : disparaissent → utiliser canvas

### Couleurs et effets

17. Pas de CSS variables (`var(--...`) → valeurs directes
18. Pas de pseudo-éléments (`::before`, `::after`) → éléments HTML réels
19. `opacity` jamais sur le conteneur → `rgba()` dans le fill
20. Shadows UNIQUEMENT sur fond sombre/coloré (rendu "cheap" sur fond clair)
21. Badges : couleur solide + accent (pas de gradient)
22. Glassmorphism : fill ≥ 0.08, bordure ≥ 2px
23. Cercles décoratifs : fill + bordure ≥ 3px (bordure seule disparaît)
24. Watermarks : opacité minimum 12%

### Flexbox et layout

25. JAMAIS `display: grid` → position absolute
26. Flexbox : petits composants seulement (pas layout principal de slide)
27. Boutons : Flexbox OBLIGATOIRE pour centrer texte (pas padding/line-height)
28. Position absolute : layout principal recommandé

### Export dom-to-pptx

29. `Array.from()` OBLIGATOIRE sur `querySelectorAll`
30. Pas de config `fonts` dans dom-to-pptx (cause CORS)
31. CDN : `https://unpkg.com/dom-to-pptx@1.1.4/dist/dom-to-pptx.bundle.js`

### Densité et chevauchement

32. Max 7 composants absolute par slide (hors background décoratif)
33. Min 16px gap vertical entre éléments positionnés en absolute
34. Ghost text dans zones libres uniquement (pas de chevauchement avec contenu)
35. Ghost text : `left + width ≤ 1240` (40px marge de sécurité)

### Divers

36. Largeurs en pixels (pas de %, pas d'auto)
37. Pas de `white-space: nowrap` (largeurs généreuses à la place)
38. Formes entières (jamais tronquées, même si position imparfaite)
39. Diacritiques UTF-8 obligatoires (é, è, ê, à, â, ô, ù, û, ç, î, ï)

---

## SCRIPT EXPORT PPTX

Template obligatoire pour le bouton d'export :

```html
<script src="https://unpkg.com/dom-to-pptx@1.1.4/dist/dom-to-pptx.bundle.js"></script>
<script>
async function exportToPptx() {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const btn = document.querySelector('.export-btn');
  btn.textContent = 'Export en cours...';
  btn.disabled = true;
  try {
    await domToPptx.exportToPptx(slides, { fileName: 'Presentation.pptx' });
    btn.textContent = 'Export réussi !';
    setTimeout(() => { btn.textContent = 'Exporter en PPTX'; btn.disabled = false; }, 2000);
  } catch (error) {
    console.error('Export error:', error);
    alert('Erreur export: ' + error.message);
    btn.textContent = 'Erreur - Réessayer';
    btn.disabled = false;
  }
}
</script>
```
