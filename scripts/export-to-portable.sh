#!/usr/bin/env bash
#
# export-to-portable.sh — Sync filtré du sandbox SPG vers ce repo portable.
#
# Stratégie : LISTE BLANCHE par dossier (plus robuste qu'une liste noire — un
# nouveau parasite futur dans le sandbox ne contamine pas le portable tant qu'il
# n'est pas dans un dossier whitelisté).
#
# Usage :
#   ./scripts/export-to-portable.sh             # dry-run par défaut (sûr)
#   ./scripts/export-to-portable.sh --apply     # exécute le sync pour de vrai
#   ./scripts/export-to-portable.sh --apply --verbose
#
# Après un --apply, faire :
#   git diff           # vérifier visuellement
#   git add -A && git commit -m "..."
#   git push

set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

SANDBOX="/Users/charlesbezard/Library/CloudStorage/GoogleDrive-charles.bezard@gmail.com/Mon Drive/Claude Code/Slide Presentation Generator"
PORTABLE="$HOME/repos/SPG-portable"

# Skills à inclure (liste blanche dure)
SKILLS_TO_PORT=(
  "generate-slides"
  "generate-mini-deck"
)

# Anonymisation des marques clientes utilisées comme cas d'étude.
#
# Convention : tout client dont le nom apparaît dans des REX, exemples ou
# templates du sandbox DOIT être anonymisé au portage. Le sandbox garde les
# vrais noms (utile en interne, historique des tests). Le portable les
# remplace systématiquement par un pseudo.
#
# Format : "vrai_nom:pseudo" — appliqué case-sensitive sur les variations
# courantes (Titre Case, lowercase, UPPERCASE) automatiquement.
#
# Note : pseudonymes synchronisés avec BIG-portable (Atelier Vermeil, Camille,
# VoltaPilot) + nouveaux pseudos pour les clients spécifiques au sandbox SPG.
CLIENT_ANONYMIZATIONS=(
  "Les Alchimistes:Atelier Vermeil"
  "Alchimistes:Vermeil"
  "Jacques:Camille"
  "ChargePilot:VoltaPilot"
  "Chargepilot:Voltapilot"
  "Brevo:Posta"
  "EarthCraft:GeoForge"
  "Earthcraft:Geoforge"
  "Primaverde:Vertillo"
  "EcosymbiosE:Mutualis"
  "Ecosymbiose:Mutualis"
)

# Fichiers racine à porter (depuis le sandbox vers le portable)
ROOT_FILES_TO_PORT=(
  "CHANGELOG.md:docs/internal/BUILD-LOG.md"
  "DECISIONS.md:docs/internal/DECISIONS.md"
  "PLAN-GENERAL.md:docs/internal/PLAN-GENERAL.md"
  "package.json:package.json"
  "generate-v3-pptx.js:generate-v3-pptx.js"
  "test-poc.js:test-poc.js"
)
# Note : CLAUDE.md racine du sandbox N'EST PAS porté automatiquement — il est
# maintenu manuellement dans le portable (références persos à Charles à retirer).

# Dossiers racine à porter en mode rsync récursif filtré
# Format : "src:dst" — si dst absent, garde le même nom que src
ROOT_DIRS_TO_PORT=(
  "lib"
  "frameworks"
  "docs:docs-sandbox"
  "scripts:scripts-spg"
)
# Note : "scripts" du sandbox renommé en "scripts-spg" dans le portable pour
# ne pas écraser scripts/export-to-portable.sh. "docs" du sandbox renommé en
# "docs-sandbox" pour la même raison (le portable a son propre docs/ avec
# internal/ etc.).

# Overrides "version publique" — vide pour SPG (pas de mécanisme pour l'instant)
PUBLIC_OVERRIDES=()

# Pas d'exclusions supplémentaires pour les overrides (vide vu que pas d'overrides)
RSYNC_EXTRA_EXCLUDES_FROM_OVERRIDES=()

