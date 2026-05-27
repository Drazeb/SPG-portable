# Decisions — Slide Presentation Generator (SPG)

Chaque décision architecturale est documentée ici avec son contexte et sa raison d'être, pour éviter de re-débattre les mêmes choix.

---

### D1. Architecture Design Language Bridge (Sub0 one-time)
**Date** : Fév 2026
**Choix** : Phase 0 (Sub0) traduit l'identité visuelle d'une brand en 24 slides exemples PPTX-compatible + design-language.md. Sub3/Sub5 s'inspirent de ces exemples au lieu de travailler depuis des mots vagues.
**Pourquoi** : Demander au LLM de "s'inspirer du style guide" produisait des résultats incohérents. Lui montrer 24 slides concrètes dans le bon format → il comprend immédiatement le registre visuel.

### D2. dom-to-pptx pour l'export (85-90% fidélité)
**Date** : Jan 2026
**Choix** : Utiliser dom-to-pptx (librairie JS) pour convertir le HTML/CSS en .pptx, plutôt que de générer le PPTX directement.
**Pourquoi** : Générer du PPTX directement est très complexe (XML). Le HTML est le terrain de jeu naturel du LLM. dom-to-pptx fait le pont avec 85-90% de fidélité, ce qui est suffisant.

### D3. Mood/tonalité encodés dans le design language (plus de sélection manuelle)
**Date** : Fév 2026
**Choix** : Le mood et la tonalité ne sont plus des paramètres choisis manuellement. Ils sont déduits automatiquement par Sub0 et encodés dans le design language.
**Pourquoi** : La sélection manuelle du mood ajoutait une étape sans valeur — le style guide contient déjà toutes les informations tonales. Sub0 les extrait et les formalise.

### D4. Génération par batch de 5 slides
**Date** : Fév 2026
**Choix** : Générer les slides par lots de 5 au lieu de toutes en une passe.
**Pourquoi** : Au-delà de 5 slides, le LLM perd la cohérence visuelle et le CSS dérive. 5 slides = le bon ratio contexte/qualité.

### D5. Split Sub0 en Sub0-A (analyse) + Sub0-B (génération) + Sub0-C (catalogue)
**Date** : Fév 2026
**Choix** : Séparer l'analyse du brand pack, la génération des 24 exemples, et l'indexation du catalogue en 3 sous-agents distincts.
**Pourquoi** : Un seul agent qui fait les trois perdait le focus. L'analyste produit un rapport, le générateur travaille à partir du rapport, le catalogueur indexe le résultat.

### D6. Anthropic SDK direct (pas Claude Agent SDK) pour Bot Chloé
**Date** : Fév 2026
**Contexte** : Décision prise sur le projet Chloé mais documentée ici car c'est une décision technique transverse.
**Choix** : Utiliser l'Anthropic SDK Python directement plutôt que le Claude Agent SDK.
**Pourquoi** : Évite la dépendance Node.js, déploiement plus simple, contrôle total sur la boucle agent. Le Agent SDK est plus adapté pour des cas multi-agents complexes.
