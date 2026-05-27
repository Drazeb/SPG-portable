# Content Compliance Checker

## EXÉCUTION OBLIGATOIRE

**Ce fichier DOIT être lu et appliqué par le générateur de contenu.**

```
Workflow :
1. AVANT génération → Exécuter Partie A (validation inputs + chargement excellence)
2. APRÈS génération → Exécuter Partie B (validation structure)
3. APRÈS génération → Exécuter Partie D (validation excellence rédactionnelle)
4. Produire le rapport de conformité (Partie C)
```

---

## Principe clé : Lecture dynamique

Ce checker **lit dynamiquement** plusieurs fichiers :
- `/frameworks/{framework}/spec.md` — Structure et règles du framework
- `/lib/presentation-excellence.md` — Principes universels (TOUJOURS)
- `/lib/presentation-types/{type}.md` — Compétences par type (si spécifié)

**Avantage** : Quand un nouveau framework ou type est ajouté, il suffit de créer le fichier correspondant. Le checker fonctionne automatiquement.

---

# PARTIE A : VALIDATION PRÉ-GÉNÉRATION

**Objectif** : S'assurer que tous les inputs requis sont collectés ET que les fichiers d'excellence sont chargés AVANT de générer.

---

## A.1 Charger le framework

1. Identifier le framework sélectionné par l'utilisateur
2. Construire le chemin : `/frameworks/{framework}/spec.md`
3. Lire le fichier spec.md

**Si le fichier n'existe pas** → ERREUR : Framework inconnu. Vérifier le nom ou créer le spec.md.

## A.2 Charger les fichiers d'excellence

### A.2.1 Charger les principes universels (OBLIGATOIRE)

```
Chemin : /lib/presentation-excellence.md
Statut : OBLIGATOIRE pour toute génération
```

Ce fichier contient les 9 principes universels d'excellence rédactionnelle :
1. Action Titles
2. Une idée par slide
3. Règles de densité
4. Glance Test
5. "So What?" Test
6. Spécificité > Généralité
7. Verbes actifs
8. Structure parallèle
9. Pyramide inversée

### A.2.2 Identifier et charger le type de présentation — GATE BLOQUANT

**RÈGLE ABSOLUE** : Le type de présentation DOIT être **explicitement fourni par l'utilisateur**, jamais déduit ou deviné par le générateur.

**Si le type n'est pas spécifié par l'utilisateur** :

```
⛔ STOP — NE PAS CONTINUER
```

Poser la question AVANT toute génération :

> "Quel type de présentation souhaitez-vous générer ?"
> - commercial-b2b (présentation commerciale B2B)
> - [autres types à venir : fundraising, success-story, onboarding...]

**INTERDIT** : Déduire le type du contexte (ex: "ça ressemble à du B2B, donc je prends commercial-b2b")

**Si le type est spécifié explicitement** :
1. Construire le chemin : `/lib/presentation-types/{type}.md`
2. Lire le fichier
3. Si le fichier n'existe pas → WARNING, continuer avec principes universels uniquement

**Tableau d'audit A.2** :

| Fichier | Chemin | Fourni par | Chargé | Statut |
|---------|--------|------------|--------|--------|
| Principes universels | `/lib/presentation-excellence.md` | Système | ✅/❌ | OBLIGATOIRE |
| Type de présentation | `/lib/presentation-types/{type}.md` | **Utilisateur** | ✅/❌ | BLOQUANT si non fourni |

**Vérification** : La colonne "Fourni par" pour le type DOIT être "Utilisateur", jamais "Déduit" ou "Système".

## A.3-A.4 Extraire et vérifier les inputs obligatoires

Lire `## 1. Inputs Requis` → `### Obligatoires (génération impossible sans)` du spec.md.
Pour chaque input : vérifier Présent ? Non vide ? Format valide (string/array/object selon spec) ?

**Remplir le tableau d'audit** :

| Input | Présent | Non vide | Format OK | Statut |
|-------|---------|----------|-----------|--------|
| `company_name` | ✅ | ✅ | ✅ | ✅ |
| `problems` | ✅ | ✅ | ✅ (array) | ✅ |
| `critical_date` | ❌ | - | - | ❌ MANQUANT |

## A.5 Questions à poser si inputs manquants — GATE BLOQUANT

**RÈGLE ABSOLUE** : Ne JAMAIS inventer/déduire/deviner un input manquant. `⛔ INPUT MANQUANT = STOP IMMÉDIAT` → Poser la question, attendre la réponse, puis continuer.

Pour chaque input manquant, poser une question adaptée :

