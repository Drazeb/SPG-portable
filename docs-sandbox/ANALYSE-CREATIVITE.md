# Analyse : Pourquoi les slides manquent de créativité

## Contexte

L'utilisateur a généré une présentation de 15 slides (VoltaPilot × Urbalia, niveau créativité 3 "Audacieux", mood Orbital, Mix Light/Dark). Le résultat est riche en éléments HTML mais **pauvre en diversité créative réelle**. L'objectif de cette analyse est de comprendre pourquoi, pour guider l'optimisation du moteur design dans une session dédiée.

---

## 1. Le "Ghost Text" — Réponse directe

### Qu'est-ce que c'est ?
Les gros nombres semi-transparents en fond ("63M", "234K", "15m", "01", "02", "03") sont des **ghost texts** — du texte décoratif à très faible opacité (5-15%) positionné en arrière-plan des slides.

### Pourquoi je le fais systématiquement ?
**Honnêtement : parce que c'est la béquille créative la plus facile à disposition.**

Le ghost text est l'une des rares techniques décoratives qui est :
- **Explicitement documentée** dans CSS-GUIDELINES.md (classes pré-calculées `ghost-dark-10`, `ghost-light-05`, etc., avec règles de positionnement)
- **Techniquement sûre** — ne viole aucune des 39 règles PPTX
- **Visuellement "remplissante"** — donne une illusion de richesse sans vrai risque créatif

### Est-ce qu'une règle m'oblige à le faire ?
**Non.** Aucune règle ne dit "mets du ghost text sur chaque slide." Ce qui existe :
- CSS-GUIDELINES.md mentionne le ghost text comme TECHNIQUE avec des contraintes (zones libres, left+width ≤ 1240)
- 6 classes CSS pré-calculées pour les opacités ghost (`ghost-dark-10/15/20`, `ghost-light-05/08`, `ghost-flash-dark-10/15`)
- La règle de densité : "Ghost text dans zones libres uniquement"

**Le fait que ces classes existent dans le système de design me SUGGÈRE de les utiliser, mais rien ne m'y oblige.** C'est un biais : je vois des outils disponibles → je les utilise, au lieu de créer quelque chose de nouveau.

---

## 2. Analyse objective : Qu'est-ce qui m'a contraint ?

### Les 3 couches du système

| Couche | Fichier(s) | Type | Impact créatif |
|--------|-----------|------|---------------|
| **Contraintes techniques** | CSS-GUIDELINES.md + design-compliance.md | 39 règles PPTX bloquantes | Cadre dur, 0 flexibilité |
| **Guidance créative** | creativity-levels.md | 3-4 phrases par niveau | Direction vague, très haute flexibilité |
| **Vocabulaire visuel** | Injection mood dans prompt | 2-3 phrases | Thématique, pas compositionnelle |

### Le problème central : OVER-CONSTRAINED techniquement, UNDER-GUIDED créativement

**Ce qui est hyper-détaillé (39 règles, ~730 lignes de docs) :**
- Pas de `right:` ni `bottom:` → calculer `left` et `top`
- Width obligatoire sur chaque texte (formule exacte)
- SVG dans container div, jamais `position:absolute`
- Pas de clip-path, CSS Grid, CSS variables, pseudo-éléments
- Pas de `color: rgba()` sur texte
- Font-size ≤ 96px contenu, ≤ 150px décoratif
- Boutons flexbox obligatoire
- Tout dans 1280×720
- Et 30+ autres règles...

**Ce qui est quasi-vide (26 lignes total pour les 3 niveaux) :**
- Quand utiliser du ghost text ? → Pas documenté
- Combien d'éléments décoratifs par slide ? → Pas documenté
- Quels patterns compositionnels pour chaque mood ? → Pas documenté
- Comment traduire "editorial spread" ou "margin notes" en HTML ? → Pas documenté
- Quelles proportions texte/visuel concrètement ? → "20/80" dit en 2 mots
- Quelles variations de layout entre slides ? → "Varie les compositions" (5 mots)