# Exclusions dans tout dossier copié (parasites, sensibles, etc.)
RSYNC_EXCLUDES=(
  # macOS
  ".DS_Store"

  # Sessions outputs (jamais portées)
  "outputs/"

  # Briefs clients confidentiels (CRITIQUE — ne jamais exposer)
  "briefs/"

  # Dossiers de contenu client (SPG sandbox spécifique — outputs réels de
  # tests sur clients, jamais à exposer publiquement)
  "brands/"
  "test-kits/"
  "Fichiers pour simulation/"
  "Proposition approche/"

  # Backups internes du sandbox
  "*.bak"
  "*.bak-pre-*"
  "*.backup"

  # Fichiers temporaires
  ".tmp-*"
  "*.tmp"
  "*.swp"

  # Python
  "__pycache__/"
  "*.pyc"
  ".pytest_cache/"

  # Node
  "node_modules/"

  # Secrets
  ".env"
  ".env.*"
  "*.pem"
  "credentials.json"

  # Logs
  "*.log"
  ".progress-*.log"
)

# Couleurs terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# ─────────────────────────────────────────────────────────────────────────────
# PARSING DES ARGUMENTS
# ─────────────────────────────────────────────────────────────────────────────

APPLY=0
VERBOSE=0
for arg in "$@"; do
  case "$arg" in
    --apply) APPLY=1 ;;
    --verbose) VERBOSE=1 ;;
    -h|--help)
      grep -E '^# ' "$0" | head -20
      exit 0
      ;;
    *)
      echo "Argument inconnu : $arg"
      exit 1
      ;;
  esac
done

# ─────────────────────────────────────────────────────────────────────────────
# CHECKS PRÉALABLES
# ─────────────────────────────────────────────────────────────────────────────

if [ ! -d "$SANDBOX" ]; then
  echo -e "${RED}❌ Sandbox introuvable :${NC} $SANDBOX"
  exit 1
fi

if [ ! -d "$PORTABLE" ]; then
  echo -e "${RED}❌ Portable introuvable :${NC} $PORTABLE"
  exit 1
fi

if [ ! -d "$PORTABLE/.git" ]; then
  echo -e "${RED}❌ Le portable n'est pas un repo git${NC}"
  exit 1
fi

# ─────────────────────────────────────────────────────────────────────────────
# CONSTRUCTION DES OPTIONS RSYNC
# ─────────────────────────────────────────────────────────────────────────────

RSYNC_OPTS=(
  --archive          # préserve permissions/timestamps
  --delete           # supprime du portable ce qui n'est plus dans le sandbox
  --human-readable
)

if [ "$APPLY" -eq 0 ]; then
  RSYNC_OPTS+=(--dry-run)
fi

if [ "$VERBOSE" -eq 1 ]; then
  RSYNC_OPTS+=(--verbose)
else
  RSYNC_OPTS+=(--itemize-changes)
fi

for exclude in "${RSYNC_EXCLUDES[@]}"; do
  RSYNC_OPTS+=(--exclude="$exclude")
done

