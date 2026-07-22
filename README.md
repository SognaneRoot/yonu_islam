# Mon Chemin vers Allah

Un compagnon quotidien pour apprendre sa religion progressivement, se purifier, construire
de bonnes habitudes et avancer, avec douceur, vers Allah.

Stack : **Next.js 14 (App Router) + TypeScript + Tailwind CSS**, avec une intégration
**Supabase** optionnelle pour la sauvegarde cloud.

## Ce qui est déjà fonctionnel

- Tableau de bord (niveau, série, XP, tâches du jour, objectif hebdomadaire)
- Système de 10 niveaux avec XP et déblocage progressif
- Modules : Prière, Ablutions, Aqida, Purification du cœur, Hadith, Fiqh, Arabe — chacun avec
  cours, import de PDF, quiz et notes personnelles
- Coran : objectif de lecture quotidien, suivi de progression, import de PDF/tafsir
- Adhkar : cartes interactives (matin, soir, sommeil, réveil, mosquée, maison, voyage, repas,
  toilettes) avec arabe, translittération, traduction et suivi de mémorisation
- Sira : frise chronologique interactive des grands événements
- Suivi des habitudes : checklist quotidienne, séries, calendrier d'assiduité (heatmap)
- "Mon Combat" : journal privé et bienveillant contre les péchés, compteur de jours,
  gestion des rechutes sans culpabilisation
- Bibliothèque : import, recherche, filtres, favoris, reprise de lecture
- Mode sombre par défaut, design responsive mobile/desktop

Toutes les données sont sauvegardées automatiquement dans le navigateur (`localStorage`), donc
**l'application fonctionne immédiatement, sans aucune configuration.**

## Ce qui reste à brancher pour une version 100% production

Certaines fonctionnalités du cahier des charges initial demandent des services externes que je
n'ai pas pu créer à ta place (comptes réels, fichiers audio, etc.) :

- **Sauvegarde cloud multi-appareils** : le schéma SQL (`supabase/schema.sql`) et les clients
  Supabase (`lib/supabase/`) sont prêts. Il suffit de créer un projet Supabase, d'exécuter le
  schéma et de renseigner les variables d'environnement (voir plus bas). Tant que ce n'est pas
  fait, tout reste stocké localement.
- **Lecteur PDF avancé** (surlignage, marque-pages précis) : l'import de fichiers est en place ;
  brancher une librairie comme `react-pdf` pour un rendu page par page est la prochaine étape.
- **Audio des adhkar** et **récitations coraniques** : nécessitent des fichiers audio sous licence
  appropriée, à héberger toi-même (Supabase Storage ou un CDN).
- **Répétition espacée** (spaced repetition) pour les adhkar/hadiths : la structure de données
  (`adhkarDone`) est prête à recevoir un algorithme (ex. SM-2) pour planifier les révisions.
- **Notifications intelligentes** : nécessitent un service de push (ex. OneSignal, Web Push) et
  ne peuvent pas être ajoutées sans que tu choisisses/configures ce service.

## Lancer le projet en local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Déployer sur Vercel

1. Pousse ce dossier sur un dépôt GitHub (ou GitLab/Bitbucket).
2. Sur [vercel.com](https://vercel.com), clique sur **New Project** et importe le dépôt.
3. Vercel détecte automatiquement Next.js — aucune configuration nécessaire.
4. (Optionnel) Si tu actives Supabase, ajoute les variables d'environnement dans
   **Project Settings > Environment Variables** (voir section suivante).
5. Clique sur **Deploy**.

## Activer la sauvegarde cloud (Supabase) — optionnel

1. Crée un projet gratuit sur [supabase.com](https://supabase.com).
2. Dans l'éditeur SQL du projet, colle et exécute le contenu de `supabase/schema.sql`.
3. Dans **Project Settings > API**, copie l'URL du projet et la clé `anon public`.
4. Copie `.env.local.example` vers `.env.local` et renseigne :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
5. Ajoute les mêmes variables dans Vercel avant de déployer.
6. La page **Mon compte** propose alors une connexion par lien magique (email, sans mot de passe).

Sans ces variables, l'application fonctionne normalement en mode local uniquement.

## Structure du projet

```
app/                 pages (App Router) — une route par module
components/          composants réutilisables (UI, sidebar, cartes, heatmap...)
lib/data/            contenu statique (niveaux, adhkar, sira, cours, bibliothèque)
lib/store.tsx        état de l'application (XP, habitudes, journal...) + persistance locale
lib/supabase/        clients Supabase (optionnel)
supabase/schema.sql  schéma SQL prêt à l'emploi pour la sauvegarde cloud
```

## Prochaines étapes suggérées

1. Relire/valider le contenu religieux (cours, quiz, adhkar) avec une personne qualifiée avant
   publication — le contenu fourni est un point de départ pédagogique, pas une fatwa.
2. Brancher Supabase si tu veux la synchronisation multi-appareils.
3. Ajouter un vrai lecteur PDF (`react-pdf`) et l'audio des adhkar.
4. Écrire les textes complets des livres (Trois Fondements, 40 Hadiths, etc.) ou les importer
   en PDF depuis la Bibliothèque.
