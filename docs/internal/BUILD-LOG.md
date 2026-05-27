# Changelog — Slide Presentation Generator (SPG)

## 2026-02-20
- Ajout .gitignore (node_modules et outputs retirés du tracking — 461K lignes nettoyées)
- Centralisation des règles d'or dans le CLAUDE.md parent

## 2026-02-19
- Réorganisation des outputs par brand/prospect + ajout de l'input prospect

## 2026-02-16
- Documentation : rapport d'architecture pour le bootstrap du Landing Page Generator

## 2026-02-10
- Ajout du box-drawing logo + template d'onboarding
- Optimisation : déplacement des détails onboarding dans un fichier externe (économie ~400 tokens/turn)

## 2026-02-09
- Refactoring : extraction du catalogue de Sub0-B vers Sub0-C (agent post-assembly)
- Ajout de l'onboarding au skill /generate-slides
- Fix : marqueurs ASSEMBLY pour assemblage déterministe des batches
- Fix : protocole de batching Sub0-B + format output Sub1 + vérification box-drawing Phase 2

## 2026-02-08
- Extension du catalogue de slides : 15 → 24 types (6 nouveaux archétypes + 3 variantes)
- Refactoring : split Sub0 en Sub0-A (analyse) + Sub0-B (génération)
- Ajout de l'extraction SVG au pipeline Sub0 (préservation des logotypes)

## 2026-02-06
- Architecture "Design Language Bridge" : Sub0 traduit l'identité visuelle en 24 slides exemples
- Refactoring de la phase design pour vitesse + créativité
- Suppression du mood/tonalité manuel (encodé dans le design language)

## 2026-02-05
- Version initiale du projet
- Création du skill /generate-slides avec architecture subagent
- Ajout de la génération par batch (5 slides/batch) + règles anti-overlap
- Compression des fichiers lib (extraction exemples, dédoublonnage règles)
