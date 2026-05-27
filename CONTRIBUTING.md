# Contributing

Merci de l'intérêt que vous portez à ce projet.

## Statut du projet

Ce projet est principalement maintenu par [Charles Bezard](https://github.com/charlesbezard). Il évolue activement et la roadmap est dirigée par les usages internes.

Les pull requests externes sont les bienvenues, mais merci d'ouvrir une issue de discussion **avant** d'investir du temps sur un changement non trivial — pour éviter les efforts perdus sur des directions qui ne s'aligneraient pas avec la trajectoire du projet.

## Signaler un bug

Ouvrez une [issue GitHub](../../issues) avec :

- Une description du comportement observé vs attendu
- Le skill concerné (`/generate-slides` ou `/generate-mini-deck`)
- La phase du pipeline concernée si applicable
- Le pack BIG utilisé en input (anonymiser le contenu si client réel)
- Votre environnement : macOS version, Node.js version, version de Claude Code

## Proposer une amélioration

1. Ouvrez d'abord une issue **"discussion"** décrivant l'idée et le problème qu'elle résout
2. Attendez un retour avant de coder
3. Une fois validé, ouvrez la PR contre `main` avec :
   - Un commit message au format Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, etc.)
   - Une description claire du **pourquoi** plus que du **quoi**

## Style

- Commentaires de code en français OK, prompts subagents en français
- Pas d'ajout de dépendances Node sans discussion (le projet veut rester léger : `pptxgenjs` + `dom-to-pptx` aujourd'hui)
- Respecter les patterns critiques du projet (sub-agents Sub0-A/Sub0-B, content-mapper voice marque, quality gates par phase)

## Tests

Validation manuelle pour l'instant — pas de suite automatisée. Avant de proposer une PR, lancer le pipeline complet sur au moins un pack BIG de test pour vérifier la cohérence du livrable final (PPTX généré + ouverture dans PowerPoint/Keynote).

## Convention d'anonymisation (mainteneur uniquement)

Ce repo public est synchronisé depuis un sandbox interne où les tests réels utilisent des marques clientes réelles. Pour ne jamais exposer ces clients, le script `scripts/export-to-portable.sh` applique une **anonymisation systématique** au moment du portage : toute marque cliente listée dans `CLIENT_ANONYMIZATIONS` (en tête du script) est remplacée par un pseudonyme dans tous les fichiers texte exposés.

Les pseudonymes actuellement utilisés (à titre indicatif pour comprendre les exemples dans la doc) :

| Pseudonyme | Registre / Contexte |
|---|---|
| **Atelier Vermeil** | Marque artisanale, atelier de transformation |
| **Camille** | Wordmark mono-mot, registre identitaire personnel |
| **VoltaPilot** | Mobilité électrique, B2B/B2C tech |
| **Posta** | Email / CRM / comms |
| **GeoForge** | Éco-construction / sustainable |
| **Vertillo** | Nature / spring / agriculture |
| **Mutualis** | Symbiose / coopération |

Si tu ajoutes un nouveau cas d'étude basé sur un client réel, ajoute le mapping dans `CLIENT_ANONYMIZATIONS` du script. Le script applique automatiquement 3 variantes de casse par mapping (Title Case, lowercase, UPPERCASE).
