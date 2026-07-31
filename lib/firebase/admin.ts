import { cert, getApps, initializeApp, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { getStorage, Storage } from "firebase-admin/storage";

let adminApp: App | null = null;

/** Initialise Firebase Admin à partir de la variable d'environnement
 * FIREBASE_SERVICE_ACCOUNT_KEY (le JSON complet du compte de service, en une ligne).
 * Renvoie `null` si elle n'est pas configurée — les routes API le gèrent proprement. */
function ensureAdminApp() {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!json) return null;
  if (!adminApp) {
    const serviceAccount = JSON.parse(json);
    adminApp = getApps().length
      ? getApps()[0]
      : initializeApp({
          credential: cert(serviceAccount),
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
  }
  return adminApp;
}

export function getAdminDb(): Firestore | null {
  const app = ensureAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

export function getAdminAuth(): Auth | null {
  const app = ensureAdminApp();
  if (!app) return null;
  return getAuth(app);
}

export function getAdminStorage(): Storage | null {
  const app = ensureAdminApp();
  if (!app) return null;
  return getStorage(app);
}
