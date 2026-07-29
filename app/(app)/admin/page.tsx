"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseDb } from "@/lib/firebase/client";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { Pencil, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

const CATEGORIES = [
  "Prière",
  "Ablutions",
  "Aqida",
  "Purification du cœur",
  "Hadith",
  "Sira",
  "Fiqh",
  "Arabe",
  "Coran",
];

type CatalogBook = {
  id: string;
  title: string;
  category: string;
  file: string;
  pages: number;
};

const EMPTY_FORM = { id: "", title: "", category: CATEGORIES[0], file: "", pages: 0 };

export default function AdminPage() {
  const { user, loading, firebaseReady } = useAuth();
  const [books, setBooks] = useState<CatalogBook[]>([]);
  const [form, setForm] = useState<CatalogBook>(EMPTY_FORM as CatalogBook);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isAdmin = !!user && !!ADMIN_EMAIL && user.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    const db = getFirebaseDb();
    if (!db) return;
    const q = query(collection(db, "library_catalog"), orderBy("title"));
    const unsub = onSnapshot(q, (snap) => {
      setBooks(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, [isAdmin]);

  if (!firebaseReady) return <p className="text-sm text-sand-400">Firebase non configuré.</p>;
  if (loading) return null;

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-300">
            <ShieldAlert size={16} /> Accès réservé
          </CardTitle>
          <CardDescription>Cette page est réservée à l'administrateur.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  function startEdit(book: CatalogBook) {
    setEditingId(book.id);
    setForm(book);
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM as CatalogBook);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.title.trim() || !form.file.trim() || !form.category) {
      setError("Titre, catégorie et nom de fichier sont obligatoires.");
      return;
    }
    const db = getFirebaseDb();
    if (!db) return;
    setBusy(true);
    try {
      const id =
        editingId ||
        form.title
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ||
        `livre-${Date.now()}`;
      await setDoc(doc(db, "library_catalog", id), {
        title: form.title.trim(),
        category: form.category,
        file: form.file.trim(),
        pages: Number(form.pages) || 0,
      });
      resetForm();
    } catch {
      setError("Échec de l'enregistrement.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id: string) {
    const db = getFirebaseDb();
    if (!db) return;
    if (!confirm("Supprimer ce livre du catalogue ?")) return;
    await deleteDoc(doc(db, "library_catalog", id));
    if (editingId === id) resetForm();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Administration — Bibliothèque</h1>
        <p className="mt-1 text-sm text-sand-400">
          Ajoute des livres sans toucher au code. Dépose le PDF correspondant dans{" "}
          <code className="text-gold-400">private-books/</code> (ou{" "}
          <code className="text-gold-400">public/assets/books/</code> pour les catégories
          toujours gratuites) avec exactement le nom de fichier indiqué ici.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Modifier le livre" : "Ajouter un livre"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-sand-400">Titre</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-night-700/50 px-3 py-2 text-sm text-beige-100"
                placeholder="Ex. Al-Adab Al-Mufrad"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-sand-400">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-night-700/50 px-3 py-2 text-sm text-beige-100"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-sand-400">Nom du fichier PDF</label>
              <input
                value={form.file}
                onChange={(e) => setForm({ ...form, file: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-night-700/50 px-3 py-2 text-sm text-beige-100"
                placeholder="ex-adab-mufrad.pdf"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-sand-400">Nombre de pages</label>
              <input
                type="number"
                value={form.pages}
                onChange={(e) => setForm({ ...form, pages: Number(e.target.value) })}
                className="w-full rounded-lg border border-white/10 bg-night-700/50 px-3 py-2 text-sm text-beige-100"
              />
            </div>
            {error && <p className="text-xs text-red-300 sm:col-span-2">{error}</p>}
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" disabled={busy}>
                <Plus size={16} /> {editingId ? "Enregistrer" : "Ajouter"}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Livres ajoutés ({books.length})</CardTitle>
          <CardDescription>
            Les 12 livres de base restent gérés dans le code (lib/data/library.ts) et n'apparaissent pas ici.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {books.length === 0 && <p className="text-sm text-sand-400">Aucun livre ajouté pour l'instant.</p>}
          {books.map((book) => (
            <div
              key={book.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/8 px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-beige-100">{book.title}</p>
                <p className="text-xs text-sand-400">
                  {book.category} · {book.file} · {book.pages} pages
                </p>
              </div>
              <div className="flex gap-1.5">
                <Button size="sm" variant="outline" onClick={() => startEdit(book)}>
                  <Pencil size={13} />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(book.id)}>
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
