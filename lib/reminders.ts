"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { getFirebaseDb } from "./firebase/client";

export type ReminderPrefs = {
  subscription: PushSubscriptionJSON | null;
  timezone: string | null;
  fajrEnabled: boolean;
  lat: number | null;
  lon: number | null;
  adhkarMatinEnabled: boolean;
  adhkarMatinTime: string; // "HH:mm"
  adhkarSoirEnabled: boolean;
  adhkarSoirTime: string;
  coranEnabled: boolean;
  coranTime: string;
  lastSent: Record<string, string>;
};

const DEFAULT_PREFS: ReminderPrefs = {
  subscription: null,
  timezone: null,
  fajrEnabled: false,
  lat: null,
  lon: null,
  adhkarMatinEnabled: false,
  adhkarMatinTime: "06:00",
  adhkarSoirEnabled: false,
  adhkarSoirTime: "18:00",
  coranEnabled: false,
  coranTime: "20:00",
  lastSent: {},
};

export function useReminderPrefs() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<ReminderPrefs>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!user || !db) {
      setPrefs(DEFAULT_PREFS);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = doc(db, "push_subscriptions", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setPrefs(snap.exists() ? { ...DEFAULT_PREFS, ...(snap.data() as Partial<ReminderPrefs>) } : DEFAULT_PREFS);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [user?.uid]);

  async function savePrefs(partial: Partial<ReminderPrefs>) {
    const db = getFirebaseDb();
    if (!user || !db) throw new Error("Connecte-toi pour activer les rappels.");
    await setDoc(
      doc(db, "push_subscriptions", user.uid),
      { ...partial, updatedAt: new Date().toISOString() },
      { merge: true }
    );
  }

  return { prefs, loading, savePrefs };
}
