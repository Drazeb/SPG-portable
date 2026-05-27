# Internal — logs de construction du projet

Ce dossier contient les **logs de construction** du projet SPG, exposés pour transparence.

**Vous n'avez pas besoin de lire ces fichiers pour utiliser le système.**

Ils sont utiles seulement si vous voulez :

- Comprendre **pourquoi** une décision d'architecture a été prise (et pas son alternative)
- Voir l'évolution du système session par session
- Reprendre un chantier passé ou éviter de refaire une erreur déjà identifiée

## Fichiers

| Fichier | Contenu |
|---|---|
| [`DECISIONS.md`](./DECISIONS.md) | Décisions structurantes — chaque décision avec date, choix retenu, et le **pourquoi**. Le "pourquoi" est ce qui protège les choix passés contre une remise en question non informée. |
| [`BUILD-LOG.md`](./BUILD-LOG.md) | Historique narratif des sessions de travail, regroupant les commits par thématique cohérente. |
| [`PLAN-GENERAL.md`](./PLAN-GENERAL.md) | Plan exhaustif du développement du projet — référentiel interne du mainteneur. |

## Format

Ces fichiers suivent un format **interne** plutôt qu'un standard public (pas de semver release notes type Keep-a-Changelog, pas de format ADR codifié type MADR). C'est volontaire : ils sont d'abord des outils de mémoire pour le mainteneur, et secondairement une ressource pédagogique pour les curieux.

Si vous voulez la version "user-facing" du projet, lisez plutôt :

- [`/README.md`](../../README.md) — Onboarding utilisateur
