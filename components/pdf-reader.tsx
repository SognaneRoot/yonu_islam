"use client";

import { BookOpen, X } from "lucide-react";
import { useState } from "react";

export function PdfReader({
  file,
  title,
  page,
  totalPages,
  onPageChange,
}: {
  file: string;
  title: string;
  page: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:underline"
      >
        <BookOpen size={13} />
        {open ? "Fermer" : page > 1 ? `Reprendre — page ${page}` : "Lire"}
      </button>

      {open && (
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-night-700/70 px-3 py-1.5">
            <div className="flex items-center gap-1.5 text-xs text-sand-400">
              <span>Page</span>
              <input
                type="number"
                min={1}
                max={totalPages || undefined}
                value={page}
                onChange={(e) => onPageChange(Number(e.target.value) || 1)}
                className="w-14 rounded-md border border-white/10 bg-night-800 px-1.5 py-0.5 text-center text-beige-100 focus:border-gold-500/40 focus:outline-none"
              />
              {!!totalPages && <span>/ {totalPages}</span>}
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-sand-400 hover:bg-white/5 hover:text-beige-100"
              aria-label="Fermer le lecteur"
            >
              <X size={14} />
            </button>
          </div>
          <iframe
            key={page}
            src={`/assets/books/${file}#page=${page}`}
            className="h-[70vh] w-full bg-white"
            title={title}
          />
          <p className="border-t border-white/10 bg-night-700/60 px-3 py-2 text-[11px] text-sand-400">
            Fichier attendu : <code className="text-gold-400">public/assets/books/{file}</code>
          </p>
        </div>
      )}
    </div>
  );
}
