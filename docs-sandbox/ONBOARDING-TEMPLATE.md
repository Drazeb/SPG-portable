# Template Onboarding — Skills Claude Code

Ce document contient :
- **Partie A** : Le template générique réutilisable (avec placeholders)
- **Partie B** : L'exemple concret du Slide Presentation Generator

---

# PARTIE A — TEMPLATE GÉNÉRIQUE

## Directive technique (à mettre dans le SKILL.md)

```
### ONBOARDING — Message de bienvenue

À CHAQUE invocation de /{nom_skill}, AVANT toute autre action, afficher le message
d'onboarding ci-dessous à l'utilisateur (copier tel quel, ne pas résumer) :
```

## Structure du message

Le message suit un pattern en 4 blocs. Chaque bloc a un rôle précis.

---

### BLOC 1 — Header (pitch)

```markdown
## /{nom_skill}

{Phrase 1 : ce que l'outil produit concrètement — le livrable final.}
{Phrase 2 : comment ça se passe — guidé étape par étape, inputs au fur et à mesure.}
```

**Règles :**
- 2 lignes max
- Phrase 1 = le QUOI (résultat tangible)
- Phrase 2 = le COMMENT (processus guidé, pas technique)
- Pas de jargon technique dans le header

---

### BLOC 2 — Étapes du pipeline

Pour CHAQUE étape significative du pipeline, suivre ce format :

```markdown
**{N}. {Titre de l'étape}** *({note de contexte optionnelle})*
{Description user-facing : ce qui se passe, en 2-3 lignes max, langage accessible.}
*Sous le capot : {description technique condensée — ce que les agents font réellement,
quels fichiers sont lus, quelles validations tournent. 2-3 lignes max.}*
→ {Type d'input}
```

**Règles par champ :**

| Champ | Règle | Exemple |
|-------|-------|---------|
| **N. Titre** | Numéroté, verbe d'action ou nom concret | "3. Rédaction du contenu des slides" |
| **(note contexte)** | Optionnel. Fréquence ou condition | "(une seule fois par marque)", "(point de contrôle)" |
| **Description** | Langage non-technique, centré sur le résultat | "Je génère le contenu textuel de chaque slide" |
| ***Sous le capot*** | Italique. Détails techniques — agents, gates, scripts | "un agent spécialisé applique 3 quality gates" |
| **→ Input** | Ce que l'utilisateur doit fournir, ou "Automatique" | "→ Tes inputs : **3 fichiers HTML**" |

**Pattern d'input :**

```markdown
→ Automatique
```
ou
```markdown
→ Tes inputs : **{input_1}** + **{input_2}**
```
ou (si plusieurs inputs détaillés) :
```markdown
→ Tes inputs :
  · **{Nom input 1}** — {description courte}
  · **{Nom input 2}** — {description courte}
  · **{Nom input 3}** — {description courte}
```

**Principe clé : alterner automatique et humain.**
L'utilisateur doit voir clairement :
- Ce qui lui demande une action (inputs, validations, choix)
- Ce qui tourne tout seul (génération, validation automatique)
Ça crée un rythme : auto → humain → auto → humain → résultat.

---

### BLOC 3 — Récap inputs

```markdown
### Récap — ce qu'il faut préparer

Pour {cas 1 — ex: première utilisation} :
  · {input obligatoire 1}
  · {input obligatoire 2}
  · {input obligatoire 3}

Pour {cas 2 — ex: utilisation récurrente} :
  · {input minimal} — c'est tout
```

