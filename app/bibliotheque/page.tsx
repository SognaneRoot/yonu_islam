"use client";

import { BookCard } from "@/components/book-card";
import { useAppData } from "@/lib/store";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export default function BibliothequePage() {
  const { data } = useAppData();
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-beige-50">Bibliothèque</h1>
        <p className="mt-1 text-sm text-sand-400">{data.library.length} document(s)</p>
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
          <BookCard key={book.id} book={book} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-sand-400">Aucun document trouvé.</p>
        )}
      </div>
    </div>
  );
}
