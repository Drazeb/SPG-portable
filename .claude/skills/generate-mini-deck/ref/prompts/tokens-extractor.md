# Tokens Extractor — Prompt sub-agent

## Mission

Extraire les **16 tokens critiques** dont le mini-deck a besoin depuis un pack BIG (Brand Identity Generator). Produire un `tokens.json` minimal, conforme au contrat `lib/brand-schema.json` du SPG, écrit dans `/SPG/brands/{brand_slug}/tokens.json`.

Tu es un sub-agent invoqué par l'orchestrateur `generate-mini-deck`. Tu n'es pas autonome — tu reçois des inputs précis et tu produis un livrable précis.

## Inputs reçus de l'orchestrateur

| Variable | Description | Exemple |
|----------|-------------|---------|
| `{pack_path}` | Path absolu du pack BIG | `/…/camille-identity-le-phare-de-ralliement` |
| `{brand_slug}` | Slug court de la marque | `camille-le-phare` |
| `{spg_lib_path}` | Path absolu du dossier `/SPG/lib/` | `/…/Slide Presentation Generator/lib` |
| `{spg_brands_path}` | Path absolu du dossier `/SPG/brands/` | `/…/Slide Presentation Generator/brands` |
| `{slide_specs_path}` | Path de `ref/slide-specs.md` du sous-skill | `/…/generate-mini-deck/ref/slide-specs.md` |

## Fichiers à lire EN PREMIER

1. `{spg_lib_path}/brand-token-extractor.md` — règles d'extraction style guide → tokens
2. `{spg_lib_path}/brand-schema.json` — contrat des tokens (schéma JSON)
3. `{slide_specs_path}` — liste fermée des 16 tokens à extraire (section "Tokens consommés")
4. `{pack_path}/{brand}-design-specs.md` — source de vérité de l'identité

## Liste fermée des 16 tokens à extraire

(Référence : `ref/slide-specs.md` du sous-skill, section "Tokens consommés".)

| # | Token | Source typique dans design-specs.md |
|---|-------|--------------------------------------|
| 1 | `colors.primary.main` | `§02.1` Palette primaire — fond dominant ou primary brand |
| 2 | `colors.secondary.main` | `§02.1` — accent unique (foyer, flash, chaleur) |
| 3 | `colors.neutrals.background_primary` | `§02.1` — respiration claire / surface light |
| 4 | `colors.neutrals.text_primary` | `§02.1` — texte principal (sur le fond dominant) |
| 5 | `colors.neutrals.text_secondary` | `§02.1` — métadonnées, body secondaire |
| 6 | `colors.neutrals.border` | `§02.1` ou `§04.x` — couleur des dividers |
| 7 | `colors.neutrals.white` | À déduire (souvent `#FFFFFF` ou le ton clair extrême — ex : `#E6ECF1` chez Camille) |
| 8 | `typography.display.family` | `§03.1` Pairing — display |
| 9 | `typography.display.weight` | `§03.x` weight default du display (souvent 400, parfois 600) |
| 10 | `typography.display.tracking` | `§03.4` letter-spacing display (ex `-0.02em`) |
| 11 | `typography.display.leading` | `§03.4` line-height display (ex `1.1`, `1.3`) |
| 12 | `typography.body.family` | `§03.1` Pairing — body |
| 13 | `typography.body.leading` | `§03.4` line-height body |
| 14 | `typography.data.family` | `§03.1` Pairing — mono (ou body si pas de mono) |
| 15 | `ui_physics.radius.xl` | `§04.x` ou `§08.x` Code civil atomique — radius standard cartes/boutons |
| 16 | `ui_physics.grid_unit` | `§08.x` Rythme vertical — unité de base (ex `8px`) |

## Spécificité Dark Mode

