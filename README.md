# Mon Chemin vers Allah

Un compagnon quotidien pour apprendre sa religion progressivement, se purifier, construire
de bonnes habitudes et avancer, avec douceur, vers Allah.

Stack : **Next.js 14 (App Router) + TypeScript + Tailwind CSS**. Aucune base de données,
aucun compte : tout le contenu (images, PDF) vient du dossier `public/assets/`, et ta
progression est sauvegardée automatiquement **dans le navigateur de chaque appareil**.

## Comment la progression est conservée

Il n'y a pas de compte utilisateur : chaque navigateur/appareil qui visite le site garde sa
propre progression en local (`localStorage`) — niveau, XP, habitudes, adhkar mémorisés, page
atteinte dans chaque livre, journal de "Mon Combat", etc. Rouvrir le site sur le même appareil
(même navigateur) retrouve exactement où tu en étais. Sur un autre appareil, la progression
repart de zéro puisqu'il n'y a pas de synchronisation entre appareils — c'est le choix fait ici
pour éviter tout compte/toute base de données. Si un jour tu veux une vraie synchronisation
multi-appareils pour un même utilisateur (ou plusieurs comptes), il faudra ajouter une
authentification + une base de données (ex. Supabase) ; dis-le-moi et je le brancherai.

## Ce qui est fonctionnel

- Tableau de bord (niveau, série, XP, tâches du jour, objectif hebdomadaire)
- Système de 10 niveaux avec XP et déblocage progressif
- **Prière** et **Ablutions** : grille visuelle étape par étape (image + numéro + description),
  en plus des cours, quiz et notes
- Aqida, Purification du cœur, Hadith, Fiqh, Arabe : cours, quiz, notes, et PDF liés à la
  bibliothèque quand disponibles
- Coran : objectif de lecture quotidien, suivi de progression, lecteur intégré du Mus'haf/tafsir
- Adhkar : cartes interactives (matin, soir, sommeil, réveil, mosquée, maison, voyage, repas,
  toilettes) avec arabe, translittération, traduction et suivi de mémorisation
- Sira : frise chronologique interactive
- Suivi des habitudes : checklist quotidienne, séries, calendrier d'assiduité (heatmap)
- "Mon Combat" : journal privé et bienveillant contre les péchés, compteur de jours
- **Bibliothèque** : tous les livres PDF s'ouvrent directement dans la page (aucun
  téléchargement), et chaque livre reprend automatiquement à la page où tu t'étais arrêté
- Mode sombre par défaut, design responsive mobile/desktop

## Images et PDF — dossier `public/assets/`

Aucune importation depuis l'interface : tout vient de fichiers déposés dans le projet.

```
public/assets/wuduh/w1.png   ...   w8.png    → étapes du wudu (grille "Étapes" de /ablutions)
public/assets/priere/p1.png  ...   p10.png   → étapes de la prière (grille "Étapes" de /priere)
public/assets/books/*.pdf                    → livres lisibles depuis /bibliotheque et les modules liés
```

Tant qu'une image n'existe pas encore, la grille affiche un cadre "image à ajouter" avec le
chemin exact attendu — rien ne casse visuellement en attendant.

### Noms des étapes du wudu (`public/assets/wuduh/`)
| Fichier | Étape |
|---|---|
| `w1.png` | Intention et Bismillah |
| `w2.png` | Laver les mains |
| `w3.png` | Rincer la bouche et le nez |
| `w4.png` | Laver le visage |
| `w5.png` | Laver les avant-bras |
| `w6.png` | Essuyer la tête et les oreilles |
| `w7.png` | Laver les pieds |
| `w8.png` | Invocation finale |

