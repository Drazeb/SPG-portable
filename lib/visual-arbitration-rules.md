# Règles d'Arbitrage Visuel

## Objectif

Ce document définit les règles que le **constructeur de design** (Phase 3) doit appliquer pour décider du format des visuels : SVG, placeholder, ou mockup.

---

## Principe fondamental

> **Le générateur de contenu donne le QUOI (concept + intention).**
> **Le constructeur de design décide le COMMENT (format + exécution).**

Le générateur ne dicte pas le format. Il fournit :
- **Concept** : Ce que le visuel doit représenter
- **Intention** : Pourquoi ce visuel (concret, explicatif, émotionnel, comparatif)
- **Contrainte framework** : Format imposé par le framework (si applicable)

---

## Règle de priorité

```
1. SI "Contrainte framework" présent → Respecter OBLIGATOIREMENT
2. SINON → Libre arbitre avec les critères ci-dessous
```

### Contraintes framework courantes

| Framework | Phase/Slide | Contrainte |
|-----------|-------------|------------|
| Great Demo! | Illustration | Screenshot du résultat final |
| Great Demo! | Workflow (Do It) | Screenshot de chaque étape |
| Workflow-Driven | Demo segments | Screenshot ou mockup UI |
| MEDDIC | Business Case | Data visualization |

Quand une contrainte framework impose un screenshot ou une photo que le constructeur ne peut pas créer → **Placeholder obligatoire**.

---

## Règle d'honnêteté visuelle

```
Un placeholder descriptif est TOUJOURS préférable
à un SVG qui ne représente pas bien le concept.
```

### Question à se poser

Avant de faire un SVG, le constructeur doit se demander :

> "Est-ce que mon SVG va VRAIMENT bien représenter ce concept,
> ou est-ce que je fais quelque chose de pauvre qui dessert le message ?"

- Si la réponse est "pauvre" → **Placeholder**
- Si la réponse est "oui, ça représente bien" → **SVG**

---

## Critères de décision

### Quand mettre un PLACEHOLDER

| Situation | Exemple |
|-----------|---------|
| Contrainte framework = Screenshot ou Photo | "Screenshot page Intégrations" |
| Concept implique des éléments réels | Personnes, lieux, objets physiques, UI réelle |
| Intention = "concret, tangible, réel" | "Montrer l'action concrète dans l'interface" |
| Le SVG serait trop pauvre pour le concept | Concept complexe, >5 éléments, détails fins |
| Dans le doute | Toujours privilégier le placeholder |

### Quand faire un SVG

| Situation | Exemple |
|-----------|---------|
| Concept abstrait et simple | Flux, connexions, processus ≤5 éléments |
| Intention = "explicatif, processus" | "Expliquer le flux de données" |
| Éléments géométriques simples | Jauges, barres, courbes simples, icônes |
| Données chiffrées à visualiser | Comparaison avant/après, pourcentages |

### Quand faire un MOCKUP UI simplifié

| Situation | Exemple |
|-----------|---------|
| Concept = interface utilisateur | "Page de configuration" |
| Intention = "montrer l'action utilisateur" | "L'utilisateur clique sur X" |
| Peut être représenté par rectangles + texte | Fenêtres, boutons, listes |

---

## Format du placeholder

Quand un placeholder est choisi, utiliser ce format :

```html
<div class="placeholder">
  <span class="placeholder-label">[Type : Description]</span>
</div>
```

Exemples :
- `[Screenshot : Page Intégrations - connexion sources d'énergie]`
- `[Photo : Flotte de véhicules électriques en charge]`
- `[Graphique : Évolution CO2 sur 12 mois avec données réelles]`

Le texte doit être suffisamment descriptif pour que l'utilisateur final sache quelle image ajouter.

---

## Exemples concrets

### Exemple 1 : Contrainte framework

**Input du générateur :**
```markdown
**Visuel** :
- Requis : Oui
- Concept : L'utilisateur connecte ses panneaux solaires au système
- Intention : Montrer l'action concrète dans l'interface
- Contrainte framework : Screenshot (Great Demo! l'impose sur les slides Workflow)
```

**Décision constructeur :**
- Contrainte framework présente → Doit respecter "Screenshot"
- Ne peut pas faire un vrai screenshot → **Placeholder**
- Résultat : `[Screenshot : Page Intégrations - ajout source panneaux solaires]`

---

### Exemple 2 : Libre arbitre - Concept concret

**Input du générateur :**
```markdown
**Visuel** :
- Requis : Oui
- Concept : Flotte de camions électriques dans un dépôt
- Intention : Rendre tangible la taille de l'opération du prospect
- Contrainte framework : Aucune
```

**Décision constructeur :**
- Pas de contrainte → Libre arbitre
- Concept = éléments réels (camions, dépôt) → Ne peut pas bien représenter en SVG
- Intention = "tangible" → Besoin de concret
- **Placeholder** : `[Photo : Flotte de véhicules utilitaires électriques en charge]`

---

### Exemple 3 : Libre arbitre - Concept abstrait

**Input du générateur :**
```markdown
**Visuel** :
- Requis : Oui
- Concept : Comparaison avant/après (73% carboné → 30% carboné)
- Intention : Visualiser le gain de manière frappante
- Contrainte framework : Aucune
```

**Décision constructeur :**
- Pas de contrainte → Libre arbitre
- Concept = comparaison chiffrée → Peut être représenté par des barres/jauges
- Intention = "visualiser le gain" → Data viz simple suffit
- **SVG** : Deux barres ou jauge avec 73% et 30%

---

### Exemple 4 : Libre arbitre - Mockup UI

**Input du générateur :**
```markdown
**Visuel** :
- Requis : Oui
- Concept : Dashboard montrant le % de recharge verte en temps réel
- Intention : Montrer ce que l'utilisateur verra chaque matin
- Contrainte framework : Aucune
```

**Décision constructeur :**
- Pas de contrainte → Libre arbitre
- Concept = interface (dashboard) → Peut faire un mockup simplifié
- Intention = "montrer ce que l'utilisateur verra" → Mockup approprié
- **Mockup UI** : Rectangles simulant un dashboard + jauge + chiffre "87%"

---

## Résumé

```
┌─────────────────────────────────────────────────────────────┐
│                    ARBRE DE DÉCISION                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Contrainte framework présente ?                            │
│  ├─ OUI → Respecter le format imposé                        │
│  │        └─ Si screenshot/photo → Placeholder              │
│  │                                                          │
│  └─ NON → Analyser concept + intention                      │
│           │                                                 │
│           ├─ Éléments réels ? → Placeholder                 │
│           ├─ Intention "concret" ? → Placeholder ou Mockup  │
│           ├─ Concept abstrait simple ? → SVG                │
│           ├─ Data à visualiser ? → SVG (barres, jauges)     │
│           └─ Doute ? → Placeholder                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
