# Brand Token Extractor

## Purpose

Transformer N'IMPORTE QUEL fichier style guide (format "Kit de Transfert Style Guide") en un fichier `tokens.json` structuré et conforme au schéma `brand-schema.json`.

---

## Processus d'Extraction

### Étape 1 : Identifier les Sections

Scanner le style guide pour les sections [01] à [10] :

| Section | Contenu | Tokens cibles |
|---------|---------|---------------|
| [01] FONDATIONS | Big Idea, Tone of Voice, Mots-clés | `voice.*` |
| [02] SYSTÈME COULEUR | Codes HEX, RGBA | `colors.*` |
| [03] TYPOGRAPHIE | Familles, tailles, espacements | `typography.*` |
| [04] CODE CIVIL ATOMIQUE | Arrondis, ombres, grille | `ui_physics.*` |
| [05] LOGOTYPE | Safe area, variantes | `logotype.*` |
| [06] ICONOGRAPHIE | Style, épaisseur, formes | `iconography.*` |
| [07] DATA VISUALIZATION | Courbes, grilles, couleurs | `data_visualization.*` |
| [08] DIRECTION PHOTO | Style, color grading | `photography.*` |
| [09] COMPOSITION & LAYOUT | Grille, espacements | `layout.*` |
| [10] SYSTÈME D'ILLUSTRATION | Métaphore, traits, nœuds | `illustration.*` |

---

### Étape 2 : Règles d'Extraction par Section

#### [02] COULEURS

**Chercher :**
- Codes HEX : `#XXXXXX`
- Valeurs RGBA : `rgba(X, X, X, X)`
- Mots-clés d'usage : "Primary", "Accent", "Neutral", "Background", "Border", "Text"

**Mapping :**

| Terme trouvé | Token cible |
|--------------|-------------|
| "Primary" / "Brand" / "Oxygen" | `colors.primary.main` |
| "80%" / "Survol" / "Hover" | `colors.primary.80` |
| "Accent" / "Flash" / "Secondary" | `colors.secondary.main` |
| "Tint" / "20%" / "Fond léger" | `colors.secondary.tint` |
| "White" / "Blanc" | `colors.neutrals.white` |
| "Fond" / "Background" / "Page" | `colors.neutrals.background_primary` |
| "Section" / "Alternatif" / "Mist" | `colors.neutrals.background_secondary` |
| "Border" / "Bordure" / "Fog" / "Divider" | `colors.neutrals.border` |
| "Titre" / "Carbon" / "Dark" | `colors.neutrals.text_primary` |
| "Secondaire" / "Légende" / "Slate" | `colors.neutrals.text_secondary` |
| "Success" / "Optimal" / "Emerald" | `colors.semantic.success` |
| "Warning" / "Alerte" / "Amber" | `colors.semantic.warning` |
| "Error" / "Erreur" / "Burnt" | `colors.semantic.error` |
| "Series A" / "Main" (graphique) | `colors.dataviz.series_a` |
| "Series B" / "Highlight" (graphique) | `colors.dataviz.series_b` |
| "Series C" / "Comparative" (graphique) | `colors.dataviz.series_c` |
| "Series D" / "Baseline" (graphique) | `colors.dataviz.series_d` |

---

#### [03] TYPOGRAPHIE

**Chercher :**
- Noms de polices : "Inter", "Inter Tight", "Roboto Mono", etc.
- Tailles : "64px", "48px", "32px"
- Espacements : "-0.02em", "+0.05em", "0.95", "1.6"
- Graisses : "400", "500", "600", "700", "Medium", "Bold"

**Mapping :**

| Terme trouvé | Token cible |
|--------------|-------------|
| "Display" / "Titres" / "H1-H2-H3" | `typography.display.family` |
| "Body" / "Corps" / "UI" | `typography.body.family` |
| "Data" / "Mono" / "Chiffres" | `typography.data.family` |
| "Tracking" / "Approche" / "Letter-spacing" négatif | `typography.display.tracking` |
| "Leading" / "Interlignage" serré | `typography.display.leading` |
| "Leading" / "Interlignage" aéré | `typography.body.leading` |
| "H1" / "Hero" / "64px+" | `typography.scale.h1` |
| "H2" / "Section" / "48px" | `typography.scale.h2` |
| "H3" / "Card" / "32px" | `typography.scale.h3` |
| "Overline" / "Uppercase" | `typography.overline.*` |

---

#### [04] CODE CIVIL ATOMIQUE (UI Physics)

**Chercher :**
- Arrondis : "6px", "12px", "16px", "24px", "sm", "xl", "2xl"
- Ombres : "box-shadow", "rgba", "blur"
- Glassmorphism : "backdrop", "blur", "transparence"
- Épaisseurs : "1px", "1.2px", "2px"
- Grille : "8px", "multiples de 8"

**Mapping :**

