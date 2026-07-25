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
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCr-HHaK5oLbwfApcExs_AaZtQtAB3bQlg",
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="yonu-islam.firebaseapp.com",
NEXT_PUBLIC_FIREBASE_PROJECT_ID="yonu-islam",
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="yonu-islam.firebasestorage.app",
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="716023704857",
NEXT_PUBLIC_FIREBASE_APP_ID="1:716023704857:web:e9f29fc1707fc2d8aee988",
measurementId: "G-66QD2ZFG4B"
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

### 4. Ajouter toutes ces variables sur Vercel

**Project Settings > Environment Variables** → colle chaque variable ci-dessus, puis redéploie.

### Comment ça fonctionne

- Les prix affichés dans `lib/subscription.ts` (`PLANS`) sont des **exemples (FCFA)** — ajuste-les pour qu'ils correspondent à ce que tu as configuré dans Stripe/PayPal.
- Un utilisateur non connecté continue en mode invité local (comme avant).
- À la première connexion, sa progression locale est automatiquement migrée vers son compte cloud.
- Le statut d'abonnement (`subscriptions/{uid}` dans Firestore) ne peut être mis à "active" que par les routes serveur (`/api/paypal/confirm`, `/api/stripe/webhook`) après vérification réelle du paiement — jamais directement par le navigateur, même en cas de manipulation.
- Rien n'est encore "verrouillé" derrière l'abonnement dans le contenu actuel — dis-moi quelles sections doivent devenir premium (ex. Bibliothèque complète, quiz, etc.) et je les câblerai avec `useSubscription()`.



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