| Input manquant | Question type |
|----------------|---------------|
| `problems` | "Quels sont les 2-4 problèmes principaux du prospect ? Avec impact chiffré si possible." |
| `critical_business_issue` | "Quel est l'enjeu business critique du prospect ? (objectif à risque)" |
| `specific_capabilities` | "Quelles capacités/fonctionnalités le prospect recherche-t-il ?" |
| `delta` | "Quel gain le prospect espère-t-il ? (en chiffres)" |
| `critical_date` | "Y a-t-il une date critique ou événement déclencheur ? (audit, fin de contrat, deadline)" |
| `stakeholders` | "Qui sera présent lors de la présentation ? (noms et titres)" |
| `metrics` | "Quelles métriques le prospect veut-il améliorer ? (baseline → target)" |
| `champion` | "Qui est le champion interne ? (nom, titre, niveau d'engagement)" |

Pour tout autre input manquant, formuler une question adaptée basée sur la description dans le spec.md.

## A.6 Score de Readiness — GATE BLOQUANT

```
Score = (inputs_obligatoires_remplis / inputs_obligatoires_total) × 100
```

| Score | Statut | Action |
|-------|--------|--------|
| 100% | ✅ GO | Génération autorisée |
| <100% | ⛔ STOP | Collecter les inputs manquants d'abord |

**RÈGLE BLOQUANTE** : Il n'y a pas de "warning" pour la Partie A. C'est **100% ou STOP**.

**Tableau d'audit A.6** — Vérifier la source de chaque input :

| Input | Valeur | Source | Statut |
|-------|--------|--------|--------|
| `company_name` | Vertillo | ✅ Utilisateur | ✅ |
| `industry` | Logistique | ✅ Utilisateur | ✅ |
| `critical_date` | Janvier 2025 | ❌ Déduit | ⛔ INVALIDE |
| `type_presentation` | commercial-b2b | ✅ Utilisateur | ✅ |

**La colonne "Source" DOIT être "Utilisateur" pour tous les inputs obligatoires.**
Si un input a "Déduit" ou "Supposé" → ⛔ INVALIDE, poser la question.

# PARTIE B : VALIDATION POST-GÉNÉRATION (Structure)

**Objectif** : S'assurer que le contenu généré respecte la structure et les règles du framework.

## B.1-B.2 Charger et vérifier les règles du framework

Lire la section `## 4. Checklist de Validation` du spec.md → sous-section `### Après génération`.
Extraire chaque ligne `- [ ]` comme une règle à vérifier sur le contenu généré.

**Remplir le tableau d'audit** :

| # | Règle (du spec.md) | Vérifié | Statut |
|---|-------------------|---------|--------|
| 1 | Situation Slide est la slide 1 | Slide 1 = "Situation Slide" | ✅ |
| 2 | Illustration précède chaque Workflow | Slide 2 avant Slides 4-6 | ✅ |
| ... | ... | ... | ... |

## B.3 Format de sortie (technique — s'applique TOUJOURS)

### B.3.1 Structure "Contenu textuel" — DÉFINITION STRICTE

**RÈGLE FONDAMENTALE** : Le "Contenu textuel" = le **VRAI texte qui apparaîtra sur la slide**. Pas une fiche technique. Pas une description du contenu. Pas des instructions.

**Éléments AUTORISÉS avec leurs symboles** :

| Symbole | Élément | Préfixe obligatoire | Description | Obligatoire |
|---------|---------|---------------------|-------------|-------------|
| `█` | Titre | `█ TITRE :` | Action Title (verbe + outcome) | **OUI** |
| `■` | Overline | `■ OVERLINE :` | Texte court au-dessus du titre | Non |
| `•` | Bullet | `•` | Point de liste (max 6, ~10-12 mots) | Non |
| `▸` | Chiffre clé | `▸ CHIFFRE CLÉ :` | Métrique mise en avant | Non |
| `▪` | Sous-titre | `▪ SOUS-TITRE :` | Précision ou contexte (1 ligne) | Non |
| `"` | Citation | `" CITATION :` | Quote avec attribution | Non |
| `→` | CTA | `→ CTA :` | Texte d'appel à l'action | Non |
| `░` | Visuel | `░ VISUEL` | Section description visuelle | **OUI** |

**Éléments INTERDITS et Patterns de détection** :

