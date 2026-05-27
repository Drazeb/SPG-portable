# Slide Presentation Generator (SPG)

> Pipeline Claude Code de génération de présentations B2B haute qualité, exportables en PPTX.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

SPG est un système de skills Claude Code qui industrialise la création de présentations slides (commerciales B2B, decks pitch, mini-decks brand book). Génération automatique du contenu (frameworks PAS / MEDDIC / Great-Demo / Workflow-Driven) **ET** du design (haute couture créative, validation programmatique des 39 règles PPTX). Sortie HTML/CSS slide-by-slide compatible Google Slides / PowerPoint.

## Quick start

```bash
# 1. Clone le repo
git clone https://github.com/charlesbezard/SPG-portable.git ~/repos/SPG-portable

# 2. Installe les dépendances Node
cd ~/repos/SPG-portable
npm install

# 3. Ouvre Claude Code dans le dossier
claude

# 4. Invoque un des deux skills
/generate-slides         # Pipeline complet B2B (9 phases)
/generate-mini-deck      # Archétypes pour brand book (utilisé par BIG)
```

## Prerequisites

| Dépendance | Comment installer | Pourquoi |
|---|---|---|
| **macOS** | (déjà là) | Le système utilise `open` pour ouvrir les artefacts à valider |
| **[Claude Code](https://claude.ai/code)** | Via l'app Claude | Les skills tournent dedans |
| **Git** | `brew install git` | Pour cloner + recevoir les mises à jour |
| **Node.js ≥ 18** | `brew install node` | `pptxgenjs` et `dom-to-pptx` (export PPTX) |

**Pas de service externe payant requis.** SPG est un pipeline 100% local — pas de MidJourney, Recraft, Perplexity, ni API LLM externe. Juste Claude Code + Node.

## Skills disponibles

| Skill | Invocation | Rôle | Standalone ? |
|---|---|---|---|
| **generate-slides** | `/generate-slides` | Pipeline complet de génération d'une présentation B2B en 9 phases (0→8). Choix de framework (PAS, MEDDIC, Great-Demo, Workflow-Driven), extraction de tokens de marque, sub-agents par phase avec quality gates, validation programmatique des 39 règles PPTX, export HTML/CSS slide-by-slide. | ✅ Oui — fonctionne avec un brief minimal |
| **generate-mini-deck** | `/generate-mini-deck` | Génère 6 PNG archétypes de slides (Cover, Case Study, Data Viz, Dashboard KPI, Process, Icon Grid) à partir d'un pack BIG. Utilisé en Phase 8 de BIG pour la section "Pitch Deck" du brand book. | ⚠️ Nécessite un pack BIG en input |

## Architecture du pipeline `/generate-slides`

9 phases séquentielles, chacune avec un sub-agent dédié et un quality gate :

```
Phase 0  → Setup & brief intake
Phase 1  → Framework selection (PAS / MEDDIC / Great-Demo / Workflow-Driven)
Phase 2  → Content generation (selon le framework choisi)
Phase 3  → Content compliance check (vs lib/content-compliance-checker.md)
Phase 4  → Brand token extraction (vs brand-schema.json — 50+ paramètres)
Phase 5  → Design language generation (Sub0-A + Sub0-B)
Phase 6  → Slide-by-slide HTML/CSS generation (PPTX-compatible)
Phase 7  → Validation programmatique (39 règles via validate-pptx.js)
Phase 8  → Export final HTML + bouton "Exporter en PPTX" (dom-to-pptx CDN)
```

Détails dans les SKILL.md de chaque skill (lus automatiquement par Claude Code).

## Lien avec BIG (Brand Identity Generator)

SPG est conçu pour fonctionner **standalone** OU **en aval du Brand Identity Generator (BIG)**.

- En **mode standalone**, tu fournis un brief et SPG s'occupe de tout (structure + design)
- En **mode chaîné avec BIG**, SPG reçoit un pack BIG complet (design-specs, pitch, style-tile, batches) et génère des présentations qui héritent automatiquement de l'identité visuelle

BIG s'attend à trouver SPG cloné côte à côte. Convention de chemin :

```bash
~/repos/BIG-portable/      # cloné depuis github.com/charlesbezard/BIG-portable
~/repos/SPG-portable/      # ce repo
```

La Phase 8 de BIG (brand book) check automatiquement la présence de SPG-portable au démarrage via sa Phase 0 Preflight Check.

Si tu veux juste utiliser SPG sans BIG, ignore cette section — tu peux cloner SPG-portable n'importe où.

## Architecture interne

| Dossier | Rôle |
|---|---|
| `lib/` | Bibliothèque de référence : content compliance checker, brand schema, creativity levels, variation system, PPTX techniques, design principles |
| `frameworks/` | Frameworks de structuration (great-demo, meddic, workflow-driven) — un `spec.md` + un `reference.md` par framework |
| `docs-sandbox/` | Documentation projet : CSS guidelines, principes de design, onboarding template, workflow |
| `scripts-spg/` | Scripts utilitaires (validate-pptx.js : valide les 39 règles PPTX-compat sur un HTML) |
| `.claude/skills/` | Les 2 skills Claude Code (generate-slides, generate-mini-deck) |
| `docs/internal/` | Lore optionnel exposé pour transparence (DECISIONS, BUILD-LOG, PLAN-GENERAL) |

## Mises à jour

Le projet évolue. Pour rester à jour :

1. **GitHub Watch** — Clique sur "Watch" en haut du repo GitHub → tu reçois un email à chaque push significatif
2. **GitHub Releases** — Les versions majeures sont taggées comme releases avec un changelog narratif

Pour mettre à jour manuellement :

```bash
cd ~/repos/SPG-portable
git pull
npm install   # si package.json a changé
```

## Contributing

Voir [`CONTRIBUTING.md`](CONTRIBUTING.md). Le projet est principalement maintenu par [Charles Bezard](https://github.com/charlesbezard). Pour signaler un bug ou proposer une amélioration, ouvre une [issue GitHub](../../issues) d'abord.

## License

[MIT](LICENSE) — utilisez, modifiez, distribuez librement, en gardant le copyright.
