# Racine — Intégration frontend ↔ workflow n8n

## Ce qui a été fait

1. **Connexion au webhook n8n** (`src/lib/api.js`)
   Le workflow `SYSTÈME MULTIAGENT - Webhook` expose un nœud Webhook sur le
   path `felana-chat`, qui attend `{ chatInput, sessionId }` en POST et
   renvoie `{ output, sessionId }`. `ChatPage` appelle `sendChatMessage()` à
   chaque envoi de message.

   **À faire de ton côté :** copie `.env.example` en `.env` et renseigne
   `VITE_N8N_WEBHOOK_URL` avec l'URL de production de ton webhook n8n. Pense
   aussi à **activer le workflow** dans n8n (il est actuellement `"active":
   false`), sinon seule l'URL de test répondra.

2. **Historique de conversation réel** (`src/lib/storage.js`, `Sidebar.jsx`,
   `ChatPage.jsx`)
   Chaque conversation a son propre `sessionId` (utilisé comme clé de mémoire
   côté n8n, nœud "Simple Memory"), un titre généré automatiquement à partir
   du premier message, et la liste des messages. Le tout est persisté en
   `localStorage` pour l'instant — voir point 4.

3. **Page d'inscription** (`src/page/RegisterPage.jsx`) et **page de
   connexion** mise à jour (`src/page/LoginPage.jsx`), avec le même design
   (fond `gray-950`, carte `gray-900`, accent `cyan-400`) que l'existant.

4. **Profil utilisateur** (`src/page/ProfilePage.jsx`) : affiche le nom,
   l'email et le nombre de conversations sauvegardées, avec déconnexion.

## Limite importante à connaître

Le workflow n8n fourni **ne contient qu'un webhook de chat** — il n'y a pas
de backend d'authentification ni de base de données pour les utilisateurs ou
l'historique. J'ai donc simulé l'inscription/connexion et l'historique
**côté client via `localStorage`** (`src/lib/storage.js`), avec une API
volontairement proche de ce que donnerait un vrai backend, pour faciliter la
migration plus tard vers, par exemple, Supabase, Firebase Auth, ou une API
n8n dédiée (table Postgres/Airtable + nœuds Webhook `/register`, `/login`,
`/conversations`).

Ça veut dire concrètement :
- les comptes ne sont valables que sur le navigateur où ils ont été créés ;
- l'historique n'est pas partagé entre appareils ;
- les mots de passe sont stockés en clair dans `localStorage` — **à ne pas
  utiliser tel quel en production**.

Si tu veux, je peux ensuite ajouter au workflow n8n des nœuds
Webhook + Postgres (ou Supabase) pour un vrai backend d'auth et
d'historique persistant côté serveur.

## Structure ajoutée/modifiée

```
src/
  lib/
    api.js          → appel au webhook n8n
    storage.js       → auth + historique (localStorage)
  context/
    AuthContext.jsx  → état utilisateur global
  page/
    LoginPage.jsx     (mis à jour)
    RegisterPage.jsx  (nouveau)
    ProfilePage.jsx   (nouveau)
    ChatPage.jsx      (mis à jour)
  components/
    ChatInput.jsx     (mis à jour — envoi réel)
    ChatWindow.jsx    (mis à jour — messages dynamiques + indicateur de saisie)
    Sidebar.jsx       (mis à jour — historique réel + profil)
    Navbar.jsx        (mis à jour — état connecté)
  App.jsx             (mis à jour — routes /register, /profile)
```
