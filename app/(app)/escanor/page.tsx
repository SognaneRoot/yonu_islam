"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseDb } from "@/lib/firebase/client";
import { DEFAULT_LIBRARY } from "@/lib/data/library";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { upload } from "@vercel/blob/client";
import { CheckCircle2, Pencil, Plus, ShieldAlert, Trash2, Upload } from "lucide-react";
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
  pages: number;
};

type FileStatus = Record<string, boolean>; // bookId -> a un fichier dans Storage

const EMPTY_FORM = { id: "", title: "", category: CATEGORIES[0], pages: 0 };

export default function EscanorPage() {
  const { user, loading, firebaseReady } = useAuth();
  const [catalogBooks, setCatalogBooks] = useState<CatalogBook[]>([]);
  const [fileStatus, setFileStatus] = useState<FileStatus>({});
  const [form, setForm] = useState<CatalogBook>(EMPTY_FORM as CatalogBook);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const isAdmin = !!user && !!ADMIN_EMAIL && user.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) return;
    const db = getFirebaseDb();
    if (!db) return;
    const q = query(collection(db, "library_catalog"), orderBy("title"));
    const unsubCatalog = onSnapshot(q, (snap) => {
      setCatalogBooks(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    const unsubFiles = onSnapshot(collection(db, "book_files"), (snap) => {
      const status: FileStatus = {};
      snap.docs.forEach((d) => {
        status[d.id] = !!d.data().blobUrl;
      });
      setFileStatus(status);
    });
    return () => {
      unsubCatalog();
      unsubFiles();
    };
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
          <CardDescription>
            Cette page est réservée à l'administrateur. Connecte-toi sur /compte avec le compte
            correspondant à l'email admin configuré.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-xs text-sand-500">
          <p>Connecté avec : {user?.email || "personne (déconnecté)"}</p>
          <p>Email admin attendu : {ADMIN_EMAIL || "⚠️ NEXT_PUBLIC_ADMIN_EMAIL n'est pas configurée sur Vercel"}</p>
        </CardContent>
      </Card>
    );
  }

  async function handleUpload(bookId: string, file: File) {
    setError(null);
    if (file.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés.");
      return;
    }
    if (!user) return;
    setUploadingId(bookId);
    try {
      const idToken = await user.getIdToken();
      await upload(`books/${bookId}.pdf`, file, {
        access: "public",
        handleUploadUrl: "/api/blob-upload",
        clientPayload: idToken,
      });
      // La confirmation (écriture dans book_files) arrive via le webhook serveur
      // onUploadCompleted — l'écoute Firestore ci-dessus mettra fileStatus à jour toute seule.
    } catch (err: any) {
      setError(`Échec de l'envoi : ${err?.message || "erreur inconnue"}`);
    } finally {
      setUploadingId(null);
    }
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
    if (!form.title.trim() || !form.category) {
      setError("Titre et catégorie sont obligatoires.");
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
          Envoie directement les PDF ici — plus besoin de manipuler des fichiers via Git.
        </p>
      </div>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <Card>
        <CardHeader>
          <CardTitle>Livres de base (12)</CardTitle>
          <CardDescription>
            Titre/catégorie gérés dans le code — envoie juste le PDF correspondant à chacun.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {DEFAULT_LIBRARY.map((book) => (
            <UploadRow
              key={book.id}
              id={book.id}
              title={book.title}
              category={book.category}
              hasFile={!!fileStatus[book.id]}
              uploading={uploadingId === book.id}
              onUpload={(file) => handleUpload(book.id, file)}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Modifier un livre ajouté" : "Ajouter un nouveau livre"}</CardTitle>
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
              <label className="mb-1 block text-xs text-sand-400">Nombre de pages</label>
              <input
                type="number"
                value={form.pages}
                onChange={(e) => setForm({ ...form, pages: Number(e.target.value) })}
                className="w-full rounded-lg border border-white/10 bg-night-700/50 px-3 py-2 text-sm text-beige-100"
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" disabled={busy}>
                <Plus size={16} /> {editingId ? "Enregistrer" : "Créer la fiche"}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={resetForm}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
          <p className="mt-2 text-xs text-sand-500">
            Crée d'abord la fiche (titre/catégorie), puis envoie le PDF dans la liste ci-dessous
            une fois qu'elle apparaît.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Livres ajoutés ({catalogBooks.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {catalogBooks.length === 0 && (
            <p className="text-sm text-sand-400">Aucun livre ajouté pour l'instant.</p>
          )}
          {catalogBooks.map((book) => (
            <div key={book.id} className="space-y-2 rounded-xl border border-white/8 p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-beige-100">{book.title}</p>
                  <p className="text-xs text-sand-400">
                    {book.category} · {book.pages} pages
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
              <UploadRow
                id={book.id}
                title=""
                category=""
                compact
                hasFile={!!fileStatus[book.id]}
                uploading={uploadingId === book.id}
                onUpload={(file) => handleUpload(book.id, file)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function UploadRow({
  id,
  title,
  category,
  hasFile,
  uploading,
  onUpload,
  compact = false,
}: {
  id: string;
  title: string;
  category: string;
  hasFile: boolean;
  uploading: boolean;
  onUpload: (file: File) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "flex items-center gap-3"
          : "flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/8 px-3.5 py-2.5"
      }
    >
      {!compact && (
        <div className="min-w-0">
          <p className="truncate text-beige-100">{title}</p>
          <p className="text-xs text-sand-400">{category}</p>
        </div>
      )}
      <div className="flex items-center gap-2">
        {hasFile ? (
          <span className="flex items-center gap-1 text-xs text-emerald-300">
            <CheckCircle2 size={13} /> PDF envoyé
          </span>
        ) : (
          <span className="text-xs text-sand-500">Aucun PDF</span>
        )}
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-beige-100 hover:bg-white/5">
          <Upload size={13} />
          {uploading ? "Envoi..." : hasFile ? "Remplacer" : "Envoyer un PDF"}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </div>
  );
}
