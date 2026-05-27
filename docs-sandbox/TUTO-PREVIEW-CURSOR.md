# Preview HTML dans Cursor (avec Live Server)

## Méthode complète (5 étapes)

### Étape 1 : Lancer le serveur

**Clic droit** sur ton fichier `.html` dans l'explorateur (panneau gauche)
→ Sélectionne **"Open with Live Server"**

Ça ouvre le fichier dans ton navigateur externe ET ça lance le serveur local.

---

### Étape 2 : Copier l'URL

Dans le navigateur, copie l'URL qui ressemble à :
```
http://127.0.0.1:5500/outputs/mon-fichier.html
```

---

### Étape 3 : Ouvrir la palette de commandes

Dans Cursor : **Cmd + Shift + P**

---

### Étape 4 : Chercher Simple Browser

Tape : **Simple Browser: Show**

Sélectionne cette commande.

---

### Étape 5 : Coller l'URL

Un champ apparaît en haut de Cursor.
**Colle l'URL** (Cmd + V) puis **Entrée**.

Le preview s'affiche dans un panneau à droite de Cursor.

---

## Résumé visuel

```
1. Clic droit .html → "Open with Live Server"
2. Copie l'URL du navigateur (http://127.0.0.1:5500/...)
3. Cmd + Shift + P
4. Tape "Simple Browser: Show" → Entrée
5. Colle l'URL → Entrée
```

---

## Après (pour itérer)

- Le serveur reste actif
- À chaque **Cmd + S** (sauvegarde), le preview se met à jour automatiquement
- Pas besoin de refaire les 5 étapes, juste sauvegarder

---

## Pour arrêter

Clique sur **"Port: 5500"** dans la barre bleue en bas de Cursor → "Stop Live Server"
