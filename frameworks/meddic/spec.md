# MEDDIC + Demo Integration — Spec Opérationnelle

Version condensée pour le SPG. Référence complète : `reference.md`

---

## 1. Inputs Requis

### Obligatoires — Les 6 éléments MEDDIC

| Input | Type | Description |
|-------|------|-------------|
| `metrics` | object | `{baseline: "", target: "", timeline: ""}` — Métriques à améliorer |
| `economic_buyer` | object | `{name, title, budget_authority, their_pain}` — Qui contrôle le budget |
| `decision_criteria` | array | Critères de choix priorisés + deal-breakers |
| `decision_process` | array | Étapes d'approbation `{step, who, when}` |
| `identify_pain` | object | `{problem, financial_impact, urgency}` — Douleur existentielle |
| `champion` | object | `{name, title, their_pain, political_capital, willing_to_advocate}` |

### Obligatoires — Contexte

| Input | Type | Description |
|-------|------|-------------|
| `company_name` | string | Nom de l'entreprise prospect |
| `company_size` | object | `{employees, arr, reps}` |
| `current_tools` | array | Tech stack actuel |
| `critical_date` | object | `{date, reason}` |
| `product_name` | string | Nom de la solution |

### Recommandés

| Input | Type | Description |
|-------|------|-------------|
| `customer_reference` | object | Cas client similaire avec résultats |
| `implementation_timeline` | object | Planning déploiement |
| `pricing` | object | Fourchette pricing si applicable |

---

## 2. Structure Multi-Meeting

### Vue d'ensemble (4 réunions sur 4 semaines)

```
SEMAINE 1
└── MEETING 1: EXECUTIVE BRIEFING (30 min)
    Audience: CFO, CEO (Economic Buyers)
    Objectif: Approbation business case + budget

SEMAINE 2
├── MEETING 2a: TECHNICAL DEEP DIVE (60 min)
│   Audience: CTO, VP Engineering, Security
│   Objectif: Validation faisabilité technique
│
└── MEETING 2b: USER WORKFLOW DEMO (45 min)
    Audience: VP Sales, équipe utilisateurs
    Objectif: Validation usabilité + adoption

SEMAINE 3
└── MEETING 3: CHAMPION COACHING (90 min)
    Audience: Champion SEUL
    Objectif: Armer pour défendre en interne

SEMAINE 4
└── MEETING 4: BUSINESS CASE REVIEW (60 min)
    Audience: Tous décideurs
    Objectif: Approbation finale + contrat
```

---

## 3. Slides par Meeting

### Meeting 1 — Executive Briefing (6 slides)

```
Slide 1: HOOK + PROBLEM
├── Format: "Votre [métrique] est à [baseline], coûte [impact]/an.
│           On peut l'améliorer à [target] en [timeline]."

Slide 2: CURRENT STATE (leurs chiffres)
├── Format: 3-4 métriques baseline + impact annuel total

Slide 3: COST OF INACTION
├── Format: Ce qui se passe si rien ne change + lien avec critical_date

Slide 4: PROPOSED SOLUTION (high-level)
├── Format: 1-2 phrases positionnement + timeline implémentation

Slide 5: FINANCIAL BUSINESS CASE ⭐
├── Format: Revenue gain + Cost + Payback period + ROI %
├── Règle: Utiliser LEURS chiffres, calcul transparent

Slide 6: TIMELINE & NEXT STEPS
├── Format: Go-live date + 3 prochaines étapes + ask explicite
```

### Meeting 2a — Technical Deep Dive (8 slides)

```
Slide 1: ARCHITECTURE OVERVIEW
Slide 2: INTEGRATION (leur stack)
Slide 3: SECURITY & COMPLIANCE
Slide 4: IMPLEMENTATION TIMELINE (4 semaines typique)
Slide 5: SLA & SUPPORT
Slides 6-8: BACKUP (competitive, compliance details)
```

### Meeting 2b — User Workflow Demo

Utiliser le format **Workflow-Driven** (voir spec workflow-driven)

### Meeting 3 — Champion Coaching (pas de slides formelles)

Livrables à préparer :
- Battle Cards (5+ objections avec réponses)
- Talking Points (1 page max)
- Internal Presentation Outline
- ROI Calculator personnalisé

### Meeting 4 — Business Case Review (4 slides)

