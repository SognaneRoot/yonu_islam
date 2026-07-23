"use client";

import { BookOpen } from "lucide-react";

export function PdfReader({ bookId, page }: { bookId: string; page: number }) {
  function openReader() {
    // Ouvert via window.open() (et non un simple <a target="_blank">) afin que
    // le bouton "Fermer" du lecteur puisse fermer cet onglet avec window.close().
    window.open(`/lecture?book=${bookId}`, "_blank");
  }

  return (
    <button
      onClick={openReader}
      className="flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:underline"
    >
      <BookOpen size={13} />
      {page > 1 ? `Reprendre — page ${page}` : "Lire"}
    </button>
  );
}
