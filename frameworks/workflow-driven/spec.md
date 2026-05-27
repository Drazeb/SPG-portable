# Workflow-Driven Demo — Spec Opérationnelle

Version condensée pour le SPG. Référence complète : `reference.md`

---

## 1. Inputs Requis

### Obligatoires (génération impossible sans)

| Input | Type | Description |
|-------|------|-------------|
| `company_name` | string | Nom de l'entreprise prospect |
| `industry` | string | Secteur d'activité |
| `company_size` | object | `{employees, arr, team_size}` |
| `pain_points` | array | 2-4 problèmes avec impact quantifié et priorité |
| `desired_outcomes` | array | 2-3 résultats souhaités |
| `current_tools` | array | Outils actuels du prospect |
| `stakeholders` | array | Personnes présentes (nom, titre, is_primary) |

### Recommandés (améliore la qualité)

| Input | Type | Description |
|-------|------|-------------|
| `baseline_metrics` | object | Métriques actuelles (win_rate, churn, etc.) |
| `target_metrics` | object | Métriques cibles |
| `critical_date` | object | `{date, reason}` si deadline connue |
| `similar_customer` | object | Cas client similaire avec résultats |
| `known_objections` | array | Objections anticipées |

### Optionnels

| Input | Type | Description |
|-------|------|-------------|
| `competitors` | array | Concurrents évalués |
| `budget_range` | object | Fourchette budget si connue |
| `presentation_format` | string | "short" (15-20min) ou "long" (30-45min) |

---

## 2. Structure des Slides

### Format Court (15-20 min, 13-20 slides)

```
PHASE 1 — HOOK (30 sec)
├── Slide 1: HOOK ⭐
│   Types possibles:
│   - Stat choc : "73% des forecasts sont erronés de plus de 20%"
│   - Quote client : "Avant [Product], on pilotait à l'aveugle"
│   - Visual : Image before/after frappante
│   - Problem amplification : Coût du problème chiffré

PHASE 2 — PROBLEM (2-3 min)
├── Slide 2: CURRENT STATE
│   Contenu: "[Company], vous êtes [context]. Voici votre situation actuelle."
│   Format: 3-4 métriques actuelles du prospect
│
├── Slide 3: PAIN POINTS ⭐
│   Contenu: 2-4 problèmes avec impact quantifié
│   Format: Icône + Description + Impact chiffré
│
├── Slide 4: COST OF INACTION [Optionnel]
│   Contenu: Ce qui se passe si rien ne change

PHASE 3 — SOLUTION OVERVIEW (1-2 min)
├── Slide 5: SOLUTION POSITIONING
│   Contenu: Proposition de valeur en 1-2 phrases
│   Format: Headline + 3 piliers de valeur
│   Règle: PAS de features, que des outcomes

PHASE 4 — WORKFLOW DEMO (5-8 min)
│
├── WORKFLOW 1 (résout Pain Point #1)
│   ├── Slide 6: VALUE PREVIEW
│   │   "Ce que vous allez pouvoir faire : [outcome]"
│   │   "Résout votre problème : [pain point #1]"
│   │
│   ├── Slide 7: ORIENT
│   │   Screenshot annoté (max 3 annotations)
│   │   "Nous sommes sur [écran]. Vous voyez [zones clés]."
│   │
│   ├── Slides 8-10: DEMO STEPS 1-3
│   │   Par slide: Action + Temps + Résultat + Pourquoi important
│   │
│   └── Slide 11: VALUE RECAP
│       "Et voilà comment vous résolvez [pain point #1]"
│
├── WORKFLOW 2 (résout Pain Point #2) — même structure
│   └── Slides 12-17

PHASE 5 — PROOF (2-3 min)
├── Slide 18: SUCCESS STORY ⭐
│   Contenu: Cas client similaire (industry + size)
│   Format: Problem before → Results after → Quote testimonial
│
├── Slide 19: AGGREGATE RESULTS
│   Contenu: "50+ clients, résultats moyens..."
│   Format: 3 métriques clés avec before/after

PHASE 6 — RISK MITIGATION (2-3 min)
├── Slide 20: COMMON CONCERNS
│   Contenu: 2-3 objections fréquentes + réponses
│   Format: Question → Réponse courte + preuve
│
├── Slide 21: IMPLEMENTATION SUPPORT
│   Contenu: Timeline + ressources + garanties

PHASE 7 — CLOSE (1-2 min)
├── Slide 22: VALUE RECAP ⭐
│   Contenu: Pain Points → Solutions mapping
│   Format: Tableau 2 colonnes
│
├── Slide 23: NEXT STEPS ⭐
│   Contenu: 2-3 étapes concrètes + CTA clair
│   Format: Timeline visuelle + question finale
```

