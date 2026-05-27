# Workflow de Génération de Présentations PPTX

## Vue d'ensemble

Ce document décrit le processus complet pour générer des présentations commerciales B2B de haute qualité, exportables en PPTX éditable (compatible Google Slides et PowerPoint).

---

## Architecture du Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                      PHASE 1 : INPUTS                           │
├─────────────────────────────────────────────────────────────────┤
│ • Brand identity (style guide)                                  │
│ • Brief business (ICP, problème, solution, preuves)             │
│ • Framework de contenu (PAS, StoryBrand, etc.)                  │
│ • Niveau de créativité souhaité (1, 2, ou 3)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 2 : GÉNÉRATION CONTENU                   │
├─────────────────────────────────────────────────────────────────┤
│ Application du framework (ex: PAS)                              │
│ • Slide 1 : Titre + accroche                                    │
│ • Slide 2 : Problem                                             │
│ • Slide 3 : Agitate                                             │
│ • Slide 4 : Solution                                            │
│ • Slide 5 : How it works                                        │
│ • Slide 6 : Proof                                               │
│ • Slide 7 : CTA                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 3 : GÉNÉRATION HTML/CSS                  │
├─────────────────────────────────────────────────────────────────┤
│ Création du design en HTML/CSS avec :                           │
│ • Brand identity strictement respectée                          │
│ • Niveau de créativité appliqué                                 │
│ • Règles CSS compatibles PPTX (voir CSS-GUIDELINES.md)          │
│ • SVG inline pour les icônes                                    │
│                                                                 │
│ Output : fichier HTML prévisualisable dans navigateur           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 4 : CONVERSION PPTX                      │
├─────────────────────────────────────────────────────────────────┤
│ Outil : dom-to-pptx (via CDN dans le HTML)                      │
│                                                                 │
│ • Ouvrir le HTML dans un navigateur                             │
│ • Cliquer sur le bouton "Exporter en PPTX"                      │
│ • Fichier .pptx téléchargé automatiquement                      │
│                                                                 │
│ Fidélité attendue : ~85-90%                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 5 : POLISH MANUEL                        │
├─────────────────────────────────────────────────────────────────┤
│ Ouvrir le PPTX dans Google Slides ou PowerPoint                 │
│                                                                 │
│ Corrections typiques (~5 min) :                                 │
│ • Élargir quelques text boxes qui wrappent mal                  │
│ • Ajuster l'espacement si éléments trop proches                 │
│ • Vérifier que rien n'est tronqué                               │
│                                                                 │
│ Output : PPTX final prêt à l'envoi                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Outils et Technologies

### Conversion HTML → PPTX

| Outil | Statut | Raison |
|-------|--------|--------|
| **dom-to-pptx** | ✅ Recommandé | Vraie conversion HTML/CSS, SVG supporté, fidélité ~85-90% |
| pptxgenjs | ❌ Abandonné | Pas un convertisseur, nécessite codage manuel des positions |
| html2pptxgenjs | ❌ Abandonné | Abandonné, ne gère que le texte |

### Intégration dom-to-pptx

```html
<!-- Dans le <head> du HTML -->
<script src="https://cdn.jsdelivr.net/npm/dom-to-pptx@latest/dist/dom-to-pptx.bundle.js"></script>

<!-- Bouton d'export -->
<button id="export-btn">Exporter en PPTX</button>

<!-- Script d'export -->
<script>
document.getElementById('export-btn').addEventListener('click', async () => {
  const slides = document.querySelectorAll('.slide');

  await domToPptx.exportToPptx(Array.from(slides), {
    fileName: 'presentation.pptx',
    fonts: [
      {
        name: 'Inter',
        url: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
      }
    ]
  });
});
</script>
```

---

## Niveaux de Qualité

### Ce qui fonctionne bien (95%+)

- Couleurs (backgrounds, textes, bordures)
- Formes (rectangles, cercles, arrondis)
- SVG inline (icônes)
- Layout Flexbox basique
- Typographie (taille, poids)
- Bordures (solid, dashed)

### Ce qui nécessite parfois du polish (85-90%)

- Text boxes (parfois trop étroites → wrap inattendu)
- Espacement entre éléments (parfois légèrement décalé)
- Caractères spéciaux en fin de ligne (?, %, +)

### Ce qui ne fonctionne pas

- Pseudo-éléments CSS (`::before`, `::after`)
- `white-space: nowrap` (ignoré)
- CSS variables (utiliser valeurs directes)
- Animations/transitions

---

## Checklist Pré-Export

Avant de cliquer sur "Exporter en PPTX" :

- [ ] Tous les textes utilisent des largeurs explicites en pixels
- [ ] Pas de CSS variables (valeurs hex directes)
- [ ] Icônes en SVG inline (pas de `<img>`)
- [ ] Pas de pseudo-éléments
- [ ] Font Google chargée avec tous les weights nécessaires
- [ ] Chaque slide a la classe `.slide` et dimensions fixes (ex: 960x540)

---

## Checklist Post-Export (Polish)

Après ouverture dans Google Slides/PowerPoint :

- [ ] Vérifier que tous les textes sont visibles (pas tronqués)
- [ ] Élargir les text boxes qui wrappent mal
- [ ] Ajuster les espacements si nécessaire
- [ ] Vérifier les caractères spéciaux (%, ?, +, →)
- [ ] Tester en mode présentation

---

## Temps Estimés

| Phase | Temps |
|-------|-------|
| Génération contenu | ~10 min |
| Génération HTML/CSS | ~30-60 min |
| Conversion PPTX | ~1 min |
| Polish manuel | ~5 min |
| **Total** | **~45-75 min** |

---

## Fichiers de Référence

- `docs/CSS-GUIDELINES.md` : Règles CSS détaillées pour dom-to-pptx
- `outputs/test-dom-to-pptx-v3.html` : Template HTML validé (exemple)
- `brands/voltapilot/` : Brand identity de référence

---

## Limitations Connues

1. **Fidélité ~85-90%** : Quelques ajustements manuels seront toujours nécessaires
2. **Fonts** : Doivent être des Google Fonts ou fonts web avec URL accessible
3. **Complexité CSS** : Plus le design est complexe, plus il y aura de différences
4. **Taille fichier** : Les SVG inline augmentent la taille du PPTX

---

## Évolutions Futures

- [ ] Automatisation avec Puppeteer (export sans navigateur)
- [ ] Templates réutilisables par type de slide
- [ ] Skill Claude Code `/generate-slides`
- [ ] Support multi-frameworks (PAS, StoryBrand, SPIN)