**Règles :**
- Distinguer le cas "première fois" (setup lourd) du cas "récurrent" (input minimal)
- Format liste à puces avec `·`
- Terminer le cas simple par "— c'est tout" (rassure l'utilisateur)

---

### BLOC 4 — Fermeture

```markdown
---

*(Fin du message d'onboarding — enchaîner avec {première_phase})*
```

**Règle :** Ce marqueur est pour l'orchestrateur, pas pour l'utilisateur. Le `---` sépare visuellement l'onboarding de la suite.

---

## Principes de rédaction

1. **Double lecture** : chaque étape a une couche "user-facing" (accessible) ET une couche "sous le capot" (technique en italique). Le novice lit la première, l'expert lit les deux.

2. **Honnêteté technique** : le "sous le capot" ne ment pas et ne simplifie pas à l'excès. Il mentionne les vrais mécanismes (agents, gates, scripts, batching). Ça construit la confiance.

3. **Inputs en gras** : chaque input utilisateur est en **gras**. L'utilisateur scanne le message et repère immédiatement ce qu'il doit préparer.

4. **"Automatique" explicite** : quand une étape ne demande rien à l'utilisateur, l'écrire explicitement. Ne pas laisser l'ambiguïté.

5. **Pas de jargon non expliqué** : si un terme technique apparaît dans la couche user-facing, il doit être immédiatement suivi d'une explication. Le jargon est autorisé uniquement dans "sous le capot".

6. **Rythme** : alterner étapes automatiques et points de contrôle humains. Ça donne le sentiment d'un processus collaboratif, pas d'une boîte noire.

---
---

# PARTIE B — EXEMPLE CONCRET : SLIDE PRESENTATION GENERATOR

Ci-dessous, le message d'onboarding tel qu'il est implémenté dans le skill `/generate-slides`. Chaque section est annotée avec le bloc du template qu'elle implémente.

---

```markdown
                                                              ┌─────────────────┐
                                                              │ BLOC 1 — Header │
                                                              └─────────────────┘
## /generate-slides

Cet outil génère une présentation B2B complète : contenu des slides + design HTML
exportable en .pptx.
Le processus est guidé étape par étape — je te demanderai tes inputs au fur et à mesure.

                                                              ┌──────────────────┐
                                                              │ BLOC 2 — Étapes  │
                                                              └──────────────────┘

**1. Apprentissage de l'identité visuelle** *(une seule fois par marque)*
Je lis les pages d'identité visuelle de la marque et le style guide, et j'en extrais
un "design language" : palette, typographies, principes de mise en page.
*Sous le capot : j'analyse d'abord les 3 pages HTML pour en extraire les tokens de design
(couleurs, typos, espacements). Puis je génère 24 slides d'exemple qui serviront de
modèles de référence pour toutes les présentations futures de cette marque.*
→ Tes inputs : **3 fichiers HTML** Brand Identity + **1 Style Guide** (Kit de Transfert .md)

**2. Briefing**
Je te pose 4 questions pour comprendre ce que tu veux générer :
quelle marque, quel framework de storytelling, quel brief commercial, et quel type
de présentation.
→ Tes inputs :
  · **Marque** — nom de la brand (doit avoir ses tokens déjà configurés)
  · **Framework** — structure narrative (great-demo, workflow-driven, ou meddic)
  · **Brief** — fichier .md ou texte décrivant le produit, le contexte business, la cible
  · **Type de présentation** — ex : commercial-b2b

**3. Rédaction du contenu des slides**
Je génère le contenu textuel de chaque slide : titres d'action, corps de texte,
données clés, notes de mise en scène visuelle — en suivant le framework choisi.
*Sous le capot : un agent spécialisé applique le framework sélectionné, les règles
d'excellence rédactionnelle B2B, et vérifie la conformité du contenu via 3 quality gates
(pré-génération, post-génération, excellence). Le contenu sort en format structuré
slide par slide.*
→ Automatique

**4. Validation du contenu** *(point de contrôle)*
Je t'affiche le contenu slide par slide. Tu relis, tu valides ou tu demandes des
corrections. Rien n'avance tant que tu n'as pas dit OK.
→ Tes inputs : **Relecture** + feedback (OK ou corrections par slide)

**5. Création du design HTML**
Je transforme le contenu validé en vraies slides visuelles HTML/CSS, fidèles à
l'identité de la marque et compatibles export PPTX.
*Sous le capot : un agent design s'inspire des 24 slides d'exemple générées à l'étape 1
pour composer chaque slide. Il travaille par batches de 5 slides max. Un script de
validation vérifie automatiquement les 39 règles de compatibilité PPTX.*
→ Automatique

**6. Mise en page finale** *(layouts + export)*
Je te propose des alternatives de mise en page pour chaque slide (disposition des blocs,
colonnes, ratios). Tu choisis, je régénère les slides concernées, et tu obtiens
ton fichier HTML final avec bouton d'export PPTX.
*Sous le capot : un agent layout analyse chaque slide et génère 2+ alternatives en
box-drawing (schémas ASCII). Après ton choix, seules les slides modifiées sont régénérées.*
→ Tes inputs : **Choix de layout** parmi les alternatives proposées

                                                              ┌──────────────────────┐
                                                              │ BLOC 3 — Récap       │
                                                              └──────────────────────┘

### Récap — ce qu'il faut préparer

Pour une **nouvelle marque** :
  · 3 fichiers HTML Brand Identity (pages d'identité visuelle)
  · 1 Style Guide au format Kit de Transfert (.md)
  · 1 brief commercial (.md ou texte)

Pour une **marque déjà configurée** :
  · 1 brief commercial (.md ou texte) — c'est tout

                                                              ┌──────────────────────┐
                                                              │ BLOC 4 — Fermeture   │
                                                              └──────────────────────┘

---

*(Fin du message d'onboarding — enchaîner avec Phase 0)*
```

---

## Analyse du pattern SPG

| Aspect | Choix fait dans SPG | Pourquoi ça marche |
|--------|--------------------|--------------------|
| **6 étapes** | Ni trop (>8 = overwhelming) ni trop peu (<4 = boîte noire) | L'utilisateur voit un processus complet sans se sentir submergé |
| **3 étapes automatiques** | Étapes 1, 3, 5 | L'utilisateur sait qu'il n'a rien à faire — il attend |
| **3 points de contrôle** | Étapes 2, 4, 6 | L'utilisateur garde le contrôle — il décide |
| **"Sous le capot" sur 3 étapes** | Étapes 1, 3, 5 (les automatiques) | On explique ce qui est opaque, pas ce qui est évident |
| **Inputs en gras** | Partout | Scannable — l'utilisateur repère ses actions en 10 secondes |
| **Récap à 2 cas** | Nouveau vs récurrent | Rassure le cas récurrent ("c'est tout") |
| **Rythme** | Input → Auto → Contrôle → Auto → Contrôle → Résultat | Collaboratif, pas passif |

---

## Checklist pour adapter à un autre skill

- [ ] Remplacer `/{nom_skill}` par le nom de ton skill
- [ ] Rédiger le pitch 2 lignes (QUOI + COMMENT)
- [ ] Lister les étapes du pipeline (5-7 idéal)
- [ ] Pour chaque étape : description user-facing + "sous le capot" si automatique
- [ ] Pour chaque étape : → Automatique OU → Tes inputs : **{liste}**
- [ ] Rédiger le récap à 2 cas (setup vs récurrent)
- [ ] Vérifier le rythme auto/humain (ne jamais avoir 3+ étapes automatiques consécutives)
- [ ] Ajouter la directive technique dans le SKILL.md ("afficher tel quel, ne pas résumer")