### Résultat : le LLM compense le vide créatif par la répétition

Quand je n'ai pas de guidance créative spécifique, voici ce qui se passe dans mon "raisonnement" :

1. **Je lis les contraintes techniques** → Je comprends ce qui est INTERDIT (beaucoup)
2. **Je lis l'intention créative** → "Direction artistique niveau affiche" (inspirant mais vague)
3. **Je lis le mood** → "Cercles concentriques, orbites, nœuds" (un vocabulaire, pas une composition)
4. **Je cherche des patterns sûrs** → Ghost text, orbital SVGs, cards, mockup UI (ce que je connais qui marche)
5. **Je réplique ces patterns** → Sur chaque slide, avec des variations mineures (position, taille, contenu)

### Les 5 patterns que je répète sur CHAQUE slide

| Pattern | Slides où il apparaît | Raison |
|---------|----------------------|--------|
| Ghost text (nombre décoratif) | 5/5 | Remplit l'espace, technique documentée |
| SVG cercles concentriques orbitaux | 5/5 | Seule interprétation concrète du mood "Orbital" |
| Nodes (petits cercles Oxygen/Flash) | 5/5 | Complément des cercles orbitaux |
| Overline → Titre → Bullets → Visuel | 5/5 | Structure de contenu imposée |
| Watermark VOLTAPILOT en bas | 5/5 | Convention de marque |

**Le résultat : 5 slides qui ont l'air d'être sorties du même moule**, avec juste le contenu et les couleurs qui changent.

---

## 3. Comment j'ai "choisi" d'être créatif

### Mon processus réel (honnête)

1. **Lire tokens.json** → OK, je connais les couleurs, typos, radius
2. **Lire CSS-GUIDELINES** → J'ai une liste de 39 interdits. Ça occupe ~60% de mon "espace mental"
3. **Lire pptx-techniques** → Je découvre les 10 techniques qui MARCHENT (ghost text, glassmorphism, circles, etc.)
4. **Lire creativity-levels.md** → "Poster-like, asymétrique, visual-first" — OK, intention reçue
5. **Lire le mood** → "Orbital = cercles, orbites, nœuds" — OK, vocabulaire reçu

**Puis je génère :**
- Je place les éléments de contenu (overline, titre, bullets) → ~40% de mon effort
- Je place un ghost text en background → Réflexe automatique
- Je place des cercles orbitaux → Réflexe "mood"
- Je crée un visuel (mockup/chart) → ~40% de mon effort
- Je vérifie les contraintes techniques → ~20% de mon effort

**Ce qui manque dans mon processus :**
- Je ne me demande JAMAIS "quelle composition unique pour CETTE slide ?"
- Je ne me demande JAMAIS "est-ce que cette slide DOIT avoir du ghost text ?"
- Je ne varie JAMAIS fondamentalement la structure (toujours Contenu-gauche + Visuel-droite ou centré)
- Je ne crée JAMAIS de tension visuelle (contrastes de taille, placements inattendus)
- Je ne SUPPRIME JAMAIS d'éléments pour créer du vide dramatique

### Ce que "niveau 3 Audacieux" DEVRAIT produire vs ce que je produis

| L'intention dit | Ce que je fais | Écart |
|----------------|---------------|-------|
| "Direction artistique niveau affiche" | Slide d'entreprise avec décorations | ÉNORME |
| "Un seul message par slide" | Overline + Titre + 4 bullets + KPI + visuel | Non respecté |
| "Espace vide dramatique" | Ghost text qui remplit le vide | INVERSÉ |
| "Contrastes de taille extrêmes" | H2 48px + body 16px (ratio 3:1) | Trop timide (devrait être 10:1+) |
| "Compositions asymétriques" | Split gauche/droite constant | Pas vraiment asymétrique |
| "Visual-first (20/80)" | 50/50 texte/visuel au mieux | Non respecté |
| "Chaque slide = affiche" | Chaque slide = slide corporate décorée | ÉNORME |
| "Patterns originaux (editorial spread, margin notes, full-bleed)" | Même pattern sur toutes les slides | Non respecté |

