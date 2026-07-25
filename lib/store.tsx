"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { DEFAULT_HABITS } from "./data/habits";
import { DEFAULT_LIBRARY, LibraryItem } from "./data/library";
import { todayISO } from "./utils";
import { useAuth } from "./auth-context";
import { getFirebaseDb } from "./firebase/client";

export type JournalEntry = {
  id: string;
  date: string;
  note: string;
  trigger?: string;
  type: "relapse" | "reflexion";
};

export type AppData = {
  xp: number;
  streakDays: number;
  lastActiveDate: string | null;
  habitLog: Record<string, Record<string, boolean>>; // date -> habitId -> done
  combat: {
    cleanSince: string | null;
    journal: JournalEntry[];
  };
  adhkarDone: Record<string, boolean>; // dhikrId -> memorized
  notes: Record<string, string>; // contentId -> note text
  favorites: string[];
  quizScores: Record<string, number>; // categorySlug -> best score %
  library: LibraryItem[];
  weeklyGoalMinutes: number;
  studyMinutesLog: Record<string, number>; // date -> minutes
};

const DEFAULT_DATA: AppData = {
  xp: 120,
  streakDays: 0,
  lastActiveDate: null,
  habitLog: {},
  combat: { cleanSince: todayISO(), journal: [] },
  adhkarDone: {},
  notes: {},
  favorites: [],
  quizScores: {},
  library: DEFAULT_LIBRARY,
  weeklyGoalMinutes: 210,
  studyMinutesLog: {},
};

const STORAGE_KEY = "mcva:data:v1";

type Ctx = {
  data: AppData;
  update: (fn: (prev: AppData) => AppData) => void;
  addXp: (amount: number) => void;
  toggleHabit: (habitId: string, date?: string) => void;
  toggleAdhkar: (dhikrId: string) => void;
  setNote: (contentId: string, text: string) => void;
  toggleFavorite: (id: string) => void;
  logRelapse: (trigger: string, note: string) => void;
  addReflexion: (note: string) => void;
  setQuizScore: (slug: string, score: number) => void;
  logStudyMinutes: (minutes: number) => void;
  ready: boolean;
};

const AppDataContext = createContext<Ctx | null>(null);

