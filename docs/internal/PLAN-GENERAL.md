# Plan Général - Slide Presentation Generator (SPG)

## Objectif Global

Créer un skill Claude Code `/generate-slides` capable de générer automatiquement des présentations commerciales B2B de haute qualité créative, exportables en .pptx (Google Slides/PowerPoint compatible).

---

## 1. Architecture du Projet

```
/Slide Presentation Generator
├── /skills
│   └── generate-slides.md           # Skill principal (à créer)
├── /frameworks
│   └── pas-framework.md             # Framework PAS (à créer)
├── /lib
│   ├── slide-generator.js           # Générateur PPTX
│   ├── creativity-levels.md         # Définitions des 3 niveaux créatifs (à créer)
│   └── slide-templates/             # Templates par type de slide (à créer)
│       ├── title-slide.js
│       ├── problem-slide.js
│       ├── agitate-slide.js
│       ├── solution-slide.js
│       ├── proof-slide.js
│       └── cta-slide.js
├── /brands
│   └── voltapilot/
│       ├── brand-identity.md        # Style Guide (existe - à réorganiser)
│       └── brief.md                 # Brief business (existe - à réorganiser)
├── /outputs
│   └── [projet]/
│       ├── preview.html             # Preview HTML créative
│       └── export.pptx              # Export PPTX final
├── package.json                     # Dépendances (pptxgenjs)
├── PLAN-GENERAL.md                  # Ce fichier
└── Fichiers pour simulation/        # Fichiers existants
    ├── Kit de Transfert Style Guide (Master).md
    └── VoltaPilot - Brief Alpha Input (v1.3) - Eco-Symbiose.md
```

---

## 2. Le Skill `/generate-slides`

