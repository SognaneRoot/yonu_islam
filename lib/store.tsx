"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_HABITS } from "./data/habits";
import { DEFAULT_LIBRARY, LibraryItem } from "./data/library";
import { todayISO } from "./utils";

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

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData({ ...DEFAULT_DATA, ...JSON.parse(raw) });
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