```
Slide 1: SUMMARY RECAP
├── "Executive approved, Technical validated, Users ready"

Slide 2: FINAL BUSINESS CASE
├── ROI model mis à jour avec derniers chiffres

Slide 3: CONTRACT & TERMS
├── Pricing + conditions + timeline signature

Slide 4: CLOSE
├── Next steps immédiats + question finale
```

---

## 4. Règles Critiques

### Qualification MEDDIC

1. **Ne pas présenter si MEDDIC incomplet** : Les 6 éléments doivent être qualifiés
2. **Champion identifié ET willing** : Sans champion confirmé, risque très élevé
3. **Economic Buyer nommé** : Pas "le CFO" mais "Michelle Chen, CFO"

### Par Rôle

4. **CFO veut ROI** : Business outcomes, payback, pas de features
5. **CTO veut architecture** : Sécurité, intégration, scalabilité
6. **VP Sales veut workflows** : Usabilité quotidienne, adoption
7. **Ne jamais montrer architecture au CFO** (il décroche)

### Business Case

8. **Chiffres du prospect** : Jamais de benchmarks génériques
9. **ROI conservateur** : Mieux vaut sous-promettre
10. **Payback period visible** : C'est souvent le décideur final

### Champion

11. **Coaching privé** : Meeting 3 = champion SEUL
12. **Battle cards fournies** : Armer avec réponses aux objections
13. **Script de closing** : "Je suis confiant que ça résout notre problème. On avance ?"

---

## 5. Checklist de Validation

### Avant Meeting 1 (Executive Briefing)

- [ ] M - Metrics : baseline + target + timeline remplis
- [ ] E - Economic Buyer : nom + titre + budget authority confirmé
- [ ] D - Decision Criteria : 3+ critères priorisés
- [ ] D - Decision Process : étapes mappées avec qui + quand
- [ ] I - Identify Pain : impact financier quantifié
- [ ] C - Champion : willing to advocate = YES

### Avant Meeting 2a (Technical)

- [ ] Architecture diagram adapté à leur setup
- [ ] Certifications sécurité listées (SOC2, GDPR, etc.)
- [ ] Integration avec LEURS outils documentée
- [ ] Timeline implémentation réaliste

### Avant Meeting 3 (Champion Coaching)

- [ ] Battle Cards préparées (5+ objections)
- [ ] Talking Points document (1 page)
- [ ] ROI calculator personnalisé

### Avant Meeting 4 (Business Case Review)

- [ ] Business case mis à jour post-technical
- [ ] Tous décideurs confirmés présents
- [ ] Contract terms prêts
- [ ] Timeline signature définie

---

## 6. Structure JSON Input

```json
{
  "framework": "meddic",
  "prospect": {
    "company_name": "",
    "size": {"employees": 0, "arr": "", "reps": 0},
    "current_tools": []
  },
  "meddic": {
    "metrics": {
      "baseline": {"metric_name": "", "value": 0},
      "target": {"metric_name": "", "value": 0},
      "timeline": ""
    },
    "economic_buyer": {
      "name": "",
      "title": "",
      "budget_authority": "",
      "their_pain": ""
    },
    "decision_criteria": [
      {"criterion": "", "priority": 1, "is_dealbreaker": false}
    ],
    "decision_process": [
      {"step": 1, "who": "", "when": "", "action": ""}
    ],
    "identify_pain": {
      "problem": "",
      "financial_impact": "",
      "urgency": ""
    },
    "champion": {
      "name": "",
      "title": "",
      "their_pain": "",
      "political_capital": "HIGH|MEDIUM|LOW",
      "willing_to_advocate": "YES|PENDING|NO"
    }
  },
  "critical_date": {"date": "", "reason": ""},
  "solution": {"product_name": ""},
  "customer_reference": {
    "name": "",
    "results": {}
  }
}
```

---

## 7. Signaux d'Alerte

| Signal | Risque | Action |
|--------|--------|--------|
| Champion = PENDING ou NO | 75% chance de No Decision | Trouver/développer champion avant de continuer |
| Economic Buyer non identifié | Deal bloqué à la fin | Qualifier via champion |
| Pain = "nice to have" | Pas d'urgence | Quantifier impact financier |
| Critical Date floue | Cycle s'allonge indéfiniment | Identifier événement déclencheur |
| Decision Process > 5 étapes | Cycle très long | Simplifier ou qualifier budget |