| Terme trouvé | Token cible |
|--------------|-------------|
| "sm" / "6px" / "Boutons" | `ui_physics.radius.sm` |
| "xl" / "12px" / "Cartes" | `ui_physics.radius.xl` |
| "2xl" / "16px" / "Conteneurs" | `ui_physics.radius.2xl` |
| "3xl" / "24px" / "Slides" | `ui_physics.radius.3xl` |
| "Shadow SM" / "légère" | `ui_physics.shadows.sm` |
| "Shadow Signature" / "Oxygen" / "colorée" | `ui_physics.shadows.signature` |
| "Glassmorphism" / "Blur" / "Backdrop" | `ui_physics.glassmorphism.*` |
| "Divider" / "1px" | `ui_physics.strokes.dividers` |
| "Icône" / "1.2px" | `ui_physics.strokes.icons` |
| "Active" / "2px" | `ui_physics.strokes.active_states` |
| "Unité de base" / "8px" / "Rythme" | `ui_physics.grid_unit` |

---

#### [06] ICONOGRAPHIE

**Chercher :**
- Style : "Outline", "Solid", "Duotone", "Filaire"
- Terminaisons : "Round", "Square", "Arrondies"
- Formes : "Open", "Closed", "Ouvertes"
- Épaisseur : "1.2px", "1.5px", "Ultra-Fine"

**Mapping direct vers `iconography.*`**

---

#### [07] DATA VISUALIZATION

**Chercher :**
- Courbes : "Bézier", "Smooth", "Lissées", "Linear"
- Remplissage : "Gradient", "Fill", "Opacité"
- Grilles : "Dotted", "Pointillées", "Solid"
- Ligne zéro : "Zero Line", "Solide"

**Mapping direct vers `data_visualization.*`**

---

#### [09] LAYOUT

**Chercher :**
- Colonnes : "12 colonnes", "Grid"
- Gouttière : "Gutter", "24px"
- Espacements : "8, 16, 32, 64, 128"
- Rythme : "128px", "Section Pad"

**Mapping direct vers `layout.*`**

---

#### [10] ILLUSTRATION

**Chercher :**
- Métaphore : "Bio-Mimicry", "Blueprint", "Organisme"
- Trait : "1px", "Slate-300", "Fog"
- Nœuds : "Cercles", "Pleins", "Oxygen", "Flash"
- Mouvement : "Pointillées", "Flux"
- Composition : "Centré", "Orbital", "Atome"

**Mapping direct vers `illustration.*`**

---

### Étape 3 : Validation de Complétude

Après extraction, vérifier que TOUS les tokens obligatoires sont remplis :

**Tokens CRITIQUES (bloquants si manquants) :**
- `colors.primary.main`
- `colors.neutrals.text_primary`
- `colors.neutrals.background_primary`
- `typography.display.family`
- `typography.body.family`
- `ui_physics.radius.xl`
- `ui_physics.grid_unit`
- `iconography.style`
- `iconography.stroke_width`

**Tokens IMPORTANTS (warning si manquants) :**
- Tous les autres tokens de couleur
- Tous les tokens de typographie
- `ui_physics.shadows.signature`
- `layout.section_rhythm`

**Tokens OPTIONNELS :**
- `photography.*`
- `voice.*`

---

### Étape 4 : Générer le tokens.json

**Format de sortie :**

```json
{
  "$extracted_from": "Kit de Transfert Style Guide (Master).md",
  "$extraction_date": "2026-02-02",
  "$schema_version": "brand-tokens-v1",

  "colors": {
    "primary": {
      "main": "#0F766E",
      "80": "rgba(15, 118, 110, 0.8)"
    },
    // ... tous les tokens extraits
  },
  // ... toutes les sections
}
```

**Règles de formatage :**
- HEX en majuscules ou minuscules (conserver le format source)
- RGBA avec espaces après les virgules
- Valeurs numériques sans guillemets quand applicable
- Arrays avec crochets `[]`

---

### Étape 5 : Rapport d'Extraction

Après génération, produire un rapport :

```
=== RAPPORT D'EXTRACTION ===
Source : Kit de Transfert Style Guide (Master).md
Date : 2026-02-02

TOKENS EXTRAITS : 52/55
TOKENS MANQUANTS : 3
  - photography.color_grading.tint (OPTIONNEL)
  - voice.forbidden_words (OPTIONNEL)
  - voice.preferred_words (OPTIONNEL)

STATUT : ✅ COMPLET (tous les tokens critiques présents)
```

---

## Exemple d'Extraction

**Input (extrait du style guide) :**
```
### [02] SYSTÈME COULEUR
* Brand Oxygen : #0F766E (Teal 700). Usage : Textes forts, Logos.
* Brand Flash : #2DD4BF (Teal 400). Usage : Points d'énergie.
* Carbon : #0F172A (Slate 900). Usage : Titres principaux.
```

**Output (tokens.json) :**
```json
{
  "colors": {
    "primary": {
      "main": "#0F766E"
    },
    "secondary": {
      "main": "#2DD4BF"
    },
    "neutrals": {
      "text_primary": "#0F172A"
    }
  }
}
```