| Élément / Pattern interdit | Détection | Pourquoi |
|---------------------------|-----------|----------|
| `Annotations sur le mockup` | Texte littéral | Élément inventé, n'existe pas dans les règles |
| Tableaux `\| Champ \| Contenu \|` ou `\| Champ \| Valeur \|` | Pattern markdown tableau | Méta-description, pas du contenu réel |
| Instructions au designer | Phrases impératives hors `░ VISUEL` | La section "Visuel" est prévue pour ça |
| Listes > 6 éléments | Compter les `•` | Viole la règle de densité |
| Méta-descriptions | `Cette slide montre...` / `Cette slide présente...` | Ce n'est pas du contenu affiché |
| Titre sans `█ TITRE :` | Texte de titre sans préfixe | Préfixe manquant, format ambigu |
| Overline sans `■ OVERLINE :` | Texte d'overline sans préfixe | Préfixe manquant, format ambigu |
| Pas de séparateur `════` | Absence de séparateur entre slides | Format non respecté |

---

### B.3.2 Contrôle de Cohérence Format — TABLEAU OBLIGATOIRE

**Pour CHAQUE slide générée, remplir ce tableau** :

| Slide # | Éléments (avec préfixes) | Format box-drawing ? | Interdits détectés | Statut |
|---------|--------------------------|----------------------|-------------------|--------|
| 1 | █ TITRE, • ×4 | ✅ | Aucun | ✅ |
| 2 | Titre sans préfixe, Tableau | ❌ | Tableau + pas de préfixe | ❌ RÉVISER |
| 3 | ■ OVERLINE, █ TITRE, • ×3, ▸ CHIFFRE | ✅ | Aucun | ✅ |
| ... | ... | ... | ... | ... |

**Vérifications obligatoires** :

| Vérification | Critère | Obligatoire |
|--------------|---------|-------------|
| Séparateur `════` entre slides | Présent avant chaque slide | ✅ OUI |
| Header avec nom et éléments | `SLIDE X : NOM │ liste éléments` | ✅ OUI |
| Préfixe `█ TITRE :` | Titre a son préfixe explicite | ✅ OUI |
| Préfixe `■ OVERLINE :` | Si overline présent, a son préfixe | ✅ OUI |
| Préfixe `▸ CHIFFRE CLÉ :` | Si chiffre présent, a son préfixe | ✅ OUI |
| Section `░ VISUEL` | Présente avec 4 champs indentés | ✅ OUI |

**RÈGLE BLOQUANTE** :
- Seuil = **100%**
- Si une slide a statut ❌ → **CORRIGER cette slide AVANT de passer à la Partie D**
- Le rapport de conformité (Partie C) **NE PEUT PAS** être produit tant que B.3.2 n'est pas 100% ✅

---

### B.3.3 Structure "░ VISUEL" — 4 champs obligatoires

**Format obligatoire** — Section `░ VISUEL` avec 4 champs **indentés** (2 espaces) :
`Requis:` (Oui/Non/Optionnel), `Concept:`, `Intention:`, `Contrainte:` (ou "Aucune")

---

### B.3.4 Format de Sortie Obligatoire (Box-Drawing)

**FORMAT FIGÉ** — Toute génération de contenu DOIT utiliser ce format exact.

**Légende** : `═══` (séparateur), `■` (OVERLINE), `█` (TITRE), `•` (Bullet), `▸` (CHIFFRE CLÉ), `░` (VISUEL)

**✅ FORMAT OBLIGATOIRE — Exemple complet** :

```
════════════════════════════════════════════════════════════════════════════
SLIDE 3 : DEMO ROADMAP │ overline + titre + 4 bullets
════════════════════════════════════════════════════════════════════════════

■ OVERLINE : AUJOURD'HUI
█ TITRE : 4 capacités clés en 12 minutes pour répondre à vos enjeux prioritaires
• Segment 1 : Configuration d'un dépôt (3 min) → Problème P1
• Segment 2 : Synchronisation ENR en temps réel (4 min) → Problème P2
• Segment 3 : Gestion automatique des pics (3 min) → Problème P3
• Segment 4 : Export reporting CSRD en 1 clic (2 min) → Problème P4

░ VISUEL
  Requis: Oui
  Concept: Timeline horizontale avec 4 boxes numérotées + durées
  Intention: Donner une carte mentale de la démo, permettre de sauter des segments
  Contrainte: Boxes numérotées avec durées (Great Demo! spec)
```

---

**❌ FORMATS INTERDITS** :

```
# INTERDIT — Pas de préfixe explicite
AUJOURD'HUI                    ← On ne sait pas si c'est overline ou titre
4 capacités clés en 12 min...  ← Idem

# INTERDIT — Tableau descriptif
| Champ | Contenu |
| Persona | Sophie Marchand |

# INTERDIT — Élément inventé
Annotations sur le mockup (max 3) : ...
```

