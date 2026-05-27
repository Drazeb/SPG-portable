# Slide Presentation Generator (SPG) — Instructions Claude Code

## Projet

Système Claude Code de génération de présentations B2B haute qualité (slides commerciales, decks pitch, mini-decks brand book). Produit du HTML/CSS slide-by-slide compatible PPTX (Google Slides / PowerPoint export via `dom-to-pptx`).

Deux skills principaux :
- **`/generate-slides`** — Pipeline complet (9 phases : 0→8) pour une présentation B2B complète depuis un brief, avec framework de structuration (PAS, MEDDIC, Great-Demo, Workflow-Driven) et design haute couture. Quality gates par phase via sub-agents.
- **`/generate-mini-deck`** — Génère 6 PNG archétypes (Cover, Case Study, Data Viz, Dashboard KPI, Process, Icon Grid) à partir d'un pack BIG (brand identity). Invoqué automatiquement par BIG Phase 8 (brand book), ou utilisable standalone.

## Structure du repo

```
SPG-portable/
├── README.md                 ← Onboarding et installation
├── LICENSE                   ← MIT
├── CONTRIBUTING.md           ← Comment signaler bug / proposer
├── CLAUDE.md                 ← Ce fichier (instructions pour Claude Code)
├── package.json              ← Dépendances Node (pptxgenjs, dom-to-pptx)
├── generate-v3-pptx.js       ← Script principal de génération PPTX
├── test-poc.js               ← Proof of concept / tests rapides
├── lib/                      ← Bibliothèque de référence (content/design checkers, schémas brand, etc.)
├── frameworks/               ← Frameworks de structuration (great-demo, meddic, workflow-driven)
├── docs-sandbox/             ← Documentation projet portée depuis le sandbox
├── docs/
│   └── internal/             ← Lore optionnel (DECISIONS, BUILD-LOG, PLAN-GENERAL)
├── scripts-spg/              ← Scripts utilitaires SPG (validate-pptx, etc.)
└── .claude/skills/
    ├── generate-slides/      ← Pipeline complet 9 phases
    └── generate-mini-deck/   ← Archétypes pour brand book BIG
```

## Patterns techniques critiques

À respecter dans toute modification du pipeline :

- **Tokens de marque** : extraction systématique d'un pack BIG via `lib/brand-token-extractor.md` + `lib/brand-schema.json` (50+ paramètres). Source de vérité immuable pendant la génération.
- **Sub-agents `general-purpose`** : chaque phase délègue à un sub-agent Task (Sub0-A pour content, Sub0-B pour design language, etc.) — isole le contexte et permet l'itération.
- **Content compliance** : avant toute génération de contenu, lire `lib/content-compliance-checker.md` (checklist obligatoire).
- **Design compliance** : avant toute génération HTML/CSS, lire `lib/design-compliance-checker.md` + 12 principes `docs-sandbox/DESIGN-PRINCIPLES-PERPLEXITY.md`.
- **Validation programmatique PPTX** : après génération HTML, lancer `node scripts-spg/validate-pptx.js <fichier.html>` pour vérifier les 39 règles. Corriger les erreurs détectées AVANT de montrer le résultat.
- **PPTX-friendly CSS** : règles bloquantes — JAMAIS `right` ou `bottom` (calculer `left` et `top`), width OBLIGATOIRE sur chaque texte (formule `chars × font × 0.6 × 1.2`). Voir `docs-sandbox/CSS-GUIDELINES.md`.
- **Variations** : 3 niveaux de créativité fixés (voir `lib/creativity-levels.md`), variations layout uniquement (mood/tonalité gérés par le design language).

## Conventions de code

- **Commit messages** : Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `perf:`, `test:`)
- **Langue** : prompts subagents en français, commentaires de code en français OK
- **Pas de nouvelles dépendances Node** sans discussion — le projet veut rester léger (`pptxgenjs` + `dom-to-pptx` uniquement aujourd'hui)

## Outils externes du pipeline

- **Node.js + npm** — pour `pptxgenjs` et `dom-to-pptx`. À installer via `npm install` après clone.
- **Aucun service externe payant requis** — SPG est un pipeline 100% local. Pas de MidJourney, Recraft, Perplexity, Nano Banana, OpenAI API, etc.
- **`dom-to-pptx` CDN** — chargé dans le HTML généré pour permettre l'export PPTX côté navigateur.

## Setup initial pour un nouveau user

```bash
git clone https://github.com/charlesbezard/SPG-portable.git ~/repos/SPG-portable
cd ~/repos/SPG-portable
npm install
```

Puis dans Claude Code (depuis ce dossier) :
- `/generate-slides` pour une présentation B2B complète
- `/generate-mini-deck` pour les archétypes brand book

Pour le démarrage rapide complet, voir [`README.md`](README.md).

## Lien avec BIG

SPG est conçu pour fonctionner **standalone** OU **en aval du Brand Identity Generator (BIG)**.

- **Standalone** : tu lances `/generate-slides` avec un brief minimal, le pipeline structure et design tout seul
- **Avec BIG** : `/generate-mini-deck` consomme directement le pack généré par BIG Phase 8 (brand book). BIG s'attend à trouver SPG cloné côte à côte : `~/repos/BIG-portable/` + `~/repos/SPG-portable/`. La Phase 8 de BIG check la présence de SPG via Phase 0 Preflight.
