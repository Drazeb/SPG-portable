# Content Compliance Report — Template Complet

Ce fichier contient le template détaillé du rapport de conformité contenu.
Référencé par `/lib/content-compliance-checker.md` (Partie C).

---

```
═══════════════════════════════════════════════════════
         CONTENT COMPLIANCE REPORT
═══════════════════════════════════════════════════════

FRAMEWORK : [nom du framework]
TYPE : [type de présentation]
SPEC FILE : /frameworks/{framework}/spec.md
EXCELLENCE FILE : /lib/presentation-excellence.md
TYPE FILE : /lib/presentation-types/{type}.md
PROSPECT : [company_name]
DATE : [date]

───────────────────────────────────────────────────────
PARTIE A : PRÉ-GÉNÉRATION (Inputs + Excellence)
───────────────────────────────────────────────────────
Fichiers d'excellence chargés :
✅ /lib/presentation-excellence.md
✅ /lib/presentation-types/{type}.md

Inputs obligatoires : X/Y remplis

Inputs présents :
✅ company_name : [valeur]
✅ industry : [valeur]
✅ problems : [nombre] problèmes avec impact
✅ critical_date : [date] — [reason]
...

Inputs manquants :
❌ [input] — Question posée : "[question]"
...

Score Readiness : XX%
Statut : ✅ GO / ❌ STOP

───────────────────────────────────────────────────────
PARTIE B : POST-GÉNÉRATION (Structure)
───────────────────────────────────────────────────────

B.1-B.2 Règles framework (spec.md) : X/Y
✅ [règle 1]
✅ [règle 2]
⚠️ [règle 3] — Violation : [détail]
...

B.3.2 Contrôle Cohérence Format : X/Y slides (BLOQUANT)
| Slide # | Éléments présents | Autorisés ? | Interdits | Statut |
|---------|-------------------|-------------|-----------|--------|
| 1 | Titre, 4 bullets | ✅ | Aucun | ✅ |
| 2 | ... | ... | ... | ... |
...
Score B.3.2 : XX% — DOIT ÊTRE 100% POUR CONTINUER

B.3.3 Format Visuel (4 champs) : X/Y slides
✅ Toutes les slides ont "Visuel" avec 4 champs
...

Score Conformité Structure : XX%
Statut : ✅ CONFORME / ⚠️ WARNING / ❌ RÉVISION

───────────────────────────────────────────────────────
PARTIE D : EXCELLENCE RÉDACTIONNELLE (NOUVEAU)
───────────────────────────────────────────────────────

D.1 Action Titles : X/Y slides (XX%)
[Tableau D.1 si violations]

D.2 Densité : X/Y slides (XX%)
[Tableau D.2 si violations]

D.3 Spécificité : X termes vagues détectés
[Liste si violations]

D.4 Structure Parallèle : X/Y slides (XX%)
[Tableau D.4 si violations]

D.5 Glance Test : X/Y slides (XX%)
[Tableau D.5 si violations]

Score Excellence : XX%
Statut : ✅ EXCELLENCE / ⚠️ WARNING / ❌ RÉVISION

───────────────────────────────────────────────────────
SCORE GLOBAL
───────────────────────────────────────────────────────

Score Readiness (A) : XX%
Score Structure (B) : XX%
Score Excellence (D) : XX%

SCORE GLOBAL : XX% (moyenne pondérée)

Statut final : ✅ PRÊT POUR DESIGN / ⚠️ WARNINGS / ❌ RÉVISION REQUISE

───────────────────────────────────────────────────────
ACTIONS REQUISES
───────────────────────────────────────────────────────
[Si score < 100%, lister les corrections à apporter]

1. [Action 1]
2. [Action 2]
...

═══════════════════════════════════════════════════════
```
