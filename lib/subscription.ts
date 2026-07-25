"use client";

import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { getFirebaseDb } from "./firebase/client";

export type PlanId = "monthly" | "annual";

// ⚠️ Prix d'exemple — à ajuster selon ta tarification réelle (doivent correspondre
// aux prix configurés côté Stripe/PayPal).
export const PLANS: { id: PlanId; label: string; priceFcfa: number; period: string }[] = [
  { id: "monthly", label: "Mensuel", priceFcfa: 2000, period: "/ mois" },
  { id: "annual", label: "Annuel", priceFcfa: 20000, period: "/ an" },
];

export type SubscriptionStatus = "none" | "active" | "expired";
export type SubscriptionProvider = "paypal" | "stripe" | null;

export type SubscriptionData = {
  plan: PlanId | null;
  status: SubscriptionStatus;
  provider: SubscriptionProvider;
  reference: string | null;
  expiresAt: string | null; // ISO
  updatedAt: string | null;
};

const DEFAULT_SUB: SubscriptionData = {
  plan: null,
  status: "none",
  provider: null,
  reference: null,
  expiresAt: null,
  updatedAt: null,
};

/** Abonnement de l'utilisateur connecté, mis à jour en temps réel depuis Firestore.
 * Le statut ne passe JAMAIS à "active" côté client : seules les routes API serveur
 * (après vérification réelle auprès de PayPal/Stripe) peuvent l'écrire — voir les
 * règles Firestore dans firestore.rules. */
export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData>(DEFAULT_SUB);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!user || !db) {
      setSubscription(DEFAULT_SUB);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = doc(db, "subscriptions", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setSubscription(
          snap.exists() ? { ...DEFAULT_SUB, ...(snap.data() as Partial<SubscriptionData>) } : DEFAULT_SUB
        );
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [user?.uid]);

  const hasPremium =
    subscription.status === "active" &&
    (!subscription.expiresAt || new Date(subscription.expiresAt).getTime() > Date.now());

  return { subscription, hasPremium, loading };
}