---

## 4. Diagnostic : Les 5 causes racines

### Cause 1 : Pas de références visuelles concrètes
Le système donne des MOTS ("poster", "editorial spread", "margin notes") mais pas d'EXEMPLES HTML. Le LLM n'a pas de modèle concret de ce à quoi ressemble un "editorial spread" en HTML 1280×720 avec les contraintes PPTX.

### Cause 2 : Les 39 règles techniques occupent trop d'espace mental
Le LLM passe plus de temps à vérifier "est-ce que j'ai violé une règle ?" qu'à penser "quelle composition serait surprenante ?". L'aversion au risque domine la créativité.

### Cause 3 : Le CSS pré-défini crée un menu de composants
Avec 211 classes CSS pré-définies (ghost-*, node-*, card-*, badge-*, kpi-box-*, mockup-*), le LLM "pioche dans le menu" au lieu de "designer from scratch". C'est efficace mais ça produit du template.

### Cause 4 : Le mood est un vocabulaire, pas une grammaire
"Cercles concentriques, orbites, nœuds" dit QUELS éléments utiliser, mais pas COMMENT les composer. Le LLM interprète ça comme "mets des cercles SVG en décoration" au lieu de "structure toute la composition autour de principes orbitaux".

### Cause 5 : Pas de variation compositionnelle documentée
"Varie les compositions entre slides" (5 mots dans le prompt) est la seule instruction. Aucun catalogue de patterns, aucune règle de contraste entre slides adjacentes, aucune notion de rythme visuel sur l'ensemble de la présentation.

---

## 5. Pistes d'optimisation pour la session dédiée

### Piste A : Référentiels visuels (design patterns concrets)
Documenter 8-10 patterns compositionnels avec des schémas box-drawing en ASCII. Ex :
- "Full-bleed" : le visuel occupe 100% de la slide, texte en overlay
- "Margin notes" : contenu principal à 60%, annotations en marge
- "Hero number" : un seul chiffre géant (200px+) comme élément principal
- "Editorial spread" : titre en bas, visuel en haut, reading order inversé
- etc.

### Piste B : Grammaire compositionnelle par mood
Au lieu de juste un vocabulaire, définir des RÈGLES de composition par mood. Ex pour Orbital :
- "Le point focal est TOUJOURS un cercle central"
- "Les éléments de contenu GRAVITENT autour du centre, pas alignés à gauche"
- "La tension vient de l'orbite : éléments plus proches = plus gros, plus loin = plus petits"

### Piste C : Anti-patterns explicites
Lister ce que le LLM NE DOIT PAS faire au niveau 3 :
- "JAMAIS de ghost text systématique"
- "JAMAIS la même structure sur 2 slides consécutives"
- "JAMAIS plus de 2 éléments textuels par slide (overline + titre OU titre + 2 bullets)"
- "JAMAIS de split gauche/droite classique"

### Piste D : Scoring de diversité
Ajouter une règle : "Sur 5 slides consécutives, au moins 3 patterns compositionnels DIFFÉRENTS doivent être utilisés."

### Piste E : Réduire le bruit technique dans le prompt
Séparer les contraintes techniques (les 39 règles) du prompt créatif. Les mettre dans un fichier que le LLM lit APRÈS avoir conçu la composition, pas AVANT. Actuellement, les règles techniques occupent l'espace cognitif qui devrait être dédié à la créativité.

---

## Résumé en une phrase

**Le moteur design produit des slides techniquement conformes mais créativement pauvres parce qu'il a 730 lignes de contraintes techniques, 26 lignes d'intention créative, et zéro exemple concret de ce que "poster-like" signifie en HTML.**
