"use client";

import dynamic from "next/dynamic";
import { BookOpen } from "lucide-react";
import { useState } from "react";

const PdfModal = dynamic(() => import("./pdf-modal").then((m) => m.PdfModal), { ssr: false });

export function PdfReader({
  file, title, page, totalPages, onPageChange,
}: {
  file: string; title: string; page: number; totalPages?: number;
  onPageChange: (page: number) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-gold-400 hover:underline"
      >
        <BookOpen size={13} />
        {page > 1 ? `Reprendre — page ${page}` : "Lire"}
      </button>

      {open && (
        <PdfModal
          file={`/assets/books/${file}`}
          title={title}
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}