# Exclusions supplémentaires liées aux overrides "version publique"
# (on évite que rsync copie la version interne par-dessus la version publique
# qu'on injectera ensuite via la boucle PUBLIC_OVERRIDES)
if [ ${#RSYNC_EXTRA_EXCLUDES_FROM_OVERRIDES[@]} -gt 0 ]; then
  for exclude in "${RSYNC_EXTRA_EXCLUDES_FROM_OVERRIDES[@]}"; do
    RSYNC_OPTS+=(--exclude="$exclude")
  done
fi

# ─────────────────────────────────────────────────────────────────────────────
# BANNER
# ─────────────────────────────────────────────────────────────────────────────

echo
echo -e "${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║  SPG sandbox → portable repo                                 ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
echo
echo -e "  Sandbox  : ${BLUE}$SANDBOX${NC}"
echo -e "  Portable : ${BLUE}$PORTABLE${NC}"
echo

if [ "$APPLY" -eq 0 ]; then
  echo -e "${YELLOW}  ⚠ Mode DRY-RUN (aucun fichier modifié)${NC}"
  echo -e "${YELLOW}    Pour exécuter pour de vrai : ./scripts/export-to-portable.sh --apply${NC}"
else
  echo -e "${GREEN}  ✓ Mode APPLY (les fichiers vont être copiés)${NC}"
fi
echo

# ─────────────────────────────────────────────────────────────────────────────
# SYNC DES SKILLS
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BOLD}── Sync des skills ──${NC}"
for skill in "${SKILLS_TO_PORT[@]}"; do
  SRC="$SANDBOX/.claude/skills/$skill/"
  DST="$PORTABLE/.claude/skills/$skill/"

  if [ ! -d "$SRC" ]; then
    echo -e "  ${YELLOW}⚠ $skill — absent du sandbox, skip${NC}"
    continue
  fi

  echo -e "  ${BLUE}→${NC} $skill"
  mkdir -p "$DST"
  rsync "${RSYNC_OPTS[@]}" "$SRC" "$DST" | sed 's/^/      /'
done
echo

# ─────────────────────────────────────────────────────────────────────────────
# SYNC DES DOSSIERS RACINE (lib/, frameworks/, docs/, etc.)
# ─────────────────────────────────────────────────────────────────────────────
# Spécifique SPG : porte les dossiers de code/refs/docs du sandbox vers le
# portable, avec renommage optionnel (ex: scripts/ → scripts-spg/ pour ne pas
# écraser le scripts/ du portable contenant export-to-portable.sh).

echo -e "${BOLD}── Sync des dossiers racine ──${NC}"
if [ ${#ROOT_DIRS_TO_PORT[@]} -eq 0 ]; then
  echo -e "  ${YELLOW}(aucun dossier racine configuré)${NC}"
fi
for mapping in "${ROOT_DIRS_TO_PORT[@]}"; do
  SRC_NAME="${mapping%%:*}"
  if [[ "$mapping" == *":"* ]]; then
    DST_NAME="${mapping##*:}"
  else
    DST_NAME="$SRC_NAME"
  fi
  SRC="$SANDBOX/$SRC_NAME/"
  DST="$PORTABLE/$DST_NAME/"

  if [ ! -d "$SRC" ]; then
    echo -e "  ${YELLOW}⚠ $SRC_NAME/ — absent du sandbox, skip${NC}"
    continue
  fi

  if [ "$SRC_NAME" != "$DST_NAME" ]; then
    echo -e "  ${BLUE}→${NC} $SRC_NAME/ ${NC}→${NC} $DST_NAME/"
  else
    echo -e "  ${BLUE}→${NC} $SRC_NAME/"
  fi
  mkdir -p "$DST"
  rsync "${RSYNC_OPTS[@]}" "$SRC" "$DST" | sed 's/^/      /'
done
echo

# ─────────────────────────────────────────────────────────────────────────────
# OVERRIDES VERSION PUBLIQUE
# ─────────────────────────────────────────────────────────────────────────────
# Pour chaque entrée de PUBLIC_OVERRIDES, on copie la version publique
# (`*-public.md` dans le sandbox) vers son emplacement final dans le portable
# (sans le suffixe). La version interne du sandbox a été exclue du rsync brut
# via RSYNC_EXTRA_EXCLUDES_FROM_OVERRIDES.
#
# Si la version publique n'existe pas encore dans le sandbox (Charles ne l'a
# pas encore rédigée), on warn et on skip — la destination dans le portable
# restera dans son état précédent (ou inexistante au premier sync).

echo -e "${BOLD}── Overrides version publique ──${NC}"
if [ ${#PUBLIC_OVERRIDES[@]} -eq 0 ]; then
  echo -e "  ${YELLOW}(aucun override configuré)${NC}"
fi
for mapping in "${PUBLIC_OVERRIDES[@]:-}"; do
  [ -z "$mapping" ] && continue
  SRC_REL="${mapping%%:*}"
  DST_REL="${mapping##*:}"
  SRC="$SANDBOX/$SRC_REL"
  DST="$PORTABLE/$DST_REL"

  if [ ! -f "$SRC" ]; then
    echo -e "  ${YELLOW}⚠ $SRC_REL — version publique absente du sandbox${NC}"
    echo -e "    ${YELLOW}(la destination $DST_REL ne sera pas mise à jour)${NC}"
    continue
  fi

  echo -e "  ${BLUE}→${NC} $SRC_REL ${NC}→${NC} $DST_REL"
  mkdir -p "$(dirname "$DST")"

  if [ "$APPLY" -eq 1 ]; then
    cp "$SRC" "$DST"
  else
    if [ ! -f "$DST" ] || ! cmp -s "$SRC" "$DST"; then
      echo -e "      ${YELLOW}(would copy)${NC}"
    else
      echo -e "      (identique, no-op)"
    fi
  fi
done
echo

# ─────────────────────────────────────────────────────────────────────────────
# SYNC DES FICHIERS RACINE
# ─────────────────────────────────────────────────────────────────────────────

echo -e "${BOLD}── Sync des fichiers racine ──${NC}"
for mapping in "${ROOT_FILES_TO_PORT[@]}"; do
  SRC_REL="${mapping%%:*}"
  DST_REL="${mapping##*:}"
  SRC="$SANDBOX/$SRC_REL"
  DST="$PORTABLE/$DST_REL"

  if [ ! -f "$SRC" ]; then
    echo -e "  ${YELLOW}⚠ $SRC_REL — absent du sandbox, skip${NC}"
    continue
  fi

  echo -e "  ${BLUE}→${NC} $SRC_REL ${NC}→${NC} $DST_REL"
  mkdir -p "$(dirname "$DST")"

  if [ "$APPLY" -eq 1 ]; then
    cp "$SRC" "$DST"
  else
    if [ ! -f "$DST" ] || ! cmp -s "$SRC" "$DST"; then
      echo -e "      ${YELLOW}(would copy)${NC}"
    else
      echo -e "      (identique, no-op)"
    fi
  fi
done
echo

# ─────────────────────────────────────────────────────────────────────────────
# ANONYMISATION DES MARQUES CLIENTES
# ─────────────────────────────────────────────────────────────────────────────
# Convention : tout fichier porté qui mentionne un nom de marque cliente
# utilisée comme cas d'étude DOIT être anonymisé. Voir CLIENT_ANONYMIZATIONS
# en tête de script. On applique 3 variantes de casse pour chaque mapping
# (Title Case, lowercase, UPPERCASE) afin de couvrir : noms propres, slugs,
# titres CSS-friendly, etc.
#
# Auto-exclusion : le script s'exclut lui-même (il contient les patterns).

if [ "$APPLY" -eq 1 ]; then
  echo -e "${BOLD}── Anonymisation des marques clientes ──${NC}"

  # Construction de la liste des fichiers texte à traiter (exclut binaires
  # et le script lui-même)
  TARGET_FILES=$(find "$PORTABLE" \
    -type f \
    \( -name "*.md" -o -name "*.html" -o -name "*.py" -o -name "*.mjs" \
       -o -name "*.js" -o -name "*.css" -o -name "*.sh" -o -name "*.json" \
       -o -name "*.txt" -o -name "*.yml" -o -name "*.yaml" \) \
    -not -path "$PORTABLE/.git/*" \
    -not -path "$PORTABLE/scripts/export-to-portable.sh" \
    2>/dev/null)

  TOTAL_REPLACEMENTS=0

  for mapping in "${CLIENT_ANONYMIZATIONS[@]}"; do
    REAL="${mapping%%:*}"
    FAKE="${mapping##*:}"

    # Variantes de casse (Title Case, lowercase, UPPERCASE)
    REAL_LOWER=$(echo "$REAL" | tr '[:upper:]' '[:lower:]')
    REAL_UPPER=$(echo "$REAL" | tr '[:lower:]' '[:upper:]')
    FAKE_LOWER=$(echo "$FAKE" | tr '[:upper:]' '[:lower:]')
    FAKE_UPPER=$(echo "$FAKE" | tr '[:lower:]' '[:upper:]')

    echo -e "  ${BLUE}→${NC} $REAL → $FAKE (+ variantes lower/UPPER)"

    COUNT=0
    while IFS= read -r file; do
      [ -z "$file" ] && continue
      # 3 passes par fichier (Title, lower, UPPER) — perl -pi pour cross-platform
      MATCHES=$(perl -pi -e "
        BEGIN { \$c=0; }
        \$c += s/\Q$REAL\E/$FAKE/g;
        \$c += s/\Q$REAL_LOWER\E/$FAKE_LOWER/g;
        \$c += s/\Q$REAL_UPPER\E/$FAKE_UPPER/g;
        END { print STDERR \$c if \$c > 0; }
      " "$file" 2>&1 1>/dev/null || true)
      if [ -n "$MATCHES" ]; then
        COUNT=$((COUNT + MATCHES))
      fi
    done <<< "$TARGET_FILES"

    if [ "$COUNT" -gt 0 ]; then
      echo -e "      ${GREEN}✓${NC} $COUNT remplacements"
      TOTAL_REPLACEMENTS=$((TOTAL_REPLACEMENTS + COUNT))
    else
      echo -e "      (aucune occurrence)"
    fi
  done

  echo -e "  ${BOLD}Total : $TOTAL_REPLACEMENTS remplacements${NC}"
  echo
fi

# ─────────────────────────────────────────────────────────────────────────────
# CHECKS POST-SYNC (uniquement en mode apply)
# ─────────────────────────────────────────────────────────────────────────────

if [ "$APPLY" -eq 1 ]; then
  echo -e "${BOLD}── Vérifications post-sync ──${NC}"

  # 1. Aucun nom client réel n'a fui (dynamique : construit depuis
  # CLIENT_ANONYMIZATIONS pour rester synchronisé automatiquement)
  echo -ne "  Aucun nom client réel exposé... "
  # On exclut docs/internal/ (lore assumé) ET le script lui-même (faux positif :
  # il contient les patterns de détection)
  LEAK_PATTERN=""
  for mapping in "${CLIENT_ANONYMIZATIONS[@]}"; do
    REAL="${mapping%%:*}"
    if [ -z "$LEAK_PATTERN" ]; then
      LEAK_PATTERN="$REAL"
    else
      LEAK_PATTERN="$LEAK_PATTERN\\|$REAL"
    fi
  done
  LEAKS=$(grep -rl "$LEAK_PATTERN" "$PORTABLE" 2>/dev/null \
    | grep -v "/docs/internal/" \
    | grep -v "/scripts/export-to-portable.sh" \
    | grep -v "/\.git/" \
    || true)
  if [ -z "$LEAKS" ]; then
    echo -e "${GREEN}✓${NC}"
  else
    echo -e "${RED}✗${NC}"
    echo -e "  ${RED}Fichiers compromettants détectés :${NC}"
    echo "$LEAKS" | sed 's/^/    /'
  fi

  # 2. Aucun .bak parasite
  echo -ne "  Aucun fichier *.bak-pre-*... "
  BAKS=$(find "$PORTABLE" -name "*.bak-pre-*" 2>/dev/null || true)
  if [ -z "$BAKS" ]; then
    echo -e "${GREEN}✓${NC}"
  else
    echo -e "${RED}✗${NC}"
    echo "$BAKS" | sed 's/^/    /'
  fi

  # 3. Taille raisonnable
  echo -ne "  Taille du repo... "
  SIZE=$(du -sh "$PORTABLE" | cut -f1)
  echo -e "${BLUE}$SIZE${NC}"

  echo
  echo -e "${BOLD}── Prochaines étapes ──${NC}"
  echo -e "  ${BLUE}cd $PORTABLE${NC}"
  echo -e "  ${BLUE}git status${NC}             # voir les changements"
  echo -e "  ${BLUE}git diff${NC}               # détail des modifs"
  echo -e "  ${BLUE}git add -A${NC}             # stager"
  echo -e "  ${BLUE}git commit -m \"...\"${NC}    # committer"
  echo -e "  ${BLUE}git push${NC}               # publier sur GitHub"
  echo
fi