---

**Règles du format** :

1. Chaque slide commence par `════` (séparateur)
2. Header : `SLIDE X : NOM │ liste des éléments présents`
3. Chaque élément textuel a son **préfixe explicite** : `■ OVERLINE :`, `█ TITRE :`, `•`, `▸ CHIFFRE CLÉ :`
4. Section visuel commence par `░ VISUEL` avec 4 champs indentés
5. Le générateur de design peut parser ce format sans ambiguïté

---

## B.4 Score de Conformité Structure

```
Score = (règles_respectées / règles_totales) × 100

Règles totales = règles_spec.md (B.1-B.2) + règles_format_sortie (B.3)
```

**CONDITION BLOQUANTE AVANT CALCUL DU SCORE** :

Le tableau B.3.2 (Contrôle de Cohérence Format) **DOIT être 100% ✅** avant de calculer le score.
- Si B.3.2 < 100% → **STOP**, corriger les slides non conformes d'abord
- Si B.3.2 = 100% → Calculer le score B.4

| Score | Statut | Action |
|-------|--------|--------|
| 100% | ✅ CONFORME | Passer à Partie D |
| 90-99% | ⚠️ WARNING | Lister les violations, évaluer si critiques |
| <90% | ❌ RÉVISION | Corriger avant de continuer |

---

# PARTIE D : VALIDATION EXCELLENCE RÉDACTIONNELLE

**Objectif** : S'assurer que le contenu généré respecte les principes d'excellence rédactionnelle (qualité, pas juste structure).

**Référence** : `/lib/presentation-excellence.md`

---

## D.1 Vérification Action Titles

**Critère** : Le titre de chaque slide contient un verbe d'action ET un outcome spécifique.

**Remplir le tableau d'audit** :

| Slide # | Titre | Verbe d'action ? | Outcome ? | Statut |
|---------|-------|------------------|-----------|--------|
| 1 | "Reduce costs by 30% with automation" | ✅ Reduce | ✅ 30% | ✅ |
| 2 | "Our Solution" | ❌ | ❌ | ❌ RÉVISER |

**Seuil** : 100% des slides (sauf titre/cover et transitions)

## D.2 Vérification Densité

**Critère** : Max 6 bullets par slide, ~10-12 mots par bullet (guidance souple).

**Remplir le tableau d'audit** :

| Slide # | Nb bullets | Mots/bullet (liste) | Max dépassé ? | Statut |
|---------|------------|---------------------|---------------|--------|
| 1 | 4 | 8, 6, 10, 7 | Non | ✅ |
| 2 | 8 | 15, 12, 18, 14, 16, 11, 13, 10 | ❌ 8 bullets | ❌ RÉVISER |

**Seuils** :
- Bullets par slide : **6 maximum** (règle stricte)
- Mots par bullet : **~10-12** (guidance souple, alerter si >15)

**Seuil global** : 90% des slides conformes

## D.3 Vérification Spécificité (Anti-Vague)

**Critère** : Aucun terme vague sans chiffre associé.

