# Great Demo! — Spec Opérationnelle

Version condensée pour le SPG. Référence complète : `reference.md`

---

## 1. Inputs Requis

### Obligatoires (génération impossible sans)

| Input | Type | Description |
|-------|------|-------------|
| `company_name` | string | Nom de l'entreprise prospect |
| `industry` | string | Secteur d'activité |
| `job_title` | string | Titre du contact principal |
| `company_size` | object | `{employees, arr, team_size}` |
| `critical_business_issue` | string | Objectif business à risque (mesurable + temporel) |
| `problems` | array | 2-4 problèmes avec impact quantifié |
| `specific_capabilities` | array | 3-5 capacités recherchées (mappées aux problèmes) |
| `delta` | string | Valeur quantifiée du changement (avec chiffres prospect) |
| `critical_date` | object | `{date, reason}` — deadline + raison de l'urgence |
| `product_name` | string | Nom de la solution présentée |

### Recommandés (améliore la qualité)

| Input | Type | Description |
|-------|------|-------------|
| `current_tools` | array | Outils actuels du prospect |
| `num_users` | number | Nombre d'utilisateurs concernés |
| `stakeholders` | array | Liste des personnes présentes |
| `known_objections` | array | Objections anticipées |
| `competitors` | array | Concurrents évalués |

### Optionnels

| Input | Type | Description |
|-------|------|-------------|
| `baseline_metrics` | object | Métriques actuelles chiffrées |
| `success_stories` | array | Cas clients similaires |
| `implementation_timeline` | object | Planning d'implémentation |

---

## 2. Structure des Slides

### Séquence obligatoire (10-18 slides)

```
PHASE 1 — INTRODUCE (1-2 min)
├── Slide 1: SITUATION SLIDE ⭐ [OBLIGATOIRE]
│   Contenu: Les 6 champs (Job Title, CBI, Problems, Capabilities, Delta, Critical Date)
│   Format: Liste structurée avec icônes
│   Script: "Avant de commencer, laissez-moi confirmer votre situation..."

PHASE 2 — ILLUSTRATE (1-2 min)
├── Slide 2: ILLUSTRATION #1 ⭐ [OBLIGATOIRE]
│   Contenu: Screenshot/mockup du RÉSULTAT FINAL (pas du processus)
│   Format: Image annotée (max 3 annotations) + 3 benefits listés
│   Script: "Voici CE QUE vous obtenez..."
│
├── Slide 3: DEMO ROADMAP [Si >15 min]
│   Contenu: Timeline visuelle des segments à couvrir
│   Format: Boxes numérotées avec durées

PHASE 3 — DO IT FIRST PASS (1-2 min)
├── Slides 4-6: WORKFLOW ÉTAPES 1-3
│   Contenu par slide: Action + Temps + Résultat + Pourquoi important
│   Format: Screenshot + 4 bullet points
│   Règle: Fewest clicks (chemin le plus court)

PHASE 4 — DO IT AGAIN (5-10 min) [Si plusieurs capabilities]
├── Slide 7: ILLUSTRATION #2
├── Slides 8-10: WORKFLOW #2 ÉTAPES 1-3
├── Slide 11: ILLUSTRATION #3
├── Slides 12-14: WORKFLOW #3 ÉTAPES 1-3

PHASE 5 — Q&A (backup slides)
├── Slides backup: Customisation, Intégrations, Cas clients, Différenciation, Pricing

PHASE 6 — SUMMARIZE (2-4 min)
├── Slide FINAL-1: VALUE SUMMARY ⭐ [OBLIGATOIRE]
│   Contenu: Problems → Solutions mapping + Delta + Timeline
│
├── Slide FINAL: NEXT STEPS ⭐ [OBLIGATOIRE]
│   Contenu: 3 étapes concrètes avec dates + question ouverte finale
```

---

## 3. Règles Critiques

### Contenu

1. **Situation Slide complète** : Si CBI, Delta ou Critical Date manquent → risque "No Decision"
2. **Illustration AVANT workflow** : Toujours montrer le résultat final avant d'expliquer comment
3. **Fewest clicks** : Montrer le chemin le plus court, pas de "vous pourriez aussi..."
4. **Mapping obligatoire** : Chaque Problem → une Capability → une Illustration → un Workflow

### Langage

5. **Mode "Vous"** : Jamais "notre système permet", toujours "vous pouvez"
6. **Vocabulaire prospect** : Utiliser leurs termes, pas le jargon vendor
7. **Quantifier systématiquement** : Pas de "plus rapide", mais "2x plus rapide (30min → 15min)"

### Visuel

8. **Max 3 annotations** par screenshot
9. **Max 5 bullets** par slide, max 12 mots par bullet
10. **Before/After côte-à-côte** (pas séquentiel)

### Narration

11. **Référencer Situation Slide** à chaque segment : "Vous aviez dit que..."
12. **Pauses stratégiques** après chaque workflow : "Est-ce que ça répond à votre besoin ?"
13. **Closer avec question** : Pas "Merci, au revoir" mais "Quel est le meilleur next step pour vous ?"

---

## 4. Checklist de Validation

### Avant génération

- [ ] Les 6 champs Situation Slide sont remplis
- [ ] CBI est mesurable ET temporel
- [ ] Chaque Problem a un impact quantifié
- [ ] Chaque Capability mappe à un Problem
- [ ] Delta utilise les chiffres DU PROSPECT
- [ ] Critical Date a une raison qui crée urgence réelle

### Après génération

- [ ] Situation Slide est la slide 1 (après titre)
- [ ] Illustration précède chaque Workflow
- [ ] Value Summary reprend exactement les éléments de Situation Slide
- [ ] Next Steps référence Critical Date
- [ ] Tous les slides en mode "Vous"
- [ ] Total slides : 10-18

---

## 5. Structure JSON Input

```json
{
  "framework": "great-demo",
  "prospect": {
    "company_name": "",
    "industry": "",
    "size": {"employees": 0, "arr": "", "team_size": 0}
  },
  "situation": {
    "job_title": "",
    "critical_business_issue": "",
    "problems": [
      {"description": "", "priority": 1, "impact": ""}
    ],
    "specific_capabilities": [
      {"name": "", "maps_to_problem": 1}
    ],
    "delta": "",
    "critical_date": {"date": "", "reason": ""}
  },
  "solution": {
    "product_name": "",
    "workflows_to_demo": []
  }
}
```