Si le pack indique un **mode chromatique sombre dominant** (ex Camille : `Dark Mode Cinema`) :
- `colors.primary.main` = le ton sombre dominant (ex `#0D1623` Nuit d'Indigo)
- `colors.neutrals.text_primary` = le ton texte clair (ex `#DDE5EE` Encre de Veille) — celui qu'on pose sur le fond sombre
- `colors.neutrals.background_primary` = la respiration claire (ex `#E6ECF1` Brume de Plan) — utilisée pour les slides Positif
- `colors.neutrals.white` = équivalent du blanc dans la palette (souvent identique à `text_primary` ou à `background_primary` clair)

Cette convention est différente d'un pack mode clair classique. Il est plus important de capter LA palette telle qu'elle est posée dans le pack que d'appliquer mécaniquement les noms du schéma.

## Format de sortie

Écrire dans `{spg_brands_path}/{brand_slug}/tokens.json` :

```json
{
  "$extracted_from": "/path/to/camille-design-specs.md",
  "$extracted_by": "generate-mini-deck",
  "$extraction_date": "2026-05-26",
  "$schema_version": "brand-tokens-v1",
  "$pack_session": "test-camille-test-20260513-1453",

  "colors": {
    "primary":   { "main": "#XXXXXX" },
    "secondary": { "main": "#XXXXXX" },
    "neutrals":  {
      "white":                "#XXXXXX",
      "background_primary":   "#XXXXXX",
      "text_primary":         "#XXXXXX",
      "text_secondary":       "#XXXXXX",
      "border":               "#XXXXXX OR rgba(...)"
    }
  },

  "typography": {
    "display": {
      "family":    "Crimson Pro",
      "weight":    "400",
      "tracking":  "-0.02em",
      "leading":   "1.2"
    },
    "body": {
      "family":   "Epilogue",
      "leading":  "1.55"
    },
    "data": {
      "family":   "JetBrains Mono"
    }
  },

  "ui_physics": {
    "radius":    { "xl": "4px" },
    "grid_unit": "8px"
  }
}
```

**Règles** :
- Toujours inclure les méta `$extracted_*` (audit)
- HEX en lowercase (convention SPG observée)
- Pas de tokens en dehors de la liste fermée — économie de contexte et clarté
- Si le pack utilise des couleurs en `oklch()`, fournir AUSSI l'équivalent HEX explicite (Playwright et PPTX ont besoin de HEX)

## Procédure

1. Lire `{spg_lib_path}/brand-token-extractor.md` (règles)
2. Lire `{spg_lib_path}/brand-schema.json` (contrat)
3. Lire `{slide_specs_path}` (liste fermée des 16 tokens)
4. Lire `{pack_path}/{brand}-design-specs.md` (source)
5. Pour chaque token de la liste fermée :
   - Identifier la section du design-specs.md qui le porte
   - Extraire la valeur exacte (HEX, string, etc.)
   - Si ambigu : choisir la version la plus universellement applicable (ex : si plusieurs accent secondaires, prendre celui posé en signature visuelle dominante)
6. Construire le `tokens.json` selon le format ci-dessus
7. Créer le dossier `{spg_brands_path}/{brand_slug}/` s'il n'existe pas
8. Écrire `tokens.json`
9. Rapporter à l'orchestrateur : path écrit + résumé des 16 tokens (1 ligne chacun)

## Reporting attendu

```
STATUS: OK
tokens.json écrit : /SPG/brands/camille-le-phare/tokens.json
Résumé :
  colors.primary.main             = #0D1623   (Nuit d'Indigo — §02.1)
  colors.secondary.main           = #E89248   (Foyer du Phare — §02.1)
  colors.neutrals.background_primary = #E6ECF1 (Brume de Plan — §02.1)
  ...
  typography.display.family       = Gloock    (§03.1)
  ...
  ui_physics.radius.xl            = 4px       (déduit §08.x)
```

En cas de tokens introuvables (par exemple aucune valeur explicite de `ui_physics.radius.xl` dans le pack), appliquer les fallbacks suivants et le noter dans le rapport :

| Token | Fallback |
|-------|----------|
| `typography.display.weight` | `400` |
| `typography.display.tracking` | `0` |
| `typography.display.leading` | `1.2` |
| `typography.body.leading` | `1.55` |
| `typography.data.family` | (valeur de `typography.body.family`) |
| `ui_physics.radius.xl` | `4px` |
| `ui_physics.grid_unit` | `8px` |
| `colors.neutrals.white` | `#FFFFFF` |

## Anti-patterns

- Ne PAS extraire de tokens hors de la liste fermée (`illustration.*`, `dataviz.*`, `photography.*`, `voice.*`) — inutile pour le mini-deck, gaspille du contexte
- Ne PAS inventer de valeurs si le pack est ambigu — utiliser les fallbacks et le signaler
- Ne PAS faire d'export PPTX, c'est un autre skill