### Noms des étapes de la prière (`public/assets/priere/`)
| Fichier | Étape |
|---|---|
| `p1.png` | Intention (niyyah) |
| `p2.png` | Takbir d'ouverture |
| `p3.png` | Position debout (qiyam) |
| `p4.png` | Inclinaison (ruku') |
| `p5.png` | Redressement (i'tidal) |
| `p6.png` | Première prosternation |
| `p7.png` | Position assise entre les deux prosternations |
| `p8.png` | Deuxième prosternation |
| `p9.png` | Tashahhud |
| `p10.png` | Salut final (taslim) |

Les titres/descriptions sont déjà écrits dans `lib/data/steps.ts` — il suffit de fournir les
images avec ces noms exacts (format carré recommandé, ex. 800×800px, `.png` ou `.jpg`).

### Noms des livres (`public/assets/books/`)
| Fichier attendu | Livre | Catégorie | Visible aussi dans |
|---|---|---|---|
| `trois-fondements.pdf` | Les Trois Fondements | Aqida | /aqida |
| `quatre-regles.pdf` | Les Quatre Règles | Aqida | /aqida |
| `kitab-at-tawhid.pdf` | Kitab At-Tawhid | Aqida | /aqida |
| `quarante-hadith-nawawi.pdf` | Les 40 Hadiths d'An-Nawawi | Hadith | /hadith |
| `riyad-as-salihin.pdf` | Riyad As-Salihin | Hadith | /hadith |
| `bulugh-al-maram.pdf` | Bulugh Al-Maram | Hadith | /hadith |
| `fiqh-sunnah-priere.pdf` | Fiqh As-Sunnah — La prière | Fiqh | /fiqh |
| `coran-tafsir.pdf` | Le Saint Coran (avec tafsir) | Coran | /coran |

Cette liste est définie dans `lib/data/library.ts` (champ `file`). Le lecteur PDF est intégré
directement à la page (via un `<iframe>`) — le fichier s'ouvre sans jamais être téléchargé, et
le numéro de page en cours est retenu automatiquement pour reprendre la lecture plus tard.

Pour ajouter un nouveau livre : dépose le PDF dans `public/assets/books/`, puis ajoute une ligne
dans le tableau `DEFAULT_LIBRARY` de `lib/data/library.ts` avec le même nom de fichier.

## Comptes, sauvegarde cloud et abonnements (Firebase + PayPal + Stripe)

L'app supporte maintenant de vrais comptes utilisateurs, une sauvegarde cloud multi-appareils,
et des abonnements payants (mensuel/annuel) via **PayPal** et **Stripe** (carte bancaire).
Tout est optionnel : tant que les variables d'environnement ci-dessous ne sont pas renseignées,
l'app continue de fonctionner en mode local (comme avant), sans compte ni paiement.

### 1. Créer le projet Firebase (comptes + base de données)

1. Va sur [console.firebase.google.com](https://console.firebase.google.com) → **Ajouter un projet** (gratuit, plan Spark).
2. Dans le projet : **Authentication** → **Get started** → active la méthode **Email/Password**.
3. Toujours dans le projet : **Firestore Database** → **Créer une base de données** → mode production.
4. Dans **Firestore Database > Règles**, colle le contenu du fichier `firestore.rules` (fourni dans ce projet) puis **Publier**. Ces règles empêchent un utilisateur de s'auto-attribuer un abonnement — seul le serveur (après vérification réelle du paiement) peut le faire.
5. Dans **Paramètres du projet > Général**, ajoute une application Web → copie la config qui apparaît dans les variables ci-dessous.
6. Toujours dans **Paramètres du projet**, onglet **Comptes de service** → **Générer une nouvelle clé privée** → télécharge le JSON. Le contenu complet de ce fichier (en une seule ligne) va dans `FIREBASE_SERVICE_ACCOUNT_KEY`.

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...", ...tout le JSON sur une ligne...}
```

### 2. PayPal (abonnements récurrents)

1. Crée une app sur [developer.paypal.com](https://developer.paypal.com/dashboard/applications) (commence en mode **Sandbox** pour tester gratuitement).
2. Dans **Products > Subscriptions**, crée un produit puis deux **Plans** (mensuel, annuel) avec les prix voulus — note leurs **Plan ID**.
3. Variables d'environnement :
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
NEXT_PUBLIC_PAYPAL_PLAN_MONTHLY=
NEXT_PUBLIC_PAYPAL_PLAN_ANNUAL=
PAYPAL_CLIENT_ID=            # même valeur que NEXT_PUBLIC_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=        # dans "API Credentials" de ton app PayPal
PAYPAL_ENV=sandbox           # ou "live" une fois prêt pour la production
```
Le paiement est vérifié côté serveur (`app/api/paypal/confirm`) directement auprès de PayPal avant d'activer l'accès — jamais fait confiance au navigateur.

### 3. Stripe (carte bancaire)

1. Crée un compte sur [dashboard.stripe.com](https://dashboard.stripe.com) (mode Test pour commencer).
2. **Produits** → crée un produit avec deux **Prix** récurrents (mensuel, annuel) — note leurs **Price ID** (`price_...`).
3. **Développeurs > Clés API** → récupère la clé secrète.
4. **Développeurs > Webhooks** → ajoute un endpoint `https://ton-domaine.vercel.app/api/stripe/webhook`, écoute les événements `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` → note le **secret de signature**.
```
STRIPE_SECRET_KEY=
STRIPE_PRICE_MONTHLY=
STRIPE_PRICE_ANNUAL=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=https://ton-domaine.vercel.app
```
Pour tester en local avant de déployer : `stripe listen --forward-to localhost:3000/api/stripe/webhook` (CLI Stripe) te donne un secret de test temporaire.

### Verrouillage premium

**Toujours gratuits** : PDF et quiz de Prière et Ablutions (bases du culte, jamais verrouillées),
tableau de bord, étapes de la prière/wudu, adhkar, suivi d'habitudes, "Mon Combat", Sira, texte
des cours, suivi de lecture du Coran.

**Rotation quotidienne des quiz** (Aqida, Purification, Hadith, Fiqh, Arabe) : chaque jour, 3
sujets sont tirés au sort et deviennent gratuits pour tout le monde (même sélection pour tous,
change automatiquement le lendemain — voir `lib/daily-quiz.ts`). Les 2 sujets restants ce jour-là
sont réservés aux abonnés. Modifie `count` dans `getFreeQuizSlugsToday()` si tu préfères 2 plutôt
que 3.

**Réservé aux abonnés (hors rotation du jour)** : lecture des PDF des autres catégories (Aqida,
Hadith, Fiqh, Coran).

⚠️ **Tant que PayPal/Stripe ne sont pas configurés, personne ne peut devenir premium.** Pour éviter
de bloquer tout le monde avant que le paiement soit prêt, le verrouillage est **désactivé par
défaut**. Ajoute cette variable pour l'activer une fois les paiements en place :
```
NEXT_PUBLIC_PREMIUM_ENFORCEMENT=true
```
Sans cette variable (ou avec toute autre valeur), tout reste accessible à tous, comme aujourd'hui.

### 4. Ajouter toutes ces variables sur Vercel

**Project Settings > Environment Variables** → colle chaque variable ci-dessus, puis redéploie.

### Comment ça fonctionne

- Les prix affichés dans `lib/subscription.ts` (`PLANS`) sont des **exemples (FCFA)** — ajuste-les pour qu'ils correspondent à ce que tu as configuré dans Stripe/PayPal.
- Un utilisateur non connecté continue en mode invité local (comme avant).
- À la première connexion, sa progression locale est automatiquement migrée vers son compte cloud.
- Le statut d'abonnement (`subscriptions/{uid}` dans Firestore) ne peut être mis à "active" que par les routes serveur (`/api/paypal/confirm`, `/api/stripe/webhook`) après vérification réelle du paiement — jamais directement par le navigateur, même en cas de manipulation.
- Le verrouillage premium actuel couvre la lecture des PDF et les quiz (voir ci-dessus) — dis-moi si tu veux étendre ou réduire ce périmètre.

## Rappels (notifications push : Fajr, Adhkar, Coran)

Fonctionnent même quand le site est fermé, via des notifications push classiques (pas besoin
d'app mobile). Page utilisateur : `/rappels`.

### 1. Générer une paire de clés VAPID (une seule fois)

```bash
npx web-push generate-vapid-keys
```
Donne une clé publique et une clé privée. **Ne colle jamais la clé privée dans un chat ou un
fichier suivi par Git** — uniquement dans `.env.local` et les variables Vercel.

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PUBLIC_KEY=            # même valeur que ci-dessus
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:ton-email@example.com
CRON_SECRET=                 # une chaîne aléatoire longue, invente-la toi-même
```

### 2. Le service qui envoie réellement les notifications

⚠️ Le plan **Hobby (gratuit)** de Vercel limite les Cron Jobs à **une seule exécution par jour**,
ce qui bloque même le déploiement si on demande une fréquence plus rapide. Il n'y a donc **pas**
de `vercel.json` avec cron dans ce projet — utilise un service externe gratuit à la place :

1. Crée un compte sur [cron-job.org](https://cron-job.org) (gratuit)
2. Crée un nouveau cron job qui appelle cette URL toutes les 15 minutes :
   ```
   https://ton-domaine.vercel.app/api/cron/reminders
   ```
3. Dans les options avancées du cron job, ajoute un en-tête HTTP personnalisé :
   ```
   Authorization: Bearer LA_VALEUR_DE_CRON_SECRET
   ```

Si tu passes un jour sur le plan **Pro** de Vercel, tu pourras réintroduire un `vercel.json` avec
un cron natif toutes les 15 minutes :
```json
{ "crons": [{ "path": "/api/cron/reminders", "schedule": "*/15 * * * *" }] }
```

### 3. Icône de notification (optionnel)

Le service worker référence `/icon-192.png` — ajoute une image carrée (192×192px) à cet
emplacement dans `public/` si tu veux une icône personnalisée sur les notifications ; sans elle,
la notification s'affiche simplement sans icône.

## Comptes complets et installation mobile (PWA)

- **Mot de passe oublié** : disponible sur `/compte` (envoie un email de réinitialisation Firebase).
- **Suppression de compte** : disponible sur `/compte` → "Zone de danger" — supprime le compte
  Firebase Auth et les données Firestore associées (progression, abonnement, rappels).
- **Installable comme une app mobile** : icônes et manifeste déjà en place
  (`public/manifest.json`, `public/icon-192.png`, `public/icon-512.png`,
  `public/apple-touch-icon.png`). Sur Android/Chrome, un bandeau "Ajouter à l'écran d'accueil"
  apparaît automatiquement ; sur iPhone (Safari), l'utilisateur doit utiliser Partager → "Sur
  l'écran d'accueil" (Apple ne propose pas de bandeau automatique).

## Emails de confirmation

- **Inscription** : Firebase envoie automatiquement un email de vérification à la création du
  compte (aucune configuration supplémentaire). Tant que l'email n'est pas confirmé, un bandeau
  avec un bouton "Renvoyer l'email" apparaît sur `/compte`.
- **Paiement (PayPal/Stripe)** : un email de confirmation "Abonnement activé" est envoyé
  automatiquement via **Resend** juste après l'activation réelle de l'abonnement (donc jamais
  envoyé sans paiement réellement vérifié). Optionnel — si `RESEND_API_KEY` n'est pas configurée,
  le paiement fonctionne quand même, l'email est simplement sauté.

Pour activer les emails de paiement :
1. Crée un compte gratuit sur [resend.com](https://resend.com)
2. Vérifie un domaine d'envoi (ou utilise leur domaine de test pour essayer rapidement)
3. Ajoute `RESEND_API_KEY` et `RESEND_FROM_EMAIL` (voir `.env.example`)

Note : Stripe et PayPal envoient aussi chacun leur propre reçu de paiement automatique
(configurable dans leurs paramètres respectifs) — celui de Resend est un email supplémentaire,
personnalisé avec la marque de l'application.

## Toutes les variables d'environnement en un seul endroit

Le fichier [`.env.example`](.env.example) à la racine du projet regroupe **toutes** les
variables utilisées par l'application (Firebase, PayPal, Stripe, rappels push, emails). Copie-le
en `.env.local` et remplis au fur et à mesure de ce que tu actives.

## SEO et référencement pour les IA (GEO)

- **Métadonnées par page** : chaque module (Prière, Ablutions, Adhkar, Coran, Aqida, etc.) a
  maintenant son propre titre et sa propre description, au lieu d'hériter du titre générique du
  site — important pour le référencement Google et pour que les IA (ChatGPT, Perplexity, Google
  AI Overviews) comprennent et citent correctement chaque page.
- **`app/sitemap.ts`** et **`app/robots.ts`** : générés automatiquement (`/sitemap.xml` et
  `/robots.txt`), avec les pages de compte/paiement exclues de l'indexation.
- **OpenGraph + Twitter Card** : aperçus soignés quand le lien est partagé (WhatsApp, Twitter/X,
  etc.), avec l'icône croissant doré générée précédemment.
- **Données structurées (JSON-LD)** : `WebSite` + `Organization` injectées dans le `<head>`, pour
  aider les moteurs de recherche et les IA à comprendre ce qu'est le site.
- **`public/llms.txt`** : convention émergente (comme `robots.txt`, mais pour les IA génératives)
  qui décrit le site, ses pages principales et un avertissement sur la nature pédagogique du
  contenu religieux — pensé pour le référencement "GEO" (Generative Engine Optimization).

⚠️ Renseigne `NEXT_PUBLIC_SITE_URL` (déjà dans `.env.example`) avec ton vrai domaine — il est
utilisé par le sitemap, les robots, les métadonnées OpenGraph et le JSON-LD pour générer des URLs
absolues correctes.

### Pour aller plus loin (non fait, à ta demande si tu veux)

- Ajouter des images `og:image` dédiées par module (actuellement toutes les pages partagent
  l'icône de l'app comme aperçu)
- Soumettre le sitemap à [Google Search Console](https://search.google.com/search-console) et
  [Bing Webmaster Tools](https://www.bing.com/webmasters) une fois en ligne
- Ajouter du contenu FAQ structuré (`FAQPage` en JSON-LD) sur les pages les plus recherchées
  (ex. "comment faire le wudu", "comment prier") pour apparaître dans les extraits enrichis

## Audio (Coran automatique, Adhkar à toi de fournir)

- **Coran** : lecteur audio intégré sur `/coran`, sans rien à configurer — utilise l'API publique
  et gratuite [Al Quran Cloud](https://alquran.cloud) (CDN `cdn.islamic.network`), avec 4
  récitateurs au choix (Alafasy, Al-Husary, Abdul Basit, Al-Minshawi).
- **Adhkar** : le code est prêt (bouton "Écouter" sur chaque carte, caché proprement si le
  fichier n'existe pas), mais **il n'existe pas d'API publique équivalente pour les adhkar** — il
  faut fournir les fichiers toi-même. Sources gratuites et largement diffusées :
  - [IslamHouse.com](https://islamhouse.com) → recherche "Hisnul Muslim audio" (nombreuses langues/récitateurs)
  - [Archive.org](https://archive.org) → recherche "Hisnul Muslim" ou "Fortress of the Muslim audio"
  
  Dépose chaque fichier dans `public/assets/audio/adhkar/` en le nommant **exactement** comme
  l'id du dhikr correspondant dans `lib/data/adhkar.ts` (ex. `matin-1.mp3`, `soir-2.mp3`) — la
  liste complète des ids s'y trouve.

## reCAPTCHA (anti-bot à l'inscription)

1. Va sur [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin/create)
2. Choisis **reCAPTCHA v2** → "Cases à cocher 'Je ne suis pas un robot'"
3. Ajoute ton domaine (`yonu-islam.vercel.app`)
4. Récupère les deux clés :
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
```
Sans ces variables, l'inscription fonctionne normalement, juste sans protection anti-bot.

## Panneau d'administration (`/escanor`) — upload direct des PDF

L'ancienne méthode (déposer les PDF dans un dossier puis les committer sur Git) est
**remplacée** par un envoi direct depuis l'interface, stocké sur **Firebase Storage** — plus
aucun risque de perdre des fichiers lors d'une synchronisation de code.

**Pour y accéder** :
1. Crée un compte normal sur `/compte` avec l'email exact `yonu.islam@gmail.com` (mot de passe
   au choix — c'est un compte séparé de ta boîte Gmail, juste le même email)
2. Une fois connecté, le lien **"Administration"** apparaît dans la barre latérale, menant à `/escanor`

**Ce qu'on y trouve** :
- La liste des 12 livres de base (titre/catégorie figés dans le code) avec un bouton **"Envoyer un PDF"** pour chacun
- Un formulaire pour créer de nouveaux livres (titre, catégorie, nombre de pages), puis leur envoyer un PDF de la même façon
- Les fichiers ne sont **jamais accessibles publiquement** : ils passent uniquement par la route
  serveur `/api/books/[bookId]`, qui vérifie l'identité et l'abonnement avant de les servir

**Configuration requise (une fois)** :
1. Assure-toi que `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` est bien renseignée (déjà dans `.env.example`)
2. Publie les règles de sécurité Storage : Firebase Console → **Storage** → si ce n'est pas encore
   activé, clique sur **Commencer** pour créer le bucket → onglet **Règles** → colle le contenu de
   `storage.rules` (fourni dans le projet) → **Publier**
3. Republie aussi `firestore.rules` (deux nouvelles collections : `library_catalog`, `book_files`)

## Surlignage PDF

Sélectionne du texte dans le lecteur (`/lecture`) → un bouton **"Surligner"** apparaît → clique
dessus pour l'enregistrer. Clique sur un surlignage existant pour le supprimer. Sauvegardé par
livre et par utilisateur dans Firestore (collection `highlights`), positionné en pourcentage de
la page — donc toujours bien placé quelle que soit la taille d'écran utilisée.

⚠️ **Compromis assumé** : activer la sélection de texte (nécessaire pour surligner) permet aussi
techniquement de copier du texte avec Ctrl+C. C'est un vrai compromis entre "fonctionnalité
utile" et "protection maximale du contenu" — copier quelques lignes est très différent de
télécharger le PDF entier, donc j'ai jugé que ça en valait la peine, mais c'est bon à savoir.

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
4. Clique sur **Deploy**.

## Structure du projet

```
app/                 pages (App Router) — une route par module
components/          composants réutilisables (UI, sidebar, cartes, lecteur PDF, heatmap...)
lib/data/            contenu statique (niveaux, adhkar, sira, cours, étapes, bibliothèque)
lib/store.tsx        état de l'application (XP, habitudes, journal, page de lecture...) + persistance locale
public/assets/       images des étapes et PDF des livres (voir tableaux ci-dessus)
```

## Prochaines étapes suggérées

1. Relire/valider le contenu religieux (cours, quiz) avec une personne qualifiée avant
   publication — le contenu fourni est un point de départ pédagogique, pas une fatwa.
2. Déposer les images d'étapes et les PDF aux emplacements indiqués ci-dessus.
3. Si besoin plus tard : synchronisation multi-appareils via un compte (ajout d'un backend).