function mergeLibraryWithDefaults(saved?: LibraryItem[]) {
  return DEFAULT_LIBRARY.map((defaultItem) => {
    const match = saved?.find((b) => b.id === defaultItem.id);
    return match ? { ...defaultItem, progress: match.progress, favorite: match.favorite } : defaultItem;
  });
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [ready, setReady] = useState(false);
  const cloudReadyRef = useRef(false);
  const dataRef = useRef(data);
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Fusionne la bibliothèque sauvegardée avec celle du code : les livres déjà
        // connus gardent la progression de l'utilisateur, et tout nouveau livre ajouté
        // dans lib/data/library.ts apparaît automatiquement, sans avoir à vider le cache.
        setData({ ...DEFAULT_DATA, ...parsed, library: mergeLibraryWithDefaults(parsed.library) });
      }
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // storage full or unavailable — silently ignore
    }
  }, [data, ready]);

  // Synchronisation cloud (Firebase) : au login, on récupère le document de
  // l'utilisateur (ou on migre les données locales/invité s'il n'en a pas encore).
  // Au logout, on revient à la version locale.
  useEffect(() => {
    const uid = user?.uid;
    const db = getFirebaseDb();

    if (!uid || !db) {
      cloudReadyRef.current = false;
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const ref = doc(db, "users", uid);
        const snap = await getDoc(ref);
        if (cancelled) return;
        if (snap.exists()) {
          const cloud = snap.data() as Partial<AppData>;
          setData((prev) => ({
            ...DEFAULT_DATA,
            ...prev,
            ...cloud,
            library: mergeLibraryWithDefaults(cloud.library),
          }));
        } else {
          // Première connexion sur ce compte : on migre la progression locale/invité.
          await setDoc(ref, dataRef.current);
        }
      } catch {
        // hors-ligne ou règles Firestore restrictives — on continue en local
      } finally {
        if (!cancelled) cloudReadyRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  // Écriture cloud, avec un léger anti-rebond pour éviter d'écrire à chaque frappe
  useEffect(() => {
    if (!ready) return;
    const uid = user?.uid;
    const db = getFirebaseDb();
    if (!uid || !db || !cloudReadyRef.current) return;

    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      setDoc(doc(db, "users", uid), data).catch(() => {
        // écriture cloud échouée (hors-ligne) — les données restent sûres en local
      });
    }, 800);

    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, [data, ready, user?.uid]);

  // streak bookkeeping based on any habit interaction today
  useEffect(() => {
    if (!ready) return;
    const today = todayISO();
    if (data.lastActiveDate === today) return;
    setData((prev) => {
      if (!prev.lastActiveDate) {
        return { ...prev, lastActiveDate: today, streakDays: 1 };
      }
      const diffDays = Math.round(
        (new Date(today).getTime() - new Date(prev.lastActiveDate).getTime()) / 86400000
      );
      if (diffDays === 1) {
        return { ...prev, lastActiveDate: today, streakDays: prev.streakDays + 1 };
      }
      if (diffDays > 1) {
        return { ...prev, lastActiveDate: today, streakDays: 1 };
      }
      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const value = useMemo<Ctx>(() => {
    const update = (fn: (prev: AppData) => AppData) => setData((prev) => fn(prev));

    return {
      data,
      update,
      ready,
      addXp: (amount: number) => update((prev) => ({ ...prev, xp: prev.xp + amount })),
      toggleHabit: (habitId: string, date = todayISO()) =>
        update((prev) => {
          const dayLog = { ...(prev.habitLog[date] || {}) };
          const wasDone = !!dayLog[habitId];
          dayLog[habitId] = !wasDone;
          return {
            ...prev,
            habitLog: { ...prev.habitLog, [date]: dayLog },
            xp: prev.xp + (wasDone ? -5 : 5),
          };
        }),
      toggleAdhkar: (dhikrId: string) =>
        update((prev) => ({
          ...prev,
          adhkarDone: { ...prev.adhkarDone, [dhikrId]: !prev.adhkarDone[dhikrId] },
        })),
      setNote: (contentId: string, text: string) =>
        update((prev) => ({ ...prev, notes: { ...prev.notes, [contentId]: text } })),
      toggleFavorite: (id: string) =>
        update((prev) => ({
          ...prev,
          favorites: prev.favorites.includes(id)
            ? prev.favorites.filter((f) => f !== id)
            : [...prev.favorites, id],
        })),
      logRelapse: (trigger: string, note: string) =>
        update((prev) => ({
          ...prev,
          combat: {
            cleanSince: todayISO(),
            journal: [
              { id: crypto.randomUUID(), date: todayISO(), note, trigger, type: "relapse" },
              ...prev.combat.journal,
            ],
          },
        })),
      addReflexion: (note: string) =>
        update((prev) => ({
          ...prev,
          combat: {
            ...prev.combat,
            journal: [
              { id: crypto.randomUUID(), date: todayISO(), note, type: "reflexion" },
              ...prev.combat.journal,
            ],
          },
          xp: prev.xp + 10,
        })),
      setQuizScore: (slug: string, score: number) =>
        update((prev) => ({
          ...prev,
          quizScores: {
            ...prev.quizScores,
            [slug]: Math.max(prev.quizScores[slug] || 0, score),
          },
          xp: prev.xp + Math.round(score / 10),
        })),
      logStudyMinutes: (minutes: number) =>
        update((prev) => {
          const date = todayISO();
          return {
            ...prev,
            studyMinutesLog: {
              ...prev.studyMinutesLog,
              [date]: (prev.studyMinutesLog[date] || 0) + minutes,
            },
            xp: prev.xp + Math.round(minutes / 2),
          };
        }),
    };
  }, [data, ready]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