**Termes INTERDITS** (sauf si accompagnés d'un chiffre) :
- "significativement", "considérablement", "beaucoup", "très"
- "améliore" / "optimise" (sans quantification)
- "plus rapide" / "plus efficace" (sans comparaison chiffrée)

**Remplir le tableau d'audit** :

| Slide # | Terme vague détecté | Chiffre associé ? | Statut |
|---------|---------------------|--------------------|--------|
| 3 | "significativement" | ❌ | ❌ RÉVISER |
| 5 | "plus rapide" | ✅ "4x (4h→1h)" | ✅ |

**Seuil** : 0 terme vague non quantifié

## D.4 Vérification Structure Parallèle

**Critère** : Tous les bullets d'une même slide ont la même forme grammaticale.

**Formes possibles** : Verbe (Reduce...), Nom (Reduction...), Chiffre (73%...)

**Remplir le tableau d'audit** :

| Slide # | Formes des bullets | Cohérent ? | Statut |
|---------|-------------------|------------|--------|
| 1 | Verbe, Verbe, Verbe, Verbe | ✅ | ✅ |
| 2 | Verbe, Nom, Verbe, Chiffre | ❌ Mixte | ❌ RÉVISER |

**Seuil** : 90% des slides conformes

## D.5 Vérification Glance Test

**Critère** : Le message principal de chaque slide est compréhensible en 3 secondes.

| Slide # | Titre | Message clair en 3 sec ? | Statut |
|---------|-------|--------------------------|--------|
| 1 | "Reduce costs by 30%..." | ✅ Oui | ✅ |
| 2 | (slide surchargée) | ❌ Non | ❌ RÉVISER |

**Seuil** : 100% des slides passent le Glance Test

## D.6 Score Excellence Rédactionnelle

```
Score = moyenne des 5 sous-scores (D.1 à D.5)

D.1 Action Titles : X/Y slides conformes
D.2 Densité : X/Y slides conformes
D.3 Spécificité : 0 termes vagues = 100%, sinon 0%
D.4 Structure Parallèle : X/Y slides conformes
D.5 Glance Test : X/Y slides conformes
```

| Score | Statut | Action |
|-------|--------|--------|
| 100% | ✅ EXCELLENCE | Prêt pour le constructeur de design |
| 90-99% | ⚠️ WARNING | Lister les violations, corriger si possible |
| <90% | ❌ RÉVISION OBLIGATOIRE | Corriger AVANT de passer au design |

---

# PARTIE C : RAPPORT DE CONFORMITÉ

**Produire ce rapport après chaque validation.**

Report template : Partie A (Score Readiness) → Partie B (Score Structure, incl. B.3.2 GATE) → Partie D (Score Excellence) → Partie C (Score Global + Actions Requises)

**Structure du rapport** :
```
═══════════════════════════════════════════════════════
         CONTENT COMPLIANCE REPORT
═══════════════════════════════════════════════════════
FRAMEWORK : [nom]  |  TYPE : [type]  |  PROSPECT : [nom]  |  DATE : [date]
SPEC FILE : /frameworks/{framework}/spec.md
EXCELLENCE FILE : /lib/presentation-excellence.md
TYPE FILE : /lib/presentation-types/{type}.md

─── PARTIE A : PRÉ-GÉNÉRATION ───
Fichiers d'excellence chargés : ✅/❌
Inputs obligatoires : X/Y remplis → Score Readiness : XX%

─── PARTIE B : POST-GÉNÉRATION (Structure) ───
B.1-B.2 Règles framework : X/Y
B.3.2 Contrôle Cohérence Format : X/Y slides (BLOQUANT, doit = 100%)
B.3.3 Format Visuel : X/Y slides
→ Score Structure : XX%

─── PARTIE D : EXCELLENCE RÉDACTIONNELLE ───
D.1-D.5 sous-scores → Score Excellence : XX%

─── SCORE GLOBAL ───
Readiness (A) XX% + Structure (B) XX% + Excellence (D) XX% = GLOBAL XX%
Statut : ✅ PRÊT POUR DESIGN / ⚠️ WARNINGS / ❌ RÉVISION REQUISE
Actions requises : [liste si score < 100%]
═══════════════════════════════════════════════════════
```

Voir `/lib/examples/content-report-example.md` pour le template complet avec tous les champs détaillés.

---

# FORMAT STANDARD DU SPEC.MD

Pour qu'un nouveau framework soit compatible avec ce checker, son `spec.md` doit suivre cette structure :

```
# [Nom du Framework] — Spec Opérationnelle
## 1. Inputs Requis
   ### Obligatoires (génération impossible sans)  → Tableau | Input | Type | Description |
   ### Recommandés (améliore la qualité)           → Même format
   ### Optionnels                                   → Même format
## 2. Structure des Slides                         → Description phases + slides
## 3. Règles Critiques                             → Liste numérotée
## 4. Checklist de Validation
   ### Avant génération                            → Liste - [ ] règles pré-génération
   ### Après génération                            → Liste - [ ] règles post-génération
## 5. Structure JSON Input                         → Template JSON pour les inputs
```

Le checker utilise les sections 1 et 4 programmatiquement. Les sections 2, 3, 5 sont des références pour le générateur.

---

# RÉSUMÉ

| Partie | Quand | Vérifie | Bloquant si |
|--------|-------|---------|-------------|
| A | AVANT génération | Inputs + chargement excellence | Readiness <100% |
| B.1-B.2 | APRÈS génération | Structure framework (spec.md) | Structure <90% |
| **B.3.2** | APRÈS génération | **Cohérence format sortie** | **Format <100%** ← BLOQUANT |
| B.3.3 | APRÈS génération | Visuel (4 champs) | Visuel incomplet |
| D | APRÈS génération | Excellence rédactionnelle (9 principes) | Excellence <90% |
| C | Toujours | — | Rapport obligatoire |

**Ordre d'exécution** : A → Génération → B.1-B.2 → **B.3.2 (GATE)** → B.3.3 → D → C

**GATE B.3.2** : Si le contrôle de cohérence format n'est pas 100%, **STOP** et corriger avant de continuer.
