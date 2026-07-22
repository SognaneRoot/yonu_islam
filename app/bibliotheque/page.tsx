"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAppData } from "@/lib/store";
import { Heart, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";

export default function BibliothequePage() {
  const { data, update, toggleFavorite, addXp } = useAppData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("Tous");

  const categories = useMemo(
    () => ["Tous", ...Array.from(new Set(data.library.map((b) => b.category)))],
    [data.library]
  );

  const filtered = data.library.filter(
    (b) =>
      (filter === "Tous" || b.category === filter) &&
      b.title.toLowerCase().includes(query.toLowerCase())
  );

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    update((prev) => ({
      ...prev,
      library: [
        ...files.map((f) => ({
          id: crypto.randomUUID(),
          title: f.name.replace(/\.pdf$/i, ""),
          category: "Importé",
          pages: 0,
          progress: 0,
          favorite: false,
        })),
        ...prev.library,
      ],
    }));
    addXp(files.length * 5);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-beige-50">Bibliothèque</h1>
          <p className="mt-1 text-sm text-sand-400">{data.library.length} document(s)</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-medium text-night-800 shadow-soft transition-colors hover:bg-gold-400">
          <Upload size={16} /> Importer un PDF
          <input type="file" accept="application/pdf" multiple className="hidden" onChange={handleImport} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un livre..."
            className="w-full rounded-xl border border-white/8 bg-night-700/50 py-2.5 pl-9 pr-3.5 text-sm text-beige-100 placeholder:text-sand-500 focus:border-gold-500/40 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                filter === c
                  ? "border-emerald-500/50 bg-emerald-500/15 text-beige-100"
                  : "border-white/8 text-sand-400 hover:text-beige-100"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((book) => (
          <Card key={book.id}>
            <CardContent className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-display text-base text-beige-50">{book.title}</p>
                  <p className="text-xs text-sand-400">{book.category}{book.pages ? ` · ${book.pages} pages` : ""}</p>
                </div>
                <button onClick={() => toggleFavorite(book.id)} aria-label="favori">
                  <Heart
                    size={16}
                    className={book.favorite || data.favorites.includes(book.id) ? "fill-gold-500 text-gold-500" : "text-sand-500"}
                  />
                </button>
              </div>
              <Progress value={book.progress} />
              <div className="flex items-center justify-between text-xs text-sand-400">
                <span>{book.progress}% lu</span>
                <button
                  className="text-gold-400 hover:underline"
                  onClick={() =>
                    update((prev) => ({
                      ...prev,
                      library: prev.library.map((b) =>
                        b.id === book.id ? { ...b, progress: Math.min(100, b.progress + 10) } : b
                      ),
                    }))
                  }
                >
                  Continuer la lecture
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-sand-400">Aucun document trouvé.</p>
        )}
      </div>
    </div>
  );
}