---

## 3. Règles Critiques

### Structure Orient-Demo-Value (O-D-V)

1. **Chaque workflow suit O-D-V** : Orient (où on est) → Demo (montrer) → Value (pourquoi ça compte)
2. **Value Preview AVANT le workflow** : Annoncer ce qu'ils vont voir et quel problème ça résout
3. **Value Recap APRÈS le workflow** : Reconnecter à la valeur business

### Contenu

4. **Workflows, not features** : Montrer des parcours complets A→B, pas des listes de fonctionnalités
5. **Max 2-3 workflows** par présentation (mieux vaut 2 bien couverts que 4 survolés)
6. **3-5 étapes max** par workflow
7. **Fewest clicks** : Chemin le plus court, pas de détours

### Personnalisation (OBLIGATOIRE)

8. **Nom entreprise partout** : Jamais "votre entreprise" mais "[Company Name]"
9. **Pain points dans leurs mots** : Reprendre exactement leurs formulations
10. **Métriques prospect** : Utiliser LEURS chiffres baseline et target

### Visuel

11. **Max 3 annotations** par screenshot
12. **Max 5-6 bullets** par slide, max 15 mots par bullet

### Narration

13. **Checkpoints obligatoires** : Après Problem, après chaque Workflow, après Proof
14. **Question finale ouverte** : "Qu'est-ce qui vous semble le plus utile pour [Company] ?"

---

## 4. Checklist de Validation

### Avant génération

- [ ] 2-4 pain points avec impact quantifié
- [ ] Pain points priorisés (1 = plus critique)
- [ ] 2-3 desired outcomes définis
- [ ] Outils actuels listés
- [ ] Au moins 1 stakeholder identifié

### Après génération

- [ ] Hook est spécifique au prospect (pas générique)
- [ ] Pain Points slide utilise LEURS mots
- [ ] Chaque Workflow a : Value Preview + Orient + Demo Steps + Value Recap
- [ ] Success Story est dans même industry/size
- [ ] Next Steps a 2-3 étapes concrètes
- [ ] Question finale est ouverte
- [ ] Total slides : 15-25 selon format

---

## 5. Structure JSON Input

```json
{
  "framework": "workflow-driven",
  "format": "short",
  "prospect": {
    "company_name": "",
    "industry": "",
    "size": {"employees": 0, "arr": "", "sales_reps": 0},
    "stakeholders": [
      {"name": "", "title": "", "is_primary": true}
    ],
    "current_tools": [],
    "baseline_metrics": {},
    "target_metrics": {}
  },
  "pain_points": [
    {"description": "", "priority": 1, "impact_quantified": ""}
  ],
  "desired_outcomes": [],
  "solution": {
    "product_name": "",
    "workflows_to_demo": [
      {"name": "", "solves_pain_point": 1, "steps": 3}
    ]
  },
  "social_proof": {
    "similar_customer": {
      "name": "",
      "industry": "",
      "size": "",
      "results": {}
    }
  },
  "objections": [
    {"concern": "", "response": ""}
  ]
}
```
