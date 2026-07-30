"use client";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { getFirebaseDb } from "./firebase/client";

export type HighlightRect = { x: number; y: number; width: number; height: number }; // % du conteneur de la page

export type Highlight = {
  id: string;
  page: number;
  rects: HighlightRect[];
  text: string;
  createdAt: string;
};

export function useHighlights(bookId: string | null) {
  const { user } = useAuth();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  const docId = user && bookId ? `${user.uid}_${bookId}` : null;

  useEffect(() => {
    const db = getFirebaseDb();
    if (!docId || !db) {
      setHighlights([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = doc(db, "highlights", docId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        setHighlights(snap.exists() ? (snap.data().items as Highlight[]) || [] : []);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, [docId]);

  async function persist(items: Highlight[]) {
    const db = getFirebaseDb();
    if (!docId || !db || !user) return;
    await setDoc(doc(db, "highlights", docId), {
      uid: user.uid,
      items,
      updatedAt: new Date().toISOString(),
    });
  }

  async function addHighlight(h: { page: number; rects: HighlightRect[]; text: string }) {
    const newItem: Highlight = { ...h, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const updated = [...highlights, newItem];
    setHighlights(updated);
    await persist(updated);
  }

  async function removeHighlight(id: string) {
    const updated = highlights.filter((h) => h.id !== id);
    setHighlights(updated);
    await persist(updated);
  }

  return { highlights, loading, addHighlight, removeHighlight };
}
