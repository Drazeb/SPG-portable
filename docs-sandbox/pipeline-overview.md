# Slide Presentation Generator — Guide du pipeline

```
  ███████╗██████╗  ██████╗
  ██╔════╝██╔══██╗██╔════╝      Slide
  ███████╗██████╔╝██║  ███╗     Presentation
  ╚════██║██╔═══╝ ██║   ██║     Generator
  ███████║██║     ╚██████╔╝
  ╚══════╝╚═╝      ╚═════╝
```

Bienvenue ! Je suis ton Directeur Artistique B2B. Ensemble, on va créer
une présentation de classe mondiale — du contenu au design, exportable en PPTX.

---

## Comment ça fonctionne

Le processus est guidé étape par étape — je te demanderai tes inputs au fur et à mesure.

**1. Apprentissage de l'identité visuelle** *(une seule fois par marque)*
Je lis les pages d'identité visuelle de la marque et le style guide, et j'en extrais
un "design language" : palette, typographies, principes de mise en page.
*Sous le capot : j'analyse d'abord les 3 pages HTML pour en extraire les tokens de design
(couleurs, typos, espacements). Puis je génère 24 slides d'exemple qui serviront de
modèles de référence pour toutes les présentations futures de cette marque.*
→ Tes inputs : fichiers Brand Identity placés dans `/brands/{marque}/identity/` (typiquement : style-tile.html, signes.html, narration.html, design-specs.md)

**2. Briefing**
Je te pose 5 questions pour comprendre ce que tu veux générer :
quel pack de brand identity, quelles infos prospect, quel framework de présentation, quel brief entreprise, et quel type de présentation.
→ Tes inputs :
  · **Pack de Brand Identity** — nom de la brand (doit avoir ses tokens déjà configurés)
  · **Infos prospect** — slug court pour nommer les fichiers (ex: mutualis, greentech)
  · **Framework de présentation** — structure narrative (great-demo, workflow-driven, ou meddic)
  · **Brief entreprise** — fichier .md ou texte décrivant le produit, le contexte business, la cible
  · **Type de présentation** — ex : commercial-b2b

**3. Rédaction du contenu des slides**
Je génère le contenu textuel de chaque slide : titres d'action, corps de texte,
données clés, notes de mise en scène visuelle — en suivant le framework choisi.
*Sous le capot : un agent spécialisé applique le framework sélectionné, les règles
d'excellence rédactionnelle B2B, et vérifie la conformité du contenu via 3 quality gates
(pré-génération, post-génération, excellence). Le contenu sort en format structuré slide par slide.*
→ Automatique

**4. Validation du contenu** *(point de contrôle)*
Je t'affiche le contenu slide par slide. Tu relis, tu valides ou tu demandes des corrections.
Rien n'avance tant que tu n'as pas dit OK.
→ Tes inputs : **Relecture** + feedback (OK ou corrections par slide)

**5. Création du design HTML**
Je transforme le contenu validé en vraies slides visuelles HTML/CSS, fidèles à l'identité
de la marque et compatibles export PPTX.
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

---

## Récap — ce qu'il faut préparer

Pour une **nouvelle marque** :
  · 3 fichiers HTML Brand Identity (pages d'identité visuelle)
  · 1 Style Guide au format Kit de Transfert (.md)
  · 1 brief commercial (.md ou texte)

Pour une **marque déjà configurée** :
  · 1 brief commercial (.md ou texte) — c'est tout

---

## Architecture sous le capot

Le pipeline orchestre 6 agents spécialisés en 9 phases (0→8) :

```
Phase 0 : Sub0-A (analyse visuelle) → Sub0-B×2 (design language) → Sub0-C (catalogue)
Phase 1 : Collecte inputs (orchestrateur)
Phase 2 : Sub1 (contenu) → 3 quality gates
Phase 3 : Validation humaine
Phase 4 : Sub3×N (design HTML par batches de 5) → script validation PPTX
Phase 5 : Validation humaine
Phase 6 : Sub4 (analyse layouts) → alternatives box-drawing
Phase 7 : Sélection humaine
Phase 8 : Sub5×N (régénération layouts) → assemblage final → export PPTX
```

Chaque agent retourne `STATUS: OK` ou `STATUS: BLOCKED` — l'orchestrateur gère les erreurs et relances.