### 2.1 Workflow en 4 Phases

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1 : COLLECTE INPUTS                    │
├─────────────────────────────────────────────────────────────────┤
│ 1. Détection/sélection de la marque (brand identity)            │
│ 2. Type de présentation → "Pitch commercial court"              │
│ 3. Ingestion du brief utilisateur                               │
│ 4. Questions ciblées UNIQUEMENT pour ce qui manque :            │
│    - ICP ciblé                                                  │
│    - Problème principal                                         │
│    - Conséquences du problème                                   │
│    - Solution proposée                                          │
│    - Preuves (clients, chiffres, labels)                        │
│    - CTA souhaité                                               │
│ 5. Niveau de créativité souhaité (1, 2, ou 3)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 2 : GÉNÉRATION CONTENU                   │
├─────────────────────────────────────────────────────────────────┤
│ Application du framework PAS :                                  │
│ • Slide 1 : Titre + accroche                                    │
│ • Slide 2 : Problem (le problème de l'ICP)                      │
│ • Slide 3 : Agitate (conséquences, amplification)               │
│ • Slide 4 : Solution (proposition de valeur)                    │
│ • Slide 5 : How it works (fonctionnement clé)                   │
│ • Slide 6 : Proof (social proof, chiffres, témoignages)         │
│ • Slide 7 : CTA (call-to-action)                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 3 : GÉNÉRATION DESIGN                    │
├─────────────────────────────────────────────────────────────────┤
│ Génération HTML/CSS créative avec :                             │
│ • Brand identity STRICTEMENT respectée (couleurs, typos, etc.)  │
│ • Niveau de créativité appliqué sur les leviers autorisés       │
│ • Icônes SVG custom (outline 1.2px, round, open)                │
│ • Illustrations Bio-Mimicry (réseaux, flux, cercles connectés)  │
│                                                                 │
│ → Preview HTML pour validation utilisateur                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                PHASE 4 : EXPORT PPTX + VALIDATION               │
├─────────────────────────────────────────────────────────────────┤
│ Conversion vers PPTX                                            │
│ → Fichier .pptx éditable                                        │
│ → User valide dans Google Slides/PowerPoint                     │
│ → Itérations si nécessaire                                      │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Collecte des Inputs

**Principe clé** : L'utilisateur fournit un fichier brief. Claude l'ingère, le compare à sa checklist, et pose des questions UNIQUEMENT pour ce qui manque.

**Checklist framework PAS :**

| Élément | Description | Source |
|---------|-------------|--------|
| Brand identity | Style guide complet | Fichier obligatoire |
| ICP ciblé | Qui est le prospect | Brief ou question |
| Problème principal | La douleur de l'ICP | Brief ou question |
| Conséquences | Amplification du problème | Brief ou question |
| Solution | Proposition de valeur | Brief ou question |
| Comment ça marche | Mécanisme clé | Brief ou question |
| Preuves | Social proof, chiffres | Brief ou question |
| CTA | Prochaine étape | Question (contexte-dépendant) |
| Niveau créativité | 1, 2 ou 3 | Question obligatoire |

---

## 3. Framework PAS - Structure des Slides

### Pitch deck court (7 slides)

| # | Type | Contenu | Objectif émotionnel |
|---|------|---------|---------------------|
| 1 | **Title** | Nom produit + tagline percutante | Intrigue, curiosité |
| 2 | **Problem** | Le problème de l'ICP, formulé de son point de vue | Identification |
| 3 | **Agitate** | Conséquences du problème (coût, stress, risque) | Tension, urgence |
| 4 | **Solution** | Proposition de valeur en 1 phrase | Soulagement, espoir |
| 5 | **How** | Comment ça marche (3 étapes max) | Clarté, faisabilité |
| 6 | **Proof** | Logos clients, chiffres, témoignage | Confiance, crédibilité |
| 7 | **CTA** | Prochaine étape claire + contact | Action |

---

## 4. Niveaux de Créativité

### RÈGLE D'OR ABSOLUE : Brand Identity = Sacrée

**Ces éléments NE CHANGENT JAMAIS quel que soit le niveau :**
- Palette de couleurs (exactement comme définie)
- Typographies (Inter Tight, Inter, Monospace)
- Règles du style guide (arrondis, shadows, spacing)
- Logotype et son utilisation
- Tone of voice

### Leviers de créativité (ce qui PEUT varier)

> **Voir `lib/creativity-levels.md` pour la documentation complète.**

| # | Levier | Niveau 1 (Prudent) | Niveau 2 (Équilibré) | Niveau 3 (Audacieux) |
|---|--------|-------------------|---------------------|---------------------|
| 1 | **Choix du pattern/module** | Classiques (Split 50/50, Single Column) | Mix varié (Bento Grid léger) | Originaux (Margin Notes, Editorial Spread) |
| 2 | **Composition** | Grille symétrique | Légère asymétrie | Tension, asymétrie forte |
| 3 | **Espace négatif** | Slides remplies | Respiration présente | Dramatique, épuré |
| 4 | **Hiérarchie visuelle** | Conventionnelle | Contrastes marqués | Extrêmes (géant/minuscule) |
| 5 | **Ratio texte/image** | 60/40 texte | 50/50 | 20/80 visual-first |
| 6 | **Densité info** | Dense, exhaustif | Modérée | Un message par slide |
| 7 | **Éléments décoratifs** | Aucun ou minimal | Quelques-uns, subtils | Assumés (formes, illustrations) |
| 8 | **Superposition/profondeur** | Éléments séparés | Légères superpositions | Layers, chevauchements |
| 9 | **Cadrage photos** | Centré, illustratif | Cadrage réfléchi | Crops audacieux |
| 10 | **Data viz** | Charts standards | Charts stylisés | Infographies créatives |
| 11 | **Storytelling visuel** | Linéaire, informatif | Révélation légère | Mise en scène forte |

### Prompts internes par niveau

**Niveau 1 (Prudent)** : "Design corporate professionnel respectant strictement la brand identity. Compositions centrées et symétriques. Information complète sur chaque slide."

**Niveau 2 (Équilibré)** : "Design moderne respectant strictement la brand identity. Chaque slide a un élément de surprise dans sa composition. Équilibre entre information et impact visuel."

**Niveau 3 (Audacieux)** : "Direction artistique niveau Cannes Lions respectant strictement la brand identity. Compositions audacieuses, espace négatif dramatique, visual-first. La créativité s'exprime dans la mise en scène, pas dans les couleurs ou typos."

---

## 5. Brand Identity VoltaPilot (Référence)

### Couleurs
- **Oxygen** : #0F766E (Teal 700) - Primary, textes forts, logos
- **Flash** : #2DD4BF (Teal 400) - Accent, points d'énergie
- **Carbon** : #0F172A (Slate 900) - Titres, fonds dark
- **White** : #FFFFFF - Fond dominant
- **Mist** : #F8FAFC (Slate 50) - Fond alternatif
- **Fog** : #E2E8F0 (Slate 200) - Bordures
- **Slate 400** : #94A3B8 - Textes secondaires

### Typographie
- **Display (titres)** : Inter Tight - Suisse, rigoureux, moderne
- **Body** : Inter - Lisible, neutre
- **Data** : Monospace (SF Mono, Roboto Mono)
- **Échelle** : H1 64px+, H2 48px, H3 32px (ratio 1.25)

### Icônes (Style Guide)
- Style : **Outline** (filaire)
- Terminaisons : **Round** (arrondies)
- Formes : **Open** (formes ouvertes qui respirent)
- Épaisseur : **1.2px** (ultra-fine)
- Pas de métaphores complexes

### Illustration (Bio-Mimicry)
- Métaphore : La tech est un organisme, pas une machine
- Trait : 1px Slate-300 ou Fog
- Nœuds : Cercles pleins Oxygen ou Flash
- Mouvement : Lignes pointillées pour suggérer le flux
- Composition : Centré/Orbital (noyau + satellites)

---

## 6. Stack Technique

### Dépendances
```json
{
  "dependencies": {
    "dom-to-pptx": "latest"
  }
}
```

### Approche de génération (VALIDÉE)

**Étape 1 - Design créatif (HTML/CSS)**
- Génération en HTML/CSS avec toute la créativité
- Preview dans navigateur pour validation
- Respecter les CSS Guidelines (voir `docs/CSS-GUIDELINES.md`)

**Étape 2 - Conversion PPTX via dom-to-pptx**
- Outil : **dom-to-pptx** (CDN browser-side)
- Fidélité : **85-90%** après compensations
- Temps de polish manuel : **~5 minutes** par présentation

**Solution validée** : dom-to-pptx convertit directement le DOM HTML en PPTX avec bonne fidélité. pptxgenjs abandonné.

---

## 7. État Actuel du POC (Janvier 2026)

### ✅ Fait
- [x] Structure du projet initialisée
- [x] Preview HTML créatives (V1, V2, V3)
- [x] **RÉSOLU : Conversion PPTX via dom-to-pptx**
- [x] Tests de fidélité exhaustifs (V1, V2 avec compensations)
- [x] Documentation CSS Guidelines complète (`docs/CSS-GUIDELINES.md`)
- [x] Documentation Workflow (`docs/WORKFLOW.md`)
- [x] Fidélité validée : **85-90%** avec compensations

### ✅ Problème PPTX Résolu
- **Solution** : dom-to-pptx (remplace pptxgenjs)
- **Fidélité** : 85-90% après application des compensations CSS
- **Temps de polish** : ~5 minutes de retouches manuelles

### ✅ Formes Complexes Résolues (Février 2026)
- **Problème** : `clip-path` CSS ne fonctionne pas (hexagones → carrés)
- **Solution** : Utiliser **SVG `<polygon>`** au lieu de clip-path
- **Testé et validé** : Hexagones, triangles, diagonales, coins coupés, grilles
- **Fidélité SVG** : ~100% - les formes passent parfaitement

### 📋 CSS Guidelines - Résumé des Tests

| Feature | Résultat | Action |
|---------|----------|--------|
| Gradients de fond | ✅ Fonctionne | Utiliser |
| Overlays RGBA | ✅ Fonctionne | Utiliser |
| Transform translate | ✅ Fonctionne | Utiliser |
| Shadows fond sombre | ✅ Fonctionne | Utiliser |
| Shadows fond clair | ❌ Cheap | Bordure seule |
| Badge gradient | ❌ Déforme | Couleur solide |
| Bordure fine | ❌ Disparaît | Fill + bordure épaisse |
| **clip-path** | ❌ Devient rectangle | **SVG polygon** |
| **background-image pattern** | ❌ Disparaît | **SVG lignes** |
| **SVG polygon** | ✅ Parfait | **Hexagones, triangles, diagonales** |
| **SVG line** | ✅ Parfait | **Grilles, motifs** |

### ✅ Colonne Vertébrale Design Compliance (Février 2026)
- [x] **`lib/brand-schema.json`** : Schéma universel (50+ paramètres)
- [x] **`lib/brand-token-extractor.md`** : Instructions d'extraction des tokens
- [x] **`lib/design-compliance-checker.md`** : Checklist Brand + Créativité
- [x] **`brands/voltapilot/tokens.json`** : Tokens VoltaPilot extraits
- [x] **CLAUDE.md** mis à jour avec règle d'or #3 (Design Compliance Obligatoire)

### ⏳ À faire
- [x] ~~Test avec une **nouvelle brand identity** (validation généralisation)~~ ✅ FAIT (IGNITION TECH - Février 2026)
- [x] ~~Test avec **deuxième brand identity**~~ ✅ FAIT (Geoforge - Février 2026)
- [ ] Créer `skills/generate-slides.md`
- [ ] Créer `frameworks/pas-framework.md`
- [x] ~~Créer `lib/creativity-levels.md`~~ ✅ FAIT (11 leviers, 3 niveaux - Février 2026)
- [ ] Créer les templates de slides
- [x] ~~Réorganiser fichiers existants dans `/brands/voltapilot/`~~ ✅ FAIT (tokens.json créé)
- [ ] Test end-to-end avec vrai contenu
- [ ] **Test des niveaux de créativité** (même contenu, niveaux 1/2/3)
- [ ] **Test du système Design Compliance** (score 100%)

---

## 8. Fichiers Existants

### Dans `/Fichiers pour simulation/`
- **Kit de Transfert Style Guide (Master).md** : Style guide complet VoltaPilot
- **VoltaPilot - Brief Alpha Input (v1.3) - Eco-Symbiose.md** : Brief business VoltaPilot

### Dans `/outputs/`
- **preview.html** : Preview V1 (basique)
- **preview-v2-creative.html** : Preview V2 (créativité débridée)
- **preview-v3-icons.html** : Preview V3 (avec icônes)
- **voltapilot-v3-creative.pptx** : Export PPTX V3 (problématique)

### Scripts
- **test-poc.js** : Générateur PPTX V1
- **generate-v3-pptx.js** : Générateur PPTX V3

---

## 9. Prochaines Étapes par Priorité

### ✅ FAIT : Problème PPTX Résolu
- dom-to-pptx validé avec 85-90% fidélité
- CSS Guidelines documentées avec compensations
- Workflow documenté

### Priorité 1 : Validation Généralisation
1. **Test avec nouvelle brand identity** (pas VoltaPilot)
2. Générer une présentation complète avec les guidelines
3. Valider que le système fonctionne indépendamment de la marque

### Priorité 2 : Skill et Framework
1. Créer `frameworks/pas-framework.md` avec la checklist complète
2. Créer `lib/creativity-levels.md` avec les définitions détaillées
3. Créer `skills/generate-slides.md` avec le workflow interactif

### Priorité 3 : Templates et Industrialisation
1. Créer les templates de slides par type
2. Réorganiser les fichiers brands
3. Test end-to-end complet

---

## 10. Sessions Parallèles Possibles

Ce plan permet de travailler en parallèle sur :

| Session | Focus | Prérequis |
|---------|-------|-----------|
| **Session A** | Résolution problème PPTX | Captures d'écran |
| **Session B** | Framework PAS et checklist | Aucun |
| **Session C** | Skill generate-slides.md | Framework PAS |
| **Session D** | Niveaux de créativité détaillés | Aucun |
| **Session E** | Templates de slides | Résolution PPTX |

---

## 11. Critères de Succès du POC

1. **Test du skill** : `/generate-slides` pose les bonnes questions
2. **Test du contenu** : Framework PAS bien appliqué (structure des slides)
3. **Test du design** : Différence visible entre niveau 1 et niveau 3
4. **Test de l'export** : .pptx éditable dans Google Slides/PowerPoint
5. **Test brand identity** : Couleurs, typos, style VoltaPilot respectés

---

## 12. Limitations Connues (POC)

- Un seul framework (PAS) - autres à ajouter post-POC
- Export PPTX avec limitations visuelles
- Une seule marque (VoltaPilot) - généralisation post-POC

---

## 13. Évolutions Futures (Hors Scope POC)

- [ ] Ajouter frameworks : StoryBrand, Challenger Sale, SPIN
- [ ] Multiple propositions créatives en parallèle
- [ ] Générateur de brand identity intégré
- [ ] Autres assets : case studies, lead magnets, LinkedIn content
- [ ] Interface web optionnelle
